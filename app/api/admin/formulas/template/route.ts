import { type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { CSV_TEMPLATE, DOCX_TEMPLATE } from "@/lib/admin/formula-import";

export async function GET(req: NextRequest) {
  const auth = await requireAdminRequest(req);
  if (!auth.ok) return auth.response;

  const format = new URL(req.url).searchParams.get("format") ?? "csv";

  if (format === "docx") {
    return new Response(DOCX_TEMPLATE, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": 'attachment; filename="formula-import-template.txt"',
      },
    });
  }

  return new Response(CSV_TEMPLATE, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="formula-import-template.csv"',
    },
  });
}
