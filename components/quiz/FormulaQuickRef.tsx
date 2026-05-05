"use client";

import { useState } from "react";

export interface FormulaItem {
  id: string;
  code: string;
  name: string;
  expression: string;
  notes: string | null;
  position: number;
}

export interface FormulaSectionData {
  id: string;
  code: string;
  title: string;
  position: number;
  formulas: FormulaItem[];
}

interface FormulaQuickRefProps {
  sections: FormulaSectionData[];
  isLoading: boolean;
}

export function FormulaQuickRef({ sections, isLoading }: FormulaQuickRefProps) {
  const [open, setOpen] = useState(false);
  const totalFormulas = sections.reduce((sum, s) => sum + s.formulas.length, 0);

  return (
    <div className="quiz-formula-ref mx-4 mt-3 overflow-hidden rounded-lg border border-[rgba(0,0,0,0.11)] bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 bg-[#f8f7f4] px-4 py-3 text-left"
      >
        <span className="min-w-0">
          <span className="block text-[12px] font-bold text-[#1a1a18]">Formula Quick-Reference Index</span>
          <span className="mt-0.5 block text-[11px] text-[#888880]">
            {isLoading
              ? "Loading formulas..."
              : sections.length > 0
              ? `${totalFormulas} formulas across ${sections.length} sections`
              : "No formulas loaded"}
          </span>
        </span>
        <span className="shrink-0 rounded-full border border-[rgba(0,0,0,0.11)] bg-white px-2 py-1 text-[11px] font-semibold text-[#4a4a46]">
          {open ? "Collapse" : "Expand"}
        </span>
      </button>

      {open && (
        <div className="px-4 py-3">
          {isLoading ? (
            <p className="text-[12px] text-[#888880]">Loading formulas...</p>
          ) : sections.length === 0 ? (
            <p className="text-[12px] text-[#888880]">
              No formulas found. Run the import script to populate formula data.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {sections
                .slice()
                .sort((a, b) => a.position - b.position)
                .map((section) => (
                  <div key={section.id} className="rounded-md border border-slate-100 bg-white p-3">
                    <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.07em] text-[#888880]">
                      {section.code} / {section.title}
                    </div>
                    <div className="space-y-1">
                      {section.formulas
                        .slice()
                        .sort((a, b) => a.position - b.position)
                        .map((formula) => (
                          <div key={formula.id} className="text-[11px] leading-[1.5] text-[#4a4a46]">
                            <span className="font-semibold text-[#1a1a18]">{formula.name}: </span>
                            <span className="font-calc">{formula.expression}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
