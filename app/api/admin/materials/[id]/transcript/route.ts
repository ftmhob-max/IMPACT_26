import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import { adminDcMutate } from "@/lib/firebase/admin-dc";
import { fetchAdminMaterialLibrary, findMaterialById } from "@/lib/admin/material-library";
import { formatUuid } from "@/lib/utils";

const MAX_TRANSCRIPT_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const materialId = formatUuid(id);

  const materials = await fetchAdminMaterialLibrary();
  const selected = findMaterialById(materials, materialId);
  if (!selected) {
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  }

  let transcriptText: string;

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    // File upload: accept a single .txt file via multipart form
    const formData = await request.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file found. Send a .txt file in the 'file' field." }, { status: 400 });
    }
    const arrayBuffer = await (file as File).arrayBuffer();
    if (arrayBuffer.byteLength > MAX_TRANSCRIPT_BYTES) {
      return NextResponse.json({ error: "Transcript file exceeds 5 MB limit." }, { status: 400 });
    }
    transcriptText = Buffer.from(arrayBuffer).toString("utf-8");
  } else {
    // Raw text body
    const raw = await request.text().catch(() => "");
    if (raw.length > MAX_TRANSCRIPT_BYTES) {
      return NextResponse.json({ error: "Transcript text exceeds 5 MB limit." }, { status: 400 });
    }
    transcriptText = raw;
  }

  transcriptText = transcriptText.replace(/\r\n/g, "\n").trim();

  await adminDcMutate("UpdateSourceMaterial", {
    id: materialId,
    extractedText: transcriptText,
    metadataJson: JSON.stringify({
      ...selected.metadata,
      transcriptSource: "upload",
      transcriptUpdatedAt: new Date().toISOString(),
    }),
    status: transcriptText ? "parsed" : selected.status,
  });

  await adminDcMutate("CreateSourceMaterialActivity", {
    id: randomUUID(),
    sourceMaterialId: materialId,
    folderId: selected.folder?.id ?? null,
    actorId: auth.session.uid,
    activityType: "manual-transcript",
    message: "Uploaded transcript file",
    metadataJson: JSON.stringify({ characters: transcriptText.length }),
  }).catch(() => null);

  return NextResponse.json({ ok: true, characters: transcriptText.length });
}
