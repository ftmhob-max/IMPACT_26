import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminRequest(req);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await req.json();
  const { code, title, position } = body;

  try {
    await adminDcMutate("UpdateFormulaSection", {
      id,
      code: code?.trim() ?? undefined,
      title: title?.trim() ?? undefined,
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
    await adminDcMutate("DeleteFormulasForSection", { sectionId: id });
    await adminDcMutate("DeleteFormulaSection", { id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
