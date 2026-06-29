// Back-end: shared DOCX table extraction via mammoth + node-html-parser.
import mammoth from "mammoth";
import { parse as parseHtml } from "node-html-parser";
import { normalizeColumnName } from "./csv";

export interface DocxTableParseResult {
  headers: string[];
  rows: Record<string, unknown>[];
  errors: Array<{ row: number; field: string; message: string }>;
}

export async function parseDocxTableRows(buffer: Buffer): Promise<DocxTableParseResult> {
  const { value: html } = await mammoth.convertToHtml({ buffer });
  return parseHtmlTableRows(html);
}

export function parseHtmlTableRows(html: string): DocxTableParseResult {
  const root = parseHtml(html);
  const table = root.querySelector("table");
  if (!table) {
    return {
      headers: [],
      rows: [],
      errors: [{ row: 0, field: "file", message: "No table found in document. Make sure the Word document contains a formatted table." }],
    };
  }

  const tableRows = table.querySelectorAll("tr");
  if (tableRows.length < 2) {
    return {
      headers: [],
      rows: [],
      errors: [{ row: 0, field: "file", message: "Table must have a header row and at least one data row." }],
    };
  }

  const headerCells = tableRows[0].querySelectorAll("th, td");
  const headers = headerCells.map((cell) => normalizeColumnName(cell.text.trim()));
  const rows: Record<string, unknown>[] = [];

  for (let rowIdx = 1; rowIdx < tableRows.length; rowIdx++) {
    const cells = tableRows[rowIdx].querySelectorAll("td");
    if (cells.every((cell) => !cell.text.trim())) continue;

    const record: Record<string, unknown> = {};
    headers.forEach((header, colIdx) => {
      record[header] = cells[colIdx]?.text.trim() ?? "";
    });
    rows.push(record);
  }

  return { headers, rows, errors: [] };
}
