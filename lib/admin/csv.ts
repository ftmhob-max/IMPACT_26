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

export const CSV_TEMPLATE = `question_text,question_type,difficulty,domain,choices,correct_answers,explanation,rationale,source_ref,topic_tags,formula_ref,point_value
"Which USPAP standards govern mass appraisal development and reporting?",multiple_choice,proficient,law,"Standards 1 & 2|Standards 3 & 4|Standards 5 & 6|Ethics Rule only",C,"Standards 5 and 6 apply to mass appraisal.","Mass appraisal has specific USPAP development/reporting standards.","USPAP 2024-2025","USPAP|mass appraisal",,1
"A property's indicated value by the sales comparison approach is $250,000. The income approach indicates $240,000. The cost approach is not applicable. What is the most defensible reconciled value?",multiple_choice,expert,math,"$240,000|$245,000|$250,000|$255,000",B,"Weighted reconciliation favoring both approaches.","Both approaches are market-derived; averaging is reasonable when neither dominates.",,"reconciliation|sales comparison|income approach",,1`;

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
