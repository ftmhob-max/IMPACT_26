import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { formatUuid } from "@/lib/utils";
import { listStoredMaterialFolderAssignments, listStoredMaterialFolders } from "./material-folder-store";
import { getSourceMaterialKind, type SourceMaterialKind } from "./source-materials";

export type MaterialSort =
  | "relevance"
  | "newest"
  | "oldest"
  | "title"
  | "size"
  | "pages"
  | "characters"
  | "type"
  | "modified"
  | "most-used"
  | "status";

export type MaterialDirection = "asc" | "desc";
export type MaterialLinkedFilter = "all" | "linked" | "unlinked";
export type MaterialAssetFilter = "all" | "yes" | "no";
export type MaterialTextFilter = "all" | "yes" | "no";
export type MaterialLibraryView =
  | "all"
  | "recent"
  | "starred"
  | "mine"
  | "linked"
  | "unlinked"
  | "failed"
  | "archived"
  | "trash"
  | "media"
  | "pdfs"
  | "audio"
  | "transcripts"
  | "source-links";

export interface MaterialFolderSummary {
  id: string;
  name: string;
  folderType: string;
  parentFolder?: { id: string; name: string } | null;
  course?: { id: string; title: string } | null;
  lesson?: {
    id: string;
    title: string;
    module?: { id: string; title: string; course?: { id: string; title: string } | null } | null;
  } | null;
  createdBy?: { id: string; email?: string | null; fullName?: string | null } | null;
  archivedAt?: string | null;
  trashedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  materialCount?: number;
}

export interface MaterialTagSummary {
  id: string;
  name: string;
  color?: string | null;
}

export interface MaterialActivitySummary {
  id: string;
  activityType: string;
  message?: string | null;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  actor?: { id: string; email?: string | null; fullName?: string | null } | null;
}

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
  displayStatus: string;
  createdAt: string;
  updatedAt: string;
  starred: boolean;
  archivedAt?: string | null;
  trashedAt?: string | null;
  reviewStatus: string;
  visibility: string;
  duplicateOf?: { id: string; title: string } | null;
  lastActivityAt?: string | null;
  folder: MaterialFolderSummary | null;
  uploader: { id: string; email?: string | null; fullName?: string | null } | null;
  tags: MaterialTagSummary[];
  activities: MaterialActivitySummary[];
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
  duplicateKey: string;
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
  starred?: boolean | null;
  archivedAt?: string | null;
  trashedAt?: string | null;
  reviewStatus?: string | null;
  visibility?: string | null;
  duplicateOf?: { id: string; title: string } | null;
  lastActivityAt?: string | null;
  folder?: MaterialFolderSummary | null;
  uploadedBy?: { id: string; email?: string | null; fullName?: string | null } | null;
  sourceMaterialTagAssignments_on_sourceMaterial?: Array<{
    id: string;
    tag?: MaterialTagSummary | null;
  }>;
  sourceMaterialActivities_on_sourceMaterial?: Array<{
    id: string;
    activityType: string;
    message?: string | null;
    metadataJson?: string | null;
    createdAt?: string;
    actor?: { id: string; email?: string | null; fullName?: string | null } | null;
  }>;
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
  folderId?: string;
  view?: string;
  tags?: string | string[];
  fileType?: string;
  parserStatus?: string;
  linkStatus?: string;
  reviewStatus?: string;
  starred?: string;
  archived?: string;
  trashed?: string;
  uploadedById?: string;
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
  if (lowerType.startsWith("audio/") || lowerType.startsWith("video/")) {
    return material.extractedText?.trim() ? "whisper" : "media";
  }
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
  if (Array.isArray(metadata.tags)) parts.push(metadata.tags.join(" "));
  if (typeof metadata.suggestedDifficulty === "string") parts.push(metadata.suggestedDifficulty);
  if (typeof metadata.mimeType === "string") parts.push(metadata.mimeType);
  parts.push(material.folder?.name ?? "");
  parts.push(material.uploader?.fullName ?? "");
  parts.push(material.uploader?.email ?? "");
  parts.push(material.reviewStatus);
  parts.push(material.visibility);
  parts.push(material.tags.map((tag) => tag.name).join(" "));

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
  if (material.tags.some((tag) => tag.name.toLowerCase().includes(normalizedQuery))) score += 55;
  if ((material.folder?.name ?? "").toLowerCase().includes(normalizedQuery)) score += 35;
  if ((material.uploader?.fullName ?? material.uploader?.email ?? "").toLowerCase().includes(normalizedQuery)) score += 20;

  if ((material.extractedText ?? "").toLowerCase().includes(normalizedQuery)) score += 80;
  if (material.links.some((link) => (link.lesson?.title ?? "").toLowerCase().includes(normalizedQuery))) score += 30;
  if (material.links.some((link) => (link.question?.questionText ?? "").toLowerCase().includes(normalizedQuery))) score += 20;

  return score;
}

