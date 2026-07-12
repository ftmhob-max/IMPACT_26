// lib/admin/cohort-analytics.ts — pure aggregation for cohort engagement.
// Turns raw GetCohortEngagement rows into per-learner completion + streak stats.
// No I/O here so it is unit-testable; streak logic reuses the learner helper.

import { deriveActivityStreaks, type DailyActivityRecord } from "@/lib/firebase/daily-activity";

export interface EngagementDirectoryUser {
  id: string;
  email: string;
  fullName: string | null;
}

export interface CohortEngagementInput {
  // All member ids so learners with zero activity still appear.
  memberIds: string[];
  users: EngagementDirectoryUser[];
  courseProgress: Array<{ user?: { id?: string | null } | null; completedAt?: string | null }>;
  lessonProgress: Array<{
    user?: { id?: string | null } | null;
    status?: string | null;
    completedAt?: string | null;
  }>;
  dailyActivities: Array<{
    user?: { id?: string | null } | null;
    activityDate?: string | null;
    lastActivityAt?: string | null;
  }>;
  referenceDate: Date;
}

export interface LearnerEngagement {
  userId: string;
  email: string;
  fullName: string | null;
  coursesEnrolled: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  currentStreakDays: number;
  longestStreakDays: number;
  totalActiveDays: number;
  lastActiveDate: string | null;
}

interface Accumulator {
  coursesEnrolled: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  activityRecords: DailyActivityRecord[];
}

function createAccumulator(): Accumulator {
  return { coursesEnrolled: 0, coursesCompleted: 0, lessonsCompleted: 0, activityRecords: [] };
}

/**
 * Aggregates course/lesson progress and daily activity into one row per member.
 * Members with no data still produce a zeroed row so the roster stays complete.
 */
export function aggregateCohortEngagement(input: CohortEngagementInput): LearnerEngagement[] {
  const usersById = new Map(input.users.map((user) => [user.id, user]));
  const byUser = new Map<string, Accumulator>();

  // Seed every member so absent learners still appear.
  for (const memberId of input.memberIds) {
    if (memberId) byUser.set(memberId, createAccumulator());
  }

  function ensure(userId: string | null | undefined): Accumulator | null {
    if (!userId) return null;
    let entry = byUser.get(userId);
    if (!entry) {
      entry = createAccumulator();
      byUser.set(userId, entry);
    }
    return entry;
  }

  for (const row of input.courseProgress) {
    const entry = ensure(row?.user?.id);
    if (!entry) continue;
    entry.coursesEnrolled += 1;
    if (row.completedAt) entry.coursesCompleted += 1;
  }

  for (const row of input.lessonProgress) {
    const entry = ensure(row?.user?.id);
    if (!entry) continue;
    if (row.status === "completed") entry.lessonsCompleted += 1;
  }

  for (const row of input.dailyActivities) {
    const entry = ensure(row?.user?.id);
    if (!entry) continue;
    if (row.activityDate && row.lastActivityAt) {
      entry.activityRecords.push({
        activityDate: row.activityDate,
        lastActivityAt: row.lastActivityAt,
      });
    }
  }

  const results: LearnerEngagement[] = [];
  for (const [userId, entry] of byUser.entries()) {
    const streaks = deriveActivityStreaks(entry.activityRecords, input.referenceDate);
    const directoryUser = usersById.get(userId);
    results.push({
      userId,
      email: directoryUser?.email ?? "",
      fullName: directoryUser?.fullName ?? null,
      coursesEnrolled: entry.coursesEnrolled,
      coursesCompleted: entry.coursesCompleted,
      lessonsCompleted: entry.lessonsCompleted,
      currentStreakDays: streaks.currentStreakDays,
      longestStreakDays: streaks.longestStreakDays,
      totalActiveDays: streaks.totalActiveDays,
      lastActiveDate: streaks.mostRecentActivityDate,
    });
  }

  // Most engaged first: lessons completed, then current streak.
  return results.sort(
    (left, right) =>
      right.lessonsCompleted - left.lessonsCompleted ||
      right.currentStreakDays - left.currentStreakDays,
  );
}
