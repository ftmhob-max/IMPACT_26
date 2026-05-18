import { adminDcQuery } from "@/lib/firebase/admin-dc";

interface ExistingQuestionRecord {
  id: string;
  questionText: string;
}

const PAGE_SIZE = 500;

function canonicalizePunctuation(text: string): string {
  return text
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\u00A0/g, " ");
}

export function normalizeQuestionTextForDedup(questionText: string): string {
  return canonicalizePunctuation(questionText)
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function createQuestionDedupSet(questionTexts: Iterable<string>): Set<string> {
  const seen = new Set<string>();
  for (const questionText of questionTexts) {
    const normalized = normalizeQuestionTextForDedup(questionText);
    if (normalized) seen.add(normalized);
  }
  return seen;
}

export function isDuplicateQuestionText(questionText: string, seen: Set<string>): boolean {
  return seen.has(normalizeQuestionTextForDedup(questionText));
}

export function rememberQuestionText(questionText: string, seen: Set<string>) {
  const normalized = normalizeQuestionTextForDedup(questionText);
  if (normalized) seen.add(normalized);
}

export async function loadExistingQuestionDedupSet(): Promise<Set<string>> {
  const countData = await adminDcQuery<{ questions: Array<{ id: string }> }>("AdminCountQuestions").catch(() => ({
    questions: [],
  }));
  const total = countData.questions?.length ?? 0;

  if (total === 0) return new Set<string>();

  const questionTexts: string[] = [];
  for (let offset = 0; offset < total; offset += PAGE_SIZE) {
    const page = await adminDcQuery<{ questions: ExistingQuestionRecord[] }>("AdminListQuestionsPage", {
      limit: PAGE_SIZE,
      offset,
    }).catch(() => ({ questions: [] }));
    for (const question of page.questions ?? []) {
      questionTexts.push(question.questionText);
    }
  }

  return createQuestionDedupSet(questionTexts);
}

export async function loadExistingQuestionMap(): Promise<Map<string, string>> {
  const countData = await adminDcQuery<{ questions: Array<{ id: string }> }>("AdminCountQuestions").catch(() => ({
    questions: [],
  }));
  const total = countData.questions?.length ?? 0;

  const map = new Map<string, string>();
  if (total === 0) return map;

  for (let offset = 0; offset < total; offset += PAGE_SIZE) {
    const page = await adminDcQuery<{ questions: ExistingQuestionRecord[] }>("AdminListQuestionsPage", {
      limit: PAGE_SIZE,
      offset,
    }).catch(() => ({ questions: [] }));
    for (const question of page.questions ?? []) {
      const normalized = normalizeQuestionTextForDedup(question.questionText);
      if (normalized) map.set(normalized, question.id);
    }
  }

  return map;
}
