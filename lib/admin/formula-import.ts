import { parse as parseCsv } from "csv-parse/sync";

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface FormulaExample {
  difficulty: "easy" | "proficient" | "expert";
  steps: string[];
  summary?: string;
}

export interface FormulaExamplesData {
  easy?: FormulaExample;
  proficient?: FormulaExample;
  expert?: FormulaExample;
}

export interface ParsedFormulaRow {
  sectionCode: string;
  sectionTitle: string;
  sectionPosition: number;
  code: string;
  name: string;
  expression: string;
  notes?: string;
  calcExpression?: string;
  calcOutputLabel?: string;
  calcOutputType?: string;
  calcVariables?: string;
  calcExplanation?: string;
  examplesJson?: string;
}

export interface FormulaImportItem {
  code: string;
  name: string;
  expression: string;
  notes?: string;
  calcMetaJson?: string;
  examplesJson?: string;
  position: number;
}

export interface ImportBatch {
  sections: Array<{
    code: string;
    title: string;
    position: number;
    formulas: FormulaImportItem[];
  }>;
  errors: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const REQUIRED_CSV_COLS = ["section_code", "section_title", "section_position", "formula_code", "formula_name", "formula_expression"] as const;

function parseCalcVariables(raw: string): object[] | null {
  if (!raw || !raw.trim()) return null;
  try {
    return raw.split("|").map((entry) => {
      const [key = "", label = "", type = "number", requiredStr = "true", placeholder = "", helperText = ""] = entry.trim().split(":");
      return {
        key: key.trim(),
        label: label.trim(),
        type: type.trim() || "number",
        required: requiredStr.trim() !== "false",
        placeholder: placeholder.trim() || undefined,
        helperText: helperText.trim() || undefined,
      };
    }).filter((v) => v.key && v.label);
  } catch {
    return null;
  }
}

function buildCalcMetaJson(row: ParsedFormulaRow): string | undefined {
  if (!row.calcExpression?.trim()) return undefined;
  const variables = parseCalcVariables(row.calcVariables ?? "");
  if (!variables || variables.length === 0) return undefined;
  const meta = {
    variables,
    expression: row.calcExpression.trim(),
    output: {
      key: "result",
      label: row.calcOutputLabel?.trim() || "Result",
      type: row.calcOutputType?.trim() || "number",
    },
    explanation: row.calcExplanation?.trim() || undefined,
  };
  return JSON.stringify(meta);
}

// Parse pipe-separated step strings: "Step 1 text | Step 2 text"
// Strips leading "Step N " prefix so steps are clean text.
function parseStepsPiped(raw: string): string[] {
  if (!raw?.trim()) return [];
  return raw.split("|").map((s) => s.trim().replace(/^Step\s+\d+\s*/i, "").trim()).filter(Boolean);
}

// ─── CSV parser ───────────────────────────────────────────────────────────────

export function parseFormulaCsv(text: string): ParsedFormulaRow[] {
  const records = parseCsv(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  const rows: ParsedFormulaRow[] = [];
  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    const csvRow = i + 2; // row 1 = header; data rows start at 2
    const missing = REQUIRED_CSV_COLS.filter((col) => !rec[col]?.trim());
    if (missing.length > 0) {
      rows.push({
        sectionCode: rec.section_code ?? `row-${csvRow}`,
        sectionTitle: rec.section_title ?? "",
        sectionPosition: 0,
        code: rec.formula_code ?? "",
        name: rec.formula_name ?? "",
        expression: `[ERROR row ${csvRow}: missing columns: ${missing.join(", ")}]`,
        notes: undefined,
      });
      continue;
    }

    // Build examplesJson from per-difficulty CSV columns if present
    let examplesJson: string | undefined;
    const easySteps = rec.easy_steps?.trim();
    const profSteps = rec.proficient_steps?.trim();
    const expertSteps = rec.expert_steps?.trim();
    if (easySteps || profSteps || expertSteps) {
      const data: FormulaExamplesData = {};
      if (easySteps) data.easy = { difficulty: "easy", steps: parseStepsPiped(easySteps), summary: rec.easy_summary?.trim() || undefined };
      if (profSteps) data.proficient = { difficulty: "proficient", steps: parseStepsPiped(profSteps), summary: rec.proficient_summary?.trim() || undefined };
      if (expertSteps) data.expert = { difficulty: "expert", steps: parseStepsPiped(expertSteps), summary: rec.expert_summary?.trim() || undefined };
      examplesJson = JSON.stringify(data);
    } else if (rec.examples_json?.trim()) {
      examplesJson = rec.examples_json.trim();
    }

    rows.push({
      sectionCode: rec.section_code.trim(),
      sectionTitle: rec.section_title.trim(),
      sectionPosition: parseInt(rec.section_position ?? "0") || 0,
      code: rec.formula_code.trim(),
      name: rec.formula_name.trim(),
      expression: rec.formula_expression.trim(),
      notes: rec.formula_notes?.trim() || undefined,
      calcExpression: rec.calc_expression?.trim() || undefined,
      calcOutputLabel: rec.calc_output_label?.trim() || undefined,
      calcOutputType: rec.calc_output_type?.trim() || undefined,
      calcVariables: rec.calc_variables?.trim() || undefined,
      calcExplanation: rec.calc_explanation?.trim() || undefined,
      examplesJson,
    });
  }
  return rows;
}

// ─── DOCX parser ──────────────────────────────────────────────────────────────

export async function parseFormulaDocx(buffer: Buffer): Promise<ParsedFormulaRow[]> {
  const mammoth = await import("mammoth");
  const { value: text } = await mammoth.extractRawText({ buffer });
  return parseFormulaCompassDocument(text);
}

// Parses the Assessment Formula Compass document format produced by the
// "Assessment_Formula_Compass_Explained" document. Each formula block
// contains ● EASY / ● PROFICIENT / ● EXPERT markers followed by Step N lines.
export function parseFormulaCompassDocument(text: string): ParsedFormulaRow[] {
  // First try the block format (--- separated)
  const hasBlocks = /^---+$/m.test(text);
  if (hasBlocks) return parseFormulaTextBlocks(text);

  // Otherwise try to parse the compass document structure
  const rows: ParsedFormulaRow[] = [];

  // Split on section boundaries: "S\d+ · " headings
  const sectionChunks = text.split(/(?=\nS\d+\s*[·•]\s)/);

  for (const sectionChunk of sectionChunks) {
    // Extract section header: "S1 · Sales Comparison & Regression"
    const sectionHeaderMatch = sectionChunk.match(/^S(\d+)\s*[·•]\s*([^\n]+)/m);
    if (!sectionHeaderMatch) continue;

    const sectionNum = sectionHeaderMatch[1];
    const sectionCode = `S${sectionNum}`;
    const sectionTitle = sectionHeaderMatch[2].trim();
    const sectionPosition = parseInt(sectionNum);

    // Split section into formula chunks: "F\d+ · " headings
    const formulaChunks = sectionChunk.split(/(?=\nF\d+\s*[·•]\s)/);

    for (const formulaChunk of formulaChunks) {
      // Extract formula header: "F1 · Trending Forward   Adjusted = Sale × (1+r)ⁿ"
      const formulaHeaderMatch = formulaChunk.match(/^F(\d+)\s*[·•]\s*([^\n]+)/m);
      if (!formulaHeaderMatch) continue;

      const formulaNum = formulaHeaderMatch[1];
      const formulaCode = `${sectionCode}.F${formulaNum}`;
      const headerRest = formulaHeaderMatch[2].trim();

      // The header line may contain "Name   Expression" separated by multiple spaces
      // or the expression appears on the next line after the name
      let formulaName = headerRest;
      let expression = "";

      // Look for expression on the same line after 2+ spaces or a tab
      const exprInHeader = headerRest.match(/^(.+?)\s{3,}(.+)$/);
      if (exprInHeader) {
        formulaName = exprInHeader[1].trim();
        expression = exprInHeader[2].trim();
      } else {
        // Expression appears as the first non-empty line after "Purpose:"
        const purposeMatch = formulaChunk.match(/Purpose:[^\n]*\n([^\n]+)/);
        if (!purposeMatch) continue;
        // The bold formula line is usually the line right after the header
        const lines = formulaChunk.split("\n").map((l) => l.trim()).filter(Boolean);
        const headerLineIdx = lines.findIndex((l) => l.startsWith(`F${formulaNum}`));
        if (headerLineIdx >= 0 && headerLineIdx + 1 < lines.length) {
          expression = lines[headerLineIdx + 1];
        }
      }

      if (!formulaName || !expression) continue;

      // Extract purpose/notes — first line after "Purpose:" keyword
      let notes: string | undefined;
      const purposeMatch = formulaChunk.match(/Purpose:\s*([^\n]+)/);
      if (purposeMatch) notes = purposeMatch[1].trim() || undefined;

      // Parse tiered examples
      const examplesData = parseDocxExamples(formulaChunk);
      const examplesJson = (examplesData.easy || examplesData.proficient || examplesData.expert)
        ? JSON.stringify(examplesData)
        : undefined;

      rows.push({
        sectionCode,
        sectionTitle,
        sectionPosition,
        code: formulaCode,
        name: formulaName,
        expression,
        notes,
        examplesJson,
      });
    }
  }

  return rows;
}

// Parses ● EASY / ● PROFICIENT / ● EXPERT blocks from a formula chunk of text.
function parseDocxExamples(text: string): FormulaExamplesData {
  const data: FormulaExamplesData = {};

  // Match sections starting with ● EASY, ● PROFICIENT, ● EXPERT (or plain EASY etc.)
  const difficultyPattern = /[●•]\s*(EASY|PROFICIENT|EXPERT)\s*\n([\s\S]*?)(?=[●•]\s*(?:EASY|PROFICIENT|EXPERT)|$)/gi;
  let match;

  while ((match = difficultyPattern.exec(text)) !== null) {
    const difficultyRaw = match[1].toLowerCase() as "easy" | "proficient" | "expert";
    const body = match[2];

    // Split into step lines
    const lines = body.split("\n").map((l) => l.trim()).filter(Boolean);
    const steps: string[] = [];
    let summary: string | undefined;

    for (const line of lines) {
      const stepMatch = line.match(/^Step\s+(\d+)\s+(.+)$/i);
      if (stepMatch) {
        steps.push(stepMatch[2].trim());
      } else if (steps.length > 0 && !line.match(/^[●•]/)) {
        // Non-step lines after steps are treated as a summary/interpretation
        summary = line;
      }
    }

    if (steps.length > 0) {
      data[difficultyRaw] = { difficulty: difficultyRaw, steps, summary };
    }
  }

  return data;
}

// ─── TXT block parser ─────────────────────────────────────────────────────────

export function parseFormulaTextBlocks(text: string): ParsedFormulaRow[] {
  const blocks = text.split(/^---+$/m).map((b) => b.trim()).filter(Boolean);
  const rows: ParsedFormulaRow[] = [];

  for (const block of blocks) {
    const lines = block.split("\n");
    const fields: Record<string, string> = {};
    for (const line of lines) {
      const m = line.match(/^([A-Z][A-Z ]+):\s*(.*)$/);
      if (m) {
        fields[m[1].trim().toUpperCase()] = m[2].trim();
      }
    }

    const sectionCode = fields["SECTION CODE"] ?? "";
    const code = fields["FORMULA CODE"] ?? "";
    const name = fields["FORMULA NAME"] ?? "";
    const expression = fields["EXPRESSION"] ?? "";

    if (!sectionCode || !code || !name || !expression) continue;

    // Build examplesJson from per-difficulty step fields
    let examplesJson: string | undefined;
    const easySteps = fields["EASY STEPS"];
    const profSteps = fields["PROFICIENT STEPS"];
    const expertSteps = fields["EXPERT STEPS"];
    if (easySteps || profSteps || expertSteps) {
      const data: FormulaExamplesData = {};
      if (easySteps) data.easy = { difficulty: "easy", steps: parseStepsPiped(easySteps), summary: fields["EASY SUMMARY"] || undefined };
      if (profSteps) data.proficient = { difficulty: "proficient", steps: parseStepsPiped(profSteps), summary: fields["PROFICIENT SUMMARY"] || undefined };
      if (expertSteps) data.expert = { difficulty: "expert", steps: parseStepsPiped(expertSteps), summary: fields["EXPERT SUMMARY"] || undefined };
      examplesJson = JSON.stringify(data);
    } else if (fields["EXAMPLES JSON"]) {
      examplesJson = fields["EXAMPLES JSON"];
    }

    rows.push({
      sectionCode,
      sectionTitle: fields["SECTION TITLE"] ?? sectionCode,
      sectionPosition: parseInt(fields["SECTION POSITION"] ?? "0") || 0,
      code,
      name,
      expression,
      notes: fields["NOTES"] || undefined,
      calcExpression: fields["CALC EXPRESSION"] || undefined,
      calcOutputLabel: fields["CALC OUTPUT LABEL"] || undefined,
      calcOutputType: fields["CALC OUTPUT TYPE"] || undefined,
      calcVariables: fields["VARIABLES"] || undefined,
      calcExplanation: fields["CALC EXPLANATION"] || undefined,
      examplesJson,
    });
  }
  return rows;
}

// ─── Batch builder ────────────────────────────────────────────────────────────

export function formulaRowsToImportBatch(rows: ParsedFormulaRow[]): ImportBatch {
  const errors: string[] = [];
  const sectionMap = new Map<string, { code: string; title: string; position: number; formulas: FormulaImportItem[] }>();

  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx];
    const rowLabel = `Row ${rowIdx + 2} (${row.sectionCode}/${row.code || "?"})`;
    if (row.expression.startsWith("[ERROR")) {
      errors.push(`${rowLabel}: ${row.expression}`);
      continue;
    }
    if (!row.code || !row.name || !row.expression) {
      errors.push(`${rowLabel}: missing required fields — code="${row.code}", name="${row.name}"`);
      continue;
    }

