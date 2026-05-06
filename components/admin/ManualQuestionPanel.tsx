"use client";

import { useState } from "react";
import { DOMAINS, DIFFICULTIES } from "@/lib/utils";
import * as Icons from "@/components/ui/Icons";

interface Quiz {
  id: string;
  title: string;
}

interface ManualQuestionPanelProps {
  quizzes: Quiz[];
  onSaved: (message: string) => void;
}

const DEFAULT_CHOICES = ["", "", "", ""];

export function ManualQuestionPanel({ quizzes, onSaved }: ManualQuestionPanelProps) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({
    questionText: "",
    questionType: "multiple_choice",
    difficulty: "proficient",
    domain: "appraisal",
    topicTags: "",
    sourceRef: "",
    formulaRef: "",
    rationale: "",
    choices: [...DEFAULT_CHOICES],
    correct: "A",
    explanation: "",
    quizId: "",
  });

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setChoice(index: number, value: string) {
    const next = [...form.choices];
    next[index] = value;
    setForm((f) => ({ ...f, choices: next }));
  }

  function addChoice() {
    if (form.choices.length < 8) setForm((f) => ({ ...f, choices: [...f.choices, ""] }));
  }

  function removeChoice(index: number) {
    if (form.choices.length <= 2) return;
    const next = form.choices.filter((_, i) => i !== index);
    setForm((f) => ({ ...f, choices: next }));
  }

  async function save() {
    setBusy(true);
    setNotice(null);
    const choices = form.choices
      .filter((c) => c.trim())
      .map((c, i) => ({
        letter: String.fromCharCode(65 + i),
        choiceText: c.trim(),
        isCorrect: form.correct
          .toUpperCase()
          .split(",")
          .map((s) => s.trim())
          .includes(String.fromCharCode(65 + i)),
        explanation: form.explanation.trim() || null,
      }));

    const res = await fetch("/api/admin/assessments/manual-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionText: form.questionText,
        questionType: form.questionType,
        difficulty: form.difficulty,
        domain: form.domain,
        topicTags: form.topicTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        sourceRef: form.sourceRef || null,
        formulaRef: form.formulaRef || null,
        rationale: form.rationale || null,
        choices,
        quizId: form.quizId || null,
        pointValue: 1,
        status: "draft",
      }),
    });

    setBusy(false);
    if (res.ok) {
      setNotice({ type: "success", text: "Question saved to the bank." });
      setForm({
        questionText: "",
        questionType: "multiple_choice",
        difficulty: "proficient",
        domain: "appraisal",
        topicTags: "",
        sourceRef: "",
        formulaRef: "",
        rationale: "",
        choices: [...DEFAULT_CHOICES],
        correct: "A",
        explanation: "",
        quizId: "",
      });
      onSaved("Question saved to the bank.");
    } else {
      const err = await res.json().catch(() => ({}));
      setNotice({ type: "error", text: err.error ?? "Could not save question." });
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="admin-label">Question text</label>
        <textarea
          className="admin-input min-h-24"
          value={form.questionText}
          onChange={(e) => setField("questionText", e.target.value)}
          placeholder="Enter the question…"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <div>
          <label className="admin-label">Type</label>
          <select className="admin-input" value={form.questionType} onChange={(e) => setField("questionType", e.target.value)}>
            <option value="multiple_choice">Multiple choice</option>
            <option value="multiselect">Multiselect</option>
            <option value="short_answer">Short answer</option>
            <option value="scenario">Scenario</option>
          </select>
        </div>
        <div>
          <label className="admin-label">Difficulty</label>
          <select className="admin-input" value={form.difficulty} onChange={(e) => setField("difficulty", e.target.value)}>
            {Object.entries(DIFFICULTIES).map(([key, item]) => (
              <option key={key} value={key}>{item.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="admin-label">Domain</label>
          <select className="admin-input" value={form.domain} onChange={(e) => setField("domain", e.target.value)}>
            {Object.entries(DOMAINS).map(([key, item]) => (
              <option key={key} value={key}>{item.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="admin-label !mb-0">Answer choices</label>
          {form.choices.length < 8 && (
            <button type="button" onClick={addChoice} className="flex items-center gap-1 text-xs font-medium text-[#185FA5] hover:underline">
              <Icons.Plus size={12} />
              Add choice
            </button>
          )}
        </div>
        <div className="space-y-1.5">
          {form.choices.map((choice, i) => (
            <div key={i} className="grid grid-cols-[26px_1fr_28px] items-center gap-1.5">
              <span className="text-xs font-bold text-center text-slate-500 bg-slate-100 rounded py-1">
                {String.fromCharCode(65 + i)}
              </span>
              <input
                className="admin-input"
                value={choice}
                onChange={(e) => setChoice(i, e.target.value)}
                placeholder={`Choice ${String.fromCharCode(65 + i)}`}
              />
              <button
                type="button"
                onClick={() => removeChoice(i)}
                disabled={form.choices.length <= 2}
                className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-30"
              >
                <Icons.X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <label className="admin-label">Correct letter(s)</label>
          <input
            className="admin-input"
            value={form.correct}
            onChange={(e) => setField("correct", e.target.value)}
            placeholder="A or A,C for multiselect"
          />
        </div>
        <div>
          <label className="admin-label">Topic tags</label>
          <input
            className="admin-input"
            value={form.topicTags}
            onChange={(e) => setField("topicTags", e.target.value)}
            placeholder="USPAP, valuation methods"
          />
        </div>
      </div>

      <div>
        <label className="admin-label">Explanation (shown after answer)</label>
        <textarea
          className="admin-input min-h-16"
          value={form.explanation}
          onChange={(e) => setField("explanation", e.target.value)}
          placeholder="Why this answer is correct…"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <label className="admin-label">Source reference</label>
          <input className="admin-input" value={form.sourceRef} onChange={(e) => setField("sourceRef", e.target.value)} placeholder="USPAP Standard 6" />
        </div>
        <div>
          <label className="admin-label">Formula reference</label>
          <input className="admin-input" value={form.formulaRef} onChange={(e) => setField("formulaRef", e.target.value)} placeholder="GRM, CAP" />
        </div>
      </div>

      <div>
        <label className="admin-label">Rationale</label>
        <textarea
          className="admin-input min-h-14"
          value={form.rationale}
          onChange={(e) => setField("rationale", e.target.value)}
          placeholder="Additional context for instructors…"
        />
      </div>

      <div>
        <label className="admin-label">Add to quiz (optional)</label>
        <select className="admin-input" value={form.quizId} onChange={(e) => setField("quizId", e.target.value)}>
          <option value="">Save to question bank only</option>
          {quizzes.map((q) => (
            <option key={q.id} value={q.id}>{q.title}</option>
          ))}
        </select>
      </div>

      {notice && (
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${notice.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {notice.type === "success" ? <Icons.Check size={13} /> : <Icons.X size={13} />}
          {notice.text}
        </div>
      )}

      <button
        type="button"
        className="admin-action w-full flex items-center justify-center gap-2"
        onClick={save}
        disabled={busy || !form.questionText.trim()}
      >
        {busy ? <Icons.Loader size={14} className="animate-spin" /> : <Icons.Check size={14} />}
        Save question
      </button>
    </div>
  );
}
