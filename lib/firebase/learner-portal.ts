// Backend learner data services: lib/firebase/learner-portal.ts
// All Data Connect operations are NO_ACCESS and must only be called by trusted server code.

import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { formatUuid } from "@/lib/utils";

export type DataConnectDate = string;

export interface LearnerLessonSummary {
  id: string;
  title: string;
  position: number;
  lessonType: string;
  durationSeconds: number | null;
}

export interface LearnerModuleSummary {
  id: string;
  title: string;
  position: number;
  lessons_on_module: LearnerLessonSummary[];
}

export interface LearnerCatalogCourseRecord {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  publishedAt: DataConnectDate | null;
  modules_on_course: LearnerModuleSummary[];
}

export interface LearnerCourseProgressRecord {
  course: { id: string };
  enrolledAt: DataConnectDate;
  lastAccessedAt: DataConnectDate | null;
  completedAt: DataConnectDate | null;
}

export interface LearnerLessonProgressRecord {
  lesson: { id: string };
  status: string;
  videoPositionSeconds: number | null;
  completedAt: DataConnectDate | null;
}

export interface LearnerCatalogMetrics {
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  totalDurationSeconds: number;
  enrolledAt: DataConnectDate | null;
  lastAccessedAt: DataConnectDate | null;
  completedAt: DataConnectDate | null;
}

export interface LearnerCatalogCourse extends LearnerCatalogCourseRecord {
  metrics: LearnerCatalogMetrics;
}

export interface LearnerPortalMetrics {
  publishedCourses: number;
  publishedLessons: number;
  publishedQuizzes: number;
  completedLessons: number;
  progressPercent: number;
}

interface GetLearnerCatalogData {
  courses: LearnerCatalogCourseRecord[];
  userCourseProgresses: LearnerCourseProgressRecord[];
  userLessonProgresses: LearnerLessonProgressRecord[];
}

export interface PublishedQuiz {
  id: string;
  title: string;
  description: string | null;
  timeLimitSeconds: number | null;
  passingScore: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  calculatorSettingsJson: string | null;
  publishedAt: DataConnectDate | null;
  quizQuestions_on_quiz?: QuizSummaryQuestion[];
}

export interface QuizSummaryQuestion {
  position: number;
  pointValue: number;
  question: {
    id: string;
    domain: string;
    difficulty: string;
  };
}

export interface QuizSummaryAttempt {
  id: string;
  scoreRaw: number | null;
  scoreMax: number | null;
  scorePct: number | null;
  passed: boolean | null;
  completedAt: DataConnectDate | null;
}

export interface LearnerQuizAttempt extends QuizSummaryAttempt {
  quiz: { id: string; title: string };
}

export interface ExamCatalogItem extends Omit<PublishedQuiz, "quizQuestions_on_quiz"> {
  questionCount: number;
  domainCount: number;
  domains: string[];
  attemptCount: number;
  bestScorePct: number | null;
  latestAttempt: LearnerQuizAttempt | null;
}

export interface QuizAggregation {
  questionCount: number;
  totalPoints: number;
  attemptCount: number;
  averageScorePct: number | null;
  passRatePct: number | null;
}

export interface QuizSummary {
  quiz: {
    id: string;
    title: string;
    description: string | null;
    timeLimitSeconds: number | null;
    passingScore: number | null;
    status: string;
    publishedAt: DataConnectDate | null;
  } | null;
  quizQuestions: QuizSummaryQuestion[];
  aggregation: Pick<QuizAggregation, "questionCount" | "totalPoints">;
}

interface GetQuizSummaryData {
  quiz: QuizSummary["quiz"];
  quizQuestions: QuizSummaryQuestion[];
}

export interface AttemptReviewAnswerChoice {
  id: string;
  letter: string;
  choiceText: string;
  isCorrect: boolean;
  explanation: string | null;
  position: number;
}

export interface AttemptReviewResponse {
  selectedLetters: string;
  isCorrect: boolean | null;
  pointsEarned: number | null;
  pointsPossible: number | null;
  answeredAt: DataConnectDate | null;
  question: {
    id: string;
    questionText: string;
    difficulty: string;
    domain: string;
    formulaRef: string | null;
    rationale: string | null;
    calculation: string | null;
    sourceRef: string | null;
    answerChoices_on_question: AttemptReviewAnswerChoice[];
  };
}

