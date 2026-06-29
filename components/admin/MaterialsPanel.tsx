"use client";

// components/admin/MaterialsPanel.tsx — Teacher Portal source materials library (front-end)

import { type CSSProperties, type ReactNode, useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";
import { FileDropZone } from "./FileDropZone";
import * as Icons from "@/components/ui/Icons";
import { FieldHint } from "@/components/ui/FieldHint";

type MaterialKind = "document" | "audio" | "video" | "image";
type PreviewTab = "preview" | "content" | "links" | "details";
type LibraryView =
  | "all"
  | "recent"
  | "starred"
  | "mine"
  | "linked"
  | "unlinked"
  | "failed"
  | "queue"
  | "archived"
  | "trash"
  | "media"
  | "pdfs"
  | "audio"
  | "transcripts"
  | "source-links";
type CollectionViewMode = "list" | "grid";

interface MaterialLibraryCounts {
  total: number;
  queue: number;
  failed: number;
  unlinked: number;
}

const LIBRARY_VIEWS: LibraryView[] = [
  "all",
  "recent",
  "starred",
  "mine",
  "linked",
  "unlinked",
  "failed",
  "queue",
  "archived",
  "trash",
  "media",
  "pdfs",
  "audio",
  "transcripts",
  "source-links",
];

function parseLibraryView(value: string | null): LibraryView | null {
  if (!value) return null;
  return LIBRARY_VIEWS.includes(value as LibraryView) ? (value as LibraryView) : null;
}

interface MaterialFolder {
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
  archivedAt?: string | null;
  trashedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  materialCount?: number;
}

interface MaterialTag {
  id: string;
  name: string;
  color?: string | null;
}

interface MaterialActivity {
  id: string;
  activityType: string;
  message?: string | null;
  createdAt?: string;
  actor?: { id: string; email?: string | null; fullName?: string | null } | null;
}

interface MaterialListItem {
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
  folder: MaterialFolder | null;
  uploader: { id: string; email?: string | null; fullName?: string | null } | null;
  tags: MaterialTag[];
  activities: MaterialActivity[];
  kind: MaterialKind;
  parser: string;
  sizeBytes: number;
  pages: number | null;
  characters: number;
  hasAsset: boolean;
  hasExtractedText: boolean;
  previewSnippet: string;
  linkCount: number;
  latestJob: {
    id?: string;
    status?: string;
    parser?: string;
    extractedCharacters?: number;
    errorMessage?: string | null;
    createdAt?: string;
    completedAt?: string | null;
  } | null;
  metadata: Record<string, unknown>;
}

interface MaterialListResponse {
  folders: MaterialFolder[];
  tags: MaterialTag[];
  materials: MaterialListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    start: number;
    end: number;
  };
  sort: string;
  direction: "asc" | "desc";
  query: string;
  counts?: MaterialLibraryCounts;
}

interface MaterialLinkSummary {
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

interface MaterialPreviewResponse {
  material: MaterialListItem & {
    assetHref: string | null;
    assetDownloadHref: string | null;
  };
  preview: {
    extractedText: string;
    csvPreview: {
      headers: string[];
      rows: string[][];
      totalRows: number;
    } | null;
    links: MaterialLinkSummary[];
    formattedMode: "pdf" | "docx" | null;
    formattedHtml: string | null;
  };
}

interface Course {
  id: string;
  title: string;
  modules_on_course: Array<{
    id: string;
    title: string;
    lessons_on_module: Array<{ id: string; title: string; lessonType: string }>;
  }>;
}

interface UploadResult {
  id: string;
  created: Array<{
    id: string;
    title: string;
    fileName: string;
    storageWarning?: string | null;
  }>;
  failed: Array<{
    fileName: string;
    title: string;
    error: string;
  }>;
  summary: {
    total: number;
    succeeded: number;
    failed: number;
    warnings: number;
  };
}

interface UploadQueueItem {
  clientId: string;
  file: File;
  title: string;
  uploadStatus?: "queued" | "uploading" | "done" | "error";
  progress?: number;
}

const PREVIEW_SIZES: Record<"sm" | "md" | "lg", number> = { sm: 320, md: 380, lg: 500 };

const INTERACTIVE_FOCUS =
  "cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]/40 focus-visible:ring-offset-1";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A-Z" },
  { value: "size", label: "File size" },
  { value: "type", label: "File type" },
  { value: "modified", label: "Last modified" },
  { value: "most-used", label: "Most used" },
  { value: "status", label: "Processing status" },
  { value: "pages", label: "Pages" },
  { value: "characters", label: "Character count" },
];

const PARSER_LABELS: Record<string, string> = {
  "pdf-parse": "PDF",
  mammoth: "DOCX",
  "csv-parse": "CSV",
  text: "Text",
  media: "Media",
  whisper: "Transcript",
};

async function readApiError(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text) as { error?: string };
  } catch {
    return { error: text || "Request failed." };
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function deriveTitleFromFileName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
}

function getFileSignature(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function HighlightedText({
  text,
  query,
  className,
}: {
  text: string;
  query: string;
  className?: string;
}) {
  if (!query.trim()) return <span className={className}>{text}</span>;
  const regex = new RegExp(`(${escapeRegExp(query)})`, "ig");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => (
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={`${part}-${index}`} className="rounded bg-[#fff0b8] px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      ))}
    </span>
  );
}

function isPdfMaterial(material: Pick<MaterialListItem, "parser" | "fileType" | "fileName">) {
  return material.parser === "pdf-parse"
    || material.fileType.toLowerCase().includes("pdf")
    || material.fileName.toLowerCase().endsWith(".pdf");
}

function isDocxMaterial(material: Pick<MaterialListItem, "parser" | "fileType" | "fileName">) {
  return material.parser === "mammoth"
    || material.fileType.toLowerCase().includes("wordprocessingml")
    || material.fileName.toLowerCase().endsWith(".docx");
}

function isTranscribableMediaMaterial(material: Pick<MaterialListItem, "kind">) {
  return material.kind === "audio" || material.kind === "video";
}

function DocumentStage({
  title,
  subtitle,
  toolbarLabel,
  children,
}: {
  title: string;
  subtitle: string;
  toolbarLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.28)]">
      <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#fdfefe_0%,#f4f7fb_100%)] px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#F76E5E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#F8C34A]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#6FD27C]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{title}</p>
              <p className="text-[11px] text-slate-500">{subtitle}</p>
            </div>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500">
            {toolbarLabel}
          </span>
        </div>
      </div>
      <div className="bg-[radial-gradient(circle_at_top,#eef4ff_0%,#e7edf7_35%,#dce5f2_100%)] p-4 sm:p-5">
        {children}
      </div>
    </div>
  );
}

function RenderedDocumentHtml({
  html,
  compact = false,
}: {
  html: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("document-html-shell", compact && "document-html-shell--compact")}>
      <div className="document-html-page" dangerouslySetInnerHTML={{ __html: html }} />
      <style jsx>{`
        .document-html-shell {
          margin: 0 auto;
          max-width: 860px;
        }

        .document-html-shell--compact {
          max-width: 760px;
        }

        .document-html-page {
          background: linear-gradient(180deg, #ffffff 0%, #fdfcf8 100%);
          border: 1px solid rgba(148, 163, 184, 0.22);
          border-radius: 28px;
          box-shadow: 0 24px 60px -32px rgba(15, 23, 42, 0.35);
          color: #1e293b;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 16px;
          line-height: 1.75;
          min-height: 420px;
          padding: 48px 52px;
        }

        .document-html-page :global(*) {
          max-width: 100%;
        }

        .document-html-page :global(h1),
        .document-html-page :global(h2),
        .document-html-page :global(h3),
        .document-html-page :global(h4),
        .document-html-page :global(h5),
        .document-html-page :global(h6) {
          color: #0f172a;
          font-family: "Georgia", "Times New Roman", serif;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 0 0 0.8em;
        }

        .document-html-page :global(h1) {
          font-size: 2rem;
          margin-top: 0;
        }

        .document-html-page :global(h2) {
          border-top: 1px solid rgba(148, 163, 184, 0.18);
          font-size: 1.55rem;
          margin-top: 1.6em;
          padding-top: 1em;
        }

        .document-html-page :global(h3) {
          font-size: 1.2rem;
          margin-top: 1.35em;
        }

        .document-html-page :global(p),
        .document-html-page :global(ul),
        .document-html-page :global(ol),
        .document-html-page :global(blockquote),
        .document-html-page :global(pre),
        .document-html-page :global(table) {
          margin: 0 0 1em;
        }

        .document-html-page :global(ul),
        .document-html-page :global(ol) {
          padding-left: 1.5rem;
        }

        .document-html-page :global(li + li) {
          margin-top: 0.35rem;
        }

        .document-html-page :global(blockquote) {
          background: rgba(236, 244, 255, 0.7);
          border-left: 3px solid #185fa5;
          border-radius: 0 18px 18px 0;
          color: #334155;
          padding: 0.95rem 1rem;
        }

        .document-html-page :global(pre),
        .document-html-page :global(code) {
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
        }

        .document-html-page :global(pre) {
          background: #f8fafc;
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 18px;
          overflow-x: auto;
          padding: 1rem;
        }

        .document-html-page :global(table) {
          border-collapse: collapse;
          font-size: 0.96rem;
          overflow: hidden;
          width: 100%;
        }

        .document-html-page :global(th),
        .document-html-page :global(td) {
          border: 1px solid rgba(148, 163, 184, 0.22);
          padding: 0.75rem 0.85rem;
          text-align: left;
          vertical-align: top;
        }

        .document-html-page :global(th) {
          background: #eff6ff;
          color: #0f172a;
          font-family: ui-sans-serif, system-ui, sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .document-html-page :global(img) {
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 18px;
          box-shadow: 0 16px 32px -24px rgba(15, 23, 42, 0.55);
          display: block;
          height: auto;
          margin: 1.2rem auto;
        }

        .document-html-page :global(a) {
          color: #185fa5;
          text-decoration: underline;
          text-decoration-thickness: 0.08em;
          text-underline-offset: 0.18em;
        }

        .document-html-page :global(hr) {
          border: 0;
          border-top: 1px solid rgba(148, 163, 184, 0.24);
          margin: 1.5rem 0;
        }
      `}</style>
    </div>
  );
}

