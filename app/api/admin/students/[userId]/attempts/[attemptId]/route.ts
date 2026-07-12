// app/api/admin/students/[userId]/attempts/[attemptId]/route.ts — backend:
// teacher-side attempt review. Authorized by cohort scope (the teacher can see
// the learner) rather than learner ownership. Returns full correct-answer data,
// which stays server-gated (NO_ACCESS) and is only exposed to authorized staff.

import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { resolveCohortScope, scopeIncludesUser } from "@/lib/admin/scope";
import { normalizeAdminAttemptReview } from "@/lib/admin/student-drilldown";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; attemptId: string }> },
) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  const { userId, attemptId } = await params;

  // Only staff who can see this learner (admins, or instructors whose cohorts
  // include the learner) may open the review.
  const scope = await resolveCohortScope(auth.session);
  if (!scopeIncludesUser(scope, userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await adminDcQuery<any>("AdminGetAttemptReview", { attemptId }).catch(() => null);
  const review = data ? normalizeAdminAttemptReview(data) : null;
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Defense in depth: the attempt must belong to the learner in the URL.
  if (review.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ review });
}
