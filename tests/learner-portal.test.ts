// Shared learner service tests: tests/learner-portal.test.ts

import assert from "node:assert/strict";
import test from "node:test";

import {
  deriveActivityStreaks,
  mergeUserActivityHistory,
  toUtcDateKey,
} from "@/lib/firebase/daily-activity";
import {
  deriveCertificateEligibility,
  isPublishedCertificateCourse,
} from "@/lib/firebase/certificates";
import { deriveStudyBadges } from "@/lib/firebase/study-rhythm";
import {
  deriveCatalogMetrics,
  deriveExamCatalog,
  deriveLearnerPortalMetrics,
  deriveLessonProgressUpdate,
  deriveQuizCompletion,
  deriveQuizAggregation,
  getAttemptReviewAccessStatus,
  getLearnerSourceMaterialAccessStatus,
  mapSafeLearnerSourceMaterial,
  normalizeAttemptReview,
  selectLessonProgressOperation,
  type AttemptReview,
  type LearnerSourceMaterialAccess,
  type LearnerCatalogCourseRecord,
  type PublishedQuiz,
} from "@/lib/firebase/learner-portal";

const CATALOG_COURSE: LearnerCatalogCourseRecord = {
  id: "11111111-1111-4111-8111-111111111111",
  slug: "assessment-foundations",
  title: "Assessment Foundations",
  description: "Core learner course",
  thumbnailUrl: null,
  publishedAt: "2026-07-01T00:00:00.000Z",
  modules_on_course: [
    {
      id: "22222222-2222-4222-8222-222222222222",
      title: "Foundations",
      position: 1,
      lessons_on_module: [
        {
          id: "33333333-3333-4333-8333-333333333333",
          title: "Introduction",
          position: 1,
          lessonType: "video",
          durationSeconds: 600,
        },
        {
          id: "44444444-4444-4444-8444-444444444444",
          title: "Knowledge check",
          position: 2,
          lessonType: "quiz",
          durationSeconds: null,
        },
      ],
    },
  ],
};

test("deriveCatalogMetrics computes completion percentage and duration", () => {
  const result = deriveCatalogMetrics(
    [CATALOG_COURSE],
    [
      {
        course: { id: CATALOG_COURSE.id },
        enrolledAt: "2026-07-01T00:00:00.000Z",
        lastAccessedAt: "2026-07-10T14:00:00.000Z",
        completedAt: null,
      },
    ],
    [
      {
        lesson: { id: "33333333-3333-4333-8333-333333333333" },
        status: "completed",
        videoPositionSeconds: 600,
        completedAt: "2026-07-10T14:00:00.000Z",
      },
    ],
  );

  assert.deepEqual(result[0]?.metrics, {
    totalLessons: 2,
    completedLessons: 1,
    progressPercent: 50,
    totalDurationSeconds: 600,
    enrolledAt: "2026-07-01T00:00:00.000Z",
    lastAccessedAt: "2026-07-10T14:00:00.000Z",
    completedAt: null,
  });
});

test("deriveLearnerPortalMetrics counts published content and learner completion", () => {
  const catalog = deriveCatalogMetrics(
    [CATALOG_COURSE],
    [],
    [
      {
        lesson: { id: "33333333-3333-4333-8333-333333333333" },
        status: "completed",
        videoPositionSeconds: null,
        completedAt: "2026-07-10T14:00:00.000Z",
      },
    ],
  );
  const publishedQuiz: PublishedQuiz = {
    id: "55555555-5555-4555-8555-555555555555",
    title: "Published knowledge check",
    description: null,
    timeLimitSeconds: null,
    passingScore: 70,
    shuffleQuestions: false,
    shuffleChoices: false,
    calculatorSettingsJson: null,
    publishedAt: "2026-07-10T00:00:00.000Z",
  };

  assert.deepEqual(deriveLearnerPortalMetrics(catalog, [publishedQuiz]), {
    publishedCourses: 1,
    publishedLessons: 2,
    publishedQuizzes: 1,
    completedLessons: 1,
    progressPercent: 50,
  });
  assert.deepEqual(deriveLearnerPortalMetrics([], []), {
    publishedCourses: 0,
    publishedLessons: 0,
    publishedQuizzes: 0,
    completedLessons: 0,
    progressPercent: 0,
  });
});

