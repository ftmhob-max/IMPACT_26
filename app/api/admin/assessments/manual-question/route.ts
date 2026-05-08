import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { isDuplicateQuestionText, loadExistingQuestionDedupSet } from "@/lib/admin/question-dedup";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { manualQuestionSchema } from "@/lib/validations/admin";

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const parsed = manualQuestionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;
  const questionId = randomUUID();

  try {
    const seenQuestions = await loadExistingQuestionDedupSet();
    if (isDuplicateQuestionText(input.questionText, seenQuestions)) {
      return NextResponse.json(
        { error: "This question already exists in the question bank." },
        { status: 409 }
      );
    }

    const correctCount = input.choices.filter((choice) => choice.isCorrect).length;
    await adminDcMutate("CreateQuestion", {
      id: questionId,
      questionText: input.questionText,
      questionType: input.questionType,
      difficulty: input.difficulty,
      domain: input.domain,
      formulaRef: input.formulaRef || null,
      topicTags: JSON.stringify(input.topicTags),
      status: input.status,
      isMultiselect: input.questionType === "multiselect" || correctCount > 1,
      rationale: input.rationale || null,
      calculation: input.calculation || null,
      sourceRef: input.sourceRef || null,
      createdById: auth.session.uid,
    });

    for (let index = 0; index < input.choices.length; index++) {
      const choice = input.choices[index];
      await adminDcMutate("CreateAnswerChoice", {
        questionId,
        letter: choice.letter,
        choiceText: choice.choiceText,
        isCorrect: choice.isCorrect,
        explanation: choice.explanation || null,
        position: index,
      });
    }

    if (input.quizId) {
      await adminDcMutate("AddQuestionToQuiz", {
        quizId: input.quizId,
        questionId,
        position: Date.now(),
        pointValue: input.pointValue,
      });
    }

    return NextResponse.json({ id: questionId }, { status: 201 });
  } catch (error) {
    console.error("[admin/manual-question]", error);
    return NextResponse.json({ error: "Unable to save question" }, { status: 500 });
  }
}
