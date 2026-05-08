import { NextResponse, type NextRequest } from "next/server";
import { getAdminStorage } from "@/lib/firebase/admin-storage";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { parseGsPath } from "@/lib/admin/source-materials";
import { formatUuid } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRequest(request, "viewer");
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
        fileType: string;
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

    const file = getAdminStorage().bucket(parsed.bucket).file(parsed.filePath);

    // Try signed URL first (works when service account has signBlob permission).
    // Fall back to direct streaming when running with Application Default Credentials
    // on Cloud Run where signBlob is not granted.
    try {
      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 15 * 60 * 1000,
        responseDisposition: `${shouldDownload ? "attachment" : "inline"}; filename="${material.fileName.replace(/"/g, "")}"`,
      });
      return NextResponse.redirect(signedUrl);
    } catch {
      // Signed URL failed — stream directly through the API route
      const [buffer] = await file.download();
      const contentType = material.fileType || "application/octet-stream";
      const disposition = `${shouldDownload ? "attachment" : "inline"}; filename="${material.fileName.replace(/"/g, "")}"`;

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": disposition,
          "Content-Length": String(buffer.length),
          "Cache-Control": "private, max-age=300",
        },
      });
    }
  } catch (error) {
    console.error("[admin/materials/[id]/asset]", error);
    return NextResponse.json({ error: "Unable to resolve source material asset" }, { status: 500 });
  }
}
