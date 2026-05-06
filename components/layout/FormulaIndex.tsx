"use client";

import { useMemo, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { IconTile, StatusBadge } from "@/components/ui/LearnerPrimitives";

interface Formula {
  id: string;
  code: string;
  name: string;
  expression: string;
  notes?: string | null;
}

interface FormulaSection {
  id: string;
  code: string;
  title: string;
  formulas: Formula[];
}

interface FormulaIndexProps {
  sections: FormulaSection[];
}

export function FormulaIndex({ sections }: FormulaIndexProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id))
  );
  const [search, setSearch] = useState("");

  function toggleSection(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return sections;

    return sections
      .map((section) => ({
        ...section,
        formulas: section.formulas.filter((formula) =>
          [formula.name, formula.code, formula.expression, formula.notes ?? ""]
            .join(" ")
            .toLowerCase()
            .includes(query)
        ),
      }))
      .filter((section) => section.formulas.length > 0);
  }, [search, sections]);

  const totalVisible = filtered.reduce((sum, section) => sum + section.formulas.length, 0);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <IconTile icon={Icons.Search} size={16} className="h-9 w-9" />
          <div className="min-w-0 flex-1">
        <label htmlFor="formula-search" className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#185FA5]">
          Search formulas
        </label>
        <div className="relative mt-2">
          <input
            id="formula-search"
            type="search"
            placeholder="Try cap rate, COD, RCNLD, assessment ratio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#185FA5] focus:ring-2 focus:ring-[#E6F1FB]"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Showing {totalVisible} formulas across {filtered.length} sections.
        </p>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
          <Icons.Inbox size={32} className="mx-auto mb-3 text-slate-300" />
          No formulas match that search.
        </div>
      ) : (
        filtered.map((section) => {
          const isOpen = openSections.has(section.id) || Boolean(search.trim());
          return (
            <section key={section.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#F8F7F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-inset"
              >
                <div>
                  <StatusBadge tone="blue" className="mb-2">{section.code}</StatusBadge>
                  <h2 className="text-sm font-extrabold text-slate-900">{section.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                    {section.formulas.length}
                  </span>
                  {isOpen ? (
                    <Icons.ChevronUp size={18} className="text-slate-400" />
                  ) : (
                    <Icons.ChevronDown size={18} className="text-slate-400" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="grid gap-0 border-t border-slate-100 sm:grid-cols-2">
                  {section.formulas.map((formula) => (
                    <article key={formula.id} className="border-b border-slate-100 px-5 py-4 transition-colors hover:bg-[#fbfcfd]">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-xs font-semibold text-[#185FA5]">{formula.code}</p>
                          <h3 className="mt-1 text-sm font-semibold leading-snug text-slate-800">{formula.name}</h3>
                        </div>
                      </div>
                      <p className="font-calc rounded-md border border-[#b8d7f0] bg-[#f8fbff] px-3 py-2 text-[12px] text-slate-800">
                        {formula.expression}
                      </p>
                      {formula.notes && <p className="mt-2 text-xs leading-5 text-slate-500">{formula.notes}</p>}
                    </article>
                  ))}
                </div>
              )}
            </section>
          );
        })
      )}
    </div>
  );
}
