import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/auth-server";

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyIdToken(request.headers.get("Authorization"));
    const userId = decoded.uid;

    const { lessonId, status, videoPositionSeconds } = await request.json();
    if (!lessonId || !status) {
      return NextResponse.json({ error: "lessonId and status required" }, { status: 400 });
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
    const dcBaseUrl = buildDcBaseUrl(projectId);

    await adminFetch(dcBaseUrl, "UpsertLessonProgress", {
      userId,
      lessonId,
      status,
      videoPositionSeconds: videoPositionSeconds ?? 0,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/progress]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

function buildDcBaseUrl(projectId: string) {
  return `https://firebasedataconnect.googleapis.com/v1beta/projects/${projectId}/locations/us-central1/services/impact26-dataconnect/connectors/impact26-connector`;
}

async function adminFetch(baseUrl: string, operationName: string, variables: object) {
  const { adminAuth } = await import("@/lib/firebase/admin");
  const token = await adminAuth.createCustomToken("server");
  return fetch(`${baseUrl}:executeMutation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ operationName, variables }),
  });
}
