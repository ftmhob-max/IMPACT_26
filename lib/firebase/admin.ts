import { getApps, initializeApp, cert, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function buildAdminApp() {
  if (getApps().length > 0) return getApp();
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!key) throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set");
  const config = JSON.parse(key);
  if (config.private_key) config.private_key = config.private_key.replace(/\\n/g, "\n");
  return initializeApp({
    credential: cert(config),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

// Lazy proxy — defers initialization to first use, never throws at import time
export const adminApp = new Proxy({} as ReturnType<typeof getApp>, {
  get(_, key: string) {
    return (buildAdminApp() as any)[key];
  },
});

export const adminAuth = new Proxy({} as ReturnType<typeof getAuth>, {
  get(_, key: string) {
    return (getAuth(buildAdminApp()) as any)[key];
  },
});

export async function getAdminAccessToken(): Promise<string> {
  // @ts-ignore — internal Firebase Admin credential API
  const tok = await buildAdminApp().options.credential.getAccessToken();
  return tok.access_token;
}
