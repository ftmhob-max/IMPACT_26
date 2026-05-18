import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminRequest } from "@/lib/admin/auth";
import { fetchAdminMaterialFolders, fetchAdminMaterialLibrary } from "@/lib/admin/material-library";
import { createStoredMaterialFolder } from "@/lib/admin/material-folder-store";
import { adminDcMutate } from "@/lib/firebase/admin-dc";

const folderSchema = z.object({
  name: z.string().trim().min(1),
  parentFolderId: z.string().uuid().optional().nullable(),
  folderType: z.string().trim().default("custom"),
  courseId: z.string().uuid().optional().nullable(),
  lessonId: z.string().uuid().optional().nullable(),
});

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  const [folders, materials] = await Promise.all([
    fetchAdminMaterialFolders(),
    fetchAdminMaterialLibrary(),
  ]);
  const counts = new Map<string, number>();
  for (const material of materials) {
    if (material.folder?.id && !material.archivedAt && !material.trashedAt) {
      counts.set(material.folder.id, (counts.get(material.folder.id) ?? 0) + 1);
    }
  }

  return NextResponse.json({
    folders: folders.map((folder) => ({
      ...folder,
      materialCount: counts.get(folder.id) ?? 0,
    })),
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const parsed = folderSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const id = randomUUID();
  const { name, parentFolderId, folderType, courseId, lessonId } = parsed.data;
  try {
    await adminDcMutate("CreateSourceMaterialFolder", {
      id,
      name,
      parentFolderId: parentFolderId ?? null,
      folderType,
      courseId: courseId ?? null,
      lessonId: lessonId ?? null,
      createdById: auth.session.uid,
    });
    await adminDcMutate("CreateSourceMaterialActivity", {
      id: randomUUID(),
      sourceMaterialId: null,
      folderId: id,
      actorId: auth.session.uid,
      activityType: "create-folder",
      message: `Created folder ${name}`,
      metadataJson: JSON.stringify({ parentFolderId, folderType }),
    }).catch(() => null);
    return NextResponse.json({ id, name }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("operation \"CreateSourceMaterialFolder\" not found")) {
      console.error("[admin/materials/folders:POST]", error);
      return NextResponse.json({ error: "Unable to create folder" }, { status: 500 });
    }

    const folder = await createStoredMaterialFolder({
      id,
      name,
      parentFolderId: parentFolderId ?? null,
      folderType,
      createdBy: { id: auth.session.uid },
    });
    return NextResponse.json({ id: folder.id, name: folder.name, compatibility: true }, { status: 201 });
  }
}
