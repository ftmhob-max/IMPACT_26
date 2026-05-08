"use client";

import { cn } from "@/lib/utils";
import type { FormulaVariable, InputType } from "@/lib/formula-calculator";

interface FormulaVariableHelperProps {
  variable: FormulaVariable;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onEnter?: () => void;
  error?: string;
  disabled?: boolean;
}

function Prefix({ type }: { type: InputType }) {
  if (type === "currency")
    return <span className="pointer-events-none select-none px-2.5 text-sm text-slate-400">$</span>;
  return null;
}

function Suffix({ type, unit }: { type: InputType; unit?: string }) {
  if (unit) return <span className="pointer-events-none select-none px-2.5 text-sm text-slate-400">{unit}</span>;
  if (type === "percentage") return <span className="pointer-events-none select-none px-2.5 text-sm text-slate-400">%</span>;
  return null;
}

export function FormulaVariableHelper({
  variable,
  value,
  onChange,
  onBlur,
  onEnter,
  error,
  disabled = false,
}: FormulaVariableHelperProps) {
  const hasError = Boolean(error);
  const inputId = `fcalc-${variable.key}`;
  const errorId = `fcalc-err-${variable.key}`;
  const helpId = `fcalc-help-${variable.key}`;

  return (
    <div>
      {/* Label row */}
      <label htmlFor={inputId} className="mb-1.5 flex items-baseline gap-1.5">
        <span className="text-[12px] font-semibold text-slate-700">{variable.label}</span>
        {!variable.required && (
          <span className="text-[11px] font-normal text-slate-400">(optional)</span>
        )}
        {variable.unit && !["currency", "percentage"].includes(variable.type) && (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {variable.unit}
          </span>
        )}
      </label>

      {/* Input wrapper */}
      <div
        className={cn(
          "flex items-center overflow-hidden rounded-lg border bg-white transition-all duration-150",
          hasError
            ? "border-red-400 ring-2 ring-red-100"
            : "border-slate-200 focus-within:border-[#185FA5] focus-within:ring-2 focus-within:ring-[#E6F1FB]",
          disabled && "opacity-60 cursor-not-allowed bg-slate-50"
        )}
      >
        <Prefix type={variable.type} />
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          step="any"
          placeholder={variable.placeholder ?? ""}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={(e) => { if (e.key === "Enter") onEnter?.(); }}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-300 disabled:cursor-not-allowed"
          aria-invalid={hasError}
          aria-describedby={
            hasError ? errorId : variable.helperText ? helpId : undefined
          }
        />
        <Suffix type={variable.type} unit={variable.unit} />
      </div>

      {/* Helper / error */}
      {hasError ? (
        <p id={errorId} className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-500" role="alert">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
            <path d="M5 0a5 5 0 100 10A5 5 0 005 0zm.5 7.5h-1v-1h1v1zm0-2h-1v-3h1v3z"/>
          </svg>
          {error}
        </p>
      ) : variable.helperText ? (
        <p id={helpId} className="mt-1 text-[11px] leading-relaxed text-slate-400">
          {variable.helperText}
        </p>
      ) : null}
    </div>
  );
}
