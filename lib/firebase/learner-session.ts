import { cookies } from "next/headers";
import { adminAuth } from "./admin";

export interface LearnerSession {
  uid: string;
  email: string;
  fullName?: string;
  photoURL?: string | null;
  role: string;
}

export async function getLearnerSession(): Promise<LearnerSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;
  if (!sessionCookie) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const user = await adminAuth.getUser(decoded.uid).catch(() => null);
    return {
      uid: decoded.uid,
      email: user?.email ?? decoded.email ?? "",
      fullName: user?.displayName ?? decoded.name,
      photoURL: user?.photoURL ?? (typeof decoded.picture === "string" ? decoded.picture : null),
      role: (decoded.role as string) ?? (user?.customClaims?.role as string | undefined) ?? "learner",
    };
  } catch {
    return null;
  }
}
