import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { previewAssessmentCsv } from "@/lib/admin/csv";
import { loadExistingQuestionMap } from "@/lib/admin/question-dedup";

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => ({}));
  const csvText = String(body.csvText ?? "");
  if (!csvText.trim()) {
    return NextResponse.json({ error: "CSV content is required" }, { status: 400 });
  }

  try {
    const questionMap = await loadExistingQuestionMap().catch(() => new Map<string, string>());
    return NextResponse.json(previewAssessmentCsv(csvText, questionMap));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to parse CSV" },
      { status: 400 }
    );
  }
}
