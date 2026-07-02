import Link from "next/link";
import {
  EmptyState,
  IconTile,
  LearnerPage,
  PageHeader,
  PrimaryAction,
  SecondaryAction,
  SectionPanel,
  StatusBadge,
} from "@/components/ui/LearnerPrimitives";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { getLearnerSession } from "@/lib/firebase/learner-session";
import { getDevPublishedCourses } from "@/lib/dev-content";
import { ensureDevDataSeeded } from "@/lib/dev-seed";
import { isDevelopmentEnvironment } from "@/lib/dev-gate";
import * as Icons from "@/components/ui/Icons";

async function getCourses() {
  try {
    type CoursesData = {
      courses: Array<{ id: string; slug: string; title: string; description?: string | null; thumbnailUrl?: string | null }>;
    };

    if (isDevelopmentEnvironment()) {
      await ensureDevDataSeeded().catch(() => null);
    }

    let data = await adminDcQuery<CoursesData>("ListPublishedCourses");
    if (data.courses.length === 0 && isDevelopmentEnvironment()) {
      data = await adminDcQuery<CoursesData>("ListPublishedCourses").catch((): CoursesData => ({ courses: [] }));
      if (data.courses.length > 0) return data.courses;
      return getDevPublishedCourses();
    }
    return data.courses;
  } catch {
    return isDevelopmentEnvironment() ? getDevPublishedCourses() : [];
  }
}

interface LatestAttempt {
  id: string;
  quiz: { title: string };
  scorePct: number | null;
  passed: boolean | null;
}

async function getLatestAttempt(userId: string): Promise<LatestAttempt | null> {
  try {
    const data = await adminDcQuery<{ quizAttempts: LatestAttempt[] }>("GetUserProgressDetails", { userId });
    return data.quizAttempts?.[0] ?? null;
  } catch {
    return null;
  }
}

