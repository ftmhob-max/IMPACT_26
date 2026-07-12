interface ProgressBarProps {
  answered: number;
  total: number;
}

export function ProgressBar({ answered, total }: ProgressBarProps) {
  const pct = total > 0 ? ((answered / total) * 100).toFixed(1) : "0";

  return (
    <div className="quiz-progress bg-[var(--impact-surface)]/95 backdrop-blur-sm border-t border-[var(--impact-border)] px-5 flex items-center gap-2.5 py-2">
      {/* Track uses a semantic surface token; only the dynamic width stays inline. */}
      <div className="quiz-progress-track flex-1 h-[8px] rounded-full overflow-hidden">
        <div className="quiz-progress-fill h-[8px] rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-[11px] text-[var(--impact-muted)] min-w-[54px] text-right font-semibold">
        {answered} / {total}
      </div>
    </div>
  );
}
