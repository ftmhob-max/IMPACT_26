// Front-end learner route loading state: components/ui/LearnerRouteSkeleton.tsx
import { LearnerPage } from "@/components/ui/LearnerPrimitives";

type LearnerRouteSkeletonProps = {
  label?: string;
  variant?: "page" | "quiz";
};

function SkeletonContent() {
  return (
    <div aria-hidden="true" className="space-y-5">
      <div className="rounded-lg border border-[var(--impact-border)] bg-[var(--impact-surface)] p-6 shadow-sm">
        <div className="impact-skeleton h-3 w-28" />
        <div className="impact-skeleton mt-4 h-8 w-3/5 max-w-md" />
        <div className="impact-skeleton mt-3 h-4 w-4/5 max-w-2xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="impact-skeleton h-24" />
        <div className="impact-skeleton h-24" />
        <div className="impact-skeleton h-24" />
      </div>
      <div className="rounded-lg border border-[var(--impact-border)] bg-[var(--impact-surface)] p-5 shadow-sm">
        <div className="impact-skeleton h-5 w-44" />
        <div className="mt-5 space-y-3">
          <div className="impact-skeleton h-14 w-full" />
          <div className="impact-skeleton h-14 w-full" />
          <div className="impact-skeleton h-14 w-5/6" />
        </div>
      </div>
    </div>
  );
}

export function LearnerRouteSkeleton({
  label = "Loading learning content",
  variant = "page",
}: LearnerRouteSkeletonProps) {
  const statusContent = (
    <div role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">{label}</span>
      <SkeletonContent />
    </div>
  );

  if (variant === "quiz") {
    return (
      <main className="min-h-screen bg-[var(--impact-page)] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">{statusContent}</div>
      </main>
    );
  }

  return <LearnerPage>{statusContent}</LearnerPage>;
}
