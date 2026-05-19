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
          quiz?: {
            id: UUIDString;
          } & Quiz_Key;
        } & Lesson_Key)[];
      } & Module_Key)[];
  } & Course_Key)[];
}

export interface AdminListGlossaryTermsData {
  glossaryTerms: ({
    id: UUIDString;
    term: string;
    definition: string;
    fullDefinition?: string | null;
    domain?: string | null;
    category?: string | null;
    example?: string | null;
    relatedTerms?: string | null;
    isPublished: boolean;
    sourceDocument?: string | null;
    createdBy?: {
      id: string;
      fullName?: string | null;
    } & User_Key;
      createdAt: DateString;
      updatedAt: DateString;
  } & GlossaryTerm_Key)[];
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

export interface AdminListQuizQuestionUsageData {
  quizQuestions: ({
    quiz: {
      id: UUIDString;
      title: string;
    } & Quiz_Key;
      question: {
        id: UUIDString;
      } & Question_Key;
  })[];
    lessons: ({
      id: UUIDString;
      title: string;
      quiz?: {
        id: UUIDString;
      } & Quiz_Key;
        module: {
          id: UUIDString;
          title: string;
        } & Module_Key;
    } & Lesson_Key)[];
}

export interface AdminListSourceMaterialFoldersData {
  sourceMaterialFolders: ({
    id: UUIDString;
    name: string;
    folderType: string;
    archivedAt?: DateString | null;
    trashedAt?: DateString | null;
    createdAt: DateString;
    updatedAt: DateString;
    parentFolder?: {
      id: UUIDString;
      name: string;
    } & SourceMaterialFolder_Key;
      course?: {
        id: UUIDString;
        title: string;
      } & Course_Key;
        lesson?: {
          id: UUIDString;
          title: string;
          module: {
            id: UUIDString;
            title: string;
            course: {
              id: UUIDString;
              title: string;
            } & Course_Key;
          } & Module_Key;
        } & Lesson_Key;
          createdBy?: {
            id: string;
            email: string;
            fullName?: string | null;
          } & User_Key;
  } & SourceMaterialFolder_Key)[];
}

export interface AdminListSourceMaterialTagsData {
  sourceMaterialTags: ({
    id: UUIDString;
    name: string;
    color?: string | null;
    createdAt: DateString;
    updatedAt: DateString;
  } & SourceMaterialTag_Key)[];
}

export interface AdminListSourceMaterialsData {
  sourceMaterials: ({
    id: UUIDString;
    title: string;
    fileName: string;
    fileType: string;
    storagePath: string;
    downloadUrl?: string | null;
    extractedText?: string | null;
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
        contentSourceLinks_on_sourceMaterial: ({
          id: UUIDString;
          referenceLabel?: string | null;
          createdAt: DateString;
          course?: {
            id: UUIDString;
            title: string;
          } & Course_Key;
            lesson?: {
              id: UUIDString;
              title: string;
              module: {
                id: UUIDString;
                title: string;
                course: {
                  id: UUIDString;
                  title: string;
                } & Course_Key;
              } & Module_Key;
            } & Lesson_Key;
              question?: {
                id: UUIDString;
                questionText: string;
                domain: string;
                difficulty: string;
              } & Question_Key;
        } & ContentSourceLink_Key)[];
  } & SourceMaterial_Key)[];
}

export interface AdminListSourceMaterialsRichData {
  sourceMaterials: ({
    id: UUIDString;
    title: string;
    fileName: string;
    fileType: string;
    folder?: {
      id: UUIDString;
      name: string;
      folderType: string;
      parentFolder?: {
        id: UUIDString;
        name: string;
      } & SourceMaterialFolder_Key;
        course?: {
          id: UUIDString;
          title: string;
        } & Course_Key;
          lesson?: {
            id: UUIDString;
            title: string;
          } & Lesson_Key;
            archivedAt?: DateString | null;
            trashedAt?: DateString | null;
            createdAt: DateString;
            updatedAt: DateString;
    } & SourceMaterialFolder_Key;
      storagePath: string;
      downloadUrl?: string | null;
      extractedText?: string | null;
      metadataJson?: string | null;
      status: string;
      starred: boolean;
      archivedAt?: DateString | null;
      trashedAt?: DateString | null;
      reviewStatus: string;
      visibility: string;
      duplicateOf?: {
        id: UUIDString;
        title: string;
      } & SourceMaterial_Key;
        lastActivityAt?: DateString | null;
        createdAt: DateString;
        updatedAt: DateString;
        uploadedBy?: {
          id: string;
          email: string;
          fullName?: string | null;
        } & User_Key;
          sourceMaterialTagAssignments_on_sourceMaterial: ({
            id: UUIDString;
            tag: {
              id: UUIDString;
              name: string;
              color?: string | null;
            } & SourceMaterialTag_Key;
          } & SourceMaterialTagAssignment_Key)[];
            sourceMaterialActivities_on_sourceMaterial: ({
              id: UUIDString;
              activityType: string;
              message?: string | null;
              metadataJson?: string | null;
              createdAt: DateString;
              actor?: {
                id: string;
                email: string;
                fullName?: string | null;
              } & User_Key;
            } & SourceMaterialActivity_Key)[];
              ingestionJobs_on_sourceMaterial: ({
                id: UUIDString;
                status: string;
                parser: string;
                extractedCharacters: number;
                errorMessage?: string | null;
                createdAt: DateString;
                completedAt?: DateString | null;
              } & IngestionJob_Key)[];
                contentSourceLinks_on_sourceMaterial: ({
                  id: UUIDString;
                  referenceLabel?: string | null;
                  createdAt: DateString;
                  course?: {
                    id: UUIDString;
                    title: string;
                  } & Course_Key;
                    lesson?: {
                      id: UUIDString;
                      title: string;
                      module: {
                        id: UUIDString;
                        title: string;
                        course: {
                          id: UUIDString;
                          title: string;
                        } & Course_Key;
                      } & Module_Key;
                    } & Lesson_Key;
                      question?: {
                        id: UUIDString;
                        questionText: string;
                        domain: string;
                        difficulty: string;
                      } & Question_Key;
                } & ContentSourceLink_Key)[];
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
  calcMetaJson?: string | null;
}

export interface CreateGlossaryNoteData {
  glossaryNote_insert: GlossaryNote_Key;
}

export interface CreateGlossaryNoteVariables {
  id: UUIDString;
  userId: string;
  termId: UUIDString;
  note: string;
  updatedAt: DateString;
}

export interface CreateGlossaryTermData {
  glossaryTerm_insert: GlossaryTerm_Key;
}

export interface CreateGlossaryTermVariables {
  id: UUIDString;
  term: string;
  definition: string;
  fullDefinition?: string | null;
  domain?: string | null;
  category?: string | null;
  example?: string | null;
  relatedTerms?: string | null;
  isPublished: boolean;
  sourceDocument?: string | null;
  createdById?: string | null;
  updatedAt: DateString;
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

export interface CreateLessonNoteData {
  lessonNote_insert: LessonNote_Key;
}

export interface CreateLessonNoteVariables {
  id: UUIDString;
  userId: string;
  lessonId?: UUIDString | null;
  lessonTitle?: string | null;
  content: string;
  updatedAt: DateString;
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

export interface CreateSourceMaterialActivityData {
  sourceMaterialActivity_insert: SourceMaterialActivity_Key;
}

export interface CreateSourceMaterialActivityVariables {
  id: UUIDString;
  sourceMaterialId?: UUIDString | null;
  folderId?: UUIDString | null;
  actorId?: string | null;
  activityType: string;
  message?: string | null;
  metadataJson?: string | null;
}

export interface CreateSourceMaterialData {
  sourceMaterial_insert: SourceMaterial_Key;
}

export interface CreateSourceMaterialFolderData {
  sourceMaterialFolder_insert: SourceMaterialFolder_Key;
}

export interface CreateSourceMaterialFolderVariables {
  id: UUIDString;
  name: string;
  parentFolderId?: UUIDString | null;
  folderType: string;
  courseId?: UUIDString | null;
  lessonId?: UUIDString | null;
  createdById?: string | null;
}

export interface CreateSourceMaterialTagAssignmentData {
  sourceMaterialTagAssignment_insert: SourceMaterialTagAssignment_Key;
}

export interface CreateSourceMaterialTagAssignmentVariables {
  id: UUIDString;
  sourceMaterialId: UUIDString;
  tagId: UUIDString;
}

export interface CreateSourceMaterialTagData {
  sourceMaterialTag_insert: SourceMaterialTag_Key;
}

export interface CreateSourceMaterialTagVariables {
  id: UUIDString;
  name: string;
  color?: string | null;
  createdById?: string | null;
}

export interface CreateSourceMaterialVariables {
  id: UUIDString;
  title: string;
  fileName: string;
  fileType: string;
  folderId?: UUIDString | null;
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

export interface DeleteAnswerChoicesForQuestionData {
  answerChoice_deleteMany: number;
}

export interface DeleteAnswerChoicesForQuestionVariables {
  questionId: UUIDString;
}

export interface DeleteFormulaData {
  formula_delete?: Formula_Key | null;
}

export interface DeleteFormulaSectionData {
  formulaSection_delete?: FormulaSection_Key | null;
}

export interface DeleteFormulaSectionVariables {
  id: UUIDString;
}

export interface DeleteFormulaVariables {
  id: UUIDString;
}

export interface DeleteFormulasForSectionData {
  formula_deleteMany: number;
}

export interface DeleteFormulasForSectionVariables {
  sectionId: UUIDString;
}

export interface DeleteGlossaryNoteData {
  glossaryNote_delete?: GlossaryNote_Key | null;
}

export interface DeleteGlossaryNoteVariables {
  id: UUIDString;
}

export interface DeleteGlossaryNotesForTermData {
  glossaryNote_deleteMany: number;
}

export interface DeleteGlossaryNotesForTermVariables {
  termId: UUIDString;
}

export interface DeleteGlossaryTermData {
  glossaryTerm_delete?: GlossaryTerm_Key | null;
}

export interface DeleteGlossaryTermVariables {
  id: UUIDString;
}

export interface DeleteIngestionJobsForMaterialData {
  ingestionJob_deleteMany: number;
}

export interface DeleteIngestionJobsForMaterialVariables {
  sourceMaterialId: UUIDString;
}

export interface DeleteLessonData {
  lesson_delete?: Lesson_Key | null;
}

export interface DeleteLessonNoteData {
  lessonNote_delete?: LessonNote_Key | null;
}

export interface DeleteLessonNoteVariables {
  id: UUIDString;
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

export interface DeleteModuleData {
  module_delete?: Module_Key | null;
}

export interface DeleteModuleVariables {
  id: UUIDString;
}

export interface DeleteQuestionData {
  question_delete?: Question_Key | null;
}

export interface DeleteQuestionVariables {
  id: UUIDString;
}

export interface DeleteQuizAttemptsForQuizData {
  quizAttempt_deleteMany: number;
}

export interface DeleteQuizAttemptsForQuizVariables {
  quizId: UUIDString;
}

export interface DeleteQuizData {
  quiz_delete?: Quiz_Key | null;
}

export interface DeleteQuizQuestionsForQuestionData {
  quizQuestion_deleteMany: number;
}

export interface DeleteQuizQuestionsForQuestionVariables {
  questionId: UUIDString;
}

export interface DeleteQuizQuestionsForQuizData {
  quizQuestion_deleteMany: number;
}

export interface DeleteQuizQuestionsForQuizVariables {
  quizId: UUIDString;
}

export interface DeleteQuizResponsesForQuizData {
  quizResponse_deleteMany: number;
}

export interface DeleteQuizResponsesForQuizVariables {
  quizId: UUIDString;
}

export interface DeleteQuizVariables {
  id: UUIDString;
}

export interface DeleteSourceLinksForLessonData {
  contentSourceLink_deleteMany: number;
}

export interface DeleteSourceLinksForLessonVariables {
  lessonId: UUIDString;
}

export interface DeleteSourceLinksForMaterialData {
  contentSourceLink_deleteMany: number;
}

export interface DeleteSourceLinksForMaterialVariables {
  sourceMaterialId: UUIDString;
}

export interface DeleteSourceLinksForQuestionData {
  contentSourceLink_deleteMany: number;
}

export interface DeleteSourceLinksForQuestionVariables {
  questionId: UUIDString;
}

export interface DeleteSourceMaterialData {
  sourceMaterial_delete?: SourceMaterial_Key | null;
}

export interface DeleteSourceMaterialFolderData {
  sourceMaterialFolder_delete?: SourceMaterialFolder_Key | null;
}

export interface DeleteSourceMaterialFolderVariables {
  id: UUIDString;
}

export interface DeleteSourceMaterialVariables {
  id: UUIDString;
}

export interface DeleteTagAssignmentsForMaterialData {
  sourceMaterialTagAssignment_deleteMany: number;
}

export interface DeleteTagAssignmentsForMaterialVariables {
  sourceMaterialId: UUIDString;
}

export interface DeleteUserFavoriteData {
  userFavorite_delete?: UserFavorite_Key | null;
}

export interface DeleteUserFavoriteVariables {
  userId: string;
  itemType: string;
  itemId: string;
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
      calcMetaJson?: string | null;
    } & Formula_Key)[];
  } & FormulaSection_Key)[];
}

export interface GetGlossaryNoteForUserTermData {
  glossaryNotes: ({
    id: UUIDString;
    note: string;
    updatedAt: DateString;
  } & GlossaryNote_Key)[];
}

export interface GetGlossaryNoteForUserTermVariables {
  userId: string;
  termId: UUIDString;
}

export interface GetGlossaryNotesForUserData {
  glossaryNotes: ({
    id: UUIDString;
    note: string;
    term: {
      id: UUIDString;
    } & GlossaryTerm_Key;
      createdAt: DateString;
      updatedAt: DateString;
  } & GlossaryNote_Key)[];
}

export interface GetGlossaryNotesForUserVariables {
  userId: string;
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

export interface GetLessonNoteForUserLessonData {
  lessonNotes: ({
    id: UUIDString;
    content: string;
    updatedAt: DateString;
  } & LessonNote_Key)[];
}

export interface GetLessonNoteForUserLessonVariables {
  userId: string;
  lessonId: UUIDString;
}

export interface GetLessonNotesForUserData {
  lessonNotes: ({
    id: UUIDString;
    lessonId?: UUIDString | null;
    lessonTitle?: string | null;
    content: string;
    createdAt: DateString;
    updatedAt: DateString;
  } & LessonNote_Key)[];
}

export interface GetLessonNotesForUserVariables {
  userId: string;
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

export interface GetUserFavoritesByTypeData {
  userFavorites: ({
    itemType: string;
    itemId: string;
    createdAt: DateString;
  })[];
}

export interface GetUserFavoritesByTypeVariables {
  userId: string;
  itemType: string;
}

export interface GetUserFavoritesData {
  userFavorites: ({
    itemType: string;
    itemId: string;
    createdAt: DateString;
  })[];
}

export interface GetUserFavoritesVariables {
  userId: string;
}

export interface GetUserLessonProgressSummaryData {
  userLessonProgresses: ({
    status: string;
  })[];
}

export interface GetUserLessonProgressSummaryVariables {
  userId: string;
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

export interface GlossaryNote_Key {
  id: UUIDString;
  __typename?: 'GlossaryNote_Key';
}

export interface GlossaryTerm_Key {
  id: UUIDString;
  __typename?: 'GlossaryTerm_Key';
}

export interface IngestionJob_Key {
  id: UUIDString;
  __typename?: 'IngestionJob_Key';
}

export interface LessonNote_Key {
  id: UUIDString;
  __typename?: 'LessonNote_Key';
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
    shuffleChoices: boolean;
    calculatorSettingsJson?: string | null;
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

export interface ListPublishedGlossaryTermsData {
  glossaryTerms: ({
    id: UUIDString;
    term: string;
    definition: string;
    fullDefinition?: string | null;
    domain?: string | null;
    category?: string | null;
    example?: string | null;
    relatedTerms?: string | null;
    sourceDocument?: string | null;
    createdAt: DateString;
    updatedAt: DateString;
  } & GlossaryTerm_Key)[];
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

export interface SourceMaterialActivity_Key {
  id: UUIDString;
  __typename?: 'SourceMaterialActivity_Key';
}

export interface SourceMaterialFolder_Key {
  id: UUIDString;
  __typename?: 'SourceMaterialFolder_Key';
}

export interface SourceMaterialTagAssignment_Key {
  id: UUIDString;
  __typename?: 'SourceMaterialTagAssignment_Key';
}

export interface SourceMaterialTag_Key {
  id: UUIDString;
  __typename?: 'SourceMaterialTag_Key';
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

export interface UpdateFormulaData {
  formula_update?: Formula_Key | null;
}

export interface UpdateFormulaSectionData {
  formulaSection_update?: FormulaSection_Key | null;
}

export interface UpdateFormulaSectionVariables {
  id: UUIDString;
  code?: string | null;
  title?: string | null;
  position?: number | null;
}

export interface UpdateFormulaVariables {
  id: UUIDString;
  code?: string | null;
  name?: string | null;
  expression?: string | null;
  notes?: string | null;
  calcMetaJson?: string | null;
  position?: number | null;
}

export interface UpdateGlossaryNoteData {
  glossaryNote_update?: GlossaryNote_Key | null;
}

export interface UpdateGlossaryNoteVariables {
  id: UUIDString;
  note: string;
  updatedAt: DateString;
}

export interface UpdateGlossaryTermData {
  glossaryTerm_update?: GlossaryTerm_Key | null;
}

export interface UpdateGlossaryTermVariables {
  id: UUIDString;
  term?: string | null;
  definition?: string | null;
  fullDefinition?: string | null;
  domain?: string | null;
  category?: string | null;
  example?: string | null;
  relatedTerms?: string | null;
  isPublished?: boolean | null;
  sourceDocument?: string | null;
  updatedAt: DateString;
}

export interface UpdateLessonData {
  lesson_update?: Lesson_Key | null;
}

export interface UpdateLessonNoteData {
  lessonNote_update?: LessonNote_Key | null;
}

export interface UpdateLessonNoteVariables {
  id: UUIDString;
  lessonTitle?: string | null;
  content: string;
  updatedAt: DateString;
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

export interface UpdateQuizCalculatorSettingsData {
  quiz_update?: Quiz_Key | null;
}

export interface UpdateQuizCalculatorSettingsVariables {
  id: UUIDString;
  calculatorSettingsJson?: string | null;
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

export interface UpdateSourceMaterialData {
  sourceMaterial_update?: SourceMaterial_Key | null;
}

export interface UpdateSourceMaterialFolderData {
  sourceMaterialFolder_update?: SourceMaterialFolder_Key | null;
}

export interface UpdateSourceMaterialFolderVariables {
  id: UUIDString;
  name?: string | null;
  parentFolderId?: UUIDString | null;
  archivedAt?: DateString | null;
  trashedAt?: DateString | null;
}

export interface UpdateSourceMaterialLibraryStateData {
  sourceMaterial_update?: SourceMaterial_Key | null;
}

export interface UpdateSourceMaterialLibraryStateVariables {
  id: UUIDString;
  title?: string | null;
  folderId?: UUIDString | null;
  starred?: boolean | null;
  archivedAt?: DateString | null;
  trashedAt?: DateString | null;
  reviewStatus?: string | null;
  visibility?: string | null;
  duplicateOfId?: UUIDString | null;
  lastActivityAt?: DateString | null;
  metadataJson?: string | null;
  status?: string | null;
}

export interface UpdateSourceMaterialVariables {
  id: UUIDString;
  extractedText?: string | null;
  metadataJson?: string | null;
  status?: string | null;
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

export interface UpsertUserFavoriteData {
  userFavorite_upsert: UserFavorite_Key;
}

export interface UpsertUserFavoriteVariables {
  userId: string;
  itemType: string;
  itemId: string;
}

export interface UserCourseProgress_Key {
  userId: string;
  courseId: UUIDString;
  __typename?: 'UserCourseProgress_Key';
}

export interface UserFavorite_Key {
  userId: string;
  itemType: string;
  itemId: string;
  __typename?: 'UserFavorite_Key';
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

interface DeleteModuleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteModuleVariables): MutationRef<DeleteModuleData, DeleteModuleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteModuleVariables): MutationRef<DeleteModuleData, DeleteModuleVariables>;
  operationName: string;
}
export const deleteModuleRef: DeleteModuleRef;

export function deleteModule(vars: DeleteModuleVariables): MutationPromise<DeleteModuleData, DeleteModuleVariables>;
export function deleteModule(dc: DataConnect, vars: DeleteModuleVariables): MutationPromise<DeleteModuleData, DeleteModuleVariables>;

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

interface DeleteSourceLinksForQuestionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceLinksForQuestionVariables): MutationRef<DeleteSourceLinksForQuestionData, DeleteSourceLinksForQuestionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSourceLinksForQuestionVariables): MutationRef<DeleteSourceLinksForQuestionData, DeleteSourceLinksForQuestionVariables>;
  operationName: string;
}
export const deleteSourceLinksForQuestionRef: DeleteSourceLinksForQuestionRef;

export function deleteSourceLinksForQuestion(vars: DeleteSourceLinksForQuestionVariables): MutationPromise<DeleteSourceLinksForQuestionData, DeleteSourceLinksForQuestionVariables>;
export function deleteSourceLinksForQuestion(dc: DataConnect, vars: DeleteSourceLinksForQuestionVariables): MutationPromise<DeleteSourceLinksForQuestionData, DeleteSourceLinksForQuestionVariables>;

interface DeleteSourceLinksForMaterialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceLinksForMaterialVariables): MutationRef<DeleteSourceLinksForMaterialData, DeleteSourceLinksForMaterialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSourceLinksForMaterialVariables): MutationRef<DeleteSourceLinksForMaterialData, DeleteSourceLinksForMaterialVariables>;
  operationName: string;
}
export const deleteSourceLinksForMaterialRef: DeleteSourceLinksForMaterialRef;

export function deleteSourceLinksForMaterial(vars: DeleteSourceLinksForMaterialVariables): MutationPromise<DeleteSourceLinksForMaterialData, DeleteSourceLinksForMaterialVariables>;
export function deleteSourceLinksForMaterial(dc: DataConnect, vars: DeleteSourceLinksForMaterialVariables): MutationPromise<DeleteSourceLinksForMaterialData, DeleteSourceLinksForMaterialVariables>;

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

interface DeleteIngestionJobsForMaterialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteIngestionJobsForMaterialVariables): MutationRef<DeleteIngestionJobsForMaterialData, DeleteIngestionJobsForMaterialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteIngestionJobsForMaterialVariables): MutationRef<DeleteIngestionJobsForMaterialData, DeleteIngestionJobsForMaterialVariables>;
  operationName: string;
}
export const deleteIngestionJobsForMaterialRef: DeleteIngestionJobsForMaterialRef;

export function deleteIngestionJobsForMaterial(vars: DeleteIngestionJobsForMaterialVariables): MutationPromise<DeleteIngestionJobsForMaterialData, DeleteIngestionJobsForMaterialVariables>;
export function deleteIngestionJobsForMaterial(dc: DataConnect, vars: DeleteIngestionJobsForMaterialVariables): MutationPromise<DeleteIngestionJobsForMaterialData, DeleteIngestionJobsForMaterialVariables>;

interface DeleteSourceMaterialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceMaterialVariables): MutationRef<DeleteSourceMaterialData, DeleteSourceMaterialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSourceMaterialVariables): MutationRef<DeleteSourceMaterialData, DeleteSourceMaterialVariables>;
  operationName: string;
}
export const deleteSourceMaterialRef: DeleteSourceMaterialRef;

