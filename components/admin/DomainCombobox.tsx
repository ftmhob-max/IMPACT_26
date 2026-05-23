"use client";

import { useEffect, useRef, useState } from "react";
import { cn, DOMAINS } from "@/lib/utils";
import { useDomains } from "@/lib/hooks/useDomains";

interface DomainComboboxProps {
  value: string;
  onChange: (val: string) => void;
  /** Show an "All domains" (or custom clearLabel) option that calls onChange(""). */
  allowClear?: boolean;
  clearLabel?: string;
  className?: string;
}

export function DomainCombobox({
  value,
  onChange,
  allowClear = false,
  clearLabel = "All domains",
  className,
}: DomainComboboxProps) {
  const { domains, addDomain } = useDomains();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click-outside to close
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const query = value.trim().toLowerCase();
  const filtered = query
    ? domains.filter((o) => o.toLowerCase().includes(query))
    : domains;

  const exactMatch = domains.some((o) => o.toLowerCase() === query);
  const showAddOption = query.length > 0 && !exactMatch;

  function getOptionLabel(key: string): string {
    const known = DOMAINS[key as keyof typeof DOMAINS];
    return known ? `${key} — ${known.label}` : key;
  }

  async function handleAdd() {
    const name = value.trim();
    if (!name) return;
    setAdding(true);
    const ok = await addDomain(name);
    if (ok) onChange(name);
    setAdding(false);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <input
        className="admin-input"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="e.g. math, appraisal, law"
        autoComplete="off"
      />

      {open && (allowClear || filtered.length > 0 || showAddOption) && (
        <ul className="absolute z-50 mt-1 w-full min-w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg max-h-56 overflow-y-auto">
          {allowClear && (
            <li className="border-b border-slate-100 mb-0.5 pb-0.5">
              <button
                type="button"
                className={cn(
                  "w-full px-3 py-1.5 text-left text-sm text-slate-400 hover:bg-slate-50",
                  value === "" && "bg-slate-50 font-medium"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange("");
                  setOpen(false);
                }}
              >
                {clearLabel}
              </button>
            </li>
          )}

          {filtered.map((option) => (
            <li key={option}>
              <button
                type="button"
                className={cn(
                  "w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50",
                  option === value && "bg-slate-100 font-medium"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(option);
                  setOpen(false);
                }}
              >
                {getOptionLabel(option)}
              </button>
            </li>
          ))}

          {showAddOption && (
            <li className="border-t border-slate-100 mt-0.5 pt-0.5">
              <button
                type="button"
                disabled={adding}
                className="w-full px-3 py-1.5 text-left text-sm text-[#185FA5] hover:bg-blue-50 disabled:opacity-60"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleAdd();
                }}
              >
                {adding ? "Adding…" : `Add '${value.trim()}' as new domain`}
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
