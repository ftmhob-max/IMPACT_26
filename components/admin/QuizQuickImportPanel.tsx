"use client";

import { useCallback, useEffect, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn, DOMAINS } from "@/lib/utils";
import { CsvImportPanel } from "@/components/admin/CsvImportPanel";
import { useDomains } from "@/lib/hooks/useDomains";

// ─── Shared types ─────────────────────────────────────────────────────────────

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
  duplicates: Array<{ row: number; questionText: string; existingQuestionId: string }>;
}

interface BankCandidate {
  id: string;
  questionText: string;
  difficulty: string;
  domain: string;
  questionType: string | null;
  usageCount: number;
}

// Placeholder UUID that doesn't match any real quiz — used so the bank API
// returns all questions with inCurrentQuiz: false
const PLACEHOLDER_QUIZ_ID = "00000000-0000-0000-0000-000000000001";

const DIFFICULTIES = ["easy", "proficient", "expert"] as const;
const MAX_ERRORS = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function DiffBadge({ diff }: { diff: string }) {
  const map: Record<string, string> = {
    easy: "bg-emerald-50 text-emerald-700",
    proficient: "bg-amber-50 text-amber-700",
    expert: "bg-red-50 text-red-700",
  };
  return (
    <span className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase", map[diff] ?? "bg-slate-100 text-slate-500")}>
      {diff}
    </span>
  );
}

function DomainBadge({ domain }: { domain: string }) {
  return <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">{domain}</span>;
}

// ─── Duplicate include section ────────────────────────────────────────────────

