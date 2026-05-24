import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { formatUuid } from "@/lib/utils";
import { runLessonPreflight, summarizePreflightResults } from "@/lib/lessons/publish-preflight";
import { z } from "zod";

const bodySchema = z.object({
  courseId: z.string().trim().transform(formatUuid).pipe(z.string().uuid()),
  publish: z.boolean(),
  force: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { courseId, publish, force } = parsed.data;

  // When publishing (not unpublishing) without force, run preflight on all course lessons
  if (publish && !force) {
    try {
      const coursesData = await adminDcQuery<{ courses: any[] }>("AdminListCourses").catch(() => null);
      const course = coursesData?.courses?.find((c: any) => formatUuid(c.id) === courseId);
      if (course) {
        const allLessons = (course.modules_on_course ?? []).flatMap((m: any) => m.lessons_on_module ?? []);
        if (allLessons.length > 0) {
          const preflightResults = allLessons.map((lesson: any) =>
            runLessonPreflight({
              lessonId: formatUuid(lesson.id),
              title: lesson.title ?? "",
              lessonType: lesson.lessonType ?? "text",
              contentJson: lesson.contentJson ?? null,
              videoPlaybackId: lesson.videoPlaybackId ?? null,
              videoUrl: lesson.videoUrl ?? null,
              quiz: lesson.quiz?.id ? { id: lesson.quiz.id } : null,
              // sourceMaterial not in AdminListCourses query — skip check for course-level publish
              sourceMaterialId: null,
            })
          );
          const { readyIds, blockedIds, results } = summarizePreflightResults(preflightResults);
          if (blockedIds.length > 0) {
            return NextResponse.json({ ok: false, preflight: true, results, readyIds, blockedIds, blockedCount: blockedIds.length });
          }
        }
      }
    } catch (err) {
      // Non-fatal: log and continue to publish
      console.warn("[admin/courses/publish:preflight]", err);
    }
  }

  try {
    await adminDcMutate("UpdateCourse", {
      id: courseId,
      status: publish ? "published" : "draft",
      isPublished: publish,
      updatedById: auth.session.uid,
      publishedAt: publish ? new Date().toISOString() : null,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/courses/publish]", err);
    return NextResponse.json({ error: "Unable to update course status" }, { status: 500 });
  }
}
