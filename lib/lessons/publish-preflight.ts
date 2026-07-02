import { getLessonReadinessReport, getVisibleLessonBlocks, parseStructuredLessonContent } from "@/lib/lessons/structured-content";
import type { QuizReadinessState } from "@/lib/admin/quiz-dashboard";

export interface LessonPreflightInput {
  lessonId: string;
  title: string;
  lessonType: string;
  contentJson?: string | null;
  videoPlaybackId?: string | null;
  videoUrl?: string | null;
  quiz?: { id: string } | null;
  sourceMaterialId?: string | null;
}

export interface LessonPreflightResult {
  lessonId: string;
  title: string;
  lessonType: string;
  blockers: string[];
  warnings: string[];
  isReady: boolean;
}

export function runLessonPreflight(
  lesson: LessonPreflightInput,
  quizReadiness?: QuizReadinessState
): LessonPreflightResult {
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (!lesson.title.trim()) {
    blockers.push("Lesson needs a title.");
  }

  switch (lesson.lessonType) {
    case "text": {
      const doc = parseStructuredLessonContent(lesson.contentJson ?? null);
      for (const issue of getLessonReadinessReport(doc)) {
        if (issue.severity === "required") blockers.push(issue.message);
        else warnings.push(issue.message);
      }
      break;
    }
    case "video": {
      if (!lesson.videoPlaybackId?.trim() && !lesson.videoUrl?.trim()) {
        blockers.push("No video attached.");
      }
      if (lesson.contentJson) {
        const doc = parseStructuredLessonContent(lesson.contentJson);
        for (const block of getVisibleLessonBlocks(doc.blocks)) {
          if (block.type === "video" && !block.transcript?.trim()) {
            warnings.push("A video block is missing its transcript.");
          }
          if (block.type === "audio" && !block.transcript?.trim()) {
            warnings.push("An audio block is missing its transcript.");
          }
        }
      }
      break;
    }
    case "quiz": {
      if (!lesson.quiz?.id) {
        blockers.push("No quiz linked.");
      } else if (quizReadiness === "empty") {
        blockers.push("Linked quiz has no questions.");
      } else if (quizReadiness === "attention") {
        blockers.push("Linked quiz has incomplete questions (no correct answer marked).");
      }
      break;
    }
    case "source": {
      if (!lesson.sourceMaterialId) {
        blockers.push("No source material linked.");
      }
      break;
    }
  }

  return {
    lessonId: lesson.lessonId,
    title: lesson.title.trim() || "(Untitled)",
    lessonType: lesson.lessonType,
    blockers,
    warnings,
    isReady: blockers.length === 0,
  };
}

export function summarizePreflightResults(results: LessonPreflightResult[]) {
  const readyIds = results.filter((r) => r.isReady).map((r) => r.lessonId);
  const blockedIds = results.filter((r) => !r.isReady).map((r) => r.lessonId);
  return { readyIds, blockedIds, results };
}
