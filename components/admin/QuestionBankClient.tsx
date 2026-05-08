"use client";

import { type ReactNode, useState, useMemo, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import * as Icons from "@/components/ui/Icons";

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
  questionType: string;
  difficulty: string;
  domain: string;
  formulaRef?: string | null;
  topicTags?: string | null;
  status: string;
  version: number;
  isMultiselect: boolean;
  rationale?: string | null;
  calculation?: string | null;
  sourceRef?: string | null;
  createdAt: string;
  answerChoices_on_question: AnswerChoice[];
}

interface Quiz {
  id: string;
  title: string;
}

interface Props {
  questions: Question[];
  quizzes: Quiz[];
}

const PAGE_SIZE = 25;

const DOMAINS = ["math", "appraisal", "law", "philly", "admin", "ethics"];
const DIFFICULTIES = ["easy", "proficient", "expert"];
const STATUSES = ["draft", "review", "published", "archived"];

// ─── Choice ordering utilities ────────────────────────────────────────────────
// Answer choice *identity* (id, letter, position) is fixed in the DB.
// We reorder by swapping mutable content between adjacent slots.

type ChoiceContent = Pick<AnswerChoice, "choiceText" | "isCorrect" | "explanation">;

function swapChoiceContent(choices: AnswerChoice[], i: number, j: number): AnswerChoice[] {
  const next = [...choices];
  const { choiceText: ta, isCorrect: ca, explanation: ea } = next[i];
  const { choiceText: tb, isCorrect: cb, explanation: eb } = next[j];
  next[i] = { ...next[i], choiceText: tb, isCorrect: cb, explanation: eb };
  next[j] = { ...next[j], choiceText: ta, isCorrect: ca, explanation: ea };
  return next;
}

function shuffleChoiceContent(choices: AnswerChoice[]): AnswerChoice[] {
  const content: ChoiceContent[] = choices.map(({ choiceText, isCorrect, explanation }) => ({
    choiceText,
    isCorrect,
    explanation,
  }));
  for (let i = content.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [content[i], content[j]] = [content[j], content[i]];
  }
  return choices.map((c, idx) => ({ ...c, ...content[idx] }));
}

