import { csvLessonRowSchema } from "./csv-lesson";
import type { LessonCsvPreviewResult } from "./csv-lesson";
import { parseDocxTableRows } from "./docx-table";

export async function parseDocxLessons(buffer: Buffer): Promise<LessonCsvPreviewResult> {
  const table = await parseDocxTableRows(buffer);
  if (table.errors.length > 0) {
    return {
      modules: [],
      errors: table.errors,
      totalLessons: 0,
      glossaryTerms: [],
      whoBenefits: [],
    };
  }

  const errors: LessonCsvPreviewResult["errors"] = [];
  const moduleMap = new Map<string, ReturnType<typeof csvLessonRowSchema.parse>[]>();

  table.rows.forEach((record, index) => {
    const parsed = csvLessonRowSchema.safeParse(record);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push({
          row: index + 2,
          field: issue.path.join(".") || "row",
          message: issue.message,
        });
      }
      return;
    }

    const row = parsed.data;
    if (!moduleMap.has(row.module_title)) {
      moduleMap.set(row.module_title, []);
    }
    moduleMap.get(row.module_title)!.push(row);
  });

  const modules = [...moduleMap.entries()].map(([title, lessons]) => ({ title, lessons }));
  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);

  return { modules, errors, totalLessons, glossaryTerms: [], whoBenefits: [] };
}
