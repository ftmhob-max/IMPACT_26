import { adminAuth } from "./admin";

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

export async function getUserRole(uid: string): Promise<string> {
  const user = await adminAuth.getUser(uid);
  return (user.customClaims?.role as string) ?? "learner";
}

export async function setUserRole(uid: string, role: string): Promise<void> {
  await adminAuth.setCustomUserClaims(uid, { role });
}
