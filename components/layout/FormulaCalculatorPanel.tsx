"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/LearnerPrimitives";
import {
  getFormulaCalculator,
  formatValue,
  type FormulaCalculatorConfig,
  type InputType,
} from "@/lib/formula-calculator";
import { evalExpression } from "@/lib/admin/formula-eval";

interface FormulaSlim {
  id: string;
  code: string;
  name: string;
  expression: string;
  notes?: string | null;
  calcMetaJson?: string | null;
}

interface SectionSlim {
  code: string;
  title: string;
}

interface FormulaCalculatorPanelProps {
  formula: FormulaSlim;
  section: SectionSlim;
  onClose(): void;
}

function parseNum(raw: string, defaultValue?: number): number {
  const n = parseFloat(raw);
  if (isNaN(n)) return defaultValue ?? NaN;
  return n;
}

function InputTypePrefix({ type }: { type: InputType }) {
  if (type === "currency") return <span className="pointer-events-none select-none px-2.5 text-slate-400 text-sm">$</span>;
  if (type === "percentage") return null;
  return null;
}

function InputTypeSuffix({ type }: { type: InputType }) {
  if (type === "percentage") return <span className="pointer-events-none select-none px-2.5 text-slate-400 text-sm">%</span>;
  return null;
}

export function FormulaCalculatorPanel({ formula, section, onClose }: FormulaCalculatorPanelProps) {
  const config = useMemo((): FormulaCalculatorConfig | null => {
    const staticConfig = getFormulaCalculator(formula.code);
    if (staticConfig) return staticConfig;
    if (formula.calcMetaJson) {
      try {
        const meta = JSON.parse(formula.calcMetaJson) as {
          variables: FormulaCalculatorConfig["variables"];
          expression: string;
          output: FormulaCalculatorConfig["output"];
          explanation?: string;
        };
        return {
          variables: meta.variables,
          output: meta.output,
          explanation: meta.explanation,
          compute: (vars) => {
            try { return evalExpression(meta.expression, vars); } catch { return null; }
          },
        };
      } catch { return null; }
    }
    return null;
  }, [formula.code, formula.calcMetaJson]);

  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showWork, setShowWork] = useState(false);
  const [copied, setCopied] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  // Reset state whenever the formula changes
  useEffect(() => {
    setValues({});
    setErrors({});
    setResult(null);
    setCalcError(null);
    setHasCalculated(false);
    setShowWork(false);
    setCopied(false);
    panelRef.current?.focus();
  }, [formula.id]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  }

  function handleReset() {
    setValues({});
    setErrors({});
    setResult(null);
    setCalcError(null);
    setHasCalculated(false);
    setShowWork(false);
    setCopied(false);
  }

  function handleCalculate() {
    if (!config) return;
    const nextErrors: Record<string, string> = {};
    const numVars: Record<string, number> = {};

    for (const variable of config.variables) {
      const raw = values[variable.key] ?? "";
      if (raw.trim() === "") {
        if (variable.required) {
          nextErrors[variable.key] = "This field is required.";
        } else {
          numVars[variable.key] = variable.defaultValue ?? 0;
        }
        continue;
      }
      const n = parseNum(raw, variable.defaultValue);
      if (isNaN(n)) {
        nextErrors[variable.key] = "Enter a valid number.";
        continue;
      }
      if (variable.min !== undefined && n < variable.min) {
        nextErrors[variable.key] = `Must be at least ${variable.min}.`;
        continue;
      }
      numVars[variable.key] = n;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const computed = config.compute(numVars);
    setHasCalculated(true);
    if (computed === null || !isFinite(computed)) {
      setResult(null);
      setCalcError("Cannot compute — check for division by zero or invalid inputs.");
    } else {
      setResult(computed);
      setCalcError(null);
    }
  }

  function handleCopy() {
    if (result === null || !config) return;
    navigator.clipboard.writeText(formatValue(result, config.output.type)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const workSteps =
    config?.showWork && result !== null && hasCalculated
      ? (() => {
          const numVars: Record<string, number> = {};
          for (const v of config.variables) {
            const raw = values[v.key] ?? "";
            numVars[v.key] = raw.trim() === "" ? (v.defaultValue ?? 0) : parseNum(raw, v.defaultValue ?? 0);
          }
          return config.showWork(numVars, result);
        })()
      : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="calc-panel-title"
        tabIndex={-1}
        className="fixed inset-0 z-50 overflow-y-auto bg-white outline-none sm:inset-auto sm:left-1/2 sm:top-8 sm:mb-8 sm:w-full sm:max-w-[560px] sm:-translate-x-1/2 sm:rounded-xl sm:shadow-2xl sm:ring-1 sm:ring-slate-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            <StatusBadge tone="blue" className="mb-1.5">{section.code}</StatusBadge>
            <h2 id="calc-panel-title" className="text-base font-extrabold leading-snug text-slate-900">
              {formula.name}
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">{formula.code}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close calculator"
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
          >
            <Icons.X size={16} />
          </button>
        </div>

        <div className="px-5 pb-8 pt-5 space-y-5">
          {/* Formula expression */}
          <div>
            <p className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.08em] text-[#185FA5]">Formula</p>
            <p className="font-calc rounded-md border border-[#b8d7f0] bg-[#f8fbff] px-3 py-2.5 text-[13px] text-slate-800">
              {formula.expression}
            </p>
          </div>

          {/* No config fallback */}
          {!config ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center">
              <Icons.Calculator size={28} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">Interactive calculator coming soon</p>
              <p className="mt-1 text-xs text-slate-400">
                Use the formula expression above to compute this value manually.
              </p>
            </div>
          ) : (
            <>
              {/* Explanation */}
              {config.explanation && (
                <p className="text-sm italic leading-relaxed text-slate-500">{config.explanation}</p>
              )}

              {/* Input fields */}
              <div>
                <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[#185FA5]">Inputs</p>
                <div className="space-y-3">
                  {config.variables.map((variable) => {
                    const hasError = Boolean(errors[variable.key]);
                    return (
                      <div key={variable.key}>
                        <label
                          htmlFor={`calc-input-${variable.key}`}
                          className="mb-1 block text-xs font-semibold text-slate-700"
                        >
                          {variable.label}
                          {!variable.required && (
                            <span className="ml-1 font-normal text-slate-400">(optional)</span>
                          )}
                        </label>
                        <div
                          className={cn(
                            "flex items-center overflow-hidden rounded-lg border bg-white transition",
                            hasError
                              ? "border-red-400 focus-within:ring-2 focus-within:ring-red-200"
                              : "border-slate-200 focus-within:border-[#185FA5] focus-within:ring-2 focus-within:ring-[#E6F1FB]"
                          )}
                        >
                          <InputTypePrefix type={variable.type} />
                          <input
                            id={`calc-input-${variable.key}`}
                            type="number"
                            inputMode="decimal"
                            step="any"
                            placeholder={variable.placeholder ?? ""}
                            value={values[variable.key] ?? ""}
                            onChange={(e) => handleChange(variable.key, e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleCalculate(); }}
                            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-300"
                            aria-invalid={hasError}
                            aria-describedby={hasError ? `error-${variable.key}` : variable.helperText ? `help-${variable.key}` : undefined}
                          />
                          <InputTypeSuffix type={variable.type} />
                        </div>
                        {hasError ? (
                          <p id={`error-${variable.key}`} className="mt-1 text-xs font-medium text-red-500">
                            {errors[variable.key]}
                          </p>
                        ) : variable.helperText ? (
                          <p id={`help-${variable.key}`} className="mt-1 text-xs text-slate-400">
                            {variable.helperText}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="flex-1 rounded-lg bg-[#185FA5] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#134d88] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
                >
                  Calculate
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
                >
                  Reset
                </button>
              </div>

              {/* Result */}
              {hasCalculated && (
                <div className="rounded-lg border border-slate-200 bg-[#f8fbff] px-5 py-4">
                  {calcError ? (
                    <div className="flex items-start gap-2 text-sm text-red-600">
                      <Icons.AlertCircle size={16} className="mt-0.5 shrink-0" />
                      <p>{calcError}</p>
                    </div>
                  ) : result !== null ? (
                    <>
                      <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#185FA5]">
                        {config.output.label}
                      </p>
                      <p className="mt-1 text-3xl font-extrabold tabular-nums text-slate-900">
                        {formatValue(result, config.output.type)}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
                        >
                          {copied ? (
                            <><Icons.Check size={12} /> Copied!</>
                          ) : (
                            <><Icons.Copy size={12} /> Copy result</>
                          )}
                        </button>
                        {workSteps && (
                          <button
                            type="button"
                            onClick={() => setShowWork((v) => !v)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
                          >
                            {showWork ? <><Icons.ChevronUp size={12} /> Hide work</> : <><Icons.ChevronDown size={12} /> Show work</>}
                          </button>
                        )}
                      </div>

                      {/* Show work */}
                      {showWork && workSteps && (
                        <ol className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                          {workSteps.map((step, i) => (
                            <li key={i} className="flex items-baseline justify-between gap-4 text-xs">
                              <span className="text-slate-500">
                                <span className="mr-1.5 font-bold text-slate-400">{i + 1}.</span>
                                {step.label}
                                <span className="ml-1.5 font-mono text-[10px] text-slate-400">= {step.expression}</span>
                              </span>
                              {step.value !== undefined && (
                                <span className="shrink-0 font-mono font-semibold text-slate-800">
                                  {isFinite(step.value) ? step.value.toLocaleString("en-US", { maximumFractionDigits: 6 }) : "∞"}
                                </span>
                              )}
                            </li>
                          ))}
                        </ol>
                      )}
                    </>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
