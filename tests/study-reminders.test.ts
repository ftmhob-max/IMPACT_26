// Shared reminder behavior tests: tests/study-reminders.test.ts

import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_PROFILE_SETTINGS,
  normalizeProfileSettings,
} from "@/lib/profile-settings";
import { deriveStudyReminder } from "@/lib/study-reminders";

test("profile settings normalization accepts every reminder interval preset", () => {
  for (const reminderAfterDays of [1, 2, 3, 7] as const) {
    const normalizedSettings = normalizeProfileSettings({ reminderAfterDays });
    assert.equal(normalizedSettings.reminderAfterDays, reminderAfterDays);
  }
});

test("profile settings normalization rejects invalid reminder values", () => {
  const normalizedSettings = normalizeProfileSettings({
    remindersEnabled: "yes",
    reminderAfterDays: 4,
    browserNotificationsEnabled: "yes",
  });

  assert.equal(
    normalizedSettings.remindersEnabled,
    DEFAULT_PROFILE_SETTINGS.remindersEnabled,
  );
  assert.equal(
    normalizedSettings.reminderAfterDays,
    DEFAULT_PROFILE_SETTINGS.reminderAfterDays,
  );
  assert.equal(
    normalizedSettings.browserNotificationsEnabled,
    DEFAULT_PROFILE_SETTINGS.browserNotificationsEnabled,
  );
});

test("study reminder is due once the inactivity interval passes", () => {
  const reminderStatus = deriveStudyReminder({
    remindersEnabled: true,
    reminderAfterDays: 3,
    defaultStudyGoal: "Review one formula",
    lastActivityAt: "2026-07-07T12:00:00.000Z",
    referenceTime: new Date("2026-07-10T12:00:00.000Z"),
  });

  assert.equal(reminderStatus.due, true);
  assert.equal(reminderStatus.dueAt, "2026-07-10T12:00:00.000Z");
  assert.equal(reminderStatus.studyGoal, "Review one formula");
});

test("study reminder is not due before the inactivity interval", () => {
  const reminderStatus = deriveStudyReminder({
    remindersEnabled: true,
    reminderAfterDays: 3,
    defaultStudyGoal: "Complete one lesson",
    lastActivityAt: "2026-07-08T12:00:00.000Z",
    referenceTime: new Date("2026-07-10T12:00:00.000Z"),
  });

  assert.equal(reminderStatus.due, false);
});

test("study reminder is not due without recorded activity", () => {
  const reminderStatus = deriveStudyReminder({
    remindersEnabled: true,
    reminderAfterDays: 1,
    defaultStudyGoal: "Complete one lesson",
    lastActivityAt: null,
    referenceTime: new Date("2026-07-10T12:00:00.000Z"),
  });

  assert.equal(reminderStatus.due, false);
  assert.equal(reminderStatus.dueAt, null);
});

test("disabled study reminders are never due", () => {
  const reminderStatus = deriveStudyReminder({
    remindersEnabled: false,
    reminderAfterDays: 1,
    defaultStudyGoal: "Complete one lesson",
    lastActivityAt: "2026-07-01T12:00:00.000Z",
    referenceTime: new Date("2026-07-10T12:00:00.000Z"),
  });

  assert.equal(reminderStatus.due, false);
});
