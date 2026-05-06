import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const decoded = await verifyIdToken(request.headers.get("Authorization"));
    const userId = decoded.uid;
    const { slug } = await params;

    // Resolve courseId from slug
    const courseData = await adminDcQuery<{ courses: { id: string }[] }>(
      "GetCourseBySlug",
      { slug }
    ).catch(() => null);
    const course = courseData?.courses?.[0];
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    await adminDcMutate("EnrollInCourse", { userId, courseId: course.id });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: any) {
    // Duplicate enrollment is fine — treat as success
    if (err?.message?.includes("ALREADY_EXISTS") || err?.code === "ALREADY_EXISTS") {
      return NextResponse.json({ ok: true });
    }
    console.error("[api/courses/enroll]", err);
    return NextResponse.json({ error: "Unable to enroll" }, { status: 500 });
  }
}