export function deleteSourceMaterial(vars: DeleteSourceMaterialVariables): MutationPromise<DeleteSourceMaterialData, DeleteSourceMaterialVariables>;
export function deleteSourceMaterial(dc: DataConnect, vars: DeleteSourceMaterialVariables): MutationPromise<DeleteSourceMaterialData, DeleteSourceMaterialVariables>;

interface UpdateSourceMaterialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSourceMaterialVariables): MutationRef<UpdateSourceMaterialData, UpdateSourceMaterialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSourceMaterialVariables): MutationRef<UpdateSourceMaterialData, UpdateSourceMaterialVariables>;
  operationName: string;
}
export const updateSourceMaterialRef: UpdateSourceMaterialRef;

export function updateSourceMaterial(vars: UpdateSourceMaterialVariables): MutationPromise<UpdateSourceMaterialData, UpdateSourceMaterialVariables>;
export function updateSourceMaterial(dc: DataConnect, vars: UpdateSourceMaterialVariables): MutationPromise<UpdateSourceMaterialData, UpdateSourceMaterialVariables>;

interface UpdateSourceMaterialLibraryStateRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSourceMaterialLibraryStateVariables): MutationRef<UpdateSourceMaterialLibraryStateData, UpdateSourceMaterialLibraryStateVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSourceMaterialLibraryStateVariables): MutationRef<UpdateSourceMaterialLibraryStateData, UpdateSourceMaterialLibraryStateVariables>;
  operationName: string;
}
export const updateSourceMaterialLibraryStateRef: UpdateSourceMaterialLibraryStateRef;

