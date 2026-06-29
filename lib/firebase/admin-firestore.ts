import { getAdminApp } from "./admin";

function loadFirestoreModule() {
  // eval() prevents Turbopack/webpack from bundling firebase-admin subpaths
  return eval("require")("firebase-admin/firestore");
}

let _db: any = null;

export function getAdminFirestore() {
  if (_db) return _db;
  const { getFirestore } = loadFirestoreModule();
  _db = getFirestore(getAdminApp());
  return _db;
}

// Lazy FieldValue — resolved at runtime, not bundled
export const FieldValue: typeof import("firebase-admin/firestore").FieldValue =
  new Proxy({} as any, {
    get(_, key: string) {
      return (loadFirestoreModule().FieldValue as any)[key];
    },
  });
