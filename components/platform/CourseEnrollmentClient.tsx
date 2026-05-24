"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { ProgressMeter, StatusBadge } from "@/components/ui/LearnerPrimitives";
import * as Icons from "@/components/ui/Icons";

interface Lesson {
  id: string;
  title: string;
  position: number;
  lessonType: string;
  durationSeconds?: number | null;
  videoPlaybackId?: string | null;
  quiz?: { id: string } | null;
}

interface Module {
  id: string;
  title: string;
  position: number;
  prerequisiteModuleIds?: string | null;
  lessons_on_module: Lesson[];
}

interface LessonProgress {
  lessonId: string;
  status: "not_started" | "in_progress" | "completed";
  videoPositionSeconds?: number;
  completedAt?: string;
}

interface Props {
  courseSlug: string;
  courseId: string;
  modules: Module[];
}

export function CourseEnrollmentClient({ courseSlug, courseId, modules }: Props) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    setLoadingProgress(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/progress/course/${courseSlug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEnrolled(data.enrolled ?? false);
        setProgress(data.progress ?? []);
      }
    } catch {
      // silently ignore — unenrolled state is fine
    } finally {
      setLoadingProgress(false);
    }
  }, [user, courseSlug]);

  useEffect(() => {
    if (user) fetchProgress();
  }, [user, fetchProgress]);

  const handleEnroll = async () => {
    if (!user || enrolling) return;
    setEnrolling(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/courses/${courseSlug}/enroll`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setEnrolled(true);
      }
    } catch {
      // ignore
    } finally {
      setEnrolling(false);
    }
  };

  // Build a set of completed module IDs to check prerequisites
  const completedModuleIds = new Set(
    modules
      .filter((m) => {
        const lessonIds = new Set(m.lessons_on_module.map((l) => l.id));
        if (lessonIds.size === 0) return false;
        return [...lessonIds].every((id) =>
          progress.find((p) => p.lessonId === id && p.status === "completed")
        );
      })
      .map((m) => m.id)
  );

  const isModuleLocked = (module: Module): boolean => {
    if (!module.prerequisiteModuleIds) return false;
    try {
      const prereqs: string[] = JSON.parse(module.prerequisiteModuleIds);
      return prereqs.some((id) => !completedModuleIds.has(id));
    } catch {
      return false;
    }
  };

  const lessonProgressMap = new Map(progress.map((p) => [p.lessonId, p]));

  const totalLessons = modules.reduce((s, m) => s + m.lessons_on_module.length, 0);
  const completedLessons = progress.filter((p) => p.status === "completed").length;
  const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  if (!user) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
        <Link href="/sign-in" className="font-semibold text-[#185FA5] hover:underline">
          Sign in
        </Link>{" "}
        to track your progress and enroll in this course.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Enrollment banner */}
      {!loadingProgress && !enrolled && (
        <div className="flex flex-col gap-4 rounded-lg border border-[#b8d7f0] bg-[#E6F1FB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <StatusBadge tone="blue">Enrollment</StatusBadge>
            <p className="mt-2 text-sm font-semibold text-[#185FA5]">
              Enroll to track your progress through this course.
            </p>
          </div>
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0d3d6e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {enrolling ? "Enrolling…" : "Enroll now"}
          </button>
        </div>
      )}

      {/* Progress bar */}
      {enrolled && totalLessons > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <ProgressMeter value={pct} label="Your progress" detail={`${pct}%`} />
          <p className="mt-2 text-xs text-slate-500">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>
      )}

      {/* Module / lesson list */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          {modules.map((module, mIdx) => {
            const locked = isModuleLocked(module);
            return (
              <div key={module.id}>
                <div className="flex items-center gap-3 bg-[#f8fbff] px-5 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-xs font-extrabold text-[#185FA5] shadow-sm ring-1 ring-slate-200">
                    {mIdx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{module.title}</p>
                    <p className="text-xs text-slate-500">{module.lessons_on_module.length} lessons</p>
                  </div>
                  {locked && (
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                      <Icons.Lock size={10} />
                      Locked
                    </span>
                  )}
                </div>
                {module.lessons_on_module.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {module.lessons_on_module.map((lesson, lIdx) => {
                      const lp = lessonProgressMap.get(lesson.id);
                      return (
                        <LessonRow
                          key={lesson.id}
                          lesson={lesson}
                          moduleIndex={mIdx}
                          lessonIndex={lIdx}
                          locked={locked}
                          progressStatus={lp?.status}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-5 py-4 text-sm text-slate-500">
                    No published lessons are linked to this module yet.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LessonRow({
  lesson,
  moduleIndex,
  lessonIndex,
  locked,
  progressStatus,
}: {
  lesson: Lesson;
  moduleIndex: number;
  lessonIndex: number;
  locked: boolean;
  progressStatus?: string;
}) {
  const typeMap: Record<string, { label: string; className: string }> = {
    video: { label: "Video", className: "bg-[#E6F1FB] text-[#185FA5]" },
    text: { label: "Reading", className: "bg-slate-100 text-slate-600" },
    quiz: { label: "Practice", className: "bg-[#EEEDFE] text-[#534AB7]" },
    source: { label: "Material", className: "bg-amber-50 text-amber-700" },
  };
  const { label, className } = typeMap[lesson.lessonType] ?? {
    label: lesson.lessonType,
    className: "bg-slate-100 text-slate-500",
  };

  const statusDot =
    progressStatus === "completed"
      ? "bg-emerald-500"
      : progressStatus === "in_progress"
      ? "bg-amber-400"
      : "bg-slate-200";

  const inner = (
    <>
      <span className="text-xs font-mono text-slate-400">
        {moduleIndex + 1}.{lessonIndex + 1}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
        {lesson.title}
      </span>
      <div className="col-start-2 flex items-center gap-2 sm:col-start-auto">
        <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}>
          {label}
        </span>
        {lesson.durationSeconds && (
          <span className="hidden text-xs text-slate-400 sm:inline">
            {Math.ceil(lesson.durationSeconds / 60)} min
          </span>
        )}
        <span className={`h-2 w-2 rounded-full ${statusDot}`} title={progressStatus ?? "not started"} aria-label={progressStatus ?? "not started"} />
      </div>
    </>
  );

  if (locked) {
    return (
      <div className="grid grid-cols-[36px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-4 py-3 opacity-50 cursor-not-allowed sm:grid-cols-[48px_1fr_auto] sm:px-5">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/lessons/${lesson.id}`}
      className="grid grid-cols-[36px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-4 py-3 transition-colors hover:bg-[#F8F7F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-inset sm:grid-cols-[48px_1fr_auto] sm:px-5"
    >
      {inner}
    </Link>
  );
}
