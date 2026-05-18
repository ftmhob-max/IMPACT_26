"use client";

import { useCallback, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import type { GlossaryTermData } from "./GlossaryTooltip";
import { buildTermsMap } from "./GlossaryTooltip";
import { GlossaryHighlightExtension } from "./GlossaryHighlightExtension";

interface GlossaryTooltipState {
  term: GlossaryTermData;
  anchorRect: DOMRect;
  containerRect: DOMRect;
}

export function RichTextRenderer({
  content,
  className = "prose prose-slate max-w-none text-sm leading-7 focus:outline-none",
  glossaryTerms,
}: {
  content: string;
  className?: string;
  glossaryTerms?: GlossaryTermData[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<GlossaryTooltipState | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const termsMap = glossaryTerms && glossaryTerms.length > 0 ? buildTermsMap(glossaryTerms) : null;

  const extensions = [
    StarterKit,
    Image.configure({ inline: false, allowBase64: true }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    ...(termsMap && termsMap.size > 0
      ? [GlossaryHighlightExtension.configure({ terms: termsMap })]
      : []),
  ];

  const editor = useEditor({
    extensions,
    content: (() => {
      try {
        return JSON.parse(content);
      } catch {
        return {
          type: "doc",
          content: String(content)
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((paragraph) => ({
              type: "paragraph",
              content: [{ type: "text", text: paragraph }],
            })),
        };
      }
    })(),
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: className },
    },
  });

  const handleMouseOver = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!termsMap) return;
      const target = (e.target as Element).closest("[data-glossary-term]") as HTMLElement | null;
      if (!target || !containerRef.current) return;

      const termKey = target.getAttribute("data-glossary-term");
      if (!termKey) return;
      const termData = termsMap.get(termKey);
      if (!termData) return;

      if (hideTimer.current) clearTimeout(hideTimer.current);
      setTooltip({
        term: termData,
        anchorRect: target.getBoundingClientRect(),
        containerRect: containerRef.current.getBoundingClientRect(),
      });
    },
    [termsMap]
  );

  const handleMouseOut = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const related = e.relatedTarget as Element | null;
    if (related?.closest?.("[data-glossary-tooltip]")) return;
    hideTimer.current = setTimeout(() => setTooltip(null), 100);
  }, []);

  if (!editor) return null;

  return (
    <div ref={containerRef} className="relative" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <EditorContent editor={editor} />
      {tooltip && (
        <GlossaryTooltipCard
          term={tooltip.term}
          anchorRect={tooltip.anchorRect}
          containerRect={tooltip.containerRect}
          onMouseEnter={() => { if (hideTimer.current) clearTimeout(hideTimer.current); }}
          onMouseLeave={() => setTooltip(null)}
        />
      )}
    </div>
  );
}

// ─── Tooltip card (positioned absolutely within the container) ────────────────

function GlossaryTooltipCard({
  term,
  anchorRect,
  containerRect,
  onMouseEnter,
  onMouseLeave,
}: {
  term: GlossaryTermData;
  anchorRect: DOMRect;
  containerRect: DOMRect;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const CARD_WIDTH = 280;
  const CARD_MAX_HEIGHT = 200;
  const OFFSET = 8;

  const anchorTop = anchorRect.top - containerRect.top;
  const anchorLeft = anchorRect.left - containerRect.left;
  const anchorMidX = anchorLeft + anchorRect.width / 2;

  let left = anchorMidX - CARD_WIDTH / 2;
  left = Math.max(4, Math.min(left, containerRect.width - CARD_WIDTH - 4));

  const placeAbove = anchorTop >= CARD_MAX_HEIGHT + OFFSET;
  const top = placeAbove
    ? anchorTop - OFFSET - CARD_MAX_HEIGHT
    : anchorTop + anchorRect.height + OFFSET;

  return (
    <div
      data-glossary-tooltip
      style={{ position: "absolute", top, left, width: CARD_WIDTH, zIndex: 50 }}
      className="pointer-events-auto rounded-xl border border-[#d8e6f4] bg-white shadow-lg"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
        <a
          href="/glossary"
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#185FA5] hover:underline"
        >
          View in glossary →
        </a>
      </div>
    </div>
  );
}
