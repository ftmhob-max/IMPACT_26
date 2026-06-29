// Front-end: difficulty label badge used across admin and learner surfaces.
import { Badge } from "./Badge";
import { DIFFICULTIES, cn, type Difficulty } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: string;
  className?: string;
}

function resolveDifficultyConfig(difficulty: string) {
  const key = difficulty as Difficulty;
  return DIFFICULTIES[key] ?? { label: difficulty, badgeClass: "bg-slate-100 text-slate-500" };
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const config = resolveDifficultyConfig(difficulty);
  const usesToken = "badgeClass" in config && String(config.badgeClass).startsWith("badge-");
  if (usesToken) {
    return <Badge className={cn(config.badgeClass, className)}>{config.label}</Badge>;
  }
  return (
    <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize", config.badgeClass, className)}>
      {config.label}
    </span>
  );
}
