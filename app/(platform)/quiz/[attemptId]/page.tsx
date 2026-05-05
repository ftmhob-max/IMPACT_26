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
    // Load the session data from the query params (passed from course page after start)
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
      <div className="flex items-center justify-center h-full py-20 text-slate-400 text-sm">
        Loading exam…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <p className="text-red-600 text-sm">{state.message}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50"
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
    />
  );
}
