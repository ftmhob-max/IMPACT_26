import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { listUserFavorites } from "@/lib/firebase/favorites";

export interface StudyRhythmData {
  /** Number of lessons the user has completed */
  lessonsCompleted: number;
  /** Number of completed quiz attempts */
  quizAttempts: number;
  /** Best quiz score 0-100, or null if no attempts */
  bestScore: number | null;
  /** Whether the user has ever passed an attempt */
  hasPassed: boolean;
  /** Number of saved formula favorites */
  formulaFavorites: number;
  /** Rough overall progress 0-100 */
  overallPct: number;
}

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyIdToken(request.headers.get("Authorization"));
    const userId = decoded.uid;

    const [progressData, attemptData, formulaFavorites] = await Promise.all([
      adminDcQuery<{ userLessonProgresses: { status: string }[] }>(
        "GetUserLessonProgressSummary",
        { userId }
      ).catch(() => null),
      adminDcQuery<{
        quizAttempts: { scorePct: number | null; passed: boolean | null }[];
      }>("GetUserAttemptHistory", { userId }).catch(() => null),
      listUserFavorites(userId, "formula").catch(() => [] as { itemId: string }[]),
    ]);

    const lessonsCompleted = (progressData?.userLessonProgresses ?? []).filter(
      (p) => p.status === "completed"
    ).length;

    const attempts = attemptData?.quizAttempts ?? [];
    const quizAttempts = attempts.length;
    const scoredAttempts = attempts.filter((a) => a.scorePct != null);
    const bestScore =
      scoredAttempts.length > 0
        ? Math.max(...scoredAttempts.map((a) => a.scorePct ?? 0))
        : null;
    const hasPassed = attempts.some((a) => a.passed === true);
    const formulaFavoritesCount = formulaFavorites.length;

    // Overall %: weight Learn (lessons, 40%) + Apply (formula favs, 20%) + Review (quiz score, 40%)
    const learnPct = Math.min(lessonsCompleted * 10, 100); // cap at 100 (10 lessons = full)
    const applyPct = Math.min(formulaFavoritesCount * 20, 100); // 5 saved = full
    const reviewPct = bestScore ?? 0;
    const overallPct = Math.round(learnPct * 0.4 + applyPct * 0.2 + reviewPct * 0.4);

    const payload: StudyRhythmData = {
      lessonsCompleted,
      quizAttempts,
      bestScore,
      hasPassed,
      formulaFavorites: formulaFavoritesCount,
      overallPct,
    };

    return NextResponse.json(payload);
  } catch (err) {
    console.error("[/api/study-rhythm]", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
