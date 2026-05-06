import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { z } from "zod";

const bulkStatusSchema = z.object({
  action: z.literal("set-status"),
  ids: z.array(z.string().uuid()).min(1),
  status: z.enum(["draft", "review", "published", "archived"]),
});

const bulkAssignSchema = z.object({
  action: z.literal("assign-quiz"),
  ids: z.array(z.string().uuid()).min(1),
  quizId: z.string().uuid(),
  pointValue: z.number().positive().default(1),
});

const bodySchema = z.discriminatedUnion("action", [bulkStatusSchema, bulkAssignSchema]);

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const op = parsed.data;
  try {
    if (op.action === "set-status") {
      await Promise.all(
        op.ids.map((id) => adminDcMutate("UpdateQuestionStatus", { id, status: op.status }))
      );
      return NextResponse.json({ ok: true, updated: op.ids.length });
    }

    if (op.action === "assign-quiz") {
      const { adminDcQuery } = await import("@/lib/firebase/admin-dc");
      const posData = await adminDcQuery<{ quizQuestions: { position: number }[] }>(
        "GetQuizQuestionCount",
        { quizId: op.quizId }
      ).catch(() => ({ quizQuestions: [] }));
      const maxPos = posData.quizQuestions.reduce((m, q) => Math.max(m, q.position), 0);

      let pos = maxPos;
      const results = await Promise.allSettled(
        op.ids.map((questionId) => {
          pos++;
          return adminDcMutate("AddQuestionToQuiz", {
            quizId: op.quizId,
            questionId,
            position: pos,
            pointValue: op.pointValue,
          });
        })
      );
      const added = results.filter((r) => r.status === "fulfilled").length;
      return NextResponse.json({ ok: true, added });
    }
  } catch (err) {
    console.error("[admin/questions/bulk]", err);
    return NextResponse.json({ error: "Bulk operation failed" }, { status: 500 });
  }
}
