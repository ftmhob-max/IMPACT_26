interface ScoreboardProps {
  answeredCount: number;
  correctCount: number;
  scorePct: number | null;
  visibleCount: number;
}

export function Scoreboard({ answeredCount, correctCount, scorePct, visibleCount }: ScoreboardProps) {
  return (
    <div className="quiz-scoreboard grid grid-cols-2 border-b border-[rgba(0,0,0,0.11)] bg-white sm:grid-cols-4">
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
    <div className="border-r border-b border-[rgba(0,0,0,0.08)] px-4 py-3 text-center last:border-r-0 sm:border-b-0">
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
