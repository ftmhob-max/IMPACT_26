"use client";

import { useRef, useState } from "react";
import { FileDropZone } from "./FileDropZone";
import * as Icons from "@/components/ui/Icons";

const TEMPLATE_URL = "/api/admin/assessments/csv-template";

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

interface CsvImportPanelProps {
  onImported: (result: { message: string; quizId?: string }) => void;
}

type InputMode = "text" | "file";

export function CsvImportPanel({ onImported }: CsvImportPanelProps) {
  const [mode, setMode] = useState<InputMode>("file");
  const [csvText, setCsvText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [editedRows, setEditedRows] = useState<PreviewRow[]>([]);
  const [quizTitle, setQuizTitle] = useState("Imported Assessment");
  const [passingScore, setPassingScore] = useState(70);
  const [shuffle, setShuffle] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function getCsvText(): Promise<string> {
    if (mode === "file" && file) return file.text();
    return csvText;
  }

  async function handlePreview() {
    const text = await getCsvText();
    if (!text.trim()) return;
    setBusy(true);
    setNotice(null);
    const res = await fetch("/api/admin/assessments/csv-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csvText: text }),
    });
    const data = await res.json();
    setBusy(false);
    setPreview(data);
    setEditedRows(data.validRows ?? []);
  }

  async function handleImport() {
    if (!editedRows.length) return;
    setBusy(true);
    setNotice(null);
    const attemptedCount = editedRows.length;
    const res = await fetch("/api/admin/assessments/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rows: editedRows,
        quiz: {
          title: quizTitle,
          passingScore,
          shuffleQuestions: shuffle,
          shuffleChoices: false,
          status: "draft",
        },
      }),
    });
    setBusy(false);
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      const importedCount = Array.isArray(data.importedQuestionIds) ? data.importedQuestionIds.length : 0;
      const duplicatesSkipped = Number(data.duplicatesSkipped ?? 0);
      setPreview(null);
      setEditedRows([]);
      setCsvText("");
      setFile(null);
      setNotice({
        type: "success",
        text:
          duplicatesSkipped > 0
            ? `${importedCount} questions imported. ${duplicatesSkipped} duplicate question${duplicatesSkipped !== 1 ? "s were" : " was"} skipped.`
            : `${importedCount} questions imported as a draft quiz.`,
      });
      onImported({
        message: duplicatesSkipped > 0
          ? `Assessment imported: "${quizTitle}" (${importedCount} added, ${duplicatesSkipped} duplicate${duplicatesSkipped !== 1 ? "s" : ""} skipped out of ${attemptedCount})`
          : `Assessment imported: "${quizTitle}" (${importedCount} questions)`,
        quizId: data.quizId ?? undefined,
      });
    } else {
      const err = await res.json().catch(() => ({}));
      setNotice({ type: "error", text: err.error ?? "Import failed." });
    }
  }

  function updateRow(index: number, field: keyof PreviewRow, value: unknown) {
    setEditedRows((rows) => {
      const next = [...rows];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function downloadTemplate() {
    window.location.href = TEMPLATE_URL;
  }

  const hasErrors = (preview?.errors?.length ?? 0) > 0;
  const canImport = !hasErrors && editedRows.length > 0;

  return (
    <div className="space-y-4">
      {/* Mode tabs + template download */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
          <TabButton active={mode === "file"} onClick={() => setMode("file")}>
            <Icons.Upload size={13} />
            Upload file
          </TabButton>
          <TabButton active={mode === "text"} onClick={() => setMode("text")}>
            <Icons.FileText size={13} />
            Paste CSV
          </TabButton>
        </div>
        <button
          type="button"
          onClick={downloadTemplate}
          className="flex items-center gap-1.5 text-xs font-medium text-[#185FA5] hover:underline"
        >
          <Icons.FileCheck size={13} />
          Download sample CSV
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
        Use the sample CSV as a fill-in template for instructors. Keep the header row unchanged, separate choices with
        `|`, and set `correct_answers` to letters like `A` or `A|C`.
      </div>

      {/* Input */}
      {mode === "file" ? (
        <FileDropZone
          file={file}
          onFile={(f) => { setFile(f); setPreview(null); }}
          disabled={busy}
        />
      ) : (
        <textarea
          className="admin-input min-h-36 font-mono text-xs"
          value={csvText}
          onChange={(e) => { setCsvText(e.target.value); setPreview(null); }}
          placeholder="Paste CSV rows here…"
        />
      )}

      {/* Preview controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="admin-action secondary"
          onClick={handlePreview}
          disabled={busy || (!file && !csvText.trim())}
        >
          {busy && !preview ? <Icons.Loader size={13} className="animate-spin" /> : <Icons.Eye size={13} />}
          Preview & validate
        </button>
        {preview && !hasErrors && (
          <>
            <span className="text-xs text-slate-400">then</span>
            <button
              type="button"
              className="admin-action"
              onClick={handleImport}
              disabled={busy || !canImport}
            >
              {busy ? <Icons.Loader size={13} className="animate-spin" /> : <Icons.Check size={13} />}
              Import {editedRows.length} question{editedRows.length !== 1 ? "s" : ""}
            </button>
          </>
        )}
      </div>

      {/* Notice */}
      {notice && (
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${notice.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {notice.type === "success" ? <Icons.Check size={13} /> : <Icons.X size={13} />}
          {notice.text}
        </div>
      )}

      {/* Preview results */}
      {preview && (
        <div className="space-y-3">
          <PreviewSummary preview={preview} />

          {preview.errors.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-1 max-h-36 overflow-y-auto">
              {preview.errors.map((err, i) => (
                <p key={i} className="text-xs text-red-700">
                  <span className="font-semibold">Row {err.row}</span> · {err.field}: {err.message}
                </p>
              ))}
            </div>
          )}

          {/* Quiz settings (shown when rows are valid) */}
          {canImport && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Quiz settings</p>
              <div className="grid gap-2 sm:grid-cols-[1fr_120px_auto]">
                <input
                  className="admin-input"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="Quiz title"
                />
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    className="admin-input w-16"
                    value={passingScore}
                    min={0}
                    max={100}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">% pass</span>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 whitespace-nowrap">
                  <input type="checkbox" checked={shuffle} onChange={(e) => setShuffle(e.target.checked)} />
                  Shuffle
                </label>
              </div>
            </div>
          )}

          {/* Editable row table */}
          {editedRows.length > 0 && (
            <EditableRowTable rows={editedRows} onUpdate={updateRow} />
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
        active ? "bg-white text-[#185FA5] shadow-sm" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

function PreviewSummary({ preview }: { preview: PreviewResult }) {
  return (
    <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
      <Pill value={preview.validRows.length} label="valid" color="emerald" />
      <Pill value={preview.errors.length} label="errors" color="red" />
      <Pill value={preview.duplicates.length} label="duplicates" color="amber" />
    </div>
  );
}

function Pill({ value, label, color }: { value: number; label: string; color: "emerald" | "red" | "amber" }) {
  const colors = {
    emerald: "text-emerald-700 font-bold",
    red: "text-red-600 font-bold",
    amber: "text-amber-600 font-bold",
  };
  return (
    <span>
      <span className={colors[color]}>{value}</span>
      <span className="text-slate-500"> {label}</span>
    </span>
  );
}

function EditableRowTable({
  rows,
  onUpdate,
}: {
  rows: PreviewRow[];
  onUpdate: (index: number, field: keyof PreviewRow, value: unknown) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-3 py-2">
        <p className="text-xs font-bold text-slate-600">
          {rows.length} question{rows.length !== 1 ? "s" : ""} — click a row to edit before importing
        </p>
      </div>
      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
        {rows.map((row, i) => (
          <div key={i}>
            <button
              type="button"
              className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <span className="shrink-0 mt-0.5 text-[10px] font-mono text-slate-400 w-5">{i + 1}</span>
              <span className="flex-1 min-w-0 text-xs text-slate-700 truncate">{row.question_text}</span>
              <div className="shrink-0 flex items-center gap-1.5">
                <DiffChip diff={row.difficulty} />
                <DomainChip domain={row.domain} />
                {expanded === i ? <Icons.ChevronUp size={13} className="text-slate-400" /> : <Icons.ChevronDown size={13} className="text-slate-400" />}
              </div>
            </button>

            {expanded === i && (
              <div className="px-3 pb-3 pt-1 bg-slate-50 space-y-2 border-t border-slate-100">
                <textarea
                  className="admin-input text-xs min-h-16"
                  value={row.question_text}
                  onChange={(e) => onUpdate(i, "question_text", e.target.value)}
                />
                <div className="grid gap-2 sm:grid-cols-3">
                  <select className="admin-input text-xs" value={row.difficulty} onChange={(e) => onUpdate(i, "difficulty", e.target.value)}>
                    {["easy", "proficient", "expert"].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select className="admin-input text-xs" value={row.domain} onChange={(e) => onUpdate(i, "domain", e.target.value)}>
                    {["math", "appraisal", "law", "philly", "admin", "ethics"].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <input
                    className="admin-input text-xs"
                    value={row.correct_answers.join(",")}
                    onChange={(e) => onUpdate(i, "correct_answers", e.target.value.split(",").map((s) => s.trim().toUpperCase()))}
                    placeholder="Correct: A or A,C"
                  />
                </div>
                <textarea
                  className="admin-input text-xs min-h-12"
                  value={row.explanation ?? ""}
                  onChange={(e) => onUpdate(i, "explanation", e.target.value)}
                  placeholder="Explanation (shown after answer)"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DiffChip({ diff }: { diff: string }) {
  const map: Record<string, string> = {
    easy: "bg-green-100 text-green-700",
    proficient: "bg-blue-100 text-blue-700",
    expert: "bg-purple-100 text-purple-700",
  };
  return <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${map[diff] ?? "bg-slate-100 text-slate-500"}`}>{diff}</span>;
}

function DomainChip({ domain }: { domain: string }) {
  return <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600">{domain}</span>;
}
