import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { DomainBadge } from "@/components/ui/DomainBadge";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";

async function getCohortStats() {
  const data = await adminDcQuery<{ quizAttempts: any[] }>("AdminCohortStats").catch(() => ({
    quizAttempts: [],
  }));
  return data.quizAttempts;
}

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

// ─── Computation helpers ──────────────────────────────────────────────────────

function computeQuestionStats(attempts: any[]): QuestionStat[] {
  const map = new Map<string, { questionText: string; domain: string; difficulty: string; topicTags: string; attempts: number; correct: number }>();
  for (const a of attempts) {
    for (const r of a.quizResponses_on_attempt ?? []) {
      const q = r.question;
      if (!q?.id) continue;
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CohortStatsPage() {
  const attempts = await getCohortStats();
  const questionStats = computeQuestionStats(attempts);
  const studentStats = computeStudentStats(attempts);
  const domainStats = computeDomainStats(attempts);

  const passRate = attempts.length ? Math.round((attempts.filter((a: any) => a.passed).length / attempts.length) * 100) : null;
  const avgScore = attempts.length ? (attempts.reduce((s: number, a: any) => s + (a.scorePct ?? 0), 0) / attempts.length).toFixed(1) : null;
  const tooEasyCount = questionStats.filter((q) => q.calibration === "too-easy").length;
  const tooHardCount = questionStats.filter((q) => q.calibration === "too-hard").length;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-5 sm:space-y-8 sm:px-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cohort Performance</h1>
          <p className="mt-1 text-sm text-slate-500">Aggregate learner statistics and exportable attempt history.</p>
        </div>
        <div className="flex flex-col gap-2 min-[380px]:flex-row">
          <a className="admin-action secondary" href="/api/admin/analytics/export?kind=questions">Question export</a>
          <a className="admin-action" href="/api/admin/analytics/export?kind=attempts">Attempt export</a>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Attempts" value={String(attempts.length)} />
        <StatCard label="Unique Learners" value={String(studentStats.length)} />
        <StatCard label="Pass Rate" value={passRate != null ? `${passRate}%` : "—"} />
        <StatCard label="Average Score" value={avgScore != null ? `${avgScore}%` : "—"} />
      </div>

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
                    <td className="px-4 py-3">
                      <DomainBadge domain={d.domain} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-slate-600">{d.responses}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-slate-600">{d.correct}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-2 rounded-full transition-all ${d.correctRate < 50 ? "bg-red-400" : d.correctRate < 70 ? "bg-amber-400" : "bg-emerald-400"}`}
                            style={{ width: `${d.correctRate}%` }}
                          />
                        </div>
                        <span className="w-9 text-right font-mono text-sm font-semibold text-slate-700">{d.correctRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Student performance */}
      {studentStats.length > 0 && (
        <Section title="Learner Leaderboard" description="All learners who have completed at least one attempt, ranked by average score.">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Learner</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Attempts</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Pass rate</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Avg score</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hidden sm:table-cell">Last active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {studentStats.map((s, i) => (
                  <tr key={s.userId} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-800">{s.fullName ?? s.email}</p>
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
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-1.5 rounded-full ${s.avgScore >= 70 ? "bg-emerald-400" : s.avgScore >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                            style={{ width: `${s.avgScore}%` }}
                          />
                        </div>
                        <span className="w-9 text-right font-mono text-sm font-semibold text-slate-700">{s.avgScore}%</span>
                      </div>
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
      {attempts.length === 0 ? (
        <div className="rounded-lg border border-slate-100 bg-white p-12 text-center">
          <p className="text-sm text-slate-400">No completed attempts yet.</p>
        </div>
      ) : (
        <Section title="Attempt History" description="Every completed quiz attempt across all learners.">
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
                {attempts.map((a: any) => (
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
      )}

      {/* Question difficulty analysis */}
      {questionStats.length > 0 && (
        <Section
          title="Question Difficulty Analysis"
          description={`${questionStats.length} questions · ${tooEasyCount > 0 ? `${tooEasyCount} too easy · ` : ""}${tooHardCount > 0 ? `${tooHardCount} too hard · ` : ""}sorted hardest first`}
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
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Domain</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Difficulty</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Attempts</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 w-44">Correct rate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Calibration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {questionStats.map((q) => (
                  <tr key={q.id} className={`hover:bg-slate-50 ${q.calibration !== "calibrated" ? "bg-amber-50/30" : ""}`}>
                    <td className="max-w-xs px-4 py-3">
                      <p className="line-clamp-2 text-sm text-slate-700">{q.questionText}</p>
                      {q.topicTags && <p className="mt-0.5 text-xs text-slate-400">{q.topicTags}</p>}
                    </td>
                    <td className="px-4 py-3"><DomainBadge domain={q.domain} /></td>
                    <td className="px-4 py-3"><DifficultyBadge difficulty={q.difficulty} /></td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-slate-600">{q.attemptCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-1.5 rounded-full ${q.correctRate > 90 ? "bg-amber-400" : q.correctRate < 20 ? "bg-red-400" : "bg-emerald-400"}`}
                            style={{ width: `${q.correctRate}%` }}
                          />
                        </div>
                        <span className="w-10 text-right font-mono text-sm font-semibold text-slate-700">{q.correctRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><CalibrationBadge calibration={q.calibration} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}

function Section({ title, description, headerRight, children }: { title: string; description?: string; headerRight?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm">
      <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
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

function CalibrationBadge({ calibration }: { calibration: "too-easy" | "calibrated" | "too-hard" }) {
  if (calibration === "too-easy") return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">Too Easy</span>;
  if (calibration === "too-hard") return <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">Too Hard</span>;
  return <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Calibrated</span>;
}
