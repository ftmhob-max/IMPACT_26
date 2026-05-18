import mammoth from "mammoth";
import { parse as parseHtml } from "node-html-parser";
import { normalizeColumnName } from "./csv";
import { csvQuestionRowSchema } from "@/lib/validations/admin";
import type { CsvPreviewResult } from "./csv";
import { isDuplicateQuestionText, loadExistingQuestionDedupSet } from "./question-dedup";

export async function parseDocxQuestions(buffer: Buffer): Promise<CsvPreviewResult> {
  const { value: html } = await mammoth.convertToHtml({ buffer });
  const root = parseHtml(html);

  const table = root.querySelector("table");
  if (!table) {
    return {
      validRows: [],
      errors: [{ row: 0, field: "file", message: "No table found in document. Make sure the Word document contains a formatted table." }],
      duplicates: [],
    };
  }

  const rows = table.querySelectorAll("tr");
  if (rows.length < 2) {
    return {
      validRows: [],
      errors: [{ row: 0, field: "file", message: "Table must have a header row and at least one data row." }],
      duplicates: [],
    };
  }

  // Extract and normalize headers
  const headerCells = rows[0].querySelectorAll("th, td");
  const headers = headerCells.map((cell) => normalizeColumnName(cell.text.trim()));

  const errors: CsvPreviewResult["errors"] = [];
  const duplicates: CsvPreviewResult["duplicates"] = [];
  const validRows: CsvPreviewResult["validRows"] = [];

  const seenQuestions = await loadExistingQuestionDedupSet().catch(() => new Set<string>());

  for (let rowIdx = 1; rowIdx < rows.length; rowIdx++) {
    const cells = rows[rowIdx].querySelectorAll("td");
    if (cells.every((cell) => !cell.text.trim())) continue;

    const record: Record<string, unknown> = {};
    headers.forEach((header, colIdx) => {
      const value = cells[colIdx]?.text.trim() ?? "";
      // Split pipe-delimited fields for choices and correct_answers
      if (header === "choices" || header === "correct_answers" || header === "topic_tags") {
        record[header] = value ? value.split("|").map((s) => s.trim()).filter(Boolean) : [];
      } else {
        record[header] = value || undefined;
      }
    });

    const parsed = csvQuestionRowSchema.safeParse(record);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push({
          row: rowIdx + 1,
          field: issue.path.join(".") || "row",
          message: issue.message,
        });
      }
      continue;
    }

    if (isDuplicateQuestionText(parsed.data.question_text, seenQuestions)) {
      duplicates.push({ row: rowIdx + 1, questionText: parsed.data.question_text });
      continue;
    }

    validRows.push(parsed.data);
  }

  return { validRows, errors, duplicates };
}
