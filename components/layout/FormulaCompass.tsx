"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/LearnerPrimitives";
import { FormulaCalculatorPanel } from "@/components/layout/FormulaCalculatorPanel";
import { FormulaCalculatorPopup } from "@/components/quiz/FormulaCalculatorPopup";
import { useFormulaCalc } from "@/components/layout/FormulaCalculatorProvider";
import { getIdToken } from "@/lib/firebase/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Formula {
  id: string;
  code: string;
  name: string;
  expression: string;
  notes?: string | null;
  calcMetaJson?: string | null;
  examplesJson?: string | null;
}

type ExampleDifficulty = "easy" | "proficient" | "expert";

interface FormulaExample {
  difficulty: ExampleDifficulty;
  steps: string[];
  summary?: string;
}

interface FormulaExamplesData {
  easy?: FormulaExample;
  proficient?: FormulaExample;
  expert?: FormulaExample;
}

function parseExamples(json: string | null | undefined): FormulaExamplesData | null {
  if (!json) return null;
  try { return JSON.parse(json) as FormulaExamplesData; } catch { return null; }
}

const EXAMPLE_DIFFICULTY_CONFIG: Array<{
  key: ExampleDifficulty;
  label: string;
  activeBg: string;
  activeText: string;
  inactiveText: string;
}> = [
  { key: "easy", label: "Easy", activeBg: "bg-emerald-600", activeText: "text-white", inactiveText: "text-emerald-700" },
  { key: "proficient", label: "Proficient", activeBg: "bg-amber-500", activeText: "text-white", inactiveText: "text-amber-700" },
  { key: "expert", label: "Expert", activeBg: "bg-purple-600", activeText: "text-white", inactiveText: "text-purple-700" },
];

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
type CompassMode = "browse" | "drill";
type DrillVerdict = "mastered" | "practice";

// ─── Mastery helpers ──────────────────────────────────────────────────────────

const MASTERY_KEY = "impact_formula_mastery_v1";

