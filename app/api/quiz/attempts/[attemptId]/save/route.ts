import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcQuery, adminDcMutate } from "@/lib/firebase/admin-dc";
import { saveProgressSchema } from "@/lib/validations/quiz";
import { formatUuid } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const attemptId = formatUuid((await params).attemptId);
    const decoded = await verifyIdToken(request.headers.get("Authorization"));
    const userId = decoded.uid;

    const body = await request.json();
    const parsed = saveProgressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { selectedLetters } = parsed.data;
    const questionId = formatUuid(parsed.data.questionId);

    // Verify ownership
    const { quizAttempt } = await adminDcQuery<{ quizAttempt: { id: string; user: { id: string } } | null }>(
      "GetAttemptOwner",
      { attemptId }
    );
    if (!quizAttempt || quizAttempt.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Save without evaluating — answeredAt stays null
    await adminDcMutate("UpsertQuizResponse", {
      attemptId,
      questionId,
      selectedLetters: JSON.stringify(selectedLetters),
      isCorrect: null,
      pointsEarned: null,
      pointsPossible: null,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/quiz/attempts/save]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
