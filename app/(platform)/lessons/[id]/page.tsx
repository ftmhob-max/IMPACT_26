import { IconTile, LearnerPage, PageHeader, SectionPanel } from "@/components/ui/LearnerPrimitives";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { getDevLessonById } from "@/lib/dev-content";
import { ensureDevDataSeeded } from "@/lib/dev-seed";
import { StartExamButton } from "./StartExamButton";
import { parseVideoUrl } from "@/lib/video-url";
import { LessonMuxPlayer } from "@/components/platform/LessonMuxPlayer";
import { LessonExternalVideo } from "@/components/platform/LessonExternalVideo";
import { LessonMarkComplete } from "@/components/platform/LessonMarkComplete";
import * as Icons from "@/components/ui/Icons";
import { StructuredLessonExperience } from "@/components/lessons/StructuredLessonExperience";
import { parseStructuredLessonContent } from "@/lib/lessons/structured-content";

async function fetchLesson(id: string) {
  try {
    type LessonData = {
      lesson?: {
        id: string;
        title: string;
        lessonType: string;
        contentJson?: string | null;
        videoPlaybackId?: string | null;
        videoUrl?: string | null;
        durationSeconds?: number | null;
        quiz?: {
          id: string;
          title: string;
          timeLimitSeconds?: number | null;
          shuffleQuestions: boolean;
          shuffleChoices: boolean;
        } | null;
        module: {
          course: {
            slug: string;
            title: string;
          };
        };
      } | null;
    };

    let data = await adminDcQuery<LessonData>("GetLesson", { id });
    if (!data.lesson) {
      await ensureDevDataSeeded().catch(() => null);
      data = await adminDcQuery<LessonData>("GetLesson", { id }).catch(
        (): LessonData => ({ lesson: null })
      );
    }
    return data.lesson ?? getDevLessonById(id);
  } catch {
    return getDevLessonById(id);
  }
}

