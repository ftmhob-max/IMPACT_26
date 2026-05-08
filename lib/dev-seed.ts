import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { DEV_COURSES, DEV_FORMULA_SECTIONS } from "@/lib/dev-content";

const DEV_SYSTEM_USER_ID = "00000000-0000-0000-0000-000000000000";
let seedPromise: Promise<boolean> | null = null;

function isDuplicateError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /already exists|duplicate|unique/i.test(message);
}

async function safeMutate(operation: string, variables: Record<string, unknown>) {
  try {
    await adminDcMutate(operation, variables);
  } catch (error) {
    if (!isDuplicateError(error)) throw error;
  }
}

async function seedDevDataImpl() {
  if (process.env.NODE_ENV === "production") return false;

  await safeMutate("CreateUser", {
    id: DEV_SYSTEM_USER_ID,
    email: "system@impact26.local",
    fullName: "Development Seed",
  });

  const [{ courses }, { formulaSections }] = await Promise.all([
    adminDcQuery<{ courses: Array<{ id: string }> }>("ListPublishedCourses").catch(() => ({ courses: [] })),
    adminDcQuery<{ formulaSections: Array<{ id: string; code: string }> }>("GetFormulaSections").catch(() => ({ formulaSections: [] })),
  ]);

  if (courses.length === 0) {
    for (const course of DEV_COURSES) {
      await safeMutate("CreateCourse", {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description ?? null,
        thumbnailUrl: course.thumbnailUrl ?? null,
        createdById: DEV_SYSTEM_USER_ID,
      });
      await safeMutate("UpdateCourse", {
        id: course.id,
        status: "published",
        isPublished: true,
        updatedById: DEV_SYSTEM_USER_ID,
        publishedAt: new Date().toISOString(),
      });

      for (const module of course.modules_on_course) {
        await safeMutate("CreateModule", {
          id: module.id,
          courseId: course.id,
          title: module.title,
          position: module.position,
        });

        for (const lesson of module.lessons_on_module) {
          await safeMutate("CreateLesson", {
            id: lesson.id,
            moduleId: module.id,
            title: lesson.title,
            position: lesson.position,
            lessonType: lesson.lessonType,
          });
          await safeMutate("UpdateLesson", {
            id: lesson.id,
            contentJson: lesson.contentJson ?? null,
            durationSeconds: lesson.durationSeconds ?? null,
            status: "published",
            isPublished: true,
            updatedById: DEV_SYSTEM_USER_ID,
            publishedAt: new Date().toISOString(),
          });
        }
      }
    }
  }

  if (formulaSections.length === 0) {
    for (const section of DEV_FORMULA_SECTIONS) {
      await safeMutate("CreateFormulaSection", {
        id: section.id,
        code: section.code,
        title: section.title,
        position: section.position,
      });

      for (const [index, formula] of section.formulas.entries()) {
        await safeMutate("CreateFormula", {
          sectionId: section.id,
          code: formula.code,
          name: formula.name,
          expression: formula.expression,
          notes: formula.notes ?? null,
          position: index,
        });
      }
    }
  }
  return true;
}

export async function ensureDevDataSeeded() {
  if (!seedPromise) {
    seedPromise = seedDevDataImpl().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}
