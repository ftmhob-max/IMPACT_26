"use client";

import { useCallback, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { CsvImportPanel } from "@/components/admin/CsvImportPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PreviewRow {
  question_text: string;
  question_type: string;
  difficulty: string;
  domain: string;
  choices: string[];
  correct_answers: string[];
  explanation?: string | null;
  rationale?: string | null;
  point_value?: number;
}

interface PreviewResult {
  validRows: PreviewRow[];
  errors: Array<{ row: number; field: string; message: string }>;
  duplicates: Array<{ row: number; questionText: string }>;
}

type Tab = "csv" | "docx";
type DocxPhase = "upload" | "preview" | "configure" | "importing" | "done";

// ─── DropZone ─────────────────────────────────────────────────────────────────

function DropZone({
  busy,
  onFile,
}: {
  busy?: boolean;
  onFile: (file: File) => void;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload Word document"
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      onClick={() => document.getElementById("quiz-docx-input")?.click()}
      onKeyDown={(e) => e.key === "Enter" && document.getElementById("quiz-docx-input")?.click()}
      className={cn(
        "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all",
        dragging ? "border-[#185FA5] bg-[#E6F1FB]/60 scale-[1.01]" : "border-slate-300 bg-slate-50 hover:border-[#185FA5]/60 hover:bg-[#E6F1FB]/30",
        busy && "pointer-events-none opacity-60"
      )}
    >
      <input id="quiz-docx-input" type="file" accept=".docx" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} disabled={busy} />
      {busy ? (
        <>
          <Icons.Loader size={28} className="animate-spin text-[#185FA5]" />
          <p className="text-sm font-semibold text-slate-600">Parsing document…</p>
        </>
      ) : (
        <>
          <Icons.Upload size={28} className={dragging ? "text-[#185FA5]" : "text-slate-400"} />
          <div>
            <p className="text-sm font-semibold text-slate-700">{dragging ? "Drop here" : "Drag & drop or click to upload"}</p>
            <p className="text-xs text-slate-500 mt-0.5">.docx files only · Must contain a question table</p>
          </div>
        </>
      )}
    </div>
  );
}

// ─── DOCX import flow ─────────────────────────────────────────────────────────

