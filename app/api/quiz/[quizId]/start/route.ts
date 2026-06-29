import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcQuery, adminDcMutate } from "@/lib/firebase/admin-dc";
import { shuffleArray } from "@/lib/utils";
import { sanitizeQuestion } from "@/lib/quiz-engine/sanitize";
import { formatUuid } from "@/lib/utils";
import { isAdminRole } from "@/lib/admin/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const quizId = formatUuid((await params).quizId);
    const decoded = await verifyIdToken(request.headers.get("Authorization"));
    const userId = decoded.uid;
    const userEmail = decoded.email ?? `${decoded.uid}@impact26.local`;
    const userName = decoded.name ?? null;

    // Enforce quiz visibility: only published quizzes are accessible to learners
    const quizMeta = await adminDcQuery<{ quiz: { id: string; status: string } | null }>(
      "GetQuizById", { quizId }
    ).catch(() => null);
    if (!quizMeta?.quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    if (quizMeta.quiz.status !== "published" && !isAdminRole(decoded.role)) {
      return NextResponse.json({ error: "Quiz not available" }, { status: 403 });
    }

    // Quiz metadata is passed from the lesson page (already fetched via GetLesson)
    const body = await request.json().catch(() => ({}));
    const timeLimitSeconds: number | null = body.timeLimitSeconds ?? null;
    const shuffleQuestions: boolean = body.shuffleQuestions ?? false;
    const shuffleChoices: boolean = body.shuffleChoices ?? false;
    const calculatorSettingsJson: string | null = body.calculatorSettingsJson ?? null;
    const glossaryEnabled: boolean = body.glossaryEnabled ?? false;

    // ── Check for an existing in-progress attempt ───────────────────────────
    // Wrapped in try/catch: if the deployed connector is out of sync with the
    // local schema (e.g. $userId typed as UUID! in prod vs String! locally),
    // we treat it as "no existing attempt" rather than hard-failing.
    let existing: any = null;
    try {
      const { quizAttempts } = await adminDcQuery<{ quizAttempts: any[] }>(
        "GetInProgressAttempt",
        { userId, quizId }
      );
      existing = quizAttempts?.[0];
    } catch (resumeErr) {
      console.warn("[quiz/start] GetInProgressAttempt failed (connector may be out of sync — run `firebase deploy --only dataconnect`):", resumeErr instanceof Error ? resumeErr.message : resumeErr);
    }

    // ── Fetch questions (GetQuizQuestions is already deployed) ──────────────
    const { quizQuestions } = await adminDcQuery<{ quizQuestions: any[] }>(
      "GetQuizQuestions",
      { quizId }
    );

    if (!quizQuestions?.length) {
      return NextResponse.json({ error: "Quiz not found or has no questions" }, { status: 404 });
    }

    if (existing) {
      const answeredIds = new Set(
        (existing.quizResponses_on_attempt ?? [])
          .filter((r: { answeredAt: string | null }) => r.answeredAt !== null)
          .map((r: { question: { id: string } }) => r.question.id)
      );

      // Build a map keyed by both hyphenated and raw hex forms so UUID format
      // differences between stored questionOrder and live DB IDs don't break resume.
      const questionsMap = new Map<string, any>();
      for (const qq of quizQuestions) {
        const q = qq.question;
        if (!q) continue;
        const id: string = q.id;
        questionsMap.set(id, q);
        // Also register the stripped (no-hyphen) form as an alternate key
        questionsMap.set(id.replace(/-/g, ""), q);
      }

      let storedOrder: string[] = [];
      try { storedOrder = JSON.parse(existing.questionOrder); } catch { /* fall through */ }

      const orderedQuestions = storedOrder
        .map((id) => questionsMap.get(id) ?? questionsMap.get(id.replace(/-/g, "")))
        .filter(Boolean)
        .map((q: any) => ({ ...q, answerChoices: q.answerChoices_on_question ?? [] }));

      // Fallback: if no IDs matched (format mismatch or stale data), present
      // questions in their natural fetch order so the user isn't stuck at 0/0.
      const finalQuestions = orderedQuestions.length > 0
        ? orderedQuestions
        : quizQuestions.map((qq: any) => ({ ...qq.question, answerChoices: qq.question.answerChoices_on_question ?? [] }));

      return NextResponse.json({
        attemptId: existing.id,
        quizId,
        isResume: true,
        timeLimitSeconds,
        calculatorSettingsJson,
        glossaryEnabled,
        answeredQuestionIds: [...answeredIds],
        previousResponses: existing.quizResponses_on_attempt ?? [],
        questions: finalQuestions.map(sanitizeQuestion),
      });
    }

    // ── New attempt ─────────────────────────────────────────────────────────
    let questionList = quizQuestions.map((qq: any) => ({
      ...qq.question,
      answerChoices: qq.question.answerChoices_on_question ?? [],
    }));

    if (shuffleQuestions) questionList = shuffleArray(questionList);
    if (shuffleChoices) {
      questionList = questionList.map((q: any) => ({ ...q, answerChoices: shuffleArray(q.answerChoices) }));
    }

    const questionOrder = questionList.map((q: any) => formatUuid(q.id));

    try {
      await adminDcMutate("CreateUser", {
        id: userId,
        email: userEmail,
        fullName: userName,
      });
    } catch (userErr) {
      const message = userErr instanceof Error ? userErr.message : String(userErr);
      if (!/already exists|duplicate|unique/i.test(message)) {
        console.warn("[quiz/start] CreateUser before attempt failed:", message);
      }
    }

    const { quizAttempt_insert } = await adminDcMutate<{ quizAttempt_insert: { id: string } }>(
      "CreateQuizAttempt",
      { userId, quizId, questionOrder: JSON.stringify(questionOrder) }
    );

    return NextResponse.json({
      attemptId: quizAttempt_insert.id,
      quizId,
      isResume: false,
      timeLimitSeconds,
      calculatorSettingsJson,
      glossaryEnabled,
      answeredQuestionIds: [],
      previousResponses: [],
      questions: questionList.map(sanitizeQuestion),
    });
  } catch (err) {
    console.error("[/api/quiz/start]", err);
    const message = err instanceof Error ? err.message : "Internal error";
    const status = message.includes("auth") || message.includes("token") || message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
