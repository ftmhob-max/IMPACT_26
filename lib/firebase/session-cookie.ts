// Back-end: shared __session cookie extraction and verification helpers.
import { adminAuth } from "@/lib/firebase/admin";

export function extractSessionCookieValue(cookieHeader: string | null | undefined): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)__session=([^;]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export async function verifySessionCookieValue(sessionCookie: string) {
  return adminAuth.verifySessionCookie(sessionCookie, false);
}
