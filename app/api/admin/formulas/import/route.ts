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
  formulaSections: Array<{ id: string; code: string }>;
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

  // Fetch existing section codes to avoid duplicates
  const existingData = await adminDcQuery<ExistingSectionsData>("GetFormulaSections").catch(() => ({ formulaSections: [] as Array<{ id: string; code: string }> }));
  const existingBySectionCode = new Map(existingData.formulaSections.map((s) => [s.code, s.id]));

  let imported = 0;
  const errors: string[] = [...batch.errors];
  const importedSections: string[] = [];

  for (const section of batch.sections) {
    try {
      let sectionId = existingBySectionCode.get(section.code);
      if (!sectionId) {
        sectionId = randomUUID();
        await adminDcMutate("CreateFormulaSection", {
          id: sectionId,
          code: section.code,
          title: section.title,
          position: section.position,
        });
        existingBySectionCode.set(section.code, sectionId);
      }

      for (const formula of section.formulas) {
        try {
          await adminDcMutate("CreateFormula", {
            sectionId,
            code: formula.code,
            name: formula.name,
            expression: formula.expression,
            notes: formula.notes ?? null,
            position: formula.position,
            calcMetaJson: formula.calcMetaJson ?? null,
          });
          imported++;
        } catch (fErr) {
          errors.push(`Formula "${formula.code}": ${fErr}`);
        }
      }
      importedSections.push(section.code);
    } catch (sErr) {
      errors.push(`Section "${section.code}": ${sErr}`);
    }
  }

  return NextResponse.json({ imported, errors, sections: importedSections });
}
