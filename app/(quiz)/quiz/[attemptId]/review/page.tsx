// Front-end server page: app/(quiz)/quiz/[attemptId]/review/page.tsx
// Guards the review route with the learner session before rendering the token-authenticated client.

import { redirect } from "next/navigation";

import { AttemptReviewClient } from "@/components/quiz/AttemptReviewClient";
import { getLearnerSession } from "@/lib/firebase/learner-session";

export default async function AttemptReviewPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const learnerSession = await getLearnerSession();

  if (!learnerSession) {
    redirect(`/sign-in?redirect=${encodeURIComponent(`/quiz/${attemptId}/review`)}`);
  }

  return <AttemptReviewClient attemptId={attemptId} />;
}
