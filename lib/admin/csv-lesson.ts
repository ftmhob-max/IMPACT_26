import { parse } from "csv-parse/sync";
import { z } from "zod";
import { normalizeColumnName } from "./csv";

const LESSON_TYPES = ["text", "video", "quiz", "source"] as const;
const DIFFICULTIES = ["easy", "proficient", "expert"] as const;

export const csvLessonRowSchema = z.object({
  module_title: z.string().trim().min(2),
  lesson_title: z.string().trim().min(2),
  lesson_type: z.enum(LESSON_TYPES).default("text"),
  content_summary: z.string().trim().optional().nullable(),
  topic_tags: z.string().trim().optional().nullable(),
  difficulty: z.enum(DIFFICULTIES).optional().nullable(),
  domain: z.string().trim().optional().nullable(),
  position: z.coerce.number().int().nonnegative().optional().nullable(),
  learning_objectives: z.string().trim().optional().nullable(),
  asc_reference: z.string().trim().optional().nullable(),
  est_duration_min: z.coerce.number().positive().optional().nullable(),
});

export type CsvLessonRow = z.infer<typeof csvLessonRowSchema>;

export interface ParsedQuizQuestion {
  difficulty: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  sourceRef?: string | null;
}

export interface ParsedGlossaryRow {
  term: string;
  definition: string;
  sourceDocument?: string | null;
  domain?: string | null;
}

export interface ParsedWhobenefitsRow {
  roleTitle: string;
  relevance: string;
  domainTags?: string | null;
}

export interface LessonCsvPreviewResult {
  modules: Array<{
    title: string;
    lessons: Array<CsvLessonRow & { quiz_questions?: ParsedQuizQuestion[] }>;
  }>;
  errors: Array<{ row: number; field: string; message: string }>;
  totalLessons: number;
  glossaryTerms: ParsedGlossaryRow[];
  whoBenefits: ParsedWhobenefitsRow[];
}

export const LESSON_CSV_TEMPLATE = `section,module_title,lesson_title,lesson_type,content_summary,learning_objectives,difficulty,domain,topic_tags,asc_reference,est_duration_min,difficulty_tier,question_text,option_a,option_b,option_c,option_d,correct_answer,term,definition,role_title,relevance_to_course,domain_tags
MODULE,USPAP Foundations,What is USPAP?,text,"Overview of the Uniform Standards of Professional Appraisal Practice","Understand purpose and scope of USPAP",easy,law,USPAP|standards,ASC 105,12,,,,,,,,,,
MODULE,Assessment,USPAP Knowledge Check,quiz,"A two-question assessment covering USPAP foundations.","Demonstrate understanding of USPAP",proficient,compliance,USPAP|assessment,,10,,,,,,,,,,
QUIZ,,,,,,,,,,,Easy,Which body publishes USPAP?,The SEC,The Appraisal Foundation,The FASB,The AICPA,B,,,,,ASC 105
GLOSSARY,,,,,,,,,,,,,,,,,,USPAP,"Uniform Standards of Professional Appraisal Practice — the generally accepted standards for professional appraisal practice in the United States.",,,ASC 105,standards|appraisal
WHO_BENEFITS,,,,,,,,,,,,,,,,,,,Compliance Professionals,"Must understand USPAP to evaluate appraisal quality and regulatory compliance.",compliance|law`;

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

  // Detect multi-section mode: any record with a non-empty "section" key
  const isMultiSection = records.some(
    (r) => typeof r["section"] === "string" && (r["section"] as string).trim() !== ""
  );

  if (isMultiSection) {
    return parseMultiSection(records);
  }

  // ── Legacy flat path ──────────────────────────────────────────────────────
  const errors: LessonCsvPreviewResult["errors"] = [];
  const moduleMap = new Map<string, Array<CsvLessonRow & { quiz_questions?: ParsedQuizQuestion[] }>>();

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

  return { modules, errors, totalLessons, glossaryTerms: [], whoBenefits: [] };
}

function parseMultiSection(records: Array<Record<string, unknown>>): LessonCsvPreviewResult {
  const errors: LessonCsvPreviewResult["errors"] = [];
  const moduleMap = new Map<string, Array<CsvLessonRow & { quiz_questions?: ParsedQuizQuestion[] }>>();
  const glossaryTerms: ParsedGlossaryRow[] = [];
  const whoBenefits: ParsedWhobenefitsRow[] = [];

  let lastQuizLesson: (CsvLessonRow & { quiz_questions?: ParsedQuizQuestion[] }) | null = null;

  records.forEach((record, index) => {
    const rowNumber = index + 2;
    const section = ((record["section"] as string) ?? "").trim().toUpperCase();

    if (section === "MODULE") {
      const parsed = csvLessonRowSchema.safeParse(record);
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          errors.push({ row: rowNumber, field: issue.path.join(".") || "row", message: issue.message });
        }
        lastQuizLesson = null;
        return;
      }
      const row: CsvLessonRow & { quiz_questions?: ParsedQuizQuestion[] } = parsed.data;
      if (row.lesson_type === "quiz") {
        row.quiz_questions = [];
        lastQuizLesson = row;
      } else {
        lastQuizLesson = null;
      }
      if (!moduleMap.has(row.module_title)) {
        moduleMap.set(row.module_title, []);
      }
      moduleMap.get(row.module_title)!.push(row);
      return;
    }

    if (section === "QUIZ") {
      if (!lastQuizLesson) {
        errors.push({ row: rowNumber, field: "section", message: "QUIZ row has no preceding quiz-type MODULE lesson" });
        return;
      }
      const questionText = str(record["question_text"]);
      const optionA = str(record["option_a"]);
      const optionB = str(record["option_b"]);
      const optionC = str(record["option_c"]);
      const optionD = str(record["option_d"]);
      const correctAnswer = str(record["correct_answer"]);
      if (!questionText || !optionA || !optionB || !correctAnswer) {
        errors.push({ row: rowNumber, field: "question_text", message: "QUIZ row missing required fields (question_text, option_a, option_b, correct_answer)" });
        return;
      }
      const difficulty = str(record["difficulty_tier"]) || "easy";
      const sourceRef = str(record["asc_reference"]) || null;
      lastQuizLesson.quiz_questions!.push({ difficulty, questionText, optionA, optionB, optionC, optionD, correctAnswer, sourceRef });
      return;
    }

    if (section === "GLOSSARY") {
      const term = str(record["term"]);
      const definition = str(record["definition"]);
      if (!term || !definition) {
        errors.push({ row: rowNumber, field: "term", message: "GLOSSARY row missing term or definition" });
        return;
      }
      glossaryTerms.push({
        term,
        definition,
        sourceDocument: str(record["asc_reference"]) || null,
        domain: str(record["domain_tags"]) || null,
      });
      return;
    }

    if (section === "WHO_BENEFITS") {
      const roleTitle = str(record["role_title"]);
      const relevance = str(record["relevance_to_course"]);
      if (!roleTitle) return;
      whoBenefits.push({ roleTitle, relevance: relevance || "", domainTags: str(record["domain_tags"]) || null });
      return;
    }
    // unrecognized or empty section — skip silently
  });

  const modules = [...moduleMap.entries()].map(([title, lessons]) => ({ title, lessons }));
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  return { modules, errors, totalLessons, glossaryTerms, whoBenefits };
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}
