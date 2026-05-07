import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { getAdminFirestore, FieldValue } from "@/lib/firebase/admin-firestore";
import { z } from "zod";

const noteSchema = z.object({
  termId: z.string().min(1),
  note: z.string().trim().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const { uid } = await verifyIdToken(request.headers.get("Authorization"));
    const { searchParams } = new URL(request.url);
    const termId = searchParams.get("termId");

    const db = getAdminFirestore();
    let query = db.collection("glossaryNotes").where("userId", "==", uid);
    if (termId) query = query.where("termId", "==", termId);
    const snap = await query.orderBy("updatedAt", "desc").get();
    const notes = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ notes });
  } catch (err: any) {
    if (err.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[api/glossary/notes:GET]", err);
    return NextResponse.json({ error: "Failed to load notes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { uid } = await verifyIdToken(request.headers.get("Authorization"));
    const body = await request.json();
    const parsed = noteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const db = getAdminFirestore();
    // Upsert: one note per user per term
    const existing = await db
      .collection("glossaryNotes")
      .where("userId", "==", uid)
      .where("termId", "==", parsed.data.termId)
      .limit(1)
      .get();

    if (!existing.empty) {
      const doc = existing.docs[0];
      await doc.ref.update({ note: parsed.data.note, updatedAt: FieldValue.serverTimestamp() });
      return NextResponse.json({ id: doc.id });
    }

    const id = randomUUID();
    await db.collection("glossaryNotes").doc(id).set({
      userId: uid,
      termId: parsed.data.termId,
      note: parsed.data.note,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (err: any) {
    if (err.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[api/glossary/notes:POST]", err);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
