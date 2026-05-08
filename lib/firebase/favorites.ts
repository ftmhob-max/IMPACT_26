import { getAdminFirestore, tryGetAdminFirestore, FieldValue } from "@/lib/firebase/admin-firestore";

export type FavoriteItemType = "formula" | "glossary";

export interface FavoriteRecord {
  id: string;
  userId: string;
  itemType: FavoriteItemType;
  itemId: string;
}

export function favoriteDocId(userId: string, itemType: FavoriteItemType, itemId: string) {
  return `${userId}_${itemType}_${itemId}`;
}

export async function listUserFavorites(userId: string, itemType?: FavoriteItemType) {
  const db = tryGetAdminFirestore();
  if (!db) return [];
  try {
    let query = db.collection("userFavorites").where("userId", "==", userId);
    if (itemType) query = query.where("itemType", "==", itemType);
    const snap = await query.get();
    return snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as FavoriteRecord[];
  } catch (error) {
    console.warn("[favorites] Failed to list favorites", error);
    return [];
  }
}

export async function upsertUserFavorite(userId: string, itemType: FavoriteItemType, itemId: string) {
  const db = getAdminFirestore();
  const id = favoriteDocId(userId, itemType, itemId);
  const ref = db.collection("userFavorites").doc(id);
  const existing = await ref.get();

  await ref.set(
    {
      userId,
      itemType,
      itemId,
      createdAt: existing.exists ? existing.data()?.createdAt ?? FieldValue.serverTimestamp() : FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return id;
}

export async function deleteUserFavorite(userId: string, itemType: FavoriteItemType, itemId: string) {
  const db = getAdminFirestore();
  const id = favoriteDocId(userId, itemType, itemId);
  await db.collection("userFavorites").doc(id).delete();
  return id;
}
