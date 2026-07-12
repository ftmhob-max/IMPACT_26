// Front-end lesson page: app/(platform)/lessons/[id]/page.tsx

import { notFound } from "next/navigation";
import {
  EmptyState,
  IconTile,
  LearnerPage,
  PageHeader,
  SectionPanel,
} from "@/components/ui/LearnerPrimitives";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { getQuizSummary } from "@/lib/firebase/learner-portal";
import { DEV_QUIZZES, getDevLessonById } from "@/lib/dev-content";
import { ensureDevDataSeeded } from "@/lib/dev-seed";
import { StartQuizButton } from "@/components/quiz/StartQuizButton";
import { parseVideoUrl } from "@/lib/video-url";
import { LessonMuxPlayer } from "@/components/platform/LessonMuxPlayer";
import { LessonExternalVideo } from "@/components/platform/LessonExternalVideo";
import { LessonMarkComplete } from "@/components/platform/LessonMarkComplete";
import * as Icons from "@/components/ui/Icons";
import { StructuredLessonExperience } from "@/components/lessons/StructuredLessonExperience";
import { parseStructuredLessonContent } from "@/lib/lessons/structured-content";

const isDevEnvironment = process.env.NODE_ENV === "development";

type LessonRecord = {
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
    passingScore?: number | null;
    shuffleQuestions: boolean;
    shuffleChoices: boolean;
    calculatorSettingsJson?: string | null;
  } | null;
  module?: {
    course: {
      slug: string;
      title: string;
    };
  };
};

type LessonData = { lesson?: LessonRecord | null };

function getNormalizedDevLesson(id: string): LessonRecord | null {
  const developmentLesson = getDevLessonById(id);
  if (!developmentLesson) return null;

  const developmentQuiz = developmentLesson.quiz
    ? DEV_QUIZZES.find((quiz) => quiz.id === developmentLesson.quiz?.id)
    : null;

  return {
    ...developmentLesson,
    quiz: developmentLesson.quiz
      ? {
          ...developmentLesson.quiz,
          passingScore: developmentQuiz?.passingScore ?? null,
          calculatorSettingsJson: developmentQuiz?.calculatorSettingsJson ?? null,
        }
      : null,
  };
}

async function fetchLesson(id: string): Promise<LessonRecord | null> {
  try {
    let data = await adminDcQuery<LessonData>("GetLesson", { id });
    if (!data.lesson && isDevEnvironment) {
      await ensureDevDataSeeded().catch(() => null);
      data = await adminDcQuery<LessonData>("GetLesson", { id }).catch(
        (): LessonData => ({ lesson: null })
      );
      return data.lesson ?? getNormalizedDevLesson(id);
    }
    return data.lesson ?? null;
  } catch (error) {
    if (isDevEnvironment) {
      return getNormalizedDevLesson(id);
    }
    // Keep unavailable data services distinct from a confirmed missing lesson
    // so the retryable route error boundary can handle operational failures.
    throw error;
  }
}

async function fetchQuizSummary(quizId: string | null | undefined) {
  if (!quizId) return null;
  try {
    return await getQuizSummary(quizId);
  } catch {
    return null;
  }
}

async function fetchPublishedGlossaryTerms() {
  try {
    const data = await adminDcQuery<{ glossaryTerms: Array<{ term: string; definition: string; example?: string | null }> }>(
      "ListPublishedGlossaryTerms"
    );
    return data.glossaryTerms ?? [];
  } catch {
    return [];
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
  const [lesson, glossaryTerms] = await Promise.all([
    fetchLesson(id),
    fetchPublishedGlossaryTerms(),
  ]);
  const [outline, quizSummary] = await Promise.all([
    fetchCourseOutline(lesson?.module?.course.slug),
    fetchQuizSummary(lesson?.quiz?.id),
  ]);

  const backHref = lesson?.module?.course
    ? `/courses/${lesson.module.course.slug}`
    : "/courses";
  const backLabel = lesson?.module?.course
    ? `Back to ${lesson.module.course.title}`
    : "Back to catalog";

  if (!lesson) {
    notFound();
  }

  const structuredDocument = parseStructuredLessonContent(lesson.contentJson ?? null);
  const hasStructuredBlocks = structuredDocument.blocks.some((block) => block?.isStudentVisible);
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
          glossaryTerms={glossaryTerms}
        />
      </LearnerPage>
    );
  }

  // ── Quiz lesson ─────────────────────────────────────────────────────────────
  if (lesson.lessonType === "quiz" && lesson.quiz) {
    const assessmentDomainCount = new Set(
      quizSummary?.quizQuestions.map((quizQuestion) => quizQuestion.question.domain) ?? [],
    ).size;
    const passingScore = quizSummary?.quiz?.passingScore ?? lesson.quiz.passingScore ?? null;

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
              <StatRow
                label="Questions"
                value={quizSummary ? String(quizSummary.aggregation.questionCount) : "Not available"}
              />
              <StatRow
                label="Domains"
                value={
                  quizSummary
                    ? `${assessmentDomainCount} assessment ${assessmentDomainCount === 1 ? "domain" : "domains"}`
                    : "Not available"
                }
              />
              <StatRow
                label="Passing score"
                value={passingScore !== null ? `${passingScore}%` : "Not specified"}
              />
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
              <StartQuizButton
                quizId={lesson.quiz.id}
                timeLimitSeconds={lesson.quiz.timeLimitSeconds ?? null}
                shuffleQuestions={lesson.quiz.shuffleQuestions}
                shuffleChoices={lesson.quiz.shuffleChoices}
                calculatorSettingsJson={lesson.quiz.calculatorSettingsJson ?? null}
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
    const rawUrl = lesson.videoUrl ?? null;
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
      <EmptyState
        title="This lesson has no content yet"
        description="Return to the course and choose another published lesson while this one is prepared."
        icon={Icons.BookOpen}
      />
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
