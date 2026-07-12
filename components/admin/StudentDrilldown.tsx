"use client";

// Front-end: per-student drill-down. Shows a learner's profile, engagement,
// per-domain accuracy, course progress, and completed-attempt history. Each
// attempt expands to a teacher-side review fetched on demand.

import Link from "next/link";
import { useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { toast } from "@/components/admin/AdminFeedback";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { AttemptReview, LearnerProfile } from "@/lib/admin/student-drilldown";

interface StudentDrilldownProps {
  profile: LearnerProfile;
  cohortId: string;
  cohortName: string;
  userId: string;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

export function StudentDrilldown({ profile, cohortId, cohortName, userId }: StudentDrilldownProps) {
  const displayName = profile.user?.fullName ?? profile.user?.email ?? userId;

  const summaryCards: Array<{ label: string; value: string }> = [
    { label: "Attempts", value: String(profile.attemptCount) },
    {
      label: "Avg score",
      value: profile.averageScorePct === null ? "—" : `${profile.averageScorePct}%`,
    },
    { label: "Pass rate", value: profile.passRatePct === null ? "—" : `${profile.passRatePct}%` },
    { label: "Lessons done", value: String(profile.lessonsCompleted) },
    {
      label: "Courses done",
      value: `${profile.coursesCompleted}/${profile.coursesEnrolled}`,
    },
    { label: "Current streak", value: `${profile.currentStreakDays}d` },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-4 py-5 sm:px-6 sm:py-8">
      <Link
        href={`/admin/cohorts?cohortId=${cohortId}`}
        className="inline-flex items-center gap-1 text-xs font-medium text-[#185FA5] hover:underline"
      >
        <Icons.ChevronLeft size={14} />
        Back to {cohortName}
      </Link>

      <AdminPageHeader
        icon={<Icons.User size={20} />}
        eyebrow="Student Drill-down"
        title={displayName}
        description={
          profile.user?.email
            ? `${profile.user.email} · Last active ${formatDate(profile.lastActiveDate)}`
            : `Last active ${formatDate(profile.lastActiveDate)}`
        }
      />

      {/* Summary cards */}
      <div className="grid gap-3 min-[420px]:grid-cols-3 sm:grid-cols-6">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-black/10 bg-white px-3 py-2.5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{card.label}</p>
            <p className="mt-0.5 text-xl font-extrabold tabular-nums text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Per-domain accuracy */}
      <div className="rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Domain Accuracy</h2>
        </div>
        {profile.domains.length === 0 ? (
          <EmptyState title="No answered questions yet." />
        ) : (
          <div className="space-y-3 p-5">
            {profile.domains.map((domain) => (
              <div key={domain.domain}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium capitalize text-slate-700">{domain.domain}</span>
                  <span className="tabular-nums text-slate-500">
                    {domain.correct}/{domain.total} · {domain.accuracyPct}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      domain.accuracyPct >= 70
                        ? "bg-emerald-500"
                        : domain.accuracyPct >= 50
                          ? "bg-amber-500"
                          : "bg-red-500",
                    )}
                    style={{ width: `${domain.accuracyPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Courses */}
      <div className="rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Course Progress</h2>
        </div>
        {profile.courses.length === 0 ? (
          <EmptyState title="Not enrolled in any courses yet." />
        ) : (
          <div className="divide-y divide-slate-50">
            {profile.courses.map((course) => (
              <div key={course.courseId} className="flex items-center justify-between px-5 py-3">
                <span className="min-w-0 truncate text-sm text-slate-700">{course.title}</span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    course.completed
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500",
                  )}
                >
                  {course.completed ? "Completed" : "In progress"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attempt history */}
      <div className="rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Attempt History</h2>
        </div>
        {profile.attempts.length === 0 ? (
          <EmptyState title="No completed attempts yet." />
        ) : (
          <div className="divide-y divide-slate-50">
            {profile.attempts.map((attempt) => (
              <AttemptRow key={attempt.id} attempt={attempt} userId={userId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Expandable attempt row with on-demand review ─────────────────────────────

function AttemptRow({
  attempt,
  userId,
}: {
  attempt: LearnerProfile["attempts"][number];
  userId: string;
}) {
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState<AttemptReview | null>(null);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next && !review) {
      setLoading(true);
      const res = await fetch(`/api/admin/students/${userId}/attempts/${attempt.id}`, {
        cache: "no-store",
      });
      setLoading(false);
      if (res.ok) setReview((await res.json()).review ?? null);
      else toast("error", "Unable to load attempt review.");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-slate-50"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-800">{attempt.quizTitle}</p>
          <p className="text-xs text-slate-400">{formatDate(attempt.completedAt)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="tabular-nums text-sm font-semibold text-slate-700">
            {attempt.scorePct === null ? "—" : `${attempt.scorePct}%`}
          </span>
          {attempt.passed !== null && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                attempt.passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
              )}
            >
              {attempt.passed ? "Pass" : "Fail"}
            </span>
          )}
          <Icons.ChevronDown
            size={16}
            className={cn("text-slate-400 transition-transform", open && "rotate-180")}
          />
        </div>
      </button>

      {open && (
        <div className="space-y-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4">
          {loading ? (
            <div className="space-y-2">
              <div className="admin-skeleton h-4 w-3/4" />
              <div className="admin-skeleton h-4 w-1/2" />
            </div>
          ) : !review ? (
            <p className="text-xs text-slate-400">No review data available.</p>
          ) : (
            review.questions.map((question, index) => (
              <div key={question.questionId || index} className="rounded-lg border border-slate-100 bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800">
                    {index + 1}. {question.questionText}
                  </p>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      question.isCorrect === true
                        ? "bg-emerald-100 text-emerald-700"
                        : question.isCorrect === false
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {question.isCorrect === true
                      ? "Correct"
                      : question.isCorrect === false
                        ? "Incorrect"
                        : "Unanswered"}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  {question.choices.map((choice) => {
                    const selected = question.selectedLetters.includes(choice.letter);
                    return (
                      <div
                        key={choice.letter}
                        className={cn(
                          "flex items-center gap-2 rounded px-2 py-1 text-xs",
                          choice.isCorrect && "bg-emerald-50 text-emerald-800",
                          selected && !choice.isCorrect && "bg-red-50 text-red-700",
                        )}
                      >
                        <span className="font-semibold">{choice.letter}.</span>
                        <span className="min-w-0 flex-1">{choice.text}</span>
                        {choice.isCorrect && <Icons.Check size={12} className="shrink-0" />}
                        {selected && <span className="text-[10px] font-semibold">chosen</span>}
                      </div>
                    );
                  })}
                </div>
                {question.rationale && (
                  <p className="mt-2 text-xs leading-5 text-slate-500">{question.rationale}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
