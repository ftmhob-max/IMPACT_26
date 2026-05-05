import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcQuery, adminDcMutate } from "@/lib/firebase/admin-dc";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { attemptId } = await params;
    const decoded = await verifyIdToken(request.headers.get("Authorization"));
    const userId = decoded.uid;

    // ── Fetch attempt with all responses ────────────────────────────────────
    const { quizAttempt } = await adminDcQuery<{ quizAttempt: any }>(
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
    const responses: Array<{ pointsEarned: number | null; pointsPossible: number | null; question: { domain: string } }> =
      quizAttempt.quizResponses_on_attempt ?? [];

    const scoreRaw = responses.reduce((sum, r) => sum + (r.pointsEarned ?? 0), 0);
    const scoreMax = responses.reduce((sum, r) => sum + (r.pointsPossible ?? 0), 0);
    const scorePct = scoreMax > 0 ? Math.round((scoreRaw / scoreMax) * 10000) / 100 : 0;
    const passed = quizAttempt.quiz.passingScore != null
      ? scorePct >= quizAttempt.quiz.passingScore
      : null;

    // ── Mark attempt completed ───────────────────────────────────────────────
    await adminDcMutate("CompleteQuizAttempt", {
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
      if (!domainBreakdown[domain]) domainBreakdown[domain] = { earned: 0, possible: 0 };
      domainBreakdown[domain].earned += r.pointsEarned ?? 0;
      domainBreakdown[domain].possible += r.pointsPossible ?? 0;
    }

    return NextResponse.json({ attemptId, scoreRaw, scoreMax, scorePct, passed, domainBreakdown });
  } catch (err) {
    console.error("[/api/quiz/attempts/complete]", err);
    const message = err instanceof Error ? err.message : "Internal error";
    const status = message.includes("auth") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
