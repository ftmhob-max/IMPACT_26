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
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as Array<Record<string, unknown>>;

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