test("deriveActivityStreaks deduplicates dates and allows a yesterday-active streak", () => {
  const activityRecords = [
    { activityDate: "2026-07-07", lastActivityAt: "2026-07-07T13:00:00.000Z" },
    { activityDate: "2026-07-08", lastActivityAt: "2026-07-08T13:00:00.000Z" },
    { activityDate: "2026-07-09", lastActivityAt: "2026-07-09T13:00:00.000Z" },
    { activityDate: "2026-07-09", lastActivityAt: "2026-07-09T18:00:00.000Z" },
    { activityDate: "not-a-date", lastActivityAt: "2026-07-10T00:00:00.000Z" },
  ];

  assert.equal(toUtcDateKey(new Date("2026-07-10T23:59:59.000-04:00")), "2026-07-11");
  assert.deepEqual(
    deriveActivityStreaks(activityRecords, new Date("2026-07-10T12:00:00.000Z")),
    {
      currentStreakDays: 3,
      longestStreakDays: 3,
      totalActiveDays: 3,
      mostRecentActivityDate: "2026-07-09",
    },
  );
});

test("deriveQuizAggregation computes points, average score, and pass rate", () => {
  const aggregation = deriveQuizAggregation(
    [
      {
        position: 1,
        pointValue: 1,
        question: { id: "question-1", domain: "law", difficulty: "easy" },
      },
      {
        position: 2,
        pointValue: 2,
        question: { id: "question-2", domain: "math", difficulty: "proficient" },
      },
    ],
    [
      {
        id: "attempt-1",
        scoreRaw: 3,
        scoreMax: 3,
        scorePct: 100,
        passed: true,
        completedAt: "2026-07-10T10:00:00.000Z",
      },
      {
        id: "attempt-2",
        scoreRaw: 1.5,
        scoreMax: 3,
        scorePct: 50,
        passed: false,
        completedAt: "2026-07-10T11:00:00.000Z",
      },
    ],
  );

  assert.deepEqual(aggregation, {
    questionCount: 2,
    totalPoints: 3,
    attemptCount: 2,
    averageScorePct: 75,
    passRatePct: 50,
  });
});

test("deriveExamCatalog groups only supplied learner attempts by published quiz", () => {
  const quizzes: PublishedQuiz[] = [
    {
      id: "55555555-5555-4555-8555-555555555555",
      title: "Published knowledge check",
      description: null,
      timeLimitSeconds: 1200,
      passingScore: 70,
      shuffleQuestions: true,
      shuffleChoices: true,
      calculatorSettingsJson: null,
      publishedAt: "2026-07-10",
      quizQuestions_on_quiz: [
        {
          position: 1,
          pointValue: 1,
          question: { id: "question-1", domain: "law", difficulty: "easy" },
        },
        {
          position: 2,
          pointValue: 1,
          question: { id: "question-2", domain: "math", difficulty: "proficient" },
        },
        {
          position: 3,
          pointValue: 1,
          question: { id: "question-3", domain: "law", difficulty: "expert" },
        },
      ],
    },
  ];

  const catalog = deriveExamCatalog(quizzes, [
    {
      id: "attempt-older",
      quiz: { id: quizzes[0]!.id, title: quizzes[0]!.title },
      scoreRaw: null,
      scoreMax: null,
      scorePct: 92,
      passed: true,
      completedAt: "2026-07-09T12:00:00.000Z",
    },
    {
      id: "attempt-latest",
      quiz: { id: quizzes[0]!.id, title: quizzes[0]!.title },
      scoreRaw: null,
      scoreMax: null,
      scorePct: 75,
      passed: true,
      completedAt: "2026-07-10T12:00:00.000Z",
    },
    {
      id: "different-quiz-attempt",
      quiz: { id: "66666666-6666-4666-8666-666666666666", title: "Other quiz" },
      scoreRaw: null,
      scoreMax: null,
      scorePct: 100,
      passed: true,
      completedAt: "2026-07-11T12:00:00.000Z",
    },
  ]);

  assert.equal(catalog[0]?.questionCount, 3);
  assert.equal(catalog[0]?.domainCount, 2);
  assert.deepEqual(catalog[0]?.domains, ["law", "math"]);
  assert.equal(catalog[0]?.attemptCount, 2);
  assert.equal(catalog[0]?.bestScorePct, 92);
  assert.equal(catalog[0]?.latestAttempt?.id, "attempt-latest");
});

