// Front-end in-app notification controller: components/platform/ReminderController.tsx
"use client";

import { useEffect } from "react";
import type { LearnerProfileSettings } from "@/lib/profile-settings";
import type { StudyRhythmData } from "@/lib/firebase/study-rhythm";
import {
  deriveStudyReminder,
  getReminderStorageKey,
} from "@/lib/study-reminders";

const REMINDER_REEVALUATION_INTERVAL_MS = 15 * 60 * 1000;
let activeReminderEvaluation: Promise<void> | null = null;

interface ProfileSettingsResponse {
  settings: LearnerProfileSettings;
}

async function evaluateBrowserReminder(): Promise<void> {
  if (!("Notification" in window) || window.Notification.permission !== "granted") return;

  const referenceTime = new Date();
  const sentStorageKey = getReminderStorageKey("notification-sent", referenceTime);
  if (window.localStorage.getItem(sentStorageKey) !== null) return;

  // Claim synchronously so another visible tab cannot begin the same asynchronous evaluation.
  window.localStorage.setItem(sentStorageKey, "claimed");
  let notificationSent = false;

  try {
    const [profileResponse, studyRhythmResponse] = await Promise.all([
      fetch("/api/profile", { cache: "no-store" }),
      fetch("/api/study-rhythm", { cache: "no-store" }),
    ]);
    if (!profileResponse.ok || !studyRhythmResponse.ok) return;

    const profilePayload = await profileResponse.json() as ProfileSettingsResponse;
    const studyRhythm = await studyRhythmResponse.json() as StudyRhythmData;
    const reminderStatus = deriveStudyReminder({
      remindersEnabled: profilePayload.settings.remindersEnabled,
      reminderAfterDays: profilePayload.settings.reminderAfterDays,
      defaultStudyGoal: profilePayload.settings.defaultStudyGoal,
      lastActivityAt: studyRhythm.lastActivityAt,
      referenceTime,
    });

    if (
      !profilePayload.settings.browserNotificationsEnabled ||
      !reminderStatus.due
    ) {
      return;
    }

    new window.Notification("Ready for your next study session?", {
      body: `Your goal: ${reminderStatus.studyGoal}`,
      tag: "impact26-study-reminder",
    });
    window.localStorage.setItem(sentStorageKey, "true");
    notificationSent = true;
  } finally {
    // Failed or unnecessary evaluations release the claim for a later retry.
    if (!notificationSent) window.localStorage.removeItem(sentStorageKey);
  }
}

export function ReminderController() {
  useEffect(() => {
    const reevaluateReminder = () => {
      if (document.visibilityState !== "visible" || activeReminderEvaluation) return;

      activeReminderEvaluation = evaluateBrowserReminder()
        .catch(() => {
          // Reminder delivery is optional and must not interrupt the learner experience.
        })
        .finally(() => {
          activeReminderEvaluation = null;
        });
    };

    reevaluateReminder();
    const intervalId = window.setInterval(
      reevaluateReminder,
      REMINDER_REEVALUATION_INTERVAL_MS,
    );
    window.addEventListener("focus", reevaluateReminder);
    window.addEventListener("impact26:profile-settings-updated", reevaluateReminder);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", reevaluateReminder);
      window.removeEventListener("impact26:profile-settings-updated", reevaluateReminder);
    };
  }, []);

  return null;
}
