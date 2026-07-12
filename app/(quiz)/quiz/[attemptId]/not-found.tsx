// Front-end quiz attempt not-found boundary: app/(quiz)/quiz/[attemptId]/not-found.tsx
import * as Icons from "@/components/ui/Icons";
import {
  EmptyState,
  LearnerPage,
  PageHeader,
  PrimaryAction,
} from "@/components/ui/LearnerPrimitives";

export default function QuizAttemptNotFound() {
  return (
    <main className="min-h-screen bg-[var(--impact-page)]">
      <LearnerPage width="narrow">
        <PageHeader
          eyebrow="Attempt not found"
          title="This quiz attempt is unavailable"
          description="The attempt may have expired, completed, or been removed."
          icon={Icons.ClipboardList}
        />
        <EmptyState
          title="Start from an available exam"
          description="Return to the exam list to begin a new attempt or review another result."
          icon={Icons.Inbox}
          action={<PrimaryAction href="/exams">View exams</PrimaryAction>}
        />
      </LearnerPage>
    </main>
  );
}
