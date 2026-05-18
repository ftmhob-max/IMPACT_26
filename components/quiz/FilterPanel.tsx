"use client";

import { cn } from "@/lib/utils";
import * as Icons from "@/components/ui/Icons";

type DiffFilter = "all" | "easy" | "proficient" | "expert" | "random";

interface FilterPanelProps {
  diffFilter: DiffFilter;
  domainFilters: Set<string>;
  onDiffChange: (diff: DiffFilter) => void;
  onDomainToggle: (domain: string) => void;
}

const DIFF_OPTIONS: { value: DiffFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "easy", label: "Easy" },
  { value: "proficient", label: "Proficient" },
  { value: "expert", label: "Expert" },
  { value: "random", label: "Mixed / Random" },
];

const DOMAIN_OPTIONS = [
  { value: "all", label: "All", color: "#1a1a18" },
  { value: "math", label: "Math / Formulas", color: "#534AB7" },
  { value: "appraisal", label: "Appraisal Theory", color: "#0F6E56" },
  { value: "law", label: "PA Law", color: "#993C1D" },
  { value: "philly", label: "Philadelphia", color: "#c47c00" },
  { value: "admin", label: "Administration", color: "#A32D2D" },
  { value: "ethics", label: "Ethics & Data", color: "#3B6D11" },
];

export function FilterPanel({ diffFilter, domainFilters, onDiffChange, onDomainToggle }: FilterPanelProps) {
  const isAllDomain = domainFilters.size === 0;

  return (
    <div className="quiz-filters mx-4 mt-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-5">
      <div className="grid gap-3 lg:grid-cols-[92px_1fr] lg:items-start">
        <FilterLabel>Difficulty</FilterLabel>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {DIFF_OPTIONS.map((opt) => {
            const active = diffFilter === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onDiffChange(opt.value)}
                className={cn(
                  "whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2",
                  active
                    ? "border-[#185FA5] bg-[#185FA5] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#185FA5] hover:text-[#185FA5]"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <FilterLabel>Domain</FilterLabel>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {DOMAIN_OPTIONS.map((opt) => {
            const active = opt.value === "all" ? isAllDomain : domainFilters.has(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => onDomainToggle(opt.value)}
                className="whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
                style={
                  active
                    ? { background: opt.color, color: "#fff", borderColor: opt.color }
                    : { background: "#fff", color: "#4a4a46", borderColor: "rgba(0,0,0,0.20)" }
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-end mt-1 lg:pl-[92px]">
        <span className="relative group inline-flex items-center">
          <button
            type="button"
            className="flex items-center gap-1 text-[10px] text-[#888880] hover:text-[#185FA5] transition-colors focus-visible:outline-none"
            aria-label="Filter instructions"
          >
            <Icons.Info size={12} />
            <span className="font-semibold">How filters work</span>
          </button>
          {/* Tooltip */}
          <span className="pointer-events-none absolute bottom-full right-0 mb-1.5 w-56 rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] leading-relaxed text-[#4a4a46] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
            Filters combine. Select multiple domains, or choose All to reset domain selection.
          </span>
        </span>
      </div>
    </div>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#888880]">
      {children}
    </span>
  );
}
