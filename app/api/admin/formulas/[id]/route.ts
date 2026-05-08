import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminRequest(req);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await req.json();
  const { code, name, expression, notes, calcMetaJson, position } = body;

  try {
    await adminDcMutate("UpdateFormula", {
      id,
      code: code?.trim() ?? undefined,
      name: name?.trim() ?? undefined,
      expression: expression?.trim() ?? undefined,
      notes: notes != null ? notes.trim() : undefined,
      calcMetaJson: calcMetaJson !== undefined ? (calcMetaJson ?? null) : undefined,
      position: typeof position === "number" ? position : undefined,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminRequest(req);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    await adminDcMutate("DeleteFormula", { id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
