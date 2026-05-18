"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParsedLesson {
  lesson_title: string;
  lesson_type: string;
  content_summary?: string | null;
  learning_objectives?: string | null;
}

interface ParsedModule {
  title: string;
  lessons: ParsedLesson[];
}

interface PreviewResult {
  modules: ParsedModule[];
  errors: Array<{ row: number; field: string; message: string }>;
  totalLessons: number;
}

interface ImportResult {
  courseId: string;
  modulesCreated: number;
  lessonsCreated: number;
}

type Tab = "csv" | "docx";
type Phase = "upload" | "preview" | "configure" | "importing" | "done";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function lessonTypeLabel(type: string) {
  const map: Record<string, string> = { text: "Text", video: "Video", quiz: "Quiz", source: "Source" };
  return map[type] ?? type;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function DropZone({
  accept,
  label,
  sublabel,
  onFile,
  busy,
}: {
  accept: string;
  label: string;
  sublabel: string;
  onFile: (file: File) => void;
  busy?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const inputId = `course-import-file-${accept.replace(/[^a-z]/g, "")}`;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      onClick={() => document.getElementById(inputId)?.click()}
      onKeyDown={(e) => e.key === "Enter" && document.getElementById(inputId)?.click()}
      className={cn(
        "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all",
        dragging ? "border-[#185FA5] bg-[#E6F1FB]/60 scale-[1.01]" : "border-slate-300 bg-slate-50 hover:border-[#185FA5]/60 hover:bg-[#E6F1FB]/30",
        busy && "pointer-events-none opacity-60"
      )}
    >
      <input id={inputId} type="file" accept={accept} className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} disabled={busy} />
      {busy ? (
        <>
          <Icons.Loader size={28} className="animate-spin text-[#185FA5]" />
          <p className="text-sm font-semibold text-slate-600">Parsing file…</p>
        </>
      ) : (
        <>
          <Icons.Upload size={28} className={dragging ? "text-[#185FA5]" : "text-slate-400"} />
          <div>
            <p className="text-sm font-semibold text-slate-700">{dragging ? "Drop here" : label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>
          </div>
        </>
      )}
    </div>
  );
}

function PreviewAccordion({ modules }: { modules: ParsedModule[] }) {
  const [openModules, setOpenModules] = useState<Set<string>>(new Set(modules.map((m) => m.title)));

  function toggle(title: string) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  }

  return (
    <div className="max-h-72 overflow-y-auto space-y-2 rounded-lg">
      {modules.map((mod) => (
        <div key={mod.title} className="rounded-lg border border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => toggle(mod.title)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left"
          >
            {openModules.has(mod.title) ? (
              <Icons.ChevronDown size={14} className="text-slate-400 shrink-0" />
            ) : (
              <Icons.ChevronRight size={14} className="text-slate-400 shrink-0" />
            )}
            <Icons.BookMarked size={14} className="text-[#185FA5] shrink-0" />
            <span className="flex-1 text-sm font-semibold text-slate-800 truncate">{mod.title}</span>
            <span className="text-xs text-slate-500 shrink-0">{mod.lessons.length} lesson{mod.lessons.length !== 1 ? "s" : ""}</span>
          </button>
          {openModules.has(mod.title) && (
            <div className="border-t border-slate-100 px-4 pb-3 pt-2 space-y-1.5">
              {mod.lessons.map((lesson, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-600">
                  <Icons.FileText size={12} className="text-slate-300 shrink-0" />
                  <span className="flex-1 truncate">{lesson.lesson_title}</span>
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                    {lessonTypeLabel(lesson.lesson_type)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CourseImportPanel({
  onImported,
  onCancel,
}: {
  onImported: () => void;
  onCancel: () => void;
}) {
  const [tab, setTab] = useState<Tab>("csv");
  const [phase, setPhase] = useState<Phase>("upload");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [parsedModules, setParsedModules] = useState<ParsedModule[] | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishOnImport, setPublishOnImport] = useState(false);
  const [csvText, setCsvText] = useState<string | null>(null);

  function reset() {
    setPhase("upload");
    setBusy(false);
    setPreview(null);
    setParsedModules(null);
    setImportResult(null);
    setErrorMsg(null);
    setCourseTitle("");
    setDescription("");
    setPublishOnImport(false);
    setCsvText(null);
  }

  const handleCsvFile = useCallback(async (file: File) => {
    setBusy(true);
    setErrorMsg(null);
    try {
      const text = await file.text();
      setCsvText(text);
      const res = await fetch("/api/admin/assessments/csv-lesson-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvText: text }),
      });
      const data: PreviewResult = await res.json();
      if (!res.ok) {
        setErrorMsg((data as any).error ?? "Failed to parse CSV.");
        setBusy(false);
        return;
      }
      setPreview(data);
      if (!courseTitle && file.name) setCourseTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
      setPhase("preview");
    } catch {
      setErrorMsg("Network error while parsing CSV.");
    } finally {
      setBusy(false);
    }
  }, [courseTitle]);

  const handleDocxFile = useCallback(async (file: File) => {
    setBusy(true);
    setErrorMsg(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/courses/import/docx-parse", { method: "POST", body: form });
      const data: PreviewResult = await res.json();
      if (!res.ok) {
        setErrorMsg((data as any).error ?? "Failed to parse document.");
        setBusy(false);
        return;
      }
      setPreview(data);
      setParsedModules(data.modules);
      if (!courseTitle && file.name) setCourseTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
      setPhase("preview");
    } catch {
      setErrorMsg("Network error while parsing document.");
    } finally {
      setBusy(false);
    }
  }, [courseTitle]);

  async function runImport() {
    if (!courseTitle.trim()) { setErrorMsg("Course title is required."); return; }
    setErrorMsg(null);
    setBusy(true);
    setPhase("importing");

    try {
      const body =
        tab === "csv"
          ? { csvText, courseTitle: courseTitle.trim(), description: description.trim() || null, publish: publishOnImport }
          : { modules: parsedModules, courseTitle: courseTitle.trim(), description: description.trim() || null, publish: publishOnImport };

      const res = await fetch("/api/admin/courses/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Import failed.");
        setPhase("configure");
        setBusy(false);
        return;
      }
      setImportResult(data);
      setPhase("done");
    } catch {
      setErrorMsg("Network error during import.");
      setPhase("configure");
    } finally {
      setBusy(false);
    }
  }

  const MAX_ERRORS = 5;

  return (
    <div className="rounded-2xl border border-[#b8d7f0] bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">Import Course</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">Create a full course structure from a file</p>
        </div>
        <button type="button" onClick={onCancel} className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
          <Icons.X size={16} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Tab switcher */}
        {phase === "upload" && (
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {(["csv", "docx"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); reset(); setPhase("upload"); }}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-all",
                  tab === t ? "bg-white text-[#185FA5] shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {t === "csv" ? <Icons.ClipboardList size={13} /> : <Icons.FileText size={13} />}
                {t === "csv" ? "CSV" : "Word Document"}
              </button>
            ))}
          </div>
        )}

        {/* Phase stepper */}
        {phase !== "upload" && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            {(["preview", "configure", "importing", "done"] as const).map((p, i) => {
              const labels: Record<string, string> = { preview: "Preview", configure: "Configure", importing: "Import", done: "Done" };
              const isCurrent = phase === p;
              const isDone = ["preview", "configure", "importing", "done"].indexOf(phase) > i;
              return (
                <span key={p} className="flex items-center gap-1">
                  {i > 0 && <span className="text-slate-200">›</span>}
                  <span className={cn("font-semibold", isCurrent ? "text-[#185FA5]" : isDone ? "text-emerald-600" : "text-slate-300")}>
                    {labels[p]}
                  </span>
                </span>
              );
            })}
          </div>
        )}

        {/* Error banner */}
        {errorMsg && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
            <Icons.X size={14} className="mt-0.5 shrink-0 text-red-500" />
            <p className="text-xs text-red-700">{errorMsg}</p>
          </div>
        )}

        {/* Upload phase */}
        {phase === "upload" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <a
                href={tab === "csv" ? "/api/admin/assessments/csv-lesson-template" : "/api/admin/courses/import/docx-template"}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#185FA5]/30 bg-[#E6F1FB]/50 px-3 py-2 text-xs font-semibold text-[#185FA5] hover:bg-[#E6F1FB] transition"
              >
                <Icons.ArrowDown size={13} />
                Download {tab === "csv" ? "CSV" : "Word"} template
              </a>
              <span className="text-xs text-slate-400">Fill it in, then upload below</span>
            </div>
            {tab === "csv" ? (
              <DropZone
                accept=".csv"
                label="Drag & drop or click to upload CSV"
                sublabel="CSV files only · Columns: module_title, lesson_title, lesson_type, …"
                onFile={handleCsvFile}
                busy={busy}
              />
            ) : (
              <DropZone
                accept=".docx"
                label="Drag & drop or click to upload Word document"
                sublabel=".docx files only · Must contain a table matching the template"
                onFile={handleDocxFile}
                busy={busy}
              />
            )}
          </div>
        )}

        {/* Preview phase */}
        {phase === "preview" && preview && (
          <div className="space-y-4">
            {/* Summary pills */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#E6F1FB] px-3 py-1 text-xs font-bold text-[#185FA5]">
                {preview.modules.length} module{preview.modules.length !== 1 ? "s" : ""}
              </span>
              <span className="rounded-full bg-[#E6F1FB] px-3 py-1 text-xs font-bold text-[#185FA5]">
                {preview.totalLessons} lesson{preview.totalLessons !== 1 ? "s" : ""}
              </span>
              {preview.errors.length > 0 && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                  {preview.errors.length} error{preview.errors.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Validation errors */}
            {preview.errors.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-1.5">
                <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <Icons.AlertTriangle size={13} />
                  Fix these errors before importing:
                </p>
                {preview.errors.slice(0, MAX_ERRORS).map((err, i) => (
                  <p key={i} className="text-xs text-amber-700 pl-5">Row {err.row} · {err.field}: {err.message}</p>
                ))}
                {preview.errors.length > MAX_ERRORS && (
                  <p className="text-xs text-amber-600 pl-5 font-semibold">…and {preview.errors.length - MAX_ERRORS} more</p>
                )}
              </div>
            )}

            {/* Module/lesson tree */}
            {preview.modules.length > 0 && <PreviewAccordion modules={preview.modules} />}

            <div className="flex gap-2 pt-1">
              <button type="button" onClick={reset} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                ← Upload different file
              </button>
              <button
                type="button"
                onClick={() => setPhase("configure")}
                disabled={preview.errors.length > 0 || preview.modules.length === 0}
                className="ml-auto rounded-lg bg-[#185FA5] px-5 py-2 text-xs font-semibold text-white hover:bg-[#185FA5]/90 disabled:opacity-40 transition"
              >
                Configure import →
              </button>
            </div>
          </div>
        )}

        {/* Configure phase */}
        {phase === "configure" && preview && (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
              Importing <strong>{preview.modules.length} modules</strong> and <strong>{preview.totalLessons} lessons</strong>
            </div>

            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-500">
                Course title <span className="text-red-400">*</span>
              </label>
              <input
                className="admin-input mt-2"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g. Assessment Calculations Review"
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-500">Description (optional)</label>
              <textarea
                className="admin-input mt-2 min-h-[72px]"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief overview of what students will learn."
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-slate-300">
              <input
                type="checkbox"
                checked={publishOnImport}
                onChange={(e) => setPublishOnImport(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-[#185FA5]"
              />
              <div>
                <p className="text-sm font-semibold text-slate-800">Publish all lessons immediately</p>
                <p className="mt-0.5 text-xs text-slate-500">Otherwise lessons are created as drafts.</p>
              </div>
            </label>

            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setPhase("preview")} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                ← Back
              </button>
              <button
                type="button"
                onClick={runImport}
                disabled={!courseTitle.trim()}
                className="ml-auto rounded-lg bg-[#185FA5] px-5 py-2 text-xs font-semibold text-white hover:bg-[#185FA5]/90 disabled:opacity-40 transition"
              >
                Import course
              </button>
            </div>
          </div>
        )}

        {/* Importing phase */}
        {phase === "importing" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Icons.Loader size={32} className="animate-spin text-[#185FA5]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">Creating course…</p>
              <p className="mt-1 text-xs text-slate-500">Building modules and lessons. This may take a moment.</p>
            </div>
          </div>
        )}

        {/* Done phase */}
        {phase === "done" && importResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <Icons.Check size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-800">Course imported successfully!</p>
                <p className="mt-0.5 text-xs text-emerald-700">
                  {importResult.modulesCreated} module{importResult.modulesCreated !== 1 ? "s" : ""} · {importResult.lessonsCreated} lesson{importResult.lessonsCreated !== 1 ? "s" : ""} created
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href={`/admin/courses/${importResult.courseId}`}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#185FA5]/30 bg-[#E6F1FB]/40 px-4 py-3 text-sm font-semibold text-[#185FA5] hover:bg-[#E6F1FB]/70 transition"
              >
                <Icons.GraduationCap size={16} />
                Open course editor
              </Link>
              <button
                type="button"
                onClick={() => { onImported(); }}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                <Icons.BookOpen size={16} />
                Back to courses
              </button>
            </div>

            <button type="button" onClick={reset} className="w-full rounded-lg border border-slate-200 px-4 py-2 text-xs text-slate-500 hover:bg-slate-50 transition">
              Import another course
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
