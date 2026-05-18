import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { getAdminFirestore, FieldValue } from "@/lib/firebase/admin-firestore";
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

  try {
    const db = getAdminFirestore();
    await db.collection("glossaryTerms").doc(id).update({
      ...parsed.data,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/glossary/[id]:PUT]", err);
    return NextResponse.json({ error: "Failed to update term" }, { status: 500 });
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
    const db = getAdminFirestore();
    // Delete the term and all student notes for it
    const notesSnap = await db.collection("glossaryNotes").where("termId", "==", id).get();
    const batch = db.batch();
    notesSnap.docs.forEach((doc: any) => batch.delete(doc.ref));
    batch.delete(db.collection("glossaryTerms").doc(id));
    await batch.commit();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/glossary/[id]:DELETE]", err);
    return NextResponse.json({ error: "Failed to delete term" }, { status: 500 });
  }
}