export function updateSourceMaterialLibraryState(vars: UpdateSourceMaterialLibraryStateVariables): MutationPromise<UpdateSourceMaterialLibraryStateData, UpdateSourceMaterialLibraryStateVariables>;
export function updateSourceMaterialLibraryState(dc: DataConnect, vars: UpdateSourceMaterialLibraryStateVariables): MutationPromise<UpdateSourceMaterialLibraryStateData, UpdateSourceMaterialLibraryStateVariables>;

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

interface CreateSourceMaterialFolderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSourceMaterialFolderVariables): MutationRef<CreateSourceMaterialFolderData, CreateSourceMaterialFolderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSourceMaterialFolderVariables): MutationRef<CreateSourceMaterialFolderData, CreateSourceMaterialFolderVariables>;
  operationName: string;
}
export const createSourceMaterialFolderRef: CreateSourceMaterialFolderRef;

export function createSourceMaterialFolder(vars: CreateSourceMaterialFolderVariables): MutationPromise<CreateSourceMaterialFolderData, CreateSourceMaterialFolderVariables>;
export function createSourceMaterialFolder(dc: DataConnect, vars: CreateSourceMaterialFolderVariables): MutationPromise<CreateSourceMaterialFolderData, CreateSourceMaterialFolderVariables>;

interface UpdateSourceMaterialFolderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSourceMaterialFolderVariables): MutationRef<UpdateSourceMaterialFolderData, UpdateSourceMaterialFolderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSourceMaterialFolderVariables): MutationRef<UpdateSourceMaterialFolderData, UpdateSourceMaterialFolderVariables>;
  operationName: string;
}
export const updateSourceMaterialFolderRef: UpdateSourceMaterialFolderRef;

export function updateSourceMaterialFolder(vars: UpdateSourceMaterialFolderVariables): MutationPromise<UpdateSourceMaterialFolderData, UpdateSourceMaterialFolderVariables>;
export function updateSourceMaterialFolder(dc: DataConnect, vars: UpdateSourceMaterialFolderVariables): MutationPromise<UpdateSourceMaterialFolderData, UpdateSourceMaterialFolderVariables>;

interface DeleteSourceMaterialFolderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSourceMaterialFolderVariables): MutationRef<DeleteSourceMaterialFolderData, DeleteSourceMaterialFolderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSourceMaterialFolderVariables): MutationRef<DeleteSourceMaterialFolderData, DeleteSourceMaterialFolderVariables>;
  operationName: string;
}
export const deleteSourceMaterialFolderRef: DeleteSourceMaterialFolderRef;

export function deleteSourceMaterialFolder(vars: DeleteSourceMaterialFolderVariables): MutationPromise<DeleteSourceMaterialFolderData, DeleteSourceMaterialFolderVariables>;
export function deleteSourceMaterialFolder(dc: DataConnect, vars: DeleteSourceMaterialFolderVariables): MutationPromise<DeleteSourceMaterialFolderData, DeleteSourceMaterialFolderVariables>;

interface CreateSourceMaterialTagRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSourceMaterialTagVariables): MutationRef<CreateSourceMaterialTagData, CreateSourceMaterialTagVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSourceMaterialTagVariables): MutationRef<CreateSourceMaterialTagData, CreateSourceMaterialTagVariables>;
  operationName: string;
}
export const createSourceMaterialTagRef: CreateSourceMaterialTagRef;

export function createSourceMaterialTag(vars: CreateSourceMaterialTagVariables): MutationPromise<CreateSourceMaterialTagData, CreateSourceMaterialTagVariables>;
export function createSourceMaterialTag(dc: DataConnect, vars: CreateSourceMaterialTagVariables): MutationPromise<CreateSourceMaterialTagData, CreateSourceMaterialTagVariables>;

interface CreateSourceMaterialTagAssignmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSourceMaterialTagAssignmentVariables): MutationRef<CreateSourceMaterialTagAssignmentData, CreateSourceMaterialTagAssignmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSourceMaterialTagAssignmentVariables): MutationRef<CreateSourceMaterialTagAssignmentData, CreateSourceMaterialTagAssignmentVariables>;
  operationName: string;
}
export const createSourceMaterialTagAssignmentRef: CreateSourceMaterialTagAssignmentRef;

export function createSourceMaterialTagAssignment(vars: CreateSourceMaterialTagAssignmentVariables): MutationPromise<CreateSourceMaterialTagAssignmentData, CreateSourceMaterialTagAssignmentVariables>;
export function createSourceMaterialTagAssignment(dc: DataConnect, vars: CreateSourceMaterialTagAssignmentVariables): MutationPromise<CreateSourceMaterialTagAssignmentData, CreateSourceMaterialTagAssignmentVariables>;

interface DeleteTagAssignmentsForMaterialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTagAssignmentsForMaterialVariables): MutationRef<DeleteTagAssignmentsForMaterialData, DeleteTagAssignmentsForMaterialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTagAssignmentsForMaterialVariables): MutationRef<DeleteTagAssignmentsForMaterialData, DeleteTagAssignmentsForMaterialVariables>;
  operationName: string;
}
export const deleteTagAssignmentsForMaterialRef: DeleteTagAssignmentsForMaterialRef;

export function deleteTagAssignmentsForMaterial(vars: DeleteTagAssignmentsForMaterialVariables): MutationPromise<DeleteTagAssignmentsForMaterialData, DeleteTagAssignmentsForMaterialVariables>;
export function deleteTagAssignmentsForMaterial(dc: DataConnect, vars: DeleteTagAssignmentsForMaterialVariables): MutationPromise<DeleteTagAssignmentsForMaterialData, DeleteTagAssignmentsForMaterialVariables>;

interface CreateSourceMaterialActivityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSourceMaterialActivityVariables): MutationRef<CreateSourceMaterialActivityData, CreateSourceMaterialActivityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSourceMaterialActivityVariables): MutationRef<CreateSourceMaterialActivityData, CreateSourceMaterialActivityVariables>;
  operationName: string;
}
export const createSourceMaterialActivityRef: CreateSourceMaterialActivityRef;

export function createSourceMaterialActivity(vars: CreateSourceMaterialActivityVariables): MutationPromise<CreateSourceMaterialActivityData, CreateSourceMaterialActivityVariables>;
export function createSourceMaterialActivity(dc: DataConnect, vars: CreateSourceMaterialActivityVariables): MutationPromise<CreateSourceMaterialActivityData, CreateSourceMaterialActivityVariables>;

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

interface DeleteAnswerChoicesForQuestionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAnswerChoicesForQuestionVariables): MutationRef<DeleteAnswerChoicesForQuestionData, DeleteAnswerChoicesForQuestionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAnswerChoicesForQuestionVariables): MutationRef<DeleteAnswerChoicesForQuestionData, DeleteAnswerChoicesForQuestionVariables>;
  operationName: string;
}
export const deleteAnswerChoicesForQuestionRef: DeleteAnswerChoicesForQuestionRef;

export function deleteAnswerChoicesForQuestion(vars: DeleteAnswerChoicesForQuestionVariables): MutationPromise<DeleteAnswerChoicesForQuestionData, DeleteAnswerChoicesForQuestionVariables>;
export function deleteAnswerChoicesForQuestion(dc: DataConnect, vars: DeleteAnswerChoicesForQuestionVariables): MutationPromise<DeleteAnswerChoicesForQuestionData, DeleteAnswerChoicesForQuestionVariables>;

interface DeleteQuizQuestionsForQuestionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizQuestionsForQuestionVariables): MutationRef<DeleteQuizQuestionsForQuestionData, DeleteQuizQuestionsForQuestionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteQuizQuestionsForQuestionVariables): MutationRef<DeleteQuizQuestionsForQuestionData, DeleteQuizQuestionsForQuestionVariables>;
  operationName: string;
}
export const deleteQuizQuestionsForQuestionRef: DeleteQuizQuestionsForQuestionRef;

export function deleteQuizQuestionsForQuestion(vars: DeleteQuizQuestionsForQuestionVariables): MutationPromise<DeleteQuizQuestionsForQuestionData, DeleteQuizQuestionsForQuestionVariables>;
export function deleteQuizQuestionsForQuestion(dc: DataConnect, vars: DeleteQuizQuestionsForQuestionVariables): MutationPromise<DeleteQuizQuestionsForQuestionData, DeleteQuizQuestionsForQuestionVariables>;

interface DeleteQuestionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuestionVariables): MutationRef<DeleteQuestionData, DeleteQuestionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteQuestionVariables): MutationRef<DeleteQuestionData, DeleteQuestionVariables>;
  operationName: string;
}
export const deleteQuestionRef: DeleteQuestionRef;

export function deleteQuestion(vars: DeleteQuestionVariables): MutationPromise<DeleteQuestionData, DeleteQuestionVariables>;
export function deleteQuestion(dc: DataConnect, vars: DeleteQuestionVariables): MutationPromise<DeleteQuestionData, DeleteQuestionVariables>;

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

interface UpdateQuizCalculatorSettingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateQuizCalculatorSettingsVariables): MutationRef<UpdateQuizCalculatorSettingsData, UpdateQuizCalculatorSettingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateQuizCalculatorSettingsVariables): MutationRef<UpdateQuizCalculatorSettingsData, UpdateQuizCalculatorSettingsVariables>;
  operationName: string;
}
export const updateQuizCalculatorSettingsRef: UpdateQuizCalculatorSettingsRef;

export function updateQuizCalculatorSettings(vars: UpdateQuizCalculatorSettingsVariables): MutationPromise<UpdateQuizCalculatorSettingsData, UpdateQuizCalculatorSettingsVariables>;
export function updateQuizCalculatorSettings(dc: DataConnect, vars: UpdateQuizCalculatorSettingsVariables): MutationPromise<UpdateQuizCalculatorSettingsData, UpdateQuizCalculatorSettingsVariables>;

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

interface DeleteQuizQuestionsForQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizQuestionsForQuizVariables): MutationRef<DeleteQuizQuestionsForQuizData, DeleteQuizQuestionsForQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteQuizQuestionsForQuizVariables): MutationRef<DeleteQuizQuestionsForQuizData, DeleteQuizQuestionsForQuizVariables>;
  operationName: string;
}
export const deleteQuizQuestionsForQuizRef: DeleteQuizQuestionsForQuizRef;

export function deleteQuizQuestionsForQuiz(vars: DeleteQuizQuestionsForQuizVariables): MutationPromise<DeleteQuizQuestionsForQuizData, DeleteQuizQuestionsForQuizVariables>;
export function deleteQuizQuestionsForQuiz(dc: DataConnect, vars: DeleteQuizQuestionsForQuizVariables): MutationPromise<DeleteQuizQuestionsForQuizData, DeleteQuizQuestionsForQuizVariables>;

interface DeleteQuizResponsesForQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizResponsesForQuizVariables): MutationRef<DeleteQuizResponsesForQuizData, DeleteQuizResponsesForQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteQuizResponsesForQuizVariables): MutationRef<DeleteQuizResponsesForQuizData, DeleteQuizResponsesForQuizVariables>;
  operationName: string;
}
export const deleteQuizResponsesForQuizRef: DeleteQuizResponsesForQuizRef;

