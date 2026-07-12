// Front-end: shared shimmer skeleton for Teacher Portal (admin) route loading states.
// components/ui/AdminRouteSkeleton.tsx
//
// Mirrors the admin page container (max-w-7xl padded shell) and reuses the
// `.admin-skeleton` shimmer primitive, which is already reduced-motion safe via
// the global prefers-reduced-motion rule in app/globals.css.

type AdminRouteSkeletonProps = {
  label?: string;
};

// Presentational-only block that approximates the standard admin page layout:
// a hero header, a row of summary cards, and a stacked list panel.
function AdminSkeletonContent() {
  return (
    <div aria-hidden="true" className="space-y-5">
      {/* Hero header placeholder (matches AdminPageHeader footprint) */}
      <div className="rounded-[24px] border border-black/10 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="admin-skeleton h-11 w-11 shrink-0 rounded-2xl" />
          <div className="flex-1">
            <div className="admin-skeleton h-3 w-28" />
            <div className="admin-skeleton mt-2 h-7 w-2/5 max-w-sm" />
            <div className="admin-skeleton mt-2 h-4 w-3/5 max-w-2xl" />
          </div>
        </div>
      </div>

      {/* Summary card row placeholder */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="admin-skeleton h-24" />
        <div className="admin-skeleton h-24" />
        <div className="admin-skeleton h-24" />
      </div>

      {/* Data panel placeholder */}
      <div className="rounded-[24px] border border-black/10 bg-white p-5 shadow-sm">
        <div className="admin-skeleton h-5 w-44" />
        <div className="mt-5 space-y-3">
          <div className="admin-skeleton h-14 w-full" />
          <div className="admin-skeleton h-14 w-full" />
          <div className="admin-skeleton h-14 w-5/6" />
        </div>
      </div>
    </div>
  );
}

// Full-page admin loading boundary content. The polite live region announces the
// loading state to assistive tech without exposing the decorative skeleton.
export function AdminRouteSkeleton({ label = "Loading the Teacher Portal" }: AdminRouteSkeletonProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
      <div role="status" aria-busy="true" aria-live="polite">
        <span className="sr-only">{label}</span>
        <AdminSkeletonContent />
      </div>
    </div>
  );
}
