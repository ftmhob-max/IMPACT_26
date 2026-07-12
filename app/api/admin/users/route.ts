import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminAuth } from "@/lib/firebase/admin";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { roleUpdateSchema } from "@/lib/validations/admin";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().trim().email(),
  fullName: z.string().trim().min(1).optional(),
  role: z.enum(["learner", "viewer", "instructor", "admin"]).default("learner"),
});

const disableSchema = z.object({
  userId: z.string().min(1),
  disabled: z.boolean(),
});

async function loadAuthRecords(): Promise<Map<string, { disabled: boolean; lastSignInTime: string | null }>> {
  const map = new Map<string, { disabled: boolean; lastSignInTime: string | null }>();
  let pageToken: string | undefined;
  do {
    const page = await adminAuth.listUsers(1000, pageToken);
    for (const u of page.users) {
      map.set(u.uid, {
        disabled: u.disabled,
        lastSignInTime: u.metadata?.lastSignInTime ?? null,
      });
    }
    pageToken = page.pageToken;
  } while (pageToken);
  return map;
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;
  const data = await adminDcQuery<{ users: any[] }>("AdminListUsers").catch(() => ({ users: [] }));
  // Enrich with Firebase Auth state; degrade gracefully if the lookup fails
  const authRecords = await loadAuthRecords().catch(() => null);
  const users = data.users.map((u) => {
    const rec = authRecords?.get(u.id);
    return {
      ...u,
      disabled: rec?.disabled ?? false,
      lastSignInTime: rec?.lastSignInTime ?? null,
    };
  });
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "admin");
  if (!auth.ok) return auth.response;

  const parsed = inviteSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { email, fullName, role } = parsed.data;
  try {
    const userRecord = await adminAuth.createUser({
      email,
      displayName: fullName || undefined,
      emailVerified: false,
    });
    await adminAuth.setCustomUserClaims(userRecord.uid, { role });
    await adminDcMutate("CreateUser", {
      id: userRecord.uid,
      email,
      fullName: fullName ?? null,
    });
    if (role !== "learner") {
      await adminDcMutate("UpdateUserRole", { id: userRecord.uid, role });
    }
    // The admin shares this link manually — no email-sending infrastructure exists.
    const setupLink = await adminAuth.generatePasswordResetLink(email).catch(() => null);
    return NextResponse.json({ ok: true, userId: userRecord.uid, setupLink }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "auth/email-already-exists") {
      return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
    }
    console.error("[admin/users:invite]", error);
    return NextResponse.json({ error: "Unable to create user" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminRequest(request, "admin");
  if (!auth.ok) return auth.response;

  const parsed = disableSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { userId, disabled } = parsed.data;
  if (disabled && userId === auth.session.uid) {
    return NextResponse.json({ error: "You cannot disable your own account." }, { status: 400 });
  }

  try {
    await adminAuth.updateUser(userId, { disabled });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/users:disable]", error);
    return NextResponse.json({ error: "Unable to update user status" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdminRequest(request, "admin");
  if (!auth.ok) return auth.response;

  const parsed = roleUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await adminAuth.setCustomUserClaims(parsed.data.userId, { role: parsed.data.role });
    await adminDcMutate("UpdateUserRole", { id: parsed.data.userId, role: parsed.data.role });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/users]", error);
    return NextResponse.json({ error: "Unable to update user role" }, { status: 500 });
  }
}
