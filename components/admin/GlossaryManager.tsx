"use client";

import { useCallback, useEffect, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { GlossaryImportPanel } from "@/components/admin/GlossaryImportPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  domain?: string | null;
  category?: string | null;
  example?: string | null;
  relatedTerms: string[];
  isPublished: boolean;
}

const DOMAINS = ["math", "appraisal", "law", "philly", "admin", "ethics", "general"] as const;

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
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/glossary", { cache: "no-store" });
    if (res.ok) setTerms((await res.json()).terms ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function showNotice(type: "success" | "error", text: string) {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
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

  // Group by first letter
  const grouped = filtered.reduce<Record<string, GlossaryTerm[]>>((acc, t) => {
    const key = t.term[0]?.toUpperCase() ?? "#";
    (acc[key] ??= []).push(t);
    return acc;
  }, {});
  const letters = Object.keys(grouped).sort();

  const publishedCount = terms.filter((t) => t.isPublished).length;

  return (
    <div className="flex gap-5 min-h-0">
      {/* Left column: list */}
      <div className={cn("flex flex-col gap-4 min-w-0", selected ? "w-80 shrink-0" : "flex-1")}>
        {/* Stats + header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Glossary terms</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {terms.length} total · {publishedCount} published · {terms.length - publishedCount} draft
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setShowImport((v) => !v); setShowCreate(false); setSelected(null); }}
              className={cn("admin-action secondary flex items-center gap-1.5 text-sm", showImport && "bg-[#185FA5] text-white border-[#185FA5]")}
            >
              <Icons.Upload size={14} />
              Import
            </button>
            <button
              type="button"
              onClick={() => { setShowCreate(true); setShowImport(false); setSelected(null); }}
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
            className="admin-input flex-1 min-w-40"
          />
          <select className="admin-input w-36" value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)}>
            <option value="">All domains</option>
            {DOMAINS.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
          </select>
          <select className="admin-input w-32" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Notice */}
        {notice && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${notice.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {notice.type === "success" ? <Icons.Check size={13} /> : <Icons.X size={13} />}
            {notice.text}
          </div>
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
          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
            <Icons.BookOpen size={36} className="mx-auto text-slate-200 mb-3" />
            <p className="text-sm text-slate-400">
              {terms.length === 0 ? "No terms yet. Create the first one." : "No terms match your filters."}
            </p>
          </div>
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
                      onSelect={() => { setSelected(term); setShowCreate(false); }}
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
      {selected && (
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

// ─── Term List Row ────────────────────────────────────────────────────────────

function TermListRow({
  term,
  active,
  compact,
  onSelect,
  onTogglePublish,
  onDelete,
}: {
  term: GlossaryTerm;
  active: boolean;
  compact: boolean;
  onSelect: () => void;
  onTogglePublish: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "group flex items-start gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors",
        active
          ? "border-[#185FA5] bg-[#E6F1FB]"
          : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("text-sm font-semibold truncate", active ? "text-[#185FA5]" : "text-slate-900")}>
            {term.term}
          </span>
          <PublishBadge published={term.isPublished} />
          {term.domain && <DomainBadge domain={term.domain} />}
        </div>
        {!compact && (
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{term.definition}</p>
        )}
      </div>
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
      <div className="p-5 max-h-[calc(100vh-200px)] overflow-y-auto">
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
  const [domain, setDomain] = useState(initial?.domain ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [example, setExample] = useState(initial?.example ?? "");
  const [relatedText, setRelatedText] = useState(initial?.relatedTerms.join(", ") ?? "");
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!term.trim() || !definition.trim()) { setError("Term and definition are required."); return; }
    setError("");
    setBusy(true);
    await onSave({
      term: term.trim(),
      definition: definition.trim(),
      domain: domain || null,
      category: category.trim() || null,
      example: example.trim() || null,
      relatedTerms: relatedText.split(",").map((s) => s.trim()).filter(Boolean),
      isPublished,
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
        <label className="admin-label">Term <span className="text-red-400">*</span></label>
        <input className="admin-input" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="e.g. Assessed Value" autoFocus={!initial} />
      </div>

      <div>
        <label className="admin-label">Definition <span className="text-red-400">*</span></label>
        <textarea
          className="admin-input min-h-24 leading-relaxed"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          placeholder="Clear, concise definition that students will see…"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="admin-label">Domain</label>
          <select className="admin-input" value={domain} onChange={(e) => setDomain(e.target.value)}>
            <option value="">— None —</option>
            {DOMAINS.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="admin-label">Category (optional)</label>
          <input className="admin-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. USPAP, Ratio Study" />
        </div>
      </div>

      <div>
        <label className="admin-label">Example (optional)</label>
        <textarea
          className="admin-input min-h-16"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="Example sentence or use case…"
        />
      </div>

      <div>
        <label className="admin-label">Related terms (comma-separated)</label>
        <input
          className="admin-input"
          value={relatedText}
          onChange={(e) => setRelatedText(e.target.value)}
          placeholder="e.g. Market Value, Equalization Ratio"
        />
      </div>

      <div>
        <label className="admin-label">Visibility</label>
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

function PublishBadge({ published }: { published: boolean }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0", published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
      {published ? "Published" : "Draft"}
    </span>
  );
}

function DomainBadge({ domain }: { domain: string }) {
  const map: Record<string, string> = {
    math: "bg-blue-50 text-blue-700", appraisal: "bg-purple-50 text-purple-700",
    law: "bg-amber-50 text-amber-700", philly: "bg-emerald-50 text-emerald-700",
    admin: "bg-slate-100 text-slate-600", ethics: "bg-rose-50 text-rose-700",
    general: "bg-slate-100 text-slate-500",
  };
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize shrink-0", map[domain] ?? "bg-slate-100 text-slate-500")}>{domain}</span>;
}
