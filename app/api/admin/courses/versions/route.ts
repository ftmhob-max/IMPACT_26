import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcQuery } from "@/lib/firebase/admin-dc";

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  const lessonId = request.nextUrl.searchParams.get("lessonId");
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
  }

  try {
    const data = await adminDcQuery<{ lessonVersions: any[] }>("GetLessonVersions", { lessonId });
    return NextResponse.json({ versions: data.lessonVersions ?? [] });
  } catch (err) {
    console.error("[admin/courses/versions]", err);
    return NextResponse.json({ error: "Unable to fetch versions" }, { status: 500 });
  }
}
