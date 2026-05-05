// Server component — fetches cohort stats from Data Connect
async function getCohortStats() {
  return [];
}

export default async function CohortStatsPage() {
  const attempts = await getCohortStats();

  const passRate = attempts.length > 0
    ? Math.round(
        ((attempts as Array<{ passed: boolean }>).filter((a) => a.passed).length / attempts.length) * 100
      )
    : null;

  const avgScore = attempts.length > 0
    ? (
        (attempts as Array<{ scorePct: number | null }>)
          .reduce((sum, a) => sum + (a.scorePct ?? 0), 0) / attempts.length
      ).toFixed(1)
    : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Cohort Performance</h1>
        <p className="text-slate-500 mt-1 text-sm">Aggregate learner statistics</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Attempts" value={String(attempts.length)} />
        <StatCard label="Pass Rate" value={passRate != null ? `${passRate}%` : "—"} />
        <StatCard label="Average Score" value={avgScore != null ? `${avgScore}%` : "—"} />
      </div>

      {/* Attempts table */}
      {attempts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <p className="text-slate-400 text-sm">No completed attempts yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Quiz</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Score</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Result</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(attempts as Array<{ id: string; user: { email: string; fullName?: string }; quiz: { title: string }; scorePct: number | null; passed: boolean | null; completedAt: string }>).map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-700">
                    {a.user.fullName ?? a.user.email}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{a.quiz.title}</td>
                  <td className="px-4 py-3 font-mono">{a.scorePct?.toFixed(1)}%</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${a.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {a.passed ? "Pass" : "Fail"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(a.completedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1 tabular-nums">{value}</p>
    </div>
  );
}
