"use client";

import type { GlossaryTermData } from "@/components/lessons/GlossaryTooltip";
import { GlossarySpan, buildGlossaryRegex } from "@/components/lessons/GlossaryTooltip";

export function GlossaryText({
  text,
  termsMap,
}: {
  text: string;
  termsMap: Map<string, GlossaryTermData>;
}) {
  if (termsMap.size === 0) return <>{text}</>;

  const termNames = [...termsMap.values()].map((t) => t.term);
  const regex = buildGlossaryRegex(termNames);
  if (!regex) return <>{text}</>;

  const segments: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  regex.lastIndex = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    const termKey = match[0].toLowerCase();
    const termData = termsMap.get(termKey);
    if (termData) {
      segments.push(
        <GlossarySpan key={key++} term={termData}>
          {match[0]}
        </GlossarySpan>
      );
    } else {
      segments.push(<span key={key++}>{match[0]}</span>);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return <>{segments}</>;
}
