import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { previewAssessmentCsv } from "@/lib/admin/csv";

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const csvText = String(body.csvText ?? "");
  if (!csvText.trim()) {
    return NextResponse.json({ error: "CSV content is required" }, { status: 400 });
  }

  try {
    return NextResponse.json(previewAssessmentCsv(csvText));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to parse CSV" },
      { status: 400 }
    );
  }
}
