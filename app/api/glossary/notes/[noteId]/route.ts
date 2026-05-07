import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { getAdminFirestore, FieldValue } from "@/lib/firebase/admin-firestore";
import { z } from "zod";

const updateSchema = z.object({ note: z.string().trim().min(1) });

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { uid } = await verifyIdToken(request.headers.get("Authorization"));
    const { noteId } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const db = getAdminFirestore();
    const doc = await db.collection("glossaryNotes").doc(noteId).get();
    if (!doc.exists || doc.data()?.userId !== uid) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await doc.ref.update({ note: parsed.data.note, updatedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[api/glossary/notes/[noteId]:PUT]", err);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { uid } = await verifyIdToken(request.headers.get("Authorization"));
    const { noteId } = await params;
    const db = getAdminFirestore();
    const doc = await db.collection("glossaryNotes").doc(noteId).get();
    if (!doc.exists || doc.data()?.userId !== uid) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await doc.ref.delete();
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[api/glossary/notes/[noteId]:DELETE]", err);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
