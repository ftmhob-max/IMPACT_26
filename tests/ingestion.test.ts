import test from "node:test";
import assert from "node:assert/strict";

import { ingestBuffer, normalizeWhisperTranscript } from "@/lib/admin/ingestion";

function withEnv<T>(updates: Record<string, string | undefined>, fn: () => Promise<T> | T) {
  const previous = new Map<string, string | undefined>();
  for (const key of Object.keys(updates)) {
    previous.set(key, process.env[key]);
    const value = updates[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  return Promise.resolve()
    .then(fn)
    .finally(() => {
      for (const [key, value] of previous) {
        if (value === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = value;
        }
      }
    });
}

function tinyPdfBuffer() {
  const lines = [
    "%PDF-1.4",
    "1 0 obj",
    "<< /Type /Catalog /Pages 2 0 R >>",
    "endobj",
    "2 0 obj",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "endobj",
    "3 0 obj",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "endobj",
    "4 0 obj",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "endobj",
  ];
  const stream = "BT /F1 18 Tf 40 90 Td (Hello searchable PDF) Tj ET";
  lines.push(
    "5 0 obj",
    `<< /Length ${stream.length} >>`,
    "stream",
    stream,
    "endstream",
    "endobj"
  );

  let pdf = `${lines.join("\n")}\n`;
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += [
    "xref",
    "0 6",
    "0000000000 65535 f ",
    "0000000010 00000 n ",
    "0000000059 00000 n ",
    "0000000116 00000 n ",
    "0000000241 00000 n ",
    "0000000311 00000 n ",
    "trailer",
    "<< /Size 6 /Root 1 0 R >>",
    "startxref",
    String(xrefOffset),
    "%%EOF",
  ].join("\n");
  return Buffer.from(pdf, "utf-8");
}

test("ingestBuffer parses PDF text and page metadata", async () => {
  const result = await ingestBuffer(tinyPdfBuffer(), "sample.pdf", "application/pdf");

  assert.equal(result.parser, "pdf-parse");
  assert.equal(result.status, "parsed");
  assert.match(result.extractedText, /Hello searchable PDF/);
  assert.equal(result.metadata.pages, 1);
});

test("ingestBuffer fails oversized audio before invoking local transcription", async () => {
  await withEnv({ SOURCE_MATERIAL_MAX_TRANSCRIPTION_MB: "1" }, async () => {
    const result = await ingestBuffer(Buffer.alloc(2 * 1024 * 1024), "large.mp3", "audio/mpeg");

    assert.equal(result.parser, "whisper");
    assert.equal(result.status, "failed");
    assert.match(result.errorMessage ?? "", /too large/i);
  });
});

test("ingestBuffer reports missing local transcription dependency clearly", async () => {
  await withEnv({ WHISPER_BINARY: "__impact_missing_whisper_binary__" }, async () => {
    const result = await ingestBuffer(Buffer.from("not real audio"), "clip.mp3", "audio/mpeg");

    assert.equal(result.parser, "whisper");
    assert.equal(result.status, "failed");
    assert.match(result.errorMessage ?? "", /whisper|ffmpeg/i);
  });
});

test("normalizeWhisperTranscript joins segment text cleanly", () => {
  assert.equal(
    normalizeWhisperTranscript({
      text: "fallback text",
      segments: [{ text: " First sentence. " }, { text: "" }, { text: "Second sentence." }],
    }),
    "First sentence.\nSecond sentence."
  );
});
