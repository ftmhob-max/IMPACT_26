"use client";

import { type ReactNode, useDeferredValue, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { FileDropZone } from "./FileDropZone";
import * as Icons from "@/components/ui/Icons";

type MaterialKind = "document" | "audio" | "video" | "image";
type PreviewTab = "preview" | "content" | "links" | "details";

interface MaterialListItem {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A-Z" },
  { value: "size", label: "File size" },
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
  const [materials, setMaterials] = useState<MaterialListItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
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
  const [uploadOpen, setUploadOpen] = useState(false);
  const [linkingMaterialId, setLinkingMaterialId] = useState<string | null>(null);
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
  const [pendingSelectionId, setPendingSelectionId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

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
    });

    if (deferredSearch.trim()) params.set("q", deferredSearch.trim());
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
        setPagination(data.pagination ?? pagination);

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

        if (!selectedId || !data.materials.some((material) => material.id === selectedId)) {
          setSelectedId(data.materials[0].id);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [deferredSearch, kind, parser, status, linked, hasAsset, hasText, sort, direction, page, refreshKey, pendingSelectionId, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    let ignore = false;
    setPreviewLoading(true);
    fetch(`/api/admin/materials/${selectedId}/preview`, { cache: "no-store" })
      .then(async (res) => (res.ok ? (await res.json()) as MaterialPreviewResponse : null))
      .then((data) => {
        if (!ignore) {
          setSelectedPreview(data);
          setPreviewTab("preview");
        }
      })
      .finally(() => {
        if (!ignore) setPreviewLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [selectedId]);

  const selectedListItem = useMemo(
    () => materials.find((material) => material.id === selectedId) ?? null,
    [materials, selectedId]
  );

  async function upload() {
    if (!uploadItems.length || uploadItems.some((item) => !item.title.trim())) return;
    setBusy(true);

    const data: UploadResult = {
      id: "",
      created: [],
      failed: [],
      summary: { total: 0, succeeded: 0, failed: 0, warnings: 0 },
    };

    try {
      for (const item of uploadItems) {
        const res = await fetch("/api/admin/materials", {
          method: "POST",
          headers: {
            "Content-Type": item.file.type || "application/octet-stream",
            "X-File-Name": encodeURIComponent(item.file.name),
            "X-Title": encodeURIComponent(item.title.trim()),
          },
          body: item.file,
        });

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
        } else {
          const errorData = await readApiError(res);
          data.failed.push({
            fileName: item.file.name,
            title: item.title,
            error: errorData.error ?? "Upload failed.",
          });
          if (data.summary) data.summary.failed += 1;
        }
      }

      const warningCount = data.summary?.warnings ?? 0;
      const successCount = data.summary?.succeeded ?? data.created.length;
      const failedCount = data.summary?.failed ?? data.failed.length;
      const summaryParts = [`${successCount} material${successCount === 1 ? "" : "s"} ingested`];
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
      setPage(1);
      if (data.id) setPendingSelectionId(data.id);
      setRefreshKey((value) => value + 1);
    } catch {
      setNotice({ type: "error", text: "Upload failed." });
    } finally {
      setBusy(false);
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
    if (!window.confirm(`Delete source material "${material.title}"? Any lesson or question links to it will also be removed.`)) return;
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

  function resetFilters() {
    setSearch("");
    setKind("all");
    setParser("all");
    setStatus("all");
    setLinked("all");
    setHasAsset("all");
    setHasText("all");
    setSort("newest");
    setDirection("desc");
    setPage(1);
  }

  const activeFilterCount = [
    kind !== "all",
    parser !== "all",
    status !== "all",
    linked !== "all",
    hasAsset !== "all",
    hasText !== "all",
    Boolean(search.trim()),
    sort !== "newest",
    direction !== "desc",
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#fdfefe_0%,#f6f9fc_100%)] px-5 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F1FB] text-[#185FA5]">
                  <Icons.Database size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Source Material Library</h2>
                  <p className="text-sm text-slate-500">
                    Search, sort, preview, and organize uploaded source material across the full archive.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setUploadOpen((value) => !value)}
                className="admin-action secondary flex items-center gap-1.5"
              >
                {uploadOpen ? <Icons.ChevronUp size={14} /> : <Icons.Plus size={14} />}
                {uploadOpen ? "Hide upload" : "Add material"}
              </button>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-right shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Archive</p>
                <p className="text-sm font-semibold text-slate-800">{pagination.total.toLocaleString()} materials</p>
              </div>
            </div>
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
                          {uploadItems.length.toLocaleString()} file{uploadItems.length === 1 ? "" : "s"} ready. Titles can be edited before ingestion.
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
                            <label className="admin-label">Library title</label>
                            <input
                              className="admin-input"
                              value={item.title}
                              onChange={(event) => updateUploadItemTitle(item.clientId, event.target.value)}
                              placeholder="Source material title"
                            />
                          </div>
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
                      Ingesting batch…
                    </>
                  ) : (
                    <>
                      <Icons.Upload size={14} />
                      {uploadItems.length > 1 ? `Ingest ${uploadItems.length} materials` : "Ingest material"}
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-2xl border border-[#185FA5]/15 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#185FA5]">
                  Best for this library
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <InsightCard title="Batch-ready" body="Drop mixed PDFs, Word docs, spreadsheets, audio, and video into a single ingestion batch." />
                  <InsightCard title="Searchable archive" body="Search across title, filenames, metadata, linked lessons, and extracted content." />
                  <InsightCard title="Stable references" body="Open original files when you need source fidelity, while keeping content-first reading by default." />
                  <InsightCard title="Link-aware" body="Track whether a material is already attached to lessons or other curriculum content." />
                </div>
              </div>
            </div>
          </div>
        )}

        {notice && (
          <div className="border-b border-slate-100 bg-white px-5 py-3">
            <p className={cn(
              "flex items-center gap-2 text-sm",
              notice.type === "success" ? "text-emerald-700" : "text-red-700"
            )}>
              {notice.type === "success" ? <Icons.Check size={14} /> : <Icons.X size={14} />}
              {notice.text}
            </p>
          </div>
        )}

        <div className="border-b border-slate-100 bg-white px-5 py-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,0.7fr))]">
            <div className="relative">
              <Icons.Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="admin-input pl-9"
                value={search}
                onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                placeholder="Search title, filename, content, parser, domain, or linked lesson…"
              />
            </div>

            <select className="admin-input" value={kind} onChange={(event) => { setKind(event.target.value); setPage(1); }}>
              <option value="all">All kinds</option>
              <option value="document">Documents</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
            </select>

            <select className="admin-input" value={parser} onChange={(event) => { setParser(event.target.value); setPage(1); }}>
              <option value="all">All parsers</option>
              <option value="pdf-parse">PDF</option>
              <option value="mammoth">DOCX</option>
              <option value="csv-parse">CSV</option>
              <option value="text">Text</option>
              <option value="whisper">Transcript</option>
              <option value="media">Media</option>
            </select>

            <select className="admin-input" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
              <option value="all">All status</option>
              <option value="parsed">Parsed</option>
              <option value="uploaded">Uploaded</option>
              <option value="failed">Failed</option>
            </select>

            <select className="admin-input" value={linked} onChange={(event) => { setLinked(event.target.value); setPage(1); }}>
              <option value="all">All link states</option>
              <option value="linked">Linked</option>
              <option value="unlinked">Unlinked</option>
            </select>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[repeat(4,minmax(0,0.8fr))_auto]">
            <select className="admin-input" value={hasAsset} onChange={(event) => { setHasAsset(event.target.value); setPage(1); }}>
              <option value="all">Any asset state</option>
              <option value="yes">Has original asset</option>
              <option value="no">No original asset</option>
            </select>

            <select className="admin-input" value={hasText} onChange={(event) => { setHasText(event.target.value); setPage(1); }}>
              <option value="all">Any text state</option>
              <option value="yes">Has extracted text</option>
              <option value="no">No extracted text</option>
            </select>

            <select className="admin-input" value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select className="admin-input" value={direction} onChange={(event) => { setDirection(event.target.value as "asc" | "desc"); setPage(1); }}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>

            <button type="button" onClick={resetFilters} className="admin-action secondary">
              Reset
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">
                Showing {pagination.start}-{pagination.end} of {pagination.total}
              </span>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-[#E6F1FB] px-2.5 py-1 font-semibold text-[#185FA5]">
                  {activeFilterCount} active filters
                </span>
              )}
            </div>
            <p>Split-view archive workspace for fast scan, preview, and linking.</p>
          </div>
        </div>

        <div className="grid xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <div className="border-b border-slate-100 xl:border-b-0 xl:border-r xl:border-slate-100">
            <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,0.78fr)_minmax(0,0.7fr)_auto] gap-3 border-b border-slate-100 bg-[#f8fafc] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
              <span>Material</span>
              <span>Signals</span>
              <span>Usage</span>
              <span className="text-right">Actions</span>
            </div>

            {loading ? (
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
                    className={cn(
                      "grid grid-cols-1 gap-4 px-5 py-4 transition sm:grid-cols-[minmax(0,1.5fr)_minmax(0,0.78fr)_minmax(0,0.7fr)_auto] sm:items-start hover:bg-[#fbfdff]",
                      selectedId === material.id && "bg-[#f7fbff]"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(material.id)}
                      className="contents text-left"
                    >
                      <div className="min-w-0">
                        <div className="flex items-start gap-3">
                          <MaterialKindIcon kind={material.kind} />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-semibold text-slate-900">{material.title}</p>
                              <StatusBadge status={material.status} />
                              <KindBadge kind={material.kind} />
                            </div>
                            <p className="mt-0.5 truncate text-xs text-slate-500">{material.fileName}</p>
                            <HighlightedText
                              text={material.previewSnippet || "No preview snippet available."}
                              query={deferredSearch}
                              className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-500">
                        <p className="font-semibold text-slate-700">{PARSER_LABELS[material.parser] ?? material.parser}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {material.pages != null && <TinyBadge label={`${material.pages} pages`} />}
                          {material.characters > 0 && <TinyBadge label={`${material.characters.toLocaleString()} chars`} />}
                          {material.sizeBytes > 0 && <TinyBadge label={formatBytes(material.sizeBytes)} />}
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-500">
                        <p>{material.linkCount > 0 ? `${material.linkCount} linked` : "Unlinked"}</p>
                        <p>{formatDateTime(material.createdAt)}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {material.hasAsset && <TinyBadge label="Asset" />}
                          {material.hasExtractedText && <TinyBadge label="Text" />}
                        </div>
                      </div>
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
                        label="Link material"
                        onClick={() => {
                          setLinkingMaterialId(material.id);
                        }}
                      >
                        <Icons.Link2 size={14} />
                      </ActionIconButton>
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

          <div className="bg-[#fbfcfe] px-4 py-4 xl:px-5">
            <div className="xl:sticky xl:top-5">
              <MaterialPreviewPane
                material={selectedPreview}
                fallbackMaterial={selectedListItem}
                loading={previewLoading}
                tab={previewTab}
                onTabChange={setPreviewTab}
                searchQuery={deferredSearch}
                onLink={() => selectedId && setLinkingMaterialId(selectedId)}
                onDelete={() => selectedListItem && void deleteMaterial(selectedListItem)}
                onRefresh={() => setRefreshKey((k) => k + 1)}
              />
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
}

function InsightCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{body}</p>
    </div>
  );
}

function MaterialKindIcon({ kind }: { kind: MaterialKind }) {
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
    <span className={cn("mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl", className)}>
      <Icon size={16} />
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
    parsed: "bg-emerald-100 text-emerald-700",
    uploaded: "bg-blue-100 text-blue-700",
    failed: "bg-red-100 text-red-700",
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
  onLink,
  onDelete,
  onRefresh,
}: {
  material: MaterialPreviewResponse | null;
  fallbackMaterial: MaterialListItem | null;
  loading: boolean;
  tab: PreviewTab;
  onTabChange: (tab: PreviewTab) => void;
  searchQuery: string;
  onLink: () => void;
  onDelete: () => void;
  onRefresh: () => void;
}) {
  const [reparseLoading, setReparseLoading] = useState(false);
  const [reparseError, setReparseError] = useState<string | null>(null);

  async function handleReparse() {
    const id = material?.material?.id ?? fallbackMaterial?.id;
    if (!id) return;
    setReparseLoading(true);
    setReparseError(null);
    try {
      const res = await fetch(`/api/admin/materials/${id}?action=reparse`, { method: "PATCH" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
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
  const materialInfo = material?.material ?? fallbackMaterial;
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
  const assetHref = "assetHref" in materialInfo && typeof materialInfo.assetHref === "string" ? materialInfo.assetHref : null;
  const assetDownloadHref =
    "assetDownloadHref" in materialInfo && typeof materialInfo.assetDownloadHref === "string"
      ? materialInfo.assetDownloadHref
      : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-bold text-slate-900">{materialInfo.title}</h3>
              <StatusBadge status={materialInfo.status} />
              <KindBadge kind={materialInfo.kind} />
            </div>
            <p className="mt-1 truncate text-xs text-slate-500">{materialInfo.fileName}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ActionIconLink href={assetHref} label="Open original">
              <Icons.ExternalLink size={14} />
            </ActionIconLink>
            <ActionIconLink href={assetDownloadHref} label="Download">
              <Icons.Upload size={14} className="rotate-180" />
            </ActionIconLink>
            {(isPdfMaterial(materialInfo) || isDocxMaterial(materialInfo) || isTranscribableMediaMaterial(materialInfo)) && (
              <ActionIconButton
                label={reparseLoading ? "Re-parsing…" : "Re-parse content"}
                onClick={handleReparse}
              >
                <Icons.RotateCcw size={14} className={reparseLoading ? "animate-spin" : undefined} />
              </ActionIconButton>
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
          {materialInfo.hasAsset && <TinyBadge label="Original asset" />}
          {preview.formattedMode === "pdf" && <TinyBadge label="Fidelity PDF preview" />}
          {preview.formattedMode === "docx" && preview.formattedHtml && <TinyBadge label="Formatted DOCX preview" />}
        </div>
      </div>

      <div className="border-b border-slate-100 px-3 py-2">
        <div className="flex flex-wrap gap-1">
          {tabs.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => onTabChange(entry.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                tab === entry.id
                  ? "bg-[#185FA5] text-white shadow-sm"
                  : "text-slate-500 hover:bg-[#E6F1FB] hover:text-[#185FA5]"
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
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

        {!loading && tab === "preview" && (
          <PreviewTabPanel material={materialInfo} preview={preview} searchQuery={searchQuery} />
        )}
        {!loading && tab === "content" && (
          <ContentTabPanel
            extractedText={preview.extractedText}
            formattedHtml={preview.formattedHtml}
            formattedMode={preview.formattedMode}
            searchQuery={searchQuery}
          />
        )}
        {!loading && tab === "links" && (
          <LinksTabPanel links={preview.links} />
        )}
        {!loading && tab === "details" && (
          <DetailsTabPanel material={materialInfo} />
        )}
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
  extractedText,
  formattedHtml,
  formattedMode,
  searchQuery,
}: {
  extractedText: string;
  formattedHtml: string | null;
  formattedMode: "pdf" | "docx" | null;
  searchQuery: string;
}) {
  const [showRawText, setShowRawText] = useState(searchQuery.trim().length > 0 || !formattedHtml);

  useEffect(() => {
    setShowRawText(searchQuery.trim().length > 0 || !formattedHtml);
  }, [formattedHtml, searchQuery]);

  if (!extractedText && !formattedHtml) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
        <Icons.FileText size={20} className="mx-auto mb-3 text-slate-300" />
        <p className="text-sm font-semibold text-slate-700">No extracted content captured.</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          The content tab becomes available when text extraction succeeds or the material can be reparsed from its asset.
        </p>
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
}: {
  material: MaterialPreviewResponse["material"] | MaterialListItem;
}) {
  const metadataEntries = Object.entries(material.metadata ?? {}).filter(([, value]) => value != null && value !== "");
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <DetailCard label="Created" value={formatDateTime(material.createdAt)} />
        <DetailCard label="Updated" value={formatDateTime(material.updatedAt)} />
        <DetailCard label="MIME type" value={material.fileType} />
        <DetailCard label="Original asset" value={material.hasAsset ? "Available" : "Unavailable"} />
      </div>

      {material.latestJob && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Latest ingestion job</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <DetailCard label="Job status" value={material.latestJob.status ?? "Unknown"} compact />
            <DetailCard label="Parser" value={material.latestJob.parser ?? material.parser} compact />
            <DetailCard label="Extracted chars" value={(material.latestJob.extractedCharacters ?? material.characters).toLocaleString()} compact />
            <DetailCard label="Completed" value={material.latestJob.completedAt ? formatDateTime(material.latestJob.completedAt) : "Pending"} compact />
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
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const course = courses.find((entry) => entry.id === selectedCourse);

  async function handleLink() {
    if (!selectedLesson) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/materials/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId, lessonId: selectedLesson, referenceLabel: label || null }),
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
            <h3 className="text-base font-bold text-slate-900">Link material to lesson</h3>
            <p className="text-sm text-slate-500">Attach this source material to a lesson for curriculum traceability.</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <Icons.X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="admin-label">Course</label>
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

          {course && (
            <div>
              <label className="admin-label">Lesson</label>
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
            <label className="admin-label">Reference label (optional)</label>
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
          <button type="button" onClick={handleLink} disabled={busy || !selectedLesson} className="admin-action">
            {busy ? "Linking…" : "Link material"}
          </button>
        </div>
      </div>
    </div>
  );
}
