import { getAdminAccessToken } from "./admin";

const DC_SERVICE   = "impact26-dataconnect";
const DC_CONNECTOR = "impact26-connector";

function dcBaseUrl() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;

  // Use the local emulator in development so the connector reflects the
  // current local schema (avoids prod-vs-local drift errors like "UUID vs String").
  const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";

  if (useEmulator) {
    return `http://127.0.0.1:9400/v1beta/projects/${projectId}/locations/us-central1/services/${DC_SERVICE}/connectors/${DC_CONNECTOR}`;
  }
  return `https://firebasedataconnect.googleapis.com/v1beta/projects/${projectId}/locations/us-central1/services/${DC_SERVICE}/connectors/${DC_CONNECTOR}`;
}

async function adminHeaders(): Promise<Record<string, string>> {
  // The local emulator accepts any (or no) auth header; keep it consistent.
  const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";
  if (useEmulator) {
    return { "Content-Type": "application/json", "x-manualcurl": "true" };
  }
  const token = await getAdminAccessToken();
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function adminDcQuery<T = Record<string, unknown>>(
  operation: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(`${dcBaseUrl()}:executeQuery`, {
    method: "POST",
    headers: await adminHeaders(),
    body: JSON.stringify({ operationName: operation, variables }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.errors?.length) {
    const msg = json.errors?.map((e: any) => e.message).join("; ") || res.statusText || "Query failed";
    throw new Error(`[DC:Query:${operation}] ${msg}`);
  }
  if (!json.data) {
    throw new Error(`[DC:Query:${operation}] No data returned`);
  }
  return json.data as T;
}

export async function adminDcMutate<T = Record<string, unknown>>(
  operation: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(`${dcBaseUrl()}:executeMutation`, {
    method: "POST",
    headers: await adminHeaders(),
    body: JSON.stringify({ operationName: operation, variables }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.errors?.length) {
    const msg = json.errors?.map((e: any) => e.message).join("; ") || res.statusText || "Mutation failed";
    throw new Error(`[DC:Mutate:${operation}] ${msg}`);
  }
  if (!json.data) {
    throw new Error(`[DC:Mutate:${operation}] No data returned`);
  }
  return json.data as T;
}
