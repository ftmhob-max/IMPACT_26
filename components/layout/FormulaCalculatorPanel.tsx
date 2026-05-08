"use client";

import { useEffect, useRef, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/LearnerPrimitives";
import { useFormulaCalc } from "./FormulaCalculatorProvider";
import { useFormulaCalculationEngine } from "@/lib/hooks/useFormulaCalculationEngine";
import { FormulaVariableHelper } from "./FormulaVariableHelper";
import { FormulaResultPanel } from "./FormulaResultPanel";
import { FormulaSelector } from "./FormulaSelector";
import { BasicCalculator } from "./BasicCalculator";
import type { CalculationHistoryEntry } from "./FormulaCalculatorProvider";

type CalcMode = "formula" | "basic" | "scientific";

/**
 * Full-screen modal calculator for the Formula Compass page.
 * Reads from FormulaCalculatorProvider — must be rendered inside the provider.
 * Counterpart to FormulaCalculatorPopup (which is used in quizzes).
 */
export function FormulaCalculatorPanel() {
  const {
    isOpen,
    activeFormula,
    activeConfig,
    activeFormulaCode,
    showSelectorPane,
    sections,
    getValues,
    setValues,
    setResult,
    addToHistory,
    close,
    toggleSelectorPane,
    calculatorSettings,
  } = useFormulaCalc();

  const [calcMode, setCalcMode] = useState<CalcMode>("formula");

  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // ── Focus trap ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    firstFocusableRef.current?.focus();

    function trapTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus(); e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus(); e.preventDefault();
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      trapTab(e);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // ── Calculation engine ──────────────────────────────────────────────────────
  const initialValues = activeFormulaCode ? getValues(activeFormulaCode) : {};
  const engine = useFormulaCalculationEngine(activeConfig, initialValues);

  // Sync values → provider (sessionStorage persistence)
  useEffect(() => {
    if (!activeFormulaCode) return;
    setValues(activeFormulaCode, engine.values);
  }, [engine.values, activeFormulaCode, setValues]);

  // Sync result → provider
  useEffect(() => {
    if (!activeFormulaCode) return;
    setResult(activeFormulaCode, engine.result?.value ?? null);
  }, [engine.result, activeFormulaCode, setResult]);

  // Add to history on successful calculation
  useEffect(() => {
    if (!engine.result || !activeFormula || !activeConfig) return;
    const entry: CalculationHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
      formulaCode: activeFormula.code,
      formulaName: activeFormula.name,
      expressionText: activeFormula.expression,
      values: { ...engine.values },
      result: engine.result.value,
      formattedResult: engine.result.formatted,
      outputLabel: activeConfig.output.label,
    };
    addToHistory(entry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.result]);

  if (!isOpen) return null;

  // Active section for the formula badge
  const activeSection = sections.find((s) =>
    s.formulas.some((f) => f.code === activeFormulaCode)
  );

  const showSteps =
    !calculatorSettings ||
    calculatorSettings.showSteps === "always" ||
    (calculatorSettings.showSteps === "after" && engine.hasCalculated);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={close}
      />

      {/* Panel — full-screen on mobile, centered modal on desktop */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Formula Calculator"
        aria-labelledby="fcpanel-title"
        tabIndex={-1}
        className={cn(
          // Mobile: full screen
          "fixed inset-0 z-50 flex flex-col bg-white outline-none",
          // Desktop: centered modal
          "sm:inset-auto sm:left-1/2 sm:top-[5vh] sm:mb-8 sm:-translate-x-1/2",
          "sm:w-full sm:max-w-[600px] sm:rounded-2xl sm:shadow-2xl sm:ring-1 sm:ring-black/10",
          // Max height
          "sm:max-h-[90vh]"
        )}
      >
        {/* Header */}
        <div className="shrink-0 border-b border-slate-100">
          <div className="flex items-start justify-between gap-3 px-5 py-3">
            <div className="min-w-0 flex-1">
              {calcMode === "formula" && activeSection && (
                <StatusBadge tone="blue" className="mb-1">{activeSection.code}</StatusBadge>
              )}
              <h2
                id="fcpanel-title"
                className="text-sm font-extrabold leading-snug text-slate-900"
              >
                {calcMode === "formula"
                  ? (activeFormula?.name ?? "Formula Calculator")
                  : calcMode === "scientific" ? "Scientific Calculator" : "Basic Calculator"}
              </h2>
              {calcMode === "formula" && activeFormula && (
                <p className="font-mono text-[10px] text-slate-400">{activeFormula.code}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
              {calcMode === "formula" && (
                <button
                  ref={firstFocusableRef}
                  type="button"
                  onClick={toggleSelectorPane}
                  aria-pressed={showSelectorPane}
                  title="Switch formula"
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-1",
                    showSelectorPane
                      ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]"
                      : "border-slate-200 text-slate-500 hover:border-[#185FA5] hover:text-[#185FA5]"
                  )}
                >
                  <Icons.ArrowLeftRight size={12} />
                </button>
              )}
              <button
                ref={calcMode !== "formula" ? firstFocusableRef : undefined}
                type="button"
                onClick={close}
                aria-label="Close calculator"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-400 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
              >
                <Icons.X size={14} />
              </button>
            </div>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-0 border-t border-slate-100">
            {(["formula", "basic", "scientific"] as CalcMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setCalcMode(mode)}
                className={cn(
                  "flex-1 py-2 text-[11px] font-bold capitalize transition border-b-2",
                  calcMode === mode
                    ? "border-[#185FA5] text-[#185FA5]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                )}
              >
                {mode === "formula" ? "Formula" : mode === "basic" ? "Basic" : "Scientific"}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Basic / Scientific calculator */}
          {calcMode !== "formula" && (
            <div className="flex-1 overflow-y-auto px-4 pb-5 pt-4">
              <BasicCalculator isScientific={calcMode === "scientific"} isVisible={isOpen} />
            </div>
          )}

          {/* Formula mode: selector pane + main area */}
          {calcMode === "formula" && showSelectorPane && (
            <div className="w-56 shrink-0 overflow-y-auto border-r border-slate-100 p-3 sm:w-60">
              <FormulaSelector />
            </div>
          )}

          {/* Formula mode — main calculator area */}
          {calcMode === "formula" && <div className="min-w-0 flex-1 overflow-y-auto px-5 pb-6 pt-4 space-y-4">
            {!activeFormula ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <Icons.Calculator size={32} className="text-slate-300" />
                <p className="text-sm font-semibold text-slate-500">No formula selected</p>
                <button
                  type="button"
                  onClick={toggleSelectorPane}
                  className="rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-bold text-white hover:bg-[#134d88] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]"
                >
                  Pick a Formula
                </button>
              </div>
            ) : (
              <>
                {/* Formula expression */}
                <p className="font-calc rounded-lg border border-[#b8d7f0] bg-[#f8fbff] px-3.5 py-3 text-[13px] text-slate-800">
                  {activeFormula.expression}
                </p>

                {/* Notes / explanation */}
                {activeFormula.notes && (
                  <p className="text-[12px] italic leading-relaxed text-slate-500">
                    {activeFormula.notes}
                  </p>
                )}

                {!activeConfig ? (
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center">
                    <Icons.Calculator size={26} className="text-slate-300" />
                    <p className="text-sm font-semibold text-slate-500">Interactive calculator coming soon</p>
                    <p className="text-xs text-slate-400">Use the expression above to compute manually.</p>
                  </div>
                ) : (
                  <>
                    {/* Config explanation */}
                    {activeConfig.explanation && (
                      <p className="text-[12px] italic leading-relaxed text-slate-500">
                        {activeConfig.explanation}
                      </p>
                    )}

                    {/* Input fields */}
                    <div className="space-y-3">
                      {activeConfig.variables.map((variable) => (
                        <FormulaVariableHelper
                          key={variable.key}
                          variable={variable}
                          value={engine.values[variable.key] ?? ""}
                          onChange={(val) => engine.handleChange(variable.key, val)}
                          onBlur={() => engine.handleBlurValidate(variable.key)}
                          onEnter={engine.handleCalculate}
                          error={engine.errors[variable.key]}
                        />
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={engine.handleCalculate}
                        className="flex-1 rounded-lg bg-[#185FA5] py-2.5 text-sm font-bold text-white transition hover:bg-[#134d88] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
                      >
                        Calculate
                      </button>
                      <button
                        type="button"
                        onClick={engine.handleReset}
                        className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
                      >
                        Reset
                      </button>
                    </div>

                    {/* Calculation error */}
                    {engine.hasCalculated && engine.calcError && (
                      <div
                        role="alert"
                        className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600"
                      >
                        <Icons.AlertCircle size={13} className="mt-0.5 shrink-0" />
                        {engine.calcError}
                      </div>
                    )}

                    {/* Result */}
                    {engine.hasCalculated && engine.result && (
                      <FormulaResultPanel
                        config={activeConfig}
                        values={engine.values}
                        engineResult={engine.result}
                        showStepsDefault={showSteps}
                        copyState={engine.copyState}
                        onCopy={engine.handleCopy}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>}
        </div>
      </div>
    </>
  );
}
