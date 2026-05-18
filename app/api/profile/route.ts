import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import {
  getUserProfileSettings,
  normalizeProfileSettings,
  updateUserProfileSettings,
} from "@/lib/profile-settings";

async function requireProfileUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;
  if (!sessionCookie) return null;

  const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
  const user = await adminAuth.getUser(decoded.uid);
  return { decoded, user };
}

function serializeUser(user: Awaited<ReturnType<typeof adminAuth.getUser>>, role: string | undefined) {
  return {
    uid: user.uid,
    email: user.email ?? "",
    fullName: user.displayName ?? "",
    role: role ?? (user.customClaims?.role as string | undefined) ?? "learner",
    photoURL: user.photoURL ?? null,
    emailVerified: user.emailVerified,
    providerIds: user.providerData.map((provider: { providerId: string }) => provider.providerId),
    createdAt: user.metadata.creationTime,
    lastSignInAt: user.metadata.lastSignInTime,
  };
}

export async function GET() {
  try {
    const profile = await requireProfileUser();
    if (!profile) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { settings } = await getUserProfileSettings(profile.user.uid);
    return NextResponse.json({
      user: serializeUser(profile.user, profile.decoded.role as string | undefined),
      settings,
    });
  } catch (error) {
    console.error("[profile:get]", error);
    return NextResponse.json({ error: "Unable to load profile" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const profile = await requireProfileUser();
    if (!profile) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    let user = profile.user;
    if (typeof body.fullName === "string") {
      const fullName = body.fullName.trim().slice(0, 120);
      if (!fullName) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
      }
      user = await adminAuth.updateUser(profile.user.uid, { displayName: fullName });
    }

    let settings = (await getUserProfileSettings(profile.user.uid)).settings;
    if (body.settings && typeof body.settings === "object") {
      settings = await updateUserProfileSettings(profile.user.uid, normalizeProfileSettings(body.settings));
    }

    return NextResponse.json({
      user: serializeUser(user, profile.decoded.role as string | undefined),
      settings,
    });
  } catch (error) {
    console.error("[profile:patch]", error);
    return NextResponse.json({ error: "Unable to save profile" }, { status: 500 });
  }
}
