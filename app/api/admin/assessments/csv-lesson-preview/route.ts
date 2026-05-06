import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { parseLessonCsv } from "@/lib/admin/csv-lesson";
import { z } from "zod";

const bodySchema = z.object({ csvText: z.string().min(1) });

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "csvText is required" }, { status: 400 });
  }

  const result = parseLessonCsv(parsed.data.csvText);
  return NextResponse.json(result);
}