test("learner material mapping strips sensitive metadata and rejects private or stale records", () => {
  const baseMaterial: Parameters<typeof mapSafeLearnerSourceMaterial>[0] = {
    id: "77777777-7777-4777-8777-777777777777",
    title: "Assessment handbook",
    fileName: "assessment-handbook.pdf",
    fileType: "application/pdf",
    metadataJson: JSON.stringify({ sizeBytes: 4096, storagePath: "must-not-leak" }),
    status: "uploaded",
    reviewStatus: "reviewed",
    visibility: "learner",
    archivedAt: null,
    trashedAt: null,
    createdAt: "2026-07-01",
    updatedAt: "2026-07-10",
    folder: { id: "folder-1", name: "Handbooks", folderType: "custom" },
    sourceMaterialTagAssignments_on_sourceMaterial: [
      { tag: { id: "tag-1", name: "Policy", color: null } },
    ],
  };

  assert.deepEqual(mapSafeLearnerSourceMaterial(baseMaterial), {
    id: baseMaterial.id,
    title: baseMaterial.title,
    fileName: baseMaterial.fileName,
    fileType: baseMaterial.fileType,
    status: "uploaded",
    reviewStatus: "reviewed",
    sizeBytes: 4096,
    createdAt: baseMaterial.createdAt,
    updatedAt: baseMaterial.updatedAt,
    folder: baseMaterial.folder,
    sourceMaterialTagAssignments_on_sourceMaterial:
      baseMaterial.sourceMaterialTagAssignments_on_sourceMaterial,
  });
  assert.equal(mapSafeLearnerSourceMaterial({ ...baseMaterial, visibility: "unknown" }), null);
  assert.equal(mapSafeLearnerSourceMaterial({ ...baseMaterial, archivedAt: "2026-07-11" }), null);
  assert.equal(mapSafeLearnerSourceMaterial({ ...baseMaterial, status: "failed" }), null);
});

test("material asset access requires learner visibility or a published lesson attachment", () => {
  const baseAccess: LearnerSourceMaterialAccess = {
    id: "77777777-7777-4777-8777-777777777777",
    title: "Private lesson evidence",
    fileName: "evidence.pdf",
    fileType: "application/pdf",
    storagePath: "gs://bucket/evidence.pdf",
    downloadUrl: null,
    status: "parsed",
    visibility: "admin",
    metadataJson: null,
    archivedAt: null,
    trashedAt: null,
    updatedAt: "2026-07-10",
    lessons_on_sourceMaterial: [],
    contentSourceLinks_on_sourceMaterial: [],
  };

  assert.equal(getLearnerSourceMaterialAccessStatus(baseAccess), "not_found");
  assert.equal(
    getLearnerSourceMaterialAccessStatus({ ...baseAccess, visibility: "learner" }),
    "allowed",
  );
  assert.equal(
    getLearnerSourceMaterialAccessStatus({
      ...baseAccess,
      contentSourceLinks_on_sourceMaterial: [{
        lesson: { id: "lesson-1", status: "published", isPublished: true },
      }],
    }),
    "allowed",
  );
  assert.equal(
    getLearnerSourceMaterialAccessStatus({
      ...baseAccess,
      lessons_on_sourceMaterial: [
        { id: "lesson-2", status: "draft", isPublished: false },
      ],
    }),
    "not_found",
  );
  assert.equal(
    getLearnerSourceMaterialAccessStatus({
      ...baseAccess,
      visibility: "learner",
      trashedAt: "2026-07-11",
    }),
    "not_found",
  );
});

