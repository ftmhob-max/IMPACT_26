import { parse } from "csv-parse/sync";
import { z } from "zod";
import { normalizeColumnName } from "./csv";

const LESSON_TYPES = ["text", "video", "quiz", "source"] as const;
const DIFFICULTIES = ["easy", "proficient", "expert"] as const;
const DOMAINS = ["math", "appraisal", "law", "philly", "admin", "ethics"] as const;

export const csvLessonRowSchema = z.object({
  module_title: z.string().trim().min(2),
  lesson_title: z.string().trim().min(2),
  lesson_type: z.enum(LESSON_TYPES).default("text"),
  content_summary: z.string().trim().optional().nullable(),
  topic_tags: z.string().trim().optional().nullable(),
  difficulty: z.enum(DIFFICULTIES).optional().nullable(),
  domain: z.enum(DOMAINS).optional().nullable(),
  position: z.coerce.number().int().nonnegative().optional().nullable(),
  learning_objectives: z.string().trim().optional().nullable(),
});

export type CsvLessonRow = z.infer<typeof csvLessonRowSchema>;

export interface LessonCsvPreviewResult {
  modules: Array<{
    title: string;
    lessons: CsvLessonRow[];
  }>;
  errors: Array<{ row: number; field: string; message: string }>;
  totalLessons: number;
}

export const LESSON_CSV_TEMPLATE = `module_title,lesson_title,lesson_type,content_summary,topic_tags,difficulty,domain,learning_objectives
Introduction to USPAP,What is USPAP?,text,"Overview of the Uniform Standards of Professional Appraisal Practice","USPAP|standards",easy,law,"Understand purpose and scope of USPAP"
Introduction to USPAP,Ethics Rule,text,"Conduct, Management, Confidentiality, and Record Keeping rules","ethics|conduct",proficient,ethics,"Apply the four sections of the Ethics Rule"
Valuation Methods,Sales Comparison Approach,text,"Adjusting comparable sales for market conditions","comparable sales|adjustments",proficient,appraisal,"Select and adjust comparables appropriately"
Valuation Methods,Income Capitalization,text,"Direct and yield capitalization techniques","cap rate|NOI|GRM",expert,math,"Calculate value via direct capitalization"`;

export function parseLessonCsv(csvText: string): LessonCsvPreviewResult {
  const rawRecords = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as Array<Record<string, unknown>>;

  // Normalize column names
  const records = rawRecords.map((record) => {
    const normalized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(record)) {
      normalized[normalizeColumnName(key)] = value;
    }
    return normalized;
  });

  const errors: LessonCsvPreviewResult["errors"] = [];
  const moduleMap = new Map<string, CsvLessonRow[]>();

  records.forEach((record, index) => {
    const rowNumber = index + 2;
    const parsed = csvLessonRowSchema.safeParse(record);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push({
          row: rowNumber,
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
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return { modules, errors, totalLessons };
}
