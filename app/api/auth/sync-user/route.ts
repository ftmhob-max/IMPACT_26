import { NextResponse, type NextRequest } from "next/server";
import { setUserRole } from "@/lib/firebase/auth-server";
import { adminDcMutate } from "@/lib/firebase/admin-dc";

interface DecodedIdTokenPayload {
  sub?: string;
  user_id?: string;
  email?: string;
  name?: string;
  role?: string;
}

function decodeIdTokenPayload(idToken: string): DecodedIdTokenPayload | null {
  const [, payload] = idToken.split(".");
  if (!payload) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as DecodedIdTokenPayload;
  } catch {
    return null;
  }
}

/**
 * Called client-side after sign-up or Google sign-in.
 * Creates the user record in Data Connect and sets the session cookie.
 */
export async function POST(request: NextRequest) {
  const logFailure = (stage: string, err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[auth/sync-user] ${stage} failed: ${message}`);
  };

  try {
    const body = await request.json().catch(() => ({}));
    const authHeader = request.headers.get("Authorization");
    const idToken = authHeader?.slice(7) ?? body.idToken;

    if (!idToken) {
      return NextResponse.json(
        { error: "No auth token was provided for session creation.", stage: "missing-token" },
        { status: 401 },
      );
    }

    const { adminAuth } = await import("@/lib/firebase/admin");
    const expiresIn = 60 * 60 * 24 * 7 * 1000;
    let sessionCookie: string;
    try {
      console.log(`[auth/sync-user] Attempting to create session cookie for token (length: ${idToken?.length})`);
      sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    } catch (err: any) {
      console.error("[auth/sync-user] create-session-cookie failed details:", {
        code: err?.code,
        message: err?.message,
        stack: err?.stack,
      });
      logFailure("create-session-cookie", err);
      return NextResponse.json(
        { 
          error: "We signed you in, but could not start your app session.", 
          stage: "create-session-cookie",
          code: err?.code,
          message: err?.message 
        },
        { status: 401 },
      );
    }

    const decoded = decodeIdTokenPayload(idToken);
    const uid = decoded?.user_id ?? decoded?.sub;
    if (!uid) {
      logFailure("decode-id-token", "Missing uid in token payload");
      return NextResponse.json(
        { error: "We could not read your account information from the sign-in token.", stage: "decode-id-token" },
        { status: 500 },
      );
    }

    let email = decoded?.email ?? null;
    let fullName = decoded?.name ?? body.fullName ?? null;
    let existing: string | undefined = decoded?.role;

    try {
      const user = await adminAuth.getUser(uid);
      email = user.email ?? email;
      fullName = user.displayName ?? fullName;
      existing = (user.customClaims?.role as string | undefined) ?? existing;
    } catch (err) {
      console.warn("[auth/sync-user] get-user lookup was skipped:", err instanceof Error ? err.message : String(err));
    }

    if (!existing) {
      try {
        await setUserRole(uid, "learner");
      } catch (err) {
        logFailure("set-user-role", err);
        console.warn("[auth/sync-user] role assignment was skipped:", err instanceof Error ? err.message : String(err));
      }
    }

    try {
      await adminDcMutate("CreateUser", {
        id: uid,
        email: email ?? `${uid}@impact26.local`,
        fullName,
      });
    } catch (err) {
      console.warn("[auth/sync-user] create-user mutation was skipped:", err instanceof Error ? err.message : String(err));
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn / 1000,
      path: "/",
    });

    return response;
  } catch (err) {
    logFailure("unexpected", err);
    return NextResponse.json(
      { error: "We could not complete sign-in right now.", stage: "unexpected" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("__session");
  return response;
}
