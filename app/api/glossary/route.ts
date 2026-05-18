import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcQuery } from "@/lib/firebase/admin-dc";

export async function GET(request: NextRequest) {
  try {
    await verifyIdToken(request.headers.get("Authorization"));
    const data = await adminDcQuery<{ glossaryTerms: any[] }>("ListPublishedGlossaryTerms");
    const terms = (data.glossaryTerms ?? []).map((t) => ({
      ...t,
      relatedTerms: t.relatedTerms ? JSON.parse(t.relatedTerms) : [],
    }));
    return NextResponse.json({ terms });
  } catch (err: any) {
    if (err.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[api/glossary:GET]", err);
    return NextResponse.json({ error: "Failed to load glossary" }, { status: 500 });
  }
}
