// Back-end (server component boundary): Teacher Portal not-found page.
// app/(admin)/not-found.tsx
//
// Rendered when notFound() is triggered inside the admin route group (or an
// unknown /admin/* URL is hit). Matches the admin visual language and links back
// to the Teacher Portal dashboard.

import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import * as Icons from "@/components/ui/Icons";

export default function AdminNotFound() {
  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 sm:py-8">
      <AdminPageHeader
        icon={<Icons.Search size={22} />}
        eyebrow="Teacher Portal"
        title="That page is unavailable"
        description="The resource may have moved, been archived, or is outside your access."
      />
      <div className="rounded-[24px] border border-black/10 bg-white shadow-sm">
        <EmptyState
          icon={<Icons.Inbox size={36} />}
          title="We could not find this page"
          hint="Return to the Teacher Portal dashboard to continue from an available view."
          action={
            <Link href="/admin" className="admin-action">
              Go to dashboard
            </Link>
          }
        />
      </div>
    </div>
  );
}
