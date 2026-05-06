"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { VideoUpload } from "@/components/admin/VideoUpload";
import { VideoLinkInput } from "@/components/admin/VideoLinkInput";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Lesson {
  id: string;
  title: string;
  position: number;
  lessonType: string;
  status: string;
  isPublished: boolean;
  durationSeconds?: number | null;
  videoPlaybackId?: string | null;
  contentJson?: string | null;
}

interface Module {
  id: string;
  title: string;
  description?: string | null;
  learningObjectives?: string | null;
  prerequisiteModuleIds?: string | null;
  position: number;
  status: string;
  lessons_on_module: Lesson[];
}

interface Course {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  status: string;
  isPublished: boolean;
  modules_on_course: Module[];
}

type EditTarget = { type: "course"; item: Course } | { type: "module"; item: Module; courseId: string } | { type: "lesson"; item: Lesson; moduleId: string; courseId: string };

interface LessonVersion {
  id: string;
  contentJson?: string | null;
  videoPlaybackId?: string | null;
  versionNote?: string | null;
  createdAt: string;
  createdBy: { fullName?: string | null; email: string };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CurriculumTree() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [quizzes, setQuizzes] = useState<Array<{ id: string; title: string }>>([]);
  const [materials, setMaterials] = useState<Array<{ id: string; title: string }>>([]);

