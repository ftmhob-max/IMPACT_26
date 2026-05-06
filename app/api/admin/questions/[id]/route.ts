import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { z } from "zod";

const patchSchema = z.object({
  status: z.enum(["draft", "review", "published", "archived"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await adminDcMutate("UpdateQuestionStatus", { id, status: parsed.data.status });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/questions/[id]:PATCH]", err);
    return NextResponse.json({ error: "Unable to update question" }, { status: 500 });
  }
}