export function deleteQuizResponsesForQuiz(vars: DeleteQuizResponsesForQuizVariables): MutationPromise<DeleteQuizResponsesForQuizData, DeleteQuizResponsesForQuizVariables>;
export function deleteQuizResponsesForQuiz(dc: DataConnect, vars: DeleteQuizResponsesForQuizVariables): MutationPromise<DeleteQuizResponsesForQuizData, DeleteQuizResponsesForQuizVariables>;

interface DeleteQuizAttemptsForQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizAttemptsForQuizVariables): MutationRef<DeleteQuizAttemptsForQuizData, DeleteQuizAttemptsForQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteQuizAttemptsForQuizVariables): MutationRef<DeleteQuizAttemptsForQuizData, DeleteQuizAttemptsForQuizVariables>;
  operationName: string;
}
export const deleteQuizAttemptsForQuizRef: DeleteQuizAttemptsForQuizRef;

export function deleteQuizAttemptsForQuiz(vars: DeleteQuizAttemptsForQuizVariables): MutationPromise<DeleteQuizAttemptsForQuizData, DeleteQuizAttemptsForQuizVariables>;
export function deleteQuizAttemptsForQuiz(dc: DataConnect, vars: DeleteQuizAttemptsForQuizVariables): MutationPromise<DeleteQuizAttemptsForQuizData, DeleteQuizAttemptsForQuizVariables>;

interface DeleteQuizRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuizVariables): MutationRef<DeleteQuizData, DeleteQuizVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteQuizVariables): MutationRef<DeleteQuizData, DeleteQuizVariables>;
  operationName: string;
}
export const deleteQuizRef: DeleteQuizRef;

export function deleteQuiz(vars: DeleteQuizVariables): MutationPromise<DeleteQuizData, DeleteQuizVariables>;
export function deleteQuiz(dc: DataConnect, vars: DeleteQuizVariables): MutationPromise<DeleteQuizData, DeleteQuizVariables>;

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

interface UpdateFormulaRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateFormulaVariables): MutationRef<UpdateFormulaData, UpdateFormulaVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateFormulaVariables): MutationRef<UpdateFormulaData, UpdateFormulaVariables>;
  operationName: string;
}
export const updateFormulaRef: UpdateFormulaRef;

export function updateFormula(vars: UpdateFormulaVariables): MutationPromise<UpdateFormulaData, UpdateFormulaVariables>;
export function updateFormula(dc: DataConnect, vars: UpdateFormulaVariables): MutationPromise<UpdateFormulaData, UpdateFormulaVariables>;

interface DeleteFormulaRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFormulaVariables): MutationRef<DeleteFormulaData, DeleteFormulaVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteFormulaVariables): MutationRef<DeleteFormulaData, DeleteFormulaVariables>;
  operationName: string;
}
export const deleteFormulaRef: DeleteFormulaRef;

export function deleteFormula(vars: DeleteFormulaVariables): MutationPromise<DeleteFormulaData, DeleteFormulaVariables>;
export function deleteFormula(dc: DataConnect, vars: DeleteFormulaVariables): MutationPromise<DeleteFormulaData, DeleteFormulaVariables>;

interface UpdateFormulaSectionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateFormulaSectionVariables): MutationRef<UpdateFormulaSectionData, UpdateFormulaSectionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateFormulaSectionVariables): MutationRef<UpdateFormulaSectionData, UpdateFormulaSectionVariables>;
  operationName: string;
}
export const updateFormulaSectionRef: UpdateFormulaSectionRef;

export function updateFormulaSection(vars: UpdateFormulaSectionVariables): MutationPromise<UpdateFormulaSectionData, UpdateFormulaSectionVariables>;
export function updateFormulaSection(dc: DataConnect, vars: UpdateFormulaSectionVariables): MutationPromise<UpdateFormulaSectionData, UpdateFormulaSectionVariables>;

interface DeleteFormulasForSectionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFormulasForSectionVariables): MutationRef<DeleteFormulasForSectionData, DeleteFormulasForSectionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteFormulasForSectionVariables): MutationRef<DeleteFormulasForSectionData, DeleteFormulasForSectionVariables>;
  operationName: string;
}
export const deleteFormulasForSectionRef: DeleteFormulasForSectionRef;

export function deleteFormulasForSection(vars: DeleteFormulasForSectionVariables): MutationPromise<DeleteFormulasForSectionData, DeleteFormulasForSectionVariables>;
export function deleteFormulasForSection(dc: DataConnect, vars: DeleteFormulasForSectionVariables): MutationPromise<DeleteFormulasForSectionData, DeleteFormulasForSectionVariables>;

interface DeleteFormulaSectionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFormulaSectionVariables): MutationRef<DeleteFormulaSectionData, DeleteFormulaSectionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteFormulaSectionVariables): MutationRef<DeleteFormulaSectionData, DeleteFormulaSectionVariables>;
  operationName: string;
}
export const deleteFormulaSectionRef: DeleteFormulaSectionRef;

export function deleteFormulaSection(vars: DeleteFormulaSectionVariables): MutationPromise<DeleteFormulaSectionData, DeleteFormulaSectionVariables>;
export function deleteFormulaSection(dc: DataConnect, vars: DeleteFormulaSectionVariables): MutationPromise<DeleteFormulaSectionData, DeleteFormulaSectionVariables>;

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

interface CreateGlossaryTermRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateGlossaryTermVariables): MutationRef<CreateGlossaryTermData, CreateGlossaryTermVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateGlossaryTermVariables): MutationRef<CreateGlossaryTermData, CreateGlossaryTermVariables>;
  operationName: string;
}
export const createGlossaryTermRef: CreateGlossaryTermRef;

export function createGlossaryTerm(vars: CreateGlossaryTermVariables): MutationPromise<CreateGlossaryTermData, CreateGlossaryTermVariables>;
export function createGlossaryTerm(dc: DataConnect, vars: CreateGlossaryTermVariables): MutationPromise<CreateGlossaryTermData, CreateGlossaryTermVariables>;

interface UpdateGlossaryTermRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGlossaryTermVariables): MutationRef<UpdateGlossaryTermData, UpdateGlossaryTermVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateGlossaryTermVariables): MutationRef<UpdateGlossaryTermData, UpdateGlossaryTermVariables>;
  operationName: string;
}
export const updateGlossaryTermRef: UpdateGlossaryTermRef;

export function updateGlossaryTerm(vars: UpdateGlossaryTermVariables): MutationPromise<UpdateGlossaryTermData, UpdateGlossaryTermVariables>;
export function updateGlossaryTerm(dc: DataConnect, vars: UpdateGlossaryTermVariables): MutationPromise<UpdateGlossaryTermData, UpdateGlossaryTermVariables>;

interface DeleteGlossaryTermRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteGlossaryTermVariables): MutationRef<DeleteGlossaryTermData, DeleteGlossaryTermVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteGlossaryTermVariables): MutationRef<DeleteGlossaryTermData, DeleteGlossaryTermVariables>;
  operationName: string;
}
export const deleteGlossaryTermRef: DeleteGlossaryTermRef;

