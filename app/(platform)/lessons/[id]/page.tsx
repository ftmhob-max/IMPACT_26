import { LearnerPage, PageHeader, SectionPanel } from "@/components/ui/LearnerPrimitives";
import { getLesson } from "@/lib/firebase/generated";
import { getPlatformDataConnect } from "@/lib/firebase/dataconnect";
import { StartExamButton } from "./StartExamButton";

async function fetchLesson(id: string) {
  try {
    const dc = getPlatformDataConnect();
    const { data } = await getLesson(dc, { id });
    return data.lesson ?? null;
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

  if (!lesson) {
    return (
      <LearnerPage width="narrow">
        <PageHeader
          eyebrow="Lesson unavailable"
          title="We could not load this lesson"
          description="The lesson may not exist, or the training data service may be unavailable in this environment."
        />
        <div className="rounded-lg border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
          Return to the course catalog and try opening the lesson again.
        </div>
      </LearnerPage>
    );
  }

  if (lesson.lessonType === "quiz" && lesson.quiz) {
    return (
      <LearnerPage width="narrow">
        <PageHeader
          eyebrow="Practice exam"
          title={lesson.title}
          description={lesson.quiz.title}
          backHref={lesson.module?.course ? `/courses/${lesson.module.course.slug}` : "/courses"}
          backLabel={lesson.module?.course ? `Back to ${lesson.module.course.title}` : "Back to catalog"}
        />

        <SectionPanel>
          <div className="p-5 sm:p-6">
            <div className="mb-6 rounded-lg bg-[#F8F7F4] p-4">
              <p className="text-sm font-semibold text-slate-900">Before you start</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Treat this as a self-study assessment. Submit each answer to unlock the rationale,
                calculation steps, and source reference.
              </p>
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

  if (lesson.lessonType === "video" && lesson.videoPlaybackId) {
    return (
      <LearnerPage width="narrow">
        <PageHeader
          eyebrow="Video lesson"
          title={lesson.title}
          backHref={lesson.module?.course ? `/courses/${lesson.module.course.slug}` : "/courses"}
          backLabel={lesson.module?.course ? `Back to ${lesson.module.course.title}` : "Back to catalog"}
        />
        <div className="aspect-video overflow-hidden rounded-lg bg-slate-950 shadow-sm">
          <iframe
            src={`https://iframe.mux.com/${lesson.videoPlaybackId}`}
            className="h-full w-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      </LearnerPage>
    );
  }

  if (lesson.lessonType === "text" && lesson.contentJson) {
    return (
      <LearnerPage width="narrow">
        <PageHeader
          eyebrow="Reading"
          title={lesson.title}
          backHref={lesson.module?.course ? `/courses/${lesson.module.course.slug}` : "/courses"}
          backLabel={lesson.module?.course ? `Back to ${lesson.module.course.title}` : "Back to catalog"}
        />
        <SectionPanel>
          <div className="prose prose-slate max-w-none p-6 text-sm leading-7">
            {lesson.contentJson}
          </div>
        </SectionPanel>
      </LearnerPage>
    );
  }

  return (
    <LearnerPage width="narrow">
      <div className="rounded-lg border border-dashed border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500">
        This lesson has no content yet.
      </div>
    </LearnerPage>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
