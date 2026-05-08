import { getAdminApp } from "./admin";

export function getAdminStorage() {
  const { getStorage } = eval("require")("firebase-admin/storage");
  const app = getAdminApp();
  return getStorage(app);
}
