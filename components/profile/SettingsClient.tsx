"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconTile, SectionPanel, StatusBadge } from "@/components/ui/LearnerPrimitives";
import * as Icons from "@/components/ui/Icons";

type LearnerProfileSettings = {
  studyReminderEnabled: boolean;
  studyReminderTime: string;
  emailStudyReminders: boolean;
  emailProgressSummary: boolean;
  emailProductUpdates: boolean;
  defaultStudyGoal: string;
  defaultSessionLength: number;
  compactSidebar: boolean;
  reducedMotion: boolean;
  formulaHelperDefaultOpen: boolean;
  calculatorPrecision: string;
  profileVisibility: string;
};

const DEFAULT_SETTINGS: LearnerProfileSettings = {
  studyReminderEnabled: true,
  studyReminderTime: "18:00",
  emailStudyReminders: true,
  emailProgressSummary: true,
  emailProductUpdates: false,
  defaultStudyGoal: "Complete one lesson or quiz",
  defaultSessionLength: 30,
  compactSidebar: false,
  reducedMotion: false,
  formulaHelperDefaultOpen: true,
  calculatorPrecision: "2",
  profileVisibility: "private",
};

export function SettingsClient() {
  const [settings, setSettings] = useState<LearnerProfileSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Unable to load settings.");
        setSettings(payload.settings ?? DEFAULT_SETTINGS);
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
  }

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Unable to save settings.");
      setSettings(payload.settings ?? settings);
      setMessage("Settings saved.");
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
              <ToggleRow
                label="Study reminders"
                detail="Keep a daily prompt available for your preferred study time."
                checked={settings.studyReminderEnabled}
                onChange={(checked) => update("studyReminderEnabled", checked)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Reminder time">
                  <input
                    type="time"
                    value={settings.studyReminderTime}
                    onChange={(event) => update("studyReminderTime", event.target.value)}
                    className="profile-input"
                  />
                </Field>
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

          <SectionPanel title="Notifications" description="Control the learning emails this platform sends.">
            <div className="divide-y divide-slate-100">
              <ToggleRow
                label="Reminder emails"
                detail="Receive a study reminder when reminders are enabled."
                checked={settings.emailStudyReminders}
                onChange={(checked) => update("emailStudyReminders", checked)}
              />
              <ToggleRow
                label="Progress summaries"
                detail="Get occasional recaps of attempt history and focus areas."
                checked={settings.emailProgressSummary}
                onChange={(checked) => update("emailProgressSummary", checked)}
              />
              <ToggleRow
                label="Product updates"
                detail="Hear about new platform capabilities and course improvements."
                checked={settings.emailProductUpdates}
                onChange={(checked) => update("emailProductUpdates", checked)}
              />
            </div>
          </SectionPanel>

          <SectionPanel title="Display and tools" description="Tune the learning interface to your working style.">
            <div className="space-y-5 p-5">
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
              <Field label="Profile visibility">
                <select
                  value={settings.profileVisibility}
                  onChange={(event) => update("profileVisibility", event.target.value)}
                  className="profile-input"
                >
                  <option value="private">Private to you and admins</option>
                  <option value="team">Visible to instructors</option>
                </select>
              </Field>
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
                Edit profile
              </Link>
            </div>
          </SectionPanel>

          <SectionPanel>
            <div className="p-5">
              <StatusBadge tone="blue">Ready to save</StatusBadge>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Changes apply to your learner account and can be adjusted any time.
              </p>
              <button
                type="submit"
                disabled={saving}
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0d3d6e] disabled:cursor-not-allowed disabled:opacity-55"
              >
                {saving ? <Icons.Loader size={15} className="animate-spin" /> : <Icons.Check size={15} />}
                {saving ? "Saving..." : "Save settings"}
              </button>
            </div>
          </SectionPanel>
        </aside>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span>
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
    <label className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4">
      <span className="min-w-0">
        <span className="block text-sm font-extrabold text-slate-900">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{detail}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-slate-300 text-[#185FA5] accent-[#185FA5]"
      />
    </label>
  );
}
