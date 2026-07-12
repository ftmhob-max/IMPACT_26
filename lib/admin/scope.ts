// lib/admin/scope.ts — cohort visibility scope resolution (backend)
// Centralizes the rule that admins see all learners while instructors/viewers
// only see learners in cohorts they own or are assigned to. Every cohort route
// and page must derive scope here rather than trusting client-supplied ids.

import type { AdminSession } from "@/lib/admin/auth";
import { loadInstructorCohorts, type CohortSummary } from "@/lib/admin/cohorts";

export interface CohortScope {
  // "all" — global visibility (admins). "cohorts" — restricted to cohortIds.
  mode: "all" | "cohorts";
  cohortIds: string[];
  memberUserIds: string[];
}

/**
 * Pure helper: collapses a set of cohort summaries into a restricted scope with
 * the union of their member user ids.
 */
export function deriveScopeFromCohorts(cohorts: CohortSummary[]): CohortScope {
  const cohortIds: string[] = [];
  const memberIdSet = new Set<string>();
  for (const cohort of cohorts) {
    if (cohort.id) cohortIds.push(cohort.id);
    for (const memberId of cohort.memberIds) memberIdSet.add(memberId);
  }
  return { mode: "cohorts", cohortIds, memberUserIds: Array.from(memberIdSet) };
}

/** True when the resolved scope can see the given learner. */
export function scopeIncludesUser(scope: CohortScope, userId: string): boolean {
  return scope.mode === "all" || scope.memberUserIds.includes(userId);
}

/** True when the resolved scope can see the given cohort. */
export function scopeIncludesCohort(scope: CohortScope, cohortId: string): boolean {
  return scope.mode === "all" || scope.cohortIds.includes(cohortId);
}

/** Resolves visibility scope for a teacher session (I/O for non-admins). */
export async function resolveCohortScope(
  session: Pick<AdminSession, "uid" | "role">,
): Promise<CohortScope> {
  if (session.role === "admin") {
    return { mode: "all", cohortIds: [], memberUserIds: [] };
  }
  const cohorts = await loadInstructorCohorts(session.uid);
  return deriveScopeFromCohorts(cohorts);
}
