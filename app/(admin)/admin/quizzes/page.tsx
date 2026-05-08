import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { QuizManagementPanel } from "@/components/admin/QuizManagementPanel";

export default async function AdminQuizzesPage() {
  const quizzesData = await adminDcQuery<{ quizzes: any[] }>("ListAdminQuizzes").catch(() => ({ quizzes: [] }));

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Quiz Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create quizzes, assign questions from the bank, and control publish status.
        </p>
      </div>
      <QuizManagementPanel initialQuizzes={quizzesData.quizzes ?? []} />
    </div>
  );
}
