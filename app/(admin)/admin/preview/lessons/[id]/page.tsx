import { LearnerPage, PageHeader } from "@/components/ui/LearnerPrimitives";
import { StudentPreviewBanner } from "@/components/admin/StudentPreviewBanner";
import { LessonStudentPreview } from "@/components/admin/LessonStudentPreview";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { getDevLessonById } from "@/lib/dev-content";
import { ensureDevDataSeeded } from "@/lib/dev-seed";
import * as Icons from "@/components/ui/Icons";

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
          passingScore?: number | null;
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

export default async function AdminPreviewLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = await fetchLesson(id);

  const courseSlug = (lesson as any)?.module?.course?.slug;
  const courseTitle = (lesson as any)?.module?.course?.title;
  const backHref = courseSlug ? `/admin/preview/courses/${courseSlug}` : "/admin/preview/courses";
  const backLabel = courseTitle ? `Back to ${courseTitle}` : "Back to course catalog";

  if (!lesson) {
    return (
      <>
        <StudentPreviewBanner backHref="/admin/preview/courses" backLabel="Back to course catalog" />
        <LearnerPage width="narrow">
          <PageHeader
            backHref="/admin/preview/courses"
            backLabel="Back to courses"
            eyebrow="Lesson unavailable"
            title="We could not load this lesson"
            description="The lesson may not exist or the data service may be unavailable."
            icon={Icons.Inbox}
          />
        </LearnerPage>
      </>
    );
  }

  const lessonTypeLabel =
    lesson.lessonType === "video"
      ? "Video lesson"
      : lesson.lessonType === "quiz"
      ? "Practice lesson"
      : "Guided lesson";

  const lessonIcon =
    lesson.lessonType === "video"
      ? Icons.Video
      : lesson.lessonType === "quiz"
      ? Icons.ClipboardList
      : Icons.BookOpen;

  return (
    <>
      <StudentPreviewBanner backHref={backHref} backLabel={backLabel} />
      <LearnerPage width="narrow">
        <PageHeader
          backHref={backHref}
          backLabel={backLabel}
          eyebrow={lessonTypeLabel}
          title={lesson.title}
          icon={lessonIcon}
        />
        <LessonStudentPreview lesson={lesson as any} />
      </LearnerPage>
    </>
  );
}