    if (!sectionMap.has(row.sectionCode)) {
      sectionMap.set(row.sectionCode, {
        code: row.sectionCode,
        title: row.sectionTitle || row.sectionCode,
        position: row.sectionPosition,
        formulas: [],
      });
    }

    const section = sectionMap.get(row.sectionCode)!;
    section.formulas.push({
      code: row.code,
      name: row.name,
      expression: row.expression,
      notes: row.notes,
      calcMetaJson: buildCalcMetaJson(row),
      examplesJson: row.examplesJson,
      position: section.formulas.length,
    });
  }

  return { sections: [...sectionMap.values()], errors };
}

// ─── Templates ────────────────────────────────────────────────────────────────

export const CSV_TEMPLATE = `section_code,section_title,section_position,formula_code,formula_name,formula_expression,formula_notes,calc_expression,calc_output_label,calc_output_type,calc_variables,calc_explanation,easy_steps,easy_summary,proficient_steps,proficient_summary,expert_steps,expert_summary
S1,Sales Comparison & Regression,1,S1.F1,Trending Forward,"Adjusted = Sale × (1+r)^n","Trends a sale price forward in time using a monthly rate.",sale * (1 + rate / 100) ^ periods,Adjusted Sale Price,currency,"sale:Sale Price:currency:true:250000:The comparable sale price|rate:Monthly Rate (%):percentage:true:0.5:e.g. 0.5 for 0.5% per month|periods:Number of Months:integer:true:12:Months between sale date and valuation date","Brings a comparable sale forward to the valuation date.","A comparable sold for $200,000 one year ago. The market appreciated 5% per year.|Apply: $200,000 × (1.05)^1 = $210,000.|Adjusted Sale Price = $210,000.","The comp is trended forward to reflect today's market.","A comp sold 18 months ago for $350,000. Annual appreciation = 6%. Convert to monthly: r_mo = (1.06)^(1/12) - 1 ≈ 0.4868%.|Apply: $350,000 × (1.004868)^18.|Factor = 1.0915. Adjusted = $350,000 × 1.0915 = $382,025.","The comp is trended to today at monthly compounding.","Three comps sold at varying times. Comp A $280,000 (24 mo ago). Comp B $310,000 (12 mo ago). Comp C $330,000 (6 mo ago). Annual rate = 4%.|Convert to monthly: r_mo ≈ 0.3274%.|Comp A: $280,000 × (1.003274)^24 = $303,070.|Comp B: $310,000 × (1.003274)^12 = $322,400.|Comp C: $330,000 × (1.003274)^6 = $336,500.","Each comp is now on equal footing at the current date for valid grid comparison."
`;

