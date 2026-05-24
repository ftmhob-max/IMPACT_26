"use client";

import { useCallback, useEffect, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { QuestionBankPicker } from "@/components/admin/QuestionBankPicker";
import { DomainCombobox } from "@/components/admin/DomainCombobox";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnswerChoice {
  id: string;
  letter: string;
  choiceText: string;
  isCorrect: boolean;
  explanation?: string | null;
  position: number;
}

interface Question {
  id: string;
  questionText: string;
  difficulty: string;
  domain: string;
  formulaRef?: string | null;
  isMultiselect: boolean;
  position: number;
  pointValue: number;
  answerChoices_on_question: AnswerChoice[];
}

interface BankQuestion {
  id: string;
  questionText: string;
  domain: string;
  difficulty: string;
}

interface QuizInfo {
  id: string;
  title: string;
  passingScore?: number | null;
  timeLimitSeconds?: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
}

const DOMAINS = ["math", "appraisal", "law", "philly", "admin", "ethics"] as const;
const DIFFICULTIES = ["easy", "proficient", "expert"] as const;
const LETTERS = ["A", "B", "C", "D"];

type AddMode = null | "bank" | "create";

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function LessonQuizPanel({ quizId }: { quizId: string }) {
  const [quiz, setQuiz] = useState<QuizInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [addMode, setAddMode] = useState<AddMode>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/questions?quizId=${quizId}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setQuiz(data.quiz ?? null);
      setQuestions(data.questions ?? []);
    }
    setLoading(false);
  }, [quizId]);

  useEffect(() => { load(); }, [load]);

  function showNotice(type: "success" | "error", text: string) {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  }

  async function saveQuestion(q: Question, updated: Partial<Question>) {
    const res = await fetch(`/api/admin/questions/${q.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionText: updated.questionText ?? q.questionText,
        difficulty: updated.difficulty ?? q.difficulty,
        domain: updated.domain ?? q.domain,
        choices: (updated.answerChoices_on_question ?? q.answerChoices_on_question).map((c) => ({
          id: c.id,
          choiceText: c.choiceText,
          isCorrect: c.isCorrect,
          explanation: c.explanation ?? null,
        })),
      }),
    });
    if (res.ok) {
      showNotice("success", "Question saved.");
      await load();
    } else {
      showNotice("error", "Could not save question.");
    }
  }

  async function addFromBank(questionIds: string[]) {
    const res = await fetch("/api/admin/quizzes/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId, questionIds }),
    });
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      const added = Number(data.added ?? questionIds.length);
      const skipped = Number(data.skipped ?? 0);
      showNotice("success", `${added} question${added !== 1 ? "s" : ""} added${skipped ? `, ${skipped} already present` : ""}.`);
      setAddMode(null);
      await load();
    } else {
      const err = await res.json().catch(() => ({}));
      showNotice("error", err.error ?? "Could not add questions.");
    }
  }

  async function createAndAdd(payload: object) {
    const res = await fetch("/api/admin/assessments/manual-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, quizId }),
    });
    if (res.ok) {
      showNotice("success", "Question created and added to quiz.");
      setAddMode(null);
      await load();
    } else {
      const err = await res.json().catch(() => ({}));
      showNotice("error", err.error ?? "Could not create question.");
    }
  }

  const incomplete = questions.filter((q) => !q.answerChoices_on_question.some((c) => c.isCorrect));

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-slate-400">
        <Icons.Loader size={16} className="animate-spin" />
        Loading questions…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quiz summary bar */}
      {quiz && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-bold text-slate-900">{quiz.title}</p>
              <div className="flex flex-wrap gap-3 mt-1 text-[11px] text-slate-500">
                {quiz.passingScore != null && <span>{quiz.passingScore}% passing</span>}
                {quiz.timeLimitSeconds != null && <span>{Math.round(quiz.timeLimitSeconds / 60)} min limit</span>}
                {quiz.shuffleQuestions && <span>Questions shuffled</span>}
                {quiz.shuffleChoices && <span>Choices shuffled</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-slate-700">{questions.length}</span>
              <span className="text-slate-500">questions</span>
            </div>
          </div>
        </div>
      )}

      {/* Incomplete warning */}
      {incomplete.length > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
          <Icons.AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-500" />
          <span>
            <strong>{incomplete.length} question{incomplete.length !== 1 ? "s" : ""}</strong> {incomplete.length !== 1 ? "have" : "has"} no correct answer marked — fix before publishing.
          </span>
        </div>
      )}

      {/* Notice */}
      {notice && (
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${notice.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {notice.type === "success" ? <Icons.Check size={13} /> : <Icons.X size={13} />}
          {notice.text}
        </div>
      )}

      {/* Add question controls */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {questions.length} question{questions.length !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAddMode(addMode === "bank" ? null : "bank")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors",
              addMode === "bank"
                ? "bg-[#185FA5] text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            <Icons.Search size={12} />
            Add from bank
          </button>
          <button
            type="button"
            onClick={() => setAddMode(addMode === "create" ? null : "create")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors",
              addMode === "create"
                ? "bg-[#185FA5] text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            <Icons.Plus size={12} />
            Create question
          </button>
        </div>
      </div>

      {/* Add from bank panel */}
      {addMode === "bank" && (
        <QuestionBankPicker quizId={quizId} onAdd={addFromBank} onClose={() => setAddMode(null)} />
      )}

      {/* Create new question panel */}
      {addMode === "create" && (
        <CreateQuestionPanel
          onSave={createAndAdd}
          onClose={() => setAddMode(null)}
        />
      )}

      {/* Empty state */}
      {questions.length === 0 && addMode === null && (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
          <Icons.ClipboardList size={32} className="mx-auto text-slate-200 mb-2" />
          <p className="text-sm font-semibold text-slate-600">No questions in this quiz yet</p>
          <p className="text-xs text-slate-400 mt-1">Add from the question bank or create a new one above.</p>
        </div>
      )}

      {/* Question list */}
      <div className="space-y-2">
        {questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={idx}
            onSave={(updated) => saveQuestion(q, updated)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Add from Bank Panel ──────────────────────────────────────────────────────

function AddFromBankPanel({
  quizId,
  existingIds,
  onAdd,
  onClose,
}: {
  quizId: string;
  existingIds: Set<string>;
  onAdd: (ids: string[]) => Promise<void>;
  onClose: () => void;
}) {
  const [bank, setBank] = useState<BankQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/questions", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setBank(d.questions ?? []))
      .finally(() => setLoading(false));
  }, []);

  const available = bank.filter((q) => {
    if (existingIds.has(q.id)) return false;
    if (search && !q.questionText.toLowerCase().includes(search.toLowerCase())) return false;
    if (domain && q.domain !== domain) return false;
    if (difficulty && q.difficulty !== difficulty) return false;
    return true;
  });

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === available.length && available.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(available.map((q) => q.id)));
    }
  }

  async function handleAdd() {
    if (!selected.size) return;
    setBusy(true);
    await onAdd([...selected]);
    setBusy(false);
  }

  const allSelected = available.length > 0 && selected.size === available.length;

  return (
    <div className="rounded-xl border border-[#185FA5]/20 bg-[#E6F1FB]/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 bg-white">
        <div className="flex items-center gap-2">
          <Icons.Search size={14} className="text-[#185FA5]" />
          <span className="text-sm font-bold text-slate-900">Add from question bank</span>
          <span className="text-xs text-slate-400">{available.length} available</span>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
          <Icons.X size={15} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
        <input
          type="search"
          placeholder="Search questions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input w-full text-xs sm:min-w-40 sm:flex-1"
          autoFocus
        />
        <DomainCombobox value={domain} onChange={setDomain} allowClear clearLabel="All domains" className="w-36 text-xs" />
        <select className="admin-input w-32 text-xs" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">All levels</option>
          {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Question list */}
      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 bg-white">
        {loading ? (
          <div className="flex items-center gap-2 px-4 py-6 text-sm text-slate-400">
            <Icons.Loader size={14} className="animate-spin" />
            Loading bank…
          </div>
        ) : available.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-slate-400">
            {search || domain || difficulty ? "No questions match your filters." : "All bank questions are already in this quiz."}
          </p>
        ) : (
          <>
            {/* Select all row */}
            <label className="flex items-center gap-3 px-4 py-2 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="h-4 w-4 rounded border-slate-300 text-[#185FA5]"
              />
              <span className="text-xs font-semibold text-slate-500">Select all ({available.length})</span>
            </label>
            {available.map((q) => (
              <label key={q.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.has(q.id)}
                  onChange={() => toggle(q.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-[#185FA5]"
                />
                <span className="flex-1 text-xs text-slate-800 leading-relaxed">{q.questionText}</span>
                <div className="shrink-0 flex gap-1.5">
                  <DomainBadge domain={q.domain} />
                  <DifficultyBadge difficulty={q.difficulty} />
                </div>
              </label>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 bg-slate-50">
        <span className="text-xs text-slate-500">
          {selected.size > 0 ? `${selected.size} selected` : "Select questions to add"}
        </span>
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="admin-action secondary text-xs">Cancel</button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={busy || selected.size === 0}
            className="admin-action text-xs flex items-center gap-1.5"
          >
            {busy ? <Icons.Loader size={12} className="animate-spin" /> : <Icons.Plus size={12} />}
            Add {selected.size > 0 ? selected.size : ""} question{selected.size !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Question Panel ────────────────────────────────────────────────────

const DEFAULT_CHOICES = LETTERS.map((letter) => ({
  letter,
  choiceText: "",
  isCorrect: false,
  explanation: "",
}));

function CreateQuestionPanel({
  onSave,
  onClose,
}: {
  onSave: (payload: object) => Promise<void>;
  onClose: () => void;
}) {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [difficulty, setDifficulty] = useState<string>("proficient");
  const [domain, setDomain] = useState<string>("appraisal");
  const [rationale, setRationale] = useState("");
  const [sourceRef, setSourceRef] = useState("");
  const [choices, setChoices] = useState(DEFAULT_CHOICES.map((c) => ({ ...c })));
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const isMultiselect = questionType === "multiselect";

  function updateChoice(idx: number, field: string, value: any) {
    setChoices((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  }

  function toggleCorrect(idx: number) {
    setChoices((prev) =>
      prev.map((c, i) => ({
        ...c,
        isCorrect: isMultiselect ? (i === idx ? !c.isCorrect : c.isCorrect) : i === idx,
      }))
    );
  }

  function validate(): string[] {
    const errs: string[] = [];
    if (questionText.trim().length < 5) errs.push("Question text must be at least 5 characters.");
    const filled = choices.filter((c) => c.choiceText.trim());
    if (filled.length < 2) errs.push("Add at least 2 answer choices.");
    if (!choices.some((c) => c.isCorrect && c.choiceText.trim())) errs.push("Mark at least one correct answer.");
    return errs;
  }

  async function handleSave() {
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);
    setBusy(true);
    await onSave({
      questionText: questionText.trim(),
      questionType,
      difficulty,
      domain,
      rationale: rationale.trim() || null,
      sourceRef: sourceRef.trim() || null,
      topicTags: [],
      status: "draft",
      pointValue: 1,
      choices: choices
        .filter((c) => c.choiceText.trim())
        .map((c) => ({
          letter: c.letter,
          choiceText: c.choiceText.trim(),
          isCorrect: c.isCorrect,
          explanation: c.explanation.trim() || null,
        })),
    });
    setBusy(false);
  }

  return (
    <div className="rounded-xl border border-[#185FA5]/20 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <Icons.Plus size={14} className="text-[#185FA5]" />
          <span className="text-sm font-bold text-slate-900">Create new question</span>
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">saves as draft + adds to quiz</span>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
          <Icons.X size={15} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Errors */}
        {errors.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 space-y-1">
            {errors.map((e) => (
              <p key={e} className="text-xs text-red-700 flex items-center gap-1.5">
                <Icons.X size={11} className="shrink-0" />
                {e}
              </p>
            ))}
          </div>
        )}

        {/* Question text */}
        <div>
          <label className="admin-label">Question text <span className="text-red-400">*</span></label>
          <textarea
            className="admin-input min-h-20 text-sm leading-relaxed"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Type the question here…"
            autoFocus
          />
        </div>

        {/* Metadata row */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="admin-label">Type</label>
            <select className="admin-input text-xs" value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
              <option value="multiple_choice">Multiple choice</option>
              <option value="multiselect">Multiselect</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Difficulty</label>
            <select className="admin-input text-xs" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="admin-label">Domain</label>
            <DomainCombobox value={domain} onChange={setDomain} className="text-xs" />
          </div>
        </div>

        {/* Answer choices */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="admin-label mb-0">
              Answer choices <span className="text-red-400">*</span>
              {isMultiselect && <span className="text-slate-400 font-normal ml-1">(select all that apply)</span>}
            </label>
            <span className="text-[10px] text-slate-400">Click circle to mark correct</span>
          </div>
          <div className="space-y-2">
            {choices.map((c, idx) => (
              <div key={c.letter} className={cn(
                "flex items-start gap-2 rounded-lg border px-3 py-2.5 transition-colors",
                c.isCorrect && c.choiceText ? "border-emerald-200 bg-emerald-50" : "border-slate-100 bg-slate-50"
              )}>
                {/* Correct toggle */}
                <button
                  type="button"
                  onClick={() => toggleCorrect(idx)}
                  className={cn(
                    "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    c.isCorrect ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 hover:border-emerald-400"
                  )}
                  title={c.isCorrect ? "Correct answer" : "Mark as correct"}
                >
                  {c.isCorrect && <Icons.Check size={10} />}
                </button>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={cn("shrink-0 text-xs font-bold", c.isCorrect ? "text-emerald-600" : "text-slate-400")}>
                      {c.letter}.
                    </span>
                    <input
                      className="admin-input flex-1 text-xs"
                      value={c.choiceText}
                      onChange={(e) => updateChoice(idx, "choiceText", e.target.value)}
                      placeholder={`Choice ${c.letter}…`}
                    />
                  </div>
                  {c.choiceText && (
                    <input
                      className="admin-input text-xs text-slate-500"
                      value={c.explanation}
                      onChange={(e) => updateChoice(idx, "explanation", e.target.value)}
                      placeholder="Explanation shown after answering (optional)…"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supporting info (collapsed by default, shown only if expanded) */}
        <SupportingInfoSection
          rationale={rationale}
          onRationaleChange={setRationale}
          sourceRef={sourceRef}
          onSourceRefChange={setSourceRef}
        />

        {/* Actions */}
        <div className="flex gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={handleSave}
            disabled={busy}
            className="admin-action flex items-center gap-1.5"
          >
            {busy ? <Icons.Loader size={13} className="animate-spin" /> : <Icons.Plus size={13} />}
            Create &amp; add to quiz
          </button>
          <button type="button" onClick={onClose} className="admin-action secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SupportingInfoSection({
  rationale,
  onRationaleChange,
  sourceRef,
  onSourceRefChange,
}: {
  rationale: string;
  onRationaleChange: (v: string) => void;
  sourceRef: string;
  onSourceRefChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors"
      >
        {open ? <Icons.ChevronUp size={12} /> : <Icons.ChevronDown size={12} />}
        Supporting info (rationale, source reference)
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          <div>
            <label className="admin-label">Rationale</label>
            <textarea
              className="admin-input min-h-14 text-xs"
              value={rationale}
              onChange={(e) => onRationaleChange(e.target.value)}
              placeholder="Why this is the correct answer…"
            />
          </div>
          <div>
            <label className="admin-label">Source reference</label>
            <input
              className="admin-input text-xs"
              value={sourceRef}
              onChange={(e) => onSourceRefChange(e.target.value)}
              placeholder="e.g. USPAP 2024 Standard 6"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Question Card ────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  index,
  onSave,
}: {
  question: Question;
  index: number;
  onSave: (updated: Partial<Question>) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Question>({ ...question });

  useEffect(() => { setDraft({ ...question }); setEditing(false); }, [question]);

  const hasCorrect = draft.answerChoices_on_question.some((c) => c.isCorrect);
  const sortedChoices = [...draft.answerChoices_on_question].sort((a, b) => a.position - b.position);

  async function handleSave() {
    setBusy(true);
    await onSave(draft);
    setBusy(false);
    setEditing(false);
  }

  function updateChoice(id: string, field: keyof AnswerChoice, value: any) {
    setDraft((prev) => ({
      ...prev,
      answerChoices_on_question: prev.answerChoices_on_question.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }));
  }

  function toggleCorrect(id: string) {
    setDraft((prev) => ({
      ...prev,
      answerChoices_on_question: prev.answerChoices_on_question.map((c) => ({
        ...c,
        isCorrect: draft.isMultiselect ? (c.id === id ? !c.isCorrect : c.isCorrect) : c.id === id,
      })),
    }));
  }

  function moveChoice(idx: number, dir: -1 | 1) {
    const sorted = [...draft.answerChoices_on_question].sort((a, b) => a.position - b.position);
    const target = idx + dir;
    if (target < 0 || target >= sorted.length) return;
    const next = [...sorted];
    const { choiceText: ta, isCorrect: ca, explanation: ea } = next[idx];
    const { choiceText: tb, isCorrect: cb, explanation: eb } = next[target];
    next[idx] = { ...next[idx], choiceText: tb, isCorrect: cb, explanation: eb };
    next[target] = { ...next[target], choiceText: ta, isCorrect: ca, explanation: ea };
    setDraft((prev) => ({ ...prev, answerChoices_on_question: next }));
  }

  return (
    <div className={cn("rounded-xl border bg-white shadow-sm overflow-hidden", !hasCorrect && "border-amber-200")}>
      <div
        className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => { setExpanded((v) => !v); if (expanded) setEditing(false); }}
      >
        <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-800 leading-snug line-clamp-2">{question.questionText}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            <DomainBadge domain={question.domain} />
            <DifficultyBadge difficulty={question.difficulty} />
            {!hasCorrect && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">⚠ No correct answer</span>}
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1">
          {expanded && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setEditing((v) => !v); }}
              className={cn("rounded p-1 transition-colors", editing ? "bg-[#185FA5] text-white" : "text-slate-400 hover:text-slate-700")}
            >
              <Icons.Pencil size={12} />
            </button>
          )}
          {expanded ? <Icons.ChevronUp size={14} className="text-slate-400" /> : <Icons.ChevronDown size={14} className="text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-4 py-3 space-y-3">
          {editing ? (
            <>
              <div>
                <label className="admin-label">Question text</label>
                <textarea className="admin-input min-h-20 text-sm leading-relaxed" value={draft.questionText} onChange={(e) => setDraft((p) => ({ ...p, questionText: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="admin-label">Difficulty</label>
                  <select className="admin-input" value={draft.difficulty} onChange={(e) => setDraft((p) => ({ ...p, difficulty: e.target.value }))}>
                    {DIFFICULTIES.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Domain</label>
                  <DomainCombobox value={draft.domain} onChange={(val) => setDraft((p) => ({ ...p, domain: val }))} />
                </div>
              </div>
              <div>
                <label className="admin-label">
                  Answer choices <span className="text-slate-400 font-normal">({draft.isMultiselect ? "select all that apply" : "single correct"})</span>
                </label>
                <div className="space-y-2">
                  {sortedChoices.map((choice, cidx) => (
                    <div key={choice.id} className="grid grid-cols-[20px_24px_1fr_auto] items-start gap-2">
                      <div className="flex flex-col gap-0.5 mt-1">
                        <button type="button" onClick={() => moveChoice(cidx, -1)} disabled={cidx === 0} className="flex h-4 w-4 items-center justify-center rounded text-slate-300 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-20"><Icons.ChevronUp size={10} /></button>
                        <button type="button" onClick={() => moveChoice(cidx, 1)} disabled={cidx === sortedChoices.length - 1} className="flex h-4 w-4 items-center justify-center rounded text-slate-300 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-20"><Icons.ChevronDown size={10} /></button>
                      </div>
                      <button type="button" onClick={() => toggleCorrect(choice.id)} className={cn("mt-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors shrink-0", choice.isCorrect ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 hover:border-slate-400")}>
                        {choice.isCorrect && <Icons.Check size={10} />}
                      </button>
                      <div className="space-y-1">
                        <input className="admin-input text-xs" value={choice.choiceText} onChange={(e) => updateChoice(choice.id, "choiceText", e.target.value)} placeholder={`Choice ${choice.letter}`} />
                        <input className="admin-input text-xs text-slate-500" value={choice.explanation ?? ""} onChange={(e) => updateChoice(choice.id, "explanation", e.target.value || null)} placeholder="Explanation…" />
                      </div>
                      <span className="mt-1.5 text-xs font-bold text-slate-400">{choice.letter}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={handleSave} disabled={busy} className="admin-action flex items-center gap-1.5 text-xs">
                  {busy ? <Icons.Loader size={12} className="animate-spin" /> : <Icons.Check size={12} />}
                  Save question
                </button>
                <button type="button" onClick={() => { setEditing(false); setDraft({ ...question }); }} className="admin-action secondary text-xs">Cancel</button>
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              {sortedChoices.map((choice) => (
                <div key={choice.id} className={cn("flex items-start gap-2.5 rounded-lg px-3 py-2 text-sm", choice.isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50 border border-slate-100")}>
                  <span className={cn("shrink-0 font-bold text-xs mt-0.5", choice.isCorrect ? "text-emerald-600" : "text-slate-400")}>{choice.letter}</span>
                  <div className="min-w-0">
                    <p className={cn("text-xs", choice.isCorrect ? "text-emerald-800 font-semibold" : "text-slate-700")}>{choice.choiceText}</p>
                    {choice.isCorrect && choice.explanation && <p className="text-[11px] text-emerald-600 mt-0.5 italic">{choice.explanation}</p>}
                  </div>
                  {choice.isCorrect && <Icons.Check size={13} className="shrink-0 mt-0.5 text-emerald-500 ml-auto" />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Shared badge helpers ─────────────────────────────────────────────────────

function DomainBadge({ domain }: { domain: string }) {
  const map: Record<string, string> = {
    math: "bg-blue-50 text-blue-700",
    appraisal: "bg-purple-50 text-purple-700",
    law: "bg-amber-50 text-amber-700",
    philly: "bg-emerald-50 text-emerald-700",
    admin: "bg-slate-100 text-slate-600",
    ethics: "bg-rose-50 text-rose-700",
  };
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", map[domain] ?? "bg-slate-100 text-slate-500")}>{domain}</span>;
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const map: Record<string, string> = {
    easy: "bg-green-50 text-green-700",
    proficient: "bg-yellow-50 text-yellow-700",
    expert: "bg-red-50 text-red-700",
  };
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", map[difficulty] ?? "bg-slate-100 text-slate-500")}>{difficulty}</span>;
}
