// lib/admin/student-drilldown.ts — pure derivations for the per-student
// drill-down: learner profile summary, per-domain accuracy, and teacher-side
// attempt-review normalization. No I/O so it is fully unit-testable.

import { deriveActivityStreaks, type DailyActivityRecord } from "@/lib/firebase/daily-activity";

export interface LearnerProfileUser {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  createdAt: string | null;
}

export interface DomainAccuracy {
  domain: string;
  correct: number;
  total: number;
  accuracyPct: number;
}

export interface LearnerAttemptRow {
  id: string;
  quizTitle: string;
  scorePct: number | null;
  passed: boolean | null;
  completedAt: string | null;
}

export interface LearnerCourseRow {
  courseId: string;
  title: string;
  completed: boolean;
  lastAccessedAt: string | null;
}

export interface LearnerProfile {
  user: LearnerProfileUser | null;
  attemptCount: number;
  averageScorePct: number | null;
  passRatePct: number | null;
  coursesEnrolled: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  currentStreakDays: number;
  longestStreakDays: number;
  totalActiveDays: number;
  lastActiveDate: string | null;
  domains: DomainAccuracy[];
  attempts: LearnerAttemptRow[];
  courses: LearnerCourseRow[];
}

function roundPct(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Summarizes the GetLearnerProgressDetail payload into a display profile. */
export function summarizeLearnerProgress(raw: any, referenceDate: Date): LearnerProfile {
  const rawUser = raw?.users?.[0] ?? null;
  const user: LearnerProfileUser | null = rawUser
    ? {
        id: rawUser.id ?? "",
        email: rawUser.email ?? "",
        fullName: rawUser.fullName ?? null,
        role: rawUser.role ?? "learner",
        createdAt: rawUser.createdAt ?? null,
      }
    : null;

  const rawAttempts: any[] = raw?.quizAttempts ?? [];

  // Per-domain accuracy across every response in every completed attempt.
  const domainMap = new Map<string, { correct: number; total: number }>();
  let scoreSum = 0;
  let scoreCount = 0;
  let passedCount = 0;
  for (const attempt of rawAttempts) {
    if (typeof attempt.scorePct === "number") {
      scoreSum += attempt.scorePct;
      scoreCount += 1;
    }
    if (attempt.passed === true) passedCount += 1;
    for (const response of attempt.quizResponses_on_attempt ?? []) {
      const domain = response?.question?.domain ?? "unknown";
      const entry = domainMap.get(domain) ?? { correct: 0, total: 0 };
      entry.total += 1;
      if (response.isCorrect === true) entry.correct += 1;
      domainMap.set(domain, entry);
    }
  }

  const domains: DomainAccuracy[] = Array.from(domainMap.entries())
    .map(([domain, { correct, total }]) => ({
      domain,
      correct,
      total,
      accuracyPct: total > 0 ? roundPct((correct / total) * 100) : 0,
    }))
    .sort((left, right) => right.total - left.total);

  const attempts: LearnerAttemptRow[] = rawAttempts.map((attempt) => ({
    id: attempt.id,
    quizTitle: attempt.quiz?.title ?? "Untitled quiz",
    scorePct: typeof attempt.scorePct === "number" ? attempt.scorePct : null,
    passed: typeof attempt.passed === "boolean" ? attempt.passed : null,
    completedAt: attempt.completedAt ?? null,
  }));

  const rawCourses: any[] = raw?.userCourseProgresses ?? [];
  const courses: LearnerCourseRow[] = rawCourses.map((row) => ({
    courseId: row?.course?.id ?? "",
    title: row?.course?.title ?? "Untitled course",
    completed: Boolean(row?.completedAt),
    lastAccessedAt: row?.lastAccessedAt ?? null,
  }));
  const coursesCompleted = courses.filter((course) => course.completed).length;

  const lessonsCompleted = (raw?.userLessonProgresses ?? []).filter(
    (row: any) => row?.status === "completed",
  ).length;

  const activityRecords: DailyActivityRecord[] = (raw?.dailyActivities ?? [])
    .filter((row: any) => row?.activityDate && row?.lastActivityAt)
    .map((row: any) => ({ activityDate: row.activityDate, lastActivityAt: row.lastActivityAt }));
  const streaks = deriveActivityStreaks(activityRecords, referenceDate);

  return {
    user,
    attemptCount: rawAttempts.length,
    averageScorePct: scoreCount > 0 ? roundPct(scoreSum / scoreCount) : null,
    passRatePct: rawAttempts.length > 0 ? roundPct((passedCount / rawAttempts.length) * 100) : null,
    coursesEnrolled: courses.length,
    coursesCompleted,
    lessonsCompleted,
    currentStreakDays: streaks.currentStreakDays,
    longestStreakDays: streaks.longestStreakDays,
    totalActiveDays: streaks.totalActiveDays,
    lastActiveDate: streaks.mostRecentActivityDate,
    domains,
    attempts,
    courses,
  };
}

// ─── Teacher-side attempt review ─────────────────────────────────────────────

export interface ReviewChoice {
  letter: string;
  text: string;
  isCorrect: boolean;
  explanation: string | null;
}

export interface ReviewQuestion {
  questionId: string;
  questionText: string;
  domain: string;
  difficulty: string;
  rationale: string | null;
  calculation: string | null;
  sourceRef: string | null;
  choices: ReviewChoice[];
  selectedLetters: string[];
  isCorrect: boolean | null;
  pointsEarned: number | null;
  pointsPossible: number | null;
}

export interface AttemptReview {
  attemptId: string;
  userId: string;
  quizTitle: string;
  status: string;
  scorePct: number | null;
  scoreRaw: number | null;
  scoreMax: number | null;
  passed: boolean | null;
  startedAt: string | null;
  completedAt: string | null;
  questions: ReviewQuestion[];
}

function parseSelectedLetters(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((entry) => String(entry));
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((entry) => String(entry));
    } catch {
      return value
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
    }
  }
  return [];
}

