"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as Icons from "@/components/ui/Icons";
import { adminFetch } from "@/lib/admin/client-fetch";
import { cn } from "@/lib/utils";
import { VideoUpload } from "@/components/admin/VideoUpload";
import { VideoLinkInput } from "@/components/admin/VideoLinkInput";
import { CourseImportPanel } from "@/components/admin/CourseImportPanel";

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
  videoUrl?: string | null;
  contentJson?: string | null;
  quiz?: { id: string } | null;
  sourceMaterial?: { id: string } | null;
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

type EditTarget =
  | { type: "course"; item: Course }
  | { type: "module"; item: Module; courseId: string }
  | { type: "lesson"; item: Lesson; moduleId: string; courseId: string };

interface LessonVersion {
  id: string;
  contentJson?: string | null;
  videoPlaybackId?: string | null;
  versionNote?: string | null;
  createdAt: string;
  createdBy: { fullName?: string | null; email: string };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CurriculumTree({
  initialCourses = [],
  initialQuizzes = [],
  initialMaterials = [],
}: {
  initialCourses?: Course[];
  initialQuizzes?: Array<{ id: string; title: string }>;
  initialMaterials?: Array<{ id: string; title: string }>;
}) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [selectedLessonIds, setSelectedLessonIds] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showImportCourse, setShowImportCourse] = useState(false);
  const [quizzes, setQuizzes] = useState<Array<{ id: string; title: string }>>(initialQuizzes);
  const [materials, setMaterials] = useState<Array<{ id: string; title: string }>>(initialMaterials);
  const [preflightDialog, setPreflightDialog] = useState<{
    lessonIds: string[];
    readyIds: string[];
    blockedIds: string[];
    results: Array<{ lessonId: string; title: string; lessonType: string; blockers: string[]; warnings: string[]; isReady: boolean }>;
    onConfirm: (publishAll: boolean) => void;
  } | null>(null);

  async function load() {
    setLoading(true);
    const [courseRes, overviewRes] = await Promise.all([
      adminFetch("/api/admin/courses", { cache: "no-store" }),
      adminFetch("/api/admin/overview", { cache: "no-store" }),
    ]);
    if (courseRes.ok) {
      setCourses((await courseRes.json()).courses ?? []);
    } else if (!courses.length) {
      showNotice("error", "Unable to load courses from the admin API.");
    }
    if (overviewRes.ok) {
      const data = await overviewRes.json();
      setQuizzes(data.quizzes ?? []);
      setMaterials(data.materials ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(false);
    void load();
  }, []);

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

  function toggleLessonSelection(lessonId: string, checked: boolean) {
    setSelectedLessonIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(lessonId);
      else next.delete(lessonId);
      return next;
    });
  }

  function toggleModuleLessonSelection(lessonIds: string[], checked: boolean) {
    setSelectedLessonIds((prev) => {
      const next = new Set(prev);
      for (const lessonId of lessonIds) {
        if (checked) next.add(lessonId);
        else next.delete(lessonId);
      }
      return next;
    });
  }

  async function publishLessonsForce(lessonIds: string[]) {
    if (!lessonIds.length) return;
    const res = await adminFetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish-lessons", lessonIds, publish: true, force: true }),
    });
    if (res.ok) {
      setSelectedLessonIds((prev) => {
        const next = new Set(prev);
        lessonIds.forEach((id) => next.delete(id));
        return next;
      });
      showNotice("success", `${lessonIds.length} lesson${lessonIds.length !== 1 ? "s" : ""} published.`);
      await load();
    } else {
      const err = await res.json().catch(() => ({}));
      showNotice("error", err.error ?? "Failed to publish lessons.");
    }
  }

  async function publishLessons(lessonIds: string[]) {
    if (!lessonIds.length) return;
    // Preflight check before publishing
    const res = await adminFetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish-lessons", lessonIds, publish: true, preflight: true }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showNotice("error", err.error ?? "Failed to check lesson readiness.");
      return;
    }
    const data = await res.json();
    const { readyIds = [], blockedIds = [], results = [] } = data;

    if (blockedIds.length === 0) {
      // All lessons ready — publish directly
      await publishLessonsForce(lessonIds);
      return;
    }

    // Show preflight dialog for admin to decide
    setPreflightDialog({
      lessonIds,
      readyIds,
      blockedIds,
      results,
      onConfirm: async (publishAll: boolean) => {
        setPreflightDialog(null);
        const idsToPublish = publishAll ? lessonIds : readyIds;
        if (idsToPublish.length) await publishLessonsForce(idsToPublish);
        else showNotice("error", "No lessons published — all had blockers.");
      },
    });
  }

  async function unpublishLesson(lessonId: string) {
    const res = await adminFetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish-lessons", lessonIds: [lessonId], publish: false }),
    });
    if (res.ok) {
      showNotice("success", "Lesson unpublished.");
      await load();
    } else {
      showNotice("error", "Failed to unpublish lesson.");
    }
  }

  async function deleteLessons(lessonIds: string[]) {
    if (!lessonIds.length) return;
    const confirmed = window.confirm(
      `Delete ${lessonIds.length} lesson${lessonIds.length !== 1 ? "s" : ""}? This cannot be undone.`
    );
    if (!confirmed) return;

    const res = await adminFetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-lessons", lessonIds }),
    });
    if (res.ok) {
      setSelectedLessonIds((prev) => {
        const next = new Set(prev);
        lessonIds.forEach((id) => next.delete(id));
        return next;
      });
      showNotice("success", `${lessonIds.length} lesson${lessonIds.length !== 1 ? "s" : ""} deleted.`);
      await load();
      return;
    }
    const err = await res.json().catch(() => ({}));
    showNotice("error", err.error ?? "Failed to delete lessons.");
  }

  async function deleteCourse(courseId: string, courseTitle: string) {
    const confirmed = window.confirm(
      `Permanently delete "${courseTitle}"?\n\nThis will remove all modules, lessons, and learner progress for this course. This cannot be undone.`
    );
    if (!confirmed) return;

    const res = await adminFetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-course", courseId }),
    });
    if (res.ok) {
      showNotice("success", `"${courseTitle}" deleted.`);
      await load();
    } else {
      const err = await res.json().catch(() => ({}));
      showNotice("error", err.error ?? "Failed to delete course.");
    }
  }

  async function deleteModule(moduleId: string, moduleTitle: string) {
    const confirmed = window.confirm(`Delete module "${moduleTitle}" and all of its lessons? This cannot be undone.`);
    if (!confirmed) return;

    const res = await adminFetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-module", moduleId }),
    });
    if (res.ok) {
      showNotice("success", `Module "${moduleTitle}" deleted.`);
      await load();
      return;
    }
    const err = await res.json().catch(() => ({}));
    showNotice("error", err.error ?? "Failed to delete module.");
  }

  async function publishCourse(courseId: string, publish: boolean) {
    const res = await adminFetch("/api/admin/courses/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, publish }),
    });
    if (res.ok) {
      showNotice("success", publish ? "Course published — students can now find it." : "Course unpublished.");
      await load();
    } else {
      showNotice("error", "Failed to update course visibility.");
    }
  }

  async function publishModule(module: Module, courseId: string, courseIsPublished: boolean) {
    const lessonIds = module.lessons_on_module.map((l) => l.id);
    if (!lessonIds.length) { showNotice("error", "No lessons in this module."); return; }

    // Preflight check before publishing
    const res = await adminFetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish-lessons", lessonIds, publish: true, preflight: true }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showNotice("error", err.error ?? "Failed to check lesson readiness.");
      return;
    }
    const data = await res.json();
    const { readyIds = [], blockedIds = [], results = [] } = data;

    const doPublish = async (idsToPublish: string[]) => {
      if (!idsToPublish.length) { showNotice("error", "No lessons published — all had blockers."); return; }
      await publishLessonsForce(idsToPublish);
      if (!courseIsPublished) {
        const shouldPublishCourse = window.confirm(
          `Lessons in "${module.title}" published.\n\nThe course is currently hidden from students. Publish the course now?`
        );
        if (shouldPublishCourse) await publishCourse(courseId, true);
      }
    };

    if (blockedIds.length === 0) {
      await doPublish(lessonIds);
      return;
    }

    setPreflightDialog({
      lessonIds,
      readyIds,
      blockedIds,
      results,
      onConfirm: async (publishAll: boolean) => {
        setPreflightDialog(null);
        await doPublish(publishAll ? lessonIds : readyIds);
      },
    });
  }

  async function addModule(courseId: string) {
    const title = `Module ${(courses.find((c) => c.id === courseId)?.modules_on_course.length ?? 0) + 1}`;
    const res = await adminFetch("/api/admin/courses", {
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
    const res = await adminFetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create-lesson",
        courseId,
        moduleId,
        lessonTitle: "Untitled lesson",
        lessonType: "text",
        publish: false,
      }),
    });
    if (res.ok) { showNotice("success", "Lesson added."); await load(); }
    else {
      const err = await res.json().catch(() => ({}));
      showNotice("error", err.error ?? "Failed to add lesson.");
    }
  }

  async function reorderItems(type: "module" | "lesson", items: Array<{ id: string; position: number }>) {
    await adminFetch("/api/admin/courses", {
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
    <div className="course-editor flex flex-col gap-6 lg:flex-row">
      {/* Preflight dialog */}
      {preflightDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Review before publishing</h2>
            <p className="text-sm text-slate-600">
              {preflightDialog.blockedIds.length} of {preflightDialog.lessonIds.length} lesson{preflightDialog.lessonIds.length !== 1 ? "s" : ""} have issues.
              {preflightDialog.readyIds.length > 0 && ` ${preflightDialog.readyIds.length} are ready.`}
            </p>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {preflightDialog.results.map((r) => (
                <div key={r.lessonId} className={`rounded-lg border p-3 text-xs ${r.isReady ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
                  <p className="font-semibold text-slate-800 mb-1">{r.title}</p>
                  {r.blockers.map((b) => (
                    <p key={b} className="text-red-700">✕ {b}</p>
                  ))}
                  {r.warnings.map((w) => (
                    <p key={w} className="text-amber-700">⚠ {w}</p>
                  ))}
                  {r.isReady && <p className="text-emerald-700">✓ Ready to publish</p>}
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              {preflightDialog.readyIds.length > 0 && (
                <button type="button" onClick={() => preflightDialog.onConfirm(false)} className="admin-action text-xs">
                  Publish {preflightDialog.readyIds.length} ready
                </button>
              )}
              <button type="button" onClick={() => preflightDialog.onConfirm(true)} className="admin-action secondary text-xs">
                Publish all anyway
              </button>
              <button type="button" onClick={() => setPreflightDialog(null)} className="admin-action secondary text-xs">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tree */}
      <div className="flex-1 min-w-0 space-y-4">
        {notice && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${notice.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {notice.type === "success" ? <Icons.Check size={13} /> : <Icons.X size={13} />}
            {notice.text}
          </div>
        )}

        <div className="flex flex-col items-start gap-3 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between">
          <h2 className="text-base font-bold text-slate-800">Course hierarchy</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setShowImportCourse((v) => !v); setShowCreateCourse(false); }}
              className="admin-action secondary flex items-center gap-1.5 text-xs"
            >
              <Icons.Upload size={13} />
              Import
            </button>
            <button
              type="button"
              onClick={() => { setShowCreateCourse((v) => !v); setShowImportCourse(false); }}
              className="admin-action secondary flex items-center gap-1.5 text-xs"
            >
              <Icons.Plus size={13} />
              New course
            </button>
          </div>
        </div>

        {showImportCourse && (
          <CourseImportPanel
            onImported={() => { setShowImportCourse(false); void load(); }}
            onCancel={() => setShowImportCourse(false)}
          />
        )}

        {showCreateCourse && (
          <CreateCourseForm
            onCreated={() => { setShowCreateCourse(false); load(); }}
            onCancel={() => setShowCreateCourse(false)}
          />
        )}

        {courses.length === 0 && !showCreateCourse && !showImportCourse ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <Icons.GraduationCap size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-sm text-slate-400">No courses yet. Create the first one or import from a file.</p>
          </div>
        ) : (
          courses.map((course) => (
            <CourseNode
              key={course.id}
              course={course}
              expanded={expandedCourses.has(course.id)}
              expandedModules={expandedModules}
              selectedLessonIds={selectedLessonIds}
              onToggle={() => toggleCourse(course.id)}
              onToggleModule={toggleModule}
              onEdit={(target) => setEditTarget(target)}
              onAddModule={() => addModule(course.id)}
              onAddLesson={(mId) => addLesson(course.id, mId)}
              onToggleLessonSelection={toggleLessonSelection}
              onToggleModuleLessonSelection={toggleModuleLessonSelection}
              onPublishLessons={publishLessons}
              onUnpublishLesson={unpublishLesson}
              onDeleteLessons={deleteLessons}
              onDeleteModule={deleteModule}
              onDeleteCourse={() => deleteCourse(course.id, course.title)}
              onPublishModule={(mod) => publishModule(mod, course.id, course.isPublished)}
              onPublishCourse={(publish) => publishCourse(course.id, publish)}
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
  selectedLessonIds,
  onToggle,
  onToggleModule,
  onEdit,
  onAddModule,
  onAddLesson,
  onToggleLessonSelection,
  onToggleModuleLessonSelection,
  onPublishLessons,
  onUnpublishLesson,
  onDeleteLessons,
  onDeleteModule,
  onDeleteCourse,
  onPublishModule,
  onPublishCourse,
  onReorder,
}: {
  course: Course;
  expanded: boolean;
  expandedModules: Set<string>;
  selectedLessonIds: Set<string>;
  onToggle: () => void;
  onToggleModule: (id: string) => void;
  onEdit: (t: EditTarget) => void;
  onAddModule: () => void;
  onAddLesson: (moduleId: string) => void;
  onToggleLessonSelection: (lessonId: string, checked: boolean) => void;
  onToggleModuleLessonSelection: (lessonIds: string[], checked: boolean) => void;
  onPublishLessons: (lessonIds: string[]) => void;
  onUnpublishLesson: (lessonId: string) => void;
  onDeleteLessons: (lessonIds: string[]) => void;
  onDeleteModule: (moduleId: string, moduleTitle: string) => void;
  onDeleteCourse: () => void;
  onPublishModule: (mod: Module) => void;
  onPublishCourse: (publish: boolean) => void;
  onReorder: (type: "module" | "lesson", items: Array<{ id: string; position: number }>) => void;
}) {
  const totalLessons = course.modules_on_course.reduce((s, m) => s + m.lessons_on_module.length, 0);
  const publishedLessons = course.modules_on_course.reduce((s, m) => s + m.lessons_on_module.filter((l) => l.isPublished).length, 0);

  return (
    <div className="course-tree-card rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
      {/* Course header */}
      <div className="course-tree-course-row flex items-center gap-2 px-4 py-3 bg-[#E6F1FB]/30 border-b border-slate-100">
        <button type="button" onClick={onToggle} className="course-tree-icon-button flex items-center gap-1.5 shrink-0">
          {expanded ? <Icons.ChevronDown size={15} className="text-slate-400" /> : <Icons.ChevronRight size={15} className="text-slate-400" />}
        </button>
        <Icons.GraduationCap size={16} className="text-[#185FA5] shrink-0" />
        <a
          href={`/admin/courses/${course.id}`}
          className="flex-1 min-w-0 flex items-center gap-2 group"
          title="Open lesson plan detail view"
        >
          <span className="font-semibold text-slate-900 text-sm truncate group-hover:text-[#185FA5] transition-colors">{course.title}</span>
          <PublishBadge published={course.isPublished} />
          <Icons.ExternalLink size={11} className="shrink-0 text-slate-300 group-hover:text-[#185FA5] transition-colors" />
        </a>
        <div className="flex items-center gap-1.5 shrink-0">
          {totalLessons > 0 && (
            <span className="text-[10px] text-slate-400">
              {publishedLessons}/{totalLessons} published
            </span>
          )}
          {/* Quick publish/unpublish course toggle */}
          <button
            type="button"
            title={course.isPublished ? "Unpublish course (hide from students)" : "Publish course (make visible to students)"}
            onClick={() => onPublishCourse(!course.isPublished)}
            className={cn(
              "rounded-md px-2 py-1 text-[10px] font-semibold transition-colors",
              course.isPublished
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border border-slate-200 bg-slate-50 text-slate-500 hover:border-[#185FA5] hover:text-[#185FA5]"
            )}
          >
            {course.isPublished ? "Published" : "Publish"}
          </button>
          <button type="button" onClick={() => onEdit({ type: "course", item: course })} className="course-tree-icon-button p-1.5 text-slate-400 hover:text-[#185FA5] transition-colors rounded" title="Edit course">
            <Icons.Pencil size={13} />
          </button>
          <button type="button" onClick={onAddModule} className="course-tree-icon-button p-1.5 text-slate-400 hover:text-[#185FA5] transition-colors rounded" title="Add module">
            <Icons.Plus size={13} />
          </button>
          <button
            type="button"
            onClick={onDeleteCourse}
            className="course-tree-icon-button p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded"
            title="Delete course permanently"
          >
            <Icons.Trash2 size={13} />
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
              selectedLessonIds={selectedLessonIds}
              onToggle={() => onToggleModule(mod.id)}
              onEdit={(t) => onEdit(t)}
              onAddLesson={() => onAddLesson(mod.id)}
              onToggleLessonSelection={onToggleLessonSelection}
              onToggleModuleLessonSelection={onToggleModuleLessonSelection}
              onPublishLessons={onPublishLessons}
              onUnpublishLesson={onUnpublishLesson}
              onDeleteLessons={onDeleteLessons}
              onDeleteModule={onDeleteModule}
              onPublishModule={() => onPublishModule(mod)}
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
  selectedLessonIds,
  onToggle,
  onEdit,
  onAddLesson,
  onToggleLessonSelection,
  onToggleModuleLessonSelection,
  onPublishLessons,
  onUnpublishLesson,
  onDeleteLessons,
  onDeleteModule,
  onPublishModule,
}: {
  module: Module;
  courseId: string;
  expanded: boolean;
  selectedLessonIds: Set<string>;
  onToggle: () => void;
  onEdit: (t: EditTarget) => void;
  onAddLesson: () => void;
  onToggleLessonSelection: (lessonId: string, checked: boolean) => void;
  onToggleModuleLessonSelection: (lessonIds: string[], checked: boolean) => void;
  onPublishLessons: (lessonIds: string[]) => void;
  onUnpublishLesson: (lessonId: string) => void;
  onDeleteLessons: (lessonIds: string[]) => void;
  onDeleteModule: (moduleId: string, moduleTitle: string) => void;
  onPublishModule: () => void;
}) {
  let prereqs: string[] = [];
  try { prereqs = JSON.parse(module.prerequisiteModuleIds ?? "[]"); } catch { /* ignore */ }
  const lessonIds = module.lessons_on_module.map((lesson) => lesson.id);
  const selectedIds = lessonIds.filter((lessonId) => selectedLessonIds.has(lessonId));
  const allSelected = lessonIds.length > 0 && selectedIds.length === lessonIds.length;
  const someSelected = selectedIds.length > 0;
  const unpublishedIds = module.lessons_on_module.filter((l) => !l.isPublished).map((l) => l.id);
  const publishedCount = module.lessons_on_module.filter((l) => l.isPublished).length;
  const allPublished = lessonIds.length > 0 && publishedCount === lessonIds.length;

  return (
    <div className="course-tree-module pl-4">
      <div className="course-tree-module-row flex items-center gap-2 px-3 py-2.5 bg-slate-50/50">
        <button type="button" onClick={onToggle} className="course-tree-icon-button flex items-center gap-2 flex-1 min-w-0 text-left">
          {expanded ? <Icons.ChevronDown size={13} className="text-slate-300 shrink-0" /> : <Icons.ChevronRight size={13} className="text-slate-300 shrink-0" />}
          <Icons.BookMarked size={14} className="text-slate-400 shrink-0" />
          <span className="text-sm font-medium text-slate-700 truncate">{module.title}</span>
          {prereqs.length > 0 && (
            <span title="Has prerequisites"><Icons.Lock size={11} className="text-amber-400 shrink-0" /></span>
          )}
        </button>
        <div className="flex items-center gap-1 shrink-0">
          {module.lessons_on_module.length > 0 && (
            <>
              <span className="text-[10px] text-slate-400">{publishedCount}/{module.lessons_on_module.length}</span>
              {/* Publish module — publishes all unpublished lessons */}
              {!allPublished && (
                <button
                  type="button"
                  onClick={onPublishModule}
                  title={`Publish all ${unpublishedIds.length} unpublished lessons in this module`}
                  className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  Publish module
                </button>
              )}
              {allPublished && (
                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                  ✓ All published
                </span>
              )}
            </>
          )}
          {/* Bulk selection */}
          {module.lessons_on_module.length > 0 && (
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onToggleModuleLessonSelection(lessonIds, e.target.checked)}
              aria-label={`Select all lessons in ${module.title}`}
              className={cn("h-3.5 w-3.5 rounded border-slate-300 ml-1", someSelected && !allSelected && "accent-[#185FA5]")}
            />
          )}
          {someSelected && (
            <>
              <button
                type="button"
                onClick={() => onPublishLessons(selectedIds)}
                className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100"
              >
                Publish ({selectedIds.length})
              </button>
              <button
                type="button"
                onClick={() => onDeleteLessons(selectedIds)}
                className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-700 hover:bg-red-100"
              >
                Delete ({selectedIds.length})
              </button>
            </>
          )}
          <button type="button" onClick={() => onEdit({ type: "module", item: module, courseId })} className="course-tree-icon-button p-1 text-slate-300 hover:text-slate-600 transition-colors rounded">
            <Icons.Pencil size={12} />
          </button>
          <button
            type="button"
            onClick={() => onDeleteModule(module.id, module.title)}
            className="course-tree-icon-button p-1 text-slate-300 hover:text-red-600 transition-colors rounded"
            title="Delete module"
          >
            <Icons.Trash2 size={12} />
          </button>
          <button type="button" onClick={onAddLesson} className="course-tree-icon-button p-1 text-slate-300 hover:text-slate-600 transition-colors rounded" title="Add lesson">
            <Icons.Plus size={12} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="course-tree-lessons pl-4 divide-y divide-slate-50/80">
          {module.lessons_on_module.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              moduleId={module.id}
              courseId={courseId}
              selected={selectedLessonIds.has(lesson.id)}
              onToggleSelected={(checked) => onToggleLessonSelection(lesson.id, checked)}
              onEdit={(t) => onEdit(t)}
              onDelete={() => onDeleteLessons([lesson.id])}
              onTogglePublish={() =>
                lesson.isPublished
                  ? onUnpublishLesson(lesson.id)
                  : onPublishLessons([lesson.id])
              }
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
  selected,
  onToggleSelected,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  lesson: Lesson;
  moduleId: string;
  courseId: string;
  selected: boolean;
  onToggleSelected: (checked: boolean) => void;
  onEdit: (t: EditTarget) => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}) {
  const typeIcons: Record<string, React.ComponentType<any>> = {
    text: Icons.FileText,
    video: Icons.Video,
    quiz: Icons.ClipboardList,
    source: Icons.Database,
  };
  const TypeIcon = typeIcons[lesson.lessonType] ?? Icons.FileText;

  return (
    <div className="course-tree-lesson-row flex items-center gap-2 px-3 py-2 group hover:bg-slate-50 transition-colors">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onToggleSelected(e.target.checked)}
        aria-label={`Select lesson ${lesson.title}`}
        className="h-3.5 w-3.5 rounded border-slate-300"
      />
      <Icons.GripVertical size={12} className="text-slate-200 shrink-0" />
      <TypeIcon size={13} className="text-slate-400 shrink-0" />
      <Link
        href={`/admin/courses/${courseId}?lesson=${lesson.id}`}
        className="flex-1 min-w-0 text-xs text-slate-600 truncate hover:text-[#185FA5] transition-colors"
        title="Open in lesson editor"
      >
        {lesson.title}
      </Link>
      <div className="flex items-center gap-1.5 shrink-0">
        <LessonTypeBadge type={lesson.lessonType} />
        {/* Quick publish toggle */}
        <button
          type="button"
          title={lesson.isPublished ? "Click to unpublish (hide from students)" : "Click to publish (make visible to students)"}
          onClick={onTogglePublish}
          className={cn(
            "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider transition-colors",
            lesson.isPublished
              ? "bg-emerald-100 text-emerald-700 hover:bg-red-50 hover:text-red-600"
              : "bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700"
          )}
        >
          {lesson.isPublished ? "Live" : "Draft"}
        </button>
        {lesson.durationSeconds && (
          <span className="text-[10px] text-slate-400">{Math.ceil(lesson.durationSeconds / 60)}m</span>
        )}
        <Link
          href={`/admin/courses/${courseId}?lesson=${lesson.id}`}
          className="course-tree-icon-button p-1 text-slate-200 hover:text-[#185FA5] transition-colors rounded opacity-0 group-hover:opacity-100"
          title="Open in lesson editor"
        >
          <Icons.ArrowRight size={12} />
        </Link>
        <button
          type="button"
          onClick={() => onEdit({ type: "lesson", item: lesson, moduleId, courseId })}
          className="course-tree-icon-button p-1 text-slate-200 hover:text-slate-600 transition-colors rounded opacity-0 group-hover:opacity-100"
          title="Edit metadata"
        >
          <Icons.Pencil size={12} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="course-tree-icon-button p-1 text-slate-200 hover:text-red-600 transition-colors rounded opacity-0 group-hover:opacity-100"
          title="Delete lesson"
        >
          <Icons.Trash2 size={12} />
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
    <div className="w-full shrink-0 self-start rounded-xl border border-black/10 bg-white shadow-sm lg:sticky lg:top-6 lg:w-80">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-bold text-slate-900 capitalize">Edit {target.type}</p>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
          <Icons.X size={16} />
        </button>
      </div>
      <div className="p-4 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto">
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
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    const res = await adminFetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update-course",
        courseId: course.id,
        title,
        description: description || null,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error ?? "Could not save course.");
      return;
    }
    onSaved();
  }

  async function togglePublish() {
    setBusy(true);
    setError(null);
    const res = await adminFetch("/api/admin/courses/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course.id, publish: !course.isPublished }),
    });
    setBusy(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error ?? "Could not update publish status.");
      return;
    }
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

      {/* Publish status summary */}
      <div className={cn(
        "rounded-lg border px-3 py-2 text-xs",
        course.isPublished ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-slate-50 text-slate-500"
      )}>
        {course.isPublished ? (
          <span className="flex items-center gap-1.5"><Icons.Eye size={11} /> Visible to students in the course catalog.</span>
        ) : (
          <span className="flex items-center gap-1.5"><Icons.EyeOff size={11} /> Hidden — students cannot see this course.</span>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button type="button" className="admin-action flex-1" onClick={save} disabled={busy}>Save</button>
        <button type="button" className={cn("admin-action", course.isPublished ? "secondary" : "")} onClick={togglePublish} disabled={busy}>
          {course.isPublished ? "Unpublish" : "Publish course"}
        </button>
      </div>
      <p className="text-[10px] text-slate-400 leading-relaxed">
        Publishing a course makes it appear in the student catalog. Lessons must also be individually published to be visible.
      </p>
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
    await adminFetch("/api/admin/courses", {
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
  const [videoTab, setVideoTab] = useState<"upload" | "link">(
    (lesson as any).videoUrl ? "link" : "upload"
  );
  const [quizId, setQuizId] = useState(lesson.quiz?.id ?? "");
  const [materialId, setMaterialId] = useState(lesson.sourceMaterial?.id ?? "");
  const [duration, setDuration] = useState(String(lesson.durationSeconds ?? ""));
  const [versionNote, setVersionNote] = useState("");
  const [isPublished, setIsPublished] = useState(lesson.isPublished);
  const [busy, setBusy] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState<LessonVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  async function save() {
    setBusy(true);
    await adminFetch("/api/admin/courses", {
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
    const res = await adminFetch(`/api/admin/courses/versions?lessonId=${lesson.id}`);
    if (res.ok) setVersions((await res.json()).versions ?? []);
    setLoadingVersions(false);
  }

  async function restoreVersion(v: LessonVersion) {
    setBusy(true);
    await adminFetch("/api/admin/courses", {
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
            <VideoLinkInput value={videoUrl} onChange={setVideoUrl} />
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
    const res = await adminFetch("/api/admin/courses", {
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

function PublishBadge({ published }: { published: boolean }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
      published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
    )}>
      <span className={cn("inline-block h-1.5 w-1.5 rounded-full", published ? "bg-emerald-500" : "bg-slate-300")} />
      {published ? "Published" : "Draft"}
    </span>
  );
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
