import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { parseLessonCsv, type CsvLessonRow, type ParsedQuizQuestion, type ParsedGlossaryRow } from "@/lib/admin/csv-lesson";
import { z } from "zod";

// Accepts either raw csvText or a pre-parsed modules array (from DOCX upload)
const bodySchema = z.union([
  z.object({
    csvText: z.string().min(1),
    courseTitle: z.string().trim().min(2),
    description: z.string().trim().optional().nullable(),
    publish: z.boolean().default(false),
  }),
  z.object({
    modules: z.array(
      z.object({
        title: z.string().trim().min(1),
        lessons: z.array(
          z.object({
            lesson_title: z.string().trim().min(1),
            lesson_type: z.enum(["text", "video", "quiz", "source"]).default("text"),
            content_summary: z.string().trim().optional().nullable(),
            learning_objectives: z.string().trim().optional().nullable(),
            position: z.number().int().nonnegative().optional().nullable(),
          })
        ),
      })
    ).min(1),
    courseTitle: z.string().trim().min(2),
    description: z.string().trim().optional().nullable(),
    publish: z.boolean().default(false),
  }),
]);

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) + "-" + Date.now().toString(36);
}

type LessonWithExtras = Pick<CsvLessonRow, "lesson_title" | "lesson_type" | "content_summary" | "learning_objectives" | "position" | "asc_reference" | "est_duration_min"> & {
  quiz_questions?: ParsedQuizQuestion[];
};

async function importModules(
  courseId: string,
  modules: Array<{ title: string; lessons: LessonWithExtras[] }>,
  publish: boolean,
  updatedById: string
): Promise<{ modulesCreated: number; lessonsCreated: number }> {
  let modulesCreated = 0;
  let lessonsCreated = 0;

  for (let mIdx = 0; mIdx < modules.length; mIdx++) {
    const { title: moduleTitle, lessons } = modules[mIdx];
    const moduleId = randomUUID();
    await adminDcMutate("CreateModule", {
      id: moduleId,
      courseId,
      title: moduleTitle,
      position: mIdx,
    });
    modulesCreated++;

    for (let lIdx = 0; lIdx < lessons.length; lIdx++) {
      const lesson = lessons[lIdx];
      const lessonId = randomUUID();
      await adminDcMutate("CreateLesson", {
        id: lessonId,
        moduleId,
        title: lesson.lesson_title,
        position: lesson.position ?? lIdx,
        lessonType: lesson.lesson_type ?? "text",
      });

      // Build content JSON
      let quizId: string | null = null;

      if (lesson.lesson_type === "quiz" && lesson.quiz_questions && lesson.quiz_questions.length > 0) {
        quizId = await createQuizFromQuestions(lessonId, lesson.lesson_title, lesson.quiz_questions, updatedById);
      }

      if (lesson.content_summary || lesson.learning_objectives || lesson.asc_reference || quizId !== null) {
        const content: unknown[] = [];
        if (lesson.content_summary) {
          content.push({ type: "paragraph", content: [{ type: "text", text: lesson.content_summary }] });
        }
        if (lesson.learning_objectives) {
          content.push({
            type: "paragraph",
            content: [
              { type: "text", text: "Learning objectives: ", marks: [{ type: "bold" }] },
              { type: "text", text: lesson.learning_objectives },
            ],
          });
        }
        if (lesson.asc_reference) {
          content.push({
            type: "paragraph",
            content: [{ type: "text", text: `Reference: ${lesson.asc_reference}`, marks: [{ type: "bold" }] }],
          });
        }

        await adminDcMutate("UpdateLesson", {
          id: lessonId,
          contentJson: content.length > 0 ? JSON.stringify({ type: "doc", content }) : null,
          videoPlaybackId: null,
          quizId,
          sourceMaterialId: null,
          durationSeconds: lesson.est_duration_min ? lesson.est_duration_min * 60 : null,
          status: publish ? "published" : "draft",
          isPublished: publish,
          updatedById,
          publishedAt: publish ? new Date().toISOString() : null,
        });
      }
      lessonsCreated++;
    }
  }

  return { modulesCreated, lessonsCreated };
}

