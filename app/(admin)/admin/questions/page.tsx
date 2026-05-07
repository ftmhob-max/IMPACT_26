import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { QuestionBuilderClient } from "@/components/admin/QuestionBuilderClient";
import { QuestionBankClient } from "@/components/admin/QuestionBankClient";

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  difficulty: string;
  domain: string;
  formulaRef?: string | null;
  topicTags?: string | null;
  status: string;
  version: number;
  isMultiselect: boolean;
  rationale?: string | null;
  calculation?: string | null;
  sourceRef?: string | null;
  createdAt: string;
  answerChoices_on_question: Array<{
    id: string;
    letter: string;
    choiceText: string;
    isCorrect: boolean;
    explanation?: string | null;
    position: number;
  }>;
}

async function getPageData() {
  const [qData, quizData] = await Promise.all([
    adminDcQuery<{ questions: Question[] }>("AdminListQuestions").catch(() => ({ questions: [] })),
    adminDcQuery<{ quizzes: Array<{ id: string; title: string }> }>("ListAdminQuizzes").catch(() => ({
      quizzes: [],
    })),
  ]);
  return { questions: qData.questions, quizzes: quizData.quizzes };
}

export default async function QuestionBankPage() {
  const { questions, quizzes } = await getPageData();

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Question Bank</h1>
        <p className="mt-1 text-sm text-slate-500">
          {questions.length} question{questions.length !== 1 ? "s" : ""} · Import via CSV or build manually, then assign to a quiz.
        </p>
      </div>

      {/* Builder panels */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
            <span className="text-[#185FA5]">📋</span>
            <h2 className="text-sm font-bold text-slate-900">CSV Import</h2>
            <span className="ml-auto text-xs text-slate-400">Bulk upload with validation</span>
          </div>
          <div className="p-4">
            <QuestionBuilderClient mode="csv" quizzes={quizzes} />
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
            <span className="text-[#185FA5]">✏️</span>
            <h2 className="text-sm font-bold text-slate-900">Manual Builder</h2>
            <span className="ml-auto text-xs text-slate-400">Multiple choice, multiselect, scenario</span>
          </div>
          <div className="p-4">
            <QuestionBuilderClient mode="manual" quizzes={quizzes} />
          </div>
        </div>
      </div>

      {/* Question bank with search / filters / pagination / bulk ops */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">All questions</h2>
        <QuestionBankClient questions={questions} quizzes={quizzes} />
      </div>
    </div>
  );
}
