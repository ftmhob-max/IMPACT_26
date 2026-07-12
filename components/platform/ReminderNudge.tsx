// Front-end dashboard reminder cue: components/platform/ReminderNudge.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getReminderStorageKey } from "@/lib/study-reminders";

interface ReminderNudgeProps {
  due: boolean;
  studyGoal: string;
}

export function ReminderNudge({ due, studyGoal }: ReminderNudgeProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedToday = window.localStorage.getItem(
      getReminderStorageKey("dashboard-dismissed", new Date()),
    ) === "true";
    setVisible(due && !dismissedToday);
  }, [due]);

  if (!visible) return null;

  function dismissReminder() {
    window.localStorage.setItem(
      getReminderStorageKey("dashboard-dismissed", new Date()),
      "true",
    );
    setVisible(false);
  }

  return (
    <section
      aria-label="Study reminder"
      className="mb-6 rounded-xl border border-[var(--impact-warning-border)] bg-[var(--impact-warning-bg)] p-4 text-[var(--impact-warning-text)] shadow-sm"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-extrabold">A small study session can restart your rhythm.</p>
          <p className="mt-1 text-sm leading-6">
            Your goal: <span className="font-bold">{studyGoal}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/courses"
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-bold text-white hover:bg-[#134d88]"
          >
            Continue learning
          </Link>
          <button
            type="button"
            onClick={dismissReminder}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--impact-warning-border)] bg-white px-4 py-2 text-sm font-bold hover:bg-white/70"
          >
            Not today
          </button>
        </div>
      </div>
    </section>
  );
}
