import { Badge } from "./Badge";
import { DOMAINS, type Domain } from "@/lib/utils";

interface DomainBadgeProps {
  domain: Domain;
}

export function DomainBadge({ domain }: DomainBadgeProps) {
  const config = DOMAINS[domain] ?? DOMAINS.math;
  return <Badge className={config.badgeClass}>{config.label}</Badge>;
}