const COMPLETED_ATTEMPT_REVIEW: AttemptReview = {
  id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  status: "completed",
  questionOrder: JSON.stringify([
    "22222222222242228222222222222222",
    "11111111-1111-4111-8111-111111111111",
  ]),
  scoreRaw: 1,
  scoreMax: 2,
  scorePct: 50,
  passed: false,
  startedAt: "2026-07-11T10:00:00.000Z",
  completedAt: "2026-07-11T10:15:00.000Z",
  user: { id: "learner-1" },
  quiz: {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    title: "Assessment Review",
    passingScore: 70,
    quizQuestions_on_quiz: [],
  },
  quizResponses_on_attempt: [
    {
      selectedLetters: JSON.stringify(["B", "B", 3]),
      isCorrect: false,
      pointsEarned: 0,
      pointsPossible: 1,
      answeredAt: "2026-07-11",
      question: {
        id: "11111111-1111-4111-8111-111111111111",
        questionText: "First persisted response",
        difficulty: "easy",
        domain: "law",
        formulaRef: null,
        rationale: "Review the statute.",
        calculation: null,
        sourceRef: "Source 1",
        answerChoices_on_question: [
          {
            id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
            letter: "B",
            choiceText: "Incorrect",
            isCorrect: false,
            explanation: "This does not apply.",
            position: 2,
          },
          {
            id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
            letter: "A",
            choiceText: "Correct",
            isCorrect: true,
            explanation: "This rule applies.",
            position: 1,
          },
        ],
      },
    },
    {
      selectedLetters: "not-json",
      isCorrect: true,
      pointsEarned: 1,
      pointsPossible: 1,
      answeredAt: "2026-07-11",
      question: {
        id: "22222222-2222-4222-8222-222222222222",
        questionText: "Second persisted response",
        difficulty: "proficient",
        domain: "math",
        formulaRef: "FORM-1",
        rationale: "Apply the formula.",
        calculation: "1 + 1 = 2",
        sourceRef: null,
        answerChoices_on_question: [
          {
            id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
            letter: "A",
            choiceText: "Two",
            isCorrect: true,
            explanation: null,
            position: 1,
          },
        ],
      },
    },
  ],
};

COMPLETED_ATTEMPT_REVIEW.quiz.quizQuestions_on_quiz =
  COMPLETED_ATTEMPT_REVIEW.quizResponses_on_attempt.map((response, position) => ({
    position: position + 1,
    pointValue: response.pointsPossible ?? 0,
    question: response.question,
  }));

test("lesson progress preserves completion and omitted playback position", () => {
  assert.deepEqual(
    deriveLessonProgressUpdate(
      {
        status: "completed",
        videoPositionSeconds: 420,
        completedAt: "2026-07-10T12:00:00.000Z",
      },
      { status: "in_progress" },
      "2026-07-11T12:00:00.000Z",
    ),
    {
      status: "completed",
      videoPositionSeconds: 420,
      completedAt: "2026-07-10T12:00:00.000Z",
    },
  );
  assert.equal(
    deriveLessonProgressUpdate(
      null,
      { status: "completed", videoPositionSeconds: 600 },
      "2026-07-11T12:00:00.000Z",
    ).completedAt,
    "2026-07-11T12:00:00.000Z",
  );
});

test("lesson progress selects field-safe playback and completion operations", () => {
  assert.deepEqual(
    selectLessonProgressOperation(
      {
        userId: "learner-1",
        lessonId: "lesson-1",
        status: "in_progress",
        videoPositionSeconds: 120,
      },
      "2026-07-11T12:00:00.000Z",
    ),
    {
      operationName: "UpdateLessonPlayback",
      variables: {
        userId: "learner-1",
        lessonId: "lesson-1",
        videoPositionSeconds: 120,
      },
    },
  );
  assert.deepEqual(
    selectLessonProgressOperation(
      {
        userId: "learner-1",
        lessonId: "lesson-1",
        status: "completed",
        videoPositionSeconds: 600,
      },
      "2026-07-11T12:00:00.000Z",
    ),
    {
      operationName: "CompleteLessonProgress",
      variables: {
        userId: "learner-1",
        lessonId: "lesson-1",
        videoPositionSeconds: 600,
        completedAt: "2026-07-11T12:00:00.000Z",
      },
    },
  );
});