async function createQuizFromQuestions(
  lessonId: string,
  lessonTitle: string,
  questions: ParsedQuizQuestion[],
  createdById: string
): Promise<string> {
  const quizId = randomUUID();
  await adminDcMutate("CreateQuiz", {
    id: quizId,
    title: lessonTitle,
    shuffleQuestions: false,
    shuffleChoices: false,
    status: "draft",
    createdById,
  });

  const letters = ["A", "B", "C", "D"] as const;
  const optionKeys = ["optionA", "optionB", "optionC", "optionD"] as const;

  for (let qi = 0; qi < questions.length; qi++) {
    const q = questions[qi];
    const questionId = randomUUID();
    await adminDcMutate("CreateQuestion", {
      id: questionId,
      questionText: q.questionText,
      questionType: "multiple_choice",
      difficulty: normalizeDifficulty(q.difficulty),
      domain: "general",
      status: "draft",
      isMultiselect: false,
      sourceRef: q.sourceRef ?? null,
      createdById,
    });

    for (let li = 0; li < letters.length; li++) {
      const letter = letters[li];
      const choiceText = q[optionKeys[li]];
      if (!choiceText) continue;
      await adminDcMutate("CreateAnswerChoice", {
        questionId,
        letter,
        choiceText,
        isCorrect: letter === q.correctAnswer.toUpperCase(),
        position: li,
      });
    }

    await adminDcMutate("AddQuestionToQuiz", {
      quizId,
      questionId,
      position: qi,
      pointValue: 1,
    });
  }

  return quizId;
}

function normalizeDifficulty(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower === "easy" || lower === "proficient" || lower === "expert") return lower;
  return "easy";
}

async function importGlossaryTerms(
  rows: ParsedGlossaryRow[],
  createdById: string
): Promise<number> {
  const now = new Date().toISOString();
  let count = 0;
  for (const row of rows) {
    await adminDcMutate("CreateGlossaryTerm", {
      id: randomUUID(),
      term: row.term,
      definition: row.definition,
      domain: row.domain ?? null,
      sourceDocument: row.sourceDocument ?? null,
      isPublished: false,
      updatedAt: now,
      createdById,
    });
    count++;
  }
  return count;
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { courseTitle, description, publish } = parsed.data;

  // Resolve modules — either parse CSV or use pre-parsed array
  let modules: Array<{ title: string; lessons: LessonWithExtras[] }>;
  let glossaryTerms: ParsedGlossaryRow[] = [];

  if ("csvText" in parsed.data) {
    const preview = parseLessonCsv(parsed.data.csvText);
    if (preview.errors.length > 0) {
      return NextResponse.json({ error: "CSV has validation errors", errors: preview.errors }, { status: 400 });
    }
    modules = preview.modules;
    glossaryTerms = preview.glossaryTerms;
  } else {
    modules = parsed.data.modules;
  }

  if (modules.length === 0) {
    return NextResponse.json({ error: "No modules found — check your file has data rows." }, { status: 400 });
  }

  const courseId = randomUUID();
  try {
    await adminDcMutate("CreateCourse", {
      id: courseId,
      slug: slugify(courseTitle),
      title: courseTitle,
      description: description || null,
      thumbnailUrl: null,
      createdById: auth.session.uid,
    });

    if (publish) {
      await adminDcMutate("UpdateCourse", {
        id: courseId,
        status: "published",
        isPublished: true,
        updatedById: auth.session.uid,
        publishedAt: new Date().toISOString(),
      });
    }

    const { modulesCreated, lessonsCreated } = await importModules(courseId, modules, publish, auth.session.uid);

    const glossaryTermsImported = await importGlossaryTerms(glossaryTerms, auth.session.uid);

    return NextResponse.json({ courseId, modulesCreated, lessonsCreated, glossaryTermsImported }, { status: 201 });
  } catch (error) {
    console.error("[courses/import]", error);
    return NextResponse.json({ error: "Unable to import course" }, { status: 500 });
  }
}
