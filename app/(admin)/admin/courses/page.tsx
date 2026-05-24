import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { CurriculumTree } from "@/components/admin/CurriculumTree";

export default async function AdminCoursesPage() {
  const [coursesData, overviewData] = await Promise.all([
    adminDcQuery<{ courses: any[] }>("AdminListCourses").catch(() => ({ courses: [] })),
    adminDcQuery<{ quizzes: any[]; sourceMaterials: any[] }>("AdminListSourceMaterials")
      .then((materials) =>
        adminDcQuery<{ quizzes: any[] }>("ListAdminQuizzes").then((quizzes) => ({
          quizzes: quizzes.quizzes,
          sourceMaterials: materials.sourceMaterials,
        }))
      )
      .catch(() => ({ quizzes: [], sourceMaterials: [] })),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
      <CurriculumTree
        initialCourses={coursesData.courses ?? []}
        initialQuizzes={overviewData.quizzes ?? []}
        initialMaterials={overviewData.sourceMaterials ?? []}
      />
    </div>
  );
}
