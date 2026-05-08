import { NextResponse, type NextRequest } from "next/server";
import { parse as parseCsv } from "csv-parse/sync";
import { getAdminStorage } from "@/lib/firebase/admin-storage";
import { parse as parseHtml } from "node-html-parser";
import { requireAdminRequest } from "@/lib/admin/auth";
import { fetchAdminMaterialLibrary, findMaterialById } from "@/lib/admin/material-library";
import { ingestBuffer } from "@/lib/admin/ingestion";
import { parseGsPath } from "@/lib/admin/source-materials";
import { formatUuid } from "@/lib/utils";

function buildCsvPreview(text: string) {
  try {
    const rows = parseCsv(text, {
      bom: true,
      skip_empty_lines: true,
    }) as string[][];

    if (!rows.length) return null;
    const [headers, ...body] = rows;
    return {
      headers: headers.map((cell) => String(cell ?? "")),
      rows: body.slice(0, 12).map((row) => row.map((cell) => String(cell ?? ""))),
      totalRows: Math.max(0, rows.length - 1),
    };
  } catch {
    return null;
  }
}

async function loadAssetBuffer(material: Awaited<ReturnType<typeof fetchAdminMaterialLibrary>>[number]) {
  if (!material.storagePath) return null;
  const parsedPath = parseGsPath(material.storagePath);
  if (!parsedPath) return null;

  try {
    const file = getAdminStorage().bucket(parsedPath.bucket).file(parsedPath.filePath);
    const [buffer] = await file.download();
    return buffer;
  } catch {
    return null;
  }
}

async function hydrateExtractedTextFromAsset(
  material: Awaited<ReturnType<typeof fetchAdminMaterialLibrary>>[number],
  assetBuffer?: Buffer | null
) {
  if (material.hasExtractedText) return material;

  const buffer = assetBuffer ?? await loadAssetBuffer(material);
  if (!buffer) return material;

  try {
    const parsed = await ingestBuffer(buffer, material.fileName, material.fileType, material.sizeBytes || buffer.length);
    if (!parsed.extractedText) return material;

    return {
      ...material,
      extractedText: parsed.extractedText,
      hasExtractedText: true,
      characters: parsed.extractedText.length,
      metadata: { ...material.metadata, ...parsed.metadata },
      previewSnippet: parsed.extractedText.slice(0, 220),
    };
  } catch {
    return material;
  }
}

function sanitizeConvertedHtml(html: string) {
  const root = parseHtml(html);
  root.querySelectorAll("script,style,iframe,object,embed,form,input,button,select,textarea").forEach((node) => node.remove());

  for (const element of root.querySelectorAll("*")) {
    const tag = element.tagName.toLowerCase();
    for (const [attribute, rawValue] of Object.entries(element.attributes)) {
      const name = attribute.toLowerCase();
      const value = String(rawValue ?? "");

      if (name.startsWith("on") || name === "style" || name === "id" || name === "class") {
        element.removeAttribute(attribute);
        continue;
      }

      if ((name === "href" || name === "src") && value) {
        const safe = /^(https?:|mailto:|#|data:)/i.test(value);
        if (!safe) {
          element.removeAttribute(attribute);
        }
      }
    }

    if (tag === "a" && element.getAttribute("href")) {
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noreferrer");
    }

    if (tag === "img") {
      element.setAttribute("loading", "lazy");
      element.setAttribute("decoding", "async");
      if (!element.getAttribute("alt")) {
        element.setAttribute("alt", "Document image");
      }
    }
  }

  return root.toString();
}

async function buildFormattedDocxHtml(buffer: Buffer) {
  const mammoth = await import("mammoth");
  const result = await mammoth.convertToHtml({ buffer });
  return sanitizeConvertedHtml(result.value);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const materialId = formatUuid(id);

  try {
    const materials = await fetchAdminMaterialLibrary();
    const selected = findMaterialById(materials, materialId);
    if (!selected) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    const assetBuffer = await loadAssetBuffer(selected);
    const hydrated = await hydrateExtractedTextFromAsset(selected, assetBuffer);
    const csvPreview = hydrated.parser === "csv-parse" && hydrated.extractedText
      ? buildCsvPreview(hydrated.extractedText)
      : null;
    const formattedHtml = hydrated.parser === "mammoth" && assetBuffer
      ? await buildFormattedDocxHtml(assetBuffer).catch(() => null)
      : null;
    const formattedMode = hydrated.parser === "pdf-parse" && assetBuffer
      ? "pdf"
      : formattedHtml
        ? "docx"
        : null;

    return NextResponse.json({
      material: {
        id: hydrated.id,
        title: hydrated.title,
        fileName: hydrated.fileName,
        fileType: hydrated.fileType,
        status: hydrated.status,
        kind: hydrated.kind,
        parser: hydrated.parser,
        createdAt: hydrated.createdAt,
        updatedAt: hydrated.updatedAt,
        sizeBytes: hydrated.sizeBytes,
        pages: hydrated.pages,
        characters: hydrated.characters,
        hasAsset: hydrated.hasAsset,
        hasExtractedText: hydrated.hasExtractedText,
        metadata: hydrated.metadata,
        latestJob: hydrated.latestJob,
        linkCount: hydrated.linkCount,
        previewSnippet: hydrated.previewSnippet,
        assetHref: hydrated.hasAsset ? `/api/admin/materials/${hydrated.id}/asset` : null,
        assetDownloadHref: hydrated.hasAsset ? `/api/admin/materials/${hydrated.id}/asset?download=1` : null,
      },
      preview: {
        extractedText: hydrated.extractedText ?? "",
        csvPreview,
        links: hydrated.links,
        formattedMode,
        formattedHtml,
      },
    });
  } catch (error) {
    console.error("[admin/materials/[id]/preview]", error);
    return NextResponse.json({ error: "Unable to load source material preview" }, { status: 500 });
  }
}
