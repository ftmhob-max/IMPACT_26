import Link from "next/link";
import {
  EmptyState,
  LearnerPage,
  MetricCard,
  PageHeader,
  PrimaryAction,
  ProgressMeter,
  SecondaryAction,
  SectionPanel,
  StatusBadge,
  IconTile,
} from "@/components/ui/LearnerPrimitives";
import * as Icons from "@/components/ui/Icons";
import { getLearnerSession } from "@/lib/firebase/learner-session";
import { adminDcQuery } from "@/lib/firebase/admin-dc";

interface LatestAttempt {
  id: string;
  quiz: { title: string };
  scorePct: number | null;
  passed: boolean | null;
  completedAt: string | null;
}

async function getLatestAttempt(userId: string): Promise<LatestAttempt | null> {
  try {
    const data = await adminDcQuery<{ quizAttempts: LatestAttempt[] }>(
      "GetUserProgressDetails",
      { userId }
    );
    return data.quizAttempts?.[0] ?? null;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const session = await getLearnerSession();
  const latestAttempt = session ? await getLatestAttempt(session.uid) : null;

  return (
    <LearnerPage>
      <PageHeader
        eyebrow="IMPACT_26V.1"
        title="Property assessment learning"
        description="Continue the integrated method for assessment calculations, compliance, formulas, and transparent review."
        action={<PrimaryAction href="/courses">Continue learning</PrimaryAction>}
        icon={Icons.LayoutDashboard}
      />

      <div className="mb-6">
        <ContinuePanel latestAttempt={latestAttempt} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Practice exam"
          value="80"
          detail="Questions across six assessment domains"
          tone="blue"
          icon={Icons.GraduationCap}
        />
        <MetricCard
          label="Formula compass"
          value="53"
          detail="Quick-reference formulas for calculations"
          tone="green"
          icon={Icons.Compass}
        />
        <MetricCard
          label="Study level"
          value="3"
          detail="Easy, proficient, and expert practice"
          tone="amber"
          icon={Icons.TrendingUp}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.45fr_0.9fr]">
        <SectionPanel
          title="Recommended path"
          description="A simple course-style flow: learn the method, review formulas, then practice with answer rationales."
        >
          <div className="divide-y divide-slate-100">
            <LearningStep
              index="1"
              title="Start with the IMPACT_26V.1 course"
              description="Work through modules in order so appraisal, legal, administrative, and ethics topics stay connected."
              href="/courses"
              cta="View courses"
              icon={Icons.BookOpen}
            />
            <LearningStep
              index="2"
              title="Keep the Formula Compass nearby"
              description="Use the quick reference before and during practice to reinforce calculation patterns."
              href="/formulas"
              cta="Open formulas"
              icon={Icons.Calculator}
            />
            <LearningStep
              index="3"
              title="Take the practice exam"
              description="Answer, submit, and review rationales until the domain breakdown shows where to focus next."
              href="/courses"
              cta="Find exam"
              icon={Icons.Target}
            />
          </div>
        </SectionPanel>

        <SectionPanel title="Study shortcuts" description="The two fastest routes for self-study.">
          <div className="space-y-3 p-4">
            <Shortcut
              href="/courses"
              title="Course catalog"
              detail="Browse modules, lessons, and exam launch pages."
              icon={Icons.GraduationCap}
            />
            <Shortcut
              href="/formulas"
              title="Formula reference"
              detail="Search formulas by section, name, code, or expression."
              icon={Icons.Calculator}
            />
            <Shortcut
              href="/profile"
              title="My progress"
              detail={
                latestAttempt?.scorePct != null
                  ? `Last score: ${latestAttempt.scorePct.toFixed(1)}% — View full history`
                  : "Review scores and exam history when progress data is available."
              }
              icon={Icons.BarChart3}
            />
          </div>
        </SectionPanel>
      </div>

      <div className="mt-6">
        {latestAttempt ? (
          <RecentActivity attempt={latestAttempt} />
        ) : (
          <EmptyState
            title="No recent activity yet"
            description="Once you start a course or submit exam answers, this space should show the next incomplete lesson, last score, and weakest domain."
            action={<PrimaryAction href="/courses">Start a course</PrimaryAction>}
            icon={Icons.Inbox}
          />
        )}
      </div>
    </LearnerPage>
  );
}

