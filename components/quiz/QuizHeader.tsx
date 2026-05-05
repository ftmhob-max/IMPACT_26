"use client";

import { ProgressBar } from "./ProgressBar";
import * as Icons from "@/components/ui/Icons";

interface QuizHeaderProps {
  onShuffle: () => void;
  onShowAll: () => void;
  onHideAll: () => void;
  onReset: () => void;
  onFinish: () => void;
  onBack?: () => void;
  isCompleting: boolean;
  answeredCount: number;
  total: number;
}

const DOMAIN_PILLS = ["Math", "Appraisal", "PA Law", "Philly", "Admin", "Ethics"];

export function QuizHeader({
  answeredCount,
  total,
  onShuffle,
  onShowAll,
  onHideAll,
  onReset,
  onFinish,
  onBack,
  isCompleting,
}: QuizHeaderProps) {
  const allAnswered = answeredCount === total && total > 0;

  return (
    <>
      <header
        className="quiz-header sticky top-0 z-[200] text-white"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <div className="mx-auto max-w-[980px] px-4 py-3 sm:px-5">
          {onBack && (
            <button
              onClick={onBack}
              className="mb-3 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white/60 transition-colors hover:text-white"
            >
              <Icons.ChevronLeft size={14} />
              Back to module
            </button>
          )}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] opacity-70">
                IMPACT_26V.1 / Formula Compass / Philadelphia PA
              </div>
              <div className="mt-0.5 text-lg font-bold leading-tight">
                Municipal Property Assessment Practice Exam
              </div>
              <div className="mt-0.5 text-[11.5px] leading-snug opacity-80">
                {answeredCount} of {total} answered / 6 domains / 53 formulas
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 lg:max-w-[380px] lg:justify-end">
              {DOMAIN_PILLS.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <HaBtn onClick={onShuffle} primary icon={<Icons.Shuffle size={13} />}>
              Shuffle
            </HaBtn>
            <HaBtn onClick={onShowAll} icon={<Icons.Eye size={13} />}>
              Show all answers
            </HaBtn>
            <HaBtn onClick={onHideAll} icon={<Icons.EyeOff size={13} />}>
              Hide all answers
            </HaBtn>
            <HaBtn onClick={onReset} icon={<Icons.RotateCcw size={13} />}>
              Reset
            </HaBtn>
            <HaBtn onClick={() => window.print()} icon={<Icons.Printer size={13} />}>
              Print / PDF
            </HaBtn>
            {allAnswered && (
              <button
                onClick={onFinish}
                disabled={isCompleting}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/60 bg-white/25 px-3.5 py-2 text-[11px] font-bold text-white transition-all hover:bg-white/35 active:scale-95 disabled:opacity-50"
              >
                <Icons.Check size={13} className="text-green-300" />
                {isCompleting ? "Finishing..." : "Finish exam"}
              </button>
            )}
          </div>
        </div>
        <ProgressBar answered={answeredCount} total={total} />
      </header>

    </>
  );
}

function HaBtn({
  children,
  onClick,
  primary,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/20 px-3.5 py-2 text-[11px] font-bold text-white transition-all hover:bg-white/25 active:scale-95"
      style={{ 
        background: primary ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)",
        backdropFilter: "blur(4px)"
      }}
    >
      {icon}
      {children}
    </button>
  );
}
