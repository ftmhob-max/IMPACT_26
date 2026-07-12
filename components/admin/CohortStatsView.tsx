"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { DomainBadge } from "@/components/ui/DomainBadge";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";

// ─── Derived types ────────────────────────────────────────────────────────────

interface QuestionStat {
  id: string;
  questionText: string;
  domain: string;
  difficulty: string;
  topicTags: string;
  attemptCount: number;
  correctCount: number;
  correctRate: number;
  calibration: "too-easy" | "calibrated" | "too-hard";
}

interface StudentStat {
  userId: string;
  email: string;
  fullName: string | null;
  totalAttempts: number;
  passCount: number;
  passRate: number;
  avgScore: number;
  lastActive: string | null;
}

interface DomainStat {
  domain: string;
  responses: number;
  correct: number;
  correctRate: number;
}

// ─── Computation helpers (client-side so filters recompute without refetch) ───

function computeQuestionStats(attempts: any[], domainFilter: string): QuestionStat[] {
  const map = new Map<string, { questionText: string; domain: string; difficulty: string; topicTags: string; attempts: number; correct: number }>();
  for (const a of attempts) {
    for (const r of a.quizResponses_on_attempt ?? []) {
      const q = r.question;
      if (!q?.id) continue;
      if (domainFilter && q.domain !== domainFilter) continue;
      const s = map.get(q.id);
      if (s) { s.attempts++; if (r.isCorrect) s.correct++; }
      else map.set(q.id, { questionText: q.questionText ?? "", domain: q.domain ?? "", difficulty: q.difficulty ?? "", topicTags: q.topicTags ?? "", attempts: 1, correct: r.isCorrect ? 1 : 0 });
    }
  }
  return Array.from(map.entries())
    .map(([id, v]) => {
      const rate = v.attempts > 0 ? (v.correct / v.attempts) * 100 : 0;
      return { id, ...v, attemptCount: v.attempts, correctCount: v.correct, correctRate: Math.round(rate), calibration: (rate > 90 ? "too-easy" : rate < 20 ? "too-hard" : "calibrated") as QuestionStat["calibration"] };
    })
    .sort((a, b) => a.correctRate - b.correctRate);
}

function computeStudentStats(attempts: any[]): StudentStat[] {
  const map = new Map<string, { email: string; fullName: string | null; scores: number[]; passes: number; lastActive: string | null }>();
  for (const a of attempts) {
    const uid = a.user?.id;
    if (!uid) continue;
    const s = map.get(uid);
    if (s) {
      s.scores.push(a.scorePct ?? 0);
      if (a.passed) s.passes++;
      if (!s.lastActive || (a.completedAt && a.completedAt > s.lastActive)) s.lastActive = a.completedAt;
    } else {
      map.set(uid, { email: a.user.email ?? "", fullName: a.user.fullName ?? null, scores: [a.scorePct ?? 0], passes: a.passed ? 1 : 0, lastActive: a.completedAt ?? null });
    }
  }
  return Array.from(map.entries())
    .map(([userId, v]) => ({
      userId,
      email: v.email,
      fullName: v.fullName,
      totalAttempts: v.scores.length,
      passCount: v.passes,
      passRate: v.scores.length > 0 ? Math.round((v.passes / v.scores.length) * 100) : 0,
      avgScore: v.scores.length > 0 ? Math.round(v.scores.reduce((s, x) => s + x, 0) / v.scores.length) : 0,
      lastActive: v.lastActive,
    }))
    .sort((a, b) => b.avgScore - a.avgScore);
}

function computeDomainStats(attempts: any[]): DomainStat[] {
  const map = new Map<string, { responses: number; correct: number }>();
  for (const a of attempts) {
    for (const r of a.quizResponses_on_attempt ?? []) {
      const domain = r.question?.domain;
      if (!domain) continue;
      const s = map.get(domain);
      if (s) { s.responses++; if (r.isCorrect) s.correct++; }
      else map.set(domain, { responses: 1, correct: r.isCorrect ? 1 : 0 });
    }
  }
  return Array.from(map.entries())
    .map(([domain, v]) => ({ domain, ...v, correctRate: v.responses > 0 ? Math.round((v.correct / v.responses) * 100) : 0 }))
    .sort((a, b) => a.correctRate - b.correctRate);
}

