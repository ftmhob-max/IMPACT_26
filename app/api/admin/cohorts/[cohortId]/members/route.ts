// app/api/admin/cohorts/[cohortId]/members/route.ts — backend: add/remove
// learners in a cohort. Requires instructor+ and management authorization.

import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest, type AdminSession } from "@/lib/admin/auth";
import { cohortMembershipSchema } from "@/lib/validations/admin";
import {
  addCohortMember,
  canManageCohort,
  getCohortSummary,
  removeCohortMember,
} from "@/lib/admin/cohorts";

async function authorizeManage(session: AdminSession, cohortId: string) {
  const summary = await getCohortSummary(cohortId);
  if (!summary) return { ok: false as const, status: 404 };
  if (!canManageCohort(session, summary)) return { ok: false as const, status: 403 };
  return { ok: true as const, summary };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cohortId: string }> },
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const { cohortId } = await params;
  const parsed = cohortMembershipSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const gate = await authorizeManage(auth.session, cohortId);
  if (!gate.ok) {
    return NextResponse.json(
      { error: gate.status === 404 ? "Not found" : "Forbidden" },
      { status: gate.status },
    );
  }

  try {
    await addCohortMember(cohortId, parsed.data.userId);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[admin/cohorts/:id/members:POST]", error);
    return NextResponse.json({ error: "Unable to add member" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cohortId: string }> },
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const { cohortId } = await params;
  const parsed = cohortMembershipSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const gate = await authorizeManage(auth.session, cohortId);
  if (!gate.ok) {
    return NextResponse.json(
      { error: gate.status === 404 ? "Not found" : "Forbidden" },
      { status: gate.status },
    );
  }

  try {
    await removeCohortMember(cohortId, parsed.data.userId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/cohorts/:id/members:DELETE]", error);
    return NextResponse.json({ error: "Unable to remove member" }, { status: 500 });
  }
}
