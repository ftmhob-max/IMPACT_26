import { LessonPlanDetailView } from "@/components/admin/LessonPlanDetailView";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { formatUuid } from "@/lib/utils";
import * as Icons from "@/components/ui/Icons";
import Link from "next/link";

async function fetchCourseDetail(courseId: string) {
  try {
    const normalizedId = formatUuid(courseId);

    const [coursesData, quizzesData] = await Promise.all([
      adminDcQuery<{ courses: any[] }>("AdminListCourses").catch(() => ({ courses: [] })),
      adminDcQuery<{ quizzes: any[] }>("ListAdminQuizzes").catch(() => ({ quizzes: [] })),
    ]);

    const course = coursesData.courses.find((c: any) => formatUuid(c.id) === normalizedId);
    if (!course) return null;

    const quizMap = new Map<string, any>(
      quizzesData.quizzes.map((q: any) => [formatUuid(q.id), q])
    );

    const modules = (course.modules_on_course ?? [])
      .slice()
      .sort((a: any, b: any) => a.position - b.position)
      .map((mod: any) => ({
        id: mod.id,
        title: mod.title,
        description: mod.description ?? null,
        learningObjectives: mod.learningObjectives ?? null,
        position: mod.position,
        status: mod.status,
        lessons: (mod.lessons_on_module ?? [])
          .slice()
          .sort((a: any, b: any) => a.position - b.position)
          .map((lesson: any) => {
            const linkedQuiz = lesson.quiz?.id ? quizMap.get(formatUuid(lesson.quiz.id)) : null;
            return {
              id: lesson.id,
              title: lesson.title,
              position: lesson.position,
              lessonType: lesson.lessonType,
              status: lesson.status,
              isPublished: lesson.isPublished,
              durationSeconds: lesson.durationSeconds ?? null,
              videoPlaybackId: lesson.videoPlaybackId ?? null,
              videoUrl: lesson.videoUrl ?? null,
              contentJson: lesson.contentJson ?? null,
              quiz: linkedQuiz
                ? {
                    id: linkedQuiz.id,
                    title: linkedQuiz.title,
                    status: linkedQuiz.status,
                    passingScore: linkedQuiz.passingScore ?? null,
                    timeLimitSeconds: linkedQuiz.timeLimitSeconds ?? null,
                    shuffleQuestions: linkedQuiz.shuffleQuestions,
                    shuffleChoices: linkedQuiz.shuffleChoices,
                  }
                : null,
              sourceMaterial: lesson.sourceMaterial
                ? { id: lesson.sourceMaterial.id, title: lesson.sourceMaterial.title }
                : null,
            };
          }),
      }));

    return {
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description ?? null,
        status: course.status,
        isPublished: course.isPublished,
      },
      modules,
    };
  } catch {
    return null;
  }
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const data = await fetchCourseDetail(courseId);

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <Icons.GraduationCap size={40} className="mx-auto text-slate-200 mb-4" />
        <h1 className="text-xl font-bold text-slate-900">Course not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          This course may not exist or the server is unavailable.
        </p>
        <Link
          href="/admin/courses"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#185FA5] hover:underline"
        >
          <Icons.ArrowLeft size={14} />
          Back to all courses
        </Link>
      </div>
    );
  }

  return <LessonPlanDetailView course={data.course} initialModules={data.modules} />;
}
