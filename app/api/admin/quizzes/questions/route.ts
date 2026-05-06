import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { z } from "zod";

const addQuestionsSchema = z.object({
  quizId: z.string().uuid(),
  questionIds: z.array(z.string().uuid()).min(1),
  pointValue: z.coerce.number().positive().default(1),
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
    // Get current max position in quiz
    const data = await adminDcQuery<{ quizQuestions: Array<{ position: number }> }>(
      "GetQuizQuestionCount",
      { quizId }
    ).catch(() => ({ quizQuestions: [] }));
    const maxPosition = data.quizQuestions.reduce((max, q) => Math.max(max, q.position), -1);

    for (let i = 0; i < questionIds.length; i++) {
      await adminDcMutate("AddQuestionToQuiz", {
        quizId,
        questionId: questionIds[i],
        position: maxPosition + i + 1,
        pointValue,
      });
    }
    return NextResponse.json({ added: questionIds.length }, { status: 201 });
  } catch (error) {
    console.error("[admin/quizzes/questions]", error);
    return NextResponse.json({ error: "Unable to add questions to quiz" }, { status: 500 });
  }
}
