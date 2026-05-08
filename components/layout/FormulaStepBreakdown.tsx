"use client";

import type { WorkStep } from "@/lib/formula-calculator";

interface FormulaStepBreakdownProps {
  steps: WorkStep[];
}

export function FormulaStepBreakdown({ steps }: FormulaStepBreakdownProps) {
  return (
    <ol className="space-y-2.5" aria-label="Calculation steps">
      {steps.map((step, i) => (
        <li
          key={i}
          className="grid grid-cols-[1.25rem_1fr_auto] items-baseline gap-x-2 gap-y-0.5"
        >
          {/* Step number */}
          <span className="rounded-full bg-[#E6F1FB] text-center text-[10px] font-extrabold text-[#185FA5] leading-[1.25rem] h-5 w-5 shrink-0">
            {i + 1}
          </span>

          {/* Label + expression */}
          <span className="min-w-0">
            <span className="block text-[11.5px] font-semibold text-slate-700">{step.label}</span>
            <span className="font-calc text-[10.5px] text-slate-400">= {step.expression}</span>
          </span>

          {/* Value */}
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
  );
}
