import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";

export async function POST(req: NextRequest) {
  const auth = await requireAdminRequest(req);
  if (!auth.ok) return auth.response;

  const body = await req.json();
  const { code, title, position } = body;

  if (!code || !title) {
    return NextResponse.json({ error: "code and title are required" }, { status: 400 });
  }

  try {
    const id = randomUUID();
    await adminDcMutate("CreateFormulaSection", {
      id,
      code: code.trim(),
      title: title.trim(),
      position: typeof position === "number" ? position : 0,
    });
    return NextResponse.json({ id });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
