import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { ingestBuffer, uploadSourceBuffer } from "@/lib/admin/ingestion";
import {
  computeMaterialLibraryCounts,
  fetchAdminMaterialFolders,
  fetchAdminMaterialLibrary,
  fetchAdminMaterialTags,
  listAdminMaterials,
} from "@/lib/admin/material-library";
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

function parseTagsValue(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((entry) => String(entry ?? "").trim()).filter(Boolean);
    }
  } catch {
    // Fall back to comma parsing below.
  }
  return value.split(",").map((entry) => entry.trim()).filter(Boolean);
}

function isMultipartFormData(contentType: string) {
  const lower = contentType.toLowerCase();
  return lower.startsWith("multipart/form-data") && lower.includes("boundary=");
}

async function ingestSourceMaterial({
  file,
  title,
  uploadedById,
  folderId,
  tagNames,
  courseId,
  lessonId,
}: {
  file: File;
  title: string;
  uploadedById: string;
  folderId?: string | null;
  tagNames?: string[];
  courseId?: string | null;
  lessonId?: string | null;
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
    folderId: folderId ?? null,
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

  if (courseId || lessonId) {
    await adminDcMutate("CreateContentSourceLink", {
      id: randomUUID(),
      sourceMaterialId: materialId,
      lessonId: lessonId ?? null,
      courseId: courseId ?? null,
      questionId: null,
      referenceLabel: "Upload link",
    }).catch(() => null);
  }

  if (tagNames?.length) {
    const existingTags = await fetchAdminMaterialTags();
    for (const name of tagNames) {
      const existing = existingTags.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
      const tagId = existing?.id ?? randomUUID();
      if (!existing) {
        await adminDcMutate("CreateSourceMaterialTag", {
          id: tagId,
          name,
          color: null,
          createdById: uploadedById,
        }).catch(() => null);
      }
      await adminDcMutate("CreateSourceMaterialTagAssignment", {
        sourceMaterialId: materialId,
        tagId,
      }).catch(() => null);
    }
  }

  await adminDcMutate("CreateSourceMaterialActivity", {
    id: randomUUID(),
    sourceMaterialId: materialId,
    folderId: folderId ?? null,
    actorId: uploadedById,
    activityType: "upload",
    message: `Uploaded ${file.name}`,
    metadataJson: JSON.stringify({ sizeBytes: file.size, parser: ingestion.parser }),
  }).catch(() => null);

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
  const lessonId = request.nextUrl.searchParams.get("lessonId") ?? undefined;
  const materials = await fetchAdminMaterialLibrary(query);
  const result = listAdminMaterials(materials, {
    q: query,
    lessonId,
    kind: request.nextUrl.searchParams.get("kind") ?? undefined,
    parser: request.nextUrl.searchParams.get("parser") ?? undefined,
    status: request.nextUrl.searchParams.get("status") ?? undefined,
    linked: request.nextUrl.searchParams.get("linked") ?? undefined,
    folderId: request.nextUrl.searchParams.get("folderId") ?? undefined,
    view: request.nextUrl.searchParams.get("view") ?? undefined,
    tags: request.nextUrl.searchParams.get("tags") ?? undefined,
    fileType: request.nextUrl.searchParams.get("fileType") ?? undefined,
    parserStatus: request.nextUrl.searchParams.get("parserStatus") ?? undefined,
    linkStatus: request.nextUrl.searchParams.get("linkStatus") ?? undefined,
    reviewStatus: request.nextUrl.searchParams.get("reviewStatus") ?? undefined,
    starred: request.nextUrl.searchParams.get("starred") ?? undefined,
    archived: request.nextUrl.searchParams.get("archived") ?? undefined,
    trashed: request.nextUrl.searchParams.get("trashed") ?? undefined,
    uploadedById: auth.session.uid,
    hasAsset: request.nextUrl.searchParams.get("hasAsset") ?? undefined,
    hasText: request.nextUrl.searchParams.get("hasText") ?? undefined,
    sort: request.nextUrl.searchParams.get("sort") ?? undefined,
    direction: request.nextUrl.searchParams.get("direction") ?? undefined,
    page: Number(request.nextUrl.searchParams.get("page") ?? 1),
    limit: Number(request.nextUrl.searchParams.get("limit") ?? 50),
  });
  const folders = await fetchAdminMaterialFolders();
  const tags = await fetchAdminMaterialTags();
  const folderCounts = new Map<string, number>();
  for (const material of materials) {
    if (material.folder?.id && !material.archivedAt && !material.trashedAt) {
      folderCounts.set(material.folder.id, (folderCounts.get(material.folder.id) ?? 0) + 1);
    }
  }

  return NextResponse.json({
    folders: folders.map((folder) => ({
      ...folder,
      materialCount: folderCounts.get(folder.id) ?? 0,
    })),
    tags,
    materials: result.materials.map((material) => ({
      id: material.id,
      title: material.title,
      fileName: material.fileName,
      fileType: material.fileType,
      status: material.status,
      displayStatus: material.displayStatus,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
      starred: material.starred,
      archivedAt: material.archivedAt,
      trashedAt: material.trashedAt,
      reviewStatus: material.reviewStatus,
      visibility: material.visibility,
      duplicateOf: material.duplicateOf,
      lastActivityAt: material.lastActivityAt,
      folder: material.folder,
      uploader: material.uploader,
      tags: material.tags,
      activities: material.activities,
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
      ...(lessonId ? { links: material.links.filter((link) => link.lesson?.id === lessonId) } : {}),
    })),
    pagination: result.pagination,
    sort: result.sort,
    direction: result.direction,
    query: result.query,
    counts: computeMaterialLibraryCounts(materials),
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
    let tagNames: string[] = [];
    let singleTitle = "";
    let folderId: string | null = null;
    let courseId: string | null = null;
    let lessonId: string | null = null;

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
      tagNames = parseTagsValue(form.get("tags"));
      singleTitle = String(form.get("title") ?? "").trim();
      folderId = String(form.get("folderId") ?? "").trim() || null;
      courseId = String(form.get("courseId") ?? "").trim() || null;
      lessonId = String(form.get("lessonId") ?? "").trim() || null;
    } else {
      // Raw binary upload
      const fileName = decodeURIComponent(request.headers.get("x-file-name") || "upload.bin");
      const fileType = contentType;
      singleTitle = decodeURIComponent(request.headers.get("x-title") || "");
      folderId = decodeURIComponent(request.headers.get("x-folder-id") || "").trim() || null;
      tagNames = decodeURIComponent(request.headers.get("x-tags") || "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
      courseId = decodeURIComponent(request.headers.get("x-course-id") || "").trim() || null;
      lessonId = decodeURIComponent(request.headers.get("x-lesson-id") || "").trim() || null;
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
          folderId,
          tagNames,
          courseId,
          lessonId,
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
