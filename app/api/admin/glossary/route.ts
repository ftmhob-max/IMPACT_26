import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { getAdminFirestore, FieldValue } from "@/lib/firebase/admin-firestore";
import { z } from "zod";

const termSchema = z.object({
  term: z.string().trim().min(1),
  definition: z.string().trim().min(1),
  fullDefinition: z.string().trim().optional().nullable(),
  domain: z.string().trim().optional().nullable(),
  category: z.string().trim().optional().nullable(),
  example: z.string().trim().optional().nullable(),
  relatedTerms: z.array(z.string().trim().min(1)).default([]),
  isPublished: z.boolean().default(false),
  sourceDocument: z.string().trim().optional().nullable(),
});

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  try {
    const db = getAdminFirestore();
    const snap = await db.collection("glossaryTerms").orderBy("term").get();
    const terms = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ terms });
  } catch (err: any) {
    console.warn("[admin/glossary:GET] Failed to load glossary, database might not exist:", err.message);
    return NextResponse.json({ terms: [] });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = termSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const db = getAdminFirestore();
    const id = randomUUID();
    await db.collection("glossaryTerms").doc(id).set({
      ...parsed.data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: auth.session.uid,
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (err: any) {
    console.error("[admin/glossary:POST] Failed to create term:", err.message);
    return NextResponse.json({ error: "Failed to create term. Ensure Firestore is initialized." }, { status: 500 });
  }
}
