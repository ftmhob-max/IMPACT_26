"use client";

import { cn } from "@/lib/utils";

interface ChoiceButtonProps {
  letter: string;
  text: React.ReactNode;
  state: "default" | "selected" | "correct" | "incorrect" | "missed";
  disabled?: boolean;
  onClick?: () => void;
}

const stateClasses = {
  default:   "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 cursor-pointer",
  selected:  "border-blue-400 bg-blue-50 ring-2 ring-blue-200",
  correct:   "border-green-500 bg-green-50 text-green-800",
  incorrect: "border-red-400 bg-red-50 text-red-800",
  missed:    "border-green-400 bg-green-50/60 text-green-700 opacity-80",
};

const letterClasses = {
  default:   "bg-slate-100 text-slate-600",
  selected:  "bg-blue-500 text-white",
  correct:   "bg-green-500 text-white",
  incorrect: "bg-red-500 text-white",
  missed:    "bg-green-400 text-white",
};

export function ChoiceButton({ letter, text, state, disabled, onClick }: ChoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-lg border text-left",
        "transition-all duration-150",
        "disabled:cursor-not-allowed",
        stateClasses[state]
      )}
    >
      <span
        className={cn(
          "shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
          "text-xs font-bold transition-colors duration-150",
          letterClasses[state]
        )}
      >
        {letter}
      </span>
      <span className="text-sm leading-relaxed flex-1">{text}</span>
      {/* "Missed" label — correct answer the student skipped */}
      {state === "missed" && (
        <span className="shrink-0 self-center ml-2 rounded-full bg-green-100 border border-green-300 px-2 py-0.5 text-[10px] font-bold text-green-700 whitespace-nowrap">
          ✓ Correct answer
        </span>
      )}
    </button>
  );
}
