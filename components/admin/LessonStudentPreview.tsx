"use client";

import { useEffect, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { getIdToken } from "@/lib/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { StructuredLessonExperience } from "@/components/lessons/StructuredLessonExperience";
import { LessonMuxPlayer } from "@/components/platform/LessonMuxPlayer";
import { parseVideoUrl } from "@/lib/video-url";

interface QuizInfo {
  id: string;
  title: string;
  passingScore?: number | null;
  timeLimitSeconds?: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
}

interface LessonData {
  id: string;
  title: string;
  lessonType: string;
  contentJson?: string | null;
  durationSeconds?: number | null;
  videoPlaybackId?: string | null;
  videoUrl?: string | null;
  quiz?: QuizInfo | null;
  sourceMaterial?: { id: string; title: string } | null;
}

interface Props {
  lesson: LessonData;
}

export function LessonStudentPreview({ lesson }: Props) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const t = await user.getIdToken();
          setToken(t);
        } catch {
          setToken(null);
        }
      } else {
        setToken(null);
      }
    });
  }, []);

  if (!lesson.contentJson && lesson.lessonType === "video") {
    let resolvedVideoUrl = lesson.videoUrl || (lesson.sourceMaterial ? `/api/admin/materials/${lesson.sourceMaterial.id}/asset` : "");
    if (resolvedVideoUrl && resolvedVideoUrl.startsWith("/api/") && token) {
      resolvedVideoUrl = `${resolvedVideoUrl}${resolvedVideoUrl.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`;
    }
    return (
      <div className="space-y-4">
        <PreviewBanner />
        <div className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/40">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Video lesson</p>
            <h2 className="mt-1 text-xl font-extrabold text-slate-950">{lesson.title}</h2>
          </div>
          <div className="p-6">
            {lesson.videoPlaybackId ? (
              <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-950">
                <LessonMuxPlayer lessonId={lesson.id} playbackId={lesson.videoPlaybackId} title={lesson.title} />
              </div>
            ) : resolvedVideoUrl ? (
              resolvedVideoUrl.startsWith("/") || resolvedVideoUrl.includes("materials") ? (
                <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-950">
                  <video controls src={resolvedVideoUrl} className="h-full w-full object-contain" />
                </div>
              ) : (
                <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-950">
                  <iframe src={parseVideoUrl(resolvedVideoUrl)?.embedUrl || ""} className="h-full w-full" allow="autoplay; fullscreen" allowFullScreen title="Video preview" />
                </div>
              )
            ) : (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-400">
                No video attached yet.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!lesson.contentJson && lesson.lessonType === "quiz") {
    return (
      <div className="space-y-4">
        <PreviewBanner />
        <div className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/40">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Practice exam</p>
            <h2 className="mt-1 text-xl font-extrabold text-slate-950">{lesson.title}</h2>
          </div>
          <div className="space-y-4 p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <PreviewStat label="Passing score" value={lesson.quiz?.passingScore != null ? `${lesson.quiz.passingScore}%` : "N/A"} />
              <PreviewStat label="Time limit" value={lesson.quiz?.timeLimitSeconds ? `${Math.round(lesson.quiz.timeLimitSeconds / 60)} minutes` : "Untimed"} />
              <PreviewStat label="Question order" value={lesson.quiz?.shuffleQuestions ? "Shuffled each attempt" : "Fixed order"} />
              <PreviewStat label="Choice order" value={lesson.quiz?.shuffleChoices ? "Shuffled" : "Fixed"} />
            </div>
            <button
              type="button"
              disabled
              className="w-full rounded-lg bg-[#185FA5] px-5 py-3 text-sm font-bold text-white opacity-50"
            >
              Preview only
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PreviewBanner />

      <StructuredLessonExperience
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        contentJson={lesson.contentJson ?? null}
        fallbackDurationSeconds={lesson.durationSeconds ?? null}
        previewMode
      />
    </div>
  );
}

function PreviewBanner() {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2.5 text-white">
      <Icons.Eye size={15} />
      <span className="text-xs font-bold tracking-wide uppercase">Student Preview</span>
      <span className="ml-1 text-xs text-blue-200">This mirrors the learner-facing lesson experience.</span>
    </div>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
