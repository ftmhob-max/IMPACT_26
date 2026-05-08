import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { QuizManagementPanel } from "@/components/admin/QuizManagementPanel";
import { buildQuizDashboardData } from "@/lib/admin/quiz-dashboard";

export default async function AdminQuizzesPage() {
  const [quizzesData, questionsData, usageData] = await Promise.all([
    adminDcQuery<{ quizzes: any[] }>("ListAdminQuizzes").catch(() => ({ quizzes: [] })),
    adminDcQuery<{ questions: any[] }>("AdminListQuestions").catch(() => ({ questions: [] })),
    adminDcQuery<{ quizQuestions: any[] }>("AdminListQuizQuestionUsage").catch(() => ({ quizQuestions: [] })),
  ]);
  const quizDashboard = buildQuizDashboardData(
    quizzesData.quizzes ?? [],
    questionsData.questions ?? [],
    usageData.quizQuestions ?? []
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Quiz Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create quizzes, assign questions from the bank, and control publish status.
        </p>
      </div>
      <QuizManagementPanel
        initialQuizzes={quizDashboard.quizzes ?? []}
        initialTotals={quizDashboard.totals}
      />
    </div>
  );
}
