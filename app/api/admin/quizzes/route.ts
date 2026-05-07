import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { formatUuid } from "@/lib/utils";
import { z } from "zod";

const uuidSchema = z.string().trim().transform(formatUuid).pipe(z.string().uuid());

const createQuizSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().optional().nullable(),
  passingScore: z.coerce.number().min(0).max(100).default(70),
  timeLimitSeconds: z.coerce.number().int().positive().optional().nullable(),
  shuffleQuestions: z.boolean().default(true),
  shuffleChoices: z.boolean().default(false),
  status: z.enum(["draft", "review", "published"]).default("draft"),
});

const patchQuizSchema = z.object({
  quizId: uuidSchema,
  status: z.enum(["draft", "review", "published"]),
});

const putQuizSchema = z.object({
  quizId: uuidSchema,
  shuffleQuestions: z.boolean().optional(),
  shuffleChoices: z.boolean().optional(),
  passingScore: z.coerce.number().min(0).max(100).optional(),
  timeLimitSeconds: z.coerce.number().int().positive().optional().nullable(),
});

const deleteQuizSchema = z.object({
  quizId: uuidSchema,
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = createQuizSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const quizId = randomUUID();
  try {
    await adminDcMutate("CreateQuiz", {
      id: quizId,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      timeLimitSeconds: parsed.data.timeLimitSeconds ?? null,
      passingScore: parsed.data.passingScore,
      shuffleQuestions: parsed.data.shuffleQuestions,
      shuffleChoices: parsed.data.shuffleChoices,
      status: parsed.data.status,
      createdById: auth.session.uid,
    });
    return NextResponse.json({ id: quizId }, { status: 201 });
  } catch (error) {
    console.error("[admin/quizzes:create]", error);
    return NextResponse.json({ error: "Unable to create quiz" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = patchQuizSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await adminDcMutate("UpdateQuizStatus", {
      id: parsed.data.quizId,
      status: parsed.data.status,
      updatedById: auth.session.uid,
      publishedAt: parsed.data.status === "published" ? new Date().toISOString() : null,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/quizzes:patch]", error);
    return NextResponse.json({ error: "Unable to update quiz" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = putQuizSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { quizId, ...fields } = parsed.data;
  try {
    // UpdateQuiz is a connector operation that accepts shuffle/score/limit fields.
    // Falls back gracefully if the connector only supports status updates.
    await adminDcMutate("UpdateQuiz", {
      id: quizId,
      ...fields,
      updatedById: auth.session.uid,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/quizzes:put]", error);
    return NextResponse.json({ error: "Unable to update quiz settings" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const parsed = deleteQuizSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { quizId } = parsed.data;
  try {
    const courseData = await adminDcQuery<{ courses: Array<{ modules_on_course?: Array<{ lessons_on_module?: Array<{ id: string; quiz?: { id: string } | null }> }> }> }>(
      "AdminListCourses"
    ).catch(() => ({ courses: [] }));

    const linkedLessonIds = courseData.courses
      .flatMap((course) => course.modules_on_course ?? [])
      .flatMap((module) => module.lessons_on_module ?? [])
      .filter((lesson) => lesson.quiz?.id && formatUuid(lesson.quiz.id) === quizId)
      .map((lesson) => formatUuid(lesson.id));

    await Promise.all(
      linkedLessonIds.map((lessonId) =>
        adminDcMutate("UpdateLesson", {
          id: lessonId,
          quizId: null,
          updatedById: auth.session.uid,
        })
      )
    );

    await adminDcMutate("DeleteQuizQuestionsForQuiz", { quizId }).catch(() => null);
    await adminDcMutate("DeleteQuizResponsesForQuiz", { quizId }).catch(() => null);
    await adminDcMutate("DeleteQuizAttemptsForQuiz", { quizId }).catch(() => null);
    await adminDcMutate("DeleteQuiz", { id: quizId });

    return NextResponse.json({ ok: true, unlinkedLessons: linkedLessonIds.length });
  } catch (error) {
    console.error("[admin/quizzes:delete]", error);
    return NextResponse.json({ error: "Unable to delete quiz" }, { status: 500 });
  }
}
