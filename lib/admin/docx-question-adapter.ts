import { csvQuestionRowSchema, type CsvQuestionRow } from "@/lib/validations/admin";
import type { CsvPreviewResult } from "./csv";
import {
  loadExistingQuestionMap,
  normalizeQuestionTextForDedup,
} from "./question-dedup";
import type { DocxParseResult, ParsedQuestion } from "./docx-question-parser";

function mapSectionToDomain(sectionTitle: string): CsvQuestionRow["domain"] {
  const normalized = sectionTitle.toLowerCase();
  if (normalized.includes("legal") || normalized.includes("law")) return "law";
  if (normalized.includes("ethics") || normalized.includes("data")) return "ethics";
  return "math";
}

function getCorrectAnswers(question: ParsedQuestion): string[] {
  return question.choices
    .filter((choice) => choice.isCorrect)
    .map((choice) => choice.letter);
}

export function parsedQuestionToCsvRow(question: ParsedQuestion): Record<string, unknown> {
  const sectionTitle = question.domain || "General";
  return {
    question_text: question.questionText,
    question_type: question.choices.filter((choice) => choice.isCorrect).length > 1 ? "multiselect" : "multiple_choice",
    difficulty: question.difficulty,
    domain: mapSectionToDomain(sectionTitle),
    choices: question.choices.map((choice) => choice.choiceText),
    correct_answers: getCorrectAnswers(question),
    explanation: null,
    rationale: question.rationale || null,
    calculation: question.calculation || null,
    source_ref: sectionTitle,
    topic_tags: [sectionTitle, question.topicTags].filter(Boolean),
    formula_ref: question.formulaRef || null,
    point_value: 1,
  };
}

export async function docxParseResultToCsvPreview(result: DocxParseResult): Promise<CsvPreviewResult> {
  const errors: CsvPreviewResult["errors"] = [];
  const duplicates: CsvPreviewResult["duplicates"] = [];
  const validRows: CsvPreviewResult["validRows"] = [];
  const errorRows: CsvPreviewResult["errorRows"] = [];
  const questionMap = await loadExistingQuestionMap().catch(() => new Map<string, string>());
  const seenInFile = new Set<string>();

  for (let index = 0; index < result.allQuestions.length; index += 1) {
    const rawData = parsedQuestionToCsvRow(result.allQuestions[index]);
    const parsed = csvQuestionRowSchema.safeParse(rawData);
    const row = index + 1;

    if (!parsed.success) {
      const fieldErrors: string[] = [];
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".") || "row";
        errors.push({ row, field, message: issue.message });
        fieldErrors.push(`${field}: ${issue.message}`);
      }
      errorRows.push({ row, rawData, fieldErrors });
      continue;
    }

    const normalizedText = normalizeQuestionTextForDedup(parsed.data.question_text);
    const existingQuestionId = questionMap.get(normalizedText);
    if (existingQuestionId) {
      duplicates.push({ row, questionText: parsed.data.question_text, existingQuestionId });
      continue;
    }
    if (seenInFile.has(normalizedText)) {
      duplicates.push({ row, questionText: parsed.data.question_text, existingQuestionId: "" });
      continue;
    }

    seenInFile.add(normalizedText);
    validRows.push(parsed.data);
  }

  return { validRows, errors, duplicates, errorRows };
}
