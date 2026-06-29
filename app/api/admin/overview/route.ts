import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { loadAdminOverview } from "@/lib/admin/overview";

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  try {
    return NextResponse.json(await loadAdminOverview());
  } catch (error) {
    console.error("[admin/overview]", error);
    return NextResponse.json({ error: "Unable to load admin overview" }, { status: 500 });
  }
}
