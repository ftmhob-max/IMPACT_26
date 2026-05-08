import { getDataConnect, DataConnect, connectDataConnectEmulator } from "firebase/data-connect";
import { app } from "./client";
import { getDataConnectEmulatorHost, getDataConnectEmulatorPort, shouldUseDataConnectEmulator } from "./dataconnect-emulator";
import { connectorConfig } from "./generated";

let dataconnect: DataConnect;

export function getPlatformDataConnect() {
  if (!dataconnect) {
    dataconnect = getDataConnect(app, connectorConfig);

    // In local development, default to the Data Connect emulator unless explicitly disabled.
    if (shouldUseDataConnectEmulator()) {
      connectDataConnectEmulator(
        dataconnect,
        getDataConnectEmulatorHost(),
        getDataConnectEmulatorPort()
      );
    }
  }
  return dataconnect;
}
