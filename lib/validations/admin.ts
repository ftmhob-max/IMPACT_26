import { z } from "zod";
import { DIFFICULTIES, DOMAINS } from "@/lib/utils";

const domainValues = Object.keys(DOMAINS) as [keyof typeof DOMAINS, ...(keyof typeof DOMAINS)[]];
const difficultyValues = Object.keys(DIFFICULTIES) as [
  keyof typeof DIFFICULTIES,
  ...(keyof typeof DIFFICULTIES)[],
];

export const adminRoles = ["admin", "instructor", "viewer"] as const;
export type AdminRole = (typeof adminRoles)[number];

export const contentStatusSchema = z.enum(["draft", "review", "published", "archived"]);
export const questionTypeSchema = z.enum([
  "multiple_choice",
  "multiselect",
  "short_answer",
  "scenario",
]);

function normalizeQuestionType(value: unknown) {
  const normalized = String(value ?? "multiple_choice").trim().toLowerCase().replace(/[\s-]+/g, "_");
  const aliases: Record<string, z.infer<typeof questionTypeSchema>> = {
    mc: "multiple_choice",
    multiple: "multiple_choice",
    multiple_choice: "multiple_choice",
    single: "multiple_choice",
    single_choice: "multiple_choice",
    single_select: "multiple_choice",
    true_false: "multiple_choice",
    multi: "multiselect",
    multi_select: "multiselect",
    multiple_select: "multiselect",
    multiselect: "multiselect",
    select_all: "multiselect",
    short: "short_answer",
    short_answer: "short_answer",
    free_response: "short_answer",
    open_response: "short_answer",
    scenario: "scenario",
    case: "scenario",
    case_study: "scenario",
  };
  return aliases[normalized] ?? normalized;
}

export const roleUpdateSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["learner", ...adminRoles]),
});

export const courseSchema = z.object({
  title: z.string().trim().min(3),
  slug: z
    .string()
    .trim()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens"),
  description: z.string().trim().optional().nullable(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")).nullable(),
  publish: z.boolean().default(false),
});

export const lessonSchema = z.object({
  courseId: z.string().uuid(),
  moduleTitle: z.string().trim().min(2).default("New module"),
  lessonTitle: z.string().trim().min(2),
  lessonType: z.enum(["text", "video", "quiz", "source"]),
  contentJson: z.string().optional().nullable(),
  videoPlaybackId: z.string().optional().nullable(),
  quizId: z.string().uuid().optional().nullable(),
  sourceMaterialId: z.string().uuid().optional().nullable(),
  durationSeconds: z.coerce.number().int().nonnegative().optional().nullable(),
  publish: z.boolean().default(false),
});

const answerChoiceSchema = z.object({
  letter: z.string().trim().length(1).transform((value) => value.toUpperCase()),
  choiceText: z.string().trim().min(1),
  isCorrect: z.boolean().default(false),
  explanation: z.string().trim().optional().nullable(),
});

export const manualQuestionSchema = z.object({
  questionText: z.string().trim().min(5),
  questionType: questionTypeSchema.default("multiple_choice"),
  difficulty: z.enum(difficultyValues),
  domain: z.enum(domainValues),
  topicTags: z.array(z.string().trim().min(1)).default([]),
  formulaRef: z.string().trim().optional().nullable(),
  rationale: z.string().trim().optional().nullable(),
  calculation: z.string().trim().optional().nullable(),
  sourceRef: z.string().trim().optional().nullable(),
  choices: z.array(answerChoiceSchema).min(2).max(8),
  status: contentStatusSchema.default("draft"),
  quizId: z.string().uuid().optional().nullable(),
  pointValue: z.coerce.number().positive().default(1),
});

export const csvQuestionRowSchema = z.object({
  question_text: z.string().trim().min(5),
  question_type: z.preprocess(normalizeQuestionType, questionTypeSchema).default("multiple_choice"),
  difficulty: z.enum(difficultyValues),
  domain: z.enum(domainValues),
  choices: z.array(z.string().trim().min(1)).default([]),
  correct_answers: z.array(z.string().trim().min(1)).default([]),
  explanation: z.string().trim().optional().nullable(),
  rationale: z.string().trim().optional().nullable(),
  calculation: z.string().trim().optional().nullable(),
  source_ref: z.string().trim().optional().nullable(),
  topic_tags: z.array(z.string().trim().min(1)).default([]),
  formula_ref: z.string().trim().optional().nullable(),
  point_value: z.coerce.number().positive().default(1),
}).superRefine((row, ctx) => {
  if (row.correct_answers.length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 1,
      type: "array",
      inclusive: true,
      path: ["correct_answers"],
      message: "At least one correct answer is required.",
    });
  }
  if (row.question_type !== "short_answer" && row.choices.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 2,
      type: "array",
      inclusive: true,
      path: ["choices"],
      message: "At least 2 choices are required for choice-based questions.",
    });
  }
});

export const csvImportSchema = z.object({
  rows: z.array(csvQuestionRowSchema).min(1),
  quiz: z
    .object({
      title: z.string().trim().min(3),
      description: z.string().trim().optional().nullable(),
      timeLimitSeconds: z.coerce.number().int().positive().optional().nullable(),
      passingScore: z.coerce.number().min(0).max(100).default(70),
      shuffleQuestions: z.boolean().default(true),
      shuffleChoices: z.boolean().default(false),
      status: contentStatusSchema.default("draft"),
    })
    .optional(),
});

export const analyticsExportSchema = z.object({
  kind: z.enum(["attempts", "questions", "engagement"]).default("attempts"),
});

export type ManualQuestionInput = z.infer<typeof manualQuestionSchema>;
export type CsvQuestionRow = z.infer<typeof csvQuestionRowSchema>;
