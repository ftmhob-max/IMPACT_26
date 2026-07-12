import { NextResponse } from "next/server";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { DEV_FORMULA_SECTIONS } from "@/lib/dev-content";
import { ensureDevDataSeeded } from "@/lib/dev-seed";
import { dedupeFormulaSections } from "@/lib/utils";

const isDevEnvironment = process.env.NODE_ENV === "development";

type FormulaSectionsData = {
  formulaSections: Array<{
    id: string;
    code: string;
    title: string;
    position: number;
    formulas_on_section: Array<{
      id: string;
      code: string;
      name: string;
      expression: string;
      notes?: string | null;
      calcMetaJson?: string | null;
      position?: number;
    }>;
  }>;
};

function mapFormulaSections(data: FormulaSectionsData) {
  return dedupeFormulaSections(
    data.formulaSections.map((section) => ({
      id: section.id,
      code: section.code,
      title: section.title,
      position: section.position,
      formulas: section.formulas_on_section.map((formula) => ({
        id: formula.id,
        code: formula.code,
        name: formula.name,
        expression: formula.expression,
        notes: formula.notes ?? null,
        position: formula.position ?? 0,
        calcMetaJson: formula.calcMetaJson ?? null,
      })),
    })),
  );
}

export async function GET() {
  try {
    let data = await adminDcQuery<FormulaSectionsData>("GetFormulaSections");
    if (data.formulaSections.length === 0 && isDevEnvironment) {
      await ensureDevDataSeeded().catch(() => null);
      data = await adminDcQuery<FormulaSectionsData>("GetFormulaSections").catch(() => ({ formulaSections: [] }));
      if (data.formulaSections.length === 0) {
        return NextResponse.json(DEV_FORMULA_SECTIONS, {
          headers: { "Cache-Control": "public, max-age=3600" },
        });
      }
    }
    return NextResponse.json(mapFormulaSections(data), {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    if (isDevEnvironment) {
      return NextResponse.json(DEV_FORMULA_SECTIONS, { status: 200 });
    }
    return NextResponse.json([], { status: 200 });
  }
}
