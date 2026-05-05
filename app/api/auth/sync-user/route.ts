import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken, setUserRole } from "@/lib/firebase/auth-server";
import { adminDcMutate } from "@/lib/firebase/admin-dc";

/**
 * Called client-side after sign-up or Google sign-in.
 * Creates the user record in Data Connect and sets the session cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    // On initial call from signUp(), no token yet — get from cookie or body
    const body = await request.json().catch(() => ({}));
    const idToken = authHeader?.slice(7) ?? body.idToken;

    if (!idToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const { adminAuth } = await import("@/lib/firebase/admin");
    const decoded = await adminAuth.verifyIdToken(idToken);

    // User existence check is handled via Firebase Admin SDK custom claims below

    // For now: ensure custom claims are set
    const existing = decoded.role as string | undefined;
    if (!existing) {
      await setUserRole(decoded.uid, "admin");
    }

    try {
      await adminDcMutate("CreateUser", {
        id: decoded.uid,
        email: decoded.email ?? `${decoded.uid}@impact26.local`,
        fullName: decoded.name ?? body.fullName ?? null,
      });
    } catch {
      // User may already exist in Data Connect; login should stay idempotent.
    }

    // Set HttpOnly session cookie (7 day expiry)
    const expiresIn = 60 * 60 * 24 * 7 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ ok: true });
    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn / 1000,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("sync-user error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("session");
  return response;
}
