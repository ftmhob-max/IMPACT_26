"use client";

import { type DragEvent, type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { adminFetch } from "@/lib/admin/client-fetch";
import { cn } from "@/lib/utils";
import { DomainCombobox } from "@/components/admin/DomainCombobox";
import { QuestionBankPicker } from "@/components/admin/QuestionBankPicker";
import { CalculatorAccessSettings } from "@/components/admin/CalculatorAccessSettings";
import { QuizQuickImportPanel } from "@/components/admin/QuizQuickImportPanel";
import { AttachQuizModal } from "@/components/admin/AttachQuizModal";
import {
  getQuizReadiness,
  type QuizDashboardSummary,
  type QuizDashboardTotals,
} from "@/lib/admin/quiz-dashboard";

// ─── Choice ordering utilities ────────────────────────────────────────────────

type ChoiceContent = { choiceText: string; isCorrect: boolean; explanation?: string | null };

function swapChoiceContent<T extends ChoiceContent>(arr: T[], i: number, j: number): T[] {
  const next = [...arr];
  const { choiceText: ta, isCorrect: ca, explanation: ea } = next[i];
  const { choiceText: tb, isCorrect: cb, explanation: eb } = next[j];
  next[i] = { ...next[i], choiceText: tb, isCorrect: cb, explanation: eb };
  next[j] = { ...next[j], choiceText: ta, isCorrect: ca, explanation: ea };
  return next;
}

function shuffleChoiceContent<T extends ChoiceContent>(arr: T[]): T[] {
  const content: ChoiceContent[] = arr.map(({ choiceText, isCorrect, explanation }) => ({ choiceText, isCorrect, explanation }));
  for (let i = content.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [content[i], content[j]] = [content[j], content[i]];
  }
  return arr.map((c, idx) => ({ ...c, ...content[idx] }));
}

function reorderChoiceContent<T extends ChoiceContent>(arr: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= arr.length ||
    toIndex >= arr.length
  ) {
    return arr;
  }

  const content = arr.map(({ choiceText, isCorrect, explanation }) => ({
    choiceText,
    isCorrect,
    explanation,
  }));
  const [moved] = content.splice(fromIndex, 1);
  content.splice(toIndex, 0, moved);

  return arr.map((choice, idx) => ({ ...choice, ...content[idx] }));
}

