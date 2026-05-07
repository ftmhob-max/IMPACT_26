import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddQuestionToQuizData {
  quizQuestion_insert: QuizQuestion_Key;
}

export interface AddQuestionToQuizVariables {
  quizId: UUIDString;
  questionId: UUIDString;
  position: number;
  pointValue: number;
}

export interface AdminCohortStatsData {
  quizAttempts: ({
    id: UUIDString;
    user: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
      quiz: {
        id: UUIDString;
        title: string;
      } & Quiz_Key;
        scorePct?: number | null;
        passed?: boolean | null;
        completedAt?: DateString | null;
        quizResponses_on_attempt: ({
          isCorrect?: boolean | null;
          pointsEarned?: number | null;
          pointsPossible?: number | null;
          question: {
            id: UUIDString;
            domain: string;
            difficulty: string;
            questionText: string;
            topicTags?: string | null;
          } & Question_Key;
        })[];
  } & QuizAttempt_Key)[];
}

export interface AdminCountQuestionsData {
  questions: ({
    id: UUIDString;
  } & Question_Key)[];
}

export interface AdminListCoursesData {
  courses: ({
    id: UUIDString;
    slug: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    status: string;
    version: number;
    isPublished: boolean;
    publishedAt?: DateString | null;
    createdAt: DateString;
    updatedAt: DateString;
    createdBy: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
      modules_on_course: ({
        id: UUIDString;
        title: string;
        description?: string | null;
        learningObjectives?: string | null;
        prerequisiteModuleIds?: string | null;
        position: number;
        status: string;
        lessons_on_module: ({
          id: UUIDString;
          title: string;
          position: number;
          lessonType: string;
          status: string;
          isPublished: boolean;
          durationSeconds?: number | null;
          videoPlaybackId?: string | null;
          videoUrl?: string | null;
          contentJson?: string | null;
        } & Lesson_Key)[];
      } & Module_Key)[];
  } & Course_Key)[];
}

export interface AdminListQuestionsData {
  questions: ({
    id: UUIDString;
    questionText: string;
    questionType: string;
    difficulty: string;
    domain: string;
    formulaRef?: string | null;
    topicTags?: string | null;
    status: string;
    version: number;
    isMultiselect: boolean;
    rationale?: string | null;
    calculation?: string | null;
    sourceRef?: string | null;
    createdAt: DateString;
    answerChoices_on_question: ({
      id: UUIDString;
      letter: string;
      choiceText: string;
      isCorrect: boolean;
      explanation?: string | null;
      position: number;
    } & AnswerChoice_Key)[];
  } & Question_Key)[];
}

export interface AdminListQuestionsPageData {
  questions: ({
    id: UUIDString;
    questionText: string;
    questionType: string;
    difficulty: string;
    domain: string;
    formulaRef?: string | null;
    topicTags?: string | null;
    status: string;
    version: number;
    isMultiselect: boolean;
    createdAt: DateString;
  } & Question_Key)[];
}

export interface AdminListQuestionsPageVariables {
  limit: number;
  offset: number;
}

export interface AdminListSourceMaterialsData {
  sourceMaterials: ({
    id: UUIDString;
    title: string;
    fileName: string;
    fileType: string;
    storagePath: string;
    downloadUrl?: string | null;
    metadataJson?: string | null;
    status: string;
    createdAt: DateString;
    updatedAt: DateString;
    uploadedBy?: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
      ingestionJobs_on_sourceMaterial: ({
        id: UUIDString;
        status: string;
        parser: string;
        extractedCharacters: number;
        errorMessage?: string | null;
        createdAt: DateString;
        completedAt?: DateString | null;
      } & IngestionJob_Key)[];
  } & SourceMaterial_Key)[];
}

export interface AdminListUsersData {
  users: ({
    id: string;
    email: string;
    fullName?: string | null;
    role: string;
    createdAt: DateString;
  } & User_Key)[];
}

export interface AnswerChoice_Key {
  id: UUIDString;
  __typename?: 'AnswerChoice_Key';
}

export interface CompleteQuizAttemptData {
  quizAttempt_update?: QuizAttempt_Key | null;
}

export interface CompleteQuizAttemptVariables {
  id: UUIDString;
  scoreRaw: number;
  scoreMax: number;
  scorePct: number;
  passed: boolean;
}

export interface ContentSourceLink_Key {
  id: UUIDString;
  __typename?: 'ContentSourceLink_Key';
}

export interface Course_Key {
  id: UUIDString;
  __typename?: 'Course_Key';
}

export interface CreateAnswerChoiceData {
  answerChoice_insert: AnswerChoice_Key;
}

export interface CreateAnswerChoiceVariables {
  questionId: UUIDString;
  letter: string;
  choiceText: string;
  isCorrect: boolean;
  explanation?: string | null;
  position: number;
}

export interface CreateContentSourceLinkData {
  contentSourceLink_insert: ContentSourceLink_Key;
}

export interface CreateContentSourceLinkVariables {
  id: UUIDString;
  sourceMaterialId: UUIDString;
  lessonId?: UUIDString | null;
  courseId?: UUIDString | null;
  questionId?: UUIDString | null;
  referenceLabel?: string | null;
}

export interface CreateCourseData {
  course_insert: Course_Key;
}

export interface CreateCourseVariables {
  id: UUIDString;
  slug: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  createdById: string;
}

export interface CreateFormulaData {
  formula_insert: Formula_Key;
}

export interface CreateFormulaSectionData {
  formulaSection_insert: FormulaSection_Key;
}

export interface CreateFormulaSectionVariables {
  id: UUIDString;
  code: string;
  title: string;
  position: number;
}

export interface CreateFormulaVariables {
  sectionId: UUIDString;
  code: string;
  name: string;
  expression: string;
  notes?: string | null;
  position: number;
}

export interface CreateIngestionJobData {
  ingestionJob_insert: IngestionJob_Key;
}

export interface CreateIngestionJobVariables {
  id: UUIDString;
  sourceMaterialId: UUIDString;
  status: string;
  parser: string;
  extractedCharacters: number;
  errorMessage?: string | null;
  completedAt?: DateString | null;
}

export interface CreateLessonData {
  lesson_insert: Lesson_Key;
}

export interface CreateLessonVariables {
  id: UUIDString;
  moduleId: UUIDString;
  title: string;
  position: number;
  lessonType: string;
}

export interface CreateLessonVersionData {
  lessonVersion_insert: LessonVersion_Key;
}

export interface CreateLessonVersionVariables {
  id: UUIDString;
  lessonId: UUIDString;
  contentJson?: string | null;
  videoPlaybackId?: string | null;
  versionNote?: string | null;
  createdById: string;
}

export interface CreateModuleData {
  module_insert: Module_Key;
}

export interface CreateModuleVariables {
  id: UUIDString;
  courseId: UUIDString;
  title: string;
  position: number;
}

export interface CreateQuestionData {
  question_insert: Question_Key;
}

export interface CreateQuestionVariables {
  id: UUIDString;
  questionText: string;
  questionType: string;
  difficulty: string;
  domain: string;
  formulaRef?: string | null;
  topicTags?: string | null;
  status: string;
  isMultiselect: boolean;
  rationale?: string | null;
  calculation?: string | null;
  sourceRef?: string | null;
  createdById?: string | null;
}

export interface CreateQuizAttemptData {
  quizAttempt_insert: QuizAttempt_Key;
}

