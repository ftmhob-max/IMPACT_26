import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { evaluateAnswer } from "@/lib/quiz-engine/evaluate";
import { submitAnswerSchema } from "@/lib/validations/quiz";

/**
 * POST /api/quiz/attempts/[attemptId]/answer
 *
 * Security-critical endpoint. Fetches isCorrect from the database server-side,
 * evaluates the answer, stores the result, then returns full explanations.
 * Correct answers are NEVER exposed until after the learner submits.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { attemptId } = await params;
    const decoded = await verifyIdToken(request.headers.get("Authorization"));
    const userId = decoded.uid;

    const body = await request.json();
    const parsed = submitAnswerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { questionId, selectedLetters } = parsed.data;

    const { adminAuth } = await import("@/lib/firebase/admin");
    void adminAuth;

    // ── Fetch attempt and verify ownership ──────────────────────────────────
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
    const dcBaseUrl = buildDcBaseUrl(projectId);

    const attemptRes = await adminFetch(dcBaseUrl, "GetAttemptForEvaluation", { attemptId });
    const { quizAttempt } = await attemptRes.json();

    if (!quizAttempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }
    if (quizAttempt.user.id !== userId) {
      // Horizontal privilege escalation prevention
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (quizAttempt.status !== "in_progress") {
      return NextResponse.json({ error: "Attempt is not in progress" }, { status: 409 });
    }

    // ── Verify questionId belongs to this attempt ────────────────────────────
    const questionOrder: string[] = JSON.parse(quizAttempt.questionOrder);
    if (!questionOrder.includes(questionId)) {
      return NextResponse.json({ error: "Question not in this attempt" }, { status: 400 });
    }

    // ── Prevent re-submission of an already-answered question ────────────────
    const existingResponse = quizAttempt.quizResponses?.find(
      (r: { question: { id: string }; answeredAt: string | null }) =>
        r.question.id === questionId && r.answeredAt !== null
    );
    if (existingResponse) {
      return NextResponse.json({ error: "Question already answered" }, { status: 409 });
    }

    // ── Fetch correct answers (Admin SDK — bypasses @auth on isCorrect) ──────
    const questionRes = await adminFetch(dcBaseUrl, "GetQuestionWithAnswers", { questionId });
    const { question } = await questionRes.json();

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // ── Find point value for this question in this quiz ──────────────────────
    const quizQuestionRes = await adminFetch(dcBaseUrl, "GetQuizQuestionPointValue", {
      quizId: quizAttempt.quiz.id,
      questionId,
    });
    const { quizQuestions } = await quizQuestionRes.json();
    const pointValue = quizQuestions?.[0]?.pointValue ?? 1.0;

    // ── Evaluate server-side ─────────────────────────────────────────────────
    const result = evaluateAnswer(question, selectedLetters, pointValue);

    // ── Store response ───────────────────────────────────────────────────────
    await adminFetch(dcBaseUrl, "UpsertQuizResponse", {
      attemptId,
      questionId,
      selectedLetters: JSON.stringify(selectedLetters),
      isCorrect: result.isCorrect,
      pointsEarned: result.pointsEarned,
      pointsPossible: result.pointsPossible,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/quiz/attempts/answer]", err);
    const message = err instanceof Error ? err.message : "Internal error";
    const status = message.includes("auth") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

function buildDcBaseUrl(projectId: string) {
  return `https://firebasedataconnect.googleapis.com/v1beta/projects/${projectId}/locations/us-central1/services/impact26-dataconnect/connectors/impact26-connector`;
}

async function adminFetch(baseUrl: string, operationName: string, variables: object) {
  const { adminAuth } = await import("@/lib/firebase/admin");
  const token = await adminAuth.createCustomToken("server");
  return fetch(`${baseUrl}:executeQuery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ operationName, variables }),
  });
}
