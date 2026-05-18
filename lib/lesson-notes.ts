import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { FieldValue, getAdminFirestore } from "@/lib/firebase/admin-firestore";

export type LessonNoteRecord = {
  id: string;
  lessonId: string | null;
  lessonTitle: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type LessonNoteInput = {
  id: string;
  lessonId?: string | null;
  lessonTitle?: string | null;
  content: string;
  updatedAt: string;
};

const ROOT_COLLECTION = "userLessonNotes";
const NOTES_COLLECTION = "notes";
const LOCAL_STORE_PATH = path.join(process.cwd(), ".next", "cache", "lesson-notes.json");
type LocalStore = Record<string, Record<string, LessonNoteRecord>>;

function notesCollection(uid: string) {
  return getAdminFirestore().collection(ROOT_COLLECTION).doc(uid).collection(NOTES_COLLECTION);
}

function noteFromDoc(doc: any): LessonNoteRecord {
  const data = doc.data() ?? {};
  return {
    id: doc.id,
    lessonId: typeof data.lessonId === "string" ? data.lessonId : null,
    lessonTitle: typeof data.lessonTitle === "string" ? data.lessonTitle : null,
    content: typeof data.content === "string" ? data.content : "",
    createdAt: typeof data.createdAt === "string" ? data.createdAt : new Date(0).toISOString(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : new Date(0).toISOString(),
  };
}

function warnFirestoreFallback(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[lesson-notes] Firestore unavailable; using local note store (${message})`);
}

async function readLocalStore(): Promise<LocalStore> {
  try {
    return JSON.parse(await readFile(LOCAL_STORE_PATH, "utf8")) as LocalStore;
  } catch {
    return {};
  }
}

async function writeLocalStore(store: LocalStore) {
  await mkdir(path.dirname(LOCAL_STORE_PATH), { recursive: true });
  await writeFile(LOCAL_STORE_PATH, JSON.stringify(store, null, 2));
}

export async function listLessonNotes(uid: string): Promise<LessonNoteRecord[]> {
  try {
    const snapshot = await notesCollection(uid).orderBy("updatedAt", "desc").get();
    return snapshot.docs.map(noteFromDoc);
  } catch (error) {
    warnFirestoreFallback(error);
    const store = await readLocalStore();
    return Object.values(store[uid] ?? {}).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}

export async function getLessonNoteByLessonId(
  uid: string,
  lessonId: string
): Promise<LessonNoteRecord | null> {
  try {
    const snapshot = await notesCollection(uid).where("lessonId", "==", lessonId).limit(1).get();
    const doc = snapshot.docs[0];
    return doc ? noteFromDoc(doc) : null;
  } catch (error) {
    warnFirestoreFallback(error);
    const store = await readLocalStore();
    return Object.values(store[uid] ?? {}).find((note) => note.lessonId === lessonId) ?? null;
  }
}

export async function createLessonNote(uid: string, note: LessonNoteInput) {
  const record = {
    lessonId: note.lessonId ?? null,
    lessonTitle: note.lessonTitle ?? null,
    content: note.content,
    createdAt: note.updatedAt,
    updatedAt: note.updatedAt,
  };

  try {
    await notesCollection(uid).doc(note.id).set(record);
  } catch (error) {
    warnFirestoreFallback(error);
    const store = await readLocalStore();
    store[uid] ??= {};
    store[uid][note.id] = { id: note.id, ...record };
    await writeLocalStore(store);
  }
}

export async function updateLessonNote(
  uid: string,
  noteId: string,
  updates: { content: string; lessonTitle?: string | null; updatedAt: string }
): Promise<boolean> {
  try {
    const ref = notesCollection(uid).doc(noteId);
    const snapshot = await ref.get();
    if (!snapshot.exists) return false;

    await ref.set(
      {
        content: updates.content,
        ...(updates.lessonTitle !== undefined ? { lessonTitle: updates.lessonTitle } : {}),
        updatedAt: updates.updatedAt,
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    warnFirestoreFallback(error);
    const store = await readLocalStore();
    const note = store[uid]?.[noteId];
    if (!note) return false;
    store[uid][noteId] = {
      ...note,
      content: updates.content,
      lessonTitle: updates.lessonTitle !== undefined ? updates.lessonTitle : note.lessonTitle,
      updatedAt: updates.updatedAt,
    };
    await writeLocalStore(store);
    return true;
  }
}

export async function deleteLessonNote(uid: string, noteId: string): Promise<boolean> {
  try {
    const ref = notesCollection(uid).doc(noteId);
    const snapshot = await ref.get();
    if (!snapshot.exists) return false;

    await ref.delete();
    await getAdminFirestore().collection(ROOT_COLLECTION).doc(uid).set(
      { updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );
    return true;
  } catch (error) {
    warnFirestoreFallback(error);
    const store = await readLocalStore();
    if (!store[uid]?.[noteId]) return false;
    delete store[uid][noteId];
    await writeLocalStore(store);
    return true;
  }
}
