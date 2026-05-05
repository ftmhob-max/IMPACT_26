"use client";

import { useState, useCallback } from "react";
import { QuestionCard } from "./QuestionCard";
import type { SafeQuestion } from "@/lib/quiz-engine/sanitize";
import type { EvaluationResult } from "@/lib/quiz-engine/evaluate";
import { getIdToken } from "@/lib/firebase/auth";

export interface QuizSession {
  attemptId: string;
  quizId: string;
  timeLimitSeconds: number | null;
  answeredQuestionIds: string[];
  previousResponses: Array<{
    question: { id: string };
    selectedLetters: string;
    isCorrect: boolean | null;
    pointsEarned: number | null;
    pointsPossible: number | null;
  }>;
  questions: SafeQuestion[];
}

interface QuizEngineProps {
  session: QuizSession;
  onComplete: (attemptId: string) => void;
}

type QuestionState = {
  selectedLetters: string[];
  result: EvaluationResult | null;
  isLocked: boolean;
  isSubmitting: boolean;
};

export function QuizEngine({ session, onComplete }: QuizEngineProps) {
  // Build initial state (pre-populate already-answered questions on resume)
  const buildInitialState = () => {
    const state: Record<string, QuestionState> = {};
    const answeredSet = new Set(session.answeredQuestionIds);

    for (const q of session.questions) {
      const prevResponse = session.previousResponses.find(
        (r) => r.question.id === q.id
      );
      state[q.id] = {
        selectedLetters: prevResponse
          ? JSON.parse(prevResponse.selectedLetters ?? "[]")
          : [],
        result: prevResponse?.isCorrect != null
          ? ({
              isCorrect: prevResponse.isCorrect,
              pointsEarned: prevResponse.pointsEarned ?? 0,
              pointsPossible: prevResponse.pointsPossible ?? 0,
              correctLetters: [],
              choices: [],
              rationale: null,
              calculation: null,
              sourceRef: null,
            } as EvaluationResult)
          : null,
        isLocked: answeredSet.has(q.id),
        isSubmitting: false,
      };
    }
    return state;
  };

  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>(
    buildInitialState
  );
  const [isCompleting, setIsCompleting] = useState(false);

  const answeredCount = Object.values(questionStates).filter((s) => s.isLocked).length;
  const total = session.questions.length;
  const pct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;
  const correctCount = Object.values(questionStates).filter(
    (s) => s.result?.isCorrect
  ).length;

  const handleSelect = useCallback(
    (questionId: string, letter: string, isMultiselect: boolean) => {
      setQuestionStates((prev) => {
        const current = prev[questionId];
        let next: string[];
        if (isMultiselect) {
          next = current.selectedLetters.includes(letter)
            ? current.selectedLetters.filter((l) => l !== letter)
            : [...current.selectedLetters, letter];
        } else {
          next = [letter];
        }
        return { ...prev, [questionId]: { ...current, selectedLetters: next } };
      });

      // Fire-and-forget in-progress save
      void (async () => {
        const headers = await authHeaders();
        await fetch(`/api/quiz/attempts/${session.attemptId}/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...headers },
          body: JSON.stringify({ questionId, selectedLetters: [letter] }),
        }).catch(() => {});
      })();
    },
    [session.attemptId]
  );

  const handleSubmit = useCallback(async (questionId: string) => {
    const current = questionStates[questionId];
    if (!current || current.isLocked || current.selectedLetters.length === 0) return;

    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], isSubmitting: true },
    }));

    try {
      const headers = await authHeaders();
      const res = await fetch(`/api/quiz/attempts/${session.attemptId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          questionId,
          selectedLetters: current.selectedLetters,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      const result: EvaluationResult = await res.json();

      setQuestionStates((prev) => ({
        ...prev,
        [questionId]: { ...prev[questionId], result, isLocked: true, isSubmitting: false },
      }));
    } catch {
      setQuestionStates((prev) => ({
        ...prev,
        [questionId]: { ...prev[questionId], isSubmitting: false },
      }));
    }
  }, [questionStates, session.attemptId]);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const headers = await authHeaders();
      const res = await fetch(`/api/quiz/attempts/${session.attemptId}/complete`, {
        method: "POST",
        headers,
      });
      if (res.ok) {
        onComplete(session.attemptId);
      }
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      {/* Stats bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-3 flex items-center gap-6 text-sm sticky top-4 z-10">
        <div>
          <span className="text-slate-500">Answered </span>
          <span className="font-semibold text-slate-800">{answeredCount}/{total}</span>
        </div>
        <div>
          <span className="text-slate-500">Correct </span>
          <span className="font-semibold text-green-700">{correctCount}</span>
        </div>
        <div>
          <span className="text-slate-500">Score </span>
          <span className="font-semibold text-slate-800">{pct}%</span>
        </div>
        <div className="ml-auto">
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        {answeredCount === total && (
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
          >
            {isCompleting ? "Finishing…" : "Finish Exam"}
          </button>
        )}
      </div>

      {/* Questions */}
      {session.questions.map((q, idx) => {
        const state = questionStates[q.id];
        return (
          <QuestionCard
            key={q.id}
            question={q}
            index={idx}
            selectedLetters={state?.selectedLetters ?? []}
            evaluationResult={state?.result ?? null}
            isLocked={state?.isLocked ?? false}
            isSubmitting={state?.isSubmitting ?? false}
            onSelect={(letter) => handleSelect(q.id, letter, q.isMultiselect)}
            onSubmit={() => handleSubmit(q.id)}
          />
        );
      })}
    </div>
  );
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
