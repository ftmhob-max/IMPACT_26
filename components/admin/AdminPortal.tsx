"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin/client-fetch";
import { DOMAINS, DIFFICULTIES } from "@/lib/utils";
import * as Icons from "@/components/ui/Icons";
import { DomainCombobox } from "@/components/admin/DomainCombobox";
import { FormulasPanel } from "@/components/admin/FormulasPanel";

type Overview = {
  questions: any[];
  courses: any[];
  quizzes: any[];
  materials: any[];
  attempts: any[];
  users: any[];
};

type NoticeTone = "success" | "error";

type NoticeState = {
  title: string;
  message: string;
  tone: NoticeTone;
};

const emptyOverview: Overview = {
  questions: [],
  courses: [],
  quizzes: [],
  materials: [],
  attempts: [],
  users: [],
};

const sampleCsv = `question_text,question_type,difficulty,domain,choices,correct_answers,explanation,rationale,source_ref,topic_tags,formula_ref,point_value
"Which USPAP standards govern mass appraisal development and reporting?",multiple_choice,proficient,law,"Standards 1 & 2|Standards 3 & 4|Standards 5 & 6|Ethics Rule only",C,"Standards 5 and 6 apply to mass appraisal.","Mass appraisal has specific USPAP development/reporting standards.","USPAP 2024-2025","USPAP|mass appraisal",,1`;

