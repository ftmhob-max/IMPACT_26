import Link from "next/link";
import { StartQuizButton } from "@/components/quiz/StartQuizButton";
import { LearnerPage, PageHeader, PrimaryAction, SectionPanel } from "@/components/ui/LearnerPrimitives";
import { getCourseBySlug, listAdminQuizzes } from "@/lib/firebase/generated";
import { getPlatformDataConnect } from "@/lib/firebase/dataconnect";

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

  return (
    <LearnerPage width="narrow">
      <PageHeader
        backHref="/courses"
        backLabel="Back to courses"
        eyebrow={`${course.modules_on_course.length} modules / ${totalLessons} lessons`}
        title={course.title}
        description={course.description}
        action={
          firstLesson ? (
            <PrimaryAction href={`/lessons/${firstLesson.id}`}>Start course</PrimaryAction>
          ) : fallbackQuiz ? (
            <StartQuizButton quizId={fallbackQuiz.id} label="Start exam" />
          ) : null
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <CourseStat label="Modules" value={course.modules_on_course.length} />
        <CourseStat label="Lessons" value={totalLessons} />
        <CourseStat label="Mode" value="Self-paced" />
      </div>

      <SectionPanel
        title="Course outline"
        description="Lessons are grouped by assessment topic so learners can move from method to practice."
      >
        <div className="divide-y divide-slate-100">
          {course.modules_on_course.map((module, mIdx) => (
            <div key={module.id}>
              <div className="flex items-center gap-3 bg-slate-50 px-5 py-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-xs font-bold text-slate-500 shadow-sm">
                  {mIdx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{module.title}</p>
                  <p className="text-xs text-slate-500">{module.lessons_on_module.length} lessons</p>
                </div>
              </div>
              {module.lessons_on_module.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {module.lessons_on_module.map((lesson, lIdx) => (
                    <Link
                      key={lesson.id}
                      href={`/lessons/${lesson.id}`}
                      className="grid grid-cols-[48px_1fr_auto] items-center gap-3 px-5 py-3 transition-colors hover:bg-[#F8F7F4]"
                    >
                      <span className="text-xs font-mono text-slate-400">
                        {mIdx + 1}.{lIdx + 1}
                      </span>
                      <span className="min-w-0 truncate text-sm font-medium text-slate-700">{lesson.title}</span>
                      <div className="flex items-center gap-2">
                        <LessonBadge type={lesson.lessonType} />
                        {lesson.durationSeconds && (
                          <span className="hidden text-xs text-slate-400 sm:inline">
                            {Math.ceil(lesson.durationSeconds / 60)} min
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-4 text-sm text-slate-500">
                  No published lessons are linked to this module yet.
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionPanel>

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

function CourseStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function LessonBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; className: string }> = {
    video: { label: "Video", className: "bg-[#E6F1FB] text-[#185FA5]" },
    text: { label: "Reading", className: "bg-slate-100 text-slate-600" },
    quiz: { label: "Practice", className: "bg-[#EEEDFE] text-[#534AB7]" },
  };
  const { label, className } = map[type] ?? { label: type, className: "bg-slate-100 text-slate-500" };
  return (
    <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