async function fetchCourseOutline(slug: string | null | undefined) {
  if (!slug) return null;
  try {
    const data = await adminDcQuery<{
      courses: Array<{
        slug: string;
        modules_on_course: Array<{
          position: number;
          lessons_on_module: Array<{ id: string; title: string; position: number }>;
        }>;
      }>;
    }>("GetCourseBySlug", { slug });
    return data.courses[0] ?? null;
  } catch {
    return null;
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = await fetchLesson(id);
  const outline = await fetchCourseOutline((lesson as any)?.module?.course?.slug);

  const backHref = (lesson as any)?.module?.course
    ? `/courses/${(lesson as any).module.course.slug}`
    : "/courses";
  const backLabel = (lesson as any)?.module?.course
    ? `Back to ${(lesson as any).module.course.title}`
    : "Back to catalog";

  if (!lesson) {
    return (
      <LearnerPage width="narrow">
        <PageHeader
          eyebrow="Lesson unavailable"
          title="We could not load this lesson"
          description="The lesson may not exist, or the training data service may be unavailable in this environment."
          icon={Icons.Inbox}
        />
        <div className="rounded-lg border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
          Return to the course catalog and try opening the lesson again.
        </div>
      </LearnerPage>
    );
  }

  const structuredDocument = parseStructuredLessonContent(lesson.contentJson ?? null);
  const hasStructuredBlocks = structuredDocument.blocks.some((block) => block.isStudentVisible);
  const nextLesson = (() => {
    if (!outline) return null;
    const orderedLessons = outline.modules_on_course
      .slice()
      .sort((a, b) => a.position - b.position)
      .flatMap((module) => module.lessons_on_module.slice().sort((a, b) => a.position - b.position));
    const index = orderedLessons.findIndex((entry) => entry.id === lesson.id);
    const next = index >= 0 ? orderedLessons[index + 1] : null;
    return next ? { title: next.title, href: `/lessons/${next.id}` } : null;
  })();

  if (lesson.contentJson && hasStructuredBlocks) {
    return (
      <LearnerPage width="wide">
        <PageHeader
          eyebrow={lesson.lessonType === "video" ? "Video lesson" : lesson.lessonType === "quiz" ? "Practice lesson" : "Guided lesson"}
          title={lesson.title}
          description={structuredDocument.summary || "Move through the lesson map, review each block, and track your progress as you study."}
          backHref={backHref}
          backLabel={backLabel}
          icon={lesson.lessonType === "video" ? Icons.Video : lesson.lessonType === "quiz" ? Icons.ClipboardList : Icons.BookOpen}
        />
        <StructuredLessonExperience
          lessonId={lesson.id}
          lessonTitle={lesson.title}
          contentJson={lesson.contentJson ?? null}
          fallbackDurationSeconds={lesson.durationSeconds ?? null}
          nextLesson={nextLesson}
        />
      </LearnerPage>
    );
  }

  // ── Quiz lesson ─────────────────────────────────────────────────────────────
  if (lesson.lessonType === "quiz" && lesson.quiz) {
    return (
      <LearnerPage width="narrow">
        <PageHeader
          eyebrow="Practice exam"
          title={lesson.title}
          description={lesson.quiz.title}
          backHref={backHref}
          backLabel={backLabel}
          icon={Icons.ClipboardList}
        />
        <SectionPanel>
          <div className="p-5 sm:p-6">
            <div className="mb-6 flex gap-4 rounded-lg border border-[#b8d7f0] bg-[#f8fbff] p-4">
              <IconTile icon={Icons.Info} size={18} className="h-9 w-9" />
              <div>
                <p className="text-sm font-extrabold text-slate-900">Before you start</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Treat this as a self-study assessment. Submit each answer to unlock the rationale,
                  calculation steps, and source reference.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <StatRow label="Questions" value="80" />
              <StatRow label="Domains" value="6 assessment domains" />
              <StatRow label="Passing score" value="70%" />
              <StatRow
                label="Time limit"
                value={lesson.quiz.timeLimitSeconds ? `${Math.round(lesson.quiz.timeLimitSeconds / 60)} minutes` : "Untimed"}
              />
              <StatRow
                label="Question order"
                value={lesson.quiz.shuffleQuestions ? "Shuffled each attempt" : "Fixed order"}
              />
              <StatRow
                label="Choice order"
                value={lesson.quiz.shuffleChoices ? "Shuffled" : "Fixed"}
              />
            </div>
            <div className="mt-6 border-t border-slate-100 pt-5">
              <StartExamButton
                quizId={lesson.quiz.id}
                timeLimitSeconds={lesson.quiz.timeLimitSeconds ?? null}
                shuffleQuestions={lesson.quiz.shuffleQuestions}
                shuffleChoices={lesson.quiz.shuffleChoices}
              />
            </div>
          </div>
        </SectionPanel>
      </LearnerPage>
    );
  }

  // ── Video lesson ─────────────────────────────────────────────────────────────
  if (lesson.lessonType === "video") {
    // Mux-hosted: full position save/restore via @mux/mux-player-react
    if (lesson.videoPlaybackId) {
      return (
        <LearnerPage width="narrow">
          <PageHeader eyebrow="Video lesson" title={lesson.title} backHref={backHref} backLabel={backLabel} icon={Icons.Video} />
          <LessonMuxPlayer
            lessonId={lesson.id}
            playbackId={lesson.videoPlaybackId}
            title={lesson.title}
          />
        </LearnerPage>
      );
    }

    // External link: YouTube / Vimeo / Loom / Google Drive / Wistia / direct file
    const rawUrl = (lesson as any).videoUrl as string | null;
    if (rawUrl) {
      const meta = parseVideoUrl(rawUrl);
      if (meta && meta.embedUrl) {
        return (
          <LearnerPage width="narrow">
            <PageHeader
              eyebrow={`Video lesson · ${meta.label}`}
              title={lesson.title}
              backHref={backHref}
              backLabel={backLabel}
              icon={Icons.Video}
            />
            <LessonExternalVideo lessonId={lesson.id} meta={meta} title={lesson.title} />
          </LearnerPage>
        );
      }
    }
  }

  // ── Text / reading lesson ────────────────────────────────────────────────────
  if (lesson.lessonType === "text" && lesson.contentJson) {
    return (
      <LearnerPage width="narrow">
        <PageHeader
          eyebrow="Guided lesson"
          title={lesson.title}
          backHref={backHref}
          backLabel={backLabel}
          icon={Icons.BookOpen}
        />
        <SectionPanel>
          <StructuredLessonExperience
            lessonId={lesson.id}
            lessonTitle={lesson.title}
            contentJson={lesson.contentJson}
            fallbackDurationSeconds={lesson.durationSeconds ?? null}
            nextLesson={nextLesson}
          />
        </SectionPanel>
        <LessonMarkComplete lessonId={lesson.id} />
      </LearnerPage>
    );
  }

  // ── No content yet ───────────────────────────────────────────────────────────
  return (
    <LearnerPage width="narrow">
      <PageHeader eyebrow="Lesson" title={lesson.title} backHref={backHref} backLabel={backLabel} icon={Icons.BookOpen} />
      <div className="rounded-lg border border-dashed border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500">
        This lesson has no content yet.
      </div>
    </LearnerPage>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
