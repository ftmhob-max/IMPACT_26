"use client";

import { useMemo, useRef, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { useFormulaCalc } from "./FormulaCalculatorProvider";
import { hasFormulaCalculatorConfig } from "@/lib/formula-calculator";

/**
 * Formula switching / search panel.
 * Renders as a slide-in pane within the calculator dialog/popup.
 * Consuming components control visibility via showSelectorPane from context.
 */
export function FormulaSelector() {
  const {
    sections,
    sectionsLoading,
    activeFormulaCode,
    switchFormula,
    recentFormulaCodes,
    isFormulaAllowed,
  } = useFormulaCalc();

  const [search, setSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // All formulas flat
  const allFormulas = useMemo(
    () =>
      sections.flatMap((s) =>
        s.formulas.map((f) => ({ ...f, sectionCode: s.code, sectionTitle: s.title, sectionId: s.id }))
      ),
    [sections]
  );

  // Recent formulas resolved
  const recentFormulas = useMemo(
    () =>
      recentFormulaCodes
        .map((code) => allFormulas.find((f) => f.code === code))
        .filter(Boolean) as typeof allFormulas,
    [recentFormulaCodes, allFormulas]
  );

  // Active section's sibling formulas (related)
  const relatedFormulas = useMemo(() => {
    if (!activeFormulaCode) return [];
    const active = allFormulas.find((f) => f.code === activeFormulaCode);
    if (!active) return [];
    return allFormulas
      .filter((f) => f.sectionId === active.sectionId && f.code !== activeFormulaCode)
      .slice(0, 4);
  }, [activeFormulaCode, allFormulas]);

  // Filtered formulas
  const q = search.trim().toLowerCase();
  const filteredFormulas = useMemo(() => {
    let pool = selectedSection
      ? allFormulas.filter((f) => f.sectionId === selectedSection)
      : allFormulas;
    if (q) {
      pool = pool.filter((f) =>
        [f.name, f.code, f.expression, f.notes ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    return pool;
  }, [allFormulas, q, selectedSection]);

  const hasConfig = (formula: (typeof allFormulas)[0]) => hasFormulaCalculatorConfig(formula);

  function FormulaRow({
    formula,
    badge,
  }: {
    formula: (typeof allFormulas)[0];
    badge?: string;
  }) {
    const isActive = formula.code === activeFormulaCode;
    const allowed = isFormulaAllowed(formula.code, formula.id);

    return (
      <button
        type="button"
        disabled={!allowed}
        onClick={() => switchFormula(formula.code)}
        className={cn(
          "flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition",
          isActive
            ? "bg-[#E6F1FB] ring-1 ring-[#185FA5]/20"
            : "hover:bg-slate-50",
          !allowed && "opacity-40 cursor-not-allowed"
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold text-[#185FA5]">{formula.code}</span>
            {badge && (
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">
                {badge}
              </span>
            )}
            {hasConfig(formula) && (
              <span title="Calculator available" className="ml-auto">
                <Icons.Calculator size={10} className="text-emerald-500 shrink-0" />
              </span>
            )}
          </div>
          <p className="truncate text-xs font-medium text-slate-700">{formula.name}</p>
        </div>
        {isActive && <Icons.Check size={14} className="mt-0.5 shrink-0 text-[#185FA5]" />}
      </button>
    );
  }

  if (sectionsLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-sm text-slate-400">Loading formulas…</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <Icons.Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          ref={searchRef}
          type="search"
          placeholder="Search formulas…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-800 outline-none focus:border-[#185FA5] focus:ring-2 focus:ring-[#E6F1FB]"
        />
      </div>

      {/* Section filter chips */}
      {!q && (
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedSection(null)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[10px] font-bold transition",
              selectedSection === null
                ? "border-[#185FA5] bg-[#185FA5] text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5]"
            )}
          >
            All
          </button>
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedSection(s.id === selectedSection ? null : s.id)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[10px] font-bold transition",
                s.id === selectedSection
                  ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]"
                  : "border-slate-200 bg-white text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5]"
              )}
            >
              {s.code}
            </button>
          ))}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto space-y-4">
        {/* Recent */}
        {!q && !selectedSection && recentFormulas.length > 0 && (
          <div>
            <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.09em] text-slate-400">
              Recently Used
            </p>
            <div className="space-y-0.5">
              {recentFormulas.map((f) => (
                <FormulaRow key={f.code} formula={f} />
              ))}
            </div>
          </div>
        )}

        {/* Related (same section) */}
        {!q && !selectedSection && relatedFormulas.length > 0 && (
          <div>
            <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.09em] text-slate-400">
              Related Formulas
            </p>
            <div className="space-y-0.5">
              {relatedFormulas.map((f) => (
                <FormulaRow key={f.code} formula={f} badge={f.sectionCode} />
              ))}
            </div>
          </div>
        )}

        {/* All / filtered */}
        <div>
          {(q || selectedSection) && (
            <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.09em] text-slate-400">
              {filteredFormulas.length} result{filteredFormulas.length !== 1 ? "s" : ""}
            </p>
          )}
          {!q && !selectedSection && (
            <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.09em] text-slate-400">
              All Formulas
            </p>
          )}
          {filteredFormulas.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400">No formulas match.</p>
          ) : (
            <div className="space-y-0.5">
              {filteredFormulas.map((f) => (
                <FormulaRow key={f.code} formula={f} badge={f.sectionCode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
