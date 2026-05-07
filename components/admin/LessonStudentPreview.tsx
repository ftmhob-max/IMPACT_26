"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import * as Icons from "@/components/ui/Icons";

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
  videoPlaybackId?: string | null;
  videoUrl?: string | null;
  quiz?: QuizInfo | null;
}

interface Props {
  lesson: LessonData;
}

export function LessonStudentPreview({ lesson }: Props) {
  return (
    <div className="space-y-4">
      {/* Preview banner */}
      <div className="flex items-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2.5 text-white">
        <Icons.Eye size={15} />
        <span className="text-xs font-bold tracking-wide uppercase">Student Preview</span>
        <span className="text-xs text-blue-200 ml-1">— This is exactly what students see</span>
      </div>

      {/* Lesson content */}
      <div className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
        {/* Lesson header (mirrors learner PageHeader) */}
        <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/40">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {eyebrowFor(lesson.lessonType)}
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-950">{lesson.title}</h2>
        </div>

        {/* Content area */}
        <div className="p-6">
          {lesson.lessonType === "quiz" && lesson.quiz && (
            <QuizPreview quiz={lesson.quiz} />
          )}
          {lesson.lessonType === "quiz" && !lesson.quiz && (
            <EmptyContent message="No quiz linked to this lesson yet." />
          )}
          {lesson.lessonType === "video" && lesson.videoPlaybackId && (
            <VideoPreview
              type="mux"
              src={`https://stream.mux.com/${lesson.videoPlaybackId}.m3u8`}
              playbackId={lesson.videoPlaybackId}
            />
          )}
          {lesson.lessonType === "video" && lesson.videoUrl && !lesson.videoPlaybackId && (
            <VideoPreview type="external" src={lesson.videoUrl} />
          )}
          {lesson.lessonType === "video" && !lesson.videoPlaybackId && !lesson.videoUrl && (
            <EmptyContent message="No video attached to this lesson yet." />
          )}
          {lesson.lessonType === "text" && lesson.contentJson && (
            <TextPreview contentJson={lesson.contentJson} />
          )}
          {lesson.lessonType === "text" && !lesson.contentJson && (
            <EmptyContent message="No content written yet. Switch to Edit mode to add text." />
          )}
          {lesson.lessonType === "source" && (
            <EmptyContent message="Source material lessons link to uploaded documents." />
          )}
        </div>
      </div>
    </div>
  );
}

function eyebrowFor(type: string): string {
  switch (type) {
    case "quiz": return "Practice exam";
    case "video": return "Video lesson";
    case "text": return "Reading";
    case "source": return "Source material";
    default: return "Lesson";
  }
}

function QuizPreview({ quiz }: { quiz: QuizInfo }) {
  return (
    <div className="space-y-5">
      <div className="flex gap-4 rounded-lg border border-[#b8d7f0] bg-[#f8fbff] p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#185FA5]/10">
          <Icons.Info size={18} className="text-[#185FA5]" />
        </div>
        <div>
          <p className="text-sm font-extrabold text-slate-900">Before you start</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Treat this as a self-study assessment. Submit each answer to unlock the rationale,
            calculation steps, and source reference.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {quiz.passingScore != null && (
          <StatCard label="Passing score" value={`${quiz.passingScore}%`} />
        )}
        <StatCard
          label="Time limit"
          value={quiz.timeLimitSeconds ? `${Math.round(quiz.timeLimitSeconds / 60)} minutes` : "Untimed"}
        />
        <StatCard
          label="Question order"
          value={quiz.shuffleQuestions ? "Shuffled each attempt" : "Fixed order"}
        />
        <StatCard
          label="Choice order"
          value={quiz.shuffleChoices ? "Shuffled" : "Fixed"}
        />
      </div>
      <div className="relative">
        <button
          type="button"
          disabled
          className="w-full rounded-lg bg-[#185FA5] px-5 py-3 text-sm font-bold text-white opacity-50 cursor-not-allowed"
        >
          Start practice exam
        </button>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
            Preview only — students click this to begin
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function VideoPreview({ type, src, playbackId }: { type: "mux" | "external"; src: string; playbackId?: string }) {
  if (type === "mux" && playbackId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <Icons.Video size={40} className="text-slate-600" />
        </div>
        <div className="absolute bottom-3 left-3 rounded bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
          Mux video · {playbackId.slice(0, 12)}…
        </div>
      </div>
    );
  }
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
      <iframe
        src={src}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; fullscreen"
        allowFullScreen
        title="Video preview"
      />
    </div>
  );
}

function TextPreview({ contentJson }: { contentJson: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Table,
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: (() => {
      try { return JSON.parse(contentJson); } catch { return contentJson; }
    })(),
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none text-sm leading-7 focus:outline-none",
      },
    },
  });

  return <EditorContent editor={editor} />;
}

function EmptyContent({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
      <Icons.FileText size={32} className="mx-auto text-slate-200 mb-3" />
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}
