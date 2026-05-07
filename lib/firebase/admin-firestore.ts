import { adminApp } from "./admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadFirestoreAdmin(): any {
  return eval("require")("firebase-admin/firestore");
}

let _db: any = null;

export function getAdminFirestore() {
  if (_db) return _db;
  const { getFirestore } = loadFirestoreAdmin();
  _db = getFirestore(adminApp);
  return _db;
}

export const FieldValue = new Proxy({} as any, {
  get(_, key: string) {
    return (loadFirestoreAdmin().FieldValue as any)[key];
  },
});
