import { getAdminApp } from "./admin";
import {
  getDataConnectEmulatorEndpoint,
  getDataConnectEmulatorHost,
  getDataConnectEmulatorPort,
  shouldUseDataConnectEmulator,
} from "./emulator-config";

const DC_SERVICE = "impact26-dataconnect";
const DC_CONNECTOR = "impact26-connector";
const DC_LOCATION = "us-central1";
const DEFAULT_PROJECT_ID = "impact26-aa59b";

function getAdminAppForDataConnect() {
  if (!shouldUseDataConnectEmulator()) return getAdminApp();

  const { getApp, initializeApp } = eval("require")("firebase-admin/app");
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.GCLOUD_PROJECT ?? DEFAULT_PROJECT_ID;
  const emulatorAppName = "__dataconnect_emulator__";

  if (!projectId) {
    throw new Error("Firebase project ID is not set");
  }

  try {
    return getApp(emulatorAppName);
  } catch {
    return initializeApp({ projectId }, emulatorAppName);
  }
}

let _dc: any = null;

function getAdminDc() {
  if (_dc) return _dc;

  if (shouldUseDataConnectEmulator()) {
    process.env.FIREBASE_DATACONNECT_EMULATOR_HOST ??= getDataConnectEmulatorEndpoint();
  }

  const { getDataConnect } = eval("require")("firebase-admin/data-connect");
  _dc = getDataConnect(
    { serviceId: DC_SERVICE, connector: DC_CONNECTOR, location: DC_LOCATION },
    getAdminAppForDataConnect()
  );
  return _dc;
}

async function adminDcExecute<T>(
  mode: "query" | "mutation",
  operation: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  try {
    const dc = getAdminDc();
    const executor = mode === "query" ? dc.executeQuery.bind(dc) : dc.executeMutation.bind(dc);
    const result = await (Object.keys(variables).length ? executor(operation, variables) : executor(operation));
    return result.data as T;
  } catch (err: any) {
    throw new Error(`[DC:${mode === "query" ? "Query" : "Mutate"}:${operation}] ${err.message ?? err}`);
  }
}

export async function adminDcQuery<T = Record<string, unknown>>(
  operation: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  return adminDcExecute("query", operation, variables);
}

export async function adminDcMutate<T = Record<string, unknown>>(
  operation: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  return adminDcExecute("mutation", operation, variables);
}

// Sends raw GQL to the service's executeGraphql endpoint, bypassing the
// compiled named-operation registry. Use this for schema fields that exist
// in schema.gql but aren't yet reflected in a running emulator's named ops.
export async function adminDcRawMutate<T = Record<string, unknown>>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  try {
    const dc = getAdminDc();
    const result = await dc.executeGraphql(query, { variables });
    return result.data as T;
  } catch (err: any) {
    throw new Error(`[DC:RawMutate] ${err.message ?? err}`);
  }
}

export { getDataConnectEmulatorHost, getDataConnectEmulatorPort, shouldUseDataConnectEmulator };
