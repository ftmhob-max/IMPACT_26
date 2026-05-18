"use client";

import { cn } from "@/lib/utils";
import { DOMAINS } from "@/lib/utils";
import * as Icons from "@/components/ui/Icons";

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

const DOMAIN_ICONS: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  math: Icons.Calculator,
  appraisal: Icons.Home,
  law: Icons.Scale,
  philly: Icons.Landmark,
  admin: Icons.ClipboardList,
  ethics: Icons.ShieldCheck,
};

/** Circular SVG progress ring */
function ScoreRing({ pct, passed }: { pct: number; passed: boolean | null }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const trackColor = "#e8e7e0";
  const fillColor =
    passed === true ? "#3B6D11" : passed === false ? "#C0392B" : "#185FA5";

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto" aria-hidden="true">
      {/* Track */}
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth="10"
      />
      {/* Fill */}
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        stroke={fillColor}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 70 70)"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
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
  const motivationalLine =
    passed === true
      ? "You've passed — you're exam ready! 🎉"
      : passed === false
      ? "Keep studying — you're almost there! 💪"
      : null;

  return (
    <div className="mx-auto min-h-screen max-w-3xl space-y-6 bg-[#f7f8f6] px-4 py-10">
      {/* Score card */}
      <div
        className={cn(
          "relative overflow-hidden rounded-lg p-10 text-center border shadow-sm",
          passed === true
            ? "bg-green-50 border-green-200"
            : passed === false
            ? "bg-red-50 border-red-200"
            : "bg-slate-50 border-slate-200"
        )}
      >
        {/* SVG progress ring with score inside */}
        <div className="relative inline-flex items-center justify-center">
          <ScoreRing pct={scorePct} passed={passed} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[28px] font-extrabold tabular-nums leading-none tracking-tight">
              {scorePct.toFixed(1)}%
            </span>
            <span className="text-[10px] font-semibold text-slate-500 mt-0.5 uppercase tracking-wider">
              Score
            </span>
          </div>
        </div>

        <p className="text-slate-600 text-sm font-medium mt-3">
          {scoreRaw.toFixed(1)} / {scoreMax.toFixed(1)} points
        </p>

        {/* Passing score reference */}
        {passingScore != null && (
          <p className="text-[11.5px] text-slate-500 mt-1">
            Passing score: {passingScore}%
          </p>
        )}

        {passed !== null && (
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mt-4",
              passed
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            )}
          >
            {passed ? <Icons.Check size={18} /> : <Icons.LogOut size={18} className="rotate-90" />}
            {passed ? "Passed" : "Did not pass"}
          </div>
        )}

        {/* Motivational copy */}
        {motivationalLine && (
          <p className="mt-3 text-[13px] font-medium text-slate-600">{motivationalLine}</p>
        )}
      </div>

      {/* Domain breakdown */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-[#f8fbff] px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#b8d7f0] bg-[#E6F1FB] text-[#185FA5]">
            <Icons.BarChart3 size={18} />
          </span>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Performance by Domain</h3>
        </div>
        <div className="p-5 space-y-5">
          {Object.entries(domainBreakdown).map(([domain, { earned, possible }]) => {
            const pct = possible > 0 ? Math.round((earned / possible) * 100) : 0;
            const config = DOMAINS[domain as keyof typeof DOMAINS];
            const Icon = DOMAIN_ICONS[domain] || Icons.FileText;
            return (
              <div key={domain}>
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className="text-slate-400" />
                    <span className="font-semibold text-slate-700">
                      {config?.label ?? domain}
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono">
                    {earned.toFixed(1)} / {possible.toFixed(1)} ({pct}%)
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
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
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onReview}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#185FA5] bg-white px-6 py-3.5 text-sm font-bold text-[#185FA5] shadow-sm transition-all hover:bg-[#E6F1FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          <Icons.FileText size={18} />
          Review Answers
        </button>
        <button
          onClick={onRetake}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#0d3d6e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          <Icons.RotateCcw size={18} />
          Retake Exam
        </button>
      </div>
    </div>
  );
}