export default async function CoursesPage() {
  const session = await getLearnerSession();
  const [courses, latestAttempt] = await Promise.all([
    getCourses(),
    session ? getLatestAttempt(session.uid) : Promise.resolve(null),
  ]);
  const firstCourse = courses[0] as { slug: string } | undefined;

  return (
    <LearnerPage>
      <PageHeader
        eyebrow="Evaluator academy"
        title="Choose a property assessment path"
        description="Train through Philadelphia-specific scenarios, source-backed lessons, Formula Compass labs, appeal evidence reviews, and competency checkpoints."
        action={<PrimaryAction href="/formulas">Open Formula Compass</PrimaryAction>}
        icon={Icons.GraduationCap}
      />

      {courses.length === 0 ? (
        <EmptyState
          title="No courses available"
          description="Courses could not be loaded or none are published yet. If you are developing locally, confirm the Data Connect service you intend to use is available."
          action={<PrimaryAction href="/formulas">Review formulas</PrimaryAction>}
          icon={Icons.Search}
        />
      ) : (
        <>
          <CatalogGuide count={courses.length} />
          <PlacementPanel latestAttempt={latestAttempt} firstCourseSlug={firstCourse?.slug ?? null} />

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {(courses as Array<{ id: string; slug: string; title: string; description?: string; thumbnailUrl?: string }>).map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        </>
      )}
    </LearnerPage>
  );
}

function PlacementPanel({
  latestAttempt,
  firstCourseSlug,
}: {
  latestAttempt: LatestAttempt | null;
  firstCourseSlug: string | null;
}) {
  const hasAttempt = latestAttempt?.scorePct != null;
  return (
    <SectionPanel className="mt-5">
      <div className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-col gap-4 min-[420px]:flex-row">
          <IconTile icon={hasAttempt ? Icons.BarChart3 : Icons.Target} tone={hasAttempt ? "purple" : "amber"} />
          <div className="min-w-0">
            <StatusBadge tone={hasAttempt ? (latestAttempt?.passed ? "green" : "amber") : "blue"}>
              {hasAttempt ? "Adaptive recommendation" : "Placement diagnostic"}
            </StatusBadge>
            <h2 className="mt-3 text-lg font-extrabold tracking-[-0.01em] text-slate-950">
              {hasAttempt ? "Use your latest attempt to choose the next competency." : "Start with a short evaluator placement check."}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {hasAttempt
                ? `${latestAttempt?.quiz.title ?? "Your latest attempt"} is available for review. Use the competency dashboard to decide whether to revisit appeals, valuation, data quality, or formulas next.`
                : "The academy begins with a short scenario diagnostic covering taxpayer triage, income approach, and property data. It creates the first signal for your competency dashboard."}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
          <PrimaryAction href={hasAttempt ? "/progress" : firstCourseSlug ? `/courses/${firstCourseSlug}` : "/courses"}>
            {hasAttempt ? "Review competencies" : "Begin placement"}
          </PrimaryAction>
          <SecondaryAction href="/formulas">Open Formula Compass</SecondaryAction>
        </div>
      </div>
    </SectionPanel>
  );
}

function CatalogGuide({ count }: { count: number }) {
  return (
    <SectionPanel>
      <div className="grid gap-4 p-5 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <div className="flex flex-col gap-4 min-[420px]:flex-row">
          <IconTile icon={Icons.Target} tone="green" />
          <div>
            <StatusBadge tone="green">{count} active path{count === 1 ? "" : "s"}</StatusBadge>
            <h2 className="mt-3 text-xl font-extrabold tracking-[-0.02em] text-slate-950">
              Use the academy as your evaluator map.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Open a path, inspect each case file, keep Formula Compass nearby, and use rationales and rubrics to decide what to review next.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
          <GuideStep label="1" title="Learn" detail="Build the local workflow." />
          <GuideStep label="2" title="Inspect" detail="Review parcel evidence." />
          <GuideStep label="3" title="Defend" detail="Document the decision." />
        </div>
      </div>
    </SectionPanel>
  );
}

function GuideStep({ label, title, detail }: { label: string; title: string; detail: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-[#fbfcfe] px-3 py-2.5">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E6F1FB] text-xs font-extrabold text-[#185FA5]">
          {label}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-slate-900">{title}</p>
          <p className="text-xs leading-5 text-slate-500">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function CourseCard({
  course,
  index,
}: {
  course: { slug: string; title: string; description?: string; thumbnailUrl?: string };
  index: number;
}) {
  const progressWidth = index === 0 ? "w-[68%]" : index === 1 ? "w-[42%]" : "w-[24%]";
  const focus = index === 0 ? "Foundation path" : index === 1 ? "Case practice" : "Readiness review";

  return (
    <Link
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
        <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#f8fbff_0%,#eef6ff_56%,#f5fbf7_100%)] px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="rounded-lg border border-[#b8d7f0] bg-white/80 p-3 text-[#185FA5] shadow-sm">
              <Icons.BookOpen size={30} />
            </div>
            <StatusBadge tone="blue">Self-paced</StatusBadge>
          </div>
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
              <span>{focus}</span>
              <span>Start ready</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white shadow-inner">
              <div className={`h-full rounded-full bg-[#67c58e] ${progressWidth}`} />
            </div>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <StatusBadge tone="blue">Philadelphia scenarios</StatusBadge>
          <StatusBadge tone="slate">Rubric review</StatusBadge>
        </div>
        <h2 className="text-lg font-extrabold leading-snug tracking-[-0.01em] text-slate-950 group-hover:text-[#185FA5]">
          {course.title}
        </h2>
        {course.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{course.description}</p>
        )}
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
          <CourseSignal label="Cases" value="Evidence" />
          <CourseSignal label="Formula" value="Compass" />
          <CourseSignal label="Review" value="Rubric" />
        </div>
        <div className="mt-5 flex items-center justify-between rounded-lg border border-[#b8d7f0] bg-[#f8fbff] px-3 py-2.5">
          <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">View modules</span>
          <div className="flex items-center gap-1.5 text-sm font-bold text-[#185FA5]">
            Start
            <Icons.ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function CourseSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md bg-slate-50 px-2.5 py-2">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500">{label}</p>
      <p className="mt-1 truncate text-xs font-bold text-slate-800">{value}</p>
    </div>
  );
}
