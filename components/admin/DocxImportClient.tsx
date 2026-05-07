"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import type { ParsedSection } from "@/lib/admin/docx-question-parser";
import { CsvImportPanel } from "./CsvImportPanel";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ParseResult {
  sections: ParsedSection[];
  questionCount: number;
  sectionCount: number;
  formulaCount: number;
}

interface ImportResult {
  courseId: string;
  modulesCreated: number;
  lessonsCreated: number;
  questionsCreated: number;
  quizzesCreated: number;
}

type Phase = "upload" | "preview" | "options" | "importing" | "done" | "error";
type ImportMode = "docx" | "csv";

// ─── Difficulty badge ────────────────────────────────────────────────────────

function DiffBadge({ label, count, color }: { label: string; count: number; color: string }) {
  if (count === 0) return null;
  return (
    <span className={cn("inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium", color)}>
      {count} {label}
    </span>
  );
}

// ─── Section accordion ────────────────────────────────────────────────────────

function SectionRow({ section }: { section: ParsedSection }) {
  const [open, setOpen] = useState(false);
  const totalQ = section.formulas.reduce((s, f) => s + f.questions.length, 0);

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        {open ? (
          <Icons.ChevronDown size={14} className="text-slate-400" />
        ) : (
          <Icons.ChevronRight size={14} className="text-slate-400" />
        )}
        <span className="flex-1 text-sm font-semibold text-slate-800">{section.title}</span>
        <span className="text-xs text-slate-500">{section.formulas.length} formulas · {totalQ} questions</span>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-4 pb-3">
          <div className="mt-2 space-y-1">
            {section.formulas.map((formula) => {
              const easy = formula.questions.filter((q) => q.difficulty === "easy").length;
              const inter = formula.questions.filter((q) => q.difficulty === "intermediate").length;
              const expert = formula.questions.filter((q) => q.difficulty === "expert").length;
              return (
                <div
                  key={formula.code}
                  className="flex items-center gap-2 rounded-md py-1.5 pl-2 text-xs text-slate-600"
                >
                  <span className="font-mono font-bold text-[#185FA5]">{formula.code}</span>
                  <span className="flex-1 truncate">{formula.name}</span>
                  <div className="flex items-center gap-1">
                    <DiffBadge label="easy" count={easy} color="bg-emerald-50 text-emerald-700" />
                    <DiffBadge label="mid" count={inter} color="bg-amber-50 text-amber-700" />
                    <DiffBadge label="expert" count={expert} color="bg-red-50 text-red-700" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Checkbox row helper ─────────────────────────────────────────────────────

function CheckRow({
  id,
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
        checked
          ? "border-[#185FA5]/40 bg-[#E6F1FB]/40"
          : "border-slate-200 bg-white hover:border-slate-300",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded accent-[#185FA5]"
      />
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
    </label>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DocxImportClient() {
  const [mode, setMode] = useState<ImportMode>("docx");
  const [csvNotice, setCsvNotice] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  // Import options
  const [importQuestions, setImportQuestions] = useState(true);
  const [generateCurriculum, setGenerateCurriculum] = useState(true);
  const [quizPerLesson, setQuizPerLesson] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");

  // ── File handling ────────────────────────────────────────────────────────────

  const handleFile = useCallback(async (incoming: File) => {
    if (!incoming.name.toLowerCase().endsWith(".docx")) {
      setErrorMsg("Only .docx files are supported. Please upload the DOCX source file (not a PDF).");
      return;
    }
    setFile(incoming);
    setErrorMsg(null);
    setIsParsing(true);
    setPhase("upload");

    const formData = new FormData();
    formData.append("file", incoming);

    try {
      const res = await fetch("/api/admin/materials/parse-docx", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Failed to parse document.");
        setIsParsing(false);
        return;
      }
      setParseResult(data);
      // Pre-fill course title from the first section if it looks like a course name
      if (!courseTitle && data.sections?.length > 0) {
        setCourseTitle(incoming.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
      }
      setPhase("preview");
    } catch {
      setErrorMsg("Network error while parsing document.");
    } finally {
      setIsParsing(false);
    }
  }, [courseTitle]);

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }
  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = "";
  }

  // ── Import ────────────────────────────────────────────────────────────────────

  async function runImport() {
    if (!parseResult) return;
    if (generateCurriculum && !courseTitle.trim()) {
      setErrorMsg("Please enter a course title.");
      return;
    }
    setErrorMsg(null);
    setPhase("importing");

    try {
      const body: Record<string, unknown> = {
        sections: parseResult.sections,
        importQuestions: importQuestions || quizPerLesson,
        quizPerLesson,
      };

      if (generateCurriculum) {
        body.courseTitle = courseTitle.trim();
      } else {
        // Questions-only mode: use a placeholder title
        body.courseTitle = courseTitle.trim() || "Imported Questions";
        body.importQuestions = true;
        // We still call the full endpoint but it will create a hidden-ish course
      }

      const res = await fetch("/api/admin/materials/generate-curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Import failed.");
        setPhase("options");
        return;
      }
      setImportResult(data);
      setPhase("done");
    } catch {
      setErrorMsg("Network error during import.");
      setPhase("options");
    }
  }

  function reset() {
    setPhase("upload");
    setFile(null);
    setParseResult(null);
    setImportResult(null);
    setErrorMsg(null);
    setIsParsing(false);
    setCourseTitle("");
    setImportQuestions(true);
    setGenerateCurriculum(true);
    setQuizPerLesson(false);
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
        <button
          type="button"
          onClick={() => setMode("docx")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all",
            mode === "docx" ? "bg-white text-[#185FA5] shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Icons.FileText size={13} />
          DOCX import
        </button>
        <button
          type="button"
          onClick={() => setMode("csv")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all",
            mode === "csv" ? "bg-white text-[#185FA5] shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Icons.ClipboardList size={13} />
          CSV import
        </button>
      </div>

      {mode === "csv" ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-800">Instructor-friendly CSV import</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Upload a completed CSV or download the sample CSV and fill it in. This path imports questions directly
              into the question bank and creates a draft quiz from the rows you provide.
            </p>
          </div>

          {csvNotice && (
            <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <Icons.Check size={14} className="mt-0.5 shrink-0 text-emerald-600" />
              <p className="text-xs text-emerald-700">{csvNotice}</p>
            </div>
          )}

          <CsvImportPanel onImported={(message) => setCsvNotice(message)} />
        </div>
      ) : (
        <>
      {/* ── Step indicator ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        {(["upload", "preview", "options", "importing", "done"] as Phase[]).map((p, i) => {
          const isCurrent = phase === p || (phase === "error" && p === "options");
          const isDone =
            (p === "upload" && ["preview", "options", "importing", "done"].includes(phase)) ||
            (p === "preview" && ["options", "importing", "done"].includes(phase)) ||
            (p === "options" && ["importing", "done"].includes(phase)) ||
            (p === "importing" && phase === "done");
          const labels: Record<string, string> = {
            upload: "Upload",
            preview: "Preview",
            options: "Configure",
            importing: "Import",
            done: "Done",
          };
          return (
            <span key={p} className="flex items-center gap-1">
              {i > 0 && <span className="text-slate-300">›</span>}
              <span
                className={cn(
                  "font-medium",
                  isCurrent ? "text-[#185FA5]" : isDone ? "text-emerald-600" : "text-slate-400"
                )}
              >
                {labels[p]}
              </span>
            </span>
          );
        })}
      </div>

      {/* ── Upload phase ──────────────────────────────────────────────────────── */}
      {(phase === "upload" || isParsing) && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Drop DOCX file or click to browse"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => document.getElementById("docx-file-input")?.click()}
          onKeyDown={(e) => e.key === "Enter" && document.getElementById("docx-file-input")?.click()}
          className={cn(
            "flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all",
            isDragging
              ? "border-[#185FA5] bg-[#E6F1FB]/60 scale-[1.01]"
              : file
              ? "border-emerald-300 bg-emerald-50"
              : "border-slate-300 bg-slate-50 hover:border-[#185FA5]/60 hover:bg-[#E6F1FB]/30",
            isParsing && "pointer-events-none"
          )}
        >
          <input
            id="docx-file-input"
            type="file"
            accept=".docx"
            className="sr-only"
            onChange={onInputChange}
            disabled={isParsing}
          />

          {isParsing ? (
            <>
              <Icons.Loader size={28} className="animate-spin text-[#185FA5]" />
              <p className="text-sm font-semibold text-slate-700">Parsing document…</p>
              <p className="text-xs text-slate-500">Extracting questions and structure</p>
            </>
          ) : file ? (
            <>
              <Icons.FileCheck size={28} className="text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
                <p className="text-xs text-emerald-600">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <p className="text-xs text-slate-500">Click to change file</p>
            </>
          ) : (
            <>
              <Icons.Upload size={28} className={isDragging ? "text-[#185FA5]" : "text-slate-400"} />
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {isDragging ? "Drop DOCX here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs text-slate-500">DOCX files only · Questions will be extracted automatically</p>
              </div>
            </>
          )}
        </div>
      )}
        </>
      )}

      {/* ── Error ────────────────────────────────────────────────────────────── */}
      {mode === "docx" && errorMsg && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <Icons.X size={14} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-xs text-red-700">{errorMsg}</p>
        </div>
      )}

      {/* ── Preview phase ─────────────────────────────────────────────────────── */}
      {mode === "docx" && phase === "preview" && parseResult && (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Sections", value: parseResult.sectionCount, icon: Icons.BookOpen, color: "text-[#185FA5] bg-[#E6F1FB]" },
              { label: "Formulas", value: parseResult.formulaCount, icon: Icons.Calculator, color: "text-amber-700 bg-amber-50" },
              { label: "Questions", value: parseResult.questionCount, icon: Icons.ClipboardList, color: "text-emerald-700 bg-emerald-50" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                <div className={cn("mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full", color.split(" ")[1])}>
                  <Icon size={16} className={color.split(" ")[0]} />
                </div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          {parseResult.questionCount === 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <strong>No questions detected.</strong> The document may not follow the expected format (Q [number] + SKILL: EASY/INTERMEDIATE/EXPERT). Check that your DOCX matches the template structure.
            </div>
          )}

          {/* Section accordion */}
          {parseResult.sections.length > 0 && (
            <div className="space-y-2 max-h-80 overflow-y-auto rounded-lg">
              {parseResult.sections.map((section) => (
                <SectionRow key={section.title} section={section} />
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              ← Upload different file
            </button>
            <button
              type="button"
              onClick={() => setPhase("options")}
              disabled={parseResult.questionCount === 0 && parseResult.sectionCount === 0}
              className="ml-auto rounded-lg bg-[#185FA5] px-5 py-2 text-sm font-semibold text-white hover:bg-[#185FA5]/90 disabled:opacity-50"
            >
              Configure Import →
            </button>
          </div>
        </div>
      )}

      {/* ── Options phase ─────────────────────────────────────────────────────── */}
      {mode === "docx" && phase === "options" && parseResult && (
        <div className="space-y-4">
          <div className="space-y-2">
            <CheckRow
              id="opt-questions"
              checked={importQuestions}
              onChange={setImportQuestions}
              label="Import questions into question bank"
              description={`Add all ${parseResult.questionCount} questions with difficulty, domain, and rationale tags.`}
            />
            <CheckRow
              id="opt-curriculum"
              checked={generateCurriculum}
              onChange={setGenerateCurriculum}
              label="Generate curriculum (Course → Module → Lesson)"
              description={`Create ${parseResult.sectionCount} modules and ${parseResult.formulaCount} lessons from the document structure.`}
            />
            <CheckRow
              id="opt-quiz"
              checked={quizPerLesson}
              onChange={setQuizPerLesson}
              label="Create a practice quiz per lesson"
              description="Each formula lesson gets a quiz with its questions linked. Requires both options above."
              disabled={!importQuestions || !generateCurriculum}
            />
          </div>

          {generateCurriculum && (
            <div>
              <label htmlFor="course-title" className="block text-xs font-semibold text-slate-700 mb-1">
                Course title <span className="text-red-500">*</span>
              </label>
              <input
                id="course-title"
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g. Assessment Calculations Review"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#185FA5] focus:outline-none focus:ring-1 focus:ring-[#185FA5]"
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPhase("preview")}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={runImport}
              disabled={!importQuestions && !generateCurriculum}
              className="ml-auto rounded-lg bg-[#185FA5] px-5 py-2 text-sm font-semibold text-white hover:bg-[#185FA5]/90 disabled:opacity-50"
            >
              Import Now
            </button>
          </div>
        </div>
      )}

      {/* ── Importing phase ───────────────────────────────────────────────────── */}
      {mode === "docx" && phase === "importing" && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Icons.Loader size={32} className="animate-spin text-[#185FA5]" />
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700">Importing…</p>
            <p className="mt-1 text-xs text-slate-500">
              Creating {parseResult?.questionCount} questions and {parseResult?.formulaCount} lessons. This may take a minute.
            </p>
          </div>
        </div>
      )}

      {/* ── Done phase ────────────────────────────────────────────────────────── */}
      {mode === "docx" && phase === "done" && importResult && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <Icons.Check size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800">Import complete!</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                {importResult.questionsCreated} questions · {importResult.modulesCreated} modules ·{" "}
                {importResult.lessonsCreated} lessons
                {importResult.quizzesCreated > 0 && ` · ${importResult.quizzesCreated} quizzes`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/questions"
              className="flex items-center justify-center gap-2 rounded-lg border border-[#185FA5]/30 bg-[#E6F1FB]/40 px-4 py-3 text-sm font-semibold text-[#185FA5] hover:bg-[#E6F1FB]/70"
            >
              <Icons.ClipboardList size={16} />
              View Questions
            </Link>
            {importResult.modulesCreated > 0 && (
              <Link
                href="/admin/courses"
                className="flex items-center justify-center gap-2 rounded-lg border border-[#185FA5]/30 bg-[#E6F1FB]/40 px-4 py-3 text-sm font-semibold text-[#185FA5] hover:bg-[#E6F1FB]/70"
              >
                <Icons.BookOpen size={16} />
                View Courses
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={reset}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Import another document
          </button>
        </div>
      )}
    </div>
  );
}
