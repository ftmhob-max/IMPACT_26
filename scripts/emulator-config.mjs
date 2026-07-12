// Dev script helper: mirrors lib/firebase/emulator-config.ts for Node ESM scripts.
const DEFAULT_EMULATOR_HOST = "127.0.0.1";
const DEFAULT_EMULATOR_PORT = 9400;

export function shouldUseDataConnectEmulator(env = process.env) {
  if (env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") return true;
  if (env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "false") return false;
  return env.NODE_ENV !== "production";
}

export function getDataConnectEmulatorHost(env = process.env) {
  return (
    env.NEXT_PUBLIC_FIREBASE_DATACONNECT_EMULATOR_HOST ??
    env.FIREBASE_DATACONNECT_EMULATOR_HOST ??
    DEFAULT_EMULATOR_HOST
  );
}

export function getDataConnectEmulatorPort(env = process.env) {
  const rawPort =
    env.NEXT_PUBLIC_FIREBASE_DATACONNECT_EMULATOR_PORT ?? env.FIREBASE_DATACONNECT_EMULATOR_PORT;
  const port = Number.parseInt(rawPort ?? `${DEFAULT_EMULATOR_PORT}`, 10);
  return Number.isInteger(port) && port > 0 ? port : DEFAULT_EMULATOR_PORT;
}

export function getDataConnectEmulatorEndpoint(env = process.env) {
  return `${getDataConnectEmulatorHost(env)}:${getDataConnectEmulatorPort(env)}`;
}
