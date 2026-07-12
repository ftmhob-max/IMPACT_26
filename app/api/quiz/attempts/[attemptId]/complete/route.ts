// Backend API route: app/api/quiz/attempts/[attemptId]/complete/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { recordDailyActivitySafely } from "@/lib/firebase/daily-activity";
import {
  completeQuizAttempt,
  deriveQuizCompletion,
  type QuizCompletionQuestion,
  type QuizCompletionResponse,
} from "@/lib/firebase/learner-portal";

interface CompletionAttempt {
  id: string;
  status: string;
  questionOrder: string;
  user: { id: string };
  quiz: {
    id: string;
    passingScore: number | null;
    quizQuestions_on_quiz: QuizCompletionQuestion[];
  };
  quizResponses_on_attempt: QuizCompletionResponse[];
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { attemptId } = await params;
    const decoded = await verifyIdToken(request.headers.get("Authorization"));
    const userId = decoded.uid;

    // ── Fetch attempt with all responses ────────────────────────────────────
    const { quizAttempt } = await adminDcQuery<{ quizAttempt: CompletionAttempt | null }>(
      "GetAttemptForCompletion",
      { attemptId }
    );

    if (!quizAttempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }
    if (quizAttempt.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (quizAttempt.status !== "in_progress") {
      return NextResponse.json({ error: "Attempt already completed" }, { status: 409 });
    }

    // ── Tally scores ─────────────────────────────────────────────────────────
    const {
      scoreRaw,
      scoreMax,
      scorePct,
      domainBreakdown,
    } = deriveQuizCompletion(
      quizAttempt.questionOrder,
      quizAttempt.quiz.quizQuestions_on_quiz,
      quizAttempt.quizResponses_on_attempt,
    );
    const passed = quizAttempt.quiz.passingScore != null
      ? scorePct >= quizAttempt.quiz.passingScore
      : null;

    // ── Mark attempt completed ───────────────────────────────────────────────
    await completeQuizAttempt({
      id: attemptId,
      scoreRaw,
      scoreMax,
      scorePct,
      passed: passed ?? false,
      completedAt: new Date().toISOString(),
    });
    await recordDailyActivitySafely(userId);

    return NextResponse.json({ attemptId, scoreRaw, scoreMax, scorePct, passed, domainBreakdown });
  } catch (err) {
    console.error("[/api/quiz/attempts/complete]", err);
    const message = err instanceof Error ? err.message : "Internal error";
    const status = message.includes("auth") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
