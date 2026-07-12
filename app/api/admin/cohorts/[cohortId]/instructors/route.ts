// app/api/admin/cohorts/[cohortId]/instructors/route.ts — backend: assign or
// remove co-instructors on a cohort. Restricted to admins (role management is
// an admin-only concern, mirroring the users role endpoint).

import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { cohortInstructorSchema } from "@/lib/validations/admin";
import {
  addCohortInstructor,
  getCohortSummary,
  removeCohortInstructor,
} from "@/lib/admin/cohorts";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cohortId: string }> },
) {
  const auth = await requireAdminRequest(request, "admin");
  if (!auth.ok) return auth.response;

  const { cohortId } = await params;
  const parsed = cohortInstructorSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const summary = await getCohortSummary(cohortId);
  if (!summary) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    await addCohortInstructor(cohortId, parsed.data.instructorId);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[admin/cohorts/:id/instructors:POST]", error);
    return NextResponse.json({ error: "Unable to assign instructor" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cohortId: string }> },
) {
  const auth = await requireAdminRequest(request, "admin");
  if (!auth.ok) return auth.response;

  const { cohortId } = await params;
  const parsed = cohortInstructorSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const summary = await getCohortSummary(cohortId);
  if (!summary) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    await removeCohortInstructor(cohortId, parsed.data.instructorId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/cohorts/:id/instructors:DELETE]", error);
    return NextResponse.json({ error: "Unable to remove instructor" }, { status: 500 });
  }
}