export interface CreateQuizAttemptVariables {
  userId: string;
  quizId: UUIDString;
  questionOrder: string;
}

export interface CreateQuizData {
  quiz_insert: Quiz_Key;
}

export interface CreateQuizVariables {
  id: UUIDString;
  title: string;
  description?: string | null;
  timeLimitSeconds?: number | null;
  passingScore?: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  status: string;
  createdById?: string | null;
}

export interface CreateSourceMaterialData {
  sourceMaterial_insert: SourceMaterial_Key;
}

export interface CreateSourceMaterialVariables {
  id: UUIDString;
  title: string;
  fileName: string;
  fileType: string;
  storagePath: string;
  downloadUrl?: string | null;
  extractedText?: string | null;
  metadataJson?: string | null;
  status: string;
  uploadedById?: string | null;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  id: string;
  email: string;
  fullName?: string | null;
}

export interface DeleteLessonData {
  lesson_delete?: Lesson_Key | null;
}

export interface DeleteLessonVariables {
  id: UUIDString;
}

export interface DeleteLessonVersionsForLessonData {
  lessonVersion_deleteMany: number;
}

export interface DeleteLessonVersionsForLessonVariables {
  lessonId: UUIDString;
}

export interface DeleteSourceLinksForLessonData {
  contentSourceLink_deleteMany: number;
}

export interface DeleteSourceLinksForLessonVariables {
  lessonId: UUIDString;
}

export interface DeleteUserLessonProgressForLessonData {
  userLessonProgress_deleteMany: number;
}

export interface DeleteUserLessonProgressForLessonVariables {
  lessonId: UUIDString;
}

export interface EnrollInCourseData {
  userCourseProgress_insert: UserCourseProgress_Key;
}

export interface EnrollInCourseVariables {
  userId: string;
  courseId: UUIDString;
}

export interface FormulaSection_Key {
  id: UUIDString;
  __typename?: 'FormulaSection_Key';
}

export interface Formula_Key {
  id: UUIDString;
  __typename?: 'Formula_Key';
}

export interface GetAttemptForCompletionData {
  quizAttempt?: {
    id: UUIDString;
    status: string;
    user: {
      id: string;
    } & User_Key;
      quiz: {
        id: UUIDString;
        passingScore?: number | null;
      } & Quiz_Key;
        quizResponses_on_attempt: ({
          pointsEarned?: number | null;
          pointsPossible?: number | null;
          question: {
            domain: string;
          };
        })[];
  } & QuizAttempt_Key;
}

export interface GetAttemptForCompletionVariables {
  attemptId: UUIDString;
}

export interface GetAttemptForEvaluationData {
  quizAttempt?: {
    id: UUIDString;
    status: string;
    questionOrder: string;
    user: {
      id: string;
    } & User_Key;
      quiz: {
        id: UUIDString;
      } & Quiz_Key;
        quizResponses_on_attempt: ({
          question: {
            id: UUIDString;
          } & Question_Key;
            isCorrect?: boolean | null;
        })[];
  } & QuizAttempt_Key;
}

export interface GetAttemptForEvaluationVariables {
  attemptId: UUIDString;
}

export interface GetAttemptOwnerData {
  quizAttempt?: {
    id: UUIDString;
    user: {
      id: string;
    } & User_Key;
  } & QuizAttempt_Key;
}

export interface GetAttemptOwnerVariables {
  attemptId: UUIDString;
}

export interface GetAttemptResultsData {
  quizAttempt?: {
    id: UUIDString;
    status: string;
    scoreRaw?: number | null;
    scoreMax?: number | null;
    scorePct?: number | null;
    passed?: boolean | null;
    startedAt: DateString;
    completedAt?: DateString | null;
    quiz: {
      title: string;
      passingScore?: number | null;
    };
      quizResponses_on_attempt: ({
        question: {
          id: UUIDString;
          questionText: string;
          difficulty: string;
          domain: string;
          formulaRef?: string | null;
          rationale?: string | null;
          calculation?: string | null;
          sourceRef?: string | null;
        } & Question_Key;
          selectedLetters: string;
          isCorrect?: boolean | null;
          pointsEarned?: number | null;
          pointsPossible?: number | null;
      })[];
  } & QuizAttempt_Key;
}

export interface GetAttemptResultsVariables {
  attemptId: UUIDString;
}

export interface GetCourseBySlugData {
  courses: ({
    id: UUIDString;
    slug: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    modules_on_course: ({
      id: UUIDString;
      title: string;
      position: number;
      prerequisiteModuleIds?: string | null;
      lessons_on_module: ({
        id: UUIDString;
        title: string;
        position: number;
        lessonType: string;
        durationSeconds?: number | null;
        videoPlaybackId?: string | null;
        videoUrl?: string | null;
        quiz?: {
          id: UUIDString;
        } & Quiz_Key;
      } & Lesson_Key)[];
    } & Module_Key)[];
  } & Course_Key)[];
}

export interface GetCourseBySlugVariables {
  slug: string;
}

export interface GetFormulaSectionsData {
  formulaSections: ({
    id: UUIDString;
    code: string;
    title: string;
    position: number;
    formulas_on_section: ({
      id: UUIDString;
      code: string;
      name: string;
      expression: string;
      notes?: string | null;
    } & Formula_Key)[];
  } & FormulaSection_Key)[];
}

export interface GetInProgressAttemptData {
  quizAttempts: ({
    id: UUIDString;
    status: string;
    questionOrder: string;
    startedAt: DateString;
    quiz: {
      timeLimitSeconds?: number | null;
    };
      quizResponses_on_attempt: ({
        question: {
          id: UUIDString;
        } & Question_Key;
          selectedLetters: string;
          isCorrect?: boolean | null;
          pointsEarned?: number | null;
          pointsPossible?: number | null;
          answeredAt?: DateString | null;
      })[];
  } & QuizAttempt_Key)[];
}

export interface GetInProgressAttemptVariables {
  userId: string;
  quizId: UUIDString;
}

export interface GetLessonData {
  lesson?: {
    id: UUIDString;
    title: string;
    lessonType: string;
    contentJson?: string | null;
    videoPlaybackId?: string | null;
    videoUrl?: string | null;
    durationSeconds?: number | null;
    quiz?: {
      id: UUIDString;
      title: string;
      timeLimitSeconds?: number | null;
      shuffleQuestions: boolean;
      shuffleChoices: boolean;
    } & Quiz_Key;
      module: {
        course: {
          slug: string;
          title: string;
        };
      };
  } & Lesson_Key;
}

export interface GetLessonProgressData {
  userLessonProgresses: ({
    status: string;
    videoPositionSeconds?: number | null;
    completedAt?: DateString | null;
  })[];
}

export interface GetLessonProgressVariables {
  userId: string;
  lessonId: UUIDString;
}

export interface GetLessonVariables {
  id: UUIDString;
}

export interface GetLessonVersionsData {
  lessonVersions: ({
    id: UUIDString;
    contentJson?: string | null;
    videoPlaybackId?: string | null;
    versionNote?: string | null;
    createdAt: DateString;
    createdBy: {
      id: string;
      email: string;
      fullName?: string | null;
    } & User_Key;
  } & LessonVersion_Key)[];
}

export interface GetLessonVersionsVariables {
  lessonId: UUIDString;
}