export function deleteGlossaryTerm(vars: DeleteGlossaryTermVariables): MutationPromise<DeleteGlossaryTermData, DeleteGlossaryTermVariables>;
export function deleteGlossaryTerm(dc: DataConnect, vars: DeleteGlossaryTermVariables): MutationPromise<DeleteGlossaryTermData, DeleteGlossaryTermVariables>;

interface DeleteGlossaryNotesForTermRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteGlossaryNotesForTermVariables): MutationRef<DeleteGlossaryNotesForTermData, DeleteGlossaryNotesForTermVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteGlossaryNotesForTermVariables): MutationRef<DeleteGlossaryNotesForTermData, DeleteGlossaryNotesForTermVariables>;
  operationName: string;
}
export const deleteGlossaryNotesForTermRef: DeleteGlossaryNotesForTermRef;

export function deleteGlossaryNotesForTerm(vars: DeleteGlossaryNotesForTermVariables): MutationPromise<DeleteGlossaryNotesForTermData, DeleteGlossaryNotesForTermVariables>;
export function deleteGlossaryNotesForTerm(dc: DataConnect, vars: DeleteGlossaryNotesForTermVariables): MutationPromise<DeleteGlossaryNotesForTermData, DeleteGlossaryNotesForTermVariables>;

interface CreateGlossaryNoteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateGlossaryNoteVariables): MutationRef<CreateGlossaryNoteData, CreateGlossaryNoteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateGlossaryNoteVariables): MutationRef<CreateGlossaryNoteData, CreateGlossaryNoteVariables>;
  operationName: string;
}
export const createGlossaryNoteRef: CreateGlossaryNoteRef;

export function createGlossaryNote(vars: CreateGlossaryNoteVariables): MutationPromise<CreateGlossaryNoteData, CreateGlossaryNoteVariables>;
export function createGlossaryNote(dc: DataConnect, vars: CreateGlossaryNoteVariables): MutationPromise<CreateGlossaryNoteData, CreateGlossaryNoteVariables>;

interface UpdateGlossaryNoteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGlossaryNoteVariables): MutationRef<UpdateGlossaryNoteData, UpdateGlossaryNoteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateGlossaryNoteVariables): MutationRef<UpdateGlossaryNoteData, UpdateGlossaryNoteVariables>;
  operationName: string;
}
export const updateGlossaryNoteRef: UpdateGlossaryNoteRef;

export function updateGlossaryNote(vars: UpdateGlossaryNoteVariables): MutationPromise<UpdateGlossaryNoteData, UpdateGlossaryNoteVariables>;
export function updateGlossaryNote(dc: DataConnect, vars: UpdateGlossaryNoteVariables): MutationPromise<UpdateGlossaryNoteData, UpdateGlossaryNoteVariables>;

interface DeleteGlossaryNoteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteGlossaryNoteVariables): MutationRef<DeleteGlossaryNoteData, DeleteGlossaryNoteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteGlossaryNoteVariables): MutationRef<DeleteGlossaryNoteData, DeleteGlossaryNoteVariables>;
  operationName: string;
}
export const deleteGlossaryNoteRef: DeleteGlossaryNoteRef;

export function deleteGlossaryNote(vars: DeleteGlossaryNoteVariables): MutationPromise<DeleteGlossaryNoteData, DeleteGlossaryNoteVariables>;
export function deleteGlossaryNote(dc: DataConnect, vars: DeleteGlossaryNoteVariables): MutationPromise<DeleteGlossaryNoteData, DeleteGlossaryNoteVariables>;

interface CreateLessonNoteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLessonNoteVariables): MutationRef<CreateLessonNoteData, CreateLessonNoteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateLessonNoteVariables): MutationRef<CreateLessonNoteData, CreateLessonNoteVariables>;
  operationName: string;
}
export const createLessonNoteRef: CreateLessonNoteRef;

export function createLessonNote(vars: CreateLessonNoteVariables): MutationPromise<CreateLessonNoteData, CreateLessonNoteVariables>;
export function createLessonNote(dc: DataConnect, vars: CreateLessonNoteVariables): MutationPromise<CreateLessonNoteData, CreateLessonNoteVariables>;

interface UpdateLessonNoteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLessonNoteVariables): MutationRef<UpdateLessonNoteData, UpdateLessonNoteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateLessonNoteVariables): MutationRef<UpdateLessonNoteData, UpdateLessonNoteVariables>;
  operationName: string;
}
export const updateLessonNoteRef: UpdateLessonNoteRef;

export function updateLessonNote(vars: UpdateLessonNoteVariables): MutationPromise<UpdateLessonNoteData, UpdateLessonNoteVariables>;
export function updateLessonNote(dc: DataConnect, vars: UpdateLessonNoteVariables): MutationPromise<UpdateLessonNoteData, UpdateLessonNoteVariables>;

interface DeleteLessonNoteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteLessonNoteVariables): MutationRef<DeleteLessonNoteData, DeleteLessonNoteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteLessonNoteVariables): MutationRef<DeleteLessonNoteData, DeleteLessonNoteVariables>;
  operationName: string;
}
export const deleteLessonNoteRef: DeleteLessonNoteRef;

export function deleteLessonNote(vars: DeleteLessonNoteVariables): MutationPromise<DeleteLessonNoteData, DeleteLessonNoteVariables>;
export function deleteLessonNote(dc: DataConnect, vars: DeleteLessonNoteVariables): MutationPromise<DeleteLessonNoteData, DeleteLessonNoteVariables>;

interface UpsertUserFavoriteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserFavoriteVariables): MutationRef<UpsertUserFavoriteData, UpsertUserFavoriteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserFavoriteVariables): MutationRef<UpsertUserFavoriteData, UpsertUserFavoriteVariables>;
  operationName: string;
}
export const upsertUserFavoriteRef: UpsertUserFavoriteRef;

export function upsertUserFavorite(vars: UpsertUserFavoriteVariables): MutationPromise<UpsertUserFavoriteData, UpsertUserFavoriteVariables>;
export function upsertUserFavorite(dc: DataConnect, vars: UpsertUserFavoriteVariables): MutationPromise<UpsertUserFavoriteData, UpsertUserFavoriteVariables>;

interface DeleteUserFavoriteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserFavoriteVariables): MutationRef<DeleteUserFavoriteData, DeleteUserFavoriteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserFavoriteVariables): MutationRef<DeleteUserFavoriteData, DeleteUserFavoriteVariables>;
  operationName: string;
}
export const deleteUserFavoriteRef: DeleteUserFavoriteRef;

export function deleteUserFavorite(vars: DeleteUserFavoriteVariables): MutationPromise<DeleteUserFavoriteData, DeleteUserFavoriteVariables>;
export function deleteUserFavorite(dc: DataConnect, vars: DeleteUserFavoriteVariables): MutationPromise<DeleteUserFavoriteData, DeleteUserFavoriteVariables>;

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

interface GetUserLessonProgressSummaryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserLessonProgressSummaryVariables): QueryRef<GetUserLessonProgressSummaryData, GetUserLessonProgressSummaryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserLessonProgressSummaryVariables): QueryRef<GetUserLessonProgressSummaryData, GetUserLessonProgressSummaryVariables>;
  operationName: string;
}
export const getUserLessonProgressSummaryRef: GetUserLessonProgressSummaryRef;