  async function load() {
    setLoading(true);
    const [courseRes, overviewRes] = await Promise.all([
      fetch("/api/admin/courses", { cache: "no-store" }),
      fetch("/api/admin/overview", { cache: "no-store" }),
    ]);
    if (courseRes.ok) setCourses((await courseRes.json()).courses ?? []);
    if (overviewRes.ok) {
      const data = await overviewRes.json();
      setQuizzes(data.quizzes ?? []);
      setMaterials(data.materials ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function toggleCourse(id: string) {
    setExpandedCourses((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleModule(id: string) {
    setExpandedModules((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function showNotice(type: "success" | "error", text: string) {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  }

  async function addModule(courseId: string) {
    const title = `Module ${courses.find((c) => c.id === courseId)?.modules_on_course.length ?? 0 + 1}`;
    const res = await fetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        moduleTitle: title,
        lessonTitle: "Untitled lesson",
        lessonType: "text",
        publish: false,
      }),
    });
    if (res.ok) { showNotice("success", "Module added."); await load(); }
    else showNotice("error", "Failed to add module.");
  }

  async function addLesson(courseId: string, moduleId: string) {
    const res = await fetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        moduleTitle: "__existing__",
        lessonTitle: "Untitled lesson",
        lessonType: "text",
        publish: false,
      }),
    });
    if (res.ok) { showNotice("success", "Lesson added."); await load(); }
    else showNotice("error", "Failed to add lesson.");
  }

  async function reorderItems(type: "module" | "lesson", items: Array<{ id: string; position: number }>) {
    await fetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reorder", type, items }),
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icons.Loader size={24} className="animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Tree */}
      <div className="flex-1 min-w-0 space-y-4">
        {notice && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${notice.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {notice.type === "success" ? <Icons.Check size={13} /> : <Icons.X size={13} />}
            {notice.text}
          </div>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">Course hierarchy</h2>
          <button
            type="button"
            onClick={() => setShowCreateCourse((v) => !v)}
            className="admin-action secondary flex items-center gap-1.5 text-xs"
          >
            <Icons.Plus size={13} />
            New course
          </button>
        </div>

        {showCreateCourse && (
          <CreateCourseForm
            onCreated={() => { setShowCreateCourse(false); load(); }}
            onCancel={() => setShowCreateCourse(false)}
          />
        )}

        {courses.length === 0 && !showCreateCourse ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <Icons.GraduationCap size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-sm text-slate-400">No courses yet. Create the first one.</p>
          </div>
        ) : (
          courses.map((course) => (
            <CourseNode
              key={course.id}
              course={course}
              expanded={expandedCourses.has(course.id)}
              expandedModules={expandedModules}
              onToggle={() => toggleCourse(course.id)}
              onToggleModule={toggleModule}
              onEdit={(target) => setEditTarget(target)}
              onAddModule={() => addModule(course.id)}
              onAddLesson={(mId) => addLesson(course.id, mId)}
              onReorder={reorderItems}
            />
          ))
        )}
      </div>

      {/* Edit panel */}
      {editTarget && (
        <EditPanel
          target={editTarget}
          quizzes={quizzes}
          materials={materials}
          allModules={courses.flatMap((c) => c.modules_on_course)}
          onSaved={() => { showNotice("success", "Saved."); load(); }}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}

// ─── Course Node ──────────────────────────────────────────────────────────────

function CourseNode({
  course,
  expanded,
  expandedModules,
  onToggle,
  onToggleModule,
  onEdit,
  onAddModule,
  onAddLesson,
  onReorder,
}: {
  course: Course;
  expanded: boolean;
  expandedModules: Set<string>;
  onToggle: () => void;
  onToggleModule: (id: string) => void;
  onEdit: (t: EditTarget) => void;
  onAddModule: () => void;
  onAddLesson: (moduleId: string) => void;
  onReorder: (type: "module" | "lesson", items: Array<{ id: string; position: number }>) => void;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
      {/* Course header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#E6F1FB]/30 border-b border-slate-100">
        <button type="button" onClick={onToggle} className="flex items-center gap-2 flex-1 min-w-0 text-left">
          {expanded ? <Icons.ChevronDown size={15} className="text-slate-400 shrink-0" /> : <Icons.ChevronRight size={15} className="text-slate-400 shrink-0" />}
          <Icons.GraduationCap size={16} className="text-[#185FA5] shrink-0" />
          <span className="font-semibold text-slate-900 text-sm truncate">{course.title}</span>
          <StatusDot status={course.status} published={course.isPublished} />
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] text-slate-400">{course.modules_on_course.length} modules</span>
          <button type="button" onClick={() => onEdit({ type: "course", item: course })} className="p-1.5 text-slate-400 hover:text-[#185FA5] transition-colors rounded">
            <Icons.Pencil size={13} />
          </button>
          <button type="button" onClick={onAddModule} className="p-1.5 text-slate-400 hover:text-[#185FA5] transition-colors rounded">
            <Icons.Plus size={13} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="divide-y divide-slate-50">
          {course.modules_on_course.map((mod) => (
            <ModuleNode
              key={mod.id}
              module={mod}
              courseId={course.id}
              expanded={expandedModules.has(mod.id)}
              onToggle={() => onToggleModule(mod.id)}
              onEdit={(t) => onEdit(t)}
              onAddLesson={() => onAddLesson(mod.id)}
            />
          ))}
          {course.modules_on_course.length === 0 && (
            <p className="px-8 py-4 text-xs text-slate-400">No modules — click + to add one.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Module Node ──────────────────────────────────────────────────────────────

function ModuleNode({
  module,
  courseId,
  expanded,
  onToggle,
  onEdit,
  onAddLesson,
}: {
  module: Module;
  courseId: string;
  expanded: boolean;
  onToggle: () => void;
  onEdit: (t: EditTarget) => void;
  onAddLesson: () => void;
}) {
  let objectives: string[] = [];
  let prereqs: string[] = [];
  try { objectives = JSON.parse(module.learningObjectives ?? "[]"); } catch { /* ignore */ }
  try { prereqs = JSON.parse(module.prerequisiteModuleIds ?? "[]"); } catch { /* ignore */ }

  return (
    <div className="pl-4">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50/50">
        <button type="button" onClick={onToggle} className="flex items-center gap-2 flex-1 min-w-0 text-left">
          {expanded ? <Icons.ChevronDown size={13} className="text-slate-300 shrink-0" /> : <Icons.ChevronRight size={13} className="text-slate-300 shrink-0" />}
          <Icons.BookMarked size={14} className="text-slate-400 shrink-0" />
          <span className="text-sm font-medium text-slate-700 truncate">{module.title}</span>
          <StatusDot status={module.status} />
          {prereqs.length > 0 && (
            <span title="Has prerequisites"><Icons.Lock size={11} className="text-amber-400 shrink-0" /></span>
          )}
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] text-slate-400">{module.lessons_on_module.length} lessons</span>
          <button type="button" onClick={() => onEdit({ type: "module", item: module, courseId })} className="p-1 text-slate-300 hover:text-slate-600 transition-colors rounded">
            <Icons.Pencil size={12} />
          </button>
          <button type="button" onClick={onAddLesson} className="p-1 text-slate-300 hover:text-slate-600 transition-colors rounded">
            <Icons.Plus size={12} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="pl-4 divide-y divide-slate-50/80">
          {module.lessons_on_module.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              moduleId={module.id}
              courseId={courseId}
              onEdit={(t) => onEdit(t)}
            />
          ))}
          {module.lessons_on_module.length === 0 && (
            <p className="px-4 py-3 text-xs text-slate-400">No lessons — click + to add one.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Lesson Row ───────────────────────────────────────────────────────────────

function LessonRow({
  lesson,
  moduleId,
  courseId,
  onEdit,
}: {
  lesson: Lesson;
  moduleId: string;
  courseId: string;
  onEdit: (t: EditTarget) => void;
}) {
  const typeIcons: Record<string, React.ComponentType<any>> = {
    text: Icons.FileText,
    video: Icons.Video,
    quiz: Icons.ClipboardList,
    source: Icons.Database,
  };
  const TypeIcon = typeIcons[lesson.lessonType] ?? Icons.FileText;

  return (
    <div className="flex items-center gap-2 px-3 py-2 group hover:bg-slate-50 transition-colors">
      <Icons.GripVertical size={12} className="text-slate-200 shrink-0" />
      <TypeIcon size={13} className="text-slate-400 shrink-0" />
      <span className="flex-1 min-w-0 text-xs text-slate-600 truncate">{lesson.title}</span>
      <div className="flex items-center gap-1.5 shrink-0">
        <LessonTypeBadge type={lesson.lessonType} />
        <StatusDot status={lesson.status} published={lesson.isPublished} />
        {lesson.durationSeconds && (
          <span className="text-[10px] text-slate-400">{Math.ceil(lesson.durationSeconds / 60)}m</span>
        )}
        <button
          type="button"
          onClick={() => onEdit({ type: "lesson", item: lesson, moduleId, courseId })}
          className="p-1 text-slate-200 hover:text-slate-600 transition-colors rounded opacity-0 group-hover:opacity-100"
        >
          <Icons.Pencil size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Edit Panel ───────────────────────────────────────────────────────────────

function EditPanel({
  target,
  quizzes,
  materials,
  allModules,
  onSaved,
  onClose,
}: {
  target: EditTarget;
  quizzes: Array<{ id: string; title: string }>;
  materials: Array<{ id: string; title: string }>;
  allModules: Module[];
  onSaved: () => void;
  onClose: () => void;
}) {
  return (
    <div className="w-80 shrink-0 rounded-xl border border-black/10 bg-white shadow-sm self-start sticky top-6">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-bold text-slate-900 capitalize">Edit {target.type}</p>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
          <Icons.X size={16} />
        </button>
      </div>
      <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {target.type === "course" && <CourseEditForm course={target.item} onSaved={onSaved} />}
        {target.type === "module" && (
          <ModuleEditForm module={target.item} courseId={target.courseId} allModules={allModules} onSaved={onSaved} />
        )}
        {target.type === "lesson" && (
          <LessonEditForm lesson={target.item} moduleId={target.moduleId} quizzes={quizzes} materials={materials} onSaved={onSaved} />
        )}
      </div>
    </div>
  );
}

// ─── Course Edit Form ─────────────────────────────────────────────────────────

function CourseEditForm({ course, onSaved }: { course: Course; onSaved: () => void }) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug: course.slug,
        description: description || null,
        publish: course.isPublished,
      }),
    });
    setBusy(false);
    onSaved();
  }

  async function togglePublish() {
    setBusy(true);
    await fetch("/api/admin/courses/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course.id, publish: !course.isPublished }),
    });
    setBusy(false);
    onSaved();
  }

  return (
    <div className="space-y-3">
      <Field label="Title">
        <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Description">
        <textarea className="admin-input min-h-16" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <div className="flex gap-2 pt-1">
        <button type="button" className="admin-action flex-1" onClick={save} disabled={busy}>Save</button>
        <button type="button" className="admin-action secondary" onClick={togglePublish} disabled={busy}>
          {course.isPublished ? "Unpublish" : "Publish"}
        </button>
      </div>
    </div>
  );
}

// ─── Module Edit Form ─────────────────────────────────────────────────────────

function ModuleEditForm({
  module,
  courseId,
  allModules,
  onSaved,
}: {
  module: Module;
  courseId: string;
  allModules: Module[];
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description ?? "");
  const [objText, setObjText] = useState(() => {
    try { return (JSON.parse(module.learningObjectives ?? "[]") as string[]).join("\n"); } catch { return ""; }
  });
  const [prereqIds, setPrereqIds] = useState<string[]>(() => {
    try { return JSON.parse(module.prerequisiteModuleIds ?? "[]"); } catch { return []; }
  });
  const [busy, setBusy] = useState(false);

  const otherModules = allModules.filter((m) => m.id !== module.id);

  async function save() {
    setBusy(true);
    const objectives = objText.split("\n").map((s) => s.trim()).filter(Boolean);
    await fetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update-module",
        moduleId: module.id,
        title,
        description: description || null,
        learningObjectives: objectives,
        prerequisiteModuleIds: prereqIds,
      }),
    });
    setBusy(false);
    onSaved();
  }

  function togglePrereq(id: string) {
    setPrereqIds((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  }

  return (
    <div className="space-y-3">
      <Field label="Module title">
        <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Description">
        <textarea className="admin-input min-h-14" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this module covers…" />
      </Field>
      <Field label="Learning objectives (one per line)">
        <textarea className="admin-input min-h-20 text-xs font-mono" value={objText} onChange={(e) => setObjText(e.target.value)} placeholder="Understand USPAP Standards 5 & 6&#10;Apply ratio study analysis" />
      </Field>
      {otherModules.length > 0 && (
        <Field label="Prerequisites (must complete before unlocking)">
          <div className="space-y-1 max-h-28 overflow-y-auto border border-slate-200 rounded-lg px-2 py-1.5">
            {otherModules.map((m) => (
              <label key={m.id} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                <input type="checkbox" checked={prereqIds.includes(m.id)} onChange={() => togglePrereq(m.id)} />
                {m.title}
              </label>
            ))}
          </div>
        </Field>
      )}
      <button type="button" className="admin-action w-full" onClick={save} disabled={busy}>
        {busy ? <Icons.Loader size={13} className="animate-spin" /> : "Save module"}
      </button>
    </div>
  );
}

// ─── Lesson Edit Form ─────────────────────────────────────────────────────────

function LessonEditForm({
  lesson,
  moduleId,
  quizzes,
  materials,
  onSaved,
}: {
  lesson: Lesson;
  moduleId: string;
  quizzes: Array<{ id: string; title: string }>;
  materials: Array<{ id: string; title: string }>;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(lesson.title);
  const [lessonType, setLessonType] = useState(lesson.lessonType);
  const [videoPlaybackId, setVideoPlaybackId] = useState(lesson.videoPlaybackId ?? "");
  const [videoUrl, setVideoUrl] = useState((lesson as any).videoUrl ?? "");
  // Determine initial video tab: "link" if a videoUrl exists, otherwise "upload"
  const [videoTab, setVideoTab] = useState<"upload" | "link">(
    (lesson as any).videoUrl ? "link" : "upload"
  );
  const [quizId, setQuizId] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [duration, setDuration] = useState(String(lesson.durationSeconds ?? ""));
  const [versionNote, setVersionNote] = useState("");
  const [isPublished, setIsPublished] = useState(lesson.isPublished);
  const [busy, setBusy] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState<LessonVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  async function save() {
    setBusy(true);
    await fetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update-lesson",
        lessonId: lesson.id,
        title,
        lessonType,
        videoPlaybackId: videoTab === "upload" ? (videoPlaybackId || null) : null,
        videoUrl: videoTab === "link" ? (videoUrl || null) : null,
        quizId: quizId || null,
        sourceMaterialId: materialId || null,
        durationSeconds: duration ? parseInt(duration) : null,
        status: isPublished ? "published" : "draft",
        isPublished,
        saveVersion: lesson.isPublished,
        versionNote: versionNote || null,
      }),
    });
    setBusy(false);
    onSaved();
  }

  async function loadVersions() {
    setLoadingVersions(true);
    const res = await fetch(`/api/admin/courses/versions?lessonId=${lesson.id}`);
    if (res.ok) setVersions((await res.json()).versions ?? []);
    setLoadingVersions(false);
  }

  async function restoreVersion(v: LessonVersion) {
    setBusy(true);
    await fetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update-lesson",
        lessonId: lesson.id,
        contentJson: v.contentJson ?? null,
        videoPlaybackId: v.videoPlaybackId ?? null,
        saveVersion: true,
        versionNote: `Restored from ${new Date(v.createdAt).toLocaleDateString()}`,
      }),
    });
    setBusy(false);
    setShowVersions(false);
    onSaved();
  }

  return (
    <div className="space-y-3">
      <Field label="Lesson title">
        <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Type">
        <select className="admin-input" value={lessonType} onChange={(e) => setLessonType(e.target.value)}>
          <option value="text">Text / Reading</option>
          <option value="video">Video</option>
          <option value="quiz">Quiz</option>
          <option value="source">Source material</option>
        </select>
      </Field>

      {lessonType === "video" && (
        <Field label="Video source">
          {/* Tab switcher */}
          <div className="mb-3 flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
            {(["upload", "link"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setVideoTab(tab)}
                className={cn(
                  "flex-1 rounded py-1 transition-colors",
                  videoTab === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tab === "upload" ? "⬆ Upload to Mux" : "🔗 Paste link"}
              </button>
            ))}
          </div>

          {videoTab === "upload" ? (
            <>
              <VideoUpload
                currentPlaybackId={videoPlaybackId || null}
                onPlaybackId={(id) => setVideoPlaybackId(id)}
              />
              <p className="mt-2 text-xs text-slate-500">Or enter a Mux playback ID manually:</p>
              <input
                className="admin-input mt-1 font-mono text-xs"
                value={videoPlaybackId}
                onChange={(e) => setVideoPlaybackId(e.target.value)}
                placeholder="abc123xyz…"
              />
            </>
          ) : (
            <VideoLinkInput
              value={videoUrl}
              onChange={setVideoUrl}
            />
          )}
        </Field>
      )}

      {lessonType === "quiz" && (
        <Field label="Quiz">
          <select className="admin-input" value={quizId} onChange={(e) => setQuizId(e.target.value)}>
            <option value="">Select quiz…</option>
            {quizzes.map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
          </select>
        </Field>
      )}

      {lessonType === "source" && (
        <Field label="Source material">
          <select className="admin-input" value={materialId} onChange={(e) => setMaterialId(e.target.value)}>
            <option value="">Select material…</option>
            {materials.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </Field>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Field label="Duration (seconds)">
          <input type="number" className="admin-input" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="300" />
        </Field>
        <Field label="Published">
          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              onClick={() => setIsPublished((v) => !v)}
              className={cn("relative h-5 w-9 rounded-full transition-colors", isPublished ? "bg-emerald-500" : "bg-slate-200")}
            >
              <span className={cn("absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", isPublished && "translate-x-4")} />
            </button>
            <span className="text-xs text-slate-500">{isPublished ? "Live" : "Draft"}</span>
          </div>
        </Field>
      </div>

      {lesson.isPublished && (
        <Field label="Version note (optional)">
          <input className="admin-input text-xs" value={versionNote} onChange={(e) => setVersionNote(e.target.value)} placeholder="What changed in this edit…" />
        </Field>
      )}

      <button type="button" className="admin-action w-full" onClick={save} disabled={busy}>
        {busy ? <Icons.Loader size={13} className="animate-spin" /> : "Save lesson"}
      </button>

      {/* Version history */}
      <div className="pt-1 border-t border-slate-100">
        <button
          type="button"
          onClick={() => { setShowVersions((v) => !v); if (!showVersions) loadVersions(); }}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Icons.History size={13} />
          Version history
          {showVersions ? <Icons.ChevronUp size={11} /> : <Icons.ChevronDown size={11} />}
        </button>

        {showVersions && (
          <div className="mt-2 space-y-1.5">
            {loadingVersions ? (
              <p className="text-xs text-slate-400">Loading…</p>
            ) : versions.length === 0 ? (
              <p className="text-xs text-slate-400">No saved versions yet.</p>
            ) : (
              versions.map((v) => (
                <div key={v.id} className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 px-2.5 py-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-slate-600">{new Date(v.createdAt).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 truncate">{v.createdBy.fullName ?? v.createdBy.email}</p>
                    {v.versionNote && <p className="text-[10px] text-slate-500 mt-0.5 truncate">{v.versionNote}</p>}
                  </div>
                  <button type="button" onClick={() => restoreVersion(v)} className="shrink-0 text-xs text-[#185FA5] hover:underline">Restore</button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Create Course Form ───────────────────────────────────────────────────────

function CreateCourseForm({ onCreated, onCancel }: { onCreated: () => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  function handleTitleChange(v: string) {
    setTitle(v);
    setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  }

  async function create() {
    setBusy(true);
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, description: description || null, publish: false }),
    });
    setBusy(false);
    if (res.ok) onCreated();
  }

  return (
    <div className="rounded-xl border border-[#185FA5]/20 bg-[#E6F1FB]/20 p-4 space-y-3">
      <p className="text-xs font-bold text-slate-700 uppercase tracking-[0.08em]">New course</p>
      <input className="admin-input" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Course title" />
      <input className="admin-input font-mono text-xs" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-slug" />
      <textarea className="admin-input min-h-12" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description…" />
      <div className="flex gap-2">
        <button type="button" className="admin-action flex-1" onClick={create} disabled={busy || !title.trim() || !slug.trim()}>
          {busy ? <Icons.Loader size={13} className="animate-spin" /> : "Create course"}
        </button>
        <button type="button" className="admin-action secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      {children}
    </div>
  );
}

function StatusDot({ status, published }: { status: string; published?: boolean }) {
  const color = published ? "bg-emerald-400" : status === "draft" ? "bg-slate-300" : status === "review" ? "bg-amber-400" : "bg-slate-300";
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${color} shrink-0`} title={published ? "Published" : status} />;
}

function LessonTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    text: "bg-slate-100 text-slate-500",
    video: "bg-[#E6F1FB] text-[#185FA5]",
    quiz: "bg-[#EEEDFE] text-[#534AB7]",
    source: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] ${map[type] ?? "bg-slate-100 text-slate-500"}`}>
      {type}
    </span>
  );
}