export interface AttemptReviewQuizQuestion {
  position: number;
  pointValue: number;
  question: AttemptReviewResponse["question"];
}

export interface AttemptReview {
  id: string;
  status: string;
  questionOrder: string;
  scoreRaw: number | null;
  scoreMax: number | null;
  scorePct: number | null;
  passed: boolean | null;
  startedAt: DataConnectDate;
  completedAt: DataConnectDate | null;
  user: { id: string };
  quiz: {
    id: string;
    title: string;
    passingScore: number | null;
    quizQuestions_on_quiz: AttemptReviewQuizQuestion[];
  };
  quizResponses_on_attempt: AttemptReviewResponse[];
}

export type AttemptReviewAccessStatus = "allowed" | "not_found" | "forbidden" | "incomplete";

export interface NormalizedAttemptReviewChoice {
  id: string;
  letter: string;
  text: string;
  isCorrect: boolean;
  isSelected: boolean;
  explanation: string | null;
}

export interface NormalizedAttemptReviewQuestion {
  id: string;
  position: number;
  questionText: string;
  difficulty: string;
  domain: string;
  formulaRef: string | null;
  selectedLetters: string[];
  correctLetters: string[];
  isCorrect: boolean | null;
  pointsEarned: number;
  pointsPossible: number;
  choices: NormalizedAttemptReviewChoice[];
  rationale: string | null;
  calculation: string | null;
  sourceRef: string | null;
}

export interface NormalizedAttemptReview {
  attemptId: string;
  status: "completed";
  startedAt: DataConnectDate;
  completedAt: DataConnectDate | null;
  score: {
    raw: number;
    max: number;
    percentage: number;
    passed: boolean | null;
  };
  quiz: {
    id: string;
    title: string;
    passingScore: number | null;
  };
  questions: NormalizedAttemptReviewQuestion[];
}

export interface LearnerSourceMaterial {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  status: string;
  reviewStatus: string;
  sizeBytes: number | null;
  createdAt: DataConnectDate;
  updatedAt: DataConnectDate;
  folder: { id: string; name: string; folderType: string } | null;
  sourceMaterialTagAssignments_on_sourceMaterial: Array<{
    tag: { id: string; name: string; color: string | null };
  }>;
}

interface LearnerSourceMaterialRecord extends Omit<LearnerSourceMaterial, "sizeBytes"> {
  metadataJson: string | null;
  visibility: string;
  archivedAt: DataConnectDate | null;
  trashedAt: DataConnectDate | null;
}

export interface LearnerSourceMaterialAccess {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  storagePath: string;
  downloadUrl: string | null;
  status: string;
  visibility: string;
  metadataJson: string | null;
  archivedAt: DataConnectDate | null;
  trashedAt: DataConnectDate | null;
  updatedAt: DataConnectDate;
  lessons_on_sourceMaterial: PublishedLessonReference[];
  contentSourceLinks_on_sourceMaterial: Array<{
    lesson: PublishedLessonReference | null;
  }>;
}

interface PublishedLessonReference {
  id: string;
  status: string;
  isPublished: boolean;
}

export type LearnerSourceMaterialAccessStatus = "allowed" | "not_found";

export interface LessonProgressUpdate {
  userId: string;
  lessonId: string;
  status: "not_started" | "in_progress" | "completed";
  videoPositionSeconds?: number | null;
  completedAt?: DataConnectDate | null;
}

export interface LessonProgressRequest {
  userId: string;
  lessonId: string;
  status?: LessonProgressUpdate["status"];
  videoPositionSeconds?: number;
}

export type LessonProgressOperation =
  | {
      operationName: "UpdateLessonPlayback";
      variables: {
        userId: string;
        lessonId: string;
        videoPositionSeconds: number | null;
      };
    }
  | {
      operationName: "CompleteLessonProgress";
      variables: {
        userId: string;
        lessonId: string;
        videoPositionSeconds: number | null;
        completedAt: DataConnectDate;
      };
    };

export interface StoredLessonProgress {
  status: string;
  videoPositionSeconds: number | null;
  completedAt: DataConnectDate | null;
}

export interface QuizCompletionQuestion {
  position: number;
  pointValue: number;
  question: { id: string; domain: string };
}

