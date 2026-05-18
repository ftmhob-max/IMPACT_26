import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { parseLessonCsv, type CsvLessonRow } from "@/lib/admin/csv-lesson";
import { z } from "zod";

// Accepts either raw csvText or a pre-parsed modules array (from DOCX upload)
const bodySchema = z.union([
  z.object({
    csvText: z.string().min(1),
    courseTitle: z.string().trim().min(2),
    description: z.string().trim().optional().nullable(),
    publish: z.boolean().default(false),
  }),
  z.object({
    modules: z.array(
      z.object({
        title: z.string().trim().min(1),
        lessons: z.array(
          z.object({
            lesson_title: z.string().trim().min(1),
            lesson_type: z.enum(["text", "video", "quiz", "source"]).default("text"),
            content_summary: z.string().trim().optional().nullable(),
            learning_objectives: z.string().trim().optional().nullable(),
            position: z.number().int().nonnegative().optional().nullable(),
          })
        ),
      })
    ).min(1),
    courseTitle: z.string().trim().min(2),
    description: z.string().trim().optional().nullable(),
    publish: z.boolean().default(false),
  }),
]);

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) + "-" + Date.now().toString(36);
}

async function importModules(
  courseId: string,
  modules: Array<{ title: string; lessons: Pick<CsvLessonRow, "lesson_title" | "lesson_type" | "content_summary" | "learning_objectives" | "position">[] }>,
  publish: boolean,
  updatedById: string
): Promise<{ modulesCreated: number; lessonsCreated: number }> {
  let modulesCreated = 0;
  let lessonsCreated = 0;

  for (let mIdx = 0; mIdx < modules.length; mIdx++) {
    const { title: moduleTitle, lessons } = modules[mIdx];
    const moduleId = randomUUID();
    await adminDcMutate("CreateModule", {
      id: moduleId,
      courseId,
      title: moduleTitle,
      position: mIdx,
    });
    modulesCreated++;

    for (let lIdx = 0; lIdx < lessons.length; lIdx++) {
      const lesson = lessons[lIdx];
      const lessonId = randomUUID();
      await adminDcMutate("CreateLesson", {
        id: lessonId,
        moduleId,
        title: lesson.lesson_title,
        position: lesson.position ?? lIdx,
        lessonType: lesson.lesson_type ?? "text",
      });

      if (lesson.content_summary || lesson.learning_objectives) {
        const content: unknown[] = [];
        if (lesson.content_summary) {
          content.push({ type: "paragraph", content: [{ type: "text", text: lesson.content_summary }] });
        }
        if (lesson.learning_objectives) {
          content.push({
            type: "paragraph",
            content: [
              { type: "text", text: "Learning objectives: ", marks: [{ type: "bold" }] },
              { type: "text", text: lesson.learning_objectives },
            ],
          });
        }
        await adminDcMutate("UpdateLesson", {
          id: lessonId,
          contentJson: JSON.stringify({ type: "doc", content }),
          videoPlaybackId: null,
          quizId: null,
          sourceMaterialId: null,
          durationSeconds: null,
          status: publish ? "published" : "draft",
          isPublished: publish,
          updatedById,
          publishedAt: publish ? new Date().toISOString() : null,
        });
      }
      lessonsCreated++;
    }
  }

  return { modulesCreated, lessonsCreated };
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { courseTitle, description, publish } = parsed.data;

  // Resolve modules — either parse CSV or use pre-parsed array
  let modules: Array<{ title: string; lessons: Pick<CsvLessonRow, "lesson_title" | "lesson_type" | "content_summary" | "learning_objectives" | "position">[] }>;

  if ("csvText" in parsed.data) {
    const preview = parseLessonCsv(parsed.data.csvText);
    if (preview.errors.length > 0) {
      return NextResponse.json({ error: "CSV has validation errors", errors: preview.errors }, { status: 400 });
    }
    modules = preview.modules;
  } else {
    modules = parsed.data.modules;
  }

  if (modules.length === 0) {
    return NextResponse.json({ error: "No modules found — check your file has data rows." }, { status: 400 });
  }

  const courseId = randomUUID();
  try {
    await adminDcMutate("CreateCourse", {
      id: courseId,
      slug: slugify(courseTitle),
      title: courseTitle,
      description: description || null,
      thumbnailUrl: null,
      createdById: auth.session.uid,
    });

    if (publish) {
      await adminDcMutate("UpdateCourse", {
        id: courseId,
        status: "published",
        isPublished: true,
        updatedById: auth.session.uid,
        publishedAt: new Date().toISOString(),
      });
    }

    const { modulesCreated, lessonsCreated } = await importModules(courseId, modules, publish, auth.session.uid);

    return NextResponse.json({ courseId, modulesCreated, lessonsCreated }, { status: 201 });
  } catch (error) {
    console.error("[courses/import]", error);
    return NextResponse.json({ error: "Unable to import course" }, { status: 500 });
  }
}
