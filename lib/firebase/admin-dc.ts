import { getAdminApp } from "./admin";
import { getDataConnectEmulatorHost, getDataConnectEmulatorPort, shouldUseDataConnectEmulator } from "./dataconnect-emulator";

const DC_SERVICE = "impact26-dataconnect";
const DC_CONNECTOR = "impact26-connector";
const DC_LOCATION = "us-central1";
const DEFAULT_PROJECT_ID = "impact26-aa59b";

let _dc: any = null;

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

function getAdminDc() {
  if (_dc) return _dc;

  if (shouldUseDataConnectEmulator()) {
    process.env.FIREBASE_DATACONNECT_EMULATOR_HOST ??=
      `${getDataConnectEmulatorHost()}:${getDataConnectEmulatorPort()}`;
  }

  const { getDataConnect } = eval("require")("firebase-admin/data-connect");
  _dc = getDataConnect(
    { serviceId: DC_SERVICE, connector: DC_CONNECTOR, location: DC_LOCATION },
    getAdminAppForDataConnect()
  );
  return _dc;
}

export async function adminDcQuery<T = Record<string, unknown>>(
  operation: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  try {
    const dc = getAdminDc();
    const result = await (Object.keys(variables).length
      ? dc.executeQuery(operation, variables)
      : dc.executeQuery(operation));
    return result.data as T;
  } catch (err: any) {
    throw new Error(`[DC:Query:${operation}] ${err.message ?? err}`);
  }
}

export async function adminDcMutate<T = Record<string, unknown>>(
  operation: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  try {
    const dc = getAdminDc();
    const result = await (Object.keys(variables).length
      ? dc.executeMutation(operation, variables)
      : dc.executeMutation(operation));
    return result.data as T;
  } catch (err: any) {
    throw new Error(`[DC:Mutate:${operation}] ${err.message ?? err}`);
  }
}

// Sends raw GQL to the service's executeGraphql endpoint, bypassing the
// compiled named-operation registry. Use this for schema fields that exist
// in schema.gql but aren't yet reflected in a running emulator's named ops.
export async function adminDcRawMutate<T = Record<string, unknown>>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  try {
    const dc = getAdminDc();
    const result = await dc.executeGraphql(query, { variables });
    return result.data as T;
  } catch (err: any) {
    throw new Error(`[DC:RawMutate] ${err.message ?? err}`);
  }
}