export interface GetQuestionWithAnswersData {
  question?: {
    id: UUIDString;
    questionText: string;
    difficulty: string;
    domain: string;
    formulaRef?: string | null;
    isMultiselect: boolean;
    rationale?: string | null;
    calculation?: string | null;
    sourceRef?: string | null;
    answerChoices_on_question: ({
      id: UUIDString;
      letter: string;
      choiceText: string;
      isCorrect: boolean;
      explanation?: string | null;
      position: number;
    } & AnswerChoice_Key)[];
  } & Question_Key;
}

export interface GetQuestionWithAnswersVariables {
  questionId: UUIDString;
}

export interface GetQuizQuestionCountData {
  quizQuestions: ({
    position: number;
  })[];
}

export interface GetQuizQuestionCountVariables {
  quizId: UUIDString;
}

export interface GetQuizQuestionPointValueData {
  quizQuestions: ({
    pointValue: number;
  })[];
}

export interface GetQuizQuestionPointValueVariables {
  quizId: UUIDString;
  questionId: UUIDString;
}

export interface GetQuizQuestionsAdminData {
  quiz?: {
    id: UUIDString;
    title: string;
    timeLimitSeconds?: number | null;
    shuffleQuestions: boolean;
    shuffleChoices: boolean;
  } & Quiz_Key;
    quizQuestions: ({
      position: number;
      pointValue: number;
      question: {
        id: UUIDString;
        questionText: string;
        difficulty: string;
        domain: string;
        formulaRef?: string | null;
        isMultiselect: boolean;
        answerChoices_on_question: ({
          id: UUIDString;
          letter: string;
          choiceText: string;
          isCorrect: boolean;
          explanation?: string | null;
          position: number;
        } & AnswerChoice_Key)[];
      } & Question_Key;
    })[];
}

export interface GetQuizQuestionsAdminVariables {
  quizId: UUIDString;
}

export interface GetQuizQuestionsData {
  quizQuestions: ({
    position: number;
    pointValue: number;
    question: {
      id: UUIDString;
      questionText: string;
      difficulty: string;
      domain: string;
      formulaRef?: string | null;
      isMultiselect: boolean;
      answerChoices_on_question: ({
        id: UUIDString;
        letter: string;
        choiceText: string;
        position: number;
      } & AnswerChoice_Key)[];
    } & Question_Key;
  })[];
}

export interface GetQuizQuestionsVariables {
  quizId: UUIDString;
}

export interface GetUserAttemptHistoryData {
  quizAttempts: ({
    id: UUIDString;
    quiz: {
      id: UUIDString;
      title: string;
    } & Quiz_Key;
      scorePct?: number | null;
      passed?: boolean | null;
      completedAt?: DateString | null;
  } & QuizAttempt_Key)[];
}

export interface GetUserAttemptHistoryVariables {
  userId: string;
}

export interface GetUserCourseProgressData {
  userLessonProgresses: ({
    lesson: {
      id: UUIDString;
    } & Lesson_Key;
      status: string;
      videoPositionSeconds?: number | null;
      completedAt?: DateString | null;
  })[];
}

export interface GetUserCourseProgressFullData {
  userCourseProgress: ({
    enrolledAt: DateString;
  })[];
    userLessonProgresses: ({
      lesson: {
        id: UUIDString;
      } & Lesson_Key;
        status: string;
        videoPositionSeconds?: number | null;
        completedAt?: DateString | null;
    })[];
}

export interface GetUserCourseProgressFullVariables {
  userId: string;
  courseId: UUIDString;
}

export interface GetUserCourseProgressVariables {
  userId: string;
  courseId: UUIDString;
}

export interface GetUserProgressDetailsData {
  quizAttempts: ({
    id: UUIDString;
    quiz: {
      id: UUIDString;
      title: string;
      passingScore?: number | null;
    } & Quiz_Key;
      scorePct?: number | null;
      scoreRaw?: number | null;
      scoreMax?: number | null;
      passed?: boolean | null;
      startedAt: DateString;
      completedAt?: DateString | null;
      quizResponses_on_attempt: ({
        isCorrect?: boolean | null;
        pointsEarned?: number | null;
        pointsPossible?: number | null;
        question: {
          domain: string;
        };
      })[];
  } & QuizAttempt_Key)[];
}

export interface GetUserProgressDetailsVariables {
  userId: string;
}

export interface IngestionJob_Key {
  id: UUIDString;
  __typename?: 'IngestionJob_Key';
}

export interface LessonVersion_Key {
  id: UUIDString;
  __typename?: 'LessonVersion_Key';
}

export interface Lesson_Key {
  id: UUIDString;
  __typename?: 'Lesson_Key';
}

export interface ListAdminQuizzesData {
  quizzes: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    status: string;
    passingScore?: number | null;
    timeLimitSeconds?: number | null;
    shuffleQuestions: boolean;
    createdAt: DateString;
  } & Quiz_Key)[];
}

export interface ListPublishedCoursesData {
  courses: ({
    id: UUIDString;
    slug: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    createdBy: {
      fullName?: string | null;
    };
  } & Course_Key)[];
}

export interface MarkAnsweredAtData {
  quizResponse_update?: QuizResponse_Key | null;
}

export interface MarkAnsweredAtVariables {
  attemptId: UUIDString;
  questionId: UUIDString;
  answeredAt: DateString;
}

export interface Module_Key {
  id: UUIDString;
  __typename?: 'Module_Key';
}

export interface Question_Key {
  id: UUIDString;
  __typename?: 'Question_Key';
}

export interface QuizAttempt_Key {
  id: UUIDString;
  __typename?: 'QuizAttempt_Key';
}

export interface QuizQuestion_Key {
  quizId: UUIDString;
  questionId: UUIDString;
  __typename?: 'QuizQuestion_Key';
}

export interface QuizResponse_Key {
  attemptId: UUIDString;
  questionId: UUIDString;
  __typename?: 'QuizResponse_Key';
}

export interface Quiz_Key {
  id: UUIDString;
  __typename?: 'Quiz_Key';
}

export interface SourceMaterial_Key {
  id: UUIDString;
  __typename?: 'SourceMaterial_Key';
}

export interface UpdateAnswerChoiceData {
  answerChoice_update?: AnswerChoice_Key | null;
}

export interface UpdateAnswerChoiceVariables {
  id: UUIDString;
  choiceText?: string | null;
  isCorrect?: boolean | null;
  explanation?: string | null;
}

export interface UpdateCourseData {
  course_update?: Course_Key | null;
}

export interface UpdateCourseVariables {
  id: UUIDString;
  title?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  status?: string | null;
  isPublished?: boolean | null;
  updatedById?: string | null;
  publishedAt?: DateString | null;
}

export interface UpdateLessonData {
  lesson_update?: Lesson_Key | null;
}

export interface UpdateLessonVariables {
  id: UUIDString;
  title?: string | null;
  contentJson?: string | null;
  videoPlaybackId?: string | null;
  videoUrl?: string | null;
  quizId?: UUIDString | null;
  sourceMaterialId?: UUIDString | null;
  durationSeconds?: number | null;
  status?: string | null;
  isPublished?: boolean | null;
  updatedById?: string | null;
  publishedAt?: DateString | null;
}

export interface UpdateModuleData {
  module_update?: Module_Key | null;
}

export interface UpdateModuleVariables {
  id: UUIDString;
  title?: string | null;
  description?: string | null;
  learningObjectives?: string | null;
  prerequisiteModuleIds?: string | null;
  position?: number | null;
  status?: string | null;
}

export interface UpdateQuestionData {
  question_update?: Question_Key | null;
}

