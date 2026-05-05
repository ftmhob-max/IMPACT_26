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
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Score card */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl p-10 text-center border shadow-sm",
          passed === true
            ? "bg-green-50 border-green-200"
            : passed === false
            ? "bg-red-50 border-red-200"
            : "bg-slate-50 border-slate-200"
        )}
      >
        <div className="text-6xl font-extrabold mb-2 tabular-nums tracking-tight">
          {scorePct.toFixed(1)}%
        </div>
        <p className="text-slate-600 text-sm font-medium">
          {scoreRaw.toFixed(1)} / {scoreMax.toFixed(1)} points
        </p>
        
        {passed !== null && (
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mt-6",
              passed 
                ? "bg-green-100 text-green-700 border border-green-200" 
                : "bg-red-100 text-red-700 border border-red-200"
            )}
          >
            {passed ? <Icons.Check size={18} /> : <Icons.LogOut size={18} className="rotate-90" />}
            {passed ? "Passed" : "Did not pass"}
            {passingScore != null && ` (passing: ${passingScore}%)`}
          </div>
        )}
      </div>

      {/* Domain breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center gap-2">
          <Icons.BarChart3 size={18} className="text-slate-500" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Performance by Domain</h3>
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
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 border border-slate-200 bg-white text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm"
        >
          <Icons.FileText size={18} />
          Review Answers
        </button>
        <button
          onClick={onRetake}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-[#185FA5] text-white text-sm font-bold rounded-xl hover:bg-[#0d3d6e] transition-all active:scale-[0.98] shadow-sm"
        >
          <Icons.RotateCcw size={18} />
          Retake Exam
        </button>
      </div>
    </div>
  );
}