test("quiz completion counts unanswered questions in score and domains", () => {
  const firstQuestionId = "11111111-1111-4111-8111-111111111111";
  const secondQuestionId = "22222222-2222-4222-8222-222222222222";
  const result = deriveQuizCompletion(
    JSON.stringify([firstQuestionId, secondQuestionId]),
    [
      { position: 1, pointValue: 1, question: { id: firstQuestionId, domain: "law" } },
      { position: 2, pointValue: 1, question: { id: secondQuestionId, domain: "math" } },
    ],
    [{
      pointsEarned: 1,
      pointsPossible: 1,
      question: { id: firstQuestionId, domain: "law" },
    }],
  );

  assert.equal(result.scoreRaw, 1);
  assert.equal(result.scoreMax, 2);
  assert.equal(result.scorePct, 50);
  assert.deepEqual(result.domainBreakdown.math, { earned: 0, possible: 1 });
});

test("normalizeAttemptReview follows question order and parses persisted selections defensively", () => {
  const normalizedReview = normalizeAttemptReview(COMPLETED_ATTEMPT_REVIEW);

  assert.deepEqual(
    normalizedReview.questions.map((question) => question.id),
    [
      "22222222-2222-4222-8222-222222222222",
      "11111111-1111-4111-8111-111111111111",
    ],
  );
  assert.deepEqual(normalizedReview.questions[0]?.selectedLetters, []);
  assert.deepEqual(normalizedReview.questions[1]?.selectedLetters, ["B"]);
  assert.deepEqual(normalizedReview.questions[1]?.correctLetters, ["A"]);
  assert.deepEqual(
    normalizedReview.questions[1]?.choices.map((choice) => ({
      letter: choice.letter,
      isSelected: choice.isSelected,
      isCorrect: choice.isCorrect,
    })),
    [
      { letter: "A", isSelected: false, isCorrect: true },
      { letter: "B", isSelected: true, isCorrect: false },
    ],
  );
});

test("normalizeAttemptReview includes an explicit unanswered question", () => {
  const reviewWithUnansweredQuestion: AttemptReview = {
    ...COMPLETED_ATTEMPT_REVIEW,
    quizResponses_on_attempt: [COMPLETED_ATTEMPT_REVIEW.quizResponses_on_attempt[0]!],
  };
  const normalizedReview = normalizeAttemptReview(reviewWithUnansweredQuestion);

  assert.equal(normalizedReview.questions.length, 2);
  assert.deepEqual(normalizedReview.questions[0]?.selectedLetters, []);
  assert.equal(normalizedReview.questions[0]?.isCorrect, null);
  assert.equal(normalizedReview.questions[0]?.pointsEarned, 0);
});

test("attempt review access requires existence, ownership, and completion", () => {
  assert.equal(getAttemptReviewAccessStatus(null, "learner-1"), "not_found");
  assert.equal(
    getAttemptReviewAccessStatus(COMPLETED_ATTEMPT_REVIEW, "different-learner"),
    "forbidden",
  );
  assert.equal(getAttemptReviewAccessStatus(COMPLETED_ATTEMPT_REVIEW, "learner-1"), "allowed");

  const inProgressAttempt: AttemptReview = {
    ...COMPLETED_ATTEMPT_REVIEW,
    status: "in_progress",
    completedAt: null,
  };
  assert.equal(getAttemptReviewAccessStatus(inProgressAttempt, "learner-1"), "incomplete");
  assert.throws(
    () => normalizeAttemptReview(inProgressAttempt),
    /Cannot normalize an incomplete quiz attempt/,
  );
});

