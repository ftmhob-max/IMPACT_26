import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
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
  // map of row index → existing SQL glossaryTerm ID (needed for overwrite)
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
  const now = new Date().toISOString();

  try {
    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const resolution = resolutions[String(i)];
      const existingId = existingIds[String(i)];

      if (resolution === "skip") {
        skipped++;
        continue;
      }

      const shared = {
        term: row.term,
        definition: row.definition,
        fullDefinition: row.fullDefinition ?? null,
        domain: row.domain ?? null,
        category: row.category ?? null,
        example: row.example ?? null,
        relatedTerms: JSON.stringify(row.relatedTerms),
        isPublished: row.isPublished,
        sourceDocument: row.sourceDocument ?? null,
        updatedAt: now,
      };

      if (resolution === "overwrite" && existingId) {
        await adminDcMutate("UpdateGlossaryTerm", { id: existingId, ...shared });
        updated++;
      } else {
        // "keep_both" or brand-new term
        await adminDcMutate("CreateGlossaryTerm", {
          id: randomUUID(),
          ...shared,
          createdById: auth.session.uid,
        });
        imported++;
      }
    }

    return NextResponse.json({ imported, updated, skipped });
  } catch (err: any) {
    console.error("[admin/glossary/import:POST]", err.message);
    return NextResponse.json({ error: `Import failed: ${err.message}` }, { status: 500 });
  }
}
