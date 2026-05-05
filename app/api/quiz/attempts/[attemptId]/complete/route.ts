import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";

/**
 * POST /api/quiz/attempts/[attemptId]/complete
 *
 * Finalizes an attempt: tallies all response scores, marks it completed,
 * and updates lesson progress.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { attemptId } = await params;
    const decoded = await verifyIdToken(request.headers.get("Authorization"));
    const userId = decoded.uid;

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
    const dcBaseUrl = buildDcBaseUrl(projectId);

    // ── Fetch attempt with all responses ────────────────────────────────────
    const attemptRes = await adminFetch(dcBaseUrl, "GetAttemptForCompletion", { attemptId });
    const { quizAttempt } = await attemptRes.json();

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
    const responses = quizAttempt.quizResponses ?? [];
    const scoreRaw = responses.reduce(
      (sum: number, r: { pointsEarned: number | null }) => sum + (r.pointsEarned ?? 0),
      0
    );
    const scoreMax = responses.reduce(
      (sum: number, r: { pointsPossible: number | null }) => sum + (r.pointsPossible ?? 0),
      0
    );
    const scorePct = scoreMax > 0 ? Math.round((scoreRaw / scoreMax) * 10000) / 100 : 0;
    const passed = quizAttempt.quiz.passingScore != null
      ? scorePct >= quizAttempt.quiz.passingScore
      : null;

    // ── Mark attempt completed ───────────────────────────────────────────────
    await adminFetch(dcBaseUrl, "CompleteQuizAttempt", {
      id: attemptId,
      scoreRaw,
      scoreMax,
      scorePct,
      passed: passed ?? false,
    });

    // ── Per-domain breakdown ─────────────────────────────────────────────────
    const domainBreakdown: Record<string, { earned: number; possible: number }> = {};
    for (const r of responses) {
      const domain = r.question?.domain ?? "unknown";
      if (!domainBreakdown[domain]) {
        domainBreakdown[domain] = { earned: 0, possible: 0 };
      }
      domainBreakdown[domain].earned += r.pointsEarned ?? 0;
      domainBreakdown[domain].possible += r.pointsPossible ?? 0;
    }

    return NextResponse.json({
      attemptId,
      scoreRaw,
      scoreMax,
      scorePct,
      passed,
      domainBreakdown,
    });
  } catch (err) {
    console.error("[/api/quiz/attempts/complete]", err);
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
