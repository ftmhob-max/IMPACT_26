import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { formatUuid } from "@/lib/utils";
import { courseSchema, lessonSchema } from "@/lib/validations/admin";
import { runLessonPreflight, summarizePreflightResults } from "@/lib/lessons/publish-preflight";
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
  preflight: z.boolean().default(false),
  force: z.boolean().default(false),
});

const deleteLessonsSchema = z.object({
  action: z.literal("delete-lessons"),
  lessonIds: z.array(uuidSchema).min(1),
});

const deleteModuleSchema = z.object({
  action: z.literal("delete-module"),
  moduleId: uuidSchema,
});

const reorderSchema = z.object({
  action: z.literal("reorder"),
  items: z.array(z.object({ id: uuidSchema, position: z.number().int() })),
  type: z.enum(["module", "lesson"]),
});

const courseUpdateSchema = z.object({
  action: z.literal("update-course"),
  courseId: uuidSchema,
  title: z.string().trim().min(2).optional(),
  description: z.string().trim().optional().nullable(),
  thumbnailUrl: z.string().url().optional().nullable(),
});

const deleteCourseSchema = z.object({
  action: z.literal("delete-course"),
  courseId: uuidSchema,
});

function withDefinedFields<T extends Record<string, unknown>>(fields: T) {
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));
}

async function deleteLessonsCascade(lessonIds: string[]) {
  for (const lessonId of lessonIds) {
    await adminDcMutate("DeleteSourceLinksForLesson", { lessonId }).catch(() => null);
    await adminDcMutate("DeleteLessonVersionsForLesson", { lessonId }).catch(() => null);
    await adminDcMutate("DeleteUserLessonProgressForLesson", { lessonId }).catch(() => null);
    await adminDcMutate("DeleteLesson", { id: lessonId });
  }
}

