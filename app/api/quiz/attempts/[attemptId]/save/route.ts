import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { saveProgressSchema } from "@/lib/validations/quiz";

/**
 * POST /api/quiz/attempts/[attemptId]/save
 *
 * Saves an in-progress answer (answeredAt remains null — not yet submitted).
 * Allows mid-quiz state to survive page refreshes without evaluating the answer.
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
    const parsed = saveProgressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { questionId, selectedLetters } = parsed.data;

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
    const dcBaseUrl = buildDcBaseUrl(projectId);

    // Verify ownership
    const attemptRes = await adminFetch(dcBaseUrl, "GetAttemptOwner", { attemptId });
    const { quizAttempt } = await attemptRes.json();

    if (!quizAttempt || quizAttempt.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Upsert response with answeredAt = null (save without evaluating)
    await adminFetch(dcBaseUrl, "UpsertQuizResponse", {
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
