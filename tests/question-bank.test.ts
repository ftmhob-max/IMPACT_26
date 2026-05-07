import test from "node:test";
import assert from "node:assert/strict";

import {
  filterAndSortQuestionBankCandidates,
  parseTopicTags,
  type QuestionBankCandidate,
  type QuestionBankFilters,
} from "@/lib/admin/question-bank";

const baseFilters: QuestionBankFilters = {
  search: "",
  domains: [],
  difficulty: "",
  status: "",
  questionType: "",
  usageCurrentQuiz: true,
  usageCurrentModule: true,
  usageOtherQuizzes: true,
  onlyModuleRelevant: false,
  onlyMultiselect: false,
  sort: "best-match",
};

const candidates: QuestionBankCandidate[] = [
  {
    id: "1",
    questionText: "Capitalization rate question",
    domain: "appraisal",
    difficulty: "easy",
    formulaRef: "CAP-01",
    topicTags: JSON.stringify(["income", "cap-rate"]),
    status: "published",
    createdAt: "2026-01-01T00:00:00.000Z",
    questionType: "multiple_choice",
    isMultiselect: false,
    inCurrentQuiz: false,
    usedInCurrentModule: false,
    usedInOtherQuizzes: false,
    usageCount: 0,
    quizTitles: [],
    moduleTitles: [],
    matchesModuleDomain: true,
    matchesModuleTags: true,
  },
  {
    id: "2",
    questionText: "Philadelphia exemption scenario",
    domain: "philly",
    difficulty: "expert",
    formulaRef: null,
    topicTags: JSON.stringify(["abatement"]),
    status: "draft",
    createdAt: "2026-04-01T00:00:00.000Z",
    questionType: "scenario",
    isMultiselect: true,
    inCurrentQuiz: false,
    usedInCurrentModule: true,
    usedInOtherQuizzes: false,
    usageCount: 1,
    quizTitles: ["Module quiz"],
    moduleTitles: ["Exemptions"],
    matchesModuleDomain: false,
    matchesModuleTags: false,
  },
  {
    id: "3",
    questionText: "Ethics disclosure question",
    domain: "ethics",
    difficulty: "proficient",
    formulaRef: null,
    topicTags: JSON.stringify(["disclosure"]),
    status: "published",
    createdAt: "2026-05-01T00:00:00.000Z",
    questionType: "multiple_choice",
    isMultiselect: false,
    inCurrentQuiz: true,
    usedInCurrentModule: false,
    usedInOtherQuizzes: true,
    usageCount: 3,
    quizTitles: ["Quiz A", "Quiz B"],
    moduleTitles: ["Ethics"],
    matchesModuleDomain: false,
    matchesModuleTags: false,
  },
];

test("parseTopicTags supports JSON and csv fallbacks", () => {
  assert.deepEqual(parseTopicTags(JSON.stringify(["alpha", "beta"])), ["alpha", "beta"]);
  assert.deepEqual(parseTopicTags("alpha, beta"), ["alpha", "beta"]);
});

test("best-match sorting prioritizes module relevance and lower reuse", () => {
  const result = filterAndSortQuestionBankCandidates(candidates, baseFilters);
  assert.equal(result[0]?.id, "1");
});

test("filters can hide current module and current quiz usage", () => {
  const result = filterAndSortQuestionBankCandidates(candidates, {
    ...baseFilters,
    usageCurrentModule: false,
    usageCurrentQuiz: false,
  });
  assert.deepEqual(result.map((candidate) => candidate.id), ["1"]);
});

test("search matches tags and formula refs", () => {
  const byTag = filterAndSortQuestionBankCandidates(candidates, {
    ...baseFilters,
    search: "abatement",
  });
  assert.deepEqual(byTag.map((candidate) => candidate.id), ["2"]);

  const byFormula = filterAndSortQuestionBankCandidates(candidates, {
    ...baseFilters,
    search: "cap-01",
  });
  assert.deepEqual(byFormula.map((candidate) => candidate.id), ["1"]);
});

test("unused-first sorting prefers zero-usage questions", () => {
  const result = filterAndSortQuestionBankCandidates(candidates, {
    ...baseFilters,
    sort: "unused-first",
  });
  assert.equal(result[0]?.id, "1");
  assert.equal(result.at(-1)?.id, "3");
});

