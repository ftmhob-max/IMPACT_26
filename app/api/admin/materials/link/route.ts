import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { z } from "zod";

const linkSchema = z.object({
  materialId: z.string().uuid(),
  lessonId: z.string().uuid().optional().nullable(),
  courseId: z.string().uuid().optional().nullable(),
  questionId: z.string().uuid().optional().nullable(),
  referenceLabel: z.string().trim().optional().nullable(),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = linkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { materialId, lessonId, courseId, questionId, referenceLabel } = parsed.data;
  if (!lessonId && !courseId && !questionId) {
    return NextResponse.json({ error: "Provide at least one of lessonId, courseId, or questionId" }, { status: 400 });
  }

  try {
    await adminDcMutate("CreateContentSourceLink", {
      id: randomUUID(),
      sourceMaterialId: materialId,
      lessonId: lessonId ?? null,
      courseId: courseId ?? null,
      questionId: questionId ?? null,
      referenceLabel: referenceLabel ?? null,
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[admin/materials/link]", error);
    return NextResponse.json({ error: "Unable to link material" }, { status: 500 });
  }
}
