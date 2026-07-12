import test from "node:test";
import assert from "node:assert/strict";

import { aggregateCohortEngagement } from "@/lib/admin/cohort-analytics";

const referenceDate = new Date("2026-01-10T12:00:00.000Z");

test("aggregateCohortEngagement seeds every member even with no activity", () => {
  const rows = aggregateCohortEngagement({
    memberIds: ["u1", "u2"],
    users: [
      { id: "u1", email: "u1@x.com", fullName: "U One" },
      { id: "u2", email: "u2@x.com", fullName: null },
    ],
    courseProgress: [],
    lessonProgress: [],
    dailyActivities: [],
    referenceDate,
  });
  assert.equal(rows.length, 2);
  for (const row of rows) {
    assert.equal(row.coursesCompleted, 0);
    assert.equal(row.lessonsCompleted, 0);
    assert.equal(row.currentStreakDays, 0);
    assert.equal(row.lastActiveDate, null);
  }
});

test("aggregateCohortEngagement counts completion and lessons", () => {
  const rows = aggregateCohortEngagement({
    memberIds: ["u1"],
    users: [{ id: "u1", email: "u1@x.com", fullName: "U One" }],
    courseProgress: [
      { user: { id: "u1" }, completedAt: "2026-01-05T00:00:00.000Z" },
      { user: { id: "u1" }, completedAt: null },
    ],
    lessonProgress: [
      { user: { id: "u1" }, status: "completed", completedAt: "2026-01-05T00:00:00.000Z" },
      { user: { id: "u1" }, status: "in_progress", completedAt: null },
    ],
    dailyActivities: [
      { user: { id: "u1" }, activityDate: "2026-01-09", lastActivityAt: "2026-01-09T10:00:00.000Z" },
      { user: { id: "u1" }, activityDate: "2026-01-10", lastActivityAt: "2026-01-10T10:00:00.000Z" },
    ],
    referenceDate,
  });
  const row = rows[0];
  assert.ok(row);
  assert.equal(row.coursesEnrolled, 2);
  assert.equal(row.coursesCompleted, 1);
  assert.equal(row.lessonsCompleted, 1);
  assert.equal(row.currentStreakDays, 2);
  assert.equal(row.lastActiveDate, "2026-01-10");
});

test("aggregateCohortEngagement sorts most engaged first", () => {
  const rows = aggregateCohortEngagement({
    memberIds: ["low", "high"],
    users: [
      { id: "low", email: "low@x.com", fullName: null },
      { id: "high", email: "high@x.com", fullName: null },
    ],
    courseProgress: [],
    lessonProgress: [
      { user: { id: "high" }, status: "completed" },
      { user: { id: "high" }, status: "completed" },
      { user: { id: "low" }, status: "completed" },
    ],
    dailyActivities: [],
    referenceDate,
  });
  assert.equal(rows[0]?.userId, "high");
  assert.equal(rows[1]?.userId, "low");
});

test("aggregateCohortEngagement ignores activity outside the member set is still included when present", () => {
  // A learner with activity but not in the seeded member list should still be
  // aggregated (defensive) so no attributed data is dropped.
  const rows = aggregateCohortEngagement({
    memberIds: ["u1"],
    users: [{ id: "u1", email: "u1@x.com", fullName: null }],
    courseProgress: [{ user: { id: "u2" }, completedAt: "2026-01-01T00:00:00.000Z" }],
    lessonProgress: [],
    dailyActivities: [],
    referenceDate,
  });
  const ids = rows.map((r) => r.userId).sort();
  assert.deepEqual(ids, ["u1", "u2"]);
});
