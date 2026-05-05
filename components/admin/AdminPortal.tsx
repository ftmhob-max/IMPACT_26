"use client";

import { useEffect, useMemo, useState } from "react";
import { DOMAINS, DIFFICULTIES } from "@/lib/utils";
import * as Icons from "@/components/ui/Icons";

type Overview = {
  questions: any[];
  courses: any[];
  quizzes: any[];
  materials: any[];
  attempts: any[];
  users: any[];
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

export function AdminPortal() {
  const [overview, setOverview] = useState<Overview>(emptyOverview);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    const res = await fetch("/api/admin/overview", { cache: "no-store" });
    if (res.ok) setOverview(await res.json());
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
    return { completed, passRate, avgScore, publishedCourses };
  }, [overview]);

  async function withNotice(action: () => Promise<void>, message: string) {
    setNotice(null);
    await action();
    setNotice(message);
    await refresh();
  }

  return (
    <div className="min-h-screen bg-[#f0efe9] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-col gap-4 border-b border-black/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#185FA5] text-white shadow-sm">
              <Icons.ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#185FA5]">IMPACT_26 admin</p>
              <h1 className="mt-0.5 text-2xl font-extrabold tracking-normal text-slate-950">Learning operations portal</h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Create curriculum, validate assessments, ingest source materials, and monitor learner performance.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a className="admin-action secondary flex items-center gap-2" href="/courses">
              <Icons.GraduationCap size={16} />
              Learner catalog
            </a>
            <a className="admin-action flex items-center gap-2" href="/api/admin/analytics/export?kind=attempts">
              <Icons.LogOut size={16} className="-rotate-90" />
              Export attempts
            </a>
          </div>
        </header>

        {notice && (
          <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            <Icons.Check size={18} />
            {notice}
          </div>
        )}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Questions" value={overview.questions.length} detail="Banked assessment items" icon={Icons.FileText} />
          <Metric label="Published courses" value={stats.publishedCourses} detail={`${overview.courses.length} total courses`} icon={Icons.GraduationCap} />
          <Metric label="Pass rate" value={`${stats.passRate}%`} detail={`${stats.completed} completed attempts`} icon={Icons.Target} />
          <Metric label="Avg score" value={`${stats.avgScore}%`} detail="Across completed attempts" icon={Icons.BarChart3} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <Panel title="Assessment CSV Upload" icon={Icons.ClipboardList} action={<span className="text-xs text-slate-500">Validation before publishing</span>}>
            <CsvWorkflow onComplete={(msg) => withNotice(async () => {}, msg)} />
          </Panel>
          <Panel title="Manual Builder" icon={Icons.BookOpen} action={<span className="text-xs text-slate-500">Multiple choice, multiselect, scenario</span>}>
            <ManualQuestionForm quizzes={overview.quizzes} onSaved={() => withNotice(async () => {}, "Question saved to the bank.")} />
          </Panel>
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <Panel title="Content Management" icon={Icons.GraduationCap} action={<span className="text-xs text-slate-500">Draft and publish learner content</span>}>
            <ContentWorkflow courses={overview.courses} onSaved={() => withNotice(async () => {}, "Course content updated.")} />
          </Panel>
          <Panel title="Source Materials" icon={Icons.Database} action={<span className="text-xs text-slate-500">PDF, DOCX, CSV, transcript ingestion</span>}>
            <MaterialsWorkflow materials={overview.materials} onSaved={() => withNotice(async () => {}, "Source material ingested.")} />
          </Panel>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
          <Panel title="Analytics" icon={Icons.BarChart3} action={<ExportLinks />}>
            <AnalyticsTable attempts={overview.attempts} loading={loading} />
          </Panel>
          <Panel title="Users & Roles" icon={Icons.Users} action={<span className="text-xs text-slate-500">Admin-only mutations</span>}>
            <UsersTable users={overview.users} onSaved={() => withNotice(async () => {}, "User role updated.")} />
          </Panel>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value, detail, icon: Icon }: { label: string; value: string | number; detail: string; icon?: React.ComponentType<{ className?: string; size?: number }> }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{label}</p>
        {Icon && <Icon size={18} className="text-slate-300" />}
      </div>
      <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-950">{value}</p>
      <p className="text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function Panel({ title, action, icon: Icon, children }: { title: string; action?: React.ReactNode; icon?: React.ComponentType<{ className?: string; size?: number }>; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-black/10 bg-white shadow-sm">
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
        <select className="admin-input" value={form.domain} onChange={(event) => setForm({ ...form, domain: event.target.value })}>
          {Object.entries(DOMAINS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
        </select>
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

  async function upload() {
    if (!file) return;
    setBusy(true);
    const form = new FormData();
    form.set("title", title);
    form.set("file", file);
    const res = await fetch("/api/admin/materials", { method: "POST", body: form });
    setBusy(false);
    if (res.ok) onSaved();
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

function AnalyticsTable({ attempts, loading }: { attempts: any[]; loading: boolean }) {
  if (loading) return <p className="text-sm text-slate-500">Loading analytics...</p>;
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
          {attempts.slice(0, 8).map((attempt) => (
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
