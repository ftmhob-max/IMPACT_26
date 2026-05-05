interface ProgressBarProps {
  answered: number;
  total: number;
}

export function ProgressBar({ answered, total }: ProgressBarProps) {
  const pct = total > 0 ? ((answered / total) * 100).toFixed(1) : "0";

  return (
    <div className="quiz-progress bg-white/95 backdrop-blur-sm border-t border-black/5 px-5 flex items-center gap-2.5 py-2">
      <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: "#e8e7e0" }}>
        <div
          className="h-[6px] rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #185FA5 0%, #22a0e8 100%)",
            transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>
      <div className="text-[11px] text-[#888880] min-w-[54px] text-right font-semibold">
        {answered} / {total}
      </div>
    </div>
  );
}
