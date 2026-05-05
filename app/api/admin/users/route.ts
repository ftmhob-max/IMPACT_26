import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminAuth } from "@/lib/firebase/admin";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { roleUpdateSchema } from "@/lib/validations/admin";

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;
  const data = await adminDcQuery<{ users: any[] }>("AdminListUsers").catch(() => ({ users: [] }));
  return NextResponse.json({ users: data.users });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdminRequest(request, "admin");
  if (!auth.ok) return auth.response;

  const parsed = roleUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await adminAuth.setCustomUserClaims(parsed.data.userId, { role: parsed.data.role });
    await adminDcMutate("UpdateUserRole", { id: parsed.data.userId, role: parsed.data.role });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/users]", error);
    return NextResponse.json({ error: "Unable to update user role" }, { status: 500 });
  }
}
