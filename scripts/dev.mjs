import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import net from "node:net";

const cwd = process.cwd();
const envPath = path.join(cwd, ".env");

function readDotEnv(filePath) {
  if (!existsSync(filePath)) return {};

  const env = {};
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function resolveEnv() {
  return {
    ...readDotEnv(envPath),
    ...process.env,
  };
}

function shouldUseEmulator(env) {
  if (env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") return true;
  if (env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "false") return false;
  return env.NODE_ENV !== "production";
}

function getEmulatorPort(env) {
  const rawPort =
    env.NEXT_PUBLIC_FIREBASE_DATACONNECT_EMULATOR_PORT ??
    env.FIREBASE_DATACONNECT_EMULATOR_PORT;
  const port = Number.parseInt(rawPort ?? "9400", 10);
  return Number.isInteger(port) && port > 0 ? port : 9400;
}

function isPortListening(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });

    const finish = (result) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(1000);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

async function main() {
  const env = resolveEnv();
  const useEmulator = shouldUseEmulator(env);
  const emulatorPort = getEmulatorPort(env);
  const emulatorRunning = useEmulator && (await isPortListening(emulatorPort));

  const labels = ["next"];
  const colors = ["cyan"];
  const commands = ["next dev"];
  const waitTargets = ["http://127.0.0.1:3000"];

  if (useEmulator) {
    waitTargets.push(`tcp:127.0.0.1:${emulatorPort}`);

    if (!emulatorRunning) {
      labels.push("firebase");
      colors.push("yellow");
      commands.push("firebase emulators:start --only dataconnect");
    }
  }

  labels.push("browser");
  colors.push("green");
  commands.push(`wait-on ${waitTargets.join(" ")} && open-cli http://127.0.0.1:3000`);

  const args = [
    "concurrently",
    "-n",
    labels.join(","),
    "-c",
    colors.join(","),
    ...commands,
  ];

  if (emulatorRunning) {
    console.log(`[dev] Reusing existing Data Connect emulator on port ${emulatorPort}.`);
  } else if (!useEmulator) {
    console.log("[dev] Firebase emulator disabled by NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false.");
  }

  const child = spawn("npx", args, {
    cwd,
    env: {
      ...process.env,
      NODE_PATH: path.join(cwd, "node_modules"),
    },
    stdio: "inherit",
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
