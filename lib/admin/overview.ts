// lib/admin/overview.ts — shared admin dashboard overview loader (backend)

import { adminDcQuery } from "@/lib/firebase/admin-dc";
import {
  buildQuizDashboardData,
  type QuizDashboardSummary,
  type QuizDashboardTotals,
} from "@/lib/admin/quiz-dashboard";

export type AdminOverview = {
  questions: any[];
  courses: any[];
  quizzes: QuizDashboardSummary[];
  quizTotals: QuizDashboardTotals;
  materials: any[];
  attempts: any[];
  users: any[];
};

const emptyQuizTotals: QuizDashboardTotals = {
  total: 0,
  draft: 0,
  review: 0,
  published: 0,
  ready: 0,
  attention: 0,
  empty: 0,
};

export const emptyAdminOverview: AdminOverview = {
  questions: [],
  courses: [],
  quizzes: [],
  quizTotals: emptyQuizTotals,
  materials: [],
  attempts: [],
  users: [],
};

export async function loadAdminOverview(): Promise<AdminOverview> {
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

  return {
    questions: questions.questions ?? [],
    courses: courses.courses ?? [],
    quizzes: quizDashboard.quizzes,
    quizTotals: quizDashboard.totals,
    materials: materials.sourceMaterials ?? [],
    attempts: stats.quizAttempts ?? [],
    users: users.users ?? [],
  };
}
