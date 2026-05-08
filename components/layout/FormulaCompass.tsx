"use client";

import { useMemo, useState, type ComponentType } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { IconTile, StatusBadge } from "@/components/ui/LearnerPrimitives";
import { FormulaCalculatorPanel } from "@/components/layout/FormulaCalculatorPanel";
import { useFormulaCalc } from "@/components/layout/FormulaCalculatorProvider";
import { getIdToken } from "@/lib/firebase/auth";

interface Formula {
  id: string;
  code: string;
  name: string;
  expression: string;
  notes?: string | null;
  calcMetaJson?: string | null;
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

  // Use provider for calculator (may be unavailable if rendered without provider)
  let calcCtx: ReturnType<typeof useFormulaCalc> | null = null;
  try { calcCtx = useFormulaCalc(); } catch { /* not in provider */ }

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

  function sectionDisplayTitle(section: FormulaSection) {
    return section.title
      .replace(new RegExp(`^${section.code}\\s*[·:-]\\s*`, "i"), "")
      .trim();
  }

  async function toggleFavorite(formulaId: string) {
    if (!canFavorite || busyFavoriteId === formulaId) return;
    const isFavorite = favoriteFormulaIds.has(formulaId);

    // Optimistic update — flip immediately so the UI responds at once.
    setFavoriteFormulaIds((prev) => {
      const next = new Set(prev);
      if (isFavorite) next.delete(formulaId);
      else next.add(formulaId);
      return next;
    });
    setBusyFavoriteId(formulaId);

    try {
      const token = await getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers,
        body: JSON.stringify({ itemType: "formula", itemId: formulaId }),
      });

      if (!res.ok) {
        // Revert on API failure.
        setFavoriteFormulaIds((prev) => {
          const next = new Set(prev);
          if (isFavorite) next.add(formulaId);
          else next.delete(formulaId);
          return next;
        });
      }
    } catch {
      // Revert on network error.
      setFavoriteFormulaIds((prev) => {
        const next = new Set(prev);
        if (isFavorite) next.add(formulaId);
        else next.delete(formulaId);
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
  const totalFormulas = sections.reduce((sum, section) => sum + section.formulas.length, 0);
  const favoriteCount = favoriteFormulaIds.size;
  const activeFilterCount = selectedSections.size;
  const hasActiveControls = Boolean(search.trim()) || activeFilterCount > 0 || sortBy !== "manual";

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid border-b border-slate-100 sm:grid-cols-3">
          <CompassMetric icon={Icons.ListOrdered} label="Total formulas" value={totalFormulas} />
          <CompassMetric icon={Icons.BookMarked} label="Saved" value={favoriteCount} />
          <CompassMetric icon={Icons.Compass} label="Visible now" value={totalVisible} />
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <IconTile icon={Icons.Calculator} size={16} className="hidden h-9 w-9 sm:flex" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#185FA5]">
                    Formula Compass controls
                  </p>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                    Search formulas, narrow by assessment section, then open the calculator from the formula you need.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={!hasActiveControls}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icons.X size={14} />
                  Reset
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
                    <Icons.Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="formula-search"
                      type="search"
                      placeholder="Try cap rate, COD, RCNLD, assessment ratio..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#185FA5] focus:ring-2 focus:ring-[#E6F1FB]"
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
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#185FA5] focus:ring-2 focus:ring-[#E6F1FB]"
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
                      "rounded-md border px-3 py-1.5 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2",
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
                          "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2",
                          isActive
                            ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]"
                            : "border-slate-200 bg-white text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5]"
                        )}
                      >
                        <span>{section.code}</span>
                        <span className={cn("h-1 w-1 rounded-full", isActive ? "bg-[#185FA5]" : "bg-slate-300")} />
                        <span>{sectionDisplayTitle(section)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-500">
                  Showing <span className="font-bold text-slate-800">{totalVisible}</span> of <span className="font-bold text-slate-800">{totalFormulas}</span> formulas across <span className="font-bold text-slate-800">{visibleSections.length}</span> sections.
                </p>
                {hasActiveControls && (
                  <div className="flex flex-wrap gap-1.5">
                    {search.trim() && <StatusBadge tone="blue">Search active</StatusBadge>}
                    {activeFilterCount > 0 && <StatusBadge tone="slate">{activeFilterCount} sections</StatusBadge>}
                    {sortBy !== "manual" && <StatusBadge tone="purple">Sorted {sortBy}</StatusBadge>}
                  </div>
                )}
              </div>
            </div>
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
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#b8d7f0] bg-[#E6F1FB] text-xs font-extrabold text-[#185FA5]">
                    {section.code}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-extrabold text-slate-900">{sectionDisplayTitle(section)}</h2>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {section.formulas.length} formula{section.formulas.length !== 1 ? "s" : ""} in this view
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 sm:inline-flex">
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
                <div className="grid gap-0 border-t border-slate-100 lg:grid-cols-2 xl:grid-cols-3">
                  {section.formulas.map((formula) => (
                    <article key={formula.id} className="border-b border-slate-100 px-5 py-4 transition-colors hover:bg-[#fbfcfd] lg:border-r lg:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(2n)]:border-r xl:[&:nth-child(3n)]:border-r-0">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-mono text-xs font-extrabold text-[#185FA5]">{formula.code}</p>
                          <h3 className="mt-1 text-sm font-bold leading-snug text-slate-900">{formula.name}</h3>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {calcCtx && (
                            <button
                              type="button"
                              onClick={() => calcCtx!.open(formula.code)}
                              aria-label={`Open calculator for ${formula.name}`}
                              title="Open calculator"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#b8d7f0] bg-white text-[#185FA5] transition hover:bg-[#E6F1FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
                            >
                              <Icons.Calculator size={14} />
                            </button>
                          )}
                          {canFavorite && (
                            <button
                              type="button"
                              onClick={() => toggleFavorite(formula.id)}
                              disabled={busyFavoriteId === formula.id}
                              aria-pressed={favoriteFormulaIds.has(formula.id)}
                              aria-label={favoriteFormulaIds.has(formula.id) ? "Remove favorite formula" : "Save formula"}
                              title={favoriteFormulaIds.has(formula.id) ? "Remove favorite formula" : "Save formula"}
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
                      </div>
                      <p className="font-calc overflow-x-auto rounded-md border border-[#b8d7f0] bg-[#f8fbff] px-3 py-2 text-[12px] text-slate-800">
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

      {/* Modal rendered by FormulaCalculatorPanel when isOpen (driven by provider) */}
      {calcCtx && <FormulaCalculatorPanel />}
    </div>
  );
}

function CompassMetric({
  icon,
  label,
  value,
}: {
  icon: ComponentType<Icons.IconProps>;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <IconTile icon={icon} size={16} className="h-9 w-9" />
      <div>
        <p className="text-xl font-extrabold leading-none tracking-[-0.02em] text-slate-950">{value}</p>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{label}</p>
      </div>
    </div>
  );
}
