import { adminAuth } from "./admin";
import type { DecodedIdToken } from "firebase-admin/auth";

export async function verifyIdToken(authHeader: string | null): Promise<DecodedIdToken> {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized: missing or malformed auth token");
  }
  const token = authHeader.slice(7);
  return adminAuth.verifyIdToken(token);
}

export async function getUserRole(uid: string): Promise<string> {
  const user = await adminAuth.getUser(uid);
  return (user.customClaims?.role as string) ?? "learner";
}

export async function setUserRole(uid: string, role: string): Promise<void> {
  await adminAuth.setCustomUserClaims(uid, { role });
}
