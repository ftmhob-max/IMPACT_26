import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcQuery, adminDcMutate } from "@/lib/firebase/admin-dc";
import {
  deleteLessonNote,
  listLessonNotes,
  updateLessonNote,
} from "@/lib/lesson-notes";
import { z } from "zod";

const updateSchema = z.object({
  content: z.string().trim().min(1),
  lessonTitle: z.string().trim().optional(),
});

function shouldUseFirestoreFallback(err: unknown) {
  return err instanceof Error && /operation ".+" not found/.test(err.message);
}

async function verifyOwnership(
  uid: string,
  noteId: string
): Promise<"dataconnect" | "firestore" | null> {
  try {
    const data = await adminDcQuery<{ lessonNotes: Array<{ id: string }> }>(
      "GetLessonNotesForUser",
      { userId: uid }
    );
    return (data.lessonNotes ?? []).some((n) => n.id === noteId) ? "dataconnect" : null;
  } catch (err) {
    if (!shouldUseFirestoreFallback(err)) throw err;
    const notes = await listLessonNotes(uid);
    return notes.some((n) => n.id === noteId) ? "firestore" : null;
  }
}

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

    const ownerSource = await verifyOwnership(uid, noteId);
    if (!ownerSource) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updatedAt = new Date().toISOString();
    if (ownerSource === "firestore") {
      await updateLessonNote(uid, noteId, {
        lessonTitle: parsed.data.lessonTitle ?? null,
        content: parsed.data.content,
        updatedAt,
      });
    } else {
      await adminDcMutate("UpdateLessonNote", {
        id: noteId,
        lessonTitle: parsed.data.lessonTitle ?? null,
        content: parsed.data.content,
        updatedAt,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[api/lessons/notes/[noteId]:PUT]", err);
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

    const ownerSource = await verifyOwnership(uid, noteId);
    if (!ownerSource) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (ownerSource === "firestore") {
      await deleteLessonNote(uid, noteId);
    } else {
      await adminDcMutate("DeleteLessonNote", { id: noteId });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[api/lessons/notes/[noteId]:DELETE]", err);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
