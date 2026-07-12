// Front-end review experience: components/quiz/AttemptReviewClient.tsx
// Fetches the protected completed-attempt payload and presents ordered answer feedback.

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  EmptyState,
  IconTile,
  LearnerPage,
  PageHeader,
  PrimaryAction,
  SectionPanel,
  StatusBadge,
} from "@/components/ui/LearnerPrimitives";
import * as Icons from "@/components/ui/Icons";
import { getIdToken } from "@/lib/firebase/auth";
import type {
  NormalizedAttemptReview,
  NormalizedAttemptReviewChoice,
} from "@/lib/firebase/learner-portal";
import { cn, DIFFICULTIES, DOMAINS } from "@/lib/utils";

interface AttemptReviewClientProps {
  attemptId: string;
}

type ReviewPageState =
  | { status: "loading" }
  | { status: "loaded"; review: NormalizedAttemptReview }
  | { status: "error"; message: string };

export function AttemptReviewClient({ attemptId }: AttemptReviewClientProps) {
  const router = useRouter();
  const [reviewPageState, setReviewPageState] = useState<ReviewPageState>({ status: "loading" });

  const loadAttemptReview = useCallback(async (abortSignal?: AbortSignal) => {
    setReviewPageState({ status: "loading" });

    try {
      const learnerToken = await getIdToken();
      const response = await fetch(`/api/quiz/attempts/${attemptId}/review`, {
        headers: learnerToken ? { Authorization: `Bearer ${learnerToken}` } : {},
        signal: abortSignal,
      });

      if (response.status === 401) {
        router.push(`/sign-in?redirect=${encodeURIComponent(`/quiz/${attemptId}/review`)}`);
        return;
      }

      const responseBody = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!response.ok) {
        throw new Error(responseBody?.error ?? "We could not load this attempt review.");
      }

      setReviewPageState({
        status: "loaded",
        review: responseBody as NormalizedAttemptReview,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setReviewPageState({
        status: "error",
        message: error instanceof Error ? error.message : "We could not load this attempt review.",
      });
    }
  }, [attemptId, router]);

  useEffect(() => {
    const requestController = new AbortController();
    void loadAttemptReview(requestController.signal);
    return () => requestController.abort();
  }, [loadAttemptReview]);

  if (reviewPageState.status === "loading") {
    return <ReviewLoadingState />;
  }

  if (reviewPageState.status === "error") {
    return (
      <LearnerPage width="narrow">
        <PageHeader
          eyebrow="Attempt review"
          title="Review unavailable"
          description={reviewPageState.message}
          backHref="/progress"
          backLabel="Back to progress"
          icon={Icons.AlertCircle}
        />
        <EmptyState
          title="We could not open this review"
          description="The attempt may still be in progress, belong to another account, or be temporarily unavailable."
          action={
            <PrimaryAction onClick={() => void loadAttemptReview()} icon={false}>
              Try again
            </PrimaryAction>
          }
          icon={Icons.AlertTriangle}
        />
      </LearnerPage>
    );
  }

  const { review } = reviewPageState;
  const completedDateLabel = review.completedAt
    ? new Date(review.completedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <LearnerPage width="narrow">
      <PageHeader
        eyebrow="Completed attempt"
        title={review.quiz.title}
        description={
          completedDateLabel
            ? `Review submitted answers, rationales, and source references from ${completedDateLabel}.`
            : "Review submitted answers, rationales, and source references."
        }
        backHref="/progress"
        backLabel="Back to progress"
        icon={Icons.FileCheck}
      />

      <ReviewScoreSummary review={review} />

      {review.questions.length === 0 ? (
        <EmptyState
          title="No responses were recorded"
          description="This completed attempt does not contain question responses to review."
          action={<PrimaryAction href="/courses">Return to courses</PrimaryAction>}
          icon={Icons.Inbox}
        />
      ) : (
        <div className="mt-5 space-y-5" aria-label="Question review">
          {review.questions.map((question) => {
            const domainConfiguration = DOMAINS[question.domain as keyof typeof DOMAINS];
            const difficultyConfiguration =
              DIFFICULTIES[question.difficulty as keyof typeof DIFFICULTIES];
            const answerStatusTone =
              question.isCorrect === true ? "green" : question.isCorrect === false ? "red" : "slate";
            const AnswerStatusIcon =
              question.isCorrect === true
                ? Icons.Check
                : question.isCorrect === false
                  ? Icons.X
                  : Icons.AlertCircle;

            return (
              <SectionPanel key={question.id}>
                <article className="p-5 sm:p-6" aria-labelledby={`review-question-${question.id}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <IconTile
                        icon={AnswerStatusIcon}
                        tone={answerStatusTone}
                        size={18}
                        className="h-9 w-9"
                      />
                      <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#185FA5]">
                          Question {question.position}
                        </p>
                        <h2
                          id={`review-question-${question.id}`}
                          className="mt-1 text-base font-extrabold leading-6 text-slate-950"
                        >
                          {question.questionText}
                        </h2>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2 pl-12 sm:pl-0">
                      <StatusBadge tone="slate">
                        {domainConfiguration?.label ?? question.domain}
                      </StatusBadge>
                      <StatusBadge tone={answerStatusTone}>
                        {question.pointsEarned} / {question.pointsPossible} points
                      </StatusBadge>
                      {difficultyConfiguration && (
                        <StatusBadge tone="blue">{difficultyConfiguration.label}</StatusBadge>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    {question.choices.map((choice) => (
                      <ReviewChoice key={choice.id} choice={choice} />
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3">
                    <ReviewDetail
                      title="Rationale"
                      value={question.rationale}
                      icon={Icons.BookOpen}
                    />
                    <ReviewDetail
                      title="Calculation"
                      value={question.calculation}
                      icon={Icons.Calculator}
                    />
                    <ReviewDetail
                      title="Source reference"
                      value={question.sourceRef}
                      icon={Icons.FileText}
                    />
                  </div>
                </article>
              </SectionPanel>
            );
          })}
        </div>
      )}

      <nav className="mt-6 flex flex-col gap-3 sm:flex-row" aria-label="Review actions">
        <Link
          href="/progress"
          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-[#185FA5] bg-white px-4 py-2 text-sm font-bold text-[#185FA5] shadow-sm transition-colors hover:bg-[#E6F1FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
        >
          View all progress
        </Link>
        <Link
          href="/courses"
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0d3d6e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
        >
          Continue learning
          <Icons.ArrowRight size={16} />
        </Link>
      </nav>
    </LearnerPage>
  );
}

function ReviewLoadingState() {
  return (
    <LearnerPage width="narrow">
      <div className="animate-pulse space-y-5" aria-busy="true" aria-label="Loading attempt review">
        <div className="h-44 rounded-lg border border-slate-200 bg-white" />
        <div className="h-32 rounded-lg border border-slate-200 bg-white" />
        <div className="h-80 rounded-lg border border-slate-200 bg-white" />
      </div>
      <p className="sr-only">Loading attempt review</p>
    </LearnerPage>
  );
}

function ReviewScoreSummary({ review }: { review: NormalizedAttemptReview }) {
  const passed = review.score.passed;
  const summaryTone = passed === true ? "green" : passed === false ? "red" : "blue";

  return (
    <SectionPanel>
      <div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
        <IconTile
          icon={passed ? Icons.Check : Icons.BarChart3}
          tone={summaryTone}
          size={24}
          className="h-12 w-12"
        />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-3xl font-extrabold tracking-[-0.03em] text-slate-950">
              {review.score.percentage.toFixed(1)}%
            </p>
            {passed !== null && (
              <StatusBadge tone={passed ? "green" : "red"}>
                {passed ? "Passed" : "Did not pass"}
              </StatusBadge>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {review.score.raw} of {review.score.max} points
            {review.quiz.passingScore !== null && (
              <> · Passing score {review.quiz.passingScore}%</>
            )}
          </p>
        </div>
      </div>
    </SectionPanel>
  );
}

function ReviewChoice({ choice }: { choice: NormalizedAttemptReviewChoice }) {
  const choiceStateLabel = choice.isCorrect
    ? "Correct answer"
    : choice.isSelected
      ? "Your incorrect selection"
      : "Not selected";

  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3",
        choice.isCorrect
          ? "border-green-200 bg-green-50"
          : choice.isSelected
            ? "border-red-200 bg-red-50"
            : "border-slate-200 bg-white",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-extrabold",
            choice.isCorrect
              ? "border-green-300 bg-white text-green-700"
              : choice.isSelected
                ? "border-red-300 bg-white text-red-700"
                : "border-slate-200 bg-slate-50 text-slate-500",
          )}
          aria-hidden="true"
        >
          {choice.letter}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-6 text-slate-800">{choice.text}</p>
            {(choice.isCorrect || choice.isSelected) && (
              <span
                className={cn(
                  "text-[11px] font-extrabold uppercase tracking-[0.06em]",
                  choice.isCorrect ? "text-green-700" : "text-red-700",
                )}
              >
                {choiceStateLabel}
              </span>
            )}
          </div>
          {choice.explanation && (
            <p className="mt-1 text-xs leading-5 text-slate-600">{choice.explanation}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewDetail({
  title,
  value,
  icon: DetailIcon,
}: {
  title: string;
  value: string | null;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}) {
  if (!value) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-[#f8fbff] p-4">
      <div className="flex items-center gap-2 text-[#185FA5]">
        <DetailIcon size={16} />
        <h3 className="text-xs font-extrabold uppercase tracking-[0.08em]">{title}</h3>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}