function DocxImportFlow({ onImported }: { onImported: (message: string) => void }) {
  const [phase, setPhase] = useState<DocxPhase>("upload");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quiz config
  const [quizTitle, setQuizTitle] = useState("Imported Quiz");
  const [passingScore, setPassingScore] = useState(70);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleChoices, setShuffleChoices] = useState(true);
  const [quizStatus, setQuizStatus] = useState<"draft" | "published">("draft");

  function reset() {
    setPhase("upload");
    setBusy(false);
    setPreview(null);
    setErrorMsg(null);
    setQuizTitle("Imported Quiz");
    setPassingScore(70);
    setShuffleQuestions(true);
    setShuffleChoices(true);
    setQuizStatus("draft");
  }

  const handleFile = useCallback(async (file: File) => {
    setBusy(true);
    setErrorMsg(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/assessments/docx-question-parse", { method: "POST", body: form });
      const data: PreviewResult = await res.json();
      if (!res.ok) {
        setErrorMsg((data as any).error ?? "Failed to parse document.");
        setBusy(false);
        return;
      }
      setPreview(data);
      if (file.name) setQuizTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
      setPhase("preview");
    } catch {
      setErrorMsg("Network error while parsing document.");
    } finally {
      setBusy(false);
    }
  }, []);

  async function runImport() {
    if (!preview) return;
    setBusy(true);
    setErrorMsg(null);
    setPhase("importing");
    try {
      const res = await fetch("/api/admin/assessments/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: preview.validRows,
          quiz: {
            title: quizTitle.trim(),
            passingScore,
            shuffleQuestions,
            shuffleChoices,
            status: quizStatus,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Import failed.");
        setPhase("configure");
        setBusy(false);
        return;
      }
      setPhase("done");
      onImported(`Quiz "${quizTitle}" created with ${preview.validRows.length} questions.`);
    } catch {
      setErrorMsg("Network error during import.");
      setPhase("configure");
    } finally {
      setBusy(false);
    }
  }

  const MAX_ERRORS = 5;

  return (
    <div className="space-y-4">
      {/* Template download */}
      {phase === "upload" && (
        <div className="flex items-center gap-2">
          <a
            href="/api/admin/assessments/docx-question-template"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#185FA5]/30 bg-[#E6F1FB]/50 px-3 py-2 text-xs font-semibold text-[#185FA5] hover:bg-[#E6F1FB] transition"
          >
            <Icons.ArrowDown size={13} />
            Download Word template
          </a>
          <span className="text-xs text-slate-400">Fill in the question table, then upload</span>
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

      {/* Error */}
      {errorMsg && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <Icons.X size={14} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-xs text-red-700">{errorMsg}</p>
        </div>
      )}

      {/* Upload */}
      {phase === "upload" && <DropZone busy={busy} onFile={handleFile} />}

      {/* Preview */}
      {phase === "preview" && preview && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              {preview.validRows.length} valid question{preview.validRows.length !== 1 ? "s" : ""}
            </span>
            {preview.errors.length > 0 && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                {preview.errors.length} error{preview.errors.length !== 1 ? "s" : ""}
              </span>
            )}
            {preview.duplicates.length > 0 && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {preview.duplicates.length} duplicate{preview.duplicates.length !== 1 ? "s" : ""} skipped
              </span>
            )}
          </div>

          {preview.errors.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-1.5">
              <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <Icons.AlertTriangle size={13} />
                Validation errors (these rows will be skipped):
              </p>
              {preview.errors.slice(0, MAX_ERRORS).map((err, i) => (
                <p key={i} className="text-xs text-amber-700 pl-5">Row {err.row} · {err.field}: {err.message}</p>
              ))}
              {preview.errors.length > MAX_ERRORS && (
                <p className="text-xs text-amber-600 pl-5 font-semibold">…and {preview.errors.length - MAX_ERRORS} more</p>
              )}
            </div>
          )}

          {/* Question list preview */}
          {preview.validRows.length > 0 && (
            <div className="max-h-52 overflow-y-auto rounded-lg border border-slate-200 divide-y divide-slate-100">
              {preview.validRows.map((row, idx) => (
                <div key={idx} className="flex items-start gap-2.5 px-3 py-2.5">
                  <span className="text-[10px] font-bold text-slate-400 mt-0.5 w-5 shrink-0 text-right">{idx + 1}</span>
                  <p className="flex-1 text-xs text-slate-700 line-clamp-2">{row.question_text}</p>
                  <span className={cn(
                    "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase",
                    row.difficulty === "easy" ? "bg-emerald-50 text-emerald-700" :
                    row.difficulty === "expert" ? "bg-red-50 text-red-700" :
                    "bg-amber-50 text-amber-700"
                  )}>
                    {row.difficulty}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={reset} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
              ← Upload different file
            </button>
            <button
              type="button"
              onClick={() => setPhase("configure")}
              disabled={preview.validRows.length === 0}
              className="ml-auto rounded-lg bg-[#185FA5] px-5 py-2 text-xs font-semibold text-white hover:bg-[#185FA5]/90 disabled:opacity-40 transition"
            >
              Configure quiz →
            </button>
          </div>
        </div>
      )}

      {/* Configure */}
      {phase === "configure" && preview && (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            Creating quiz with <strong>{preview.validRows.length} question{preview.validRows.length !== 1 ? "s" : ""}</strong>
          </div>

          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-500">Quiz title <span className="text-red-400">*</span></label>
            <input className="admin-input mt-2" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="e.g. USPAP Practice Quiz" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-500">Passing score (%)</label>
              <input type="number" min={1} max={100} className="admin-input mt-2" value={passingScore} onChange={(e) => setPassingScore(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-500">Status</label>
              <select className="admin-input mt-2" value={quizStatus} onChange={(e) => setQuizStatus(e.target.value as "draft" | "published")}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {([
              { key: "shuffleQuestions", label: "Shuffle questions", value: shuffleQuestions, onChange: setShuffleQuestions },
              { key: "shuffleChoices", label: "Shuffle choices", value: shuffleChoices, onChange: setShuffleChoices },
            ] as const).map(({ key, label, value, onChange }) => (
              <label key={key} className={cn("flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors", value ? "border-[#185FA5]/30 bg-[#E6F1FB]/30" : "border-slate-200 bg-white hover:border-slate-300")}>
                <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded accent-[#185FA5]" />
                <span className="text-xs font-semibold text-slate-700">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setPhase("preview")} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
              ← Back
            </button>
            <button
              type="button"
              onClick={runImport}
              disabled={!quizTitle.trim() || busy}
              className="ml-auto rounded-lg bg-[#185FA5] px-5 py-2 text-xs font-semibold text-white hover:bg-[#185FA5]/90 disabled:opacity-40 transition"
            >
              Create quiz
            </button>
          </div>
        </div>
      )}

      {/* Importing */}
      {phase === "importing" && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Icons.Loader size={32} className="animate-spin text-[#185FA5]" />
          <p className="text-sm font-semibold text-slate-700">Creating quiz…</p>
        </div>
      )}

      {/* Done */}
      {phase === "done" && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
              <Icons.Check size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800">Quiz created successfully!</p>
              <p className="text-xs text-emerald-700 mt-0.5">{preview?.validRows.length} questions imported</p>
            </div>
          </div>
          <button type="button" onClick={reset} className="w-full rounded-lg border border-slate-200 px-4 py-2 text-xs text-slate-500 hover:bg-slate-50 transition">
            Import another quiz
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function QuizQuickImportPanel({
  onImported,
  onCancel,
}: {
  onImported: (message: string) => void;
  onCancel: () => void;
}) {
  const [tab, setTab] = useState<Tab>("csv");
  const [csvNotice, setCsvNotice] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-[#b8d7f0] bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">Quick Quiz Import</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">Create a quiz from a CSV or Word document</p>
        </div>
        <button type="button" onClick={onCancel} className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
          <Icons.X size={16} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Tab switcher */}
        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          {(["csv", "docx"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
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

        {tab === "csv" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <a
                href="/api/admin/assessments/csv-template"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#185FA5]/30 bg-[#E6F1FB]/50 px-3 py-2 text-xs font-semibold text-[#185FA5] hover:bg-[#E6F1FB] transition"
              >
                <Icons.ArrowDown size={13} />
                Download CSV template
              </a>
              <span className="text-xs text-slate-400">Fill it in, then upload or paste below</span>
            </div>
            {csvNotice && (
              <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <Icons.Check size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                <p className="text-xs text-emerald-700">{csvNotice}</p>
              </div>
            )}
            <CsvImportPanel onImported={(msg) => { setCsvNotice(msg); onImported(msg); }} />
          </div>
        )}

        {tab === "docx" && <DocxImportFlow onImported={onImported} />}
      </div>
    </div>
  );
}
