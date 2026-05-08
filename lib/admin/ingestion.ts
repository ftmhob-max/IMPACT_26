import { spawn } from "child_process";
import { mkdtemp, readFile, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { getAdminStorage } from "@/lib/firebase/admin-storage";
import { previewAssessmentCsv } from "./csv";
import { getFileExtension, getSourceMaterialKind } from "./source-materials";

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

interface WhisperSegment {
  text?: string;
  start?: number;
  end?: number;
}

interface WhisperJson {
  text?: string;
  language?: string;
  duration?: number;
  segments?: WhisperSegment[];
}

const DEFAULT_WHISPER_MODEL = "base";
const DEFAULT_WHISPER_DEVICE = "cpu";
const DEFAULT_MAX_TRANSCRIPTION_MB = 100;
const DEFAULT_TRANSCRIPTION_TIMEOUT_MS = 600_000;

function getPositiveNumberEnv(name: string, fallback: number) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function baseMediaMetadata({
  kind,
  extension,
  fileType,
  sizeBytes,
  bufferLength,
}: {
  kind: string;
  extension: string;
  fileType: string;
  sizeBytes?: number;
  bufferLength: number;
}) {
  return {
    kind,
    extension,
    mimeType: fileType || "application/octet-stream",
    sizeBytes: sizeBytes ?? bufferLength,
  };
}

function commandSucceeds(command: string, args: string[], timeoutMs = 10_000) {
  return new Promise<boolean>((resolve) => {
    const child = spawn(command, args, { stdio: "ignore" });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      resolve(false);
    }, timeoutMs);

    child.once("error", () => {
      clearTimeout(timer);
      resolve(false);
    });
    child.once("close", (code) => {
      clearTimeout(timer);
      resolve(code === 0);
    });
  });
}

function runCommand(command: string, args: string[], timeoutMs: number) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    let settled = false;

    const timer = setTimeout(() => {
      settled = true;
      child.kill("SIGKILL");
      reject(new Error(`Transcription timed out after ${Math.round(timeoutMs / 1000)} seconds.`));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.once("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    });
    child.once("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(stderr.trim() || stdout.trim() || `Command exited with status ${code}.`));
      }
    });
  });
}

export function normalizeWhisperTranscript(data: WhisperJson) {
  const segmentText = Array.isArray(data.segments)
    ? data.segments.map((segment) => String(segment.text ?? "").trim()).filter(Boolean).join("\n")
    : "";
  return (segmentText || String(data.text ?? "")).replace(/\r\n/g, "\n").trim();
}

