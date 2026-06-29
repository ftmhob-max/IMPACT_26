import { normalizeColumnName } from "./csv";
import type { CsvPreviewResult } from "./csv";
import { loadExistingQuestionMap } from "./question-dedup";
import { parseDocxHtml as parseWorkbookDocxHtml, type DocxParseResult, type ParsedQuestion } from "./docx-question-parser";
import { parseHtmlTableRows } from "./docx-table";
import { previewQuestionRows } from "./preview-question-rows";
import mammoth from "mammoth";

function mapSectionToDomain(sectionTitle: string): import("@/lib/validations/admin").CsvQuestionRow["domain"] {
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

function parsedQuestionToCsvRow(question: ParsedQuestion): Record<string, unknown> {
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
  const questionMap = await loadExistingQuestionMap().catch(() => new Map<string, string>());
  const rows = result.allQuestions.map((question, index) => ({
    rowNumber: index + 1,
    rawData: parsedQuestionToCsvRow(question),
  }));
  return previewQuestionRows(rows, questionMap);
}

const REQUIRED_HEADERS = new Set(["question_text", "difficulty", "domain", "choices", "correct_answers"]);

function hasLegacyQuestionHeaders(headers: string[]) {
  return [...REQUIRED_HEADERS].every((header) => headers.includes(header));
}

function normalizeCorrectAnswers(values: string[]) {
  return values.map((value) => (/^[a-h]$/i.test(value) ? value.toUpperCase() : value));
}

function normalizeQuestionTableRecord(record: Record<string, unknown>) {
  const normalized = { ...record };
  if (Array.isArray(normalized.choices) || typeof normalized.choices === "string") {
    normalized.choices = Array.isArray(normalized.choices)
      ? normalized.choices
      : String(normalized.choices)
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean);
  }
  if (Array.isArray(normalized.topic_tags) || typeof normalized.topic_tags === "string") {
    normalized.topic_tags = Array.isArray(normalized.topic_tags)
      ? normalized.topic_tags
      : String(normalized.topic_tags)
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean);
  }
  if (Array.isArray(normalized.correct_answers) || typeof normalized.correct_answers === "string") {
    const values = Array.isArray(normalized.correct_answers)
      ? normalized.correct_answers.map(String)
      : String(normalized.correct_answers)
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean);
    normalized.correct_answers = normalizeCorrectAnswers(values);
  }
  if (normalized.question_type === "short_answer" && Array.isArray(normalized.choices) && normalized.choices.length === 0) {
    normalized.choices = Array.isArray(normalized.correct_answers) ? normalized.correct_answers : [];
  }
  return normalized;
}

export async function parseDocxQuestions(buffer: Buffer): Promise<CsvPreviewResult> {
  const { value: html } = await mammoth.convertToHtml({ buffer });
  const table = parseHtmlTableRows(html);
  if (table.errors.length > 0) {
    return { validRows: [], errors: table.errors, duplicates: [], errorRows: [] };
  }

  if (!hasLegacyQuestionHeaders(table.headers)) {
    return docxParseResultToCsvPreview(parseWorkbookDocxHtml(html));
  }

  const questionMap = await loadExistingQuestionMap().catch(() => new Map<string, string>());
  const rows = table.rows.map((record, index) => ({
    rowNumber: index + 2,
    rawData: normalizeQuestionTableRecord(record),
  }));
  return previewQuestionRows(rows, questionMap);
}

export { parseHtmlTableRows };
