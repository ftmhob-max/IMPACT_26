// app/api/admin/cohorts/route.ts — backend: scoped cohort listing + creation.
// GET is role-gated to viewer+ and returns only cohorts the session can see;
// POST creates a cohort owned by the requesting instructor/admin.

import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { cohortSchema } from "@/lib/validations/admin";
import { createCohort, loadScopedCohorts } from "@/lib/admin/cohorts";

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  const cohorts = await loadScopedCohorts(auth.session);
  return NextResponse.json({ cohorts });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const parsed = cohortSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const id = await createCohort(auth.session, parsed.data);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("[admin/cohorts:POST]", error);
    return NextResponse.json({ error: "Unable to create cohort" }, { status: 500 });
  }
}
