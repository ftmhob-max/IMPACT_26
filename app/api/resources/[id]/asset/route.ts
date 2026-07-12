// Backend authorized learner asset stream: app/api/resources/[id]/asset/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { Readable } from "node:stream";

import { parseGsPath } from "@/lib/admin/source-materials";
import { getAdminStorage } from "@/lib/firebase/admin";
import { requireLearnerRequest } from "@/lib/firebase/auth-server";
import {
  getLearnerSourceMaterialAccess,
  getLearnerSourceMaterialAccessStatus,
} from "@/lib/firebase/learner-portal";
import { formatUuid } from "@/lib/utils";

interface ByteRange {
  start: number;
  end: number;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseByteRange(rangeHeader: string, totalLength: number): ByteRange | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
  if (!match || totalLength <= 0) return null;

  const [, rawStart = "", rawEnd = ""] = match;
  if (!rawStart && !rawEnd) return null;

  if (!rawStart) {
    const suffixLength = Number.parseInt(rawEnd, 10);
    if (!Number.isFinite(suffixLength) || suffixLength <= 0) return null;
    return {
      start: Math.max(totalLength - suffixLength, 0),
      end: totalLength - 1,
    };
  }

  const start = Number.parseInt(rawStart, 10);
  const end = rawEnd ? Number.parseInt(rawEnd, 10) : totalLength - 1;
  if (
    !Number.isFinite(start)
    || !Number.isFinite(end)
    || start < 0
    || start >= totalLength
    || end < start
  ) {
    return null;
  }

  return { start, end: Math.min(end, totalLength - 1) };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authentication = await requireLearnerRequest(request);
  if (!authentication.ok) return authentication.response;

  try {
    const materialId = formatUuid((await params).id);
    if (!UUID_PATTERN.test(materialId)) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }
    const material = await getLearnerSourceMaterialAccess(materialId);
    if (getLearnerSourceMaterialAccessStatus(material) !== "allowed" || !material) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const storageLocation = parseGsPath(material.storagePath);
    if (!storageLocation) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const storageFile = getAdminStorage()
      .bucket(storageLocation.bucket)
      .file(storageLocation.filePath);
    const safeFileName = material.fileName.replace(/["\r\n]/g, "");
    const shouldDownload = request.nextUrl.searchParams.get("download") === "1";
    const contentDisposition =
      `${shouldDownload ? "attachment" : "inline"}; filename="${safeFileName}"`;

    // Prefer a short-lived signed URL so Storage handles byte ranges directly.
    // Local credentials may not support signing, so retain a streaming fallback.
    try {
      const [signedUrl] = await storageFile.getSignedUrl({
        action: "read",
        expires: Date.now() + 15 * 60 * 1000,
        responseDisposition: contentDisposition,
        responseType: material.fileType || "application/octet-stream",
      });
      return NextResponse.redirect(signedUrl);
    } catch {
      // Continue with authenticated proxy streaming when signing is unavailable.
    }

    const [storageMetadata] = await storageFile.getMetadata().catch(() => [null]);
    const totalLength = Number(storageMetadata?.size);
    if (!storageMetadata || !Number.isSafeInteger(totalLength) || totalLength < 0) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const sharedHeaders = {
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=300",
      "Content-Disposition": contentDisposition,
      "Content-Type": material.fileType || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    };
    const rangeHeader = request.headers.get("range");

    if (rangeHeader) {
      const byteRange = parseByteRange(rangeHeader, totalLength);
      if (!byteRange) {
        return new NextResponse(null, {
          status: 416,
          headers: {
            ...sharedHeaders,
            "Content-Range": `bytes */${totalLength}`,
          },
        });
      }

      const partialLength = byteRange.end - byteRange.start + 1;
      const partialStream = storageFile.createReadStream({
        start: byteRange.start,
        end: byteRange.end,
      });
      return new NextResponse(Readable.toWeb(partialStream) as ReadableStream, {
        status: 206,
        headers: {
          ...sharedHeaders,
          "Content-Length": String(partialLength),
          "Content-Range": `bytes ${byteRange.start}-${byteRange.end}/${totalLength}`,
        },
      });
    }

    const assetStream = storageFile.createReadStream();
    return new NextResponse(Readable.toWeb(assetStream) as ReadableStream, {
      headers: {
        ...sharedHeaders,
        "Content-Length": String(totalLength),
      },
    });
  } catch (error) {
    console.error("[api/resources/asset:GET]", error);
    return NextResponse.json({ error: "Unable to stream resource" }, { status: 500 });
  }
}
