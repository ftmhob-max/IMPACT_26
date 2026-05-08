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
    formulas: Array<{ code: string; name: string; expression: string; notes?: string; calcMetaJson?: string; position: number }>;
  }>;
  errors: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const INPUT_TYPES: InputType[] = ["currency", "percentage", "number", "ratio", "integer"];

function parseMeta(json: string | null | undefined): CalcMeta | null {
  if (!json) return null;
  try { return JSON.parse(json) as CalcMeta; } catch { return null; }
}

function SmallField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function inputClass(error?: boolean) {
  return cn(
    "w-full rounded-lg border px-3 py-2 text-sm text-slate-800 outline-none transition",
    error ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-200 focus:border-[#185FA5] focus:ring-2 focus:ring-[#E6F1FB]"
  );
}

function ActionBtn({ onClick, children, tone = "primary", disabled, small }: {
  onClick?: () => void; children: React.ReactNode;
  tone?: "primary" | "danger" | "ghost"; disabled?: boolean; small?: boolean;
}) {
  const base = "inline-flex items-center gap-1.5 rounded-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = small ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm";
  const tones = {
    primary: "bg-[#185FA5] text-white hover:bg-[#134d88] focus-visible:ring-[#185FA5]",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    ghost: "border border-slate-200 text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:ring-[#185FA5]",
  }[tone];
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cn(base, sizes, tones)}>
      {children}
    </button>
  );
}

// ─── Sub-tabs enum ────────────────────────────────────────────────────────────

