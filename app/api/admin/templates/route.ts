import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { CSV_TEMPLATE } from "@/lib/admin/csv";
import { GLOSSARY_CSV_TEMPLATE } from "@/lib/admin/csv-glossary";

const TEMPLATES = {
  assessment: {
    body: CSV_TEMPLATE,
    filename: "impact26-assessment-template.csv",
  },
  glossary: {
    body: GLOSSARY_CSV_TEMPLATE,
    filename: "glossary-import-template.csv",
  },
} as const;

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  const kind = request.nextUrl.searchParams.get("kind");
  const template = kind === "glossary" ? TEMPLATES.glossary : kind === "assessment" ? TEMPLATES.assessment : null;
  if (!template) {
    return NextResponse.json({ error: "Unknown template kind. Use ?kind=assessment or ?kind=glossary" }, { status: 400 });
  }

  return new NextResponse(template.body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${template.filename}"`,
    },
  });
}