test("historical activity merges UTC dates, deduplicates sources, and preserves gaps", () => {
  const mergedHistory = mergeUserActivityHistory({
    dailyActivities: [
      { activityDate: "2026-07-10", lastActivityAt: "2026-07-10T09:00:00.000Z" },
    ],
    completedAttempts: [{ completedAt: "2026-07-10T20:00:00.000Z" }],
    completedLessons: [{ completedAt: "2026-07-08T23:30:00.000Z" }],
    lessonNoteActivity: [
      {
        createdAt: "2026-07-07T23:59:00.000Z",
        updatedAt: "2026-07-08T01:00:00.000Z",
      },
    ],
    glossaryNoteActivity: [{ createdAt: "2026-07-05T12:00:00.000Z" }],
  });

  assert.deepEqual(
    mergedHistory.map((record) => record.activityDate),
    ["2026-07-10", "2026-07-08", "2026-07-07", "2026-07-05"],
  );
  assert.equal(mergedHistory[0]?.lastActivityAt, "2026-07-10T09:00:00.000Z");
  assert.deepEqual(deriveActivityStreaks(mergedHistory, new Date("2026-07-11T12:00:00Z")), {
    currentStreakDays: 1,
    longestStreakDays: 2,
    totalActiveDays: 4,
    mostRecentActivityDate: "2026-07-10",
  });
});

test("study badges use fixed real-data milestones", () => {
  const badges = deriveStudyBadges({
    lessonsCompleted: 1,
    attempts: [{ scorePct: 80, passed: true }],
    formulaFavorites: 0,
    currentStreak: 1,
    longestStreak: 3,
    lastActivityAt: "2026-07-11T12:00:00.000Z",
    completedCourseCount: 1,
  });

  assert.deepEqual(
    badges.filter((badge) => badge.earned).map((badge) => badge.id),
    ["first-lesson", "first-quiz", "three-day-streak", "first-passed-quiz", "first-course"],
  );
});

test("certificate eligibility requires every published lesson and at least one lesson", () => {
  const emptyCourse = { id: "course-0", slug: "empty", title: "Empty", modules_on_course: [] };
  assert.equal(deriveCertificateEligibility(emptyCourse, [], null).eligible, false);

  const course = {
    id: "course-1",
    slug: "complete-me",
    title: "Complete Me",
    modules_on_course: [
      {
        lessons_on_module: [{ id: "published-1" }, { id: "published-2" }],
      },
    ],
  };
  const almostComplete = deriveCertificateEligibility(
    course,
    [
      { lesson: { id: "published-1" }, status: "completed", completedAt: "2026-07-08T10:00:00Z" },
      { lesson: { id: "unpublished-1" }, status: "completed", completedAt: "2026-07-09T10:00:00Z" },
    ],
    null,
  );
  assert.equal(almostComplete.eligible, false);
  assert.equal(almostComplete.completedLessonCount, 1);

  const complete = deriveCertificateEligibility(
    course,
    [
      { lesson: { id: "published-1" }, status: "completed", completedAt: "2026-07-08T10:00:00Z" },
      { lesson: { id: "published-2" }, status: "completed", completedAt: "2026-07-10T14:00:00Z" },
      { lesson: { id: "unpublished-1" }, status: "in_progress", completedAt: null },
    ],
    "2026-07-11T10:00:00Z",
  );
  assert.equal(complete.eligible, true);
  assert.equal(complete.issueDate, "2026-07-10T14:00:00.000Z");
});

test("certificate course guard rejects unpublished learner lookups", () => {
  const baseCourse = {
    id: "course-guard",
    slug: "guarded",
    title: "Guarded",
    modules_on_course: [],
  };

  assert.equal(isPublishedCertificateCourse({ ...baseCourse, isPublished: false }), false);
  assert.equal(isPublishedCertificateCourse({ ...baseCourse, isPublished: true }), true);
  assert.equal(isPublishedCertificateCourse(null), false);
});

test("certificate issue date falls back to course completion then eligible display date", () => {
  const course = {
    id: "course-2",
    slug: "fallback",
    title: "Fallback",
    modules_on_course: [{ lessons_on_module: [{ id: "lesson-1" }] }],
  };
  const progress = [{ lesson: { id: "lesson-1" }, status: "completed", completedAt: null }];

  assert.equal(
    deriveCertificateEligibility(course, progress, "2026-07-09T08:00:00Z").issueDate,
    "2026-07-09T08:00:00.000Z",
  );
  assert.equal(
    deriveCertificateEligibility(
      course,
      progress,
      null,
      new Date("2026-07-11T15:00:00Z"),
    ).issueDate,
    "2026-07-11T15:00:00.000Z",
  );
});
