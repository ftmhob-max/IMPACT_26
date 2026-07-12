// Front-end learner course detail: app/(platform)/courses/[slug]/page.tsx
import { notFound } from "next/navigation";
import { IconTile, LearnerPage, PageHeader, PrimaryAction, SectionPanel } from "@/components/ui/LearnerPrimitives";
import { CourseEnrollmentClient } from "@/components/platform/CourseEnrollmentClient";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { getDevCourseBySlug } from "@/lib/dev-content";
import { ensureDevDataSeeded } from "@/lib/dev-seed";
import * as Icons from "@/components/ui/Icons";
import { getLearnerSession } from "@/lib/firebase/learner-session";
import { getCourseCertificateEligibility } from "@/lib/firebase/certificates";

const isDevEnvironment = process.env.NODE_ENV === "development";

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

    if (isDevEnvironment) {
      await ensureDevDataSeeded().catch(() => null);
    }

    let data = await adminDcQuery<CourseData>("GetCourseBySlug", { slug });
    if (!data.courses[0] && isDevEnvironment) {
      data = await adminDcQuery<CourseData>("GetCourseBySlug", { slug }).catch(
        (): CourseData => ({ courses: [] })
      );
      return data.courses[0] ?? getDevCourseBySlug(slug);
    }
    return data.courses[0] ?? null;
  } catch (error) {
    if (isDevEnvironment) {
      return getDevCourseBySlug(slug);
    }
    // Operational failures belong to the retryable route error boundary; only
    // a successful query with no course should render the not-found boundary.
    throw error;
  }
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getLearnerSession();
  const [course, certificateResult] = await Promise.all([
    getCourse(slug),
    session
      ? getCourseCertificateEligibility(session.uid, slug).catch(() => null)
      : Promise.resolve(null),
  ]);

  if (!course) {
    notFound();
  }

  const totalLessons = course.modules_on_course.reduce(
    (sum, m) => sum + m.lessons_on_module.length,
    0
  );
  const firstLesson = course.modules_on_course.flatMap((m) => m.lessons_on_module)[0];

  // Shape modules — only include modules that have at least one published lesson
  // (GetCourseBySlug already filters lessons to isPublished=true, so empty arrays mean no live content)
  const modules = course.modules_on_course
    .map((m: any) => ({
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
    }))
    .filter((m: { lessons_on_module: unknown[] }) => m.lessons_on_module.length > 0);

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
          certificateResult?.eligibility?.eligible ? (
            <PrimaryAction href={`/certificates/${slug}`}>View certificate</PrimaryAction>
          ) : firstLesson ? (
            <PrimaryAction href={`/lessons/${firstLesson.id}`}>Start course</PrimaryAction>
          ) : null
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <CourseStat label="Modules" value={course.modules_on_course.length} icon={Icons.LayoutDashboard} />
        <CourseStat label="Lessons" value={totalLessons} icon={Icons.BookOpen} />
        <CourseStat label="Mode" value="Scenario labs" icon={Icons.FileCheck} />
      </div>

      <CourseEnrollmentClient
        courseSlug={slug}
        courseId={course.id}
        modules={modules}
      />
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
