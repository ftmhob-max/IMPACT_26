import { NextResponse } from "next/server";
import { getFormulaSections } from "@/lib/firebase/generated";
import { DEV_FORMULA_SECTIONS } from "@/lib/dev-content";
import { ensureDevDataSeeded } from "@/lib/dev-seed";
import { dedupeFormulaSections } from "@/lib/formula-sections";
import { getPlatformDataConnect } from "@/lib/firebase/dataconnect";

export async function GET() {
  try {
    const dc = getPlatformDataConnect();
    let { data } = await getFormulaSections(dc);
    if (data.formulaSections.length === 0) {
      await ensureDevDataSeeded().catch(() => null);
      ({ data } = await getFormulaSections(dc).catch(() => ({ data: { formulaSections: [] } })));
    }
    const sections = dedupeFormulaSections(data.formulaSections.map((s) => ({
      id: s.id,
      code: s.code,
      title: s.title,
      position: s.position,
      formulas: s.formulas_on_section.map((f) => {
        const formula = f as typeof f & { position?: number };
        return {
        id: f.id,
        code: f.code,
        name: f.name,
        expression: f.expression,
        notes: f.notes ?? null,
          position: formula.position ?? 0,
        };
      }),
    })));
    return NextResponse.json(sections.length > 0 ? sections : DEV_FORMULA_SECTIONS, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    return NextResponse.json(DEV_FORMULA_SECTIONS, { status: 200 });
  }
}
