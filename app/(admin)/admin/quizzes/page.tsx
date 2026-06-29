import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { QuizManagementPanel } from "@/components/admin/QuizManagementPanel";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { buildQuizDashboardData } from "@/lib/admin/quiz-dashboard";
import * as Icons from "@/components/ui/Icons";

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
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 sm:py-8">
      <AdminPageHeader
        icon={<Icons.ClipboardList size={22} />}
        eyebrow="Teacher Portal"
        title="Quizzes Editor"
        description="Create quizzes, assign questions from the bank, and control publish status."
      />
      <QuizManagementPanel
        initialQuizzes={quizDashboard.quizzes ?? []}
        initialTotals={quizDashboard.totals}
      />
    </div>
  );
}
