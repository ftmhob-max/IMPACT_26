import { NextResponse, type NextRequest } from "next/server";
import { getStorage } from "firebase-admin/storage";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminApp } from "@/lib/firebase/admin";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { parseGsPath } from "@/lib/admin/source-materials";
import { formatUuid } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const materialId = formatUuid(id);
  const shouldDownload = request.nextUrl.searchParams.get("download") === "1";

  try {
    const data = await adminDcQuery<{
      sourceMaterials: Array<{
        id: string;
        title: string;
        fileName: string;
        storagePath?: string | null;
      }>;
    }>("AdminListSourceMaterials").catch(() => ({ sourceMaterials: [] }));

    const material = data.sourceMaterials.find((entry) => formatUuid(entry.id) === materialId);
    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    const parsed = parseGsPath(material.storagePath ?? null);
    if (!parsed) {
      return NextResponse.json({ error: "Material storage path is invalid" }, { status: 400 });
    }

    const file = getStorage(adminApp).bucket(parsed.bucket).file(parsed.filePath);
    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 15 * 60 * 1000,
      responseDisposition: `${shouldDownload ? "attachment" : "inline"}; filename="${material.fileName.replace(/"/g, "")}"`,
    });

    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error("[admin/materials/[id]/asset]", error);
    return NextResponse.json({ error: "Unable to resolve source material asset" }, { status: 500 });
  }
}