export const DOCX_TEMPLATE = `FORMULA COMPASS IMPORT TEMPLATE
================================
Use this file to import formulas in bulk. Copy the block structure below for each formula.
Separate each formula block with a line containing only three dashes: ---
All field names must appear exactly as shown (uppercase, with colon).

FIELD REFERENCE
---------------
SECTION CODE        Required. Short code like S1, S2, S3.
SECTION TITLE       Required. Full title like "Sales Comparison & Regression".
SECTION POSITION    Required. Integer ordering position (1, 2, 3...).
FORMULA CODE        Required. Code like S1.F1 or S1.F9.
FORMULA NAME        Required. Human-readable name like "Trending Forward".
EXPRESSION          Required. Display formula like "Adjusted = Sale × (1+r)^n".
NOTES               Optional. One-sentence description shown under the formula card.
CALC EXPRESSION     Optional. Math expression using variable keys: sale * (1 + rate/100) ^ periods
CALC OUTPUT LABEL   Optional. Label for the calculated result: "Adjusted Sale Price"
CALC OUTPUT TYPE    Optional. One of: currency, percentage, number, ratio, integer
VARIABLES           Optional. Pipe-separated list: key:label:type:required:placeholder:helperText
                    Types: currency, percentage, number, ratio, integer
                    Example: sale:Sale Price:currency:true:250000:|rate:Rate (%):percentage:true:0.5:
CALC EXPLANATION    Optional. Explanation shown in calculator panel (italic text).

TIERED EXAMPLES (optional)
--------------------------
EASY STEPS          Pipe-separated steps (omit "Step N" prefix): Step text|Step text|...
EASY SUMMARY        Optional interpretation line shown after Easy steps.
PROFICIENT STEPS    Pipe-separated steps for the proficient example.
PROFICIENT SUMMARY  Optional interpretation line for Proficient.
EXPERT STEPS        Pipe-separated steps for the expert example.
EXPERT SUMMARY      Optional interpretation line for Expert.

EXAMPLE FORMULAS
----------------

SECTION CODE: S1
SECTION TITLE: Sales Comparison & Regression
SECTION POSITION: 1
FORMULA CODE: S1.F1
FORMULA NAME: Trending Forward
EXPRESSION: Adjusted = Sale × (1+r)^n
NOTES: Trends a comparable sale forward to the valuation date using a monthly market change rate.
CALC EXPRESSION: sale * (1 + rate / 100) ^ periods
CALC OUTPUT LABEL: Adjusted Sale Price
CALC OUTPUT TYPE: currency
VARIABLES: sale:Sale Price:currency:true:250000:The comparable sale price|rate:Monthly Rate (%):percentage:true:0.5:e.g. 0.5 for 0.5%/month|periods:Number of Months:integer:true:12:Months since the sale date
CALC EXPLANATION: Brings a comparable sale price forward in time using a monthly market change rate.
EASY STEPS: A comparable sold for $200,000 one year ago. The market appreciated 5% per year. r = 0.05, n = 1.|Apply: $200,000 × (1 + 0.05)^1 = $200,000 × 1.05.|Adjusted Sale Price = $210,000.
EASY SUMMARY: The comp is now trended forward to reflect today's market.
PROFICIENT STEPS: A comp sold 18 months ago for $350,000. Annual appreciation = 6%. Convert to monthly: r_mo = (1.06)^(1/12) − 1 ≈ 0.4868%. n = 18 months.|Apply: $350,000 × (1.004868)^18.|(1.004868)^18 ≈ 1.0915.|Adjusted = $350,000 × 1.0915 = $382,025.
PROFICIENT SUMMARY: The comp is trended to today at monthly compounding.
EXPERT STEPS: Three comps sold at varying times: Comp A $280,000 (24 months ago), Comp B $310,000 (12 months ago), Comp C $330,000 (6 months ago). Annual rate = 4%.|Convert to monthly: r_mo ≈ 0.3274%.|Comp A: $280,000 × (1.003274)^24 = $303,070.|Comp B: $310,000 × (1.003274)^12 = $322,400.|Comp C: $330,000 × (1.003274)^6 = $336,500.
EXPERT SUMMARY: Each comp is now on equal footing at the current date, allowing valid grid comparison.
---
SECTION CODE: S2
SECTION TITLE: Income Capitalization
SECTION POSITION: 2
FORMULA CODE: S2.F1
FORMULA NAME: Direct Capitalization
EXPRESSION: Value = Net Operating Income / Capitalization Rate
NOTES: Core income approach formula for stabilized properties.
CALC EXPRESSION: noi / (capRate / 100)
CALC OUTPUT LABEL: Property Value
CALC OUTPUT TYPE: currency
VARIABLES: noi:Net Operating Income (NOI):currency:true:50000:|capRate:Capitalization Rate (%):percentage:true:7.5:Enter as percent e.g. 7.5
CALC EXPLANATION: Divides stabilized NOI by the market-derived capitalization rate to produce a value indication.
---
`;
