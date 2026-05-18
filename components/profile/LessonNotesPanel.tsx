"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getIdToken } from "@/lib/firebase/auth";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type NoteEntry = {
  id: string;
  lessonId: string | null;
  lessonTitle: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type SaveStatus = "idle" | "saving" | "saved";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getIdToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export function LessonNotesPanel() {
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Refs so debounced save always reads the latest values without stale closures
  const selectedIdRef = useRef<string | null>(null);
  const editContentRef = useRef("");
  const editTitleRef = useRef("");
  const pendingNewRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  selectedIdRef.current = selectedId;
  editContentRef.current = editContent;
  editTitleRef.current = editTitle;

  // Fetch all notes on mount
  useEffect(() => {
    let cancelled = false;
    getIdToken()
      .then((token) =>
        fetch("/api/lessons/notes", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
      )
      .then((r) => (r.ok ? r.json() : { notes: [] }))
      .then((data: { notes: NoteEntry[] }) => {
        if (cancelled) return;
        const loaded = data.notes ?? [];
        setNotes(loaded);
        if (loaded.length > 0) {
          setSelectedId(loaded[0].id);
          setEditContent(loaded[0].content);
          setEditTitle(loaded[0].lessonTitle ?? "");
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Select a note from the list
  function selectNote(id: string) {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    setSelectedId(id);
    setEditContent(note.content);
    setEditTitle(note.lessonTitle ?? "");
    setSaveStatus("idle");
    pendingNewRef.current = false;
  }

  // Debounced save — reads from refs so title + content are always fresh
  function scheduleSave() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaveStatus("saving");

    saveTimerRef.current = setTimeout(async () => {
      const id = selectedIdRef.current;
      const content = editContentRef.current;
      const title = editTitleRef.current.trim() || null;

      if (!content.trim() && !title) {
        setSaveStatus("idle");
        return;
      }

      try {
        const headers = await authHeaders();

        if (pendingNewRef.current) {
          const res = await fetch("/api/lessons/notes", {
            method: "POST",
            headers,
            body: JSON.stringify({ content, lessonTitle: title ?? undefined }),
          });
          if (res.ok) {
            const data = await res.json();
            pendingNewRef.current = false;
            setNotes((prev) =>
              prev.map((n) =>
                n.id === id
                  ? { ...n, id: data.id, lessonTitle: title, updatedAt: new Date().toISOString() }
                  : n
              )
            );
            setSelectedId(data.id);
          }
        } else if (id) {
          await fetch(`/api/lessons/notes/${id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify({ content, lessonTitle: title ?? undefined }),
          });
          setNotes((prev) =>
            prev.map((n) =>
              n.id === id
                ? { ...n, lessonTitle: title, content, updatedAt: new Date().toISOString() }
                : n
            )
          );
        }

        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("idle");
      }
    }, 800);
  }

  function handleContentChange(value: string) {
    setEditContent(value);
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedId ? { ...n, content: value, updatedAt: new Date().toISOString() } : n
      )
    );
    scheduleSave();
  }

  function handleTitleChange(value: string) {
    setEditTitle(value);
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedId
          ? { ...n, lessonTitle: value.trim() || null, updatedAt: new Date().toISOString() }
          : n
      )
    );
    scheduleSave();
  }

  // Create a new standalone note
  function handleNewNote() {
    const tempId = `temp-${Date.now()}`;
    pendingNewRef.current = true;
    setNotes((prev) => [
      { id: tempId, lessonId: null, lessonTitle: null, content: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ...prev,
    ]);
    setSelectedId(tempId);
    setEditContent("");
    setEditTitle("");
    setSaveStatus("idle");
    setTimeout(() => titleInputRef.current?.focus(), 50);
  }

  // Delete a note
  async function handleDelete(id: string) {
    if (id.startsWith("temp-")) {
      const remaining = notes.filter((n) => n.id !== id);
      setNotes(remaining);
      setSelectedId(remaining[0]?.id ?? null);
      setEditContent(remaining[0]?.content ?? "");
      setEditTitle(remaining[0]?.lessonTitle ?? "");
      setConfirmDeleteId(null);
      return;
    }
    try {
      const headers = await authHeaders();
      await fetch(`/api/lessons/notes/${id}`, { method: "DELETE", headers });
    } catch {}
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    const next = remaining[0] ?? null;
    setSelectedId(next?.id ?? null);
    setEditContent(next?.content ?? "");
    setEditTitle(next?.lessonTitle ?? "");
    setConfirmDeleteId(null);
  }

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;
  const filteredNotes = query.trim()
    ? notes.filter(
        (n) =>
          n.content.toLowerCase().includes(query.toLowerCase()) ||
          (n.lessonTitle ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : notes;

  if (loading) {
    return (
      <div className="flex items-center justify-center px-5 py-12 text-sm text-slate-400">
        Loading notes…
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row" style={{ minHeight: 420 }}>
      {/* ── Left panel: note list ── */}
      <div className="flex w-full shrink-0 flex-col border-b border-slate-100 lg:w-56 lg:border-b-0 lg:border-r xl:w-64">
        <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-3">
          <div className="relative flex-1">
            <Icons.Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-7 pr-2 text-xs text-slate-700 outline-none focus:border-[#185FA5] focus:bg-white"
            />
          </div>
          <button
            type="button"
            onClick={handleNewNote}
            title="New note"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#185FA5] bg-white text-[#185FA5] transition hover:bg-[#E6F1FB]"
          >
            <Icons.Plus size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <p className="px-4 py-6 text-xs text-slate-400">
              {query ? "No matching notes." : "No notes yet."}
            </p>
          ) : (
            filteredNotes.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => selectNote(note.id)}
                className={cn(
                  "w-full border-b border-slate-50 px-4 py-3 text-left transition-colors last:border-0",
                  selectedId === note.id ? "bg-[#E6F1FB]" : "hover:bg-slate-50"
                )}
              >
                <p className={cn(
                  "truncate text-xs font-bold",
                  selectedId === note.id ? "text-[#185FA5]" : "text-slate-800"
                )}>
                  {note.lessonTitle || "Untitled note"}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">{relativeTime(note.updatedAt)}</p>
                {note.content && (
                  <p className="mt-1 line-clamp-2 text-[11px] leading-[1.5] text-slate-500">
                    {note.content}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Right panel: editor ── */}
      <div className="flex flex-1 flex-col">
        {selectedNote ? (
          <>
            {/* Note header with editable title */}
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={editTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Untitled note"
                    className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 focus:placeholder:text-slate-300"
                  />
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    {selectedNote.lessonId && (
                      <span className="rounded-full bg-[#E6F1FB] px-2 py-0.5 text-[10px] font-semibold text-[#185FA5]">
                        Lesson note
                      </span>
                    )}
                    <span>Updated {relativeTime(selectedNote.updatedAt)}</span>
                    {saveStatus === "saving" && <span className="text-amber-500">Saving…</span>}
                    {saveStatus === "saved" && <span className="text-emerald-600">Saved</span>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {selectedNote.lessonId && (
                    <Link
                      href={`/lessons/${selectedNote.lessonId}`}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:border-[#185FA5] hover:text-[#185FA5]"
                    >
                      Go to lesson
                      <Icons.ExternalLink size={11} />
                    </Link>
                  )}
                  {confirmDeleteId === selectedNote.id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500">Delete?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(selectedNote.id)}
                        className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:border-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(selectedNote.id)}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:border-red-200 hover:text-red-500"
                    >
                      <Icons.Trash2 size={12} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 px-5 py-4">
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Start writing… notes auto-save as you type."
                className="h-full min-h-[260px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 outline-none focus:border-[#185FA5] focus:bg-white"
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Icons.FileText size={22} className="text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">No notes yet</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Open a lesson and jot something down in the sidebar, or create a quick note here.
              </p>
            </div>
            <button
              type="button"
              onClick={handleNewNote}
              className="inline-flex items-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0d3d6e]"
            >
              <Icons.Plus size={14} />
              New note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
