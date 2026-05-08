import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import {
  isDuplicateQuestionText,
  loadExistingQuestionDedupSet,
  rememberQuestionText,
} from "@/lib/admin/question-dedup";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { csvImportSchema, type CsvQuestionRow } from "@/lib/validations/admin";

function isCorrectChoice(row: CsvQuestionRow, letter: string, choiceText: string) {
  return row.correct_answers.some((answer) => {
    const normalized = answer.trim().toUpperCase();
    return normalized === letter || normalized === choiceText.trim().toUpperCase();
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const parsed = csvImportSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { rows, quiz } = parsed.data;
  const importedQuestionIds: string[] = [];
  const duplicateRows: Array<{ row: number; questionText: string }> = [];
  let quizId: string | null = null;

  try {
    const seenQuestions = await loadExistingQuestionDedupSet();
    const rowsToImport: Array<{ row: CsvQuestionRow; rowIndex: number }> = [];

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      if (isDuplicateQuestionText(row.question_text, seenQuestions)) {
        duplicateRows.push({ row: rowIndex + 1, questionText: row.question_text });
        continue;
      }
      rememberQuestionText(row.question_text, seenQuestions);
      rowsToImport.push({ row, rowIndex });
    }

    if (quiz && rowsToImport.length > 0) {
      quizId = randomUUID();
      await adminDcMutate("CreateQuiz", {
        id: quizId,
        title: quiz.title,
        description: quiz.description || null,
        timeLimitSeconds: quiz.timeLimitSeconds ?? null,
        passingScore: quiz.passingScore,
        shuffleQuestions: quiz.shuffleQuestions,
        shuffleChoices: quiz.shuffleChoices,
        status: quiz.status,
        createdById: auth.session.uid,
      });
    }

    for (let importIndex = 0; importIndex < rowsToImport.length; importIndex++) {
      const { row } = rowsToImport[importIndex];
      const questionId = randomUUID();
      const correctCount = row.choices.filter((choice, index) =>
        isCorrectChoice(row, String.fromCharCode(65 + index), choice)
      ).length;

      await adminDcMutate("CreateQuestion", {
        id: questionId,
        questionText: row.question_text,
        questionType: row.question_type,
        difficulty: row.difficulty,
        domain: row.domain,
        formulaRef: row.formula_ref || null,
        topicTags: JSON.stringify(row.topic_tags),
        status: quiz?.status ?? "draft",
        isMultiselect: row.question_type === "multiselect" || correctCount > 1,
        rationale: row.rationale || null,
        calculation: row.calculation || null,
        sourceRef: row.source_ref || null,
        createdById: auth.session.uid,
      });

      for (let choiceIndex = 0; choiceIndex < row.choices.length; choiceIndex++) {
        const letter = String.fromCharCode(65 + choiceIndex);
        const choiceText = row.choices[choiceIndex];
        await adminDcMutate("CreateAnswerChoice", {
          questionId,
          letter,
          choiceText,
          isCorrect: isCorrectChoice(row, letter, choiceText),
          explanation: row.explanation || null,
          position: choiceIndex,
        });
      }

      if (quizId) {
        await adminDcMutate("AddQuestionToQuiz", {
          quizId,
          questionId,
          position: importIndex,
          pointValue: row.point_value,
        });
      }
      importedQuestionIds.push(questionId);
    }

    return NextResponse.json(
      {
        quizId,
        importedQuestionIds,
        duplicatesSkipped: duplicateRows.length,
        duplicateRows,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[admin/assessments/import]", error);
    return NextResponse.json({ error: "Unable to import assessment" }, { status: 500 });
  }
}
