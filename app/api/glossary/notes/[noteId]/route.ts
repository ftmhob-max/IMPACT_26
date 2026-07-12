import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcQuery, adminDcMutate } from "@/lib/firebase/admin-dc";
import { recordDailyActivitySafely } from "@/lib/firebase/daily-activity";
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

    // Verify ownership: fetch notes for this user and check the note belongs to them
    const data = await adminDcQuery<{ glossaryNotes: Array<{ id: string }> }>(
      "GetGlossaryNotesForUser",
      { userId: uid }
    );
    const owned = (data.glossaryNotes ?? []).some((n) => n.id === noteId);
    if (!owned) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await adminDcMutate("UpdateGlossaryNote", {
      id: noteId,
      note: parsed.data.note,
      updatedAt: new Date().toISOString(),
    });
    await recordDailyActivitySafely(uid);
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

    // Verify ownership
    const data = await adminDcQuery<{ glossaryNotes: Array<{ id: string }> }>(
      "GetGlossaryNotesForUser",
      { userId: uid }
    );
    const owned = (data.glossaryNotes ?? []).some((n) => n.id === noteId);
    if (!owned) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await adminDcMutate("DeleteGlossaryNote", { id: noteId });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[api/glossary/notes/[noteId]:DELETE]", err);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