async function saveChoices(questionId: string, choices: Array<{ id: string; choiceText: string; isCorrect: boolean; explanation?: string | null }>): Promise<boolean> {
  const res = await fetch(`/api/admin/questions/${questionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ choices: choices.map((c) => ({ id: c.id, choiceText: c.choiceText, isCorrect: c.isCorrect, explanation: c.explanation ?? null })) }),
  });
  return res.ok;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Quiz = QuizDashboardSummary;

interface AnswerChoice {
  id: string;
  letter: string;
  choiceText: string;
  isCorrect: boolean;
  explanation?: string | null;
  position: number;
}

interface QuizQuestion {
  id: string;
  questionText: string;
  difficulty: string;
  domain: string;
  isMultiselect: boolean;
  position: number;
  pointValue: number;
  answerChoices_on_question: AnswerChoice[];
}

interface NewQuizForm {
  title: string;
  description: string;
  passingScore: number;
  timeLimitMinutes: string;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  status: string;
}

const DEFAULT_FORM: NewQuizForm = {
  title: "",
  description: "",
  passingScore: 70,
  timeLimitMinutes: "",
  shuffleQuestions: true,
  shuffleChoices: false,
  status: "draft",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function QuizManagementPanel({
  initialQuizzes = [],
  initialTotals,
}: {
  initialQuizzes?: Quiz[];
  initialTotals?: QuizDashboardTotals;
}) {
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [quizTotals, setQuizTotals] = useState<QuizDashboardTotals>(
    initialTotals ?? {
      total: initialQuizzes.length,
      draft: initialQuizzes.filter((quiz) => quiz.status === "draft").length,
      review: initialQuizzes.filter((quiz) => quiz.status === "review").length,
      published: initialQuizzes.filter((quiz) => quiz.status === "published").length,
      ready: initialQuizzes.filter((quiz) => quiz.readiness === "ready").length,
      attention: initialQuizzes.filter((quiz) => quiz.readiness === "attention").length,
      empty: initialQuizzes.filter((quiz) => quiz.readiness === "empty").length,
    }
  );
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<NewQuizForm>(DEFAULT_FORM);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showQuickImport, setShowQuickImport] = useState(false);
  const [attachTarget, setAttachTarget] = useState<{ id: string; title: string } | null>(null);
  const [summaryFilter, setSummaryFilter] = useState<
    "all" | "published" | "review" | "draft" | "ready" | "attention"
  >("all");
  const filteredQuizzes = useMemo(() => {
    if (summaryFilter === "all") return quizzes;
    if (summaryFilter === "published") return quizzes.filter((quiz) => quiz.status === "published");
    if (summaryFilter === "review") return quizzes.filter((quiz) => quiz.status === "review");
    if (summaryFilter === "draft") return quizzes.filter((quiz) => quiz.status === "draft");
    if (summaryFilter === "ready") return quizzes.filter((quiz) => quiz.readiness === "ready");
    return quizzes.filter((quiz) => quiz.readiness === "attention" || quiz.readiness === "empty");
  }, [quizzes, summaryFilter]);
  const selectedQuiz = useMemo(
    () => quizzes.find((quiz) => quiz.id === selectedQuizId) ?? null,
    [quizzes, selectedQuizId]
  );

  async function load() {
    setLoading(true);
    const quizRes = await adminFetch("/api/admin/overview", { cache: "no-store" });
    if (quizRes.ok) {
      const data = await quizRes.json();
      setQuizzes(data.quizzes ?? []);
      setQuizTotals(data.quizTotals ?? initialTotals ?? quizTotals);
    } else if (!quizzes.length) {
      showNotice("error", "Unable to load quizzes from the admin API.");
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(false);
    void load();
  }, []);

  function showNotice(type: "success" | "error", text: string) {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  }

  async function createQuiz() {
    if (!form.title.trim()) return;
    setBusy(true);
    const timeLimitSeconds = form.timeLimitMinutes ? parseInt(form.timeLimitMinutes) * 60 : null;
    const res = await fetch("/api/admin/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description || null,
        passingScore: form.passingScore,
        timeLimitSeconds,
        shuffleQuestions: form.shuffleQuestions,
        shuffleChoices: form.shuffleChoices,
        status: form.status,
      }),
    });
    setBusy(false);
    if (res.ok) {
      setForm(DEFAULT_FORM);
      setShowCreate(false);
      showNotice("success", "Quiz created.");
      await load();
    } else {
      const err = await res.json().catch(() => ({}));
      showNotice("error", err.error ?? "Could not create quiz.");
    }
  }

  async function publishQuiz(quizId: string, publish: boolean) {
    const res = await fetch("/api/admin/quizzes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId, status: publish ? "published" : "draft" }),
    });
    if (res.ok) {
      showNotice("success", publish ? "Quiz published." : "Quiz moved to draft.");
      await load();
    } else {
      const err = await res.json().catch(() => ({}));
      showNotice("error", err.error ?? "Could not update quiz status.");
    }
  }

  async function deleteQuiz(quiz: Quiz) {
    if (!window.confirm(`Delete quiz "${quiz.title}"? This cannot be undone.`)) return;
    const res = await fetch("/api/admin/quizzes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId: quiz.id }),
    });
    if (res.ok) {
      showNotice("success", "Quiz deleted.");
      if (selectedQuizId === quiz.id) setSelectedQuizId(null);
      await load();
    } else {
      const err = await res.json().catch(() => ({}));
      showNotice("error", err.error ?? "Could not delete quiz.");
    }
  }

  function setField<K extends keyof NewQuizForm>(key: K, value: NewQuizForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <SummaryCard label="Total quizzes" value={String(quizTotals.total)} tone="blue" icon={<Icons.ClipboardList size={14} />} active={summaryFilter === "all"} onClick={() => setSummaryFilter("all")} />
        <SummaryCard label="Published" value={String(quizTotals.published)} tone="emerald" active={summaryFilter === "published"} onClick={() => setSummaryFilter(summaryFilter === "published" ? "all" : "published")} />
        <SummaryCard label="In review" value={String(quizTotals.review)} tone="amber" active={summaryFilter === "review"} onClick={() => setSummaryFilter(summaryFilter === "review" ? "all" : "review")} />
        <SummaryCard label="Drafts" value={String(quizTotals.draft)} tone="slate" active={summaryFilter === "draft"} onClick={() => setSummaryFilter(summaryFilter === "draft" ? "all" : "draft")} />
        <SummaryCard label="Ready to run" value={String(quizTotals.ready)} tone="emerald" active={summaryFilter === "ready"} onClick={() => setSummaryFilter(summaryFilter === "ready" ? "all" : "ready")} />
        <SummaryCard label="Need attention" value={String(quizTotals.attention + quizTotals.empty)} tone="amber" active={summaryFilter === "attention"} onClick={() => setSummaryFilter(summaryFilter === "attention" ? "all" : "attention")} />
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
      {/* Left: quiz list */}
      <div className={cn("min-w-0 space-y-5", selectedQuiz ? "w-full lg:w-80 lg:shrink-0" : "w-full")}>
        {notice && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${notice.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {notice.type === "success" ? <Icons.Check size={16} /> : <Icons.X size={16} />}
            {notice.text}
          </div>
        )}

        <div className="rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <Icons.LayoutDashboard size={18} className="text-[#185FA5]" />
              <h2 className="text-sm font-bold text-slate-900">Quizzes</h2>
              <span className="text-xs text-slate-400">({filteredQuizzes.length})</span>
            </div>
            {summaryFilter !== "all" && (
              <button type="button" onClick={() => setSummaryFilter("all")} className="text-xs font-semibold text-[#185FA5] hover:underline">
                Clear filter
              </button>
            )}
            <button
              type="button"
              onClick={() => { setShowQuickImport((v) => !v); setShowCreate(false); }}
              className="admin-action secondary flex items-center gap-1.5 text-xs"
            >
              <Icons.Upload size={13} />
              Quick import
            </button>
            <button type="button" onClick={() => { setShowCreate((v) => !v); setShowQuickImport(false); }} className="admin-action secondary flex items-center gap-1.5 text-xs">
              <Icons.Plus size={13} />
              New quiz
            </button>
          </div>

          {/* Quick import panel */}
          {showQuickImport && (
            <div className="border-b border-slate-100 p-4">
              <QuizQuickImportPanel
                onImported={async (msg, importedQuizId, importedQuizTitle) => {
                  showNotice("success", msg);
                  setShowQuickImport(false);
                  await load();
                  if (importedQuizId && importedQuizTitle) {
                    setAttachTarget({ id: importedQuizId, title: importedQuizTitle });
                  }
                }}
                onCancel={() => setShowQuickImport(false)}
              />
            </div>
          )}

          {/* Create form */}
          {showCreate && (
            <div className="border-b border-slate-100 bg-slate-50 p-4 space-y-3">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-[0.08em]">New quiz</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <input className="admin-input" value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="Quiz title" />
                <input className="admin-input" value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Description (optional)" />
              </div>
              <div className="grid gap-2 sm:grid-cols-4">
                <div className="flex items-center gap-1.5">
                  <input type="number" className="admin-input w-16" value={form.passingScore} min={0} max={100} onChange={(e) => setField("passingScore", Number(e.target.value))} />
                  <span className="text-xs text-slate-500">% pass</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input type="number" className="admin-input w-16" value={form.timeLimitMinutes} min={1} onChange={(e) => setField("timeLimitMinutes", e.target.value)} placeholder="—" />
                  <span className="text-xs text-slate-500">min</span>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-slate-600">
                  <input type="checkbox" checked={form.shuffleQuestions} onChange={(e) => setField("shuffleQuestions", e.target.checked)} />
                  Shuffle Q
                </label>
                <select className="admin-input text-xs" value={form.status} onChange={(e) => setField("status", e.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="button" className="admin-action" onClick={createQuiz} disabled={busy || !form.title.trim()}>
                  {busy ? <Icons.Loader size={13} className="animate-spin" /> : <Icons.Check size={13} />}
                  Create quiz
                </button>
                <button type="button" className="admin-action secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="divide-y divide-slate-100">
            {loading ? (
              <p className="px-4 py-6 text-center text-sm text-slate-400">Loading…</p>
            ) : filteredQuizzes.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Icons.ClipboardList size={32} className="mx-auto text-slate-200 mb-2" />
                <p className="text-sm text-slate-400">No quizzes match the selected summary filter.</p>
              </div>
            ) : (
              filteredQuizzes.map((quiz) => (
                <QuizListRow
                  key={quiz.id}
                  quiz={quiz}
                  selected={selectedQuizId === quiz.id}
                  compact={!!selectedQuiz}
                  onSelect={() => setSelectedQuizId(selectedQuizId === quiz.id ? null : quiz.id)}
                  onPublish={(pub) => publishQuiz(quiz.id, pub)}
                  onDelete={() => deleteQuiz(quiz)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right: quiz detail */}
      {selectedQuiz && (
        <QuizDetailPanel
          quiz={selectedQuiz}
          onClose={() => setSelectedQuizId(null)}
          onPublish={(pub) => publishQuiz(selectedQuiz.id, pub)}
          onDelete={() => deleteQuiz(selectedQuiz)}
          onAttach={() => setAttachTarget({ id: selectedQuiz.id, title: selectedQuiz.title })}
          onQuestionsChanged={load}
          showNotice={showNotice}
        />
      )}

      {attachTarget && (
        <AttachQuizModal
          quizId={attachTarget.id}
          quizTitle={attachTarget.title}
          onClose={() => setAttachTarget(null)}
          onAttached={(msg) => {
            setAttachTarget(null);
            showNotice("success", msg);
          }}
        />
      )}
    </div>
    </div>
  );
}

// ─── Quiz List Row ────────────────────────────────────────────────────────────

function QuizListRow({
  quiz,
  selected,
  compact,
  onSelect,
  onPublish,
  onDelete,
}: {
  quiz: Quiz;
  selected: boolean;
  compact: boolean;
  onSelect: () => void;
  onPublish: (pub: boolean) => void;
  onDelete: () => void;
}) {
  const isPublished = quiz.status === "published";
  return (
    <div
      className={cn(
        "cursor-pointer px-4 py-3 transition-colors",
        selected ? "bg-[#E6F1FB]" : "hover:bg-slate-50"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={cn("text-sm font-semibold truncate", selected ? "text-[#185FA5]" : "text-slate-800")}>{quiz.title}</p>
            <StatusBadge status={quiz.status} />
            <ReadinessBadge readiness={quiz.readiness} incompleteQuestionCount={quiz.incompleteQuestionCount} />
          </div>
          {!compact && quiz.description && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">{quiz.description}</p>
          )}
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Coverage</p>
              <p className="mt-1 text-xs font-semibold text-slate-700">
                {quiz.questionCount} question{quiz.questionCount !== 1 ? "s" : ""}
              </p>
              <p className="text-[11px] text-slate-500">
                {quiz.incompleteQuestionCount > 0
                  ? `${quiz.incompleteQuestionCount} incomplete`
                  : `${quiz.readyQuestionCount} ready`}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rules</p>
              <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-slate-500">
                {quiz.passingScore != null && <span>{quiz.passingScore}% pass</span>}
                <span>{quiz.timeLimitSeconds != null ? `${Math.floor(quiz.timeLimitSeconds / 60)} min` : "Untimed"}</span>
                <span>{quiz.shuffleQuestions ? "Shuffle questions" : "Fixed order"}</span>
              </div>
            </div>
          </div>
        </div>
        {!compact && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onPublish(!isPublished); }}
              className={`admin-action text-xs py-1 flex items-center gap-1 ${isPublished ? "secondary" : ""}`}
            >
              {isPublished ? <Icons.EyeOff size={12} /> : <Icons.Eye size={12} />}
              {isPublished ? "Unpublish" : "Publish"}
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
              title="Delete quiz"
            >
              <Icons.Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Quiz Detail Panel ────────────────────────────────────────────────────────

function QuizDetailPanel({
  quiz,
  onClose,
  onPublish,
  onDelete,
  onAttach,
  onQuestionsChanged,
  showNotice,
}: {
  quiz: Quiz;
  onClose: () => void;
  onPublish: (pub: boolean) => void;
  onDelete: () => void;
  onAttach: () => void;
  onQuestionsChanged: () => void;
  showNotice: (type: "success" | "error", text: string) => void;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [shufflingAll, setShufflingAll] = useState(false);
  // Local copies of mutable quiz settings
  const [settingsShuffle, setSettingsShuffle] = useState(quiz.shuffleQuestions);
  const [settingsChoiceShuffle, setSettingsChoiceShuffle] = useState(quiz.shuffleChoices ?? false);
  const [settingsPassScore, setSettingsPassScore] = useState(String(quiz.passingScore ?? 70));
  const [settingsTimeLimit, setSettingsTimeLimit] = useState(quiz.timeLimitSeconds ? String(Math.round(quiz.timeLimitSeconds / 60)) : "");
  const [settingsBusy, setSettingsBusy] = useState(false);

  useEffect(() => {
    setSettingsShuffle(quiz.shuffleQuestions);
    setSettingsChoiceShuffle(quiz.shuffleChoices ?? false);
    setSettingsPassScore(String(quiz.passingScore ?? 70));
    setSettingsTimeLimit(quiz.timeLimitSeconds ? String(Math.round(quiz.timeLimitSeconds / 60)) : "");
  }, [quiz]);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/questions?quizId=${quiz.id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setQuestions(data.questions ?? []);
    }
    setLoading(false);
  }, [quiz.id]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  async function addQuestionsFromPicker(questionIds: string[]) {
    if (questionIds.length === 0) return;
    const res = await fetch("/api/admin/quizzes/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId: quiz.id, questionIds }),
    });
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      const added = Number(data.added ?? questionIds.length);
      const skipped = Number(data.skipped ?? 0);
      showNotice("success", `${added} added${skipped ? `, ${skipped} already present` : ""}.`);
      setShowAddPanel(false);
      await loadQuestions();
      onQuestionsChanged();
    } else {
      const err = await res.json().catch(() => ({}));
      showNotice("error", err.error ?? "Could not add questions.");
    }
  }

  async function saveQuestion(q: QuizQuestion, updated: Partial<QuizQuestion>) {
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
      await loadQuestions();
    } else {
      showNotice("error", "Could not save question.");
    }
  }

  async function saveSettings() {
    setSettingsBusy(true);
    const res = await fetch("/api/admin/quizzes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizId: quiz.id,
        shuffleQuestions: settingsShuffle,
        shuffleChoices: settingsChoiceShuffle,
        passingScore: parseFloat(settingsPassScore) || quiz.passingScore,
        timeLimitSeconds: settingsTimeLimit ? parseInt(settingsTimeLimit) * 60 : null,
      }),
    });
    setSettingsBusy(false);
    if (res.ok) {
      showNotice("success", "Quiz settings saved.");
      setShowSettings(false);
      onQuestionsChanged();
    } else {
      showNotice("error", "Could not save quiz settings.");
    }
  }

  async function shuffleAllChoices() {
    if (!questions.length) return;
    setShufflingAll(true);
    let ok = 0;
    let fail = 0;
    for (const q of questions) {
      if (q.answerChoices_on_question.length < 2) { ok++; continue; }
      const sorted = [...q.answerChoices_on_question].sort((a, b) => a.position - b.position);
      const shuffled = shuffleChoiceContent(sorted);
      const saved = await saveChoices(q.id, shuffled);
      saved ? ok++ : fail++;
    }
    setShufflingAll(false);
    showNotice(
      fail === 0 ? "success" : "error",
      fail === 0
        ? `Shuffled answer choices for all ${ok} question${ok !== 1 ? "s" : ""}.`
        : `${ok} shuffled, ${fail} failed.`
    );
    await loadQuestions();
  }

  const isPublished = quiz.status === "published";
  const incomplete = questions.filter((q) => !q.answerChoices_on_question.some((c) => c.isCorrect));
  const readiness = getQuizReadiness(questions.length, incomplete.length);
  const readinessText =
    readiness === "ready"
      ? "Ready to publish"
      : readiness === "empty"
        ? "Needs questions"
        : "Needs answer key fixes";

  return (
    <div className="flex-1 min-w-0 rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden self-start">
      {/* Header */}
      <div className="flex flex-wrap items-start gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5">
        <Icons.ClipboardList size={16} className="text-[#185FA5] shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">{quiz.title}</p>
          <div className="flex flex-wrap gap-3 mt-0.5 text-[10px] text-slate-400">
            <StatusBadge status={quiz.status} />
            <ReadinessBadge readiness={readiness} incompleteQuestionCount={incomplete.length} />
            {quiz.passingScore != null && <span>{quiz.passingScore}% passing</span>}
            {quiz.timeLimitSeconds != null && <span>{Math.floor(quiz.timeLimitSeconds / 60)} min</span>}
            <span>{quiz.shuffleQuestions ? "Question shuffle on" : "Fixed question order"}</span>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:shrink-0">
          <button
            type="button"
            onClick={onAttach}
            className="admin-action secondary text-xs py-1 flex items-center gap-1"
            title="Attach quiz to a lesson"
          >
            <Icons.Link size={12} />
            Attach to lesson
          </button>
          <button
            type="button"
            onClick={() => onPublish(!isPublished)}
            className={cn("admin-action text-xs py-1 flex items-center gap-1", isPublished && "secondary")}
          >
            {isPublished ? <Icons.EyeOff size={12} /> : <Icons.Eye size={12} />}
            {isPublished ? "Unpublish" : "Publish"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
            title="Delete quiz"
          >
            <Icons.Trash2 size={12} />
          </button>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded">
            <Icons.X size={15} />
          </button>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Icons.Target size={14} className="text-[#185FA5]" />
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Readiness</p>
            </div>
            <ReadinessBadge readiness={readiness} incompleteQuestionCount={incomplete.length} />
            <span className="text-sm font-semibold text-slate-800">{readinessText}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {questions.length === 0
              ? "Add questions from the bank before publishing this quiz."
              : incomplete.length > 0
                ? "One or more questions do not have a correct answer marked yet."
                : "This quiz has questions with answer keys in place and is operationally ready."}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Questions" value={String(questions.length)} />
          <StatCard label="Incomplete" value={String(incomplete.length)} warn={incomplete.length > 0} />
          <StatCard label="Pass score" value={quiz.passingScore != null ? `${quiz.passingScore}%` : "—"} />
          <StatCard label="Time limit" value={quiz.timeLimitSeconds ? `${Math.floor(quiz.timeLimitSeconds / 60)}m` : "None"} />
        </div>

        {/* Shuffle rules row */}
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
          <Icons.Shuffle size={13} className="text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-600">Shuffle rules:</span>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", settingsShuffle ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500")}>
            {settingsShuffle ? "✓ Questions shuffled per attempt" : "Questions in fixed order"}
          </span>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", settingsChoiceShuffle ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500")}>
            {settingsChoiceShuffle ? "✓ Choices shuffled per attempt" : "Choices in fixed order"}
          </span>
          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            className="ml-auto flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
          >
            <Icons.Settings size={10} />
            Edit rules
          </button>
        </div>

        {/* Quiz settings editor */}
        {showSettings && (
          <div className="rounded-xl border border-[#185FA5]/20 bg-[#E6F1FB]/20 p-4 space-y-4">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-[0.08em] flex items-center gap-2">
              <Icons.Settings size={13} className="text-[#185FA5]" />
              Quiz settings
            </p>

            {/* Per-attempt shuffle toggles */}
            <div className="space-y-3">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Per-attempt shuffle</p>
              <label className="flex items-center gap-3 cursor-pointer group">
                <button
                  type="button"
                  onClick={() => setSettingsShuffle((v) => !v)}
                  className={cn("relative h-5 w-9 rounded-full transition-colors", settingsShuffle ? "bg-emerald-500" : "bg-slate-200")}
                >
                  <span className={cn("absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", settingsShuffle && "translate-x-4")} />
                </button>
                <div>
                  <p className="text-sm font-medium text-slate-800">Shuffle question order</p>
                  <p className="text-[11px] text-slate-400">Each student sees questions in a different random order</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <button
                  type="button"
                  onClick={() => setSettingsChoiceShuffle((v) => !v)}
                  className={cn("relative h-5 w-9 rounded-full transition-colors", settingsChoiceShuffle ? "bg-emerald-500" : "bg-slate-200")}
                >
                  <span className={cn("absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", settingsChoiceShuffle && "translate-x-4")} />
                </button>
                <div>
                  <p className="text-sm font-medium text-slate-800">Shuffle answer choice order</p>
                  <p className="text-[11px] text-slate-400">Each student sees choices in a different random order</p>
                </div>
              </label>
            </div>

            {/* Score / time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="admin-label">Passing score (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="admin-input"
                  value={settingsPassScore}
                  onChange={(e) => setSettingsPassScore(e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Time limit (minutes, blank = untimed)</label>
                <input
                  type="number"
                  min={1}
                  className="admin-input"
                  value={settingsTimeLimit}
                  onChange={(e) => setSettingsTimeLimit(e.target.value)}
                  placeholder="No limit"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={saveSettings} disabled={settingsBusy} className="admin-action flex items-center gap-1.5 text-xs">
                {settingsBusy ? <Icons.Loader size={12} className="animate-spin" /> : <Icons.Check size={12} />}
                Save settings
              </button>
              <button type="button" onClick={() => setShowSettings(false)} className="admin-action secondary text-xs">Cancel</button>
            </div>
          </div>
        )}

        {/* Calculator Access Settings */}
        <details className="rounded-xl border border-slate-200 overflow-hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100">
            <Icons.Calculator size={13} className="text-[#185FA5]" />
            Calculator settings
            <Icons.ChevronDown size={12} className="ml-auto text-slate-400" />
          </summary>
          <div className="p-4">
            <CalculatorAccessSettings
              quizId={quiz.id}
              initialSettingsJson={quiz.calculatorSettingsJson}
            />
          </div>
        </details>

        {/* Readiness warnings */}
        {questions.length === 0 && (
          <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-700">
            <Icons.Info size={13} className="mt-0.5 shrink-0 text-slate-400" />
            <span>This quiz is empty. Use <strong>Add from bank</strong> to populate it before publishing.</span>
          </div>
        )}
        {incomplete.length > 0 && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
            <Icons.AlertTriangle size={13} className="mt-0.5 shrink-0 text-amber-500" />
            <span><strong>{incomplete.length}</strong> question{incomplete.length !== 1 ? "s have" : " has"} no correct answer marked.</span>
          </div>
        )}

        {/* Questions header with bulk shuffle */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-sm font-bold text-slate-900">Questions in this quiz</h3>
          <div className="flex items-center gap-2">
            {questions.length > 0 && (
              <button
                type="button"
                onClick={shuffleAllChoices}
                disabled={shufflingAll}
                className="flex items-center gap-1.5 rounded-md border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100 disabled:opacity-50"
                title="Randomly reorder answer choices for every question in this quiz"
              >
                {shufflingAll ? <Icons.Loader size={11} className="animate-spin" /> : <Icons.Shuffle size={11} />}
                Shuffle all choices
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowAddPanel((v) => !v)}
              className="admin-action secondary text-xs flex items-center gap-1.5"
            >
              <Icons.Plus size={12} />
              Add from bank
            </button>
          </div>
        </div>

        {/* Add from bank panel */}
        {showAddPanel && (
          <QuestionBankPicker quizId={quiz.id} onAdd={addQuestionsFromPicker} onClose={() => setShowAddPanel(false)} />
        )}

        {/* Question list */}
        {loading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-slate-400">
            <Icons.Loader size={15} className="animate-spin" />
            Loading questions…
          </div>
        ) : questions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <Icons.ClipboardList size={32} className="mx-auto text-slate-200 mb-2" />
            <p className="text-sm text-slate-400">No questions yet. Use "Add from bank" to populate this quiz.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((q, idx) => (
              <QuizQuestionCard
                key={q.id}
                question={q}
                index={idx}
                onSave={(updated) => saveQuestion(q, updated)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Quiz Question Card ───────────────────────────────────────────────────────

function QuizQuestionCard({
  question,
  index,
  onSave,
}: {
  question: QuizQuestion;
  index: number;
  onSave: (updated: Partial<QuizQuestion>) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<QuizQuestion>({ ...question });
  const [draggedChoiceId, setDraggedChoiceId] = useState<string | null>(null);
  const [dropChoiceId, setDropChoiceId] = useState<string | null>(null);

  useEffect(() => {
    setDraft({ ...question });
    setEditing(false);
    setDraggedChoiceId(null);
    setDropChoiceId(null);
  }, [question]);

  const hasCorrect = draft.answerChoices_on_question.some((c) => c.isCorrect);
  const sortedChoices = [...draft.answerChoices_on_question].sort((a, b) => a.position - b.position);

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

  function reorderChoices(fromIndex: number, toIndex: number) {
    setDraft((prev) => ({
      ...prev,
      answerChoices_on_question: reorderChoiceContent(
        [...prev.answerChoices_on_question].sort((a, b) => a.position - b.position),
        fromIndex,
        toIndex
      ),
    }));
  }

  function doShuffleChoices() {
    setDraft((prev) => ({
      ...prev,
      answerChoices_on_question: shuffleChoiceContent(
        [...prev.answerChoices_on_question].sort((a, b) => a.position - b.position)
      ),
    }));
  }

  function handleDragStart(choiceId: string, event: DragEvent<HTMLButtonElement>) {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", choiceId);
    setDraggedChoiceId(choiceId);
    setDropChoiceId(choiceId);
  }

  function handleDragOver(choiceId: string, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (draggedChoiceId && draggedChoiceId !== choiceId) {
      setDropChoiceId(choiceId);
    }
  }

  function handleDrop(choiceId: string, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    const sourceId = draggedChoiceId ?? event.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === choiceId) {
      setDraggedChoiceId(null);
      setDropChoiceId(null);
      return;
    }

    const fromIndex = sortedChoices.findIndex((choice) => choice.id === sourceId);
    const toIndex = sortedChoices.findIndex((choice) => choice.id === choiceId);
    if (fromIndex >= 0 && toIndex >= 0) {
      reorderChoices(fromIndex, toIndex);
    }
    setDraggedChoiceId(null);
    setDropChoiceId(null);
  }

  function handleDragEnd() {
    setDraggedChoiceId(null);
    setDropChoiceId(null);
  }

  async function handleSave() {
    setBusy(true);
    await onSave(draft);
    setBusy(false);
    setEditing(false);
  }

  return (
    <div className={cn("rounded-xl border bg-white shadow-sm overflow-hidden", !hasCorrect && "border-amber-200")}>
      {/* Row */}
      <div
        className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => { setExpanded((v) => !v); if (expanded) setEditing(false); }}
      >
        <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-800 leading-snug line-clamp-2">{question.questionText}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", DOMAIN_CLASSES[question.domain] ?? "bg-slate-100 text-slate-500")}>{question.domain}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", DIFFICULTY_CLASSES[question.difficulty] ?? "bg-slate-100 text-slate-500")}>{question.difficulty}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">{question.pointValue} pt</span>
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

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-slate-100 px-4 py-3 space-y-3">
          {editing ? (
            <>
              <div>
                <label className="admin-label">Question text</label>
                <textarea
                  className="admin-input min-h-20 text-sm leading-relaxed"
                  value={draft.questionText}
                  onChange={(e) => setDraft((p) => ({ ...p, questionText: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="admin-label">Difficulty</label>
                  <select className="admin-input" value={draft.difficulty} onChange={(e) => setDraft((p) => ({ ...p, difficulty: e.target.value }))}>
                    <option value="easy">Easy</option>
                    <option value="proficient">Proficient</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Domain</label>
                  <DomainCombobox value={draft.domain} onChange={(val) => setDraft((p) => ({ ...p, domain: val }))} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="admin-label mb-0">Answer choices</label>
                  <button
                    type="button"
                    onClick={doShuffleChoices}
                    className="flex items-center gap-1 rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 hover:bg-purple-100"
                    title="Randomly reorder answer choices"
                  >
                    <Icons.Shuffle size={10} />
                    Shuffle
                  </button>
                </div>
                <div className="space-y-2">
                  {sortedChoices.map((c, cidx) => (
                    <div
                      key={c.id}
                      className={cn(
                        "grid grid-cols-[28px_24px_1fr_auto] items-start gap-2 rounded-lg border border-transparent px-2 py-2 transition-colors",
                        draggedChoiceId === c.id && "bg-slate-100 opacity-70",
                        dropChoiceId === c.id && draggedChoiceId !== c.id && "border-[#185FA5] bg-[#E6F1FB]/50"
                      )}
                      onDragOver={(event) => handleDragOver(c.id, event)}
                      onDrop={(event) => handleDrop(c.id, event)}
                    >
                      <button
                        type="button"
                        draggable
                        onDragStart={(event) => handleDragStart(c.id, event)}
                        onDragEnd={handleDragEnd}
                        onClick={(event) => event.preventDefault()}
                        className="mt-1.5 flex h-5 w-5 cursor-grab items-center justify-center rounded text-slate-400 hover:bg-slate-200 hover:text-slate-700 active:cursor-grabbing"
                        title="Drag to reorder answer choice"
                      >
                        <Icons.GripVertical size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCorrect(c.id)}
                        className={cn("mt-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors", c.isCorrect ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 hover:border-slate-400")}
                      >
                        {c.isCorrect && <Icons.Check size={10} />}
                      </button>
                      <div className="space-y-1">
                        <input className="admin-input text-xs" value={c.choiceText} onChange={(e) => updateChoice(c.id, "choiceText", e.target.value)} />
                        <input className="admin-input text-xs text-slate-500" value={c.explanation ?? ""} onChange={(e) => updateChoice(c.id, "explanation", e.target.value || null)} placeholder="Explanation…" />
                      </div>
                      <span className="mt-1.5 text-xs font-bold text-slate-400">{c.letter}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={handleSave} disabled={busy} className="admin-action flex items-center gap-1.5 text-xs">
                  {busy ? <Icons.Loader size={12} className="animate-spin" /> : <Icons.Check size={12} />}
                  Save
                </button>
                <button type="button" onClick={() => { setEditing(false); setDraft({ ...question }); }} className="admin-action secondary text-xs">Cancel</button>
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              {sortedChoices.map((c) => (
                <div key={c.id} className={cn("flex items-start gap-2.5 rounded-lg px-3 py-2 text-sm", c.isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50 border border-slate-100")}>
                  <span className={cn("shrink-0 font-bold text-xs mt-0.5", c.isCorrect ? "text-emerald-600" : "text-slate-400")}>{c.letter}.</span>
                  <div className="min-w-0">
                    <p className={cn("text-xs", c.isCorrect ? "text-emerald-800 font-semibold" : "text-slate-700")}>{c.choiceText}</p>
                    {c.isCorrect && c.explanation && (
                      <p className="text-[11px] text-emerald-600 mt-0.5 italic">{c.explanation}</p>
                    )}
                  </div>
                  {c.isCorrect && <Icons.Check size={13} className="shrink-0 mt-0.5 text-emerald-500 ml-auto" />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  tone,
  icon,
  active,
  onClick,
}: {
  label: string;
  value: string;
  tone: "blue" | "emerald" | "amber" | "slate";
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  const tones: Record<string, string> = {
    blue: "border-[#185FA5]/15 bg-[#E6F1FB]/50 text-[#185FA5]",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    slate: "border-slate-200 bg-white text-slate-700",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5",
        tones[tone],
        active && "ring-2 ring-[#185FA5]/25"
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-[10px] font-bold uppercase tracking-[0.08em]">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-extrabold">{value}</p>
    </button>
  );
}

function StatCard({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={cn("rounded-lg border px-3 py-2.5 text-center", warn ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50")}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={cn("text-lg font-extrabold", warn ? "text-amber-700" : "text-slate-900")}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "bg-slate-100 text-slate-600",
    review: "bg-amber-100 text-amber-700",
    published: "bg-emerald-100 text-emerald-700",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${map[status] ?? "bg-slate-100 text-slate-500"}`}>{status}</span>;
}

