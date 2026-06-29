import test from "node:test";
import assert from "node:assert/strict";

import { computeMaterialLibraryCounts, listAdminMaterials, normalizeMaterialRecord } from "@/lib/admin/material-library";

function rawMaterial(overrides: Record<string, unknown> = {}) {
  return {
    id: crypto.randomUUID(),
    title: "Licensing and Valuation",
    fileName: "Licensing-and-Valuation.pdf",
    fileType: "application/pdf",
    storagePath: "gs://bucket/source-materials/example.pdf",
    downloadUrl: null,
    extractedText: "Assessment licensing rules and valuation practice.",
    metadataJson: JSON.stringify({ sizeBytes: 1024, topicTags: ["Licensing", "Valuation"] }),
    status: "parsed",
    createdAt: "2026-05-01",
    updatedAt: "2026-05-02",
    starred: false,
    archivedAt: null,
    trashedAt: null,
    reviewStatus: "unreviewed",
    visibility: "admin",
    duplicateOf: null,
    lastActivityAt: "2026-05-03",
    folder: {
      id: "11111111-1111-4111-8111-111111111111",
      name: "Course Sources",
      folderType: "course",
      parentFolder: null,
      archivedAt: null,
      trashedAt: null,
    },
    uploadedBy: { id: "admin-1", email: "admin@example.com", fullName: "Admin User" },
    sourceMaterialTagAssignments_on_sourceMaterial: [],
    sourceMaterialActivities_on_sourceMaterial: [],
    ingestionJobs_on_sourceMaterial: [{
      id: crypto.randomUUID(),
      status: "completed",
      parser: "pdf-parse",
      extractedCharacters: 54,
      errorMessage: null,
      createdAt: "2026-05-01",
      completedAt: "2026-05-01",
    }],
    contentSourceLinks_on_sourceMaterial: [],
    ...overrides,
  } as any;
}

test("normalizeMaterialRecord derives Drive library fields from source material data", () => {
  const record = normalizeMaterialRecord(rawMaterial());

  assert.equal(record.folder?.name, "Course Sources");
  assert.equal(record.uploader?.fullName, "Admin User");
  assert.equal(record.tags.map((tag) => tag.name).join(","), "Licensing,Valuation");
  assert.equal(record.displayStatus, "unlinked");
  assert.equal(record.hasAsset, true);
});

test("listAdminMaterials filters by folder, tags, views, and status intelligence", () => {
  const folderId = "11111111-1111-4111-8111-111111111111";
  const ready = normalizeMaterialRecord(rawMaterial({
    contentSourceLinks_on_sourceMaterial: [{ id: crypto.randomUUID(), referenceLabel: "Primary", createdAt: "2026-05-02", lesson: { id: crypto.randomUUID(), title: "Appeals", module: null } }],
  }));
  const failed = normalizeMaterialRecord(rawMaterial({
    id: crypto.randomUUID(),
    title: "Failed Audio",
    fileName: "failed-audio.mp3",
    fileType: "audio/mpeg",
    status: "failed",
    metadataJson: JSON.stringify({ sizeBytes: 2048, kind: "audio", topicTags: ["Audio"] }),
    folder: null,
    ingestionJobs_on_sourceMaterial: [{ id: crypto.randomUUID(), status: "failed", parser: "whisper", extractedCharacters: 0, errorMessage: "missing ffmpeg" }],
  }));

  assert.equal(listAdminMaterials([ready, failed], { folderId, tags: "Licensing" }).materials.length, 1);
  assert.equal(listAdminMaterials([ready, failed], { view: "linked" }).materials[0].id, ready.id);
  assert.equal(listAdminMaterials([ready, failed], { view: "failed" }).materials[0].id, failed.id);
  assert.equal(listAdminMaterials([ready, failed], { status: "failed" }).materials[0].displayStatus, "failed");
});

test("computeMaterialLibraryCounts and queue view align with dashboard ingestion queue", () => {
  const ready = normalizeMaterialRecord(rawMaterial({
    contentSourceLinks_on_sourceMaterial: [{ id: crypto.randomUUID(), referenceLabel: "Primary", createdAt: "2026-05-02", lesson: { id: crypto.randomUUID(), title: "Appeals", module: null } }],
  }));
  const queued = normalizeMaterialRecord(rawMaterial({
    id: crypto.randomUUID(),
    title: "Pending PDF",
    status: "uploaded",
  }));
  const failed = normalizeMaterialRecord(rawMaterial({
    id: crypto.randomUUID(),
    title: "Failed Audio",
    fileName: "failed-audio.mp3",
    fileType: "audio/mpeg",
    status: "failed",
    metadataJson: JSON.stringify({ sizeBytes: 2048, kind: "audio" }),
    folder: null,
    ingestionJobs_on_sourceMaterial: [{ id: crypto.randomUUID(), status: "failed", parser: "whisper", extractedCharacters: 0, errorMessage: "missing ffmpeg" }],
  }));

  const counts = computeMaterialLibraryCounts([ready, queued, failed]);
  assert.equal(counts.total, 3);
  assert.equal(counts.queue, 2);
  assert.equal(counts.failed, 1);
  assert.equal(counts.unlinked, 2);
  assert.equal(listAdminMaterials([ready, queued, failed], { view: "queue" }).materials.length, 2);
});