export interface QuizCompletionResponse {
  pointsEarned: number | null;
  pointsPossible: number | null;
  question: { id: string; domain: string };
}

export interface QuizCompletionCalculation {
  scoreRaw: number;
  scoreMax: number;
  scorePct: number;
  domainBreakdown: Record<string, { earned: number; possible: number }>;
}

export interface QuizAttemptCompletion {
  id: string;
  scoreRaw: number;
  scoreMax: number;
  scorePct: number;
  passed: boolean;
  completedAt: DataConnectDate;
}

export interface CourseProgressTimestampUpdate {
  userId: string;
  courseId: string;
  lastAccessedAt?: DataConnectDate | null;
  completedAt?: DataConnectDate | null;
}

/**
 * Derives learner-facing completion metrics without mutating query records.
 */
export function deriveCatalogMetrics(
  courses: LearnerCatalogCourseRecord[],
  courseProgressRecords: LearnerCourseProgressRecord[],
  lessonProgressRecords: LearnerLessonProgressRecord[],
): LearnerCatalogCourse[] {
  const courseProgressByCourseId = new Map(
    courseProgressRecords.map((progressRecord) => [progressRecord.course.id, progressRecord]),
  );
  const lessonProgressByLessonId = new Map(
    lessonProgressRecords.map((progressRecord) => [progressRecord.lesson.id, progressRecord]),
  );

  return courses.map((course) => {
    const lessons = course.modules_on_course.flatMap((courseModule) => courseModule.lessons_on_module);
    const completedLessons = lessons.filter(
      (lesson) => lessonProgressByLessonId.get(lesson.id)?.status === "completed",
    ).length;
    const totalLessons = lessons.length;
    const courseProgress = courseProgressByCourseId.get(course.id);

    return {
      ...course,
      metrics: {
        totalLessons,
        completedLessons,
        progressPercent: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
        totalDurationSeconds: lessons.reduce(
          (totalDuration, lesson) => totalDuration + (lesson.durationSeconds ?? 0),
          0,
        ),
        enrolledAt: courseProgress?.enrolledAt ?? null,
        lastAccessedAt: courseProgress?.lastAccessedAt ?? null,
        completedAt: courseProgress?.completedAt ?? null,
      },
    };
  });
}

/**
 * Summarizes only published catalog and quiz records for dashboard display.
 */
export function deriveLearnerPortalMetrics(
  courses: LearnerCatalogCourse[],
  quizzes: PublishedQuiz[],
): LearnerPortalMetrics {
  const publishedLessons = courses.reduce(
    (totalLessons, course) => totalLessons + course.metrics.totalLessons,
    0,
  );
  const completedLessons = courses.reduce(
    (totalCompleted, course) => totalCompleted + course.metrics.completedLessons,
    0,
  );

  return {
    publishedCourses: courses.length,
    publishedLessons,
    publishedQuizzes: quizzes.length,
    completedLessons,
    progressPercent:
      publishedLessons === 0 ? 0 : Math.round((completedLessons / publishedLessons) * 100),
  };
}

/**
 * Keeps lesson completion monotonic while allowing playback position updates.
 */
export function deriveLessonProgressUpdate(
  existingProgress: StoredLessonProgress | null,
  requestedUpdate: Pick<LessonProgressUpdate, "status" | "videoPositionSeconds">,
  completedAt: DataConnectDate,
): Pick<LessonProgressUpdate, "status" | "videoPositionSeconds" | "completedAt"> {
  const wasCompleted = existingProgress?.status === "completed";
  const isFirstCompletion = !wasCompleted && requestedUpdate.status === "completed";

  return {
    status: wasCompleted ? "completed" : requestedUpdate.status,
    videoPositionSeconds:
      requestedUpdate.videoPositionSeconds === undefined
        ? existingProgress?.videoPositionSeconds ?? null
        : requestedUpdate.videoPositionSeconds,
    completedAt: wasCompleted
      ? existingProgress.completedAt
      : isFirstCompletion
        ? completedAt
        : null,
  };
}

/**
 * Selects a datastore operation whose update shape enforces monotonic completion.
 * Playback operations omit completion fields; only completion operations set them.
 */
