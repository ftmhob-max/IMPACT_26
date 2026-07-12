import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { rowsToCsv } from "@/lib/admin/csv";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { analyticsExportSchema } from "@/lib/validations/admin";
import { getCohortMemberIds } from "@/lib/admin/cohorts";
import { resolveCohortScope, scopeIncludesCohort } from "@/lib/admin/scope";

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  const cohortIdParam = request.nextUrl.searchParams.get("cohortId") ?? undefined;
  const parsed = analyticsExportSchema.safeParse({
    kind: request.nextUrl.searchParams.get("kind") ?? "attempts",
    cohortId: cohortIdParam,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Resolve visibility scope. Non-admins are always restricted to their cohort
  // members, even when no cohortId is supplied (never fall back to global data).
  const scope = await resolveCohortScope(auth.session);

  let quizAttempts: any[] = [];
  if (parsed.data.cohortId) {
    if (!scopeIncludesCohort(scope, parsed.data.cohortId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const memberIds = await getCohortMemberIds(parsed.data.cohortId);
    if (memberIds.length > 0) {
      const data = await adminDcQuery<{ quizAttempts: any[] }>("GetCohortAttempts", {
        userIds: memberIds,
      }).catch(() => ({ quizAttempts: [] }));
      quizAttempts = data.quizAttempts ?? [];
    }
  } else if (scope.mode === "all") {
    const data = await adminDcQuery<{ quizAttempts: any[] }>("AdminCohortStats").catch(() => ({
      quizAttempts: [],
    }));
    quizAttempts = data.quizAttempts ?? [];
  } else if (scope.memberUserIds.length > 0) {
    const data = await adminDcQuery<{ quizAttempts: any[] }>("GetCohortAttempts", {
      userIds: scope.memberUserIds,
    }).catch(() => ({ quizAttempts: [] }));
    quizAttempts = data.quizAttempts ?? [];
  }

  let rows: Array<Record<string, unknown>>;
  if (parsed.data.kind === "questions") {
    rows = quizAttempts.flatMap((attempt) =>
      (attempt.quizResponses_on_attempt ?? []).map((response: any) => ({
        attempt_id: attempt.id,
        quiz: attempt.quiz?.title,
        question_id: response.question?.id,
        question: response.question?.questionText,
        domain: response.question?.domain,
        difficulty: response.question?.difficulty,
        is_correct: response.isCorrect,
        points_earned: response.pointsEarned,
        points_possible: response.pointsPossible,
      }))
    );
  } else if (parsed.data.kind === "engagement") {
    rows = quizAttempts.map((attempt) => ({
      quiz: attempt.quiz?.title,
      learner: attempt.user?.fullName ?? attempt.user?.email,
      completed_at: attempt.completedAt,
      score_pct: attempt.scorePct,
      passed: attempt.passed,
      answered_questions: attempt.quizResponses_on_attempt?.length ?? 0,
    }));
  } else {
    rows = quizAttempts.map((attempt) => ({
      attempt_id: attempt.id,
      user_email: attempt.user?.email,
      user_name: attempt.user?.fullName,
      quiz: attempt.quiz?.title,
      score_pct: attempt.scorePct,
      passed: attempt.passed,
      completed_at: attempt.completedAt,
    }));
  }

  return new NextResponse(rowsToCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="impact26-${parsed.data.kind}.csv"`,
    },
  });
}
