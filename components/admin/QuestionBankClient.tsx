"use client";

import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  createdAt: string;
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

// ─── Component ───────────────────────────────────────────────────────────────

export function QuestionBankClient({ questions, quizzes }: Props) {
  // ── Filters ────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);

  // ── Selection ──────────────────────────────────────────────────────────────
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // ── Bulk action state ──────────────────────────────────────────────────────
  const [bulkStatus, setBulkStatus] = useState("published");
  const [bulkQuizId, setBulkQuizId] = useState(quizzes[0]?.id ?? "");
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<{ ok: boolean; text: string } | null>(null);

  // ── Inline status update ───────────────────────────────────────────────────
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});

  // ── Derived filtered + paginated list ─────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return questions.filter((question) => {
      if (q && !question.questionText.toLowerCase().includes(q) && !(question.topicTags ?? "").toLowerCase().includes(q)) return false;
      if (filterDomain && question.domain !== filterDomain) return false;
      if (filterDifficulty && question.difficulty !== filterDifficulty) return false;
      const effectiveStatus = localStatuses[question.id] ?? question.status;
      if (filterStatus && effectiveStatus !== filterStatus) return false;
      return true;
    });
  }, [questions, search, filterDomain, filterDifficulty, filterStatus, localStatuses]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pageIds = new Set(pageItems.map((q) => q.id));
  const allPageSelected = pageItems.length > 0 && pageItems.every((q) => selected.has(q.id));
  const somePageSelected = pageItems.some((q) => selected.has(q.id));

  // ── Selection handlers ─────────────────────────────────────────────────────
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

  // ── Single question status update ──────────────────────────────────────────
  const updateOneStatus = useCallback(async (id: string, status: string) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: status }));
    await fetch(`/api/admin/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  }, []);

  // ── Bulk operations ────────────────────────────────────────────────────────
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

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          placeholder="Search questions…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="admin-input w-52"
        />
        <select className="admin-input w-36" value={filterDomain} onChange={(e) => { setFilterDomain(e.target.value); setPage(1); }}>
          <option value="">All domains</option>
          {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="admin-input w-36" value={filterDifficulty} onChange={(e) => { setFilterDifficulty(e.target.value); setPage(1); }}>
          <option value="">All difficulties</option>
          {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="admin-input w-32" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="ml-auto text-xs text-slate-400">{filtered.length} of {questions.length} questions</span>
      </div>

      {/* Bulk action bar (shown when ≥1 selected) */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#185FA5]/30 bg-[#E6F1FB] px-4 py-3">
          <span className="text-sm font-semibold text-[#185FA5]">{selected.size} selected</span>
          <button type="button" onClick={clearSelection} className="text-xs text-slate-500 underline hover:text-slate-700">Clear</button>

          <div className="h-4 w-px bg-slate-300" />

          {/* Set status */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600">Set status:</span>
            <select className="admin-input py-1 text-xs" value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              type="button"
              onClick={runBulkStatus}
              disabled={bulkBusy}
              className="rounded bg-slate-700 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              Apply
            </button>
          </div>

          {quizzes.length > 0 && (
            <>
              <div className="h-4 w-px bg-slate-300" />
              {/* Assign to quiz */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">Add to quiz:</span>
                <select className="admin-input py-1 text-xs" value={bulkQuizId} onChange={(e) => setBulkQuizId(e.target.value)}>
                  {quizzes.map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
                </select>
                <button
                  type="button"
                  onClick={runBulkAssign}
                  disabled={bulkBusy}
                  className="rounded bg-[#185FA5] px-3 py-1 text-xs font-semibold text-white hover:bg-[#145082] disabled:opacity-60"
                >
                  Assign
                </button>
              </div>
            </>
          )}

          {bulkBusy && <span className="text-xs text-slate-500">Working…</span>}
        </div>
      )}

      {/* Feedback banner */}
      {bulkMessage && (
        <div className={cn("rounded-md px-4 py-2.5 text-sm font-medium", bulkMessage.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700")}>
          {bulkMessage.text}
          <button type="button" onClick={() => setBulkMessage(null)} className="ml-3 text-xs underline opacity-70 hover:opacity-100">Dismiss</button>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-100 bg-white p-12 text-center text-sm text-slate-400">
          No questions match the current filters.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected; }}
                    onChange={togglePage}
                    className="h-4 w-4 rounded border-slate-300 text-[#185FA5]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Question</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Domain</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Difficulty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hidden lg:table-cell">Formula ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pageItems.map((q) => {
                const effectiveStatus = localStatuses[q.id] ?? q.status;
                return (
                  <tr key={q.id} className={cn("hover:bg-slate-50", selected.has(q.id) && "bg-blue-50/40")}>
                    <td className="w-10 px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(q.id)}
                        onChange={() => toggleOne(q.id)}
                        className="h-4 w-4 rounded border-slate-300 text-[#185FA5]"
                      />
                    </td>
                    <td className="px-4 py-3 max-w-sm">
                      <p className="truncate text-slate-800">{q.questionText}</p>
                      {q.topicTags && (() => {
                        try {
                          const tags = JSON.parse(q.topicTags) as string[];
                          return tags.length > 0 ? <p className="mt-0.5 truncate text-[10px] text-slate-400">{tags.join(" · ")}</p> : null;
                        } catch { return null; }
                      })()}
                    </td>
                    <td className="px-4 py-3"><DomainBadge domain={q.domain} /></td>
                    <td className="px-4 py-3"><DifficultyBadge difficulty={q.difficulty} /></td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <select
                        value={effectiveStatus}
                        onChange={(e) => updateOneStatus(q.id, e.target.value)}
                        className={cn("rounded-full border-0 bg-transparent px-2 py-0.5 text-[10px] font-semibold focus:ring-1 focus:ring-[#185FA5]", STATUS_CLASSES[effectiveStatus] ?? "bg-slate-100 text-slate-600")}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 hidden lg:table-cell">{q.formulaRef ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
              <p className="text-xs text-slate-500">
                Page {currentPage} of {totalPages} · {filtered.length} results
              </p>
              <div className="flex gap-1">
                <PageBtn label="«" disabled={currentPage === 1} onClick={() => setPage(1)} />
                <PageBtn label="‹" disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)} />
                {/* Window of up to 5 page numbers */}
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
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CLASSES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  review: "bg-amber-100 text-amber-700",
  published: "bg-emerald-100 text-emerald-700",
  archived: "bg-red-100 text-red-600",
};

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
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-7 min-w-[1.75rem] rounded px-1.5 text-xs font-medium transition-colors",
        active ? "bg-[#185FA5] text-white" : "text-slate-600 hover:bg-slate-100",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      {label}
    </button>
  );
}
