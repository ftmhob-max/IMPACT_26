// Front-end learner momentum summary: components/platform/StudyMomentum.tsx

import * as Icons from "@/components/ui/Icons";
import { SectionPanel, StatusBadge } from "@/components/ui/LearnerPrimitives";
import type { StudyRhythmData } from "@/lib/firebase/study-rhythm";

export function StudyMomentum({ studyRhythm }: { studyRhythm: StudyRhythmData }) {
  const earnedBadges = studyRhythm.badges.filter((badge) => badge.earned);
  const latestActivityLabel = studyRhythm.lastActivityAt
    ? new Date(studyRhythm.lastActivityAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Start studying";

  return (
    <SectionPanel
      className="mb-6"
      title="Study momentum"
      description="Your UTC-day study rhythm and earned milestones."
    >
      <div className="grid gap-px bg-slate-100 sm:grid-cols-3">
        <MomentumMetric label="Current streak" value={`${studyRhythm.currentStreak} days`} />
        <MomentumMetric label="Longest streak" value={`${studyRhythm.longestStreak} days`} />
        <MomentumMetric label="Last activity" value={latestActivityLabel} />
      </div>
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-2">
          <Icons.Award size={18} className="text-[#185FA5]" />
          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-slate-600">
            Badges
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {studyRhythm.badges.map((badge) => (
            <StatusBadge key={badge.id} tone={badge.earned ? "green" : "slate"}>
              {badge.label}
            </StatusBadge>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {earnedBadges.length} of {studyRhythm.badges.length} badges earned
          {studyRhythm.completedCourseCount > 0
            ? ` · ${studyRhythm.completedCourseCount} course completed`
            : ""}
        </p>
      </div>
    </SectionPanel>
  );
}

function MomentumMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
