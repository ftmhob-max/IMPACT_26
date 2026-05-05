import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcQuery } from "@/lib/firebase/admin-dc";

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  try {
    const [questions, courses, quizzes, materials, stats, users] = await Promise.all([
      adminDcQuery<{ questions: any[] }>("AdminListQuestions").catch(() => ({ questions: [] })),
      adminDcQuery<{ courses: any[] }>("AdminListCourses").catch(() => ({ courses: [] })),
      adminDcQuery<{ quizzes: any[] }>("ListAdminQuizzes").catch(() => ({ quizzes: [] })),
      adminDcQuery<{ sourceMaterials: any[] }>("AdminListSourceMaterials").catch(() => ({ sourceMaterials: [] })),
      adminDcQuery<{ quizAttempts: any[] }>("AdminCohortStats").catch(() => ({ quizAttempts: [] })),
      adminDcQuery<{ users: any[] }>("AdminListUsers").catch(() => ({ users: [] })),
    ]);

    return NextResponse.json({
      questions: questions.questions,
      courses: courses.courses,
      quizzes: quizzes.quizzes,
      materials: materials.sourceMaterials,
      attempts: stats.quizAttempts,
      users: users.users,
    });
  } catch (error) {
    console.error("[admin/overview]", error);
    return NextResponse.json({ error: "Unable to load admin overview" }, { status: 500 });
  }
}
