// Front-end/back-end shared: learner profile settings persisted in Firestore.
import { FieldValue, getAdminFirestore } from "@/lib/firebase/admin";

export type LearnerProfileSettings = {
  defaultStudyGoal: string;
  defaultSessionLength: number;
  remindersEnabled: boolean;
  reminderAfterDays: ReminderAfterDays;
  browserNotificationsEnabled: boolean;
  compactSidebar: boolean;
  reducedMotion: boolean;
  // "system" follows the operating-system color scheme; "light"/"dark" are explicit.
  theme: "light" | "dark" | "system";
  formulaHelperDefaultOpen: boolean;
  calculatorPrecision: string;
};

export const REMINDER_AFTER_DAY_PRESETS = [1, 2, 3, 7] as const;
export type ReminderAfterDays = (typeof REMINDER_AFTER_DAY_PRESETS)[number];

export const DEFAULT_PROFILE_SETTINGS: LearnerProfileSettings = {
  defaultStudyGoal: "Complete one lesson or quiz",
  defaultSessionLength: 30,
  remindersEnabled: true,
  reminderAfterDays: 3,
  browserNotificationsEnabled: false,
  compactSidebar: false,
  reducedMotion: false,
  // New learners inherit their operating-system preference by default.
  theme: "system",
  formulaHelperDefaultOpen: true,
  calculatorPrecision: "2",
};

const SETTINGS_COLLECTION = "userProfileSettings";

function isReminderAfterDays(value: unknown): value is ReminderAfterDays {
  return REMINDER_AFTER_DAY_PRESETS.some((preset) => preset === value);
}

export function normalizeProfileSettings(input: Record<string, unknown> | null | undefined): LearnerProfileSettings {
  const source = input ?? {};
  return {
    defaultStudyGoal: typeof source.defaultStudyGoal === "string" && source.defaultStudyGoal.trim()
      ? source.defaultStudyGoal.trim().slice(0, 120)
      : DEFAULT_PROFILE_SETTINGS.defaultStudyGoal,
    defaultSessionLength: typeof source.defaultSessionLength === "number" && Number.isFinite(source.defaultSessionLength)
      ? Math.min(180, Math.max(10, Math.round(source.defaultSessionLength)))
      : DEFAULT_PROFILE_SETTINGS.defaultSessionLength,
    remindersEnabled: typeof source.remindersEnabled === "boolean"
      ? source.remindersEnabled
      : DEFAULT_PROFILE_SETTINGS.remindersEnabled,
    reminderAfterDays: isReminderAfterDays(source.reminderAfterDays)
      ? source.reminderAfterDays
      : DEFAULT_PROFILE_SETTINGS.reminderAfterDays,
    browserNotificationsEnabled: typeof source.browserNotificationsEnabled === "boolean"
      ? source.browserNotificationsEnabled
      : DEFAULT_PROFILE_SETTINGS.browserNotificationsEnabled,
    compactSidebar: typeof source.compactSidebar === "boolean"
      ? source.compactSidebar
      : DEFAULT_PROFILE_SETTINGS.compactSidebar,
    reducedMotion: typeof source.reducedMotion === "boolean"
      ? source.reducedMotion
      : DEFAULT_PROFILE_SETTINGS.reducedMotion,
    theme:
      source.theme === "dark" || source.theme === "light" || source.theme === "system"
        ? source.theme
        : DEFAULT_PROFILE_SETTINGS.theme,
    formulaHelperDefaultOpen: typeof source.formulaHelperDefaultOpen === "boolean"
      ? source.formulaHelperDefaultOpen
      : DEFAULT_PROFILE_SETTINGS.formulaHelperDefaultOpen,
    calculatorPrecision: typeof source.calculatorPrecision === "string" && ["0", "1", "2", "3", "4"].includes(source.calculatorPrecision)
      ? source.calculatorPrecision
      : DEFAULT_PROFILE_SETTINGS.calculatorPrecision,
  };
}

export async function getUserProfileSettings(uid: string) {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection(SETTINGS_COLLECTION).doc(uid).get();
    const data = snapshot.exists ? snapshot.data() : null;
    return {
      settings: normalizeProfileSettings(data),
      avatarStoragePath: typeof data?.avatarStoragePath === "string" ? data.avatarStoragePath : null,
      updatedAt: data?.updatedAt ?? null,
    };
  } catch (error) {
    console.warn("[profile-settings] Firestore unavailable; using defaults", error);
    return {
      settings: DEFAULT_PROFILE_SETTINGS,
      avatarStoragePath: null,
      updatedAt: null,
    };
  }
}

export async function updateUserProfileSettings(uid: string, settings: LearnerProfileSettings) {
  const normalized = normalizeProfileSettings(settings);
  try {
    const db = getAdminFirestore();
    await db.collection(SETTINGS_COLLECTION).doc(uid).set(
      {
        ...normalized,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("[profile-settings] Firestore unavailable; settings were not persisted", error);
  }
  return normalized;
}

export async function updateUserAvatarStoragePath(uid: string, avatarStoragePath: string | null) {
  try {
    const db = getAdminFirestore();
    await db.collection(SETTINGS_COLLECTION).doc(uid).set(
      {
        avatarStoragePath,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("[profile-settings] Firestore unavailable; avatar storage path was not persisted", error);
  }
}
