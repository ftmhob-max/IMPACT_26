import Link from "next/link";
import { IconTile, LearnerPage, PageHeader, PrimaryAction, SectionPanel } from "@/components/ui/LearnerPrimitives";
import { StudentPreviewBanner } from "@/components/admin/StudentPreviewBanner";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { getDevCourseBySlug } from "@/lib/dev-content";
import { ensureDevDataSeeded } from "@/lib/dev-seed";
import * as Icons from "@/components/ui/Icons";

async function getCourse(slug: string) {
  try {
    type CourseData = {
      courses: Array<{
        id: string;
        slug: string;
        title: string;
        description?: string | null;
        thumbnailUrl?: string | null;
        modules_on_course: Array<{
          id: string;
          title: string;
          position: number;
          prerequisiteModuleIds?: string | null;
          lessons_on_module: Array<{
            id: string;
            title: string;
            position: number;
            lessonType: string;
            durationSeconds?: number | null;
            videoPlaybackId?: string | null;
            videoUrl?: string | null;
            quiz?: { id: string } | null;
          }>;
        }>;
      }>;
    };

    let data = await adminDcQuery<CourseData>("GetCourseBySlug", { slug });
    if (!data.courses[0]) {
      await ensureDevDataSeeded().catch(() => null);
      data = await adminDcQuery<CourseData>("GetCourseBySlug", { slug }).catch(
        (): CourseData => ({ courses: [] })
      );
    }
    return data.courses[0] ?? getDevCourseBySlug(slug);
  } catch {
    return getDevCourseBySlug(slug);
  }
}

export default async function AdminPreviewCourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    return (
      <>
        <StudentPreviewBanner backHref="/admin/preview/courses" backLabel="Back to course catalog" />
        <LearnerPage width="narrow">
          <PageHeader
            backHref="/admin/preview/courses"
            backLabel="Back to courses"
            eyebrow="Course unavailable"
            title="We could not load this course"
            description="The course may not exist, or the training data service may be unavailable in this environment."
          />
          <div className="rounded-lg border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
            Return to the catalog and try again.
          </div>
        </LearnerPage>
      </>
    );
  }

  const totalLessons = course.modules_on_course.reduce(
    (sum, m) => sum + m.lessons_on_module.length,
    0
  );
  const firstLesson = course.modules_on_course.flatMap((m) => m.lessons_on_module)[0];

  return (
    <>
      <StudentPreviewBanner backHref="/admin/preview/courses" backLabel="Back to course catalog" />
      <LearnerPage width="narrow">
        <PageHeader
          backHref="/admin/preview/courses"
          backLabel="Back to courses"
          eyebrow={`${course.modules_on_course.length} modules / ${totalLessons} lessons`}
          title={course.title}
          description={course.description}
          icon={Icons.GraduationCap}
          action={
            firstLesson ? (
              <PrimaryAction href={`/admin/preview/lessons/${firstLesson.id}`}>
                Preview first lesson
              </PrimaryAction>
            ) : null
          }
        />

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <CourseStat label="Modules" value={course.modules_on_course.length} icon={Icons.LayoutDashboard} />
          <CourseStat label="Lessons" value={totalLessons} icon={Icons.BookOpen} />
          <CourseStat label="Mode" value="Self-paced" icon={Icons.RotateCcw} />
        </div>

        {/* Read-only module/lesson list — no enrollment or progress API calls */}
        <SectionPanel
          title="Course outline"
          description="All modules and lessons as learners will see them. Click any lesson to preview it."
        >
          <div className="divide-y divide-slate-100">
            {course.modules_on_course.length === 0 ? (
              <div className="px-5 py-8 text-sm text-slate-500">
                No modules have been added to this course yet.
              </div>
            ) : (
              course.modules_on_course.map((module, mIdx) => (
                <div key={module.id}>
                  <div className="flex items-center gap-3 bg-[#f8fbff] px-5 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-xs font-extrabold text-[#185FA5] shadow-sm ring-1 ring-slate-200">
                      {mIdx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{module.title}</p>
                      <p className="text-xs text-slate-500">{module.lessons_on_module.length} lessons</p>
                    </div>
                  </div>

                  {module.lessons_on_module.length === 0 ? (
                    <div className="px-5 py-3 text-xs text-slate-400">No published lessons yet.</div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {module.lessons_on_module.map((lesson, lIdx) => {
                        const typeStyles: Record<string, { label: string; className: string }> = {
                          video: { label: "Video", className: "bg-[#E6F1FB] text-[#185FA5]" },
                          text: { label: "Reading", className: "bg-slate-100 text-slate-600" },
                          quiz: { label: "Practice", className: "bg-[#EEEDFE] text-[#534AB7]" },
                        };
                        const style = typeStyles[lesson.lessonType] ?? { label: lesson.lessonType, className: "bg-slate-100 text-slate-500" };

                        return (
                          <Link
                            key={lesson.id}
                            href={`/admin/preview/lessons/${lesson.id}`}
                            className="grid grid-cols-[36px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-4 py-3 transition-colors hover:bg-[#F8F7F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-inset sm:grid-cols-[48px_1fr_auto] sm:px-5"
                          >
                            <span className="font-mono text-xs text-slate-400">{mIdx + 1}.{lIdx + 1}</span>
                            <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
                              {lesson.title}
                            </span>
                            <span className={`col-start-2 w-fit whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold sm:col-start-auto ${style.className}`}>
                              {style.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </SectionPanel>
      </LearnerPage>
    </>
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
