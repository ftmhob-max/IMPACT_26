import { getAdminApp } from "./admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadFirestoreAdmin(): any {
  return eval("require")("firebase-admin/firestore");
}

let _db: any = null;

export function getAdminFirestore() {
  if (_db) return _db;
  const { getFirestore } = loadFirestoreAdmin();
  _db = getFirestore(getAdminApp());
  return _db;
}

export function tryGetAdminFirestore() {
  try {
    return getAdminFirestore();
  } catch (error) {
    console.warn("[firebase-admin] Firestore unavailable", error);
    return null;
  }
}

export const FieldValue = new Proxy({} as any, {
  get(_, key: string) {
    return (loadFirestoreAdmin().FieldValue as any)[key];
  },
});
