import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcQuery } from "@/lib/firebase/admin-dc";

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  const data = await adminDcQuery<{ questions: any[] }>("AdminListQuestions").catch(() => ({
    questions: [],
  }));
  return NextResponse.json({ questions: data.questions });
}
