import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { courseSchema, lessonSchema } from "@/lib/validations/admin";
import { z } from "zod";

const moduleUpdateSchema = z.object({
  action: z.literal("update-module"),
  moduleId: z.string().uuid(),
  title: z.string().trim().min(2).optional(),
  description: z.string().trim().optional().nullable(),
  learningObjectives: z.array(z.string().trim().min(1)).optional(),
  prerequisiteModuleIds: z.array(z.string().uuid()).optional(),
  position: z.coerce.number().int().nonnegative().optional(),
  status: z.enum(["draft", "review", "published"]).optional(),
});

const lessonUpdateSchema = z.object({
  action: z.literal("update-lesson"),
  lessonId: z.string().uuid(),
  title: z.string().trim().min(2).optional(),
  contentJson: z.string().optional().nullable(),
  videoPlaybackId: z.string().optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
  quizId: z.string().uuid().optional().nullable(),
  sourceMaterialId: z.string().uuid().optional().nullable(),
  durationSeconds: z.coerce.number().int().nonnegative().optional().nullable(),
  position: z.coerce.number().int().nonnegative().optional(),
  status: z.enum(["draft", "review", "published"]).optional(),
  isPublished: z.boolean().optional(),
  versionNote: z.string().optional().nullable(),
  saveVersion: z.boolean().default(false),
});

const reorderSchema = z.object({
  action: z.literal("reorder"),
  items: z.array(z.object({ id: z.string().uuid(), position: z.number().int() })),
  type: z.enum(["module", "lesson"]),
});

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

  // Action-based dispatch for curriculum builder operations
  if (body.action === "update-module") {
    const parsed = moduleUpdateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const { moduleId, learningObjectives, prerequisiteModuleIds, ...rest } = parsed.data;
    try {
      await adminDcMutate("UpdateModule", {
        id: moduleId,
        title: rest.title ?? null,
        description: rest.description ?? null,
        learningObjectives: learningObjectives != null ? JSON.stringify(learningObjectives) : null,
        prerequisiteModuleIds: prerequisiteModuleIds != null ? JSON.stringify(prerequisiteModuleIds) : null,
        position: rest.position ?? null,
        status: rest.status ?? null,
      });
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[admin/courses:update-module]", err);
      return NextResponse.json({ error: "Unable to update module" }, { status: 500 });
    }
  }

  if (body.action === "update-lesson") {
    const parsed = lessonUpdateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const { lessonId, saveVersion, versionNote, ...rest } = parsed.data;
    try {
      // Snapshot current lesson before overwriting if saveVersion requested
      if (saveVersion) {
        const current = await adminDcQuery<{ lesson: any }>("GetLesson", { id: lessonId }).catch(() => null);
        if (current?.lesson) {
          await adminDcMutate("CreateLessonVersion", {
            id: randomUUID(),
            lessonId,
            contentJson: current.lesson.contentJson ?? null,
            videoPlaybackId: current.lesson.videoPlaybackId ?? null,
            versionNote: versionNote ?? null,
            createdById: auth.session.uid,
          });
        }
      }
      await adminDcMutate("UpdateLesson", {
        id: lessonId,
        title: rest.title ?? null,
        contentJson: rest.contentJson ?? null,
        videoPlaybackId: rest.videoPlaybackId ?? null,
        videoUrl: rest.videoUrl ?? null,
        quizId: rest.quizId ?? null,
        sourceMaterialId: rest.sourceMaterialId ?? null,
        durationSeconds: rest.durationSeconds ?? null,
        status: rest.status ?? null,
        isPublished: rest.isPublished ?? null,
        updatedById: auth.session.uid,
        publishedAt: rest.isPublished ? new Date().toISOString() : null,
      });
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[admin/courses:update-lesson]", err);
      return NextResponse.json({ error: "Unable to update lesson" }, { status: 500 });
    }
  }

  if (body.action === "reorder") {
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    try {
      const mutation = parsed.data.type === "module" ? "UpdateModule" : "UpdateLesson";
      await Promise.all(
        parsed.data.items.map((item) =>
          adminDcMutate(mutation, { id: item.id, position: item.position })
        )
      );
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[admin/courses:reorder]", err);
      return NextResponse.json({ error: "Unable to reorder" }, { status: 500 });
    }
  }

  // Legacy: create module + lesson in one call
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
