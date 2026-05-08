import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { formatUuid } from "@/lib/utils";
import { getSourceMaterialKind, type SourceMaterialKind } from "./source-materials";

export type MaterialSort =
  | "relevance"
  | "newest"
  | "oldest"
  | "title"
  | "size"
  | "pages"
  | "characters";

export type MaterialDirection = "asc" | "desc";
export type MaterialLinkedFilter = "all" | "linked" | "unlinked";
export type MaterialAssetFilter = "all" | "yes" | "no";
export type MaterialTextFilter = "all" | "yes" | "no";

export interface MaterialLatestJob {
  id?: string;
  status?: string;
  parser?: string;
  extractedCharacters?: number;
  errorMessage?: string | null;
  createdAt?: string;
  completedAt?: string | null;
}

export interface MaterialLinkSummary {
  id: string;
  referenceLabel?: string | null;
  createdAt?: string;
  course?: { id: string; title: string } | null;
  lesson?: {
    id: string;
    title: string;
    module?: { id: string; title: string } | null;
    course?: { id: string; title: string } | null;
  } | null;
  question?: {
    id: string;
    questionText: string;
    domain?: string | null;
    difficulty?: string | null;
  } | null;
}

export interface MaterialLibraryRecord {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  storagePath?: string | null;
  downloadUrl?: string | null;
  extractedText?: string | null;
  metadata: Record<string, unknown>;
  kind: SourceMaterialKind;
  latestJob: MaterialLatestJob | null;
  links: MaterialLinkSummary[];
  linkCount: number;
  hasAsset: boolean;
  hasExtractedText: boolean;
  parser: string;
  sizeBytes: number;
  pages: number | null;
  characters: number;
  previewSnippet: string;
  searchScore: number;
}

interface RawSourceMaterial {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  storagePath?: string | null;
  downloadUrl?: string | null;
  extractedText?: string | null;
  metadataJson?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  ingestionJobs_on_sourceMaterial?: Array<{
    id?: string;
    status?: string;
    parser?: string;
    extractedCharacters?: number;
    errorMessage?: string | null;
    createdAt?: string;
    completedAt?: string | null;
  }>;
  contentSourceLinks_on_sourceMaterial?: Array<{
    id: string;
    referenceLabel?: string | null;
    createdAt?: string;
    course?: { id: string; title: string } | null;
    lesson?: {
      id: string;
      title: string;
      module?: {
        id: string;
        title: string;
        course?: { id: string; title: string } | null;
      } | null;
    } | null;
    question?: {
      id: string;
      questionText: string;
      domain?: string | null;
      difficulty?: string | null;
    } | null;
  }>;
}

export interface MaterialListParams {
  q?: string;
  kind?: string;
  parser?: string;
  status?: string;
  linked?: string;
  hasAsset?: string;
  hasText?: string;
  sort?: string;
  direction?: string;
  page?: number;
  limit?: number;
}

export function parseMetadataJson(value?: string | null) {
  try {
    return JSON.parse(value ?? "{}") as Record<string, unknown>;
  } catch {
    return {};
  }
}

