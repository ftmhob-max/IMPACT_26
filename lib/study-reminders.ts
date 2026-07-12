// Front-end/back-end shared reminder derivation: lib/study-reminders.ts

import type { ReminderAfterDays } from "@/lib/profile-settings";

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export interface StudyReminderInputs {
  remindersEnabled: boolean;
  reminderAfterDays: ReminderAfterDays;
  defaultStudyGoal: string;
  lastActivityAt: string | null;
  referenceTime: Date;
}

export interface StudyReminderStatus {
  due: boolean;
  dueAt: string | null;
  studyGoal: string;
}

/**
 * Produces one canonical reminder decision for server and browser surfaces.
 * A learner without recorded activity is not considered overdue.
 */
export function deriveStudyReminder(inputs: StudyReminderInputs): StudyReminderStatus {
  const lastActivityTimestamp = inputs.lastActivityAt
    ? Date.parse(inputs.lastActivityAt)
    : Number.NaN;
  const referenceTimestamp = inputs.referenceTime.getTime();
  const hasValidTimes = Number.isFinite(lastActivityTimestamp) && Number.isFinite(referenceTimestamp);
  const dueTimestamp = hasValidTimes
    ? lastActivityTimestamp + inputs.reminderAfterDays * MILLISECONDS_PER_DAY
    : Number.NaN;

  return {
    due: inputs.remindersEnabled && Number.isFinite(dueTimestamp) && referenceTimestamp >= dueTimestamp,
    dueAt: Number.isFinite(dueTimestamp) ? new Date(dueTimestamp).toISOString() : null,
    studyGoal: inputs.defaultStudyGoal,
  };
}

export function getUtcDayKey(referenceTime: Date): string {
  return referenceTime.toISOString().slice(0, 10);
}

export function getReminderStorageKey(
  purpose: "dashboard-dismissed" | "notification-sent",
  referenceTime: Date,
): string {
  return `impact26:reminder:${purpose}:${getUtcDayKey(referenceTime)}`;
}
