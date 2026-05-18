import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { z } from "zod";

const updateSchema = z.object({
  term: z.string().trim().min(1).optional(),
  definition: z.string().trim().min(1).optional(),
  fullDefinition: z.string().trim().optional().nullable(),
  domain: z.string().trim().optional().nullable(),
  category: z.string().trim().optional().nullable(),
  example: z.string().trim().optional().nullable(),
  relatedTerms: z.array(z.string().trim().min(1)).optional(),
  isPublished: z.boolean().optional(),
  sourceDocument: z.string().trim().optional().nullable(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { relatedTerms, ...rest } = parsed.data;
  const now = new Date().toISOString();

  try {
    await adminDcMutate("UpdateGlossaryTerm", {
      id,
      ...rest,
      relatedTerms: relatedTerms !== undefined ? JSON.stringify(relatedTerms) : undefined,
      updatedAt: now,
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[admin/glossary/[id]:PUT]", err.message);
    return NextResponse.json({ error: "Failed to update term." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    // Cascade: remove all learner notes for this term first
    await adminDcMutate("DeleteGlossaryNotesForTerm", { termId: id });
    await adminDcMutate("DeleteGlossaryTerm", { id });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[admin/glossary/[id]:DELETE]", err.message);
    return NextResponse.json({ error: "Failed to delete term." }, { status: 500 });
  }
}
