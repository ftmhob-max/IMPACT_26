import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcQuery, adminDcMutate } from "@/lib/firebase/admin-dc";
import { z } from "zod";

const updateSchema = z.object({
  content: z.string().trim().min(1),
  lessonTitle: z.string().trim().optional(),
});

async function verifyOwnership(uid: string, noteId: string) {
  const data = await adminDcQuery<{ lessonNotes: Array<{ id: string }> }>(
    "GetLessonNotesForUser",
    { userId: uid }
  );
  return (data.lessonNotes ?? []).some((n) => n.id === noteId);
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

    if (!(await verifyOwnership(uid, noteId))) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await adminDcMutate("UpdateLessonNote", {
      id: noteId,
      lessonTitle: parsed.data.lessonTitle ?? null,
      content: parsed.data.content,
      updatedAt: new Date().toISOString(),
    });
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

    if (!(await verifyOwnership(uid, noteId))) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await adminDcMutate("DeleteLessonNote", { id: noteId });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[api/lessons/notes/[noteId]:DELETE]", err);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