function extractTags(material: RawSourceMaterial, metadata: Record<string, unknown>): MaterialTagSummary[] {
  const explicit = (material.sourceMaterialTagAssignments_on_sourceMaterial ?? [])
    .map((assignment) => assignment.tag)
    .filter((tag): tag is MaterialTagSummary => Boolean(tag?.id && tag.name));

  const byName = new Map<string, MaterialTagSummary>();
  for (const tag of explicit) {
    byName.set(tag.name.toLowerCase(), tag);
  }

  const metadataTags = [
    ...(Array.isArray(metadata.topicTags) ? metadata.topicTags : []),
    ...(Array.isArray(metadata.tags) ? metadata.tags : []),
  ];

  for (const raw of metadataTags) {
    const name = String(raw ?? "").trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (!byName.has(key)) {
      byName.set(key, { id: `metadata:${key}`, name, color: null });
    }
  }

  return Array.from(byName.values()).slice(0, 12);
}

function extractActivities(material: RawSourceMaterial): MaterialActivitySummary[] {
  return (material.sourceMaterialActivities_on_sourceMaterial ?? []).map((activity) => ({
    id: activity.id,
    activityType: activity.activityType,
    message: activity.message ?? null,
    metadata: parseMetadataJson(activity.metadataJson),
    createdAt: activity.createdAt,
    actor: activity.actor ?? null,
  }));
}

function deriveDisplayStatus(material: {
  status: string;
  reviewStatus?: string | null;
  archivedAt?: string | null;
  trashedAt?: string | null;
  latestJob?: MaterialLatestJob | null;
  hasExtractedText?: boolean;
  kind?: SourceMaterialKind;
  linkCount?: number;
  duplicateOf?: { id: string; title: string } | null;
}) {
  if (material.trashedAt) return "trash";
  if (material.archivedAt) return "archived";
  if (material.duplicateOf) return "duplicate";
  if (material.status === "failed" || material.latestJob?.status === "failed") return "failed";
  if (material.status === "needs-ocr") return "needs-ocr";
  if (material.reviewStatus === "needs_review") return "needs-review";
  if ((material.kind === "audio" || material.kind === "video") && !material.hasExtractedText) return "missing-transcript";
  if ((material.linkCount ?? 0) === 0) return "unlinked";
  if (material.status === "parsed" || material.latestJob?.status === "completed") return "ready";
  return material.status || "uploaded";
}

let fallbackFolderCache: MaterialFolderSummary[] = [];
let fallbackFolderAssignments: Record<string, string | null> = {};

