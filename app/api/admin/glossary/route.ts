import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
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

function deserialiseTerms(terms: any[]): any[] {
  return terms.map((t) => ({
    ...t,
    relatedTerms: t.relatedTerms ? JSON.parse(t.relatedTerms) : [],
  }));
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  try {
    const data = await adminDcQuery<{ glossaryTerms: any[] }>("AdminListGlossaryTerms");
    return NextResponse.json({ terms: deserialiseTerms(data.glossaryTerms ?? []) });
  } catch (err: any) {
    console.error("[admin/glossary:GET]", err.message);
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

  const { relatedTerms, ...rest } = parsed.data;
  const id = randomUUID();
  const now = new Date().toISOString();

  try {
    await adminDcMutate("CreateGlossaryTerm", {
      id,
      ...rest,
      relatedTerms: JSON.stringify(relatedTerms),
      createdById: auth.session.uid,
      updatedAt: now,
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (err: any) {
    console.error("[admin/glossary:POST]", err.message);
    return NextResponse.json({ error: "Failed to create term." }, { status: 500 });
  }
}
