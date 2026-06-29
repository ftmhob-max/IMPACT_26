// Front-end: shared import workflow UI primitives for admin panels.
"use client";

import { useState, type ReactNode } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function ImportStepPill<T extends string>({
  current,
  steps,
  labels,
}: {
  current: T;
  steps: T[];
  labels: Record<T, string>;
}) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => (
        <span key={step} className="flex items-center gap-1">
          {index > 0 && <span className="text-slate-300 text-[10px]">›</span>}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
              current === step
                ? "bg-[#185FA5] text-white"
                : steps.indexOf(current) > index
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-400",
            )}
          >
            {labels[step]}
          </span>
        </span>
      ))}
    </div>
  );
}

export function ImportSummaryCard({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2.5 text-center",
        warn && value > 0 ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50",
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={cn("text-xl font-extrabold", warn && value > 0 ? "text-amber-700" : "text-slate-900")}>{value}</p>
    </div>
  );
}

export function ImportCollapsibleSection({
  title,
  defaultOpen,
  variant,
  children,
}: {
  title: string;
  defaultOpen: boolean;
  variant: "error" | "warning" | "success" | "neutral";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const colors = {
    error: "border-red-200 bg-red-50 text-red-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
  }[variant];

  return (
    <div className={cn("rounded-xl border overflow-hidden", colors.split(" ")[0])}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn("flex w-full items-center gap-2 px-4 py-3 text-xs font-bold text-left transition-colors", colors)}
      >
        <span className="flex-1">{title}</span>
        {open ? <Icons.ChevronUp size={13} /> : <Icons.ChevronDown size={13} />}
      </button>
      {open && <div className="px-4 pb-4 pt-2 bg-white">{children}</div>}
    </div>
  );
}
