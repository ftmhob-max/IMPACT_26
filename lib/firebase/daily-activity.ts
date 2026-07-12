// Backend learner activity services: lib/firebase/daily-activity.ts
// Data Connect operations are NO_ACCESS and must only be called by trusted server code.

import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";

export interface DailyActivityRecord {
  activityDate: string;
  lastActivityAt: string;
}

interface HistoricalTimestampRecord {
  completedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface UserActivityHistoryData {
  dailyActivities: DailyActivityRecord[];
  completedAttempts: HistoricalTimestampRecord[];
  completedLessons: HistoricalTimestampRecord[];
  lessonNoteActivity: HistoricalTimestampRecord[];
  glossaryNoteActivity: HistoricalTimestampRecord[];
}

export interface ActivityStreaks {
  currentStreakDays: number;
  longestStreakDays: number;
  totalActiveDays: number;
  mostRecentActivityDate: string | null;
}

const UTC_DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Produces the UTC YYYY-MM-DD key used by the DailyActivity compound key.
 */
export function toUtcDateKey(activityAt: Date): string {
  if (Number.isNaN(activityAt.getTime())) {
    throw new Error("Cannot derive a daily activity key from an invalid date");
  }
  return activityAt.toISOString().slice(0, 10);
}

function parseUtcDateKey(activityDate: string): number | null {
  if (!UTC_DATE_KEY_PATTERN.test(activityDate)) return null;

  const timestamp = Date.parse(`${activityDate}T00:00:00.000Z`);
  if (Number.isNaN(timestamp)) return null;

  // Date.parse normalizes invalid dates, so compare the canonical key.
  return toUtcDateKey(new Date(timestamp)) === activityDate ? timestamp : null;
}

/**
 * Derives current and longest UTC-day streaks from persisted activity rows.
 * Activity from yesterday keeps the current streak alive until today is used.
 */
export function deriveActivityStreaks(
  activityRecords: DailyActivityRecord[],
  referenceDate: Date,
): ActivityStreaks {
  const referenceTimestamp = parseUtcDateKey(toUtcDateKey(referenceDate));
  if (referenceTimestamp === null) {
    throw new Error("Unable to derive the UTC reference date");
  }

  const uniqueActivityTimestamps = Array.from(
    new Set(
      activityRecords
        .map((activityRecord) => parseUtcDateKey(activityRecord.activityDate))
        .filter((timestamp): timestamp is number => timestamp !== null && timestamp <= referenceTimestamp),
    ),
  ).sort((leftTimestamp, rightTimestamp) => leftTimestamp - rightTimestamp);

  let longestStreakDays = 0;
  let runningStreakDays = 0;
  let previousTimestamp: number | null = null;

  for (const activityTimestamp of uniqueActivityTimestamps) {
    runningStreakDays =
      previousTimestamp !== null &&
      activityTimestamp - previousTimestamp === MILLISECONDS_PER_DAY
        ? runningStreakDays + 1
        : 1;
    longestStreakDays = Math.max(longestStreakDays, runningStreakDays);
    previousTimestamp = activityTimestamp;
  }

  const mostRecentTimestamp = uniqueActivityTimestamps.at(-1) ?? null;
  let currentStreakDays = 0;
  if (
    mostRecentTimestamp !== null &&
    referenceTimestamp - mostRecentTimestamp <= MILLISECONDS_PER_DAY
  ) {
    currentStreakDays = 1;
    for (let index = uniqueActivityTimestamps.length - 2; index >= 0; index -= 1) {
      const laterTimestamp = uniqueActivityTimestamps[index + 1];
      const earlierTimestamp = uniqueActivityTimestamps[index];
      if (
        laterTimestamp === undefined ||
        earlierTimestamp === undefined ||
        laterTimestamp - earlierTimestamp !== MILLISECONDS_PER_DAY
      ) {
        break;
      }
      currentStreakDays += 1;
    }
  }

  return {
    currentStreakDays,
    longestStreakDays,
    totalActiveDays: uniqueActivityTimestamps.length,
    mostRecentActivityDate:
      mostRecentTimestamp === null ? null : toUtcDateKey(new Date(mostRecentTimestamp)),
  };
}

export async function recordDailyActivity(userId: string, activityAt: Date): Promise<void> {
  const lastActivityAt = activityAt.toISOString();
  await adminDcMutate("RecordDailyActivity", {
    userId,
    activityDate: toUtcDateKey(activityAt),
    lastActivityAt,
  });
}

/**
 * Records momentum without allowing an analytics write to fail the learner's
 * primary action.
 */
export async function recordDailyActivitySafely(
  userId: string,
  activityAt: Date = new Date(),
): Promise<void> {
  try {
    await recordDailyActivity(userId, activityAt);
  } catch (error) {
    console.error("[daily-activity] Unable to record learner activity", error);
  }
}

/**
 * Merges persisted daily rows with pre-tracking timestamps. A persisted row is
 * authoritative for its UTC date; legacy timestamps only fill missing dates.
 */
export function mergeUserActivityHistory(
  activityHistory: UserActivityHistoryData,
): DailyActivityRecord[] {
  const authoritativeDailyDates = new Set(
    activityHistory.dailyActivities.map((activityRecord) => activityRecord.activityDate),
  );
  const activityByUtcDate = new Map(
    activityHistory.dailyActivities.map((activityRecord) => [
      activityRecord.activityDate,
      activityRecord,
    ]),
  );
  const historicalRecords = [
    ...activityHistory.completedAttempts,
    ...activityHistory.completedLessons,
    ...activityHistory.lessonNoteActivity,
    ...activityHistory.glossaryNoteActivity,
  ];

  for (const historicalRecord of historicalRecords) {
    const timestamps = [
      historicalRecord.completedAt,
      historicalRecord.createdAt,
      historicalRecord.updatedAt,
    ];
    for (const timestamp of timestamps) {
      if (!timestamp) continue;
      const historicalDate = new Date(timestamp);
      if (Number.isNaN(historicalDate.getTime())) continue;

      const activityDate = toUtcDateKey(historicalDate);
      const existingRecord = activityByUtcDate.get(activityDate);
      if (!existingRecord) {
        activityByUtcDate.set(activityDate, {
          activityDate,
          lastActivityAt: historicalDate.toISOString(),
        });
      } else if (
        !authoritativeDailyDates.has(activityDate) &&
        Date.parse(existingRecord.lastActivityAt) < historicalDate.getTime()
      ) {
        activityByUtcDate.set(activityDate, {
          activityDate,
          lastActivityAt: historicalDate.toISOString(),
        });
      }
    }
  }

  return Array.from(activityByUtcDate.values()).sort(
    (firstRecord, secondRecord) =>
      Date.parse(secondRecord.lastActivityAt) - Date.parse(firstRecord.lastActivityAt),
  );
}

export async function getUserActivityHistory(userId: string): Promise<DailyActivityRecord[]> {
  const activityData = await adminDcQuery<UserActivityHistoryData>(
    "GetUserActivityHistory",
    { userId },
  );
  return mergeUserActivityHistory(activityData);
}