function ReadinessBadge({
  readiness,
  incompleteQuestionCount,
}: {
  readiness: "empty" | "attention" | "ready";
  incompleteQuestionCount: number;
}) {
  const copy =
    readiness === "ready"
      ? "Ready"
      : readiness === "empty"
        ? "Empty"
        : `${incompleteQuestionCount} issue${incompleteQuestionCount === 1 ? "" : "s"}`;
  const classes =
    readiness === "ready"
      ? "bg-emerald-100 text-emerald-700"
      : readiness === "empty"
        ? "bg-slate-200 text-slate-600"
        : "bg-amber-100 text-amber-700";

  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", classes)}>{copy}</span>;
}

const DOMAIN_CLASSES: Record<string, string> = {
  math: "bg-blue-50 text-blue-700",
  appraisal: "bg-purple-50 text-purple-700",
  law: "bg-amber-50 text-amber-700",
  philly: "bg-emerald-50 text-emerald-700",
  admin: "bg-slate-100 text-slate-600",
  ethics: "bg-rose-50 text-rose-700",
};

const DIFFICULTY_CLASSES: Record<string, string> = {
  easy: "bg-green-50 text-green-700",
  proficient: "bg-yellow-50 text-yellow-700",
  expert: "bg-red-50 text-red-700",
};
