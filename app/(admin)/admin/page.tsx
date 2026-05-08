import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { AdminPortal } from "@/components/admin/AdminPortal";

export default async function AdminDashboard() {
  const [questions, courses, quizzes, materials, attempts, users] = await Promise.all([
    adminDcQuery<{ questions: any[] }>("AdminListQuestions").catch(() => ({ questions: [] })),
    adminDcQuery<{ courses: any[] }>("AdminListCourses").catch(() => ({ courses: [] })),
    adminDcQuery<{ quizzes: any[] }>("ListAdminQuizzes").catch(() => ({ quizzes: [] })),
    adminDcQuery<{ sourceMaterials: any[] }>("AdminListSourceMaterials").catch(() => ({ sourceMaterials: [] })),
    adminDcQuery<{ quizAttempts: any[] }>("AdminCohortStats").catch(() => ({ quizAttempts: [] })),
    adminDcQuery<{ users: any[] }>("AdminListUsers").catch(() => ({ users: [] })),
  ]);

  return (
    <AdminPortal
      initialOverview={{
        questions: questions.questions ?? [],
        courses: courses.courses ?? [],
        quizzes: quizzes.quizzes ?? [],
        materials: materials.sourceMaterials ?? [],
        attempts: attempts.quizAttempts ?? [],
        users: users.users ?? [],
      }}
    />
  );
}
