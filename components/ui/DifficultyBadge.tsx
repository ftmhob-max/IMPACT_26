import { Badge } from "./Badge";
import { DIFFICULTIES, type Difficulty } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const config = DIFFICULTIES[difficulty] ?? DIFFICULTIES.proficient;
  return <Badge className={config.badge}>{config.label}</Badge>;
}
