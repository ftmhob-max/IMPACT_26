"use client";

import { useState, useCallback, useEffect } from "react";
import { QuestionCard } from "./QuestionCard";
import { QuizHeader } from "./QuizHeader";
import { Scoreboard } from "./Scoreboard";
import { ProgressBar } from "./ProgressBar";
import { FilterPanel } from "./FilterPanel";
import { FormulaQuickRef, type FormulaSectionData } from "./FormulaQuickRef";
import { FormulaCalculatorPopup } from "./FormulaCalculatorPopup";
import { FormulaCalculatorProvider, useFormulaCalc } from "@/components/layout/FormulaCalculatorProvider";
import type { SafeQuestion } from "@/lib/quiz-engine/sanitize";
import type { EvaluationResult } from "@/lib/quiz-engine/evaluate";
import { getIdToken } from "@/lib/firebase/auth";
import { cn, shuffleArray } from "@/lib/utils";
import * as Icons from "@/components/ui/Icons";
import type { GlossaryTermData } from "@/components/lessons/GlossaryTooltip";
import { buildTermsMap } from "@/components/lessons/GlossaryTooltip";


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
  /** Optional quiz-level calculator settings (from quiz config) */
  calculatorSettingsJson?: string | null;
  /** Whether glossary hover hints are enabled for this quiz */
  glossaryEnabled?: boolean;
}

interface QuizEngineProps {
  session: QuizSession;
  onComplete: (attemptId: string) => void;
  onBack?: () => void;
}

type QuestionState = {
  selectedLetters: string[];
  result: EvaluationResult | null;
  isLocked: boolean;
  isSubmitting: boolean;
};

type DiffFilter = "all" | "easy" | "proficient" | "expert" | "random";

export function QuizEngine({ session, onComplete, onBack }: QuizEngineProps) {
  // Parse calculator settings from quiz config
  let calcSettings = null;
  if (session.calculatorSettingsJson) {
    try { calcSettings = JSON.parse(session.calculatorSettingsJson); } catch { /* ignore */ }
  }
  // Default: calculator enabled, all formulas, always show steps
  if (!calcSettings) {
    calcSettings = { enabled: true, formulaScope: "all", showSteps: "always", recordUsage: false };
  }

  return (
    <FormulaCalculatorProvider calculatorSettings={calcSettings}>
      <QuizEngineInner session={session} onComplete={onComplete} onBack={onBack} />
    </FormulaCalculatorProvider>
  );
}