export function selectLessonProgressOperation(
  request: LessonProgressRequest,
  completedAt: DataConnectDate,
): LessonProgressOperation {
  const sharedVariables = {
    userId: request.userId,
    lessonId: request.lessonId,
    videoPositionSeconds: request.videoPositionSeconds ?? null,
  };

  return request.status === "completed"
    ? {
        operationName: "CompleteLessonProgress",
        variables: { ...sharedVariables, completedAt },
      }
    : {
        operationName: "UpdateLessonPlayback",
        variables: sharedVariables,
      };
}

/**
 * Scores the complete attempted question set, counting unanswered questions as zero.
 */
export function deriveQuizCompletion(
  questionOrder: string,
  quizQuestions: QuizCompletionQuestion[],
  responses: QuizCompletionResponse[],
): QuizCompletionCalculation {
  const questionsById = new Map(
    quizQuestions.map((quizQuestion) => [formatUuid(quizQuestion.question.id), quizQuestion]),
  );
  const persistedQuestionIds = parsePersistedStringList(questionOrder).map(formatUuid);
  const hasValidQuestionOrder =
    persistedQuestionIds.length > 0
    && persistedQuestionIds.every((questionId) => questionsById.has(questionId));
  const scoredQuestionIds = hasValidQuestionOrder
    ? persistedQuestionIds
    : [...quizQuestions]
        .sort((firstQuestion, secondQuestion) => firstQuestion.position - secondQuestion.position)
        .map((quizQuestion) => formatUuid(quizQuestion.question.id));
  const responsesByQuestionId = new Map(
    responses.map((response) => [formatUuid(response.question.id), response]),
  );
  const domainBreakdown: Record<string, { earned: number; possible: number }> = {};
  let scoreRaw = 0;
  let scoreMax = 0;

  for (const questionId of scoredQuestionIds) {
    const quizQuestion = questionsById.get(questionId);
    if (!quizQuestion) continue;
    const response = responsesByQuestionId.get(questionId);
    const earned = response?.pointsEarned ?? 0;
    const possible = quizQuestion.pointValue;
    const domain = quizQuestion.question.domain || "unknown";
    const domainScore = domainBreakdown[domain] ?? { earned: 0, possible: 0 };

    scoreRaw += earned;
    scoreMax += possible;
    domainScore.earned += earned;
    domainScore.possible += possible;
    domainBreakdown[domain] = domainScore;
  }

  return {
    scoreRaw,
    scoreMax,
    scorePct: scoreMax > 0 ? Math.round((scoreRaw / scoreMax) * 10000) / 100 : 0,
    domainBreakdown,
  };
}

/**
 * Aggregates quiz shape and cohort outcomes for reusable server-rendered views.
 */
export function deriveQuizAggregation(
  questions: QuizSummaryQuestion[],
  attempts: QuizSummaryAttempt[],
): QuizAggregation {
  const scoredAttempts = attempts.filter(
    (attempt): attempt is QuizSummaryAttempt & { scorePct: number } => attempt.scorePct !== null,
  );
  const gradedAttempts = attempts.filter(
    (attempt): attempt is QuizSummaryAttempt & { passed: boolean } => attempt.passed !== null,
  );
  const passedAttempts = gradedAttempts.filter((attempt) => attempt.passed).length;

  return {
    questionCount: questions.length,
    totalPoints: questions.reduce((totalPoints, question) => totalPoints + question.pointValue, 0),
    attemptCount: attempts.length,
    averageScorePct:
      scoredAttempts.length === 0
        ? null
        : Math.round(
            (scoredAttempts.reduce((totalScore, attempt) => totalScore + attempt.scorePct, 0) /
              scoredAttempts.length) *
              100,
          ) / 100,
    passRatePct:
      gradedAttempts.length === 0
        ? null
        : Math.round((passedAttempts / gradedAttempts.length) * 10000) / 100,
  };
}

/**
 * Joins published quiz structure with attempts already scoped to one learner.
 */