async function transcribeMediaBuffer({
  buffer,
  fileName,
  fileType,
  sizeBytes,
  kind,
  extension,
}: {
  buffer: Buffer;
  fileName: string;
  fileType: string;
  sizeBytes?: number;
  kind: string;
  extension: string;
}): Promise<IngestionResult> {
  const metadata = baseMediaMetadata({ kind, extension, fileType, sizeBytes, bufferLength: buffer.length });
  const actualSize = sizeBytes ?? buffer.length;
  const maxMb = getPositiveNumberEnv("SOURCE_MATERIAL_MAX_TRANSCRIPTION_MB", DEFAULT_MAX_TRANSCRIPTION_MB);
  const maxBytes = maxMb * 1024 * 1024;
  const model = process.env.WHISPER_MODEL || DEFAULT_WHISPER_MODEL;
  const device = process.env.WHISPER_DEVICE || DEFAULT_WHISPER_DEVICE;
  const whisperBinary = process.env.WHISPER_BINARY || "whisper";
  const timeoutMs = getPositiveNumberEnv("SOURCE_MATERIAL_TRANSCRIPTION_TIMEOUT_MS", DEFAULT_TRANSCRIPTION_TIMEOUT_MS);
  const providerMetadata = {
    ...metadata,
    transcriptionProvider: "local-whisper",
    transcriptionModel: model,
  };

  if (actualSize > maxBytes) {
    return {
      parser: "whisper",
      status: "failed",
      extractedText: "",
      metadata: providerMetadata,
      errorMessage: `Media file is too large for local transcription (${Math.ceil(actualSize / (1024 * 1024))} MB). Limit is ${maxMb} MB.`,
    };
  }

  if (!(await commandSucceeds("ffmpeg", ["-version"]))) {
    return {
      parser: "whisper",
      status: "failed",
      extractedText: "",
      metadata: providerMetadata,
      errorMessage: "Local transcription requires ffmpeg on PATH.",
    };
  }

  if (!(await commandSucceeds(whisperBinary, ["--help"]))) {
    return {
      parser: "whisper",
      status: "failed",
      extractedText: "",
      metadata: providerMetadata,
      errorMessage: "Local transcription requires the whisper CLI on PATH. Install OpenAI Whisper or set WHISPER_BINARY.",
    };
  }

  const tempDir = await mkdtemp(path.join(tmpdir(), "impact-source-transcription-"));
  const safeExtension = extension || (kind === "video" ? "mp4" : "mp3");
  const inputPath = path.join(tempDir, `input.${safeExtension}`);
  const outputPath = path.join(tempDir, `input.json`);

  try {
    await writeFile(inputPath, buffer);
    await runCommand(
      whisperBinary,
      [
        inputPath,
        "--model",
        model,
        "--device",
        device,
        "--output_dir",
        tempDir,
        "--output_format",
        "json",
        "--verbose",
        "False",
      ],
      timeoutMs
    );

    const parsed = JSON.parse(await readFile(outputPath, "utf-8")) as WhisperJson;
    const extractedText = normalizeWhisperTranscript(parsed);
    const segments = Array.isArray(parsed.segments) ? parsed.segments.length : undefined;
    const durationSeconds = typeof parsed.duration === "number"
      ? parsed.duration
      : Array.isArray(parsed.segments)
        ? parsed.segments.reduce((max, segment) => Math.max(max, Number(segment.end ?? 0)), 0) || undefined
        : undefined;

    return {
      parser: "whisper",
      status: extractedText ? "parsed" : "failed",
      extractedText,
      metadata: {
        ...providerMetadata,
        fileName,
        language: parsed.language ?? null,
        durationSeconds: durationSeconds ?? null,
        segments: segments ?? null,
      },
      errorMessage: extractedText ? undefined : "Whisper completed but did not return transcript text.",
    };
  } catch (error) {
    return {
      parser: "whisper",
      status: "failed",
      extractedText: "",
      metadata: providerMetadata,
      errorMessage: error instanceof Error ? error.message : "Local transcription failed.",
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => null);
  }
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
  const configuredBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.GCLOUD_PROJECT;
  const bucketCandidates = [
    configuredBucket,
    configuredBucket?.endsWith(".firebasestorage.app") && projectId ? `${projectId}.appspot.com` : null,
    projectId ? `${projectId}.appspot.com` : null,
  ].filter((value, index, all): value is string => Boolean(value) && all.indexOf(value) === index);

  let lastError: unknown = null;
  for (const bucketName of bucketCandidates.length > 0 ? bucketCandidates : [undefined]) {
    try {
      const bucket = bucketName ? getAdminStorage().bucket(bucketName) : getAdminStorage().bucket();
      const file = bucket.file(storagePath);
      await file.save(buffer, {
        contentType,
        resumable: false,
        metadata: { cacheControl: "private, max-age=0, no-transform" },
      });
      return `gs://${bucket.name}/${storagePath}`;
    } catch (error) {
      lastError = error;
      const message = (error instanceof Error ? error.message : String(error)).toLowerCase();
      if (!message.includes("bucket does not exist") && !message.includes("no default bucket") && !message.includes("bucket name not specified")) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Unable to upload source material");
}

export async function ingestBuffer(
  buffer: Buffer,
  fileName: string,
  fileType: string,
  sizeBytes?: number
): Promise<IngestionResult> {
  const lowerName = fileName.toLowerCase();
  const lowerType = fileType.toLowerCase();
  const kind = getSourceMaterialKind(fileName, fileType);
  const extension = getFileExtension(fileName);

  try {
    let result: IngestionResult;

    if (kind === "image") {
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
    } else if (kind === "audio" || kind === "video") {
      result = await transcribeMediaBuffer({
        buffer,
        fileName,
        fileType,
        sizeBytes,
        kind,
        extension,
      });
    } else if (lowerType.includes("pdf") || lowerName.endsWith(".pdf")) {
      try {
        const { PDFParse } = await import("pdf-parse");
        // pdf-parse v2: construct with { data: Buffer }, call load() first,
        // then getText() and getInfo() in parallel.
        const parser = new (PDFParse as any)({ data: buffer });
        if (typeof parser.load === "function") {
          await parser.load();
        }
        const [textResult, info] = await Promise.all([
          parser.getText(),
          typeof parser.getInfo === "function"
            ? parser.getInfo().catch(() => ({}))
            : Promise.resolve({}),
        ]);
        if (typeof parser.destroy === "function") {
          await parser.destroy().catch(() => null);
        }
        const extractedText = ((textResult as any).text ?? "").trim();
        result = {
          parser: "pdf-parse",
          status: extractedText ? "parsed" : "failed",
          extractedText,
          metadata: {
            kind,
            extension,
            mimeType: fileType,
            sizeBytes: sizeBytes ?? buffer.length,
            pages: (info as any).total ?? null,
            info: (info as any).info ?? null,
          },
          errorMessage: extractedText ? undefined : "PDF parsing completed but no text was extracted.",
        };
      } catch (err) {
        result = {
          parser: "pdf-parse",
          status: "failed",
          extractedText: "",
          metadata: { kind, extension, mimeType: fileType, sizeBytes: sizeBytes ?? buffer.length },
          errorMessage: err instanceof Error ? err.message : "PDF parsing failed",
        };
      }
    } else if (
      lowerType.includes("wordprocessingml") ||
      lowerType.includes("msword") ||
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
    } else if (lowerType.includes("csv") || lowerName.endsWith(".csv")) {
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
    } else if (lowerType.startsWith("text/") || lowerName.endsWith(".txt") || lowerName.endsWith(".md")) {
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
