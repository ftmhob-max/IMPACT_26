// Backend API route: app/api/study-rhythm/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { requireLearnerRequest } from "@/lib/firebase/auth-server";
import { getStudyRhythm } from "@/lib/firebase/study-rhythm";

export async function GET(request: NextRequest) {
  const authentication = await requireLearnerRequest(request);
  if (!authentication.ok) return authentication.response;

  try {
    const payload = await getStudyRhythm(authentication.session.uid);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("[/api/study-rhythm]", error);
    return NextResponse.json({ error: "Unable to load study rhythm" }, { status: 500 });
  }
}