export interface UpdateQuestionStatusData {
  question_update?: Question_Key | null;
}

export interface UpdateQuestionStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateQuestionVariables {
  id: UUIDString;
  questionText?: string | null;
  difficulty?: string | null;
  domain?: string | null;
  formulaRef?: string | null;
  rationale?: string | null;
  calculation?: string | null;
  sourceRef?: string | null;
}

export interface UpdateQuizStatusData {
  quiz_update?: Quiz_Key | null;
}

export interface UpdateQuizStatusVariables {
  id: UUIDString;
  status: string;
  updatedById?: string | null;
  publishedAt?: DateString | null;
}

export interface UpdateUserRoleData {
  user_update?: User_Key | null;
}

export interface UpdateUserRoleVariables {
  id: string;
  role: string;
}

export interface UpsertLessonProgressData {
  userLessonProgress_upsert: UserLessonProgress_Key;
}

export interface UpsertLessonProgressVariables {
  userId: string;
  lessonId: UUIDString;
  status: string;
  videoPositionSeconds?: number | null;
}

export interface UpsertQuizResponseData {
  quizResponse_upsert: QuizResponse_Key;
}

export interface UpsertQuizResponseVariables {
  attemptId: UUIDString;
  questionId: UUIDString;
  selectedLetters: string;
  isCorrect?: boolean | null;
  pointsEarned?: number | null;
  pointsPossible?: number | null;
  answeredAt?: DateString | null;
}

export interface UserCourseProgress_Key {
  userId: string;
  courseId: UUIDString;
  __typename?: 'UserCourseProgress_Key';
}

export interface UserLessonProgress_Key {
  userId: string;
  lessonId: UUIDString;
  __typename?: 'UserLessonProgress_Key';
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface UpdateUserRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserRoleVariables): MutationRef<UpdateUserRoleData, UpdateUserRoleVariables>;
  operationName: string;
}
export const updateUserRoleRef: UpdateUserRoleRef;

export function updateUserRole(vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;
export function updateUserRole(dc: DataConnect, vars: UpdateUserRoleVariables): MutationPromise<UpdateUserRoleData, UpdateUserRoleVariables>;

interface CreateCourseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCourseVariables): MutationRef<CreateCourseData, CreateCourseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCourseVariables): MutationRef<CreateCourseData, CreateCourseVariables>;
  operationName: string;
}
export const createCourseRef: CreateCourseRef;

export function createCourse(vars: CreateCourseVariables): MutationPromise<CreateCourseData, CreateCourseVariables>;
export function createCourse(dc: DataConnect, vars: CreateCourseVariables): MutationPromise<CreateCourseData, CreateCourseVariables>;

interface UpdateCourseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCourseVariables): MutationRef<UpdateCourseData, UpdateCourseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCourseVariables): MutationRef<UpdateCourseData, UpdateCourseVariables>;
  operationName: string;
}
export const updateCourseRef: UpdateCourseRef;

export function updateCourse(vars: UpdateCourseVariables): MutationPromise<UpdateCourseData, UpdateCourseVariables>;
export function updateCourse(dc: DataConnect, vars: UpdateCourseVariables): MutationPromise<UpdateCourseData, UpdateCourseVariables>;

interface CreateModuleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateModuleVariables): MutationRef<CreateModuleData, CreateModuleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateModuleVariables): MutationRef<CreateModuleData, CreateModuleVariables>;
  operationName: string;
}
export const createModuleRef: CreateModuleRef;

export function createModule(vars: CreateModuleVariables): MutationPromise<CreateModuleData, CreateModuleVariables>;
export function createModule(dc: DataConnect, vars: CreateModuleVariables): MutationPromise<CreateModuleData, CreateModuleVariables>;

interface UpdateModuleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateModuleVariables): MutationRef<UpdateModuleData, UpdateModuleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateModuleVariables): MutationRef<UpdateModuleData, UpdateModuleVariables>;
  operationName: string;
}
export const updateModuleRef: UpdateModuleRef;

export function updateModule(vars: UpdateModuleVariables): MutationPromise<UpdateModuleData, UpdateModuleVariables>;
export function updateModule(dc: DataConnect, vars: UpdateModuleVariables): MutationPromise<UpdateModuleData, UpdateModuleVariables>;

interface CreateLessonVersionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLessonVersionVariables): MutationRef<CreateLessonVersionData, CreateLessonVersionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateLessonVersionVariables): MutationRef<CreateLessonVersionData, CreateLessonVersionVariables>;
  operationName: string;
}
export const createLessonVersionRef: CreateLessonVersionRef;

export function createLessonVersion(vars: CreateLessonVersionVariables): MutationPromise<CreateLessonVersionData, CreateLessonVersionVariables>;
export function createLessonVersion(dc: DataConnect, vars: CreateLessonVersionVariables): MutationPromise<CreateLessonVersionData, CreateLessonVersionVariables>;

interface CreateLessonRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLessonVariables): MutationRef<CreateLessonData, CreateLessonVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateLessonVariables): MutationRef<CreateLessonData, CreateLessonVariables>;
  operationName: string;
}
export const createLessonRef: CreateLessonRef;

export function createLesson(vars: CreateLessonVariables): MutationPromise<CreateLessonData, CreateLessonVariables>;
export function createLesson(dc: DataConnect, vars: CreateLessonVariables): MutationPromise<CreateLessonData, CreateLessonVariables>;

interface UpdateLessonRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLessonVariables): MutationRef<UpdateLessonData, UpdateLessonVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateLessonVariables): MutationRef<UpdateLessonData, UpdateLessonVariables>;
  operationName: string;
}
export const updateLessonRef: UpdateLessonRef;

export function updateLesson(vars: UpdateLessonVariables): MutationPromise<UpdateLessonData, UpdateLessonVariables>;
export function updateLesson(dc: DataConnect, vars: UpdateLessonVariables): MutationPromise<UpdateLessonData, UpdateLessonVariables>;

interface DeleteLessonRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteLessonVariables): MutationRef<DeleteLessonData, DeleteLessonVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteLessonVariables): MutationRef<DeleteLessonData, DeleteLessonVariables>;
  operationName: string;
}
export const deleteLessonRef: DeleteLessonRef;

export function deleteLesson(vars: DeleteLessonVariables): MutationPromise<DeleteLessonData, DeleteLessonVariables>;
export function deleteLesson(dc: DataConnect, vars: DeleteLessonVariables): MutationPromise<DeleteLessonData, DeleteLessonVariables>;

interface DeleteLessonVersionsForLessonRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteLessonVersionsForLessonVariables): MutationRef<DeleteLessonVersionsForLessonData, DeleteLessonVersionsForLessonVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteLessonVersionsForLessonVariables): MutationRef<DeleteLessonVersionsForLessonData, DeleteLessonVersionsForLessonVariables>;
  operationName: string;
}
export const deleteLessonVersionsForLessonRef: DeleteLessonVersionsForLessonRef;

export function deleteLessonVersionsForLesson(vars: DeleteLessonVersionsForLessonVariables): MutationPromise<DeleteLessonVersionsForLessonData, DeleteLessonVersionsForLessonVariables>;
export function deleteLessonVersionsForLesson(dc: DataConnect, vars: DeleteLessonVersionsForLessonVariables): MutationPromise<DeleteLessonVersionsForLessonData, DeleteLessonVersionsForLessonVariables>;

interface DeleteSourceLinksForLessonRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceLinksForLessonVariables): MutationRef<DeleteSourceLinksForLessonData, DeleteSourceLinksForLessonVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSourceLinksForLessonVariables): MutationRef<DeleteSourceLinksForLessonData, DeleteSourceLinksForLessonVariables>;
  operationName: string;
}
export const deleteSourceLinksForLessonRef: DeleteSourceLinksForLessonRef;

export function deleteSourceLinksForLesson(vars: DeleteSourceLinksForLessonVariables): MutationPromise<DeleteSourceLinksForLessonData, DeleteSourceLinksForLessonVariables>;
export function deleteSourceLinksForLesson(dc: DataConnect, vars: DeleteSourceLinksForLessonVariables): MutationPromise<DeleteSourceLinksForLessonData, DeleteSourceLinksForLessonVariables>;

interface DeleteUserLessonProgressForLessonRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserLessonProgressForLessonVariables): MutationRef<DeleteUserLessonProgressForLessonData, DeleteUserLessonProgressForLessonVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserLessonProgressForLessonVariables): MutationRef<DeleteUserLessonProgressForLessonData, DeleteUserLessonProgressForLessonVariables>;
  operationName: string;
}
export const deleteUserLessonProgressForLessonRef: DeleteUserLessonProgressForLessonRef;

export function deleteUserLessonProgressForLesson(vars: DeleteUserLessonProgressForLessonVariables): MutationPromise<DeleteUserLessonProgressForLessonData, DeleteUserLessonProgressForLessonVariables>;
export function deleteUserLessonProgressForLesson(dc: DataConnect, vars: DeleteUserLessonProgressForLessonVariables): MutationPromise<DeleteUserLessonProgressForLessonData, DeleteUserLessonProgressForLessonVariables>;

interface CreateSourceMaterialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSourceMaterialVariables): MutationRef<CreateSourceMaterialData, CreateSourceMaterialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSourceMaterialVariables): MutationRef<CreateSourceMaterialData, CreateSourceMaterialVariables>;
  operationName: string;
}
export const createSourceMaterialRef: CreateSourceMaterialRef;

export function createSourceMaterial(vars: CreateSourceMaterialVariables): MutationPromise<CreateSourceMaterialData, CreateSourceMaterialVariables>;
export function createSourceMaterial(dc: DataConnect, vars: CreateSourceMaterialVariables): MutationPromise<CreateSourceMaterialData, CreateSourceMaterialVariables>;

interface CreateIngestionJobRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateIngestionJobVariables): MutationRef<CreateIngestionJobData, CreateIngestionJobVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateIngestionJobVariables): MutationRef<CreateIngestionJobData, CreateIngestionJobVariables>;
  operationName: string;
}
export const createIngestionJobRef: CreateIngestionJobRef;

export function createIngestionJob(vars: CreateIngestionJobVariables): MutationPromise<CreateIngestionJobData, CreateIngestionJobVariables>;
export function createIngestionJob(dc: DataConnect, vars: CreateIngestionJobVariables): MutationPromise<CreateIngestionJobData, CreateIngestionJobVariables>;

interface CreateQuestionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuestionVariables): MutationRef<CreateQuestionData, CreateQuestionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateQuestionVariables): MutationRef<CreateQuestionData, CreateQuestionVariables>;
  operationName: string;
}
export const createQuestionRef: CreateQuestionRef;

export function createQuestion(vars: CreateQuestionVariables): MutationPromise<CreateQuestionData, CreateQuestionVariables>;
export function createQuestion(dc: DataConnect, vars: CreateQuestionVariables): MutationPromise<CreateQuestionData, CreateQuestionVariables>;

interface UpdateQuestionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuestionVariables): MutationRef<UpdateQuestionData, UpdateQuestionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateQuestionVariables): MutationRef<UpdateQuestionData, UpdateQuestionVariables>;
  operationName: string;
}
export const updateQuestionRef: UpdateQuestionRef;

export function updateQuestion(vars: UpdateQuestionVariables): MutationPromise<UpdateQuestionData, UpdateQuestionVariables>;
export function updateQuestion(dc: DataConnect, vars: UpdateQuestionVariables): MutationPromise<UpdateQuestionData, UpdateQuestionVariables>;

interface UpdateQuestionStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuestionStatusVariables): MutationRef<UpdateQuestionStatusData, UpdateQuestionStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateQuestionStatusVariables): MutationRef<UpdateQuestionStatusData, UpdateQuestionStatusVariables>;
  operationName: string;
}
export const updateQuestionStatusRef: UpdateQuestionStatusRef;

export function updateQuestionStatus(vars: UpdateQuestionStatusVariables): MutationPromise<UpdateQuestionStatusData, UpdateQuestionStatusVariables>;
export function updateQuestionStatus(dc: DataConnect, vars: UpdateQuestionStatusVariables): MutationPromise<UpdateQuestionStatusData, UpdateQuestionStatusVariables>;

interface CreateAnswerChoiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAnswerChoiceVariables): MutationRef<CreateAnswerChoiceData, CreateAnswerChoiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAnswerChoiceVariables): MutationRef<CreateAnswerChoiceData, CreateAnswerChoiceVariables>;
  operationName: string;
}
export const createAnswerChoiceRef: CreateAnswerChoiceRef;

export function createAnswerChoice(vars: CreateAnswerChoiceVariables): MutationPromise<CreateAnswerChoiceData, CreateAnswerChoiceVariables>;
export function createAnswerChoice(dc: DataConnect, vars: CreateAnswerChoiceVariables): MutationPromise<CreateAnswerChoiceData, CreateAnswerChoiceVariables>;

interface UpdateAnswerChoiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAnswerChoiceVariables): MutationRef<UpdateAnswerChoiceData, UpdateAnswerChoiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAnswerChoiceVariables): MutationRef<UpdateAnswerChoiceData, UpdateAnswerChoiceVariables>;
  operationName: string;
}
export const updateAnswerChoiceRef: UpdateAnswerChoiceRef;

export function updateAnswerChoice(vars: UpdateAnswerChoiceVariables): MutationPromise<UpdateAnswerChoiceData, UpdateAnswerChoiceVariables>;
export function updateAnswerChoice(dc: DataConnect, vars: UpdateAnswerChoiceVariables): MutationPromise<UpdateAnswerChoiceData, UpdateAnswerChoiceVariables>;

interface CreateQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuizVariables): MutationRef<CreateQuizData, CreateQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateQuizVariables): MutationRef<CreateQuizData, CreateQuizVariables>;
  operationName: string;
}
export const createQuizRef: CreateQuizRef;

export function createQuiz(vars: CreateQuizVariables): MutationPromise<CreateQuizData, CreateQuizVariables>;
export function createQuiz(dc: DataConnect, vars: CreateQuizVariables): MutationPromise<CreateQuizData, CreateQuizVariables>;

interface AddQuestionToQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddQuestionToQuizVariables): MutationRef<AddQuestionToQuizData, AddQuestionToQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddQuestionToQuizVariables): MutationRef<AddQuestionToQuizData, AddQuestionToQuizVariables>;
  operationName: string;
}
export const addQuestionToQuizRef: AddQuestionToQuizRef;

export function addQuestionToQuiz(vars: AddQuestionToQuizVariables): MutationPromise<AddQuestionToQuizData, AddQuestionToQuizVariables>;
export function addQuestionToQuiz(dc: DataConnect, vars: AddQuestionToQuizVariables): MutationPromise<AddQuestionToQuizData, AddQuestionToQuizVariables>;

