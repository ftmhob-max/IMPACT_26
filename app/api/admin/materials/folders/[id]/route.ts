import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminRequest } from "@/lib/admin/auth";
import { fetchAdminMaterialFolders } from "@/lib/admin/material-library";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { formatUuid } from "@/lib/utils";

const updateFolderSchema = z.object({
  name: z.string().trim().min(1).optional(),
  parentFolderId: z.string().uuid().optional().nullable(),
  archived: z.boolean().optional(),
  trashed: z.boolean().optional(),
  restore: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const parsed = updateFolderSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  const folderId = formatUuid(id);
  const today = new Date().toISOString().split("T")[0];
  const body = parsed.data;

  try {
    const folder = (await fetchAdminMaterialFolders()).find((entry) => entry.id === folderId);
    if (!folder) return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    await adminDcMutate("UpdateSourceMaterialFolder", {
      id: folderId,
      name: body.name ?? folder.name,
      parentFolderId: body.parentFolderId === undefined ? folder.parentFolder?.id ?? null : body.parentFolderId,
      archivedAt: body.restore ? null : body.archived ? today : null,
      trashedAt: body.restore ? null : body.trashed ? today : null,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/materials/folders/[id]:PATCH]", error);
    return NextResponse.json({ error: "Unable to update folder" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const folderId = formatUuid(id);
  const today = new Date().toISOString().split("T")[0];

  try {
    const folder = (await fetchAdminMaterialFolders()).find((entry) => entry.id === folderId);
    if (!folder) return NextResponse.json({ error: "Folder not found" }, { status: 404 });

    try {
      await adminDcMutate("UpdateSourceMaterialFolder", {
        id: folderId,
        name: folder.name,
        parentFolderId: folder.parentFolder?.id ?? null,
        archivedAt: null,
        trashedAt: today,
      });
    } catch {
      await adminDcMutate("DeleteSourceMaterialFolder", { id: folderId });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/materials/folders/[id]:DELETE]", error);
    return NextResponse.json({ error: "Unable to delete folder" }, { status: 500 });
  }
}
