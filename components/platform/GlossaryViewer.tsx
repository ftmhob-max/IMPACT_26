"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import * as Icons from "@/components/ui/Icons";
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
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Resolve Firebase auth token
  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const t = await user.getIdToken();
        setToken(t);
      }
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

  function scrollToLetter(letter: string) {
    setActiveLetter(letter);
    letterRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-slate-400">
        <Icons.Loader size={20} className="animate-spin" />
        <span className="text-sm">Loading glossary…</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Glossary</h1>
        <p className="mt-2 text-sm text-slate-500">
          {terms.length} terms · Browse definitions, add your own notes to any term
        </p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-56">
          <Icons.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search terms and definitions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm text-slate-800 shadow-sm focus:border-[#185FA5] focus:outline-none focus:ring-1 focus:ring-[#185FA5]"
          />
        </div>
        {domains.length > 0 && (
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-[#185FA5] focus:outline-none"
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value)}
          >
            <option value="">All domains</option>
            {domains.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
          </select>
        )}
      </div>

      {/* Alphabet jump bar */}
      {letters.length > 5 && (
        <div className="flex flex-wrap gap-1">
          {letters.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => scrollToLetter(l)}
              className={cn(
                "h-8 w-8 rounded-lg text-xs font-bold transition-colors",
                activeLetter === l
                  ? "bg-[#185FA5] text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5]"
              )}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center">
          <Icons.BookOpen size={40} className="mx-auto text-slate-200 mb-3" />
          <p className="text-sm font-semibold text-slate-600">
            {terms.length === 0 ? "No glossary terms have been published yet." : "No terms match your search."}
          </p>
        </div>
      )}

      {/* Term groups */}
      <div className="space-y-8">
        {letters.map((letter) => (
          <div
            key={letter}
            ref={(el) => { letterRefs.current[letter] = el; }}
          >
            <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-[#f7f8f6]/95 backdrop-blur">
              <span className="text-lg font-extrabold text-[#185FA5]">{letter}</span>
              <span className="ml-2 text-xs text-slate-400">{grouped[letter].length} term{grouped[letter].length !== 1 ? "s" : ""}</span>
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
    <div className={cn("rounded-2xl border bg-white shadow-sm overflow-hidden transition-shadow", expanded && "shadow-md border-[#185FA5]/20")}>
      <div className="flex items-start gap-3 px-5 py-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-start gap-3 text-left hover:bg-slate-50 transition-colors -m-2 rounded-xl p-2"
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
              <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{term.definition}</p>
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
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Definition</p>
            <p className="text-sm text-slate-800 leading-relaxed">{term.definition}</p>
          </div>

          {/* Example */}
          {term.example && (
            <div className="rounded-xl bg-[#E6F1FB]/40 border border-[#b8d7f0]/60 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#185FA5] mb-1">Example</p>
              <p className="text-sm text-slate-700 italic leading-relaxed">{term.example}</p>
            </div>
          )}

          {/* Related terms */}
          {term.relatedTerms?.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Related terms</p>
              <div className="flex flex-wrap gap-1.5">
                {term.relatedTerms.map((t) => (
                  <span key={t} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">{t}</span>
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
