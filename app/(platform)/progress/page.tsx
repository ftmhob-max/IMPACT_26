// Front-end learner progress page: app/(platform)/progress/page.tsx

import { redirect } from "next/navigation";
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
} from "@/components/ui/LearnerPrimitives";
import * as Icons from "@/components/ui/Icons";
import { getLearnerSession } from "@/lib/firebase/learner-session";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { DEV_FORMULA_SECTIONS } from "@/lib/dev-content";
import { listUserFavorites } from "@/lib/firebase/favorites";
import { dedupeFormulaSections } from "@/lib/utils";
import { DOMAINS, type Domain } from "@/lib/utils";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { LessonNotesPanel } from "@/components/profile/LessonNotesPanel";
import { StudyMomentum } from "@/components/platform/StudyMomentum";
import { getCourseCertificateEligibility } from "@/lib/firebase/certificates";
import { getLearnerCatalog } from "@/lib/firebase/learner-portal";
import { getStudyRhythm } from "@/lib/firebase/study-rhythm";

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

interface FavoriteFormula {
  id: string;
  code: string;
  name: string;
  expression: string;
}

interface FavoriteGlossaryTerm {
  id: string;
  term: string;
  definition: string;
  domain?: string | null;
}

async function getProgressData(userId: string) {
  try {
    const data = await adminDcQuery<{ quizAttempts: Attempt[] }>("GetUserProgressDetails", { userId });
    return (data.quizAttempts ?? []).map((attempt) => ({
      ...attempt,
      quiz: {
        id: attempt.quiz?.id ?? attempt.id,
        title: attempt.quiz?.title ?? "Untitled quiz",
        passingScore: attempt.quiz?.passingScore ?? null,
      },
      startedAt: attempt.startedAt ?? "",
      completedAt: attempt.completedAt ?? null,
      quizResponses_on_attempt: attempt.quizResponses_on_attempt ?? [],
    }));
  } catch {
    return [];
  }
}

async function getFavoriteFormulas(userId: string): Promise<FavoriteFormula[]> {
  const favorites = await listUserFavorites(userId, "formula");
  if (favorites.length === 0) return [];
  const developmentFormulaSections =
    process.env.NODE_ENV === "development" ? DEV_FORMULA_SECTIONS : [];

  try {
    const data = await adminDcQuery<{
      formulaSections: Array<{
        id: string;
        code: string;
        title: string;
        position: number;
        formulas_on_section: Array<{
          id: string;
          code: string;
          name: string;
          expression: string;
        }>;
      }>;
    }>("GetFormulaSections");

    const formulas = (
      data.formulaSections.length > 0
        ? dedupeFormulaSections(
            data.formulaSections.map((section) => ({
              id: section.id,
              code: section.code,
              title: section.title,
              position: section.position,
              formulas: section.formulas_on_section,
            }))
          ).map((section) => ({ formulas_on_section: section.formulas }))
        : developmentFormulaSections.map((section) => ({
            formulas_on_section: section.formulas,
          }))
    ).flatMap((section) => section.formulas_on_section);

    const favoriteIds = new Set(favorites.map((favorite) => favorite.itemId));

    return formulas
      .filter((formula) => favoriteIds.has(formula.id))
      .map((formula) => ({
        id: formula.id,
        code: formula.code,
        name: formula.name,
        expression: formula.expression,
      }));
  } catch {
    if (process.env.NODE_ENV !== "development") return [];
    const favoriteIds = new Set(favorites.map((favorite) => favorite.itemId));
    return DEV_FORMULA_SECTIONS.flatMap((section) => section.formulas)
      .filter((formula) => favoriteIds.has(formula.id))
      .map((formula) => ({
        id: formula.id,
        code: formula.code,
        name: formula.name,
        expression: formula.expression,
      }));
  }
}

async function getFavoriteGlossaryTerms(userId: string): Promise<FavoriteGlossaryTerm[]> {
  const favorites = await listUserFavorites(userId, "glossary");
  if (favorites.length === 0) return [];

  try {
    const data = await adminDcQuery<{
      glossaryTerms: Array<{
        id: string;
        term: string;
        definition: string;
        domain?: string | null;
      }>;
    }>("ListPublishedGlossaryTerms");

    const favoriteIds = new Set(favorites.map((favorite) => favorite.itemId));

    return (data.glossaryTerms ?? [])
      .filter((term) => favoriteIds.has(term.id))
      .map((term) => ({
        id: term.id,
        term: term.term,
        definition: term.definition,
        domain: term.domain ?? null,
      }));
  } catch {
    return [];
  }
}

