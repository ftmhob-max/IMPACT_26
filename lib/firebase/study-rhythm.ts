// Backend learner momentum services: lib/firebase/study-rhythm.ts
// Shared by server pages and the authenticated Study Rhythm API.

import { deriveActivityStreaks, getUserActivityHistory } from "@/lib/firebase/daily-activity";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { listUserFavorites } from "@/lib/firebase/favorites";
import { getLearnerCatalog, type LearnerCatalogCourse } from "@/lib/firebase/learner-portal";

export type StudyBadgeId =
  | "first-lesson"
  | "first-quiz"
  | "three-day-streak"
  | "first-passed-quiz"
  | "first-course";

export interface StudyBadge {
  id: StudyBadgeId;
  label: string;
  earned: boolean;
}

export interface StudyRhythmData {
  lessonsCompleted: number;
  quizAttempts: number;
  bestScore: number | null;
  hasPassed: boolean;
  formulaFavorites: number;
  overallPct: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: string | null;
  completedCourseCount: number;
  badges: StudyBadge[];
}

export interface StudyRhythmAttempt {
  scorePct: number | null;
  passed: boolean | null;
}

export interface StudyRhythmInputs {
  lessonsCompleted: number;
  attempts: StudyRhythmAttempt[];
  formulaFavorites: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: string | null;
  completedCourseCount: number;
}

export function deriveStudyBadges(inputs: StudyRhythmInputs): StudyBadge[] {
  return [
    { id: "first-lesson", label: "First lesson complete", earned: inputs.lessonsCompleted > 0 },
    { id: "first-quiz", label: "First quiz complete", earned: inputs.attempts.length > 0 },
    { id: "three-day-streak", label: "3-day study streak", earned: inputs.longestStreak >= 3 },
    {
      id: "first-passed-quiz",
      label: "First quiz passed",
      earned: inputs.attempts.some((attempt) => attempt.passed === true),
    },
    { id: "first-course", label: "First course complete", earned: inputs.completedCourseCount > 0 },
  ];
}

export function deriveStudyRhythm(inputs: StudyRhythmInputs): StudyRhythmData {
  const scoredAttempts = inputs.attempts.filter((attempt) => attempt.scorePct !== null);
  const bestScore =
    scoredAttempts.length > 0
      ? Math.max(...scoredAttempts.map((attempt) => attempt.scorePct ?? 0))
      : null;
  const hasPassed = inputs.attempts.some((attempt) => attempt.passed === true);
  const learnPercent = Math.min(inputs.lessonsCompleted * 10, 100);
  const applyPercent = Math.min(inputs.formulaFavorites * 20, 100);
  const reviewPercent = bestScore ?? 0;

  return {
    lessonsCompleted: inputs.lessonsCompleted,
    quizAttempts: inputs.attempts.length,
    bestScore,
    hasPassed,
    formulaFavorites: inputs.formulaFavorites,
    overallPct: Math.round(learnPercent * 0.4 + applyPercent * 0.2 + reviewPercent * 0.4),
    currentStreak: inputs.currentStreak,
    longestStreak: inputs.longestStreak,
    lastActivityAt: inputs.lastActivityAt,
    completedCourseCount: inputs.completedCourseCount,
    badges: deriveStudyBadges(inputs),
  };
}

function countCompletedCourses(catalog: LearnerCatalogCourse[]): number {
  return catalog.filter(
    (course) =>
      course.metrics.totalLessons > 0 &&
      course.metrics.completedLessons === course.metrics.totalLessons,
  ).length;
}

export async function getStudyRhythm(
  userId: string,
  referenceDate: Date = new Date(),
): Promise<StudyRhythmData> {
  const [catalog, attemptData, formulaFavorites, activityRecords] = await Promise.all([
    getLearnerCatalog(userId),
    adminDcQuery<{ quizAttempts: StudyRhythmAttempt[] }>("GetUserAttemptHistory", { userId }),
    listUserFavorites(userId, "formula"),
    getUserActivityHistory(userId),
  ]);
  const streaks = deriveActivityStreaks(activityRecords, referenceDate);
  const lessonsCompleted = catalog.reduce(
    (completedLessonCount, course) =>
      completedLessonCount + course.metrics.completedLessons,
    0,
  );
  const latestActivityTimestamp = activityRecords.reduce<string | null>(
    (latestTimestamp, activityRecord) =>
      latestTimestamp === null ||
      Date.parse(activityRecord.lastActivityAt) > Date.parse(latestTimestamp)
        ? activityRecord.lastActivityAt
        : latestTimestamp,
    null,
  );

  return deriveStudyRhythm({
    lessonsCompleted,
    attempts: attemptData.quizAttempts,
    formulaFavorites: formulaFavorites.length,
    currentStreak: streaks.currentStreakDays,
    longestStreak: streaks.longestStreakDays,
    lastActivityAt: latestActivityTimestamp,
    completedCourseCount: countCompletedCourses(catalog),
  });
}