/** Normalizes AdminGetAttemptReview into a display-ready review object. */
export function normalizeAdminAttemptReview(raw: any): AttemptReview | null {
  const attempt = raw?.quizAttempt;
  if (!attempt?.id) return null;

  const questions: ReviewQuestion[] = (raw?.quizResponses ?? []).map((response: any) => {
    const question = response?.question ?? {};
    const choices: ReviewChoice[] = (question.answerChoices_on_question ?? [])
      .slice()
      .sort((a: any, b: any) => (a?.position ?? 0) - (b?.position ?? 0))
      .map((choice: any) => ({
        letter: choice?.letter ?? "",
        text: choice?.choiceText ?? "",
        isCorrect: Boolean(choice?.isCorrect),
        explanation: choice?.explanation ?? null,
      }));

    return {
      questionId: question?.id ?? "",
      questionText: question?.questionText ?? "",
      domain: question?.domain ?? "unknown",
      difficulty: question?.difficulty ?? "",
      rationale: question?.rationale ?? null,
      calculation: question?.calculation ?? null,
      sourceRef: question?.sourceRef ?? null,
      choices,
      selectedLetters: parseSelectedLetters(response?.selectedLetters),
      isCorrect: typeof response?.isCorrect === "boolean" ? response.isCorrect : null,
      pointsEarned: typeof response?.pointsEarned === "number" ? response.pointsEarned : null,
      pointsPossible: typeof response?.pointsPossible === "number" ? response.pointsPossible : null,
    };
  });

  return {
    attemptId: attempt.id,
    userId: attempt?.user?.id ?? "",
    quizTitle: attempt?.quiz?.title ?? "Untitled quiz",
    status: attempt.status ?? "",
    scorePct: typeof attempt.scorePct === "number" ? attempt.scorePct : null,
    scoreRaw: typeof attempt.scoreRaw === "number" ? attempt.scoreRaw : null,
    scoreMax: typeof attempt.scoreMax === "number" ? attempt.scoreMax : null,
    passed: typeof attempt.passed === "boolean" ? attempt.passed : null,
    startedAt: attempt.startedAt ?? null,
    completedAt: attempt.completedAt ?? null,
    questions,
  };
}
