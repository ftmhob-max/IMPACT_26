"use client";

import { useState } from "react";

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

  const filtered = search.trim()
    ? sections
        .map((s) => ({
          ...s,
          formulas: s.formulas.filter(
            (f) =>
              f.name.toLowerCase().includes(search.toLowerCase()) ||
              f.code.toLowerCase().includes(search.toLowerCase()) ||
              f.expression.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((s) => s.formulas.length > 0)
    : sections;

  return (
    <div className="space-y-3">
      <input
        type="search"
        placeholder="Search formulas…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
      />

      {filtered.map((section) => (
        <div key={section.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>{section.title}</span>
            <span className="text-slate-400 text-xs">
              {section.formulas.length} formulas {openSections.has(section.id) ? "▲" : "▼"}
            </span>
          </button>

          {openSections.has(section.id) && (
            <div className="divide-y divide-slate-50 border-t border-slate-100">
              {section.formulas.map((formula) => (
                <div key={formula.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-mono text-blue-600 mb-0.5">{formula.code}</p>
                      <p className="text-sm font-medium text-slate-800">{formula.name}</p>
                    </div>
                  </div>
                  <p className="mt-1 font-calc text-xs text-slate-600 bg-slate-50 rounded px-2 py-1">
                    {formula.expression}
                  </p>
                  {formula.notes && (
                    <p className="mt-1 text-xs text-slate-500">{formula.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
