import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { buildQuizDashboardData } from "@/lib/admin/quiz-dashboard";

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  try {
    const [questions, courses, quizzes, materials, stats, users, quizUsage] = await Promise.all([
      adminDcQuery<{ questions: any[] }>("AdminListQuestions").catch(() => ({ questions: [] })),
      adminDcQuery<{ courses: any[] }>("AdminListCourses").catch(() => ({ courses: [] })),
      adminDcQuery<{ quizzes: any[] }>("ListAdminQuizzes").catch(() => ({ quizzes: [] })),
      adminDcQuery<{ sourceMaterials: any[] }>("AdminListSourceMaterials").catch(() => ({ sourceMaterials: [] })),
      adminDcQuery<{ quizAttempts: any[] }>("AdminCohortStats").catch(() => ({ quizAttempts: [] })),
      adminDcQuery<{ users: any[] }>("AdminListUsers").catch(() => ({ users: [] })),
      adminDcQuery<{ quizQuestions: any[] }>("AdminListQuizQuestionUsage").catch(() => ({ quizQuestions: [] })),
    ]);
    const quizDashboard = buildQuizDashboardData(
      quizzes.quizzes ?? [],
      questions.questions ?? [],
      quizUsage.quizQuestions ?? []
    );

    return NextResponse.json({
      questions: questions.questions,
      courses: courses.courses,
      quizzes: quizDashboard.quizzes,
      quizTotals: quizDashboard.totals,
      materials: materials.sourceMaterials,
      attempts: stats.quizAttempts,
      users: users.users,
    });
  } catch (error) {
    console.error("[admin/overview]", error);
    return NextResponse.json({ error: "Unable to load admin overview" }, { status: 500 });
  }
}
