"use client";

import { cn } from "@/lib/utils";
import type { EvaluationResult } from "@/lib/quiz-engine/evaluate";

interface AnswerPanelProps {
  result: EvaluationResult;
  isOpen: boolean;
}

export function AnswerPanel({ result, isOpen }: AnswerPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="answer-panel mt-1 rounded-[7px] border border-[rgba(0,0,0,0.11)] bg-[#f8f7f4] overflow-hidden">
      {/* Per-choice breakdown */}
      {result.choices.length > 0 && (
        <div className="px-3.5 py-2.5 border-b border-[rgba(0,0,0,0.11)] space-y-2">
          <p className="text-[9.5px] font-extrabold uppercase tracking-[0.07em] text-[#888880]">
            Correct Answer
          </p>
          {result.choices.map((choice) => (
            <div
              key={choice.letter}
              className={cn(
                "flex gap-3 p-2.5 rounded-md text-sm",
                choice.isCorrect
                  ? "bg-[#EAF3DE] border border-[#3B6D11]"
                  : "bg-slate-50 border border-slate-100"
              )}
            >
              <span
                className={cn(
                  "shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                  choice.isCorrect ? "bg-[#3B6D11] text-white" : "bg-slate-300 text-slate-600"
                )}
              >
                {choice.letter}
              </span>
              <div className="space-y-1">
                <p className="font-medium text-[#1a1a18] text-[12.5px]">{choice.choiceText}</p>
                {choice.explanation && (
                  <p className="text-[#4a4a46] text-xs leading-relaxed">{choice.explanation}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calculation */}
      {result.calculation && (
        <div className="px-3.5 py-2.5 border-b border-[rgba(0,0,0,0.11)]">
          <p className="text-[9.5px] font-extrabold uppercase tracking-[0.07em] text-[#888880] mb-1">
            Step-by-step Calculation
          </p>
          <pre className="font-calc text-[#1a1a18] whitespace-pre-wrap text-[11.5px] leading-[1.85] bg-white px-3 py-2.5 rounded border border-[rgba(0,0,0,0.11)]">
            {result.calculation}
          </pre>
        </div>
      )}

      {/* Rationale */}
      {result.rationale && (
        <div className="px-3.5 py-2.5 border-b border-[rgba(0,0,0,0.11)]">
          <p className="text-[9.5px] font-extrabold uppercase tracking-[0.07em] text-[#888880] mb-1">
            Rationale
          </p>
          <p className="text-[12.5px] text-[#4a4a46] leading-[1.7]">{result.rationale}</p>
        </div>
      )}

      {/* Source reference */}
      {result.sourceRef && (
        <div className="px-3.5 py-2.5">
          <p className="text-[9.5px] font-extrabold uppercase tracking-[0.07em] text-[#888880] mb-1">
            Source Reference
          </p>
          <p className="text-[12px] italic text-[#4a4a46]">{result.sourceRef}</p>
        </div>
      )}
    </div>
  );
}
