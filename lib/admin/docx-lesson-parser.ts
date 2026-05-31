import mammoth from "mammoth";
import { parse as parseHtml } from "node-html-parser";
import { normalizeColumnName } from "./csv";
import { csvLessonRowSchema } from "./csv-lesson";
import type { LessonCsvPreviewResult } from "./csv-lesson";

export async function parseDocxLessons(buffer: Buffer): Promise<LessonCsvPreviewResult> {
  const { value: html } = await mammoth.convertToHtml({ buffer });
  const root = parseHtml(html);

  const table = root.querySelector("table");
  if (!table) {
    return {
      modules: [],
      errors: [{ row: 0, field: "file", message: "No table found in document. Make sure the Word document contains a formatted table." }],
      totalLessons: 0,
      glossaryTerms: [],
      whoBenefits: [],
    };
  }

  const rows = table.querySelectorAll("tr");
  if (rows.length < 2) {
    return {
      modules: [],
      errors: [{ row: 0, field: "file", message: "Table must have a header row and at least one data row." }],
      totalLessons: 0,
      glossaryTerms: [],
      whoBenefits: [],
    };
  }

  // Extract and normalize headers from first row
  const headerCells = rows[0].querySelectorAll("th, td");
  const headers = headerCells.map((cell) => normalizeColumnName(cell.text.trim()));

  const errors: LessonCsvPreviewResult["errors"] = [];
  const moduleMap = new Map<string, ReturnType<typeof csvLessonRowSchema.parse>[]>();

  for (let rowIdx = 1; rowIdx < rows.length; rowIdx++) {
    const cells = rows[rowIdx].querySelectorAll("td");
    if (cells.every((cell) => !cell.text.trim())) continue; // skip blank rows

    const record: Record<string, unknown> = {};
    headers.forEach((header, colIdx) => {
      record[header] = cells[colIdx]?.text.trim() ?? "";
    });

    const parsed = csvLessonRowSchema.safeParse(record);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push({
          row: rowIdx + 1,
          field: issue.path.join(".") || "row",
          message: issue.message,
        });
      }
      continue;
    }

    const row = parsed.data;
    if (!moduleMap.has(row.module_title)) {
      moduleMap.set(row.module_title, []);
    }
    moduleMap.get(row.module_title)!.push(row);
  }

  const modules = [...moduleMap.entries()].map(([title, lessons]) => ({ title, lessons }));
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return { modules, errors, totalLessons, glossaryTerms: [], whoBenefits: [] };
}
