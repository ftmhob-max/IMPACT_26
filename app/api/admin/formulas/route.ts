import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";

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
      examplesJson?: string | null;
      symbolsJson?: string | null;
      position: number;
    }>;
  }>;
};

export async function GET(req: NextRequest) {
  const auth = await requireAdminRequest(req);
  if (!auth.ok) return auth.response;

  try {
    const data = await adminDcQuery<FormulaSectionsData>("GetFormulaSections");
    return NextResponse.json(data.formulaSections.map((s) => ({
      id: s.id,
      code: s.code,
      title: s.title,
      position: s.position,
      formulas: s.formulas_on_section,
    })));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminRequest(req);
  if (!auth.ok) return auth.response;

  const body = await req.json();
  const { sectionId, code, name, expression, notes, position, calcMetaJson, examplesJson, symbolsJson } = body;

  if (!sectionId || !code || !name || !expression) {
    return NextResponse.json({ error: "sectionId, code, name, expression are required" }, { status: 400 });
  }

  try {
    const id = randomUUID();
    await adminDcMutate("CreateFormula", {
      sectionId,
      code: code.trim(),
      name: name.trim(),
      expression: expression.trim(),
      notes: notes?.trim() ?? null,
      position: typeof position === "number" ? position : 0,
      calcMetaJson: calcMetaJson ?? null,
      examplesJson: examplesJson ?? null,
      symbolsJson: symbolsJson ?? null,
    });
    return NextResponse.json({ id });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
