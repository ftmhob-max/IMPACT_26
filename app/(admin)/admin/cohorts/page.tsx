import { adminDcQuery } from "@/lib/firebase/admin-dc";

async function getCohortStats() {
  const data = await adminDcQuery<{ quizAttempts: any[] }>("AdminCohortStats").catch(() => ({
    quizAttempts: [],
  }));
  return data.quizAttempts;
}

export default async function CohortStatsPage() {
  const attempts = await getCohortStats();

  const passRate = attempts.length
    ? Math.round((attempts.filter((attempt: { passed: boolean }) => attempt.passed).length / attempts.length) * 100)
    : null;

  const avgScore = attempts.length
    ? (
        attempts.reduce((sum: number, attempt: { scorePct: number | null }) => sum + (attempt.scorePct ?? 0), 0) /
        attempts.length
      ).toFixed(1)
    : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cohort Performance</h1>
          <p className="mt-1 text-sm text-slate-500">Aggregate learner statistics and exportable attempt history.</p>
        </div>
        <div className="flex gap-2">
          <a className="admin-action secondary" href="/api/admin/analytics/export?kind=questions">Question export</a>
          <a className="admin-action" href="/api/admin/analytics/export?kind=attempts">Attempt export</a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Attempts" value={String(attempts.length)} />
        <StatCard label="Pass Rate" value={passRate != null ? `${passRate}%` : "-"} />
        <StatCard label="Average Score" value={avgScore != null ? `${avgScore}%` : "-"} />
      </div>

      {attempts.length === 0 ? (
        <div className="rounded-lg border border-slate-100 bg-white p-12 text-center">
          <p className="text-sm text-slate-400">No completed attempts yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm">
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
                {attempts.map((attempt: any) => (
                  <tr key={attempt.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">{attempt.user.fullName ?? attempt.user.email}</p>
                      {attempt.user.fullName && (
                        <p className="text-xs text-slate-400">{attempt.user.email}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{attempt.quiz.title}</td>
                    <td className="px-4 py-3 font-mono">{attempt.scorePct?.toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${attempt.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {attempt.passed ? "Pass" : "Fail"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(attempt.completedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}
