// Front-end platform route error boundary: app/(platform)/error.tsx
"use client";

import { useEffect } from "react";
import * as Icons from "@/components/ui/Icons";
import {
  EmptyState,
  LearnerPage,
  PageHeader,
  PrimaryAction,
} from "@/components/ui/LearnerPrimitives";

export default function PlatformError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[platform-route]", error);
  }, [error]);

  return (
    <LearnerPage width="narrow">
      <PageHeader
        eyebrow="Learner portal"
        title="This page could not be loaded"
        description="The interruption may be temporary. Retry without losing your place in the portal."
        icon={Icons.AlertCircle}
      />
      <EmptyState
        title="Learning content is temporarily unavailable"
        description="Try loading this page again. If the problem continues, return to your dashboard."
        icon={Icons.AlertCircle}
        action={<PrimaryAction onClick={reset}>Try again</PrimaryAction>}
      />
    </LearnerPage>
  );
}
