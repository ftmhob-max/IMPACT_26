// Backend API route: app/api/quiz/attempts/[attemptId]/review/route.ts
// Returns answer keys only after authentication, ownership, and completion checks.

import { NextResponse, type NextRequest } from "next/server";

import { requireLearnerRequest } from "@/lib/firebase/auth-server";
import {
  getAttemptReview,
  getAttemptReviewAccessStatus,
  normalizeAttemptReview,
} from "@/lib/firebase/learner-portal";
import { formatUuid } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> },
) {
  const authentication = await requireLearnerRequest(request);
  if (!authentication.ok) return authentication.response;

  try {
    const attemptId = formatUuid((await params).attemptId);
    const attempt = await getAttemptReview(attemptId);
    const accessStatus = getAttemptReviewAccessStatus(attempt, authentication.session.uid);

    if (accessStatus === "not_found") {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }
    if (accessStatus === "forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (accessStatus === "incomplete") {
      return NextResponse.json(
        { error: "Complete this attempt before reviewing answers" },
        { status: 409 },
      );
    }
    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    return NextResponse.json(normalizeAttemptReview(attempt));
  } catch (error) {
    console.error("[api/quiz/attempts/review:GET]", error);
    return NextResponse.json({ error: "Failed to load attempt review" }, { status: 500 });
  }
}
