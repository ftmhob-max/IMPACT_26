/**
 * Links the imported practice exam quiz to the "Introduction to Assessment"
 * module as a published quiz lesson.
 *
 * Safe to re-run — duplicate lesson creation errors are caught and skipped.
 *
 * Usage:
 *   SERVICE_ACCOUNT_KEY='...' npx tsx scripts/link-exam-to-course.ts
 */

import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";

const COURSE_SLUG = "property-assessment-mastery";
const QUIZ_LESSON_ID = "ffffffff-ffff-ffff-ffff-000000000001";

async function main() {
  console.log(`Fetching course "${COURSE_SLUG}"...`);
  const courseData = await adminDcQuery<{ courses?: Array<Record<string, unknown>> }>("GetCourseBySlug", {
    slug: COURSE_SLUG,
  });
  const course = courseData.courses?.[0] as
    | { id: string; modules_on_course?: Array<{ id: string; title: string }> }
    | undefined;
  if (!course) throw new Error(`Course "${COURSE_SLUG}" not found. Run create-sample-course.ts first.`);

  const module_ = course.modules_on_course?.[0];
  if (!module_) throw new Error("No modules found in course.");
  console.log(`  Module: "${module_.title}" (${module_.id})`);

  console.log("Fetching quizzes...");
  const quizData = await adminDcQuery<{ quizzes?: Array<{ id: string; title: string }> }>("ListAdminQuizzes");
  const quiz = quizData.quizzes?.find((q) => q.title.includes("Practice Exam") || q.title.includes("IMPACT"));
  if (!quiz) throw new Error("Practice exam quiz not found. Run import-questions.ts first.");
  console.log(`  Quiz: "${quiz.title}" (${quiz.id})`);

  console.log("Creating quiz lesson...");
  try {
    await adminDcMutate("CreateLesson", {
      id: QUIZ_LESSON_ID,
      moduleId: module_.id,
      title: "IMPACT_26V.1 Full Practice Exam",
      position: 1,
      lessonType: "quiz",
    });
    console.log("  Lesson created.");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("already exists") || message.includes("unique") || message.includes("duplicate")) {
      console.log("  Lesson already exists, skipping creation.");
    } else {
      throw error;
    }
  }

  console.log("Linking quiz and publishing lesson...");
  await adminDcMutate("UpdateLesson", {
    id: QUIZ_LESSON_ID,
    quizId: quiz.id,
    isPublished: true,
  });

  console.log("\n✅ Done! The practice exam is now a published lesson in the course.");
  console.log(`   Course: /courses/${COURSE_SLUG}`);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error("Failed:", message);
  process.exit(1);
});