export function MaterialsPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialView = parseLibraryView(searchParams.get("view"));
  const initialUploadOpen = searchParams.get("upload") === "1";

  const [materials, setMaterials] = useState<MaterialListItem[]>([]);
  const [folders, setFolders] = useState<MaterialFolder[]>([]);
  const [tags, setTags] = useState<MaterialTag[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [libraryCounts, setLibraryCounts] = useState<MaterialLibraryCounts>({
    total: 0,
    queue: 0,
    failed: 0,
    unlinked: 0,
  });
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [pagination, setPagination] = useState<MaterialListResponse["pagination"]>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 1,
    start: 0,
    end: 0,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<MaterialPreviewResponse | null>(null);
  const [previewTab, setPreviewTab] = useState<PreviewTab>("preview");
  const [uploadItems, setUploadItems] = useState<UploadQueueItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploadOpen, setUploadOpen] = useState(initialUploadOpen);
  const [linkingMaterialId, setLinkingMaterialId] = useState<string | null>(null);
  const [view, setView] = useState<LibraryView>(initialView ?? "all");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<CollectionViewMode>("list");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [uploadTags, setUploadTags] = useState<string[]>([]);
  const [uploadTagInput, setUploadTagInput] = useState("");
  const [uploadFolderId, setUploadFolderId] = useState("");
  const [uploadCourseId, setUploadCourseId] = useState("");
  const [uploadLessonId, setUploadLessonId] = useState("");
  const [draggingMaterialIds, setDraggingMaterialIds] = useState<string[]>([]);
  const [moveDialogIds, setMoveDialogIds] = useState<string[] | null>(null);
  const [folderMenu, setFolderMenu] = useState<{ folder: MaterialFolder; x: number; y: number } | null>(null);
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("all");
  const [parser, setParser] = useState("all");
  const [status, setStatus] = useState("all");
  const [linked, setLinked] = useState("all");
  const [hasAsset, setHasAsset] = useState("all");
  const [hasText, setHasText] = useState("all");
  const [sort, setSort] = useState("newest");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
  const [pendingSelectionId, setPendingSelectionId] = useState<string | null>(null);
  const [areaMenu, setAreaMenu] = useState<{ x: number; y: number } | null>(null);
  const [pendingBulkConfirm, setPendingBulkConfirm] = useState<{ action: string; label: string } | null>(null);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [uploadFileIndex, setUploadFileIndex] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [previewPaneVisible, setPreviewPaneVisible] = useState(true);
  const [previewPaneSize, setPreviewPaneSize] = useState<"sm" | "md" | "lg">("md");
  const [rowDensity, setRowDensity] = useState<"comfortable" | "compact">("comfortable");
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const [isPending, startTransition] = useTransition();

  // Stable ref so the list-fetch effect can read selectedId without it being a dep.
  // Prevents a redundant full list refetch every time the user clicks a material row.
  const selectedIdRef = useRef(selectedId);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

  function syncViewToUrl(nextView: LibraryView) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextView === "all") params.delete("view");
    else params.set("view", nextView);
    const query = params.toString();
    router.replace(query ? `/admin/materials?${query}` : "/admin/materials", { scroll: false });
  }

  function applyView(nextView: LibraryView) {
    setView(nextView);
    setSelectedFolderId(null);
    setPage(1);
    setSelectedIds(new Set());
    syncViewToUrl(nextView);
  }

  useEffect(() => {
    const savedViewMode = window.localStorage.getItem("impact-material-view-mode");
    if (savedViewMode === "grid") {
      setViewMode("grid");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("impact-material-view-mode", viewMode);
    }
  }, [viewMode]);

  useEffect(() => {
    const sc = window.localStorage.getItem("impact-sidebar-collapsed");
    if (sc === "1") setSidebarCollapsed(true);
    const pp = window.localStorage.getItem("impact-preview-visible");
    if (pp === "0") setPreviewPaneVisible(false);
    const ps = window.localStorage.getItem("impact-preview-size") as "sm" | "md" | "lg" | null;
    if (ps === "sm" || ps === "md" || ps === "lg") setPreviewPaneSize(ps);
    const rd = window.localStorage.getItem("impact-row-density");
    if (rd === "compact") setRowDensity("compact");
  }, []);

  useEffect(() => { window.localStorage.setItem("impact-sidebar-collapsed", sidebarCollapsed ? "1" : "0"); }, [sidebarCollapsed]);
  useEffect(() => { window.localStorage.setItem("impact-preview-visible", previewPaneVisible ? "1" : "0"); }, [previewPaneVisible]);
  useEffect(() => { window.localStorage.setItem("impact-preview-size", previewPaneSize); }, [previewPaneSize]);
  useEffect(() => { window.localStorage.setItem("impact-row-density", rowDensity); }, [rowDensity]);

  useEffect(() => {
    if (!folderMenu && !areaMenu) return;

    function closeMenus() {
      setFolderMenu(null);
      setAreaMenu(null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenus();
    }

    window.addEventListener("click", closeMenus);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", closeMenus);
    return () => {
      window.removeEventListener("click", closeMenus);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", closeMenus);
    };
  }, [folderMenu, areaMenu]);

  useEffect(() => {
    if (!notice || notice.type !== "success") return;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/courses", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses ?? []);
      }
    })();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: "50",
      sort: deferredSearch.trim() ? sort : sort === "relevance" ? "newest" : sort,
      direction,
      view,
    });

    if (deferredSearch.trim()) params.set("q", deferredSearch.trim());
    if (selectedFolderId) params.set("folderId", selectedFolderId);
    if (kind !== "all") params.set("kind", kind);
    if (parser !== "all") params.set("parser", parser);
    if (status !== "all") params.set("status", status);
    if (linked !== "all") params.set("linked", linked);
    if (hasAsset !== "all") params.set("hasAsset", hasAsset);
    if (hasText !== "all") params.set("hasText", hasText);

    let ignore = false;
    setLoading(true);
    fetch(`/api/admin/materials?${params.toString()}`, { cache: "no-store" })
      .then(async (res) => (res.ok ? (await res.json()) as MaterialListResponse : null))
      .then((data) => {
        if (!data || ignore) return;
        setMaterials(data.materials ?? []);
        setFolders(data.folders ?? []);
        setTags(data.tags ?? []);
        if (data.counts) setLibraryCounts(data.counts);
        setPagination(data.pagination ?? pagination);
        setSelectedIds((current) => new Set([...current].filter((id) => data.materials.some((material) => material.id === id))));

        if (pendingSelectionId && data.materials.some((material) => material.id === pendingSelectionId)) {
          setSelectedId(pendingSelectionId);
          setPendingSelectionId(null);
          return;
        }

        if (data.materials.length === 0) {
          setSelectedId(null);
          setSelectedPreview(null);
          return;
        }

        // Use ref so we don't re-run this whole effect just because a row was clicked
        const currentSelectedId = selectedIdRef.current;
        if (!currentSelectedId || !data.materials.some((material) => material.id === currentSelectedId)) {
          setSelectedId(data.materials[0].id);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  // selectedId intentionally excluded — read via ref to avoid refetching on every row click
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredSearch, view, selectedFolderId, kind, parser, status, linked, hasAsset, hasText, sort, direction, page, refreshKey, pendingSelectionId]);

  useEffect(() => {
    setPreviewTab("preview");
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    let ignore = false;
    setPreviewLoading(true);
    fetch(`/api/admin/materials/${selectedId}/preview`, { cache: "no-store" })
      .then(async (res) => (res.ok ? (await res.json()) as MaterialPreviewResponse : null))
      .then((data) => {
        if (!ignore) setSelectedPreview(data);
      })
      .finally(() => {
        if (!ignore) setPreviewLoading(false);
      });
    return () => {
      ignore = true;
    };
  // previewRefreshKey forces a reload after reparse without changing selectedId
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, previewRefreshKey]);

  const selectedListItem = useMemo(
    () => materials.find((material) => material.id === selectedId) ?? null,
    [materials, selectedId]
  );

  async function upload() {
    if (!uploadItems.length || uploadItems.some((item) => !item.title.trim())) return;
    setBusy(true);
    setUploadFileIndex(0);

    const data: UploadResult = {
      id: "",
      created: [],
      failed: [],
      summary: { total: 0, succeeded: 0, failed: 0, warnings: 0 },
    };

    function uploadWithProgress(item: UploadQueueItem, clientId: string): Promise<Response> {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/materials");
        xhr.setRequestHeader("Content-Type", item.file.type || "application/octet-stream");
        xhr.setRequestHeader("X-File-Name", encodeURIComponent(item.file.name));
        xhr.setRequestHeader("X-Title", encodeURIComponent(item.title.trim()));
        xhr.setRequestHeader("X-Folder-Id", encodeURIComponent(uploadFolderId || selectedFolderId || ""));
        xhr.setRequestHeader("X-Tags", encodeURIComponent(uploadTags.join(",")));
        xhr.setRequestHeader("X-Course-Id", encodeURIComponent(uploadCourseId));
        xhr.setRequestHeader("X-Lesson-Id", encodeURIComponent(uploadLessonId));
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploadItems((prev) =>
              prev.map((it) => it.clientId === clientId ? { ...it, progress: pct, uploadStatus: "uploading" } : it)
            );
          }
        };
        xhr.onload = () => {
          resolve(new Response(xhr.responseText, { status: xhr.status, headers: { "Content-Type": "application/json" } }));
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(item.file);
      });
    }

    try {
      for (let uploadIdx = 0; uploadIdx < uploadItems.length; uploadIdx++) {
        const item = uploadItems[uploadIdx];
        setUploadFileIndex(uploadIdx);
        setUploadItems((prev) =>
          prev.map((it) => it.clientId === item.clientId ? { ...it, uploadStatus: "uploading", progress: 0 } : it)
        );
        const res = await uploadWithProgress(item, item.clientId);

        if (res.ok) {
          const itemData = (await res.json()) as UploadResult;
          data.id = itemData.id || data.id;
          data.created.push(...itemData.created);
          data.failed.push(...itemData.failed);
          if (data.summary && itemData.summary) {
            data.summary.succeeded += itemData.summary.succeeded;
            data.summary.failed += itemData.summary.failed;
            data.summary.warnings += itemData.summary.warnings;
          }
          setUploadItems((prev) =>
            prev.map((it) => it.clientId === item.clientId ? { ...it, uploadStatus: "done", progress: 100 } : it)
          );
        } else {
          const errorData = await readApiError(res);
          data.failed.push({
            fileName: item.file.name,
            title: item.title,
            error: errorData.error ?? "Upload failed.",
          });
          if (data.summary) data.summary.failed += 1;
          setUploadItems((prev) =>
            prev.map((it) => it.clientId === item.clientId ? { ...it, uploadStatus: "error" } : it)
          );
        }
      }

      const warningCount = data.summary?.warnings ?? 0;
      const successCount = data.summary?.succeeded ?? data.created.length;
      const failedCount = data.summary?.failed ?? data.failed.length;
      const summaryParts = [`${successCount} material${successCount === 1 ? "" : "s"} uploaded`];
      if (failedCount > 0) summaryParts.push(`${failedCount} failed`);
      if (warningCount > 0) summaryParts.push(`${warningCount} storage warning${warningCount === 1 ? "" : "s"}`);
      setNotice({
        type: failedCount > 0 ? "error" : "success",
        text: `${summaryParts.join(" · ")}.${data.failed[0]?.error ? ` First issue: ${data.failed[0].error}` : ""}`,
      });
      setUploadItems((current) => {
        if (!failedCount) return [];

        const remaining = new Map<string, number>();
        for (const entry of data.failed) {
          const key = `${entry.fileName}::${entry.title}`;
          remaining.set(key, (remaining.get(key) ?? 0) + 1);
        }

        return current.filter((item) => {
          const key = `${item.file.name}::${item.title}`;
          const count = remaining.get(key) ?? 0;
          if (count <= 0) return false;
          remaining.set(key, count - 1);
          return true;
        });
      });
      setUploadOpen(failedCount > 0);
      if (!failedCount) { setUploadTags([]); setUploadTagInput(""); }
      setPage(1);
      if (data.id) setPendingSelectionId(data.id);
      setRefreshKey((value) => value + 1);
    } catch {
      setNotice({ type: "error", text: "Upload failed." });
    } finally {
      setBusy(false);
      setUploadFileIndex(null);
    }
  }

  function handleFilesSelected(nextFiles: File[]) {
    setUploadItems((current) => {
      const existing = new Set(current.map((item) => getFileSignature(item.file)));
      const additions = nextFiles
        .filter((file) => !existing.has(getFileSignature(file)))
        .map((file) => ({
          clientId: crypto.randomUUID(),
          file,
          title: deriveTitleFromFileName(file.name),
        }));
      return [...current, ...additions];
    });
  }

  function updateUploadItemTitle(clientId: string, title: string) {
    setUploadItems((current) => current.map((item) => (
      item.clientId === clientId ? { ...item, title } : item
    )));
  }

  function removeUploadItem(clientId: string) {
    setUploadItems((current) => current.filter((item) => item.clientId !== clientId));
  }

  async function deleteMaterial(material: MaterialListItem) {
    if (!window.confirm(`Move "${material.title}" to trash? Existing learning-content links will be preserved until final deletion.`)) return;
    const res = await fetch(`/api/admin/materials/${material.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setNotice({ type: "success", text: "Material deleted." });
      if (selectedId === material.id) {
        const nextItem = materials.find((entry) => entry.id !== material.id);
        setSelectedId(nextItem?.id ?? null);
      }
      setRefreshKey((value) => value + 1);
    } else {
      setNotice({ type: "error", text: data.error ?? "Failed to delete material." });
    }
  }

  async function deleteFolder(folder: MaterialFolder) {
    if (!window.confirm(`Delete folder "${folder.name}"? Materials in this folder will move back to All Materials.`)) return;
    const res = await fetch(`/api/admin/materials/folders/${folder.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      setNotice({ type: "success", text: `Folder "${folder.name}" deleted. Materials were kept in All Materials.` });
      if (selectedFolderId && isFolderWithin(folders, selectedFolderId, folder.id)) {
        applyView("all");
      }
      setSelectedIds(new Set());
      setFolderMenu(null);
      setRefreshKey((value) => value + 1);
    } else {
      setNotice({ type: "error", text: data.error ?? "Failed to delete folder." });
    }
  }

  async function createFolderNamed(name: string, parentFolderId: string | null) {
    if (!name) return;
    const res = await fetch("/api/admin/materials/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, parentFolderId, folderType: "custom" }),
    });
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return typeof data.id === "string" ? data.id : null;
    }

    const data = await res.json().catch(() => ({}));
    setNotice({ type: "error", text: data.error ?? "Failed to create folder." });
    return null;
  }

  async function createFolderInSidebar(name: string, parentFolderId: string | null) {
    const folderId = await createFolderNamed(name.trim(), parentFolderId);
    if (folderId) {
      setNotice({ type: "success", text: `Folder "${name.trim()}" created.` });
      setRefreshKey((value) => value + 1);
    }
  }

  async function renameFolder(folder: MaterialFolder, name: string) {
    const trimmed = name.trim();
    if (!trimmed || trimmed === folder.name) {
      setFolderMenu(null);
      return;
    }
    const res = await fetch(`/api/admin/materials/folders/${folder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    if (res.ok) {
      setNotice({ type: "success", text: `Folder renamed to "${trimmed}".` });
      setFolderMenu(null);
      setRefreshKey((v) => v + 1);
    } else {
      const data = await res.json().catch(() => ({}));
      setNotice({ type: "error", text: data.error ?? "Failed to rename folder." });
    }
  }

  async function updateMaterial(id: string, body: Record<string, unknown>, successText: string) {
    const res = await fetch(`/api/admin/materials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setNotice({ type: "success", text: successText });
      setRefreshKey((value) => value + 1);
    } else {
      const data = await res.json().catch(() => ({}));
      setNotice({ type: "error", text: data.error ?? "Update failed." });
    }
  }

  async function runBulkAction(action: string, extra: Record<string, unknown> = {}, explicitIds?: string[]) {
    const ids = explicitIds ?? [...selectedIds];
    if (ids.length === 0) return;
    const res = await fetch("/api/admin/materials/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ids, ...extra }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      if (action === "export-metadata") {
        const blob = new Blob([JSON.stringify(data.materials ?? [], null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "source-material-metadata.json";
        link.click();
        URL.revokeObjectURL(url);
      }
      setNotice({ type: "success", text: `${data.updated ?? ids.length} material${ids.length === 1 ? "" : "s"} updated.` });
      setSelectedIds(new Set());
      setRefreshKey((value) => value + 1);
    } else {
      setNotice({ type: "error", text: data.error ?? "Bulk action failed." });
    }
  }

  async function moveMaterials(ids: string[], folderId: string | null) {
    const uniqueIds = [...new Set(ids)].filter(Boolean);
    if (!uniqueIds.length) return;

    if (uniqueIds.length === 1) {
      await updateMaterial(uniqueIds[0], { folderId }, folderId ? "Material moved to folder." : "Material moved to All Materials.");
      return;
    }

    await runBulkAction("move", { folderId }, uniqueIds);
  }

  async function createFolderAndMove(ids: string[], name: string, parentFolderId: string | null) {
    const folderId = await createFolderNamed(name.trim(), parentFolderId);
    if (!folderId) return;
    await moveMaterials(ids, folderId);
    setNotice({ type: "success", text: `Created "${name.trim()}" and moved ${ids.length} material${ids.length === 1 ? "" : "s"}.` });
    setMoveDialogIds(null);
    setRefreshKey((value) => value + 1);
  }

  function getDragMaterialIds(materialId: string) {
    return selectedIds.has(materialId) ? [...selectedIds] : [materialId];
  }

  function startMaterialDrag(event: React.DragEvent, materialId: string) {
    const ids = getDragMaterialIds(materialId);
    setDraggingMaterialIds(ids);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-impact-material-ids", JSON.stringify(ids));
    event.dataTransfer.setData("text/plain", ids.join(","));
  }

  function readDraggedMaterialIds(event: React.DragEvent) {
    const raw = event.dataTransfer.getData("application/x-impact-material-ids");
    if (!raw) return draggingMaterialIds;
    try {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? parsed.map((id) => String(id)).filter(Boolean) : draggingMaterialIds;
    } catch {
      return draggingMaterialIds;
    }
  }

  function handleFolderDrop(event: React.DragEvent, folderId: string | null) {
    event.preventDefault();
    const ids = readDraggedMaterialIds(event);
    setDraggingMaterialIds([]);
    void moveMaterials(ids, folderId);
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openFolder(folderId: string) {
    setView("all");
    syncViewToUrl("all");
    setSelectedFolderId(folderId);
    setPage(1);
    setSelectedIds(new Set());
    setFolderMenu(null);
  }

  function openFolderMenu(event: React.MouseEvent, folder: MaterialFolder) {
    event.preventDefault();
    event.stopPropagation();
    setAreaMenu(null);
    setFolderMenu({ folder, x: event.clientX, y: event.clientY });
  }

  function resetFilters() {
    setSearch("");
    setKind("all");
    setParser("all");
    setStatus("all");
    setLinked("all");
    setHasAsset("all");
    setHasText("all");
    applyView("all");
    setSort("newest");
    setDirection("desc");
    setPage(1);
    setAdvancedFiltersOpen(false);
  }

  const activeFilterCount = [
    kind !== "all",
    parser !== "all",
    status !== "all",
    linked !== "all",
    hasAsset !== "all",
    hasText !== "all",
    Boolean(search.trim()),
    view !== "all",
    Boolean(selectedFolderId),
    sort !== "newest",
    direction !== "desc",
  ].filter(Boolean).length;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (activeFilterCount > 0) setFiltersExpanded(true); }, [activeFilterCount]);

  const visibleFolders = folders.filter((folder) => !folder.trashedAt && !folder.archivedAt && (selectedFolderId ? folder.parentFolder?.id === selectedFolderId : !folder.parentFolder));
  const selectedFolder = selectedFolderId ? folders.find((folder) => folder.id === selectedFolderId) ?? null : null;
  const breadcrumbs = buildFolderBreadcrumbs(folders, selectedFolderId);
  const allLessonsForUpload = courses.flatMap((course) => course.modules_on_course.flatMap((module) => (
    module.lessons_on_module.map((lesson) => ({ ...lesson, moduleTitle: module.title, courseId: course.id, courseTitle: course.title }))
  )));
  const folderOptions = buildFolderOptions(folders);
  const advancedFiltersActive = hasAsset !== "all" || hasText !== "all";

  // Determine list columns based on preview pane visibility and size to prevent layout squishing
  const showSignals = !previewPaneVisible || previewPaneSize === "sm";
  const showUsage = !previewPaneVisible;

  let headerGridCols = "minmax(260px,1.8fr) minmax(150px,0.7fr) minmax(150px,0.65fr) auto";
  let rowGridCols = "minmax(260px,1.8fr) minmax(130px,0.7fr) minmax(130px,0.65fr) auto";

  if (previewPaneVisible) {
    if (previewPaneSize === "sm") {
      headerGridCols = "minmax(200px,1.8fr) minmax(120px,0.7fr) auto";
      rowGridCols = "minmax(200px,1.8fr) minmax(110px,0.7fr) auto";
    } else {
      headerGridCols = "minmax(200px,1fr) auto";
      rowGridCols = "minmax(200px,1fr) auto";
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        className="grid grid-cols-1 xl:min-h-[calc(100vh-170px)] xl:[grid-template-columns:var(--material-library-cols)] xl:transition-[grid-template-columns] xl:duration-200"
        style={{ "--material-library-cols": `${sidebarCollapsed ? 0 : 240}px minmax(0,1fr)` } as CSSProperties}
      >
        <MaterialLibrarySidebar
          view={view}
          collapsed={sidebarCollapsed}
          viewCounts={libraryCounts}
          onViewChange={applyView}
          folders={folders}
          selectedFolderId={selectedFolderId}
          onFolderSelect={openFolder}
          onDropMaterials={(event, folderId) => handleFolderDrop(event, folderId)}
          onFolderContextMenu={openFolderMenu}
          onCreateFolder={createFolderInSidebar}
        />

        <section className="min-w-0 bg-white">
          {sidebarCollapsed && (
            <button
              type="button"
              title="Expand sidebar"
              aria-label="Expand sidebar"
              onClick={() => setSidebarCollapsed(false)}
              className="absolute left-0 top-1/2 z-10 hidden h-10 w-5 -translate-y-1/2 items-center justify-center rounded-r-lg border border-l-0 border-slate-200 bg-white text-slate-400 shadow-sm transition hover:text-[#185FA5] xl:flex"
            >
              <Icons.ChevronRight size={12} />
            </button>
          )}
        <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#fdfefe_0%,#f6f9fc_100%)] px-4 py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#185FA5] text-white shadow-sm">
                <Icons.Database size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#185FA5]">Teacher Portal</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Source Materials</h1>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {pagination.total.toLocaleString()} items
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] font-semibold text-slate-500">
                  <button type="button" onClick={() => applyView("all")} className={cn(INTERACTIVE_FOCUS, "rounded px-0.5 hover:text-[#185FA5]")}>
                    All Materials
                  </button>
                  {breadcrumbs.map((crumb) => (
                    <span key={crumb.id} className="inline-flex items-center gap-1">
                      <Icons.ChevronRight size={10} />
                      <button type="button" onClick={() => openFolder(crumb.id)} className={cn(INTERACTIVE_FOCUS, "max-w-[160px] truncate rounded px-0.5 hover:text-[#185FA5]")}>
                        {crumb.name}
                      </button>
                    </span>
                  ))}
                  {selectedFolder && (
                    <>
                      <Icons.ChevronRight size={10} />
                      <span className="max-w-[160px] truncate text-slate-600">{selectedFolder.name}</span>
                    </>
                  )}
                  {!selectedFolder && view !== "all" && (
                    <>
                      <Icons.ChevronRight size={10} />
                      <span className="text-slate-600">{DRIVE_VIEW_LABELS[view]}</span>
                    </>
                  )}
                </div>
                <a href="/admin" className={cn(INTERACTIVE_FOCUS, "mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#185FA5] hover:underline")}>
                  <Icons.ArrowLeft size={12} />
                  Back to dashboard
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:shrink-0">
              <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
                <button
                  type="button"
                  title="Toggle sidebar"
                  aria-label="Toggle sidebar"
                  onClick={() => setSidebarCollapsed((v) => !v)}
                  className={cn("inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-slate-700", !sidebarCollapsed && "bg-[#E6F1FB] text-[#185FA5]")}
                >
                  <Icons.PanelLeft size={14} />
                </button>
                <button
                  type="button"
                  title="List view"
                  aria-label="List view"
                  onClick={() => setViewMode("list")}
                  className={cn("inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-slate-700", viewMode === "list" && "bg-[#E6F1FB] text-[#185FA5]")}
                >
                  <Icons.List size={14} />
                </button>
                <button
                  type="button"
                  title="Grid view"
                  aria-label="Grid view"
                  onClick={() => setViewMode("grid")}
                  className={cn("inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-slate-700", viewMode === "grid" && "bg-[#E6F1FB] text-[#185FA5]")}
                >
                  <Icons.Box size={14} />
                </button>
                {viewMode === "list" && (
                  <button
                    type="button"
                    title={rowDensity === "comfortable" ? "Switch to compact rows" : "Switch to comfortable rows"}
                    aria-label="Toggle row density"
                    onClick={() => setRowDensity((d) => d === "comfortable" ? "compact" : "comfortable")}
                    className={cn("inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-slate-700", rowDensity === "compact" && "bg-[#E6F1FB] text-[#185FA5]")}
                  >
                    <Icons.AlignJustify size={14} />
                  </button>
                )}
                <button
                  type="button"
                  title={previewPaneVisible ? "Hide preview pane" : "Show preview pane"}
                  aria-label="Toggle preview pane"
                  onClick={() => setPreviewPaneVisible((v) => !v)}
                  className={cn("inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-slate-700", previewPaneVisible && "bg-[#E6F1FB] text-[#185FA5]")}
                >
                  <Icons.PanelRight size={14} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setUploadOpen((value) => !value)}
                className="admin-action secondary flex h-8 items-center gap-1.5 text-xs"
              >
                {uploadOpen ? <Icons.ChevronUp size={13} /> : <Icons.Plus size={13} />}
                {uploadOpen ? "Hide" : "Add material"}
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <LibraryStatChip
              label="Total"
              value={libraryCounts.total}
              active={view === "all" && !selectedFolderId}
              onClick={() => applyView("all")}
            />
            {libraryCounts.queue > 0 && (
              <LibraryStatChip
                label="In queue"
                value={libraryCounts.queue}
                active={view === "queue"}
                tone="amber"
                onClick={() => applyView("queue")}
              />
            )}
            {libraryCounts.failed > 0 && (
              <LibraryStatChip
                label="Failed"
                value={libraryCounts.failed}
                active={view === "failed"}
                tone="red"
                onClick={() => applyView("failed")}
              />
            )}
            {libraryCounts.unlinked > 0 && (
              <LibraryStatChip
                label="Unlinked"
                value={libraryCounts.unlinked}
                active={view === "unlinked"}
                onClick={() => applyView("unlinked")}
              />
            )}
          </div>
        </div>

        {uploadOpen && (
          <div className="border-b border-slate-100 bg-[#fbfcfe] px-5 py-5">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="space-y-3">
                <FileDropZone
                  files={uploadItems.map((item) => item.file)}
                  onFiles={handleFilesSelected}
                  multiple
                  disabled={busy}
                />

                {uploadItems.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Batch queue</p>
                        <p className="text-xs text-slate-500">
                          {uploadItems.length.toLocaleString()} file{uploadItems.length === 1 ? "" : "s"} ready. Titles can be edited before uploading.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadItems([])}
                        disabled={busy}
                        className="text-xs font-semibold text-slate-500 transition hover:text-[#185FA5]"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="max-h-[420px] space-y-3 overflow-y-auto p-4">
                      {uploadItems.map((item, index) => (
                        <div key={item.clientId} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-800">{item.file.name}</p>
                              <p className="mt-1 text-xs text-slate-500">
                                File {index + 1} · {formatBytes(item.file.size)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeUploadItem(item.clientId)}
                              disabled={busy}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:text-red-600"
                            >
                              <Icons.X size={14} />
                            </button>
                          </div>
                          <div className="mt-3">
                            <label className="admin-label">Library title<FieldHint text="The display name for this material in the library. Make it descriptive so it's easy to find later (e.g. 'Chapter 3 – Trending Forward Worked Examples')." /></label>
                            <input
                              className="admin-input"
                              value={item.title}
                              onChange={(event) => updateUploadItemTitle(item.clientId, event.target.value)}
                              placeholder="Source material title"
                            />
                          </div>
                          {/* Per-file progress */}
                          {item.uploadStatus === "uploading" && (
                            <div className="mt-2">
                              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-[#185FA5] transition-all"
                                  style={{ width: `${item.progress ?? 0}%` }}
                                />
                              </div>
                              <p className="mt-0.5 text-[10px] text-slate-400">{item.progress ?? 0}%</p>
                            </div>
                          )}
                          {item.uploadStatus === "done" && (
                            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                              <Icons.Check size={12} />
                              Uploaded
                            </div>
                          )}
                          {item.uploadStatus === "error" && (
                            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-red-600">
                              <Icons.X size={12} />
                              Failed
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={upload}
                  disabled={busy || !uploadItems.length || uploadItems.some((item) => !item.title.trim())}
                  className="admin-action w-full flex items-center justify-center gap-2"
                >
                  {busy ? (
                    <>
                      <Icons.Loader size={14} className="animate-spin" />
                      {uploadFileIndex !== null && uploadItems.length > 1
                        ? `Uploading file ${uploadFileIndex + 1} of ${uploadItems.length}…`
                        : "Uploading…"}
                    </>
                  ) : (
                    <>
                      <Icons.Upload size={14} />
                      {uploadItems.length > 1 ? `Upload ${uploadItems.length} materials` : "Upload material"}
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-2xl border border-[#185FA5]/15 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#185FA5]">
                  Upload destination
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="admin-label">Folder<FieldHint text="Organize this material into a folder for easier browsing. You can move it to a different folder later from the detail panel." /></label>
                    <select className="admin-input" value={uploadFolderId || selectedFolderId || ""} onChange={(event) => setUploadFolderId(event.target.value)}>
                      <option value="">All Materials</option>
                      {folderOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Tags<FieldHint text="Keywords that make this material discoverable when searching. Type a tag and press Enter or comma to add. Use consistent naming (e.g. 'chapter-3', 'worked-example')." /></label>
                    {/* Chip-based tag editor */}
                    <div className="admin-input flex flex-wrap items-center gap-1 min-h-[2rem] h-auto py-1 cursor-text" onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement | null)?.focus()}>
                      {uploadTags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-0.5 rounded-full bg-[#E6F1FB] px-2 py-0.5 text-[11px] font-semibold text-[#185FA5]">
                          {tag}
                          <button
                            type="button"
                            onClick={() => setUploadTags((prev) => prev.filter((t) => t !== tag))}
                            className="ml-0.5 text-[#185FA5]/60 hover:text-[#185FA5]"
                          >
                            <Icons.X size={9} />
                          </button>
                        </span>
                      ))}
                      <input
                        className="flex-1 min-w-[80px] border-none outline-none bg-transparent text-xs text-slate-700 placeholder:text-slate-400"
                        value={uploadTagInput}
                        onChange={(e) => setUploadTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if ((e.key === "Enter" || e.key === ",") && uploadTagInput.trim()) {
                            e.preventDefault();
                            const newTag = uploadTagInput.trim().replace(/,$/, "");
                            if (newTag && !uploadTags.includes(newTag)) setUploadTags((prev) => [...prev, newTag]);
                            setUploadTagInput("");
                          } else if (e.key === "Backspace" && !uploadTagInput && uploadTags.length) {
                            setUploadTags((prev) => prev.slice(0, -1));
                          }
                        }}
                        list="upload-tag-suggestions"
                        placeholder={uploadTags.length ? "" : "Add tags…"}
                      />
                      <datalist id="upload-tag-suggestions">
                        {tags.filter((t) => !uploadTags.includes(t.name)).map((tag) => (
                          <option key={tag.id} value={tag.name} />
                        ))}
                      </datalist>
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400">Type a tag and press Enter or comma to add</p>
                  </div>
                  <div>
                    <label className="admin-label">Link to course<FieldHint text="Associate this material with a course so it appears in that course's resource list. Students in the course can access it directly." /></label>
                    <select className="admin-input" value={uploadCourseId} onChange={(event) => { setUploadCourseId(event.target.value); setUploadLessonId(""); }}>
                      <option value="">No course link</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Link to lesson<FieldHint text="Associate this material with a specific lesson. Useful for primary readings or worked examples tied to a lesson's content." /></label>
                    <select className="admin-input" value={uploadLessonId} onChange={(event) => setUploadLessonId(event.target.value)}>
                      <option value="">No lesson link</option>
                      {allLessonsForUpload
                        .filter((lesson) => !uploadCourseId || lesson.courseId === uploadCourseId)
                        .map((lesson) => (
                          <option key={lesson.id} value={lesson.id}>{lesson.courseTitle} / {lesson.title}</option>
                        ))}
                    </select>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Files appear in the library immediately; parser status and retry live in the preview pane.
                </p>
              </div>
            </div>
          </div>
        )}

        {notice && (
          <div className="border-b border-slate-100 bg-white px-5 py-3">
            <p
              role={notice.type === "error" ? "alert" : "status"}
              aria-live="polite"
              className={cn(
                "flex items-center gap-2 text-sm",
                notice.type === "success" ? "text-emerald-700" : "text-red-700"
              )}
            >
              {notice.type === "success" ? <Icons.Check size={14} /> : <Icons.X size={14} />}
              {notice.text}
            </p>
          </div>
        )}

        <div className="border-b border-slate-100 bg-white px-4 py-2">
          {/* Always-visible row: search + filters toggle + sort */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative basis-full sm:flex-1">
              <Icons.Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="admin-input h-8 !pl-8 text-sm"
                value={search}
                onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                placeholder="Search materials…"
              />
            </div>
            <button
              type="button"
              onClick={() => setFiltersExpanded((v) => !v)}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition shrink-0",
                (filtersExpanded || activeFilterCount > 0)
                  ? "border-[#185FA5]/40 bg-[#E6F1FB] text-[#185FA5]"
                  : "border-slate-200 bg-white text-slate-500 hover:border-[#185FA5] hover:text-[#185FA5]"
              )}
            >
              <Icons.Search size={12} />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#185FA5] px-1 text-[9px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-1.5 shrink-0">
              <select className="admin-input h-8 w-32 text-xs sm:w-36" value={sort} onChange={(event) => { const v = event.target.value; startTransition(() => { setSort(v); setPage(1); }); }}>
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button
                type="button"
                title={direction === "desc" ? "Descending" : "Ascending"}
                onClick={() => startTransition(() => { setDirection((d) => d === "desc" ? "asc" : "desc"); setPage(1); })}
                className={cn(
                  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-[#185FA5] hover:text-[#185FA5]",
                  direction === "asc" && "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]"
                )}
              >
                {direction === "desc" ? <Icons.ArrowDown size={13} /> : <Icons.ArrowUp size={13} />}
              </button>
            </div>
            <span className="shrink-0 text-[11px] font-semibold text-slate-400">
              {pagination.start}–{pagination.end} / {pagination.total}
            </span>
          </div>

          {/* Collapsible filter row */}
          {filtersExpanded && (
            <div className="mt-2 space-y-2">
              <div className="grid gap-2 sm:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
                <select className="admin-input h-8 text-xs" value={kind} onChange={(event) => { const v = event.target.value; startTransition(() => { setKind(v); setPage(1); }); }}>
                  <option value="all">All kinds</option>
                  <option value="document">Documents</option>
                  <option value="audio">Audio</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                </select>
                <select className="admin-input h-8 text-xs" value={parser} onChange={(event) => { const v = event.target.value; startTransition(() => { setParser(v); setPage(1); }); }}>
                  <option value="all">All parsers</option>
                  <option value="pdf-parse">PDF</option>
                  <option value="mammoth">DOCX</option>
                  <option value="csv-parse">CSV</option>
                  <option value="text">Text</option>
                  <option value="whisper">Transcript</option>
                  <option value="media">Media</option>
                </select>
                <select className="admin-input h-8 text-xs" value={status} onChange={(event) => { const v = event.target.value; startTransition(() => { setStatus(v); setPage(1); }); }}>
                  <option value="all">All status</option>
                  <option value="parsed">Parsed</option>
                  <option value="uploaded">Uploaded</option>
                  <option value="failed">Failed</option>
                </select>
                <select className="admin-input h-8 text-xs" value={linked} onChange={(event) => { const v = event.target.value; startTransition(() => { setLinked(v); setPage(1); }); }}>
                  <option value="all">All links</option>
                  <option value="linked">Linked</option>
                  <option value="unlinked">Unlinked</option>
                </select>
                <button
                  type="button"
                  onClick={() => setAdvancedFiltersOpen((v) => !v)}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition",
                    advancedFiltersActive
                      ? "border-[#185FA5]/40 bg-[#E6F1FB] text-[#185FA5]"
                      : "border-slate-200 bg-white text-slate-500 hover:border-[#185FA5] hover:text-[#185FA5]"
                  )}
                >
                  Advanced
                  {advancedFiltersActive && <span className="h-1.5 w-1.5 rounded-full bg-[#185FA5]" />}
                </button>
              </div>

              {advancedFiltersOpen && (
                <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:grid-cols-2">
                  <select className="admin-input h-8 text-xs" value={hasAsset} onChange={(event) => { const v = event.target.value; startTransition(() => { setHasAsset(v); setPage(1); }); }}>
                    <option value="all">Any asset state</option>
                    <option value="yes">Has original asset</option>
                    <option value="no">No original asset</option>
                  </select>
                  <select className="admin-input h-8 text-xs" value={hasText} onChange={(event) => { const v = event.target.value; startTransition(() => { setHasText(v); setPage(1); }); }}>
                    <option value="all">Any text state</option>
                    <option value="yes">Has extracted text</option>
                    <option value="no">No extracted text</option>
                  </select>
                </div>
              )}

              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {search.trim() && <FilterChip label={`"${search.trim()}"`} onRemove={() => startTransition(() => { setSearch(""); setPage(1); })} />}
                  {kind !== "all" && <FilterChip label={kind} onRemove={() => startTransition(() => { setKind("all"); setPage(1); })} />}
                  {parser !== "all" && <FilterChip label={PARSER_LABELS[parser] ?? parser} onRemove={() => startTransition(() => { setParser("all"); setPage(1); })} />}
                  {status !== "all" && <FilterChip label={status} onRemove={() => startTransition(() => { setStatus("all"); setPage(1); })} />}
                  {linked !== "all" && <FilterChip label={linked} onRemove={() => startTransition(() => { setLinked("all"); setPage(1); })} />}
                  {hasAsset !== "all" && <FilterChip label={hasAsset === "yes" ? "Has asset" : "No asset"} onRemove={() => startTransition(() => { setHasAsset("all"); setPage(1); })} />}
                  {hasText !== "all" && <FilterChip label={hasText === "yes" ? "Has text" : "No text"} onRemove={() => startTransition(() => { setHasText("all"); setPage(1); })} />}
                  {view !== "all" && <FilterChip label={DRIVE_VIEW_LABELS[view]} onRemove={() => applyView("all")} />}
                  {selectedFolderId && <FilterChip label={selectedFolder?.name ?? "Folder"} onRemove={() => { setSelectedFolderId(null); setPage(1); }} />}
                  {sort !== "newest" && <FilterChip label={SORT_OPTIONS.find((o) => o.value === sort)?.label ?? sort} onRemove={() => { setSort("newest"); setPage(1); }} />}
                  <button type="button" onClick={resetFilters} className="text-[11px] font-semibold text-slate-400 transition hover:text-red-600">
                    Reset all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className={cn("grid grid-cols-1", previewPaneVisible && "xl:[grid-template-columns:var(--material-preview-cols)]")}
          style={previewPaneVisible ? { "--material-preview-cols": `minmax(0,1fr) ${PREVIEW_SIZES[previewPaneSize]}px` } as CSSProperties : undefined}
        >
          <div
            className={cn("border-b xl:border-b-0", previewPaneVisible ? "materials-list-pane" : "border-slate-100")}
            onContextMenu={(event) => {
              const target = event.target as HTMLElement;
              if (target.closest("button,a,input,select,textarea,[role=button]")) return;
              event.preventDefault();
              setFolderMenu(null);
              setAreaMenu({ x: event.clientX, y: event.clientY });
            }}
          >
            {selectedIds.size > 0 && (
              <BulkActionBar
                count={selectedIds.size}
                pendingConfirm={pendingBulkConfirm}
                onClear={() => { setSelectedIds(new Set()); setPendingBulkConfirm(null); }}
                onOpenMove={() => setMoveDialogIds([...selectedIds])}
                onArchive={() => setPendingBulkConfirm({ action: "archive", label: "Archive" })}
                onTrash={() => setPendingBulkConfirm({ action: "trash", label: "Move to trash" })}
                onConfirmDestructive={() => {
                  if (!pendingBulkConfirm) return;
                  void runBulkAction(pendingBulkConfirm.action);
                  setPendingBulkConfirm(null);
                }}
                onCancelDestructive={() => setPendingBulkConfirm(null)}
                onMarkReviewed={() => void runBulkAction("mark-reviewed")}
                onExport={() => void runBulkAction("export-metadata")}
              />
            )}
            {visibleFolders.length > 0 && view !== "trash" && view !== "archived" && (
              <FolderStrip
                folders={visibleFolders}
                onOpen={openFolder}
                onDropMaterials={(event, folderId) => handleFolderDrop(event, folderId)}
                onFolderContextMenu={openFolderMenu}
              />
            )}
            {viewMode === "grid" ? (
              <MaterialGrid
                loading={loading}
                materials={materials}
                query={deferredSearch}
                selectedId={selectedId}
                selectedIds={selectedIds}
                folders={folders}
                onSelect={(id) => startTransition(() => setSelectedId(id))}
                onToggleSelected={toggleSelected}
                onStar={(material) => void updateMaterial(material.id, { starred: !material.starred }, material.starred ? "Material unstarred." : "Material starred.")}
                onMove={(material, folderId) => void moveMaterials([material.id], folderId)}
                onLink={(id) => setLinkingMaterialId(id)}
                onDelete={(material) => void deleteMaterial(material)}
                onDragStart={startMaterialDrag}
                onDragEnd={() => setDraggingMaterialIds([])}
              />
            ) : (
              <>
            <div
              style={{ "--list-grid-cols": headerGridCols } as CSSProperties}
              className="hidden gap-3 border-b border-slate-100 bg-[#f8fafc] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 sm:grid sm:[grid-template-columns:var(--list-grid-cols)]"
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  aria-label="Select all on page"
                  checked={materials.length > 0 && materials.every((m) => selectedIds.has(m.id))}
                  onChange={(event) => {
                    if (event.target.checked) setSelectedIds(new Set(materials.map((m) => m.id)));
                    else setSelectedIds(new Set());
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-[#185FA5]"
                />
                Material
              </span>
              {showSignals && <span>Signals</span>}
              {showUsage && <span>Usage</span>}
              <span className="text-right">Actions</span>
            </div>

            {loading || isPending ? (
              <div className="px-5 py-8 text-center text-sm text-slate-400">Loading materials…</div>
            ) : materials.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Icons.Database size={36} className="mx-auto mb-3 text-slate-200" />
                <p className="text-sm font-semibold text-slate-700">No materials match the current view.</p>
                <p className="mt-1 text-xs text-slate-500">
                  {pagination.total === 0 ? "Add your first material to start building the library." : "Adjust the search or reset filters to widen the archive."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    draggable
                    onDragStart={(event) => startMaterialDrag(event, material.id)}
                    onDragEnd={() => setDraggingMaterialIds([])}
                    style={{ "--list-grid-cols": rowGridCols } as CSSProperties}
                    className={cn(
                      "materials-row grid cursor-grab grid-cols-1 gap-3 px-4 transition active:cursor-grabbing sm:items-center sm:[grid-template-columns:var(--list-grid-cols)]",
                      rowDensity === "compact" ? "py-1.5" : "py-3",
                      selectedId === material.id ? "materials-row-selected" : "hover:bg-[#fbfdff]"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => startTransition(() => setSelectedId(material.id))}
                      className="contents text-left"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            aria-label={`Select ${material.title}`}
                            checked={selectedIds.has(material.id)}
                            onChange={(event) => {
                              event.stopPropagation();
                              toggleSelected(material.id);
                            }}
                            onClick={(event) => event.stopPropagation()}
                            className="h-3.5 w-3.5 shrink-0 rounded border-slate-300 text-[#185FA5]"
                          />
                          <MaterialKindIcon kind={material.kind} compact={rowDensity === "compact"} />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="truncate text-sm font-semibold text-slate-900">{material.title}</p>
                              <StatusBadge status={material.displayStatus ?? material.status} />
                              {material.starred && <TinyBadge label="★" />}
                            </div>
                            {rowDensity === "comfortable" && (
                              <>
                                <p className="mt-0.5 truncate text-xs text-slate-500">{material.fileName}</p>
                                <p className="mt-0.5 truncate text-[11px] text-slate-400">{material.folder?.name ?? "All Materials"} · {material.uploader?.fullName ?? material.uploader?.email ?? "Unknown"}</p>
                                <HighlightedText
                                  text={material.previewSnippet || "No preview snippet available."}
                                  query={deferredSearch}
                                  className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-600"
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {showSignals && (
                        <div className="space-y-1 text-xs text-slate-500">
                          <p className="font-semibold text-slate-700">{PARSER_LABELS[material.parser] ?? material.parser}</p>
                          <div className="flex flex-wrap gap-1">
                            {material.pages != null && <TinyBadge label={`${material.pages}p`} />}
                            {material.sizeBytes > 0 && <TinyBadge label={formatBytes(material.sizeBytes)} />}
                          </div>
                        </div>
                      )}

                      {showUsage && (
                        <div className="space-y-1 text-xs text-slate-500">
                          <p>{material.linkCount > 0 ? `${material.linkCount} linked` : "Unlinked"}</p>
                          {rowDensity === "comfortable" && <p>{formatDateTime(material.createdAt)}</p>}
                          <div className="flex flex-wrap gap-1">
                            {material.tags.slice(0, 2).map((tag) => <TinyBadge key={tag.id} label={tag.name} />)}
                          </div>
                        </div>
                      )}
                    </button>

                    <div className="flex items-center justify-end gap-1">
                      {selectedListItem?.id !== material.id && (
                        <span className="hidden rounded-full bg-[#E6F1FB] px-2 py-1 text-[10px] font-semibold text-[#185FA5] xl:inline-flex">
                          Select
                        </span>
                      )}
                      <ActionIconLink
                        href={material.hasAsset ? `/api/admin/materials/${material.id}/asset` : null}
                        label="Open original"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Icons.ExternalLink size={14} />
                      </ActionIconLink>
                      <ActionIconLink
                        href={material.hasAsset ? `/api/admin/materials/${material.id}/asset?download=1` : null}
                        label="Download"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Icons.Upload size={14} className="rotate-180" />
                      </ActionIconLink>
                      <ActionIconButton
                        label={material.starred ? "Unstar material" : "Star material"}
                        onClick={() => {
                          void updateMaterial(material.id, { starred: !material.starred }, material.starred ? "Material unstarred." : "Material starred.");
                        }}
                      >
                        <Icons.Award size={14} />
                      </ActionIconButton>
                      <MoveMaterialSelect
                        folders={folders}
                        currentFolderId={material.folder?.id ?? null}
                        onMove={(folderId) => void moveMaterials([material.id], folderId)}
                      />
                      <button
                        type="button"
                        title="Link to lesson or course"
                        onClick={(e) => { e.stopPropagation(); setLinkingMaterialId(material.id); }}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5]"
                      >
                        <Icons.Link2 size={12} />
                        Link
                      </button>
                      <ActionIconButton
                        label="Delete material"
                        onClick={() => {
                          void deleteMaterial(material);
                        }}
                      >
                        <Icons.Trash2 size={14} />
                      </ActionIconButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
              </>
            )}

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm">
                <p className="text-slate-500">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    disabled={pagination.page <= 1}
                    className="admin-action secondary"
                  >
                    <Icons.ChevronLeft size={14} />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((value) => Math.min(pagination.totalPages, value + 1))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="admin-action secondary"
                  >
                    Next
                    <Icons.ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {previewPaneVisible && (
            <div className="materials-preview-pane px-3 py-3 xl:px-4">
              <div className="xl:sticky xl:top-4">
                <div className="mb-2 hidden items-center justify-end gap-1 xl:flex">
                  {(["sm", "md", "lg"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      title={{ sm: "Narrow pane", md: "Medium pane", lg: "Wide pane" }[size]}
                      onClick={() => setPreviewPaneSize(size)}
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition",
                        previewPaneSize === size
                          ? "bg-[#185FA5] text-white"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <MaterialPreviewPane
                  material={selectedPreview}
                  fallbackMaterial={selectedListItem}
                  loading={previewLoading}
                  tab={previewTab}
                  onTabChange={setPreviewTab}
                  searchQuery={deferredSearch}
                  folders={folders}
                  allTags={tags}
                  onLink={() => selectedId && setLinkingMaterialId(selectedId)}
                  onDelete={() => selectedListItem && void deleteMaterial(selectedListItem)}
                  onRefresh={() => { setRefreshKey((k) => k + 1); setPreviewRefreshKey((k) => k + 1); }}
                  onUpdate={(id, body, successText) => void updateMaterial(id, body, successText)}
                />
              </div>
            </div>
          )}
        </div>
        </section>
      </div>

      {linkingMaterialId && (
        <LinkToLessonModal
          materialId={linkingMaterialId}
          courses={courses}
          onClose={() => setLinkingMaterialId(null)}
          onLinked={() => {
            setLinkingMaterialId(null);
            setNotice({ type: "success", text: "Material linked to lesson." });
            setRefreshKey((value) => value + 1);
          }}
        />
      )}

        {moveDialogIds && (
        <MoveToFolderDialog
          materialIds={moveDialogIds}
          materials={materials}
          folders={folders}
          currentFolderId={selectedFolderId}
          onClose={() => setMoveDialogIds(null)}
          onMove={async (folderId) => {
            await moveMaterials(moveDialogIds, folderId);
            setMoveDialogIds(null);
          }}
          onCreateAndMove={(name, parentFolderId) => createFolderAndMove(moveDialogIds, name, parentFolderId)}
        />
      )}

      {folderMenu && (
        <FolderContextMenu
          key={folderMenu.folder.id}
          folder={folderMenu.folder}
          x={folderMenu.x}
          y={folderMenu.y}
          onOpen={() => openFolder(folderMenu.folder.id)}
          onRename={(name) => void renameFolder(folderMenu.folder, name)}
          onCreateSubfolder={() => {
            openFolder(folderMenu.folder.id);
            setFolderMenu(null);
          }}
          onDelete={() => void deleteFolder(folderMenu.folder)}
        />
      )}

      {areaMenu && (
        <AreaContextMenu
          x={areaMenu.x}
          y={areaMenu.y}
          folderName={selectedFolder?.name ?? null}
          onUpload={() => {
            setAreaMenu(null);
            setUploadOpen(true);
          }}
          onCreateFolder={(name) => {
            setAreaMenu(null);
            void createFolderInSidebar(name, selectedFolderId);
          }}
        />
      )}
    </div>
  );
}

const DRIVE_VIEW_LABELS: Record<LibraryView, string> = {
  all: "All Materials",
  recent: "Recent",
  starred: "Starred",
  mine: "Uploaded by Me",
  linked: "Linked to Lessons",
  unlinked: "Unlinked Materials",
  failed: "Failed Processing",
  queue: "In Queue",
  archived: "Archived",
  trash: "Trash",
  media: "Media Assets",
  pdfs: "PDFs",
  audio: "Audio",
  transcripts: "Transcripts",
  "source-links": "Source Links",
};

function buildFolderOptions(folders: MaterialFolder[]): Array<{ id: string; label: string }> {
  const active = folders.filter((f) => !f.trashedAt && !f.archivedAt);
  const byId = new Map(active.map((f) => [f.id, f]));
  const result: Array<{ id: string; label: string }> = [];

  function addChildren(parentId: string | null, depth: number) {
    const children = active
      .filter((f) => (parentId === null ? !f.parentFolder : f.parentFolder?.id === parentId))
      .sort((a, b) => a.name.localeCompare(b.name));
    for (const folder of children) {
      result.push({ id: folder.id, label: "  ".repeat(depth * 2) + folder.name });
      if (byId.has(folder.id)) addChildren(folder.id, depth + 1);
    }
  }

  addChildren(null, 0);
  return result;
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#185FA5]/30 bg-[#E6F1FB] pl-2.5 pr-1.5 py-1 text-xs font-semibold text-[#185FA5]">
      {label}
      <button
        type="button"
        aria-label={`Remove filter: ${label}`}
        onClick={onRemove}
        className="rounded-full text-[#185FA5]/60 hover:text-[#185FA5]"
      >
        <Icons.X size={10} />
      </button>
    </span>
  );
}

function buildFolderBreadcrumbs(folders: MaterialFolder[], selectedFolderId: string | null) {
  if (!selectedFolderId) return [];
  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  const crumbs: MaterialFolder[] = [];
  let current = byId.get(selectedFolderId);
  const seen = new Set<string>();
  while (current && !seen.has(current.id)) {
    crumbs.unshift(current);
    seen.add(current.id);
    current = current.parentFolder?.id ? byId.get(current.parentFolder.id) : undefined;
  }
  return crumbs;
}

function isFolderWithin(folders: MaterialFolder[], folderId: string, ancestorId: string) {
  if (folderId === ancestorId) return true;
  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  let current = byId.get(folderId);
  const seen = new Set<string>();

  while (current?.parentFolder?.id && !seen.has(current.id)) {
    if (current.parentFolder.id === ancestorId) return true;
    seen.add(current.id);
    current = byId.get(current.parentFolder.id);
  }

  return false;
}

function MaterialLibrarySidebar({
  view,
  collapsed,
  viewCounts,
  onViewChange,
  folders,
  selectedFolderId,
  onFolderSelect,
  onDropMaterials,
  onFolderContextMenu,
  onCreateFolder,
}: {
  view: LibraryView;
  collapsed: boolean;
  viewCounts: MaterialLibraryCounts;
  onViewChange: (view: LibraryView) => void;
  folders: MaterialFolder[];
  selectedFolderId: string | null;
  onFolderSelect: (id: string) => void;
  onDropMaterials: (event: React.DragEvent, folderId: string | null) => void;
  onFolderContextMenu: (event: React.MouseEvent, folder: MaterialFolder) => void;
  onCreateFolder: (name: string, parentFolderId: string | null) => void;
}) {
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [typesOpen, setTypesOpen] = useState(false);
  const [foldersOpen, setFoldersOpen] = useState(true);

  const primaryViews: LibraryView[] = ["all", "recent", "starred", "mine", "linked", "unlinked", "failed", "archived", "trash"];
  const typeViews: LibraryView[] = ["media", "pdfs", "audio", "transcripts", "source-links"];
  const rootFolders = folders.filter((folder) => !folder.parentFolder && !folder.trashedAt && !folder.archivedAt);
  const childFolders = selectedFolderId
    ? folders.filter((f) => f.parentFolder?.id === selectedFolderId && !f.trashedAt && !f.archivedAt)
    : [];

  function submitNewFolder() {
    const name = newFolderName.trim();
    if (!name) return;
    onCreateFolder(name, selectedFolderId);
    setNewFolderName("");
    setNewFolderOpen(false);
  }

  return (
    <aside className={cn("overflow-hidden border-b border-slate-200 bg-[#f8fafc] xl:border-b-0 xl:border-r", collapsed && "hidden xl:block")} style={{ minWidth: collapsed ? 0 : undefined }}>
      <div className="w-full p-3 xl:w-[240px]">
      <div className="mb-2">
        <p className="px-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Library</p>
      </div>
      <nav className="space-y-0.5">
        {primaryViews.map((entry) => (
          <SidebarButton
            key={entry}
            active={!selectedFolderId && view === entry}
            label={DRIVE_VIEW_LABELS[entry]}
            count={
              entry === "failed" && viewCounts.failed > 0
                ? viewCounts.failed
                : entry === "unlinked" && viewCounts.unlinked > 0
                  ? viewCounts.unlinked
                  : undefined
            }
            onClick={() => onViewChange(entry)}
            onDrop={entry === "all" ? (event) => onDropMaterials(event, null) : undefined}
          />
        ))}
      </nav>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setTypesOpen((v) => !v)}
          className="flex w-full items-center justify-between px-1 py-0.5"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Types</p>
          {typesOpen ? <Icons.ChevronUp size={10} className="text-slate-400" /> : <Icons.ChevronDown size={10} className="text-slate-400" />}
        </button>
        {typesOpen && (
          <nav className="mt-1 space-y-0.5">
            {typeViews.map((entry) => (
              <SidebarButton key={entry} active={!selectedFolderId && view === entry} label={DRIVE_VIEW_LABELS[entry]} onClick={() => onViewChange(entry)} />
            ))}
          </nav>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between px-1 py-0.5">
          <button type="button" onClick={() => setFoldersOpen((v) => !v)} className="flex items-center gap-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Folders</p>
            {foldersOpen ? <Icons.ChevronUp size={10} className="text-slate-400" /> : <Icons.ChevronDown size={10} className="text-slate-400" />}
          </button>
          <button
            type="button"
            title={selectedFolderId ? "Create subfolder here" : "Create new folder"}
            onClick={() => { setNewFolderOpen((v) => !v); setNewFolderName(""); }}
            className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] font-semibold text-slate-400 transition hover:bg-white hover:text-[#185FA5]"
          >
            <Icons.FolderPlus size={11} />
            <span className="hidden xl:inline">New folder</span>
          </button>
        </div>

        {newFolderOpen && (
          <div className="mt-1 mb-1.5 flex items-center gap-1.5">
            <input
              autoFocus
              className="admin-input h-7 flex-1 text-xs"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitNewFolder();
                if (e.key === "Escape") setNewFolderOpen(false);
              }}
              placeholder={selectedFolderId ? "Subfolder name…" : "Folder name…"}
            />
            <button type="button" onClick={submitNewFolder} disabled={!newFolderName.trim()} className="admin-action secondary h-7 px-2">
              <Icons.Check size={11} />
            </button>
          </div>
        )}

        {foldersOpen && (
          <nav className="mt-1 max-h-[280px] space-y-0.5 overflow-y-auto pr-1">
            {rootFolders.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-400">
                No folders yet. Click "New folder" above to create one.
              </p>
            ) : rootFolders.map((folder) => (
              <SidebarButton
                key={folder.id}
                active={selectedFolderId === folder.id}
                label={folder.name}
                count={folder.materialCount ?? 0}
                onClick={() => onFolderSelect(folder.id)}
                onDrop={(event) => onDropMaterials(event, folder.id)}
                onContextMenu={(event) => onFolderContextMenu(event, folder)}
              />
            ))}
            {childFolders.length > 0 && (
              <>
                <p className="mt-2 px-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">Subfolders</p>
                {childFolders.map((folder) => (
                  <SidebarButton
                    key={folder.id}
                    active={selectedFolderId === folder.id}
                    label={folder.name}
                    count={folder.materialCount ?? 0}
                    indent
                    onClick={() => onFolderSelect(folder.id)}
                    onDrop={(event) => onDropMaterials(event, folder.id)}
                    onContextMenu={(event) => onFolderContextMenu(event, folder)}
                  />
                ))}
              </>
            )}
          </nav>
        )}
      </div>
      </div>
    </aside>
  );
}

function SidebarButton({
  active,
  label,
  count,
  indent = false,
  onClick,
  onDrop,
  onContextMenu,
}: {
  active: boolean;
  label: string;
  count?: number | null;
  indent?: boolean;
  onClick: () => void;
  onDrop?: (event: React.DragEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onContextMenu={onContextMenu}
      onDragOver={onDrop ? (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      } : undefined}
      onDrop={onDrop}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-semibold transition",
        indent && "pl-5",
        active ? "bg-[#185FA5] text-white shadow-sm" : "text-slate-600 hover:bg-white hover:text-slate-900"
      )}
    >
      <span className="truncate">{label}</span>
      {typeof count === "number" && (
        <span className={cn("rounded-full px-2 py-0.5 text-[10px]", active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500")}>{count}</span>
      )}
    </button>
  );
}

function FolderStrip({
  folders,
  onOpen,
  onDropMaterials,
  onFolderContextMenu,
}: {
  folders: MaterialFolder[];
  onOpen: (id: string) => void;
  onDropMaterials: (event: React.DragEvent, folderId: string) => void;
  onFolderContextMenu: (event: React.MouseEvent, folder: MaterialFolder) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 6;
  const visible = expanded ? folders : folders.slice(0, LIMIT);

  return (
    <div className="border-b border-slate-100 bg-white px-5 py-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((folder) => (
          <div
            key={folder.id}
            onContextMenu={(event) => onFolderContextMenu(event, folder)}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }}
            onDrop={(event) => onDropMaterials(event, folder.id)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 transition hover:border-[#185FA5]/40 hover:bg-[#f7fbff]"
          >
            <button type="button" onClick={() => onOpen(folder.id)} className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-semibold text-slate-800">{folder.name}</span>
              <span className="text-xs text-slate-500">{folder.materialCount ?? 0} materials</span>
            </button>
            <button
              type="button"
              title="Folder options"
              aria-label="Folder options"
              onClick={(event) => onFolderContextMenu(event, folder)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <Icons.ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
      {folders.length > LIMIT && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-xs font-semibold text-slate-500 transition hover:text-[#185FA5]"
        >
          {expanded ? "Show fewer folders" : `Show ${folders.length - LIMIT} more folder${folders.length - LIMIT === 1 ? "" : "s"}`}
        </button>
      )}
    </div>
  );
}

function FolderContextMenu({
  folder,
  x,
  y,
  onOpen,
  onRename,
  onCreateSubfolder,
  onDelete,
}: {
  folder: MaterialFolder;
  x: number;
  y: number;
  onOpen: () => void;
  onRename: (name: string) => void;
  onCreateSubfolder: () => void;
  onDelete: () => void;
}) {
  const [mode, setMode] = useState<"menu" | "rename">("menu");
  const [draft, setDraft] = useState(folder.name);
  const top = Math.min(y, Math.max(16, window.innerHeight - 220));
  const left = Math.min(x, Math.max(16, window.innerWidth - 248));

  return (
    <div
      className="fixed z-[60] w-60 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
      style={{ top, left }}
      onClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
    >
      {mode === "rename" ? (
        <div className="px-3 py-2">
          <p className="mb-2 text-xs font-semibold text-slate-500">Rename "{folder.name}"</p>
          <input
            autoFocus
            className="admin-input text-sm"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); onRename(draft); }
              if (e.key === "Escape") setMode("menu");
            }}
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => onRename(draft)}
              disabled={!draft.trim()}
              className="admin-action flex-1 justify-center text-xs"
            >
              Save
            </button>
            <button type="button" onClick={() => setMode("menu")} className="admin-action secondary flex-1 justify-center text-xs">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={onOpen}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Icons.ChevronRight size={14} />
            Open folder
          </button>
          <button
            type="button"
            onClick={() => { setDraft(folder.name); setMode("rename"); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Icons.Pencil size={14} />
            Rename folder
          </button>
          <button
            type="button"
            onClick={onCreateSubfolder}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Icons.FolderPlus size={14} />
            Create subfolder here
          </button>
          <div className="my-1 border-t border-slate-100" />
          <button
            type="button"
            onClick={onDelete}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Icons.Trash2 size={14} />
            Delete folder
          </button>
        </>
      )}
    </div>
  );
}

function AreaContextMenu({
  x,
  y,
  folderName,
  onUpload,
  onCreateFolder,
}: {
  x: number;
  y: number;
  folderName: string | null;
  onUpload: () => void;
  onCreateFolder: (name: string) => void;
}) {
  const top = Math.min(y, Math.max(16, window.innerHeight - 200));
  const left = Math.min(x, Math.max(16, window.innerWidth - 220));
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [folderDraft, setFolderDraft] = useState("");

  function submitFolder() {
    if (!folderDraft.trim()) return;
    onCreateFolder(folderDraft.trim());
  }

  return (
    <div
      className="fixed z-[60] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
      style={{ top, left, minWidth: 216 }}
      onClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
    >
      {newFolderOpen ? (
        <div className="px-3 py-2">
          <p className="mb-2 text-xs font-semibold text-slate-500">
            {folderName ? `New folder inside "${folderName}"` : "New folder"}
          </p>
          <input
            autoFocus
            className="admin-input text-sm"
            value={folderDraft}
            onChange={(e) => setFolderDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); submitFolder(); }
              if (e.key === "Escape") setNewFolderOpen(false);
            }}
            placeholder="Folder name…"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={submitFolder}
              disabled={!folderDraft.trim()}
              className="admin-action flex-1 justify-center text-xs"
            >
              Create
            </button>
            <button type="button" onClick={() => setNewFolderOpen(false)} className="admin-action secondary flex-1 justify-center text-xs">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            {folderName ? `In "${folderName}"` : "All Materials"}
          </p>
          <button
            type="button"
            onClick={onUpload}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Icons.Upload size={14} />
            Upload files here
          </button>
          <button
            type="button"
            onClick={() => setNewFolderOpen(true)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Icons.FolderPlus size={14} />
            {folderName ? "New subfolder here" : "New folder"}
          </button>
        </>
      )}
    </div>
  );
}

function BulkActionBar({
  count,
  pendingConfirm,
  onClear,
  onOpenMove,
  onArchive,
  onTrash,
  onConfirmDestructive,
  onCancelDestructive,
  onMarkReviewed,
  onExport,
}: {
  count: number;
  pendingConfirm: { action: string; label: string } | null;
  onClear: () => void;
  onOpenMove: () => void;
  onArchive: () => void;
  onTrash: () => void;
  onConfirmDestructive: () => void;
  onCancelDestructive: () => void;
  onMarkReviewed: () => void;
  onExport: () => void;
}) {
  if (pendingConfirm) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-200 bg-red-50 px-5 py-3">
        <p className="text-sm font-semibold text-red-700">
          {pendingConfirm.label} {count} material{count === 1 ? "" : "s"}? This cannot be undone easily.
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onConfirmDestructive} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700">
            Confirm
          </button>
          <button type="button" onClick={onCancelDestructive} className="text-xs font-semibold text-red-600 hover:text-red-900">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#185FA5]/15 bg-[#f2f7fc] px-5 py-3">
      <p className="text-sm font-semibold text-[#185FA5]">{count} selected</p>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onOpenMove} className="admin-action h-9">Move to folder</button>
        <button type="button" onClick={onMarkReviewed} className="admin-action secondary h-9">Mark reviewed</button>
        <button type="button" onClick={onArchive} className="admin-action secondary h-9">Archive</button>
        <button type="button" onClick={onExport} className="admin-action secondary h-9">Export metadata</button>
        <button type="button" onClick={onTrash} className="admin-action secondary h-9 text-red-600">Trash</button>
        <button type="button" onClick={onClear} className="text-xs font-semibold text-slate-500 hover:text-slate-900">Clear</button>
      </div>
    </div>
  );
}

function MoveMaterialSelect({
  folders,
  currentFolderId,
  onMove,
}: {
  folders: MaterialFolder[];
  currentFolderId: string | null;
  onMove: (folderId: string | null) => void;
}) {
  const options = buildFolderOptions(folders);
  return (
    <select
      title="Move to folder"
      aria-label="Move to folder"
      className="h-8 max-w-[128px] rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-500 transition hover:border-[#185FA5] hover:text-[#185FA5]"
      value={currentFolderId ?? "__root"}
      onClick={(event) => event.stopPropagation()}
      onChange={(event) => {
        event.stopPropagation();
        const nextFolderId = event.target.value === "__root" ? null : event.target.value;
        if ((currentFolderId ?? "__root") === event.target.value) return;
        onMove(nextFolderId);
      }}
    >
      <option value="__root">All Materials</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>{opt.label}</option>
      ))}
    </select>
  );
}

function MoveToFolderDialog({
  materialIds,
  materials,
  folders,
  currentFolderId,
  onClose,
  onMove,
  onCreateAndMove,
}: {
  materialIds: string[];
  materials: MaterialListItem[];
  folders: MaterialFolder[];
  currentFolderId: string | null;
  onClose: () => void;
  onMove: (folderId: string | null) => Promise<void> | void;
  onCreateAndMove: (name: string, parentFolderId: string | null) => Promise<void> | void;
}) {
  const [selectedDestination, setSelectedDestination] = useState(currentFolderId ?? "__root");
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderParentId, setNewFolderParentId] = useState(currentFolderId ?? "__root");
  const [busy, setBusy] = useState(false);
  const selectedMaterials = materialIds
    .map((id) => materials.find((material) => material.id === id))
    .filter((material): material is MaterialListItem => Boolean(material));
  const folderOpts = buildFolderOptions(folders);
  const parentLabel = newFolderParentId === "__root"
    ? "All Materials"
    : folderOpts.find((f) => f.id === newFolderParentId)?.label.trim() ?? "Selected folder";

  async function runMove() {
    setBusy(true);
    try {
      await onMove(selectedDestination === "__root" ? null : selectedDestination);
    } finally {
      setBusy(false);
    }
  }

  async function runCreateAndMove() {
    const name = newFolderName.trim();
    if (!name) return;
    setBusy(true);
    try {
      await onCreateAndMove(name, newFolderParentId === "__root" ? null : newFolderParentId);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Move to folder</h3>
            <p className="mt-1 text-sm text-slate-500">
              Move {materialIds.length} selected material{materialIds.length === 1 ? "" : "s"} into an existing folder, or create a new folder first.
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <Icons.X size={18} />
          </button>
        </div>

        <div className="grid gap-5 px-5 py-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Selected materials</p>
            <div className="max-h-[280px] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50">
              {selectedMaterials.slice(0, 8).map((material) => (
                <div key={material.id} className="flex items-center gap-3 border-b border-slate-100 px-3 py-2 last:border-b-0">
                  <MaterialKindIcon kind={material.kind} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{material.title}</p>
                    <p className="truncate text-xs text-slate-500">{material.folder?.name ?? "All Materials"}</p>
                  </div>
                </div>
              ))}
              {selectedMaterials.length > 8 && (
                <div className="px-3 py-2 text-xs font-semibold text-slate-500">
                  + {selectedMaterials.length - 8} more selected
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <label className="admin-label">Move to existing folder<FieldHint text="Select the destination folder in the library to move the selected material(s)." /></label>
              <select
                className="admin-input"
                value={selectedDestination}
                onChange={(event) => setSelectedDestination(event.target.value)}
              >
                <option value="__root">All Materials</option>
                {folderOpts.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
              <button type="button" onClick={runMove} disabled={busy} className="admin-action mt-3 w-full justify-center">
                {busy ? "Moving..." : `Move ${materialIds.length} material${materialIds.length === 1 ? "" : "s"}`}
              </button>
            </div>

            <div className="rounded-xl border border-[#185FA5]/20 bg-[#f7fbff] p-4">
              <p className="text-sm font-bold text-slate-900">Create new folder and move</p>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="admin-label">Folder name<FieldHint text="The name of the new folder you want to create (e.g., 'Chapter 4', 'Audio Transcripts')." /></label>
                  <input
                    className="admin-input"
                    value={newFolderName}
                    onChange={(event) => setNewFolderName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && newFolderName.trim()) void runCreateAndMove();
                    }}
                    placeholder="e.g. Licensing references"
                  />
                </div>
                <div>
                  <label className="admin-label">Create inside<FieldHint text="Select the parent folder where the new folder should be created. Pick 'All Materials' to create it at the root level." /></label>
                  <select
                    className="admin-input"
                    value={newFolderParentId}
                    onChange={(event) => setNewFolderParentId(event.target.value)}
                  >
                    <option value="__root">All Materials</option>
                    {folderOpts.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={runCreateAndMove}
                  disabled={busy || !newFolderName.trim()}
                  className="admin-action w-full justify-center"
                >
                  {busy ? "Creating..." : `Create in ${parentLabel} and move selected`}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={onClose} className="admin-action secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function MaterialGrid({
  loading,
  materials,
  query,
  selectedId,
  selectedIds,
  folders,
  onSelect,
  onToggleSelected,
  onStar,
  onMove,
  onLink,
  onDelete,
  onDragStart,
  onDragEnd,
}: {
  loading: boolean;
  materials: MaterialListItem[];
  query: string;
  selectedId: string | null;
  selectedIds: Set<string>;
  folders: MaterialFolder[];
  onSelect: (id: string) => void;
  onToggleSelected: (id: string) => void;
  onStar: (material: MaterialListItem) => void;
  onMove: (material: MaterialListItem, folderId: string | null) => void;
  onLink: (id: string) => void;
  onDelete: (material: MaterialListItem) => void;
  onDragStart: (event: React.DragEvent, materialId: string) => void;
  onDragEnd: () => void;
}) {
  if (loading) return <div className="px-5 py-8 text-center text-sm text-slate-400">Loading materials...</div>;
  if (!materials.length) {
    return (
      <div className="px-5 py-12 text-center">
        <Icons.Database size={36} className="mx-auto mb-3 text-slate-200" />
        <p className="text-sm font-semibold text-slate-700">No materials match the current view.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-5 sm:grid-cols-2 2xl:grid-cols-3 min-[1800px]:grid-cols-4">
      {materials.map((material) => (
        <div
          key={material.id}
          role="button"
          tabIndex={0}
          draggable
          onClick={() => onSelect(material.id)}
          onKeyDown={(event) => event.key === "Enter" && onSelect(material.id)}
          onDragStart={(event) => onDragStart(event, material.id)}
          onDragEnd={onDragEnd}
          className={cn(
            "cursor-grab rounded-xl border bg-white p-4 shadow-sm transition active:cursor-grabbing hover:border-[#185FA5]/40 hover:shadow-md",
            selectedId === material.id ? "border-[#185FA5] ring-2 ring-[#E6F1FB]" : "border-slate-200"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <input
                type="checkbox"
                aria-label={`Select ${material.title}`}
                checked={selectedIds.has(material.id)}
                onChange={(event) => {
                  event.stopPropagation();
                  onToggleSelected(material.id);
                }}
                onClick={(event) => event.stopPropagation()}
                className="mt-2 h-4 w-4 rounded border-slate-300 text-[#185FA5]"
              />
              <MaterialKindIcon kind={material.kind} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{material.title}</p>
                <p className="mt-0.5 truncate text-xs text-slate-500">{material.fileName}</p>
              </div>
            </div>
            <button type="button" onClick={(event) => { event.stopPropagation(); onStar(material); }} className="text-slate-400 hover:text-[#185FA5]">
              <Icons.Award size={16} className={material.starred ? "text-[#185FA5]" : undefined} />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <StatusBadge status={material.displayStatus ?? material.status} />
            <KindBadge kind={material.kind} />
            {material.tags.slice(0, 2).map((tag) => <TinyBadge key={tag.id} label={tag.name} />)}
          </div>
          <HighlightedText
            text={material.previewSnippet || material.folder?.name || "No preview snippet available."}
            query={query}
            className="mt-3 line-clamp-3 text-xs leading-5 text-slate-600"
          />
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>{material.linkCount > 0 ? `${material.linkCount} linked` : "Unlinked"}</span>
            <span>{formatBytes(material.sizeBytes)}</span>
          </div>
          <div className="mt-3 flex justify-end gap-1">
            <MoveMaterialSelect
              folders={folders}
              currentFolderId={material.folder?.id ?? null}
              onMove={(folderId) => onMove(material, folderId)}
            />
            <ActionIconButton label="Link material" onClick={() => onLink(material.id)}><Icons.Link2 size={14} /></ActionIconButton>
            <ActionIconButton label="Move to trash" onClick={() => onDelete(material)}><Icons.Trash2 size={14} /></ActionIconButton>
          </div>
        </div>
      ))}
    </div>
  );
}

function LibraryStatChip({
  label,
  value,
  active,
  tone = "slate",
  onClick,
}: {
  label: string;
  value: number;
  active?: boolean;
  tone?: "slate" | "amber" | "red";
  onClick: () => void;
}) {
  const toneClasses = {
    slate: active ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]" : "border-slate-200 bg-white text-slate-700 hover:border-[#b8d7f0]",
    amber: active ? "border-amber-300 bg-amber-50 text-amber-800" : "border-amber-200 bg-amber-50/70 text-amber-800 hover:border-amber-300",
    red: active ? "border-red-300 bg-red-50 text-red-700" : "border-red-200 bg-red-50/70 text-red-700 hover:border-red-300",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${label}: ${value.toLocaleString()} materials`}
      className={cn(
        INTERACTIVE_FOCUS,
        "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-left",
        toneClasses
      )}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] opacity-80">{label}</span>
      <span className="text-lg font-extrabold tabular-nums">{value.toLocaleString()}</span>
    </button>
  );
}

function MaterialKindIcon({ kind, compact = false }: { kind: MaterialKind; compact?: boolean }) {
  const className =
    kind === "video"
      ? "bg-violet-100 text-violet-700"
      : kind === "audio"
      ? "bg-amber-100 text-amber-700"
      : kind === "image"
      ? "bg-pink-100 text-pink-700"
      : "bg-slate-100 text-slate-600";

  const Icon = kind === "video" ? Icons.Video : kind === "audio" ? Icons.List : kind === "image" ? Icons.Image : Icons.FileText;
  return (
    <span className={cn(
      "flex shrink-0 items-center justify-center rounded-lg",
      compact ? "h-6 w-6" : "h-8 w-8",
      className
    )}>
      <Icon size={compact ? 12 : 14} />
    </span>
  );
}

function TinyBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
      {label}
    </span>
  );
}

function KindBadge({ kind }: { kind: MaterialKind }) {
  const label = kind === "video" ? "Video" : kind === "audio" ? "Audio" : kind === "image" ? "Image" : "Document";
  const className =
    kind === "video"
      ? "bg-violet-100 text-violet-700"
      : kind === "audio"
      ? "bg-amber-100 text-amber-700"
      : kind === "image"
      ? "bg-pink-100 text-pink-700"
      : "bg-slate-100 text-slate-600";

  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", className)}>{label}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ready: "bg-emerald-100 text-emerald-700",
    parsed: "bg-emerald-100 text-emerald-700",
    uploaded: "bg-blue-100 text-blue-700",
    failed: "bg-red-100 text-red-700",
    "needs-ocr": "bg-orange-100 text-orange-700",
    "needs-review": "bg-amber-100 text-amber-700",
    unlinked: "bg-slate-100 text-slate-600",
    linked: "bg-emerald-100 text-emerald-700",
    archived: "bg-slate-200 text-slate-700",
    trash: "bg-red-100 text-red-700",
    duplicate: "bg-violet-100 text-violet-700",
    "missing-transcript": "bg-amber-100 text-amber-700",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", map[status] ?? "bg-slate-100 text-slate-600")}>
      {status}
    </span>
  );
}

function ActionIconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#185FA5] hover:text-[#185FA5]"
    >
      {children}
    </button>
  );
}

function ActionIconLink({
  children,
  href,
  label,
  onClick,
}: {
  children: React.ReactNode;
  href: string | null;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  if (!href) {
    return (
      <span
        title={`${label} unavailable`}
        aria-label={`${label} unavailable`}
        className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-300"
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#185FA5] hover:text-[#185FA5]"
    >
      {children}
    </a>
  );
}

function MaterialPreviewPane({
  material,
  fallbackMaterial,
  loading,
  tab,
  onTabChange,
  searchQuery,
  folders,
  allTags,
  onLink,
  onDelete,
  onRefresh,
  onUpdate,
}: {
  material: MaterialPreviewResponse | null;
  fallbackMaterial: MaterialListItem | null;
  loading: boolean;
  tab: PreviewTab;
  onTabChange: (tab: PreviewTab) => void;
  searchQuery: string;
  folders: MaterialFolder[];
  allTags: MaterialTag[];
  onLink: () => void;
  onDelete: () => void;
  onRefresh: () => void;
  onUpdate: (id: string, body: Record<string, unknown>, successText: string) => void;
}) {
  const [reparseLoading, setReparseLoading] = useState(false);
  const [reparseError, setReparseError] = useState<string | null>(null);
  const [reparseElapsed, setReparseElapsed] = useState(0);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const t = await u.getIdToken();
          setToken(t);
        } catch {
          setToken(null);
        }
      } else {
        setToken(null);
      }
    });
  }, []);

  const materialInfo = material?.material ?? fallbackMaterial;

  useEffect(() => {
    setEditingTitle(false);
    setReparseError(null);
  }, [materialInfo?.id]);

  // Tick elapsed time while reparse is running
  useEffect(() => {
    if (!reparseLoading) { setReparseElapsed(0); return; }
    setReparseElapsed(0);
    const interval = setInterval(() => setReparseElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [reparseLoading]);

  async function handleReparse() {
    const id = materialInfo?.id;
    if (!id) return;
    setReparseLoading(true);
    setReparseError(null);
    try {
      const res = await fetch(`/api/admin/materials/${id}?action=reparse`, { method: "PATCH" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setReparseError(data.error ?? "Re-parse failed.");
      } else {
        onRefresh();
      }
    } catch {
      setReparseError("Network error — re-parse could not complete.");
    } finally {
      setReparseLoading(false);
    }
  }

  function getReparseEta(info: MaterialListItem): string {
    const mb = (info.sizeBytes ?? 0) / (1024 * 1024);
    if (info.kind === "audio" || info.kind === "video") {
      // Rough estimate: faster-whisper base ~3× real-time on CPU; audio ≈ 1 MB/min at 128 kbps
      const estimatedAudioMinutes = mb; // ~1 MB per minute of audio at 128 kbps
      const transcriptionSeconds = Math.round(estimatedAudioMinutes * 20); // ~20s per minute of audio on CPU
      if (transcriptionSeconds < 30) return "about 30 seconds";
      if (transcriptionSeconds < 90) return "about 1 minute";
      const mins = Math.ceil(transcriptionSeconds / 60);
      return `about ${mins} minutes`;
    }
    if (info.kind === "document") {
      const pages = info.pages ?? Math.max(1, Math.round(mb * 10));
      if (pages <= 5) return "a few seconds";
      if (pages <= 20) return "under 30 seconds";
      return `about ${Math.ceil(pages / 10)} minutes (OCR may be needed)`;
    }
    return "a moment";
  }

  function commitTitleEdit() {
    const trimmed = titleDraft.trim();
    if (!trimmed || !materialInfo || trimmed === materialInfo.title) {
      setEditingTitle(false);
      return;
    }
    onUpdate(materialInfo.id, { title: trimmed }, "Title updated.");
    setEditingTitle(false);
  }

  const tabs: Array<{ id: PreviewTab; label: string }> = [
    { id: "preview", label: "Preview" },
    { id: "content", label: "Content" },
    { id: "links", label: "Links" },
    { id: "details", label: "Details" },
  ];

  if (!materialInfo) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
        <Icons.Eye size={24} className="mx-auto mb-3 text-slate-300" />
        <p className="text-sm font-semibold text-slate-700">Select a material to inspect it.</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          The detail pane will show content preview, links, metadata, and original asset actions.
        </p>
      </div>
    );
  }

  const preview = material?.preview ?? {
    extractedText: "",
    csvPreview: null,
    links: [],
    formattedMode: null,
    formattedHtml: null,
  };
  const rawAssetHref = "assetHref" in materialInfo && typeof materialInfo.assetHref === "string" ? materialInfo.assetHref : null;
  const rawAssetDownloadHref =
    "assetDownloadHref" in materialInfo && typeof materialInfo.assetDownloadHref === "string"
      ? materialInfo.assetDownloadHref
      : null;

  const assetHref = rawAssetHref && token
    ? `${rawAssetHref}${rawAssetHref.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`
    : rawAssetHref;

  const assetDownloadHref = rawAssetDownloadHref && token
    ? `${rawAssetDownloadHref}${rawAssetDownloadHref.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`
    : rawAssetDownloadHref;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {editingTitle ? (
                <input
                  autoFocus
                  className="admin-input text-base font-bold"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={commitTitleEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitTitleEdit();
                    if (e.key === "Escape") setEditingTitle(false);
                  }}
                />
              ) : (
                <button
                  type="button"
                  title="Click to edit title"
                  onClick={() => { setTitleDraft(materialInfo.title); setEditingTitle(true); }}
                  className="truncate text-base font-bold text-slate-900 transition hover:text-[#185FA5] hover:underline hover:decoration-dotted"
                >
                  {materialInfo.title}
                </button>
              )}
              <StatusBadge status={materialInfo.displayStatus ?? materialInfo.status} />
              <KindBadge kind={materialInfo.kind} />
            </div>
            <p className="mt-1 truncate text-xs text-slate-500">{materialInfo.fileName}</p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            <ActionIconLink href={assetHref} label="Open original">
              <Icons.ExternalLink size={14} />
            </ActionIconLink>
            <ActionIconLink href={assetDownloadHref} label="Download">
              <Icons.Upload size={14} className="rotate-180" />
            </ActionIconLink>
            <ActionIconButton
              label={materialInfo.starred ? "Unstar" : "Star"}
              onClick={() => onUpdate(materialInfo.id, { starred: !materialInfo.starred }, materialInfo.starred ? "Unstarred." : "Starred.")}
            >
              <Icons.Award size={14} className={materialInfo.starred ? "text-[#185FA5]" : undefined} />
            </ActionIconButton>
            {(isPdfMaterial(materialInfo) || isDocxMaterial(materialInfo) || isTranscribableMediaMaterial(materialInfo)) && (
              <button
                type="button"
                title="Re-parse content"
                aria-label="Re-parse content"
                onClick={handleReparse}
                disabled={reparseLoading}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-500 transition hover:border-[#185FA5] hover:text-[#185FA5] disabled:opacity-60"
              >
                <Icons.RotateCcw size={13} className={reparseLoading ? "animate-spin" : undefined} />
                Re-parse
              </button>
            )}
            <ActionIconButton label="Link material" onClick={onLink}>
              <Icons.Link2 size={14} />
            </ActionIconButton>
            <ActionIconButton label="Delete material" onClick={onDelete}>
              <Icons.Trash2 size={14} />
            </ActionIconButton>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <TinyBadge label={PARSER_LABELS[materialInfo.parser] ?? materialInfo.parser} />
          {materialInfo.pages != null && <TinyBadge label={`${materialInfo.pages} pages`} />}
          {materialInfo.characters > 0 && <TinyBadge label={`${materialInfo.characters.toLocaleString()} chars`} />}
          {materialInfo.sizeBytes > 0 && <TinyBadge label={formatBytes(materialInfo.sizeBytes)} />}
          {materialInfo.linkCount > 0 && <TinyBadge label={`${materialInfo.linkCount} links`} />}
          {materialInfo.folder?.name && <TinyBadge label={materialInfo.folder.name} />}
          {materialInfo.reviewStatus && <TinyBadge label={materialInfo.reviewStatus.replace(/_/g, " ")} />}
          {materialInfo.hasAsset && <TinyBadge label="Original asset" />}
          {preview.formattedMode === "pdf" && <TinyBadge label="Fidelity PDF preview" />}
          {preview.formattedMode === "docx" && preview.formattedHtml && <TinyBadge label="Formatted DOCX preview" />}
        </div>
      </div>

      <div className="materials-preview-tabs px-3 py-2">
        <div className="flex flex-wrap gap-1">
          {tabs.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => onTabChange(entry.id)}
              className={tab === entry.id ? "materials-preview-tab-btn-active" : "materials-preview-tab-btn"}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        {reparseLoading && (
          <div className="mb-3 space-y-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Icons.Loader size={14} className="animate-spin text-[#185FA5]" />
              <p className="text-xs font-semibold text-[#185FA5]">
                {(materialInfo.kind === "audio" || materialInfo.kind === "video")
                  ? "Transcribing audio…"
                  : "Parsing document…"}
              </p>
              <span className="ml-auto text-xs tabular-nums text-blue-400">
                {reparseElapsed}s elapsed
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-200">
              <div
                className="h-full rounded-full bg-[#185FA5] transition-all duration-1000"
                style={{ width: `${Math.min(92, (reparseElapsed / 3) * 4)}%` }}
              />
            </div>
            <p className="text-[11px] text-blue-500">
              Estimated time: {getReparseEta(materialInfo)}. Please wait — the page will update automatically.
            </p>
          </div>
        )}
        {reparseError && (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <Icons.AlertCircle size={13} className="mt-0.5 shrink-0" />
            {reparseError}
          </div>
        )}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Icons.Loader size={16} className="animate-spin" />
            Loading preview…
          </div>
        )}

        {/* Keep panels mounted so their components don't unmount/remount on every selection.
            Unmounting triggers ReactDOM.preload() calls in Next.js that produce console warnings. */}
        <div className={loading ? "hidden" : undefined}>
          <div className={tab !== "preview" ? "hidden" : undefined}>
            <PreviewTabPanel material={materialInfo} preview={preview} searchQuery={searchQuery} />
          </div>
          <div className={tab !== "content" ? "hidden" : undefined}>
            <ContentTabPanel
              materialId={materialInfo.id}
              kind={materialInfo.kind}
              extractedText={preview.extractedText}
              formattedHtml={preview.formattedHtml}
              formattedMode={preview.formattedMode}
              searchQuery={searchQuery}
              onSaved={(newText) => {
                onRefresh();
                preview.extractedText = newText;
              }}
            />
          </div>
          <div className={tab !== "links" ? "hidden" : undefined}>
            <LinksTabPanel links={preview.links} />
          </div>
          <div className={tab !== "details" ? "hidden" : undefined}>
            <DetailsTabPanel material={materialInfo} folders={folders} allTags={allTags} onUpdate={onUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewTabPanel({
  material,
  preview,
  searchQuery,
}: {
  material: MaterialPreviewResponse["material"] | MaterialListItem;
  preview: MaterialPreviewResponse["preview"];
  searchQuery: string;
}) {
  const summaryCards = [
    { label: "Added", value: formatDateTime(material.createdAt) },
    { label: "Parser", value: PARSER_LABELS[material.parser] ?? material.parser },
    { label: "Status", value: material.status },
    { label: "Usage", value: material.linkCount > 0 ? `${material.linkCount} linked` : "Unlinked" },
  ];
  const csvPreview = preview.csvPreview;
  const assetHref = "assetHref" in material && typeof material.assetHref === "string" ? material.assetHref : null;
  const hasFormattedDocx = preview.formattedMode === "docx" && Boolean(preview.formattedHtml);
  const hasPdfStage = preview.formattedMode === "pdf" && Boolean(assetHref);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{card.label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{card.value}</p>
          </div>
        ))}
      </div>

      {hasPdfStage ? (
        <DocumentStage
          title={material.fileName}
          subtitle="Original PDF layout with embedded images and page fidelity"
          toolbarLabel="PDF preview"
        >
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_14px_36px_-26px_rgba(15,23,42,0.4)]">
            <iframe
              src={assetHref ?? undefined}
              title={`${material.title} PDF preview`}
              className="h-[760px] w-full bg-white"
              allow="fullscreen"
            />
          </div>
          {assetHref && (
            <div className="mt-3 flex items-center justify-end gap-4">
              <a
                href={assetHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#185FA5] transition hover:underline"
              >
                <Icons.ExternalLink size={12} />
                Open PDF in new tab
              </a>
            </div>
          )}
        </DocumentStage>
      ) : hasFormattedDocx && preview.formattedHtml ? (
        <DocumentStage
          title={material.fileName}
          subtitle="Rendered from the original Word document with document structure and inline media preserved"
          toolbarLabel="Word layout"
        >
          <div className="max-h-[780px] overflow-y-auto">
            <RenderedDocumentHtml html={preview.formattedHtml} />
          </div>
        </DocumentStage>
      ) : material.kind === "video" && assetHref ? (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.5)]">
          <div className="border-b border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
            Original video preview
          </div>
          <video controls preload="metadata" src={assetHref} className="aspect-video w-full" />
        </div>
      ) : material.kind === "audio" && assetHref ? (
        <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#334155_100%)] p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.55)]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Original audio preview</p>
          <p className="mt-2 text-sm text-white/80">
            Review the uploaded recording directly while keeping the library metadata and link context nearby.
          </p>
          <audio controls preload="metadata" src={assetHref} className="mt-5 w-full" />
        </div>
      ) : material.kind === "image" && assetHref ? (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.15)] flex justify-center items-center p-4">
          <img src={assetHref} alt={material.title} className="max-w-full max-h-[600px] object-contain rounded-xl" />
        </div>
      ) : material.parser === "csv-parse" && csvPreview ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">CSV preview</p>
            <span className="text-xs text-slate-500">{csvPreview.totalRows.toLocaleString()} rows detected</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    {csvPreview.headers.map((header, index) => (
                      <th key={`${header}-${index}`} className="px-3 py-2 font-semibold">{header || `Column ${index + 1}`}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {csvPreview.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {csvPreview.headers.map((_, cellIndex) => (
                        <td key={cellIndex} className="max-w-[220px] px-3 py-2 align-top text-slate-600">
                          {row[cellIndex] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : preview.extractedText ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Reader preview</p>
              <p className="text-xs text-slate-500">
                This material does not expose a fidelity-rendered surface yet, so the preview falls back to a polished reading mode.
              </p>
            </div>
            {(isPdfMaterial(material) || isDocxMaterial(material)) && (
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                Content-first fallback
              </span>
            )}
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#fffefb_0%,#f8f5ee_100%)] p-6 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.38)]">
            <HighlightedText
              text={preview.extractedText.slice(0, 1600)}
              query={searchQuery}
              className="whitespace-pre-wrap font-serif text-[15px] leading-8 text-slate-700"
            />
            {preview.extractedText.length > 1600 && (
              <p className="mt-3 text-xs font-medium text-slate-400">
                Showing the opening excerpt here. Use the Content tab for the full extracted text.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
          <Icons.Info size={20} className="mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No inline preview available.</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            This material does not currently expose extracted content. Open the original asset when available for a fidelity-first inspection.
          </p>
        </div>
      )}
    </div>
  );
}

function ContentTabPanel({
  materialId,
  kind,
  extractedText,
  formattedHtml,
  formattedMode,
  searchQuery,
  onSaved,
}: {
  materialId: string;
  kind: MaterialKind;
  extractedText: string;
  formattedHtml: string | null;
  formattedMode: "pdf" | "docx" | null;
  searchQuery: string;
  onSaved: (newText: string) => void;
}) {
  const [showRawText, setShowRawText] = useState(searchQuery.trim().length > 0 || !formattedHtml);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setShowRawText(searchQuery.trim().length > 0 || !formattedHtml);
  }, [formattedHtml, searchQuery]);

  function openEditor() {
    setDraft(extractedText);
    setSaveError(null);
    setEditing(true);
  }

  async function saveTranscript(text: string) {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/admin/materials/${materialId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extractedText: text }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(json.error ?? "Save failed.");
      }
      onSaved(text);
      setEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadTranscriptFile(file: File) {
    setSaving(true);
    setSaveError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/admin/materials/${materialId}/transcript`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(json.error ?? "Upload failed.");
      }
      const text = await file.text();
      onSaved(text.replace(/\r\n/g, "\n").trim());
      setEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSaving(false);
    }
  }

  const isMediaKind = kind === "audio" || kind === "video";

  if (editing) {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="flex items-center gap-1 text-sm font-semibold text-slate-800">Edit transcript<FieldHint text="Paste or type the full transcript text. This is used for search indexing and student reading. Upload a .txt file to replace the entire transcript at once." /></p>
            <p className="text-xs text-slate-500">
              Paste or type the transcript directly, or upload a .txt file below.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5]">
              Upload .txt
              <input
                type="file"
                accept=".txt,text/plain"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadTranscriptFile(file);
                  e.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              disabled={saving}
              onClick={() => setEditing(false)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void saveTranscript(draft)}
              className="rounded-full bg-[#185FA5] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#134e87] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
        {saveError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">{saveError}</p>
        )}
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={20}
          className="w-full rounded-2xl border border-slate-200 bg-white p-5 font-mono text-sm leading-6 text-slate-700 focus:border-[#185FA5] focus:outline-none focus:ring-1 focus:ring-[#185FA5]"
          placeholder="Paste or type the transcript here…"
        />
      </div>
    );
  }

  if (!extractedText && !formattedHtml) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
        <Icons.FileText size={20} className="mx-auto mb-3 text-slate-300" />
        <p className="text-sm font-semibold text-slate-700">
          {isMediaKind ? "No transcript captured." : "No extracted content captured."}
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {isMediaKind
            ? "Transcription requires Whisper or faster-whisper on the server. You can also add one manually."
            : "The content tab becomes available when text extraction succeeds or the material can be reparsed from its asset."}
        </p>
        {isMediaKind && (
          <button
            type="button"
            onClick={openEditor}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#185FA5] hover:text-[#185FA5]"
          >
            <Icons.Pencil size={13} />
            Add transcript manually
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="text-xs text-slate-500">
          {extractedText ? (
            <p>{extractedText.length.toLocaleString()} characters of searchable content are available.</p>
          ) : (
            <p>Structured document rendering is available for this material.</p>
          )}
          {searchQuery.trim() && <p className="mt-1">Highlights are matched against the current library search.</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openEditor}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5]"
          >
            <Icons.Pencil size={12} />
            Edit transcript
          </button>
          {formattedHtml && (
            <button
              type="button"
              onClick={() => setShowRawText((current) => !current)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#185FA5] hover:text-[#185FA5]"
            >
              {showRawText ? "Hide extracted text" : "Show extracted text"}
            </button>
          )}
          {formattedMode && (
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500">
              {formattedMode === "docx" ? "Structured reader mode" : "Searchable PDF text"}
            </span>
          )}
        </div>
      </div>

      {formattedHtml && (
        <DocumentStage
          title="Reader mode"
          subtitle="Structured content flow optimized for reading and copying while keeping the document hierarchy intact"
          toolbarLabel={formattedMode === "docx" ? "Word reader" : "Document reader"}
        >
          <div className="max-h-[680px] overflow-y-auto">
            <RenderedDocumentHtml html={formattedHtml} compact />
          </div>
        </DocumentStage>
      )}

      {extractedText && showRawText && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Searchable text layer</p>
              <p className="text-xs text-slate-500">
                Best for quick scanning, keyword matching, and copy/paste across large archives.
              </p>
            </div>
          </div>
          <div className="max-h-[720px] overflow-y-auto rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#fffefb_0%,#f8f5ee_100%)] p-6 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.38)]">
            <HighlightedText
              text={extractedText}
              query={searchQuery}
              className="whitespace-pre-wrap font-serif text-[15px] leading-8 text-slate-700"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function LinksTabPanel({ links }: { links: MaterialLinkSummary[] }) {
  if (!links.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
        <Icons.Link2 size={20} className="mx-auto mb-3 text-slate-300" />
        <p className="text-sm font-semibold text-slate-700">This material is not linked yet.</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Link it to a lesson to make the source material easier to trace through curriculum workflows.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <div key={link.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <TinyBadge label={link.question ? "Question" : link.lesson ? "Lesson" : link.course ? "Course" : "Link"} />
            {link.referenceLabel ? <TinyBadge label={link.referenceLabel} /> : null}
            {link.createdAt ? <TinyBadge label={formatDateTime(link.createdAt)} /> : null}
          </div>
          <div className="mt-3 space-y-1 text-sm text-slate-700">
            {link.course && <p><span className="font-semibold text-slate-900">Course:</span> {link.course.title}</p>}
            {link.lesson && <p><span className="font-semibold text-slate-900">Lesson:</span> {link.lesson.title}</p>}
            {link.lesson?.module && <p><span className="font-semibold text-slate-900">Module:</span> {link.lesson.module.title}</p>}
            {link.question && <p><span className="font-semibold text-slate-900">Question:</span> {link.question.questionText}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailsTabPanel({
  material,
  folders,
  allTags,
  onUpdate,
}: {
  material: MaterialPreviewResponse["material"] | MaterialListItem;
  folders: MaterialFolder[];
  allTags: MaterialTag[];
  onUpdate: (id: string, body: Record<string, unknown>, successText: string) => void;
}) {
  const metadataEntries = Object.entries(material.metadata ?? {}).filter(([, value]) => value != null && value !== "");
  const [tagInput, setTagInput] = useState("");
  const activeFolders = folders.filter((f) => !f.trashedAt && !f.archivedAt);
  const currentTags = material.tags.map((t) => t.name);

  function removeTag(name: string) {
    const next = currentTags.filter((t) => t !== name);
    onUpdate(material.id, { tags: next }, `Tag "${name}" removed.`);
  }

  function addTag(name: string) {
    const trimmed = name.trim();
    if (!trimmed || currentTags.includes(trimmed)) return;
    onUpdate(material.id, { tags: [...currentTags, trimmed] }, `Tag "${trimmed}" added.`);
    setTagInput("");
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <DetailCard label="Created" value={formatDateTime(material.createdAt)} />
        <DetailCard label="Updated" value={formatDateTime(material.updatedAt)} />
        <DetailCard label="Uploader" value={material.uploader?.fullName ?? material.uploader?.email ?? "Unknown"} />
        <DetailCard label="MIME type" value={material.fileType} />
        <DetailCard label="Original asset" value={material.hasAsset ? "Available" : "Unavailable"} />
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
          <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Folder<FieldHint text="Move this material to a different folder. The change takes effect immediately." /></p>
          <select
            className="mt-1 w-full rounded-lg border-0 bg-transparent p-0 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-0"
            value={material.folder?.id ?? "__root"}
            onChange={(e) => {
              const folderId = e.target.value === "__root" ? null : e.target.value;
              onUpdate(material.id, { folderId }, folderId ? "Moved to folder." : "Moved to All Materials.");
            }}
          >
            <option value="__root">All Materials</option>
            {activeFolders.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Tags<FieldHint text="Add or remove tags to keep this material discoverable. Tags help filter and group materials across the library." /></p>
        <div className="mt-3 flex flex-wrap gap-2">
          {currentTags.map((name) => (
            <span key={name} className="inline-flex items-center gap-1 rounded-full bg-slate-100 pl-2.5 pr-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
              {name}
              <button
                type="button"
                aria-label={`Remove tag ${name}`}
                onClick={() => removeTag(name)}
                className="rounded-full text-slate-400 hover:text-red-600"
              >
                <Icons.X size={10} />
              </button>
            </span>
          ))}
          <div className="flex items-center gap-1">
            <input
              list="details-tag-suggestions"
              className="h-6 rounded-full border border-dashed border-slate-300 bg-slate-50 px-2.5 text-[10px] font-semibold text-slate-600 placeholder:text-slate-400 focus:border-[#185FA5] focus:outline-none"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); }
              }}
              placeholder="+ Add tag"
            />
            <datalist id="details-tag-suggestions">
              {allTags.filter((t) => !currentTags.includes(t.name)).map((t) => (
                <option key={t.id} value={t.name} />
              ))}
            </datalist>
          </div>
        </div>
      </div>

      {material.latestJob && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Latest ingestion job</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <DetailCard label="Job status" value={material.latestJob.status ?? "Unknown"} compact />
            <DetailCard label="Parser" value={material.latestJob.parser ?? material.parser} compact />
            <DetailCard label="Extracted chars" value={(material.latestJob.extractedCharacters ?? material.characters).toLocaleString()} compact />
            <DetailCard label="Completed" value={material.latestJob.completedAt ? formatDateTime(material.latestJob.completedAt) : "Pending"} compact />
            {typeof material.metadata?.transcriptionBinary === "string" && (
              <DetailCard label="Transcription binary" value={material.metadata.transcriptionBinary} compact />
            )}
            {typeof material.metadata?.transcriptionModel === "string" && (
              <DetailCard label="Transcription model" value={material.metadata.transcriptionModel} compact />
            )}
            {typeof material.metadata?.transcriptionProvider === "string" && material.metadata.transcriptionProvider !== "local-whisper" && (
              <DetailCard label="Transcription provider" value={material.metadata.transcriptionProvider} compact />
            )}
          </div>
          {material.latestJob.errorMessage && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{material.latestJob.errorMessage}</p>
          )}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Metadata</p>
        </div>
        <div className="divide-y divide-slate-100">
          {metadataEntries.length === 0 ? (
            <div className="px-4 py-4 text-sm text-slate-500">No extra metadata recorded.</div>
          ) : (
            metadataEntries.map(([key, value]) => (
              <div key={key} className="grid gap-2 px-4 py-3 sm:grid-cols-[140px_minmax(0,1fr)]">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">{key}</p>
                <p className="text-sm text-slate-700">
                  {Array.isArray(value) ? value.join(", ") : String(value)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {material.activities.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Recent activity</p>
          </div>
          <div className="divide-y divide-slate-100">
            {material.activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="px-4 py-3">
                <p className="text-sm font-semibold text-slate-700">{activity.message ?? activity.activityType}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {activity.createdAt ? formatDateTime(activity.createdAt) : "Recent"} · {activity.actor?.fullName ?? activity.actor?.email ?? "System"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCard({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white px-3 py-3", compact && "bg-white")}>
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

interface LinkToLessonModalProps {
  materialId: string;
  courses: Course[];
  onClose: () => void;
  onLinked: () => void;
}

function LinkToLessonModal({ materialId, courses, onClose, onLinked }: LinkToLessonModalProps) {
  const [linkTarget, setLinkTarget] = useState<"lesson" | "course">("lesson");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const course = courses.find((entry) => entry.id === selectedCourse);
  const canSubmit = linkTarget === "course" ? Boolean(selectedCourse) : Boolean(selectedLesson);

  async function handleLink() {
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    try {
      const body = linkTarget === "course"
        ? { materialId, courseId: selectedCourse, referenceLabel: label || null }
        : { materialId, lessonId: selectedLesson, referenceLabel: label || null };
      const res = await fetch("/api/admin/materials/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to link material");
      }
      onLinked();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Link material to curriculum</h3>
            <p className="text-sm text-slate-500">Attach this source material to a lesson or course for traceability.</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <Icons.X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          {/* Link target toggle */}
          <div>
            <label className="admin-label">Link to<FieldHint text="Choose whether to link this material to the whole course (all lessons) or to a specific lesson within the course." /></label>
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 w-fit">
              <button
                type="button"
                onClick={() => { setLinkTarget("lesson"); setSelectedLesson(""); }}
                className={cn(
                  "rounded-md px-4 py-1.5 text-xs font-semibold transition",
                  linkTarget === "lesson" ? "bg-white shadow-sm text-[#185FA5]" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Lesson
              </button>
              <button
                type="button"
                onClick={() => { setLinkTarget("course"); setSelectedLesson(""); }}
                className={cn(
                  "rounded-md px-4 py-1.5 text-xs font-semibold transition",
                  linkTarget === "course" ? "bg-white shadow-sm text-[#185FA5]" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Course
              </button>
            </div>
          </div>

          <div>
            <label className="admin-label">Course<FieldHint text="Select the course this material belongs to. If linking to a specific lesson, pick the course first to narrow the lesson list." /></label>
            <select
              className="admin-input"
              value={selectedCourse}
              onChange={(event) => {
                setSelectedCourse(event.target.value);
                setSelectedLesson("");
              }}
            >
              <option value="">Select a course…</option>
              {courses.map((entry) => (
                <option key={entry.id} value={entry.id}>{entry.title}</option>
              ))}
            </select>
          </div>

          {linkTarget === "lesson" && course && (
            <div>
              <label className="admin-label">Lesson<FieldHint text="The specific lesson this material directly supports. Students will find it in that lesson's resource list." /></label>
              <select
                className="admin-input"
                value={selectedLesson}
                onChange={(event) => setSelectedLesson(event.target.value)}
              >
                <option value="">Select a lesson…</option>
                {course.modules_on_course.map((module) => (
                  <optgroup key={module.id} label={module.title}>
                    {module.lessons_on_module.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="admin-label">Reference label (optional)<FieldHint text="A short label describing how this material is used in the lesson (e.g. 'Primary reading', 'Worked example', 'Appeal packet'). Shown to students alongside the file." /></label>
            <input
              className="admin-input"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="e.g. Primary reading, worked example, appeal packet"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={onClose} className="admin-action secondary">Cancel</button>
          <button type="button" onClick={handleLink} disabled={busy || !canSubmit} className="admin-action">
            {busy ? "Linking…" : "Link material"}
          </button>
        </div>
      </div>
    </div>
  );
}
