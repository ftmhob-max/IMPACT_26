import { formatUuid } from "@/lib/utils";

interface QuizDashboardBase {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  passingScore?: number | null;
  timeLimitSeconds?: number | null;
  shuffleQuestions: boolean;
  shuffleChoices?: boolean;
  calculatorSettingsJson?: string | null;
  createdAt: string;
}

interface QuizQuestionUsageRecord {
  quiz: { id: string; title?: string | null };
  question: { id: string };
}

interface QuestionCorrectnessRecord {
  id: string;
  answerChoices_on_question?: Array<{ isCorrect: boolean }> | null;
}

export type QuizReadinessState = "empty" | "attention" | "ready";

export interface QuizDashboardSummary extends QuizDashboardBase {
  questionCount: number;
  incompleteQuestionCount: number;
  readyQuestionCount: number;
  readiness: QuizReadinessState;
}

export interface QuizDashboardTotals {
  total: number;
  draft: number;
  review: number;
  published: number;
  ready: number;
  attention: number;
  empty: number;
}

export interface QuizDashboardData {
  quizzes: QuizDashboardSummary[];
  totals: QuizDashboardTotals;
}

function hasCorrectAnswer(question?: QuestionCorrectnessRecord | null) {
  return !!question?.answerChoices_on_question?.some((choice) => choice.isCorrect);
}

export function getQuizReadiness(
  questionCount: number,
  incompleteQuestionCount: number
): QuizReadinessState {
  if (questionCount === 0) return "empty";
  if (incompleteQuestionCount > 0) return "attention";
  return "ready";
}

export function buildQuizDashboardData<
  TQuiz extends QuizDashboardBase,
  TQuestion extends QuestionCorrectnessRecord,
>(
  quizzes: TQuiz[],
  questions: TQuestion[],
  quizQuestionUsage: QuizQuestionUsageRecord[]
): QuizDashboardData {
  const questionById = new Map(
    questions.map((question) => [formatUuid(question.id), question])
  );
  const quizQuestionIds = new Map<string, Set<string>>();

  for (const usage of quizQuestionUsage) {
    const quizId = formatUuid(usage.quiz.id);
    const questionId = formatUuid(usage.question.id);
    const bucket = quizQuestionIds.get(quizId) ?? new Set<string>();
    bucket.add(questionId);
    quizQuestionIds.set(quizId, bucket);
  }

  const dashboardQuizzes: QuizDashboardSummary[] = quizzes.map((quiz) => {
    const quizId = formatUuid(quiz.id);
    const questionIds = [...(quizQuestionIds.get(quizId) ?? new Set<string>())];
    const incompleteQuestionCount = questionIds.reduce((count, questionId) => {
      return count + (hasCorrectAnswer(questionById.get(questionId)) ? 0 : 1);
    }, 0);
    const questionCount = questionIds.length;
    const readiness = getQuizReadiness(questionCount, incompleteQuestionCount);

    return {
      ...quiz,
      id: quizId,
      questionCount,
      incompleteQuestionCount,
      readyQuestionCount: Math.max(0, questionCount - incompleteQuestionCount),
      readiness,
    };
  });

  const totals = dashboardQuizzes.reduce<QuizDashboardTotals>(
    (acc, quiz) => {
      acc.total += 1;
      if (quiz.status === "draft") acc.draft += 1;
      if (quiz.status === "review") acc.review += 1;
      if (quiz.status === "published") acc.published += 1;
      if (quiz.readiness === "ready") acc.ready += 1;
      if (quiz.readiness === "attention") acc.attention += 1;
      if (quiz.readiness === "empty") acc.empty += 1;
      return acc;
    },
    {
      total: 0,
      draft: 0,
      review: 0,
      published: 0,
      ready: 0,
      attention: 0,
      empty: 0,
    }
  );

  return {
    quizzes: dashboardQuizzes,
    totals,
  };
}
