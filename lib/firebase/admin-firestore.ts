import { getFirestore, FieldValue as AdminFieldValue } from "firebase-admin/firestore";
import { getAdminApp } from "./admin";

let _db: any = null;

export function getAdminFirestore() {
  if (_db) return _db;
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

export const FieldValue = AdminFieldValue;
