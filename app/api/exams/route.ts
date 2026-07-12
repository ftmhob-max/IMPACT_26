// Backend learner exam catalog API: app/api/exams/route.ts

import { NextResponse, type NextRequest } from "next/server";

import { requireLearnerRequest } from "@/lib/firebase/auth-server";
import { getExamCatalog } from "@/lib/firebase/learner-portal";

export async function GET(request: NextRequest) {
  const authentication = await requireLearnerRequest(request);
  if (!authentication.ok) return authentication.response;

  try {
    const exams = await getExamCatalog(authentication.session.uid);
    return NextResponse.json({ exams });
  } catch (error) {
    console.error("[api/exams:GET]", error);
    return NextResponse.json({ error: "Failed to load published exams" }, { status: 500 });
  }
}
