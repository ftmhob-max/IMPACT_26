interface ScoreboardProps {
  answeredCount: number;
  correctCount: number;
  scorePct: number | null;
  visibleCount: number;
}

export function Scoreboard({ answeredCount, correctCount, scorePct, visibleCount }: ScoreboardProps) {
  return (
    <div className="quiz-scoreboard m-4 mb-0 grid grid-cols-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:grid-cols-4">
      <ScoreCard value={answeredCount} label="Answered" valueColor="#185FA5" />
      <ScoreCard value={correctCount} label="Correct" valueColor="#3B6D11" />
      <ScoreCard value={scorePct !== null ? `${scorePct}%` : "-"} label="Score" />
      <ScoreCard value={visibleCount} label="Visible" valueColor="#854F0B" />
    </div>
  );
}

function ScoreCard({
  value,
  label,
  valueColor,
}: {
  value: string | number;
  label: string;
  valueColor?: string;
}) {
  return (
    <div className="border-r border-b border-slate-100 px-4 py-3 text-center last:border-r-0 sm:border-b-0">
      <div
        className="mb-1 text-2xl font-extrabold leading-none tracking-[-0.02em] sm:text-[26px]"
        style={{ color: valueColor ?? "#1a1a18" }}
      >
        {value}
      </div>
      <div className="text-[9.5px] font-bold uppercase tracking-[0.06em] text-[#888880]">
        {label}
      </div>
    </div>
  );
}
