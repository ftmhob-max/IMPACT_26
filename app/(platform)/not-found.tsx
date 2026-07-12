// Front-end platform not-found boundary: app/(platform)/not-found.tsx
import * as Icons from "@/components/ui/Icons";
import {
  EmptyState,
  LearnerPage,
  PageHeader,
  PrimaryAction,
} from "@/components/ui/LearnerPrimitives";

export default function PlatformNotFound() {
  return (
    <LearnerPage width="narrow">
      <PageHeader
        eyebrow="Page not found"
        title="That learning resource is unavailable"
        description="It may have moved, been unpublished, or no longer be part of your course."
        icon={Icons.Search}
      />
      <EmptyState
        title="We could not find this page"
        description="Return to the learner dashboard to continue from an available course or lesson."
        icon={Icons.Inbox}
        action={<PrimaryAction href="/dashboard">Go to dashboard</PrimaryAction>}
      />
    </LearnerPage>
  );
}
