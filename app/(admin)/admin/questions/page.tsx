import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { QuestionBankPageClient } from "@/components/admin/QuestionBankPageClient";

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
    <QuestionBankPageClient
      initialQuestions={questions}
      initialQuizzes={quizzes}
    />
  );
}
