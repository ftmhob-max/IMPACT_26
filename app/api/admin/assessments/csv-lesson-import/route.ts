import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { parseLessonCsv, type CsvLessonRow } from "@/lib/admin/csv-lesson";
import { z } from "zod";

const bodySchema = z.object({
  courseId: z.string().uuid(),
  csvText: z.string().min(1),
  publish: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { courseId, csvText, publish } = parsed.data;
  const preview = parseLessonCsv(csvText);

  if (preview.errors.length > 0) {
    return NextResponse.json({ error: "CSV has validation errors", errors: preview.errors }, { status: 400 });
  }

  const createdModules: Array<{ moduleId: string; title: string; lessons: string[] }> = [];

  try {
    for (let mIdx = 0; mIdx < preview.modules.length; mIdx++) {
      const { title: moduleTitle, lessons } = preview.modules[mIdx];
      const moduleId = randomUUID();

      await adminDcMutate("CreateModule", {
        id: moduleId,
        courseId,
        title: moduleTitle,
        position: mIdx,
      });

      const lessonIds: string[] = [];
      for (let lIdx = 0; lIdx < lessons.length; lIdx++) {
        const lesson: CsvLessonRow = lessons[lIdx];
        const lessonId = randomUUID();

        await adminDcMutate("CreateLesson", {
          id: lessonId,
          moduleId,
          title: lesson.lesson_title,
          position: lesson.position ?? lIdx,
          lessonType: lesson.lesson_type,
        });

        // Populate contentJson with lesson summary as a simple TipTap doc
        if (lesson.content_summary || lesson.learning_objectives) {
          const content: any[] = [];
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
          const contentJson = JSON.stringify({ type: "doc", content });
          await adminDcMutate("UpdateLesson", {
            id: lessonId,
            contentJson,
            videoPlaybackId: null,
            quizId: null,
            sourceMaterialId: null,
            durationSeconds: null,
            status: publish ? "published" : "draft",
            isPublished: publish,
            updatedById: auth.session.uid,
            publishedAt: publish ? new Date().toISOString() : null,
          });
        }

        lessonIds.push(lessonId);
      }

      createdModules.push({ moduleId, title: moduleTitle, lessons: lessonIds });
    }

    return NextResponse.json({ courseId, modules: createdModules }, { status: 201 });
  } catch (error) {
    console.error("[csv-lesson-import]", error);
    return NextResponse.json({ error: "Unable to import lesson structure" }, { status: 500 });
  }
}