export function deriveExamCatalog(
  quizzes: PublishedQuiz[],
  attempts: LearnerQuizAttempt[],
): ExamCatalogItem[] {
  const attemptsByQuizId = new Map<string, LearnerQuizAttempt[]>();

  for (const attempt of attempts) {
    const quizId = formatUuid(attempt.quiz.id);
    const quizAttempts = attemptsByQuizId.get(quizId) ?? [];
    quizAttempts.push(attempt);
    attemptsByQuizId.set(quizId, quizAttempts);
  }

  return quizzes.map(({ quizQuestions_on_quiz: questions = [], ...quiz }) => {
    const quizAttempts = [...(attemptsByQuizId.get(formatUuid(quiz.id)) ?? [])].sort(
      (firstAttempt, secondAttempt) => {
        const firstTimestamp = Date.parse(firstAttempt.completedAt ?? "");
        const secondTimestamp = Date.parse(secondAttempt.completedAt ?? "");
        return (Number.isFinite(secondTimestamp) ? secondTimestamp : 0)
          - (Number.isFinite(firstTimestamp) ? firstTimestamp : 0);
      },
    );
    const scoredAttempts = quizAttempts.filter(
      (attempt): attempt is LearnerQuizAttempt & { scorePct: number } =>
        attempt.scorePct !== null,
    );
    const domains = Array.from(
      new Set(
        questions
          .map((question) => question.question.domain.trim())
          .filter(Boolean),
      ),
    ).sort((firstDomain, secondDomain) => firstDomain.localeCompare(secondDomain));

    return {
      ...quiz,
      questionCount: questions.length,
      domainCount: domains.length,
      domains,
      attemptCount: quizAttempts.length,
      bestScorePct:
        scoredAttempts.length === 0
          ? null
          : Math.max(...scoredAttempts.map((attempt) => attempt.scorePct)),
      latestAttempt: quizAttempts[0] ?? null,
    };
  });
}

/**
 * Treats unknown visibility as private and removes stale or failed resources.
 * Uploaded and parsed assets are both usable because ingestion is not required
 * for the original file to be viewed or downloaded.
 */
export function mapSafeLearnerSourceMaterial(
  material: LearnerSourceMaterialRecord,
): LearnerSourceMaterial | null {
  if (
    material.visibility !== "learner"
    || material.archivedAt !== null
    || material.trashedAt !== null
    || material.status === "failed"
  ) {
    return null;
  }

  let sizeBytes: number | null = null;
  try {
    const metadata: unknown = material.metadataJson ? JSON.parse(material.metadataJson) : null;
    if (
      typeof metadata === "object"
      && metadata !== null
      && "sizeBytes" in metadata
      && typeof metadata.sizeBytes === "number"
      && Number.isFinite(metadata.sizeBytes)
      && metadata.sizeBytes >= 0
    ) {
      sizeBytes = metadata.sizeBytes;
    }
  } catch {
    sizeBytes = null;
  }

  return {
    id: formatUuid(material.id),
    title: material.title,
    fileName: material.fileName,
    fileType: material.fileType,
    status: material.status,
    reviewStatus: material.reviewStatus,
    sizeBytes,
    createdAt: material.createdAt,
    updatedAt: material.updatedAt,
    folder: material.folder,
    sourceMaterialTagAssignments_on_sourceMaterial:
      material.sourceMaterialTagAssignments_on_sourceMaterial,
  };
}

function isPublishedLesson(lesson: PublishedLessonReference | null): boolean {
  return lesson?.isPublished === true;
}

/**
 * Allows a current learner asset directly, or a private asset used by a
 * published lesson. Archived, trashed, failed, and unknown records stay hidden.
 */
export function getLearnerSourceMaterialAccessStatus(
  material: LearnerSourceMaterialAccess | null,
): LearnerSourceMaterialAccessStatus {
  if (
    !material
    || material.archivedAt !== null
    || material.trashedAt !== null
    || material.status === "failed"
  ) {
    return "not_found";
  }

  const isLessonAttachment =
    material.lessons_on_sourceMaterial.some(isPublishedLesson)
    || material.contentSourceLinks_on_sourceMaterial.some((link) =>
      isPublishedLesson(link.lesson));

  return material.visibility === "learner" || isLessonAttachment
    ? "allowed"
    : "not_found";
}

/**
 * Converts the persisted JSON array format into a safe, de-duplicated string list.
 */
function parsePersistedStringList(serializedValue: string): string[] {
  try {
    const parsedValue: unknown = JSON.parse(serializedValue);
    if (!Array.isArray(parsedValue)) return [];

    return Array.from(
      new Set(
        parsedValue
          .filter((entry): entry is string => typeof entry === "string")
          .map((entry) => entry.trim())
          .filter(Boolean),
      ),
    );
  } catch {
    return [];
  }
}

