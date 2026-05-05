"use client";

import { useState } from "react";
import { DomainBadge } from "@/components/ui/DomainBadge";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { ChoiceButton } from "./ChoiceButton";
import { AnswerPanel } from "./AnswerPanel";
import { DOMAINS, type Domain, type Difficulty } from "@/lib/utils";
import type { SafeQuestion } from "@/lib/quiz-engine/sanitize";
import type { EvaluationResult } from "@/lib/quiz-engine/evaluate";

interface QuestionCardProps {
  question: SafeQuestion;
  index: number;
  selectedLetters: string[];
  evaluationResult: EvaluationResult | null;
  isLocked: boolean; // true once answer is submitted
  onSelect: (letter: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
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
}: QuestionCardProps) {
  const [answerPanelOpen, setAnswerPanelOpen] = useState(false);
  const domainConfig = DOMAINS[question.domain as Domain];

  function getChoiceState(letter: string) {
    if (!evaluationResult) {
      return selectedLetters.includes(letter) ? "selected" : "default";
    }
    const isSelected = selectedLetters.includes(letter);
    const isCorrect = evaluationResult.correctLetters.includes(letter);
    if (isSelected && isCorrect) return "correct";
    if (isSelected && !isCorrect) return "incorrect";
    if (!isSelected && isCorrect) return "missed"; // show missed correct answer
    return "default";
  }

  return (
    <div
      className={`bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden ${domainConfig?.cssClass ?? ""}`}
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400">#{index + 1}</span>
            <DomainBadge domain={question.domain as Domain} />
            <DifficultyBadge difficulty={question.difficulty as Difficulty} />
            {question.formulaRef && (
              <span className="text-xs text-slate-400 font-mono">{question.formulaRef}</span>
            )}
          </div>
          {question.isMultiselect && (
            <span className="shrink-0 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-2 py-0.5">
              Select all that apply
            </span>
          )}
        </div>

        <p className="text-sm text-slate-800 leading-relaxed font-medium">
          {question.questionText}
        </p>
      </div>

      {/* Choices */}
      <div className="px-5 pb-4 space-y-2">
        {question.choices.map((choice) => (
          <ChoiceButton
            key={choice.id}
            letter={choice.letter}
            text={choice.choiceText}
            state={getChoiceState(choice.letter)}
            disabled={isLocked}
            onClick={() => !isLocked && onSelect(choice.letter)}
          />
        ))}

        {/* Submit button (shown until submitted) */}
        {!isLocked && selectedLetters.length > 0 && (
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full mt-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors duration-150"
          >
            {isSubmitting ? "Checking…" : "Submit Answer"}
          </button>
        )}

        {/* Answer panel (shown after submission) */}
        {evaluationResult && (
          <AnswerPanel
            result={evaluationResult}
            isOpen={answerPanelOpen}
            onToggle={() => setAnswerPanelOpen((o) => !o)}
          />
        )}
      </div>
    </div>
  );
}