// ─── Sorting ──────────────────────────────────────────────────────────────────

type SortDir = "asc" | "desc";

function useSort<T>(rows: T[], defaultKey: string, accessors: Record<string, (row: T) => string | number | null>) {
  const [sortKey, setSortKey] = useState(defaultKey);
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const acc = accessors[sortKey];
    if (!acc) return rows;
    return [...rows].sort((a, b) => {
      const av = acc(a);
      const bv = acc(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, sortKey, sortDir]);

  function toggle(key: string) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  return { sorted, sortKey, sortDir, toggle };
}

function SortableTh({
  label,
  sortId,
  activeKey,
  dir,
  onToggle,
  align = "left",
  className,
}: {
  label: string;
  sortId: string;
  activeKey: string;
  dir: SortDir;
  onToggle: (key: string) => void;
  align?: "left" | "right";
  className?: string;
}) {
  const active = activeKey === sortId;
  return (
    <th className={cn("px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500", align === "right" ? "text-right" : "text-left", className)}>
      <button
        type="button"
        onClick={() => onToggle(sortId)}
        className={cn(
          "inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-slate-800",
          active && "text-[#185FA5]"
        )}
      >
        {label}
        {active && (dir === "asc" ? <Icons.ArrowUp size={11} /> : <Icons.ArrowDown size={11} />)}
      </button>
    </th>
  );
}

// ─── Filters ──────────────────────────────────────────────────────────────────

const DATE_RANGES = [
  { id: "7", label: "Last 7 days", days: 7 },
  { id: "30", label: "Last 30 days", days: 30 },
  { id: "90", label: "Last 90 days", days: 90 },
  { id: "all", label: "All time", days: null },
] as const;

const MAX_HISTORY_ROWS = 100;

// ─── Main view ────────────────────────────────────────────────────────────────

interface CohortOption {
  id: string;
  name: string;
}

export function CohortStatsView({
  attempts,
  truncated,
  cohortOptions = [],
  selectedCohortId = null,
  scopeLabel,
  engagement,
}: {
  attempts: any[];
  truncated?: boolean;
  cohortOptions?: CohortOption[];
  selectedCohortId?: string | null;
  scopeLabel?: string;
  engagement?: ReactNode;
}) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<string>("all");
  const [domainFilter, setDomainFilter] = useState<string>("");

  // Cohort scope drives the URL (?cohortId=) so server data reloads on change.
  const exportSuffix = selectedCohortId ? `&cohortId=${selectedCohortId}` : "";
  function onCohortChange(next: string) {
    router.push(next ? `/admin/cohorts?cohortId=${next}` : "/admin/cohorts");
  }

  const allDomains = useMemo(() => {
    const set = new Set<string>();
    for (const a of attempts) {
      for (const r of a.quizResponses_on_attempt ?? []) {
        if (r.question?.domain) set.add(r.question.domain);
      }
    }
    return [...set].sort();
  }, [attempts]);

  const filteredAttempts = useMemo(() => {
    const range = DATE_RANGES.find((r) => r.id === dateRange);
    if (!range?.days) return attempts;
    const cutoff = Date.now() - range.days * 86_400_000;
    return attempts.filter((a) => a.completedAt && new Date(a.completedAt).getTime() >= cutoff);
  }, [attempts, dateRange]);

  const questionStats = useMemo(() => computeQuestionStats(filteredAttempts, domainFilter), [filteredAttempts, domainFilter]);
  const studentStats = useMemo(() => computeStudentStats(filteredAttempts), [filteredAttempts]);
  const domainStats = useMemo(() => computeDomainStats(filteredAttempts), [filteredAttempts]);

  const passRate = filteredAttempts.length ? Math.round((filteredAttempts.filter((a: any) => a.passed).length / filteredAttempts.length) * 100) : null;
  const avgScore = filteredAttempts.length ? (filteredAttempts.reduce((s: number, a: any) => s + (a.scorePct ?? 0), 0) / filteredAttempts.length).toFixed(1) : null;
  const tooEasyCount = questionStats.filter((q) => q.calibration === "too-easy").length;
  const tooHardCount = questionStats.filter((q) => q.calibration === "too-hard").length;

  const leaderboard = useSort(studentStats, "avgScore", {
    learner: (s) => s.fullName ?? s.email,
    attempts: (s) => s.totalAttempts,
    passRate: (s) => s.passRate,
    avgScore: (s) => s.avgScore,
    lastActive: (s) => s.lastActive,
  });

  const calibration = useSort(questionStats, "correctRate", {
    domain: (q) => q.domain,
    difficulty: (q) => q.difficulty,
    attempts: (q) => q.attemptCount,
    correctRate: (q) => q.correctRate,
  });

  const recentAttempts = useMemo(
    () =>
      [...filteredAttempts]
        .sort((a, b) => new Date(b.completedAt ?? 0).getTime() - new Date(a.completedAt ?? 0).getTime())
        .slice(0, MAX_HISTORY_ROWS),
    [filteredAttempts]
  );

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:space-y-6 sm:px-6 sm:py-8">
      <AdminPageHeader
        icon={<Icons.BarChart3 size={20} />}
        eyebrow="Teacher Portal"
        title="Cohort Performance"
        description={
          scopeLabel
            ? `Aggregate learner statistics for ${scopeLabel} — question calibration and exportable attempt history.`
            : "Aggregate learner statistics, question calibration, and exportable attempt history."
        }
      />

      {/* Cohort scope selector */}
      {cohortOptions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <label className="admin-label" htmlFor="cohort-scope">Cohort</label>
          <select
            id="cohort-scope"
            className="admin-input !w-auto py-1.5 text-xs"
            value={selectedCohortId ?? ""}
            onChange={(e) => onCohortChange(e.target.value)}
          >
            <option value="">All learners</option>
            {cohortOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Filters + exports */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setDomainFilter("")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              domainFilter === ""
                ? "border-[#185FA5] bg-[#185FA5] text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5]"
            )}
          >
            All domains
          </button>
          {allDomains.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDomainFilter(domainFilter === d ? "" : d)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
                domainFilter === d
                  ? "border-[#185FA5] bg-[#185FA5] text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5]"
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <select
          className="admin-input !w-auto py-1.5 text-xs"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          aria-label="Date range"
        >
          {DATE_RANGES.map((r) => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
        <div className="ml-auto flex gap-2">
          <a className="admin-action secondary text-xs" href={`/api/admin/analytics/export?kind=questions${exportSuffix}`}>Question export</a>
          <a className="admin-action text-xs" href={`/api/admin/analytics/export?kind=attempts${exportSuffix}`}>Attempt export</a>
        </div>
      </div>

      {/* Engagement (course completion / lessons / streaks) */}
      {engagement}

      {truncated && (
        <p className="text-[11px] text-slate-400">
          Showing the most recent attempts only — older history is available via the attempt export.
        </p>
      )}

      {/* Summary stat cards */}
      <div className="grid gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Attempts" value={String(filteredAttempts.length)} icon={<Icons.ClipboardList size={15} />} />
        <StatCard label="Unique Learners" value={String(studentStats.length)} icon={<Icons.Users size={15} />} />
        <StatCard label="Pass Rate" value={passRate != null ? `${passRate}%` : "—"} icon={<Icons.Target size={15} />} />
        <StatCard label="Average Score" value={avgScore != null ? `${avgScore}%` : "—"} icon={<Icons.TrendingUp size={15} />} />
      </div>

      {filteredAttempts.length === 0 ? (
        <div className="rounded-xl border border-black/10 bg-white shadow-sm">
          <EmptyState
            icon={<Icons.BarChart3 size={36} />}
            title={attempts.length === 0 ? "No completed attempts yet" : "No attempts in this date range"}
            hint={
              attempts.length === 0
                ? "Stats appear here once learners start completing quizzes."
                : "Try a wider date range to see more history."
            }
          />
        </div>
      ) : (
        <>
          {/* Domain performance */}
          {domainStats.length > 0 && (
            <Section title="Domain Performance" description="Correct-answer rate per assessment domain, weakest first.">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Domain</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Responses</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Correct</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 w-48">Correct rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {domainStats.map((d) => (
                      <tr key={d.domain} className="hover:bg-slate-50">
                        <td className="px-4 py-3"><DomainBadge domain={d.domain} /></td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-slate-600">{d.responses}</td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-slate-600">{d.correct}</td>
                        <td className="px-4 py-3">
                          <RateBar rate={d.correctRate} tone={d.correctRate < 50 ? "red" : d.correctRate < 70 ? "amber" : "emerald"} width="w-28" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* Learner leaderboard */}
          {studentStats.length > 0 && (
            <Section title="Learner Leaderboard" description="All learners who have completed at least one attempt. Click a column to sort.">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <SortableTh label="Learner" sortId="learner" activeKey={leaderboard.sortKey} dir={leaderboard.sortDir} onToggle={leaderboard.toggle} />
                      <SortableTh label="Attempts" sortId="attempts" activeKey={leaderboard.sortKey} dir={leaderboard.sortDir} onToggle={leaderboard.toggle} align="right" />
                      <SortableTh label="Pass rate" sortId="passRate" activeKey={leaderboard.sortKey} dir={leaderboard.sortDir} onToggle={leaderboard.toggle} align="right" />
                      <SortableTh label="Avg score" sortId="avgScore" activeKey={leaderboard.sortKey} dir={leaderboard.sortDir} onToggle={leaderboard.toggle} align="right" />
                      <SortableTh label="Last active" sortId="lastActive" activeKey={leaderboard.sortKey} dir={leaderboard.sortDir} onToggle={leaderboard.toggle} className="hidden sm:table-cell" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {leaderboard.sorted.map((s, i) => (
                      <tr key={s.userId} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                              {i + 1}
                            </span>
                            <div className="min-w-0">
                              {selectedCohortId ? (
                                <Link
                                  href={`/admin/cohorts/${selectedCohortId}/students/${s.userId}`}
                                  className="truncate font-medium text-[#185FA5] hover:underline"
                                >
                                  {s.fullName ?? s.email}
                                </Link>
                              ) : (
                                <p className="truncate font-medium text-slate-800">{s.fullName ?? s.email}</p>
                              )}
                              {s.fullName && <p className="truncate text-xs text-slate-400">{s.email}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-slate-600">{s.totalAttempts}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-mono text-sm font-semibold ${s.passRate >= 70 ? "text-emerald-600" : "text-red-500"}`}>
                            {s.passRate}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <RateBar rate={s.avgScore} tone={s.avgScore >= 70 ? "emerald" : s.avgScore >= 50 ? "amber" : "red"} width="w-16" justify="end" />
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 hidden sm:table-cell">
                          {s.lastActive ? new Date(s.lastActive).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* Attempt history */}
          <Section
            title="Attempt History"
            description={
              filteredAttempts.length > MAX_HISTORY_ROWS
                ? `Showing the latest ${MAX_HISTORY_ROWS} of ${filteredAttempts.length} attempts — use the attempt export for full history.`
                : "Completed quiz attempts, most recent first."
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Quiz</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Result</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentAttempts.map((a: any) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-700">{a.user.fullName ?? a.user.email}</p>
                        {a.user.fullName && <p className="text-xs text-slate-400">{a.user.email}</p>}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{a.quiz.title}</td>
                      <td className="px-4 py-3 font-mono">{a.scorePct?.toFixed(1)}%</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {a.passed ? "Pass" : "Fail"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{new Date(a.completedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Question difficulty analysis */}
          {questionStats.length > 0 && (
            <Section
              title="Question Difficulty Analysis"
              description={`${questionStats.length} questions · ${tooEasyCount > 0 ? `${tooEasyCount} too easy · ` : ""}${tooHardCount > 0 ? `${tooHardCount} too hard · ` : ""}click a column to sort`}
              headerRight={
                <div className="flex gap-2 text-xs">
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-700">&gt;90% Too Easy</span>
                  <span className="rounded-full bg-red-100 px-2.5 py-1 font-semibold text-red-700">&lt;20% Too Hard</span>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Question</th>
                      <SortableTh label="Domain" sortId="domain" activeKey={calibration.sortKey} dir={calibration.sortDir} onToggle={calibration.toggle} />
                      <SortableTh label="Difficulty" sortId="difficulty" activeKey={calibration.sortKey} dir={calibration.sortDir} onToggle={calibration.toggle} />
                      <SortableTh label="Attempts" sortId="attempts" activeKey={calibration.sortKey} dir={calibration.sortDir} onToggle={calibration.toggle} align="right" />
                      <SortableTh label="Correct rate" sortId="correctRate" activeKey={calibration.sortKey} dir={calibration.sortDir} onToggle={calibration.toggle} className="w-44" />
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Calibration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {calibration.sorted.map((q) => (
                      <tr key={q.id} className={`hover:bg-slate-50 ${q.calibration !== "calibrated" ? "bg-amber-50/30" : ""}`}>
                        <td className="max-w-xs px-4 py-3">
                          <p className="line-clamp-2 text-sm text-slate-700">{q.questionText}</p>
                          {q.topicTags && <p className="mt-0.5 text-xs text-slate-400">{q.topicTags}</p>}
                        </td>
                        <td className="px-4 py-3"><DomainBadge domain={q.domain} /></td>
                        <td className="px-4 py-3"><DifficultyBadge difficulty={q.difficulty} /></td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-slate-600">{q.attemptCount}</td>
                        <td className="px-4 py-3">
                          <RateBar rate={q.correctRate} tone={q.correctRate > 90 ? "amber" : q.correctRate < 20 ? "red" : "emerald"} width="w-16" />
                        </td>
                        <td className="px-4 py-3"><CalibrationBadge calibration={q.calibration} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}
        </>
      )}
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        {icon && <span className="text-[#185FA5]/60">{icon}</span>}
      </div>
      <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}

function Section({ title, description, headerRight, children }: { title: string; description?: string; headerRight?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </div>
        {headerRight}
      </div>
      {children}
    </div>
  );
}

function RateBar({ rate, tone, width, justify }: { rate: number; tone: "red" | "amber" | "emerald"; width: string; justify?: "end" }) {
  const toneClass = tone === "red" ? "bg-red-400" : tone === "amber" ? "bg-amber-400" : "bg-emerald-400";
  return (
    <div className={cn("flex items-center gap-2", justify === "end" && "justify-end")}>
      <div className={cn("h-1.5 overflow-hidden rounded-full bg-slate-100", width)}>
        <div className={cn("h-1.5 rounded-full", toneClass)} style={{ width: `${Math.min(100, Math.max(0, rate))}%` }} />
      </div>
      <span className="w-10 text-right font-mono text-sm font-semibold text-slate-700">{rate}%</span>
    </div>
  );
}

function CalibrationBadge({ calibration }: { calibration: "too-easy" | "calibrated" | "too-hard" }) {
  if (calibration === "too-easy") return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">Too Easy</span>;
  if (calibration === "too-hard") return <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">Too Hard</span>;
  return <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Calibrated</span>;
}
