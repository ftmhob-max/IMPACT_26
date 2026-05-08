import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminStorage } from "@/lib/firebase/admin-storage";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { fetchAdminMaterialLibrary, findMaterialById } from "@/lib/admin/material-library";
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

  try {
    const data = await adminDcQuery<{ sourceMaterials: Array<{ id: string; storagePath?: string | null }> }>(
      "AdminListSourceMaterials"
    ).catch(() => ({ sourceMaterials: [] }));

    const material = data.sourceMaterials.find((entry) => formatUuid(entry.id) === materialId);
    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
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

  if (action !== "reparse") {
    return NextResponse.json({ error: "Unknown action. Use ?action=reparse" }, { status: 400 });
  }

  try {
    const materials = await fetchAdminMaterialLibrary();
    const selected = findMaterialById(materials, materialId);
    if (!selected) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
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
