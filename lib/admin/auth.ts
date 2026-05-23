import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { adminRoles, type AdminRole } from "@/lib/validations/admin";

export interface AdminSession {
  uid: string;
  email: string;
  fullName?: string;
  role: AdminRole;
}

const ROLE_RANK: Record<AdminRole, number> = {
  viewer: 1,
  instructor: 2,
  admin: 3,
};

export function isAdminRole(role: unknown): role is AdminRole {
  return typeof role === "string" && (adminRoles as readonly string[]).includes(role);
}

function canAccess(role: AdminRole, minimum: AdminRole) {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export function isElevatedRole(role: unknown): role is AdminRole {
  return isAdminRole(role);
}

function resolveAdminRole(role: unknown): AdminRole | null {
  return isAdminRole(role) ? role : null;
}

async function decodeSessionCookieValue(sessionCookie: string) {
  return adminAuth.verifySessionCookie(sessionCookie, false);
}

export async function getSessionFromCookie(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await decodeSessionCookieValue(sessionCookie);
    const role = resolveAdminRole(decoded.role);
    if (!role) return null;
    return {
      uid: decoded.uid,
      email: decoded.email ?? "",
      fullName: decoded.name,
      role,
    };
  } catch (e) {
    return null;
  }
}

export async function requireAdminPage(minimumRole: AdminRole = "viewer") {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;
  if (!sessionCookie) redirect("/sign-in?redirect=/admin");

  let decoded: Awaited<ReturnType<typeof decodeSessionCookieValue>>;
  try {
    decoded = await decodeSessionCookieValue(sessionCookie);
  } catch (e) {
    redirect("/sign-in?redirect=/admin");
  }

  const role = resolveAdminRole(decoded.role);
  if (!role) redirect("/dashboard");

  const session: AdminSession = {
    uid: decoded.uid,
    email: decoded.email ?? "",
    fullName: decoded.name,
    role,
  };
  if (!canAccess(session.role, minimumRole)) redirect("/dashboard");
  return session;
}

export async function requireAdminRequest(request: Request, minimumRole: AdminRole = "viewer") {
  const authHeader = request.headers.get("Authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const sessionCookie = request.headers.get("Cookie")?.match(/(?:^|;\s*)__session=([^;]+)/)?.[1];

  const url = new URL(request.url);
  const queryToken = url.searchParams.get("token") || url.searchParams.get("idToken");
  const tokenToVerify = bearer || queryToken;

  try {
    const decoded = tokenToVerify
      ? await adminAuth.verifyIdToken(tokenToVerify)
      : sessionCookie
        ? await adminAuth.verifySessionCookie(decodeURIComponent(sessionCookie), false)
        : null;

    if (!decoded) throw new Error("Missing admin session");
    const role = resolveAdminRole(decoded.role);
    if (!role) {
      return { ok: false as const, response: Response.json({ error: "Forbidden" }, { status: 403 }) };
    }
    
    const session: AdminSession = {
      uid: decoded.uid,
      email: decoded.email ?? "",
      fullName: decoded.name,
      role,
    };
    if (!canAccess(session.role, minimumRole)) {
      return { ok: false as const, response: Response.json({ error: "Forbidden" }, { status: 403 }) };
    }
    await ensureDataConnectUser(session);
    return { ok: true as const, session };
  } catch (e) {
    return { ok: false as const, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
}

export async function ensureDataConnectUser(session: Pick<AdminSession, "uid" | "email" | "fullName">) {
  try {
    await adminDcMutate("CreateUser", {
      id: session.uid,
      email: session.email || `${session.uid}@impact26.local`,
      fullName: session.fullName ?? null,
    });
  } catch (e) {
    // Idempotent helper: duplicate inserts are expected after first login.
  }
}