async function deleteCourseCascade(courseId: string) {
  const courseData = await adminDcQuery<{ courses: Array<{ id: string; modules_on_course?: Array<{ id: string; lessons_on_module?: Array<{ id: string }> }> }> }>(
    "AdminListCourses"
  ).catch(() => ({ courses: [] }));

  const course = courseData.courses.find((c) => formatUuid(c.id) === courseId);
  const modules = course?.modules_on_course ?? [];

  for (const mod of modules) {
    const lessonIds = (mod.lessons_on_module ?? []).map((l) => formatUuid(l.id));
    await deleteLessonsCascade(lessonIds);
    await adminDcMutate("DeleteModule", { id: formatUuid(mod.id) });
  }

  await adminDcMutate("DeleteSourceLinksForCourse", { courseId }).catch(() => null);
  await adminDcMutate("DeleteUserCourseProgressForCourse", { courseId }).catch(() => null);
  await adminDcMutate("DeleteCourse", { id: courseId });
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRequest(request, "viewer");
    if (!auth.ok) return auth.response;
    const data = await adminDcQuery<{ courses: any[] }>("AdminListCourses").catch(() => ({ courses: [] }));
    return NextResponse.json({ courses: data.courses });
  } catch (err: any) {
    console.error("[admin/courses:GET]", err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
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
  if (body.action === "update-course") {
    const parsed = courseUpdateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const { courseId, ...rest } = parsed.data;
    try {
      await adminDcMutate("UpdateCourse", withDefinedFields({
        id: courseId,
        title: rest.title,
        description: rest.description,
        thumbnailUrl: rest.thumbnailUrl,
        updatedById: auth.session.uid,
      }));
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[admin/courses:update-course]", err);
      return NextResponse.json({ error: "Unable to update course" }, { status: 500 });
    }
  }

  if (body.action === "update-module") {
    const parsed = moduleUpdateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const { moduleId, learningObjectives, prerequisiteModuleIds, ...rest } = parsed.data;
    try {
      await adminDcMutate("UpdateModule", withDefinedFields({
        id: moduleId,
        title: rest.title,
        description: rest.description,
        learningObjectives: learningObjectives !== undefined ? JSON.stringify(learningObjectives) : undefined,
        prerequisiteModuleIds: prerequisiteModuleIds !== undefined ? JSON.stringify(prerequisiteModuleIds) : undefined,
        position: rest.position,
        status: rest.status,
      }));
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
      await adminDcMutate("UpdateLesson", withDefinedFields({
        id: lessonId,
        title: rest.title,
        contentJson: rest.contentJson,
        videoPlaybackId: rest.videoPlaybackId,
        videoUrl: rest.videoUrl,
        quizId: rest.quizId,
        sourceMaterialId: rest.sourceMaterialId,
        durationSeconds: rest.durationSeconds,
        status: rest.status,
        isPublished: rest.isPublished,
        updatedById: auth.session.uid,
        publishedAt: rest.isPublished === undefined ? undefined : rest.isPublished ? new Date().toISOString() : null,
      }));
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

    const { lessonIds, publish, preflight, force } = parsed.data;

    // Fetch lesson data needed for preflight (only when publishing, not unpublishing)
    if (publish && (preflight || !force)) {
      try {
        const lessonData = await Promise.all(
          lessonIds.map((id) =>
            adminDcQuery<{ lesson: any }>("GetLesson", { id }).then((d) => d?.lesson ?? null)
          )
        );

        const preflightResults = lessonData.map((lesson) => {
          if (!lesson) {
            return { lessonId: lessonIds[lessonData.indexOf(lesson)], title: "Unknown", lessonType: "text", blockers: ["Lesson not found."], warnings: [], isReady: false };
          }
          return runLessonPreflight({
            lessonId: formatUuid(lesson.id),
            title: lesson.title ?? "",
            lessonType: lesson.lessonType ?? "text",
            contentJson: lesson.contentJson ?? null,
            videoPlaybackId: lesson.videoPlaybackId ?? null,
            videoUrl: lesson.videoUrl ?? null,
            quiz: lesson.quiz?.id ? { id: lesson.quiz.id } : null,
            sourceMaterialId: lesson.sourceMaterial?.id ?? null,
          });
        });

        const { readyIds, blockedIds, results } = summarizePreflightResults(preflightResults);

        // Preflight-only mode: return report without mutations
        if (preflight) {
          return NextResponse.json({ preflight: true, results, readyIds, blockedIds });
        }

        // Default publish (no force): publish only ready lessons, report blocked ones
        if (blockedIds.length > 0) {
          if (readyIds.length === 0) {
            return NextResponse.json({ ok: false, preflight: true, results, readyIds, blockedIds });
          }
          // Publish only the ready subset
          await Promise.all(
            readyIds.map((lessonId) =>
              adminDcMutate("UpdateLesson", {
                id: lessonId,
                status: "published",
                isPublished: true,
                updatedById: auth.session.uid,
                publishedAt: new Date().toISOString(),
              })
            )
          );
          return NextResponse.json({ ok: true, updated: readyIds.length, skipped: blockedIds.length, results, readyIds, blockedIds });
        }
      } catch (err) {
        console.error("[admin/courses:publish-lessons:preflight]", err);
        // Fall through to direct publish on preflight error to avoid blocking
      }
    }

    // Force publish or unpublish: apply to all lessonIds directly
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
      await deleteLessonsCascade(lessonIds);
      return NextResponse.json({ ok: true, deleted: lessonIds.length });
    } catch (err) {
      console.error("[admin/courses:delete-lessons]", err);
      return NextResponse.json({ error: "Unable to delete lessons" }, { status: 500 });
    }
  }

  if (body.action === "delete-module") {
    const parsed = deleteModuleSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    try {
      const courseData = await adminDcQuery<{ courses: Array<{ modules_on_course?: Array<{ id: string; lessons_on_module?: Array<{ id: string }> }> }> }>(
        "AdminListCourses"
      ).catch(() => ({ courses: [] }));

      const targetModule = courseData.courses
        .flatMap((course) => course.modules_on_course ?? [])
        .find((module) => formatUuid(module.id) === parsed.data.moduleId);

      if (!targetModule) {
        return NextResponse.json({ error: "Module not found" }, { status: 404 });
      }

      const lessonIds = (targetModule.lessons_on_module ?? []).map((lesson) => formatUuid(lesson.id));
      await deleteLessonsCascade(lessonIds);
      await adminDcMutate("DeleteModule", { id: parsed.data.moduleId });
      return NextResponse.json({ ok: true, deletedLessons: lessonIds.length });
    } catch (err) {
      console.error("[admin/courses:delete-module]", err);
      return NextResponse.json({ error: "Unable to delete module" }, { status: 500 });
    }
  }

  if (body.action === "delete-course") {
    const parsed = deleteCourseSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const { courseId } = parsed.data;
    try {
      await deleteCourseCascade(courseId);
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[admin/courses:delete-course]", err);
      return NextResponse.json({ error: "Unable to delete course" }, { status: 500 });
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
  // Normalize courseId before validation since DataConnect IDs may lack hyphens
  const parsed = lessonSchema.safeParse({
    ...body,
    courseId: body.courseId ? formatUuid(String(body.courseId)) : body.courseId,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;
  const moduleId = randomUUID();
  const lessonId = randomUUID();
  try {
    // Use client-supplied position if present; fall back to Unix seconds (safe for Int32 until 2038)
    const modulePosition = typeof body.modulePosition === "number"
      ? Math.round(body.modulePosition)
      : Math.floor(Date.now() / 1000);
    await adminDcMutate("CreateModule", {
      id: moduleId,
      courseId: input.courseId,
      title: input.moduleTitle,
      position: modulePosition,
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
