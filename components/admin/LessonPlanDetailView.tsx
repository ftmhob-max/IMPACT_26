"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { LessonBuilderEditor, type LessonBuilderEditorHandle } from "@/components/admin/LessonBuilderEditor";
import { LessonStudentPreview } from "@/components/admin/LessonStudentPreview";
import { LessonQuizPanel } from "@/components/admin/LessonQuizPanel";
import { VideoUpload } from "@/components/admin/VideoUpload";
import { VideoLinkInput } from "@/components/admin/VideoLinkInput";
import {
  getLessonReadinessReport,
  parseStructuredLessonContent,
} from "@/lib/lessons/structured-content";
import { runLessonPreflight } from "@/lib/lessons/publish-preflight";
import { getQuizReadiness } from "@/lib/admin/quiz-dashboard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LessonQuiz {
  id: string;
  title: string;
  status: string;
  passingScore?: number | null;
  timeLimitSeconds?: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  questionCount?: number;
  incompleteQuestionCount?: number;
}

interface LessonData {
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
  quiz?: LessonQuiz | null;
  sourceMaterial?: { id: string; title: string } | null;
}

interface ModuleData {
  id: string;
  title: string;
  description?: string | null;
  learningObjectives?: string | null;
  position: number;
  status: string;
  lessons: LessonData[];
}

interface CourseData {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  status: string;
  isPublished: boolean;
}

type TabId = "content" | "questions" | "resources" | "settings";
type PreviewMode = "edit" | "review" | "preview";
type OutlineFilter = "all" | "draft" | "blocked" | "ready" | "published" | "missing-media" | "missing-transcript";

const OUTLINE_COLLAPSED_KEY = "impact26:course-editor:outline-collapsed";

// ─── Main Component ───────────────────────────────────────────────────────────

