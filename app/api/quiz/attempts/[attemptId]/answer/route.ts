import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcQuery, adminDcMutate } from "@/lib/firebase/admin-dc";
import { evaluateAnswer } from "@/lib/quiz-engine/evaluate";
import { submitAnswerSchema } from "@/lib/validations/quiz";
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
    const parsed = submitAnswerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { selectedLetters } = parsed.data;
    const questionId = formatUuid(parsed.data.questionId);

    // ── Fetch attempt and verify ownership ──────────────────────────────────
    const { quizAttempt } = await adminDcQuery<{ quizAttempt: any }>(
      "GetAttemptForEvaluation",
      { attemptId }
    );

    if (!quizAttempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }
    if (quizAttempt.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (quizAttempt.status !== "in_progress") {
      return NextResponse.json({ error: "Attempt is not in progress" }, { status: 409 });
    }

    const questionOrder: string[] = JSON.parse(quizAttempt.questionOrder).map((id: string) => formatUuid(id));
    if (!questionOrder.includes(questionId)) {
      return NextResponse.json(
        { error: "Question not in this attempt" },
        { status: 400 }
      );
    }
    const previousResponses = quizAttempt.quizResponses_on_attempt ?? [];
    const existing = previousResponses.find((r: any) => r.question.id === questionId);
    if (existing && existing.isCorrect !== null) {
      return NextResponse.json({ error: "Question already answered" }, { status: 409 });
    }

    // ── Fetch correct answers ────────────────────────────────────────────────
    const { question } = await adminDcQuery<{ question: any }>(
      "GetQuestionWithAnswers",
      { questionId }
    );
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const { quizQuestions } = await adminDcQuery<{ quizQuestions: Array<{ pointValue: number }> }>(
      "GetQuizQuestionPointValue",
      { quizId: quizAttempt.quiz.id, questionId }
    );
    const pointValue = quizQuestions?.[0]?.pointValue ?? 1.0;

    // ── Evaluate server-side ─────────────────────────────────────────────────
    const questionRecord = {
      ...question,
      answerChoices: question.answerChoices_on_question ?? [],
    };
    const result = evaluateAnswer(questionRecord, selectedLetters, pointValue);

    // ── Store response ───────────────────────────────────────────────────────
    await adminDcMutate("UpsertQuizResponse", {
      attemptId,
      questionId,
      selectedLetters: JSON.stringify(selectedLetters),
      isCorrect: result.isCorrect,
      pointsEarned: result.pointsEarned,
      pointsPossible: result.pointsPossible,
      answeredAt: new Date().toISOString().split("T")[0],
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/quiz/attempts/answer]", err);
    const message = err instanceof Error ? err.message : "Internal error";
    const status = message.includes("auth") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
