import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRequest(req);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await req.json();
  const { calculatorSettingsJson } = body;

  try {
    await adminDcMutate("UpdateQuizCalculatorSettings", {
      id,
      calculatorSettingsJson: calculatorSettingsJson ?? null,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
