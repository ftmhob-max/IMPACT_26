import { getDataConnect, DataConnect, connectDataConnectEmulator } from "firebase/data-connect";
import { app } from "./client";
import { connectorConfig } from "./generated";

let dataconnect: DataConnect;

export function getPlatformDataConnect() {
  if (!dataconnect) {
    dataconnect = getDataConnect(app, connectorConfig);

    // Connect to local emulator only when explicitly requested.
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
      connectDataConnectEmulator(dataconnect, "127.0.0.1", 9400);
    }
  }
  return dataconnect;
}
