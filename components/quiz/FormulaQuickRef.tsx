"use client";

import { useState } from "react";
import * as Icons from "@/components/ui/Icons";

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
    <div className="quiz-formula-ref mx-4 mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 bg-[#f8fbff] px-4 py-3 text-left transition-colors hover:bg-[#E6F1FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-inset"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#b8d7f0] bg-[#E6F1FB] text-[#185FA5]">
            <Icons.Calculator size={17} />
          </span>
          <span className="min-w-0">
          <span className="block text-[12px] font-extrabold text-[#1a1a18]">Formula Quick-Reference Index</span>
          <span className="mt-0.5 block text-[11px] text-[#888880]">
            {isLoading
              ? "Loading formulas..."
              : sections.length > 0
              ? `${totalFormulas} formulas across ${sections.length} sections`
              : "No formulas loaded"}
          </span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-600">
          {open ? "Collapse" : "Expand"}
          {open ? <Icons.ChevronUp size={13} /> : <Icons.ChevronDown size={13} />}
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
                  <div key={section.id} className="rounded-lg border border-slate-200 bg-white p-3">
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
