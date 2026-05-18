import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
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
    formulas_on_section: Array<{ code: string }>;
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
  const existingFormulaKeys = new Set(
    existingData.formulaSections.flatMap((s) =>
      (s.formulas_on_section ?? []).map((f) => `${s.code}:${f.code}`)
    )
  );

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [...batch.errors];
  const importedSections: string[] = [];

  // Track created IDs for best-effort rollback if a section-level error occurs.
  const createdSectionIds: string[] = [];
  const createdFormulaIds: string[] = [];

  let fatalError: string | null = null;

  for (const section of batch.sections) {
    let sectionId = existingBySectionCode.get(section.code);
    let sectionCreated = false;

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
        sectionCreated = true;
      }

      for (const formula of section.formulas) {
        const dupeKey = `${section.code}:${formula.code}`;
        if (existingFormulaKeys.has(dupeKey)) {
          skipped++;
          continue;
        }
        try {
          const formulaId = randomUUID();
          await adminDcMutate("CreateFormula", {
            sectionId,
            code: formula.code,
            name: formula.name,
            expression: formula.expression,
            notes: formula.notes ?? null,
            position: formula.position,
            calcMetaJson: formula.calcMetaJson ?? null,
          });
          existingFormulaKeys.add(dupeKey);
          createdFormulaIds.push(formulaId);
          imported++;
        } catch (fErr) {
          errors.push(`Formula "${section.code}/${formula.code}": ${fErr}`);
        }
      }
      importedSections.push(section.code);
    } catch (sErr) {
      // Section-level failure: attempt rollback for everything created so far.
      fatalError = `Section "${section.code}" failed: ${sErr}`;
      errors.push(fatalError);

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
        skipped,
        errors,
        sections: [],
        rolledBack: true,
      }, { status: 422 });
    }
  }

  return NextResponse.json({ imported, skipped, errors, sections: importedSections, rolledBack: false });
}
