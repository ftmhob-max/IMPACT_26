import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { parseDocxQuestions } from "@/lib/admin/docx-question-parser";

export const maxDuration = 60; // parsing a large DOCX can take a moment

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  let buffer: Buffer;
  let fileName: string;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    fileName = (file as File).name;
    const bytes = await (file as File).arrayBuffer();
    buffer = Buffer.from(bytes);
  } catch {
    return NextResponse.json({ error: "Failed to read uploaded file" }, { status: 400 });
  }

  const lower = fileName.toLowerCase();
  if (!lower.endsWith(".docx")) {
    return NextResponse.json(
      {
        error:
          "Please upload a DOCX file. PDF parsing is not supported for question extraction — use the DOCX source file.",
      },
      { status: 400 }
    );
  }

  try {
    const result = await parseDocxQuestions(buffer);

    const questionCount = result.allQuestions.length;
    const formulaCount = result.sections.reduce((sum, s) => sum + s.formulas.length, 0);

    return NextResponse.json({
      sections: result.sections,
      questionCount,
      sectionCount: result.sections.length,
      formulaCount,
    });
  } catch (err) {
    console.error("[parse-docx]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to parse DOCX. Ensure it follows the expected question-bank format.",
      },
      { status: 500 }
    );
  }
}
