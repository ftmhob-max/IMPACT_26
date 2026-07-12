interface ScoreboardProps {
  answeredCount: number;
  correctCount: number;
  scorePct: number | null;
  visibleCount: number;
  total?: number;
}

export function Scoreboard({ answeredCount, correctCount, scorePct, visibleCount, total }: ScoreboardProps) {
  const isFiltered = total !== undefined && visibleCount < total;
  return (
    <div className="quiz-scoreboard m-4 mb-0 grid grid-cols-2 overflow-hidden rounded-lg border border-[var(--impact-border)] bg-[var(--impact-surface)] shadow-sm sm:grid-cols-4">
      {/* Value colors use semantic tokens so figures stay legible in both themes. */}
      <ScoreCard value={answeredCount} label="Answered" valueColor="var(--impact-blue)" />
      <ScoreCard value={correctCount} label="Correct" valueColor="var(--impact-success-text)" />
      <ScoreCard value={scorePct !== null ? `${scorePct}%` : "-"} label="Score" />
      <ScoreCard
        value={visibleCount}
        label="Showing"
        valueColor="var(--impact-warning-text)"
        subLabel={isFiltered ? `of ${total}` : undefined}
      />
    </div>
  );
}

function ScoreCard({
  value,
  label,
  valueColor,
  subLabel,
}: {
  value: string | number;
  label: string;
  valueColor?: string;
  subLabel?: string;
}) {
  return (
    <div className="border-r border-b border-[var(--impact-border)] px-4 py-3 text-center last:border-r-0 sm:border-b-0">
      <div
        className="mb-1 text-2xl font-extrabold leading-none tracking-[-0.02em] sm:text-[26px]"
        style={{ color: valueColor ?? "var(--impact-ink)" }}
      >
        {value}
      </div>
      <div className="text-[9.5px] font-bold uppercase tracking-[0.06em] text-[var(--impact-faint)]">
        {label}
      </div>
      {subLabel && (
        <div className="mt-0.5 text-[9px] text-[var(--impact-faint)]">{subLabel}</div>
      )}
    </div>
  );
}
