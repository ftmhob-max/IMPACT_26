"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuizEngine, type QuizSession } from "@/components/quiz/QuizEngine";
import { QuizResults } from "@/components/quiz/QuizResults";
import { getIdToken } from "@/lib/firebase/auth";

type PageState =
  | { status: "loading" }
  | { status: "quiz"; session: QuizSession }
  | { status: "results"; attemptId: string; scorePct: number; scoreRaw: number; scoreMax: number; passed: boolean | null; domainBreakdown: Record<string, { earned: number; possible: number }> }
  | { status: "error"; message: string };

export default function QuizPage() {
  const params = useParams<{ attemptId: string }>();
  const router = useRouter();
  const attemptId = params.attemptId;

  const [state, setState] = useState<PageState>({ status: "loading" });

  useEffect(() => {
    const stored = sessionStorage.getItem(`quiz-session-${attemptId}`);
    if (stored) {
      try {
        const session: QuizSession = JSON.parse(stored);
        setState({ status: "quiz", session });
        return;
      } catch {}
    }
    setState({ status: "error", message: "Session not found. Please start the quiz again." });
  }, [attemptId]);

  async function handleComplete(completedAttemptId: string) {
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/quiz/attempts/${completedAttemptId}/complete`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to complete");
      const data = await res.json();
      setState({
        status: "results",
        attemptId: completedAttemptId,
        scorePct: data.scorePct,
        scoreRaw: data.scoreRaw,
        scoreMax: data.scoreMax,
        passed: data.passed,
        domainBreakdown: data.domainBreakdown,
      });
      sessionStorage.removeItem(`quiz-session-${attemptId}`);
    } catch {
      setState({ status: "error", message: "Failed to submit exam. Please try again." });
    }
  }

  if (state.status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f8f6] text-sm font-semibold text-slate-500">
        Loading exam…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-20 text-center">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{state.message}</p>
        <button
          onClick={() => router.back()}
          className="rounded-lg border border-[#185FA5] bg-white px-4 py-2 text-sm font-bold text-[#185FA5] hover:bg-[#E6F1FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
        >
          Go back
        </button>
      </div>
    );
  }

  if (state.status === "results") {
    return (
      <QuizResults
        attemptId={state.attemptId}
        scorePct={state.scorePct}
        scoreRaw={state.scoreRaw}
        scoreMax={state.scoreMax}
        passed={state.passed}
        domainBreakdown={state.domainBreakdown}
        onReview={() => router.push(`/quiz/${state.attemptId}/review`)}
        onRetake={() => router.back()}
      />
    );
  }

  return (
    <QuizEngine
      session={state.session}
      onComplete={handleComplete}
      onBack={() => router.back()}
    />
  );
}