interface UpdateQuizStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuizStatusVariables): MutationRef<UpdateQuizStatusData, UpdateQuizStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateQuizStatusVariables): MutationRef<UpdateQuizStatusData, UpdateQuizStatusVariables>;
  operationName: string;
}
export const updateQuizStatusRef: UpdateQuizStatusRef;

export function updateQuizStatus(vars: UpdateQuizStatusVariables): MutationPromise<UpdateQuizStatusData, UpdateQuizStatusVariables>;
export function updateQuizStatus(dc: DataConnect, vars: UpdateQuizStatusVariables): MutationPromise<UpdateQuizStatusData, UpdateQuizStatusVariables>;

interface EnrollInCourseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: EnrollInCourseVariables): MutationRef<EnrollInCourseData, EnrollInCourseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: EnrollInCourseVariables): MutationRef<EnrollInCourseData, EnrollInCourseVariables>;
  operationName: string;
}
export const enrollInCourseRef: EnrollInCourseRef;

export function enrollInCourse(vars: EnrollInCourseVariables): MutationPromise<EnrollInCourseData, EnrollInCourseVariables>;
export function enrollInCourse(dc: DataConnect, vars: EnrollInCourseVariables): MutationPromise<EnrollInCourseData, EnrollInCourseVariables>;

interface UpsertLessonProgressRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertLessonProgressVariables): MutationRef<UpsertLessonProgressData, UpsertLessonProgressVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertLessonProgressVariables): MutationRef<UpsertLessonProgressData, UpsertLessonProgressVariables>;
  operationName: string;
}
export const upsertLessonProgressRef: UpsertLessonProgressRef;

export function upsertLessonProgress(vars: UpsertLessonProgressVariables): MutationPromise<UpsertLessonProgressData, UpsertLessonProgressVariables>;
export function upsertLessonProgress(dc: DataConnect, vars: UpsertLessonProgressVariables): MutationPromise<UpsertLessonProgressData, UpsertLessonProgressVariables>;

interface CreateQuizAttemptRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuizAttemptVariables): MutationRef<CreateQuizAttemptData, CreateQuizAttemptVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateQuizAttemptVariables): MutationRef<CreateQuizAttemptData, CreateQuizAttemptVariables>;
  operationName: string;
}
export const createQuizAttemptRef: CreateQuizAttemptRef;

export function createQuizAttempt(vars: CreateQuizAttemptVariables): MutationPromise<CreateQuizAttemptData, CreateQuizAttemptVariables>;
export function createQuizAttempt(dc: DataConnect, vars: CreateQuizAttemptVariables): MutationPromise<CreateQuizAttemptData, CreateQuizAttemptVariables>;

interface UpsertQuizResponseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertQuizResponseVariables): MutationRef<UpsertQuizResponseData, UpsertQuizResponseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertQuizResponseVariables): MutationRef<UpsertQuizResponseData, UpsertQuizResponseVariables>;
  operationName: string;
}
export const upsertQuizResponseRef: UpsertQuizResponseRef;

export function upsertQuizResponse(vars: UpsertQuizResponseVariables): MutationPromise<UpsertQuizResponseData, UpsertQuizResponseVariables>;
export function upsertQuizResponse(dc: DataConnect, vars: UpsertQuizResponseVariables): MutationPromise<UpsertQuizResponseData, UpsertQuizResponseVariables>;

interface CompleteQuizAttemptRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompleteQuizAttemptVariables): MutationRef<CompleteQuizAttemptData, CompleteQuizAttemptVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CompleteQuizAttemptVariables): MutationRef<CompleteQuizAttemptData, CompleteQuizAttemptVariables>;
  operationName: string;
}
export const completeQuizAttemptRef: CompleteQuizAttemptRef;

export function completeQuizAttempt(vars: CompleteQuizAttemptVariables): MutationPromise<CompleteQuizAttemptData, CompleteQuizAttemptVariables>;
export function completeQuizAttempt(dc: DataConnect, vars: CompleteQuizAttemptVariables): MutationPromise<CompleteQuizAttemptData, CompleteQuizAttemptVariables>;

interface MarkAnsweredAtRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkAnsweredAtVariables): MutationRef<MarkAnsweredAtData, MarkAnsweredAtVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkAnsweredAtVariables): MutationRef<MarkAnsweredAtData, MarkAnsweredAtVariables>;
  operationName: string;
}
export const markAnsweredAtRef: MarkAnsweredAtRef;

export function markAnsweredAt(vars: MarkAnsweredAtVariables): MutationPromise<MarkAnsweredAtData, MarkAnsweredAtVariables>;
export function markAnsweredAt(dc: DataConnect, vars: MarkAnsweredAtVariables): MutationPromise<MarkAnsweredAtData, MarkAnsweredAtVariables>;

interface CreateFormulaSectionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFormulaSectionVariables): MutationRef<CreateFormulaSectionData, CreateFormulaSectionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateFormulaSectionVariables): MutationRef<CreateFormulaSectionData, CreateFormulaSectionVariables>;
  operationName: string;
}
export const createFormulaSectionRef: CreateFormulaSectionRef;

export function createFormulaSection(vars: CreateFormulaSectionVariables): MutationPromise<CreateFormulaSectionData, CreateFormulaSectionVariables>;
export function createFormulaSection(dc: DataConnect, vars: CreateFormulaSectionVariables): MutationPromise<CreateFormulaSectionData, CreateFormulaSectionVariables>;

interface CreateFormulaRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFormulaVariables): MutationRef<CreateFormulaData, CreateFormulaVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateFormulaVariables): MutationRef<CreateFormulaData, CreateFormulaVariables>;
  operationName: string;
}
export const createFormulaRef: CreateFormulaRef;

export function createFormula(vars: CreateFormulaVariables): MutationPromise<CreateFormulaData, CreateFormulaVariables>;
export function createFormula(dc: DataConnect, vars: CreateFormulaVariables): MutationPromise<CreateFormulaData, CreateFormulaVariables>;

interface CreateContentSourceLinkRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateContentSourceLinkVariables): MutationRef<CreateContentSourceLinkData, CreateContentSourceLinkVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateContentSourceLinkVariables): MutationRef<CreateContentSourceLinkData, CreateContentSourceLinkVariables>;
  operationName: string;
}
export const createContentSourceLinkRef: CreateContentSourceLinkRef;

export function createContentSourceLink(vars: CreateContentSourceLinkVariables): MutationPromise<CreateContentSourceLinkData, CreateContentSourceLinkVariables>;
export function createContentSourceLink(dc: DataConnect, vars: CreateContentSourceLinkVariables): MutationPromise<CreateContentSourceLinkData, CreateContentSourceLinkVariables>;

interface ListPublishedCoursesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublishedCoursesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublishedCoursesData, undefined>;
  operationName: string;
}
export const listPublishedCoursesRef: ListPublishedCoursesRef;

export function listPublishedCourses(options?: ExecuteQueryOptions): QueryPromise<ListPublishedCoursesData, undefined>;
export function listPublishedCourses(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPublishedCoursesData, undefined>;

interface GetCourseBySlugRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCourseBySlugVariables): QueryRef<GetCourseBySlugData, GetCourseBySlugVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCourseBySlugVariables): QueryRef<GetCourseBySlugData, GetCourseBySlugVariables>;
  operationName: string;
}
export const getCourseBySlugRef: GetCourseBySlugRef;

