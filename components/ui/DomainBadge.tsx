// Front-end: domain label badge used across admin and learner surfaces.
import { Badge } from "./Badge";
import { DOMAINS, cn, type Domain } from "@/lib/utils";

interface DomainBadgeProps {
  domain: string;
  className?: string;
}

function resolveDomainConfig(domain: string) {
  const key = domain as Domain;
  return DOMAINS[key] ?? { label: domain, badgeClass: "bg-slate-100 text-slate-500" };
}

export function DomainBadge({ domain, className }: DomainBadgeProps) {
  const config = resolveDomainConfig(domain);
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
