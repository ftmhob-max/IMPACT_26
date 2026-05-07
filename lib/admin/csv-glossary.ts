import { parse } from "csv-parse/sync";

export interface GlossaryImportRow {
  term: string;
  definition: string;
  domain?: string;
  category?: string;
  example?: string;
  relatedTerms: string[];
  isPublished: boolean;
}

export interface GlossaryParseResult {
  rows: GlossaryImportRow[];
  errors: Array<{ row: number; message: string }>;
}

// ─── Column aliases ───────────────────────────────────────────────────────────

const ALIASES: Record<string, string> = {
  word: "term", name: "term", title: "term", "glossary term": "term",
  desc: "definition", meaning: "definition", explanation: "definition", description: "definition",
  subject: "domain", area: "domain",
  "example sentence": "example", usage: "example",
  related: "related_terms", "see also": "related_terms", "related terms": "related_terms",
  publish: "is_published", published: "is_published", active: "is_published",
};

function normalize(col: string): string {
  const lower = col.toLowerCase().trim();
  return ALIASES[lower] ?? lower.replace(/\s+/g, "_");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VALID_DOMAINS = new Set(["math", "appraisal", "law", "philly", "admin", "ethics", "general"]);

function parseBool(raw: string | undefined): boolean {
  const v = (raw ?? "").toLowerCase().trim();
  return v === "true" || v === "yes" || v === "1";
}

function parseRelated(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw.split(/[|,;]/).map((s) => s.trim()).filter(Boolean);
}

// ─── Main parser ──────────────────────────────────────────────────────────────

export function parseGlossaryCsv(csvText: string): GlossaryParseResult {
  const rows: GlossaryImportRow[] = [];
  const errors: Array<{ row: number; message: string }> = [];

  let raw: Record<string, string>[];
  try {
    raw = parse(csvText.trim(), {
      columns: (headers: string[]) => headers.map(normalize),
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });
  } catch (e: any) {
    return { rows: [], errors: [{ row: 0, message: `CSV parse error: ${e.message}` }] };
  }

  raw.forEach((record, idx) => {
    const rowNum = idx + 2; // 1-indexed + header row
    const term = record["term"]?.trim();
    const definition = record["definition"]?.trim();

    if (!term) { errors.push({ row: rowNum, message: "Missing required field: term" }); return; }
    if (!definition) { errors.push({ row: rowNum, message: `Row ${rowNum} "${term}": missing required field: definition` }); return; }

    const domain = record["domain"]?.trim().toLowerCase();
    if (domain && !VALID_DOMAINS.has(domain)) {
      errors.push({ row: rowNum, message: `Row ${rowNum} "${term}": unknown domain "${domain}" — valid: ${[...VALID_DOMAINS].join(", ")}` });
      return;
    }

    rows.push({
      term,
      definition,
      domain: domain || undefined,
      category: record["category"]?.trim() || undefined,
      example: record["example"]?.trim() || undefined,
      relatedTerms: parseRelated(record["related_terms"]),
      isPublished: parseBool(record["is_published"]),
    });
  });

  return { rows, errors };
}

// ─── CSV template ─────────────────────────────────────────────────────────────

export const GLOSSARY_CSV_TEMPLATE = `term,definition,domain,category,example,related_terms,is_published
Assessed Value,The value placed on a property by the assessor for the purpose of calculating property taxes.,appraisal,Valuation,"A property with a fair market value of $200,000 may have an assessed value of $100,000 if the assessment ratio is 50%.",Fair Market Value|Assessment Ratio|Millage Rate,false
Common Level Ratio (CLR),The ratio of assessed values to current market values as determined by the State Tax Equalization Board.,law,USPAP,"If the CLR is 0.75, a property assessed at $150,000 has an implied market value of $200,000.",Assessed Value|Market Value|STEB,false
Equalization,The process of adjusting assessments across jurisdictions to ensure uniform tax treatment.,appraisal,Administration,"County equalization ensures that properties in different municipalities bear proportionate tax burdens.",Assessment Ratio|CLR|Uniformity,false
`;
