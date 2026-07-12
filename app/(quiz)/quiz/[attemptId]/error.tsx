// Front-end quiz attempt error boundary: app/(quiz)/quiz/[attemptId]/error.tsx
"use client";

import { useEffect } from "react";
import * as Icons from "@/components/ui/Icons";
import {
  EmptyState,
  LearnerPage,
  PageHeader,
  PrimaryAction,
  SecondaryAction,
} from "@/components/ui/LearnerPrimitives";

export default function QuizAttemptError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[quiz-attempt-route]", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[var(--impact-page)]">
      <LearnerPage width="narrow">
        <PageHeader
          eyebrow="Quiz interrupted"
          title="Your attempt could not be displayed"
          description="Retry the route before leaving so your current browser session can be recovered."
          icon={Icons.AlertCircle}
        />
        <EmptyState
          title="The quiz encountered an unexpected problem"
          description="Try again now. If the attempt cannot be recovered, return to your exams."
          icon={Icons.AlertCircle}
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <PrimaryAction onClick={reset}>Try again</PrimaryAction>
              <SecondaryAction href="/exams">Back to exams</SecondaryAction>
            </div>
          }
        />
      </LearnerPage>
    </main>
  );
}
