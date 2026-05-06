import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { z } from "zod";
import type { ParsedSection } from "@/lib/admin/docx-question-parser";

export const maxDuration = 120; // large imports with 400+ questions need time

const choiceSchema = z.object({
  letter: z.string(),
  choiceText: z.string(),
  isCorrect: z.boolean(),
});

const questionSchema = z.object({
  questionNumber: z.number(),
  questionText: z.string(),
  difficulty: z.enum(["easy", "intermediate", "expert"]),
  domain: z.string(),
  formulaRef: z.string(),
  topicTags: z.string(),
  rationale: z.string(),
  calculation: z.string(),
  choices: z.array(choiceSchema),
});

const formulaSchema = z.object({
  code: z.string(),
  name: z.string(),
  questions: z.array(questionSchema),
});

const sectionSchema = z.object({
  title: z.string(),
  formulas: z.array(formulaSchema),
});

const bodySchema = z.object({
  courseTitle: z.string().min(1).max(200),
  sections: z.array(sectionSchema).min(1),
  importQuestions: z.boolean().default(true),
  quizPerLesson: z.boolean().default(false),
});

// Run up to `limit` promises at a time to avoid overwhelming the DB
async function pAll<T>(tasks: Array<() => Promise<T>>, limit = 5): Promise<T[]> {
  const results: T[] = [];
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  }
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, worker);
  await Promise.all(workers);
  return results;
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { courseTitle, sections, importQuestions, quizPerLesson } = parsed.data;
  const typedSections = sections as ParsedSection[];

  const courseId = randomUUID();
  let modulesCreated = 0;
  let lessonsCreated = 0;
  let questionsCreated = 0;
  let quizzesCreated = 0;

  try {
    // ── Create course ────────────────────────────────────────────────────────
    await adminDcMutate("CreateCourse", {
      id: courseId,
      slug: courseTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80),
      title: courseTitle,
      description: `Auto-generated course from DOCX import. ${sections.length} sections, ${sections.reduce((s, sec) => s + sec.formulas.length, 0)} formulas.`,
      thumbnailUrl: null,
      createdById: auth.session.uid,
    });

    // ── Sections → Modules ───────────────────────────────────────────────────
    for (let sIdx = 0; sIdx < typedSections.length; sIdx++) {
      const section = typedSections[sIdx];
      const moduleId = randomUUID();

      await adminDcMutate("CreateModule", {
        id: moduleId,
        courseId,
        title: section.title,
        position: sIdx + 1,
      });
      modulesCreated++;

      // Optionally set description / learning objectives
      if (section.formulas.length > 0) {
        const objectives = section.formulas.map((f) => f.name);
        await adminDcMutate("UpdateModule", {
          id: moduleId,
          title: section.title,
          description: `Covers ${section.formulas.length} formula${section.formulas.length !== 1 ? "s" : ""}: ${objectives.slice(0, 5).join(", ")}${objectives.length > 5 ? "…" : ""}.`,
          learningObjectives: JSON.stringify(objectives),
          prerequisiteModuleIds: null,
          position: sIdx + 1,
          status: "draft",
        });
      }

      // ── Formulas → Lessons ─────────────────────────────────────────────────
      for (let fIdx = 0; fIdx < section.formulas.length; fIdx++) {
        const formula = section.formulas[fIdx];
        const lessonId = randomUUID();

        await adminDcMutate("CreateLesson", {
          id: lessonId,
          moduleId,
          title: `${formula.code}: ${formula.name}`,
          position: fIdx + 1,
          lessonType: "text",
        });
        lessonsCreated++;

        // Build rich content JSON for the lesson
        const questionSummary = formula.questions.length
          ? `This formula has ${formula.questions.length} practice questions (${
              formula.questions.filter((q) => q.difficulty === "easy").length
            } easy, ${
              formula.questions.filter((q) => q.difficulty === "intermediate").length
            } intermediate, ${
              formula.questions.filter((q) => q.difficulty === "expert").length
            } expert).`
          : "";

        await adminDcMutate("UpdateLesson", {
          id: lessonId,
          title: `${formula.code}: ${formula.name}`,
          contentJson: JSON.stringify({
            type: "doc",
            content: [
              { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: `Formula: ${formula.code}` }] },
              { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: formula.name }] },
              ...(questionSummary
                ? [{ type: "paragraph", content: [{ type: "text", text: questionSummary }] }]
                : []),
            ],
          }),
          videoPlaybackId: null,
          videoUrl: null,
          quizId: null,
          sourceMaterialId: null,
          durationSeconds: null,
          status: "draft",
          isPublished: false,
          updatedById: auth.session.uid,
          publishedAt: null,
        });

        // ── Questions → Question bank ────────────────────────────────────────
        if (!importQuestions || formula.questions.length === 0) continue;

        let quizId: string | null = null;
        if (quizPerLesson) {
          quizId = randomUUID();
          await adminDcMutate("CreateQuiz", {
            id: quizId,
            title: `${formula.code}: ${formula.name}`,
            description: `Practice quiz for ${formula.name} (${formula.code})`,
            timeLimitSeconds: null,
            passingScore: 0.7,
            shuffleQuestions: true,
            shuffleChoices: false,
            status: "draft",
            createdById: auth.session.uid,
          });
          quizzesCreated++;

          // Link quiz to lesson
          await adminDcMutate("UpdateLesson", {
            id: lessonId,
            title: `${formula.code}: ${formula.name}`,
            contentJson: null,
            videoPlaybackId: null,
            videoUrl: null,
            quizId,
            sourceMaterialId: null,
            durationSeconds: null,
            status: "draft",
            isPublished: false,
            updatedById: auth.session.uid,
            publishedAt: null,
          });
        }

        // Insert questions (concurrency limited to avoid DB timeouts)
        const questionTasks = formula.questions.map((q, qIdx) => async () => {
          const questionId = randomUUID();
          const isMultiselect = q.choices.filter((c) => c.isCorrect).length > 1;

          await adminDcMutate("CreateQuestion", {
            id: questionId,
            questionText: q.questionText,
            questionType: isMultiselect ? "multiselect" : "multiple_choice",
            difficulty: q.difficulty,
            domain: q.domain,
            formulaRef: q.formulaRef || null,
            topicTags: q.topicTags || null,
            status: "draft",
            isMultiselect,
            rationale: q.rationale || null,
            calculation: q.calculation || null,
            sourceRef: null,
            createdById: auth.session.uid,
          });

          // Insert answer choices sequentially (they depend on questionId)
          for (let cIdx = 0; cIdx < q.choices.length; cIdx++) {
            const choice = q.choices[cIdx];
            await adminDcMutate("CreateAnswerChoice", {
              questionId,
              letter: choice.letter,
              choiceText: choice.choiceText,
              isCorrect: choice.isCorrect,
              explanation: null,
              position: cIdx,
            });
          }

          // Link to quiz
          if (quizId) {
            await adminDcMutate("AddQuestionToQuiz", {
              quizId,
              questionId,
              position: qIdx + 1,
              pointValue: 1,
            });
          }

          return questionId;
        });

        await pAll(questionTasks, 4);
        questionsCreated += formula.questions.length;
      }
    }

    return NextResponse.json(
      {
        ok: true,
        courseId,
        modulesCreated,
        lessonsCreated,
        questionsCreated,
        quizzesCreated,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[generate-curriculum]", err);
    return NextResponse.json({ error: "Curriculum generation failed" }, { status: 500 });
  }
}
