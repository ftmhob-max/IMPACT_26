"use client";

import { useEffect, useRef } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/LearnerPrimitives";
import { useFormulaCalc } from "./FormulaCalculatorProvider";
import {
  FormulaCalculatorBody,
  FormulaCalculatorModeTabs,
  useFormulaCalculatorShell,
} from "./FormulaCalculatorBody";

export function FormulaCalculatorPanel() {
  const {
    isOpen,
    showSelectorPane,
    sections,
    close,
    toggleSelectorPane,
  } = useFormulaCalc();

  const {
    calcMode,
    setCalcMode,
    engine,
    showSteps,
    activeFormula,
    activeConfig,
    activeFormulaCode,
  } = useFormulaCalculatorShell();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

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

  if (!isOpen) return null;

  const activeSection = sections.find((s) => s.formulas.some((f) => f.code === activeFormulaCode));

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" aria-hidden="true" onClick={close} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Formula Calculator"
        aria-labelledby="fcpanel-title"
        tabIndex={-1}
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-white outline-none",
          "sm:inset-auto sm:left-1/2 sm:top-[5vh] sm:mb-8 sm:-translate-x-1/2",
          "sm:w-full sm:max-w-[600px] sm:rounded-2xl sm:shadow-2xl sm:ring-1 sm:ring-black/10",
          "sm:max-h-[90vh]"
        )}
      >
        <div className="shrink-0 border-b border-slate-100">
          <div className="flex items-start justify-between gap-3 px-5 py-3">
            <div className="min-w-0 flex-1">
              {calcMode === "formula" && activeSection && (
                <StatusBadge tone="blue" className="mb-1">{activeSection.code}</StatusBadge>
              )}
              <h2 id="fcpanel-title" className="text-sm font-extrabold leading-snug text-slate-900">
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
          <FormulaCalculatorModeTabs
            calcMode={calcMode}
            onSetCalcMode={setCalcMode}
            className="gap-0 border-t border-slate-100 [&_button]:py-2 [&_button]:text-[11px] [&_button]:capitalize"
          />
        </div>

        <FormulaCalculatorBody
          engine={engine}
          activeFormula={activeFormula}
          activeConfig={activeConfig}
          showSelectorPane={showSelectorPane}
          showSteps={showSteps}
          calcMode={calcMode}
          onToggleSelector={toggleSelectorPane}
          variant="panel"
        />
      </div>
    </>
  );
}
