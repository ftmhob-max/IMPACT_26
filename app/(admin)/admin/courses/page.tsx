import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { CurriculumTree } from "@/components/admin/CurriculumTree";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import * as Icons from "@/components/ui/Icons";

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
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 sm:py-8">
      <AdminPageHeader
        icon={<Icons.GraduationCap size={22} />}
        eyebrow="Teacher Portal"
        title="Courses Editor"
        description="Build course structure, edit lessons, attach quizzes and materials, and check publish readiness."
      />
      <CurriculumTree
        initialCourses={coursesData.courses ?? []}
        initialQuizzes={overviewData.quizzes ?? []}
        initialMaterials={overviewData.sourceMaterials ?? []}
      />
    </div>
  );
}
