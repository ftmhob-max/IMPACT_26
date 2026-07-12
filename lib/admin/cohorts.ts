// lib/admin/cohorts.ts — cohort data adapters + pure derivations (backend)
// DataConnect cohort operations are NO_ACCESS and only run through trusted
// server code via the Firebase Admin SDK (adminDcQuery / adminDcMutate).

import { randomUUID } from "crypto";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import type { AdminSession } from "@/lib/admin/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CohortOwner {
  id: string;
  email: string;
  fullName: string | null;
}

export interface CohortSummary {
  id: string;
  name: string;
  description: string | null;
  archived: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  owner: CohortOwner;
  memberCount: number;
  instructorIds: string[];
  memberIds: string[];
}

export interface CohortMember {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  joinedAt: string | null;
}

export interface CohortInstructorMember {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  assignedAt: string | null;
}

export interface CohortDetail {
  id: string;
  name: string;
  description: string | null;
  archived: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  owner: CohortOwner;
  members: CohortMember[];
  instructors: CohortInstructorMember[];
}

// ─── Pure derivations (unit-testable, no I/O) ─────────────────────────────────

/**
 * Normalizes a raw cohort row (from AdminListCohorts / ListCohortsForInstructor)
 * into a stable summary with member/instructor counts.
 */
export function summarizeCohort(rawCohort: any): CohortSummary {
  const memberships = rawCohort?.cohortMemberships_on_cohort ?? [];
  const instructorRows = rawCohort?.cohortInstructors_on_cohort ?? [];
  const memberIds: string[] = memberships
    .map((membership: any) => membership?.user?.id)
    .filter((id: unknown): id is string => typeof id === "string" && id.length > 0);
  const instructorIds: string[] = instructorRows
    .map((row: any) => row?.instructor?.id)
    .filter((id: unknown): id is string => typeof id === "string" && id.length > 0);

  return {
    id: rawCohort?.id ?? "",
    name: rawCohort?.name ?? "",
    description: rawCohort?.description ?? null,
    archived: Boolean(rawCohort?.archivedAt),
    createdAt: rawCohort?.createdAt ?? null,
    updatedAt: rawCohort?.updatedAt ?? null,
    owner: {
      id: rawCohort?.createdBy?.id ?? "",
      email: rawCohort?.createdBy?.email ?? "",
      fullName: rawCohort?.createdBy?.fullName ?? null,
    },
    memberCount: memberIds.length,
    instructorIds,
    memberIds,
  };
}

/** Keeps the first occurrence of each cohort id (owned rows win over assigned). */
export function dedupeCohortsById(cohorts: CohortSummary[]): CohortSummary[] {
  const byId = new Map<string, CohortSummary>();
  for (const cohort of cohorts) {
    if (cohort.id && !byId.has(cohort.id)) byId.set(cohort.id, cohort);
  }
  return Array.from(byId.values());
}

/**
 * Authorization gate for cohort mutations. Admins manage every cohort; an
 * instructor manages only cohorts they own or are assigned to. Viewers are
 * read-only and can never manage a cohort.
 */
export function canManageCohort(
  session: Pick<AdminSession, "uid" | "role">,
  cohort: Pick<CohortSummary, "owner" | "instructorIds">,
): boolean {
  if (session.role === "admin") return true;
  if (session.role === "viewer") return false;
  return cohort.owner.id === session.uid || cohort.instructorIds.includes(session.uid);
}

/** Normalizes the GetCohortDetail payload into a single detail object. */
export function normalizeCohortDetail(raw: any): CohortDetail | null {
  const cohort = raw?.cohort;
  if (!cohort?.id) return null;

  const members: CohortMember[] = (raw?.cohortMemberships ?? [])
    .map((membership: any) => ({
      id: membership?.user?.id ?? "",
      email: membership?.user?.email ?? "",
      fullName: membership?.user?.fullName ?? null,
      role: membership?.user?.role ?? "learner",
      joinedAt: membership?.joinedAt ?? null,
    }))
    .filter((member: CohortMember) => member.id.length > 0);

  const instructors: CohortInstructorMember[] = (raw?.cohortInstructors ?? [])
    .map((row: any) => ({
      id: row?.instructor?.id ?? "",
      email: row?.instructor?.email ?? "",
      fullName: row?.instructor?.fullName ?? null,
      role: row?.instructor?.role ?? "instructor",
      assignedAt: row?.assignedAt ?? null,
    }))
    .filter((instructor: CohortInstructorMember) => instructor.id.length > 0);

  return {
    id: cohort.id,
    name: cohort.name ?? "",
    description: cohort.description ?? null,
    archived: Boolean(cohort.archivedAt),
    createdAt: cohort.createdAt ?? null,
    updatedAt: cohort.updatedAt ?? null,
    owner: {
      id: cohort?.createdBy?.id ?? "",
      email: cohort?.createdBy?.email ?? "",
      fullName: cohort?.createdBy?.fullName ?? null,
    },
    members,
    instructors,
  };
}

