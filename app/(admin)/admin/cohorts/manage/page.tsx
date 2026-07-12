// Back-end (server component): Teacher Portal cohort management page.
// Gated to instructor+; loads only cohorts the session can see, then hands off
// to the client CohortManager for create/edit/membership operations.

import { requireAdminPage } from "@/lib/admin/auth";
import { loadScopedCohorts } from "@/lib/admin/cohorts";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CohortManager } from "@/components/admin/CohortManager";
import * as Icons from "@/components/ui/Icons";

export default async function CohortManagePage() {
  const session = await requireAdminPage("instructor");
  const cohorts = await loadScopedCohorts(session);

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 sm:py-8">
      <AdminPageHeader
        icon={<Icons.Users size={22} />}
        eyebrow="Teacher Portal"
        title="Cohorts"
        description="Group learners into classes, assign co-instructors, and scope analytics to a cohort."
      />
      <CohortManager initialCohorts={cohorts} isAdmin={session.role === "admin"} />
    </div>
  );
}