export function getCourseBySlug(vars: GetCourseBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetCourseBySlugData, GetCourseBySlugVariables>;
export function getCourseBySlug(dc: DataConnect, vars: GetCourseBySlugVariables, options?: ExecuteQueryOptions): QueryPromise<GetCourseBySlugData, GetCourseBySlugVariables>;

interface GetLessonRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLessonVariables): QueryRef<GetLessonData, GetLessonVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLessonVariables): QueryRef<GetLessonData, GetLessonVariables>;
  operationName: string;
}
export const getLessonRef: GetLessonRef;

export function getLesson(vars: GetLessonVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonData, GetLessonVariables>;
export function getLesson(dc: DataConnect, vars: GetLessonVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonData, GetLessonVariables>;

interface GetQuizQuestionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizQuestionsVariables): QueryRef<GetQuizQuestionsData, GetQuizQuestionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetQuizQuestionsVariables): QueryRef<GetQuizQuestionsData, GetQuizQuestionsVariables>;
  operationName: string;
}
export const getQuizQuestionsRef: GetQuizQuestionsRef;

export function getQuizQuestions(vars: GetQuizQuestionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionsData, GetQuizQuestionsVariables>;
export function getQuizQuestions(dc: DataConnect, vars: GetQuizQuestionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionsData, GetQuizQuestionsVariables>;

interface GetInProgressAttemptRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetInProgressAttemptVariables): QueryRef<GetInProgressAttemptData, GetInProgressAttemptVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetInProgressAttemptVariables): QueryRef<GetInProgressAttemptData, GetInProgressAttemptVariables>;
  operationName: string;
}
export const getInProgressAttemptRef: GetInProgressAttemptRef;

export function getInProgressAttempt(vars: GetInProgressAttemptVariables, options?: ExecuteQueryOptions): QueryPromise<GetInProgressAttemptData, GetInProgressAttemptVariables>;
export function getInProgressAttempt(dc: DataConnect, vars: GetInProgressAttemptVariables, options?: ExecuteQueryOptions): QueryPromise<GetInProgressAttemptData, GetInProgressAttemptVariables>;

interface GetUserCourseProgressRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserCourseProgressVariables): QueryRef<GetUserCourseProgressData, GetUserCourseProgressVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserCourseProgressVariables): QueryRef<GetUserCourseProgressData, GetUserCourseProgressVariables>;
  operationName: string;
}
export const getUserCourseProgressRef: GetUserCourseProgressRef;

export function getUserCourseProgress(vars: GetUserCourseProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserCourseProgressData, GetUserCourseProgressVariables>;
export function getUserCourseProgress(dc: DataConnect, vars: GetUserCourseProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserCourseProgressData, GetUserCourseProgressVariables>;

interface GetLessonProgressRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLessonProgressVariables): QueryRef<GetLessonProgressData, GetLessonProgressVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLessonProgressVariables): QueryRef<GetLessonProgressData, GetLessonProgressVariables>;
  operationName: string;
}
export const getLessonProgressRef: GetLessonProgressRef;

export function getLessonProgress(vars: GetLessonProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonProgressData, GetLessonProgressVariables>;
export function getLessonProgress(dc: DataConnect, vars: GetLessonProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonProgressData, GetLessonProgressVariables>;

interface GetUserCourseProgressFullRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserCourseProgressFullVariables): QueryRef<GetUserCourseProgressFullData, GetUserCourseProgressFullVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserCourseProgressFullVariables): QueryRef<GetUserCourseProgressFullData, GetUserCourseProgressFullVariables>;
  operationName: string;
}
export const getUserCourseProgressFullRef: GetUserCourseProgressFullRef;

export function getUserCourseProgressFull(vars: GetUserCourseProgressFullVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserCourseProgressFullData, GetUserCourseProgressFullVariables>;
export function getUserCourseProgressFull(dc: DataConnect, vars: GetUserCourseProgressFullVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserCourseProgressFullData, GetUserCourseProgressFullVariables>;

interface GetUserAttemptHistoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserAttemptHistoryVariables): QueryRef<GetUserAttemptHistoryData, GetUserAttemptHistoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserAttemptHistoryVariables): QueryRef<GetUserAttemptHistoryData, GetUserAttemptHistoryVariables>;
  operationName: string;
}
export const getUserAttemptHistoryRef: GetUserAttemptHistoryRef;

export function getUserAttemptHistory(vars: GetUserAttemptHistoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserAttemptHistoryData, GetUserAttemptHistoryVariables>;
export function getUserAttemptHistory(dc: DataConnect, vars: GetUserAttemptHistoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserAttemptHistoryData, GetUserAttemptHistoryVariables>;

interface GetAttemptResultsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttemptResultsVariables): QueryRef<GetAttemptResultsData, GetAttemptResultsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAttemptResultsVariables): QueryRef<GetAttemptResultsData, GetAttemptResultsVariables>;
  operationName: string;
}
export const getAttemptResultsRef: GetAttemptResultsRef;

export function getAttemptResults(vars: GetAttemptResultsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptResultsData, GetAttemptResultsVariables>;
export function getAttemptResults(dc: DataConnect, vars: GetAttemptResultsVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptResultsData, GetAttemptResultsVariables>;

interface GetFormulaSectionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetFormulaSectionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetFormulaSectionsData, undefined>;
  operationName: string;
}
export const getFormulaSectionsRef: GetFormulaSectionsRef;

export function getFormulaSections(options?: ExecuteQueryOptions): QueryPromise<GetFormulaSectionsData, undefined>;
export function getFormulaSections(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetFormulaSectionsData, undefined>;

interface GetUserProgressDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserProgressDetailsVariables): QueryRef<GetUserProgressDetailsData, GetUserProgressDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserProgressDetailsVariables): QueryRef<GetUserProgressDetailsData, GetUserProgressDetailsVariables>;
  operationName: string;
}
export const getUserProgressDetailsRef: GetUserProgressDetailsRef;

export function getUserProgressDetails(vars: GetUserProgressDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProgressDetailsData, GetUserProgressDetailsVariables>;
export function getUserProgressDetails(dc: DataConnect, vars: GetUserProgressDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProgressDetailsData, GetUserProgressDetailsVariables>;

interface ListAdminQuizzesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAdminQuizzesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAdminQuizzesData, undefined>;
  operationName: string;
}
export const listAdminQuizzesRef: ListAdminQuizzesRef;

export function listAdminQuizzes(options?: ExecuteQueryOptions): QueryPromise<ListAdminQuizzesData, undefined>;
export function listAdminQuizzes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAdminQuizzesData, undefined>;

interface GetQuizQuestionCountRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizQuestionCountVariables): QueryRef<GetQuizQuestionCountData, GetQuizQuestionCountVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetQuizQuestionCountVariables): QueryRef<GetQuizQuestionCountData, GetQuizQuestionCountVariables>;
  operationName: string;
}
export const getQuizQuestionCountRef: GetQuizQuestionCountRef;

export function getQuizQuestionCount(vars: GetQuizQuestionCountVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionCountData, GetQuizQuestionCountVariables>;
export function getQuizQuestionCount(dc: DataConnect, vars: GetQuizQuestionCountVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionCountData, GetQuizQuestionCountVariables>;

interface GetQuizQuestionsAdminRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizQuestionsAdminVariables): QueryRef<GetQuizQuestionsAdminData, GetQuizQuestionsAdminVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetQuizQuestionsAdminVariables): QueryRef<GetQuizQuestionsAdminData, GetQuizQuestionsAdminVariables>;
  operationName: string;
}
export const getQuizQuestionsAdminRef: GetQuizQuestionsAdminRef;

