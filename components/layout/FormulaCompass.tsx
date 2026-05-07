"use client";

import { useMemo, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { IconTile, StatusBadge } from "@/components/ui/LearnerPrimitives";

interface Formula {
  id: string;
  code: string;
  name: string;
  expression: string;
  notes?: string | null;
}

interface FormulaSection {
  id: string;
  code: string;
  title: string;
  formulas: Formula[];
}

interface FormulaCompassProps {
  sections: FormulaSection[];
  initialFavoriteFormulaIds?: string[];
  canFavorite?: boolean;
}

type SortOption = "manual" | "name" | "code";

export function FormulaCompass({
  sections,
  initialFavoriteFormulaIds = [],
  canFavorite = false,
}: FormulaCompassProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id))
  );
  const [search, setSearch] = useState("");
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("manual");
  const [favoriteFormulaIds, setFavoriteFormulaIds] = useState<Set<string>>(
    new Set(initialFavoriteFormulaIds)
  );
  const [busyFavoriteId, setBusyFavoriteId] = useState<string | null>(null);

  function toggleSection(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSectionFilter(id: string) {
    setSelectedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearFilters() {
    setSearch("");
    setSelectedSections(new Set());
    setSortBy("manual");
  }

  async function toggleFavorite(formulaId: string) {
    if (!canFavorite || busyFavoriteId === formulaId) return;
    const isFavorite = favoriteFormulaIds.has(formulaId);
    setBusyFavoriteId(formulaId);

    try {
      const res = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType: "formula", itemId: formulaId }),
      });

      if (!res.ok) return;

      setFavoriteFormulaIds((prev) => {
        const next = new Set(prev);
        if (isFavorite) next.delete(formulaId);
        else next.add(formulaId);
        return next;
      });
    } finally {
      setBusyFavoriteId(null);
    }
  }

  const visibleSections = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sections
      .filter((section) => selectedSections.size === 0 || selectedSections.has(section.id))
      .map((section) => ({
        ...section,
        formulas: [...section.formulas]
          .filter((formula) => {
            if (!query) return true;
            return [formula.name, formula.code, formula.expression, formula.notes ?? ""]
              .join(" ")
              .toLowerCase()
              .includes(query);
          })
          .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "code") return a.code.localeCompare(b.code);
            return 0;
          }),
      }))
      .filter((section) => section.formulas.length > 0);
  }, [search, sections, selectedSections, sortBy]);

  const totalVisible = visibleSections.reduce((sum, section) => sum + section.formulas.length, 0);
  const activeFilterCount = selectedSections.size;
  const hasActiveControls = Boolean(search.trim()) || activeFilterCount > 0 || sortBy !== "manual";

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <IconTile icon={Icons.Calculator} size={16} className="h-9 w-9" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#185FA5]">
                  Formula Compass controls
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Search formulas, narrow to selected sections, and choose how formulas are ordered inside each section.
                </p>
              </div>
              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveControls}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset controls
              </button>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
              <div>
                <label
                  htmlFor="formula-search"
                  className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#185FA5]"
                >
                  Search formulas
                </label>
                <div className="relative mt-2">
                  <input
                    id="formula-search"
                    type="search"
                    placeholder="Try cap rate, COD, RCNLD, assessment ratio..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#185FA5] focus:ring-2 focus:ring-[#E6F1FB]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="formula-sort"
                  className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#185FA5]"
                >
                  Sort formulas
                </label>
                <select
                  id="formula-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#185FA5] focus:ring-2 focus:ring-[#E6F1FB]"
                >
                  <option value="manual">Manual order</option>
                  <option value="name">Name A-Z</option>
                  <option value="code">Code A-Z</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#185FA5]">
                  Filter by section
                </label>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                  {activeFilterCount === 0 ? "All sections" : `${activeFilterCount} selected`}
                </p>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSections(new Set())}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2",
                    activeFilterCount === 0
                      ? "border-[#185FA5] bg-[#185FA5] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5]"
                  )}
                >
                  All sections
                </button>
                {sections.map((section) => {
                  const isActive = selectedSections.has(section.id);
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => toggleSectionFilter(section.id)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2",
                        isActive
                          ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]"
                          : "border-slate-200 bg-white text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5]"
                      )}
                    >
                      {section.code} · {section.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Showing {totalVisible} formulas across {visibleSections.length} sections.
            </p>
          </div>
        </div>
      </div>

      {visibleSections.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
          <Icons.Inbox size={32} className="mx-auto mb-3 text-slate-300" />
          No formulas match the current search and filter settings.
        </div>
      ) : (
        visibleSections.map((section) => {
          const isOpen = openSections.has(section.id) || Boolean(search.trim()) || activeFilterCount > 0;
          return (
            <section key={section.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#F8F7F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-inset"
              >
                <div>
                  <StatusBadge tone="blue" className="mb-2">{section.code}</StatusBadge>
                  <h2 className="text-sm font-extrabold text-slate-900">{section.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                    {section.formulas.length}
                  </span>
                  {isOpen ? (
                    <Icons.ChevronUp size={18} className="text-slate-400" />
                  ) : (
                    <Icons.ChevronDown size={18} className="text-slate-400" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="grid gap-0 border-t border-slate-100 sm:grid-cols-2">
                  {section.formulas.map((formula) => (
                    <article key={formula.id} className="border-b border-slate-100 px-5 py-4 transition-colors hover:bg-[#fbfcfd]">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-xs font-semibold text-[#185FA5]">{formula.code}</p>
                          <h3 className="mt-1 text-sm font-semibold leading-snug text-slate-800">{formula.name}</h3>
                        </div>
                        {canFavorite && (
                          <button
                            type="button"
                            onClick={() => toggleFavorite(formula.id)}
                            disabled={busyFavoriteId === formula.id}
                            aria-pressed={favoriteFormulaIds.has(formula.id)}
                            aria-label={favoriteFormulaIds.has(formula.id) ? "Remove favorite formula" : "Save formula"}
                            className={cn(
                              "inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
                              favoriteFormulaIds.has(formula.id)
                                ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]"
                                : "border-slate-200 bg-white text-slate-400 hover:border-[#185FA5] hover:text-[#185FA5]"
                            )}
                          >
                            <Icons.BookMarked size={15} />
                          </button>
                        )}
                      </div>
                      <p className="font-calc rounded-md border border-[#b8d7f0] bg-[#f8fbff] px-3 py-2 text-[12px] text-slate-800">
                        {formula.expression}
                      </p>
                      {formula.notes && <p className="mt-2 text-xs leading-5 text-slate-500">{formula.notes}</p>}
                    </article>
                  ))}
                </div>
              )}
            </section>
          );
        })
      )}
    </div>
  );
}
