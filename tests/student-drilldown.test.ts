import test from "node:test";
import assert from "node:assert/strict";

import {
  summarizeLearnerProgress,
  normalizeAdminAttemptReview,
} from "@/lib/admin/student-drilldown";

const referenceDate = new Date("2026-01-10T12:00:00.000Z");

test("summarizeLearnerProgress computes averages, domains, and completion", () => {
  const profile = summarizeLearnerProgress(
    {
      users: [{ id: "u1", email: "u1@x.com", fullName: "U One", role: "learner", createdAt: null }],
      quizAttempts: [
        {
          id: "a1",
          quiz: { title: "Quiz A" },
          scorePct: 80,
          passed: true,
          completedAt: "2026-01-08T00:00:00.000Z",
          quizResponses_on_attempt: [
            { isCorrect: true, question: { domain: "math" } },
            { isCorrect: false, question: { domain: "math" } },
            { isCorrect: true, question: { domain: "reading" } },
          ],
        },
        {
          id: "a2",
          quiz: { title: "Quiz B" },
          scorePct: 40,
          passed: false,
          completedAt: "2026-01-09T00:00:00.000Z",
          quizResponses_on_attempt: [{ isCorrect: false, question: { domain: "reading" } }],
        },
      ],
      userCourseProgresses: [
        { course: { id: "c1", title: "Course 1" }, completedAt: "2026-01-05T00:00:00.000Z" },
        { course: { id: "c2", title: "Course 2" }, completedAt: null },
      ],
      userLessonProgresses: [
        { status: "completed" },
        { status: "completed" },
        { status: "in_progress" },
      ],
      dailyActivities: [
        { activityDate: "2026-01-10", lastActivityAt: "2026-01-10T09:00:00.000Z" },
      ],
    },
    referenceDate,
  );

  assert.equal(profile.user?.id, "u1");
  assert.equal(profile.attemptCount, 2);
  assert.equal(profile.averageScorePct, 60);
  assert.equal(profile.passRatePct, 50);
  assert.equal(profile.coursesEnrolled, 2);
  assert.equal(profile.coursesCompleted, 1);
  assert.equal(profile.lessonsCompleted, 2);
  assert.equal(profile.currentStreakDays, 1);

  const math = profile.domains.find((d) => d.domain === "math");
  const reading = profile.domains.find((d) => d.domain === "reading");
  assert.equal(math?.correct, 1);
  assert.equal(math?.total, 2);
  assert.equal(math?.accuracyPct, 50);
  assert.equal(reading?.total, 2);
  assert.equal(reading?.accuracyPct, 50);
});

test("summarizeLearnerProgress handles empty payloads", () => {
  const profile = summarizeLearnerProgress({}, referenceDate);
  assert.equal(profile.user, null);
  assert.equal(profile.attemptCount, 0);
  assert.equal(profile.averageScorePct, null);
  assert.equal(profile.passRatePct, null);
  assert.deepEqual(profile.domains, []);
});

test("normalizeAdminAttemptReview maps questions and sorts choices", () => {
  const review = normalizeAdminAttemptReview({
    quizAttempt: {
      id: "a1",
      user: { id: "u1" },
      quiz: { title: "Quiz A" },
      status: "completed",
      scorePct: 80,
      scoreRaw: 4,
      scoreMax: 5,
      passed: true,
      startedAt: null,
      completedAt: "2026-01-08T00:00:00.000Z",
    },
    quizResponses: [
      {
        question: {
          id: "q1",
          questionText: "2+2?",
          domain: "math",
          difficulty: "easy",
          rationale: "basic",
          answerChoices_on_question: [
            { letter: "B", choiceText: "4", isCorrect: true, position: 2 },
            { letter: "A", choiceText: "3", isCorrect: false, position: 1 },
          ],
        },
        selectedLetters: ["B"],
        isCorrect: true,
        pointsEarned: 1,
        pointsPossible: 1,
      },
    ],
  });

  assert.ok(review);
  assert.equal(review?.attemptId, "a1");
  assert.equal(review?.userId, "u1");
  assert.equal(review?.questions.length, 1);
  const question = review?.questions[0];
  assert.equal(question?.choices[0]?.letter, "A");
  assert.equal(question?.choices[1]?.letter, "B");
  assert.deepEqual(question?.selectedLetters, ["B"]);
});

test("normalizeAdminAttemptReview parses stringified selectedLetters", () => {
  const review = normalizeAdminAttemptReview({
    quizAttempt: { id: "a1", user: { id: "u1" } },
    quizResponses: [
      {
        question: { id: "q1", answerChoices_on_question: [] },
        selectedLetters: '["A","C"]',
      },
    ],
  });
  assert.deepEqual(review?.questions[0]?.selectedLetters, ["A", "C"]);
});

test("normalizeAdminAttemptReview returns null without an attempt", () => {
  assert.equal(normalizeAdminAttemptReview({ quizAttempt: null }), null);
});
