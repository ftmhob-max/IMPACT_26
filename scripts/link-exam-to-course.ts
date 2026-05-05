/**
 * Links the imported practice exam quiz to the "Introduction to Assessment"
 * module as a published quiz lesson.
 *
 * Safe to re-run — duplicate lesson creation errors are caught and skipped.
 *
 * Usage:
 *   FIREBASE_SERVICE_ACCOUNT_KEY='...' npx tsx scripts/link-exam-to-course.ts
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";

const PROJECT_ID = "impact26-aa59b";
const COURSE_SLUG = "property-assessment-mastery";
const QUIZ_LESSON_ID = "ffffffff-ffff-ffff-ffff-000000000001";

const DC_BASE = process.env.FIREBASE_DATACONNECT_EMULATOR_HOST
  ? `http://${process.env.FIREBASE_DATACONNECT_EMULATOR_HOST}/v1beta/projects/${PROJECT_ID}/locations/us-central1/services/impact26-dataconnect/connectors/impact26-connector`
  : `https://firebasedataconnect.googleapis.com/v1beta/projects/${PROJECT_ID}/locations/us-central1/services/impact26-dataconnect/connectors/impact26-connector`;

// ─── Admin SDK init ───────────────────────────────────────────────────────────

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountKey) throw new Error("Set FIREBASE_SERVICE_ACCOUNT_KEY before running");

const config = JSON.parse(serviceAccountKey);
if (config.private_key) config.private_key = config.private_key.replace(/\\n/g, "\n");

const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(config), projectId: PROJECT_ID });

async function getAdminToken(): Promise<string> {
  // @ts-ignore
  const tok = await app.options.credential.getAccessToken();
  return tok.access_token;
}

async function dcQuery(operation: string, variables: Record<string, unknown> = {}) {
  const token = await getAdminToken();
  const url = `${DC_BASE}:executeQuery`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ operationName: operation, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    console.error(`DC Error [${operation}]:`, JSON.stringify(json.errors, null, 2));
    throw new Error(`${operation} failed: ${json.errors[0].message}`);
  }
  if (!json.data) {
    console.error(`DC Response [${operation}] had no data:`, JSON.stringify(json, null, 2));
  }
  return json.data;
}

async function dcMutate(operation: string, variables: Record<string, unknown> = {}) {
  const token = await getAdminToken();
  const url = `${DC_BASE}:executeMutation`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ operationName: operation, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    console.error(`DC Error [${operation}]:`, JSON.stringify(json.errors, null, 2));
    throw new Error(`${operation} failed: ${json.errors[0].message}`);
  }
  return json.data;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Get module ID from the existing course
  console.log(`Fetching course "${COURSE_SLUG}"...`);
  const courseData = await dcQuery("GetCourseBySlug", { slug: COURSE_SLUG });
  const course = courseData.courses?.[0];
  if (!course) throw new Error(`Course "${COURSE_SLUG}" not found. Run create-sample-course.ts first.`);

  const module_ = course.modules_on_course?.[0];
  if (!module_) throw new Error("No modules found in course.");
  console.log(`  Module: "${module_.title}" (${module_.id})`);

  // 2. Find the practice exam quiz
  console.log("Fetching quizzes...");
  const quizData = await dcQuery("ListAdminQuizzes");
  const quiz = (quizData.quizzes as Array<{ id: string; title: string }>).find((q) =>
    q.title.includes("Practice Exam") || q.title.includes("IMPACT")
  );
  if (!quiz) throw new Error("Practice exam quiz not found. Run import-questions.ts first.");
  console.log(`  Quiz: "${quiz.title}" (${quiz.id})`);

  // 3. Create the quiz lesson (idempotent — catches duplicate key errors)
  console.log("Creating quiz lesson...");
  try {
    await dcMutate("CreateLesson", {
      id: QUIZ_LESSON_ID,
      moduleId: module_.id,
      title: "IMPACT_26V.1 Full Practice Exam",
      position: 1,
      lessonType: "quiz",
    });
    console.log("  Lesson created.");
  } catch (e: any) {
    if (e.message?.includes("already exists") || e.message?.includes("unique") || e.message?.includes("duplicate")) {
      console.log("  Lesson already exists, skipping creation.");
    } else {
      throw e;
    }
  }

  // 4. Link quiz + publish
  console.log("Linking quiz and publishing lesson...");
  await dcMutate("UpdateLesson", {
    id: QUIZ_LESSON_ID,
    quizId: quiz.id,
    isPublished: true,
  });

  console.log("\n✅ Done! The practice exam is now a published lesson in the course.");
  console.log(`   Course: /courses/${COURSE_SLUG}`);
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