export function getUserLessonProgressSummary(vars: GetUserLessonProgressSummaryVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserLessonProgressSummaryData, GetUserLessonProgressSummaryVariables>;
export function getUserLessonProgressSummary(dc: DataConnect, vars: GetUserLessonProgressSummaryVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserLessonProgressSummaryData, GetUserLessonProgressSummaryVariables>;

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

interface AdminListQuizQuestionUsageRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListQuizQuestionUsageData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListQuizQuestionUsageData, undefined>;
  operationName: string;
}
export const adminListQuizQuestionUsageRef: AdminListQuizQuestionUsageRef;

export function adminListQuizQuestionUsage(options?: ExecuteQueryOptions): QueryPromise<AdminListQuizQuestionUsageData, undefined>;
export function adminListQuizQuestionUsage(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListQuizQuestionUsageData, undefined>;

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

interface AdminListSourceMaterialsRichRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListSourceMaterialsRichData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListSourceMaterialsRichData, undefined>;
  operationName: string;
}
export const adminListSourceMaterialsRichRef: AdminListSourceMaterialsRichRef;

export function adminListSourceMaterialsRich(options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialsRichData, undefined>;
export function adminListSourceMaterialsRich(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialsRichData, undefined>;

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

interface AdminListSourceMaterialFoldersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListSourceMaterialFoldersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListSourceMaterialFoldersData, undefined>;
  operationName: string;
}
export const adminListSourceMaterialFoldersRef: AdminListSourceMaterialFoldersRef;

export function adminListSourceMaterialFolders(options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialFoldersData, undefined>;
export function adminListSourceMaterialFolders(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialFoldersData, undefined>;

interface AdminListSourceMaterialTagsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListSourceMaterialTagsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListSourceMaterialTagsData, undefined>;
  operationName: string;
}
export const adminListSourceMaterialTagsRef: AdminListSourceMaterialTagsRef;

export function adminListSourceMaterialTags(options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialTagsData, undefined>;
export function adminListSourceMaterialTags(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListSourceMaterialTagsData, undefined>;

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

interface AdminListGlossaryTermsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListGlossaryTermsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListGlossaryTermsData, undefined>;
  operationName: string;
}
export const adminListGlossaryTermsRef: AdminListGlossaryTermsRef;

export function adminListGlossaryTerms(options?: ExecuteQueryOptions): QueryPromise<AdminListGlossaryTermsData, undefined>;
export function adminListGlossaryTerms(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AdminListGlossaryTermsData, undefined>;

interface ListPublishedGlossaryTermsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublishedGlossaryTermsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublishedGlossaryTermsData, undefined>;
  operationName: string;
}
export const listPublishedGlossaryTermsRef: ListPublishedGlossaryTermsRef;

export function listPublishedGlossaryTerms(options?: ExecuteQueryOptions): QueryPromise<ListPublishedGlossaryTermsData, undefined>;
export function listPublishedGlossaryTerms(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPublishedGlossaryTermsData, undefined>;

interface GetGlossaryNotesForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetGlossaryNotesForUserVariables): QueryRef<GetGlossaryNotesForUserData, GetGlossaryNotesForUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetGlossaryNotesForUserVariables): QueryRef<GetGlossaryNotesForUserData, GetGlossaryNotesForUserVariables>;
  operationName: string;
}
export const getGlossaryNotesForUserRef: GetGlossaryNotesForUserRef;

export function getGlossaryNotesForUser(vars: GetGlossaryNotesForUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetGlossaryNotesForUserData, GetGlossaryNotesForUserVariables>;
export function getGlossaryNotesForUser(dc: DataConnect, vars: GetGlossaryNotesForUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetGlossaryNotesForUserData, GetGlossaryNotesForUserVariables>;

interface GetGlossaryNoteForUserTermRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetGlossaryNoteForUserTermVariables): QueryRef<GetGlossaryNoteForUserTermData, GetGlossaryNoteForUserTermVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetGlossaryNoteForUserTermVariables): QueryRef<GetGlossaryNoteForUserTermData, GetGlossaryNoteForUserTermVariables>;
  operationName: string;
}
export const getGlossaryNoteForUserTermRef: GetGlossaryNoteForUserTermRef;

export function getGlossaryNoteForUserTerm(vars: GetGlossaryNoteForUserTermVariables, options?: ExecuteQueryOptions): QueryPromise<GetGlossaryNoteForUserTermData, GetGlossaryNoteForUserTermVariables>;
export function getGlossaryNoteForUserTerm(dc: DataConnect, vars: GetGlossaryNoteForUserTermVariables, options?: ExecuteQueryOptions): QueryPromise<GetGlossaryNoteForUserTermData, GetGlossaryNoteForUserTermVariables>;

interface GetLessonNotesForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLessonNotesForUserVariables): QueryRef<GetLessonNotesForUserData, GetLessonNotesForUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLessonNotesForUserVariables): QueryRef<GetLessonNotesForUserData, GetLessonNotesForUserVariables>;
  operationName: string;
}
export const getLessonNotesForUserRef: GetLessonNotesForUserRef;

export function getLessonNotesForUser(vars: GetLessonNotesForUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonNotesForUserData, GetLessonNotesForUserVariables>;
export function getLessonNotesForUser(dc: DataConnect, vars: GetLessonNotesForUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonNotesForUserData, GetLessonNotesForUserVariables>;

interface GetLessonNoteForUserLessonRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLessonNoteForUserLessonVariables): QueryRef<GetLessonNoteForUserLessonData, GetLessonNoteForUserLessonVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLessonNoteForUserLessonVariables): QueryRef<GetLessonNoteForUserLessonData, GetLessonNoteForUserLessonVariables>;
  operationName: string;
}
export const getLessonNoteForUserLessonRef: GetLessonNoteForUserLessonRef;

export function getLessonNoteForUserLesson(vars: GetLessonNoteForUserLessonVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonNoteForUserLessonData, GetLessonNoteForUserLessonVariables>;
export function getLessonNoteForUserLesson(dc: DataConnect, vars: GetLessonNoteForUserLessonVariables, options?: ExecuteQueryOptions): QueryPromise<GetLessonNoteForUserLessonData, GetLessonNoteForUserLessonVariables>;

interface GetUserFavoritesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserFavoritesVariables): QueryRef<GetUserFavoritesData, GetUserFavoritesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserFavoritesVariables): QueryRef<GetUserFavoritesData, GetUserFavoritesVariables>;
  operationName: string;
}
export const getUserFavoritesRef: GetUserFavoritesRef;

export function getUserFavorites(vars: GetUserFavoritesVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserFavoritesData, GetUserFavoritesVariables>;
export function getUserFavorites(dc: DataConnect, vars: GetUserFavoritesVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserFavoritesData, GetUserFavoritesVariables>;

interface GetUserFavoritesByTypeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserFavoritesByTypeVariables): QueryRef<GetUserFavoritesByTypeData, GetUserFavoritesByTypeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserFavoritesByTypeVariables): QueryRef<GetUserFavoritesByTypeData, GetUserFavoritesByTypeVariables>;
  operationName: string;
}
export const getUserFavoritesByTypeRef: GetUserFavoritesByTypeRef;

export function getUserFavoritesByType(vars: GetUserFavoritesByTypeVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserFavoritesByTypeData, GetUserFavoritesByTypeVariables>;
export function getUserFavoritesByType(dc: DataConnect, vars: GetUserFavoritesByTypeVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserFavoritesByTypeData, GetUserFavoritesByTypeVariables>;

