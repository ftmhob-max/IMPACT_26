import { getStorage } from "firebase-admin/storage";
import { adminApp } from "@/lib/firebase/admin";
import { previewAssessmentCsv } from "./csv";

export interface IngestionResult {
  parser: string;
  status: "parsed" | "failed";
  extractedText: string;
  metadata: Record<string, unknown>;
  errorMessage?: string;
}

export async function uploadSourceBuffer({
  buffer,
  storagePath,
  contentType,
}: {
  buffer: Buffer;
  storagePath: string;
  contentType: string;
}) {
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const bucket = bucketName ? getStorage(adminApp).bucket(bucketName) : getStorage(adminApp).bucket();
  const file = bucket.file(storagePath);
  await file.save(buffer, {
    contentType,
    resumable: false,
    metadata: { cacheControl: "private, max-age=0, no-transform" },
  });
  return `gs://${bucket.name}/${storagePath}`;
}

export async function ingestBuffer(buffer: Buffer, fileName: string, fileType: string): Promise<IngestionResult> {
  const lowerName = fileName.toLowerCase();

  try {
    if (fileType.includes("pdf") || lowerName.endsWith(".pdf")) {
      const mod = await import("pdf-parse");
      const pdfParse = (mod as any).default ?? (mod as any);
      const parsed = await pdfParse(buffer);
      return {
        parser: "pdf-parse",
        status: "parsed",
        extractedText: parsed.text ?? "",
        metadata: { pages: parsed.numpages ?? null, info: parsed.info ?? null },
      };
    }

    if (
      fileType.includes("wordprocessingml") ||
      fileType.includes("msword") ||
      lowerName.endsWith(".docx")
    ) {
      const mammoth = await import("mammoth");
      const parsed = await mammoth.extractRawText({ buffer });
      return {
        parser: "mammoth",
        status: "parsed",
        extractedText: parsed.value ?? "",
        metadata: { messages: parsed.messages ?? [] },
      };
    }

    if (fileType.includes("csv") || lowerName.endsWith(".csv")) {
      const text = buffer.toString("utf-8");
      const preview = previewAssessmentCsv(text);
      return {
        parser: "csv-parse",
        status: preview.errors.length ? "failed" : "parsed",
        extractedText: text,
        metadata: {
          rows: preview.validRows.length,
          validationErrors: preview.errors.length,
          duplicates: preview.duplicates.length,
        },
        errorMessage: preview.errors.length ? "CSV contains validation errors" : undefined,
      };
    }

    if (fileType.startsWith("text/") || lowerName.endsWith(".txt") || lowerName.endsWith(".md")) {
      return {
        parser: "text",
        status: "parsed",
        extractedText: buffer.toString("utf-8"),
        metadata: { characters: buffer.length },
      };
    }

    return {
      parser: "unsupported",
      status: "failed",
      extractedText: "",
      metadata: { fileType },
      errorMessage: "Unsupported file type. Upload PDF, DOCX, CSV, TXT, Markdown, or a transcript file.",
    };
  } catch (error) {
    return {
      parser: "auto",
      status: "failed",
      extractedText: "",
      metadata: { fileType },
      errorMessage: error instanceof Error ? error.message : "Unable to parse source material",
    };
  }
}
