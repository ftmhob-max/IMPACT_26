"use client";

import { useEffect, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { useFormulaCalc } from "@/components/layout/FormulaCalculatorProvider";
import { useFormulaCalculationEngine } from "@/lib/hooks/useFormulaCalculationEngine";
import { FormulaVariableHelper } from "@/components/layout/FormulaVariableHelper";
import { FormulaResultPanel } from "@/components/layout/FormulaResultPanel";
import { FormulaSelector } from "@/components/layout/FormulaSelector";
import { BasicCalculator } from "@/components/layout/BasicCalculator";
import type { CalculationHistoryEntry } from "@/components/layout/FormulaCalculatorProvider";

export type CalcMode = "formula" | "basic" | "scientific";

export function useFormulaCalculatorShell() {
  const {
    activeFormula,
    activeConfig,
    activeFormulaCode,
    getValues,
    setValues,
    setResult,
    addToHistory,
    calculatorSettings,
  } = useFormulaCalc();
  const [calcMode, setCalcMode] = useState<CalcMode>("formula");
  const initialValues = activeFormulaCode ? getValues(activeFormulaCode) : {};
  const engine = useFormulaCalculationEngine(activeConfig, initialValues);
  useFormulaCalculatorSessionSync(
    engine,
    activeFormulaCode,
    activeFormula,
    activeConfig,
    setValues,
    setResult,
    addToHistory,
  );
  const showSteps =
    !calculatorSettings ||
    calculatorSettings.showSteps === "always" ||
    (calculatorSettings.showSteps === "after" && engine.hasCalculated);

  return {
    calcMode,
    setCalcMode,
    engine,
    showSteps,
    activeFormula,
    activeConfig,
    activeFormulaCode,
  };
}

export function useFormulaCalculatorSessionSync(
  engine: ReturnType<typeof useFormulaCalculationEngine>,
  activeFormulaCode: string | null,
  activeFormula: ReturnType<typeof useFormulaCalc>["activeFormula"],
  activeConfig: ReturnType<typeof useFormulaCalc>["activeConfig"],
  setValues: ReturnType<typeof useFormulaCalc>["setValues"],
  setResult: ReturnType<typeof useFormulaCalc>["setResult"],
  addToHistory: ReturnType<typeof useFormulaCalc>["addToHistory"]
) {
  useEffect(() => {
    if (!activeFormulaCode) return;
    setValues(activeFormulaCode, engine.values);
  }, [engine.values, activeFormulaCode, setValues]);

  useEffect(() => {
    if (!activeFormulaCode) return;
    setResult(activeFormulaCode, engine.result?.value ?? null);
  }, [engine.result, activeFormulaCode, setResult]);

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
}

export function FormulaCalculatorModeTabs({
  calcMode,
  onSetCalcMode,
  compact = false,
  className,
}: {
  calcMode: CalcMode;
  onSetCalcMode: (mode: CalcMode) => void;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex border-t border-slate-100", className)}>
      {(["formula", "basic", "scientific"] as CalcMode[]).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onSetCalcMode(mode)}
          title={compact ? (mode === "formula" ? "Formula" : mode === "basic" ? "Basic" : "Scientific") : undefined}
          className={cn(
            "flex-1 py-1.5 transition border-b-2",
            compact ? "text-[9px] font-bold uppercase tracking-wider px-1" : "text-[10px] font-bold capitalize",
            calcMode === mode
              ? "border-[#185FA5] text-[#185FA5]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          )}
        >
          {compact
            ? (mode === "formula" ? "F" : mode === "basic" ? "B" : "S")
            : (mode === "formula" ? "Formula" : mode === "basic" ? "Basic" : "Scientific")}
        </button>
      ))}
    </div>
  );
}

