import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { z } from "zod";

const bodySchema = z.object({
  courseId: z.string().uuid(),
  publish: z.boolean(),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { courseId, publish } = parsed.data;
  try {
    await adminDcMutate("UpdateCourse", {
      id: courseId,
      status: publish ? "published" : "draft",
      isPublished: publish,
      updatedById: auth.session.uid,
      publishedAt: publish ? new Date().toISOString() : null,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/courses/publish]", err);
    return NextResponse.json({ error: "Unable to update course status" }, { status: 500 });
  }
}
