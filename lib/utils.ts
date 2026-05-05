import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DOMAINS = {
  math:      { label: "Math / Formulas",   color: "#2563eb", cssClass: "bar-math",      badge: "bg-blue-100 text-blue-800" },
  appraisal: { label: "Appraisal Theory",  color: "#7c3aed", cssClass: "bar-appraisal", badge: "bg-violet-100 text-violet-800" },
  law:       { label: "PA Law",            color: "#dc2626", cssClass: "bar-law",        badge: "bg-red-100 text-red-800" },
  philly:    { label: "Philadelphia",      color: "#059669", cssClass: "bar-philly",     badge: "bg-emerald-100 text-emerald-800" },
  admin:     { label: "Administration",    color: "#d97706", cssClass: "bar-admin",      badge: "bg-amber-100 text-amber-800" },
  ethics:    { label: "Ethics & Data",     color: "#0891b2", cssClass: "bar-ethics",     badge: "bg-cyan-100 text-cyan-800" },
} as const;

export const DIFFICULTIES = {
  easy:       { label: "Easy",       badge: "bg-green-100 text-green-800" },
  proficient: { label: "Proficient", badge: "bg-yellow-100 text-yellow-800" },
  expert:     { label: "Expert",     badge: "bg-red-100 text-red-800" },
} as const;

export type Domain = keyof typeof DOMAINS;
export type Difficulty = keyof typeof DIFFICULTIES;
