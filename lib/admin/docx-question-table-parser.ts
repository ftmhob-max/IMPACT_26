import mammoth from "mammoth";
import { parse as parseHtml } from "node-html-parser";
import { normalizeColumnName } from "./csv";
import { csvQuestionRowSchema } from "@/lib/validations/admin";
import type { CsvPreviewResult } from "./csv";
import { normalizeQuestionTextForDedup, loadExistingQuestionMap } from "./question-dedup";
import { parseDocxHtml as parseWorkbookDocxHtml } from "./docx-question-parser";
import { docxParseResultToCsvPreview } from "./docx-question-adapter";

const REQUIRED_HEADERS = new Set(["question_text", "difficulty", "domain", "choices", "correct_answers"]);

function hasLegacyQuestionHeaders(headers: string[]) {
  return [...REQUIRED_HEADERS].every((header) => headers.includes(header));
}

function normalizeCorrectAnswers(values: string[]) {
  return values.map((value) => (/^[a-h]$/i.test(value) ? value.toUpperCase() : value));
}

export async function parseDocxQuestions(buffer: Buffer): Promise<CsvPreviewResult> {
  const { value: html } = await mammoth.convertToHtml({ buffer });
  const root = parseHtml(html);

  const table = root.querySelector("table");
  if (!table) {
    return {
      validRows: [],
      errors: [{ row: 0, field: "file", message: "No table found in document. Make sure the Word document contains a formatted table." }],
      duplicates: [],
      errorRows: [],
    };
  }

  const rows = table.querySelectorAll("tr");
  if (rows.length < 2) {
    return {
      validRows: [],
      errors: [{ row: 0, field: "file", message: "Table must have a header row and at least one data row." }],
      duplicates: [],
      errorRows: [],
    };
  }

  // Extract and normalize headers
  const headerCells = rows[0].querySelectorAll("th, td");
  const headers = headerCells.map((cell) => normalizeColumnName(cell.text.trim()));
  if (!hasLegacyQuestionHeaders(headers)) {
    return docxParseResultToCsvPreview(parseWorkbookDocxHtml(html));
  }

  const errors: CsvPreviewResult["errors"] = [];
  const duplicates: CsvPreviewResult["duplicates"] = [];
  const validRows: CsvPreviewResult["validRows"] = [];
  const errorRows: CsvPreviewResult["errorRows"] = [];

  const questionMap = await loadExistingQuestionMap().catch(() => new Map<string, string>());
  const seenInFile = new Set<string>();

  for (let rowIdx = 1; rowIdx < rows.length; rowIdx++) {
    const cells = rows[rowIdx].querySelectorAll("td");
    if (cells.every((cell) => !cell.text.trim())) continue;

    const record: Record<string, unknown> = {};
    headers.forEach((header, colIdx) => {
      const value = cells[colIdx]?.text.trim() ?? "";
      if (header === "choices" || header === "topic_tags") {
        record[header] = value ? value.split("|").map((s) => s.trim()).filter(Boolean) : [];
      } else if (header === "correct_answers") {
        record[header] = normalizeCorrectAnswers(value ? value.split("|").map((s) => s.trim()).filter(Boolean) : []);
      } else {
        record[header] = value || undefined;
      }
    });
    if (record.question_type === "short_answer" && Array.isArray(record.choices) && record.choices.length === 0) {
      record.choices = Array.isArray(record.correct_answers) ? record.correct_answers : [];
    }

    const parsed = csvQuestionRowSchema.safeParse(record);
    if (!parsed.success) {
      const fieldErrors: string[] = [];
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".") || "row";
        errors.push({ row: rowIdx + 1, field, message: issue.message });
        fieldErrors.push(`${field}: ${issue.message}`);
      }
      errorRows.push({ row: rowIdx + 1, rawData: record, fieldErrors });
      continue;
    }

    const normalizedText = normalizeQuestionTextForDedup(parsed.data.question_text);

    // Bank duplicate — enrich with existing ID so UI can offer to add it
    if (questionMap.has(normalizedText)) {
      duplicates.push({
        row: rowIdx + 1,
        questionText: parsed.data.question_text,
        existingQuestionId: questionMap.get(normalizedText)!,
      });
      continue;
    }

    // Intra-file duplicate
    if (seenInFile.has(normalizedText)) {
      duplicates.push({ row: rowIdx + 1, questionText: parsed.data.question_text, existingQuestionId: "" });
      continue;
    }

    seenInFile.add(normalizedText);
    validRows.push(parsed.data);
  }

  return { validRows, errors, duplicates, errorRows };
}