function QuizEngineInner({ session, onComplete, onBack }: QuizEngineProps) {
  const { isOpen, isMinimized, open, restore, calculatorSettings } = useFormulaCalc();
  const buildInitialState = (): Record<string, QuestionState> => {
    const state: Record<string, QuestionState> = {};
    const answeredSet = new Set(session.answeredQuestionIds);
    for (const q of session.questions) {
      const prevResponse = session.previousResponses.find((r) => r.question.id === q.id);
      state[q.id] = {
        selectedLetters: prevResponse ? JSON.parse(prevResponse.selectedLetters ?? "[]") : [],
        result:
          prevResponse?.isCorrect != null
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

  const buildBlankState = (): Record<string, QuestionState> => {
    const state: Record<string, QuestionState> = {};
    for (const q of session.questions) {
      state[q.id] = { selectedLetters: [], result: null, isLocked: false, isSubmitting: false };
    }
    return state;
  };

  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>(buildInitialState);
  const [isCompleting, setIsCompleting] = useState(false);
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("all");
  const [domainFilters, setDomainFilters] = useState<Set<string>>(new Set());
  const [displayOrder, setDisplayOrder] = useState<string[]>(() => session.questions.map((q) => q.id));
  const [globalPanelState, setGlobalPanelState] = useState<"neutral" | "all-open" | "all-closed">("neutral");
  const [formulaSections, setFormulaSections] = useState<FormulaSectionData[]>([]);
  const [formulasLoading, setFormulasLoading] = useState(true);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTermData[]>([]);

  // Fetch formula sections on mount
  useEffect(() => {
    fetch("/api/quiz/formulas")
      .then((r) => r.json())
      .then((data: FormulaSectionData[]) => setFormulaSections(data))
      .catch(() => {})
      .finally(() => setFormulasLoading(false));
  }, []);

  // Fetch glossary terms when enabled
  useEffect(() => {
    if (!session.glossaryEnabled) return;
    getIdToken()
      .then((token) =>
        fetch("/api/glossary", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
      )
      .then((r) => r.ok ? r.json() : { terms: [] })
      .then((data: { terms: GlossaryTermData[] }) => setGlossaryTerms(data.terms ?? []))
      .catch(() => {});
  }, [session.glossaryEnabled]);

  // Derived state
  const orderedQuestions = displayOrder
    .map((id) => session.questions.find((q) => q.id === id))
    .filter((q): q is SafeQuestion => Boolean(q));

  const visibleQuestions = orderedQuestions.filter((q) => {
    const diffOk = diffFilter === "all" || diffFilter === "random" || q.difficulty === diffFilter;
    const domOk = domainFilters.size === 0 || domainFilters.has(q.domain);
    return diffOk && domOk;
  });

  const answeredCount = Object.values(questionStates).filter((s) => s.isLocked).length;
  const correctCount = Object.values(questionStates).filter((s) => s.result?.isCorrect).length;
  const scorePct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : null;
  const forceOpen: boolean | null =
    globalPanelState === "all-open" ? true : globalPanelState === "all-closed" ? false : null;

  const handleSelect = useCallback(
    (questionId: string, letter: string, isMultiselect: boolean) => {
      const current = questionStates[questionId];
      if (!current) return;

      let next: string[];
      if (isMultiselect) {
        next = current.selectedLetters.includes(letter)
          ? current.selectedLetters.filter((l) => l !== letter)
          : [...current.selectedLetters, letter];
      } else {
        next = [letter];
      }

      setQuestionStates((prev) => ({
        ...prev,
        [questionId]: { ...prev[questionId], selectedLetters: next },
      }));

      void (async () => {
        try {
          const headers = await authHeaders();
          await fetch(`/api/quiz/attempts/${session.attemptId}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...headers },
            body: JSON.stringify({ questionId, selectedLetters: next }),
          });
        } catch (err) {
          console.error("[QuizEngine] Auto-save error:", err);
        }
      })();
    },
    [questionStates, session.attemptId]
  );

  const handleSubmit = useCallback(
    async (questionId: string) => {
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
          body: JSON.stringify({ questionId, selectedLetters: current.selectedLetters }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const message = errorData.error || "Submission failed";
          throw new Error(message);
        }
        const result: EvaluationResult = await res.json();
        setQuestionStates((prev) => ({
          ...prev,
          [questionId]: { ...prev[questionId], result, isLocked: true, isSubmitting: false },
        }));
      } catch (err) {
        console.error("[QuizEngine] handleSubmit error:", err);
        setQuestionStates((prev) => ({
          ...prev,
          [questionId]: { ...prev[questionId], isSubmitting: false },
        }));
      }
    },
    [questionStates, session.attemptId]
  );

  const handlePeek = useCallback(
    async (questionId: string): Promise<EvaluationResult | null> => {
      try {
        const headers = await authHeaders();
        const res = await fetch(
          `/api/quiz/attempts/${session.attemptId}/questions/${questionId}/answer`,
          { headers }
        );
        if (!res.ok) return null;
        return (await res.json()) as EvaluationResult;
      } catch (err) {
        console.error("[QuizEngine] handlePeek error:", err);
        return null;
      }
    },
    [session.attemptId]
  );

  const handleComplete = () => {
    setIsCompleting(true);
    onComplete(session.attemptId);
    // isCompleting stays true; page navigates away on success
  };

  const handleShuffle = () => {
    setDisplayOrder((prev) => shuffleArray([...prev]));
    setDiffFilter("random");
  };

  const handleDiffFilter = (diff: DiffFilter) => {
    if (diff === "random") {
      handleShuffle();
      return;
    }
    setDiffFilter(diff);
  };

  const handleDomainToggle = (domain: string) => {
    if (domain === "all") {
      setDomainFilters(new Set());
      return;
    }
    setDomainFilters((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) next.delete(domain);
      else next.add(domain);
      return next;
    });
  };

  const handleReset = () => {
    setQuestionStates(buildBlankState());
    setGlobalPanelState("neutral");
    setDisplayOrder(session.questions.map((q) => q.id));
    setDiffFilter("all");
    setDomainFilters(new Set());
  };

  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <QuizHeader
        answeredCount={answeredCount}
        total={session.questions.length}
        onShuffle={handleShuffle}
        onShowAll={() => setGlobalPanelState("all-open")}
        onHideAll={() => setGlobalPanelState("all-closed")}
        onReset={handleReset}
        onFinish={handleComplete}
        onBack={onBack}
        isCompleting={isCompleting}
        calculatorLauncher={
          calculatorSettings?.enabled !== false ? (
            <QuizCalculatorLauncherButton
              isOpen={isOpen}
              isMinimized={isMinimized}
              onClick={() => (isOpen ? (isMinimized ? restore() : undefined) : open())}
            />
          ) : null
        }
      />

      <div className="mx-auto max-w-6xl">
        <Scoreboard
          answeredCount={answeredCount}
          correctCount={correctCount}
          scorePct={scorePct}
          visibleCount={visibleQuestions.length}
          total={session.questions.length}
        />
        <FilterPanel
          diffFilter={diffFilter}
          domainFilters={domainFilters}
          onDiffChange={handleDiffFilter}
          onDomainToggle={handleDomainToggle}
        />
        <FormulaQuickRef sections={formulaSections} isLoading={formulasLoading} />

        <div className="flex flex-col gap-4 p-4 sm:p-5">
          {visibleQuestions.length === 0 ? (
            <div className="text-center py-16 text-[#888880]">
              <strong className="block text-[17px] font-bold text-[#4a4a46] mb-1">No questions match</strong>
              <p className="text-sm">Try adjusting your difficulty or domain filters.</p>
            </div>
          ) : (
            visibleQuestions.map((q, idx) => {
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
                  forceOpen={forceOpen}
                  glossaryTerms={glossaryTerms.length > 0 ? glossaryTerms : undefined}
                  onSelect={(letter) => handleSelect(q.id, letter, q.isMultiselect)}
                  onSubmit={() => handleSubmit(q.id)}
                  onPeek={() => handlePeek(q.id)}
                />
              );
            })
          )}
        </div>
      </div>

      <QuizScrollToTopButton />

      {/* Global quiz calculator popup — persists across question navigation */}
      {calculatorSettings?.enabled !== false && <FormulaCalculatorPopup />}
    </div>
  );
}

function QuizScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="scroll-top fixed bottom-5 right-5 z-[100] w-10 h-10 rounded-full text-white flex items-center justify-center text-base transition-all duration-150 hover:-translate-y-0.5"
      style={{ background: "#185FA5", boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}

function QuizCalculatorLauncherButton({
  isOpen,
  isMinimized,
  onClick,
}: {
  isOpen: boolean;
  isMinimized: boolean;
  onClick: () => void;
}) {
  const isActive = isOpen && !isMinimized;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isActive ? "Calculator open" : "Open formula calculator"}
      aria-pressed={isActive}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-1",
        isActive
          ? "border-[#185FA5] bg-[#185FA5] text-white shadow-sm"
          : isOpen && isMinimized
          ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]"
          : "border-slate-200 bg-white text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5]"
      )}
    >
      <Icons.Calculator size={14} />
      <span className="hidden sm:inline">Calculator</span>
      {isOpen && isMinimized && (
        <span className="ml-0.5 rounded-full bg-[#185FA5] px-1.5 py-0.5 text-[9px] font-extrabold text-white leading-none">
          MIN
        </span>
      )}
    </button>
  );
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
