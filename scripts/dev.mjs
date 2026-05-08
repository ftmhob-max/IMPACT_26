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

function canListenOnPort(port, host) {
  return new Promise((resolve) => {
    const server = net.createServer();

    const finish = (result) => {
      server.removeAllListeners();
      if (server.listening) {
        server.close(() => resolve(result));
        return;
      }
      resolve(result);
    };

    server.once("error", () => finish(false));
    server.once("listening", () => finish(true));
    if (host) {
      server.listen(port, host);
      return;
    }

    server.listen(port);
  });
}

async function findAvailablePort(startPort, host) {
  let port = startPort;

  while (!(await canListenOnPort(port, host))) {
    port += 1;
  }

  return port;
}

async function main() {
  const env = resolveEnv();
  const useEmulator = shouldUseEmulator(env);
  const emulatorPort = getEmulatorPort(env);
  const emulatorRunning = useEmulator && (await isPortListening(emulatorPort));
  const appPort = await findAvailablePort(
    Number.parseInt(env.PORT ?? env.NEXT_PORT ?? "3000", 10) || 3000
  );

  const labels = ["next"];
  const colors = ["cyan"];
  const commands = [`next dev --webpack --port ${appPort}`];
  const waitTargets = [`http://localhost:${appPort}`];

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
  commands.push(`wait-on ${waitTargets.join(" ")} && open-cli http://localhost:${appPort}`);

  const args = [
    "concurrently",
    "-n",
    labels.join(","),
    "-c",
    colors.join(","),
    ...commands,
  ];

  if (appPort !== 3000) {
    console.log(`[dev] Port 3000 is busy, using ${appPort} instead.`);
  }

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
