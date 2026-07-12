import test from "node:test";
import assert from "node:assert/strict";

import {
  summarizeCohort,
  dedupeCohortsById,
  canManageCohort,
  normalizeCohortDetail,
  type CohortSummary,
} from "@/lib/admin/cohorts";
import {
  deriveScopeFromCohorts,
  scopeIncludesUser,
  scopeIncludesCohort,
} from "@/lib/admin/scope";

const rawCohort = {
  id: "c1",
  name: "Spring 2026",
  description: "Evening class",
  archivedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
  createdBy: { id: "owner1", email: "owner@x.com", fullName: "Owner One" },
  cohortMemberships_on_cohort: [
    { user: { id: "u1" } },
    { user: { id: "u2" } },
    { user: { id: null } },
  ],
  cohortInstructors_on_cohort: [{ instructor: { id: "instr1" } }],
};

test("summarizeCohort derives counts, owner, and archived flag", () => {
  const summary = summarizeCohort(rawCohort);
  assert.equal(summary.id, "c1");
  assert.equal(summary.name, "Spring 2026");
  assert.equal(summary.archived, false);
  assert.equal(summary.owner.id, "owner1");
  assert.deepEqual(summary.memberIds, ["u1", "u2"]);
  assert.equal(summary.memberCount, 2);
  assert.deepEqual(summary.instructorIds, ["instr1"]);
});

test("summarizeCohort marks archived when archivedAt is set", () => {
  const summary = summarizeCohort({ ...rawCohort, archivedAt: "2026-02-01T00:00:00.000Z" });
  assert.equal(summary.archived, true);
});

test("dedupeCohortsById keeps the first occurrence", () => {
  const owned = summarizeCohort(rawCohort);
  const assigned = summarizeCohort({ ...rawCohort, name: "Duplicate" });
  const deduped = dedupeCohortsById([owned, assigned]);
  assert.equal(deduped.length, 1);
  assert.equal(deduped[0]?.name, "Spring 2026");
});

test("canManageCohort enforces role and ownership rules", () => {
  const cohort = { owner: { id: "owner1", email: "", fullName: null }, instructorIds: ["instr1"] };
  assert.equal(canManageCohort({ uid: "anyone", role: "admin" }, cohort), true);
  assert.equal(canManageCohort({ uid: "owner1", role: "instructor" }, cohort), true);
  assert.equal(canManageCohort({ uid: "instr1", role: "instructor" }, cohort), true);
  assert.equal(canManageCohort({ uid: "stranger", role: "instructor" }, cohort), false);
  assert.equal(canManageCohort({ uid: "owner1", role: "viewer" }, cohort), false);
});

test("normalizeCohortDetail maps members and instructors", () => {
  const detail = normalizeCohortDetail({
    cohort: rawCohort,
    cohortMemberships: [
      { joinedAt: "2026-01-03T00:00:00.000Z", user: { id: "u1", email: "u1@x.com", fullName: "U One", role: "learner" } },
      { joinedAt: null, user: { id: "", email: "", fullName: null, role: "learner" } },
    ],
    cohortInstructors: [
      { assignedAt: "2026-01-04T00:00:00.000Z", instructor: { id: "instr1", email: "i@x.com", fullName: "Instr", role: "instructor" } },
    ],
  });
  assert.ok(detail);
  assert.equal(detail?.members.length, 1);
  assert.equal(detail?.members[0]?.id, "u1");
  assert.equal(detail?.instructors.length, 1);
  assert.equal(detail?.instructors[0]?.id, "instr1");
});

test("normalizeCohortDetail returns null without a cohort", () => {
  assert.equal(normalizeCohortDetail({ cohort: null }), null);
});

test("deriveScopeFromCohorts unions member ids across cohorts", () => {
  const cohorts: CohortSummary[] = [
    { ...summarizeCohort(rawCohort) },
    {
      ...summarizeCohort({ ...rawCohort, id: "c2", cohortMemberships_on_cohort: [{ user: { id: "u2" } }, { user: { id: "u3" } }] }),
    },
  ];
  const scope = deriveScopeFromCohorts(cohorts);
  assert.equal(scope.mode, "cohorts");
  assert.deepEqual(scope.cohortIds.sort(), ["c1", "c2"]);
  assert.deepEqual(scope.memberUserIds.sort(), ["u1", "u2", "u3"]);
});

test("scope inclusion helpers respect mode", () => {
  const restricted = deriveScopeFromCohorts([summarizeCohort(rawCohort)]);
  assert.equal(scopeIncludesUser(restricted, "u1"), true);
  assert.equal(scopeIncludesUser(restricted, "unknown"), false);
  assert.equal(scopeIncludesCohort(restricted, "c1"), true);
  assert.equal(scopeIncludesCohort(restricted, "cX"), false);

  const all = { mode: "all" as const, cohortIds: [], memberUserIds: [] };
  assert.equal(scopeIncludesUser(all, "anyone"), true);
  assert.equal(scopeIncludesCohort(all, "any"), true);
});
