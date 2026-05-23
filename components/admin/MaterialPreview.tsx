import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { isPreviewableMediaKind, type SourceMaterialKind } from "@/lib/admin/source-materials";
import * as Icons from "@/components/ui/Icons";

interface IngestionResult {
  parser: string;
  status: "parsed" | "uploaded" | "failed";
  extractedText: string;
  metadata: Record<string, unknown>;
  errorMessage?: string;
}

interface UploadedMaterial {
  id: string;
  ingestion: IngestionResult;
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

interface MaterialPreviewProps {
  material: UploadedMaterial;
  courses: Course[];
  onLinked?: (lessonId: string) => void;
}

const PARSER_LABELS: Record<string, string> = {
  "pdf-parse": "PDF",
  mammoth: "DOCX",
  "csv-parse": "CSV",
  text: "Text",
  media: "Media",
  whisper: "Transcript",
};

export function MaterialPreview({ material, courses, onLinked }: MaterialPreviewProps) {
  const [showFull, setShowFull] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
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

  const { ingestion } = material;
  const preview = ingestion.extractedText.slice(0, 800);
  const isTruncated = ingestion.extractedText.length > 800;
  const mediaKind = getPreviewKind(ingestion.metadata.kind);
  const previewable = mediaKind ? isPreviewableMediaKind(mediaKind) : false;
  const sizeBytes = typeof ingestion.metadata.sizeBytes === "number" ? ingestion.metadata.sizeBytes : null;

  const pages = ingestion.metadata.pages as number | undefined;
  const chars = ingestion.extractedText.length;
  const assetHref = `/api/admin/materials/${material.id}/asset${token ? `?token=${encodeURIComponent(token)}` : ""}`;
  const downloadHref = `/api/admin/materials/${material.id}/asset?download=1${token ? `&token=${encodeURIComponent(token)}` : ""}`;

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
            <Icons.FileCheck size={16} className="text-emerald-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">
              {previewable ? "Material added to the source library" : "Material ingested successfully"}
            </p>
            <div className="flex flex-wrap gap-2 mt-0.5">
              <Chip label={PARSER_LABELS[ingestion.parser] ?? ingestion.parser} />
              {mediaKind && <Chip label={mediaKind === "video" ? "Video" : "Audio"} />}
              {pages != null && <Chip label={`${pages} pages`} />}
              {sizeBytes != null && <Chip label={formatBytes(sizeBytes)} />}
              {chars > 0 && <Chip label={`${chars.toLocaleString()} chars`} />}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowLinkModal(true)}
          className="shrink-0 flex items-center gap-1.5 rounded-lg bg-[#185FA5] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1451a0] transition-colors"
        >
          <Icons.Link2 size={12} />
          Link to lesson
        </button>
      </div>

      {previewable && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-700">Media preview</p>
          {mediaKind === "video" ? (
            <video controls preload="metadata" src={assetHref} className="aspect-video w-full rounded-lg bg-slate-950" />
          ) : (
            <audio controls preload="metadata" src={assetHref} className="w-full" />
          )}
          <div className="flex flex-wrap gap-2">
            <a
              href={assetHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:border-emerald-400"
            >
              <Icons.ExternalLink size={12} />
              Open asset
            </a>
            <a
              href={downloadHref}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:border-emerald-400"
            >
              <Icons.Upload size={12} className="rotate-180" />
              Download
            </a>
          </div>
        </div>
      )}

      {ingestion.extractedText && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-700 mb-1.5">Extracted content</p>
          <div className="rounded-lg border border-emerald-200 bg-white p-3 max-h-40 overflow-y-auto">
            <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-wrap font-mono">
              {showFull ? ingestion.extractedText : preview}
              {isTruncated && !showFull && "…"}
            </p>
          </div>
          {isTruncated && (
            <button
              type="button"
              onClick={() => setShowFull((v) => !v)}
              className="mt-1 text-xs font-medium text-[#185FA5] hover:underline"
            >
              {showFull ? "Show less" : `Show all ${ingestion.extractedText.length.toLocaleString()} chars`}
            </button>
          )}
        </div>
      )}

      {ingestion.status === "failed" && ingestion.errorMessage && (
        <p className="flex items-center gap-1.5 text-xs text-red-700">
          <Icons.X size={12} />
          {ingestion.errorMessage}
        </p>
      )}

      {showLinkModal && (
        <LinkToLessonModal
          materialId={material.id}
          courses={courses}
          onClose={() => setShowLinkModal(false)}
          onLinked={(lessonId) => {
            setShowLinkModal(false);
            onLinked?.(lessonId);
          }}
        />
      )}
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
      {label}
    </span>
  );
}

function getPreviewKind(kind: unknown): SourceMaterialKind | null {
  if (kind === "audio" || kind === "video") return kind;
  return null;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

interface LinkToLessonModalProps {
  materialId: string;
  courses: Course[];
  onClose: () => void;
  onLinked: (lessonId: string) => void;
}

function LinkToLessonModal({ materialId, courses, onClose, onLinked }: LinkToLessonModalProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const course = courses.find((c) => c.id === selectedCourse);
  const allLessons = course?.modules_on_course.flatMap((m) => m.lessons_on_module) ?? [];

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
      onLinked(selectedLesson);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-xl p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Link material to lesson</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <Icons.X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="admin-label">Course</label>
            <select
              className="admin-input"
              value={selectedCourse}
              onChange={(e) => { setSelectedCourse(e.target.value); setSelectedLesson(""); }}
            >
              <option value="">Select a course…</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {course && (
            <div>
              <label className="admin-label">Lesson</label>
              <select
                className="admin-input"
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
              >
                <option value="">Select a lesson…</option>
                {course.modules_on_course.map((m) => (
                  <optgroup key={m.id} label={m.title}>
                    {m.lessons_on_module.map((l) => (
                      <option key={l.id} value={l.id}>{l.title}</option>
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
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Primary source material"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="admin-action secondary">Cancel</button>
          <button
            type="button"
            onClick={handleLink}
            disabled={busy || !selectedLesson}
            className="admin-action"
          >
            {busy ? "Linking…" : "Link material"}
          </button>
        </div>
      </div>
    </div>
  );
}
