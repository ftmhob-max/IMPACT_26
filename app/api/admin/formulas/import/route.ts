import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery, adminDcRawMutate } from "@/lib/firebase/admin-dc";
import {
  parseFormulaCsv,
  parseFormulaDocx,
  parseFormulaTextBlocks,
  formulaRowsToImportBatch,
  type ParsedFormulaRow,
} from "@/lib/admin/formula-import";

export const maxDuration = 60;

type ExistingSectionsData = {
  formulaSections: Array<{
    id: string;
    code: string;
    formulas_on_section: Array<{ id: string; code: string; notes?: string | null; examplesJson?: string | null }>;
  }>;
};

export async function POST(req: NextRequest) {
  const auth = await requireAdminRequest(req);
  if (!auth.ok) return auth.response;

  const formData = await req.formData();
  const file = formData.get("file");
  const preview = formData.get("preview") === "true";

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const fileName = (file as File).name.toLowerCase();
  const buffer = Buffer.from(await (file as File).arrayBuffer());
  let rows: ParsedFormulaRow[] = [];

  try {
    if (fileName.endsWith(".csv")) {
      rows = parseFormulaCsv(buffer.toString("utf-8"));
    } else if (fileName.endsWith(".docx")) {
      rows = await parseFormulaDocx(buffer);
    } else if (fileName.endsWith(".txt")) {
      rows = parseFormulaTextBlocks(buffer.toString("utf-8"));
    } else {
      return NextResponse.json({ error: "Unsupported file type. Use .csv, .docx, or .txt" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: `Parse error: ${err}` }, { status: 422 });
  }

  const batch = formulaRowsToImportBatch(rows);

  if (preview) {
    return NextResponse.json({ preview: true, batch });
  }

  // Fetch existing sections + their formula codes to detect duplicates via
  // a composite (sectionCode:formulaCode) key — prevents cross-section collisions.
  const existingData = await adminDcQuery<ExistingSectionsData>("GetFormulaSections").catch(
    () => ({ formulaSections: [] as ExistingSectionsData["formulaSections"] })
  );
  const existingBySectionCode = new Map(existingData.formulaSections.map((s) => [s.code, s.id]));
  // Map composite key → existing formula id (for upsert of examplesJson)
  const existingFormulaIdByKey = new Map(
    existingData.formulaSections.flatMap((s) =>
      (s.formulas_on_section ?? []).map((f) => [`${s.code}:${f.code}`, f.id])
    )
  );
  // Track which existing formulas already have examples or notes (skip re-importing if present)
  const existingFormulaHasExamples = new Set(
    existingData.formulaSections.flatMap((s) =>
      (s.formulas_on_section ?? [])
        .filter((f) => f.examplesJson)
        .map((f) => `${s.code}:${f.code}`)
    )
  );
  const existingFormulaHasNotes = new Set(
    existingData.formulaSections.flatMap((s) =>
      (s.formulas_on_section ?? [])
        .filter((f) => f.notes)
        .map((f) => `${s.code}:${f.code}`)
    )
  );

  let imported = 0;
  let skipped = 0;
  let updated = 0;
  const errors: string[] = [...batch.errors];
  const importedSections: string[] = [];

  // Track created IDs for best-effort rollback if a section-level error occurs.
  const createdSectionIds: string[] = [];
  const createdFormulaIds: string[] = [];

  for (const section of batch.sections) {
    let sectionId = existingBySectionCode.get(section.code);

    try {
      if (!sectionId) {
        sectionId = randomUUID();
        await adminDcMutate("CreateFormulaSection", {
          id: sectionId,
          code: section.code,
          title: section.title,
          position: section.position,
        });
        existingBySectionCode.set(section.code, sectionId);
        createdSectionIds.push(sectionId);
      }

      for (const formula of section.formulas) {
        const dupeKey = `${section.code}:${formula.code}`;
        const existingId = existingFormulaIdByKey.get(dupeKey);

        if (existingId) {
          // Formula already exists — backfill examplesJson and/or notes if missing.
          const needsExamples = formula.examplesJson && !existingFormulaHasExamples.has(dupeKey);
          const needsNotes = formula.notes && !existingFormulaHasNotes.has(dupeKey);
          if (needsExamples || needsNotes) {
            try {
              // Use raw GQL so examplesJson works regardless of emulator compilation state.
              await adminDcRawMutate(
                `mutation ($id: UUID!, $examplesJson: String, $notes: String) {
                   formula_update(id: $id, data: { examplesJson: $examplesJson, notes: $notes })
                 }`,
                {
                  id: existingId,
                  examplesJson: needsExamples ? formula.examplesJson : null,
                  notes: needsNotes ? formula.notes : null,
                }
              );
              if (needsExamples) existingFormulaHasExamples.add(dupeKey);
              if (needsNotes) existingFormulaHasNotes.add(dupeKey);
              updated++;
            } catch (fErr) {
              errors.push(`Formula "${section.code}/${formula.code}" (update): ${fErr}`);
            }
          } else {
            skipped++;
          }
          continue;
        }

        try {
          const formulaId = randomUUID();
          // Use raw GQL for insert so examplesJson works regardless of emulator state.
          await adminDcRawMutate(
            `mutation ($sectionId: UUID!, $id: UUID!, $code: String!, $name: String!, $expression: String!, $notes: String, $position: Int!, $calcMetaJson: String, $examplesJson: String) {
               formula_insert(data: {
                 id: $id
                 section: { id: $sectionId }
                 code: $code
                 name: $name
                 expression: $expression
                 notes: $notes
                 position: $position
                 calcMetaJson: $calcMetaJson
                 examplesJson: $examplesJson
               })
             }`,
            {
              sectionId,
              id: formulaId,
              code: formula.code,
              name: formula.name,
              expression: formula.expression,
              notes: formula.notes ?? null,
              position: formula.position,
              calcMetaJson: formula.calcMetaJson ?? null,
              examplesJson: formula.examplesJson ?? null,
            }
          );
          existingFormulaIdByKey.set(dupeKey, formulaId);
          createdFormulaIds.push(formulaId);
          imported++;
        } catch (fErr) {
          errors.push(`Formula "${section.code}/${formula.code}": ${fErr}`);
        }
      }
      importedSections.push(section.code);
    } catch (sErr) {
      // Section-level failure: attempt rollback for everything created so far.
      errors.push(`Section "${section.code}" failed: ${sErr}`);

      // Best-effort rollback: delete everything we just created.
      for (const fid of createdFormulaIds) {
        await adminDcMutate("DeleteFormula", { id: fid }).catch(() => null);
      }
      for (const sid of createdSectionIds) {
        await adminDcMutate("DeleteFormulasForSection", { sectionId: sid }).catch(() => null);
        await adminDcMutate("DeleteFormulaSection", { id: sid }).catch(() => null);
      }
      // Return early so the partial batch is not left in an inconsistent state.
      return NextResponse.json({
        imported: 0,
        updated: 0,
        skipped,
        errors,
        sections: [],
        rolledBack: true,
      }, { status: 422 });
    }
  }

  return NextResponse.json({ imported, updated, skipped, errors, sections: importedSections, rolledBack: false });
}
