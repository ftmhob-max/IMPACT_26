import { FieldValue, getAdminFirestore } from "@/lib/firebase/admin-firestore";

export type LearnerProfileSettings = {
  studyReminderEnabled: boolean;
  studyReminderTime: string;
  emailStudyReminders: boolean;
  emailProgressSummary: boolean;
  emailProductUpdates: boolean;
  defaultStudyGoal: string;
  defaultSessionLength: number;
  compactSidebar: boolean;
  reducedMotion: boolean;
  theme: "light" | "dark";
  formulaHelperDefaultOpen: boolean;
  calculatorPrecision: string;
  profileVisibility: string;
};

export const DEFAULT_PROFILE_SETTINGS: LearnerProfileSettings = {
  studyReminderEnabled: true,
  studyReminderTime: "18:00",
  emailStudyReminders: true,
  emailProgressSummary: true,
  emailProductUpdates: false,
  defaultStudyGoal: "Complete one lesson or quiz",
  defaultSessionLength: 30,
  compactSidebar: false,
  reducedMotion: false,
  theme: "light",
  formulaHelperDefaultOpen: true,
  calculatorPrecision: "2",
  profileVisibility: "private",
};

const SETTINGS_COLLECTION = "userProfileSettings";

export function normalizeProfileSettings(input: Record<string, unknown> | null | undefined): LearnerProfileSettings {
  const source = input ?? {};
  return {
    studyReminderEnabled: typeof source.studyReminderEnabled === "boolean"
      ? source.studyReminderEnabled
      : DEFAULT_PROFILE_SETTINGS.studyReminderEnabled,
    studyReminderTime: typeof source.studyReminderTime === "string" && /^\d{2}:\d{2}$/.test(source.studyReminderTime)
      ? source.studyReminderTime
      : DEFAULT_PROFILE_SETTINGS.studyReminderTime,
    emailStudyReminders: typeof source.emailStudyReminders === "boolean"
      ? source.emailStudyReminders
      : DEFAULT_PROFILE_SETTINGS.emailStudyReminders,
    emailProgressSummary: typeof source.emailProgressSummary === "boolean"
      ? source.emailProgressSummary
      : DEFAULT_PROFILE_SETTINGS.emailProgressSummary,
    emailProductUpdates: typeof source.emailProductUpdates === "boolean"
      ? source.emailProductUpdates
      : DEFAULT_PROFILE_SETTINGS.emailProductUpdates,
    defaultStudyGoal: typeof source.defaultStudyGoal === "string" && source.defaultStudyGoal.trim()
      ? source.defaultStudyGoal.trim().slice(0, 120)
      : DEFAULT_PROFILE_SETTINGS.defaultStudyGoal,
    defaultSessionLength: typeof source.defaultSessionLength === "number" && Number.isFinite(source.defaultSessionLength)
      ? Math.min(180, Math.max(10, Math.round(source.defaultSessionLength)))
      : DEFAULT_PROFILE_SETTINGS.defaultSessionLength,
    compactSidebar: typeof source.compactSidebar === "boolean"
      ? source.compactSidebar
      : DEFAULT_PROFILE_SETTINGS.compactSidebar,
    reducedMotion: typeof source.reducedMotion === "boolean"
      ? source.reducedMotion
      : DEFAULT_PROFILE_SETTINGS.reducedMotion,
    theme: source.theme === "dark" ? "dark" : DEFAULT_PROFILE_SETTINGS.theme,
    formulaHelperDefaultOpen: typeof source.formulaHelperDefaultOpen === "boolean"
      ? source.formulaHelperDefaultOpen
      : DEFAULT_PROFILE_SETTINGS.formulaHelperDefaultOpen,
    calculatorPrecision: typeof source.calculatorPrecision === "string" && ["0", "1", "2", "3", "4"].includes(source.calculatorPrecision)
      ? source.calculatorPrecision
      : DEFAULT_PROFILE_SETTINGS.calculatorPrecision,
    profileVisibility: source.profileVisibility === "team" ? "team" : DEFAULT_PROFILE_SETTINGS.profileVisibility,
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
