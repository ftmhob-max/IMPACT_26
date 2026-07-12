// Backend learner resource library API: app/api/resources/route.ts

import { NextResponse, type NextRequest } from "next/server";

import { requireLearnerRequest } from "@/lib/firebase/auth-server";
import { listLearnerSourceMaterials } from "@/lib/firebase/learner-portal";

export async function GET(request: NextRequest) {
  const authentication = await requireLearnerRequest(request);
  if (!authentication.ok) return authentication.response;

  try {
    const resources = await listLearnerSourceMaterials();
    return NextResponse.json({ resources });
  } catch (error) {
    console.error("[api/resources:GET]", error);
    return NextResponse.json({ error: "Failed to load learner resources" }, { status: 500 });
  }
}
