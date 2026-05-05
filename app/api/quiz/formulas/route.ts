import { NextResponse } from "next/server";
import { getFormulaSections } from "@/lib/firebase/generated";
import { getPlatformDataConnect } from "@/lib/firebase/dataconnect";

export async function GET() {
  try {
    const dc = getPlatformDataConnect();
    const { data } = await getFormulaSections(dc);
    const sections = data.formulaSections.map((s) => ({
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
    }));
    return NextResponse.json(sections, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
