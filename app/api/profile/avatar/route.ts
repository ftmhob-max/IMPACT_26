import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { getAdminStorage } from "@/lib/firebase/admin-storage";
import { getUserProfileSettings, updateUserAvatarStoragePath } from "@/lib/profile-settings";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

async function requireAvatarUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;
  if (!sessionCookie) return null;
  return adminAuth.verifySessionCookie(sessionCookie, true);
}

function extensionForContentType(contentType: string) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/gif") return "gif";
  return "jpg";
}

function buildFirebaseStorageUrl(bucketName: string, storagePath: string, token: string) {
  return `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucketName)}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;
}

async function deleteStoredAvatar(storagePath: string | null) {
  if (!storagePath) return;
  try {
    await getAdminStorage().bucket().file(storagePath).delete({ ignoreNotFound: true });
  } catch (error) {
    console.warn("[profile:avatar] previous avatar delete skipped", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await requireAvatarUser();
    if (!decoded) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose an image to upload" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Avatar must be a JPG, PNG, WebP, or GIF image" }, { status: 400 });
    }

    if (file.size > MAX_AVATAR_BYTES) {
      return NextResponse.json({ error: "Avatar must be 2 MB or smaller" }, { status: 400 });
    }

    const current = await getUserProfileSettings(decoded.uid);
    const bucket = getAdminStorage().bucket();
    const token = randomUUID();
    const storagePath = `avatars/${decoded.uid}/${randomUUID()}.${extensionForContentType(file.type)}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await bucket.file(storagePath).save(buffer, {
      resumable: false,
      metadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000",
        metadata: {
          firebaseStorageDownloadTokens: token,
          originalName: file.name.slice(0, 160),
        },
      },
    });

    const photoURL = buildFirebaseStorageUrl(bucket.name, storagePath, token);
    await adminAuth.updateUser(decoded.uid, { photoURL });
    await updateUserAvatarStoragePath(decoded.uid, storagePath);
    await deleteStoredAvatar(current.avatarStoragePath);

    return NextResponse.json({ photoURL });
  } catch (error) {
    console.error("[profile:avatar:post]", error);
    return NextResponse.json({ error: "Unable to upload avatar" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const decoded = await requireAvatarUser();
    if (!decoded) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const current = await getUserProfileSettings(decoded.uid);
    await adminAuth.updateUser(decoded.uid, { photoURL: null });
    await updateUserAvatarStoragePath(decoded.uid, null);
    await deleteStoredAvatar(current.avatarStoragePath);

    return NextResponse.json({ photoURL: null });
  } catch (error) {
    console.error("[profile:avatar:delete]", error);
    return NextResponse.json({ error: "Unable to remove avatar" }, { status: 500 });
  }
}
