export type QuestionBankSort =
  | "best-match"
  | "newest"
  | "domain"
  | "difficulty"
  | "most-used"
  | "least-used"
  | "unused-first";

export interface QuestionBankFilters {
  search: string;
  domains: string[];
  difficulty: string;
  status: string;
  questionType: string;
  usageCurrentQuiz: boolean;
  usageCurrentModule: boolean;
  usageOtherQuizzes: boolean;
  onlyModuleRelevant: boolean;
  onlyMultiselect: boolean;
  sort: QuestionBankSort;
}

export interface QuestionUsageSummary {
  inCurrentQuiz: boolean;
  usedInCurrentModule: boolean;
  usedInOtherQuizzes: boolean;
  usageCount: number;
  quizTitles: string[];
  moduleTitles: string[];
}

export interface QuestionBankCandidate extends QuestionUsageSummary {
  id: string;
  questionText: string;
  domain: string;
  difficulty: string;
  formulaRef?: string | null;
  topicTags?: string | null;
  status: string;
  createdAt: string;
  questionType?: string | null;
  isMultiselect: boolean;
  matchesModuleDomain: boolean;
  matchesModuleTags: boolean;
}

export interface QuestionBankContext {
  quizId: string;
  lessonId: string | null;
  moduleId: string | null;
  moduleTitle: string | null;
  moduleDomains: string[];
  moduleTags: string[];
  siblingQuizIds: string[];
}

export function parseTopicTags(topicTags?: string | null): string[] {
  if (!topicTags) return [];
  try {
    const parsed = JSON.parse(topicTags);
    if (Array.isArray(parsed)) {
      return parsed
        .map((tag) => String(tag).trim())
        .filter(Boolean);
    }
  } catch {
    return topicTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

function includesQuery(candidate: QuestionBankCandidate, query: string) {
  if (!query) return true;
  const haystack = [
    candidate.questionText,
    candidate.formulaRef ?? "",
    parseTopicTags(candidate.topicTags).join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function compareText(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

function bestMatchScore(candidate: QuestionBankCandidate) {
  let score = 0;
  if (candidate.matchesModuleDomain) score += 5;
  if (candidate.matchesModuleTags) score += 3;
  if (!candidate.usedInCurrentModule && !candidate.usedInOtherQuizzes) score += 2;
  if (!candidate.inCurrentQuiz) score += 1;
  score -= candidate.usageCount * 0.25;
  return score;
}

function compareBySort(a: QuestionBankCandidate, b: QuestionBankCandidate, sort: QuestionBankSort) {
  switch (sort) {
    case "domain":
      return compareText(a.domain, b.domain) || compareText(a.questionText, b.questionText);
    case "difficulty":
      return compareText(a.difficulty, b.difficulty) || compareText(a.questionText, b.questionText);
    case "most-used":
      return b.usageCount - a.usageCount || compareText(a.questionText, b.questionText);
    case "least-used":
      return a.usageCount - b.usageCount || compareText(a.questionText, b.questionText);
    case "unused-first":
      return Number(a.usageCount > 0) - Number(b.usageCount > 0) || a.usageCount - b.usageCount || compareText(a.questionText, b.questionText);
    case "newest":
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() || compareText(a.questionText, b.questionText);
    case "best-match":
    default:
      return bestMatchScore(b) - bestMatchScore(a) || compareText(a.questionText, b.questionText);
  }
}

export function filterAndSortQuestionBankCandidates(
  candidates: QuestionBankCandidate[],
  filters: QuestionBankFilters
): QuestionBankCandidate[] {
  const filtered = candidates.filter((candidate) => {
    if (!includesQuery(candidate, filters.search)) return false;
    if (filters.domains.length > 0 && !filters.domains.includes(candidate.domain)) return false;
    if (filters.difficulty && candidate.difficulty !== filters.difficulty) return false;
    if (filters.status && candidate.status !== filters.status) return false;
    if (filters.questionType && (candidate.questionType ?? "") !== filters.questionType) return false;
    if (!filters.usageCurrentQuiz && candidate.inCurrentQuiz) return false;
    if (!filters.usageCurrentModule && candidate.usedInCurrentModule) return false;
    if (!filters.usageOtherQuizzes && candidate.usedInOtherQuizzes) return false;
    if (filters.onlyModuleRelevant && !candidate.matchesModuleDomain && !candidate.matchesModuleTags) return false;
    if (filters.onlyMultiselect && !candidate.isMultiselect) return false;
    return true;
  });

  return [...filtered].sort((a, b) => compareBySort(a, b, filters.sort));
}

