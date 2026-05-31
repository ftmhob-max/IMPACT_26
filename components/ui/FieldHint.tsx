"use client";

import { useRef, useState } from "react";
import { Info } from "@/components/ui/Icons";

interface FieldHintProps {
  text: string;
}

export function FieldHint({ text }: FieldHintProps) {
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(true);
  const anchorRef = useRef<HTMLSpanElement>(null);

  function handleMouseEnter() {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setAbove(rect.top > 140);
    }
    setOpen(true);
  }

  return (
    <span
      ref={anchorRef}
      className="relative inline-flex items-center ml-1 align-middle"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setOpen(false)}
    >
      <Info
        size={14}
        className="text-slate-400 hover:text-[#185FA5] transition-colors cursor-help"
      />
      {open && (
        <span
          className="pointer-events-none absolute left-1/2 z-50 w-64 -translate-x-1/2 rounded-xl border border-[#d8e6f4] bg-white px-3 py-2.5 shadow-lg"
          style={above ? { bottom: "calc(100% + 8px)" } : { top: "calc(100% + 8px)" }}
        >
          <span className="block text-[11px] leading-relaxed text-slate-600">{text}</span>
          <span
            className="absolute left-1/2 -translate-x-1/2 border-4 border-transparent"
            style={
              above
                ? { top: "100%", borderTopColor: "#d8e6f4" }
                : { bottom: "100%", borderBottomColor: "#d8e6f4" }
            }
          />
        </span>
      )}
    </span>
  );
}
