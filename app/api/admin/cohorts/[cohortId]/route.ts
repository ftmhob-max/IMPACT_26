// app/api/admin/cohorts/[cohortId]/route.ts — backend: single cohort detail,
// update, and delete. Every write re-derives management authorization from the
// stored cohort (owner / assigned instructor / admin) — never from the client.

import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest, type AdminSession } from "@/lib/admin/auth";
import { cohortUpdateSchema } from "@/lib/validations/admin";
import {
  canManageCohort,
  deleteCohort,
  getCohortDetail,
  getCohortSummary,
  updateCohort,
} from "@/lib/admin/cohorts";

// Shared authorization gate for mutating a specific cohort.
async function authorizeManage(session: AdminSession, cohortId: string) {
  const summary = await getCohortSummary(cohortId);
  if (!summary) return { ok: false as const, status: 404 };
  if (!canManageCohort(session, summary)) return { ok: false as const, status: 403 };
  return { ok: true as const, summary };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cohortId: string }> },
) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  const { cohortId } = await params;
  const detail = await getCohortDetail(cohortId);
  if (!detail) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Admins see any cohort; others must own or be assigned to it.
  const isVisible =
    auth.session.role === "admin" ||
    detail.owner.id === auth.session.uid ||
    detail.instructors.some((instructor) => instructor.id === auth.session.uid);
  if (!isVisible) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({ cohort: detail });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ cohortId: string }> },
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const { cohortId } = await params;
  const parsed = cohortUpdateSchema.safeParse(await request.json().catch(() => ({})));
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
    await updateCohort(cohortId, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/cohorts/:id:PATCH]", error);
    return NextResponse.json({ error: "Unable to update cohort" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cohortId: string }> },
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const { cohortId } = await params;
  const gate = await authorizeManage(auth.session, cohortId);
  if (!gate.ok) {
    return NextResponse.json(
      { error: gate.status === 404 ? "Not found" : "Forbidden" },
      { status: gate.status },
    );
  }

  try {
    await deleteCohort(cohortId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/cohorts/:id:DELETE]", error);
    return NextResponse.json({ error: "Unable to delete cohort" }, { status: 500 });
  }
}
