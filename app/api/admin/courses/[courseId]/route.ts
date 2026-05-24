import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { formatUuid } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  const { courseId } = await params;

  let normalizedId: string;
  try {
    normalizedId = formatUuid(courseId);
  } catch {
    return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
  }

  try {
    const [coursesData, quizzesData] = await Promise.all([
      adminDcQuery<{ courses: any[] }>("AdminListCourses").catch(() => ({ courses: [] })),
      adminDcQuery<{ quizzes: any[] }>("ListAdminQuizzes").catch(() => ({ quizzes: [] })),
    ]);

    const course = coursesData.courses.find((c: any) => formatUuid(c.id) === normalizedId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const quizMap = new Map<string, any>(
      quizzesData.quizzes.map((q: any) => [formatUuid(q.id), q])
    );

    // Collect unique quiz IDs from lessons in this course for readiness checks
    const allLessons = (course.modules_on_course ?? []).flatMap((m: any) => m.lessons_on_module ?? []);
    const linkedQuizIds = [...new Set(
      allLessons
        .filter((l: any) => l.lessonType === "quiz" && l.quiz?.id)
        .map((l: any) => formatUuid(l.quiz.id))
    )];

    // Fetch quiz question data in parallel to compute readiness
    const quizReadinessMap = new Map<string, { questionCount: number; incompleteQuestionCount: number }>();
    if (linkedQuizIds.length > 0) {
      const quizQuestionResults = await Promise.all(
        linkedQuizIds.map((qId) =>
          adminDcQuery<{ quizQuestions: any[] }>("GetQuizQuestionCount", { quizId: qId })
            .then((d) => ({ quizId: qId, questions: d?.quizQuestions ?? [] }))
            .catch(() => ({ quizId: qId, questions: [] }))
        )
      );
      // For readiness we need isCorrect — use a richer admin query for each quiz
      const richResults = await Promise.all(
        linkedQuizIds.map((qId) =>
          adminDcQuery<{ quizQuestions: any[] }>("GetQuizQuestionsAdmin", { quizId: qId })
            .then((d) => ({ quizId: qId as string, questions: d?.quizQuestions ?? [] }))
            .catch(() => ({ quizId: qId as string, questions: [] as any[] }))
        )
      );
      void quizQuestionResults; // unused after switching to richer query
      for (const { quizId, questions } of richResults) {
        const questionCount = questions.length;
        const incompleteQuestionCount = questions.filter(
          (qq: any) => !qq.question?.answerChoices_on_question?.some((c: any) => c.isCorrect)
        ).length;
        quizReadinessMap.set(quizId, { questionCount, incompleteQuestionCount });
      }
    }

    const modules = (course.modules_on_course ?? [])
      .slice()
      .sort((a: any, b: any) => a.position - b.position)
      .map((mod: any) => ({
        id: mod.id,
        title: mod.title,
        description: mod.description ?? null,
        learningObjectives: mod.learningObjectives ?? null,
        prerequisiteModuleIds: mod.prerequisiteModuleIds ?? null,
        position: mod.position,
        status: mod.status,
        lessons: (mod.lessons_on_module ?? [])
          .slice()
          .sort((a: any, b: any) => a.position - b.position)
          .map((lesson: any) => {
            const linkedQuiz = lesson.quiz?.id ? quizMap.get(formatUuid(lesson.quiz.id)) : null;
            const quizCounts = lesson.quiz?.id ? quizReadinessMap.get(formatUuid(lesson.quiz.id)) : null;
            return {
              id: lesson.id,
              title: lesson.title,
              position: lesson.position,
              lessonType: lesson.lessonType,
              status: lesson.status,
              isPublished: lesson.isPublished,
              durationSeconds: lesson.durationSeconds ?? null,
              videoPlaybackId: lesson.videoPlaybackId ?? null,
              videoUrl: lesson.videoUrl ?? null,
              contentJson: lesson.contentJson ?? null,
              quiz: linkedQuiz
                ? {
                    id: linkedQuiz.id,
                    title: linkedQuiz.title,
                    status: linkedQuiz.status,
                    passingScore: linkedQuiz.passingScore ?? null,
                    timeLimitSeconds: linkedQuiz.timeLimitSeconds ?? null,
                    shuffleQuestions: linkedQuiz.shuffleQuestions,
                    shuffleChoices: linkedQuiz.shuffleChoices,
                    questionCount: quizCounts?.questionCount ?? 0,
                    incompleteQuestionCount: quizCounts?.incompleteQuestionCount ?? 0,
                  }
                : null,
              sourceMaterial: lesson.sourceMaterial
                ? { id: lesson.sourceMaterial.id, title: lesson.sourceMaterial.title }
                : null,
            };
          }),
      }));

    return NextResponse.json({
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description ?? null,
        status: course.status,
        isPublished: course.isPublished,
        updatedAt: course.updatedAt,
      },
      modules,
    });
  } catch (err) {
    console.error("[admin/courses/[courseId]:GET]", err);
    return NextResponse.json({ error: "Failed to load course" }, { status: 500 });
  }
}
