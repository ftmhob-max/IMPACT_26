// Front-end: cohort engagement table (course completion, lessons, streaks).
// Rendered on the server from pre-aggregated rows and passed into the client
// CohortStatsView as a slot. When a cohortId is provided, learner names link to
// the per-student drill-down.

import Link from "next/link";
import * as Icons from "@/components/ui/Icons";
import { EmptyState } from "@/components/admin/EmptyState";
import type { LearnerEngagement } from "@/lib/admin/cohort-analytics";

interface CohortEngagementPanelProps {
  rows: LearnerEngagement[];
  cohortId?: string | null;
}

export function CohortEngagementPanel({ rows, cohortId }: CohortEngagementPanelProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">Learner Engagement</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Course completion, lessons finished, and study streaks across the selected learners.
        </p>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<Icons.TrendingUp size={36} />}
          title="No engagement data yet"
          hint="Add learners to a cohort, or wait for learners to start progressing through courses."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Learner</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Courses done</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Lessons done</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Current streak</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Longest streak</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Last active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((row) => (
                <tr key={row.userId} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    {cohortId ? (
                      <Link
                        href={`/admin/cohorts/${cohortId}/students/${row.userId}`}
                        className="font-medium text-[#185FA5] hover:underline"
                      >
                        {row.fullName ?? row.email ?? row.userId}
                      </Link>
                    ) : (
                      <span className="font-medium text-slate-800">
                        {row.fullName ?? row.email ?? row.userId}
                      </span>
                    )}
                    {row.fullName && row.email && (
                      <p className="truncate text-xs text-slate-400">{row.email}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-slate-600">
                    {row.coursesCompleted}
                    <span className="text-slate-400">/{row.coursesEnrolled}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-slate-600">{row.lessonsCompleted}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-slate-700">
                    {row.currentStreakDays}d
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-slate-600">{row.longestStreakDays}d</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{row.lastActiveDate ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
