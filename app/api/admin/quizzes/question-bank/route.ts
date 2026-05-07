import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { formatUuid } from "@/lib/utils";
import {
  filterAndSortQuestionBankCandidates,
  parseTopicTags,
  type QuestionBankCandidate,
  type QuestionBankContext,
  type QuestionBankFilters,
  type QuestionBankSort,
} from "@/lib/admin/question-bank";

const uuidSchema = z.string().trim().transform(formatUuid).pipe(z.string().uuid());

const searchParamsSchema = z.object({
  quizId: uuidSchema,
  search: z.string().default(""),
  domains: z.string().default(""),
  difficulty: z.string().default(""),
  status: z.string().default(""),
  questionType: z.string().default(""),
  usageCurrentQuiz: z.coerce.boolean().default(true),
  usageCurrentModule: z.coerce.boolean().default(true),
  usageOtherQuizzes: z.coerce.boolean().default(true),
  onlyModuleRelevant: z.coerce.boolean().default(false),
  onlyMultiselect: z.coerce.boolean().default(false),
  sort: z
    .enum(["best-match", "newest", "domain", "difficulty", "most-used", "least-used", "unused-first"])
    .default("best-match"),
});

interface AdminQuestionRecord {
  id: string;
  questionText: string;
  questionType?: string | null;
  difficulty: string;
  domain: string;
  formulaRef?: string | null;
  topicTags?: string | null;
  status: string;
  createdAt: string;
  isMultiselect: boolean;
}

interface QuizQuestionUsageRecord {
  quiz: { id: string; title: string | null };
  question: { id: string };
}

interface LessonQuizRecord {
  id: string;
  title: string;
  quiz?: { id: string } | null;
  module?: { id: string; title: string } | null;
}

