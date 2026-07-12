// Backend profile API: app/api/profile/route.ts
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { adminAuth } from "@/lib/firebase/admin";
import {
  getUserProfileSettings,
  normalizeProfileSettings,
  updateUserProfileSettings,
} from "@/lib/profile-settings";

const profileSettingsPatchSchema = z.object({
  defaultStudyGoal: z.string(),
  defaultSessionLength: z.number().finite(),
  remindersEnabled: z.boolean(),
  reminderAfterDays: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(7)]),
  browserNotificationsEnabled: z.boolean(),
  compactSidebar: z.boolean(),
  reducedMotion: z.boolean(),
  theme: z.enum(["light", "dark", "system"]),
  formulaHelperDefaultOpen: z.boolean(),
  calculatorPrecision: z.enum(["0", "1", "2", "3", "4"]),
}).partial();

async function requireProfileUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;
  if (!sessionCookie) return null;

  const decoded = await adminAuth.verifySessionCookie(sessionCookie, false);
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

    const body: unknown = await request.json().catch(() => ({}));
    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid profile update" }, { status: 400 });
    }

    let user = profile.user;
    if ("fullName" in body && typeof body.fullName === "string") {
      const fullName = body.fullName.trim().slice(0, 120);
      if (!fullName) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
      }
      user = await adminAuth.updateUser(profile.user.uid, { displayName: fullName });
    }

    let settings = (await getUserProfileSettings(profile.user.uid)).settings;
    if ("settings" in body && body.settings !== undefined) {
      const parsedSettings = profileSettingsPatchSchema.safeParse(body.settings);
      if (!parsedSettings.success) {
        return NextResponse.json({ error: "Invalid profile settings" }, { status: 400 });
      }
      settings = await updateUserProfileSettings(
        profile.user.uid,
        normalizeProfileSettings({ ...settings, ...parsedSettings.data }),
      );
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