async function saveChoices(questionId: string, choices: AnswerChoice[]): Promise<boolean> {
  const res = await fetch(`/api/admin/questions/${questionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      choices: choices.map((c) => ({
        id: c.id,
        choiceText: c.choiceText,
        isCorrect: c.isCorrect,
        explanation: c.explanation ?? null,
      })),
    }),
  });
  return res.ok;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function QuestionBankClient({ questions, quizzes }: Props) {
  const [questionItems, setQuestionItems] = useState<Question[]>(questions);
  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [statFilter, setStatFilter] = useState<
    "all" | "draft" | "review" | "published" | "missing-correct" | "formula-linked"
  >("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailQuestion, setDetailQuestion] = useState<Question | null>(null);

  const [bulkStatus, setBulkStatus] = useState("published");
  const [bulkQuizId, setBulkQuizId] = useState(quizzes[0]?.id ?? "");
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});

  const hasActiveFilters = !!(search || filterDomain || filterDifficulty || filterStatus || statFilter !== "all");

  function syncQuestion(questionId: string, updater: (question: Question) => Question) {
    setQuestionItems((prev) => prev.map((question) => (question.id === questionId ? updater(question) : question)));
    setDetailQuestion((prev) => (prev?.id === questionId ? updater(prev) : prev));
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return questionItems.filter((question) => {
      if (q && !question.questionText.toLowerCase().includes(q) && !(question.topicTags ?? "").toLowerCase().includes(q)) return false;
      if (filterDomain && question.domain !== filterDomain) return false;
      if (filterDifficulty && question.difficulty !== filterDifficulty) return false;
      const effectiveStatus = localStatuses[question.id] ?? question.status;
      if (filterStatus && effectiveStatus !== filterStatus) return false;
      if (statFilter === "draft" && effectiveStatus !== "draft") return false;
      if (statFilter === "review" && effectiveStatus !== "review") return false;
      if (statFilter === "published" && effectiveStatus !== "published") return false;
      if (statFilter === "missing-correct" && question.answerChoices_on_question.some((choice) => choice.isCorrect)) return false;
      if (statFilter === "formula-linked" && !question.formulaRef) return false;
      return true;
    });
  }, [questionItems, search, filterDomain, filterDifficulty, filterStatus, localStatuses, statFilter]);

  const tableStats = useMemo(() => {
    const counts = {
      total: questionItems.length,
      draft: 0,
      review: 0,
      published: 0,
      archived: 0,
      multiselect: 0,
      missingCorrect: 0,
      formulaLinked: 0,
    };

    for (const question of questionItems) {
      const effectiveStatus = localStatuses[question.id] ?? question.status;
      if (effectiveStatus === "draft") counts.draft += 1;
      if (effectiveStatus === "review") counts.review += 1;
      if (effectiveStatus === "published") counts.published += 1;
      if (effectiveStatus === "archived") counts.archived += 1;
      if (question.isMultiselect) counts.multiselect += 1;
      if (question.formulaRef) counts.formulaLinked += 1;
      if (!question.answerChoices_on_question.some((choice) => choice.isCorrect)) counts.missingCorrect += 1;
    }

    return counts;
  }, [localStatuses, questionItems]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pageIds = new Set(pageItems.map((q) => q.id));
  const allPageSelected = pageItems.length > 0 && pageItems.every((q) => selected.has(q.id));
  const somePageSelected = pageItems.some((q) => selected.has(q.id));

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function togglePage() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
    setBulkMessage(null);
  }

  function resetFilters() {
    setSearch("");
    setFilterDomain("");
    setFilterDifficulty("");
    setFilterStatus("");
    setStatFilter("all");
    setPage(1);
  }

  function toggleStatFilter(next: typeof statFilter) {
    setStatFilter((prev) => (prev === next ? "all" : next));
    setPage(1);
  }

  const updateOneStatus = useCallback(async (id: string, status: string) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: status }));
    syncQuestion(id, (question) => ({ ...question, status }));
    await fetch(`/api/admin/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  }, []);

  async function runBulkStatus() {
    if (selected.size === 0 || bulkBusy) return;
    setBulkBusy(true);
    setBulkMessage(null);
    try {
      const res = await fetch("/api/admin/questions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set-status", ids: [...selected], status: bulkStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        selected.forEach((id) => setLocalStatuses((prev) => ({ ...prev, [id]: bulkStatus })));
        setBulkMessage({ ok: true, text: `Updated ${data.updated} question${data.updated !== 1 ? "s" : ""} to "${bulkStatus}".` });
        clearSelection();
      } else {
        setBulkMessage({ ok: false, text: data.error ?? "Failed" });
      }
    } catch {
      setBulkMessage({ ok: false, text: "Network error" });
    } finally {
      setBulkBusy(false);
    }
  }

  async function runBulkAssign() {
    if (selected.size === 0 || !bulkQuizId || bulkBusy) return;
    setBulkBusy(true);
    setBulkMessage(null);
    try {
      const res = await fetch("/api/admin/questions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assign-quiz", ids: [...selected], quizId: bulkQuizId }),
      });
      const data = await res.json();
      if (res.ok) {
        setBulkMessage({ ok: true, text: `Added ${data.added} question${data.added !== 1 ? "s" : ""} to quiz.` });
        clearSelection();
      } else {
        setBulkMessage({ ok: false, text: data.error ?? "Failed" });
      }
    } catch {
      setBulkMessage({ ok: false, text: "Network error" });
    } finally {
      setBulkBusy(false);
    }
  }

  async function runBulkShuffle() {
    if (selected.size === 0 || bulkBusy) return;
    setBulkBusy(true);
    setBulkMessage(null);
    const targets = questionItems.filter((q) => selected.has(q.id) && q.answerChoices_on_question.length > 1);
    let ok = 0;
    let fail = 0;
    for (const q of targets) {
      const sorted = [...q.answerChoices_on_question].sort((a, b) => a.position - b.position);
      const shuffled = shuffleChoiceContent(sorted);
      const saved = await saveChoices(q.id, shuffled);
      saved ? ok++ : fail++;
    }
    setBulkBusy(false);
    setBulkMessage({
      ok: fail === 0,
      text: fail === 0
        ? `Shuffled answer choices for ${ok} question${ok !== 1 ? "s" : ""}.`
        : `${ok} shuffled, ${fail} failed.`,
    });
    clearSelection();
  }

  async function deleteQuestion(question: Question) {
    if (!window.confirm(`Delete question "${question.questionText.slice(0, 80)}${question.questionText.length > 80 ? "…" : ""}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/questions/${question.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setQuestionItems((prev) => prev.filter((item) => item.id !== question.id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(question.id);
        return next;
      });
      if (detailQuestion?.id === question.id) setDetailQuestion(null);
      setBulkMessage({ ok: true, text: "Question deleted." });
    } else {
      setBulkMessage({ ok: false, text: data.error ?? "Failed to delete question." });
    }
  }

  return (
    <div className="flex gap-5">
      {/* Left: table */}
      <div className={cn("min-w-0 space-y-4", detailQuestion ? "flex-1" : "w-full")}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <QuestionStatCard label="Total" value={String(tableStats.total)} tone="blue" icon={<Icons.FileText size={14} />} active={statFilter === "all"} onClick={() => toggleStatFilter("all")} />
          <QuestionStatCard label="Published" value={String(tableStats.published)} tone="emerald" active={statFilter === "published"} onClick={() => toggleStatFilter("published")} />
          <QuestionStatCard label="In review" value={String(tableStats.review)} tone="amber" active={statFilter === "review"} onClick={() => toggleStatFilter("review")} />
          <QuestionStatCard label="Drafts" value={String(tableStats.draft)} tone="slate" active={statFilter === "draft"} onClick={() => toggleStatFilter("draft")} />
          <QuestionStatCard label="Missing key" value={String(tableStats.missingCorrect)} tone="amber" active={statFilter === "missing-correct"} onClick={() => toggleStatFilter("missing-correct")} />
          <QuestionStatCard label="Formula refs" value={String(tableStats.formulaLinked)} tone="slate" active={statFilter === "formula-linked"} onClick={() => toggleStatFilter("formula-linked")} />
        </div>

        {/* Filter bar */}
        <div className="rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-[15rem] flex-1">
                <label className="admin-label mb-1">Search</label>
                <input
                  type="search"
                  placeholder="Search questions, tags, or formula refs…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="admin-input"
                />
              </div>
              <div className="w-36">
                <label className="admin-label mb-1">Domain</label>
                <select className="admin-input" value={filterDomain} onChange={(e) => { setFilterDomain(e.target.value); setPage(1); }}>
                  <option value="">All domains</option>
                  {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="w-36">
                <label className="admin-label mb-1">Difficulty</label>
                <select className="admin-input" value={filterDifficulty} onChange={(e) => { setFilterDifficulty(e.target.value); setPage(1); }}>
                  <option value="">All difficulties</option>
                  {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="w-36">
                <label className="admin-label mb-1">Status</label>
                <select className="admin-input" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
                  <option value="">All statuses</option>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 px-4 py-3">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              Showing {filtered.length} of {questionItems.length}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              {selected.size} selected
            </span>
            {hasActiveFilters && (
              <span className="rounded-full bg-[#E6F1FB] px-2.5 py-1 text-[11px] font-semibold text-[#185FA5]">
                Filters active{statFilter !== "all" ? ` · ${statFilter}` : ""}
              </span>
            )}
            <button type="button" onClick={resetFilters} className="ml-auto admin-action secondary text-xs">
              <Icons.RotateCcw size={12} />
              Reset filters
            </button>
          </div>
        </div>

        {/* Bulk bar */}
        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#185FA5]/30 bg-[#E6F1FB] px-4 py-3">
            <span className="text-sm font-semibold text-[#185FA5]">{selected.size} selected</span>
            <span className="text-xs text-slate-500">Apply changes to the current selection across filtered pages.</span>
            <button type="button" onClick={clearSelection} className="text-xs text-slate-500 underline hover:text-slate-700">Clear</button>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600">Set status:</span>
              <select className="admin-input py-1 text-xs" value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="button" onClick={runBulkStatus} disabled={bulkBusy} className="rounded bg-slate-700 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60">Apply</button>
            </div>
            {quizzes.length > 0 && (
              <>
                <div className="h-4 w-px bg-slate-300" />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">Add to quiz:</span>
                  <select className="admin-input py-1 text-xs" value={bulkQuizId} onChange={(e) => setBulkQuizId(e.target.value)}>
                    {quizzes.map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
                  </select>
                  <button type="button" onClick={runBulkAssign} disabled={bulkBusy} className="rounded bg-[#185FA5] px-3 py-1 text-xs font-semibold text-white hover:bg-[#145082] disabled:opacity-60">Assign</button>
                </div>
              </>
            )}
            <div className="h-4 w-px bg-slate-300" />
            <button
              type="button"
              onClick={runBulkShuffle}
              disabled={bulkBusy}
              className="flex items-center gap-1.5 rounded bg-purple-600 px-3 py-1 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
              title="Randomly reorder answer choices for each selected question"
            >
              <Icons.Shuffle size={12} />
              Shuffle choices
            </button>
            {bulkBusy && <span className="text-xs text-slate-500">Working…</span>}
          </div>
        )}

        {bulkMessage && (
          <div className={cn("rounded-md px-4 py-2.5 text-sm font-medium", bulkMessage.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700")}>
            {bulkMessage.text}
            <button type="button" onClick={() => setBulkMessage(null)} className="ml-3 text-xs underline opacity-70 hover:opacity-100">Dismiss</button>
          </div>
        )}

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-white p-12 text-center">
            <Icons.Search size={28} className="mx-auto text-slate-200" />
            <p className="mt-3 text-sm font-semibold text-slate-600">
              {questionItems.length === 0 ? "No questions have been added yet." : "No questions match the current filters."}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {questionItems.length === 0
                ? "Use CSV import or the manual builder above to populate the bank."
                : hasActiveFilters
                  ? "Try resetting the filters to widen the result set."
                  : "Adjust the current search terms and try again."}
            </p>
            {hasActiveFilters && (
              <button type="button" onClick={resetFilters} className="admin-action secondary mt-4 text-xs">
                <Icons.RotateCcw size={12} />
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="w-10 px-3 py-3">
                    <input type="checkbox" checked={allPageSelected} ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected; }} onChange={togglePage} className="h-4 w-4 rounded border-slate-300 text-[#185FA5]" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Question</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Domain</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hidden md:table-cell">Difficulty</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hidden sm:table-cell">Status</th>
                  <th className="w-10 px-2 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pageItems.map((q) => {
                  const effectiveStatus = localStatuses[q.id] ?? q.status;
                  const isActive = detailQuestion?.id === q.id;
                  return (
                    <tr
                      key={q.id}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isActive ? "bg-[#E6F1FB]" : selected.has(q.id) ? "bg-blue-50/40 hover:bg-blue-50/60" : "hover:bg-slate-50"
                      )}
                      onClick={() => setDetailQuestion(isActive ? null : q)}
                    >
                      <td className="w-10 px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={selected.has(q.id)} onChange={() => toggleOne(q.id)} className="h-4 w-4 rounded border-slate-300 text-[#185FA5]" />
                      </td>
                      <td className="px-4 py-3 max-w-sm">
                        <p className={cn("truncate", isActive ? "font-semibold text-[#185FA5]" : "text-slate-800")}>{q.questionText}</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {q.questionType && <MetaChip label={q.questionType.replace("_", " ")} tone="slate" />}
                          {q.isMultiselect && <MetaChip label="multiselect" tone="purple" />}
                          {!q.answerChoices_on_question.some((choice) => choice.isCorrect) && <MetaChip label="missing correct answer" tone="amber" />}
                          {q.formulaRef && <MetaChip label={q.formulaRef} tone="blue" />}
                        </div>
                        {q.topicTags && (() => {
                          try {
                            const tags = JSON.parse(q.topicTags) as string[];
                            return tags.length > 0 ? <p className="mt-1 truncate text-[10px] text-slate-400">{tags.join(" · ")}</p> : null;
                          } catch { return null; }
                        })()}
                      </td>
                      <td className="px-4 py-3"><DomainBadge domain={q.domain} /></td>
                      <td className="px-4 py-3 hidden md:table-cell"><DifficultyBadge difficulty={q.difficulty} /></td>
                      <td className="px-4 py-3 hidden sm:table-cell" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={effectiveStatus}
                          onChange={(e) => updateOneStatus(q.id, e.target.value)}
                          className={cn("rounded-full border-0 bg-transparent px-2 py-0.5 text-[10px] font-semibold focus:ring-1 focus:ring-[#185FA5]", STATUS_CLASSES[effectiveStatus] ?? "bg-slate-100 text-slate-600")}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => deleteQuestion(q)}
                          className="rounded p-1 text-slate-300 hover:text-red-600"
                          title="Delete question"
                        >
                          <Icons.Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                <p className="text-xs text-slate-500">Page {currentPage} of {totalPages} · {filtered.length} results</p>
                <div className="flex gap-1">
                  <PageBtn label="«" disabled={currentPage === 1} onClick={() => setPage(1)} />
                  <PageBtn label="‹" disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)} />
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                    return start + i;
                  }).map((n) => (
                    <PageBtn key={n} label={String(n)} active={n === currentPage} onClick={() => setPage(n)} />
                  ))}
                  <PageBtn label="›" disabled={currentPage === totalPages} onClick={() => setPage((p) => p + 1)} />
                  <PageBtn label="»" disabled={currentPage === totalPages} onClick={() => setPage(totalPages)} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: question detail panel */}
      {detailQuestion && (
        <QuestionDetailPanel
          question={detailQuestion}
          quizzes={quizzes}
          onClose={() => setDetailQuestion(null)}
          onStatusChange={(status) => updateOneStatus(detailQuestion.id, status)}
          onSaved={(updated) => syncQuestion(detailQuestion.id, (question) => ({ ...question, ...updated }))}
          onDelete={() => deleteQuestion(detailQuestion)}
        />
      )}
    </div>
  );
}

// ─── Question Detail Panel ────────────────────────────────────────────────────

function QuestionDetailPanel({
  question,
  quizzes,
  onClose,
  onStatusChange,
  onSaved,
  onDelete,
}: {
  question: Question;
  quizzes: Quiz[];
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onSaved: (updated: Partial<Question>) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [draft, setDraft] = useState({ ...question });
  const [addToQuizId, setAddToQuizId] = useState(quizzes[0]?.id ?? "");
  const [addingToQuiz, setAddingToQuiz] = useState(false);

  useEffect(() => {
    setDraft({ ...question });
    setEditing(false);
  }, [question]);

  function resetDraft() {
    setDraft({ ...question });
    setEditing(false);
  }

  function updateChoice(choiceId: string, field: keyof AnswerChoice, value: any) {
    setDraft((prev) => ({
      ...prev,
      answerChoices_on_question: prev.answerChoices_on_question.map((c) =>
        c.id === choiceId ? { ...c, [field]: value } : c
      ),
    }));
  }

  function toggleCorrect(choiceId: string) {
    setDraft((prev) => ({
      ...prev,
      answerChoices_on_question: prev.answerChoices_on_question.map((c) => ({
        ...c,
        isCorrect: draft.isMultiselect
          ? c.id === choiceId ? !c.isCorrect : c.isCorrect
          : c.id === choiceId,
      })),
    }));
  }

  function moveChoice(idx: number, dir: -1 | 1) {
    const sorted = [...draft.answerChoices_on_question].sort((a, b) => a.position - b.position);
    const target = idx + dir;
    if (target < 0 || target >= sorted.length) return;
    setDraft((prev) => ({
      ...prev,
      answerChoices_on_question: swapChoiceContent(
        [...prev.answerChoices_on_question].sort((a, b) => a.position - b.position),
        idx,
        target
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

  async function save() {
    setBusy(true);
    setNotice(null);
    const res = await fetch(`/api/admin/questions/${question.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionText: draft.questionText,
        difficulty: draft.difficulty,
        domain: draft.domain,
        rationale: draft.rationale ?? null,
        calculation: draft.calculation ?? null,
        sourceRef: draft.sourceRef ?? null,
        formulaRef: draft.formulaRef ?? null,
        choices: draft.answerChoices_on_question.map((c) => ({
          id: c.id,
          choiceText: c.choiceText,
          isCorrect: c.isCorrect,
          explanation: c.explanation ?? null,
        })),
      }),
    });
    setBusy(false);
    if (res.ok) {
      setNotice({ ok: true, text: "Saved." });
      onSaved(draft);
      setEditing(false);
    } else {
      setNotice({ ok: false, text: "Save failed." });
    }
  }

  async function addToQuiz() {
    if (!addToQuizId) return;
    setAddingToQuiz(true);
    const res = await fetch("/api/admin/quizzes/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId: addToQuizId, questionIds: [question.id] }),
    });
    setAddingToQuiz(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setNotice({ ok: true, text: data.skipped ? "Already in that quiz." : "Added to quiz." });
    } else {
      setNotice({ ok: false, text: data.error ?? "Failed." });
    }
  }

  const sortedChoices = [...(draft.answerChoices_on_question)].sort((a, b) => a.position - b.position);
  const hasCorrect = sortedChoices.some((c) => c.isCorrect);

  return (
    <div className="w-[400px] shrink-0 self-start sticky top-6 rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <Icons.FileText size={15} className="text-[#185FA5]" />
          <span className="text-sm font-bold text-slate-900">Question detail</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
              editing ? "bg-[#185FA5] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            <Icons.Pencil size={11} />
            {editing ? "Editing" : "Edit"}
          </button>
          <button type="button" onClick={onDelete} className="rounded p-1 text-slate-400 hover:text-red-600" title="Delete question">
            <Icons.Trash2 size={15} />
          </button>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded">
            <Icons.X size={15} />
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-160px)] overflow-y-auto divide-y divide-slate-100">
        {/* Notice */}
        {notice && (
          <div className={cn("flex items-center gap-2 px-4 py-2 text-xs font-medium", notice.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700")}>
            {notice.ok ? <Icons.Check size={12} /> : <Icons.X size={12} />}
            {notice.text}
          </div>
        )}

        {/* Metadata badges */}
        <div className="space-y-3 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            <DomainBadge domain={draft.domain} />
            <DifficultyBadge difficulty={draft.difficulty} />
            <span className={cn("inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", STATUS_CLASSES[draft.status] ?? "bg-slate-100 text-slate-600")}>
              {draft.status}
            </span>
            {draft.questionType && <MetaChip label={draft.questionType.replace("_", " ")} tone="slate" />}
            {draft.isMultiselect && (
              <span className="inline-block rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">multiselect</span>
            )}
          </div>
          {!editing && (
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <p className="font-semibold text-slate-700">Answer set</p>
                <p>{sortedChoices.length} choices · {hasCorrect ? "keyed" : "missing correct answer"}</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <p className="font-semibold text-slate-700">References</p>
                <p>{draft.formulaRef ? draft.formulaRef : "No formula ref"}{draft.sourceRef ? ` · ${draft.sourceRef}` : ""}</p>
              </div>
            </div>
          )}
        </div>

        {/* Question text */}
        <div className="px-4 py-3">
          {editing ? (
            <div>
              <label className="admin-label">Question text</label>
              <textarea
                className="admin-input min-h-24 text-sm leading-relaxed"
                value={draft.questionText}
                onChange={(e) => setDraft((p) => ({ ...p, questionText: e.target.value }))}
              />
            </div>
          ) : (
            <p className="text-sm text-slate-900 leading-relaxed">{draft.questionText}</p>
          )}
        </div>

        {/* Metadata fields when editing */}
        {editing && (
          <div className="px-4 py-3 space-y-3">
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
                <input className="admin-input" value={draft.domain} onChange={(e) => setDraft((p) => ({ ...p, domain: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {/* Answer choices */}
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Answer choices {!hasCorrect && <span className="text-amber-500">(no correct answer)</span>}
            </p>
            {editing && (
              <button
                type="button"
                onClick={doShuffleChoices}
                className="flex items-center gap-1 rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 hover:bg-purple-100"
                title="Randomly reorder answer choices"
              >
                <Icons.Shuffle size={10} />
                Shuffle
              </button>
            )}
          </div>
          {sortedChoices.map((choice, idx) => (
            <div key={choice.id} className={cn(
              "rounded-lg border px-3 py-2.5",
              choice.isCorrect ? "border-emerald-200 bg-emerald-50" : "border-slate-100 bg-slate-50"
            )}>
              {editing ? (
                <div className="flex items-start gap-2">
                  {/* Up/down reorder */}
                  <div className="flex flex-col gap-0.5 shrink-0 mt-0.5">
                    <button
                      type="button"
                      onClick={() => moveChoice(idx, -1)}
                      disabled={idx === 0}
                      className="flex h-4 w-4 items-center justify-center rounded text-slate-300 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-20"
                      title="Move up"
                    >
                      <Icons.ChevronUp size={10} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveChoice(idx, 1)}
                      disabled={idx === sortedChoices.length - 1}
                      className="flex h-4 w-4 items-center justify-center rounded text-slate-300 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-20"
                      title="Move down"
                    >
                      <Icons.ChevronDown size={10} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCorrect(choice.id)}
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      choice.isCorrect ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 hover:border-emerald-400"
                    )}
                  >
                    {choice.isCorrect && <Icons.Check size={10} />}
                  </button>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-400">{choice.letter}.</span>
                      <input
                        className="admin-input text-xs flex-1"
                        value={choice.choiceText}
                        onChange={(e) => updateChoice(choice.id, "choiceText", e.target.value)}
                      />
                    </div>
                    <input
                      className="admin-input text-xs text-slate-500 w-full"
                      value={choice.explanation ?? ""}
                      onChange={(e) => updateChoice(choice.id, "explanation", e.target.value || null)}
                      placeholder="Explanation (shown after answering)…"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <span className={cn("shrink-0 text-xs font-bold", choice.isCorrect ? "text-emerald-600" : "text-slate-400")}>
                    {choice.letter}.
                  </span>
                  <div className="min-w-0">
                    <p className={cn("text-sm", choice.isCorrect ? "font-semibold text-emerald-800" : "text-slate-700")}>
                      {choice.choiceText}
                    </p>
                    {choice.isCorrect && choice.explanation && (
                      <p className="mt-1 text-xs italic text-emerald-600">{choice.explanation}</p>
                    )}
                  </div>
                  {choice.isCorrect && <Icons.Check size={13} className="shrink-0 mt-0.5 text-emerald-500 ml-auto" />}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Rationale / Calculation / Source */}
        {(draft.rationale || draft.calculation || draft.sourceRef || editing) && (
          <div className="px-4 py-3 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Supporting info</p>
            {editing ? (
              <>
                <div>
                  <label className="admin-label">Rationale / Explanation</label>
                  <textarea className="admin-input min-h-14 text-xs" value={draft.rationale ?? ""} onChange={(e) => setDraft((p) => ({ ...p, rationale: e.target.value || null }))} placeholder="Why this is the correct answer…" />
                </div>
                <div>
                  <label className="admin-label">Calculation steps</label>
                  <textarea className="admin-input min-h-12 text-xs font-mono" value={draft.calculation ?? ""} onChange={(e) => setDraft((p) => ({ ...p, calculation: e.target.value || null }))} placeholder="Step-by-step math…" />
                </div>
                <div>
                  <label className="admin-label">Source reference</label>
                  <input className="admin-input text-xs" value={draft.sourceRef ?? ""} onChange={(e) => setDraft((p) => ({ ...p, sourceRef: e.target.value || null }))} placeholder="e.g. USPAP 2024 Standard 6" />
                </div>
              </>
            ) : (
              <>
                {draft.rationale && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-400 mb-1">Rationale</p>
                    <p className="text-xs text-slate-700 leading-relaxed">{draft.rationale}</p>
                  </div>
                )}
                {draft.calculation && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-400 mb-1">Calculation</p>
                    <p className="text-xs text-slate-700 font-mono whitespace-pre-wrap">{draft.calculation}</p>
                  </div>
                )}
                {draft.sourceRef && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-400 mb-1">Source</p>
                    <p className="text-xs text-slate-700">{draft.sourceRef}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Edit actions */}
        {editing && (
          <div className="flex gap-2 px-4 py-3">
            <button type="button" onClick={save} disabled={busy} className="admin-action flex items-center gap-1.5 text-xs">
              {busy ? <Icons.Loader size={12} className="animate-spin" /> : <Icons.Check size={12} />}
              Save
            </button>
            <button type="button" onClick={resetDraft} className="admin-action secondary text-xs">Cancel</button>
          </div>
        )}

        {/* Status change */}
        {!editing && (
          <div className="px-4 py-3">
            <label className="admin-label">Status</label>
            <div className="flex gap-2 mt-1">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStatusChange(s)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors",
                    (draft.status === s) ? (STATUS_CLASSES[s] ?? "bg-slate-200 text-slate-700") + " ring-1 ring-slate-400/40 ring-offset-1" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to quiz */}
        {!editing && quizzes.length > 0 && (
          <div className="px-4 py-3 space-y-2">
            <label className="admin-label">Add to quiz</label>
            <div className="flex gap-2">
              <select className="admin-input flex-1 text-xs" value={addToQuizId} onChange={(e) => setAddToQuizId(e.target.value)}>
                {quizzes.map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
              </select>
              <button type="button" onClick={addToQuiz} disabled={addingToQuiz} className="admin-action secondary text-xs flex items-center gap-1">
                {addingToQuiz ? <Icons.Loader size={11} className="animate-spin" /> : <Icons.Plus size={11} />}
                Add
              </button>
            </div>
          </div>
        )}

        {/* Formula ref */}
        {draft.formulaRef && (
          <div className="px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Formula ref</p>
            <p className="text-xs font-mono text-slate-600">{draft.formulaRef}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CLASSES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  review: "bg-amber-100 text-amber-700",
  published: "bg-emerald-100 text-emerald-700",
  archived: "bg-red-100 text-red-600",
};

function QuestionStatCard({
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

function MetaChip({
  label,
  tone,
}: {
  label: string;
  tone: "amber" | "blue" | "purple" | "slate";
}) {
  const tones: Record<string, string> = {
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-[#E6F1FB] text-[#185FA5]",
    purple: "bg-purple-100 text-purple-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", tones[tone])}>
      {label}
    </span>
  );
}

function DomainBadge({ domain }: { domain: string }) {
  const map: Record<string, string> = { math: "bg-blue-50 text-blue-700", appraisal: "bg-purple-50 text-purple-700", law: "bg-amber-50 text-amber-700", philly: "bg-emerald-50 text-emerald-700", admin: "bg-slate-100 text-slate-600", ethics: "bg-rose-50 text-rose-700" };
  return <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize", map[domain] ?? "bg-slate-100 text-slate-500")}>{domain}</span>;
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const map: Record<string, string> = { easy: "bg-green-50 text-green-700", proficient: "bg-yellow-50 text-yellow-700", expert: "bg-red-50 text-red-700" };
  return <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize", map[difficulty] ?? "bg-slate-100 text-slate-500")}>{difficulty}</span>;
}

function PageBtn({ label, onClick, disabled, active }: { label: string; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cn("h-7 min-w-[1.75rem] rounded px-1.5 text-xs font-medium transition-colors", active ? "bg-[#185FA5] text-white" : "text-slate-600 hover:bg-slate-100", disabled && "cursor-not-allowed opacity-40")}>
      {label}
    </button>
  );
}
