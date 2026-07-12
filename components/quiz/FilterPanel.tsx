"use client";

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

// Domain filter options. Colors are now driven by theme-aware CSS tokens via the
// `data-domain` attribute (see .quiz-filter-pill rules in globals.css) rather than
// inline hex, so the pills adapt correctly to light and dark mode.
const DOMAIN_OPTIONS = [
  { value: "all", label: "All" },
  { value: "math", label: "Math / Formulas" },
  { value: "appraisal", label: "Appraisal Theory" },
  { value: "law", label: "PA Law" },
  { value: "philly", label: "Philadelphia" },
  { value: "admin", label: "Administration" },
  { value: "ethics", label: "Ethics & Data" },
];

export function FilterPanel({ diffFilter, domainFilters, onDiffChange, onDomainToggle }: FilterPanelProps) {
  const isAllDomain = domainFilters.size === 0;

  return (
    <div className="quiz-filters mx-4 mt-3 rounded-lg border border-[var(--impact-border)] bg-[var(--impact-surface)] px-4 py-3 shadow-sm sm:px-5">
      <div className="grid gap-3 lg:grid-cols-[92px_1fr] lg:items-start">
        <FilterLabel>Difficulty</FilterLabel>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {DIFF_OPTIONS.map((opt) => {
            const active = diffFilter === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onDiffChange(opt.value)}
                data-active={active}
                className="quiz-filter-pill whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--impact-blue)] focus-visible:ring-offset-2"
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
                data-active={active}
                data-domain={opt.value}
                className="quiz-filter-pill whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--impact-blue)] focus-visible:ring-offset-2"
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
            className="flex items-center gap-1 text-[10px] text-[var(--impact-faint)] hover:text-[var(--impact-blue)] transition-colors focus-visible:outline-none"
            aria-label="Filter instructions"
          >
            <Icons.Info size={12} />
            <span className="font-semibold">How filters work</span>
          </button>
          {/* Tooltip */}
          <span className="pointer-events-none absolute bottom-full right-0 mb-1.5 w-56 rounded-md border border-[var(--impact-border)] bg-[var(--impact-surface-raised)] px-3 py-2 text-[11px] leading-relaxed text-[var(--impact-muted)] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
            Filters combine. Select multiple domains, or choose All to reset domain selection.
          </span>
        </span>
      </div>
    </div>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--impact-faint)]">
      {children}
    </span>
  );
}
