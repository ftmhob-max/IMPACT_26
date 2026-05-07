import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { getAdminFirestore } from "@/lib/firebase/admin-firestore";

export async function GET(request: NextRequest) {
  try {
    await verifyIdToken(request.headers.get("Authorization"));
    const db = getAdminFirestore();
    const snap = await db
      .collection("glossaryTerms")
      .where("isPublished", "==", true)
      .orderBy("term")
      .get();
    const terms = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ terms });
  } catch (err: any) {
    if (err.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[api/glossary:GET]", err);
    return NextResponse.json({ error: "Failed to load glossary" }, { status: 500 });
  }
}
