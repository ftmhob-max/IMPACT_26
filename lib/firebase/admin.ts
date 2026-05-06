function loadAdminAppModule() {
  return eval("require")("firebase-admin/app");
}

function loadAdminAuthModule() {
  return eval("require")("firebase-admin/auth");
}

function buildAdminApp() {
  const { getApps, getApp, initializeApp, cert, applicationDefault } = loadAdminAppModule();
  if (getApps().length > 0) return getApp();
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.GCLOUD_PROJECT;

  if (!projectId) {
    throw new Error("Firebase project ID is not set");
  }

  if (key) {
    const config = JSON.parse(key);
    if (config.private_key) config.private_key = config.private_key.replace(/\\n/g, "\n");
    return initializeApp({
      credential: cert(config),
      projectId,
    });
  }

  // In Firebase Hosting / Cloud Run, Application Default Credentials are
  // available automatically and should be preferred over shipping a JSON key.
  return initializeApp({
    credential: applicationDefault(),
    projectId,
  });
}

// Lazy proxy — defers initialization to first use, never throws at import time
export const adminApp = new Proxy({} as any, {
  get(_, key: string) {
    return (buildAdminApp() as any)[key];
  },
});

export const adminAuth = new Proxy({} as any, {
  get(_, key: string) {
    const { getAuth } = loadAdminAuthModule();
    return (getAuth(buildAdminApp()) as any)[key];
  },
});

export async function getAdminAccessToken(): Promise<string> {
  // @ts-ignore — internal Firebase Admin credential API
  const tok = await buildAdminApp().options.credential.getAccessToken();
  return tok.access_token;
}
