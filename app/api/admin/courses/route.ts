import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { formatUuid } from "@/lib/utils";
import { courseSchema, lessonSchema } from "@/lib/validations/admin";
import { z } from "zod";

const uuidSchema = z.string().trim().transform(formatUuid).pipe(z.string().uuid());

const moduleUpdateSchema = z.object({
  action: z.literal("update-module"),
  moduleId: uuidSchema,
  title: z.string().trim().min(2).optional(),
  description: z.string().trim().optional().nullable(),
  learningObjectives: z.array(z.string().trim().min(1)).optional(),
  prerequisiteModuleIds: z.array(uuidSchema).optional(),
  position: z.coerce.number().int().nonnegative().optional(),
  status: z.enum(["draft", "review", "published"]).optional(),
});

const lessonUpdateSchema = z.object({
  action: z.literal("update-lesson"),
  lessonId: uuidSchema,
  title: z.string().trim().min(2).optional(),
  contentJson: z.string().optional().nullable(),
  videoPlaybackId: z.string().optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
  quizId: uuidSchema.optional().nullable(),
  sourceMaterialId: uuidSchema.optional().nullable(),
  durationSeconds: z.coerce.number().int().nonnegative().optional().nullable(),
  position: z.coerce.number().int().nonnegative().optional(),
  status: z.enum(["draft", "review", "published"]).optional(),
  isPublished: z.boolean().optional(),
  versionNote: z.string().optional().nullable(),
  saveVersion: z.boolean().default(false),
});

const createLessonSchema = z.object({
  action: z.literal("create-lesson"),
  courseId: uuidSchema,
  moduleId: uuidSchema,
  lessonTitle: z.string().trim().min(2),
  lessonType: z.enum(["text", "video", "quiz", "source"]),
  contentJson: z.string().optional().nullable(),
  videoPlaybackId: z.string().optional().nullable(),
  quizId: uuidSchema.optional().nullable(),
  sourceMaterialId: uuidSchema.optional().nullable(),
  durationSeconds: z.coerce.number().int().nonnegative().optional().nullable(),
  publish: z.boolean().default(false),
});

const bulkPublishLessonsSchema = z.object({
  action: z.literal("publish-lessons"),
  lessonIds: z.array(uuidSchema).min(1),
  publish: z.boolean().default(true),
});

const deleteLessonsSchema = z.object({
  action: z.literal("delete-lessons"),
  lessonIds: z.array(uuidSchema).min(1),
});

const reorderSchema = z.object({
  action: z.literal("reorder"),
  items: z.array(z.object({ id: uuidSchema, position: z.number().int() })),
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

  if (body.action === "publish-lessons") {
    const parsed = bulkPublishLessonsSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const { lessonIds, publish } = parsed.data;
    try {
      await Promise.all(
        lessonIds.map((lessonId) =>
          adminDcMutate("UpdateLesson", {
            id: lessonId,
            status: publish ? "published" : "draft",
            isPublished: publish,
            updatedById: auth.session.uid,
            publishedAt: publish ? new Date().toISOString() : null,
          })
        )
      );
      return NextResponse.json({ ok: true, updated: lessonIds.length });
    } catch (err) {
      console.error("[admin/courses:publish-lessons]", err);
      return NextResponse.json({ error: "Unable to publish lessons" }, { status: 500 });
    }
  }

  if (body.action === "delete-lessons") {
    const parsed = deleteLessonsSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const { lessonIds } = parsed.data;
    try {
      for (const lessonId of lessonIds) {
        await adminDcMutate("DeleteSourceLinksForLesson", { lessonId }).catch(() => null);
        await adminDcMutate("DeleteLessonVersionsForLesson", { lessonId }).catch(() => null);
        await adminDcMutate("DeleteUserLessonProgressForLesson", { lessonId }).catch(() => null);
        await adminDcMutate("DeleteLesson", { id: lessonId });
      }
      return NextResponse.json({ ok: true, deleted: lessonIds.length });
    } catch (err) {
      console.error("[admin/courses:delete-lessons]", err);
      return NextResponse.json({ error: "Unable to delete lessons" }, { status: 500 });
    }
  }

  if (body.action === "create-lesson") {
    const parsed = createLessonSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const input = parsed.data;
    const lessonId = randomUUID();
    try {
      const courseData = await adminDcQuery<{ courses: Array<{ id: string; modules_on_course?: Array<{ id: string; lessons_on_module?: Array<{ position: number }> }> }> }>(
        "AdminListCourses"
      ).catch(() => ({ courses: [] }));

      const targetCourse = courseData.courses.find((course) => formatUuid(course.id) === input.courseId);
      const targetModule = targetCourse?.modules_on_course?.find((module) => formatUuid(module.id) === input.moduleId);
      const nextPosition =
        (targetModule?.lessons_on_module ?? []).reduce(
          (max: number, lesson: { position?: number | null }) => Math.max(max, lesson.position ?? 0),
          0
        ) + 1;

      await adminDcMutate("CreateLesson", {
        id: lessonId,
        moduleId: input.moduleId,
        title: input.lessonTitle,
        position: nextPosition,
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
      return NextResponse.json({ lessonId, moduleId: input.moduleId }, { status: 201 });
    } catch (error) {
      console.error("[admin/courses:create-lesson]", error);
      return NextResponse.json({ error: "Unable to create lesson" }, { status: 500 });
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
