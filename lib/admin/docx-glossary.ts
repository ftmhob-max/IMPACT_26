import type { GlossaryImportRow } from "./csv-glossary";

// ─── HTML helpers ─────────────────────────────────────────────────────────────

function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/td>/gi, "\t")
    .replace(/<\/th>/gi, "\t")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function isHeadingOrBold(tag: string): boolean {
  return /^h[1-6]$/i.test(tag) || tag === "strong" || tag === "b";
}

// ─── Table parser ─────────────────────────────────────────────────────────────

function parseTable(tableHtml: string): GlossaryImportRow[] {
  const rows: GlossaryImportRow[] = [];
  const rowMatches = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) ?? [];

  let headers: string[] = [];
  rowMatches.forEach((rowHtml, idx) => {
    const cells = (rowHtml.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) ?? [])
      .map((c) => stripTags(c).trim());

    if (idx === 0) {
      // Treat first row as headers if it contains th tags or looks like labels
      const hasHeaders = /<th/i.test(rowHtml);
      const firstCellLower = cells[0]?.toLowerCase() ?? "";
      if (hasHeaders || firstCellLower === "term" || firstCellLower === "word" || firstCellLower === "name") {
        headers = cells.map((c) => c.toLowerCase().replace(/\s+/g, "_"));
        return;
      }
      // No explicit header — assume positional: col0=term, col1=definition, col2=domain, col3=category, col4=example
      headers = ["term", "definition", "domain", "category", "example"];
    }

    const get = (key: string) => {
      const i = headers.indexOf(key);
      return i >= 0 ? (cells[i] ?? "") : "";
    };

    const term = (get("term") || get("word") || get("name") || cells[0] || "").trim();
    const definition = (get("definition") || get("meaning") || get("desc") || cells[1] || "").trim();
    if (!term || !definition) return;

    const relRaw = get("related_terms") || get("related") || get("see_also") || "";
    rows.push({
      term,
      definition,
      domain: (get("domain") || get("subject") || "").trim().toLowerCase() || undefined,
      category: get("category").trim() || undefined,
      example: (get("example") || get("usage")).trim() || undefined,
      relatedTerms: relRaw ? relRaw.split(/[|,;]/).map((s) => s.trim()).filter(Boolean) : [],
      isPublished: false,
    });
  });

  return rows;
}

// ─── Definition-list parser ───────────────────────────────────────────────────
// Recognises the two most common patterns teachers use:
//   A. Heading-style:  <h2>Term</h2><p>Definition...</p>
//   B. Bold-inline:    <p><strong>Term</strong> – Definition...</p>
//   C. Labeled fields: after a definition line, "Example: ...", "Related: ..."

const EXAMPLE_PREFIX = /^(example[s]?|e\.g\.|usage|sample)[:\s]+/i;
const RELATED_PREFIX = /^(related|see also|see)[:\s]+/i;
const DOMAIN_PREFIX  = /^(domain|subject|area|category)[:\s]+/i;

function parseDefinitionBlocks(html: string): GlossaryImportRow[] {
  const results: GlossaryImportRow[] = [];

  // Split on block-level tags to get logical segments
  const segments = html
    .split(/(?=<(?:h[1-6]|p|li|div|table)\b)/i)
    .map((s) => s.trim())
    .filter(Boolean);

  let currentTerm = "";
  let currentDef = "";
  let currentExample = "";
  let currentRelated: string[] = [];
  let currentDomain = "";
  let currentCategory = "";
  let inTerm = false;

  function flush() {
    if (currentTerm && currentDef) {
      results.push({
        term: currentTerm,
        definition: currentDef,
        domain: currentDomain.toLowerCase() || undefined,
        category: currentCategory || undefined,
        example: currentExample || undefined,
        relatedTerms: currentRelated,
        isPublished: false,
      });
    }
    currentTerm = ""; currentDef = ""; currentExample = ""; currentRelated = [];
    currentDomain = ""; currentCategory = ""; inTerm = false;
  }

  for (const seg of segments) {
    // ── Table: delegate to table parser ──
    if (/^<table/i.test(seg)) {
      flush();
      results.push(...parseTable(seg));
      continue;
    }

    // ── Detect tag type ──
    const tagMatch = seg.match(/^<([a-z0-9]+)/i);
    const tag = tagMatch?.[1]?.toLowerCase() ?? "";
    const text = stripTags(seg).trim();
    if (!text) continue;

    // Pattern B: <p><strong>Term</strong> – definition</p>
    const boldInline = seg.match(/^<p[^>]*>\s*<(?:strong|b)[^>]*>([^<]{1,80})<\/(?:strong|b)>\s*[-–—:]\s*([\s\S]+?)<\/p>/i);
    if (boldInline) {
      flush();
      currentTerm = stripTags(boldInline[1]).trim();
      currentDef = stripTags(boldInline[2]).trim();
      inTerm = true;
      continue;
    }

    // Pattern A: heading = new term
    if (isHeadingOrBold(tag) || /^h[1-6]$/i.test(tag)) {
      // Only treat as a new term if it's short (< 80 chars) and looks like a noun phrase
      if (text.length <= 80 && !text.endsWith(".")) {
        flush();
        currentTerm = text;
        inTerm = true;
        continue;
      }
    }

    if (!inTerm) continue;

    // Parse labeled continuations
    if (EXAMPLE_PREFIX.test(text)) {
      currentExample = text.replace(EXAMPLE_PREFIX, "").trim();
    } else if (RELATED_PREFIX.test(text)) {
      currentRelated = text.replace(RELATED_PREFIX, "").split(/[|,;]/).map((s) => s.trim()).filter(Boolean);
    } else if (DOMAIN_PREFIX.test(text)) {
      const raw = text.replace(DOMAIN_PREFIX, "").trim().toLowerCase();
      // Check if it's splitting domain vs category (e.g. "domain: appraisal / category: USPAP")
      const catMatch = raw.match(/^([a-z]+)\s*[/|]\s*(?:category[:\s]+)?(.+)$/i);
      if (catMatch) { currentDomain = catMatch[1]; currentCategory = catMatch[2].trim(); }
      else currentDomain = raw;
    } else if (!currentDef) {
      currentDef = text;
    } else {
      // Continuation of definition
      currentDef += " " + text;
    }
  }

  flush();
  return results;
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export async function parseGlossaryDocx(buffer: Buffer): Promise<GlossaryImportRow[]> {
  const mammoth = await import("mammoth");
  const { value: html } = await mammoth.convertToHtml({ buffer });

  // Tables first, then definition blocks from remaining markup
  const rows = parseDefinitionBlocks(html);

  // Deduplicate within parsed output (keep first occurrence per term)
  const seen = new Set<string>();
  return rows.filter((r) => {
    const key = r.term.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
