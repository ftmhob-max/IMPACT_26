// Front-end application not-found boundary: app/not-found.tsx
import * as Icons from "@/components/ui/Icons";
import {
  EmptyState,
  LearnerPage,
  PageHeader,
  PrimaryAction,
} from "@/components/ui/LearnerPrimitives";

export default function ApplicationNotFound() {
  return (
    <main className="min-h-screen bg-[var(--impact-page)]">
      <LearnerPage width="narrow">
        <PageHeader
          eyebrow="404"
          title="We could not find that page"
          description="Check the address or return to IMPACT_26 to continue learning."
          icon={Icons.Search}
        />
        <EmptyState
          title="The requested page does not exist"
          description="Use the dashboard to return to your courses, progress, and study resources."
          icon={Icons.Inbox}
          action={<PrimaryAction href="/dashboard">Go to dashboard</PrimaryAction>}
        />
      </LearnerPage>
    </main>
  );
}
