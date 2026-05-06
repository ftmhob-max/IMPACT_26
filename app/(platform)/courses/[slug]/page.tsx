import { StartQuizButton } from "@/components/quiz/StartQuizButton";
import { IconTile, LearnerPage, PageHeader, PrimaryAction, SectionPanel } from "@/components/ui/LearnerPrimitives";
import { CourseEnrollmentClient } from "@/components/platform/CourseEnrollmentClient";
import { getCourseBySlug, listAdminQuizzes } from "@/lib/firebase/generated";
import { getPlatformDataConnect } from "@/lib/firebase/dataconnect";
import * as Icons from "@/components/ui/Icons";

async function getCourse(slug: string) {
  try {
    const dc = getPlatformDataConnect();
    const { data } = await getCourseBySlug(dc, { slug });
    return data.courses[0] ?? null;
  } catch {
    return null;
  }
}

async function getFallbackPracticeQuiz() {
  try {
    const dc = getPlatformDataConnect();
    const { data } = await listAdminQuizzes(dc);
    return (
      data.quizzes.find((quiz) =>
        /impact|practice|exam/i.test(`${quiz.title} ${quiz.description ?? ""}`)
      ) ?? data.quizzes[0] ?? null
    );
  } catch {
    return null;
  }
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);
  const fallbackQuiz = await getFallbackPracticeQuiz();

  if (!course) {
    return (
      <LearnerPage width="narrow">
        <PageHeader
          backHref="/courses"
          backLabel="Back to courses"
          eyebrow="Course unavailable"
          title="We could not load this course"
          description="The course may not exist, or the training data service may be unavailable in this environment."
        />
        <div className="rounded-lg border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
          Return to the catalog and try again.
        </div>
      </LearnerPage>
    );
  }

  const totalLessons = course.modules_on_course.reduce(
    (sum, m) => sum + m.lessons_on_module.length,
    0
  );
  const firstLesson = course.modules_on_course.flatMap((m) => m.lessons_on_module)[0];
  const shouldShowFallbackQuiz = totalLessons === 0 && fallbackQuiz;

  // Shape modules for the client component (include prerequisiteModuleIds from query if available)
  const modules = course.modules_on_course.map((m: any) => ({
    id: m.id,
    title: m.title,
    position: m.position,
    prerequisiteModuleIds: m.prerequisiteModuleIds ?? null,
    lessons_on_module: m.lessons_on_module.map((l: any) => ({
      id: l.id,
      title: l.title,
      position: l.position,
      lessonType: l.lessonType,
      durationSeconds: l.durationSeconds ?? null,
      videoPlaybackId: l.videoPlaybackId ?? null,
      quiz: l.quiz ?? null,
    })),
  }));

  return (
    <LearnerPage width="narrow">
      <PageHeader
        backHref="/courses"
        backLabel="Back to courses"
        eyebrow={`${course.modules_on_course.length} modules / ${totalLessons} lessons`}
        title={course.title}
        description={course.description}
        icon={Icons.GraduationCap}
        action={
          firstLesson ? (
            <PrimaryAction href={`/lessons/${firstLesson.id}`}>Start course</PrimaryAction>
          ) : fallbackQuiz ? (
            <StartQuizButton quizId={fallbackQuiz.id} label="Start exam" />
          ) : null
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <CourseStat label="Modules" value={course.modules_on_course.length} icon={Icons.LayoutDashboard} />
        <CourseStat label="Lessons" value={totalLessons} icon={Icons.BookOpen} />
        <CourseStat label="Mode" value="Self-paced" icon={Icons.RotateCcw} />
      </div>

      <CourseEnrollmentClient
        courseSlug={slug}
        courseId={course.id}
        modules={modules}
      />

      {shouldShowFallbackQuiz && (
        <div className="mt-5">
          <SectionPanel
            title="Available practice exam"
            description="A quiz exists in Data Connect, but it is not currently linked as a published lesson in this course outline."
          >
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-semibold text-slate-900">{fallbackQuiz.title}</p>
                {fallbackQuiz.description && (
                  <p className="mt-1 text-sm leading-6 text-slate-500">{fallbackQuiz.description}</p>
                )}
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#185FA5]">
                  80-question IMPACT_26 practice exam
                </p>
              </div>
              <StartQuizButton quizId={fallbackQuiz.id} label="Start exam" />
            </div>
          </SectionPanel>
        </div>
      )}
    </LearnerPage>
  );
}

function CourseStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<Icons.IconProps>;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <IconTile icon={icon} size={16} className="h-9 w-9" />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{label}</p>
        <p className="mt-1 text-lg font-extrabold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
