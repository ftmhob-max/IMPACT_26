"use client";

import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

interface QuizCalculatorLauncherProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * Compact button for the quiz header / toolbar that opens or restores
 * the Formula Calculator popup.
 */
export function QuizCalculatorLauncher({
  isOpen,
  isMinimized,
  onClick,
  className,
}: QuizCalculatorLauncherProps) {
  const isActive = isOpen && !isMinimized;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isActive ? "Calculator open" : "Open formula calculator"}
      aria-pressed={isActive}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-1",
        isActive
          ? "border-[#185FA5] bg-[#185FA5] text-white shadow-sm"
          : isOpen && isMinimized
          ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]"
          : "border-slate-200 bg-white text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5]",
        className
      )}
    >
      <Icons.Calculator size={14} />
      <span className="hidden sm:inline">Calculator</span>
      {isOpen && isMinimized && (
        <span className="ml-0.5 rounded-full bg-[#185FA5] px-1.5 py-0.5 text-[9px] font-extrabold text-white leading-none">
          MIN
        </span>
      )}
    </button>
  );
}
