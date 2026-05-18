import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcQuery, adminDcMutate } from "@/lib/firebase/admin-dc";
import {
  createLessonNote,
  getLessonNoteByLessonId,
  listLessonNotes,
  updateLessonNote,
} from "@/lib/lesson-notes";
import { z } from "zod";

const noteSchema = z.object({
  lessonId: z.string().uuid().optional(),
  lessonTitle: z.string().trim().optional(),
  content: z.string().trim().min(1),
});

type LessonNoteRow = {
  id: string;
  lessonId: string | null;
  lessonTitle: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
};

function shouldUseFirestoreFallback(err: unknown) {
  return err instanceof Error && /operation ".+" not found/.test(err.message);
}

export async function GET(request: NextRequest) {
  try {
    const { uid } = await verifyIdToken(request.headers.get("Authorization"));
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    let notes: LessonNoteRow[];

    try {
      const data = await adminDcQuery<{ lessonNotes: LessonNoteRow[] }>(
        "GetLessonNotesForUser",
        { userId: uid }
      );
      notes = data.lessonNotes ?? [];
    } catch (err) {
      if (!shouldUseFirestoreFallback(err)) throw err;
      notes = await listLessonNotes(uid);
    }

    if (lessonId) {
      const note = notes.find((n) => n.lessonId === lessonId) ?? null;
      return NextResponse.json({ note });
    }

    return NextResponse.json({ notes });
  } catch (err: any) {
    if (err.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[api/lessons/notes:GET]", err);
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

    const { lessonId, lessonTitle, content } = parsed.data;
    const now = new Date().toISOString();

    // Lesson-linked notes: one per user per lesson (upsert)
    if (lessonId) {
      let existingNote: { id: string } | null | undefined;
      let useFallback = false;
      try {
        const existing = await adminDcQuery<{ lessonNotes: Array<{ id: string }> }>(
          "GetLessonNoteForUserLesson",
          { userId: uid, lessonId }
        );
        existingNote = existing.lessonNotes?.[0];
      } catch (err) {
        if (!shouldUseFirestoreFallback(err)) throw err;
        useFallback = true;
        existingNote = await getLessonNoteByLessonId(uid, lessonId);
      }

      if (existingNote) {
        if (useFallback) {
          await updateLessonNote(uid, existingNote.id, { content, lessonTitle, updatedAt: now });
        } else {
          await adminDcMutate("UpdateLessonNote", {
            id: existingNote.id,
            lessonTitle: lessonTitle ?? null,
            content,
            updatedAt: now,
          });
        }
        return NextResponse.json({ id: existingNote.id, isNew: false });
      }

      if (useFallback) {
        const id = randomUUID();
        await createLessonNote(uid, {
          id,
          lessonId,
          lessonTitle: lessonTitle ?? null,
          content,
          updatedAt: now,
        });
        return NextResponse.json({ id, isNew: true }, { status: 201 });
      }
    }

    // New note (standalone or first lesson note)
    const id = randomUUID();
    try {
      await adminDcMutate("CreateLessonNote", {
        id,
        userId: uid,
        lessonId: lessonId ?? null,
        lessonTitle: lessonTitle ?? null,
        content,
        updatedAt: now,
      });
    } catch (err) {
      if (!shouldUseFirestoreFallback(err)) throw err;
      await createLessonNote(uid, {
        id,
        lessonId: lessonId ?? null,
        lessonTitle: lessonTitle ?? null,
        content,
        updatedAt: now,
      });
    }
    return NextResponse.json({ id, isNew: true }, { status: 201 });
  } catch (err: any) {
    if (err.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[api/lessons/notes:POST]", err);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
