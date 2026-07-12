// Back-end (server component): cohort performance analytics.
// - Admins default to "All learners" (global) and can pick any cohort.
// - Instructors/viewers are scoped to cohorts they own or are assigned to.
// Attempts + engagement are loaded for the resolved learner-id set only.

import { requireAdminPage } from "@/lib/admin/auth";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { loadScopedCohorts } from "@/lib/admin/cohorts";
import { resolveCohortScope } from "@/lib/admin/scope";
import {
  aggregateCohortEngagement,
  type EngagementDirectoryUser,
} from "@/lib/admin/cohort-analytics";
import { CohortStatsView } from "@/components/admin/CohortStatsView";
import { CohortEngagementPanel } from "@/components/admin/CohortEngagementPanel";

// ponytail: cap the payload sent to the client; older history stays available via CSV export
const MAX_ATTEMPTS = 2000;

export default async function CohortStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ cohortId?: string }>;
}) {
  const session = await requireAdminPage("viewer");
  const [{ cohortId: requestedCohortId }, cohorts, scope] = await Promise.all([
    searchParams,
    loadScopedCohorts(session),
    resolveCohortScope(session),
  ]);

  // Determine the selected cohort (must be in scope) and the learner-id set.
  const selectedCohort = requestedCohortId
    ? cohorts.find((cohort) => cohort.id === requestedCohortId) ?? null
    : null;

  // "all" only applies to admins with no cohort selected.
  const useGlobal = scope.mode === "all" && !selectedCohort;
  const scopedUserIds = selectedCohort
    ? selectedCohort.memberIds
    : scope.mode === "cohorts"
      ? scope.memberUserIds
      : [];

  // Load attempts for the resolved scope.
  let allAttempts: any[] = [];
  if (useGlobal) {
    const data = await adminDcQuery<{ quizAttempts: any[] }>("AdminCohortStats").catch(() => ({
      quizAttempts: [],
    }));
    allAttempts = data.quizAttempts ?? [];
  } else if (scopedUserIds.length > 0) {
    const data = await adminDcQuery<{ quizAttempts: any[] }>("GetCohortAttempts", {
      userIds: scopedUserIds,
    }).catch(() => ({ quizAttempts: [] }));
    allAttempts = data.quizAttempts ?? [];
  }

  const attempts = allAttempts
    .slice()
    .sort((a, b) => new Date(b.completedAt ?? 0).getTime() - new Date(a.completedAt ?? 0).getTime())
    .slice(0, MAX_ATTEMPTS);

  // Build the engagement panel only when we have a concrete learner set
  // (a selected cohort, or an instructor's scoped cohorts).
  let engagementNode: React.ReactNode = null;
  if (!useGlobal && scopedUserIds.length > 0) {
    const [engagementData, usersData] = await Promise.all([
      adminDcQuery<{
        userCourseProgresses: any[];
        userLessonProgresses: any[];
        dailyActivities: any[];
      }>("GetCohortEngagement", { userIds: scopedUserIds }).catch(() => ({
        userCourseProgresses: [],
        userLessonProgresses: [],
        dailyActivities: [],
      })),
      adminDcQuery<{ users: any[] }>("AdminListUsers").catch(() => ({ users: [] })),
    ]);

    const directory: EngagementDirectoryUser[] = (usersData.users ?? []).map((user) => ({
      id: user.id,
      email: user.email ?? "",
      fullName: user.fullName ?? null,
    }));

    const rows = aggregateCohortEngagement({
      memberIds: scopedUserIds,
      users: directory,
      courseProgress: engagementData.userCourseProgresses ?? [],
      lessonProgress: engagementData.userLessonProgresses ?? [],
      dailyActivities: engagementData.dailyActivities ?? [],
      referenceDate: new Date(),
    });

    engagementNode = (
      <CohortEngagementPanel rows={rows} cohortId={selectedCohort?.id ?? null} />
    );
  }

  const cohortOptions = cohorts.map((cohort) => ({ id: cohort.id, name: cohort.name }));
  const scopeLabel = selectedCohort
    ? selectedCohort.name
    : useGlobal
      ? undefined
      : "your cohorts";

  return (
    <CohortStatsView
      attempts={attempts}
      truncated={allAttempts.length > MAX_ATTEMPTS}
      cohortOptions={cohortOptions}
      selectedCohortId={selectedCohort?.id ?? null}
      scopeLabel={scopeLabel}
      engagement={engagementNode}
    />
  );
}
