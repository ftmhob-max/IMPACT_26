import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcQuery, adminDcMutate } from "@/lib/firebase/admin-dc";
import { recordDailyActivitySafely } from "@/lib/firebase/daily-activity";
import { z } from "zod";

const noteSchema = z.object({
  termId: z.string().uuid(),
  note: z.string().trim().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const { uid } = await verifyIdToken(request.headers.get("Authorization"));
    const { searchParams } = new URL(request.url);
    const termId = searchParams.get("termId");

    const data = await adminDcQuery<{ glossaryNotes: Array<{ id: string; note: string; term: { id: string }; createdAt: string; updatedAt: string }> }>(
      "GetGlossaryNotesForUser",
      { userId: uid }
    );

    let notes = (data.glossaryNotes ?? []).map((n) => ({
      id: n.id,
      note: n.note,
      termId: n.term.id,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    }));

    // Optional client-side filter by termId (avoids a separate query)
    if (termId) {
      notes = notes.filter((n) => n.termId === termId);
    }

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

    const { termId, note } = parsed.data;
    const now = new Date().toISOString();

    // Upsert: one note per user per term
    const existing = await adminDcQuery<{ glossaryNotes: Array<{ id: string }> }>(
      "GetGlossaryNoteForUserTerm",
      { userId: uid, termId }
    );

    const existingNote = existing.glossaryNotes?.[0];
    if (existingNote) {
      await adminDcMutate("UpdateGlossaryNote", { id: existingNote.id, note, updatedAt: now });
      await recordDailyActivitySafely(uid);
      return NextResponse.json({ id: existingNote.id });
    }

    const id = randomUUID();
    await adminDcMutate("CreateGlossaryNote", { id, userId: uid, termId, note, updatedAt: now });
    await recordDailyActivitySafely(uid);
    return NextResponse.json({ id }, { status: 201 });
  } catch (err: any) {
    if (err.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[api/glossary/notes:POST]", err);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
