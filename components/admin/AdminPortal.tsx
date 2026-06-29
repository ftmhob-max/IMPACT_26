"use client";

// components/admin/AdminPortal.tsx — Teacher Portal dashboard (front-end)

import { useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin/client-fetch";
import { emptyAdminOverview, type AdminOverview } from "@/lib/admin/overview";
import * as Icons from "@/components/ui/Icons";

type NoticeTone = "success" | "error";

type NoticeState = {
  title: string;
  message: string;
  tone: NoticeTone;
};

export function AdminPortal({ initialOverview }: { initialOverview?: AdminOverview }) {
  const [overview, setOverview] = useState<AdminOverview>(initialOverview ?? emptyAdminOverview);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<NoticeState | null>(null);

  async function refresh() {
    setLoading(true);
    const res = await adminFetch("/api/admin/overview", { cache: "no-store" });
    if (res.ok) {
      setOverview(await res.json());
      setNotice(null);
    } else if (
      overview.questions.length === 0 &&
      overview.courses.length === 0 &&
      overview.quizzes.length === 0
    ) {
      setNotice({
        title: "Refresh unavailable",
        message: "Unable to refresh admin overview data.",
        tone: "error",
      });
    }
    setLoading(false);
  }

  const stats = useMemo(() => {
    const completed = overview.attempts.length;
    const passRate = completed
      ? Math.round((overview.attempts.filter((attempt) => attempt.passed).length / completed) * 100)
      : 0;
    const avgScore = completed
      ? Math.round(
          overview.attempts.reduce((sum, attempt) => sum + Number(attempt.scorePct ?? 0), 0) / completed
        )
      : 0;
    const publishedCourses = overview.courses.filter((course) => course.isPublished).length;
    const draftCourses = overview.courses.length - publishedCourses;
    const parsedMaterials = overview.materials.filter((material) => material.status === "parsed").length;
    const ingestionQueue = Math.max(overview.materials.length - parsedMaterials, 0);
    const staffUsers = overview.users.filter(
      (user) => user.role === "admin" || user.role === "instructor"
    ).length;
    const quizzesNeedingWork =
      overview.quizTotals.attention + overview.quizTotals.empty;
    const materialsHref =
      ingestionQueue > 0 ? "/admin/materials?view=queue" : "/admin/materials";

    return {
      completed,
      passRate,
      avgScore,
      publishedCourses,
      draftCourses,
      parsedMaterials,
      ingestionQueue,
      staffUsers,
      quizzesNeedingWork,
      materialsHref,
    };
  }, [overview]);

  const recentMaterials = useMemo(() => overview.materials.slice(0, 5), [overview.materials]);

  const recommendedNextMove = useMemo(() => {
    if (stats.ingestionQueue > 0) {
      return "Review source material queue so new content can move into lesson planning.";
    }
    if (stats.quizzesNeedingWork > 0) {
      return "Assign or fix questions on quizzes flagged as empty or needing attention.";
    }
    if (stats.draftCourses > 0) {
      return "Publish or extend draft courses to keep the learner catalog growing.";
    }
    return "Assessment content is in a healthy state. Shift attention to learner performance trends.";
  }, [stats.draftCourses, stats.ingestionQueue, stats.quizzesNeedingWork]);

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 text-slate-900 sm:px-6 sm:py-8">
      <section className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm">
        <div className="admin-dashboard-hero border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(24,95,165,0.14),_transparent_34%),linear-gradient(135deg,#f8fbff_0%,#ffffff_44%,#f7f4ec_100%)] px-5 py-6 sm:px-6 lg:px-7">
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#185FA5] text-white shadow-sm">
                  <Icons.ShieldCheck size={22} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#185FA5]">
                    Teacher Portal
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-slate-900">Dashboard</h1>
                  <p className="mt-1 max-w-2xl text-sm text-slate-500">
                    Monitor learner outcomes, move curriculum work forward, and keep assessment content flowing.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  className="admin-action secondary flex items-center gap-2"
                  href="/api/admin/analytics/export?kind=attempts"
                >
                  <Icons.LogOut size={16} className="-rotate-90" />
                  Export attempts
                </a>
                <button className="admin-action secondary flex items-center gap-2" type="button" onClick={refresh}>
                  <Icons.RotateCcw size={16} />
                  Refresh overview
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <HeroCallout
                eyebrow="Operational health"
                title={
                  stats.ingestionQueue > 0
                    ? `${stats.ingestionQueue} materials need review`
                    : "Material pipeline clear"
                }
                description={
                  stats.ingestionQueue > 0
                    ? "Recent uploads still need parsing or follow-up before they can support lesson generation."
                    : "All recent source materials have reached a parsed state."
                }
                icon={stats.ingestionQueue > 0 ? Icons.AlertCircle : Icons.Check}
                tone={stats.ingestionQueue > 0 ? "amber" : "green"}
                href={stats.materialsHref}
              />
              {stats.quizzesNeedingWork > 0 ? (
                <HeroCallout
                  eyebrow="Quizzes"
                  title={`${stats.quizzesNeedingWork} ${stats.quizzesNeedingWork === 1 ? "quiz needs" : "quizzes need"} questions`}
                  description="Empty or incomplete quizzes should be filled before learners take them."
                  icon={Icons.ClipboardList}
                  tone="amber"
                  href="/admin/quizzes"
                />
              ) : (
                <HeroCallout
                  eyebrow="Coverage"
                  title={`${stats.draftCourses} draft ${stats.draftCourses === 1 ? "course" : "courses"}`}
                  description="Use quick links below to publish new content or add lessons to active programs."
                  icon={Icons.GraduationCap}
                  tone="blue"
                  href="/admin/courses"
                />
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-t border-slate-100 px-5 py-4 sm:grid-cols-2 xl:grid-cols-6">
          <Metric
            label="Questions"
            value={overview.questions.length}
            detail="Banked assessment items"
            icon={Icons.FileText}
            href="/admin/questions"
          />
          <Metric
            label="Published courses"
            value={stats.publishedCourses}
            detail={`${overview.courses.length} total courses`}
            icon={Icons.GraduationCap}
            href="/admin/courses"
          />
          <Metric
            label="Pass rate"
            value={`${stats.passRate}%`}
            detail={`${stats.completed} completed attempts`}
            icon={Icons.Target}
            href="/admin/cohorts"
          />
          <Metric
            label="Avg score"
            value={`${stats.avgScore}%`}
            detail="Across completed attempts"
            icon={Icons.BarChart3}
            href="/admin/cohorts"
          />
          <Metric
            label="Materials queued"
            value={stats.ingestionQueue}
            detail={`${stats.parsedMaterials} parsed ready`}
            icon={Icons.Database}
            href={stats.materialsHref}
          />
          <Metric
            label="Staff"
            value={stats.staffUsers}
            detail={`${overview.users.length} active users`}
            icon={Icons.Users}
            href="/admin/users"
          />
        </div>
      </section>

      {notice && (
        <div
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            notice.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          {notice.tone === "success" ? <Icons.Check size={18} /> : <Icons.AlertCircle size={18} />}
          <div>
            <p className="font-semibold">{notice.title}</p>
            <p className="text-sm/6">{notice.message}</p>
          </div>
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel
          title="Quick links"
          icon={Icons.LayoutDashboard}
          action={<span className="text-xs text-slate-500">Primary actions and workspaces</span>}
        >
          <div className="grid gap-3 md:grid-cols-3">
            <QuickActionCard
              href="/admin/courses"
              title="Create course or lesson"
              description="Open the curriculum editor for course, module, and lesson work."
              icon={Icons.GraduationCap}
            />
            <QuickActionCard
              href="/admin/materials"
              title="Ingest source material"
              description="Upload transcripts, docs, and references in the materials workspace."
              icon={Icons.Upload}
            />
            <QuickActionCard
              href="/admin/questions"
              title="Build assessments"
              description="Manage question-bank items before assigning them to quizzes."
              icon={Icons.ClipboardList}
            />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <WorkspaceJump
              href="/admin/courses"
              title="Curriculum"
              description="Course structure, lessons, and publish readiness."
            />
            <WorkspaceJump
              href="/admin/materials"
              title="Materials"
              description="Upload, parse, and attach source material."
            />
            <WorkspaceJump
              href="/admin/questions"
              title="Question bank"
              description="Review, filter, import, and maintain items."
            />
            <WorkspaceJump
              href="/admin/quizzes"
              title="Quizzes editor"
              description="Build quizzes and manage settings."
            />
            <WorkspaceJump
              href="/admin/formulas"
              title="Formula Compass"
              description="Formula sections and calculator configs."
            />
            <WorkspaceJump
              href="/admin/glossary"
              title="Glossary editor"
              description="Terms students browse and annotate."
            />
            <WorkspaceJump
              href="/admin/cohorts"
              title="Cohort stats"
              description="Learner performance and attempt trends."
            />
            <WorkspaceJump
              href="/admin/users"
              title="Users and roles"
              description="Teacher, admin, viewer, and learner access."
            />
          </div>
        </Panel>

        <Panel
          title="Operational snapshot"
          icon={Icons.BarChart3}
          action={<span className="text-xs text-slate-500">{loading ? "Refreshing..." : "Live overview"}</span>}
        >
          <div className="grid gap-3 md:grid-cols-3">
            <SnapshotCard
              label="Attempts"
              value={stats.completed}
              detail={stats.completed ? `${stats.passRate}% pass rate` : "No completions yet"}
              tone="blue"
              href="/admin/cohorts"
            />
            <SnapshotCard
              label="Materials"
              value={overview.materials.length}
              detail={
                stats.ingestionQueue > 0
                  ? `${stats.ingestionQueue} still processing`
                  : "All recent uploads parsed"
              }
              tone={stats.ingestionQueue > 0 ? "amber" : "green"}
              href={stats.materialsHref}
            />
            <SnapshotCard
              label="Users"
              value={overview.users.length}
              detail={`${stats.staffUsers} staff roles assigned`}
              tone="slate"
              href="/admin/users"
            />
          </div>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Recommended next move</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{recommendedNextMove}</p>
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel title="Recent learner attempts" icon={Icons.BarChart3} action={<ExportLinks />}>
          <AnalyticsTable attempts={overview.attempts} loading={loading} compact />
        </Panel>
        <Panel
          title="Source material queue"
          icon={Icons.Database}
          action={<span className="text-xs text-slate-500">Most recent uploads</span>}
        >
          <RecentMaterialsList materials={recentMaterials} />
        </Panel>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
  href,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  href?: string;
}) {
  const classes =
    "block cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition-colors duration-200 hover:border-[#b8d7f0] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]/40 focus-visible:ring-offset-1";

  const content = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{label}</p>
        {Icon && <Icon size={18} className="text-slate-300" />}
      </div>
      <p className="mt-2 text-2xl font-extrabold tabular-nums text-slate-950">{value}</p>
      <p className="text-xs text-slate-500">{detail}</p>
    </>
  );

  if (!href) return <div className={classes}>{content}</div>;

  return (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}

function Panel({
  title,
  action,
  icon: Icon,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-black/10 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} className="text-[#185FA5]" />}
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function HeroCallout({
  eyebrow,
  title,
  description,
  icon: Icon,
  tone,
  href,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  tone: "blue" | "green" | "amber";
  href?: string;
}) {
  const toneClasses = {
    blue: "border-sky-200 bg-sky-50 text-[#185FA5]",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
  }[tone];

  const classes = `admin-hero-callout rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm ${toneClasses}`;
  const content = (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] opacity-80">{eyebrow}</p>
        <p className="mt-1 text-base font-extrabold leading-tight text-slate-950">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </div>
  );

  if (!href) return <div className={classes}>{content}</div>;

  return (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}

function QuickActionCard({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}) {
  return (
    <a
      href={href}
      className="group admin-quick-action rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#185FA5] shadow-sm ring-1 ring-slate-100">
          <Icon size={18} />
        </div>
        <Icons.ArrowRight size={16} className="text-slate-300 transition-transform group-hover:translate-x-0.5" />
      </div>
      <p className="mt-4 text-sm font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </a>
  );
}

function SnapshotCard({
  label,
  value,
  detail,
  tone,
  href,
}: {
  label: string;
  value: string | number;
  detail: string;
  tone: "blue" | "green" | "amber" | "slate";
  href?: string;
}) {
  const toneClasses = {
    blue: "bg-sky-100 text-[#185FA5]",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-800",
    slate: "bg-slate-100 text-slate-700",
  }[tone];

  const classes =
    "block rounded-2xl border border-slate-200 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50/40";
  const content = (
    <>
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${toneClasses}`}
      >
        {label}
      </span>
      <p className="mt-3 text-2xl font-extrabold text-slate-950">{value}</p>
      <p className="text-xs text-slate-500">{detail}</p>
    </>
  );

  if (!href) return <div className={classes}>{content}</div>;

  return (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}

function RecentMaterialsList({ materials }: { materials: any[] }) {
  if (!materials.length) {
    return <p className="text-sm text-slate-500">No source materials have been uploaded yet.</p>;
  }

  return (
    <div className="space-y-3">
      {materials.map((material) => (
        <a
          key={material.id}
          href="/admin/materials"
          className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors hover:border-sky-200 hover:bg-sky-50/40"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{material.title}</p>
              <p className="truncate text-xs text-slate-500">{material.fileName}</p>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${
                material.status === "parsed"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {material.status}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

function WorkspaceJump({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-slate-200 px-4 py-3 transition-colors hover:border-sky-200 hover:bg-sky-50/40"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <Icons.ArrowRight size={15} className="text-[#185FA5]" />
      </div>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </a>
  );
}

function AnalyticsTable({
  attempts,
  loading,
  compact = false,
}: {
  attempts: any[];
  loading: boolean;
  compact?: boolean;
}) {
  if (loading) return <p className="text-sm text-slate-500">Loading analytics...</p>;
  if (!attempts.length) return <p className="text-sm text-slate-500">No learner attempts recorded yet.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.08em] text-slate-500">
            <th className="py-2 pr-3">Learner</th>
            <th className="py-2 pr-3">Quiz</th>
            <th className="py-2 pr-3">Score</th>
            <th className="py-2 pr-3">Result</th>
          </tr>
        </thead>
        <tbody>
          {attempts.slice(0, compact ? 5 : 8).map((attempt) => (
            <tr key={attempt.id} className="border-b border-slate-50">
              <td className="py-2 pr-3 text-slate-700">{attempt.user?.fullName ?? attempt.user?.email}</td>
              <td className="py-2 pr-3 text-slate-600">{attempt.quiz?.title}</td>
              <td className="py-2 pr-3 font-mono">{Number(attempt.scorePct ?? 0).toFixed(1)}%</td>
              <td className="py-2 pr-3">{attempt.passed ? "Pass" : "Review"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExportLinks() {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <a className="font-semibold text-[#185FA5]" href="/api/admin/analytics/export?kind=attempts">
        Attempts
      </a>
      <a className="font-semibold text-[#185FA5]" href="/api/admin/analytics/export?kind=questions">
        Questions
      </a>
      <a className="font-semibold text-[#185FA5]" href="/api/admin/analytics/export?kind=engagement">
        Engagement
      </a>
    </div>
  );
}
