"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { toast } from "@/components/admin/AdminFeedback";
import { GlossaryImportPanel } from "@/components/admin/GlossaryImportPanel";
import { DomainCombobox } from "@/components/admin/DomainCombobox";
import { DomainBadge } from "@/components/ui/DomainBadge";
import { FieldHint } from "@/components/ui/FieldHint";
import { EmptyState } from "@/components/admin/EmptyState";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  fullDefinition?: string | null;
  domain?: string | null;
  category?: string | null;
  example?: string | null;
  relatedTerms: string[];
  isPublished: boolean;
  sourceDocument?: string | null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function GlossaryManager() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | "published" | "draft">("");
  const [selected, setSelected] = useState<GlossaryTerm | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/glossary", { cache: "no-store" });
    if (res.ok) setTerms((await res.json()).terms ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function showNotice(type: "success" | "error", text: string) {
    toast(type, text);
  }

  function enterSelectMode() {
    setSelectMode(true);
    setSelected(null);
    setShowCreate(false);
    setSelectedIds(new Set());
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelectedIds(new Set());
  }

  function toggleSelectId(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function deleteTerm(id: string) {
    if (!confirm("Delete this term? All student notes for it will also be removed.")) return;
    const res = await fetch(`/api/admin/glossary/${id}`, { method: "DELETE" });
    if (res.ok) {
      showNotice("success", "Term deleted.");
      if (selected?.id === id) setSelected(null);
      await load();
    } else {
      showNotice("error", "Failed to delete term.");
    }
  }

  async function togglePublish(term: GlossaryTerm) {
    const res = await fetch(`/api/admin/glossary/${term.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !term.isPublished }),
    });
    if (res.ok) {
      showNotice("success", term.isPublished ? "Term unpublished." : "Term published.");
      await load();
    } else {
      showNotice("error", "Failed to update term.");
    }
  }

  const filtered = terms.filter((t) => {
    if (search && !t.term.toLowerCase().includes(search.toLowerCase()) && !t.definition.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterDomain && t.domain !== filterDomain) return false;
    if (filterStatus === "published" && !t.isPublished) return false;
    if (filterStatus === "draft" && t.isPublished) return false;
    return true;
  });

  const allFilteredSelected = filtered.length > 0 && filtered.every((t) => selectedIds.has(t.id));
  const someFilteredSelected = filtered.some((t) => selectedIds.has(t.id));

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((t) => t.id)));
    }
  }

  async function bulkPublish(publish: boolean) {
    const targets = [...selectedIds];
    if (targets.length === 0) return;
    setBulkBusy(true);
    await Promise.all(
      targets.map((id) =>
        fetch(`/api/admin/glossary/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPublished: publish }),
        })
      )
    );
    showNotice("success", `${targets.length} term${targets.length > 1 ? "s" : ""} ${publish ? "published" : "unpublished"}.`);
    setSelectedIds(new Set());
    setBulkBusy(false);
    await load();
  }

  async function bulkDelete() {
    if (!confirm(`Delete ${selectedIds.size} term(s)? All student notes will also be removed.`)) return;
    const targets = [...selectedIds];
    setBulkBusy(true);
    await Promise.all(targets.map((id) => fetch(`/api/admin/glossary/${id}`, { method: "DELETE" })));
    showNotice("success", `${targets.length} term${targets.length > 1 ? "s" : ""} deleted.`);
    if (selected && selectedIds.has(selected.id)) setSelected(null);
    setSelectedIds(new Set());
    setBulkBusy(false);
    await load();
  }

  // Group by first letter
  const grouped = filtered.reduce<Record<string, GlossaryTerm[]>>((acc, t) => {
    const key = t.term[0]?.toUpperCase() ?? "#";
    (acc[key] ??= []).push(t);
    return acc;
  }, {});
  const letters = Object.keys(grouped).sort();

  const publishedCount = terms.filter((t) => t.isPublished).length;

  return (
    <div className="flex min-h-0 flex-col gap-5 lg:flex-row">
      {/* Left column: list */}
      <div className={cn("flex min-w-0 flex-col gap-4", selected ? "w-full lg:w-80 lg:shrink-0" : "flex-1")}>
        {/* Stats + header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Glossary terms</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {terms.length} total · {publishedCount} published · {terms.length - publishedCount} draft
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <button
              type="button"
              onClick={selectMode ? exitSelectMode : enterSelectMode}
              className={cn(
                "admin-action secondary flex items-center gap-1.5 text-sm",
                selectMode && "bg-[#185FA5] text-white border-[#185FA5]"
              )}
            >
              <SelectIcon size={14} checked={someFilteredSelected} indeterminate={someFilteredSelected && !allFilteredSelected} />
              {selectMode ? "Cancel" : "Select"}
            </button>
            <button
              type="button"
              onClick={() => { setShowImport((v) => !v); setShowCreate(false); setSelected(null); exitSelectMode(); }}
              className={cn("admin-action secondary flex items-center gap-1.5 text-sm", showImport && "bg-[#185FA5] text-white border-[#185FA5]")}
            >
              <Icons.Upload size={14} />
              Import
            </button>
            <button
              type="button"
              onClick={() => { setShowCreate(true); setShowImport(false); setSelected(null); exitSelectMode(); }}
              className="admin-action flex items-center gap-1.5 text-sm"
            >
              <Icons.Plus size={14} />
              New term
            </button>
          </div>
        </div>

        {/* Import panel */}
        {showImport && (
          <GlossaryImportPanel
            onImported={() => { load(); showNotice("success", "Import complete — glossary updated."); }}
            onClose={() => setShowImport(false)}
          />
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            placeholder="Search terms…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input w-full sm:min-w-40 sm:flex-1"
          />
          <DomainCombobox value={filterDomain} onChange={setFilterDomain} allowClear clearLabel="All domains" className="w-full min-[380px]:w-36" />
          <select className="admin-input w-full min-[380px]:w-32" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Bulk action bar */}
        {selectMode && (
          <BulkActionBar
            selectedCount={selectedIds.size}
            allSelected={allFilteredSelected}
            someSelected={someFilteredSelected}
            filteredCount={filtered.length}
            busy={bulkBusy}
            onToggleAll={toggleSelectAll}
            onPublish={() => bulkPublish(true)}
            onUnpublish={() => bulkPublish(false)}
            onDelete={bulkDelete}
          />
        )}

        {/* Create form */}
        {showCreate && (
          <TermForm
            onSave={async (data) => {
              const res = await fetch("/api/admin/glossary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
              if (res.ok) {
                showNotice("success", "Term created.");
                setShowCreate(false);
                await load();
              } else {
                showNotice("error", "Failed to create term.");
              }
            }}
            onCancel={() => setShowCreate(false)}
          />
        )}

        {/* Term list */}
        {loading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-slate-400">
            <Icons.Loader size={16} className="animate-spin" />
            Loading glossary…
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Icons.BookOpen size={36} />}
            title={terms.length === 0 ? "No terms yet." : "No terms match your filters."}
            hint={
              terms.length === 0
                ? "Create the first glossary term to get started."
                : "Try adjusting your search or filters."
            }
          />
        ) : (
          <div className="space-y-4 overflow-y-auto pb-4">
            {letters.map((letter) => (
              <div key={letter}>
                <div className="sticky top-0 bg-[#f0efe9] px-1 py-1 z-10">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{letter}</span>
                </div>
                <div className="space-y-1 mt-1">
                  {grouped[letter].map((term) => (
                    <TermListRow
                      key={term.id}
                      term={term}
                      active={selected?.id === term.id}
                      compact={!!selected}
                      selectMode={selectMode}
                      checked={selectedIds.has(term.id)}
                      onSelect={() => { setSelected(term); setShowCreate(false); }}
                      onToggleSelect={() => toggleSelectId(term.id)}
                      onTogglePublish={() => togglePublish(term)}
                      onDelete={() => deleteTerm(term.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right column: detail/edit */}
      {selected && !selectMode && (
        <TermEditPanel
          key={selected.id}
          term={selected}
          onClose={() => setSelected(null)}
          onSaved={async () => {
            showNotice("success", "Term saved.");
            const res = await fetch("/api/admin/glossary", { cache: "no-store" });
            if (res.ok) {
              const data = await res.json();
              setTerms(data.terms ?? []);
              const updated = data.terms.find((t: GlossaryTerm) => t.id === selected.id);
              if (updated) setSelected(updated);
            }
          }}
          onDelete={() => deleteTerm(selected.id)}
        />
      )}
    </div>
  );
}

// ─── Bulk Action Bar ──────────────────────────────────────────────────────────

function BulkActionBar({
  selectedCount,
  allSelected,
  someSelected,
  filteredCount,
  busy,
  onToggleAll,
  onPublish,
  onUnpublish,
  onDelete,
}: {
  selectedCount: number;
  allSelected: boolean;
  someSelected: boolean;
  filteredCount: number;
  busy: boolean;
  onToggleAll: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
}) {
  const indeterminate = someSelected && !allSelected;
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#185FA5]/20 bg-[#E6F1FB] px-3 py-2 flex-wrap">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={allSelected}
          onChange={onToggleAll}
          className="h-4 w-4 rounded border-slate-300 accent-[#185FA5] cursor-pointer"
        />
        <span className="text-xs font-medium text-slate-700">
          {selectedCount === 0
            ? `${filteredCount} visible`
            : `${selectedCount} selected`}
        </span>
      </label>

      {selectedCount > 0 && (
        <>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPublish}
              disabled={busy}
              className="flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
            >
              {busy ? <Icons.Loader size={11} className="animate-spin" /> : <Icons.Eye size={11} />}
              Publish
            </button>
            <button
              type="button"
              onClick={onUnpublish}
              disabled={busy}
              className="flex items-center gap-1 rounded-md bg-slate-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-600 disabled:opacity-60 transition-colors"
            >
              {busy ? <Icons.Loader size={11} className="animate-spin" /> : <Icons.EyeOff size={11} />}
              Unpublish
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              className="flex items-center gap-1 rounded-md bg-red-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-60 transition-colors"
            >
              {busy ? <Icons.Loader size={11} className="animate-spin" /> : <Icons.Trash2 size={11} />}
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Term List Row ────────────────────────────────────────────────────────────

function TermListRow({
  term,
  active,
  compact,
  selectMode,
  checked,
  onSelect,
  onToggleSelect,
  onTogglePublish,
  onDelete,
}: {
  term: GlossaryTerm;
  active: boolean;
  compact: boolean;
  selectMode: boolean;
  checked: boolean;
  onSelect: () => void;
  onToggleSelect: () => void;
  onTogglePublish: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={selectMode ? onToggleSelect : onSelect}
      className={cn(
        "group flex items-start gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors",
        selectMode && checked
          ? "border-[#185FA5] bg-[#E6F1FB]"
          : active
          ? "border-[#185FA5] bg-[#E6F1FB]"
          : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
      )}
    >
      {selectMode && (
        <div className="pt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggleSelect}
            className="h-4 w-4 rounded border-slate-300 accent-[#185FA5] cursor-pointer"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("text-sm font-semibold truncate", (active || (selectMode && checked)) ? "text-[#185FA5]" : "text-slate-900")}>
            {term.term}
          </span>
          <PublishBadge published={term.isPublished} />
          {term.domain && <DomainBadge domain={term.domain} />}
        </div>
        {!compact && (
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{term.definition}</p>
        )}
      </div>
      {!selectMode && (
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onTogglePublish(); }}
            className="rounded p-1 text-slate-400 hover:text-emerald-600 transition-colors"
            title={term.isPublished ? "Unpublish" : "Publish"}
          >
            {term.isPublished ? <Icons.EyeOff size={13} /> : <Icons.Eye size={13} />}
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="rounded p-1 text-slate-400 hover:text-red-600 transition-colors"
            title="Delete term"
          >
            <Icons.Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Term Edit Panel ──────────────────────────────────────────────────────────

function TermEditPanel({
  term,
  onClose,
  onSaved,
  onDelete,
}: {
  term: GlossaryTerm;
  onClose: () => void;
  onSaved: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex-1 min-w-0 rounded-xl border border-black/10 bg-white shadow-sm self-start overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-5 py-3 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <Icons.BookOpen size={15} className="text-[#185FA5]" />
          <span className="text-sm font-bold text-slate-900 truncate">{term.term}</span>
          <PublishBadge published={term.isPublished} />
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onDelete} className="rounded p-1 text-slate-400 hover:text-red-600 transition-colors" title="Delete term">
            <Icons.Trash2 size={14} />
          </button>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-400 hover:text-slate-700">
            <Icons.X size={15} />
          </button>
        </div>
      </div>
      <div className="p-4 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto sm:p-5">
        <TermForm
          initial={term}
          onSave={async (data) => {
            const res = await fetch(`/api/admin/glossary/${term.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (res.ok) onSaved();
            return res.ok;
          }}
          onCancel={onClose}
          saveLabel="Save changes"
        />
      </div>
    </div>
  );
}

// ─── Term Form ────────────────────────────────────────────────────────────────

function TermForm({
  initial,
  onSave,
  onCancel,
  saveLabel = "Create term",
}: {
  initial?: GlossaryTerm;
  onSave: (data: Omit<GlossaryTerm, "id">) => Promise<boolean | void>;
  onCancel: () => void;
  saveLabel?: string;
}) {
  const [term, setTerm] = useState(initial?.term ?? "");
  const [definition, setDefinition] = useState(initial?.definition ?? "");
  const [fullDefinition, setFullDefinition] = useState(initial?.fullDefinition ?? "");
  const [domain, setDomain] = useState(initial?.domain ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [example, setExample] = useState(initial?.example ?? "");
  const [relatedText, setRelatedText] = useState(initial?.relatedTerms.join(", ") ?? "");
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);
  const [sourceDocument, setSourceDocument] = useState(initial?.sourceDocument ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!term.trim() || !definition.trim()) { setError("Term and definition are required."); return; }
    setError("");
    setBusy(true);
    await onSave({
      term: term.trim(),
      definition: definition.trim(),
      fullDefinition: fullDefinition.trim() || null,
      domain: domain.trim() || null,
      category: category.trim() || null,
      example: example.trim() || null,
      relatedTerms: relatedText.split(",").map((s) => s.trim()).filter(Boolean),
      isPublished,
      sourceDocument: sourceDocument.trim() || null,
    });
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1.5">
          <Icons.X size={11} /> {error}
        </p>
      )}

      <div>
        <label className="admin-label">Term <span className="text-red-400">*</span><FieldHint text="The exact word or phrase as students will search for it (e.g. 'Assessed Value'). Use title case." /></label>
        <input className="admin-input" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="e.g. Assessed Value" autoFocus={!initial} />
      </div>

      <div>
        <label className="admin-label">Definition <span className="text-red-400">*</span><FieldHint text="A concise one-sentence definition. This is the primary text shown in collapsed glossary cards and in inline tooltips throughout lessons." /></label>
        <textarea
          className="admin-input min-h-16 leading-relaxed"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          placeholder="Short one-liner summary that appears in the collapsed card…"
        />
      </div>

      <div>
        <label className="admin-label">Full definition (optional)<FieldHint text="Extended explanation shown when a student expands the term. Include context, nuance, and how it's applied in appraisal practice." /></label>
        <textarea
          className="admin-input min-h-24 leading-relaxed"
          value={fullDefinition}
          onChange={(e) => setFullDefinition(e.target.value)}
          placeholder="Detailed explanation shown when a student expands the term…"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="admin-label">Domain (optional)<FieldHint text="The appraisal domain this term belongs to. Used for filtering the glossary and domain-specific reporting." /></label>
          <DomainCombobox value={domain ?? ""} onChange={(val) => setDomain(val)} />
        </div>
        <div>
          <label className="admin-label">Category (optional)<FieldHint text="A finer grouping within the domain (e.g. 'USPAP', 'Ratio Study'). Helps students filter and browse related terms." /></label>
          <input className="admin-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. USPAP, Ratio Study" />
        </div>
      </div>

      <div>
        <label className="admin-label">Example (optional)<FieldHint text="A sample sentence showing the term used in context. Helps students understand practical application in appraisal work." /></label>
        <textarea
          className="admin-input min-h-16"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="Example sentence or use case…"
        />
      </div>

      <div>
        <label className="admin-label">Related terms (comma-separated)<FieldHint text="Other glossary terms that are closely related. Displayed as links in the expanded card so students can explore connected concepts." /></label>
        <input
          className="admin-input"
          value={relatedText}
          onChange={(e) => setRelatedText(e.target.value)}
          placeholder="e.g. Market Value, Equalization Ratio"
        />
      </div>

      <div>
        <label className="admin-label">Source document (optional)<FieldHint text="The reference document this definition comes from (e.g. 'Master Reference Glossary IMPACT 26V'). Shown as a citation for accuracy." /></label>
        <input
          className="admin-input"
          value={sourceDocument}
          onChange={(e) => setSourceDocument(e.target.value)}
          placeholder="e.g. Master Reference Glossary IMPACT 26V"
        />
      </div>

      <div>
        <label className="admin-label">Visibility<FieldHint text="Published: the term is visible to all enrolled students. Draft: the term is hidden while you're still editing or reviewing it." /></label>
        <div className="flex items-center gap-3 mt-1">
          <button
            type="button"
            onClick={() => setIsPublished((v) => !v)}
            className={cn("relative h-6 w-11 rounded-full transition-colors", isPublished ? "bg-emerald-500" : "bg-slate-200")}
          >
            <span className={cn("absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform", isPublished && "translate-x-5")} />
          </button>
          <span className={cn("text-sm font-medium", isPublished ? "text-emerald-700" : "text-slate-500")}>
            {isPublished ? "Published — visible to students" : "Draft — hidden from students"}
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button type="button" onClick={handleSave} disabled={busy} className="admin-action flex items-center gap-1.5">
          {busy ? <Icons.Loader size={13} className="animate-spin" /> : <Icons.Check size={13} />}
          {saveLabel}
        </button>
        <button type="button" onClick={onCancel} className="admin-action secondary">Cancel</button>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SelectIcon({ size, checked, indeterminate }: { size: number; checked: boolean; indeterminate: boolean }) {
  if (indeterminate) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (checked) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <polyline points="4,8.5 6.5,11 12,5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function PublishBadge({ published }: { published: boolean }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0", published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
      {published ? "Published" : "Draft"}
    </span>
  );
}
