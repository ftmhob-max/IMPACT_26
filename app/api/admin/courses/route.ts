import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { courseSchema, lessonSchema } from "@/lib/validations/admin";

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;
  const data = await adminDcQuery<{ courses: any[] }>("AdminListCourses").catch(() => ({ courses: [] }));
  return NextResponse.json({ courses: data.courses });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = courseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const courseId = randomUUID();
  const course = parsed.data;
  try {
    await adminDcMutate("CreateCourse", {
      id: courseId,
      slug: course.slug,
      title: course.title,
      description: course.description || null,
      thumbnailUrl: course.thumbnailUrl || null,
      createdById: auth.session.uid,
    });
    if (course.publish) {
      await adminDcMutate("UpdateCourse", {
        id: courseId,
        status: "published",
        isPublished: true,
        updatedById: auth.session.uid,
        publishedAt: new Date().toISOString(),
      });
    }
    return NextResponse.json({ id: courseId }, { status: 201 });
  } catch (error) {
    console.error("[admin/courses:create]", error);
    return NextResponse.json({ error: "Unable to create course" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = lessonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;
  const moduleId = randomUUID();
  const lessonId = randomUUID();
  try {
    await adminDcMutate("CreateModule", {
      id: moduleId,
      courseId: input.courseId,
      title: input.moduleTitle,
      position: Date.now(),
    });
    await adminDcMutate("CreateLesson", {
      id: lessonId,
      moduleId,
      title: input.lessonTitle,
      position: 1,
      lessonType: input.lessonType,
    });
    await adminDcMutate("UpdateLesson", {
      id: lessonId,
      contentJson: input.contentJson || null,
      videoPlaybackId: input.videoPlaybackId || null,
      quizId: input.quizId || null,
      sourceMaterialId: input.sourceMaterialId || null,
      durationSeconds: input.durationSeconds ?? null,
      status: input.publish ? "published" : "draft",
      isPublished: input.publish,
      updatedById: auth.session.uid,
      publishedAt: input.publish ? new Date().toISOString() : null,
    });
    return NextResponse.json({ moduleId, lessonId }, { status: 201 });
  } catch (error) {
    console.error("[admin/courses:lesson]", error);
    return NextResponse.json({ error: "Unable to create lesson" }, { status: 500 });
  }
}
