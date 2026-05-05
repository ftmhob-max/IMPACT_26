"use client";

import { cn } from "@/lib/utils";
import { DOMAINS } from "@/lib/utils";

interface DomainBreakdown {
  [domain: string]: { earned: number; possible: number };
}

interface QuizResultsProps {
  attemptId: string;
  scorePct: number;
  scoreRaw: number;
  scoreMax: number;
  passed: boolean | null;
  passingScore?: number | null;
  domainBreakdown: DomainBreakdown;
  onReview: () => void;
  onRetake: () => void;
}

export function QuizResults({
  scorePct,
  scoreRaw,
  scoreMax,
  passed,
  passingScore,
  domainBreakdown,
  onReview,
  onRetake,
}: QuizResultsProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Score card */}
      <div
        className={cn(
          "rounded-2xl p-8 text-center border",
          passed === true
            ? "bg-green-50 border-green-200"
            : passed === false
            ? "bg-red-50 border-red-200"
            : "bg-slate-50 border-slate-200"
        )}
      >
        <div className="text-6xl font-bold mb-2 tabular-nums">
          {scorePct.toFixed(1)}%
        </div>
        <p className="text-slate-600 text-sm mb-1">
          {scoreRaw.toFixed(1)} / {scoreMax.toFixed(1)} points
        </p>
        {passed !== null && (
          <p
            className={cn(
              "text-base font-semibold mt-3",
              passed ? "text-green-700" : "text-red-700"
            )}
          >
            {passed ? "✓ Passed" : "✗ Did not pass"}
            {passingScore != null && ` (passing: ${passingScore}%)`}
          </p>
        )}
      </div>

      {/* Domain breakdown */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Performance by Domain</h3>
        <div className="space-y-3">
          {Object.entries(domainBreakdown).map(([domain, { earned, possible }]) => {
            const pct = possible > 0 ? Math.round((earned / possible) * 100) : 0;
            const config = DOMAINS[domain as keyof typeof DOMAINS];
            return (
              <div key={domain}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">
                    {config?.label ?? domain}
                  </span>
                  <span className="text-slate-500">
                    {earned.toFixed(1)} / {possible.toFixed(1)} ({pct}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: config?.color ?? "#64748b",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onReview}
          className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
        >
          Review Answers
        </button>
        <button
          onClick={onRetake}
          className="flex-1 py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          Retake Exam
        </button>
      </div>
    </div>
  );
}
