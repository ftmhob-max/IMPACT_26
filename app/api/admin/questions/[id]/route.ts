import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { formatUuid } from "@/lib/utils";
import { z } from "zod";

const patchSchema = z.object({
  status: z.enum(["draft", "review", "published", "archived"]),
});

const putSchema = z.object({
  questionText: z.string().trim().min(1).optional(),
  difficulty: z.enum(["easy", "proficient", "expert"]).optional(),
  domain: z.string().trim().optional(),
  rationale: z.string().trim().optional().nullable(),
  calculation: z.string().trim().optional().nullable(),
  sourceRef: z.string().trim().optional().nullable(),
  formulaRef: z.string().trim().optional().nullable(),
  choices: z
    .array(
      z.object({
        id: z.string(),
        choiceText: z.string().trim(),
        isCorrect: z.boolean(),
        explanation: z.string().trim().optional().nullable(),
      })
    )
    .optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await adminDcMutate("UpdateQuestionStatus", { id, status: parsed.data.status });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/questions/[id]:PATCH]", err);
    return NextResponse.json({ error: "Unable to update question" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { choices, ...questionFields } = parsed.data;

  try {
    if (Object.keys(questionFields).length > 0) {
      await adminDcMutate("UpdateQuestion", { id, ...questionFields });
    }

    if (choices && choices.length > 0) {
      await Promise.all(
        choices.map((choice) =>
          adminDcMutate("UpdateAnswerChoice", {
            id: formatUuid(choice.id),
            choiceText: choice.choiceText,
            isCorrect: choice.isCorrect,
            explanation: choice.explanation ?? null,
          })
        )
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/questions/[id]:PUT]", err);
    return NextResponse.json({ error: "Unable to update question" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const questionId = formatUuid(id);

  try {
    await adminDcMutate("DeleteSourceLinksForQuestion", { questionId }).catch(() => null);
    await adminDcMutate("DeleteQuizQuestionsForQuestion", { questionId }).catch(() => null);
    await adminDcMutate("DeleteAnswerChoicesForQuestion", { questionId }).catch(() => null);
    await adminDcMutate("DeleteQuestion", { id: questionId });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/questions/[id]:DELETE]", err);
    return NextResponse.json({ error: "Unable to delete question" }, { status: 500 });
  }
}
