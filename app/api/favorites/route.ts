import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireLearnerRequest } from "@/lib/firebase/auth-server";
import {
  deleteUserFavorite,
  listUserFavorites,
  upsertUserFavorite,
  type FavoriteItemType,
} from "@/lib/firebase/favorites";

const favoriteSchema = z.object({
  itemType: z.enum(["formula", "glossary"]),
  itemId: z.string().trim().min(1),
});

function serializeFavorites(favorites: Array<{ itemType: FavoriteItemType; itemId: string }>) {
  return favorites.map((favorite) => ({
    itemType: favorite.itemType,
    itemId: favorite.itemId,
  }));
}

export async function GET(request: NextRequest) {
  const auth = await requireLearnerRequest(request);
  if (!auth.ok) return auth.response;

  const rawItemType = request.nextUrl.searchParams.get("itemType");
  const itemType: FavoriteItemType | undefined =
    rawItemType === "formula" || rawItemType === "glossary" ? rawItemType : undefined;

  try {
    const favorites = await listUserFavorites(auth.session.uid, itemType);
    return NextResponse.json({ favorites: serializeFavorites(favorites) });
  } catch (error) {
    console.error("[api/favorites:GET]", error);
    return NextResponse.json({ error: "Failed to load favorites" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireLearnerRequest(request);
  if (!auth.ok) return auth.response;

  const parsed = favoriteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await upsertUserFavorite(auth.session.uid, parsed.data.itemType, parsed.data.itemId);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[api/favorites:POST]", error);
    return NextResponse.json({ error: "Failed to save favorite" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireLearnerRequest(request);
  if (!auth.ok) return auth.response;

  const parsed = favoriteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await deleteUserFavorite(auth.session.uid, parsed.data.itemType, parsed.data.itemId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/favorites:DELETE]", error);
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}
