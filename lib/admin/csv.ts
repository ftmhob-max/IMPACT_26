import { parse } from "csv-parse/sync";
import { csvQuestionRowSchema, type CsvQuestionRow } from "@/lib/validations/admin";

export interface CsvPreviewResult {
  validRows: CsvQuestionRow[];
  errors: Array<{ row: number; field: string; message: string }>;
  duplicates: Array<{ row: number; questionText: string }>;
}

const REQUIRED_COLUMNS = [
  "question_text",
  "question_type",
  "difficulty",
  "domain",
  "choices",
  "correct_answers",
];

// Maps common alternate column names → canonical names
const COLUMN_ALIASES: Record<string, string> = {
  question: "question_text",
  "question text": "question_text",
  "q text": "question_text",
  text: "question_text",
  type: "question_type",
  "q type": "question_type",
  "question type": "question_type",
  diff: "difficulty",
  level: "difficulty",
  category: "domain",
  subject: "domain",
  answers: "choices",
  options: "choices",
  answer: "correct_answers",
  "correct answer": "correct_answers",
  "answer key": "correct_answers",
  rationale: "rationale",
  explanation: "explanation",
  source: "source_ref",
  reference: "source_ref",
  tags: "topic_tags",
  topics: "topic_tags",
  formula: "formula_ref",
  points: "point_value",
  value: "point_value",
};

export function normalizeColumnName(col: string): string {
  const lower = col.toLowerCase().trim();
  return COLUMN_ALIASES[lower] ?? lower.replace(/\s+/g, "_");
}

export const CSV_TEMPLATE = `question_text,question_type,difficulty,domain,choices,correct_answers,explanation,rationale,calculation,source_ref,topic_tags,formula_ref,point_value
"What does the Common Level Ratio (CLR) represent in a Pennsylvania assessment appeal?",multiple_choice,easy,law,"The ratio of assessed value to market value for the taxing district|The percentage of a property's improvements that are taxable|The ratio of land value to building value|The annual county millage rate",A,"The CLR is used to convert assessed values into implied market values during appeal analysis.","Pennsylvania assessment appeals use the Common Level Ratio published for the jurisdiction to test uniformity and implied market value.",,"STEB Common Level Ratio guidance","CLR|assessment appeals|uniformity","CLR",1
"A property is assessed at $180,000 and the CLR is 0.853. What is the implied market value?",multiple_choice,proficient,math,"$153,540|$180,000|$211,019|$256,800",C,"Divide assessed value by the CLR to recover implied market value.","Use the published common level ratio as a decimal in the formula.","180000 / 0.853 = 211019","Assessment calculations review","CLR|market value|calculation","CLR",1
"Which action best reflects ethical handling of seller-paid concessions before running a ratio study?",multiple_choice,expert,ethics,"Ignore concessions because the deed price is final|Add concessions to the assessed value|Remove concessions to estimate the cash-equivalent sale price|Use concessions only when the buyer requests it",C,"Concessions can distort the recorded price and should be adjusted to reflect a cash-equivalent sale amount.","Ratio studies should compare assessments against market-indicative sale prices rather than inflated recorded prices caused by concessions.",,"IAAO ratio study guidance","ethics|data quality|ratio studies","CONCESSION",1`;

export function parseDelimitedList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  const raw = String(value ?? "").trim();
  if (!raw) return [];
  if (raw.startsWith("[") && raw.endsWith("]")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String).map((item) => item.trim()).filter(Boolean);
    } catch {
      // Fall through to pipe/comma parsing.
    }
  }
  const delimiter = raw.includes("|") ? "|" : ",";
  return raw.split(delimiter).map((item) => item.trim()).filter(Boolean);
}

export function previewAssessmentCsv(csvText: string): CsvPreviewResult {
  const rawRecords = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as Array<Record<string, unknown>>;

  // Normalize column names using alias map so alternate headers work
  const records = rawRecords.map((record) => {
    const normalized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(record)) {
      normalized[normalizeColumnName(key)] = value;
    }
    return normalized;
  });

  const errors: CsvPreviewResult["errors"] = [];
  const validRows: CsvQuestionRow[] = [];
  const seen = new Map<string, number>();
  const duplicates: CsvPreviewResult["duplicates"] = [];

  const columns = records[0] ? Object.keys(records[0]) : [];
  for (const column of REQUIRED_COLUMNS) {
    if (!columns.includes(column)) {
      errors.push({ row: 1, field: column, message: "Missing required column" });
    }
  }

  records.forEach((record, index) => {
    const normalized = {
      ...record,
      question_type: record.question_type || "multiple_choice",
      choices: parseDelimitedList(record.choices),
      correct_answers: parseDelimitedList(record.correct_answers).map((value) => value.toUpperCase()),
      topic_tags: parseDelimitedList(record.topic_tags),
      point_value: record.point_value || 1,
    };
    const parsed = csvQuestionRowSchema.safeParse(normalized);
    const rowNumber = index + 2;

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push({
          row: rowNumber,
          field: issue.path.join(".") || "row",
          message: issue.message,
        });
      }
      return;
    }

    const duplicateKey = parsed.data.question_text.toLowerCase();
    if (seen.has(duplicateKey)) {
      duplicates.push({ row: rowNumber, questionText: parsed.data.question_text });
    } else {
      seen.set(duplicateKey, rowNumber);
    }
    validRows.push(parsed.data);
  });

  return { validRows, errors, duplicates };
}

export function rowsToCsv(rows: Array<Record<string, unknown>>) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escapeCell = (value: unknown) => {
    const raw = value == null ? "" : String(value);
    return /[",\n]/.test(raw) ? `"${raw.replace(/"/g, '""')}"` : raw;
  };
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(",")),
  ].join("\n");
}
