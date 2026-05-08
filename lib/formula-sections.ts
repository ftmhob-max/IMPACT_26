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
