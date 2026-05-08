const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 9400;

export function shouldUseDataConnectEmulator() {
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") return true;
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "false") return false;
  return process.env.NODE_ENV !== "production";
}

export function getDataConnectEmulatorHost() {
  return (
    process.env.NEXT_PUBLIC_FIREBASE_DATACONNECT_EMULATOR_HOST ??
    process.env.FIREBASE_DATACONNECT_EMULATOR_HOST ??
    DEFAULT_HOST
  );
}

export function getDataConnectEmulatorPort() {
  const rawPort =
    process.env.NEXT_PUBLIC_FIREBASE_DATACONNECT_EMULATOR_PORT ??
    process.env.FIREBASE_DATACONNECT_EMULATOR_PORT;
  const port = Number.parseInt(rawPort ?? `${DEFAULT_PORT}`, 10);
  return Number.isInteger(port) && port > 0 ? port : DEFAULT_PORT;
}
