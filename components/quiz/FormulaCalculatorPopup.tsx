"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { useFormulaCalc } from "@/components/layout/FormulaCalculatorProvider";
import { useFormulaCalculationEngine } from "@/lib/hooks/useFormulaCalculationEngine";
import { FormulaVariableHelper } from "@/components/layout/FormulaVariableHelper";
import { FormulaResultPanel } from "@/components/layout/FormulaResultPanel";
import { FormulaSelector } from "@/components/layout/FormulaSelector";
import { BasicCalculator } from "@/components/layout/BasicCalculator";
import type { CalculationHistoryEntry } from "@/components/layout/FormulaCalculatorProvider";

type CalcMode = "formula" | "basic" | "scientific";

// ── Draggable popup (desktop) / bottom-sheet (mobile) ─────────────────────────

interface PopupPosition { x: number; y: number }

const DEFAULT_POS: PopupPosition = { x: 24, y: 24 }; // distance from bottom-right

/**
 * Floating quiz calculator popup.
 * - Desktop: draggable floating card (bottom-right origin)
 * - Mobile: slide-up bottom sheet
 * - Persists formula + values across quiz question navigation via context
 */
export function FormulaCalculatorPopup({
  onAttachToAnswer,
}: {
  onAttachToAnswer?: (formatted: string) => void;
}) {
  const {
    isOpen,
    isMinimized,
    activeFormula,
    activeConfig,
    activeFormulaCode,
    showSelectorPane,
    getValues,
    setValues,
    setResult,
    addToHistory,
    minimize,
    restore,
    close,
    toggleSelectorPane,
    calculatorSettings,
  } = useFormulaCalc();

  // ── Calculator mode ────────────────────────────────────────────────────────
  const [calcMode, setCalcMode] = useState<CalcMode>("formula");

  // ── Dragging state ─────────────────────────────────────────────────────────
  const [pos, setPos] = useState<PopupPosition>(DEFAULT_POS);
  const dragOrigin = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only drag on the header, not its buttons
    if ((e.target as HTMLElement).closest("button")) return;
    dragOrigin.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    setIsDragging(true);
    e.preventDefault();
  }, [pos]);

  useEffect(() => {
    if (!isDragging) return;
    function onMove(e: MouseEvent) {
      if (!dragOrigin.current) return;
      const dx = e.clientX - dragOrigin.current.mx;
      const dy = e.clientY - dragOrigin.current.my;
      // Cap y so the popup top never slides behind the sticky quiz header (~80px)
      const maxY = window.innerHeight - 120;
      setPos({
        x: Math.max(0, dragOrigin.current.px - dx),
        y: Math.min(maxY, Math.max(0, dragOrigin.current.py - dy)),
      });
    }
    function onUp() {
      dragOrigin.current = null;
      setIsDragging(false);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  // ── Calculation engine ────────────────────────────────────────────────────
  const initialValues = activeFormulaCode ? getValues(activeFormulaCode) : {};
  const engine = useFormulaCalculationEngine(activeConfig, initialValues);

  // Sync values → provider
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

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  const showSteps =
    !calculatorSettings ||
    calculatorSettings.showSteps === "always" ||
    (calculatorSettings.showSteps === "after" && engine.hasCalculated);

  // ── Mobile: bottom sheet ──────────────────────────────────────────────────
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  if (isMobile) {
    return (
      <>
        {/* Mobile overlay backdrop */}
        {!isMinimized && (
          <div
            className="fixed inset-0 z-[205] bg-black/30 sm:hidden"
            aria-hidden="true"
            onClick={minimize}
          />
        )}

        <div
          role="dialog"
          aria-modal="true"
          aria-label="Formula Calculator"
          className={cn(
            "fixed inset-x-0 bottom-0 z-[210] flex flex-col rounded-t-2xl bg-white shadow-2xl ring-1 ring-black/10 transition-transform duration-300 sm:hidden",
            isMinimized ? "translate-y-[calc(100%-3.25rem)]" : "translate-y-0"
          )}
          style={{ maxHeight: "75vh" }}
        >
          <PopupHeader
            activeFormula={activeFormula}
            isMinimized={isMinimized}
            showSelectorPane={showSelectorPane}
            calcMode={calcMode}
            onSetCalcMode={setCalcMode}
            isMobile
            onMinimize={isMinimized ? restore : minimize}
            onClose={close}
            onToggleSelector={toggleSelectorPane}
          />
          {!isMinimized && (
            <PopupBody
              engine={engine}
              activeFormula={activeFormula}
              activeConfig={activeConfig}
              showSelectorPane={showSelectorPane}
              showSteps={showSteps}
              calcMode={calcMode}
              onAttachToAnswer={onAttachToAnswer}
              onToggleSelector={toggleSelectorPane}
            />
          )}
        </div>
      </>
    );
  }

  // ── Desktop: draggable floating card ──────────────────────────────────────
  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="true"
      aria-label="Formula Calculator"
      className={cn(
        "fixed z-[210] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10",
        "hidden sm:flex",
        isDragging ? "select-none cursor-grabbing" : "",
        isMinimized ? "w-72" : "w-96"
      )}
      style={{
        bottom: pos.y,
        right: pos.x,
        maxHeight: isMinimized ? "auto" : "80vh",
        transition: isDragging ? "none" : "width 200ms ease, max-height 200ms ease",
      }}
    >
      <PopupHeader
        activeFormula={activeFormula}
        isMinimized={isMinimized}
        showSelectorPane={showSelectorPane}
        calcMode={calcMode}
        onSetCalcMode={setCalcMode}
        isMobile={false}
        isDraggable
        onMouseDown={onMouseDown}
        onMinimize={isMinimized ? restore : minimize}
        onClose={close}
        onToggleSelector={toggleSelectorPane}
      />
      {!isMinimized && (
        <PopupBody
          engine={engine}
          activeFormula={activeFormula}
          activeConfig={activeConfig}
          showSelectorPane={showSelectorPane}
          showSteps={showSteps}
          calcMode={calcMode}
          onAttachToAnswer={onAttachToAnswer}
          onToggleSelector={toggleSelectorPane}
        />
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function PopupHeader({
  activeFormula,
  isMinimized,
  showSelectorPane,
  calcMode,
  onSetCalcMode,
  isMobile,
  isDraggable,
  onMouseDown,
  onMinimize,
  onClose,
  onToggleSelector,
}: {
  activeFormula: ReturnType<typeof useFormulaCalc>["activeFormula"];
  isMinimized: boolean;
  showSelectorPane: boolean;
  calcMode: CalcMode;
  onSetCalcMode: (m: CalcMode) => void;
  isMobile: boolean;
  isDraggable?: boolean;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMinimize: () => void;
  onClose: () => void;
  onToggleSelector: () => void;
}) {
  return (
    <div className={cn("shrink-0", isMobile && "rounded-t-2xl")}>
      {/* Drag bar */}
      <div
        className={cn(
          "flex items-center gap-2 px-3.5 py-2.5",
          isDraggable && !isMobile ? "cursor-grab active:cursor-grabbing" : ""
        )}
        onMouseDown={isDraggable ? onMouseDown : undefined}
      >
        {isMobile && (
          <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-300" />
        )}

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E6F1FB]">
            <Icons.Calculator size={14} className="text-[#185FA5]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#185FA5]">
              Calculator
            </p>
            {calcMode === "formula" && activeFormula && !isMinimized && (
              <p className="truncate text-[11px] font-semibold text-slate-600">{activeFormula.name}</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {!isMinimized && calcMode === "formula" && (
            <button
              type="button"
              onClick={onToggleSelector}
              aria-pressed={showSelectorPane}
              title="Switch formula"
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]",
                showSelectorPane
                  ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]"
                  : "border-slate-200 text-slate-500 hover:border-[#185FA5] hover:text-[#185FA5]"
              )}
            >
              <Icons.ArrowLeftRight size={12} />
            </button>
          )}
          <button
            type="button"
            onClick={onMinimize}
            aria-label={isMinimized ? "Expand calculator" : "Minimize calculator"}
            title={isMinimized ? "Expand" : "Minimize"}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]"
          >
            {isMinimized ? <Icons.ChevronUp size={13} /> : <Icons.ChevronDown size={13} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close calculator"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-400 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <Icons.X size={13} />
          </button>
        </div>
      </div>

      {/* Mode tabs (hidden when minimized) */}
      {!isMinimized && (
        <div className="flex border-t border-slate-100">
          {(["formula", "basic", "scientific"] as CalcMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onSetCalcMode(mode)}
              className={cn(
                "flex-1 py-1.5 text-[10px] font-bold capitalize transition border-b-2",
                calcMode === mode
                  ? "border-[#185FA5] text-[#185FA5]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              )}
            >
              {mode === "formula" ? "Formula" : mode === "basic" ? "Basic" : "Scientific"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PopupBody({
  engine,
  activeFormula,
  activeConfig,
  showSelectorPane,
  showSteps,
  calcMode,
  onAttachToAnswer,
  onToggleSelector,
}: {
  engine: ReturnType<typeof useFormulaCalculationEngine>;
  activeFormula: ReturnType<typeof useFormulaCalc>["activeFormula"];
  activeConfig: ReturnType<typeof useFormulaCalc>["activeConfig"];
  showSelectorPane: boolean;
  showSteps: boolean;
  calcMode: CalcMode;
  onAttachToAnswer?: (formatted: string) => void;
  onToggleSelector: () => void;
}) {
  // Basic / Scientific mode
  if (calcMode !== "formula") {
    return (
      <div className="flex-1 overflow-y-auto p-3">
        <BasicCalculator isScientific={calcMode === "scientific"} isVisible />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1">
      {/* Selector pane */}
      {showSelectorPane && (
        <div className="w-52 shrink-0 overflow-y-auto border-r border-slate-100 p-3">
          <FormulaSelector />
        </div>
      )}

      {/* Main area */}
      <div className="min-w-0 flex-1 overflow-y-auto p-4 space-y-4">
        {!activeFormula ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <Icons.Calculator size={28} className="text-slate-300" />
            <p className="text-sm font-semibold text-slate-500">No formula selected</p>
            <button
              type="button"
              onClick={onToggleSelector}
              className="rounded-lg bg-[#185FA5] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#134d88] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]"
            >
              Pick a Formula
            </button>
          </div>
        ) : (
          <>
            {/* Formula expression */}
            <div>
              <p className="font-calc rounded-lg border border-[#b8d7f0] bg-[#f8fbff] px-2.5 py-2 text-[12px] text-slate-700">
                {activeFormula.expression}
              </p>
            </div>

            {!activeConfig ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No interactive calculator for this formula yet.
              </p>
            ) : (
              <>
                {/* Inputs */}
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

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={engine.handleCalculate}
                    className="flex-1 rounded-lg bg-[#185FA5] py-2 text-sm font-bold text-white hover:bg-[#134d88] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]"
                  >
                    Calculate
                  </button>
                  <button
                    type="button"
                    onClick={engine.handleReset}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]"
                  >
                    Reset
                  </button>
                </div>

                {/* Calc error */}
                {engine.hasCalculated && engine.calcError && (
                  <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
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
