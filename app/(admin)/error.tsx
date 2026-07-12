// Front-end: Teacher Portal route-group error boundary.
// app/(admin)/error.tsx
//
// Client boundary (required by Next.js) that catches render/data errors within
// the admin route group and offers a retry without a full reload. Reuses the
// shared admin header/empty-state primitives and semantic theme tokens so it is
// dark-mode safe; animations honor the global reduced-motion rule.
"use client";

import { useEffect } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import * as Icons from "@/components/ui/Icons";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the boundary error for observability (kept out of the user-facing copy).
  useEffect(() => {
    console.error("[admin-route]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 sm:py-8">
      <AdminPageHeader
        icon={<Icons.AlertTriangle size={22} />}
        eyebrow="Teacher Portal"
        title="This page could not be loaded"
        description="The interruption may be temporary. Retry without leaving the Teacher Portal."
      />
      <div className="rounded-[24px] border border-black/10 bg-white shadow-sm">
        <EmptyState
          icon={<Icons.AlertCircle size={36} />}
          title="Something went wrong loading this view"
          hint="Try again. If the problem continues, return to the dashboard or contact an administrator."
          action={
            <button type="button" className="admin-action" onClick={reset}>
              Try again
            </button>
          }
        />
      </div>
    </div>
  );
}
