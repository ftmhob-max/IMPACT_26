import { parse as parseCsv } from "csv-parse/sync";

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
}

export interface FormulaImportItem {
  code: string;
  name: string;
  expression: string;
  notes?: string;
  calcMetaJson?: string;
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
    });
  }
  return rows;
}

export async function parseFormulaDocx(buffer: Buffer): Promise<ParsedFormulaRow[]> {
  const mammoth = await import("mammoth");
  const { value: text } = await mammoth.extractRawText({ buffer });
  return parseFormulaTextBlocks(text);
}

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
    });
  }
  return rows;
}

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
      position: section.formulas.length,
    });
  }

  return { sections: [...sectionMap.values()], errors };
}

export const CSV_TEMPLATE = `section_code,section_title,section_position,formula_code,formula_name,formula_expression,formula_notes,calc_expression,calc_output_label,calc_output_type,calc_variables,calc_explanation
S1,Sales Comparison & Regression,1,S1.F1,Trending Forward,"Adjusted = Sale × (1+r)^n","Trends a sale price forward in time using a monthly rate.",sale * (1 + rate / 100) ^ periods,Adjusted Sale Price,currency,"sale:Sale Price:currency:true:250000:The comparable sale price|rate:Monthly Rate (%):percentage:true:0.5:e.g. 0.5 for 0.5% per month|periods:Number of Months:integer:true:12:Months between sale date and valuation date","Brings a comparable sale forward to the valuation date."
S2,Income Capitalization,2,S2.F1,Direct Capitalization,Value = Net Operating Income / Capitalization Rate,"Core income approach formula for stabilized properties.",noi / (capRate / 100),Property Value,currency,"noi:Net Operating Income (NOI):currency:true:50000:|capRate:Capitalization Rate (%):percentage:true:7.5:Enter as percent e.g. 7.5","Divides NOI by the market cap rate to estimate value."
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