export default async function ProfilePage() {
  const session = await getLearnerSession();
  if (!session) redirect("/sign-in");

  const [attempts, favoriteFormulas, favoriteGlossaryTerms, studyRhythm, catalog] = await Promise.all([
    getProgressData(session.uid),
    getFavoriteFormulas(session.uid),
    getFavoriteGlossaryTerms(session.uid),
    getStudyRhythm(session.uid).catch(() => null),
    getLearnerCatalog(session.uid).catch(() => []),
  ]);
  const certificateResults = await Promise.all(
    catalog.map((course) => getCourseCertificateEligibility(session.uid, course.slug)),
  );
  const earnedCertificates = certificateResults.flatMap((result) =>
    result.course && result.eligibility?.eligible
      ? [{ course: result.course, issueDate: result.eligibility.issueDate }]
      : [],
  );

  const totalAttempts = attempts.length;
  const passed = attempts.filter((attempt) => attempt.passed).length;
  const passRate = totalAttempts > 0 ? Math.round((passed / totalAttempts) * 100) : 0;
  const scoredAttempts = attempts.filter((attempt) => attempt.scorePct != null);
  const bestScore = scoredAttempts.length > 0 ? Math.max(...scoredAttempts.map((attempt) => attempt.scorePct ?? 0)) : 0;
  const latestScore = scoredAttempts[0]?.scorePct ?? 0;
  const latestAttempt = attempts[0] ?? null;

  const domainStats = Object.fromEntries(
    Object.keys(DOMAINS).map((key) => [key, { earned: 0, possible: 0, pct: 0 }])
  ) as Record<Domain, { earned: number; possible: number; pct: number }>;

  for (const attempt of attempts) {
    for (const response of attempt.quizResponses_on_attempt ?? []) {
      const domain = response.question.domain as Domain;
      if (domain in domainStats) {
        domainStats[domain].earned += response.pointsEarned ?? 0;
        domainStats[domain].possible += response.pointsPossible ?? 0;
      }
    }
  }

  for (const key of Object.keys(domainStats) as Domain[]) {
    const { earned, possible } = domainStats[key];
    domainStats[key].pct = possible > 0 ? Math.round((earned / possible) * 100) : 0;
  }

  const populatedDomains = (Object.entries(domainStats) as [Domain, { earned: number; possible: number; pct: number }][])
    .filter(([, stats]) => stats.possible > 0)
    .sort((a, b) => b[1].pct - a[1].pct);

  const strongestDomain = populatedDomains[0]
    ? { key: populatedDomains[0][0], ...DOMAINS[populatedDomains[0][0]], ...populatedDomains[0][1] }
    : null;
  const weakestDomain = populatedDomains.length > 1
    ? { key: populatedDomains[populatedDomains.length - 1][0], ...DOMAINS[populatedDomains[populatedDomains.length - 1][0]], ...populatedDomains[populatedDomains.length - 1][1] }
    : null;

  const nextAction = getNextAction({
    totalAttempts,
    weakestDomain,
    favoriteFormulasCount: favoriteFormulas.length,
    favoriteGlossaryCount: favoriteGlossaryTerms.length,
  });

  const coachingMessage = getCoachingMessage({
    totalAttempts,
    passRate,
    latestAttempt,
    strongestDomain,
    weakestDomain,
  });

  return (
    <LearnerPage>
      <PageHeader
        eyebrow="My progress"
        title="Evaluator competency dashboard"
        description="Track scenario attempts, focus the next competency, and keep formulas and glossary references close for defensible review."
        icon={Icons.BarChart3}
        action={<PrimaryAction href={nextAction.href}>{nextAction.label}</PrimaryAction>}
      />

      <ProfileSection
        session={session}
        totalAttempts={totalAttempts}
        passRate={passRate}
        savedFormulas={favoriteFormulas.length}
        savedGlossaryTerms={favoriteGlossaryTerms.length}
        strongestDomainLabel={strongestDomain?.label ?? null}
        nextAction={nextAction}
      />

      {studyRhythm ? <StudyMomentum studyRhythm={studyRhythm} /> : null}

      {earnedCertificates.length > 0 ? (
        <SectionPanel
          className="mb-6"
          title="Course certificates"
          description="Print certificates for completed learning paths."
        >
          <div className="divide-y divide-slate-100">
            {earnedCertificates.map(({ course, issueDate }) => (
              <div
                key={course.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-extrabold text-slate-900">{course.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Issued{" "}
                    {issueDate
                      ? new Date(issueDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "upon completion"}
                  </p>
                </div>
                <PrimaryAction href={`/certificates/${course.slug}`}>
                  View certificate
                </PrimaryAction>
              </div>
            ))}
          </div>
        </SectionPanel>
      ) : null}

      <ReadinessPlan
        totalAttempts={totalAttempts}
        latestAttempt={latestAttempt}
        weakestDomain={weakestDomain}
        strongestDomain={strongestDomain}
        nextAction={nextAction}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Attempts"
          value={totalAttempts}
          detail="Completed scenario or quiz attempts"
          tone="blue"
          icon={Icons.Target}
        />
        <MetricCard
          label="Best score"
          value={totalAttempts ? `${bestScore.toFixed(1)}%` : "—"}
          detail="Highest score across all attempts"
          tone="green"
          icon={Icons.TrendingUp}
        />
        <MetricCard
          label="Pass rate"
          value={totalAttempts ? `${passRate}%` : "—"}
          detail={`${passed} of ${totalAttempts} attempts passed`}
          tone="amber"
          icon={Icons.Check}
        />
        <MetricCard
          label="Latest"
          value={totalAttempts ? `${latestScore.toFixed(1)}%` : "—"}
          detail="Most recent attempt score"
          tone="slate"
          icon={Icons.BarChart3}
        />
        <MetricCard
          label={weakestDomain ? "Focus area" : "Strongest domain"}
          value={weakestDomain ? weakestDomain.label : strongestDomain?.label ?? "Build history"}
          detail={
            weakestDomain
              ? `${weakestDomain.pct}% aggregate performance`
              : strongestDomain
                ? `${strongestDomain.pct}% aggregate performance`
                : "Complete a scenario to unlock competency insight"
          }
          tone={weakestDomain ? "red" : "purple"}
          icon={weakestDomain ? Icons.AlertCircle : Icons.Award}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionPanel title="Training guidance" description="A quick read on which evaluator competency to work next.">
          <StudyGuidance
            message={coachingMessage}
            nextAction={nextAction}
            weakestDomain={weakestDomain}
            strongestDomain={strongestDomain}
            latestAttempt={latestAttempt}
          />
        </SectionPanel>

        <SectionPanel
          title="Domain performance"
          description="Aggregate score across all completed attempts."
        >
          {populatedDomains.length === 0 ? (
            <EmptyDomainState />
          ) : (
            <div className="divide-y divide-slate-100 px-5 py-2">
              {(Object.entries(DOMAINS) as [Domain, typeof DOMAINS[Domain]][]).map(([key, { label, color }]) => {
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
              })}
            </div>
          )}
        </SectionPanel>
      </div>

      <div className="mt-6">
        <SectionPanel title="Attempt history" description="Most recent attempts first.">
          {attempts.length === 0 ? (
            <EmptyState
              title="No scenario history yet"
              description="Complete a scenario checkpoint or practice quiz to see competency performance and improvement over time."
              action={<PrimaryAction href="/courses">Find training</PrimaryAction>}
              icon={Icons.BarChart3}
            />
          ) : (
            <AttemptTable attempts={attempts} />
          )}
        </SectionPanel>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SectionPanel
          title="Saved formulas"
          description="Quick access to the formulas you want close at hand."
          className="h-full"
        >
          <SavedFormulasList formulas={favoriteFormulas} />
        </SectionPanel>
        <SectionPanel
          title="Saved glossary terms"
          description="Definitions and terms you’ve bookmarked for review."
          className="h-full"
        >
          <SavedGlossaryList terms={favoriteGlossaryTerms} />
        </SectionPanel>
      </div>

      <div className="mt-6">
        <SectionPanel
          title="Lesson notes"
          description="Notes from your lessons — edit them here or while studying."
        >
          <LessonNotesPanel />
        </SectionPanel>
      </div>
    </LearnerPage>
  );
}

function ReadinessPlan({
  totalAttempts,
  latestAttempt,
  weakestDomain,
  strongestDomain,
  nextAction,
}: {
  totalAttempts: number;
  latestAttempt: Attempt | null;
  weakestDomain: ({ label: string; pct: number } & Record<string, unknown>) | null;
  strongestDomain: ({ label: string; pct: number } & Record<string, unknown>) | null;
  nextAction: { href: string; label: string; detail: string };
}) {
  const hasBaseline = totalAttempts > 0;
  const plan = [
    {
      label: "Baseline",
      title: hasBaseline ? "Use your latest attempt" : "Create your first baseline",
      detail: hasBaseline
        ? `${latestAttempt?.quiz.title ?? "Latest attempt"} gives this page its current signal.`
        : "Take one scored attempt so strengths and gaps become visible.",
      icon: Icons.Target,
      tone: "blue" as const,
    },
    {
      label: "Focus",
      title: weakestDomain ? weakestDomain.label : "No weak domain yet",
      detail: weakestDomain
        ? `${weakestDomain.pct}% aggregate performance. Review this before the next attempt.`
        : "Domain-level guidance appears after scored responses.",
      icon: Icons.AlertCircle,
      tone: "amber" as const,
    },
    {
      label: "Reinforce",
      title: strongestDomain ? strongestDomain.label : "Build a strength",
      detail: strongestDomain
        ? `${strongestDomain.pct}% aggregate performance. Keep this pattern consistent.`
        : "Save formulas and glossary terms while you study.",
      icon: Icons.Award,
      tone: "green" as const,
    },
    {
      label: "Next",
      title: nextAction.label,
      detail: nextAction.detail,
      icon: Icons.ArrowRight,
      tone: "purple" as const,
    },
  ];

  return (
    <SectionPanel className="mb-6">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-extrabold text-slate-900">Readiness plan</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          A simple loop for turning score history into the next study session.
        </p>
      </div>
      <div className="grid gap-px bg-slate-100 sm:grid-cols-2 xl:grid-cols-4">
        {plan.map((item) => (
          <div key={item.label} className="bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-[#f8fbff] text-[#185FA5]">
                <item.icon size={18} />
              </div>
              <div className="min-w-0">
                <StatusBadge tone={item.tone} className="px-2 py-0.5 text-[10px]">
                  {item.label}
                </StatusBadge>
                <p className="mt-2 text-sm font-extrabold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionPanel>
  );
}

function getNextAction({
  totalAttempts,
  weakestDomain,
  favoriteFormulasCount,
  favoriteGlossaryCount,
}: {
  totalAttempts: number;
  weakestDomain: ({ key: Domain; label: string } & { pct: number }) | null;
  favoriteFormulasCount: number;
  favoriteGlossaryCount: number;
}) {
  if (totalAttempts === 0) {
    return {
      href: "/courses",
      label: "Start your first scenario",
      detail: "Start a course checkpoint to generate a real competency baseline.",
    };
  }

  if (weakestDomain?.key === "math" || weakestDomain?.key === "income_approach" || weakestDomain?.key === "ratio_studies" || favoriteFormulasCount === 0) {
    return {
      href: "/formulas",
      label: "Review formulas",
      detail: "Reinforce calculation patterns before the next attempt.",
    };
  }

  if (favoriteGlossaryCount === 0) {
    return {
      href: "/glossary",
      label: "Review glossary",
      detail: "Tighten up terminology and definitions in weaker knowledge areas.",
    };
  }

  return {
    href: "/courses",
    label: "Continue studying",
    detail: "Return to the academy catalog and keep building confidence across evaluator competencies.",
  };
}

function getCoachingMessage({
  totalAttempts,
  passRate,
  latestAttempt,
  strongestDomain,
  weakestDomain,
}: {
  totalAttempts: number;
  passRate: number;
  latestAttempt: Attempt | null;
  strongestDomain: ({ label: string; pct: number } & Record<string, unknown>) | null;
  weakestDomain: ({ label: string; pct: number } & Record<string, unknown>) | null;
}) {
  if (totalAttempts === 0) {
    return "You have not established a baseline yet. Start with a scenario checkpoint, then use this page to spot the competencies that deserve more review.";
  }

  if (weakestDomain && strongestDomain) {
    return `Your strongest area is ${strongestDomain.label} at ${strongestDomain.pct}%, while ${weakestDomain.label} is the best place to focus next at ${weakestDomain.pct}%.`;
  }

  if (latestAttempt?.passed && passRate >= 70) {
    return "Your recent history shows steady progress. Keep momentum by reviewing the last attempt and then taking another timed practice run.";
  }

  return "You have usable progress data now. Review the latest scenario, reinforce the weak spots, and then return for another applied attempt.";
}

function StudyGuidance({
  message,
  nextAction,
  weakestDomain,
  strongestDomain,
  latestAttempt,
}: {
  message: string;
  nextAction: { href: string; label: string; detail: string };
  weakestDomain: ({ label: string; pct: number } & Record<string, unknown>) | null;
  strongestDomain: ({ label: string; pct: number } & Record<string, unknown>) | null;
  latestAttempt: Attempt | null;
}) {
  return (
    <div className="space-y-4 p-5">
      <StatusBadge tone={weakestDomain ? "amber" : "blue"}>
        {weakestDomain ? "Recommended focus" : "Next study move"}
      </StatusBadge>
      <p className="text-sm leading-6 text-slate-600">{message}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <GuidanceTile
          label="Next step"
          title={nextAction.label}
          detail={nextAction.detail}
          icon={Icons.ArrowRight}
        />
        <GuidanceTile
          label="Latest attempt"
          title={latestAttempt?.quiz.title ?? "No attempts yet"}
          detail={
            latestAttempt?.scorePct != null
              ? `${latestAttempt.scorePct.toFixed(1)}% ${latestAttempt.passed ? "passed" : "completed"}`
              : "Your next completed exam will appear here."
          }
          icon={Icons.History}
        />
      </div>

      {(strongestDomain || weakestDomain) && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <InsightPill
              label="Strongest"
              value={strongestDomain ? `${strongestDomain.label} (${strongestDomain.pct}%)` : "Not enough data"}
              tone="green"
            />
            <InsightPill
              label="Needs work"
              value={weakestDomain ? `${weakestDomain.label} (${weakestDomain.pct}%)` : "Not enough data"}
              tone="amber"
            />
          </div>
        </div>
      )}

      <PrimaryAction href={nextAction.href}>{nextAction.label}</PrimaryAction>
    </div>
  );
}

function GuidanceTile({
  label,
  title,
  detail,
  icon: Icon,
}: {
  label: string;
  title: string;
  detail: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</p>
        <Icon size={16} className="text-[#185FA5]" />
      </div>
      <p className="mt-2 text-sm font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{detail}</p>
    </div>
  );
}

function InsightPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "green" | "amber";
}) {
  const toneClasses = tone === "green"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-amber-50 text-amber-800 border-amber-200";

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClasses}`}>
      <p className="text-[11px] font-bold uppercase tracking-[0.08em]">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function EmptyDomainState() {
  return (
    <div className="px-5 py-8">
      <p className="text-sm font-semibold text-slate-800">No domain breakdown yet</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">
        Once you complete a scored attempt, competency performance bars will show where you are strongest and where to spend more time.
      </p>
    </div>
  );
}

function SavedFormulasList({ formulas }: { formulas: FavoriteFormula[] }) {
  if (formulas.length === 0) {
    return (
      <div className="px-5 py-8">
        <p className="text-sm text-slate-500">No formulas saved yet.</p>
        <div className="mt-4">
          <SecondaryAction href="/formulas">Open Formula Compass</SecondaryAction>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {formulas.map((formula) => (
        <div key={formula.id} className="px-5 py-4">
          <p className="font-mono text-xs font-semibold text-[#185FA5]">{formula.code}</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{formula.name}</p>
          <p className="mt-2 rounded-md border border-[#b8d7f0] bg-[#f8fbff] px-3 py-2 font-calc text-[12px] text-slate-800">
            {formula.expression}
          </p>
        </div>
      ))}
      <div className="px-5 py-4">
        <SecondaryAction href="/formulas">Open Formula Compass</SecondaryAction>
      </div>
    </div>
  );
}

function SavedGlossaryList({ terms }: { terms: FavoriteGlossaryTerm[] }) {
  if (terms.length === 0) {
    return (
      <div className="px-5 py-8">
        <p className="text-sm text-slate-500">No glossary terms saved yet.</p>
        <div className="mt-4">
          <SecondaryAction href="/glossary">Open Glossary</SecondaryAction>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {terms.map((term) => (
        <div key={term.id} className="px-5 py-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">{term.term}</p>
            {term.domain && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold capitalize text-slate-500">
                {term.domain}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">{term.definition}</p>
        </div>
      ))}
      <div className="px-5 py-4">
        <SecondaryAction href="/glossary">Open Glossary</SecondaryAction>
      </div>
    </div>
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
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
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
      <ProgressMeter value={pct} />
    </div>
  );
}

function AttemptTable({ attempts }: { attempts: Attempt[] }) {
  return (
    <div className="divide-y divide-slate-50">
      {attempts.map((attempt) => (
        <div key={attempt.id} className="flex items-center gap-3 px-5 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">{attempt.quiz.title}</p>
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
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-sm font-semibold tabular-nums text-slate-700">
              {attempt.scorePct != null ? `${attempt.scorePct.toFixed(1)}%` : "—"}
            </span>
            {attempt.passed != null && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  attempt.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {attempt.passed ? "Pass" : "Fail"}
              </span>
            )}
          </div>
          <Link href={`/quiz/${attempt.id}/review`} className="shrink-0 text-xs font-semibold text-[#185FA5] hover:underline">
            Review
          </Link>
        </div>
      ))}
    </div>
  );
}
