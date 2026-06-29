import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUuid(id: string): string {
  if (!id) return id;
  // If it's a 32-char hex string without dashes, add them
  if (id.length === 32 && !id.includes("-")) {
    return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
  }
  return id;
}

export function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const DOMAINS = {
  math:      { label: "Math / Formulas",   color: "#534AB7", barClass: "bar-math",      badgeClass: "badge-math"      },
  appraisal: { label: "Appraisal Theory",  color: "#0F6E56", barClass: "bar-appraisal", badgeClass: "badge-appraisal" },
  law:       { label: "PA Law",            color: "#993C1D", barClass: "bar-law",        badgeClass: "badge-law"       },
  philly:    { label: "Philadelphia",      color: "#c47c00", barClass: "bar-philly",     badgeClass: "badge-philly"    },
  admin:     { label: "Administration",    color: "#A32D2D", barClass: "bar-admin",      badgeClass: "badge-admin"     },
  ethics:    { label: "Ethics & Data",     color: "#3B6D11", barClass: "bar-ethics",     badgeClass: "badge-ethics"    },
} as const;

export const DIFFICULTIES = {
  easy:       { label: "Easy",       badgeClass: "badge-easy"       },
  proficient: { label: "Proficient", badgeClass: "badge-proficient" },
  expert:     { label: "Expert",     badgeClass: "badge-expert"     },
} as const;

export type Domain = keyof typeof DOMAINS;
export type Difficulty = keyof typeof DIFFICULTIES;

type FormulaLike = {
  id: string;
  code: string;
  name: string;
  expression: string;
  notes?: string | null;
};

type FormulaSectionLike = {
  id: string;
  code: string;
  title: string;
  position: number;
  formulas: FormulaLike[];
};

export function dedupeFormulaSections<T extends FormulaSectionLike>(sections: T[]): T[] {
  const byCode = new Map<string, T>();

  for (const section of sections) {
    const existing = byCode.get(section.code);
    if (!existing) {
      byCode.set(section.code, section);
      continue;
    }

    const currentScore = section.formulas.length;
    const existingScore = existing.formulas.length;

    if (currentScore > existingScore) {
      byCode.set(section.code, section);
    }
  }

  return [...byCode.values()].sort((a, b) => a.position - b.position || a.code.localeCompare(b.code));
}
