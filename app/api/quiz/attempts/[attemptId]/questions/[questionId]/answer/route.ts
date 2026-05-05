import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import type { EvaluationResult } from "@/lib/quiz-engine/evaluate";
import { formatUuid } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string; questionId: string }> }
) {
  try {
    const { attemptId: rawAttemptId, questionId: rawQuestionId } = await params;
    const attemptId = formatUuid(rawAttemptId);
    const questionId = formatUuid(rawQuestionId);
    
    const decoded = await verifyIdToken(request.headers.get("Authorization"));
    const userId = decoded.uid;

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
    // No in_progress check — peeking is allowed at any attempt status

    const questionOrder: string[] = JSON.parse(quizAttempt.questionOrder).map((id: string) => formatUuid(id));
    if (!questionOrder.includes(questionId)) {
      return NextResponse.json(
        { error: "Question not in this attempt" },
        { status: 400 }
      );
    }

    const { question } = await adminDcQuery<{ question: any }>(
      "GetQuestionWithAnswers",
      { questionId }
    );
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const choices = (question.answerChoices_on_question ?? [])
      .sort((a: any, b: any) => a.position - b.position)
      .map((c: any) => ({
        letter: c.letter,
        choiceText: c.choiceText,
        isCorrect: c.isCorrect,
        explanation: c.explanation ?? null,
      }));

    const result: EvaluationResult = {
      isCorrect: false,
      pointsEarned: 0,
      pointsPossible: 1,
      correctLetters: choices
        .filter((c: any) => c.isCorrect)
        .map((c: any) => c.letter),
      choices,
      rationale: question.rationale ?? null,
      calculation: question.calculation ?? null,
      sourceRef: question.sourceRef ?? null,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/quiz/peek-answer]", err);
    const message = err instanceof Error ? err.message : "Internal error";
    const status =
      message.includes("auth") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
