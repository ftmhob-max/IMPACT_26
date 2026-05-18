"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getIdToken } from "@/lib/firebase/auth";

interface StartQuizButtonProps {
  quizId: string;
  timeLimitSeconds?: number | null;
  shuffleQuestions?: boolean;
  shuffleChoices?: boolean;
  calculatorSettingsJson?: string | null;
  glossaryEnabled?: boolean;
  label?: string;
}

export function StartQuizButton({
  quizId,
  timeLimitSeconds = null,
  shuffleQuestions = false,
  shuffleChoices = false,
  calculatorSettingsJson = null,
  glossaryEnabled = false,
  label = "Start practice exam",
}: StartQuizButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleStart() {
    setLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/quiz/${quizId}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ timeLimitSeconds, shuffleQuestions, shuffleChoices, calculatorSettingsJson, glossaryEnabled }),
      });

      if (res.status === 401) {
        router.push(`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("[StartQuizButton] start failed", data);
        throw new Error(data.error ?? `Server error ${res.status}`);
      }

      const session = await res.json();
      sessionStorage.setItem(`quiz-session-${session.attemptId}`, JSON.stringify(session));
      router.push(`/quiz/${session.attemptId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start exam");
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-2 sm:max-w-xs">
      <button
        onClick={handleStart}
        disabled={loading}
        className="w-full rounded-lg bg-[#185FA5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0d3d6e] disabled:opacity-60"
      >
        {loading ? "Starting..." : label}
      </button>
      {error && <p className="text-center text-xs text-red-600">{error}</p>}
    </div>
  );
}
