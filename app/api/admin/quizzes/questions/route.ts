import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { formatUuid } from "@/lib/utils";
import { z } from "zod";

const uuidSchema = z.string().trim().transform(formatUuid).pipe(z.string().uuid());

const addQuestionsSchema = z.object({
  quizId: uuidSchema,
  questionIds: z.array(uuidSchema).min(1),
  pointValue: z.coerce.number().positive().default(1),
});

const removeQuestionSchema = z.object({
  quizId: uuidSchema,
  questionId: uuidSchema,
});

const reorderQuestionsSchema = z.object({
  quizId: uuidSchema,
  items: z.array(z.object({ id: uuidSchema, position: z.number().int().nonnegative() })).min(1),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = addQuestionsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { quizId, questionIds, pointValue } = parsed.data;
  try {
    const [positionData, existingQuizData] = await Promise.all([
      adminDcQuery<{ quizQuestions: Array<{ position: number }> }>("GetQuizQuestionCount", {
        quizId,
      }).catch(() => ({ quizQuestions: [] })),
      adminDcQuery<{
        quizQuestions: Array<{ question: { id: string } }>;
      }>("GetQuizQuestionsAdmin", { quizId }).catch(() => ({ quizQuestions: [] })),
    ]);

    const maxPosition = positionData.quizQuestions.reduce((max, q) => Math.max(max, q.position), -1);
    const existingQuestionIds = new Set(
      existingQuizData.quizQuestions.map((entry) => formatUuid(entry.question.id))
    );

    const uniqueRequestedIds = [...new Set(questionIds)];
    const questionIdsToAdd = uniqueRequestedIds.filter((questionId) => !existingQuestionIds.has(questionId));
    const skipped = uniqueRequestedIds.length - questionIdsToAdd.length;

    for (let i = 0; i < questionIdsToAdd.length; i++) {
      await adminDcMutate("AddQuestionToQuiz", {
        quizId,
        questionId: questionIdsToAdd[i],
        position: maxPosition + i + 1,
        pointValue,
      });
    }

    return NextResponse.json({ added: questionIdsToAdd.length, skipped }, { status: 201 });
  } catch (error) {
    console.error("[admin/quizzes/questions]", error);
    return NextResponse.json({ error: "Unable to add questions to quiz" }, { status: 500 });
  }
}

// Remove a single question from a quiz (non-destructive — question stays in the bank)
export async function DELETE(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const parsed = removeQuestionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await adminDcMutate("RemoveQuestionFromQuiz", {
      quizId: parsed.data.quizId,
      questionId: parsed.data.questionId,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/quizzes/questions DELETE]", error);
    return NextResponse.json({ error: "Unable to remove question from quiz" }, { status: 500 });
  }
}

// Reorder questions within a quiz by updating their positions
export async function PATCH(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const parsed = reorderQuestionsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { quizId, items } = parsed.data;
  try {
    for (const item of items) {
      await adminDcMutate("ReorderQuizQuestion", {
        quizId,
        questionId: item.id,
        position: item.position,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/quizzes/questions PATCH]", error);
    return NextResponse.json({ error: "Unable to reorder questions" }, { status: 500 });
  }
}
