import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import Mux from "@mux/mux-node";

function getMuxClient() {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) {
    throw new Error("MUX_TOKEN_ID and MUX_TOKEN_SECRET must be set");
  }
  return new Mux({ tokenId, tokenSecret });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  try {
    const mux = getMuxClient();

    // Create a direct upload — Mux returns a one-time upload URL.
    // cors_origin restricts which origin can POST to the upload URL.
    const origin = request.headers.get("origin") ?? "*";
    const upload = await mux.video.uploads.create({
      cors_origin: origin,
      new_asset_settings: {
        playback_policy: ["public"],
        encoding_tier: "baseline",
      },
    });

    // Return the upload URL and upload ID so the client can poll for status
    return NextResponse.json({
      uploadUrl: upload.url,
      uploadId: upload.id,
    });
  } catch (err: any) {
    const msg = err?.message ?? "Unknown error";
    if (msg.includes("MUX_TOKEN_ID") || msg.includes("MUX_TOKEN_SECRET")) {
      return NextResponse.json(
        { error: "Mux credentials are not configured. Set MUX_TOKEN_ID and MUX_TOKEN_SECRET in your environment." },
        { status: 503 }
      );
    }
    console.error("[admin/video/upload-url]", err);
    return NextResponse.json({ error: "Unable to create Mux upload URL" }, { status: 500 });
  }
}

// Poll upload status — returns playbackId once asset is ready
export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "instructor");
  if (!auth.ok) return auth.response;

  const uploadId = request.nextUrl.searchParams.get("uploadId");
  if (!uploadId) {
    return NextResponse.json({ error: "uploadId is required" }, { status: 400 });
  }

  try {
    const mux = getMuxClient();
    const upload = await mux.video.uploads.retrieve(uploadId);

    // upload.asset_id is available once Mux has processed the file
    if (upload.status === "errored") {
      return NextResponse.json({ status: "errored", error: "Mux upload failed" });
    }

    if (!upload.asset_id) {
      return NextResponse.json({ status: upload.status });
    }

    // Fetch the asset to get its playback ID
    const asset = await mux.video.assets.retrieve(upload.asset_id);
    const playbackId = asset.playback_ids?.find((p) => p.policy === "public")?.id ?? null;

    return NextResponse.json({
      status: asset.status, // preparing | ready | errored
      assetId: asset.id,
      playbackId,
    });
  } catch (err) {
    console.error("[admin/video/upload-url:poll]", err);
    return NextResponse.json({ error: "Unable to poll upload status" }, { status: 500 });
  }
}
