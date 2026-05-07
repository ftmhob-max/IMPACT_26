import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { formatUuid } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const quizId = searchParams.get("quizId");

  if (quizId) {
    let normalizedQuizId: string;
    try {
      normalizedQuizId = formatUuid(quizId);
    } catch {
      return NextResponse.json({ error: "Invalid quizId" }, { status: 400 });
    }
    const data = await adminDcQuery<{ quiz: any; quizQuestions: any[] }>(
      "GetQuizQuestionsAdmin",
      { quizId: normalizedQuizId }
    ).catch(() => ({ quiz: null, quizQuestions: [] }));
    return NextResponse.json({
      quiz: data.quiz ?? null,
      questions: (data.quizQuestions ?? []).map((qq: any) => ({
        ...qq.question,
        position: qq.position,
        pointValue: qq.pointValue,
      })),
    });
  }

  const data = await adminDcQuery<{ questions: any[] }>("AdminListQuestions").catch(() => ({
    questions: [],
  }));
  return NextResponse.json({ questions: data.questions });
}