function getMetadataFolder(materialId: string, metadata: Record<string, unknown>) {
  const assignedFolderId = fallbackFolderAssignments[materialId] ?? fallbackFolderAssignments[formatUuid(materialId)];
  const folderId = assignedFolderId
    || (typeof metadata.libraryFolderId === "string" ? metadata.libraryFolderId : "");
  if (!folderId) return null;
  return fallbackFolderCache.find((folder) => folder.id === folderId) ?? {
    id: folderId,
    name: typeof metadata.libraryFolderName === "string" ? metadata.libraryFolderName : "Folder",
    folderType: "custom",
    parentFolder: null,
    archivedAt: null,
    trashedAt: null,
  };
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

  const tags = extractTags(material, metadata);
  const activities = extractActivities(material);
  const folder = material.folder && !material.folder.trashedAt ? material.folder : getMetadataFolder(material.id, metadata);
  const duplicateKey = `${material.fileName.toLowerCase()}::${typeof metadata.sizeBytes === "number" ? metadata.sizeBytes : 0}`;
  const hasAsset = Boolean(material.storagePath);
  const hasExtractedText = Boolean(extractedText.trim());
  const record: MaterialLibraryRecord = {
    id: material.id,
    title: material.title,
    fileName: material.fileName,
    fileType: material.fileType,
    status: material.status,
    displayStatus: material.status,
    createdAt: material.createdAt,
    updatedAt: material.updatedAt,
    starred: Boolean(material.starred),
    archivedAt: material.archivedAt ?? null,
    trashedAt: material.trashedAt ?? null,
    reviewStatus: material.reviewStatus ?? "unreviewed",
    visibility: material.visibility ?? "admin",
    duplicateOf: material.duplicateOf ?? null,
    lastActivityAt: material.lastActivityAt ?? null,
    folder,
    uploader: material.uploadedBy ?? null,
    tags,
    activities,
    storagePath: material.storagePath ?? null,
    downloadUrl: material.downloadUrl ?? null,
    extractedText,
    metadata,
    kind,
    latestJob,
    links,
    linkCount: links.length,
    hasAsset,
    hasExtractedText,
    parser,
    sizeBytes,
    pages: typeof metadata.pages === "number" ? metadata.pages : null,
    characters,
    previewSnippet: buildPreviewSnippet(previewBase, query),
    searchScore: 0,
    duplicateKey,
  };

  record.displayStatus = deriveDisplayStatus(record);
  record.searchScore = scoreMaterial(record, query);
  if (!record.previewSnippet) {
    record.previewSnippet = buildPreviewSnippet(buildSearchableFields(record), query);
  }
  return record;
}

export async function fetchAdminMaterialLibrary(query = "") {
  [fallbackFolderCache, fallbackFolderAssignments] = await Promise.all([
    listStoredMaterialFolders(),
    listStoredMaterialFolderAssignments(),
  ]);
  const data = await adminDcQuery<{ sourceMaterials: RawSourceMaterial[] }>("AdminListSourceMaterialsRich")
    .catch(() => adminDcQuery<{ sourceMaterials: RawSourceMaterial[] }>("AdminListSourceMaterials"))
    .catch((error) => {
      console.error("[material-library] Unable to fetch source materials", error);
      return { sourceMaterials: [] };
    });
  const records = (data.sourceMaterials ?? []).map((material) => normalizeMaterialRecord(material, query));
  const duplicateCounts = new Map<string, number>();
  for (const record of records) {
    duplicateCounts.set(record.duplicateKey, (duplicateCounts.get(record.duplicateKey) ?? 0) + 1);
  }
  return records.map((record) => {
    if (record.duplicateOf || (duplicateCounts.get(record.duplicateKey) ?? 0) <= 1) return record;
    return { ...record, displayStatus: record.displayStatus === "ready" ? "duplicate" : record.displayStatus };
  });
}

export async function fetchAdminMaterialFolders() {
  const data = await adminDcQuery<{ sourceMaterialFolders: MaterialFolderSummary[] }>("AdminListSourceMaterialFolders").catch(() => ({
    sourceMaterialFolders: [],
  }));
  const stored = await listStoredMaterialFolders();
  const byId = new Map<string, MaterialFolderSummary>();
  for (const folder of stored) byId.set(folder.id, folder);
  for (const folder of data.sourceMaterialFolders ?? []) byId.set(folder.id, folder);
  return Array.from(byId.values());
}

