import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { adminDcMutate, adminDcRawMutate } from "@/lib/firebase/admin-dc";
import { DEV_COURSES, DEV_FORMULA_SECTIONS, DEV_QUIZZES } from "@/lib/dev-content";

const DEV_SYSTEM_USER_ID = "00000000-0000-0000-0000-000000000000";
let seedPromise: Promise<boolean> | null = null;

function isDuplicateError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /already exists|duplicate|unique/i.test(message);
}

async function safeMutate(operation: string, variables: Record<string, unknown>) {
  try {
    await adminDcMutate(operation, variables);
  } catch (error) {
    if (!isDuplicateError(error)) throw error;
  }
}

async function upsertSeedCourse(course: (typeof DEV_COURSES)[number]) {
  await safeMutate("CreateCourse", {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description ?? null,
    thumbnailUrl: course.thumbnailUrl ?? null,
    createdById: DEV_SYSTEM_USER_ID,
  });

  await adminDcRawMutate(
    `mutation UpdateSeedCourse(
      $id: UUID!
      $slug: String!
      $title: String!
      $description: String
      $thumbnailUrl: String
      $updatedById: String!
      $publishedAt: Date!
    ) {
      course_update(id: $id, data: {
        slug: $slug
        title: $title
        description: $description
        thumbnailUrl: $thumbnailUrl
        status: "published"
        isPublished: true
        updatedBy: { id: $updatedById }
        publishedAt: $publishedAt
      })
    }`,
    {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description ?? null,
      thumbnailUrl: course.thumbnailUrl ?? null,
      updatedById: DEV_SYSTEM_USER_ID,
      publishedAt: new Date().toISOString(),
    }
  );
}

async function seedDevQuizzes() {
  for (const quiz of DEV_QUIZZES) {
    const existingQuiz = await adminDcQuery<{ quiz: { id: string } | null }>("GetQuizById", { quizId: quiz.id }).catch(() => ({ quiz: null }));
    if (existingQuiz.quiz) continue;

    await safeMutate("CreateQuiz", {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description ?? null,
      timeLimitSeconds: quiz.timeLimitSeconds ?? null,
      passingScore: quiz.passingScore ?? null,
      shuffleQuestions: quiz.shuffleQuestions,
      shuffleChoices: quiz.shuffleChoices,
      status: "published",
      createdById: DEV_SYSTEM_USER_ID,
    });

    if (quiz.calculatorSettingsJson) {
      await safeMutate("UpdateQuizCalculatorSettings", {
        id: quiz.id,
        calculatorSettingsJson: quiz.calculatorSettingsJson,
      });
    }

    for (const [questionIndex, question] of quiz.questions.entries()) {
      await safeMutate("CreateQuestion", {
        id: question.id,
        questionText: question.questionText,
        questionType: question.questionType,
        difficulty: question.difficulty,
        domain: question.domain,
        formulaRef: question.formulaRef ?? null,
        topicTags: question.topicTags ?? null,
        status: "published",
        isMultiselect: false,
        rationale: question.rationale ?? null,
        calculation: question.calculation ?? null,
        sourceRef: question.sourceRef ?? null,
        createdById: DEV_SYSTEM_USER_ID,
      });

      for (const [choiceIndex, choice] of question.choices.entries()) {
        await safeMutate("CreateAnswerChoice", {
          questionId: question.id,
          letter: choice.letter,
          choiceText: choice.choiceText,
          isCorrect: choice.isCorrect,
          explanation: choice.explanation ?? null,
          position: choiceIndex,
        });
      }

      await safeMutate("AddQuestionToQuiz", {
        quizId: quiz.id,
        questionId: question.id,
        position: questionIndex,
        pointValue: 1,
      });
    }
  }
}

async function seedDevDataImpl() {
  if (process.env.NODE_ENV === "production") return false;

  await safeMutate("CreateUser", {
    id: DEV_SYSTEM_USER_ID,
    email: "system@impact26.local",
    fullName: "Development Seed",
  });

  const { formulaSections } = await adminDcQuery<{ formulaSections: Array<{ id: string; code: string }> }>("GetFormulaSections").catch(() => ({ formulaSections: [] }));

  await seedDevQuizzes();

  for (const course of DEV_COURSES) {
    await upsertSeedCourse(course);

    for (const module of course.modules_on_course) {
      await safeMutate("CreateModule", {
        id: module.id,
        courseId: course.id,
        title: module.title,
        position: module.position,
      });

      for (const lesson of module.lessons_on_module) {
        await safeMutate("CreateLesson", {
          id: lesson.id,
          moduleId: module.id,
          title: lesson.title,
          position: lesson.position,
          lessonType: lesson.lessonType,
        });
        await safeMutate("UpdateLesson", {
          id: lesson.id,
          contentJson: lesson.contentJson ?? null,
          quizId: lesson.quiz?.id ?? null,
          durationSeconds: lesson.durationSeconds ?? null,
          status: "published",
          isPublished: true,
          updatedById: DEV_SYSTEM_USER_ID,
          publishedAt: new Date().toISOString(),
        });
      }
    }
  }

  if (formulaSections.length === 0) {
    for (const section of DEV_FORMULA_SECTIONS) {
      await safeMutate("CreateFormulaSection", {
        id: section.id,
        code: section.code,
        title: section.title,
        position: section.position,
      });

      for (const [index, formula] of section.formulas.entries()) {
        await safeMutate("CreateFormula", {
          sectionId: section.id,
          code: formula.code,
          name: formula.name,
          expression: formula.expression,
          notes: formula.notes ?? null,
          calcMetaJson: formula.calcMetaJson ?? null,
          examplesJson: formula.examplesJson ?? null,
          symbolsJson: formula.symbolsJson ?? null,
          position: index,
        });
      }
    }
  }
  return true;
}

export async function ensureDevDataSeeded() {
  if (!seedPromise) {
    seedPromise = seedDevDataImpl().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}
