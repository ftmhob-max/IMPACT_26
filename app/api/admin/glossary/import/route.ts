import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { getAdminFirestore, FieldValue } from "@/lib/firebase/admin-firestore";
import { z } from "zod";

const rowSchema = z.object({
  term: z.string().trim().min(1),
  definition: z.string().trim().min(1),
  fullDefinition: z.string().optional().nullable(),
  domain: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  example: z.string().optional().nullable(),
  relatedTerms: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  sourceDocument: z.string().optional().nullable(),
});

const importSchema = z.object({
  rows: z.array(rowSchema),
  resolutions: z.record(z.enum(["skip", "overwrite", "keep_both"])),
  // map of row index → existing Firestore doc ID (needed for overwrite)
  existingIds: z.record(z.string()).default({}),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = importSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { rows, resolutions, existingIds } = parsed.data;
  const db = getAdminFirestore();
  const now = FieldValue.serverTimestamp();

  let imported = 0;
  let updated = 0;
  let skipped = 0;

  // Firestore batch — max 500 ops; split into chunks if needed
  const BATCH_LIMIT = 400;
  let batch = db.batch();
  let opsInBatch = 0;

  async function commitIfNeeded() {
    if (opsInBatch >= BATCH_LIMIT) {
      await batch.commit();
      batch = db.batch();
      opsInBatch = 0;
    }
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const resolution = resolutions[String(i)];
    const existingId = existingIds[String(i)];

    if (resolution === "skip") {
      skipped++;
      continue;
    }

    const data = {
      term: row.term,
      definition: row.definition,
      fullDefinition: row.fullDefinition ?? null,
      domain: row.domain ?? null,
      category: row.category ?? null,
      example: row.example ?? null,
      relatedTerms: row.relatedTerms,
      isPublished: row.isPublished,
      sourceDocument: row.sourceDocument ?? null,
    };

    if (resolution === "overwrite" && existingId) {
      const ref = db.collection("glossaryTerms").doc(existingId);
      batch.update(ref, { ...data, updatedAt: now });
      updated++;
    } else {
      // "keep_both" or no resolution (brand-new term)
      const ref = db.collection("glossaryTerms").doc(randomUUID());
      batch.set(ref, { ...data, createdAt: now, updatedAt: now, createdBy: auth.session.uid });
      imported++;
    }

    opsInBatch++;
    await commitIfNeeded();
  }

  if (opsInBatch > 0) await batch.commit();

  return NextResponse.json({ imported, updated, skipped });
}
