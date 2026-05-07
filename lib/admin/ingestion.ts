import { getStorage } from "firebase-admin/storage";
import { adminApp } from "@/lib/firebase/admin";
import { previewAssessmentCsv } from "./csv";
import { getFileExtension, getSourceMaterialKind, isPreviewableMediaKind } from "./source-materials";

// ─── Auto metadata tagging ─────────────────────────────────────────────────────

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  appraisal: [
    "uspap", "appraisal", "appraise", "appraiser", "market value", "comparable",
    "comparable sale", "sales comparison", "cost approach", "income approach",
    "reconciliation", "depreciation", "highest and best use", "land value",
    "replacement cost", "reproduction cost", "effective age", "economic life",
    "functional obsolescence", "external obsolescence", "physical deterioration",
  ],
  math: [
    "gross rent multiplier", "grm", "capitalization rate", "cap rate", "noi",
    "net operating income", "gross income multiplier", "gim", "direct capitalization",
    "yield capitalization", "discount rate", "irr", "internal rate of return",
    "present value", "future value", "ratio study", "coefficient of dispersion",
    "cod", "price related differential", "prd", "median", "mean", "regression",
    "assessment ratio", "equalization", "factor",
  ],
  law: [
    "standard", "ethics", "competency", "scope of work", "uspap", "advisory opinion",
    "jurisdictional exception", "departure", "binding", "supplemental standard",
    "record keeping", "confidentiality", "management", "advocacy", "appraiser independence",
    "dodd-frank", "firrea", "regulation",
  ],
  philly: [
    "philadelphia", "philly", "opa", "office of property assessment", "brt",
    "board of revision of taxes", "first judicial", "l&i", "licenses and inspections",
    "zoning", "variance", "aba", "actual value initiative", "avi",
  ],
  admin: [
    "assessment administration", "mass appraisal", "caama", "iaao", "property tax",
    "tax assessment", "parcel", "cama", "computer assisted", "cyclical reappraisal",
    "appeal", "hearing", "uniformity", "equity",
  ],
  ethics: [
    "conflict of interest", "bias", "impartiality", "mislead", "fraud",
    "misrepresentation", "professional conduct", "license", "certification",
    "disciplinary", "complaint", "state board",
  ],
};

const DIFFICULTY_SIGNALS = {
  easy: ["definition", "define", "what is", "identify", "list", "name", "describe"],
  expert: [
    "analyze", "evaluate", "reconcile", "justify", "calculate", "derive",
    "compare and contrast", "critique", "synthesize", "regulatory", "complex",
  ],
};

export function detectMetadata(text: string): {
  domains: string[];
  suggestedDifficulty: string;
  topicTags: string[];
} {
  const lower = text.toLowerCase();

  // Domain detection
  const domainScores: Record<string, number> = {};
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      const matches = lower.match(regex);
      if (matches) score += matches.length;
    }
    if (score > 0) domainScores[domain] = score;
  }

  const domains = Object.entries(domainScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .filter(([, score]) => score >= 2)
    .map(([domain]) => domain);

  // Difficulty heuristic
  let suggestedDifficulty = "proficient";
  const expertCount = DIFFICULTY_SIGNALS.expert.filter((kw) => lower.includes(kw)).length;
  const easyCount = DIFFICULTY_SIGNALS.easy.filter((kw) => lower.includes(kw)).length;
  if (expertCount >= 2) suggestedDifficulty = "expert";
  else if (easyCount >= 2 && expertCount === 0) suggestedDifficulty = "easy";

  // Topic tags: top keywords by frequency (across all domains)
  const allKeywords = Object.values(DOMAIN_KEYWORDS).flat();
  const tagCounts: Record<string, number> = {};
  for (const kw of allKeywords) {
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    const matches = lower.match(regex);
    if (matches && matches.length >= 2) tagCounts[kw] = matches.length;
  }
  const topicTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([kw]) => kw);

  return { domains, suggestedDifficulty, topicTags };
}

export interface IngestionResult {
  parser: string;
  status: "parsed" | "uploaded" | "failed";
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

export async function ingestBuffer(
  buffer: Buffer,
  fileName: string,
  fileType: string,
  sizeBytes?: number
): Promise<IngestionResult> {
  const lowerName = fileName.toLowerCase();
  const kind = getSourceMaterialKind(fileName, fileType);
  const extension = getFileExtension(fileName);

  try {
    let result: IngestionResult;

    if (isPreviewableMediaKind(kind)) {
      result = {
        parser: "media",
        status: "uploaded",
        extractedText: "",
        metadata: {
          kind,
          mimeType: fileType || "application/octet-stream",
          extension,
          sizeBytes: sizeBytes ?? buffer.length,
          previewable: true,
        },
      };
    } else if (fileType.includes("pdf") || lowerName.endsWith(".pdf")) {
      const mod = await import("pdf-parse");
      const pdfParse = (mod as any).default ?? (mod as any);
      const parsed = await pdfParse(buffer);
      result = {
        parser: "pdf-parse",
        status: "parsed",
        extractedText: parsed.text ?? "",
        metadata: { kind, extension, mimeType: fileType, sizeBytes: sizeBytes ?? buffer.length, pages: parsed.numpages ?? null, info: parsed.info ?? null },
      };
    } else if (
      fileType.includes("wordprocessingml") ||
      fileType.includes("msword") ||
      lowerName.endsWith(".docx")
    ) {
      const mammoth = await import("mammoth");
      const parsed = await mammoth.extractRawText({ buffer });
      result = {
        parser: "mammoth",
        status: "parsed",
        extractedText: parsed.value ?? "",
        metadata: { kind, extension, mimeType: fileType, sizeBytes: sizeBytes ?? buffer.length, messages: parsed.messages ?? [] },
      };
    } else if (fileType.includes("csv") || lowerName.endsWith(".csv")) {
      const text = buffer.toString("utf-8");
      const preview = previewAssessmentCsv(text);
      result = {
        parser: "csv-parse",
        status: preview.errors.length ? "failed" : "parsed",
        extractedText: text,
        metadata: {
          kind,
          extension,
          mimeType: fileType,
          sizeBytes: sizeBytes ?? buffer.length,
          rows: preview.validRows.length,
          validationErrors: preview.errors.length,
          duplicates: preview.duplicates.length,
        },
        errorMessage: preview.errors.length ? "CSV contains validation errors" : undefined,
      };
    } else if (fileType.startsWith("text/") || lowerName.endsWith(".txt") || lowerName.endsWith(".md")) {
      result = {
        parser: "text",
        status: "parsed",
        extractedText: buffer.toString("utf-8"),
        metadata: { kind, extension, mimeType: fileType, sizeBytes: sizeBytes ?? buffer.length, characters: buffer.length },
      };
    } else {
      return {
        parser: "unsupported",
        status: "failed",
        extractedText: "",
        metadata: { kind, extension, mimeType: fileType, sizeBytes: sizeBytes ?? buffer.length },
        errorMessage: "Unsupported file type. Upload PDF, DOCX, CSV, TXT, Markdown, audio, or video.",
      };
    }

    // Auto-tag metadata with domain/difficulty/topic detection
    if (result.status === "parsed" && result.extractedText) {
      const autoTags = detectMetadata(result.extractedText);
      result.metadata = { ...result.metadata, ...autoTags };
    }

    return result;
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