/**
 * Centralizes the ownership and completion gate used before answer keys are normalized.
 */
export function getAttemptReviewAccessStatus(
  attempt: AttemptReview | null,
  learnerUserId: string,
): AttemptReviewAccessStatus {
  if (!attempt) return "not_found";
  if (attempt.user.id !== learnerUserId) return "forbidden";
  if (attempt.status !== "completed") return "incomplete";
  return "allowed";
}

/**
 * Produces the learner-facing review in the persisted question order.
 * Callers must pass only an attempt that has already cleared the completion gate.
 */
export function normalizeAttemptReview(attempt: AttemptReview): NormalizedAttemptReview {
  if (attempt.status !== "completed") {
    throw new Error("Cannot normalize an incomplete quiz attempt");
  }

  const orderedQuestionIds = Array.from(
    new Set(parsePersistedStringList(attempt.questionOrder).map(formatUuid)),
  );
  const responseByQuestionId = new Map(
    attempt.quizResponses_on_attempt.map((response) => [
      formatUuid(response.question.id),
      response,
    ]),
  );
  const quizQuestionById = new Map(
    attempt.quiz.quizQuestions_on_quiz.map((quizQuestion) => [
      formatUuid(quizQuestion.question.id),
      quizQuestion,
    ]),
  );
  const hasValidQuestionOrder =
    orderedQuestionIds.length > 0
    && orderedQuestionIds.every((questionId) => quizQuestionById.has(questionId));
  const responseOrder = hasValidQuestionOrder
    ? orderedQuestionIds
    : [...attempt.quiz.quizQuestions_on_quiz]
        .sort((firstQuestion, secondQuestion) => firstQuestion.position - secondQuestion.position)
        .map((quizQuestion) => formatUuid(quizQuestion.question.id));

  const questions = responseOrder.flatMap((questionId, questionIndex) => {
    const response = responseByQuestionId.get(questionId);
    const quizQuestion = quizQuestionById.get(questionId);
    if (!quizQuestion) return [];
    const question = quizQuestion.question;

    const selectedLetters = response ? parsePersistedStringList(response.selectedLetters) : [];
    const choices = [...question.answerChoices_on_question]
      .sort((firstChoice, secondChoice) => firstChoice.position - secondChoice.position)
      .map((choice) => ({
        id: formatUuid(choice.id),
        letter: choice.letter,
        text: choice.choiceText,
        isCorrect: choice.isCorrect,
        isSelected: selectedLetters.includes(choice.letter),
        explanation: choice.explanation,
      }));

    return [{
      id: questionId,
      position: questionIndex + 1,
      questionText: question.questionText,
      difficulty: question.difficulty,
      domain: question.domain,
      formulaRef: question.formulaRef,
      selectedLetters,
      correctLetters: choices.filter((choice) => choice.isCorrect).map((choice) => choice.letter),
      isCorrect: response?.isCorrect ?? null,
      pointsEarned: response?.pointsEarned ?? 0,
      pointsPossible: quizQuestion.pointValue,
      choices,
      rationale: question.rationale,
      calculation: question.calculation,
      sourceRef: question.sourceRef,
    }];
  });

  return {
    attemptId: formatUuid(attempt.id),
    status: "completed",
    startedAt: attempt.startedAt,
    completedAt: attempt.completedAt,
    score: {
      raw: attempt.scoreRaw ?? 0,
      max: attempt.scoreMax ?? 0,
      percentage: attempt.scorePct ?? 0,
      passed: attempt.passed,
    },
    quiz: {
      id: formatUuid(attempt.quiz.id),
      title: attempt.quiz.title,
      passingScore: attempt.quiz.passingScore,
    },
    questions,
  };
}

export async function getLearnerCatalog(userId: string): Promise<LearnerCatalogCourse[]> {
  const catalogData = await adminDcQuery<GetLearnerCatalogData>("GetLearnerCatalog", { userId });
  return deriveCatalogMetrics(
    catalogData.courses,
    catalogData.userCourseProgresses,
    catalogData.userLessonProgresses,
  );
}

