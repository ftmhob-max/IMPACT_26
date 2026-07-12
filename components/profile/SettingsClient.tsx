// Front-end learner settings form: components/profile/SettingsClient.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconTile, SectionPanel } from "@/components/ui/LearnerPrimitives";
import * as Icons from "@/components/ui/Icons";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  applyReducedMotion,
  applyTheme,
  type ThemeMode,
} from "@/components/theme/ThemeController";

type LearnerProfileSettings = {
  defaultStudyGoal: string;
  defaultSessionLength: number;
  remindersEnabled: boolean;
  reminderAfterDays: 1 | 2 | 3 | 7;
  browserNotificationsEnabled: boolean;
  compactSidebar: boolean;
  reducedMotion: boolean;
  theme: ThemeMode;
  formulaHelperDefaultOpen: boolean;
  calculatorPrecision: string;
};

const DEFAULT_SETTINGS: LearnerProfileSettings = {
  defaultStudyGoal: "Complete one lesson or quiz",
  defaultSessionLength: 30,
  remindersEnabled: true,
  reminderAfterDays: 3,
  browserNotificationsEnabled: false,
  compactSidebar: false,
  reducedMotion: false,
  theme: "system",
  formulaHelperDefaultOpen: true,
  calculatorPrecision: "2",
};

type BrowserNotificationStatus = "unsupported" | "default" | "granted" | "denied";

function getBrowserNotificationStatus(): BrowserNotificationStatus {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return window.Notification.permission;
}

