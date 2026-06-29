// Back-end: shared question-import preview validation and deduplication.
import { csvQuestionRowSchema, type CsvQuestionRow } from "@/lib/validations/admin";
import type { CsvPreviewResult } from "./csv";
import { normalizeQuestionTextForDedup } from "./question-dedup";

export interface QuestionPreviewRowInput {
  rowNumber: number;
  rawData: Record<string, unknown>;
}

export function previewQuestionRows(
  rows: QuestionPreviewRowInput[],
  existingQuestionMap?: Map<string, string>,
): CsvPreviewResult {
  const errors: CsvPreviewResult["errors"] = [];
  const validRows: CsvQuestionRow[] = [];
  const duplicates: CsvPreviewResult["duplicates"] = [];
  const errorRows: CsvPreviewResult["errorRows"] = [];
  const seenInFile = new Map<string, number>();

  for (const { rowNumber, rawData } of rows) {
    const parsed = csvQuestionRowSchema.safeParse(rawData);

    if (!parsed.success) {
      const fieldErrors: string[] = [];
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".") || "row";
        errors.push({ row: rowNumber, field, message: issue.message });
        fieldErrors.push(`${field}: ${issue.message}`);
      }
      errorRows.push({ row: rowNumber, rawData, fieldErrors });
      continue;
    }

    const duplicateKey = normalizeQuestionTextForDedup(parsed.data.question_text);

    if (existingQuestionMap?.has(duplicateKey)) {
      duplicates.push({
        row: rowNumber,
        questionText: parsed.data.question_text,
        existingQuestionId: existingQuestionMap.get(duplicateKey)!,
      });
      continue;
    }

    if (seenInFile.has(duplicateKey)) {
      duplicates.push({ row: rowNumber, questionText: parsed.data.question_text, existingQuestionId: "" });
      continue;
    }

    seenInFile.set(duplicateKey, rowNumber);
    validRows.push(parsed.data);
  }

  return { validRows, errors, duplicates, errorRows };
}
