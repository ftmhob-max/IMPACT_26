import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";

export async function POST(req: NextRequest) {
  const auth = await requireAdminRequest(req);
  if (!auth.ok) return auth.response;

  const body = await req.json();
  const { code, title, description, position } = body;

  if (!code?.trim() || !title?.trim()) {
    return NextResponse.json({ error: "code and title are required" }, { status: 400 });
  }

  // Auto-assign position = max(existing) + 1 when not explicitly provided.
  let resolvedPosition = typeof position === "number" ? position : null;
  if (resolvedPosition === null) {
    try {
      const data = await adminDcQuery<{ formulaSections: Array<{ position: number }> }>(
        "GetFormulaSections"
      );
      const maxPos = data.formulaSections.reduce((m, s) => Math.max(m, s.position ?? 0), 0);
      resolvedPosition = maxPos + 1;
    } catch {
      resolvedPosition = 0;
    }
  }

  try {
    const id = randomUUID();
    await adminDcMutate("CreateFormulaSection", {
      id,
      code: code.trim(),
      title: title.trim(),
      position: resolvedPosition,
    });
    return NextResponse.json({ id, position: resolvedPosition });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