export function LessonPlanDetailView({
  course,
  initialModules,
  initialLessonId,
}: {
  course: CourseData;
  initialModules: ModuleData[];
  initialLessonId?: string;
}) {
  const allLessons = initialModules.flatMap((m) => m.lessons);
  const resolvedInitialLesson =
    (initialLessonId && allLessons.find((l) => l.id === initialLessonId))
      ? initialLessonId
      : (allLessons[0]?.id ?? null);

  const [modules, setModules] = useState<ModuleData[]>(initialModules);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(resolvedInitialLesson);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(initialModules.map((m) => m.id))
  );
  const [mode, setMode] = useState<PreviewMode>("edit");
  const [outlineCollapsed, setOutlineCollapsed] = useState(false);
  const [mobileOutlineOpen, setMobileOutlineOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("content");
  const [outlineFilter, setOutlineFilter] = useState<OutlineFilter>("all");
  const [focusMode, setFocusMode] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [draftContentByLessonId, setDraftContentByLessonId] = useState<Record<string, string>>({});
  const contentEditorRef = useRef<LessonBuilderEditorHandle | null>(null);

  const selectedLesson = modules.flatMap((m) => m.lessons).find((l) => l.id === selectedLessonId) ?? null;
  const selectedLessonForDisplay = selectedLesson
    ? {
        ...selectedLesson,
        contentJson: draftContentByLessonId[selectedLesson.id] ?? selectedLesson.contentJson,
      }
    : null;

  useEffect(() => {
    try {
      setOutlineCollapsed(localStorage.getItem(OUTLINE_COLLAPSED_KEY) === "true");
    } catch {
      // Local storage is optional; the editor still works without persistence.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(OUTLINE_COLLAPSED_KEY, String(outlineCollapsed));
    } catch {
      // Ignore persistence failures in private browsing or restricted contexts.
    }
  }, [outlineCollapsed]);

  useEffect(() => {
    if (focusMode) {
      document.body.setAttribute("data-focus-mode", "true");
      setOutlineCollapsed(true);
    } else {
      document.body.removeAttribute("data-focus-mode");
    }
    return () => {
      document.body.removeAttribute("data-focus-mode");
    };
  }, [focusMode]);

  function showNotice(type: "success" | "error", text: string) {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  }

  function handleContentChange(lessonId: string, contentJson: string) {
    setDraftContentByLessonId((prev) => ({ ...prev, [lessonId]: contentJson }));
  }

  async function handleModeChange(nextMode: PreviewMode) {
    if (nextMode !== "edit" && mode === "edit" && activeTab === "content") {
      await contentEditorRef.current?.flushSave();
    }
    setMode(nextMode);
  }

  async function reload() {
    const res = await fetch(`/api/admin/courses/${course.id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setModules(data.modules);
    }
  }

  function selectLesson(lessonId: string) {
    setSelectedLessonId(lessonId);
    setMode("edit");
    setActiveTab("content");
    setMobileOutlineOpen(false);
  }

  function toggleModule(moduleId: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });
  }

  async function addModule() {
    const res = await fetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: course.id,
        moduleTitle: `Module ${modules.length + 1}`,
        lessonTitle: "Untitled lesson",
        lessonType: "text",
        publish: false,
      }),
    });
    if (res.ok) {
      showNotice("success", "Module added.");
      await reload();
    } else {
      showNotice("error", "Failed to add module.");
    }
  }

  async function addLesson(moduleId: string) {
    const res = await fetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create-lesson",
        courseId: course.id,
        moduleId,
        lessonTitle: "Untitled lesson",
        lessonType: "text",
        publish: false,
      }),
    });
    if (res.ok) {
      showNotice("success", "Lesson added.");
      await reload();
    } else {
      showNotice("error", "Failed to add lesson.");
    }
  }

  const handleLessonUpdate = useCallback(
    async (lessonId: string, updates: Record<string, unknown>) => {
      const res = await fetch("/api/admin/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-lesson", lessonId, ...updates }),
      });
      if (res.ok) {
        showNotice("success", "Saved.");
        await reload();
      } else {
        showNotice("error", "Failed to save.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [course.id]
  );

  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const allLessonsList = modules.flatMap((m) => m.lessons);
  const publishedLessons = allLessonsList.filter((l) => l.isPublished).length;
  const [showReadinessSummary, setShowReadinessSummary] = useState(false);
  const readinessSummaryCounts = computeFilterCounts(allLessonsList);

  return (
    <div className="lesson-plan-editor flex min-h-screen flex-col bg-[#f0efe9] lg:h-full lg:min-h-0">
      {/* Top bar */}
      <header className="lesson-editor-topbar flex flex-wrap items-center gap-3 border-b border-black/10 bg-white px-4 py-3 shadow-sm sm:px-5">
        <button
          type="button"
          onClick={() => setMobileOutlineOpen(true)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#185FA5] hover:text-[#185FA5] lg:hidden"
          title="Open curriculum outline"
          aria-label="Open curriculum outline"
        >
          <Icons.List size={15} />
        </button>
        <button
          type="button"
          onClick={() => setOutlineCollapsed((value) => !value)}
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#185FA5] hover:text-[#185FA5] lg:flex"
          title={outlineCollapsed ? "Expand curriculum outline" : "Collapse curriculum outline"}
          aria-label={outlineCollapsed ? "Expand curriculum outline" : "Collapse curriculum outline"}
        >
          {outlineCollapsed ? <Icons.PanelRight size={15} /> : <Icons.PanelLeft size={15} />}
        </button>
        <Link
          href="/admin/courses"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors shrink-0"
        >
          <Icons.ArrowLeft size={13} />
          All courses
        </Link>
        <span className="text-slate-200">/</span>
        <div className="flex items-center gap-2 min-w-0">
          <Icons.GraduationCap size={16} className="text-[#185FA5] shrink-0" />
          <span className="font-bold text-slate-900 text-sm truncate">{course.title}</span>
          <PublishBadge isPublished={course.isPublished} />
        </div>
        <div className="min-w-6 flex-1" />
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowReadinessSummary((v) => !v)}
            className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-700 transition-colors"
            title="Course readiness summary"
          >
            <Icons.BarChart3 size={13} />
            <span>{publishedLessons}/{totalLessons} published</span>
            {readinessSummaryCounts.blocked > 0 && (
              <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-600">
                {readinessSummaryCounts.blocked} blocked
              </span>
            )}
          </button>
          {showReadinessSummary && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-20"
                onClick={() => setShowReadinessSummary(false)}
                aria-label="Close readiness summary"
              />
              <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-black/10 bg-white shadow-xl p-4 space-y-2">
                <p className="text-xs font-bold text-slate-800">Course readiness</p>
                {(["published", "ready", "blocked", "draft"] as OutlineFilter[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => { setOutlineFilter(f); setShowReadinessSummary(false); }}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs hover:bg-slate-50 transition-colors"
                  >
                    <span className={cn("capitalize font-medium", f === "blocked" ? "text-red-600" : f === "ready" ? "text-emerald-600" : "text-slate-600")}>{f}</span>
                    <span className="font-bold text-slate-700">{readinessSummaryCounts[f]}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Mode toggle */}
        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
          {(["edit", "review", "preview"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => void handleModeChange(m)}
              className={cn(
                "flex items-center gap-1.5 rounded px-3 py-1.5 transition-colors",
                mode === m
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {m === "edit" ? <Icons.Pencil size={12} /> : m === "review" ? <Icons.LayoutDashboard size={12} /> : <Icons.Eye size={12} />}
              {m === "edit" ? "Edit" : m === "review" ? "Review" : "Preview"}
            </button>
          ))}
        </div>
        {mode === "edit" && (
          <button
            type="button"
            onClick={() => setFocusMode((v) => !v)}
            title={focusMode ? "Exit focus mode" : "Focus mode — hide navigation"}
            className={cn(
              "hidden lg:flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
              focusMode
                ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]"
                : "border-slate-200 text-slate-400 hover:border-[#185FA5] hover:text-[#185FA5]"
            )}
          >
            {focusMode ? <Icons.Minimize2 size={14} /> : <Icons.Maximize2 size={14} />}
          </button>
        )}
      </header>

      {notice && (
        <div className={`flex items-center gap-2 px-5 py-2 text-xs font-medium ${notice.type === "success" ? "bg-emerald-50 text-emerald-800 border-b border-emerald-200" : "bg-red-50 text-red-700 border-b border-red-200"}`}>
          {notice.type === "success" ? <Icons.Check size={13} /> : <Icons.X size={13} />}
          {notice.text}
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-visible lg:flex-row lg:overflow-hidden">
        {mobileOutlineOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/30"
              onClick={() => setMobileOutlineOpen(false)}
              aria-label="Close curriculum outline"
            />
            <aside className="absolute inset-y-0 left-0 w-[min(22rem,88vw)] overflow-y-auto border-r border-black/10 bg-white shadow-xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-400">Curriculum</p>
                  <p className="text-xs font-semibold text-slate-700">{totalLessons} lessons</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOutlineOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#185FA5] hover:text-[#185FA5]"
                  aria-label="Close curriculum outline"
                >
                  <Icons.X size={14} />
                </button>
              </div>
              <div className="space-y-1 p-3">
                <OutlineFilterBar
                  activeFilter={outlineFilter}
                  onChange={setOutlineFilter}
                  counts={computeFilterCounts(modules.flatMap((m) => m.lessons))}
                />
                {modules.map((mod) => (
                  <ModuleSidebarSection
                    key={mod.id}
                    module={mod}
                    compact={false}
                    expanded={expandedModules.has(mod.id)}
                    selectedLessonId={selectedLessonId}
                    activeFilter={outlineFilter}
                    onToggle={() => toggleModule(mod.id)}
                    onSelectLesson={selectLesson}
                    onAddLesson={() => addLesson(mod.id)}
                  />
                ))}
                <button
                  type="button"
                  onClick={addModule}
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                >
                  <Icons.Plus size={12} />
                  Add module
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Sidebar: module/lesson outline */}
        <aside
          className={cn(
            "lesson-editor-outline hidden shrink-0 overflow-y-auto border-r border-black/10 bg-white transition-[width] duration-200 lg:block",
            outlineCollapsed ? "w-[5.25rem]" : "w-72"
          )}
        >
          <div className={cn("space-y-1", outlineCollapsed ? "p-2" : "p-3")}>
            <div className={cn("mb-2 flex items-center gap-2", outlineCollapsed ? "justify-center" : "justify-between px-1")}>
              {!outlineCollapsed && (
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-400">Curriculum</p>
                  <p className="text-xs font-semibold text-slate-700">{totalLessons} lessons</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => setOutlineCollapsed((value) => !value)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#185FA5] hover:text-[#185FA5]"
                title={outlineCollapsed ? "Expand curriculum outline" : "Collapse curriculum outline"}
                aria-label={outlineCollapsed ? "Expand curriculum outline" : "Collapse curriculum outline"}
              >
                {outlineCollapsed ? <Icons.PanelRight size={14} /> : <Icons.PanelLeft size={14} />}
              </button>
            </div>
            {!outlineCollapsed && (
              <OutlineFilterBar
                activeFilter={outlineFilter}
                onChange={setOutlineFilter}
                counts={computeFilterCounts(modules.flatMap((m) => m.lessons))}
              />
            )}
            {modules.map((mod) => (
              <ModuleSidebarSection
                key={mod.id}
                module={mod}
                compact={outlineCollapsed}
                expanded={expandedModules.has(mod.id)}
                selectedLessonId={selectedLessonId}
                activeFilter={outlineFilter}
                onToggle={() => toggleModule(mod.id)}
                onSelectLesson={selectLesson}
                onAddLesson={() => addLesson(mod.id)}
              />
            ))}
            <button
              type="button"
              onClick={addModule}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg text-xs font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700",
                outlineCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"
              )}
              title="Add module"
            >
              <Icons.Plus size={12} />
              {!outlineCollapsed && "Add module"}
            </button>
          </div>
        </aside>

        {/* Main content area */}
        <main className="min-w-0 flex-1 overflow-visible p-3 sm:p-5 lg:overflow-hidden">
          {!selectedLessonForDisplay ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Icons.BookOpen size={40} className="mx-auto text-slate-200 mb-3" />
                <p className="text-sm text-slate-400">Select a lesson from the sidebar to edit it.</p>
              </div>
            </div>
          ) : (
            <LessonDetailPanel
              lesson={selectedLessonForDisplay}
              mode={mode}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onUpdate={(updates) => handleLessonUpdate(selectedLessonForDisplay.id, updates)}
              onReload={reload}
              editorRef={contentEditorRef}
              onContentChange={(contentJson) => handleContentChange(selectedLessonForDisplay.id, contentJson)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function OutlineFilterBar({
  activeFilter,
  onChange,
  counts,
}: {
  activeFilter: OutlineFilter;
  onChange: (f: OutlineFilter) => void;
  counts: Record<OutlineFilter, number>;
}) {
  const filters: Array<{ value: OutlineFilter; label: string; color?: string }> = [
    { value: "all", label: "All" },
    { value: "blocked", label: "Blocked", color: "text-red-600" },
    { value: "ready", label: "Ready", color: "text-emerald-600" },
    { value: "published", label: "Published", color: "text-blue-600" },
    { value: "missing-media", label: "No media" },
    { value: "missing-transcript", label: "No transcript" },
  ];
  return (
    <div className="flex flex-wrap gap-1 mb-2 px-1">
      {filters.map(({ value, label, color }) => {
        const count = counts[value];
        if (value !== "all" && count === 0) return null;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors",
              activeFilter === value
                ? "bg-[#185FA5] text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            )}
          >
            {label}
            {value !== "all" && <span className="ml-1 opacity-70">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

function ModuleReadinessBadge({ lessons }: { lessons: LessonData[] }) {
  if (lessons.length === 0) return null;
  const ready = lessons.filter((l) => l.isPublished || getLessonReadinessTone(l) === "ready").length;
  const tone = ready === lessons.length ? "ready" : ready > 0 ? "warn" : "blocked";
  return (
    <span className={cn(
      "text-[10px] font-semibold rounded-full px-1.5 py-0.5",
      tone === "ready" ? "bg-emerald-100 text-emerald-700" :
      tone === "warn" ? "bg-amber-100 text-amber-700" :
      "bg-red-100 text-red-600"
    )}>
      {ready}/{lessons.length}
    </span>
  );
}

function ModuleSidebarSection({
  module,
  compact,
  expanded,
  selectedLessonId,
  activeFilter,
  onToggle,
  onSelectLesson,
  onAddLesson,
}: {
  module: ModuleData;
  compact: boolean;
  expanded: boolean;
  selectedLessonId: string | null;
  activeFilter: OutlineFilter;
  onToggle: () => void;
  onSelectLesson: (id: string) => void;
  onAddLesson: () => void;
}) {
  if (compact) {
    return (
      <div className="space-y-1">
        <button
          type="button"
          onClick={onToggle}
          className="flex h-9 w-full items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
          title={`${expanded ? "Collapse" : "Expand"} ${module.title}`}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${module.title}`}
        >
          <Icons.BookMarked size={15} />
        </button>
        {expanded && (
          <div className="space-y-1">
            {module.lessons.map((lesson) => (
              <LessonSidebarButton
                key={lesson.id}
                lesson={lesson}
                selected={selectedLessonId === lesson.id}
                compact
                onSelect={() => onSelectLesson(lesson.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const filteredLessons = module.lessons.filter((l) => lessonMatchesFilter(l, activeFilter));
  const isFiltering = activeFilter !== "all";

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
      >
        {expanded ? (
          <Icons.ChevronDown size={12} className="shrink-0 text-slate-400" />
        ) : (
          <Icons.ChevronRight size={12} className="shrink-0 text-slate-400" />
        )}
        <Icons.BookMarked size={13} className="shrink-0 text-slate-400" />
        <span className="flex-1 truncate">{module.title}</span>
        <ModuleReadinessBadge lessons={module.lessons} />
      </button>

      {expanded && (
        <div className="ml-4 space-y-0.5 mt-0.5">
          {filteredLessons.length === 0 && isFiltering ? (
            <p className="px-2 py-1.5 text-[10px] text-slate-400 italic">0 matches in this module</p>
          ) : (
            filteredLessons.map((lesson) => (
              <LessonSidebarButton
                key={lesson.id}
                lesson={lesson}
                selected={selectedLessonId === lesson.id}
                compact={false}
                onSelect={() => onSelectLesson(lesson.id)}
              />
            ))
          )}
          {!isFiltering && (
            <button
              type="button"
              onClick={onAddLesson}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
            >
              <Icons.Plus size={10} />
              Add lesson
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function LessonSidebarButton({
  lesson,
  selected,
  compact = false,
  onSelect,
}: {
  lesson: LessonData;
  selected: boolean;
  compact?: boolean;
  onSelect: () => void;
}) {
  const insight = getLessonSidebarInsight(lesson);

  if (compact) {
    return (
      <button
        type="button"
        onClick={onSelect}
        title={`${lesson.title} - ${insight.readinessLabel}`}
        className={cn(
          "flex h-10 w-full items-center justify-center rounded-xl border transition-colors",
          selected
            ? "border-[#b8d7f0] bg-[#E6F1FB] text-[#185FA5]"
            : "border-transparent text-slate-400 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700"
        )}
      >
        <LessonTypeIcon type={lesson.lessonType} size={15} className={selected ? "text-[#185FA5]" : "text-slate-400"} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border px-2.5 py-2 text-left transition-colors",
        selected
          ? "border-[#b8d7f0] bg-[#E6F1FB] text-[#185FA5]"
          : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <div className="flex items-start gap-2">
        <LessonStatusDot lesson={lesson} />
        <LessonTypeIcon type={lesson.lessonType} size={11} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-xs font-semibold">{lesson.title}</span>
            <LessonTypeBadgeTiny type={lesson.lessonType} />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-slate-400">{insight.durationLabel}</span>
            <span className="text-[10px] text-slate-300">•</span>
            <span className={cn(
              "text-[10px] font-bold",
              insight.readinessTone === "ready" && "text-emerald-600",
              insight.readinessTone === "warn" && "text-amber-600",
              insight.readinessTone === "blocked" && "text-red-500"
            )}>
              {insight.readinessLabel}
            </span>
            {insight.blockCountLabel && (
              <>
                <span className="text-[10px] text-slate-300">•</span>
                <span className="text-[10px] text-slate-400">{insight.blockCountLabel}</span>
              </>
            )}
            {lesson.sourceMaterial && (
              <span title={`Source: ${lesson.sourceMaterial.title}`} className="flex items-center gap-0.5 text-[10px] text-[#185FA5]">
                <Icons.Database size={9} />
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Preview Validation Panel ─────────────────────────────────────────────────

function LessonPreviewValidationPanel({
  lesson,
  onTabChange,
}: {
  lesson: LessonData;
  onTabChange: (tab: TabId) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const quizReadiness =
    lesson.lessonType === "quiz" && lesson.quiz
      ? getQuizReadiness(lesson.quiz.questionCount ?? 0, lesson.quiz.incompleteQuestionCount ?? 0)
      : undefined;

  const doc = parseStructuredLessonContent(lesson.contentJson ?? null);
  const hasVideoTranscript = !doc.blocks.some(
    (b) => b.isStudentVisible && b.type === "video" && !b.transcript?.trim()
  );
  const hasAudioTranscript = !doc.blocks.some(
    (b) => b.isStudentVisible && b.type === "audio" && !b.transcript?.trim()
  );
  const hasVideoBlocks = doc.blocks.some((b) => b.type === "video" && b.isStudentVisible);
  const hasAudioBlocks = doc.blocks.some((b) => b.type === "audio" && b.isStudentVisible);

  type CheckRow = {
    label: string;
    pass: boolean;
    skip?: boolean;
    action?: { label: string; tab: TabId };
  };

  const checks: CheckRow[] = [
    { label: "Title present", pass: !!lesson.title.trim() },
    {
      label: "Video source attached",
      pass: !!(lesson.videoPlaybackId || lesson.videoUrl),
      skip: lesson.lessonType !== "video",
      action: { label: "Go to Structure", tab: "content" },
    },
    {
      label: "Video transcript present",
      pass: hasVideoTranscript,
      skip: !hasVideoBlocks,
      action: { label: "Go to Structure", tab: "content" },
    },
    {
      label: "Audio transcript present",
      pass: hasAudioTranscript,
      skip: !hasAudioBlocks,
      action: { label: "Go to Structure", tab: "content" },
    },
    {
      label: "Quiz linked and complete",
      pass: !!(lesson.quiz && quizReadiness === "ready"),
      skip: lesson.lessonType !== "quiz",
      action: { label: "Go to Assessment", tab: "questions" },
    },
    {
      label: "Source material linked",
      pass: !!lesson.sourceMaterial,
      skip: lesson.lessonType !== "source",
      action: { label: "Go to Resources", tab: "resources" },
    },
    {
      label: "Duration set",
      pass: !!(lesson.durationSeconds),
      action: { label: "Go to Publishing", tab: "settings" },
    },
    {
      label: "Lesson is published",
      pass: lesson.isPublished,
      action: { label: "Go to Publishing", tab: "settings" },
    },
  ];

  const visible = checks.filter((c) => !c.skip);
  const failing = visible.filter((c) => !c.pass);

  useEffect(() => {
    setCollapsed(failing.length === 0);
  }, [lesson.id]);

  return (
    <div className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        <Icons.ShieldCheck size={15} className={failing.length === 0 ? "text-emerald-500" : "text-amber-500"} />
        <span className="text-xs font-bold text-slate-800 flex-1">Lesson health check</span>
        {failing.length === 0 ? (
          <span className="text-[10px] font-semibold text-emerald-600">All checks passed</span>
        ) : (
          <span className="text-[10px] font-semibold text-amber-600">{failing.length} issue{failing.length !== 1 ? "s" : ""}</span>
        )}
        <Icons.ChevronDown size={13} className={cn("text-slate-400 transition-transform", collapsed && "rotate-180")} />
      </button>
      {!collapsed && (
        <div className="border-t border-slate-100 divide-y divide-slate-50">
          {visible.map((check) => (
            <div key={check.label} className="flex items-center gap-3 px-4 py-2.5">
              {check.pass ? (
                <Icons.Check size={13} className="text-emerald-500 shrink-0" />
              ) : (
                <Icons.X size={13} className="text-red-500 shrink-0" />
              )}
              <span className={cn("text-xs flex-1", check.pass ? "text-slate-600" : "text-slate-800 font-medium")}>
                {check.label}
              </span>
              {!check.pass && check.action && (
                <button
                  type="button"
                  onClick={() => onTabChange(check.action!.tab)}
                  className="text-[11px] font-semibold text-[#185FA5] hover:underline shrink-0"
                >
                  {check.action.label} →
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Lesson Detail Panel ──────────────────────────────────────────────────────

type SaveStatusCombined = "saved" | "unsaved" | "saving" | "error";

function LessonSaveStatusBar({
  contentStatus,
  metaStatus,
}: {
  contentStatus: SaveStatusCombined;
  metaStatus: SaveStatusCombined;
}) {
  const combined: SaveStatusCombined =
    contentStatus === "error" || metaStatus === "error" ? "error" :
    contentStatus === "saving" || metaStatus === "saving" ? "saving" :
    contentStatus === "unsaved" || metaStatus === "unsaved" ? "unsaved" :
    "saved";

  const borderColor =
    combined === "saved" ? "border-emerald-400" :
    combined === "saving" ? "border-slate-300" :
    combined === "unsaved" ? "border-amber-400" :
    "border-red-400";

  const label =
    combined === "saved" ? "All changes saved" :
    combined === "saving" ? "Saving…" :
    combined === "unsaved" ? "Unsaved changes" :
    "Save error — try again";

  const textColor =
    combined === "saved" ? "text-emerald-600" :
    combined === "saving" ? "text-slate-400" :
    combined === "unsaved" ? "text-amber-600" :
    "text-red-600";

  return (
    <div className={cn("flex items-center gap-2 border-l-2 pl-3 py-0.5 text-[11px] font-medium transition-colors", borderColor, textColor)}>
      {combined === "saving" ? (
        <Icons.Loader size={11} className="animate-spin" />
      ) : combined === "saved" ? (
        <Icons.Check size={11} />
      ) : combined === "unsaved" ? (
        <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
      ) : (
        <Icons.AlertCircle size={11} />
      )}
      {label}
    </div>
  );
}

function LessonDetailPanel({
  lesson,
  mode,
  activeTab,
  onTabChange,
  onUpdate,
  onReload,
  editorRef,
  onContentChange,
}: {
  lesson: LessonData;
  mode: PreviewMode;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onUpdate: (updates: Record<string, unknown>) => Promise<void>;
  onReload: () => Promise<void>;
  editorRef: React.RefObject<LessonBuilderEditorHandle | null>;
  onContentChange: (contentJson: string) => void;
}) {
  const [contentSaveStatus, setContentSaveStatus] = useState<SaveStatusCombined>("saved");
  const [metaSaveStatus, setMetaSaveStatus] = useState<SaveStatusCombined>("saved");

  const tabs: { id: TabId; label: string; icon: React.ComponentType<any>; show: boolean }[] = [
    { id: "content", label: "Structure", icon: Icons.FileText, show: true },
    { id: "questions", label: "Assessment", icon: Icons.ClipboardList, show: lesson.lessonType === "quiz" },
    { id: "resources", label: "Resources", icon: Icons.Database, show: true },
    { id: "settings", label: "Publishing", icon: Icons.Settings, show: true },
  ];
  const visibleTabs = tabs.filter((t) => t.show);
  const showInlinePreview = mode === "review" && activeTab === "content";

  if (mode === "preview") {
    return (
      <div className="mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col">
        <div className="shrink-0 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <LessonTypeIcon type={lesson.lessonType} size={16} className="shrink-0 text-[#185FA5]" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-400">Learner preview</p>
              <h1 className="truncate text-base font-extrabold text-slate-900">{lesson.title}</h1>
            </div>
            <PublishBadge isPublished={lesson.isPublished} />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pt-4">
          <LessonStudentPreview lesson={{ ...lesson, quiz: lesson.quiz ?? undefined }} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("mx-auto flex h-full min-h-0 w-full flex-col", showInlinePreview ? "max-w-5xl" : "max-w-4xl")}>
      {/* Lesson header */}
      <div className="lesson-editor-header shrink-0 rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          <LessonTypeIcon type={lesson.lessonType} size={18} className="text-[#185FA5]" />
          <h1 className="min-w-0 flex-1 truncate text-lg font-extrabold text-slate-900">{lesson.title}</h1>
          <div className="flex items-center gap-3">
            <LessonSaveStatusBar contentStatus={contentSaveStatus} metaStatus={metaSaveStatus} />
            <PublishBadge isPublished={lesson.isPublished} />
            <ReadinessDot lesson={lesson} />
          </div>
        </div>

        {/* Tabs — compact and sticky with the lesson identity */}
        <div className="flex gap-0 overflow-x-auto border-t border-slate-100 px-2">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors sm:px-4",
                  activeTab === tab.id
                    ? "border-[#185FA5] text-[#185FA5]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content / Preview */}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pt-4">
        {activeTab === "content" && (
          showInlinePreview ? (
            <div className="min-w-0 space-y-5">
              <ContentTab
                lesson={lesson}
                onUpdate={onUpdate}
                editorRef={editorRef}
                onContentChange={onContentChange}
                onSaveStatusChange={setContentSaveStatus}
                hideAuthorTools
              />
              <div className="min-w-0 space-y-3">
                <LessonPreviewValidationPanel lesson={lesson} onTabChange={onTabChange} />
                <div className="rounded-xl border border-[#b8d7f0] bg-[#f8fbff] px-4 py-3">
                  <div className="flex items-center gap-2 text-[#185FA5]">
                    <Icons.Eye size={15} />
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em]">Live learner preview</p>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Mirrors the learner-facing lesson from the current draft. Use this review view for flow and clarity checks.
                  </p>
                </div>
                <LessonStudentPreview lesson={{ ...lesson, quiz: lesson.quiz ?? undefined }} />
              </div>
            </div>
          ) : (
            <ContentTab
              lesson={lesson}
              onUpdate={onUpdate}
              editorRef={editorRef}
              onContentChange={onContentChange}
              onSaveStatusChange={setContentSaveStatus}
            />
          )
        )}
        {activeTab === "questions" && lesson.quiz && (
          <LessonQuizPanel quizId={lesson.quiz.id} />
        )}
        {activeTab === "resources" && (
          <ResourcesTab lesson={lesson} onUpdate={onUpdate} onReload={onReload} />
        )}
        {activeTab === "settings" && (
          <SettingsTab lesson={lesson} onUpdate={onUpdate} onReload={onReload} onSaveStatusChange={setMetaSaveStatus} />
        )}
      </div>
    </div>
  );
}

// ─── Content Tab ──────────────────────────────────────────────────────────────

function ContentTab({
  lesson,
  onUpdate,
  editorRef,
  onContentChange,
  onSaveStatusChange,
  hideAuthorTools = false,
}: {
  lesson: LessonData;
  onUpdate: (updates: Record<string, unknown>) => Promise<void>;
  editorRef: React.RefObject<LessonBuilderEditorHandle | null>;
  onContentChange: (contentJson: string) => void;
  onSaveStatusChange?: (status: SaveStatusCombined) => void;
  hideAuthorTools?: boolean;
}) {
  const [videoTab, setVideoTab] = useState<"upload" | "link">(
    lesson.videoUrl && !lesson.videoPlaybackId ? "link" : "upload"
  );
  const [videoPlaybackId, setVideoPlaybackId] = useState(lesson.videoPlaybackId ?? "");
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl ?? "");
  const [busy, setBusy] = useState(false);

  async function saveVideo() {
    setBusy(true);
    await onUpdate({
      videoPlaybackId: videoTab === "upload" ? (videoPlaybackId || null) : null,
      videoUrl: videoTab === "link" ? (videoUrl || null) : null,
    });
    setBusy(false);
  }

  if (lesson.lessonType === "text") {
    return (
      <LessonBuilderEditor
        ref={editorRef}
        lessonId={lesson.id}
        initialContent={lesson.contentJson ?? null}
        onContentChange={onContentChange}
        onSaveStatusChange={onSaveStatusChange}
        hideAuthorTools={hideAuthorTools}
      />
    );
  }

  if (lesson.lessonType === "video") {
    return (
      <div className="rounded-xl border border-black/10 bg-white shadow-sm p-5 space-y-4">
        <div className="flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold w-48">
          {(["upload", "link"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setVideoTab(tab)}
              className={cn(
                "flex-1 rounded py-1.5 transition-colors",
                videoTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab === "upload" ? "Upload" : "Paste link"}
            </button>
          ))}
        </div>

        {videoTab === "upload" ? (
          <div className="space-y-2">
            <VideoUpload
              currentPlaybackId={videoPlaybackId || null}
              onPlaybackId={(id) => setVideoPlaybackId(id)}
            />
            <input
              className="admin-input font-mono text-xs"
              value={videoPlaybackId}
              onChange={(e) => setVideoPlaybackId(e.target.value)}
              placeholder="Or enter Mux playback ID…"
            />
          </div>
        ) : (
          <VideoLinkInput value={videoUrl} onChange={setVideoUrl} />
        )}

        <button
          type="button"
          onClick={saveVideo}
          disabled={busy}
          className="admin-action flex items-center gap-1.5 text-xs"
        >
          {busy ? <Icons.Loader size={12} className="animate-spin" /> : <Icons.Check size={12} />}
          Save video
        </button>
      </div>
    );
  }

  if (lesson.lessonType === "quiz") {
    return (
      <div className="rounded-xl border border-black/10 bg-white shadow-sm p-5">
        <p className="text-sm text-slate-600">
          This is a quiz lesson.{" "}
          {lesson.quiz ? (
            <>Linked quiz: <strong>{lesson.quiz.title}</strong></>
          ) : (
            "No quiz linked — use the Settings tab to link one."
          )}
        </p>
        {lesson.quiz && (
          <p className="text-xs text-slate-400 mt-1">
            Switch to the <strong>Questions</strong> tab to view and edit quiz questions.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-400">
      No content editor for lesson type "{lesson.lessonType}".
    </div>
  );
}

// ─── Resources Tab ────────────────────────────────────────────────────────────

interface ResourceMaterial {
  id: string;
  title: string;
  kind?: string;
  pages?: number | null;
  fileType?: string;
  previewSnippet?: string;
  status?: string;
  displayStatus?: string;
  sizeBytes?: number;
  characters?: number;
}

interface LinkedMaterialEntry {
  linkId: string;
  materialId: string;
  title: string;
  kind?: string;
  status?: string;
  displayStatus?: string;
  referenceLabel?: string | null;
}

const KIND_FILTERS = [
  { value: "", label: "All" },
  { value: "document", label: "Doc" },
  { value: "audio", label: "Audio" },
  { value: "video", label: "Video" },
  { value: "image", label: "Image" },
] as const;

function formatBytes(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function kindIcon(kind?: string) {
  if (kind === "video") return Icons.Video;
  if (kind === "audio") return Icons.FileText;
  if (kind === "image") return Icons.BookOpen;
  return Icons.FileText;
}

function kindLabel(kind?: string) {
  if (!kind) return "Doc";
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

function StatusBadge({ status, displayStatus }: { status?: string; displayStatus?: string }) {
  const s = displayStatus ?? status ?? "";
  if (s === "parsed" || s === "uploaded" && !displayStatus) {
    return null; // ready — no noise
  }
  if (s.includes("fail") || s.includes("error") || s.includes("ocr")) {
    return (
      <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-red-600">
        Parse failed
      </span>
    );
  }
  if (s === "uploaded" || s === "processing" || s === "pending") {
    return (
      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700">
        Processing…
      </span>
    );
  }
  return null;
}

function ResourcesTab({
  lesson,
  onUpdate,
  onReload,
}: {
  lesson: LessonData;
  onUpdate: (updates: Record<string, unknown>) => Promise<void>;
  onReload: () => Promise<void>;
}) {
  // Browse library state
  const [materials, setMaterials] = useState<ResourceMaterial[]>([]);
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Linked materials state (ContentSourceLinks for this lesson)
  const [linkedMaterials, setLinkedMaterials] = useState<LinkedMaterialEntry[]>([]);
  const [linkedLoaded, setLinkedLoaded] = useState(false);

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Hover snippet state
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const LIMIT = 30;

  function loadLinked() {
    if (!lesson.id) return;
    fetch(`/api/admin/materials?lessonId=${lesson.id}&limit=100`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { materials: [] }))
      .then((data) => {
        const entries: LinkedMaterialEntry[] = [];
        for (const m of data.materials ?? []) {
          for (const link of m.links ?? []) {
            entries.push({
              linkId: link.id,
              materialId: m.id,
              title: m.title,
              kind: m.kind,
              status: m.status,
              displayStatus: m.displayStatus,
              referenceLabel: link.referenceLabel ?? null,
            });
          }
        }
        setLinkedMaterials(entries);
        setLinkedLoaded(true);
      })
      .catch(() => setLinkedLoaded(true));
  }

  function loadLibrary(pageNum: number, q: string, kind: string) {
    const params = new URLSearchParams({ limit: String(LIMIT), page: String(pageNum) });
    if (q.trim()) params.set("q", q.trim());
    if (kind) params.set("kind", kind);
    fetch(`/api/admin/materials?${params.toString()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { materials: [], pagination: {} }))
      .then((data) => {
        setMaterials(
          (data.materials ?? []).map((m: any) => ({
            id: m.id,
            title: m.title,
            kind: m.kind,
            pages: m.pages ?? null,
            fileType: m.fileType,
            previewSnippet: m.previewSnippet ?? "",
            status: m.status,
            displayStatus: m.displayStatus,
            sizeBytes: m.sizeBytes,
            characters: m.characters,
          }))
        );
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotalItems(data.pagination?.total ?? 0);
        setLibraryLoaded(true);
      })
      .catch(() => setLibraryLoaded(true));
  }

  useEffect(() => {
    loadLinked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  useEffect(() => {
    setLibraryLoaded(false);
    loadLibrary(page, query, kindFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query, kindFilter]);

  async function setPrimaryMaterial(materialId: string) {
    await onUpdate({ sourceMaterialId: materialId || null });
  }

  async function addLink(materialId: string) {
    const res = await fetch("/api/admin/materials/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ materialId, lessonId: lesson.id }),
    });
    if (res.ok) {
      loadLinked();
    }
  }

  async function removeLink(linkId: string) {
    const res = await fetch(`/api/admin/materials/link?id=${linkId}`, { method: "DELETE" });
    if (res.ok) {
      setLinkedMaterials((prev) => prev.filter((entry) => entry.linkId !== linkId));
    }
  }

  async function uploadAndLink() {
    if (!file || !uploadTitle.trim()) return;
    setBusy(true);
    const form = new FormData();
    form.set("title", uploadTitle.trim());
    form.set("file", file);
    const res = await fetch("/api/admin/materials", { method: "POST", body: form });
    if (res.ok) {
      const data = await res.json();
      await addLink(data.id);
      setFile(null);
      setUploadTitle("");
      setShowUpload(false);
      setLibraryLoaded(false);
      loadLibrary(1, query, kindFilter);
    } else {
      const text = await res.text();
      let message = "Upload failed.";
      try {
        const parsed = JSON.parse(text) as { error?: string };
        message = parsed.error ?? message;
      } catch {
        if (text) message = text;
      }
      alert(message);
    }
    setBusy(false);
  }

  const alreadyLinkedIds = new Set(linkedMaterials.map((entry) => entry.materialId));
  const primaryId = lesson.sourceMaterial?.id;

  return (
    <div className="space-y-4">
      {/* Linked materials */}
      <div className="rounded-xl border border-black/10 bg-white shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Icons.Database size={15} className="text-[#185FA5]" />
            Attached materials
          </h3>
          <a
            href="/admin/materials"
            className="flex items-center gap-1 text-[11px] font-semibold text-[#185FA5] hover:underline"
          >
            <Icons.ExternalLink size={11} />
            Manage library
          </a>
        </div>

        {!linkedLoaded ? (
          <div className="flex items-center gap-2 py-2 text-xs text-slate-400">
            <Icons.Loader size={13} className="animate-spin" />
            Loading…
          </div>
        ) : linkedMaterials.length === 0 && !lesson.sourceMaterial ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
            <Icons.Database size={22} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs text-slate-500 font-medium">No materials attached yet.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Search the library below to attach an existing file, or upload a new one and it will be linked automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {lesson.sourceMaterial && (
              <div className="rounded-xl border border-[#b8d7f0] bg-[#E6F1FB]/40 px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E6F1FB] text-[#185FA5]">
                    <Icons.Database size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{lesson.sourceMaterial.title}</p>
                    <p className="text-[10px] text-[#185FA5] font-medium mt-0.5">Primary attachment</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrimaryMaterial("")}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold shrink-0"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
            {linkedMaterials.map((entry) => {
              const Icon = kindIcon(entry.kind);
              return (
                <div key={entry.linkId} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500">
                    <Icon size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{entry.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500">
                        {kindLabel(entry.kind)}
                      </span>
                      <StatusBadge status={entry.status} displayStatus={entry.displayStatus} />
                      {entry.referenceLabel && (
                        <span className="text-[10px] text-slate-400 italic truncate max-w-[120px]">{entry.referenceLabel}</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(entry.linkId)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold shrink-0"
                  >
                    Unlink
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Browse library */}
      <div className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Icons.Link size={15} className="text-[#185FA5]" />
            Attach from library
          </h3>
          {/* Kind filter strip */}
          <div className="flex gap-1 flex-wrap">
            {KIND_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => { setKindFilter(f.value); setPage(1); }}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-bold transition",
                  kindFilter === f.value
                    ? "bg-[#185FA5] text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search materials…"
            className="admin-input"
          />
        </div>
        <div className="divide-y divide-slate-100">
          {!libraryLoaded ? (
            <div className="flex items-center justify-center py-10 text-xs text-slate-400">
              <Icons.Loader size={14} className="animate-spin mr-2" />
              Loading library…
            </div>
          ) : materials.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              {query ? "No materials match your search." : "No materials in your library yet."}
            </div>
          ) : (
            <>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {materials.map((material) => {
                  const Icon = kindIcon(material.kind);
                  const isLinked = alreadyLinkedIds.has(material.id);
                  const isPrimary = primaryId === material.id;
                  const isHovered = hoveredId === material.id;
                  return (
                    <div
                      key={material.id}
                      className={cn(
                        "relative flex items-start gap-3 px-5 py-3 transition",
                        isLinked || isPrimary ? "bg-[#E6F1FB]/30" : "hover:bg-slate-50"
                      )}
                      onMouseEnter={() => setHoveredId(material.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <Icon size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{material.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500">
                            {kindLabel(material.kind)}
                          </span>
                          {material.pages ? <span className="text-[10px] text-slate-400">{material.pages}p</span> : null}
                          <StatusBadge status={material.status} displayStatus={material.displayStatus} />
                        </div>
                        {/* Snippet preview on hover */}
                        {isHovered && material.previewSnippet && (
                          <p className="mt-1.5 text-[10px] text-slate-500 leading-4 line-clamp-2">
                            {material.previewSnippet}
                          </p>
                        )}
                        {isHovered && (material.sizeBytes || material.characters) && (
                          <div className="flex items-center gap-2 mt-0.5">
                            {material.sizeBytes ? <span className="text-[10px] text-slate-400">{formatBytes(material.sizeBytes)}</span> : null}
                            {material.characters ? <span className="text-[10px] text-slate-400">{material.characters.toLocaleString()} chars</span> : null}
                          </div>
                        )}
                      </div>
                      {isLinked || isPrimary ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#185FA5] shrink-0">
                          <Icons.Check size={12} />
                          Attached
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addLink(material.id)}
                          className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5]"
                        >
                          Attach
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">{totalItems} materials</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="text-[11px] font-semibold text-slate-500 disabled:opacity-40 hover:text-[#185FA5]"
                    >
                      ← Prev
                    </button>
                    <span className="text-[10px] text-slate-400">{page} / {totalPages}</span>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="text-[11px] font-semibold text-slate-500 disabled:opacity-40 hover:text-[#185FA5]"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload new */}
      <div className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowUpload((v) => !v)}
          className="flex w-full items-center gap-2 px-5 py-4 text-left"
        >
          <Icons.Upload size={15} className="text-[#185FA5]" />
          <span className="text-sm font-bold text-slate-900 flex-1">Upload new file</span>
          <Icons.ChevronDown size={14} className={cn("text-slate-400 transition-transform", showUpload && "rotate-180")} />
        </button>
        {showUpload && (
          <div className="border-t border-slate-100 px-5 py-4 space-y-3">
            <input
              className="admin-input"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="File title…"
            />
            <label className="flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#185FA5]/40 bg-[#E6F1FB]/30 text-center text-xs text-slate-500 px-4 py-3">
              <Icons.Upload size={18} className="text-[#185FA5] mb-1.5" />
              <span className="font-semibold text-[#185FA5]">{file ? file.name : "Drop or choose file"}</span>
              <span>PDF, DOCX, CSV, MP3, MP4, TXT</span>
              <input
                type="file"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setFile(f);
                  if (f && !uploadTitle) setUploadTitle(f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
                }}
              />
            </label>
            <button
              type="button"
              onClick={uploadAndLink}
              disabled={busy || !file || !uploadTitle.trim()}
              className="admin-action w-full flex items-center justify-center gap-2 text-sm"
            >
              {busy ? <Icons.Loader size={13} className="animate-spin" /> : <Icons.Upload size={13} />}
              Upload and attach
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({
  lesson,
  onUpdate,
  onReload,
  onSaveStatusChange,
}: {
  lesson: LessonData;
  onUpdate: (updates: Record<string, unknown>) => Promise<void>;
  onReload: () => Promise<void>;
  onSaveStatusChange?: (status: SaveStatusCombined) => void;
}) {
  const [title, setTitle] = useState(lesson.title);
  const [lessonType, setLessonType] = useState(lesson.lessonType);
  const [duration, setDuration] = useState(
    lesson.durationSeconds ? String(Math.round(lesson.durationSeconds / 60)) : ""
  );
  const [isPublished, setIsPublished] = useState(lesson.isPublished);
  const [quizzes, setQuizzes] = useState<Array<{ id: string; title: string }>>([]);
  const [selectedQuizId, setSelectedQuizId] = useState(lesson.quiz?.id ?? "");
  const [quizzesLoaded, setQuizzesLoaded] = useState(false);
  const [versionNote, setVersionNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPublishWarning, setShowPublishWarning] = useState(false);

  async function loadQuizzes() {
    if (quizzesLoaded) return;
    const res = await fetch("/api/admin/overview", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setQuizzes(data.quizzes ?? []);
    }
    setQuizzesLoaded(true);
  }

  function readinessIssues() {
    return runLessonPreflight({
      lessonId: lesson.id,
      title,
      lessonType,
      contentJson: lesson.contentJson,
      videoPlaybackId: lesson.videoPlaybackId,
      videoUrl: lesson.videoUrl,
      quiz: lesson.quiz ? { id: lesson.quiz.id } : null,
      sourceMaterialId: lesson.sourceMaterial?.id ?? null,
    });
  }

  async function save() {
    const wouldPublish = isPublished && !lesson.isPublished;
    if (wouldPublish) {
      const preflight = readinessIssues();
      if (!preflight.isReady) {
        setShowPublishWarning(true);
        return;
      }
    }
    setBusy(true);
    onSaveStatusChange?.("saving");
    await onUpdate({
      title,
      lessonType,
      quizId: lessonType === "quiz" ? (selectedQuizId || null) : null,
      durationSeconds: duration ? parseInt(duration) * 60 : null,
      isPublished,
      status: isPublished ? "published" : "draft",
      versionNote: versionNote || null,
      saveVersion: lesson.isPublished,
    });
    onSaveStatusChange?.("saved");
    setBusy(false);
    setVersionNote("");
  }

  async function forcePublish() {
    setShowPublishWarning(false);
    setBusy(true);
    onSaveStatusChange?.("saving");
    await onUpdate({
      title,
      lessonType,
      quizId: lessonType === "quiz" ? (selectedQuizId || null) : null,
      durationSeconds: duration ? parseInt(duration) * 60 : null,
      isPublished,
      status: isPublished ? "published" : "draft",
      saveVersion: lesson.isPublished,
      versionNote: versionNote || null,
    });
    onSaveStatusChange?.("saved");
    setBusy(false);
  }

  const preflightResult = readinessIssues();

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-black/10 bg-white shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Icons.Settings size={15} className="text-[#185FA5]" />
          Lesson settings
        </h3>

        <div>
          <label className="admin-label">Title</label>
          <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="admin-label">Type</label>
            <select className="admin-input" value={lessonType} onChange={(e) => setLessonType(e.target.value)}>
              <option value="text">Structured lesson</option>
              <option value="video">Video</option>
              <option value="quiz">Quiz</option>
              <option value="source">Source material</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Duration (minutes)</label>
            <input
              type="number"
              className="admin-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 5"
              min="0"
            />
          </div>
        </div>

        {lessonType === "quiz" && (
          <div>
            <label className="admin-label">Linked quiz</label>
            <select
              className="admin-input"
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
              onFocus={loadQuizzes}
            >
              <option value="">— Select quiz —</option>
              {quizzes.map((q) => (
                <option key={q.id} value={q.id}>{q.title}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="admin-label">Publish status</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPublished((v) => !v)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                isPublished ? "bg-emerald-500" : "bg-slate-200"
              )}
            >
              <span className={cn("absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform", isPublished && "translate-x-5")} />
            </button>
            <span className={cn("text-sm font-semibold", isPublished ? "text-emerald-700" : "text-slate-500")}>
              {isPublished ? "Published — visible to students" : "Draft — hidden from students"}
            </span>
          </div>
        </div>

        {lesson.isPublished && (
          <div>
            <label className="admin-label">Version note (optional)</label>
            <input
              className="admin-input text-xs"
              value={versionNote}
              onChange={(e) => setVersionNote(e.target.value)}
              placeholder="What changed in this edit…"
            />
          </div>
        )}

        {/* Readiness check */}
        {(preflightResult.blockers.length > 0 || preflightResult.warnings.length > 0) && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 space-y-1">
            <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <Icons.AlertTriangle size={13} />
              Before publishing, resolve:
            </p>
            {preflightResult.blockers.map((b) => (
              <p key={b} className="text-xs text-red-700 pl-5">✕ {b}</p>
            ))}
            {preflightResult.warnings.map((w) => (
              <p key={w} className="text-xs text-amber-700 pl-5">⚠ {w}</p>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="admin-action w-full flex items-center justify-center gap-2"
        >
          {busy ? <Icons.Loader size={13} className="animate-spin" /> : <Icons.Check size={13} />}
          Save settings
        </button>
      </div>

      {/* Publish warning dialog */}
      {showPublishWarning && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 space-y-3">
          <p className="text-sm font-bold text-amber-900">
            This lesson has issues that may affect learners. Review before publishing.
          </p>
          {preflightResult.blockers.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Blockers</p>
              <ul className="list-disc pl-5 space-y-1">
                {preflightResult.blockers.map((b) => (
                  <li key={b} className="text-xs text-red-800">{b}</li>
                ))}
              </ul>
            </div>
          )}
          {preflightResult.warnings.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Warnings</p>
              <ul className="list-disc pl-5 space-y-1">
                {preflightResult.warnings.map((w) => (
                  <li key={w} className="text-xs text-amber-800">{w}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-2">
            <button type="button" onClick={forcePublish} className="admin-action text-xs">Publish with issues</button>
            <button type="button" onClick={() => setShowPublishWarning(false)} className="admin-action secondary text-xs">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lessonMatchesFilter(lesson: LessonData, filter: OutlineFilter): boolean {
  if (filter === "all") return true;
  if (filter === "published") return lesson.isPublished;
  if (filter === "missing-media") {
    return lesson.lessonType === "video" && !lesson.videoPlaybackId && !lesson.videoUrl;
  }
  if (filter === "missing-transcript") {
    if (!lesson.contentJson) return false;
    const doc = parseStructuredLessonContent(lesson.contentJson);
    return doc.blocks.some(
      (b) =>
        b.isStudentVisible &&
        ((b.type === "video" && !b.transcript?.trim()) ||
          (b.type === "audio" && !b.transcript?.trim()))
    );
  }
  const quizReadiness =
    lesson.lessonType === "quiz" && lesson.quiz
      ? getQuizReadiness(lesson.quiz.questionCount ?? 0, lesson.quiz.incompleteQuestionCount ?? 0)
      : undefined;
  const preflight = runLessonPreflight(
    {
      lessonId: lesson.id,
      title: lesson.title,
      lessonType: lesson.lessonType,
      contentJson: lesson.contentJson,
      videoPlaybackId: lesson.videoPlaybackId,
      videoUrl: lesson.videoUrl,
      quiz: lesson.quiz ? { id: lesson.quiz.id } : null,
      sourceMaterialId: lesson.sourceMaterial?.id ?? null,
    },
    quizReadiness
  );
  if (filter === "blocked") return !lesson.isPublished && !preflight.isReady;
  if (filter === "ready") return !lesson.isPublished && preflight.isReady;
  if (filter === "draft") return !lesson.isPublished;
  return true;
}

function computeFilterCounts(lessons: LessonData[]): Record<OutlineFilter, number> {
  const filters: OutlineFilter[] = ["all", "draft", "blocked", "ready", "published", "missing-media", "missing-transcript"];
  return Object.fromEntries(
    filters.map((f) => [f, lessons.filter((l) => lessonMatchesFilter(l, f)).length])
  ) as Record<OutlineFilter, number>;
}

function getLessonSidebarInsight(lesson: LessonData) {
  const document = parseStructuredLessonContent(lesson.contentJson ?? null);
  const visibleBlocks = document.blocks.filter((block) => block.isStudentVisible).length;
  const durationMinutes =
    document.estimatedDurationMinutes ??
    (lesson.durationSeconds ? Math.max(1, Math.round(lesson.durationSeconds / 60)) : null);

  const quizReadiness =
    lesson.lessonType === "quiz" && lesson.quiz
      ? getQuizReadiness(lesson.quiz.questionCount ?? 0, lesson.quiz.incompleteQuestionCount ?? 0)
      : undefined;

  const preflight = runLessonPreflight(
    {
      lessonId: lesson.id,
      title: lesson.title,
      lessonType: lesson.lessonType,
      contentJson: lesson.contentJson,
      videoPlaybackId: lesson.videoPlaybackId,
      videoUrl: lesson.videoUrl,
      quiz: lesson.quiz ? { id: lesson.quiz.id } : null,
      sourceMaterialId: lesson.sourceMaterial?.id ?? null,
    },
    quizReadiness
  );
  const readinessCount = preflight.blockers.length;

  return {
    durationLabel: durationMinutes ? `${durationMinutes} min` : "No duration",
    blockCountLabel: lesson.lessonType === "text" ? `${visibleBlocks} blocks` : null,
    readinessLabel:
      lesson.isPublished
        ? "Published"
        : readinessCount === 0
        ? "Ready to preview"
        : readinessCount <= 2
        ? `${readinessCount} item${readinessCount === 1 ? "" : "s"} to resolve`
        : `${readinessCount} issues to resolve`,
    readinessTone:
      lesson.isPublished ? "ready" : readinessCount === 0 ? "ready" : readinessCount <= 2 ? "warn" : "blocked",
  };
}

function getLessonReadinessTone(lesson: LessonData): "ready" | "warn" | "blocked" {
  if (lesson.isPublished) return "ready";
  const quizReadiness =
    lesson.lessonType === "quiz" && lesson.quiz
      ? getQuizReadiness(lesson.quiz.questionCount ?? 0, lesson.quiz.incompleteQuestionCount ?? 0)
      : undefined;
  const preflight = runLessonPreflight(
    {
      lessonId: lesson.id,
      title: lesson.title,
      lessonType: lesson.lessonType,
      contentJson: lesson.contentJson,
      videoPlaybackId: lesson.videoPlaybackId,
      videoUrl: lesson.videoUrl,
      quiz: lesson.quiz ? { id: lesson.quiz.id } : null,
      sourceMaterialId: lesson.sourceMaterial?.id ?? null,
    },
    quizReadiness
  );
  if (preflight.blockers.length === 0) return "ready";
  if (preflight.blockers.length <= 2) return "warn";
  return "blocked";
}

function LessonStatusDot({ lesson }: { lesson: LessonData }) {
  const tone = getLessonReadinessTone(lesson);
  const color =
    tone === "ready" ? "bg-emerald-400" :
    tone === "warn" ? "bg-amber-400" :
    "bg-red-300";
  return <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${color}`} />;
}

function ReadinessDot({ lesson }: { lesson: LessonData }) {
  if (lesson.isPublished) return null;
  const tone = getLessonReadinessTone(lesson);
  if (tone === "blocked") return (
    <span title="Missing required content" className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
      <Icons.AlertCircle size={10} />
      Incomplete
    </span>
  );
  if (tone === "warn") return (
    <span title="Has warnings" className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
      <Icons.AlertTriangle size={10} />
      Needs review
    </span>
  );
  return null;
}

function PublishBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <span className={cn(
      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
      isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
    )}>
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

function LessonTypeIcon({ type, size = 14, className }: { type: string; size?: number; className?: string }) {
  const map: Record<string, React.ComponentType<any>> = {
    text: Icons.FileText,
    video: Icons.Video,
    quiz: Icons.ClipboardList,
    source: Icons.Database,
  };
  const Icon = map[type] ?? Icons.FileText;
  return <Icon size={size} className={className ?? "text-slate-400"} />;
}

function LessonTypeBadgeTiny({ type }: { type: string }) {
  const map: Record<string, string> = {
    video: "bg-[#E6F1FB] text-[#185FA5]",
    quiz: "bg-[#EEEDFE] text-[#534AB7]",
    source: "bg-amber-100 text-amber-700",
  };
  if (!map[type]) return null;
  return (
    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase ${map[type]}`}>
      {type}
    </span>
  );
}
