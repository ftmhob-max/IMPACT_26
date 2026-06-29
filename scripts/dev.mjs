import { existsSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import net from "node:net";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const cwd = process.cwd();
const envPath = path.join(cwd, ".env");

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

async function waitForHttp(url, timeoutMs = 120_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok || response.status < 500) return;
    } catch {
      // Keep polling until the dev server is ready.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function waitForPort(port, host = "127.0.0.1", timeoutMs = 120_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await isPortListening(port, host)) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${host}:${port}`);
}

async function openBrowser(url) {
  if (process.platform === "darwin") {
    await execFileAsync("open", [url]);
    return;
  }
  if (process.platform === "win32") {
    await execFileAsync("cmd", ["/c", "start", "", url]);
    return;
  }
  await execFileAsync("xdg-open", [url]);
}

function spawnLogged(label, command, args, env) {
  const child = spawn(command, args, {
    cwd,
    env,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  child.on("exit", (code, signal) => {
    if (signal) {
      console.log(`[dev:${label}] exited via ${signal}`);
      return;
    }
    if (code && code !== 0) {
      console.log(`[dev:${label}] exited with code ${code}`);
    }
  });
  return child;
}

async function main() {
  if (!existsSync(envPath)) {
    console.warn("[dev] No .env file found; continuing with process environment only.");
  }

  const env = process.env;
  const useEmulator = shouldUseEmulator(env);
  const emulatorPort = getEmulatorPort(env);
  const emulatorRunning = useEmulator && (await isPortListening(emulatorPort));
  const appPort = await findAvailablePort(
    Number.parseInt(env.PORT ?? env.NEXT_PORT ?? "3000", 10) || 3000
  );

  const sharedEnv = {
    ...process.env,
    NODE_PATH: path.join(cwd, "node_modules"),
  };

  if (appPort !== 3000) {
    console.log(`[dev] Port 3000 is busy, using ${appPort} instead.`);
  }

  if (emulatorRunning) {
    console.log(`[dev] Reusing existing Data Connect emulator on port ${emulatorPort}.`);
  } else if (!useEmulator) {
    console.log("[dev] Firebase emulator disabled by NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false.");
  }

  const children = [];
  const nextCmd = process.platform === "win32" ? "npx.cmd" : "npx";
  children.push(spawnLogged("next", nextCmd, ["next", "dev", "--webpack", "--port", String(appPort)], sharedEnv));

  if (useEmulator && !emulatorRunning) {
    children.push(spawnLogged("firebase", nextCmd, ["firebase", "emulators:start", "--only", "dataconnect"], sharedEnv));
    await waitForPort(emulatorPort);
  }

  const appUrl = `http://localhost:${appPort}`;
  await waitForHttp(appUrl);
  await openBrowser(appUrl).catch((error) => {
    console.warn(`[dev] Could not open browser automatically: ${error instanceof Error ? error.message : error}`);
    console.log(`[dev] Open ${appUrl} manually.`);
  });

  await Promise.race(children.map((child) => new Promise((resolve) => child.on("exit", resolve))));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
