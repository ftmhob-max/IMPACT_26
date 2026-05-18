"use client";

import { useState, useRef, useEffect } from "react";
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
  /** Optional slot for the calculator launcher button */
  calculatorLauncher?: React.ReactNode;
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
  calculatorLauncher,
}: QuizHeaderProps) {
  const allAnswered = answeredCount === total && total > 0;
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [moreOpen]);

  return (
    <>
      <header className="quiz-header sticky top-0 z-[200] border-b border-white/10 bg-[#073866] text-white shadow-lg">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-5">
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
              <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/70">
                IMPACT_26V.1 / Formula Compass / Philadelphia PA
              </div>
              <div className="mt-0.5 text-lg font-extrabold leading-tight">
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
                className="rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-[10px] font-bold"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Toolbar: always-visible + "More" dropdown for secondary actions */}
          <div className="mt-4 flex items-center gap-1.5">
            {/* Always visible: Shuffle */}
            <HaBtn onClick={onShuffle} primary icon={<Icons.Shuffle size={13} />}>
              Shuffle
            </HaBtn>

            {/* Always visible: Calculator (passed as slot) */}
            {calculatorLauncher && <div>{calculatorLauncher}</div>}

            {/* Always visible: Finish Exam (only when all answered) */}
            {allAnswered && (
              <button
                onClick={onFinish}
                disabled={isCompleting}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/60 bg-white/25 px-3.5 py-2 text-[11px] font-bold text-white transition-all hover:bg-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 disabled:opacity-50"
              >
                <Icons.Check size={13} className="text-green-300" />
                {isCompleting ? "Finishing..." : "Finish exam"}
              </button>
            )}

            {/* More dropdown: secondary actions */}
            <div ref={moreRef} className="relative ml-auto">
              <button
                onClick={() => setMoreOpen((v) => !v)}
                className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-[11px] font-bold text-white backdrop-blur transition-all hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95"
                aria-expanded={moreOpen}
                aria-haspopup="menu"
              >
                More
                <Icons.ChevronDown size={12} />
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-50 w-48 overflow-hidden rounded-lg border border-white/20 bg-[#0a4a7a] shadow-xl">
                  <DropdownItem
                    icon={<Icons.Eye size={13} />}
                    onClick={() => { onShowAll(); setMoreOpen(false); }}
                  >
                    Show all answers
                  </DropdownItem>
                  <DropdownItem
                    icon={<Icons.EyeOff size={13} />}
                    onClick={() => { onHideAll(); setMoreOpen(false); }}
                  >
                    Hide all answers
                  </DropdownItem>
                  <DropdownItem
                    icon={<Icons.RotateCcw size={13} />}
                    onClick={() => { onReset(); setMoreOpen(false); }}
                  >
                    Reset exam
                  </DropdownItem>
                  <DropdownItem
                    icon={<Icons.Printer size={13} />}
                    onClick={() => { window.print(); setMoreOpen(false); }}
                  >
                    Print / PDF
                  </DropdownItem>
                </div>
              )}
            </div>
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
      className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/20 px-3.5 py-2 text-[11px] font-bold text-white backdrop-blur transition-all hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 ${
        primary ? "bg-white/20" : "bg-white/10"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function DropdownItem({
  children,
  icon,
  onClick,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-[11.5px] font-semibold text-white/90 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-white"
    >
      {icon}
      {children}
    </button>
  );
}
