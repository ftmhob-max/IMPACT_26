import { adminDcQuery, adminDcMutate } from "@/lib/firebase/admin-dc";

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

export async function listUserFavorites(userId: string, itemType?: FavoriteItemType): Promise<FavoriteRecord[]> {
  try {
    if (itemType) {
      const data = await adminDcQuery<{ userFavorites: Array<{ itemType: string; itemId: string }> }>(
        "GetUserFavoritesByType",
        { userId, itemType }
      );
      return (data?.userFavorites || []).map((fav) => ({
        id: favoriteDocId(userId, fav.itemType as FavoriteItemType, fav.itemId),
        userId,
        itemType: fav.itemType as FavoriteItemType,
        itemId: fav.itemId,
      }));
    } else {
      const data = await adminDcQuery<{ userFavorites: Array<{ itemType: string; itemId: string }> }>(
        "GetUserFavorites",
        { userId }
      );
      return (data?.userFavorites || []).map((fav) => ({
        id: favoriteDocId(userId, fav.itemType as FavoriteItemType, fav.itemId),
        userId,
        itemType: fav.itemType as FavoriteItemType,
        itemId: fav.itemId,
      }));
    }
  } catch (error) {
    console.warn("[favorites] Failed to list favorites", error);
    return [];
  }
}

export async function upsertUserFavorite(userId: string, itemType: FavoriteItemType, itemId: string): Promise<string> {
  const id = favoriteDocId(userId, itemType, itemId);
  await adminDcMutate("UpsertUserFavorite", { userId, itemType, itemId });
  return id;
}

export async function deleteUserFavorite(userId: string, itemType: FavoriteItemType, itemId: string): Promise<string> {
  const id = favoriteDocId(userId, itemType, itemId);
  await adminDcMutate("DeleteUserFavorite", { userId, itemType, itemId });
  return id;
}