export function SettingsClient() {
  const [settings, setSettings] = useState<LearnerProfileSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [browserNotificationStatus, setBrowserNotificationStatus] =
    useState<BrowserNotificationStatus>("default");

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Unable to load settings.");
        const notificationStatus = getBrowserNotificationStatus();
        const loadedSettings = payload.settings ?? DEFAULT_SETTINGS;
        // Browser denial is authoritative even if an older persisted preference says enabled.
        const nextSettings = notificationStatus === "denied"
          ? { ...loadedSettings, browserNotificationsEnabled: false }
          : loadedSettings;
        setBrowserNotificationStatus(notificationStatus);
        setSettings(nextSettings);
        applyTheme(nextSettings.theme ?? "system");
        applyReducedMotion(nextSettings.reducedMotion ?? false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load settings.");
      } finally {
        setLoading(false);
      }
    }

    void loadSettings();
  }, []);

  function update<K extends keyof LearnerProfileSettings>(key: K, value: LearnerProfileSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
    if (key === "reducedMotion") {
      applyReducedMotion(Boolean(value));
    }
  }

  async function enableBrowserNotifications() {
    setMessage("");
    setError("");
    if (!("Notification" in window)) {
      setBrowserNotificationStatus("unsupported");
      update("browserNotificationsEnabled", false);
      return;
    }

    // Permission is requested only from this explicit button gesture.
    const permission = await window.Notification.requestPermission();
    setBrowserNotificationStatus(permission);
    update("browserNotificationsEnabled", permission === "granted");
    if (permission === "granted") {
      setMessage("Browser notifications enabled. Save settings to keep this preference.");
    } else if (permission === "denied") {
      setError("Browser notifications are blocked. Allow them in browser settings before enabling.");
    }
  }

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const settingsToPersist = browserNotificationStatus === "denied"
        ? { ...settings, browserNotificationsEnabled: false }
        : settings;
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsToPersist }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Unable to save settings.");
      setSettings(payload.settings ?? settingsToPersist);
      setMessage("Settings saved.");
      window.dispatchEvent(new Event("impact26:profile-settings-updated"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SectionPanel>
        <div className="flex items-center gap-3 p-6 text-sm font-semibold text-slate-500">
          <Icons.Loader size={16} className="animate-spin" />
          Loading settings...
        </div>
      </SectionPanel>
    );
  }

  return (
    <form onSubmit={saveSettings} className="space-y-6">
      {(message || error) && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm font-bold ${
            error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <SectionPanel title="Study rhythm" description="Choose the defaults that shape each study session.">
            <div className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Session length">
                  <select
                    value={settings.defaultSessionLength}
                    onChange={(event) => update("defaultSessionLength", Number(event.target.value))}
                    className="profile-input"
                  >
                    <option value={10}>10 minutes</option>
                    <option value={20}>20 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                  </select>
                </Field>
              </div>
              <Field label="Default study goal">
                <input
                  value={settings.defaultStudyGoal}
                  onChange={(event) => update("defaultStudyGoal", event.target.value)}
                  maxLength={120}
                  className="profile-input"
                />
              </Field>
            </div>
          </SectionPanel>

          <SectionPanel
            title="Study reminders"
            description="Show a gentle cue after you have been away from your study goal."
          >
            <div className="space-y-5 p-5">
              <ToggleRow
                label="Reminder cues"
                detail="Show dashboard and sidebar cues when your selected interval has passed."
                checked={settings.remindersEnabled}
                onChange={(checked) => update("remindersEnabled", checked)}
              />
              <Field label="Remind me after">
                <select
                  value={settings.reminderAfterDays}
                  onChange={(event) => update(
                    "reminderAfterDays",
                    Number(event.target.value) as LearnerProfileSettings["reminderAfterDays"],
                  )}
                  className="profile-input"
                  disabled={!settings.remindersEnabled}
                >
                  <option value={1}>1 day without activity</option>
                  <option value={2}>2 days without activity</option>
                  <option value={3}>3 days without activity</option>
                  <option value={7}>7 days without activity</option>
                </select>
              </Field>
              <div className="rounded-lg border border-[var(--impact-info-border)] bg-[var(--impact-info-bg)] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-extrabold text-[var(--impact-info-text)]">
                      Browser notifications
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Status: {browserNotificationStatus}. Notifications work only while IMPACT_26 is open.
                      No email or background push is sent.
                    </p>
                  </div>
                  {settings.browserNotificationsEnabled && browserNotificationStatus === "granted" ? (
                    <button
                      type="button"
                      onClick={() => update("browserNotificationsEnabled", false)}
                      className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void enableBrowserNotifications()}
                      disabled={browserNotificationStatus === "unsupported"}
                      className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-bold text-white hover:bg-[#134d88] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Enable notifications
                    </button>
                  )}
                </div>
              </div>
            </div>
          </SectionPanel>

          <SectionPanel title="Display and tools" description="Tune the learning interface to your working style.">
            <div className="space-y-5 p-5">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">Appearance</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Choose light, dark, or match your device (System).
                    </p>
                  </div>
                  <ThemeToggle
                    value={settings.theme}
                    onChange={(theme) => update("theme", theme)}
                    presentation="surface"
                  />
                </div>
              </div>
              <ToggleRow
                label="Compact sidebar"
                detail="Prefer a tighter navigation layout on larger screens."
                checked={settings.compactSidebar}
                onChange={(checked) => update("compactSidebar", checked)}
              />
              <ToggleRow
                label="Reduced motion"
                detail="Limit decorative transitions where the app supports it."
                checked={settings.reducedMotion}
                onChange={(checked) => update("reducedMotion", checked)}
              />
              <ToggleRow
                label="Formula helper open by default"
                detail="Keep formula guidance ready when calculator tools appear."
                checked={settings.formulaHelperDefaultOpen}
                onChange={(checked) => update("formulaHelperDefaultOpen", checked)}
              />
              <Field label="Calculator decimal places">
                <select
                  value={settings.calculatorPrecision}
                  onChange={(event) => update("calculatorPrecision", event.target.value)}
                  className="profile-input"
                >
                  <option value="0">0 places</option>
                  <option value="1">1 place</option>
                  <option value="2">2 places</option>
                  <option value="3">3 places</option>
                  <option value="4">4 places</option>
                </select>
              </Field>
            </div>
          </SectionPanel>
        </div>

        <aside className="space-y-6">
          <SectionPanel title="Privacy" description="Your learner profile is private by default.">
            <div className="space-y-4 p-5">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <IconTile icon={Icons.Shield} tone="blue" />
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">Learner data</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Scores, notes, and saved study items stay tied to your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionPanel>

          <SectionPanel title="Security" description="Account access is managed through Firebase Auth.">
            <div className="space-y-3 p-5">
              <Link
                href="/reset-password"
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#185FA5] bg-white px-4 py-2 text-sm font-bold text-[#185FA5] shadow-sm transition-colors hover:bg-[#E6F1FB]"
              >
                <Icons.Lock size={15} />
                Reset password
              </Link>
              <Link
                href="/profile"
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <Icons.User size={15} />
                Back to profile
              </Link>
            </div>
          </SectionPanel>
        </aside>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#134d88] disabled:opacity-60"
        >
          {saving ? <Icons.Loader size={15} className="animate-spin" /> : <Icons.Check size={15} />}
          Save settings
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function ToggleRow({
  label,
  detail,
  checked,
  onChange,
}: {
  label: string;
  detail: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-extrabold text-slate-900">{label}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-[#185FA5]" : "bg-slate-300"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-5" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}
