"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import * as Icons from "@/components/ui/Icons";
import { EmptyState, IconTile, PageHeader, StatusBadge } from "@/components/ui/LearnerPrimitives";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  domain?: string | null;
  category?: string | null;
  example?: string | null;
  relatedTerms: string[];
}

interface Note {
  id: string;
  termId: string;
  note: string;
  updatedAt: any;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function GlossaryViewer() {
  const [token, setToken] = useState<string | null>(null);
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [notes, setNotes] = useState<Record<string, Note>>({});
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Resolve Firebase auth token
  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const t = await user.getIdToken();
        setToken(t);
      } else {
        setToken(null);
        setLoading(false);
      }
      setAuthResolved(true);
    });
  }, []);

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  // Load terms + notes once we have a token
  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      const [termsRes, notesRes, favoritesRes] = await Promise.all([
        fetch("/api/glossary", { headers: authHeaders() }),
        fetch("/api/glossary/notes", { headers: authHeaders() }),
        fetch("/api/favorites?itemType=glossary", { headers: authHeaders() }),
      ]);
      if (termsRes.ok) setTerms((await termsRes.json()).terms ?? []);
      if (notesRes.ok) {
        const data = await notesRes.json();
        const noteMap: Record<string, Note> = {};
        for (const n of data.notes ?? []) noteMap[n.termId] = n;
        setNotes(noteMap);
      }
      if (favoritesRes.ok) {
        const data = await favoritesRes.json();
        setFavoriteIds(new Set((data.favorites ?? []).map((favorite: { itemId: string }) => favorite.itemId)));
      }
      setLoading(false);
    })();
  }, [token, authHeaders]);

  async function toggleFavorite(termId: string) {
    if (!token) return;
    const isFavorite = favoriteIds.has(termId);
    const res = await fetch("/api/favorites", {
      method: isFavorite ? "DELETE" : "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ itemType: "glossary", itemId: termId }),
    });

    if (!res.ok) return;

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFavorite) next.delete(termId);
      else next.add(termId);
      return next;
    });
  }

  async function saveNote(termId: string, noteText: string) {
    if (!token) return;
    const existing = notes[termId];
    if (!noteText.trim()) {
      // Delete note if exists and text is cleared
      if (existing) {
        await fetch(`/api/glossary/notes/${existing.id}`, {
          method: "DELETE",
          headers: authHeaders(),
        });
        setNotes((prev) => { const next = { ...prev }; delete next[termId]; return next; });
      }
      return;
    }
    const res = await fetch("/api/glossary/notes", {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ termId, note: noteText.trim() }),
    });
    if (res.ok) {
      const data = await res.json();
      setNotes((prev) => ({
        ...prev,
        [termId]: { id: data.id, termId, note: noteText.trim(), updatedAt: new Date() },
      }));
    }
  }

  // Filter + group
  const filtered = terms.filter((t) => {
    if (search && !t.term.toLowerCase().includes(search.toLowerCase()) && !t.definition.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterDomain && t.domain !== filterDomain) return false;
    return true;
  });

  const grouped = filtered.reduce<Record<string, GlossaryTerm[]>>((acc, t) => {
    const key = t.term[0]?.toUpperCase() ?? "#";
    (acc[key] ??= []).push(t);
    return acc;
  }, {});
  const letters = Object.keys(grouped).sort();

  const domains = [...new Set(terms.map((t) => t.domain).filter(Boolean))] as string[];
  const notedCount = Object.keys(notes).length;
  const favoriteCount = favoriteIds.size;
  const resultLabel = filtered.length === 1 ? "1 term" : `${filtered.length} terms`;
  const hasActiveFilters = Boolean(search.trim()) || Boolean(filterDomain);

  function scrollToLetter(letter: string) {
    setActiveLetter(letter);
    letterRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearFilters() {
    setSearch("");
    setFilterDomain("");
    setActiveLetter(null);
  }

  if (!authResolved || loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-slate-400">
        <Icons.Loader size={20} className="animate-spin" />
        <span className="text-sm">Loading glossary…</span>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        <PageHeader
          eyebrow="Glossary"
          title="Concept reference"
          description="Sign in to browse definitions, examples, private notes, and saved study markers."
          icon={Icons.BookOpen}
        />
        <EmptyState
          icon={Icons.Lock}
          title="Sign in required"
          description="Your glossary notes and saved terms are private to your learner account."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <PageHeader
        eyebrow="Glossary"
        title="Concept reference"
        description={`${terms.length} terms with definitions, examples, private notes, and saved study markers.`}
        icon={Icons.BookOpen}
      />

      <section className="mb-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid border-b border-slate-100 sm:grid-cols-3">
          <GlossaryMetric icon={Icons.BookOpen} label="Published terms" value={terms.length} />
          <GlossaryMetric icon={Icons.BookMarked} label="Saved" value={favoriteCount} />
          <GlossaryMetric icon={Icons.Pencil} label="My notes" value={notedCount} />
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <Icons.Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search by term, definition, or example..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#185FA5] focus:ring-2 focus:ring-[#E6F1FB]"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {domains.length > 0 && (
                <select
                  className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#185FA5] focus:ring-2 focus:ring-[#E6F1FB]"
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                  aria-label="Filter glossary by domain"
                >
                  <option value="">All domains</option>
                  {domains.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
              )}
              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icons.X size={14} />
                Clear
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-500">
              Showing <span className="text-slate-900">{resultLabel}</span>
              {filterDomain ? ` in ${filterDomain}` : ""}.
            </p>
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-1.5">
                {search.trim() && <StatusBadge tone="blue">Search active</StatusBadge>}
                {filterDomain && <StatusBadge tone="slate">{filterDomain}</StatusBadge>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Alphabet jump bar */}
      {letters.length > 5 && (
        <div className="sticky top-0 z-20 mb-5 rounded-lg border border-slate-200 bg-white/95 p-2 shadow-sm backdrop-blur">
          <div className="flex flex-wrap gap-1">
          {letters.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => scrollToLetter(l)}
              className={cn(
                "h-8 w-8 rounded-md text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2",
                activeLetter === l
                  ? "bg-[#185FA5] text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5]"
              )}
            >
              {l}
            </button>
          ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <EmptyState
          icon={Icons.BookOpen}
          title={terms.length === 0 ? "No glossary terms have been published yet." : "No terms match your search."}
          description={terms.length === 0 ? "Published glossary entries will appear here for learners." : "Clear the current search or domain filter to get back to the full concept list."}
          action={hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#185FA5] bg-white px-4 py-2 text-sm font-bold text-[#185FA5] shadow-sm transition-colors hover:bg-[#E6F1FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
            >
              <Icons.X size={15} />
              Clear filters
            </button>
          ) : null}
        />
      )}

      {/* Term groups */}
      <div className="space-y-6">
        {letters.map((letter) => (
          <div
            key={letter}
            ref={(el) => { letterRefs.current[letter] = el; }}
          >
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#b8d7f0] bg-[#E6F1FB] text-sm font-extrabold text-[#185FA5]">
                {letter}
              </div>
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">{grouped[letter].length} term{grouped[letter].length !== 1 ? "s" : ""}</span>
            </div>
            <div className="space-y-2 mt-2">
              {grouped[letter].map((term) => (
                <TermCard
                  key={term.id}
                  term={term}
                  note={notes[term.id] ?? null}
                  favorite={favoriteIds.has(term.id)}
                  expanded={expandedId === term.id}
                  onToggle={() => setExpandedId(expandedId === term.id ? null : term.id)}
                  onSaveNote={(text) => saveNote(term.id, text)}
                  onToggleFavorite={() => toggleFavorite(term.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GlossaryMetric({
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

// ─── Term Card ────────────────────────────────────────────────────────────────

function TermCard({
  term,
  note,
  favorite,
  expanded,
  onToggle,
  onSaveNote,
  onToggleFavorite,
}: {
  term: GlossaryTerm;
  note: Note | null;
  favorite: boolean;
  expanded: boolean;
  onToggle: () => void;
  onSaveNote: (text: string) => void;
  onToggleFavorite: () => void;
}) {
  const [draftNote, setDraftNote] = useState(note?.note ?? "");
  const [noteSaved, setNoteSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [noteOpen, setNoteOpen] = useState(!!note);

  useEffect(() => {
    setDraftNote(note?.note ?? "");
    setNoteOpen(!!note);
  }, [note]);

  function scheduleNoteSave(text: string) {
    setDraftNote(text);
    setNoteSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await onSaveNote(text);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
    }, 1200);
  }

  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current); }, []);

  return (
    <div className={cn("overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300", expanded && "border-[#b8d7f0] shadow-md")}>
      <div className="flex items-start gap-3 px-5 py-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-start gap-3 rounded-lg p-1 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-slate-900">{term.term}</span>
              {term.domain && <DomainBadge domain={term.domain} />}
              {term.category && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">{term.category}</span>
              )}
              {favorite && (
                <span className="rounded-full bg-[#E6F1FB] px-2 py-0.5 text-[10px] font-semibold text-[#185FA5] flex items-center gap-1">
                  <Icons.BookMarked size={9} />
                  Saved
                </span>
              )}
              {note && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 flex items-center gap-1">
                  <Icons.Pencil size={9} />
                  My note
                </span>
              )}
            </div>
            {!expanded && (
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{term.definition}</p>
            )}
          </div>
          <div className="shrink-0 mt-0.5">
            {expanded ? <Icons.ChevronUp size={16} className="text-slate-400" /> : <Icons.ChevronDown size={16} className="text-slate-400" />}
          </div>
        </button>
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={favorite}
          aria-label={favorite ? "Remove saved glossary term" : "Save glossary term"}
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2",
            favorite
              ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]"
              : "border-slate-200 bg-white text-slate-400 hover:border-[#185FA5] hover:text-[#185FA5]"
          )}
        >
          <Icons.BookMarked size={15} />
        </button>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-4">
          {/* Definition */}
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400 mb-1.5">Definition</p>
            <p className="text-[15px] leading-7 text-slate-800">{term.definition}</p>
          </div>

          {/* Example */}
          {term.example && (
            <div className="rounded-lg bg-[#E6F1FB]/45 border border-[#b8d7f0]/70 px-4 py-3">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#185FA5] mb-1">Example</p>
              <p className="text-sm leading-6 text-slate-700">{term.example}</p>
            </div>
          )}

          {/* Related terms */}
          {term.relatedTerms?.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Related terms</p>
              <div className="flex flex-wrap gap-1.5">
                {term.relatedTerms.map((t) => (
                  <span key={t} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Student note section */}
          <div className="border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setNoteOpen((v) => !v)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
            >
              <div className={cn("flex h-5 w-5 items-center justify-center rounded-full transition-colors", noteOpen ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400")}>
                <Icons.Pencil size={10} />
              </div>
              {note ? "Edit my note" : "Add my note"}
              {noteOpen ? <Icons.ChevronUp size={11} /> : <Icons.ChevronDown size={11} />}
              {noteSaved && <span className="text-emerald-500 font-medium ml-1">Saved</span>}
            </button>

            {noteOpen && (
              <div className="space-y-2">
                <textarea
                  className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-slate-800 leading-relaxed placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-300 resize-none min-h-[96px]"
                  placeholder="Write your own note about this term — mnemonics, examples, connections to other concepts…"
                  value={draftNote}
                  onChange={(e) => scheduleNoteSave(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-slate-400">Notes are private — only you can see them. Auto-saved as you type.</p>
                  {draftNote && (
                    <button
                      type="button"
                      onClick={() => { setDraftNote(""); scheduleNoteSave(""); }}
                      className="text-[11px] text-red-500 hover:text-red-700 font-medium"
                    >
                      Clear note
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function DomainBadge({ domain }: { domain: string }) {
  const map: Record<string, string> = {
    math: "bg-blue-50 text-blue-700", appraisal: "bg-purple-50 text-purple-700",
    law: "bg-amber-50 text-amber-700", philly: "bg-emerald-50 text-emerald-700",
    admin: "bg-slate-100 text-slate-600", ethics: "bg-rose-50 text-rose-700",
    general: "bg-slate-100 text-slate-500",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", map[domain] ?? "bg-slate-100 text-slate-500")}>
      {domain}
    </span>
  );
}