function loadMastery(): Record<string, DrillVerdict> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(MASTERY_KEY) ?? "{}"); } catch { return {}; }
}
function saveMastery(m: Record<string, DrillVerdict>) {
  try { localStorage.setItem(MASTERY_KEY, JSON.stringify(m)); } catch { /* ignore */ }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FormulaCompass({
  sections,
  initialFavoriteFormulaIds = [],
  canFavorite = false,
}: FormulaCompassProps) {
  // ── Browse state ──────────────────────────────────────────────────────────
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(sections.map((s) => s.id)));
  const [search, setSearch] = useState("");
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("manual");
  const [favoriteFormulaIds, setFavoriteFormulaIds] = useState<Set<string>>(new Set(initialFavoriteFormulaIds));
  const [busyFavoriteId, setBusyFavoriteId] = useState<string | null>(null);

  // ── Mode ──────────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<CompassMode>("browse");

  // ── Drill state ───────────────────────────────────────────────────────────
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillRevealed, setDrillRevealed] = useState(false);
  const [mastery, setMastery] = useState<Record<string, DrillVerdict>>(loadMastery);
  const [drillSectionId, setDrillSectionId] = useState<string | null>(null); // null = all

  // ── Calculator context ─────────────────────────────────────────────────────
  let calcCtx: ReturnType<typeof useFormulaCalc> | null = null;
  try { calcCtx = useFormulaCalc(); } catch { /* not in provider */ }

  // ── Derived data ───────────────────────────────────────────────────────────
  const allFormulas = useMemo(
    () => sections.flatMap((s) => s.formulas.map((f) => ({ ...f, sectionCode: s.code, sectionId: s.id }))),
    [sections]
  );

  const drillFormulas = useMemo(() => {
    if (drillSectionId) {
      const sec = sections.find((s) => s.id === drillSectionId);
      return sec ? sec.formulas.map((f) => ({ ...f, sectionCode: sec.code, sectionId: sec.id })) : allFormulas;
    }
    return allFormulas;
  }, [allFormulas, drillSectionId, sections]);

  const masteredCount = drillFormulas.filter((f) => mastery[f.id] === "mastered").length;
  const totalDrill = drillFormulas.length;

  // Keep drillIndex in bounds when drillFormulas changes
  const boundedDrillIndex = Math.min(drillIndex, Math.max(0, drillFormulas.length - 1));

  // ── Browse visible sections ────────────────────────────────────────────────
  const visibleSections = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sections
      .filter((s) => selectedSections.size === 0 || selectedSections.has(s.id))
      .map((s) => ({
        ...s,
        formulas: [...s.formulas]
          .filter((f) => {
            if (!query) return true;
            return [f.name, f.code, f.expression, f.notes ?? ""].join(" ").toLowerCase().includes(query);
          })
          .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "code") return a.code.localeCompare(b.code);
            return 0;
          }),
      }))
      .filter((s) => s.formulas.length > 0);
  }, [search, sections, selectedSections, sortBy]);

  const totalVisible = visibleSections.reduce((sum, s) => sum + s.formulas.length, 0);
  const hasActiveControls = Boolean(search.trim()) || selectedSections.size > 0 || sortBy !== "manual";

  // ── Mastery actions ────────────────────────────────────────────────────────
  function setVerdict(formulaId: string, verdict: DrillVerdict) {
    setMastery((prev) => {
      const next = { ...prev, [formulaId]: verdict };
      saveMastery(next);
      return next;
    });
    // Advance to next
    setDrillIndex((i) => Math.min(i + 1, drillFormulas.length - 1));
    setDrillRevealed(false);
  }

  function resetMastery() {
    setMastery({});
    saveMastery({});
    setDrillIndex(0);
    setDrillRevealed(false);
  }

  // ── Favorite toggle ────────────────────────────────────────────────────────
  async function toggleFavorite(formulaId: string) {
    if (!canFavorite || busyFavoriteId === formulaId) return;
    const isFavorite = favoriteFormulaIds.has(formulaId);
    setFavoriteFormulaIds((prev) => {
      const next = new Set(prev);
      if (isFavorite) next.delete(formulaId); else next.add(formulaId);
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
        setFavoriteFormulaIds((prev) => {
          const next = new Set(prev);
          if (isFavorite) next.add(formulaId); else next.delete(formulaId);
          return next;
        });
      }
    } catch {
      setFavoriteFormulaIds((prev) => {
        const next = new Set(prev);
        if (isFavorite) next.add(formulaId); else next.delete(formulaId);
        return next;
      });
    } finally {
      setBusyFavoriteId(null);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-0">
      {/* ── Exam-style sticky header ─────────────────────────────────────── */}
      <CompassHeader
        sections={sections}
        mode={mode}
        onSetMode={(m) => { setMode(m); setDrillRevealed(false); setDrillIndex(0); }}
        selectedSections={selectedSections}
        onToggleSection={(id) => {
          setSelectedSections((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
          });
          if (mode === "drill") setDrillSectionId((prev) => prev === id ? null : id);
        }}
        search={search}
        onSearch={setSearch}
        sortBy={sortBy}
        onSort={setSortBy}
        totalVisible={mode === "drill" ? totalDrill : totalVisible}
        totalFormulas={allFormulas.length}
        masteredCount={masteredCount}
        calcCtx={calcCtx}
        hasActiveControls={hasActiveControls}
        onClearFilters={() => { setSearch(""); setSelectedSections(new Set()); setSortBy("manual"); }}
      />

      {/* ── Drill mode ────────────────────────────────────────────────────── */}
      {mode === "drill" && (
        <DrillView
          formulas={drillFormulas}
          index={boundedDrillIndex}
          revealed={drillRevealed}
          mastery={mastery}
          masteredCount={masteredCount}
          onReveal={() => setDrillRevealed(true)}
          onVerdict={(id, v) => setVerdict(id, v)}
          onNavigate={(delta) => {
            setDrillIndex((i) => Math.max(0, Math.min(drillFormulas.length - 1, i + delta)));
            setDrillRevealed(false);
          }}
          onResetMastery={resetMastery}
          canFavorite={canFavorite}
          favoriteFormulaIds={favoriteFormulaIds}
          onToggleFavorite={toggleFavorite}
          busyFavoriteId={busyFavoriteId}
          calcCtx={calcCtx}
        />
      )}

      {/* ── Browse mode ───────────────────────────────────────────────────── */}
      {mode === "browse" && (
        <div className="space-y-4 mt-4">
          {visibleSections.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
              <Icons.Inbox size={32} className="mx-auto mb-3 text-slate-300" />
              No formulas match the current search and filter settings.
            </div>
          ) : (
            visibleSections.map((section) => {
              const isOpen = openSections.has(section.id) || Boolean(search.trim()) || selectedSections.size > 0;
              return (
                <section key={section.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <button
                    onClick={() => {
                      setOpenSections((prev) => {
                        const next = new Set(prev);
                        next.has(section.id) ? next.delete(section.id) : next.add(section.id);
                        return next;
                      });
                    }}
                    className="formula-compass-section-toggle flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#F8F7F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-inset"
                  >
                    <div>
                      <StatusBadge tone="blue" className="mb-2">{section.code}</StatusBadge>
                      <h2 className="text-sm font-extrabold text-slate-900">{section.title}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                        {section.formulas.length}
                      </span>
                      {isOpen ? <Icons.ChevronUp size={18} className="text-slate-400" /> : <Icons.ChevronDown size={18} className="text-slate-400" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="grid gap-0 border-t border-slate-100 sm:grid-cols-2">
                      {section.formulas.map((formula) => (
                        <FormulaCard
                          key={formula.id}
                          formula={formula}
                          isFavorite={favoriteFormulaIds.has(formula.id)}
                          isBusy={busyFavoriteId === formula.id}
                          canFavorite={canFavorite}
                          mastery={mastery[formula.id]}
                          searchQuery={search}
                          calcCtx={calcCtx}
                          onToggleFavorite={() => toggleFavorite(formula.id)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })
          )}
        </div>
      )}

      {/* ── Floating calculator popup (same as quiz engine) ──────────────── */}
      {calcCtx && <FormulaCalculatorPopup />}

      {/* ── Full modal fallback (only when not in provider) ──────────────── */}
      {!calcCtx && <FormulaCalculatorPanel />}
    </div>
  );
}

// ─── Exam-style sticky header ─────────────────────────────────────────────────

function CompassHeader({
  sections,
  mode,
  onSetMode,
  selectedSections,
  onToggleSection,
  search,
  onSearch,
  sortBy,
  onSort,
  totalVisible,
  totalFormulas,
  masteredCount,
  calcCtx,
  hasActiveControls,
  onClearFilters,
}: {
  sections: FormulaSection[];
  mode: CompassMode;
  onSetMode: (m: CompassMode) => void;
  selectedSections: Set<string>;
  onToggleSection: (id: string) => void;
  search: string;
  onSearch: (v: string) => void;
  sortBy: SortOption;
  onSort: (v: SortOption) => void;
  totalVisible: number;
  totalFormulas: number;
  masteredCount: number;
  calcCtx: ReturnType<typeof useFormulaCalc> | null;
  hasActiveControls: boolean;
  onClearFilters: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 rounded-xl overflow-hidden shadow-lg ring-1 ring-black/10">
      {/* Dark blue bar */}
      <div className="bg-[#073866] px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/60">
              IMPACT_26 / Formula Compass
            </p>
            <p className="mt-0.5 text-base font-extrabold leading-tight text-white">
              Assessment Formula Reference
            </p>
            {mode === "drill" ? (
              <p className="mt-0.5 text-[11.5px] text-white/75">
                {masteredCount} of {totalVisible} mastered
                {selectedSections.size > 0 && ` · ${sections.find((s) => selectedSections.has(s.id))?.code ?? "Filtered"} section`}
              </p>
            ) : (
              <p className="mt-0.5 text-[11.5px] text-white/75">
                {totalVisible} of {totalFormulas} formulas
                {hasActiveControls && " · Filters active"}
              </p>
            )}
          </div>

          {/* Mode toggle + calculator button */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Browse / Drill toggle */}
            <div className="flex rounded-lg border border-white/20 overflow-hidden text-[11px] font-bold">
              {(["browse", "drill"] as CompassMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onSetMode(m)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 transition-colors",
                    mode === m ? "bg-white text-[#073866]" : "text-white/80 hover:bg-white/15"
                  )}
                >
                  {m === "browse" ? <Icons.List size={12} /> : <Icons.GraduationCap size={12} />}
                  {m === "browse" ? "Browse" : "Drill"}
                </button>
              ))}
            </div>

            {/* Calculator button — top-right */}
            {calcCtx && (
              <button
                type="button"
                onClick={() => calcCtx!.isOpen ? (calcCtx!.isMinimized ? calcCtx!.restore() : undefined) : calcCtx!.open()}
                title="Open formula calculator"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                  calcCtx.isOpen && !calcCtx.isMinimized
                    ? "border-white/60 bg-white/20 text-white"
                    : "border-white/20 text-white/70 hover:bg-white/15 hover:text-white"
                )}
              >
                <Icons.Calculator size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Section chips — like domain pills in the quiz */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={onClearFilters}
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[10px] font-bold transition-colors",
              selectedSections.size === 0 && !search.trim()
                ? "border-white/60 bg-white/20 text-white"
                : "border-white/20 text-white/60 hover:bg-white/15"
            )}
          >
            All sections
          </button>
          {sections.map((section) => {
            const active = selectedSections.has(section.id);
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onToggleSection(section.id)}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[10px] font-bold transition-colors",
                  active
                    ? "border-white/80 bg-white text-[#073866]"
                    : "border-white/20 text-white/70 hover:bg-white/15"
                )}
              >
                {section.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + sort bar (browse mode only) */}
      {mode === "browse" && (
        <div className="flex flex-wrap gap-2 bg-[#0a4a7a]/90 backdrop-blur px-4 py-2.5 sm:px-5">
          <div className="relative flex-1 min-w-[180px]">
            <Icons.Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="search"
              placeholder="Search formulas…"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 pl-8 text-[12px] text-white placeholder-white/40 outline-none transition focus:border-white/50 focus:bg-white/15"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSort(e.target.value as SortOption)}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-[12px] text-white/80 outline-none focus:border-white/50"
          >
            <option value="manual">Manual order</option>
            <option value="name">Name A-Z</option>
            <option value="code">Code A-Z</option>
          </select>
        </div>
      )}

      {/* Mastery progress bar (drill mode) */}
      {mode === "drill" && totalVisible > 0 && (
        <div className="h-1.5 bg-white/20">
          <div
            className="h-full bg-emerald-400 transition-all duration-500"
            style={{ width: `${(masteredCount / totalVisible) * 100}%` }}
          />
        </div>
      )}
    </header>
  );
}

// ─── Drill / Flash-card view ──────────────────────────────────────────────────

function DrillView({
  formulas,
  index,
  revealed,
  mastery,
  masteredCount,
  onReveal,
  onVerdict,
  onNavigate,
  onResetMastery,
  canFavorite,
  favoriteFormulaIds,
  onToggleFavorite,
  busyFavoriteId,
  calcCtx,
}: {
  formulas: Array<Formula & { sectionCode: string; sectionId: string }>;
  index: number;
  revealed: boolean;
  mastery: Record<string, DrillVerdict>;
  masteredCount: number;
  onReveal: () => void;
  onVerdict: (id: string, verdict: DrillVerdict) => void;
  onNavigate: (delta: number) => void;
  onResetMastery: () => void;
  canFavorite: boolean;
  favoriteFormulaIds: Set<string>;
  onToggleFavorite: (id: string) => void;
  busyFavoriteId: string | null;
  calcCtx: ReturnType<typeof useFormulaCalc> | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation in drill mode
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "ArrowLeft") onNavigate(-1);
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); if (!revealed) onReveal(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  if (formulas.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <Icons.Calculator size={40} className="text-slate-300" />
        <p className="text-sm font-semibold text-slate-500">No formulas to drill. Select a section to get started.</p>
      </div>
    );
  }

  const formula = formulas[index];
  const currentVerdict = mastery[formula.id];
  const allDone = formulas.every((f) => mastery[f.id]);

  return (
    <div className="mt-5 space-y-4">
      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span className="font-semibold">Card {index + 1} of {formulas.length}</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {masteredCount} mastered
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            {formulas.filter((f) => mastery[f.id] === "practice").length} practicing
          </span>
          <button
            type="button"
            onClick={onResetMastery}
            className="text-slate-400 hover:text-slate-700 underline underline-offset-2"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Flash card */}
      <div
        ref={cardRef}
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-white shadow-lg transition-all duration-300",
          currentVerdict === "mastered" ? "border-emerald-300" :
          currentVerdict === "practice" ? "border-amber-300" : "border-slate-200"
        )}
      >
        {/* Card top accent */}
        <div className={cn(
          "h-1.5 w-full",
          currentVerdict === "mastered" ? "bg-emerald-400" :
          currentVerdict === "practice" ? "bg-amber-400" : "bg-[#185FA5]"
        )} />

        <div className="px-6 pb-6 pt-5">
          {/* Formula code + name */}
          <div className="mb-5">
            <span className="font-mono text-xs font-bold text-[#185FA5] tracking-wider">{formula.code}</span>
            <h2 className="mt-1.5 text-xl font-extrabold leading-snug text-slate-900">{formula.name}</h2>
            {currentVerdict && (
              <span className={cn(
                "mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                currentVerdict === "mastered"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              )}>
                {currentVerdict === "mastered" ? <Icons.Check size={11} /> : <Icons.RotateCcw size={11} />}
                {currentVerdict === "mastered" ? "Mastered" : "Still practicing"}
              </span>
            )}
          </div>

          {/* Reveal / expression area */}
          {!revealed ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-8">
              <p className="text-sm text-slate-400">Can you recall this formula?</p>
              <button
                type="button"
                onClick={onReveal}
                className="rounded-lg bg-[#185FA5] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#134d88] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] active:scale-95 transition-all"
              >
                Reveal expression
              </button>
              <p className="text-[11px] text-slate-400">Press Space or Enter to reveal</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Expression */}
              <div className="font-calc rounded-xl border border-[#b8d7f0] bg-[#f8fbff] px-4 py-3 text-[13px] leading-relaxed text-slate-800 shadow-sm">
                {formula.expression}
              </div>

              {/* Notes */}
              {formula.notes && (
                <p className="text-[13px] leading-relaxed text-slate-500 italic">{formula.notes}</p>
              )}

              {/* Tiered examples (drill mode inline) */}
              <DrillExamplesPanel formula={formula} />

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onVerdict(formula.id, "mastered")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-300 bg-emerald-50 py-3 text-sm font-bold text-emerald-700 transition-all hover:bg-emerald-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <Icons.Check size={15} />
                  Got it
                </button>
                <button
                  type="button"
                  onClick={() => onVerdict(formula.id, "practice")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-amber-300 bg-amber-50 py-3 text-sm font-bold text-amber-700 transition-all hover:bg-amber-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <Icons.RotateCcw size={14} />
                  Need review
                </button>
              </div>

              {/* Calculator + favorite row */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                {calcCtx && (
                  <button
                    type="button"
                    onClick={() => calcCtx!.open(formula.code)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#185FA5] hover:bg-[#E6F1FB] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]"
                  >
                    <Icons.Calculator size={12} />
                    Open calculator
                  </button>
                )}
                {canFavorite && (
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(formula.id)}
                    disabled={busyFavoriteId === formula.id}
                    aria-pressed={favoriteFormulaIds.has(formula.id)}
                    aria-label={favoriteFormulaIds.has(formula.id) ? "Remove from saved" : "Save formula"}
                    className={cn(
                      "ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] disabled:opacity-60",
                      favoriteFormulaIds.has(formula.id)
                        ? "text-amber-500"
                        : "text-slate-400 hover:text-amber-400"
                    )}
                  >
                    <Icons.Star size={13} fill={favoriteFormulaIds.has(formula.id) ? "currentColor" : "none"} />
                    {favoriteFormulaIds.has(formula.id) ? "Saved" : "Save"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => onNavigate(-1)}
          disabled={index === 0}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#185FA5] hover:text-[#185FA5] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]"
        >
          <Icons.ChevronLeft size={15} />
          Previous
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {formulas.slice(Math.max(0, index - 3), index + 4).map((f, i) => {
            const abs = Math.max(0, index - 3) + i;
            const v = mastery[f.id];
            return (
              <span
                key={f.id}
                className={cn(
                  "rounded-full transition-all",
                  abs === index ? "h-2.5 w-2.5" : "h-1.5 w-1.5",
                  v === "mastered" ? "bg-emerald-400" :
                  v === "practice" ? "bg-amber-400" :
                  abs === index ? "bg-[#185FA5]" : "bg-slate-200"
                )}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onNavigate(1)}
          disabled={index === formulas.length - 1}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#185FA5] hover:text-[#185FA5] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]"
        >
          Next
          <Icons.ChevronRight size={15} />
        </button>
      </div>

      {/* All done banner */}
      {allDone && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center">
          <p className="text-sm font-bold text-emerald-800">
            🎉 All {formulas.length} formulas reviewed!
          </p>
          <p className="mt-1 text-xs text-emerald-700">
            {masteredCount} mastered · {formulas.length - masteredCount} need more practice
          </p>
          <button
            type="button"
            onClick={onResetMastery}
            className="mt-3 rounded-lg border border-emerald-300 bg-white px-4 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Browse mode formula card ─────────────────────────────────────────────────

// ─── Drill examples panel ─────────────────────────────────────────────────────

function DrillExamplesPanel({ formula }: { formula: Formula }) {
  const examplesData = parseExamples(formula.examplesJson);
  const available = EXAMPLE_DIFFICULTY_CONFIG.filter((d) => examplesData?.[d.key]);
  const [active, setActive] = useState<ExampleDifficulty | null>(available[0]?.key ?? null);

  // Reset to first tab when the formula changes
  useEffect(() => {
    setActive(available[0]?.key ?? null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formula.id]);

  if (available.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-200">
        <span className="flex items-center gap-1 px-3 py-2 text-[11px] font-semibold text-slate-500 border-r border-slate-200">
          <Icons.GraduationCap size={11} /> Examples
        </span>
        {available.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setActive((prev) => (prev === d.key ? null : d.key))}
            className={cn(
              "flex-1 py-2 text-[11px] font-bold transition-colors",
              active === d.key
                ? cn(d.activeBg, d.activeText)
                : cn("bg-white text-slate-500 hover:bg-slate-50")
            )}
          >
            {d.label}
          </button>
        ))}
      </div>
      {active && examplesData?.[active] && (
        <div className="px-4 py-3 space-y-2 bg-slate-50">
          <ol className="space-y-2">
            {examplesData[active]!.steps.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-[12px] text-slate-700 leading-relaxed">
                <span className="shrink-0 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {examplesData[active]!.summary && (
            <p className="text-[11px] italic text-slate-500 border-t border-slate-200 pt-2">
              {examplesData[active]!.summary}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Browse formula card ──────────────────────────────────────────────────────

function FormulaCard({
  formula,
  isFavorite,
  isBusy,
  canFavorite,
  mastery,
  searchQuery,
  calcCtx,
  onToggleFavorite,
}: {
  formula: Formula;
  isFavorite: boolean;
  isBusy: boolean;
  canFavorite: boolean;
  mastery?: DrillVerdict;
  searchQuery: string;
  calcCtx: ReturnType<typeof useFormulaCalc> | null;
  onToggleFavorite: () => void;
}) {
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [activeDifficulty, setActiveDifficulty] = useState<ExampleDifficulty>("easy");
  const examplesData = parseExamples(formula.examplesJson);
  const availableDifficulties = EXAMPLE_DIFFICULTY_CONFIG.filter((d) => examplesData?.[d.key]);

  return (
    <article className="formula-compass-card border-b border-slate-100 px-5 py-4 transition-colors hover:bg-[#fbfcfd]">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-mono text-xs font-semibold text-[#185FA5]">{formula.code}</p>
            {mastery === "mastered" && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700 flex items-center gap-1">
                <Icons.Check size={9} /> Mastered
              </span>
            )}
            {mastery === "practice" && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                Practicing
              </span>
            )}
          </div>
          <h3 className="mt-1 text-sm font-semibold leading-snug text-slate-800">{formula.name}</h3>
        </div>
        {canFavorite && (
          <button
            type="button"
            onClick={onToggleFavorite}
            disabled={isBusy}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Remove favorite formula" : "Save formula"}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
              isFavorite
                ? "border-amber-300 bg-amber-50 text-amber-500"
                : "border-slate-200 bg-white text-slate-300 hover:border-amber-300 hover:text-amber-400"
            )}
          >
            <Icons.Star size={15} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      <p className="font-calc rounded-md border border-[#b8d7f0] bg-[#f8fbff] px-3 py-2 text-[12px] text-slate-800">
        {HighlightText(formula.expression, searchQuery)}
      </p>
      {formula.notes && <p className="mt-2 text-xs leading-5 text-slate-500">{formula.notes}</p>}

      {/* Bottom action row */}
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        {calcCtx && (
          <button
            type="button"
            onClick={() => calcCtx.open(formula.code)}
            className="inline-flex items-center gap-1.5 rounded text-xs font-semibold text-[#185FA5] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
          >
            <Icons.Calculator size={12} />
            Calculator
          </button>
        )}
        {availableDifficulties.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setExamplesOpen((v) => !v);
              if (!examplesOpen && availableDifficulties.length > 0) {
                setActiveDifficulty(availableDifficulties[0].key);
              }
            }}
            className="inline-flex items-center gap-1.5 rounded text-xs font-semibold text-slate-500 hover:text-[#185FA5] hover:underline focus-visible:outline-none"
          >
            <Icons.GraduationCap size={12} />
            {examplesOpen ? "Hide examples" : "View examples"}
          </button>
        )}
      </div>

      {/* Examples panel */}
      {examplesOpen && availableDifficulties.length > 0 && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
          {/* Difficulty tabs */}
          <div className="flex border-b border-slate-200">
            {availableDifficulties.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setActiveDifficulty(d.key)}
                className={cn(
                  "flex-1 py-2 text-[11px] font-bold transition-colors",
                  activeDifficulty === d.key
                    ? cn(d.activeBg, d.activeText)
                    : cn("bg-white text-slate-500 hover:bg-slate-50", d.inactiveText)
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
          {/* Steps */}
          {availableDifficulties.map((d) => {
            if (d.key !== activeDifficulty) return null;
            const ex = examplesData![d.key]!;
            return (
              <div key={d.key} className="px-4 py-3 space-y-2">
                <ol className="space-y-2">
                  {ex.steps.map((step, i) => (
                    <li key={i} className="flex gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <span className="shrink-0 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                {ex.summary && (
                  <p className="text-[11px] italic text-slate-500 border-t border-slate-200 pt-2">{ex.summary}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}

// ─── Search highlight helper ──────────────────────────────────────────────────

function HighlightText(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  return (
    <>
      {text.split(regex).map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="rounded bg-[#fff0b8] px-0.5 text-inherit">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