export function AdminPortal({ initialOverview = emptyOverview }: { initialOverview?: Overview }) {
  const [overview, setOverview] = useState<Overview>(initialOverview);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<NoticeState | null>(null);

  async function refresh() {
    setLoading(true);
    const res = await adminFetch("/api/admin/overview", { cache: "no-store" });
    if (res.ok) {
      setOverview(await res.json());
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

  useEffect(() => {
    refresh();
  }, []);

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
    const adminUsers = overview.users.filter((user) => user.role === "admin").length;

    return {
      completed,
      passRate,
      avgScore,
      publishedCourses,
      draftCourses,
      parsedMaterials,
      ingestionQueue,
      adminUsers,
    };
  }, [overview]);

  const recentAttempts = useMemo(() => overview.attempts.slice(0, 5), [overview.attempts]);
  const recentMaterials = useMemo(() => overview.materials.slice(0, 5), [overview.materials]);
  const recentUsers = useMemo(() => overview.users.slice(0, 6), [overview.users]);

  async function withNotice(action: () => Promise<void>, title: string, message: string) {
    setNotice(null);
    await action();
    setNotice({ title, message, tone: "success" });
    await refresh();
  }

  return (
    <div className="min-h-screen bg-[#f0efe9] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm">
          <div className="admin-dashboard-hero border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(24,95,165,0.14),_transparent_34%),linear-gradient(135deg,#f8fbff_0%,#ffffff_44%,#f7f4ec_100%)] px-5 py-6 sm:px-6 lg:px-7">
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#185FA5] text-white shadow-sm">
                    <Icons.ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#185FA5]">
                      IMPACT_26 admin
                    </p>
                    <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.02em] text-slate-950">
                      Learning operations command center
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                      Monitor learner outcomes, move curriculum work forward, and keep assessment content flowing
                      without losing the operational picture.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a className="admin-action flex items-center gap-2" href="/admin/preview/courses">
                    <Icons.Eye size={16} />
                    Student Preview
                  </a>
                  <a className="admin-action secondary flex items-center gap-2" href="/api/admin/analytics/export?kind=attempts">
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
                  title={stats.ingestionQueue > 0 ? `${stats.ingestionQueue} materials need review` : "Material pipeline clear"}
                  description={
                    stats.ingestionQueue > 0
                      ? "Recent uploads still need parsing or follow-up before they can support lesson generation."
                      : "All recent source materials have reached a parsed state."
                  }
                  icon={stats.ingestionQueue > 0 ? Icons.AlertCircle : Icons.Check}
                  tone={stats.ingestionQueue > 0 ? "amber" : "green"}
                  href={stats.ingestionQueue > 0 ? "/admin/materials" : "#materials-workspace"}
                />
                <HeroCallout
                  eyebrow="Coverage"
                  title={`${stats.draftCourses} draft ${stats.draftCourses === 1 ? "course" : "courses"}`}
                  description="Use quick actions below to publish new content or add lessons to active programs."
                  icon={Icons.GraduationCap}
                  tone="blue"
                  href="/admin/courses"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-slate-100 px-5 py-4 sm:grid-cols-2 xl:grid-cols-6">
            <Metric label="Questions" value={overview.questions.length} detail="Banked assessment items" icon={Icons.FileText} href="/admin/questions" />
            <Metric label="Published courses" value={stats.publishedCourses} detail={`${overview.courses.length} total courses`} icon={Icons.GraduationCap} href="/admin/courses" />
            <Metric label="Pass rate" value={`${stats.passRate}%`} detail={`${stats.completed} completed attempts`} icon={Icons.Target} href="/admin/cohorts" />
            <Metric label="Avg score" value={`${stats.avgScore}%`} detail="Across completed attempts" icon={Icons.BarChart3} href="/admin/cohorts" />
            <Metric label="Materials queued" value={stats.ingestionQueue} detail={`${stats.parsedMaterials} parsed ready`} icon={Icons.Database} href="/admin/materials" />
            <Metric label="Admins" value={stats.adminUsers} detail={`${overview.users.length} active users`} icon={Icons.Users} href="/admin/users" />
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
            title="Priority actions"
            icon={Icons.LayoutDashboard}
            action={<span className="text-xs text-slate-500">Fast paths into the main admin jobs</span>}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <QuickActionCard
                href="/admin/preview/courses"
                title="Preview learner experience"
                description="Check published course presentation before sending learners in."
                icon={Icons.Eye}
              />
              <QuickActionCard
                href="#content-workspace"
                title="Create course or lesson"
                description="Jump straight to curriculum drafting and publication tools."
                icon={Icons.GraduationCap}
              />
              <QuickActionCard
                href="#materials-workspace"
                title="Ingest source material"
                description="Upload transcripts, docs, and references for downstream authoring."
                icon={Icons.Upload}
              />
              <QuickActionCard
                href="#assessment-workspace"
                title="Build assessments"
                description="Import CSV questions or add manual items into the bank."
                icon={Icons.ClipboardList}
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
                href="/admin/materials"
              />
              <SnapshotCard
                label="Users"
                value={overview.users.length}
                detail={`${stats.adminUsers} admin roles assigned`}
                tone="slate"
                href="/admin/users"
              />
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Recommended next move</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {stats.ingestionQueue > 0
                  ? "Review source material queue so new content can move into lesson planning."
                  : stats.draftCourses > 0
                    ? "Publish or extend draft courses to keep the learner catalog growing."
                    : "Assessment content is in a healthy state. Shift attention to learner performance trends."}
              </p>
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

        <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <Panel
            title="Team access"
            icon={Icons.Users}
            action={<span className="text-xs text-slate-500">Admin-only mutations</span>}
          >
            <TeamSummary users={recentUsers} />
            <div className="mt-4 border-t border-slate-100 pt-4">
              <UsersTable
                users={overview.users}
                onSaved={() =>
                  withNotice(async () => {}, "Role updated", "User access levels were updated and the roster was refreshed.")
                }
              />
            </div>
          </Panel>

          <Panel
            title="Content workspace"
            icon={Icons.Settings}
            action={<span className="text-xs text-slate-500">Authoring tools stay available below</span>}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <WorkspaceJump
                href="#assessment-workspace"
                title="Assessment workspace"
                description="CSV validation, imports, and manual question building."
              />
              <WorkspaceJump
                href="#content-workspace"
                title="Curriculum workspace"
                description="Create published courses and add new instructor lessons."
              />
              <WorkspaceJump
                href="#materials-workspace"
                title="Materials workspace"
                description="Upload files and monitor parse status without leaving this page."
              />
              <WorkspaceJump
                href="#analytics-workspace"
                title="Analytics workspace"
                description="Inspect attempt-level data and export downstream reports."
              />
              <WorkspaceJump
                href="#formulas-workspace"
                title="Formula Compass editor"
                description="Add, edit, or import formula sections and calculator configs."
              />
            </div>
          </Panel>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#185FA5]">Workspace</p>
              <h2 className="text-xl font-extrabold tracking-[-0.02em] text-slate-950">Authoring and operations tools</h2>
              <p className="mt-1 text-sm text-slate-600">
                The full builders are still here when you need to execute detailed work after reviewing the command center.
              </p>
            </div>
          </div>

          <div id="assessment-workspace" className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <Panel
              title="Assessment CSV Upload"
              icon={Icons.ClipboardList}
              action={<span className="text-xs text-slate-500">Validation before publishing</span>}
            >
              <CsvWorkflow
                onComplete={(msg) =>
                  withNotice(async () => {}, "Assessment import complete", msg)
                }
              />
            </Panel>
            <Panel
              title="Manual Builder"
              icon={Icons.BookOpen}
              action={<span className="text-xs text-slate-500">Multiple choice, multiselect, scenario</span>}
            >
              <ManualQuestionForm
                quizzes={overview.quizzes}
                onSaved={() =>
                  withNotice(
                    async () => {},
                    "Question saved",
                    "The question was added to the bank and the overview data was refreshed."
                  )
                }
              />
            </Panel>
          </div>

          <div id="content-workspace" className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <Panel
              title="Content Management"
              icon={Icons.GraduationCap}
              action={<span className="text-xs text-slate-500">Draft and publish learner content</span>}
            >
              <ContentWorkflow
                courses={overview.courses}
                onSaved={() =>
                  withNotice(
                    async () => {},
                    "Content updated",
                    "Course content changes were saved and the content overview was refreshed."
                  )
                }
              />
            </Panel>
            <Panel
              title="Source Materials"
              icon={Icons.Database}
              action={<span className="text-xs text-slate-500">PDF, DOCX, CSV, transcript ingestion</span>}
            >
              <MaterialsWorkflow
                materials={overview.materials}
                onSaved={() =>
                  withNotice(
                    async () => {},
                    "Material ingested",
                    "The upload completed and the source material queue was refreshed."
                  )
                }
              />
            </Panel>
          </div>

          <div id="formulas-workspace" className="space-y-0">
            <Panel
              title="Formula Compass Editor"
              icon={Icons.Calculator}
              action={<span className="text-xs text-slate-500">Sections, formulas, and calculator configs</span>}
            >
              <FormulasPanel
                onSaved={() =>
                  withNotice(
                    async () => {},
                    "Formula library updated",
                    "Formula changes are live on the Formula Compass page."
                  )
                }
              />
            </Panel>
          </div>

          <div id="analytics-workspace" className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
            <Panel title="Analytics" icon={Icons.BarChart3} action={<ExportLinks />}>
              <AnalyticsTable attempts={overview.attempts} loading={loading} />
            </Panel>
            <Panel title="Users & Roles" icon={Icons.Users} action={<span className="text-xs text-slate-500">Full roster</span>}>
              <UsersTable
                users={overview.users}
                onSaved={() =>
                  withNotice(async () => {}, "User role updated", "User role changes were applied successfully.")
                }
              />
            </Panel>
          </div>
        </section>
      </div>
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
    "block rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#b8d7f0] hover:shadow";

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

  return <a href={href} className={classes}>{content}</a>;
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
    blue: "border-[#b8d7f0] bg-[#f8fbff] text-[#185FA5]",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
  }[tone];

  const classes = `admin-hero-callout rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm ${toneClasses}`;
  const content = (
    <>
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
    </>
  );

  if (!href) return <div className={classes}>{content}</div>;

  return <a href={href} className={classes}>{content}</a>;
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
      className="group admin-quick-action rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-[#b8d7f0] hover:bg-white hover:shadow-sm"
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
    blue: "bg-[#E6F1FB] text-[#185FA5]",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-800",
    slate: "bg-slate-100 text-slate-700",
  }[tone];

  const classes =
    "block rounded-2xl border border-slate-200 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-[#b8d7f0] hover:bg-[#f8fbff]";
  const content = (
    <>
      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${toneClasses}`}>
        {label}
      </span>
      <p className="mt-3 text-2xl font-extrabold text-slate-950">{value}</p>
      <p className="text-xs text-slate-500">{detail}</p>
    </>
  );

  if (!href) return <div className={classes}>{content}</div>;

  return <a href={href} className={classes}>{content}</a>;
}

function RecentMaterialsList({ materials }: { materials: any[] }) {
  if (!materials.length) {
    return <p className="text-sm text-slate-500">No source materials have been uploaded yet.</p>;
  }

  return (
    <div className="space-y-3">
      {materials.map((material) => (
        <div key={material.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
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
        </div>
      ))}
    </div>
  );
}

function TeamSummary({ users }: { users: any[] }) {
  if (!users.length) {
    return <p className="text-sm text-slate-500">No users available yet.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <div key={user.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="truncate text-sm font-semibold text-slate-900">{user.fullName ?? user.email}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
          <span className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#185FA5] ring-1 ring-[#b8d7f0]">
            {user.role}
          </span>
        </div>
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
    <a href={href} className="rounded-2xl border border-slate-200 px-4 py-3 transition-colors hover:border-[#b8d7f0] hover:bg-[#f8fbff]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <Icons.ArrowRight size={15} className="text-[#185FA5]" />
      </div>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </a>
  );
}

function CsvWorkflow({ onComplete }: { onComplete: (message: string) => void }) {
  const [csvText, setCsvText] = useState(sampleCsv);
  const [preview, setPreview] = useState<any>(null);
  const [quizTitle, setQuizTitle] = useState("Imported IMPACT_26 Assessment");
  const [busy, setBusy] = useState(false);

  async function previewCsv() {
    setBusy(true);
    const res = await fetch("/api/admin/assessments/csv-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csvText }),
    });
    setPreview(await res.json());
    setBusy(false);
  }

  async function importRows() {
    if (!preview?.validRows?.length || preview.errors?.length) return;
    setBusy(true);
    const res = await fetch("/api/admin/assessments/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rows: preview.validRows,
        quiz: {
          title: quizTitle,
          passingScore: 70,
          shuffleQuestions: true,
          shuffleChoices: false,
          status: "draft",
        },
      }),
    });
    setBusy(false);
    if (res.ok) onComplete("CSV assessment imported as a draft quiz.");
  }

  return (
    <div className="space-y-3">
      <label className="admin-label">CSV content</label>
      <textarea
        className="admin-input min-h-40 font-mono text-xs"
        value={csvText}
        onChange={(event) => setCsvText(event.target.value)}
      />
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <input className="admin-input" value={quizTitle} onChange={(event) => setQuizTitle(event.target.value)} />
        <button className="admin-action secondary" type="button" onClick={previewCsv} disabled={busy}>Preview</button>
        <button className="admin-action" type="button" onClick={importRows} disabled={busy || !preview?.validRows?.length || preview?.errors?.length}>
          Import
        </button>
      </div>
      {preview && (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs">
          <div className="flex flex-wrap gap-3 font-semibold text-slate-700">
            <span>{preview.validRows?.length ?? 0} valid rows</span>
            <span>{preview.errors?.length ?? 0} errors</span>
            <span>{preview.duplicates?.length ?? 0} duplicates</span>
          </div>
          {!!preview.errors?.length && (
            <div className="mt-2 max-h-28 overflow-auto text-red-700">
              {preview.errors.map((error: any, index: number) => (
                <p key={index}>Row {error.row}: {error.field} - {error.message}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ManualQuestionForm({ quizzes, onSaved }: { quizzes: any[]; onSaved: () => void }) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    questionText: "A Philadelphia assessor is reconciling sales and income indications. Which evidence best supports a final value conclusion?",
    questionType: "multiple_choice",
    difficulty: "proficient",
    domain: "appraisal",
    topicTags: "USPAP, valuation methods",
    sourceRef: "USPAP Standard 6",
    choices: ["Single recent sale only", "Three-approach convergence", "Owner estimate", "Prior-year assessment"],
    correct: "B",
    explanation: "Converging evidence from multiple approaches is stronger than a single isolated indicator.",
    quizId: "",
  });

  async function save() {
    setBusy(true);
    const choices = form.choices.map((choice, index) => ({
      letter: String.fromCharCode(65 + index),
      choiceText: choice,
      isCorrect: form.correct.toUpperCase().split(",").includes(String.fromCharCode(65 + index)),
      explanation: form.explanation,
    }));
    const res = await fetch("/api/admin/assessments/manual-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        topicTags: form.topicTags.split(",").map((tag) => tag.trim()).filter(Boolean),
        choices,
        quizId: form.quizId || null,
        pointValue: 1,
        status: "draft",
      }),
    });
    setBusy(false);
    if (res.ok) onSaved();
  }

  return (
    <div className="space-y-3">
      <textarea className="admin-input min-h-24" value={form.questionText} onChange={(event) => setForm({ ...form, questionText: event.target.value })} />
      <div className="grid gap-2 sm:grid-cols-3">
        <select className="admin-input" value={form.questionType} onChange={(event) => setForm({ ...form, questionType: event.target.value })}>
          <option value="multiple_choice">Multiple choice</option>
          <option value="multiselect">Multiselect</option>
          <option value="short_answer">Short answer</option>
          <option value="scenario">Scenario</option>
        </select>
        <select className="admin-input" value={form.difficulty} onChange={(event) => setForm({ ...form, difficulty: event.target.value })}>
          {Object.entries(DIFFICULTIES).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
        </select>
        <DomainCombobox value={form.domain} onChange={(val) => setForm({ ...form, domain: val })} />
      </div>
      {form.choices.map((choice, index) => (
        <div key={index} className="grid grid-cols-[32px_1fr] items-center gap-2">
          <span className="text-xs font-bold text-slate-500">{String.fromCharCode(65 + index)}</span>
          <input className="admin-input" value={choice} onChange={(event) => {
            const next = [...form.choices];
            next[index] = event.target.value;
            setForm({ ...form, choices: next });
          }} />
        </div>
      ))}
      <div className="grid gap-2 sm:grid-cols-2">
        <input className="admin-input" value={form.correct} onChange={(event) => setForm({ ...form, correct: event.target.value })} placeholder="Correct letters, e.g. A or A,C" />
        <input className="admin-input" value={form.topicTags} onChange={(event) => setForm({ ...form, topicTags: event.target.value })} />
      </div>
      <textarea className="admin-input min-h-20" value={form.explanation} onChange={(event) => setForm({ ...form, explanation: event.target.value })} />
      <select className="admin-input" value={form.quizId} onChange={(event) => setForm({ ...form, quizId: event.target.value })}>
        <option value="">Save to question bank only</option>
        {quizzes.map((quiz) => <option key={quiz.id} value={quiz.id}>{quiz.title}</option>)}
      </select>
      <button className="admin-action w-full" type="button" onClick={save} disabled={busy}>Save question</button>
    </div>
  );
}

function ContentWorkflow({ courses, onSaved }: { courses: any[]; onSaved: () => void }) {
  const [title, setTitle] = useState("Assessment Ratio Fundamentals");
  const [slug, setSlug] = useState("assessment-ratio-fundamentals");
  const [description, setDescription] = useState("Core formulas, ratio studies, and appraisal controls for municipal assessment practice.");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [lessonTitle, setLessonTitle] = useState("Ratio study review");

  async function createCourse() {
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, description, publish: true }),
    });
    if (res.ok) onSaved();
  }

  async function createLesson() {
    if (!selectedCourse) return;
    const res = await fetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: selectedCourse,
        moduleTitle: "Instructor-created module",
        lessonTitle,
        lessonType: "text",
        contentJson: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: lessonTitle }] }] }),
        publish: true,
      }),
    });
    if (res.ok) onSaved();
  }

  return (
    <div className="space-y-3">
      <input className="admin-input" value={title} onChange={(event) => setTitle(event.target.value)} />
      <input className="admin-input" value={slug} onChange={(event) => setSlug(event.target.value)} />
      <textarea className="admin-input min-h-20" value={description} onChange={(event) => setDescription(event.target.value)} />
      <button className="admin-action w-full" type="button" onClick={createCourse}>Create published course</button>
      <div className="border-t border-slate-100 pt-3">
        <select className="admin-input" value={selectedCourse} onChange={(event) => setSelectedCourse(event.target.value)}>
          <option value="">Select course for lesson</option>
          {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
        </select>
        <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
          <input className="admin-input" value={lessonTitle} onChange={(event) => setLessonTitle(event.target.value)} />
          <button className="admin-action secondary" type="button" onClick={createLesson}>Add lesson</button>
        </div>
      </div>
      <div className="max-h-40 overflow-auto rounded-md border border-slate-200">
        {courses.slice(0, 6).map((course) => (
          <div key={course.id} className="flex items-center justify-between border-b border-slate-100 px-3 py-2 text-xs last:border-0">
            <span className="font-semibold text-slate-700">{course.title}</span>
            <span className={course.isPublished ? "text-emerald-700" : "text-slate-500"}>{course.isPublished ? "Published" : "Draft"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaterialsWorkflow({ materials, onSaved }: { materials: any[]; onSaved: () => void }) {
  const [title, setTitle] = useState("Assessment calculations reference");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload() {
    if (!file) return;
    setBusy(true);
    setError(null);
    const form = new FormData();
    form.set("title", title);
    form.set("file", file);
    const res = await fetch("/api/admin/materials", { method: "POST", body: form });
    setBusy(false);
    if (res.ok) onSaved();
    else {
      const text = await res.text();
      try {
        const data = JSON.parse(text) as { error?: string };
        setError(data.error ?? "Upload failed.");
      } catch {
        setError(text || "Upload failed.");
      }
    }
  }

  return (
    <div className="space-y-3">
      <input className="admin-input" value={title} onChange={(event) => setTitle(event.target.value)} />
      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#185FA5]/50 bg-[#E6F1FB]/40 px-4 py-5 text-center text-sm text-slate-600">
        <span className="font-bold text-[#185FA5]">{file ? file.name : "Drop or choose a source file"}</span>
        <span className="text-xs">PDF, DOCX, CSV, TXT, Markdown, transcripts</span>
        <input className="sr-only" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
      </label>
      <button className="admin-action w-full" type="button" onClick={upload} disabled={busy || !file}>Ingest material</button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <div className="max-h-44 overflow-auto rounded-md border border-slate-200">
        {materials.slice(0, 6).map((material) => (
          <div key={material.id} className="border-b border-slate-100 px-3 py-2 text-xs last:border-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-slate-700">{material.title}</span>
              <span className={material.status === "parsed" ? "text-emerald-700" : "text-red-700"}>{material.status}</span>
            </div>
            <p className="truncate text-slate-500">{material.fileName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTable({ attempts, loading, compact = false }: { attempts: any[]; loading: boolean; compact?: boolean }) {
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

function UsersTable({ users, onSaved }: { users: any[]; onSaved: () => void }) {
  async function updateRole(userId: string, role: string) {
    const res = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    if (res.ok) onSaved();
  }

  return (
    <div className="max-h-80 overflow-auto">
      {users.map((user) => (
        <div key={user.id} className="grid grid-cols-[1fr_130px] items-center gap-3 border-b border-slate-100 py-2 text-sm">
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-800">{user.fullName ?? user.email}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <select className="admin-input py-1 text-xs" value={user.role} onChange={(event) => updateRole(user.id, event.target.value)}>
            <option value="learner">Learner</option>
            <option value="viewer">Viewer</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      ))}
      {!users.length && <p className="text-sm text-slate-500">No Data Connect users found yet.</p>}
    </div>
  );
}

function ExportLinks() {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <a className="font-semibold text-[#185FA5]" href="/api/admin/analytics/export?kind=attempts">Attempts</a>
      <a className="font-semibold text-[#185FA5]" href="/api/admin/analytics/export?kind=questions">Questions</a>
      <a className="font-semibold text-[#185FA5]" href="/api/admin/analytics/export?kind=engagement">Engagement</a>
    </div>
  );
}