export function FormulaCalculatorBody({
  engine,
  activeFormula,
  activeConfig,
  showSelectorPane,
  showSteps,
  calcMode,
  onAttachToAnswer,
  onToggleSelector,
  variant = "popup",
}: {
  engine: ReturnType<typeof useFormulaCalculationEngine>;
  activeFormula: ReturnType<typeof useFormulaCalc>["activeFormula"];
  activeConfig: ReturnType<typeof useFormulaCalc>["activeConfig"];
  showSelectorPane: boolean;
  showSteps: boolean;
  calcMode: CalcMode;
  onAttachToAnswer?: (formatted: string) => void;
  onToggleSelector: () => void;
  variant?: "popup" | "panel";
}) {
  const isPanel = variant === "panel";
  const paddingClass = isPanel ? "px-5 pb-6 pt-4" : "p-4";
  const selectorWidth = isPanel ? "w-56 sm:w-60" : "w-52";

  if (calcMode !== "formula") {
    return (
      <div className={cn("flex-1 overflow-y-auto", isPanel ? "px-4 pb-5 pt-4" : "p-3")}>
        <BasicCalculator isScientific={calcMode === "scientific"} isVisible />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {showSelectorPane && (
        <div className={cn(selectorWidth, "shrink-0 overflow-y-auto border-r border-slate-100 p-3")}>
          <FormulaSelector />
        </div>
      )}

      <div className={cn("min-w-0 flex-1 overflow-y-auto space-y-4", paddingClass)}>
        {!activeFormula ? (
          <div className={cn("flex flex-col items-center justify-center gap-3 text-center", isPanel ? "py-12" : "py-8")}>
            <Icons.Calculator size={isPanel ? 32 : 28} className="text-slate-300" />
            <p className="text-sm font-semibold text-slate-500">No formula selected</p>
            <button
              type="button"
              onClick={onToggleSelector}
              className={cn(
                "rounded-lg bg-[#185FA5] font-bold text-white hover:bg-[#134d88] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]",
                isPanel ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs"
              )}
            >
              Pick a Formula
            </button>
          </div>
        ) : (
          <>
            <p className={cn(
              "font-calc rounded-lg border border-[#b8d7f0] bg-[#f8fbff] text-slate-700",
              isPanel ? "px-3.5 py-3 text-[13px] text-slate-800" : "px-2.5 py-2 text-[12px]"
            )}>
              {activeFormula.expression}
            </p>

            {isPanel && activeFormula.notes && (
              <p className="text-[12px] italic leading-relaxed text-slate-500">{activeFormula.notes}</p>
            )}

            {!activeConfig ? (
              <p className={cn("text-center text-slate-400", isPanel ? "text-sm" : "text-xs py-4")}>
                {isPanel ? "Interactive calculator coming soon. Use the expression above to compute manually." : "No interactive calculator for this formula yet."}
              </p>
            ) : (
              <>
                {isPanel && activeConfig.explanation && (
                  <p className="text-[12px] italic leading-relaxed text-slate-500">{activeConfig.explanation}</p>
                )}

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

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={engine.handleCalculate}
                    className={cn(
                      "flex-1 rounded-lg bg-[#185FA5] font-bold text-white hover:bg-[#134d88] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]",
                      isPanel ? "py-2.5 text-sm focus-visible:ring-offset-2" : "py-2 text-sm"
                    )}
                  >
                    Calculate
                  </button>
                  <button
                    type="button"
                    onClick={engine.handleReset}
                    className={cn(
                      "rounded-lg border border-slate-200 font-bold text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]",
                      isPanel ? "px-4 py-2.5 text-sm focus-visible:ring-offset-2" : "px-3 py-2 text-sm"
                    )}
                  >
                    Reset
                  </button>
                </div>

                {engine.hasCalculated && engine.calcError && (
                  <div
                    role={isPanel ? "alert" : undefined}
                    className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600"
                  >
                    <Icons.AlertCircle size={13} className="mt-0.5 shrink-0" />
                    {engine.calcError}
                  </div>
                )}

                {engine.hasCalculated && engine.result && (
                  <FormulaResultPanel
                    config={activeConfig}
                    values={engine.values}
                    engineResult={engine.result}
                    showStepsDefault={showSteps}
                    copyState={engine.copyState}
                    onCopy={engine.handleCopy}
                    onAttachToAnswer={onAttachToAnswer}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
