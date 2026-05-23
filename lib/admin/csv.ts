import { parse } from "csv-parse/sync";
import { csvQuestionRowSchema, type CsvQuestionRow } from "@/lib/validations/admin";
import { normalizeQuestionTextForDedup } from "./question-dedup";

export interface CsvPreviewResult {
  validRows: CsvQuestionRow[];
  errors: Array<{ row: number; field: string; message: string }>;
  duplicates: Array<{ row: number; questionText: string; existingQuestionId: string }>;
  errorRows: Array<{ row: number; rawData: Record<string, unknown>; fieldErrors: string[] }>;
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
"Which items should be documented before publishing a ratio study?",multiselect,proficient,ethics,"Data source|Excluded sales|Adjustment assumptions|Favorite map color","A|B|C","The first three support auditability; map color is presentation-only.","Multiselect rows use the same pipe-delimited choices as multiple choice but can list more than one correct letter.",,"IAAO ratio study guidance","ethics|data quality|ratio studies","RATIO",1
"A taxpayer appeals an assessment using one comparable sale, while the assessor has a ratio study and three adjusted comparables. Which response best explains the strongest evidence?",scenario,expert,appraisal,"The single sale always controls|The assessor should rely only on prior-year assessment|Converging evidence from multiple sources is stronger|The appeal must be denied without review",C,"Scenario questions are imported as choice-based questions with richer stems.","Use scenario for case-style prompts that still resolve to selectable answers.",,"Assessment appeal scenario","appeals|evidence|scenario","APPEAL",1
"In one sentence, define cash-equivalent sale price.",short_answer,easy,appraisal,,"A sale price adjusted to remove financing or concession terms that distort market value","Short-answer rows may leave choices blank; the correct answer is stored as the expected response.","Short-answer support is for bank metadata and review workflows; quiz delivery currently still uses answer records.",,"Assessment vocabulary","cash equivalent|sale validation","SALE_VALIDATION",1`;

function normalizeQuestionTypeForCsv(value: unknown): string {
  const normalized = String(value ?? "multiple_choice").trim().toLowerCase().replace(/[\s-]+/g, "_");
  const aliases: Record<string, string> = {
    mc: "multiple_choice",
    multiple: "multiple_choice",
    single: "multiple_choice",
    single_choice: "multiple_choice",
    single_select: "multiple_choice",
    true_false: "multiple_choice",
    multi: "multiselect",
    multi_select: "multiselect",
    multiple_select: "multiselect",
    select_all: "multiselect",
    short: "short_answer",
    free_response: "short_answer",
    open_response: "short_answer",
    case: "scenario",
    case_study: "scenario",
  };
  return aliases[normalized] ?? normalized;
}

function normalizeCorrectAnswers(values: string[]): string[] {
  return values.map((value) => (/^[a-h]$/i.test(value) ? value.toUpperCase() : value));
}

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

export function previewAssessmentCsv(csvText: string, existingQuestionMap?: Map<string, string>): CsvPreviewResult {
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
  const errorRows: CsvPreviewResult["errorRows"] = [];

  const columns = records[0] ? Object.keys(records[0]) : [];
  for (const column of REQUIRED_COLUMNS) {
    if (!columns.includes(column)) {
      errors.push({ row: 1, field: column, message: "Missing required column" });
    }
  }

  records.forEach((record, index) => {
    const normalized = {
      ...record,
      question_type: normalizeQuestionTypeForCsv(record.question_type),
      choices: parseDelimitedList(record.choices),
      correct_answers: normalizeCorrectAnswers(parseDelimitedList(record.correct_answers)),
      topic_tags: parseDelimitedList(record.topic_tags),
      point_value: record.point_value || 1,
    };
    if (normalized.question_type === "short_answer" && normalized.choices.length === 0) {
      normalized.choices = normalized.correct_answers;
    }
    const parsed = csvQuestionRowSchema.safeParse(normalized);
    const rowNumber = index + 2;

    if (!parsed.success) {
      const fieldErrors: string[] = [];
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".") || "row";
        errors.push({ row: rowNumber, field, message: issue.message });
        fieldErrors.push(`${field}: ${issue.message}`);
      }
      errorRows.push({ row: rowNumber, rawData: normalized, fieldErrors });
      return;
    }

    const duplicateKey = normalizeQuestionTextForDedup(parsed.data.question_text);

    // Check against the bank first (when map is provided)
    if (existingQuestionMap && existingQuestionMap.has(duplicateKey)) {
      duplicates.push({
        row: rowNumber,
        questionText: parsed.data.question_text,
        existingQuestionId: existingQuestionMap.get(duplicateKey)!,
      });
      return; // exclude from validRows — already in the bank
    }

    // Check intra-file duplicate
    if (seen.has(duplicateKey)) {
      duplicates.push({ row: rowNumber, questionText: parsed.data.question_text, existingQuestionId: "" });
    } else {
      seen.set(duplicateKey, rowNumber);
    }
    validRows.push(parsed.data);
  });

  return { validRows, errors, duplicates, errorRows };
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
