import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { ingestBuffer, uploadSourceBuffer } from "@/lib/admin/ingestion";
import { adminDcMutate, adminDcQuery } from "@/lib/firebase/admin-dc";

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;
  const data = await adminDcQuery<{ sourceMaterials: any[] }>("AdminListSourceMaterials").catch(() => ({
    sourceMaterials: [],
  }));
  return NextResponse.json({ materials: data.sourceMaterials });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const form = await request.formData();
  const file = form.get("file");
  const title = String(form.get("title") ?? "");
  if (!(file instanceof File) || !title.trim()) {
    return NextResponse.json({ error: "A title and file are required" }, { status: 400 });
  }

  const materialId = randomUUID();
  const jobId = randomUUID();
  const buffer = Buffer.from(await file.arrayBuffer());
  const storagePath = `source-materials/${materialId}/${file.name}`;

  try {
    const ingestion = await ingestBuffer(
      buffer,
      file.name,
      file.type || "application/octet-stream",
      file.size
    );

    if (ingestion.parser === "unsupported") {
      return NextResponse.json({ error: ingestion.errorMessage ?? "Unsupported file type" }, { status: 400 });
    }

    const storageUri = await uploadSourceBuffer({
      buffer,
      storagePath,
      contentType: file.type || "application/octet-stream",
    });

    await adminDcMutate("CreateSourceMaterial", {
      id: materialId,
      title: title.trim(),
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      storagePath: storageUri,
      downloadUrl: null,
      extractedText: ingestion.extractedText,
      metadataJson: JSON.stringify(ingestion.metadata),
      status: ingestion.status,
      uploadedById: auth.session.uid,
    });
    await adminDcMutate("CreateIngestionJob", {
      id: jobId,
      sourceMaterialId: materialId,
      status: ingestion.status === "failed" ? "failed" : "completed",
      parser: ingestion.parser,
      extractedCharacters: ingestion.extractedText.length,
      errorMessage: ingestion.errorMessage || null,
      completedAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: materialId, jobId, ingestion }, { status: 201 });
  } catch (error) {
    console.error("[admin/materials]", error);
    return NextResponse.json({ error: "Unable to ingest source material" }, { status: 500 });
  }
}
