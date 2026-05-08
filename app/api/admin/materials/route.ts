import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { ingestBuffer, uploadSourceBuffer } from "@/lib/admin/ingestion";
import { listAdminMaterials, fetchAdminMaterialLibrary } from "@/lib/admin/material-library";
import { adminDcMutate } from "@/lib/firebase/admin-dc";

export const maxDuration = 600;

function isFormDataFile(
  value: FormDataEntryValue | null
): value is File {
  return !!value
    && typeof value === "object"
    && "arrayBuffer" in value
    && typeof value.arrayBuffer === "function"
    && "name" in value
    && typeof value.name === "string";
}

function deriveTitleFromFileName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
}

function parseTitlesJson(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((entry) => String(entry ?? "").trim());
  } catch {
    return [];
  }
}

function isMultipartFormData(contentType: string) {
  const lower = contentType.toLowerCase();
  return lower.startsWith("multipart/form-data") && lower.includes("boundary=");
}

async function ingestSourceMaterial({
  file,
  title,
  uploadedById,
}: {
  file: File;
  title: string;
  uploadedById: string;
}) {
  const materialId = randomUUID();
  const jobId = randomUUID();
  const buffer = Buffer.from(await file.arrayBuffer());
  const storagePath = `source-materials/${materialId}/${file.name}`;

  const ingestion = await ingestBuffer(
    buffer,
    file.name,
    file.type || "application/octet-stream",
    file.size
  );

  if (ingestion.parser === "unsupported") {
    throw new Error(ingestion.errorMessage ?? "Unsupported file type");
  }

  let storageUri = "";
  let storageWarning: string | null = null;
  try {
    storageUri = await uploadSourceBuffer({
      buffer,
      storagePath,
      contentType: file.type || "application/octet-stream",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.toLowerCase().includes("bucket does not exist") && !message.toLowerCase().includes("no default bucket") && !message.toLowerCase().includes("bucket name not specified")) {
      throw error;
    }

    storageWarning = "Original file upload skipped because no Firebase Storage bucket is configured.";
  }

  const persistedMetadata = {
    ...ingestion.metadata,
    storageUploaded: Boolean(storageUri),
    ...(storageWarning ? { storageWarning } : {}),
  };

  const sourceMaterialPayload = {
    id: materialId,
    title,
    fileName: file.name,
    fileType: file.type || "application/octet-stream",
    storagePath: storageUri,
    downloadUrl: null,
    extractedText: ingestion.extractedText,
    metadataJson: JSON.stringify(persistedMetadata),
    status: ingestion.status,
  };

  try {
    await adminDcMutate("CreateSourceMaterial", {
      ...sourceMaterialPayload,
      uploadedById,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("source_materials_uploaded_by_id_fkey")) {
      throw error;
    }

    await adminDcMutate("CreateSourceMaterial", {
      ...sourceMaterialPayload,
      uploadedById: null,
    });
  }

  await adminDcMutate("CreateIngestionJob", {
    id: jobId,
    sourceMaterialId: materialId,
    status: ingestion.status === "failed" ? "failed" : "completed",
    parser: ingestion.parser,
    extractedCharacters: ingestion.extractedText.length,
    errorMessage: ingestion.errorMessage || null,
    completedAt: new Date().toISOString().split("T")[0],
  });

  return {
    id: materialId,
    jobId,
    title,
    fileName: file.name,
    ingestion: {
      ...ingestion,
      metadata: persistedMetadata,
    },
    storageWarning,
  };
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const materials = await fetchAdminMaterialLibrary(query);
  const result = listAdminMaterials(materials, {
    q: query,
    kind: request.nextUrl.searchParams.get("kind") ?? undefined,
    parser: request.nextUrl.searchParams.get("parser") ?? undefined,
    status: request.nextUrl.searchParams.get("status") ?? undefined,
    linked: request.nextUrl.searchParams.get("linked") ?? undefined,
    hasAsset: request.nextUrl.searchParams.get("hasAsset") ?? undefined,
    hasText: request.nextUrl.searchParams.get("hasText") ?? undefined,
    sort: request.nextUrl.searchParams.get("sort") ?? undefined,
    direction: request.nextUrl.searchParams.get("direction") ?? undefined,
    page: Number(request.nextUrl.searchParams.get("page") ?? 1),
    limit: Number(request.nextUrl.searchParams.get("limit") ?? 50),
  });

  return NextResponse.json({
    materials: result.materials.map((material) => ({
      id: material.id,
      title: material.title,
      fileName: material.fileName,
      fileType: material.fileType,
      status: material.status,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
      kind: material.kind,
      parser: material.parser,
      sizeBytes: material.sizeBytes,
      pages: material.pages,
      characters: material.characters,
      hasAsset: material.hasAsset,
      hasExtractedText: material.hasExtractedText,
      previewSnippet: material.previewSnippet,
      linkCount: material.linkCount,
      latestJob: material.latestJob,
      metadata: material.metadata,
    })),
    pagination: result.pagination,
    sort: result.sort,
    direction: result.direction,
    query: result.query,
  });
}

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await requireAdminRequest(request, "instructor");
    if (!adminCheck.ok) {
      return adminCheck.response;
    }
    const uploadedById = adminCheck.session.uid;
    const contentType = request.headers.get("content-type") || "";
    let files: File[] = [];
    let parsedTitles: string[] = [];
    let singleTitle = "";

    if (contentType.toLowerCase().startsWith("multipart/form-data")) {
      if (!isMultipartFormData(contentType)) {
        return NextResponse.json(
          { error: "Malformed multipart upload. Let the browser set the multipart boundary automatically." },
          { status: 400 }
        );
      }

      let form: FormData;
      try {
        form = await request.formData();
      } catch {
        return NextResponse.json(
          { error: "Malformed multipart upload. Please retry the upload." },
          { status: 400 }
        );
      }
      const batchFiles = form.getAll("files").filter(isFormDataFile);
      const singleFile = form.get("file");
      files = batchFiles.length
        ? batchFiles
        : (isFormDataFile(singleFile) ? [singleFile] : []);
      parsedTitles = parseTitlesJson(form.get("titlesJson"));
      singleTitle = String(form.get("title") ?? "").trim();
    } else {
      // Raw binary upload
      const fileName = decodeURIComponent(request.headers.get("x-file-name") || "upload.bin");
      const fileType = contentType;
      singleTitle = decodeURIComponent(request.headers.get("x-title") || "");
      const arrayBuffer = await request.arrayBuffer();
      const file = new File([arrayBuffer], fileName, { type: fileType });
      files = [file];
    }

    if (!files.length) {
      return NextResponse.json({ error: "At least one file is required" }, { status: 400 });
    }

    const created: Array<Awaited<ReturnType<typeof ingestSourceMaterial>>> = [];
    const failed: Array<{ fileName: string; title: string; error: string }> = [];

    for (const [index, file] of files.entries()) {
      const title = parsedTitles[index]
        || (files.length === 1 && singleTitle ? singleTitle : "")
        || deriveTitleFromFileName(file.name);

      try {
        const result = await ingestSourceMaterial({
          file,
          title,
          uploadedById,
        });
        created.push(result);
      } catch (error) {
        failed.push({
          fileName: file.name,
          title,
          error: error instanceof Error ? error.message : "Unable to ingest source material",
        });
      }
    }

    if (!created.length) {
      return NextResponse.json({
        error: failed[0]?.error ?? "Unable to ingest source material",
        created,
        failed,
        summary: {
          total: files.length,
          succeeded: 0,
          failed: failed.length,
          warnings: 0,
        },
      }, { status: 400 });
    }

    const warnings = created.filter((entry) => entry.storageWarning).length;
    const responseStatus = failed.length ? 207 : 201;

    return NextResponse.json({
      id: created.at(-1)?.id ?? created[0].id,
      created,
      failed,
      summary: {
        total: files.length,
        succeeded: created.length,
        failed: failed.length,
        warnings,
      },
    }, { status: responseStatus });
  } catch (error: any) {
    require('fs').appendFileSync('/tmp/impact-materials-error.log', String(error?.stack || error) + '\n');
    console.error("[admin/materials] POST error:", error);
    return NextResponse.json({ error: "Unable to ingest source material" }, { status: 500 });
  }
}