export function getQuizQuestionsAdmin(vars: GetQuizQuestionsAdminVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionsAdminData, GetQuizQuestionsAdminVariables>;
export function getQuizQuestionsAdmin(dc: DataConnect, vars: GetQuizQuestionsAdminVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionsAdminData, GetQuizQuestionsAdminVariables>;

interface GetAttemptForEvaluationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttemptForEvaluationVariables): QueryRef<GetAttemptForEvaluationData, GetAttemptForEvaluationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAttemptForEvaluationVariables): QueryRef<GetAttemptForEvaluationData, GetAttemptForEvaluationVariables>;
  operationName: string;
}
export const getAttemptForEvaluationRef: GetAttemptForEvaluationRef;

export function getAttemptForEvaluation(vars: GetAttemptForEvaluationVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptForEvaluationData, GetAttemptForEvaluationVariables>;
export function getAttemptForEvaluation(dc: DataConnect, vars: GetAttemptForEvaluationVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptForEvaluationData, GetAttemptForEvaluationVariables>;

interface GetQuestionWithAnswersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuestionWithAnswersVariables): QueryRef<GetQuestionWithAnswersData, GetQuestionWithAnswersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetQuestionWithAnswersVariables): QueryRef<GetQuestionWithAnswersData, GetQuestionWithAnswersVariables>;
  operationName: string;
}
export const getQuestionWithAnswersRef: GetQuestionWithAnswersRef;

export function getQuestionWithAnswers(vars: GetQuestionWithAnswersVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuestionWithAnswersData, GetQuestionWithAnswersVariables>;
export function getQuestionWithAnswers(dc: DataConnect, vars: GetQuestionWithAnswersVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuestionWithAnswersData, GetQuestionWithAnswersVariables>;

interface GetQuizQuestionPointValueRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetQuizQuestionPointValueVariables): QueryRef<GetQuizQuestionPointValueData, GetQuizQuestionPointValueVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetQuizQuestionPointValueVariables): QueryRef<GetQuizQuestionPointValueData, GetQuizQuestionPointValueVariables>;
  operationName: string;
}
export const getQuizQuestionPointValueRef: GetQuizQuestionPointValueRef;

export function getQuizQuestionPointValue(vars: GetQuizQuestionPointValueVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionPointValueData, GetQuizQuestionPointValueVariables>;
export function getQuizQuestionPointValue(dc: DataConnect, vars: GetQuizQuestionPointValueVariables, options?: ExecuteQueryOptions): QueryPromise<GetQuizQuestionPointValueData, GetQuizQuestionPointValueVariables>;

interface GetAttemptForCompletionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttemptForCompletionVariables): QueryRef<GetAttemptForCompletionData, GetAttemptForCompletionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAttemptForCompletionVariables): QueryRef<GetAttemptForCompletionData, GetAttemptForCompletionVariables>;
  operationName: string;
}
export const getAttemptForCompletionRef: GetAttemptForCompletionRef;

export function getAttemptForCompletion(vars: GetAttemptForCompletionVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptForCompletionData, GetAttemptForCompletionVariables>;
export function getAttemptForCompletion(dc: DataConnect, vars: GetAttemptForCompletionVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptForCompletionData, GetAttemptForCompletionVariables>;

interface GetAttemptOwnerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttemptOwnerVariables): QueryRef<GetAttemptOwnerData, GetAttemptOwnerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAttemptOwnerVariables): QueryRef<GetAttemptOwnerData, GetAttemptOwnerVariables>;
  operationName: string;
}
export const getAttemptOwnerRef: GetAttemptOwnerRef;

export function getAttemptOwner(vars: GetAttemptOwnerVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptOwnerData, GetAttemptOwnerVariables>;
export function getAttemptOwner(dc: DataConnect, vars: GetAttemptOwnerVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttemptOwnerData, GetAttemptOwnerVariables>;

interface AdminListQuestionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListQuestionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListQuestionsData, undefined>;
  operationName: string;
}
export const adminListQuestionsRef: AdminListQuestionsRef;

export function adminListQuestions(options?: ExecuteQueryOptions): QueryPromise<AdminListQuestionsData, undefined>;
export function adminListQuestions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListQuestionsData, undefined>;

interface AdminListQuestionsPageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdminListQuestionsPageVariables): QueryRef<AdminListQuestionsPageData, AdminListQuestionsPageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AdminListQuestionsPageVariables): QueryRef<AdminListQuestionsPageData, AdminListQuestionsPageVariables>;
  operationName: string;
}
export const adminListQuestionsPageRef: AdminListQuestionsPageRef;

export function adminListQuestionsPage(vars: AdminListQuestionsPageVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListQuestionsPageData, AdminListQuestionsPageVariables>;
export function adminListQuestionsPage(dc: DataConnect, vars: AdminListQuestionsPageVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListQuestionsPageData, AdminListQuestionsPageVariables>;

interface AdminCountQuestionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminCountQuestionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminCountQuestionsData, undefined>;
  operationName: string;
}
export const adminCountQuestionsRef: AdminCountQuestionsRef;

export function adminCountQuestions(options?: ExecuteQueryOptions): QueryPromise<AdminCountQuestionsData, undefined>;
export function adminCountQuestions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminCountQuestionsData, undefined>;

interface AdminListCoursesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListCoursesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListCoursesData, undefined>;
  operationName: string;
}
export const adminListCoursesRef: AdminListCoursesRef;

export function adminListCourses(options?: ExecuteQueryOptions): QueryPromise<AdminListCoursesData, undefined>;
export function adminListCourses(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListCoursesData, undefined>;

interface GetLessonVersionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLessonVersionsVariables): QueryRef<GetLessonVersionsData, GetLessonVersionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLessonVersionsVariables): QueryRef<GetLessonVersionsData, GetLessonVersionsVariables>;
  operationName: string;
}
export const getLessonVersionsRef: GetLessonVersionsRef;

export function getLessonVersions(vars: GetLessonVersionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonVersionsData, GetLessonVersionsVariables>;
export function getLessonVersions(dc: DataConnect, vars: GetLessonVersionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonVersionsData, GetLessonVersionsVariables>;

interface AdminListSourceMaterialsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListSourceMaterialsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListSourceMaterialsData, undefined>;
  operationName: string;
}
export const adminListSourceMaterialsRef: AdminListSourceMaterialsRef;

export function adminListSourceMaterials(options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialsData, undefined>;
export function adminListSourceMaterials(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialsData, undefined>;

interface AdminListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListUsersData, undefined>;
  operationName: string;
}
export const adminListUsersRef: AdminListUsersRef;

export function adminListUsers(options?: ExecuteQueryOptions): QueryPromise<AdminListUsersData, undefined>;
export function adminListUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListUsersData, undefined>;

interface AdminCohortStatsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminCohortStatsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminCohortStatsData, undefined>;
  operationName: string;
}
export const adminCohortStatsRef: AdminCohortStatsRef;

export function adminCohortStats(options?: ExecuteQueryOptions): QueryPromise<AdminCohortStatsData, undefined>;
export function adminCohortStats(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminCohortStatsData, undefined>;

