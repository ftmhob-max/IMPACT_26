"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin/client-fetch";
import { validateExpression, evalExpression } from "@/lib/admin/formula-eval";
import { getFormulaCalculator, formatValue } from "@/lib/formula-calculator";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/LearnerPrimitives";

// ─── Types ────────────────────────────────────────────────────────────────────

type InputType = "currency" | "percentage" | "number" | "ratio" | "integer";

interface CalcVariable {
  key: string;
  label: string;
  type: InputType;
  required: boolean;
  placeholder?: string;
  helperText?: string;
}

interface CalcMeta {
  variables: CalcVariable[];
  expression: string;
  output: { key: string; label: string; type: InputType };
  explanation?: string;
}

interface AdminFormula {
  id: string;
  code: string;
  name: string;
  expression: string;
  notes?: string | null;
  calcMetaJson?: string | null;
  position: number;
}

interface AdminSection {
  id: string;
  code: string;
  title: string;
  position: number;
  formulas: AdminFormula[];
}

interface ParsedFormulaRow {
  sectionCode: string;
  sectionTitle: string;
  sectionPosition: number;
  code: string;
  name: string;
  expression: string;
  notes?: string;
  calcExpression?: string;
  calcOutputLabel?: string;
  calcOutputType?: string;
  calcVariables?: string;
  calcExplanation?: string;
}

interface ImportBatch {
  sections: Array<{
    code: string; title: string; position: number;
    formulas: Array<{
      code: string; name: string; expression: string;
      notes?: string; calcMetaJson?: string; position: number;
    }>;
  }>;
  errors: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const INPUT_TYPES: InputType[] = ["currency", "percentage", "number", "ratio", "integer"];

function parseMeta(json: string | null | undefined): CalcMeta | null {
  if (!json) return null;
  try { return JSON.parse(json) as CalcMeta; } catch { return null; }
}

function SmallField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-600">
        {label}
        {hint && <span className="ml-1 font-normal text-slate-400">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function inputClass(error?: boolean) {
  return cn(
    "w-full rounded-lg border px-3 py-2 text-sm outline-none transition",
    "focus:border-[#185FA5] focus:ring-2 focus:ring-[#E6F1FB]",
    error ? "border-red-300 bg-red-50" : "border-slate-200 bg-white text-slate-800"
  );
}

function ActionBtn({ onClick, children, tone = "primary", disabled, small }: {
  onClick: () => void; children: React.ReactNode;
  tone?: "primary" | "ghost" | "danger"; disabled?: boolean; small?: boolean;
}) {
  const base = "inline-flex items-center gap-1.5 rounded-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = small ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm";
  const tones = {
    primary: "bg-[#185FA5] text-white hover:bg-[#134d88] focus-visible:ring-[#185FA5]",
    ghost: "border border-slate-200 bg-white text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:ring-[#185FA5]",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
  };
  return (
    <button type="button" className={cn(base, sizes, tones[tone])} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// ─── Panel tabs ───────────────────────────────────────────────────────────────

type EditorTab = "fields" | "calc" | "verify" | "preview";
type PanelTab = "manage" | "import" | "templates";

// ─── Main Component ───────────────────────────────────────────────────────────

export function FormulasPanel({ onSaved }: { onSaved?: () => void }) {
  const [panelTab, setPanelTab] = useState<PanelTab>("manage");
  const [sections, setSections] = useState<AdminSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(new Set());
  const [selectedFormula, setSelectedFormula] = useState<AdminFormula | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [editorTab, setEditorTab] = useState<EditorTab>("fields");
  const [isCreating, setIsCreating] = useState(false);
  const [savingBusy, setSavingBusy] = useState(false);
  const [notice, setNotice] = useState<{ msg: string; ok: boolean } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteSectionId, setConfirmDeleteSectionId] = useState<string | null>(null);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  // #15 Unsaved-changes guard
  const [isDirty, setIsDirty] = useState(false);

  const loadSections = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch("/api/admin/formulas");
    if (res.ok) {
      const data: AdminSection[] = await res.json();
      setSections(data.sort((a, b) => a.position - b.position).map((s) => ({
        ...s,
        formulas: s.formulas.slice().sort((a, b) => a.position - b.position),
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadSections(); }, [loadSections]);

  const showNotice = (msg: string, ok = true) => {
    setNotice({ msg, ok });
    setTimeout(() => setNotice(null), 3500);
  };

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sections;
    return sections.map((s) => ({
      ...s,
      formulas: s.formulas.filter((f) =>
        f.name.toLowerCase().includes(q) || f.code.toLowerCase().includes(q) || f.expression.toLowerCase().includes(q)
      ),
    })).filter((s) => s.formulas.length > 0 || s.code.toLowerCase().includes(q) || s.title.toLowerCase().includes(q));
  }, [sections, search]);

  function selectFormula(formula: AdminFormula, sectionId: string) {
    // #15 unsaved guard
    if (isDirty && !window.confirm("You have unsaved changes. Discard them?")) return;
    setSelectedFormula(formula);
    setSelectedSectionId(sectionId);
    setEditorTab("fields");
    setIsCreating(false);
    setConfirmDeleteId(null);
    setIsDirty(false);
  }

  function startCreate(sectionId: string) {
    if (isDirty && !window.confirm("You have unsaved changes. Discard them?")) return;
    const section = sections.find((s) => s.id === sectionId);
    const nextPos = (section?.formulas.length ?? 0);
    setSelectedFormula({
      id: "__new__", code: "", name: "", expression: "", notes: "", calcMetaJson: null, position: nextPos,
    });
    setSelectedSectionId(sectionId);
    setEditorTab("fields");
    setIsCreating(true);
    setConfirmDeleteId(null);
    setIsDirty(false);
  }

  // #12 Duplicate formula
  function duplicateFormula(formula: AdminFormula, sectionId: string) {
    if (isDirty && !window.confirm("You have unsaved changes. Discard them?")) return;
    const section = sections.find((s) => s.id === sectionId);
    const nextPos = (section?.formulas.length ?? 0);
    setSelectedFormula({
      id: "__new__",
      code: `${formula.code}_copy`,
      name: `${formula.name} (copy)`,
      expression: formula.expression,
      notes: formula.notes ?? "",
      calcMetaJson: formula.calcMetaJson ?? null,
      position: nextPos,
    });
    setSelectedSectionId(sectionId);
    setEditorTab("fields");
    setIsCreating(true);
    setIsDirty(false);
    showNotice("Formula duplicated — edit fields and save to create the copy.", true);
  }

  // #1 Race-condition fix: accept the full updated formula as a parameter
  // rather than reading from state (which may not have flushed yet).
  async function saveFormula(formulaOverride?: AdminFormula) {
    const formula = formulaOverride ?? selectedFormula;
    if (!formula) return;
    setSavingBusy(true);
    try {
      if (isCreating) {
        const res = await adminFetch("/api/admin/formulas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionId: selectedSectionId,
            code: formula.code,
            name: formula.name,
            expression: formula.expression,
            notes: formula.notes || null,
            position: formula.position,
            calcMetaJson: formula.calcMetaJson ?? null,
          }),
        });
        if (res.ok) {
          setIsCreating(false);
          setIsDirty(false);
          showNotice("Formula created.");
          await loadSections();
          onSaved?.();
        } else {
          const err = await res.json().catch(() => ({}));
          showNotice(err.error ?? "Failed to create formula.", false);
        }
      } else {
        const res = await adminFetch(`/api/admin/formulas/${formula.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: formula.code,
            name: formula.name,
            expression: formula.expression,
            notes: formula.notes || null,
            calcMetaJson: formula.calcMetaJson,
            position: formula.position,
            // #5 Section move support
            sectionId: selectedSectionId ?? undefined,
          }),
        });
        if (res.ok) {
          setIsDirty(false);
          showNotice("Saved.");
          await loadSections();
          onSaved?.();
        } else {
          const err = await res.json().catch(() => ({}));
          showNotice(err.error ?? "Failed to save.", false);
        }
      }
    } finally {
      setSavingBusy(false);
    }
  }

  async function deleteFormula(id: string) {
    const res = await adminFetch(`/api/admin/formulas/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSelectedFormula(null);
      setSelectedSectionId(null);
      setConfirmDeleteId(null);
      setIsDirty(false);
      showNotice("Formula deleted.");
      await loadSections();
    } else {
      showNotice("Failed to delete formula.", false);
    }
  }

  async function deleteSection(id: string) {
    const res = await adminFetch(`/api/admin/formulas/sections/${id}`, { method: "DELETE" });
    if (res.ok) {
      if (selectedSectionId === id) { setSelectedFormula(null); setSelectedSectionId(null); setIsDirty(false); }
      setConfirmDeleteSectionId(null);
      showNotice("Section deleted.");
      await loadSections();
    } else {
      showNotice("Failed to delete section.", false);
    }
  }

  // #6 Reorder formula within its section (up/down arrows)
  async function reorderFormula(sectionId: string, formulaId: string, direction: "up" | "down") {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const idx = section.formulas.findIndex((f) => f.id === formulaId);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= section.formulas.length) return;
    const a = section.formulas[idx];
    const b = section.formulas[swapIdx];
    // Swap positions
    await Promise.all([
      adminFetch(`/api/admin/formulas/${a.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ position: b.position }) }),
      adminFetch(`/api/admin/formulas/${b.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ position: a.position }) }),
    ]);
    await loadSections();
  }

