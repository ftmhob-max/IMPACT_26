"use client";

import { useEffect, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { adminFetch } from "@/lib/admin/client-fetch";

interface CourseOption {
  id: string;
  title: string;
  modules_on_course: Array<{
    id: string;
    title: string;
    lessons_on_module: Array<{
      id: string;
      title: string;
      lessonType: string;
      quiz?: { id: string } | null;
    }>;
  }>;
}

export function AttachQuizModal({
  quizId,
  quizTitle,
  onClose,
  onAttached,
}: {
  quizId: string;
  quizTitle: string;
  onClose: () => void;
  onAttached: (message: string) => void;
}) {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [newLessonTitle, setNewLessonTitle] = useState(quizTitle);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await adminFetch("/api/admin/overview", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses ?? []);
      }
      setLoading(false);
    }
    void load();
  }, []);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) ?? null;
  const selectedModule = selectedCourse?.modules_on_course.find((m) => m.id === selectedModuleId) ?? null;

  const quizLessonsInModule = selectedModule
    ? selectedModule.lessons_on_module.filter((l) => l.lessonType === "quiz")
    : [];

  // Reset downstream selections when parent changes
  function handleCourseChange(courseId: string) {
    setSelectedCourseId(courseId);
    setSelectedModuleId("");
    setSelectedLessonId("");
  }

  function handleModuleChange(moduleId: string) {
    setSelectedModuleId(moduleId);
    setSelectedLessonId("");
  }

  async function handleAttach() {
    if (!selectedModuleId || !selectedCourseId) return;
    setBusy(true);
    setError(null);

    try {
      let res: Response;
      let successMsg: string;

      if (selectedLessonId === "__new__" || selectedLessonId === "") {
        res = await adminFetch("/api/admin/courses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create-lesson",
            courseId: selectedCourseId,
            moduleId: selectedModuleId,
            lessonTitle: newLessonTitle.trim() || quizTitle,
            lessonType: "quiz",
            quizId,
          }),
        });
        successMsg = "Quiz attached to new lesson.";
      } else {
        res = await adminFetch("/api/admin/courses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update-lesson",
            lessonId: selectedLessonId,
            quizId,
          }),
        });
        successMsg = "Quiz attached to existing lesson.";
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to attach quiz.");
        setBusy(false);
        return;
      }

      onAttached(successMsg);
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  const canAttach =
    selectedCourseId &&
    selectedModuleId &&
    (selectedLessonId !== "" || newLessonTitle.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Icons.Link size={15} className="text-[#185FA5]" />
            <h2 className="text-sm font-bold text-slate-900">Attach quiz to lesson</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded">
            <Icons.X size={15} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <p className="text-xs text-slate-500 truncate">
            Attaching: <span className="font-semibold text-slate-700">{quizTitle}</span>
          </p>

          {loading ? (
            <p className="text-xs text-slate-400">Loading courses…</p>
          ) : (
            <>
              <div>
                <label className="admin-label">Course</label>
                <select
                  className="admin-input"
                  value={selectedCourseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                >
                  <option value="">— Select course —</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {selectedCourse && (
                <div>
                  <label className="admin-label">Module</label>
                  <select
                    className="admin-input"
                    value={selectedModuleId}
                    onChange={(e) => handleModuleChange(e.target.value)}
                  >
                    <option value="">— Select module —</option>
                    {selectedCourse.modules_on_course.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedModule && (
                <div>
                  <label className="admin-label">Lesson</label>
                  <select
                    className="admin-input"
                    value={selectedLessonId}
                    onChange={(e) => setSelectedLessonId(e.target.value)}
                  >
                    <option value="__new__">+ Create new quiz lesson</option>
                    {quizLessonsInModule.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                        {l.quiz?.id && l.quiz.id !== quizId ? " (has quiz)" : ""}
                      </option>
                    ))}
                  </select>

                  {(selectedLessonId === "__new__" || selectedLessonId === "") && (
                    <div className="mt-2">
                      <label className="admin-label">New lesson title</label>
                      <input
                        className="admin-input"
                        value={newLessonTitle}
                        onChange={(e) => setNewLessonTitle(e.target.value)}
                        placeholder="Lesson title"
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {error && (
            <p className="text-xs font-medium text-red-600">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={onClose} className="admin-action secondary text-xs py-1.5 px-3">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAttach}
            disabled={!canAttach || busy}
            className="admin-action text-xs py-1.5 px-3 disabled:opacity-50"
          >
            {busy ? "Attaching…" : "Attach quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}
