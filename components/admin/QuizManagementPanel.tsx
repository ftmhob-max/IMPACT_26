"use client";

import { useEffect, useState } from "react";
import * as Icons from "@/components/ui/Icons";

interface Quiz {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  passingScore?: number | null;
  timeLimitSeconds?: number | null;
  shuffleQuestions: boolean;
  createdAt: string;
}

interface Question {
  id: string;
  questionText: string;
  domain: string;
  difficulty: string;
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

export function QuizManagementPanel() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<NewQuizForm>(DEFAULT_FORM);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [addingQuestions, setAddingQuestions] = useState(false);
  const [selectedQIds, setSelectedQIds] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);

  async function load() {
    setLoading(true);
    const [quizRes, qRes] = await Promise.all([
      fetch("/api/admin/overview", { cache: "no-store" }),
      fetch("/api/admin/questions", { cache: "no-store" }),
    ]);
    if (quizRes.ok) {
      const data = await quizRes.json();
      setQuizzes(data.quizzes ?? []);
      setQuestions(data.questions ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createQuiz() {
    if (!form.title.trim()) return;
    setBusy(true);
    setNotice(null);
    const timeLimitSeconds = form.timeLimitMinutes
      ? parseInt(form.timeLimitMinutes) * 60
      : null;

    const res = await fetch("/api/admin/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description || null,
        passingScore: form.passingScore,
        timeLimitSeconds: timeLimitSeconds,
        shuffleQuestions: form.shuffleQuestions,
        shuffleChoices: form.shuffleChoices,
        status: form.status,
      }),
    });
    setBusy(false);
    if (res.ok) {
      setForm(DEFAULT_FORM);
      setShowCreate(false);
      setNotice({ type: "success", text: "Quiz created." });
      await load();
    } else {
      const err = await res.json().catch(() => ({}));
      setNotice({ type: "error", text: err.error ?? "Could not create quiz." });
    }
  }

  async function addQuestionsToQuiz() {
    if (!selectedQuiz || !selectedQIds.size) return;
    setBusy(true);
    const res = await fetch("/api/admin/quizzes/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizId: selectedQuiz,
        questionIds: [...selectedQIds],
      }),
    });
    setBusy(false);
    if (res.ok) {
      setSelectedQIds(new Set());
      setAddingQuestions(false);
      setNotice({ type: "success", text: `${selectedQIds.size} question(s) added to quiz.` });
      await load();
    } else {
      const err = await res.json().catch(() => ({}));
      setNotice({ type: "error", text: err.error ?? "Could not add questions." });
    }
  }

  async function publishQuiz(quizId: string, publish: boolean) {
    await fetch("/api/admin/quizzes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId, status: publish ? "published" : "draft" }),
    });
    await load();
  }

  function setField<K extends keyof NewQuizForm>(key: K, value: NewQuizForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="space-y-6">
      {/* Notice */}
      {notice && (
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${notice.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {notice.type === "success" ? <Icons.Check size={16} /> : <Icons.X size={16} />}
          {notice.text}
        </div>
      )}

      {/* Quiz list */}
      <div className="rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <Icons.ClipboardList size={18} className="text-[#185FA5]" />
            <h2 className="text-sm font-bold text-slate-900">Quizzes</h2>
            <span className="text-xs text-slate-400">({quizzes.length})</span>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="admin-action secondary flex items-center gap-1.5 text-xs"
          >
            <Icons.Plus size={13} />
            New quiz
          </button>
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="border-b border-slate-100 bg-slate-50 p-4 space-y-3">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-[0.08em]">New quiz</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                className="admin-input"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Quiz title"
              />
              <input
                className="admin-input"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Description (optional)"
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-4">
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  className="admin-input w-16"
                  value={form.passingScore}
                  min={0}
                  max={100}
                  onChange={(e) => setField("passingScore", Number(e.target.value))}
                />
                <span className="text-xs text-slate-500">% pass</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  className="admin-input w-16"
                  value={form.timeLimitMinutes}
                  min={1}
                  onChange={(e) => setField("timeLimitMinutes", e.target.value)}
                  placeholder="—"
                />
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
          ) : quizzes.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Icons.ClipboardList size={32} className="mx-auto text-slate-200 mb-2" />
              <p className="text-sm text-slate-400">No quizzes yet. Create one or import via CSV.</p>
            </div>
          ) : (
            quizzes.map((quiz) => (
              <QuizRow
                key={quiz.id}
                quiz={quiz}
                selected={selectedQuiz === quiz.id}
                onSelect={() => setSelectedQuiz(selectedQuiz === quiz.id ? null : quiz.id)}
                onPublish={(pub) => publishQuiz(quiz.id, pub)}
                onAddQuestions={() => {
                  setSelectedQuiz(quiz.id);
                  setAddingQuestions(true);
                  setSelectedQIds(new Set());
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Add questions panel */}
      {addingQuestions && selectedQuiz && (
        <div className="rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <Icons.Plus size={18} className="text-[#185FA5]" />
              <h2 className="text-sm font-bold text-slate-900">Add questions to quiz</h2>
            </div>
            <button type="button" onClick={() => setAddingQuestions(false)} className="text-slate-400 hover:text-slate-700">
              <Icons.X size={16} />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-slate-500">
              {selectedQIds.size} selected · Select questions then click Add
            </p>
            <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
              {questions.map((q) => (
                <label key={q.id} className="flex items-start gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedQIds.has(q.id)}
                    onChange={(e) => {
                      const next = new Set(selectedQIds);
                      e.target.checked ? next.add(q.id) : next.delete(q.id);
                      setSelectedQIds(next);
                    }}
                    className="mt-0.5"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">{q.questionText}</span>
                  <span className="shrink-0 text-[10px] text-slate-400 ml-auto">{q.domain}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              className="admin-action"
              onClick={addQuestionsToQuiz}
              disabled={busy || !selectedQIds.size}
            >
              {busy ? <Icons.Loader size={13} className="animate-spin" /> : <Icons.Plus size={13} />}
              Add {selectedQIds.size || ""} question{selectedQIds.size !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QuizRow({
  quiz,
  selected,
  onSelect,
  onPublish,
  onAddQuestions,
}: {
  quiz: Quiz;
  selected: boolean;
  onSelect: () => void;
  onPublish: (pub: boolean) => void;
  onAddQuestions: () => void;
}) {
  const isPublished = quiz.status === "published";
  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 cursor-pointer" onClick={onSelect}>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-800">{quiz.title}</p>
            <StatusBadge status={quiz.status} />
          </div>
          {quiz.description && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">{quiz.description}</p>
          )}
          <div className="flex flex-wrap gap-3 mt-1 text-[10px] text-slate-400">
            {quiz.passingScore != null && <span>{quiz.passingScore}% pass</span>}
            {quiz.timeLimitSeconds != null && <span>{Math.floor(quiz.timeLimitSeconds / 60)} min</span>}
            {quiz.shuffleQuestions && <span>Shuffled</span>}
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1.5">
          <button type="button" onClick={onAddQuestions} className="admin-action secondary text-xs py-1 flex items-center gap-1">
            <Icons.Plus size={12} />
            Questions
          </button>
          <button
            type="button"
            onClick={() => onPublish(!isPublished)}
            className={`admin-action text-xs py-1 flex items-center gap-1 ${isPublished ? "secondary" : ""}`}
          >
            {isPublished ? <Icons.EyeOff size={12} /> : <Icons.Eye size={12} />}
            {isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "bg-slate-100 text-slate-600",
    review: "bg-amber-100 text-amber-700",
    published: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${map[status] ?? "bg-slate-100 text-slate-500"}`}>
      {status}
    </span>
  );
}
