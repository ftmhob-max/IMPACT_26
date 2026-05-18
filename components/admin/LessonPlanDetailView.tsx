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
  getLessonReadinessIssues,
  getLessonReadinessReport,
  parseStructuredLessonContent,
} from "@/lib/lessons/structured-content";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LessonQuiz {
  id: string;
  title: string;
  status: string;
  passingScore?: number | null;
  timeLimitSeconds?: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
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
type PreviewMode = "edit" | "split" | "preview";

// ─── Main Component ───────────────────────────────────────────────────────────

export function LessonPlanDetailView({
  course,
  initialModules,
}: {
  course: CourseData;
  initialModules: ModuleData[];
}) {
  const [modules, setModules] = useState<ModuleData[]>(initialModules);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    initialModules[0]?.lessons[0]?.id ?? null
  );
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(initialModules.map((m) => m.id))
  );
  const [mode, setMode] = useState<PreviewMode>("split");
  const [activeTab, setActiveTab] = useState<TabId>("content");
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

  function showNotice(type: "success" | "error", text: string) {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  }

  function handleContentChange(lessonId: string, contentJson: string) {
    setDraftContentByLessonId((prev) => ({ ...prev, [lessonId]: contentJson }));
  }

  async function handleModeChange(nextMode: PreviewMode) {
    if (nextMode === "preview" && mode === "edit" && activeTab === "content") {
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
    setMode("split");
    setActiveTab("content");
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
  const publishedLessons = modules
    .flatMap((m) => m.lessons)
    .filter((l) => l.isPublished).length;

  return (
    <div className="flex h-full flex-col bg-[#f0efe9]">
      {/* Top bar */}
      <header className="flex items-center gap-3 border-b border-black/10 bg-white px-5 py-3 shadow-sm">
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
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>{publishedLessons}/{totalLessons} published</span>
        </div>
        {/* Mode toggle */}
        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
          {(["edit", "split", "preview"] as const).map((m) => (
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
              {m === "edit" ? <Icons.Pencil size={12} /> : m === "split" ? <Icons.LayoutDashboard size={12} /> : <Icons.Eye size={12} />}
              {m === "edit" ? "Edit" : m === "split" ? "Split view" : "Preview"}
            </button>
          ))}
        </div>
      </header>

      {notice && (
        <div className={`flex items-center gap-2 px-5 py-2 text-xs font-medium ${notice.type === "success" ? "bg-emerald-50 text-emerald-800 border-b border-emerald-200" : "bg-red-50 text-red-700 border-b border-red-200"}`}>
          {notice.type === "success" ? <Icons.Check size={13} /> : <Icons.X size={13} />}
          {notice.text}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: module/lesson outline */}
        <aside className="w-72 shrink-0 overflow-y-auto border-r border-black/10 bg-white">
          <div className="space-y-1 p-3">
            {modules.map((mod) => (
              <ModuleSidebarSection
                key={mod.id}
                module={mod}
                expanded={expandedModules.has(mod.id)}
                selectedLessonId={selectedLessonId}
                onToggle={() => toggleModule(mod.id)}
                onSelectLesson={selectLesson}
                onAddLesson={() => addLesson(mod.id)}
              />
            ))}
            <button
              type="button"
              onClick={addModule}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors mt-2"
            >
              <Icons.Plus size={12} />
              Add module
            </button>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-5">
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

function ModuleSidebarSection({
  module,
  expanded,
  selectedLessonId,
  onToggle,
  onSelectLesson,
  onAddLesson,
}: {
  module: ModuleData;
  expanded: boolean;
  selectedLessonId: string | null;
  onToggle: () => void;
  onSelectLesson: (id: string) => void;
  onAddLesson: () => void;
}) {
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
        <span className="text-[10px] text-slate-400">{module.lessons.length}</span>
      </button>

      {expanded && (
        <div className="ml-4 space-y-0.5 mt-0.5">
          {module.lessons.map((lesson) => (
            <LessonSidebarButton
              key={lesson.id}
              lesson={lesson}
              selected={selectedLessonId === lesson.id}
              onSelect={() => onSelectLesson(lesson.id)}
            />
          ))}
          <button
            type="button"
            onClick={onAddLesson}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <Icons.Plus size={10} />
            Add lesson
          </button>
        </div>
      )}
    </div>
  );
}

function LessonSidebarButton({
  lesson,
  selected,
  onSelect,
}: {
  lesson: LessonData;
  selected: boolean;
  onSelect: () => void;
}) {
  const insight = getLessonSidebarInsight(lesson);

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

// ─── Lesson Detail Panel ──────────────────────────────────────────────────────

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
  const tabs: { id: TabId; label: string; icon: React.ComponentType<any>; show: boolean }[] = [
    { id: "content", label: "Structure", icon: Icons.FileText, show: true },
    { id: "questions", label: "Assessment", icon: Icons.ClipboardList, show: lesson.lessonType === "quiz" },
    { id: "resources", label: "Resources", icon: Icons.Database, show: true },
    { id: "settings", label: "Publishing", icon: Icons.Settings, show: true },
  ];
  const visibleTabs = tabs.filter((t) => t.show);
  const showInlinePreview = mode === "split" && activeTab === "content";

  return (
    <div className={cn("mx-auto space-y-4", showInlinePreview ? "max-w-7xl" : "max-w-4xl")}>
      {/* Lesson header */}
      <div className="flex items-center gap-3 flex-wrap">
        <LessonTypeIcon type={lesson.lessonType} size={18} className="text-[#185FA5]" />
        <h1 className="text-xl font-extrabold text-slate-900 flex-1">{lesson.title}</h1>
        <div className="flex items-center gap-2">
          <PublishBadge isPublished={lesson.isPublished} />
          <ReadinessDot lesson={lesson} />
        </div>
      </div>

      {/* Tabs — always visible regardless of mode */}
      <div className="flex gap-0 border-b border-slate-200">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors",
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

      {/* Tab content / Preview */}
      {mode === "preview" && activeTab === "content" ? (
        <LessonStudentPreview lesson={{ ...lesson, quiz: lesson.quiz ?? undefined }} />
      ) : (
        <>
          {activeTab === "content" && (
            showInlinePreview ? (
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                <ContentTab
                  lesson={lesson}
                  onUpdate={onUpdate}
                  editorRef={editorRef}
                  onContentChange={onContentChange}
                />
                <div className="space-y-3 xl:sticky xl:top-5 xl:self-start">
                  <div className="rounded-2xl border border-[#b8d7f0] bg-[#f8fbff] px-4 py-3">
                    <div className="flex items-center gap-2 text-[#185FA5]">
                      <Icons.Eye size={15} />
                      <p className="text-xs font-extrabold uppercase tracking-[0.12em]">Live learner preview</p>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      This panel mirrors the student lesson using the current draft so authors can tune flow and clarity without leaving the editor.
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
            <SettingsTab lesson={lesson} onUpdate={onUpdate} onReload={onReload} />
          )}
        </>
      )}
    </div>
  );
}

// ─── Content Tab ──────────────────────────────────────────────────────────────

function ContentTab({
  lesson,
  onUpdate,
  editorRef,
  onContentChange,
}: {
  lesson: LessonData;
  onUpdate: (updates: Record<string, unknown>) => Promise<void>;
  editorRef: React.RefObject<LessonBuilderEditorHandle | null>;
  onContentChange: (contentJson: string) => void;
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
  const [materials, setMaterials] = useState<ResourceMaterial[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Load eagerly when tab mounts
  useEffect(() => {
    if (loaded) return;
    fetch("/api/admin/materials", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { materials: [] }))
      .then((data) => {
        setMaterials(
          (data.materials ?? []).map((m: any) => ({
            id: m.id,
            title: m.title,
            kind: m.kind,
            pages: m.pages ?? null,
            fileType: m.fileType,
            previewSnippet: m.previewSnippet ?? "",
          }))
        );
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [loaded]);

  async function linkMaterial(materialId: string) {
    await onUpdate({ sourceMaterialId: materialId || null });
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
      await onUpdate({ sourceMaterialId: data.id });
      setFile(null);
      setUploadTitle("");
      setShowUpload(false);
      setLoaded(false); // reload library
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

  const filtered = query.trim()
    ? materials.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()))
    : materials;

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

  return (
    <div className="space-y-4">
      {/* Current attachment */}
      <div className="rounded-xl border border-black/10 bg-white shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Icons.Database size={15} className="text-[#185FA5]" />
            Lesson source material
          </h3>
          <a
            href="/admin/materials"
            className="flex items-center gap-1 text-[11px] font-semibold text-[#185FA5] hover:underline"
          >
            <Icons.ExternalLink size={11} />
            Manage library
          </a>
        </div>
        {lesson.sourceMaterial ? (
          <div className="rounded-xl border border-[#b8d7f0] bg-[#E6F1FB]/40 px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E6F1FB] text-[#185FA5]">
                <Icons.Database size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{lesson.sourceMaterial.title}</p>
                <p className="text-[11px] text-[#185FA5] font-medium mt-0.5">Linked to this lesson</p>
              </div>
              <button
                type="button"
                onClick={() => linkMaterial("")}
                className="text-xs text-red-500 hover:text-red-700 font-semibold shrink-0"
              >
                Unlink
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
            <Icons.Database size={22} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs text-slate-500 font-medium">No source material linked yet.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Search the library below or upload a new file.</p>
          </div>
        )}
      </div>

      {/* Browse library */}
      <div className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Icons.Link size={15} className="text-[#185FA5]" />
            Link from library
          </h3>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search materials…"
            className="admin-input mt-3"
          />
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
          {!loaded ? (
            <div className="flex items-center justify-center py-10 text-xs text-slate-400">
              <Icons.Loader size={14} className="animate-spin mr-2" />
              Loading library…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              {query ? "No materials match your search." : "No materials in your library yet."}
            </div>
          ) : (
            filtered.map((material) => {
              const Icon = kindIcon(material.kind);
              const isLinked = lesson.sourceMaterial?.id === material.id;
              return (
                <div
                  key={material.id}
                  className={cn(
                    "flex items-start gap-3 px-5 py-3 transition",
                    isLinked ? "bg-[#E6F1FB]/30" : "hover:bg-slate-50"
                  )}
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Icon size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{material.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500">
                        {kindLabel(material.kind)}
                      </span>
                      {material.pages ? <span className="text-[10px] text-slate-400">{material.pages}p</span> : null}
                    </div>
                  </div>
                  {isLinked ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#185FA5] shrink-0">
                      <Icons.Check size={12} />
                      Linked
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => linkMaterial(material.id)}
                      className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5]"
                    >
                      Link
                    </button>
                  )}
                </div>
              );
            })
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
              <span>PDF, DOCX, CSV, TXT</span>
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
}: {
  lesson: LessonData;
  onUpdate: (updates: Record<string, unknown>) => Promise<void>;
  onReload: () => Promise<void>;
}) {
  const [title, setTitle] = useState(lesson.title);
  const [lessonType, setLessonType] = useState(lesson.lessonType);
  const [duration, setDuration] = useState(String(lesson.durationSeconds ?? ""));
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

  function readinessIssues(): string[] {
    const issues: string[] = [];
    if (!title.trim()) issues.push("Lesson needs a title.");
    if (lessonType === "text") {
      issues.push(...getLessonReadinessIssues(parseStructuredLessonContent(lesson.contentJson)));
    }
    if (lessonType === "video" && !lesson.videoPlaybackId && !lesson.videoUrl) issues.push("No video attached.");
    if (lessonType === "quiz" && !lesson.quiz) issues.push("No quiz linked.");
    return issues;
  }

  async function save() {
    const wouldPublish = isPublished && !lesson.isPublished;
    if (wouldPublish) {
      const issues = readinessIssues();
      if (issues.length > 0) {
        setShowPublishWarning(true);
        return;
      }
    }
    setBusy(true);
    await onUpdate({
      title,
      lessonType,
      quizId: lessonType === "quiz" ? (selectedQuizId || null) : null,
      durationSeconds: duration ? parseInt(duration) : null,
      isPublished,
      status: isPublished ? "published" : "draft",
      versionNote: versionNote || null,
      saveVersion: lesson.isPublished,
    });
    setBusy(false);
    setVersionNote("");
  }

  async function forcePublish() {
    setShowPublishWarning(false);
    setBusy(true);
    await onUpdate({
      title,
      lessonType,
      quizId: lessonType === "quiz" ? (selectedQuizId || null) : null,
      durationSeconds: duration ? parseInt(duration) : null,
      isPublished,
      status: isPublished ? "published" : "draft",
      saveVersion: lesson.isPublished,
      versionNote: versionNote || null,
    });
    setBusy(false);
  }

  const issues = readinessIssues();

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
            <label className="admin-label">Duration (seconds)</label>
            <input
              type="number"
              className="admin-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 300"
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
        {issues.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 space-y-1">
            <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <Icons.AlertTriangle size={13} />
              Before publishing, resolve:
            </p>
            {issues.map((issue) => (
              <p key={issue} className="text-xs text-amber-700 pl-5">{issue}</p>
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
            This lesson has incomplete content. Publish anyway?
          </p>
          <ul className="list-disc pl-5 space-y-1">
            {issues.map((issue) => (
              <li key={issue} className="text-xs text-amber-800">{issue}</li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button type="button" onClick={forcePublish} className="admin-action text-xs">Publish anyway</button>
            <button type="button" onClick={() => setShowPublishWarning(false)} className="admin-action secondary text-xs">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLessonSidebarInsight(lesson: LessonData) {
  const document = parseStructuredLessonContent(lesson.contentJson ?? null);
  const visibleBlocks = document.blocks.filter((block) => block.isStudentVisible).length;
  const readinessCount = lesson.lessonType === "text" ? getLessonReadinessReport(document).length : 0;
  const durationMinutes =
    document.estimatedDurationMinutes ??
    (lesson.durationSeconds ? Math.max(1, Math.round(lesson.durationSeconds / 60)) : null);

  return {
    durationLabel: durationMinutes ? `${durationMinutes} min` : "No duration",
    blockCountLabel: lesson.lessonType === "text" ? `${visibleBlocks} blocks` : null,
    readinessLabel:
      lesson.isPublished
        ? "Published"
        : readinessCount === 0
        ? "Ready to preview"
        : readinessCount <= 2
        ? `${readinessCount} item${readinessCount === 1 ? "" : "s"} to finish`
        : `${readinessCount} issues to finish`,
    readinessTone:
      lesson.isPublished ? "ready" : readinessCount === 0 ? "ready" : readinessCount <= 2 ? "warn" : "blocked",
  };
}

function LessonStatusDot({ lesson }: { lesson: LessonData }) {
  const hasContent =
    (lesson.lessonType === "text" && !!lesson.contentJson) ||
    (lesson.lessonType === "video" && (!!lesson.videoPlaybackId || !!lesson.videoUrl)) ||
    (lesson.lessonType === "quiz" && !!lesson.quiz);

  const color = lesson.isPublished
    ? "bg-emerald-400"
    : hasContent
    ? "bg-amber-400"
    : "bg-red-300";

  return <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${color}`} />;
}

function ReadinessDot({ lesson }: { lesson: LessonData }) {
  const hasContent =
    (lesson.lessonType === "text" && !!lesson.contentJson) ||
    (lesson.lessonType === "video" && (!!lesson.videoPlaybackId || !!lesson.videoUrl)) ||
    (lesson.lessonType === "quiz" && !!lesson.quiz);

  if (lesson.isPublished) return null;
  if (!hasContent) return (
    <span title="Missing content" className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
      <Icons.AlertCircle size={10} />
      Incomplete
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
