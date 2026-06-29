import { adminAuth } from "./admin";
import { extractSessionCookieValue, verifySessionCookieValue } from "./session-cookie";

export interface VerifiedToken {
  uid: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
}

export async function verifyIdToken(authHeader: string | null): Promise<VerifiedToken> {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized: missing or malformed auth token");
  }
  const token = authHeader.slice(7);
  return adminAuth.verifyIdToken(token);
}

export async function requireLearnerRequest(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const sessionCookie = extractSessionCookieValue(request.headers.get("Cookie"));

  try {
    const decoded = bearer
      ? await adminAuth.verifyIdToken(bearer)
      : sessionCookie
        ? await verifySessionCookieValue(sessionCookie)
        : null;

    if (!decoded) throw new Error("Unauthorized");

    return {
      ok: true as const,
      session: {
        uid: decoded.uid,
        email: decoded.email,
        fullName: decoded.name,
        role: (decoded.role as string) ?? "learner",
      },
    };
  } catch {
    return {
      ok: false as const,
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
}

export async function setUserRole(uid: string, role: string): Promise<void> {
  await adminAuth.setCustomUserClaims(uid, { role });
}
