// Back-end (server component): per-student drill-down page.
// Scope-checks that the teacher can see the cohort AND that the learner is a
// member of it; otherwise notFound(). Loads the learner profile server-side.

import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/auth";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { getCohortDetail } from "@/lib/admin/cohorts";
import { summarizeLearnerProgress } from "@/lib/admin/student-drilldown";
import { StudentDrilldown } from "@/components/admin/StudentDrilldown";

export default async function StudentDrilldownPage({
  params,
}: {
  params: Promise<{ cohortId: string; userId: string }>;
}) {
  const session = await requireAdminPage("viewer");
  const { cohortId, userId } = await params;

  const detail = await getCohortDetail(cohortId);
  if (!detail) notFound();

  // Teacher must be able to see the cohort, and the learner must be a member.
  const canSeeCohort =
    session.role === "admin" ||
    detail.owner.id === session.uid ||
    detail.instructors.some((instructor) => instructor.id === session.uid);
  const isMember = detail.members.some((member) => member.id === userId);
  if (!canSeeCohort || !isMember) notFound();

  const data = await adminDcQuery<any>("GetLearnerProgressDetail", { userId }).catch(() => null);
  const profile = summarizeLearnerProgress(data ?? {}, new Date());

  return (
    <StudentDrilldown
      profile={profile}
      cohortId={cohortId}
      cohortName={detail.name}
      userId={userId}
    />
  );
}
