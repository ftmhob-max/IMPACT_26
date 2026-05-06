import Link from "next/link";
import { EmptyState, LearnerPage, PageHeader, PrimaryAction, StatusBadge } from "@/components/ui/LearnerPrimitives";
import { listPublishedCourses } from "@/lib/firebase/generated";
import { getPlatformDataConnect } from "@/lib/firebase/dataconnect";
import * as Icons from "@/components/ui/Icons";

async function getCourses() {
  try {
    const dc = getPlatformDataConnect();
    const { data } = await listPublishedCourses(dc);
    return data.courses;
  } catch {
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <LearnerPage>
      <PageHeader
        eyebrow="Course catalog"
        title="Choose a learning path"
        description="Structured modules for the IMPACT_26V.1 assessment method, followed by focused practice and formula review."
        action={<PrimaryAction href="/formulas">Open Formula Compass</PrimaryAction>}
        icon={Icons.GraduationCap}
      />

      {courses.length === 0 ? (
        <EmptyState
          title="No courses available"
          description="Courses could not be loaded or none are published yet. If you are developing locally, confirm the Data Connect service you intend to use is available."
          action={<PrimaryAction href="/admin/courses">Go to admin courses</PrimaryAction>}
          icon={Icons.Search}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {(courses as Array<{ id: string; slug: string; title: string; description?: string; thumbnailUrl?: string }>).map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#185FA5] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
            >
              {course.thumbnailUrl ? (
                <div className="aspect-[16/9] bg-slate-100">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-[#f8fbff] px-6 text-center">
                  <div className="rounded-lg border border-[#b8d7f0] bg-[#E6F1FB] p-5 text-[#185FA5]">
                    <Icons.BookOpen size={42} className="opacity-80" />
                  </div>
                </div>
              )}
              <div className="p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  <StatusBadge tone="blue">Assessment method</StatusBadge>
                  <StatusBadge tone="slate">Self-paced</StatusBadge>
                </div>
                <h2 className="text-lg font-extrabold leading-snug tracking-[-0.01em] text-slate-950 group-hover:text-[#185FA5]">
                  {course.title}
                </h2>
                {course.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{course.description}</p>
                )}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">View modules</span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-[#185FA5]">
                    Start
                    <Icons.ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </LearnerPage>
  );
}
