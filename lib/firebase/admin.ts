function loadAdminAppModule() {
  return eval("require")("firebase-admin/app");
}

function loadAdminAuthModule() {
  return eval("require")("firebase-admin/auth");
}

let cachedAdminApp: any = null;

function buildAdminApp() {
  if (cachedAdminApp) return cachedAdminApp;

  const { getApps, getApp, initializeApp, cert, applicationDefault } = loadAdminAppModule();
  const existingApps = getApps();
  if (existingApps.length > 0) {
    cachedAdminApp = existingApps[0] ?? getApp();
    return cachedAdminApp;
  }

  const key = process.env.SERVICE_ACCOUNT_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.GCLOUD_PROJECT;

  if (!projectId) {
    throw new Error("Firebase project ID is not set");
  }

  if (key) {
    const config = JSON.parse(key);
    if (config.private_key) config.private_key = config.private_key.replace(/\\n/g, "\n");
    cachedAdminApp = initializeApp({
      credential: cert(config),
      projectId,
    });
    return cachedAdminApp;
  }

  // In Firebase Hosting / Cloud Run, Application Default Credentials are
  // available automatically and should be preferred over shipping a JSON key.
  cachedAdminApp = initializeApp({
    credential: applicationDefault(),
    projectId,
  });
  return cachedAdminApp;
}

export function getAdminApp() {
  return buildAdminApp();
}

// Lazy proxy — defers initialization to first use, never throws at import time
export const adminApp = new Proxy({} as any, {
  get(_, key: string) {
    const app = buildAdminApp();
    const val = (app as any)[key];
    return typeof val === "function" ? val.bind(app) : val;
  },
});

export const adminAuth = new Proxy({} as any, {
  get(_, key: string) {
    const { getAuth } = loadAdminAuthModule();
    const authInstance = getAuth(buildAdminApp());
    const val = (authInstance as any)[key];
    return typeof val === "function" ? val.bind(authInstance) : val;
  },
});

export async function getAdminAccessToken(): Promise<string> {
  // @ts-ignore — internal Firebase Admin credential API
  const tok = await buildAdminApp().options.credential.getAccessToken();
  return tok.access_token;
}