function DuplicateIncludeSection({
  duplicates,
  selectedIds,
  onToggle,
}: {
  duplicates: PreviewResult["duplicates"];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const withIds = duplicates.filter((d) => d.existingQuestionId);
  if (withIds.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        <Icons.BookOpen size={14} className="text-amber-600 shrink-0" />
        <span className="flex-1 text-xs font-semibold text-amber-800">
          {withIds.length} question{withIds.length !== 1 ? "s" : ""} already in your bank
        </span>
        <span className="text-[10px] text-amber-600 font-medium">
          {selectedIds.size} selected to include
        </span>
        <Icons.ChevronDown size={13} className={cn("text-amber-500 shrink-0 transition-transform", !open && "-rotate-90")} />
      </button>
      {open && (
        <div className="border-t border-amber-200 px-4 py-3 space-y-2">
          <p className="text-[11px] text-amber-700">
            These won&apos;t be re-imported, but you can add them from your bank to the new quiz.
          </p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {withIds.map((dup) => (
              <label key={dup.existingQuestionId} className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.has(dup.existingQuestionId)}
                  onChange={() => onToggle(dup.existingQuestionId)}
                  className="mt-0.5 h-3.5 w-3.5 rounded accent-[#185FA5] shrink-0"
                />
                <span className="text-xs text-amber-900 line-clamp-2 leading-5">{dup.questionText}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DOCX import flow ─────────────────────────────────────────────────────────

type DocxPhase = "upload" | "preview" | "configure" | "importing" | "done";

function DocxImportFlow({ onImported }: { onImported: (msg: string, quizId?: string, quizTitle?: string) => void }) {
  const [phase, setPhase] = useState<DocxPhase>("upload");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  // Duplicate selection
  const [selectedDuplicateIds, setSelectedDuplicateIds] = useState<Set<string>>(new Set());

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
    setSelectedDuplicateIds(new Set());
    setQuizTitle("Imported Quiz");
    setPassingScore(70);
    setShuffleQuestions(true);
    setShuffleChoices(true);
    setQuizStatus("draft");
  }

  function initDuplicateSelection(result: PreviewResult) {
    // Pre-select all duplicates that have a known existingQuestionId
    const ids = new Set(result.duplicates.filter((d) => d.existingQuestionId).map((d) => d.existingQuestionId));
    setSelectedDuplicateIds(ids);
  }

  function toggleDuplicate(id: string) {
    setSelectedDuplicateIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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
      initDuplicateSelection(data);
      if (file.name) setQuizTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
      setPhase("preview");
    } catch {
      setErrorMsg("Network error while parsing document.");
    } finally {
      setBusy(false);
    }
  }, []);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function runImport() {
    if (!preview) return;
    setBusy(true);
    setErrorMsg(null);
    setPhase("importing");
    try {
      // Step 1: create quiz + import new questions
      const res = await fetch("/api/admin/assessments/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: preview.validRows,
          quiz: { title: quizTitle.trim(), passingScore, shuffleQuestions, shuffleChoices, status: quizStatus },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Import failed.");
        setPhase("configure");
        setBusy(false);
        return;
      }

      const quizId: string = data.quizId;

      // Step 2: link selected bank duplicates to the new quiz
      if (quizId && selectedDuplicateIds.size > 0) {
        await fetch("/api/admin/quizzes/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizId, questionIds: [...selectedDuplicateIds] }),
        }).catch(() => null); // non-fatal
      }

      const totalAdded = preview.validRows.length + selectedDuplicateIds.size;
      setPhase("done");
      onImported(`Quiz "${quizTitle}" created with ${totalAdded} question${totalAdded !== 1 ? "s" : ""}.`, quizId, quizTitle);
    } catch {
      setErrorMsg("Network error during import.");
      setPhase("configure");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Template download */}
      {phase === "upload" && (
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/api/admin/assessments/docx-question-template"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#185FA5]/30 bg-[#E6F1FB]/50 px-3 py-2 text-xs font-semibold text-[#185FA5] hover:bg-[#E6F1FB] transition"
          >
            <Icons.ArrowDown size={13} />
            Table template
          </a>
          <a
            href="/api/admin/assessments/docx-question-template?variant=impact"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#185FA5]/30 bg-[#E6F1FB]/50 px-3 py-2 text-xs font-semibold text-[#185FA5] hover:bg-[#E6F1FB] transition"
          >
            <Icons.FileText size={13} />
            IMPACT workbook template
          </a>
          <span className="text-xs text-slate-400">Fill either supported Word template, then upload</span>
        </div>
      )}

      {/* Phase stepper */}
      {phase !== "upload" && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          {(["preview", "configure", "importing", "done"] as const).map((p, i) => {
            const labels: Record<string, string> = { preview: "Preview", configure: "Configure", importing: "Import", done: "Done" };
            const order = ["preview", "configure", "importing", "done"].indexOf(phase);
            const isCurrent = phase === p;
            const isDone = order > i;
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

      {/* Upload drop zone */}
      {phase === "upload" && (
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => document.getElementById("quiz-docx-input")?.click()}
          onKeyDown={(e) => e.key === "Enter" && document.getElementById("quiz-docx-input")?.click()}
          className={cn(
            "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all",
            dragging ? "border-[#185FA5] bg-[#E6F1FB]/60 scale-[1.01]" : "border-slate-300 bg-slate-50 hover:border-[#185FA5]/60 hover:bg-[#E6F1FB]/30",
            busy && "pointer-events-none opacity-60"
          )}
        >
          <input id="quiz-docx-input" type="file" accept=".docx" className="sr-only"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} disabled={busy} />
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
      )}

      {/* Preview */}
      {phase === "preview" && preview && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              {preview.validRows.length} new question{preview.validRows.length !== 1 ? "s" : ""}
            </span>
            {preview.duplicates.filter((d) => d.existingQuestionId).length > 0 && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                {preview.duplicates.filter((d) => d.existingQuestionId).length} already in bank
              </span>
            )}
            {preview.errors.length > 0 && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                {preview.errors.length} error{preview.errors.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {preview.errors.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-1.5">
              <p className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                <Icons.AlertTriangle size={13} />
                Validation errors (these rows will be skipped):
              </p>
              {preview.errors.slice(0, MAX_ERRORS).map((err, i) => (
                <p key={i} className="text-xs text-red-700 pl-5">Row {err.row} · {err.field}: {err.message}</p>
              ))}
              {preview.errors.length > MAX_ERRORS && (
                <p className="text-xs text-red-600 pl-5 font-semibold">…and {preview.errors.length - MAX_ERRORS} more</p>
              )}
            </div>
          )}

          {/* Duplicate include section */}
          <DuplicateIncludeSection
            duplicates={preview.duplicates}
            selectedIds={selectedDuplicateIds}
            onToggle={toggleDuplicate}
          />

          {/* Valid question list */}
          {preview.validRows.length > 0 && (
            <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 divide-y divide-slate-100">
              {preview.validRows.map((row, idx) => (
                <div key={idx} className="flex items-start gap-2.5 px-3 py-2.5">
                  <span className="text-[10px] font-bold text-slate-400 mt-0.5 w-5 shrink-0 text-right">{idx + 1}</span>
                  <p className="flex-1 text-xs text-slate-700 line-clamp-2">{row.question_text}</p>
                  <div className="flex items-center gap-1 shrink-0">
                    <DiffBadge diff={row.difficulty} />
                    <DomainBadge domain={row.domain} />
                  </div>
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
              disabled={preview.validRows.length === 0 && selectedDuplicateIds.size === 0}
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
            Creating quiz with{" "}
            <strong>{preview.validRows.length} new question{preview.validRows.length !== 1 ? "s" : ""}</strong>
            {selectedDuplicateIds.size > 0 && (
              <> + <strong>{selectedDuplicateIds.size} from bank</strong></>
            )}
          </div>

          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-500">
              Quiz title <span className="text-red-400">*</span>
            </label>
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
            {[
              { key: "shuffleQuestions" as const, label: "Shuffle questions", value: shuffleQuestions, set: setShuffleQuestions },
              { key: "shuffleChoices" as const, label: "Shuffle choices", value: shuffleChoices, set: setShuffleChoices },
            ].map(({ key, label, value, set }) => (
              <label key={key} className={cn("flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors", value ? "border-[#185FA5]/30 bg-[#E6F1FB]/30" : "border-slate-200 bg-white hover:border-slate-300")}>
                <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} className="h-4 w-4 rounded accent-[#185FA5]" />
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
              <p className="text-sm font-bold text-emerald-800">Quiz created!</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                {preview?.validRows.length ?? 0} new + {selectedDuplicateIds.size} from bank
              </p>
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

// ─── From Bank flow ───────────────────────────────────────────────────────────

type BankPhase = "browse" | "configure" | "creating" | "done";

function FromBankFlow({ onImported }: { onImported: (msg: string, quizId?: string, quizTitle?: string) => void }) {
  const [bankPhase, setBankPhase] = useState<BankPhase>("browse");
  const [candidates, setCandidates] = useState<BankCandidate[]>([]);
  const [loadingBank, setLoadingBank] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set());
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<string>>(new Set());
  const { domains: allDomains, addDomain } = useDomains();
  const [addingDomain, setAddingDomain] = useState(false);
  const [newDomainName, setNewDomainName] = useState("");
  const [addDomainBusy, setAddDomainBusy] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quiz config
  const [quizTitle, setQuizTitle] = useState("Custom Quiz");
  const [passingScore, setPassingScore] = useState(70);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleChoices, setShuffleChoices] = useState(true);
  const [quizStatus, setQuizStatus] = useState<"draft" | "published">("draft");
  const [busy, setBusy] = useState(false);

  // Fetch bank questions whenever filters change
  useEffect(() => {
    if (bankPhase !== "browse") return;
    setLoadingBank(true);
    const params = new URLSearchParams({ quizId: PLACEHOLDER_QUIZ_ID, search });
    if (selectedDomains.size > 0) params.set("domains", [...selectedDomains].join(","));
    if (selectedDifficulties.size > 0) params.set("difficulty", [...selectedDifficulties].join(","));

    const controller = new AbortController();
    fetch(`/api/admin/quizzes/question-bank?${params}`, { signal: controller.signal })
      .then((res) => res.ok ? res.json() : { candidates: [] })
      .then((data) => {
        setCandidates(
          (data.candidates ?? []).map((c: any) => ({
            id: c.id,
            questionText: c.questionText,
            difficulty: c.difficulty,
            domain: c.domain,
            questionType: c.questionType ?? null,
            usageCount: c.usageCount ?? 0,
          }))
        );
        setLoadingBank(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setLoadingBank(false);
      });

    return () => controller.abort();
  }, [search, selectedDomains, selectedDifficulties, bankPhase]);

  function toggleDomain(d: string) {
    setSelectedDomains((prev) => { const n = new Set(prev); n.has(d) ? n.delete(d) : n.add(d); return n; });
  }

  function toggleDifficulty(d: string) {
    setSelectedDifficulties((prev) => { const n = new Set(prev); n.has(d) ? n.delete(d) : n.add(d); return n; });
  }

  async function handleAddNewDomain() {
    const name = newDomainName.trim();
    if (!name) return;
    setAddDomainBusy(true);
    const ok = await addDomain(name);
    setAddDomainBusy(false);
    if (ok) {
      toggleDomain(name);
      setNewDomainName("");
      setAddingDomain(false);
    }
  }

  function toggleQuestion(id: string) {
    setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function toggleAll() {
    if (selectedIds.size === candidates.length && candidates.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(candidates.map((c) => c.id)));
    }
  }

  async function createQuiz() {
    if (!quizTitle.trim() || selectedIds.size === 0) return;
    setBusy(true);
    setErrorMsg(null);
    setBankPhase("creating");
    try {
      // Step 1: create empty quiz
      const createRes = await fetch("/api/admin/assessments/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: [],
          quiz: { title: quizTitle.trim(), passingScore, shuffleQuestions, shuffleChoices, status: quizStatus },
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error ?? "Failed to create quiz.");

      const quizId: string = createData.quizId;

      // Step 2: link selected questions
      const linkRes = await fetch("/api/admin/quizzes/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, questionIds: [...selectedIds] }),
      });
      if (!linkRes.ok) throw new Error("Quiz created but failed to add questions.");

      setBankPhase("done");
      onImported(`Quiz "${quizTitle.trim()}" created with ${selectedIds.size} question${selectedIds.size !== 1 ? "s" : ""} from the bank.`, quizId, quizTitle.trim());
    } catch (err: any) {
      setErrorMsg(err.message ?? "Failed to create quiz.");
      setBankPhase("configure");
    } finally {
      setBusy(false);
    }
  }

  if (bankPhase === "done") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
          <Icons.Check size={18} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-800">Quiz created!</p>
          <p className="text-xs text-emerald-700 mt-0.5">{selectedIds.size} questions from the bank.</p>
        </div>
      </div>
    );
  }

  if (bankPhase === "creating") {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <Icons.Loader size={28} className="animate-spin text-[#185FA5]" />
        <p className="text-sm font-semibold text-slate-700">Creating quiz…</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <Icons.X size={14} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-xs text-red-700">{errorMsg}</p>
        </div>
      )}

      {bankPhase === "browse" && (
        <>
          {/* Search + filters */}
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search question bank…"
            className="admin-input"
          />
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {allDomains.map((d) => {
                const label = DOMAINS[d as keyof typeof DOMAINS]?.label ?? d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDomain(d)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold transition",
                      selectedDomains.has(d) ? "bg-[#185FA5] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
              {addingDomain ? (
                <form
                  className="flex items-center gap-1"
                  onSubmit={(e) => { e.preventDefault(); handleAddNewDomain(); }}
                >
                  <input
                    autoFocus
                    value={newDomainName}
                    onChange={(e) => setNewDomainName(e.target.value)}
                    className="h-[26px] w-28 rounded-full border border-[#185FA5] px-2.5 text-[11px] font-semibold outline-none"
                    placeholder="new-domain"
                  />
                  <button
                    type="submit"
                    disabled={addDomainBusy}
                    className="rounded-full bg-[#185FA5] px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-60"
                  >
                    {addDomainBusy ? "…" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAddingDomain(false); setNewDomainName(""); }}
                    className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-200"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingDomain(true)}
                  className="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:border-[#185FA5] hover:text-[#185FA5] transition-colors"
                >
                  + Add domain
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDifficulty(d)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-semibold transition",
                    selectedDifficulties.has(d)
                      ? d === "easy" ? "bg-emerald-600 text-white" : d === "expert" ? "bg-red-600 text-white" : "bg-amber-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            {/* Select all header */}
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-3 py-2">
              <input
                type="checkbox"
                checked={candidates.length > 0 && selectedIds.size === candidates.length}
                onChange={toggleAll}
                className="h-3.5 w-3.5 rounded accent-[#185FA5]"
              />
              <span className="flex-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                {loadingBank ? "Loading…" : `${candidates.length} question${candidates.length !== 1 ? "s" : ""}`}
              </span>
              {selectedIds.size > 0 && (
                <span className="text-[11px] font-bold text-[#185FA5]">{selectedIds.size} selected</span>
              )}
            </div>

            {/* Question rows */}
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
              {loadingBank ? (
                <div className="flex items-center justify-center py-8 text-xs text-slate-400">
                  <Icons.Loader size={14} className="animate-spin mr-2" />
                  Searching…
                </div>
              ) : candidates.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">No questions match your filters.</p>
              ) : (
                candidates.map((c) => (
                  <label key={c.id} className={cn("flex cursor-pointer items-start gap-3 px-3 py-2.5 transition hover:bg-slate-50", selectedIds.has(c.id) && "bg-[#E6F1FB]/30")}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c.id)}
                      onChange={() => toggleQuestion(c.id)}
                      className="mt-0.5 h-3.5 w-3.5 rounded accent-[#185FA5] shrink-0"
                    />
                    <span className="flex-1 text-xs text-slate-700 line-clamp-2">{c.questionText}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <DiffBadge diff={c.difficulty} />
                      <DomainBadge domain={c.domain} />
                      {c.usageCount > 0 && (
                        <span className="text-[9px] text-slate-400">{c.usageCount}×</span>
                      )}
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setBankPhase("configure")}
            disabled={selectedIds.size === 0}
            className="w-full rounded-lg bg-[#185FA5] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#185FA5]/90 disabled:opacity-40 transition"
          >
            Next: Configure quiz with {selectedIds.size} question{selectedIds.size !== 1 ? "s" : ""} →
          </button>
        </>
      )}

      {bankPhase === "configure" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            Creating quiz with <strong>{selectedIds.size} question{selectedIds.size !== 1 ? "s" : ""}</strong> from the bank
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
            {[
              { key: "shuffleQ", label: "Shuffle questions", value: shuffleQuestions, set: setShuffleQuestions },
              { key: "shuffleC", label: "Shuffle choices", value: shuffleChoices, set: setShuffleChoices },
            ].map(({ key, label, value, set }) => (
              <label key={key} className={cn("flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors", value ? "border-[#185FA5]/30 bg-[#E6F1FB]/30" : "border-slate-200 bg-white hover:border-slate-300")}>
                <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} className="h-4 w-4 rounded accent-[#185FA5]" />
                <span className="text-xs font-semibold text-slate-700">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setBankPhase("browse")} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
              ← Back to selection
            </button>
            <button
              type="button"
              onClick={createQuiz}
              disabled={!quizTitle.trim() || busy}
              className="ml-auto rounded-lg bg-[#185FA5] px-5 py-2 text-xs font-semibold text-white hover:bg-[#185FA5]/90 disabled:opacity-40 transition"
            >
              Create quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CSV wrapper with post-import duplicate linking ───────────────────────────

function CsvWithDuplicateLinking({ onImported }: { onImported: (msg: string, quizId?: string, quizTitle?: string) => void }) {
  const [lastPreviewDuplicates, setLastPreviewDuplicates] = useState<
    Array<{ questionText: string; existingQuestionId: string }>
  >([]);
  const [pendingLink, setPendingLink] = useState<{ quizId: string; duplicates: typeof lastPreviewDuplicates } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [linking, setLinking] = useState(false);
  const [linkNotice, setLinkNotice] = useState<string | null>(null);

  // Intercept preview results to grab duplicate info
  // We patch the fetch to capture previews via the CsvImportPanel's internal flow.
  // Since CsvImportPanel doesn't expose preview externally, we handle this via the
  // onImported callback which now returns quizId. At that point we use the last
  // known duplicates from a shadow preview call.
  async function handleImported({ message, quizId, quizTitle }: { message: string; quizId?: string; quizTitle?: string }) {
    onImported(message, quizId, quizTitle);

    // If there are enriched duplicates with IDs and a quizId was returned, offer linking
    const withIds = lastPreviewDuplicates.filter((d) => d.existingQuestionId);
    if (quizId && withIds.length > 0) {
      setPendingLink({ quizId, duplicates: withIds });
      setSelectedIds(new Set(withIds.map((d) => d.existingQuestionId)));
    }
  }

  async function linkDuplicates() {
    if (!pendingLink || selectedIds.size === 0) return;
    setLinking(true);
    try {
      const res = await fetch("/api/admin/quizzes/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId: pendingLink.quizId, questionIds: [...selectedIds] }),
      });
      if (res.ok) {
        setLinkNotice(`${selectedIds.size} bank question${selectedIds.size !== 1 ? "s" : ""} added to quiz.`);
        setPendingLink(null);
      } else {
        setLinkNotice("Failed to add questions to quiz.");
      }
    } catch {
      setLinkNotice("Network error.");
    } finally {
      setLinking(false);
    }
  }

  return (
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

      {linkNotice && (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <Icons.Check size={14} className="mt-0.5 shrink-0 text-emerald-600" />
          <p className="text-xs text-emerald-700">{linkNotice}</p>
        </div>
      )}

      {/* Post-import duplicate linking banner */}
      {pendingLink && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
          <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
            <Icons.BookOpen size={14} className="shrink-0" />
            {pendingLink.duplicates.length} question{pendingLink.duplicates.length !== 1 ? "s were" : " was"} already in your bank and skipped. Add them to the new quiz?
          </p>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {pendingLink.duplicates.map((d) => (
              <label key={d.existingQuestionId} className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.has(d.existingQuestionId)}
                  onChange={() => setSelectedIds((prev) => { const n = new Set(prev); n.has(d.existingQuestionId) ? n.delete(d.existingQuestionId) : n.add(d.existingQuestionId); return n; })}
                  className="mt-0.5 h-3.5 w-3.5 rounded accent-[#185FA5] shrink-0"
                />
                <span className="text-xs text-amber-900 line-clamp-2">{d.questionText}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={linkDuplicates}
              disabled={linking || selectedIds.size === 0}
              className="rounded-lg bg-[#185FA5] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#185FA5]/90 disabled:opacity-40 transition"
            >
              {linking ? <Icons.Loader size={12} className="animate-spin inline mr-1" /> : null}
              Add {selectedIds.size} to quiz
            </button>
            <button type="button" onClick={() => setPendingLink(null)} className="text-xs text-amber-700 hover:underline">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <CsvImportPanel onImported={handleImported} />
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

type Tab = "csv" | "docx" | "bank";

export function QuizQuickImportPanel({
  onImported,
  onCancel,
}: {
  onImported: (message: string, quizId?: string, quizTitle?: string) => void;
  onCancel: () => void;
}) {
  const [tab, setTab] = useState<Tab>("csv");

  return (
    <div className="rounded-2xl border border-[#b8d7f0] bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">Quick Quiz Import</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">Create a quiz from a file or browse your question bank</p>
        </div>
        <button type="button" onClick={onCancel} className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
          <Icons.X size={16} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Tab switcher */}
        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          {([
            { id: "csv" as const, label: "CSV", icon: Icons.ClipboardList },
            { id: "docx" as const, label: "Word Document", icon: Icons.FileText },
            { id: "bank" as const, label: "From Bank", icon: Icons.BookOpen },
          ]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-all",
                tab === id ? "bg-white text-[#185FA5] shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {tab === "csv" && <CsvWithDuplicateLinking onImported={onImported} />}
        {tab === "docx" && <DocxImportFlow onImported={onImported} />}
        {tab === "bank" && <FromBankFlow onImported={onImported} />}
      </div>
    </div>
  );
}
