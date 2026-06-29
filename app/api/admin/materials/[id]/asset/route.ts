import { NextResponse, type NextRequest } from "next/server";
import { getAdminStorage } from "@/lib/firebase/admin";
import { adminAuth } from "@/lib/firebase/admin";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { parseGsPath } from "@/lib/admin/source-materials";
import { formatUuid } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = request.headers.get("Authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const sessionCookie = request.headers.get("Cookie")?.match(/(?:^|;\s*)__session=([^;]+)/)?.[1];

  const url = new URL(request.url);
  const queryToken = url.searchParams.get("token") || url.searchParams.get("idToken");
  const tokenToVerify = bearer || queryToken;

  let authenticated = false;
  try {
    const decoded = tokenToVerify
      ? await adminAuth.verifyIdToken(tokenToVerify)
      : sessionCookie
        ? await adminAuth.verifySessionCookie(decodeURIComponent(sessionCookie), false)
        : null;
    if (decoded) {
      authenticated = true;
    }
  } catch (e) {
    // Ignore error
  }

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const materialId = formatUuid(id);
  const shouldDownload = request.nextUrl.searchParams.get("download") === "1";
  const shouldStreamInline = request.nextUrl.searchParams.get("stream") === "1";

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
    let signedUrl: string | null = null;
    if (!shouldStreamInline) {
      try {
        [signedUrl] = await file.getSignedUrl({
          action: "read",
          expires: Date.now() + 15 * 60 * 1000,
          responseDisposition: `${shouldDownload ? "attachment" : "inline"}; filename="${material.fileName.replace(/"/g, "")}"`,
        });
      } catch {
        // Use direct streaming below when signing is unavailable.
      }
    }
    if (signedUrl) {
      return NextResponse.redirect(signedUrl);
    }
    {
      // Signed URL failed — stream directly through the API route
      const [buffer] = await file.download();
      const contentType = material.fileType || "application/octet-stream";
      const disposition = `${shouldDownload ? "attachment" : "inline"}; filename="${material.fileName.replace(/"/g, "")}"`;

      const range = request.headers.get("range");
      const totalLength = buffer.length;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : totalLength - 1;
        const chunksize = (end - start) + 1;
        const slice = buffer.subarray(start, end + 1);

        return new NextResponse(slice, {
          status: 206,
          headers: {
            "Content-Range": `bytes ${start}-${end}/${totalLength}`,
            "Accept-Ranges": "bytes",
            "Content-Length": String(chunksize),
            "Content-Type": contentType,
            "Content-Disposition": disposition,
            "Cache-Control": "private, max-age=300",
          },
        });
      }

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Accept-Ranges": "bytes",
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
