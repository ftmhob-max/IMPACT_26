import { z } from "zod";

export const startAttemptSchema = z.object({
  quizId: z.string().min(32),
});

export const submitAnswerSchema = z.object({
  questionId: z.string().min(32),
  selectedLetters: z
    .array(z.string().length(1).toUpperCase())
    .min(1, "Select at least one answer")
    .max(5, "Too many selections"),
});

export const saveProgressSchema = z.object({
  questionId: z.string().min(32),
  selectedLetters: z.array(z.string().length(1)),
});

export type StartAttemptInput = z.infer<typeof startAttemptSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
export type SaveProgressInput = z.infer<typeof saveProgressSchema>;
