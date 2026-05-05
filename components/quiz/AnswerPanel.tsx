"use client";

import { cn } from "@/lib/utils";
import type { EvaluationResult } from "@/lib/quiz-engine/evaluate";

interface AnswerPanelProps {
  result: EvaluationResult;
  isOpen: boolean;
  onToggle: () => void;
}

export function AnswerPanel({ result, isOpen, onToggle }: AnswerPanelProps) {
  const correctLetters = new Set(result.correctLetters);

  return (
    <div className="mt-2 rounded-lg border border-slate-200 overflow-hidden">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium",
          "transition-colors duration-150",
          result.isCorrect
            ? "bg-green-50 text-green-800 hover:bg-green-100"
            : "bg-red-50 text-red-800 hover:bg-red-100"
        )}
      >
        <span className="flex items-center gap-2">
          {result.isCorrect ? (
            <>
              <span className="text-green-600">✓</span>
              Correct — {result.pointsEarned.toFixed(1)} / {result.pointsPossible.toFixed(1)} pts
            </>
          ) : (
            <>
              <span className="text-red-500">✗</span>
              {result.pointsEarned > 0
                ? `Partial credit — ${result.pointsEarned.toFixed(1)} / ${result.pointsPossible.toFixed(1)} pts`
                : "Incorrect"}
            </>
          )}
        </span>
        <span className="text-slate-400">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="bg-white px-4 py-4 space-y-4 border-t border-slate-100">
          {/* Per-choice breakdown */}
          <div className="space-y-2">
            {result.choices.map((choice) => (
              <div
                key={choice.letter}
                className={cn(
                  "flex gap-3 p-2.5 rounded-md text-sm",
                  choice.isCorrect ? "bg-green-50 border border-green-200" : "bg-slate-50 border border-slate-100"
                )}
              >
                <span
                  className={cn(
                    "shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                    choice.isCorrect ? "bg-green-500 text-white" : "bg-slate-300 text-slate-600"
                  )}
                >
                  {choice.letter}
                </span>
                <div className="space-y-1">
                  <p className="font-medium text-slate-800">{choice.choiceText}</p>
                  {choice.explanation && (
                    <p className="text-slate-600 text-xs leading-relaxed">{choice.explanation}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Calculation */}
          {result.calculation && (
            <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Calculation
              </p>
              <pre className="font-calc text-slate-700 whitespace-pre-wrap text-xs">
                {result.calculation}
              </pre>
            </div>
          )}

          {/* Rationale */}
          {result.rationale && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Rationale
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{result.rationale}</p>
            </div>
          )}

          {/* Reference */}
          {result.sourceRef && (
            <p className="text-xs text-slate-400 border-t border-slate-100 pt-2">
              Ref: {result.sourceRef}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
