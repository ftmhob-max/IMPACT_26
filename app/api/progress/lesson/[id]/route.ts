import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifyIdToken(request.headers.get("Authorization"));
    const userId = decoded.uid;
    const { id: lessonId } = await params;

    const data = await adminDcQuery<{
      userLessonProgresses: {
        status: string;
        videoPositionSeconds: number | null;
        completedAt: string | null;
      }[];
    }>("GetLessonProgress", { userId, lessonId }).catch(() => null);

    const record = data?.userLessonProgresses?.[0] ?? null;
    return NextResponse.json({
      status: record?.status ?? "not_started",
      videoPositionSeconds: record?.videoPositionSeconds ?? 0,
      completedAt: record?.completedAt ?? null,
    });
  } catch (err) {
    console.error("[api/progress/lesson:GET]", err);
    return NextResponse.json({ error: "Unable to fetch progress" }, { status: 500 });
  }
}

const bodySchema = z.object({
  status: z.enum(["not_started", "in_progress", "completed"]).optional(),
  videoPositionSeconds: z.coerce.number().int().nonnegative().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifyIdToken(request.headers.get("Authorization"));
    const userId = decoded.uid;
    const { id: lessonId } = await params;

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { status, videoPositionSeconds } = parsed.data;
    if (status === undefined && videoPositionSeconds === undefined) {
      return NextResponse.json({ error: "Provide at least status or videoPositionSeconds" }, { status: 400 });
    }

    await adminDcMutate("UpsertLessonProgress", {
      userId,
      lessonId,
      status: status ?? "in_progress",
      videoPositionSeconds: videoPositionSeconds ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/progress/lesson]", err);
    return NextResponse.json({ error: "Unable to update progress" }, { status: 500 });
  }
}
