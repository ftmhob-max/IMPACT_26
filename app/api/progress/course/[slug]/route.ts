import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcQuery } from "@/lib/firebase/admin-dc";

export async function GET(
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

    const progressData = await adminDcQuery<{
      userCourseProgress: { enrolledAt: string }[];
      userLessonProgresses: {
        lesson: { id: string };
        status: string;
        videoPositionSeconds: number | null;
        completedAt: string | null;
      }[];
    }>("GetUserCourseProgressFull", { userId, courseId: course.id }).catch(() => null);

    const enrolled = (progressData?.userCourseProgress?.length ?? 0) > 0;
    const progress = (progressData?.userLessonProgresses ?? []).map((p) => ({
      lessonId: p.lesson.id,
      status: p.status,
      videoPositionSeconds: p.videoPositionSeconds,
      completedAt: p.completedAt,
    }));

    return NextResponse.json({ enrolled, progress });
  } catch (err) {
    console.error("[api/progress/course]", err);
    return NextResponse.json({ error: "Unable to fetch progress" }, { status: 500 });
  }
}