type EditorTab = "fields" | "calc" | "verify";
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

  // ── Load ──────────────────────────────────────────────────────────────────

  const loadSections = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch("/api/admin/formulas");
    if (res.ok) {
      const data: AdminSection[] = await res.json();
      setSections(data);
      setOpenSectionIds(new Set(data.map((s) => s.id)));
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadSections(); }, [loadSections]);

  const showNotice = (msg: string, ok = true) => {
    setNotice({ msg, ok });
    setTimeout(() => setNotice(null), 4000);
  };

  // ── Search filter ─────────────────────────────────────────────────────────

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sections;
    return sections.map((s) => ({
      ...s,
      formulas: s.formulas.filter(
        (f) => f.name.toLowerCase().includes(q) || f.code.toLowerCase().includes(q) || f.expression.toLowerCase().includes(q)
      ),
    })).filter((s) => s.formulas.length > 0);
  }, [sections, search]);

  // ── Formula select ────────────────────────────────────────────────────────

  function selectFormula(formula: AdminFormula, sectionId: string) {
    setSelectedFormula({ ...formula });
    setSelectedSectionId(sectionId);
    setIsCreating(false);
    setEditorTab("fields");
    setConfirmDeleteId(null);
  }

  function startCreate(sectionId: string) {
    const section = sections.find((s) => s.id === sectionId);
    setSelectedFormula({
      id: "",
      code: "",
      name: "",
      expression: "",
      notes: "",
      calcMetaJson: null,
      position: section ? section.formulas.length : 0,
    });
    setSelectedSectionId(sectionId);
    setIsCreating(true);
    setEditorTab("fields");
  }

  // ── Save formula ──────────────────────────────────────────────────────────

  async function saveFormula() {
    if (!selectedFormula) return;
    setSavingBusy(true);
    try {
      if (isCreating) {
        const res = await adminFetch("/api/admin/formulas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionId: selectedSectionId,
            code: selectedFormula.code,
            name: selectedFormula.name,
            expression: selectedFormula.expression,
            notes: selectedFormula.notes,
            position: selectedFormula.position,
            calcMetaJson: selectedFormula.calcMetaJson,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        setIsCreating(false);
      } else {
        const res = await adminFetch(`/api/admin/formulas/${selectedFormula.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: selectedFormula.code,
            name: selectedFormula.name,
            expression: selectedFormula.expression,
            notes: selectedFormula.notes,
            calcMetaJson: selectedFormula.calcMetaJson,
            position: selectedFormula.position,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
      }
      await loadSections();
      showNotice("Formula saved.");
      onSaved?.();
    } catch (e) {
      showNotice(`Error: ${e}`, false);
    }
    setSavingBusy(false);
  }

  // ── Delete formula ────────────────────────────────────────────────────────

  async function deleteFormula(id: string) {
    setSavingBusy(true);
    try {
      const res = await adminFetch(`/api/admin/formulas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setSelectedFormula(null);
      setConfirmDeleteId(null);
      await loadSections();
      showNotice("Formula deleted.");
      onSaved?.();
    } catch (e) {
      showNotice(`Error: ${e}`, false);
    }
    setSavingBusy(false);
  }

  // ── Delete section ────────────────────────────────────────────────────────

  async function deleteSection(id: string) {
    setSavingBusy(true);
    try {
      const res = await adminFetch(`/api/admin/formulas/sections/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setConfirmDeleteSectionId(null);
      if (selectedSectionId === id) { setSelectedFormula(null); setSelectedSectionId(null); }
      await loadSections();
      showNotice("Section and all its formulas deleted.");
      onSaved?.();
    } catch (e) {
      showNotice(`Error: ${e}`, false);
    }
    setSavingBusy(false);
  }

  // ── Add section ───────────────────────────────────────────────────────────

  const [newSection, setNewSection] = useState({ code: "", title: "", position: 0 });

  async function addSection() {
    if (!newSection.code || !newSection.title) return;
    setSavingBusy(true);
    try {
      const res = await adminFetch("/api/admin/formulas/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: newSection.code, title: newSection.title, position: newSection.position }),
      });
      if (!res.ok) throw new Error(await res.text());
      setAddSectionOpen(false);
      setNewSection({ code: "", title: "", position: 0 });
      await loadSections();
      showNotice("Section created.");
    } catch (e) {
      showNotice(`Error: ${e}`, false);
    }
    setSavingBusy(false);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {notice && (
        <div className={cn(
          "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
          notice.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
        )}>
          {notice.ok ? <Icons.Check size={16} className="mt-0.5 shrink-0" /> : <Icons.AlertCircle size={16} className="mt-0.5 shrink-0" />}
          <p>{notice.msg}</p>
        </div>
      )}

      {/* Panel tabs */}
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
        {(["manage", "import", "templates"] as PanelTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setPanelTab(tab)}
            className={cn(
              "flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition",
              panelTab === tab ? "bg-white text-[#185FA5] shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {tab === "manage" ? "Manage Formulas" : tab === "import" ? "Bulk Import" : "Templates"}
          </button>
        ))}
      </div>

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
          setSelectedFormula={setSelectedFormula}
          isCreating={isCreating}
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
          saveFormula={saveFormula}
          deleteFormula={deleteFormula}
          deleteSection={deleteSection}
          addSection={addSection}
        />
      )}

      {panelTab === "import" && (
        <ImportTab onDone={async () => { await loadSections(); showNotice("Import complete."); onSaved?.(); }} />
      )}

      {panelTab === "templates" && <TemplatesTab />}
    </div>
  );
}

// ─── Manage Tab ───────────────────────────────────────────────────────────────

function ManageTab({
  sections, filteredSections, loading, search, setSearch,
  openSectionIds, setOpenSectionIds,
  selectedFormula, selectedSectionId, setSelectedFormula,
  isCreating, editorTab, setEditorTab,
  savingBusy, confirmDeleteId, setConfirmDeleteId,
  confirmDeleteSectionId, setConfirmDeleteSectionId,
  addSectionOpen, setAddSectionOpen, newSection, setNewSection,
  selectFormula, startCreate, saveFormula, deleteFormula, deleteSection, addSection,
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
  setSelectedFormula: React.Dispatch<React.SetStateAction<AdminFormula | null>>;
  isCreating: boolean;
  editorTab: EditorTab;
  setEditorTab: (v: EditorTab) => void;
  savingBusy: boolean;
  confirmDeleteId: string | null;
  setConfirmDeleteId: (v: string | null) => void;
  confirmDeleteSectionId: string | null;
  setConfirmDeleteSectionId: (v: string | null) => void;
  addSectionOpen: boolean;
  setAddSectionOpen: (v: boolean) => void;
  newSection: { code: string; title: string; position: number };
  setNewSection: React.Dispatch<React.SetStateAction<{ code: string; title: string; position: number }>>;
  selectFormula: (f: AdminFormula, sectionId: string) => void;
  startCreate: (sectionId: string) => void;
  saveFormula: () => void;
  deleteFormula: (id: string) => void;
  deleteSection: (id: string) => void;
  addSection: () => void;
}) {
  function toggleSection(id: string) {
    setOpenSectionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

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
        ) : filteredSections.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">No formulas found.</p>
        ) : (
          <div className="space-y-2">
            {filteredSections.map((section) => {
              const isOpen = openSectionIds.has(section.id);
              return (
                <div key={section.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5">
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
                    {confirmDeleteSectionId === section.id ? (
                      <span className="flex items-center gap-1">
                        <button onClick={() => deleteSection(section.id)} className="text-[10px] font-bold text-red-600 hover:underline">Confirm</button>
                        <button onClick={() => setConfirmDeleteSectionId(null)} className="text-[10px] text-slate-400 hover:underline">Cancel</button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteSectionId(section.id)}
                        className="shrink-0 text-slate-300 hover:text-red-500"
                        title="Delete section"
                      >
                        <Icons.X size={13} />
                      </button>
                    )}
                  </div>

                  {isOpen && (
                    <div className="border-t border-slate-100">
                      {section.formulas.map((formula) => {
                        const isSelected = selectedFormula?.id === formula.id && !isCreating;
                        const hasCalc = !!formula.calcMetaJson || !!getFormulaCalculator(formula.code);
                        return (
                          <button
                            key={formula.id}
                            type="button"
                            onClick={() => selectFormula(formula, section.id)}
                            className={cn(
                              "flex w-full items-start justify-between gap-2 px-3 py-2.5 text-left transition",
                              isSelected ? "bg-[#E6F1FB]" : "hover:bg-slate-50"
                            )}
                          >
                            <div className="min-w-0">
                              <p className="font-mono text-[10px] font-semibold text-[#185FA5]">{formula.code}</p>
                              <p className="truncate text-xs font-medium text-slate-700">{formula.name}</p>
                            </div>
                            {hasCalc && (
                              <span title="Calculator configured">
                                <Icons.Calculator size={12} className="mt-0.5 shrink-0 text-emerald-500" />
                              </span>
                            )}
                          </button>
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
              <input placeholder="Code (e.g. S5)" value={newSection.code} onChange={(e) => setNewSection((p) => ({ ...p, code: e.target.value }))} className={inputClass()} />
              <input placeholder="Title" value={newSection.title} onChange={(e) => setNewSection((p) => ({ ...p, title: e.target.value }))} className={inputClass()} />
              <input type="number" placeholder="Position" value={newSection.position} onChange={(e) => setNewSection((p) => ({ ...p, position: parseInt(e.target.value) || 0 }))} className={inputClass()} />
              <div className="flex gap-2">
                <ActionBtn onClick={addSection} disabled={savingBusy || !newSection.code || !newSection.title} small>Create</ActionBtn>
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
            <p className="mt-1 text-xs text-slate-400">Or click "+ Add formula" under a section.</p>
          </div>
        ) : (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            {/* Editor sub-tabs */}
            <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
              {([["fields", "Formula"], ["calc", "Calculator Setup"], ["verify", "Verify"]] as [EditorTab, string][]).map(([tab, label]) => (
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

            {editorTab === "fields" && (
              <FieldsEditor
                formula={selectedFormula}
                sections={sections}
                selectedSectionId={selectedSectionId}
                isCreating={isCreating}
                savingBusy={savingBusy}
                confirmDeleteId={confirmDeleteId}
                setConfirmDeleteId={setConfirmDeleteId}
                onChange={(patch) => setSelectedFormula((prev) => prev ? { ...prev, ...patch } : prev)}
                onSave={saveFormula}
                onDelete={deleteFormula}
              />
            )}

            {editorTab === "calc" && (
              <CalcSetupEditor
                formula={selectedFormula}
                savingBusy={savingBusy}
                onChange={(patch) => setSelectedFormula((prev) => prev ? { ...prev, ...patch } : prev)}
                onSave={saveFormula}
              />
            )}

            {editorTab === "verify" && (
              <VerifyPanel formula={selectedFormula} />
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
  confirmDeleteId, setConfirmDeleteId, onChange, onSave, onDelete,
}: {
  formula: AdminFormula; sections: AdminSection[]; selectedSectionId: string | null;
  isCreating: boolean; savingBusy: boolean;
  confirmDeleteId: string | null; setConfirmDeleteId: (v: string | null) => void;
  onChange: (patch: Partial<AdminFormula>) => void;
  onSave: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <SmallField label="Formula Code">
          <input value={formula.code} onChange={(e) => onChange({ code: e.target.value })} placeholder="e.g. S1.F9" className={inputClass()} />
        </SmallField>
        <SmallField label="Section">
          <select value={selectedSectionId ?? ""} onChange={() => {}} disabled className={cn(inputClass(), "bg-slate-50 text-slate-400")}>
            {sections.map((s) => <option key={s.id} value={s.id}>{s.code} — {s.title}</option>)}
          </select>
        </SmallField>
      </div>

      <SmallField label="Formula Name">
        <input value={formula.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="e.g. Trending Forward" className={inputClass()} />
      </SmallField>

      <SmallField label="Display Expression">
        <textarea
          value={formula.expression}
          onChange={(e) => onChange({ expression: e.target.value })}
          placeholder="e.g. Adjusted = Sale × (1+r)^n"
          rows={2}
          className={cn(inputClass(), "resize-none font-mono text-xs")}
        />
      </SmallField>

      <SmallField label="Notes (optional)">
        <textarea
          value={formula.notes ?? ""}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Short explanation shown below the formula card"
          rows={2}
          className={cn(inputClass(), "resize-none text-xs")}
        />
      </SmallField>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <ActionBtn onClick={onSave} disabled={savingBusy || !formula.code || !formula.name || !formula.expression}>
          {savingBusy ? "Saving…" : isCreating ? "Create Formula" : "Save Changes"}
        </ActionBtn>
        {!isCreating && formula.id && (
          confirmDeleteId === formula.id ? (
            <>
              <ActionBtn tone="danger" onClick={() => onDelete(formula.id)} disabled={savingBusy} small>Confirm Delete</ActionBtn>
              <ActionBtn tone="ghost" onClick={() => setConfirmDeleteId(null)} small>Cancel</ActionBtn>
            </>
          ) : (
            <ActionBtn tone="ghost" onClick={() => setConfirmDeleteId(formula.id)} small>
              <Icons.X size={12} /> Delete
            </ActionBtn>
          )
        )}
      </div>
    </div>
  );
}

// ─── Calculator Setup Editor ───────────────────────────────────────────────────

function CalcSetupEditor({
  formula, savingBusy, onChange, onSave,
}: {
  formula: AdminFormula; savingBusy: boolean;
  onChange: (patch: Partial<AdminFormula>) => void;
  onSave: () => void;
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
    setVariables((prev) => [
      ...prev,
      { key: "", label: "", type: "number", required: true, placeholder: "", helperText: "" },
    ]);
  }

  function updateVariable(i: number, patch: Partial<CalcVariable>) {
    setVariables((prev) => prev.map((v, idx) => idx === i ? { ...v, ...patch } : v));
  }

  function removeVariable(i: number) {
    setVariables((prev) => prev.filter((_, idx) => idx !== i));
  }

  function buildAndSave() {
    if (!calcExpr.trim() || variables.length === 0) {
      onChange({ calcMetaJson: null });
    } else {
      const meta: CalcMeta = {
        variables,
        expression: calcExpr.trim(),
        output: { key: "result", label: outputLabel, type: outputType },
        explanation: explanation.trim() || undefined,
      };
      onChange({ calcMetaJson: JSON.stringify(meta) });
    }
    setTimeout(onSave, 0);
  }

  function clearConfig() {
    onChange({ calcMetaJson: null });
    setVariables([]); setCalcExpr(""); setOutputLabel("Result"); setOutputType("number"); setExplanation("");
    setTimeout(onSave, 0);
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
          This formula has a built-in calculator. Define a DB config below only to override or customize it.
        </p>
      )}

      {/* Variables */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-600">Input Variables</label>
          <ActionBtn small tone="ghost" onClick={addVariable}><Icons.Plus size={11} /> Add</ActionBtn>
        </div>
        {variables.length === 0 ? (
          <p className="text-xs text-slate-400">No variables defined. Click "+ Add" to start.</p>
        ) : (
          <div className="space-y-2">
            {variables.map((v, i) => (
              <div key={i} className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 sm:grid-cols-[1fr_2fr_1fr_auto]">
                <input value={v.key} onChange={(e) => updateVariable(i, { key: e.target.value.replace(/\W/g, "").toLowerCase() })} placeholder="key" className={cn(inputClass(), "font-mono text-xs")} title="Variable key (no spaces)" />
                <input value={v.label} onChange={(e) => updateVariable(i, { label: e.target.value })} placeholder="Label" className={inputClass()} />
                <select value={v.type} onChange={(e) => updateVariable(i, { type: e.target.value as InputType })} className={inputClass()}>
                  {INPUT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                    <input type="checkbox" checked={v.required} onChange={(e) => updateVariable(i, { required: e.target.checked })} className="h-3 w-3" />
                    Req.
                  </label>
                  <button type="button" onClick={() => removeVariable(i)} className="text-slate-300 hover:text-red-500"><Icons.X size={13} /></button>
                </div>
                <input value={v.placeholder ?? ""} onChange={(e) => updateVariable(i, { placeholder: e.target.value })} placeholder="Placeholder" className={cn(inputClass(), "col-span-full sm:col-span-2 text-xs")} />
                <input value={v.helperText ?? ""} onChange={(e) => updateVariable(i, { helperText: e.target.value })} placeholder="Helper text" className={cn(inputClass(), "col-span-full sm:col-span-2 text-xs")} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Calc expression */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-600">
          Calculation Expression
          <span className="ml-1 font-normal text-slate-400">(use variable keys, +,-,*,/,^, sqrt(), etc.)</span>
        </label>
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
      </div>

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

      {/* Explanation */}
      <SmallField label="Explanation (shown in calculator)">
        <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="Brief explanation shown in italic below the formula…" rows={2} className={cn(inputClass(), "resize-none text-xs")} />
      </SmallField>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-1">
        <ActionBtn onClick={buildAndSave} disabled={savingBusy || (calcExpr.trim() !== "" && validation?.ok === false)}>
          {savingBusy ? "Saving…" : "Save Calculator Config"}
        </ActionBtn>
        {(hasDb) && (
          <ActionBtn tone="ghost" small onClick={clearConfig} disabled={savingBusy}>
            <Icons.X size={12} /> Clear DB Config
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
  const [error, setError] = useState<string | null>(null);
  const [ran, setRan] = useState(false);

  function runVerify() {
    if (!meta) return;
    const numVars: Record<string, number> = {};
    for (const v of meta.variables) {
      const raw = inputs[v.key] ?? "";
      const n = parseFloat(raw);
      if (raw.trim() === "" && v.required) { setError(`Missing: ${v.label}`); setRan(true); return; }
      numVars[v.key] = isNaN(n) ? (v.required ? NaN : 0) : n;
    }

    try {
      let computed: number | null = null;
      if (dbMeta) {
        computed = evalExpression(dbMeta.expression, numVars);
      } else if (staticConfig) {
        computed = staticConfig.compute(numVars);
      }
      if (computed === null || !isFinite(computed)) {
        setError("Result is not a finite number — check for division by zero or invalid inputs.");
        setResult(null);
      } else {
        setResult(computed);
        setError(null);
      }
    } catch (e) {
      setError(String(e));
      setResult(null);
    }
    setRan(true);
  }

  function reset() { setInputs({}); setResult(null); setError(null); setRan(false); }

  if (!meta) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
        No calculator config. Define variables and an expression in the <strong>Calculator Setup</strong> tab first.
      </div>
    );
  }

  const checks = [
    { label: "Expression defined", pass: dbMeta ? Boolean(dbMeta.expression.trim()) : Boolean(staticConfig) },
    { label: "Variables defined", pass: meta.variables.length > 0 },
    { label: "Result is valid number", pass: ran && result !== null },
  ];

  return (
    <div className="space-y-4">
      <div className="font-calc rounded-md border border-[#b8d7f0] bg-[#f8fbff] px-3 py-2.5 text-xs text-slate-800">
        {formula.expression}
      </div>

      {dbMeta && (
        <p className="text-[11px] font-mono text-slate-400">Calc expr: {dbMeta.expression}</p>
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

      {/* Checks */}
      <ul className="space-y-1">
        {checks.map((c) => (
          <li key={c.label} className="flex items-center gap-2 text-xs">
            <span className={c.pass ? "text-emerald-500" : "text-slate-300"}>{c.pass ? <Icons.Check size={13} /> : <Icons.AlertCircle size={13} />}</span>
            <span className={c.pass ? "text-slate-600" : "text-slate-400"}>{c.label}</span>
          </li>
        ))}
      </ul>

      {ran && error && <p className="text-xs text-red-500">{error}</p>}

      {ran && result !== null && (
        <div className="rounded-lg border border-slate-200 bg-[#f8fbff] px-4 py-3">
          <p className="text-xs font-semibold text-[#185FA5]">{meta.output.label}</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">
            {formatValue(result, meta.output.type)}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <ActionBtn onClick={runVerify}>Run Verification</ActionBtn>
        <ActionBtn tone="ghost" small onClick={reset}>Reset</ActionBtn>
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
  const [result, setResult] = useState<{ imported: number; errors: string[]; sections: string[] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
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
    if (res.ok) {
      const data = await res.json();
      setResult(data);
      setPreview(null);
      if (data.imported > 0) onDone();
    }
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
          accept=".csv,.docx,.txt"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(null); setResult(null); } }}
        />
        <Icons.Upload size={28} className="mb-2 text-slate-300" />
        {file ? (
          <p className="text-sm font-semibold text-[#185FA5]">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-600">Drop a .csv, .docx, or .txt file</p>
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

          <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-100">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-50">
                <tr>
                  {["Section", "Code", "Name", "Calc?"].map((h) => (
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
                      <td className="px-2 py-1.5">{f.name}</td>
                      <td className="px-2 py-1.5">{f.calcMetaJson ? "✓" : "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {preview.errors.length > 0 && (
            <ul className="space-y-1">
              {preview.errors.map((e, i) => (
                <li key={i} className="text-xs text-red-500">• {e}</li>
              ))}
            </ul>
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
          "rounded-xl border p-4 text-sm",
          result.imported > 0 ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"
        )}>
          <p className="font-semibold">
            {result.imported > 0
              ? `${result.imported} formula${result.imported !== 1 ? "s" : ""} imported across ${result.sections.length} section${result.sections.length !== 1 ? "s" : ""}.`
              : "No formulas were imported."}
          </p>
          {result.errors.length > 0 && (
            <ul className="mt-2 space-y-1">
              {result.errors.map((e, i) => <li key={i} className="text-xs">• {e}</li>)}
            </ul>
          )}
          <button
            type="button"
            onClick={() => { setResult(null); setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
            className="mt-3 text-xs underline opacity-70 hover:opacity-100"
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

      {/* DOCX / TXT */}
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0ede3] text-slate-600">
            <Icons.FileText size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">DOCX / Text Template</p>
            <p className="text-xs text-slate-500">One block per formula, separated by <code>---</code>. Upload as .docx or .txt</p>
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

        <p className="text-[10px] text-slate-400">
          Supported field names are shown above in uppercase. The <code>---</code> line (three dashes) separates each formula block. Fields in DOCX files are extracted as plain text by mammoth.
        </p>
      </div>
    </div>
  );
}
