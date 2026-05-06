import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { z } from "zod";

const createQuizSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().optional().nullable(),
  passingScore: z.coerce.number().min(0).max(100).default(70),
  timeLimitSeconds: z.coerce.number().int().positive().optional().nullable(),
  shuffleQuestions: z.boolean().default(true),
  shuffleChoices: z.boolean().default(false),
  status: z.enum(["draft", "review", "published"]).default("draft"),
});

const patchQuizSchema = z.object({
  quizId: z.string().uuid(),
  status: z.enum(["draft", "review", "published"]),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = createQuizSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const quizId = randomUUID();
  try {
    await adminDcMutate("CreateQuiz", {
      id: quizId,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      timeLimitSeconds: parsed.data.timeLimitSeconds ?? null,
      passingScore: parsed.data.passingScore,
      shuffleQuestions: parsed.data.shuffleQuestions,
      shuffleChoices: parsed.data.shuffleChoices,
      status: parsed.data.status,
      createdById: auth.session.uid,
    });
    return NextResponse.json({ id: quizId }, { status: 201 });
  } catch (error) {
    console.error("[admin/quizzes:create]", error);
    return NextResponse.json({ error: "Unable to create quiz" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = patchQuizSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await adminDcMutate("UpdateQuizStatus", {
      id: parsed.data.quizId,
      status: parsed.data.status,
      updatedById: auth.session.uid,
      publishedAt: parsed.data.status === "published" ? new Date().toISOString() : null,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/quizzes:patch]", error);
    return NextResponse.json({ error: "Unable to update quiz" }, { status: 500 });
  }
}
