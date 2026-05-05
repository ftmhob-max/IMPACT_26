import { redirect } from "next/navigation";
import Link from "next/link";
import {
  EmptyState,
  LearnerPage,
  MetricCard,
  PageHeader,
  PrimaryAction,
  SectionPanel,
} from "@/components/ui/LearnerPrimitives";
import * as Icons from "@/components/ui/Icons";
import { getLearnerSession } from "@/lib/firebase/learner-session";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { DOMAINS, type Domain } from "@/lib/utils";
import { ProfileSection } from "@/components/profile/ProfileSection";


interface AttemptResponse {
  isCorrect: boolean | null;
  pointsEarned: number | null;
  pointsPossible: number | null;
  question: { domain: string };
}

interface Attempt {
  id: string;
  quiz: { id: string; title: string; passingScore: number | null };
  scorePct: number | null;
  scoreRaw: number | null;
  scoreMax: number | null;
  passed: boolean | null;
  startedAt: string;
  completedAt: string | null;
  quizResponses_on_attempt: AttemptResponse[];
}

async function getProgressData(userId: string) {
  try {
    const data = await adminDcQuery<{ quizAttempts: Attempt[] }>(
      "GetUserProgressDetails",
      { userId }
    );
    return data.quizAttempts ?? [];
  } catch {
    return [];
  }
}

export default async function ProfilePage() {
  const session = await getLearnerSession();
  if (!session) redirect("/sign-in");

  const attempts = await getProgressData(session.uid);

  if (attempts.length === 0) {
    return (
      <LearnerPage>
        <PageHeader
          eyebrow="My progress"
          title="Performance overview"
          description="Track your scores, domain strengths, and exam history."
          icon={Icons.BarChart3}
          action={<PrimaryAction href="/courses">Find an exam</PrimaryAction>}
        />
        <ProfileSection session={session} />
        <EmptyState
          title="No exam history yet"
          description="Complete a practice exam to see your score breakdown, domain performance, and improvement over time."
          action={<PrimaryAction href="/courses">Find an exam</PrimaryAction>}
          icon={Icons.BarChart3}
        />
      </LearnerPage>
    );
  }

  // Computed metrics
  const totalAttempts = attempts.length;
  const passed = attempts.filter((a) => a.passed).length;
  const passRate = Math.round((passed / totalAttempts) * 100);
  const scores = attempts.map((a) => a.scorePct ?? 0);
  const bestScore = Math.max(...scores);
  const latestScore = scores[0] ?? 0;

  // Domain aggregate across all attempts
  const domainStats = Object.fromEntries(
    Object.keys(DOMAINS).map((key) => [key, { earned: 0, possible: 0, pct: 0 }])
  ) as Record<Domain, { earned: number; possible: number; pct: number }>;

  for (const attempt of attempts) {
    for (const r of attempt.quizResponses_on_attempt) {
      const d = r.question.domain as Domain;
      if (d in domainStats) {
        domainStats[d].earned += r.pointsEarned ?? 0;
        domainStats[d].possible += r.pointsPossible ?? 0;
      }
    }
  }
  for (const key of Object.keys(domainStats) as Domain[]) {
    const { earned, possible } = domainStats[key];
    domainStats[key].pct = possible > 0 ? Math.round((earned / possible) * 100) : 0;
  }

  return (
    <LearnerPage>
      <PageHeader
        eyebrow="My progress"
        title="Performance overview"
        description="Track your scores, domain strengths, and exam history."
        icon={Icons.BarChart3}
        action={<PrimaryAction href="/courses">Take an exam</PrimaryAction>}
      />

      <ProfileSection session={session} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Attempts"
          value={totalAttempts}
          detail="Completed exam attempts"
          tone="blue"
          icon={Icons.Target}
        />
        <MetricCard
          label="Best score"
          value={`${bestScore.toFixed(1)}%`}
          detail="Highest score across all attempts"
          tone="green"
          icon={Icons.TrendingUp}
        />
        <MetricCard
          label="Pass rate"
          value={`${passRate}%`}
          detail={`${passed} of ${totalAttempts} attempts passed`}
          tone="amber"
          icon={Icons.Check}
        />
        <MetricCard
          label="Latest"
          value={`${latestScore.toFixed(1)}%`}
          detail="Most recent attempt score"
          tone="slate"
          icon={Icons.BarChart3}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <SectionPanel
          title="Domain performance"
          description="Aggregate score across all completed attempts."
        >
          <div className="divide-y divide-slate-100 px-5 py-2">
            {(Object.entries(DOMAINS) as [Domain, typeof DOMAINS[Domain]][]).map(
              ([key, { label, color }]) => {
                const { earned, possible, pct } = domainStats[key];
                return (
                  <DomainRow
                    key={key}
                    label={label}
                    color={color}
                    earned={earned}
                    possible={possible}
                    pct={pct}
                  />
                );
              }
            )}
          </div>
        </SectionPanel>

        <SectionPanel
          title="Attempt history"
          description="Most recent attempts first."
        >
          <AttemptTable attempts={attempts} />
        </SectionPanel>
      </div>
    </LearnerPage>
  );
}

function DomainRow({
  label,
  color,
  earned,
  possible,
  pct,
}: {
  label: string;
  color: string;
  earned: number;
  possible: number;
  pct: number;
}) {
  return (
    <div className="py-3">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <span className="text-xs font-semibold tabular-nums text-slate-500">
          {possible > 0 ? (
            <>
              {earned.toFixed(1)}/{possible.toFixed(1)} pts &middot; {pct}%
            </>
          ) : (
            <span className="text-slate-400">No data</span>
          )}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function AttemptTable({ attempts }: { attempts: Attempt[] }) {
  return (
    <div className="divide-y divide-slate-50">
      {attempts.map((attempt) => (
        <div key={attempt.id} className="flex items-center gap-3 px-5 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">
              {attempt.quiz.title}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {attempt.completedAt
                ? new Date(attempt.completedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-semibold tabular-nums text-slate-700">
              {attempt.scorePct != null ? `${attempt.scorePct.toFixed(1)}%` : "—"}
            </span>
            {attempt.passed != null && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  attempt.passed
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {attempt.passed ? "Pass" : "Fail"}
              </span>
            )}
          </div>
          <Link
            href={`/quiz/${attempt.id}`}
            className="shrink-0 text-xs font-semibold text-[#185FA5] hover:underline"
          >
            Review
          </Link>
        </div>
      ))}
    </div>
  );
}
