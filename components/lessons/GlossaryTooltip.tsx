"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export interface GlossaryTermData {
  term: string;
  definition: string;
  example?: string | null;
}

export function buildTermsMap(terms: GlossaryTermData[]): Map<string, GlossaryTermData> {
  const map = new Map<string, GlossaryTermData>();
  for (const t of terms) {
    map.set(t.term.toLowerCase(), t);
  }
  return map;
}

export function buildGlossaryRegex(termNames: string[]): RegExp | null {
  if (termNames.length === 0) return null;
  // Sort longest-first so "Assessed Value" matches before "Value"
  const sorted = [...termNames].sort((a, b) => b.length - a.length);
  const pattern = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  return new RegExp(`\\b(${pattern})\\b`, "gi");
}

// ─── Tooltip popup card ───────────────────────────────────────────────────────

interface TooltipCardProps {
  term: GlossaryTermData;
  anchorRect: DOMRect;
  containerRect: DOMRect;
  onClose: () => void;
}

function TooltipCard({ term, anchorRect, containerRect, onClose }: TooltipCardProps) {
  const CARD_WIDTH = 280;
  const CARD_MAX_HEIGHT = 200;
  const OFFSET = 8;

  // Position above or below anchor, clamped to container
  const anchorTop = anchorRect.top - containerRect.top;
  const anchorLeft = anchorRect.left - containerRect.left;
  const anchorMidX = anchorLeft + anchorRect.width / 2;

  let left = anchorMidX - CARD_WIDTH / 2;
  left = Math.max(4, Math.min(left, containerRect.width - CARD_WIDTH - 4));

  const spaceAbove = anchorTop - OFFSET;
  const placeAbove = spaceAbove >= CARD_MAX_HEIGHT;
  const top = placeAbove
    ? anchorTop - OFFSET - CARD_MAX_HEIGHT
    : anchorTop + anchorRect.height + OFFSET;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      style={{ position: "absolute", top, left, width: CARD_WIDTH, zIndex: 50 }}
      className="pointer-events-auto rounded-xl border border-[#d8e6f4] bg-white shadow-lg"
      onMouseLeave={onClose}
    >
      <div className="px-4 py-3">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#185FA5] mb-1">
          Glossary
        </p>
        <p className="text-sm font-bold text-slate-900">{term.term}</p>
        <p className="mt-1 text-xs leading-[1.6] text-slate-600">{term.definition}</p>
        {term.example && (
          <p className="mt-1.5 text-[11px] italic text-slate-400">e.g. {term.example}</p>
        )}
        <Link
          href="/glossary"
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#185FA5] hover:underline"
        >
          View in glossary →
        </Link>
      </div>
    </div>
  );
}

// ─── Inline span used by GlossaryText (plain text context) ───────────────────

export function GlossarySpan({
  term,
  children,
}: {
  term: GlossaryTermData;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  let delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter() {
    delayTimer.current = setTimeout(() => {
      if (!spanRef.current) return;
      const container = spanRef.current.closest("[data-glossary-container]");
      setAnchorRect(spanRef.current.getBoundingClientRect());
      setContainerRect((container ?? document.body).getBoundingClientRect());
      setOpen(true);
    }, 150);
  }

  function handleMouseLeave() {
    if (delayTimer.current) clearTimeout(delayTimer.current);
    setOpen(false);
  }

  return (
    <span
      ref={spanRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="cursor-help border-b border-dotted border-[#185FA5] text-inherit"
    >
      {children}
      {open && anchorRect && containerRect && (
        <TooltipCard
          term={term}
          anchorRect={anchorRect}
          containerRect={containerRect}
          onClose={() => setOpen(false)}
        />
      )}
    </span>
  );
}
