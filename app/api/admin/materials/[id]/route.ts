import { NextResponse, type NextRequest } from "next/server";
import { getAdminStorage } from "@/lib/firebase/admin-storage";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";
import { parseGsPath } from "@/lib/admin/source-materials";
import { formatUuid } from "@/lib/utils";

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