export async function fetchAdminMaterialTags() {
  const data = await adminDcQuery<{ sourceMaterialTags: MaterialTagSummary[] }>("AdminListSourceMaterialTags").catch(() => ({
    sourceMaterialTags: [],
  }));
  return data.sourceMaterialTags ?? [];
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
  const folderId = normalizeText(params.folderId);
  const view = (normalizeText(params.view) || "all") as MaterialLibraryView;
  const parser = normalizeText(params.parser);
  const status = normalizeText(params.status || params.parserStatus);
  const fileType = normalizeText(params.fileType);
  const linked = normalizeText(params.linked || params.linkStatus) as MaterialLinkedFilter;
  const reviewStatus = normalizeText(params.reviewStatus);
  const tagFilters = (Array.isArray(params.tags) ? params.tags : String(params.tags ?? "").split(","))
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
  const hasAsset = normalizeText(params.hasAsset) as MaterialAssetFilter;
  const hasText = normalizeText(params.hasText) as MaterialTextFilter;
  const requestedSort = normalizeText(params.sort) as MaterialSort;
  const sort: MaterialSort = requestedSort || (query ? "relevance" : "newest");
  const direction = normalizeText(params.direction) === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit ?? 50) || 50));

  let filtered = materials.slice();
  if (view !== "trash") filtered = filtered.filter((material) => !material.trashedAt);
  if (view !== "archived" && view !== "trash") filtered = filtered.filter((material) => !material.archivedAt);
  if (query) {
    filtered = filtered.filter((material) => buildSearchableFields(material).includes(query));
  }
  if (folderId && folderId !== "all") filtered = filtered.filter((material) => material.folder?.id?.toLowerCase() === folderId);
  if (view === "recent") filtered = filtered.filter((material) => Boolean(material.lastActivityAt || material.updatedAt));
  if (view === "starred") filtered = filtered.filter((material) => material.starred);
  if (view === "mine" && params.uploadedById) filtered = filtered.filter((material) => material.uploader?.id === params.uploadedById);
  if (view === "linked") filtered = filtered.filter((material) => material.linkCount > 0);
  if (view === "unlinked") filtered = filtered.filter((material) => material.linkCount === 0);
  if (view === "failed") filtered = filtered.filter((material) => material.displayStatus === "failed" || material.status === "failed" || material.displayStatus === "needs-ocr" || material.status === "needs-ocr");
  if (view === "archived") filtered = filtered.filter((material) => Boolean(material.archivedAt));
  if (view === "trash") filtered = filtered.filter((material) => Boolean(material.trashedAt));
  if (view === "media") filtered = filtered.filter((material) => material.kind === "audio" || material.kind === "video" || material.kind === "image");
  if (view === "pdfs") filtered = filtered.filter((material) => material.fileType.toLowerCase().includes("pdf") || material.fileName.toLowerCase().endsWith(".pdf"));
  if (view === "audio") filtered = filtered.filter((material) => material.kind === "audio");
  if (view === "transcripts") filtered = filtered.filter((material) => material.parser === "whisper" || material.kind === "audio" || material.kind === "video");
  if (view === "source-links") filtered = filtered.filter((material) => material.linkCount > 0 || material.fileType.toLowerCase().includes("url"));
  if (kind && kind !== "all") filtered = filtered.filter((material) => material.kind === kind);
  if (parser && parser !== "all") filtered = filtered.filter((material) => material.parser.toLowerCase() === parser);
  if (status && status !== "all") filtered = filtered.filter((material) => material.status.toLowerCase() === status || material.displayStatus.toLowerCase() === status);
  if (fileType && fileType !== "all") filtered = filtered.filter((material) => material.fileType.toLowerCase().includes(fileType) || material.fileName.toLowerCase().endsWith(`.${fileType}`));
  if (reviewStatus && reviewStatus !== "all") filtered = filtered.filter((material) => material.reviewStatus.toLowerCase() === reviewStatus);
  if (normalizeText(params.starred) === "true") filtered = filtered.filter((material) => material.starred);
  if (normalizeText(params.archived) === "true") filtered = filtered.filter((material) => Boolean(material.archivedAt));
  if (normalizeText(params.trashed) === "true") filtered = filtered.filter((material) => Boolean(material.trashedAt));
  if (tagFilters.length) filtered = filtered.filter((material) => tagFilters.every((tag) => material.tags.some((entry) => entry.name.toLowerCase() === tag || entry.id.toLowerCase() === tag)));
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
      case "type":
        return compareStrings(left.kind, right.kind, direction);
      case "modified":
        return compareDates(left.updatedAt, right.updatedAt, direction);
      case "most-used":
        return compareNumbers(left.linkCount, right.linkCount, direction);
      case "status":
        return compareStrings(left.displayStatus, right.displayStatus, direction);
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