function normalizeFilters(params: z.infer<typeof searchParamsSchema>): QuestionBankFilters {
  return {
    search: params.search,
    domains: params.domains
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    difficulty: params.difficulty,
    status: params.status,
    questionType: params.questionType,
    usageCurrentQuiz: params.usageCurrentQuiz,
    usageCurrentModule: params.usageCurrentModule,
    usageOtherQuizzes: params.usageOtherQuizzes,
    onlyModuleRelevant: params.onlyModuleRelevant,
    onlyMultiselect: params.onlyMultiselect,
    sort: params.sort as QuestionBankSort,
  };
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  const parsed = searchParamsSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const filters = normalizeFilters(parsed.data);

  try {
    const [questionData, usageData] = await Promise.all([
      adminDcQuery<{ questions: AdminQuestionRecord[] }>("AdminListQuestions"),
      adminDcQuery<{ quizQuestions: QuizQuestionUsageRecord[]; lessons: LessonQuizRecord[] }>("AdminListQuizQuestionUsage"),
    ]);

    const lessonsByQuizId = new Map<string, LessonQuizRecord>();
    for (const lesson of usageData.lessons ?? []) {
      if (lesson.quiz?.id) {
        lessonsByQuizId.set(formatUuid(lesson.quiz.id), lesson);
      }
    }

    const quizId = parsed.data.quizId;
    const currentLesson = lessonsByQuizId.get(quizId) ?? null;
    const moduleId = currentLesson?.module?.id ? formatUuid(currentLesson.module.id) : null;
    const siblingQuizIds = [...lessonsByQuizId.entries()]
      .filter(([, lesson]) => lesson.module?.id && moduleId && formatUuid(lesson.module.id) === moduleId)
      .map(([candidateQuizId]) => candidateQuizId);
    const siblingQuizIdSet = new Set(siblingQuizIds);

    const questionUsageMap = new Map<
      string,
      {
        quizIds: Set<string>;
        quizTitles: Set<string>;
        moduleTitles: Set<string>;
        inCurrentQuiz: boolean;
        usedInCurrentModule: boolean;
        usedInOtherQuizzes: boolean;
      }
    >();

    for (const entry of usageData.quizQuestions ?? []) {
      const questionId = formatUuid(entry.question.id);
      const usedQuizId = formatUuid(entry.quiz.id);
      const lesson = lessonsByQuizId.get(usedQuizId) ?? null;
      const bucket = questionUsageMap.get(questionId) ?? {
        quizIds: new Set<string>(),
        quizTitles: new Set<string>(),
        moduleTitles: new Set<string>(),
        inCurrentQuiz: false,
        usedInCurrentModule: false,
        usedInOtherQuizzes: false,
      };

      bucket.quizIds.add(usedQuizId);
      if (entry.quiz.title) bucket.quizTitles.add(entry.quiz.title);
      if (lesson?.module?.title) bucket.moduleTitles.add(lesson.module.title);
      if (usedQuizId === quizId) bucket.inCurrentQuiz = true;
      else if (siblingQuizIdSet.has(usedQuizId)) bucket.usedInCurrentModule = true;
      else bucket.usedInOtherQuizzes = true;

      questionUsageMap.set(questionId, bucket);
    }

    const moduleQuestionIds = new Set<string>();
    for (const [questionId, usage] of questionUsageMap.entries()) {
      if (usage.inCurrentQuiz || usage.usedInCurrentModule) {
        moduleQuestionIds.add(questionId);
      }
    }

    const questionById = new Map(
      (questionData.questions ?? []).map((question) => [formatUuid(question.id), question])
    );

    const moduleDomains = new Set<string>();
    const moduleTags = new Set<string>();
    for (const questionId of moduleQuestionIds) {
      const question = questionById.get(questionId);
      if (!question) continue;
      if (question.domain) moduleDomains.add(question.domain);
      for (const tag of parseTopicTags(question.topicTags)) {
        moduleTags.add(tag.toLowerCase());
      }
    }

    const context: QuestionBankContext = {
      quizId,
      lessonId: currentLesson?.id ? formatUuid(currentLesson.id) : null,
      moduleId,
      moduleTitle: currentLesson?.module?.title ?? null,
      moduleDomains: [...moduleDomains],
      moduleTags: [...moduleTags],
      siblingQuizIds,
    };

    const candidates: QuestionBankCandidate[] = (questionData.questions ?? []).map((question) => {
      const questionId = formatUuid(question.id);
      const usage = questionUsageMap.get(questionId);
      const tags = parseTopicTags(question.topicTags).map((tag) => tag.toLowerCase());
      const matchesModuleDomain = moduleDomains.size > 0 && moduleDomains.has(question.domain);
      const matchesModuleTags = moduleTags.size > 0 && tags.some((tag) => moduleTags.has(tag));

      return {
        id: questionId,
        questionText: question.questionText,
        domain: question.domain,
        difficulty: question.difficulty,
        formulaRef: question.formulaRef ?? null,
        topicTags: question.topicTags ?? null,
        status: question.status,
        createdAt: question.createdAt,
        questionType: question.questionType ?? null,
        isMultiselect: question.isMultiselect,
        inCurrentQuiz: usage?.inCurrentQuiz ?? false,
        usedInCurrentModule: usage?.usedInCurrentModule ?? false,
        usedInOtherQuizzes: usage?.usedInOtherQuizzes ?? false,
        usageCount: usage?.quizIds.size ?? 0,
        quizTitles: [...(usage?.quizTitles ?? [])],
        moduleTitles: [...(usage?.moduleTitles ?? [])],
        matchesModuleDomain,
        matchesModuleTags,
      };
    });

    const sort = filters.sort === "best-match" && moduleDomains.size === 0 && moduleTags.size === 0 ? "newest" : filters.sort;
    const results = filterAndSortQuestionBankCandidates(candidates, { ...filters, sort });

    return NextResponse.json({
      context,
      candidates: results,
    });
  } catch (error) {
    console.error("[admin/quizzes/question-bank]", error);
    return NextResponse.json({ error: "Unable to load question bank for quiz" }, { status: 500 });
  }
}

