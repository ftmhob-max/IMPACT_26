import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { evaluateAnswer, shuffle } from "@/lib/quiz-engine/evaluate";
import { sanitizeQuestion, type RawQuestion } from "@/lib/quiz-engine/sanitize";

/**
 * POST /api/quiz/[quizId]/start
 *
 * Creates a new quiz attempt or returns an existing in-progress one.
 * Returns a sanitized QuizSession — isCorrect and explanation are NEVER
 * included in the response payload (they are omitted by sanitizeQuestion).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;
    const decoded = await verifyIdToken(request.headers.get("Authorization"));
    const userId = decoded.uid;

    // Dynamically import Admin SDK to keep it server-only
    const { adminAuth } = await import("@/lib/firebase/admin");
    void adminAuth; // ensure module is loaded

    // ── Fetch quiz config + all questions with choices (Admin SDK bypasses @auth) ──
    // In production this uses the Data Connect Admin SDK or direct Cloud SQL query.
    // Represented here as a typed fetch to the Data Connect REST endpoint.
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
    const serviceId = "impact26-dataconnect";
    const location = "us-central1";
    const connectorId = "impact26-connector";
    const dcBaseUrl = `https://firebasedataconnect.googleapis.com/v1beta/projects/${projectId}/locations/${location}/services/${serviceId}/connectors/${connectorId}`;

    // Fetch quiz metadata
    const quizRes = await fetchDataConnect(dcBaseUrl, "GetQuizQuestionsAdmin", { quizId });
    if (!quizRes.ok) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    const { quiz, quizQuestions } = await quizRes.json();

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // ── Check for existing in-progress attempt (session resume) ──
    const existingRes = await fetchDataConnect(dcBaseUrl, "GetInProgressAttempt", {
      userId,
      quizId,
    });
    const existingData = await existingRes.json();
    const existing = existingData.quizAttempts?.[0];

    if (existing) {
      // Resume: return existing attempt with answered questions marked
      const answeredIds = new Set(
        (existing.quizResponses ?? [])
          .filter((r: { answeredAt: string | null }) => r.answeredAt !== null)
          .map((r: { question: { id: string } }) => r.question.id)
      );

      const questionOrder: string[] = JSON.parse(existing.questionOrder);
      const questionsMap = buildQuestionsMap(quizQuestions);
      const orderedQuestions = questionOrder
        .map((id) => questionsMap.get(id))
        .filter(Boolean) as RawQuestion[];

      return NextResponse.json({
        attemptId: existing.id,
        quizId,
        isResume: true,
        timeLimitSeconds: quiz.timeLimitSeconds ?? null,
        answeredQuestionIds: [...answeredIds],
        previousResponses: existing.quizResponses ?? [],
        questions: orderedQuestions.map(sanitizeQuestion),
      });
    }

    // ── New attempt: shuffle questions and choices if configured ──
    let questionList: RawQuestion[] = quizQuestions.map(
      (qq: { question: RawQuestion }) => qq.question
    );

    if (quiz.shuffleQuestions) {
      questionList = shuffle(questionList);
    }
    if (quiz.shuffleChoices) {
      questionList = questionList.map((q) => ({
        ...q,
        answerChoices: shuffle(q.answerChoices),
      }));
    }

    const questionOrder = questionList.map((q) => q.id);

    // ── Create attempt record ──
    const createRes = await fetchDataConnect(dcBaseUrl, "CreateQuizAttempt", {
      userId,
      quizId,
      questionOrder: JSON.stringify(questionOrder),
    });
    const { quizAttempt_insert } = await createRes.json();

    return NextResponse.json({
      attemptId: quizAttempt_insert.id,
      quizId,
      isResume: false,
      timeLimitSeconds: quiz.timeLimitSeconds ?? null,
      answeredQuestionIds: [],
      previousResponses: [],
      questions: questionList.map(sanitizeQuestion),
    });
  } catch (err) {
    console.error("[/api/quiz/start]", err);
    const message = err instanceof Error ? err.message : "Internal error";
    const status = message.includes("auth") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildQuestionsMap(quizQuestions: Array<{ question: RawQuestion }>) {
  const map = new Map<string, RawQuestion>();
  for (const qq of quizQuestions) {
    map.set(qq.question.id, qq.question);
  }
  return map;
}

async function fetchDataConnect(baseUrl: string, operationName: string, variables: object) {
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