export async function listPublishedLearnerCatalog(): Promise<LearnerCatalogCourse[]> {
  const catalogData = await adminDcQuery<{ courses: LearnerCatalogCourseRecord[] }>(
    "ListPublishedCourses",
  );
  return deriveCatalogMetrics(catalogData.courses, [], []);
}

export async function listPublishedQuizzes(): Promise<PublishedQuiz[]> {
  const quizData = await adminDcQuery<{ quizzes: PublishedQuiz[] }>("ListPublishedQuizzes");
  return quizData.quizzes;
}

export async function getExamCatalog(userId: string): Promise<ExamCatalogItem[]> {
  const [quizzes, attemptData] = await Promise.all([
    listPublishedQuizzes(),
    adminDcQuery<{ quizAttempts: LearnerQuizAttempt[] }>("GetUserAttemptHistory", { userId }),
  ]);
  return deriveExamCatalog(quizzes, attemptData.quizAttempts);
}

export async function getAttemptReview(attemptId: string): Promise<AttemptReview | null> {
  const reviewData = await adminDcQuery<{ quizAttempt: AttemptReview | null }>("GetAttemptReview", {
    attemptId,
  });
  return reviewData.quizAttempt;
}

export async function listLearnerSourceMaterials(): Promise<LearnerSourceMaterial[]> {
  const materialData = await adminDcQuery<{ sourceMaterials: LearnerSourceMaterialRecord[] }>(
    "ListLearnerSourceMaterials",
  );
  return materialData.sourceMaterials.flatMap((material) => {
    const safeMaterial = mapSafeLearnerSourceMaterial(material);
    return safeMaterial ? [safeMaterial] : [];
  });
}

export async function getLearnerSourceMaterialAccess(
  materialId: string,
): Promise<LearnerSourceMaterialAccess | null> {
  const materialData = await adminDcQuery<{
    sourceMaterials: LearnerSourceMaterialAccess[];
  }>("GetLearnerSourceMaterialAccess", { materialId });
  return materialData.sourceMaterials[0] ?? null;
}

export async function getQuizSummary(quizId: string): Promise<QuizSummary> {
  const summaryData = await adminDcQuery<GetQuizSummaryData>("GetQuizSummary", { quizId });
  return {
    ...summaryData,
    aggregation: {
      questionCount: summaryData.quizQuestions.length,
      totalPoints: summaryData.quizQuestions.reduce(
        (totalPoints, question) => totalPoints + question.pointValue,
        0,
      ),
    },
  };
}

export async function upsertLessonProgress(update: LessonProgressUpdate): Promise<void> {
  await adminDcMutate("UpsertLessonProgress", {
    userId: update.userId,
    lessonId: update.lessonId,
    status: update.status,
    videoPositionSeconds: update.videoPositionSeconds ?? null,
    completedAt: update.completedAt ?? null,
  });
}

export async function updateLessonPlayback(
  update: Extract<LessonProgressOperation, { operationName: "UpdateLessonPlayback" }>["variables"],
): Promise<void> {
  await adminDcMutate("UpdateLessonPlayback", update);
}

export async function completeLessonProgress(
  completion: Extract<LessonProgressOperation, { operationName: "CompleteLessonProgress" }>["variables"],
): Promise<void> {
  await adminDcMutate("CompleteLessonProgress", completion);
}

export async function applyLessonProgressOperation(
  operation: LessonProgressOperation,
): Promise<void> {
  if (operation.operationName === "CompleteLessonProgress") {
    await completeLessonProgress(operation.variables);
    return;
  }

  await updateLessonPlayback(operation.variables);
}

export async function completeQuizAttempt(completion: QuizAttemptCompletion): Promise<void> {
  await adminDcMutate("CompleteQuizAttempt", {
    id: completion.id,
    scoreRaw: completion.scoreRaw,
    scoreMax: completion.scoreMax,
    scorePct: completion.scorePct,
    passed: completion.passed,
    completedAt: completion.completedAt,
  });
}

export async function updateUserCourseProgress(
  update: CourseProgressTimestampUpdate,
): Promise<void> {
  await adminDcMutate("UpdateUserCourseProgress", {
    userId: update.userId,
    courseId: update.courseId,
    lastAccessedAt: update.lastAccessedAt ?? null,
    completedAt: update.completedAt ?? null,
  });
}
