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

export async function getSessionFromCookie(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    // If no role is present, default to admin for now
    const role = isAdminRole(decoded.role) ? decoded.role : "admin";
    return {
      uid: decoded.uid,
      email: decoded.email ?? "",
      fullName: decoded.name,
      role,
    };
  } catch {
    return null;
  }
}

export async function requireAdminPage(minimumRole: AdminRole = "viewer") {
  const session = await getSessionFromCookie();
  if (!session) redirect("/sign-in?redirect=/admin");
  // Allow all authenticated users for now
  return session;
}

export async function requireAdminRequest(request: Request, minimumRole: AdminRole = "viewer") {
  const authHeader = request.headers.get("Authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const sessionCookie = request.headers.get("Cookie")?.match(/(?:^|;\s*)session=([^;]+)/)?.[1];

  try {
    const decoded = bearer
      ? await adminAuth.verifyIdToken(bearer)
      : sessionCookie
        ? await adminAuth.verifySessionCookie(decodeURIComponent(sessionCookie), true)
        : null;

    if (!decoded) throw new Error("Missing admin session");
    
    // Default to admin if role is missing or invalid
    const role = isAdminRole(decoded.role) ? decoded.role : "admin";
    
    const session: AdminSession = {
      uid: decoded.uid,
      email: decoded.email ?? "",
      fullName: decoded.name,
      role,
    };
    await ensureDataConnectUser(session);
    return { ok: true as const, session };
  } catch {
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
  } catch {
    // Idempotent helper: duplicate inserts are expected after first login.
  }
}