  // #6 Reorder section (up/down arrows)
  async function reorderSection(sectionId: string, direction: "up" | "down") {
    const sorted = sections.slice().sort((a, b) => a.position - b.position);
    const idx = sorted.findIndex((s) => s.id === sectionId);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    await Promise.all([
      adminFetch(`/api/admin/formulas/sections/${a.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ position: b.position }) }),
      adminFetch(`/api/admin/formulas/sections/${b.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ position: a.position }) }),
    ]);
    await loadSections();
  }

  const [newSection, setNewSection] = useState({ code: "", title: "" });

  async function addSection() {
    if (!newSection.code.trim() || !newSection.title.trim()) return;
    const res = await adminFetch("/api/admin/formulas/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: newSection.code.trim(), title: newSection.title.trim() }),
      // #19 position is auto-assigned server-side
    });
    if (res.ok) {
      setNewSection({ code: "", title: "" });
      setAddSectionOpen(false);
      showNotice("Section added.");
      await loadSections();
    } else {
      showNotice("Failed to add section.", false);
    }
  }

  // #9 Cmd/Ctrl+S keyboard save
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (selectedFormula && !savingBusy) saveFormula();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFormula, savingBusy, isCreating, selectedSectionId]);

  return (
    <div className="space-y-4">
      {/* Panel tabs */}
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
        {([["manage", "Manage"], ["import", "Import"], ["templates", "Templates"]] as [PanelTab, string][]).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => setPanelTab(tab)}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-semibold transition",
              panelTab === tab ? "bg-white text-[#185FA5] shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {notice && (
        <div className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
          notice.ok ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
        )}>
          {notice.ok ? <Icons.Check size={14} /> : <Icons.AlertCircle size={14} />}
          {notice.msg}
        </div>
      )}

      {panelTab === "manage" && (
        <ManageTab
          sections={sections}
          filteredSections={filteredSections}
          loading={loading}
          search={search}
          setSearch={setSearch}
          openSectionIds={openSectionIds}
          setOpenSectionIds={setOpenSectionIds}
          selectedFormula={selectedFormula}
          selectedSectionId={selectedSectionId}
          isCreating={isCreating}
          isDirty={isDirty}
          editorTab={editorTab}
          setEditorTab={setEditorTab}
          savingBusy={savingBusy}
          confirmDeleteId={confirmDeleteId}
          setConfirmDeleteId={setConfirmDeleteId}
          confirmDeleteSectionId={confirmDeleteSectionId}
          setConfirmDeleteSectionId={setConfirmDeleteSectionId}
          addSectionOpen={addSectionOpen}
          setAddSectionOpen={setAddSectionOpen}
          newSection={newSection}
          setNewSection={setNewSection}
          selectFormula={selectFormula}
          startCreate={startCreate}
          duplicateFormula={duplicateFormula}
          saveFormula={saveFormula}
          deleteFormula={deleteFormula}
          deleteSection={deleteSection}
          addSection={addSection}
          reorderFormula={reorderFormula}
          reorderSection={reorderSection}
          onFormulaChange={(patch) => {
            setSelectedFormula((prev) => prev ? { ...prev, ...patch } : prev);
            setIsDirty(true);
          }}
          onSectionChange={setSelectedSectionId}
        />
      )}

      {panelTab === "import" && (
        <ImportTab onDone={() => { setPanelTab("manage"); loadSections(); }} />
      )}

      {panelTab === "templates" && <TemplatesTab />}
    </div>
  );
}

