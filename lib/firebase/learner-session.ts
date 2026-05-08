import { cookies } from "next/headers";
import { adminAuth } from "./admin";

export interface LearnerSession {
  uid: string;
  email: string;
  fullName?: string;
  role: string;
}

export async function getLearnerSession(): Promise<LearnerSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;
  if (!sessionCookie) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return {
      uid: decoded.uid,
      email: decoded.email ?? "",
      fullName: decoded.name,
      role: (decoded.role as string) ?? "learner",
    };
  } catch {
    return null;
  }
}