function normalizeText(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function inferParser(material: RawSourceMaterial) {
  const parser = material.ingestionJobs_on_sourceMaterial?.[0]?.parser;
  if (parser) return parser;
  const lowerType = material.fileType.toLowerCase();
  const lowerName = material.fileName.toLowerCase();
  if (lowerType.includes("pdf") || lowerName.endsWith(".pdf")) return "pdf-parse";
  if (lowerType.includes("wordprocessingml") || lowerType.includes("msword") || lowerName.endsWith(".docx")) return "mammoth";
  if (lowerType.includes("csv") || lowerName.endsWith(".csv")) return "csv-parse";
  if (lowerType.startsWith("audio/") || lowerType.startsWith("video/")) return "media";
  return "text";
}

function extractLinkSummary(material: RawSourceMaterial): MaterialLinkSummary[] {
  return (material.contentSourceLinks_on_sourceMaterial ?? []).map((link) => ({
    id: link.id,
    referenceLabel: link.referenceLabel ?? null,
    createdAt: link.createdAt,
    course: link.course ? { id: link.course.id, title: link.course.title } : null,
    lesson: link.lesson
      ? {
          id: link.lesson.id,
          title: link.lesson.title,
          module: link.lesson.module ? { id: link.lesson.module.id, title: link.lesson.module.title } : null,
          course: link.lesson.module?.course
            ? { id: link.lesson.module.course.id, title: link.lesson.module.course.title }
            : null,
        }
      : null,
    question: link.question
      ? {
          id: link.question.id,
          questionText: link.question.questionText,
          domain: link.question.domain ?? null,
          difficulty: link.question.difficulty ?? null,
        }
      : null,
  }));
}

function buildSearchableFields(material: MaterialLibraryRecord) {
  const metadata = material.metadata;
  const parts = [
    material.title,
    material.fileName,
    material.fileType,
    material.status,
    material.kind,
    material.parser,
    material.extractedText ?? "",
  ];

  if (Array.isArray(metadata.domains)) parts.push(metadata.domains.join(" "));
  if (Array.isArray(metadata.topicTags)) parts.push(metadata.topicTags.join(" "));
  if (typeof metadata.suggestedDifficulty === "string") parts.push(metadata.suggestedDifficulty);
  if (typeof metadata.mimeType === "string") parts.push(metadata.mimeType);

  for (const link of material.links) {
    parts.push(link.referenceLabel ?? "");
    parts.push(link.course?.title ?? "");
    parts.push(link.lesson?.title ?? "");
    parts.push(link.lesson?.module?.title ?? "");
    parts.push(link.question?.questionText ?? "");
    parts.push(link.question?.domain ?? "");
  }

  return parts.join(" ").toLowerCase();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPreviewSnippet(text: string, query: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (!query) return clean.slice(0, 220);

  const regex = new RegExp(escapeRegExp(query), "i");
  const match = clean.match(regex);
  if (!match || match.index == null) return clean.slice(0, 220);

  const start = Math.max(0, match.index - 90);
  const end = Math.min(clean.length, match.index + match[0].length + 120);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < clean.length ? "..." : "";
  return `${prefix}${clean.slice(start, end)}${suffix}`;
}

function scoreMaterial(material: MaterialLibraryRecord, query: string) {
  if (!query) return 0;
  const normalizedQuery = query.toLowerCase();
  let score = 0;
  if (material.title.toLowerCase().includes(normalizedQuery)) score += 120;
  if (material.fileName.toLowerCase().includes(normalizedQuery)) score += 90;
  if (material.parser.toLowerCase().includes(normalizedQuery)) score += 40;
  if (material.status.toLowerCase().includes(normalizedQuery)) score += 25;

  const metadata = material.metadata;
  if (Array.isArray(metadata.domains) && metadata.domains.some((domain) => String(domain).toLowerCase().includes(normalizedQuery))) {
    score += 50;
  }
  if (Array.isArray(metadata.topicTags) && metadata.topicTags.some((tag) => String(tag).toLowerCase().includes(normalizedQuery))) {
    score += 45;
  }

  if ((material.extractedText ?? "").toLowerCase().includes(normalizedQuery)) score += 80;
  if (material.links.some((link) => (link.lesson?.title ?? "").toLowerCase().includes(normalizedQuery))) score += 30;
  if (material.links.some((link) => (link.question?.questionText ?? "").toLowerCase().includes(normalizedQuery))) score += 20;

  return score;
}

export function normalizeMaterialRecord(material: RawSourceMaterial, query = ""): MaterialLibraryRecord {
  const metadata = parseMetadataJson(material.metadataJson);
  const kind = getSourceMaterialKind(
    material.fileName,
    typeof metadata.mimeType === "string" ? metadata.mimeType : material.fileType
  );
  const latestJob = material.ingestionJobs_on_sourceMaterial?.[0] ?? null;
  const parser = inferParser(material);
  const links = extractLinkSummary(material);
  const extractedText = typeof material.extractedText === "string" ? material.extractedText : "";
  const characters =
    latestJob?.extractedCharacters
    ?? (typeof metadata.characters === "number" ? metadata.characters : extractedText.length);
  const sizeBytes = typeof metadata.sizeBytes === "number" ? metadata.sizeBytes : 0;
  const previewBase =
    extractedText
    || links.map((link) => link.question?.questionText ?? link.lesson?.title ?? link.course?.title ?? "").filter(Boolean).join(" ")
    || material.fileName;

  const record: MaterialLibraryRecord = {
    id: material.id,
    title: material.title,
    fileName: material.fileName,
    fileType: material.fileType,
    status: material.status,
    createdAt: material.createdAt,
    updatedAt: material.updatedAt,
    storagePath: material.storagePath ?? null,
    downloadUrl: material.downloadUrl ?? null,
    extractedText,
    metadata,
    kind,
    latestJob,
    links,
    linkCount: links.length,
    hasAsset: Boolean(material.storagePath),
    hasExtractedText: Boolean(extractedText.trim()),
    parser,
    sizeBytes,
    pages: typeof metadata.pages === "number" ? metadata.pages : null,
    characters,
    previewSnippet: buildPreviewSnippet(previewBase, query),
    searchScore: 0,
  };

  record.searchScore = scoreMaterial(record, query);
  if (!record.previewSnippet) {
    record.previewSnippet = buildPreviewSnippet(buildSearchableFields(record), query);
  }
  return record;
}

export async function fetchAdminMaterialLibrary(query = "") {
  const data = await adminDcQuery<{ sourceMaterials: RawSourceMaterial[] }>("AdminListSourceMaterials").catch(() => ({
    sourceMaterials: [],
  }));
  return (data.sourceMaterials ?? []).map((material) => normalizeMaterialRecord(material, query));
}

function compareNumbers(left: number, right: number, direction: MaterialDirection) {
  return direction === "asc" ? left - right : right - left;
}

function compareStrings(left: string, right: string, direction: MaterialDirection) {
  return direction === "asc" ? left.localeCompare(right) : right.localeCompare(left);
}

function compareDates(left: string, right: string, direction: MaterialDirection) {
  return compareNumbers(new Date(left).getTime(), new Date(right).getTime(), direction);
}

export function listAdminMaterials(materials: MaterialLibraryRecord[], params: MaterialListParams) {
  const query = String(params.q ?? "").trim().toLowerCase();
  const kind = normalizeText(params.kind);
  const parser = normalizeText(params.parser);
  const status = normalizeText(params.status);
  const linked = normalizeText(params.linked) as MaterialLinkedFilter;
  const hasAsset = normalizeText(params.hasAsset) as MaterialAssetFilter;
  const hasText = normalizeText(params.hasText) as MaterialTextFilter;
  const requestedSort = normalizeText(params.sort) as MaterialSort;
  const sort: MaterialSort = requestedSort || (query ? "relevance" : "newest");
  const direction = normalizeText(params.direction) === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit ?? 50) || 50));

  let filtered = materials.slice();
  if (query) {
    filtered = filtered.filter((material) => buildSearchableFields(material).includes(query));
  }
  if (kind && kind !== "all") filtered = filtered.filter((material) => material.kind === kind);
  if (parser && parser !== "all") filtered = filtered.filter((material) => material.parser.toLowerCase() === parser);
  if (status && status !== "all") filtered = filtered.filter((material) => material.status.toLowerCase() === status);
  if (linked === "linked") filtered = filtered.filter((material) => material.linkCount > 0);
  if (linked === "unlinked") filtered = filtered.filter((material) => material.linkCount === 0);
  if (hasAsset === "yes") filtered = filtered.filter((material) => material.hasAsset);
  if (hasAsset === "no") filtered = filtered.filter((material) => !material.hasAsset);
  if (hasText === "yes") filtered = filtered.filter((material) => material.hasExtractedText);
  if (hasText === "no") filtered = filtered.filter((material) => !material.hasExtractedText);

  filtered.sort((left, right) => {
    switch (sort) {
      case "relevance":
        if (left.searchScore !== right.searchScore) return right.searchScore - left.searchScore;
        return compareDates(left.createdAt, right.createdAt, "desc");
      case "oldest":
        return compareDates(left.createdAt, right.createdAt, "asc");
      case "title":
        return compareStrings(left.title, right.title, direction);
      case "size":
        return compareNumbers(left.sizeBytes, right.sizeBytes, direction);
      case "pages":
        return compareNumbers(left.pages ?? 0, right.pages ?? 0, direction);
      case "characters":
        return compareNumbers(left.characters, right.characters, direction);
      case "newest":
      default:
        return compareDates(left.createdAt, right.createdAt, direction);
    }
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return {
    materials: paged,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
      start: total === 0 ? 0 : start + 1,
      end: Math.min(start + limit, total),
    },
    sort,
    direction,
    query,
  };
}

export function findMaterialById(materials: MaterialLibraryRecord[], id: string) {
  const normalizedId = formatUuid(id);
  return materials.find((material) => formatUuid(material.id) === normalizedId) ?? null;
}
