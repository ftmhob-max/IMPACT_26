import test from "node:test";
import assert from "node:assert/strict";

import {
  buildQuizDashboardData,
  getQuizReadiness,
} from "@/lib/admin/quiz-dashboard";

test("getQuizReadiness distinguishes empty, attention, and ready quizzes", () => {
  assert.equal(getQuizReadiness(0, 0), "empty");
  assert.equal(getQuizReadiness(4, 1), "attention");
  assert.equal(getQuizReadiness(4, 0), "ready");
});

test("buildQuizDashboardData derives counts and totals from quiz/question usage", () => {
  const result = buildQuizDashboardData(
    [
      {
        id: "11111111-1111-1111-1111-111111111111",
        title: "Ready quiz",
        status: "published",
        passingScore: 70,
        timeLimitSeconds: 600,
        shuffleQuestions: true,
        shuffleChoices: false,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        title: "Needs work",
        status: "draft",
        passingScore: 80,
        timeLimitSeconds: null,
        shuffleQuestions: false,
        shuffleChoices: false,
        createdAt: "2026-01-02T00:00:00.000Z",
      },
      {
        id: "33333333-3333-3333-3333-333333333333",
        title: "Empty quiz",
        status: "review",
        passingScore: 75,
        timeLimitSeconds: null,
        shuffleQuestions: true,
        shuffleChoices: false,
        createdAt: "2026-01-03T00:00:00.000Z",
      },
    ],
    [
      {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        answerChoices_on_question: [{ isCorrect: true }, { isCorrect: false }],
      },
      {
        id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        answerChoices_on_question: [{ isCorrect: false }, { isCorrect: false }],
      },
    ],
    [
      {
        quiz: { id: "11111111-1111-1111-1111-111111111111" },
        question: { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" },
      },
      {
        quiz: { id: "22222222-2222-2222-2222-222222222222" },
        question: { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb" },
      },
    ]
  );

  assert.deepEqual(
    result.quizzes.map((quiz) => ({
      id: quiz.id,
      questionCount: quiz.questionCount,
      incompleteQuestionCount: quiz.incompleteQuestionCount,
      readiness: quiz.readiness,
    })),
    [
      {
        id: "11111111-1111-1111-1111-111111111111",
        questionCount: 1,
        incompleteQuestionCount: 0,
        readiness: "ready",
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        questionCount: 1,
        incompleteQuestionCount: 1,
        readiness: "attention",
      },
      {
        id: "33333333-3333-3333-3333-333333333333",
        questionCount: 0,
        incompleteQuestionCount: 0,
        readiness: "empty",
      },
    ]
  );

  assert.deepEqual(result.totals, {
    total: 3,
    draft: 1,
    review: 1,
    published: 1,
    ready: 1,
    attention: 1,
    empty: 1,
  });
});
