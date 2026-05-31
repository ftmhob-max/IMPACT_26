"use client";

import { useEffect, useRef, useState } from "react";
import { cn, DOMAINS } from "@/lib/utils";
import { useDomains } from "@/lib/hooks/useDomains";
import { X, Check } from "@/components/ui/Icons";

interface DomainMultiSelectProps {
  value: string[];
  onChange: (val: string[]) => void;
  /** Additional domain keys to merge into the list (e.g. derived from question data). */
  extraDomains?: string[];
  className?: string;
}

export function DomainMultiSelect({ value, onChange, extraDomains, className }: DomainMultiSelectProps) {
  const { domains: fetchedDomains, addDomain } = useDomains();
  const domains = Array.from(new Set([...fetchedDomains, ...(extraDomains ?? [])])).sort();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const trimmedQuery = query.trim().toLowerCase();
  const filtered = trimmedQuery
    ? domains.filter((d) => d.toLowerCase().includes(trimmedQuery))
    : domains;

  const exactMatch = domains.some((d) => d.toLowerCase() === trimmedQuery);
  const showAddOption = trimmedQuery.length > 0 && !exactMatch;

  function getOptionLabel(key: string): string {
    const known = DOMAINS[key as keyof typeof DOMAINS];
    return known ? `${key} — ${known.label}` : key;
  }

  function toggle(domain: string) {
    if (value.includes(domain)) {
      onChange(value.filter((d) => d !== domain));
    } else {
      onChange([...value, domain]);
    }
    setQuery("");
    inputRef.current?.focus();
  }

  function remove(domain: string) {
    onChange(value.filter((d) => d !== domain));
  }

  async function handleAdd() {
    const name = query.trim();
    if (!name) return;
    setAdding(true);
    const ok = await addDomain(name);
    if (ok) {
      onChange([...value, name]);
      setQuery("");
    }
    setAdding(false);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className={cn(
          "admin-input flex min-h-[2.25rem] flex-wrap items-center gap-1 cursor-text !p-1",
          open && "ring-2 ring-[#185FA5]/30 border-[#185FA5]"
        )}
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        {value.map((domain) => (
          <span
            key={domain}
            className="flex items-center gap-1 rounded-full bg-[#E6F1FB] px-2 py-0.5 text-[11px] font-semibold text-[#185FA5] shrink-0"
          >
            {domain}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                remove(domain);
              }}
              className="hover:text-red-500 leading-none"
              aria-label={`Remove ${domain}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          className="flex-1 min-w-[4rem] border-none outline-none bg-transparent text-sm placeholder:text-slate-400 py-0.5 px-1"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={value.length === 0 ? "All domains" : "Add more…"}
          autoComplete="off"
        />

        {value.length > 0 && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange([]);
              setQuery("");
            }}
            className="ml-auto shrink-0 text-slate-400 hover:text-slate-600 p-0.5"
            title="Clear all domains"
            aria-label="Clear all domains"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (filtered.length > 0 || showAddOption) && (
        <ul className="absolute z-50 mt-1 w-full min-w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg max-h-56 overflow-y-auto">
          {filtered.map((option) => {
            const selected = value.includes(option);
            return (
              <li key={option}>
                <button
                  type="button"
                  className={cn(
                    "w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50 flex items-center gap-2",
                    selected && "bg-slate-50"
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    toggle(option);
                  }}
                >
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-3.5 h-3.5 rounded border shrink-0",
                      selected ? "bg-[#185FA5] border-[#185FA5]" : "border-slate-300"
                    )}
                  >
                    {selected && <Check size={9} className="text-white stroke-[3]" />}
                  </span>
                  <span className={cn(selected && "font-medium")}>{getOptionLabel(option)}</span>
                </button>
              </li>
            );
          })}

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
                {adding ? "Adding…" : `Add '${query.trim()}' as new domain`}
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