// ─── I/O adapters ─────────────────────────────────────────────────────────────

export async function loadAdminCohorts(): Promise<CohortSummary[]> {
  const data = await adminDcQuery<{ cohorts: any[] }>("AdminListCohorts").catch(() => ({
    cohorts: [],
  }));
  return (data.cohorts ?? []).map(summarizeCohort);
}

export async function loadInstructorCohorts(instructorId: string): Promise<CohortSummary[]> {
  const data = await adminDcQuery<{ cohorts: any[]; cohortInstructors: any[] }>(
    "ListCohortsForInstructor",
    { instructorId },
  ).catch(() => ({ cohorts: [], cohortInstructors: [] }));

  const owned = (data.cohorts ?? []).map(summarizeCohort);
  const assigned = (data.cohortInstructors ?? [])
    .map((row: any) => summarizeCohort(row?.cohort))
    .filter((cohort: CohortSummary) => cohort.id.length > 0);

  return dedupeCohortsById([...owned, ...assigned]);
}

/** Returns cohorts visible to the session based on role (admin = all). */
export async function loadScopedCohorts(
  session: Pick<AdminSession, "uid" | "role">,
): Promise<CohortSummary[]> {
  if (session.role === "admin") return loadAdminCohorts();
  return loadInstructorCohorts(session.uid);
}

export async function getCohortDetail(cohortId: string): Promise<CohortDetail | null> {
  const data = await adminDcQuery<any>("GetCohortDetail", { cohortId }).catch(() => null);
  return data ? normalizeCohortDetail(data) : null;
}

export async function getCohortMemberIds(cohortId: string): Promise<string[]> {
  const data = await adminDcQuery<{ cohortMemberships: any[] }>("GetCohortMemberIds", {
    cohortId,
  }).catch(() => ({ cohortMemberships: [] }));
  return (data.cohortMemberships ?? [])
    .map((membership: any) => membership?.user?.id)
    .filter((id: unknown): id is string => typeof id === "string" && id.length > 0);
}

/**
 * Loads a single cohort summary (with counts) — used by write routes to
 * authorize a mutation before performing it.
 */
export async function getCohortSummary(cohortId: string): Promise<CohortSummary | null> {
  const detail = await getCohortDetail(cohortId);
  if (!detail) return null;
  return {
    id: detail.id,
    name: detail.name,
    description: detail.description,
    archived: detail.archived,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
    owner: detail.owner,
    memberCount: detail.members.length,
    instructorIds: detail.instructors.map((instructor) => instructor.id),
    memberIds: detail.members.map((member) => member.id),
  };
}

// ─── Mutations ─────────────────────────────────────────────────────────────────

export async function createCohort(
  session: Pick<AdminSession, "uid">,
  input: { name: string; description?: string | null },
): Promise<string> {
  const id = randomUUID();
  await adminDcMutate("CreateCohort", {
    id,
    name: input.name,
    description: input.description ?? null,
    createdById: session.uid,
  });
  return id;
}

export async function updateCohort(
  cohortId: string,
  input: { name?: string; description?: string | null; archived?: boolean },
): Promise<void> {
  await adminDcMutate("UpdateCohort", {
    id: cohortId,
    name: input.name ?? null,
    description: input.description ?? null,
    archivedAt:
      input.archived === undefined ? null : input.archived ? new Date().toISOString() : null,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteCohort(cohortId: string): Promise<void> {
  // Cascade child rows first, then remove the cohort itself.
  await adminDcMutate("DeleteCohortMembershipsForCohort", { cohortId });
  await adminDcMutate("DeleteCohortInstructorsForCohort", { cohortId });
  await adminDcMutate("DeleteCohort", { id: cohortId });
}

export async function addCohortMember(cohortId: string, userId: string): Promise<void> {
  await adminDcMutate("AddCohortMembership", { cohortId, userId });
}

export async function removeCohortMember(cohortId: string, userId: string): Promise<void> {
  await adminDcMutate("RemoveCohortMembership", { cohortId, userId });
}

export async function addCohortInstructor(cohortId: string, instructorId: string): Promise<void> {
  await adminDcMutate("AddCohortInstructor", { cohortId, instructorId });
}

export async function removeCohortInstructor(
  cohortId: string,
  instructorId: string,
): Promise<void> {
  await adminDcMutate("RemoveCohortInstructor", { cohortId, instructorId });
}
