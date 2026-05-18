import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminStorage } from "@/lib/firebase/admin-storage";
import { requireAdminRequest } from "@/lib/admin/auth";
import { assignStoredMaterialsToFolder } from "@/lib/admin/material-folder-store";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { fetchAdminMaterialFolders, fetchAdminMaterialLibrary, findMaterialById } from "@/lib/admin/material-library";
import { ingestBuffer } from "@/lib/admin/ingestion";
import { parseGsPath } from "@/lib/admin/source-materials";
import { formatUuid } from "@/lib/utils";

export const maxDuration = 600;

async function loadMaterialBuffer(storagePath: string | undefined | null): Promise<Buffer | null> {
  if (!storagePath) return null;
  const parsed = parseGsPath(storagePath);
  if (!parsed) return null;
  try {
    const [buffer] = await getAdminStorage().bucket(parsed.bucket).file(parsed.filePath).download();
    return buffer;
  } catch {
    return null;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const materialId = formatUuid(id);
  const hardDelete = request.nextUrl.searchParams.get("hard") === "1" || request.nextUrl.searchParams.get("hard") === "true";

  try {
    const data = await adminDcQuery<{ sourceMaterials: Array<{ id: string; title: string; storagePath?: string | null }> }>(
      "AdminListSourceMaterials"
    ).catch(() => ({ sourceMaterials: [] }));

    const material = data.sourceMaterials.find((entry) => formatUuid(entry.id) === materialId);
    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    if (!hardDelete) {
      const selected = findMaterialById(await fetchAdminMaterialLibrary(), materialId);
      await adminDcMutate("UpdateSourceMaterialLibraryState", {
        id: materialId,
        title: selected?.title ?? material.title,
        folderId: selected?.folder?.id ?? null,
        starred: selected?.starred ?? false,
        archivedAt: null,
        trashedAt: new Date().toISOString().split("T")[0],
        reviewStatus: selected?.reviewStatus ?? "unreviewed",
        visibility: selected?.visibility ?? "admin",
        duplicateOfId: selected?.duplicateOf?.id ?? null,
        lastActivityAt: new Date().toISOString().split("T")[0],
        metadataJson: selected ? JSON.stringify(selected.metadata) : null,
        status: selected?.status ?? "uploaded",
      });
      await adminDcMutate("CreateSourceMaterialActivity", {
        id: randomUUID(),
        sourceMaterialId: materialId,
        folderId: null,
        actorId: auth.session.uid,
        activityType: "trash",
        message: "Moved material to trash",
        metadataJson: null,
      }).catch(() => null);
      return NextResponse.json({ ok: true, trashed: true });
    }

    await adminDcMutate("DeleteSourceLinksForMaterial", { sourceMaterialId: materialId }).catch(() => null);
    await adminDcMutate("DeleteIngestionJobsForMaterial", { sourceMaterialId: materialId }).catch(() => null);
    await adminDcMutate("DeleteSourceMaterial", { id: materialId });

    const parsed = parseGsPath(material.storagePath ?? null);
    if (parsed) {
      await getAdminStorage().bucket(parsed.bucket).file(parsed.filePath).delete().catch(() => null);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/materials/[id]:DELETE]", error);
    return NextResponse.json({ error: "Unable to delete source material" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const materialId = formatUuid(id);
  const action = request.nextUrl.searchParams.get("action");

  if (action && action !== "reparse") {
    return NextResponse.json({ error: "Unknown action. Use ?action=reparse or a JSON body action." }, { status: 400 });
  }

  try {
    const materials = await fetchAdminMaterialLibrary();
    const selected = findMaterialById(materials, materialId);
    if (!selected) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    if (!action) {
      const body = await request.json().catch(() => ({})) as {
        title?: string;
        folderId?: string | null;
        starred?: boolean;
        archived?: boolean;
        trashed?: boolean;
        restore?: boolean;
        reviewStatus?: string;
        visibility?: string;
        status?: string;
        tags?: string[];
        extractedText?: string;
        transcriptSource?: string;
      };

      // Manual transcript override
      if (typeof body.extractedText === "string") {
        if (body.extractedText.length > 5 * 1024 * 1024) {
          return NextResponse.json({ error: "Transcript text exceeds 5 MB limit." }, { status: 400 });
        }
        await adminDcMutate("UpdateSourceMaterial", {
          id: materialId,
          extractedText: body.extractedText,
          metadataJson: JSON.stringify({
            ...selected.metadata,
            transcriptSource: body.transcriptSource ?? "manual",
            transcriptUpdatedAt: new Date().toISOString(),
          }),
          status: body.extractedText.trim() ? "parsed" : selected.status,
        });
        await adminDcMutate("CreateSourceMaterialActivity", {
          id: randomUUID(),
          sourceMaterialId: materialId,
          folderId: selected.folder?.id ?? null,
          actorId: auth.session.uid,
          activityType: "manual-transcript",
          message: body.transcriptSource === "upload"
            ? "Uploaded transcript file"
            : "Manually edited transcript",
          metadataJson: JSON.stringify({ characters: body.extractedText.length }),
        }).catch(() => null);
        return NextResponse.json({ ok: true, characters: body.extractedText.length });
      }

      const today = new Date().toISOString().split("T")[0];
      const folders = body.folderId !== undefined ? await fetchAdminMaterialFolders() : [];
      const metadataJson = JSON.stringify({
        ...selected.metadata,
        ...(body.tags ? { tags: body.tags } : {}),
        ...(body.folderId !== undefined ? {
          libraryFolderId: body.folderId,
          libraryFolderName: body.folderId ? folders.find((folder) => folder.id === body.folderId)?.name : null,
        } : {}),
        libraryUpdatedAt: new Date().toISOString(),
      });

      await adminDcMutate("UpdateSourceMaterialLibraryState", {
        id: materialId,
        title: typeof body.title === "string" && body.title.trim() ? body.title.trim() : selected.title,
        folderId: body.folderId === undefined ? selected.folder?.id ?? null : body.folderId,
        starred: typeof body.starred === "boolean" ? body.starred : selected.starred,
        archivedAt: body.restore ? null : body.archived ? today : selected.archivedAt ?? null,
        trashedAt: body.restore ? null : body.trashed ? today : selected.trashedAt ?? null,
        reviewStatus: body.reviewStatus ?? selected.reviewStatus,
        visibility: body.visibility ?? selected.visibility,
        duplicateOfId: selected.duplicateOf?.id ?? null,
        lastActivityAt: today,
        metadataJson,
        status: body.status ?? selected.status,
      }).catch(async (error) => {
        const message = error instanceof Error ? error.message : String(error);
        if (!message.includes("operation \"UpdateSourceMaterialLibraryState\" not found")) throw error;
        await adminDcMutate("UpdateSourceMaterial", {
          id: materialId,
          extractedText: selected.extractedText ?? "",
          metadataJson,
          status: body.status ?? selected.status,
        });
      });

      if (body.folderId !== undefined) {
        await assignStoredMaterialsToFolder([selected.id, materialId], body.folderId ?? null);
      }

      if (Array.isArray(body.tags)) {
        await adminDcMutate("DeleteTagAssignmentsForMaterial", { sourceMaterialId: materialId }).catch(() => null);
        for (const name of body.tags.map((tag) => tag.trim()).filter(Boolean)) {
          const tagId = randomUUID();
          await adminDcMutate("CreateSourceMaterialTag", {
            id: tagId,
            name,
            color: null,
            createdById: auth.session.uid,
          }).catch(() => null);
          await adminDcMutate("CreateSourceMaterialTagAssignment", {
            id: randomUUID(),
            sourceMaterialId: materialId,
            tagId,
          }).catch(() => null);
        }
      }

      await adminDcMutate("CreateSourceMaterialActivity", {
        id: randomUUID(),
        sourceMaterialId: materialId,
        folderId: body.folderId ?? selected.folder?.id ?? null,
        actorId: auth.session.uid,
        activityType: body.trashed ? "trash" : body.archived ? "archive" : body.folderId !== undefined ? "move" : "update",
        message: body.trashed ? "Moved material to trash" : body.archived ? "Archived material" : "Updated library metadata",
        metadataJson: JSON.stringify(body),
      }).catch(() => null);

      return NextResponse.json({ ok: true });
    }

    const assetBuffer = await loadMaterialBuffer(selected.storagePath);
    if (!assetBuffer) {
      return NextResponse.json(
        { error: "No asset file found in storage. Upload the original file before re-parsing." },
        { status: 422 }
      );
    }

    const ingestion = await ingestBuffer(
      assetBuffer,
      selected.fileName,
      selected.fileType,
      selected.sizeBytes || assetBuffer.length
    );

    await adminDcMutate("UpdateSourceMaterial", {
      id: materialId,
      extractedText: ingestion.extractedText,
      metadataJson: JSON.stringify({
        ...selected.metadata,
        ...ingestion.metadata,
        reparsedAt: new Date().toISOString(),
      }),
      status: ingestion.status,
    });

    await adminDcMutate("CreateIngestionJob", {
      id: randomUUID(),
      sourceMaterialId: materialId,
      status: ingestion.status,
      parser: ingestion.parser,
      extractedCharacters: ingestion.extractedText.length,
      errorMessage: ingestion.errorMessage ?? null,
      completedAt: new Date().toISOString().split("T")[0],
    });

    await adminDcMutate("CreateSourceMaterialActivity", {
      id: randomUUID(),
      sourceMaterialId: materialId,
      folderId: selected.folder?.id ?? null,
      actorId: auth.session.uid,
      activityType: "reparse",
      message: "Reprocessed material",
      metadataJson: JSON.stringify({ parser: ingestion.parser, status: ingestion.status }),
    }).catch(() => null);

    return NextResponse.json({
      ok: true,
      status: ingestion.status,
      parser: ingestion.parser,
      characters: ingestion.extractedText.length,
    });
  } catch (error) {
    console.error("[admin/materials/[id]:PATCH reparse]", error);
    return NextResponse.json({ error: "Re-parse failed" }, { status: 500 });
  }
}
