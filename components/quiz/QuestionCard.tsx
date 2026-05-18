"use client";

import { useEffect, useState } from "react";
import { DomainBadge } from "@/components/ui/DomainBadge";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { ChoiceButton } from "./ChoiceButton";
import { AnswerPanel } from "./AnswerPanel";
import { DOMAINS, type Difficulty, type Domain } from "@/lib/utils";
import type { SafeQuestion } from "@/lib/quiz-engine/sanitize";
import type { EvaluationResult } from "@/lib/quiz-engine/evaluate";
import * as Icons from "@/components/ui/Icons";
import { useFormulaCalc } from "@/components/layout/FormulaCalculatorProvider";
import type { GlossaryTermData } from "@/components/lessons/GlossaryTooltip";
import { buildTermsMap } from "@/components/lessons/GlossaryTooltip";
import { GlossaryText } from "@/components/quiz/GlossaryText";

interface QuestionCardProps {
  question: SafeQuestion;
  index: number;
  selectedLetters: string[];
  evaluationResult: EvaluationResult | null;
  isLocked: boolean;
  onSelect: (letter: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  forceOpen?: boolean | null;
  onPeek: () => Promise<EvaluationResult | null>;
  glossaryTerms?: GlossaryTermData[];
}

export function QuestionCard({
  question,
  index,
  selectedLetters,
  evaluationResult,
  isLocked,
  onSelect,
  onSubmit,
  isSubmitting,
  forceOpen,
  onPeek,
  glossaryTerms,
}: QuestionCardProps) {
  const termsMap = glossaryTerms && glossaryTerms.length > 0 ? buildTermsMap(glossaryTerms) : null;
  const [answerPanelOpen, setAnswerPanelOpen] = useState(false);
  const [panelData, setPanelData] = useState<EvaluationResult | null>(null);
  const [isPeeking, setIsPeeking] = useState(false);
  const domainConfig = DOMAINS[question.domain as Domain];

  // Get calculator context (may be null if not inside FormulaCalculatorProvider)
  let calcCtx: ReturnType<typeof useFormulaCalc> | null = null;
  try { calcCtx = useFormulaCalc(); } catch { /* not in provider */ }

  function handleOpenCalculator() {
    if (!calcCtx || calcCtx.calculatorSettings?.enabled === false) return;
    if (question.formulaRef) {
      calcCtx.open(question.formulaRef);
    } else {
      calcCtx.open();
    }
  }

  const canUseCalc =
    calcCtx !== null &&
    calcCtx.calculatorSettings?.enabled !== false &&
    Boolean(question.formulaRef || true); // show button if calc is enabled, even without ref

  // Submission result: auto-open panel and sync panelData (real result wins)
  useEffect(() => {
    if (evaluationResult !== null) {
      setPanelData(evaluationResult);
      // Only auto-open if we have full data (choices/rationale)
      // Sparse data from resumed sessions shouldn't trigger an empty panel auto-open
      if (evaluationResult.choices.length > 0) {
        setAnswerPanelOpen(true);
      }
    }
  }, [evaluationResult]);

  // forceOpen: only affects cards that already have panel data loaded
  // forceOpen: only affects cards that already have panel data loaded
  // (avoids firing 80 network requests automatically, but allows user to trigger them)
  useEffect(() => {
    if (forceOpen === true) {
      if (panelData && panelData.choices.length > 0) {
        setAnswerPanelOpen(true);
      } else if (!isLocked) {
        // Trigger fetch for unanswered cards when "Show all" is clicked
        void handleTogglePanel();
      }
    } else if (forceOpen === false) {
      setAnswerPanelOpen(false);
    }
  }, [forceOpen]);

  // Reset cleanup: wipe panelData when question returns to unanswered state
  useEffect(() => {
    if (evaluationResult === null && !isLocked) {
      setPanelData(null);
      setAnswerPanelOpen(false);
    }
  }, [evaluationResult, isLocked]);

  function getChoiceState(letter: string) {
    if (!evaluationResult) {
      return selectedLetters.includes(letter) ? "selected" : "default";
    }
    const isSelected = selectedLetters.includes(letter);
    const isCorrect = evaluationResult.correctLetters.includes(letter);
    if (isSelected && isCorrect) return "correct";
    if (isSelected && !isCorrect) return "incorrect";
    if (!isSelected && isCorrect) return "missed";
    return "default";
  }

  async function handleTogglePanel() {
    if (answerPanelOpen) {
      setAnswerPanelOpen(false);
      return;
    }
    // Has usable data (full choices, not sparse resumed-session result)?
    const hasData = panelData !== null && panelData.choices.length > 0;
    if (hasData) {
      setAnswerPanelOpen(true);
      return;
    }
    // Fetch — covers: unanswered question, resumed session with empty choices
    setIsPeeking(true);
    try {
      const result = await onPeek();
      if (result) {
        // Prefer real submission data over peek if it arrived while fetching
        setPanelData((current) =>
          current && current.choices.length > 0 ? current : result
        );
        setAnswerPanelOpen(true);
      }
    } finally {
      setIsPeeking(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-lg border border-[rgba(0,0,0,0.11)] bg-white shadow-sm transition-shadow duration-150 hover:shadow-md">
      <div className={`h-[5px] ${domainConfig?.barClass ?? "bar-math"}`} />

      <div className="px-4 pb-3 pt-3.5 sm:px-5">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start">
          <span
            className="w-fit rounded-md px-2 py-1 text-[12px] font-extrabold tabular-nums"
            style={{
              background: domainConfig?.color ? `${domainConfig.color}18` : "#f8f7f4",
              color: domainConfig?.color ?? "#888880",
              border: `1px solid ${domainConfig?.color ?? "#e8e7e0"}40`,
            }}
          >
            Q{index + 1}
          </span>
          <div className="min-w-0 flex-1" data-glossary-container>
            <p className="text-[14px] leading-7 text-[#1a1a18]">
              {termsMap
                ? <GlossaryText text={question.questionText} termsMap={termsMap} />
                : question.questionText}
            </p>
            {question.isMultiselect && (
              <p className="mt-2 text-xs font-semibold text-[#534AB7]">Select all answers that apply.</p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap gap-1.5 sm:max-w-[210px] sm:justify-end">
            <DifficultyBadge difficulty={question.difficulty as Difficulty} />
            <DomainBadge domain={question.domain as Domain} />
            {question.formulaRef && canUseCalc && (
              <button
                type="button"
                onClick={handleOpenCalculator}
                title={`Open ${question.formulaRef} in calculator`}
                className="rounded-full border border-[#b8d7f0] bg-[#f0f7ff] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#185FA5] transition-colors hover:border-[#185FA5] hover:bg-[#E6F1FB] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#185FA5]"
              >
                {question.formulaRef}
              </button>
            )}
            {question.formulaRef && !canUseCalc && (
              <span className="rounded-full border border-[rgba(0,0,0,0.11)] bg-[#f8f7f4] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#888880]">
                {question.formulaRef}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {question.choices.map((choice) => (
            <ChoiceButton
              key={choice.id}
              letter={choice.letter}
              text={
                termsMap
                  ? <GlossaryText text={choice.choiceText} termsMap={termsMap} />
                  : choice.choiceText
              }
              state={getChoiceState(choice.letter)}
              disabled={isLocked}
              onClick={() => !isLocked && onSelect(choice.letter)}
            />
          ))}

          {/* Separator between choices and actions */}
          {(selectedLetters.length > 0 || true) && (
            <hr className="border-[rgba(0,0,0,0.08)] mt-1" />
          )}

          {/* Primary action: Submit */}
          {!isLocked && selectedLetters.length > 0 && (
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="mt-1 w-full rounded-lg bg-[#185FA5] px-4 py-2.5 text-[13px] font-bold text-white transition-colors duration-150 hover:bg-[#0d3d6e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Checking..." : "Submit answer"}
            </button>
          )}

          {/* Secondary actions: Calculator + Show answer side-by-side */}
          <div className="flex gap-2 mt-1">
            {canUseCalc && (
              <button
                type="button"
                onClick={handleOpenCalculator}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-[#b8d7f0] bg-[#f8fbff] px-3 py-1.5 text-[11.5px] font-semibold text-[#185FA5] transition-colors hover:border-[#185FA5] hover:bg-[#E6F1FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
              >
                <Icons.Calculator size={12} />
                {question.formulaRef ? `${question.formulaRef} Calc` : "Calculator"}
              </button>
            )}

            <button
              onClick={handleTogglePanel}
              disabled={isPeeking}
              className={`inline-flex items-center justify-center gap-1.5 rounded-md border px-4 py-1.5 text-[11.5px] font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 disabled:opacity-50 ${canUseCalc ? "flex-1" : ""}`}
              style={
                answerPanelOpen
                  ? { color: "#185FA5", borderColor: "#185FA5", background: "#E6F1FB" }
                  : { color: "#888880", borderColor: "rgba(0,0,0,0.20)", background: "transparent" }
              }
            >
              {isPeeking ? "Loading..." : answerPanelOpen ? "Hide answer" : "Show answer"}
              {!isPeeking && (answerPanelOpen ? <Icons.ChevronUp size={13} /> : <Icons.ChevronRight size={13} />)}
            </button>
          </div>

          {panelData && (
            <AnswerPanel result={panelData} isOpen={answerPanelOpen} />
          )}
        </div>
      </div>
    </article>
  );
}