function ContinuePanel({ latestAttempt }: { latestAttempt: LatestAttempt | null }) {
  const score = latestAttempt?.scorePct ?? null;
  const hasScore = score != null;
  return (
    <SectionPanel>
      <div className="grid gap-5 p-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <div className="flex gap-4">
          <IconTile icon={hasScore ? Icons.BarChart3 : Icons.BookOpen} tone={hasScore ? "green" : "blue"} />
          <div className="min-w-0">
            <StatusBadge tone={hasScore ? (latestAttempt?.passed ? "green" : "amber") : "blue"}>
              {hasScore ? "Recent exam activity" : "Ready to begin"}
            </StatusBadge>
            <h2 className="mt-3 text-xl font-extrabold tracking-[-0.02em] text-slate-950">
              {hasScore ? "Review your latest attempt and choose the next study move." : "Start with the course, then reinforce formulas as you practice."}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {hasScore
                ? `${latestAttempt?.quiz.title} is ready for review. Use the rationale and domain feedback to focus your next session.`
                : "The learner portal is organized around a simple loop: learn the concept, apply the formula, review the rationale, and measure readiness."}
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <PrimaryAction href={hasScore && latestAttempt ? `/quiz/${latestAttempt.id}` : "/courses"}>
                {hasScore ? "Review attempt" : "Start course"}
              </PrimaryAction>
              <SecondaryAction href="/formulas">Open Formula Compass</SecondaryAction>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-[#f8fbff] p-4">
          <ProgressMeter
            value={hasScore ? Math.round(score ?? 0) : 0}
            label={hasScore ? "Latest score" : "Course progress"}
            detail={hasScore ? `${score?.toFixed(1)}%` : "Not started"}
            tone={hasScore && latestAttempt?.passed ? "green" : "blue"}
          />
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
            <MiniMetric label="Sections" value="10" />
            <MiniMetric label="Formulas" value="53" />
          </div>
        </div>
      </div>
    </SectionPanel>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-2xl font-extrabold tracking-[-0.03em] text-[#185FA5]">{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</p>
    </div>
  );
}

function RecentActivity({ attempt }: { attempt: LatestAttempt }) {
  const scoreLabel = attempt.scorePct != null ? `${attempt.scorePct.toFixed(1)}%` : "—";
  const dateLabel = attempt.completedAt
    ? new Date(attempt.completedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <SectionPanel>
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-extrabold text-slate-900">Recent activity</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">Your most recently completed exam.</p>
      </div>
      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <IconTile icon={Icons.BarChart3} tone={attempt.passed ? "green" : "blue"} size={20} />
          <div>
            <p className="text-sm font-semibold text-slate-800">{attempt.quiz.title}</p>
            <p className="mt-0.5 text-sm text-slate-500">
              Score: <span className="font-semibold text-slate-700">{scoreLabel}</span>
              {attempt.passed != null && (
                <>
                  {" · "}
                  <span
                    className={`font-semibold ${attempt.passed ? "text-green-700" : "text-red-600"}`}
                  >
                    {attempt.passed ? "Passed" : "Failed"}
                  </span>
                </>
              )}
              {dateLabel && <> · {dateLabel}</>}
            </p>
          </div>
        </div>
        <div className="flex gap-2 sm:shrink-0">
          <SecondaryAction href={`/quiz/${attempt.id}`} icon={false}>Review attempt</SecondaryAction>
          <PrimaryAction href="/courses" icon={false}>
            Take again
          </PrimaryAction>
        </div>
      </div>
    </SectionPanel>
  );
}

function LearningStep({
  index,
  title,
  description,
  href,
  cta,
  icon: Icon,
}: {
  index: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}) {
  return (
    <div className="flex gap-4 px-5 py-4">
      <IconTile icon={Icon} size={16} className="h-9 w-9" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      <Link href={href} className="self-center whitespace-nowrap text-xs font-semibold text-[#185FA5] hover:underline">
        {cta}
      </Link>
    </div>
  );
}

function Shortcut({
  href,
  title,
  detail,
  icon: Icon,
}: {
  href: string;
  title: string;
  detail: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-lg border border-slate-200 bg-[#f8fbff] px-4 py-3 transition-colors hover:border-[#185FA5] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
    >
      <Icon size={18} className="mt-0.5 text-slate-400" />
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
      </div>
    </Link>
  );
}