// ─── Manage Tab ───────────────────────────────────────────────────────────────

function ManageTab({
  sections, filteredSections, loading, search, setSearch,
  openSectionIds, setOpenSectionIds,
  selectedFormula, selectedSectionId, isCreating, isDirty, editorTab, setEditorTab,
  savingBusy, confirmDeleteId, setConfirmDeleteId,
  confirmDeleteSectionId, setConfirmDeleteSectionId,
  addSectionOpen, setAddSectionOpen, newSection, setNewSection,
  selectFormula, startCreate, duplicateFormula, saveFormula, deleteFormula,
  deleteSection, addSection, reorderFormula, reorderSection,
  onFormulaChange, onSectionChange,
}: {
  sections: AdminSection[];
  filteredSections: AdminSection[];
  loading: boolean;
  search: string;
  setSearch: (v: string) => void;
  openSectionIds: Set<string>;
  setOpenSectionIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectedFormula: AdminFormula | null;
  selectedSectionId: string | null;
  isCreating: boolean;
  isDirty: boolean;
  editorTab: EditorTab;
  setEditorTab: (v: EditorTab) => void;
  savingBusy: boolean;
  confirmDeleteId: string | null;
  setConfirmDeleteId: (v: string | null) => void;
  confirmDeleteSectionId: string | null;
  setConfirmDeleteSectionId: (v: string | null) => void;
  addSectionOpen: boolean;
  setAddSectionOpen: (v: boolean) => void;
  newSection: { code: string; title: string };
  setNewSection: React.Dispatch<React.SetStateAction<{ code: string; title: string }>>;
  selectFormula: (f: AdminFormula, sectionId: string) => void;
  startCreate: (sectionId: string) => void;
  duplicateFormula: (f: AdminFormula, sectionId: string) => void;
  saveFormula: (override?: AdminFormula) => void;
  deleteFormula: (id: string) => void;
  deleteSection: (id: string) => void;
  addSection: () => void;
  reorderFormula: (sectionId: string, formulaId: string, direction: "up" | "down") => void;
  reorderSection: (sectionId: string, direction: "up" | "down") => void;
  onFormulaChange: (patch: Partial<AdminFormula>) => void;
  onSectionChange: (sectionId: string) => void;
}) {
  function toggleSection(id: string) {
    setOpenSectionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const sortedSections = filteredSections.slice().sort((a, b) => a.position - b.position);

  return (
    <div className="grid gap-4 xl:grid-cols-[2fr_3fr]">
      {/* Left: formula browser */}
      <div className="space-y-3">
        <input
          type="search"
          placeholder="Search formulas…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass()}
        />

        {loading ? (
          <p className="py-6 text-center text-sm text-slate-400">Loading…</p>
        ) : sortedSections.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">No formulas found.</p>
        ) : (
          <div className="space-y-2">
            {sortedSections.map((section, sIdx) => {
              const isOpen = openSectionIds.has(section.id);
              return (
                <div key={section.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {/* Section header */}
                  <div className="flex items-center gap-1 px-2 py-2">
                    {/* #6 Section reorder arrows */}
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => reorderSection(section.id, "up")}
                        disabled={sIdx === 0}
                        title="Move section up"
                        className="flex h-4 w-4 items-center justify-center rounded text-slate-300 hover:text-[#185FA5] disabled:opacity-0"
                      >
                        <Icons.ChevronUp size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => reorderSection(section.id, "down")}
                        disabled={sIdx === sortedSections.length - 1}
                        title="Move section down"
                        className="flex h-4 w-4 items-center justify-center rounded text-slate-300 hover:text-[#185FA5] disabled:opacity-0"
                      >
                        <Icons.ChevronDown size={11} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <StatusBadge tone="blue">{section.code}</StatusBadge>
                      <span className="truncate text-xs font-semibold text-slate-700">{section.title}</span>
                      <span className="shrink-0 text-[10px] text-slate-400">({section.formulas.length})</span>
                      {isOpen ? <Icons.ChevronUp size={14} className="shrink-0 text-slate-400" /> : <Icons.ChevronDown size={14} className="shrink-0 text-slate-400" />}
                    </button>

                    {/* #18 Improved confirm-delete for sections */}
                    {confirmDeleteSectionId === section.id ? (
                      <span className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => deleteSection(section.id)}
                          className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 hover:bg-red-200"
                        >
                          Delete section + {section.formulas.length} formulas
                        </button>
                        <button onClick={() => setConfirmDeleteSectionId(null)} className="text-[10px] text-slate-400 hover:text-slate-600">Cancel</button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteSectionId(section.id)}
                        className="shrink-0 text-slate-200 hover:text-red-500 transition-colors"
                        title="Delete section"
                      >
                        <Icons.Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  {isOpen && (
                    <div className="border-t border-slate-100">
                      {section.formulas.map((formula, fIdx) => {
                        const isSelected = selectedFormula?.id === formula.id && !isCreating;
                        const hasCalc = !!formula.calcMetaJson || !!getFormulaCalculator(formula.code);
                        return (
                          <div
                            key={formula.id}
                            className={cn(
                              "flex items-center gap-1 group transition",
                              isSelected ? "bg-[#E6F1FB]" : "hover:bg-slate-50"
                            )}
                          >
                            {/* #6 Formula reorder arrows */}
                            <div className="flex flex-col gap-0 pl-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => reorderFormula(section.id, formula.id, "up")}
                                disabled={fIdx === 0}
                                title="Move up"
                                className="flex h-4 w-4 items-center justify-center text-slate-300 hover:text-[#185FA5] disabled:opacity-30"
                              >
                                <Icons.ChevronUp size={10} />
                              </button>
                              <button
                                type="button"
                                onClick={() => reorderFormula(section.id, formula.id, "down")}
                                disabled={fIdx === section.formulas.length - 1}
                                title="Move down"
                                className="flex h-4 w-4 items-center justify-center text-slate-300 hover:text-[#185FA5] disabled:opacity-30"
                              >
                                <Icons.ChevronDown size={10} />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => selectFormula(formula, section.id)}
                              className="flex flex-1 min-w-0 items-start justify-between gap-2 px-2 py-2.5 text-left"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="font-mono text-[10px] font-semibold text-[#185FA5]">{formula.code}</p>
                                  {isDirty && isSelected && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" title="Unsaved changes" />
                                  )}
                                </div>
                                <p className="truncate text-xs font-medium text-slate-700">{formula.name}</p>
                              </div>
                              {hasCalc && (
                                <span title="Calculator configured">
                                  <Icons.Calculator size={12} className="mt-0.5 shrink-0 text-emerald-500" />
                                </span>
                              )}
                            </button>

                            {/* #12 Duplicate button (appears on hover) */}
                            <button
                              type="button"
                              title="Duplicate formula"
                              onClick={() => duplicateFormula(formula, section.id)}
                              className="mr-2 shrink-0 p-1 text-slate-200 hover:text-[#185FA5] opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Icons.Copy size={12} />
                            </button>
                          </div>
                        );
                      })}
                      <div className="border-t border-slate-100 px-3 py-2">
                        <ActionBtn small tone="ghost" onClick={() => startCreate(section.id)}>
                          <Icons.Plus size={12} /> Add formula
                        </ActionBtn>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add section */}
        <div className="border-t border-slate-100 pt-3">
          {addSectionOpen ? (
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-600">New Section</p>
              <input placeholder="Code (e.g. S7)" value={newSection.code} onChange={(e) => setNewSection((p) => ({ ...p, code: e.target.value }))} className={inputClass()} />
              <input placeholder="Title (e.g. Market Analysis)" value={newSection.title} onChange={(e) => setNewSection((p) => ({ ...p, title: e.target.value }))} className={inputClass()} />
              {/* #19 No manual position — auto-assigned server-side */}
              <p className="text-[10px] text-slate-400">Position is auto-assigned as the last section.</p>
              <div className="flex gap-2">
                <ActionBtn onClick={addSection} disabled={!newSection.code.trim() || !newSection.title.trim()} small>Create</ActionBtn>
                <ActionBtn tone="ghost" onClick={() => setAddSectionOpen(false)} small>Cancel</ActionBtn>
              </div>
            </div>
          ) : (
            <ActionBtn tone="ghost" small onClick={() => setAddSectionOpen(true)}>
              <Icons.Plus size={12} /> Add section
            </ActionBtn>
          )}
        </div>
      </div>

      {/* Right: editor */}
      <div>
        {!selectedFormula ? (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <Icons.Calculator size={28} className="mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-500">Select a formula to edit</p>
            <p className="mt-1 text-xs text-slate-400">Or click "+ Add formula" under a section. <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px]">⌘S</kbd> to save.</p>
          </div>
        ) : (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            {/* Unsaved indicator */}
            {isDirty && (
              <div className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Unsaved changes — press <kbd className="rounded bg-amber-100 px-1 font-mono">⌘S</kbd> or click Save
              </div>
            )}

            {/* Editor sub-tabs */}
            <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
              {([
                ["fields", "Formula"],
                ["calc", "Calculator"],
                ["verify", "Verify"],
                ["preview", "Preview"],
              ] as [EditorTab, string][]).map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setEditorTab(tab)}
                  className={cn(
                    "flex-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition",
                    editorTab === tab ? "bg-white text-[#185FA5] shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* #2 Bug fix: key on formula id so hooks reinitialise when switching formulas */}
            {editorTab === "fields" && (
              <FieldsEditor
                key={selectedFormula.id}
                formula={selectedFormula}
                sections={sections}
                selectedSectionId={selectedSectionId}
                isCreating={isCreating}
                savingBusy={savingBusy}
                confirmDeleteId={confirmDeleteId}
                setConfirmDeleteId={setConfirmDeleteId}
                onChange={onFormulaChange}
                onSectionChange={onSectionChange}
                onSave={() => saveFormula()}
                onDelete={deleteFormula}
              />
            )}

            {editorTab === "calc" && (
              <CalcSetupEditor
                key={selectedFormula.id}
                formula={selectedFormula}
                savingBusy={savingBusy}
                onSaveWithMeta={(meta) => {
                  // #1 Bug fix: pass the updated formula directly to saveFormula
                  // so state doesn't need to flush before the save fires.
                  const updated: AdminFormula = { ...selectedFormula, calcMetaJson: meta };
                  saveFormula(updated);
                }}
              />
            )}

            {editorTab === "verify" && (
              <VerifyPanel key={selectedFormula.id} formula={selectedFormula} />
            )}

            {/* #7 Live student-portal preview */}
            {editorTab === "preview" && (
              <FormulaPreviewCard formula={selectedFormula} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Fields Editor ─────────────────────────────────────────────────────────────

function FieldsEditor({
  formula, sections, selectedSectionId, isCreating, savingBusy,
  confirmDeleteId, setConfirmDeleteId, onChange, onSectionChange, onSave, onDelete,
}: {
  formula: AdminFormula; sections: AdminSection[]; selectedSectionId: string | null;
  isCreating: boolean; savingBusy: boolean;
  confirmDeleteId: string | null; setConfirmDeleteId: (v: string | null) => void;
  onChange: (patch: Partial<AdminFormula>) => void;
  onSectionChange: (sectionId: string) => void;
  onSave: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <SmallField label="Formula Code">
          <input
            value={formula.code}
            onChange={(e) => onChange({ code: e.target.value })}
            placeholder="e.g. S1.F9"
            className={inputClass(!formula.code.trim())}
          />
        </SmallField>
        {/* #5 Section is now editable to support moving formulas */}
        <SmallField label="Section">
          <select
            value={selectedSectionId ?? ""}
            onChange={(e) => onSectionChange(e.target.value)}
            className={inputClass()}
          >
            <option value="" disabled>Select section…</option>
            {sections.map((s) => <option key={s.id} value={s.id}>{s.code} — {s.title}</option>)}
          </select>
        </SmallField>
      </div>

      <SmallField label="Formula Name">
        <input
          value={formula.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g. Trending Forward"
          className={inputClass(!formula.name.trim())}
        />
      </SmallField>

      <SmallField label="Display Expression">
        <textarea
          value={formula.expression}
          onChange={(e) => onChange({ expression: e.target.value })}
          placeholder="e.g. Adjusted = Sale × (1+r)^n"
          rows={2}
          className={cn(inputClass(!formula.expression.trim()), "resize-none font-mono text-xs")}
        />
      </SmallField>

      <SmallField label="Notes" hint="(optional — shown below the formula card)">
        <textarea
          value={formula.notes ?? ""}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Short explanation…"
          rows={2}
          className={cn(inputClass(), "resize-none text-xs")}
        />
      </SmallField>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <ActionBtn onClick={onSave} disabled={savingBusy || !formula.code.trim() || !formula.name.trim() || !formula.expression.trim()}>
          {savingBusy ? "Saving…" : isCreating ? "Create Formula" : "Save Changes"}
        </ActionBtn>

        {/* #18 Better delete confirm */}
        {!isCreating && formula.id && formula.id !== "__new__" && (
          confirmDeleteId === formula.id ? (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5">
              <span className="text-xs font-semibold text-red-700">Delete "{formula.name}"?</span>
              <button onClick={() => onDelete(formula.id)} className="text-xs font-bold text-red-600 underline hover:text-red-800">
                Confirm
              </button>
              <button onClick={() => setConfirmDeleteId(null)} className="text-xs text-slate-400 hover:text-slate-600">
                Cancel
              </button>
            </div>
          ) : (
            <ActionBtn tone="ghost" small onClick={() => setConfirmDeleteId(formula.id)}>
              <Icons.Trash2 size={12} /> Delete
            </ActionBtn>
          )
        )}
      </div>
    </div>
  );
}

// ─── Calculator Setup Editor ───────────────────────────────────────────────────

function CalcSetupEditor({
  formula, savingBusy, onSaveWithMeta,
}: {
  formula: AdminFormula;
  savingBusy: boolean;
  // #1 Bug fix: accepts the built meta JSON directly so caller can pass it to saveFormula
  onSaveWithMeta: (metaJson: string | null) => void;
}) {
  const staticConfig = getFormulaCalculator(formula.code);
  const existingMeta = parseMeta(formula.calcMetaJson);
  const hasStatic = Boolean(staticConfig);
  const hasDb = Boolean(existingMeta);

  const [variables, setVariables] = useState<CalcVariable[]>(
    existingMeta?.variables ?? (staticConfig ? staticConfig.variables as CalcVariable[] : [])
  );
  const [calcExpr, setCalcExpr] = useState(existingMeta?.expression ?? "");
  const [outputLabel, setOutputLabel] = useState(existingMeta?.output.label ?? "Result");
  const [outputType, setOutputType] = useState<InputType>(existingMeta?.output.type ?? "number");
  const [explanation, setExplanation] = useState(existingMeta?.explanation ?? "");

  const varKeys = variables.map((v) => v.key).filter(Boolean);
  const validation = calcExpr.trim() ? validateExpression(calcExpr, varKeys) : null;

  function addVariable() {
    setVariables((prev) => [...prev, { key: "", label: "", type: "number", required: true, placeholder: "", helperText: "" }]);
  }
  function updateVariable(i: number, patch: Partial<CalcVariable>) {
    setVariables((prev) => prev.map((v, idx) => idx === i ? { ...v, ...patch } : v));
  }
  function removeVariable(i: number) {
    setVariables((prev) => prev.filter((_, idx) => idx !== i));
  }
  function moveVariable(i: number, direction: "up" | "down") {
    setVariables((prev) => {
      const next = [...prev];
      const j = direction === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function buildAndSave() {
    let metaJson: string | null = null;
    if (calcExpr.trim() && variables.length > 0) {
      const meta: CalcMeta = {
        variables,
        expression: calcExpr.trim(),
        output: { key: "result", label: outputLabel, type: outputType },
        explanation: explanation.trim() || undefined,
      };
      metaJson = JSON.stringify(meta);
    }
    // #1 Bug fix: pass built JSON directly — no state update needed before save
    onSaveWithMeta(metaJson);
  }

  function clearConfig() {
    setVariables([]); setCalcExpr(""); setOutputLabel("Result"); setOutputType("number"); setExplanation("");
    onSaveWithMeta(null);
  }

  return (
    <div className="space-y-4">
      {/* Status */}
      <div className="flex flex-wrap gap-2">
        {hasStatic && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700"><Icons.Check size={10} /> Built-in config active</span>}
        {hasDb && <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F1FB] px-2.5 py-1 text-[10px] font-bold text-[#185FA5]"><Icons.Calculator size={10} /> DB config saved</span>}
        {!hasStatic && !hasDb && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">No calculator config</span>}
      </div>

      {hasStatic && !hasDb && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
          This formula has a built-in calculator. Define a DB config below only to override it.
        </p>
      )}

      {/* #8 Improved variable builder */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-600">Input Variables</label>
          <ActionBtn small tone="ghost" onClick={addVariable}><Icons.Plus size={11} /> Add variable</ActionBtn>
        </div>
        {variables.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 py-4 text-center text-xs text-slate-400">
            No variables yet — click "Add variable" to start.
          </p>
        ) : (
          <div className="space-y-3">
            {variables.map((v, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                {/* Row 1: key + label + type + required + actions */}
                <div className="grid gap-2 sm:grid-cols-[120px_1fr_120px_auto_auto]">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Key</label>
                    <input
                      value={v.key}
                      onChange={(e) => updateVariable(i, { key: e.target.value.replace(/\W/g, "").toLowerCase() })}
                      placeholder="e.g. sale"
                      className={cn(inputClass(), "font-mono text-xs")}
                      title="Variable key — only lowercase letters and numbers, no spaces"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Label</label>
                    <input
                      value={v.label}
                      onChange={(e) => updateVariable(i, { label: e.target.value })}
                      placeholder="e.g. Sale Price"
                      className={inputClass()}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</label>
                    <select value={v.type} onChange={(e) => updateVariable(i, { type: e.target.value as InputType })} className={inputClass()}>
                      {INPUT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col items-center justify-end gap-1 pb-0.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Req.</label>
                    <input type="checkbox" checked={v.required} onChange={(e) => updateVariable(i, { required: e.target.checked })} className="h-4 w-4 cursor-pointer" />
                  </div>
                  <div className="flex flex-col items-center justify-end gap-1 pb-0.5">
                    <div className="flex gap-0.5">
                      <button type="button" onClick={() => moveVariable(i, "up")} disabled={i === 0} title="Move up" className="p-0.5 text-slate-300 hover:text-[#185FA5] disabled:opacity-20">
                        <Icons.ChevronUp size={13} />
                      </button>
                      <button type="button" onClick={() => moveVariable(i, "down")} disabled={i === variables.length - 1} title="Move down" className="p-0.5 text-slate-300 hover:text-[#185FA5] disabled:opacity-20">
                        <Icons.ChevronDown size={13} />
                      </button>
                    </div>
                    <button type="button" onClick={() => removeVariable(i)} title="Remove variable" className="p-0.5 text-slate-300 hover:text-red-500">
                      <Icons.Trash2 size={13} />
                    </button>
                  </div>
                </div>
                {/* Row 2: placeholder + helperText with explicit labels */}
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Placeholder</label>
                    <input value={v.placeholder ?? ""} onChange={(e) => updateVariable(i, { placeholder: e.target.value })} placeholder="e.g. 250000" className={cn(inputClass(), "text-xs")} />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Helper text</label>
                    <input value={v.helperText ?? ""} onChange={(e) => updateVariable(i, { helperText: e.target.value })} placeholder="e.g. Enter as a decimal e.g. 0.05" className={cn(inputClass(), "text-xs")} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Calc expression */}
      <SmallField label="Calculation Expression" hint="(use variable keys, +,-,*,/,^, sqrt(), etc.)">
        <div className="relative">
          <input
            value={calcExpr}
            onChange={(e) => setCalcExpr(e.target.value)}
            placeholder="e.g. sale * (1 + rate / 100) ^ periods"
            className={cn(inputClass(validation?.ok === false), "font-mono text-xs pr-8")}
          />
          {validation && (
            <span className={cn("absolute right-2.5 top-2.5", validation.ok ? "text-emerald-500" : "text-red-500")}>
              {validation.ok ? <Icons.Check size={14} /> : <Icons.AlertCircle size={14} />}
            </span>
          )}
        </div>
        {validation?.ok === false && <p className="mt-1 text-xs text-red-500">{validation.error}</p>}
        {validation?.ok === true && <p className="mt-1 text-xs text-emerald-600">Expression is valid.</p>}
      </SmallField>

      {/* Output */}
      <div className="grid gap-3 sm:grid-cols-2">
        <SmallField label="Output Label">
          <input value={outputLabel} onChange={(e) => setOutputLabel(e.target.value)} placeholder="Adjusted Sale Price" className={inputClass()} />
        </SmallField>
        <SmallField label="Output Type">
          <select value={outputType} onChange={(e) => setOutputType(e.target.value as InputType)} className={inputClass()}>
            {INPUT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </SmallField>
      </div>

      <SmallField label="Explanation" hint="(shown in italic inside the calculator panel)">
        <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="Brief explanation…" rows={2} className={cn(inputClass(), "resize-none text-xs")} />
      </SmallField>

      <div className="flex flex-wrap gap-2 pt-1">
        <ActionBtn onClick={buildAndSave} disabled={savingBusy || (calcExpr.trim() !== "" && validation?.ok === false)}>
          {savingBusy ? "Saving…" : "Save Calculator Config"}
        </ActionBtn>
        {hasDb && (
          <ActionBtn tone="ghost" small onClick={clearConfig} disabled={savingBusy}>
            <Icons.Trash2 size={12} /> Clear config
          </ActionBtn>
        )}
      </div>
    </div>
  );
}

// ─── Verify Panel ──────────────────────────────────────────────────────────────

function VerifyPanel({ formula }: { formula: AdminFormula }) {
  const staticConfig = getFormulaCalculator(formula.code);
  const dbMeta = parseMeta(formula.calcMetaJson);
  const meta = dbMeta ?? (staticConfig ? {
    variables: staticConfig.variables as CalcVariable[],
    expression: "__static__",
    output: staticConfig.output,
    explanation: staticConfig.explanation,
  } : null);

  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);
  const [steps, setSteps] = useState<Array<{ label: string; expression: string; value: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [ran, setRan] = useState(false);

  function runVerify() {
    if (!meta) return;
    const numVars: Record<string, number> = {};
    for (const v of meta.variables) {
      const raw = inputs[v.key] ?? "";
      const n = parseFloat(raw);
      if (raw.trim() === "" && v.required) { setError(`Missing required field: ${v.label}`); setRan(true); return; }
      numVars[v.key] = isNaN(n) ? (v.required ? NaN : 0) : n;
    }

    try {
      let computed: number | null = null;
      let newSteps: typeof steps = [];

      if (dbMeta) {
        computed = evalExpression(dbMeta.expression, numVars);
        // #16 Show variable substitution steps
        newSteps = meta.variables.map((v) => ({
          label: v.label,
          expression: v.key,
          value: formatValue(numVars[v.key] ?? 0, v.type),
        }));
        if (computed !== null && isFinite(computed)) {
          newSteps.push({
            label: meta.output.label,
            expression: dbMeta.expression,
            value: formatValue(computed, meta.output.type),
          });
        }
      } else if (staticConfig) {
        computed = staticConfig.compute(numVars);
        // #16 Show steps from static config if available
        if (staticConfig.showWork) {
          const workSteps = staticConfig.showWork(numVars, computed ?? 0);
          newSteps = workSteps.map((s) => ({
            label: s.label,
            expression: s.expression ?? "",
            value: String(s.value ?? ""),
          }));
        }
      }

      if (computed === null || !isFinite(computed)) {
        setError("Result is not a finite number — check for division by zero or invalid inputs.");
        setResult(null); setSteps([]);
      } else {
        setResult(computed); setError(null); setSteps(newSteps);
      }
    } catch (e) {
      setError(String(e)); setResult(null); setSteps([]);
    }
    setRan(true);
  }

  function reset() { setInputs({}); setResult(null); setSteps([]); setError(null); setRan(false); }

  if (!meta) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
        No calculator config. Define variables and an expression in the <strong>Calculator</strong> tab first.
      </div>
    );
  }

  const checks = [
    { label: "Expression defined", pass: dbMeta ? Boolean(dbMeta.expression.trim()) : Boolean(staticConfig) },
    { label: "Variables defined", pass: meta.variables.length > 0 },
    { label: "All required inputs provided", pass: ran && !error?.startsWith("Missing") },
    { label: "Result is a valid finite number", pass: ran && result !== null },
  ];

  return (
    <div className="space-y-4">
      <div className="font-calc rounded-md border border-[#b8d7f0] bg-[#f8fbff] px-3 py-2.5 text-xs text-slate-800">
        {formula.expression}
      </div>

      {dbMeta && (
        <p className="font-mono text-[11px] text-slate-400">Calc expr: <span className="text-slate-600">{dbMeta.expression}</span></p>
      )}

      {/* Input fields */}
      <div className="space-y-2">
        {meta.variables.map((v) => (
          <div key={v.key}>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              {v.label}
              {v.required && <span className="ml-1 text-red-400">*</span>}
              <span className="ml-1 font-mono font-normal text-slate-400">({v.key})</span>
            </label>
            <input
              type="number"
              step="any"
              placeholder={v.placeholder ?? ""}
              value={inputs[v.key] ?? ""}
              onChange={(e) => { setInputs((prev) => ({ ...prev, [v.key]: e.target.value })); setRan(false); }}
              className={inputClass()}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <ActionBtn onClick={runVerify}>Run verification</ActionBtn>
        <ActionBtn tone="ghost" small onClick={reset}>Reset</ActionBtn>
      </div>

      {/* Checks */}
      <ul className="space-y-1">
        {checks.map((c) => (
          <li key={c.label} className="flex items-center gap-2 text-xs">
            <span className={c.pass ? "text-emerald-500" : "text-slate-300"}>
              {c.pass ? <Icons.Check size={13} /> : <Icons.AlertCircle size={13} />}
            </span>
            <span className={c.pass ? "text-slate-600" : "text-slate-400"}>{c.label}</span>
          </li>
        ))}
      </ul>

      {ran && error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      {/* #16 Step breakdown */}
      {ran && steps.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600">Step breakdown</p>
          <div className="space-y-1.5 rounded-xl border border-slate-100 bg-slate-50 p-3">
            {steps.map((step, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto] gap-3 items-center text-xs">
                <div>
                  <span className="font-semibold text-slate-600">{step.label}</span>
                  {step.expression && step.expression !== step.label && (
                    <span className="ml-1.5 font-mono text-[10px] text-slate-400">= {step.expression}</span>
                  )}
                </div>
                <span className="font-mono font-bold text-slate-800">{step.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {ran && result !== null && (
        <div className="rounded-lg border border-slate-200 bg-[#f8fbff] px-4 py-3">
          <p className="text-xs font-semibold text-[#185FA5]">{meta.output.label}</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">
            {formatValue(result, meta.output.type)}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── #7 Live student-portal preview ──────────────────────────────────────────

function FormulaPreviewCard({ formula }: { formula: AdminFormula }) {
  const hasCalc = Boolean(formula.calcMetaJson || getFormulaCalculator(formula.code));

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500">
        Preview — this is how the formula card appears to students in the Formula Compass:
      </p>

      {/* Replica of the student-facing card from FormulaCompass */}
      <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs font-semibold text-[#185FA5]">
                {formula.code || <span className="italic text-slate-300">code</span>}
              </p>
              <h3 className="mt-1 text-sm font-semibold leading-snug text-slate-800">
                {formula.name || <span className="italic text-slate-300">Formula name</span>}
              </h3>
            </div>
            {/* Bookmark placeholder */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-300">
              <Icons.BookMarked size={15} />
            </div>
          </div>
          <p className="font-calc rounded-md border border-[#b8d7f0] bg-[#f8fbff] px-3 py-2 text-[12px] text-slate-800">
            {formula.expression || <span className="italic text-slate-300">expression will appear here</span>}
          </p>
          {formula.notes && (
            <p className="mt-2 text-xs leading-5 text-slate-500">{formula.notes}</p>
          )}
          {hasCalc && (
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#185FA5]">
              <Icons.Calculator size={12} />
              Open calculator
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">configured</span>
            </div>
          )}
        </div>
      </article>

      {/* Drill mode flash card preview */}
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500">Drill mode flash card:</p>
        <div className="overflow-hidden rounded-xl border border-[#185FA5]/30 bg-white shadow">
          <div className="h-1.5 w-full bg-[#185FA5]" />
          <div className="px-5 py-4">
            <p className="font-mono text-xs font-bold text-[#185FA5]">
              {formula.code || <span className="text-slate-300 italic">code</span>}
            </p>
            <h2 className="mt-1.5 text-lg font-extrabold text-slate-900">
              {formula.name || <span className="italic text-slate-300">Formula name</span>}
            </h2>
            <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-6">
              <p className="text-xs text-slate-400">Can you recall this formula?</p>
              <div className="rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-bold text-white opacity-60">
                Reveal expression
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Import Tab ────────────────────────────────────────────────────────────────

function ImportTab({ onDone }: { onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<ImportBatch | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped?: number; errors: string[]; sections: string[]; rolledBack?: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setPreview(null); setResult(null); }
  }

  async function handlePreview() {
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("preview", "true");
    const res = await adminFetch("/api/admin/formulas/import", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      setPreview(data.batch);
    }
    setLoading(false);
  }

  async function handleImport() {
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await adminFetch("/api/admin/formulas/import", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    setResult(data);
    setPreview(null);
    if (res.ok && data.imported > 0) onDone();
    setLoading(false);
  }

  const totalFormulas = preview?.sections.reduce((s, sec) => s + sec.formulas.length, 0) ?? 0;

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition cursor-pointer",
          dragOver ? "border-[#185FA5] bg-[#E6F1FB]" : "border-slate-200 bg-slate-50 hover:border-slate-300"
        )}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(null); setResult(null); } }}
        />
        <Icons.Upload size={28} className="mb-2 text-slate-300" />
        {file ? (
          <p className="text-sm font-semibold text-[#185FA5]">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-600">Drop a .csv or .txt file</p>
            <p className="mt-1 text-xs text-slate-400">or click to browse</p>
          </>
        )}
      </div>

      {file && !preview && !result && (
        <div className="flex gap-2">
          <ActionBtn onClick={handlePreview} disabled={loading}>
            {loading ? "Parsing…" : "Preview Import"}
          </ActionBtn>
          <ActionBtn tone="ghost" small onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }}>
            Clear
          </ActionBtn>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              {totalFormulas} formula{totalFormulas !== 1 ? "s" : ""} across {preview.sections.length} section{preview.sections.length !== 1 ? "s" : ""}
              {preview.errors.length > 0 && <span className="ml-2 text-amber-600">— {preview.errors.length} error{preview.errors.length !== 1 ? "s" : ""}</span>}
            </p>
          </div>

          <div className="max-h-56 overflow-y-auto rounded-lg border border-slate-100">
            {/* #20 Import preview now shows Expression column */}
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-50">
                <tr>
                  {["Section", "Code", "Name", "Expression", "Calc?"].map((h) => (
                    <th key={h} className="px-2 py-1.5 text-left font-semibold text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.sections.flatMap((sec) =>
                  sec.formulas.map((f) => (
                    <tr key={`${sec.code}-${f.code}`} className="border-t border-slate-100">
                      <td className="px-2 py-1.5 font-mono text-[10px] text-[#185FA5]">{sec.code}</td>
                      <td className="px-2 py-1.5 font-mono text-[10px]">{f.code}</td>
                      <td className="px-2 py-1.5 max-w-[140px] truncate">{f.name}</td>
                      <td className="px-2 py-1.5 font-mono text-[10px] max-w-[200px] truncate text-slate-500">{f.expression}</td>
                      <td className="px-2 py-1.5">{f.calcMetaJson ? "✓" : "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {preview.errors.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="mb-1 text-xs font-semibold text-amber-700">Errors ({preview.errors.length})</p>
              <ul className="space-y-0.5">
                {preview.errors.map((e, i) => <li key={i} className="font-mono text-[10px] text-amber-700">• {e}</li>)}
              </ul>
            </div>
          )}

          <div className="flex gap-2">
            <ActionBtn onClick={handleImport} disabled={loading || totalFormulas === 0}>
              {loading ? "Importing…" : `Import ${totalFormulas} formula${totalFormulas !== 1 ? "s" : ""}`}
            </ActionBtn>
            <ActionBtn tone="ghost" small onClick={() => setPreview(null)}>Cancel</ActionBtn>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={cn(
          "rounded-xl border p-4 text-sm space-y-2",
          result.rolledBack ? "border-red-200 bg-red-50 text-red-800" :
          result.imported > 0 ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"
        )}>
          {result.rolledBack ? (
            <p className="font-semibold">Import failed — all changes were rolled back.</p>
          ) : (
            <p className="font-semibold">
              {result.imported > 0
                ? `${result.imported} formula${result.imported !== 1 ? "s" : ""} imported across ${result.sections.length} section${result.sections.length !== 1 ? "s" : ""}.`
                : "No formulas were imported."}
              {result.skipped ? ` ${result.skipped} skipped (already exist).` : ""}
            </p>
          )}
          {result.errors.length > 0 && (
            <ul className="space-y-0.5">
              {result.errors.map((e, i) => <li key={i} className="font-mono text-xs">• {e}</li>)}
            </ul>
          )}
          <button
            type="button"
            onClick={() => { setResult(null); setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
            className="text-xs underline opacity-70 hover:opacity-100"
          >
            Import another file
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Templates Tab ─────────────────────────────────────────────────────────────

function TemplatesTab() {
  const csvCols = [
    ["section_code", "Required", "Short section code, e.g. S1"],
    ["section_title", "Required", "Full section name"],
    ["section_position", "Required", "Integer sort order"],
    ["formula_code", "Required", "Formula code, e.g. S1.F9"],
    ["formula_name", "Required", "Human-readable name"],
    ["formula_expression", "Required", "Display formula string"],
    ["formula_notes", "Optional", "One-sentence description"],
    ["calc_expression", "Optional", "Safe math expr using variable keys"],
    ["calc_output_label", "Optional", "Label for the result"],
    ["calc_output_type", "Optional", "currency | percentage | number | ratio | integer"],
    ["calc_variables", "Optional", "key:label:type:required:placeholder:helperText — pipe-separated"],
    ["calc_explanation", "Optional", "Explanation shown in calculator panel"],
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* CSV */}
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E6F1FB] text-[#185FA5]">
            <Icons.FileText size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">CSV Template</p>
            <p className="text-xs text-slate-500">One row per formula. Upload as .csv</p>
          </div>
        </div>

        <a
          href="/api/admin/formulas/template?format=csv"
          download="formula-import-template.csv"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5]"
        >
          <Icons.LogOut size={13} className="-rotate-90" /> Download CSV Template
        </a>

        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full text-[10px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-2 py-1.5 text-left font-semibold text-slate-500">Column</th>
                <th className="px-2 py-1.5 text-left font-semibold text-slate-500">Required?</th>
                <th className="px-2 py-1.5 text-left font-semibold text-slate-500">Description</th>
              </tr>
            </thead>
            <tbody>
              {csvCols.map(([col, req, desc]) => (
                <tr key={col} className="border-t border-slate-100">
                  <td className="px-2 py-1 font-mono text-[#185FA5]">{col}</td>
                  <td className={cn("px-2 py-1 font-semibold", req === "Required" ? "text-amber-600" : "text-slate-400")}>{req}</td>
                  <td className="px-2 py-1 text-slate-500">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <p className="mb-1 text-[10px] font-semibold text-slate-500">calc_variables encoding:</p>
          <pre className="overflow-x-auto rounded-lg bg-slate-50 p-2 text-[10px] text-slate-600 whitespace-pre-wrap">
{`key:label:type:required:placeholder:helperText
One entry per variable, separated by pipes ( | )

Example:
sale:Sale Price:currency:true:250000:The sale price
|rate:Monthly Rate (%):percentage:true:0.5:e.g. 0.5 for 0.5%/month
|periods:Number of Months:integer:true:12:`}
          </pre>
        </div>
      </div>

      {/* Text / DOCX */}
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0ede3] text-slate-600">
            <Icons.FileText size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Text Template (.txt)</p>
            <p className="text-xs text-slate-500">One block per formula, separated by <code>---</code>. Upload as .txt</p>
          </div>
        </div>

        <a
          href="/api/admin/formulas/template?format=docx"
          download="formula-import-template.txt"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5]"
        >
          <Icons.LogOut size={13} className="-rotate-90" /> Download Text Template
        </a>

        <div>
          <p className="mb-1 text-[10px] font-semibold text-slate-500">Block format example:</p>
          <pre className="overflow-x-auto rounded-lg bg-slate-50 p-2 text-[10px] text-slate-600 whitespace-pre">
{`SECTION CODE: S1
SECTION TITLE: Sales Comparison & Regression
SECTION POSITION: 1
FORMULA CODE: S1.F9
FORMULA NAME: Trending Forward
EXPRESSION: Adjusted = Sale × (1+r)^n
NOTES: Trends a sale price forward to valuation date.
CALC EXPRESSION: sale * (1 + rate / 100) ^ periods
CALC OUTPUT LABEL: Adjusted Sale Price
CALC OUTPUT TYPE: currency
VARIABLES: sale:Sale Price:currency:true:250000:
 |rate:Monthly Rate (%):percentage:true:0.5:
 |periods:Number of Months:integer:true:12:
CALC EXPLANATION: Brings a comparable sale forward in time.
---`}
          </pre>
        </div>
      </div>
    </div>
  );
}
