"use client";

import { useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { formatValue, type FormulaCalculatorConfig } from "@/lib/formula-calculator";
import type { CalcEngineResult } from "@/lib/hooks/useFormulaCalculationEngine";

interface FormulaResultPanelProps {
  config: FormulaCalculatorConfig;
  values: Record<string, string>;
  engineResult: CalcEngineResult;
  showStepsDefault?: boolean;
  copyState: "idle" | "copied";
  onCopy: () => void;
  onAttachToAnswer?: (formatted: string) => void;
}

/**
 * Displays the calculation result with:
 * - Large formatted answer
 * - Input summary
 * - Substituted formula (variables replaced with entered values)
 * - Step-by-step breakdown (toggleable)
 * - Explanation text
 * - Copy / Attach-to-answer actions
 */
export function FormulaResultPanel({
  config,
  values,
  engineResult,
  showStepsDefault = true,
  copyState,
  onCopy,
  onAttachToAnswer,
}: FormulaResultPanelProps) {
  const [showSteps, setShowSteps] = useState(showStepsDefault);
  const [showSummary, setShowSummary] = useState(false);

  const { value, formatted, workSteps } = engineResult;
  const hasSteps = Boolean(workSteps?.length);

  // Build a substituted expression string: replace variable labels with values
  const substitutedExpr = config.variables.reduce((expr, v) => {
    const raw = values[v.key];
    if (!raw || raw.trim() === "") return expr;
    const display =
      v.type === "currency"
        ? `$${parseFloat(raw).toLocaleString("en-US")}`
        : v.type === "percentage"
        ? `${raw}%`
        : raw;
    // Simple label-based substitution as a hint — not full AST parsing
    return expr.replace(new RegExp(`\\b${v.key}\\b`, "g"), display);
  }, config.output.label ?? "Result");

  return (
    <div
      className="rounded-xl border border-[#b8d7f0] bg-gradient-to-b from-[#f0f7ff] to-[#f8fbff] p-4"
      role="status"
      aria-label={`Result: ${formatted}`}
    >
      {/* Answer */}
      <p className="text-[10.5px] font-extrabold uppercase tracking-[0.09em] text-[#185FA5]">
        {config.output.label}
      </p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-[2rem] font-extrabold tabular-nums leading-none text-slate-900">
          {formatted}
        </span>
        {config.output.unit && (
          <span className="text-sm font-semibold text-slate-500">{config.output.unit}</span>
        )}
      </div>

      {/* Actions row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-1"
        >
          {copyState === "copied" ? (
            <><Icons.Check size={12} className="text-emerald-500" /> Copied!</>
          ) : (
            <><Icons.Copy size={12} /> Copy result</>
          )}
        </button>

        {onAttachToAnswer && (
          <button
            type="button"
            onClick={() => onAttachToAnswer(formatted)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#185FA5] bg-[#E6F1FB] px-3 py-1.5 text-xs font-semibold text-[#185FA5] transition hover:bg-[#d0e8f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-1"
          >
            <Icons.ArrowRight size={12} /> Use in answer
          </button>
        )}

        {hasSteps && (
          <button
            type="button"
            onClick={() => setShowSteps((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-1"
          >
            {showSteps ? <Icons.ChevronUp size={12} /> : <Icons.ChevronDown size={12} />}
            {showSteps ? "Hide steps" : "Show steps"}
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowSummary((v) => !v)}
          className="ml-auto inline-flex items-center gap-1 text-[10.5px] font-medium text-slate-400 hover:text-slate-600 focus-visible:outline-none"
        >
          {showSummary ? "Hide inputs" : "Show inputs"}
          {showSummary ? <Icons.ChevronUp size={10} /> : <Icons.ChevronDown size={10} />}
        </button>
      </div>

      {/* Input summary */}
      {showSummary && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-xs">
            <caption className="sr-only">Entered values</caption>
            <tbody>
              {config.variables.map((v) => {
                const raw = values[v.key];
                if (!raw || raw.trim() === "") return null;
                return (
                  <tr key={v.key} className="border-b border-slate-100 last:border-0">
                    <td className="py-1.5 pl-3 font-medium text-slate-500">{v.label}</td>
                    <td className="py-1.5 pr-3 text-right font-semibold tabular-nums text-slate-800">
                      {v.type === "currency" ? `$${parseFloat(raw).toLocaleString()}` : v.type === "percentage" ? `${raw}%` : raw}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Step-by-step breakdown */}
      {hasSteps && showSteps && workSteps && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <p className="mb-2.5 text-[10px] font-extrabold uppercase tracking-[0.09em] text-slate-400">
            How it was calculated
          </p>
          <ol className="space-y-2.5" aria-label="Calculation steps">
            {workSteps.map((step, i) => (
              <li
                key={i}
                className="grid grid-cols-[1.25rem_1fr_auto] items-baseline gap-x-2 gap-y-0.5"
              >
                <span className="rounded-full bg-[#E6F1FB] text-center text-[10px] font-extrabold text-[#185FA5] leading-[1.25rem] h-5 w-5 shrink-0">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[11.5px] font-semibold text-slate-700">{step.label}</span>
                  <span className="font-calc text-[10.5px] text-slate-400">= {step.expression}</span>
                </span>
                {step.value !== undefined && (
                  <span className="shrink-0 font-mono text-[12px] font-bold text-slate-800 tabular-nums">
                    {isFinite(step.value)
                      ? step.value.toLocaleString("en-US", { maximumFractionDigits: 6 })
                      : "∞"}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Explanation */}
      {config.explanation && (
        <div className="mt-4 border-t border-slate-200 pt-3">
          <p className="text-[11px] leading-relaxed text-slate-500 italic">{config.explanation}</p>
        </div>
      )}
    </div>
  );
}
