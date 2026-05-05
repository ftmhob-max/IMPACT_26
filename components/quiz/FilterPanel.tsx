"use client";

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
    <div className="quiz-filters border-b border-[rgba(0,0,0,0.11)] bg-white px-4 py-3 sm:px-5">
      <div className="grid gap-3 lg:grid-cols-[92px_1fr] lg:items-start">
        <FilterLabel>Difficulty</FilterLabel>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {DIFF_OPTIONS.map((opt) => {
            const active = diffFilter === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onDiffChange(opt.value)}
                className="whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors"
                style={
                  active
                    ? { background: "#185FA5", color: "#fff", borderColor: "#185FA5" }
                    : { background: "#fff", color: "#4a4a46", borderColor: "rgba(0,0,0,0.20)" }
                }
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
                className="whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors"
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
      <p className="mt-1 text-xs leading-5 text-[#888880] lg:pl-[92px]">
        Filters combine. Select multiple domains, or choose All to reset domain selection.
      </p>
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
