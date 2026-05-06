"use client";

import { useEffect, useState } from "react";
import { FileDropZone } from "./FileDropZone";
import { MaterialPreview } from "./MaterialPreview";
import * as Icons from "@/components/ui/Icons";

interface Material {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  status: string;
  metadataJson?: string | null;
  createdAt: string;
  ingestionJobs_on_sourceMaterial?: Array<{
    parser: string;
    extractedCharacters: number;
    errorMessage?: string | null;
  }>;
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
  ingestion: {
    parser: string;
    status: "parsed" | "failed";
    extractedText: string;
    metadata: Record<string, unknown>;
    errorMessage?: string;
  };
}

export function MaterialsPanel() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const [matRes, courseRes] = await Promise.all([
      fetch("/api/admin/materials", { cache: "no-store" }),
      fetch("/api/admin/courses", { cache: "no-store" }),
    ]);
    if (matRes.ok) setMaterials((await matRes.json()).materials ?? []);
    if (courseRes.ok) setCourses((await courseRes.json()).courses ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function upload() {
    if (!file || !title.trim()) return;
    setBusy(true);
    setUploadResult(null);
    const form = new FormData();
    form.set("title", title.trim());
    form.set("file", file);
    try {
      const res = await fetch("/api/admin/materials", { method: "POST", body: form });
      const data = await res.json();
      if (res.ok) {
        setUploadResult(data);
        setFile(null);
        setTitle("");
        setNotice(null);
        await load();
      } else {
        setNotice(data.error ?? "Upload failed.");
      }
    } finally {
      setBusy(false);
    }
  }

  function handleFileSelected(f: File) {
    setFile(f);
    if (!title) {
      setTitle(f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    }
    setUploadResult(null);
  }

  return (
    <div className="space-y-6">
      {/* Upload form */}
      <div className="rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <Icons.Upload size={18} className="text-[#185FA5]" />
          <h2 className="text-sm font-bold text-slate-900">Ingest source material</h2>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="admin-label">Title</label>
            <input
              className="admin-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. USPAP 2024–2025 Standards"
            />
          </div>

          <FileDropZone
            file={file}
            onFile={handleFileSelected}
            disabled={busy}
          />

          {notice && (
            <p className="text-xs text-red-600 flex items-center gap-1.5">
              <Icons.X size={12} />
              {notice}
            </p>
          )}

          <button
            type="button"
            onClick={upload}
            disabled={busy || !file || !title.trim()}
            className="admin-action w-full flex items-center justify-center gap-2"
          >
            {busy ? (
              <>
                <Icons.Loader size={14} className="animate-spin" />
                Ingesting…
              </>
            ) : (
              <>
                <Icons.Upload size={14} />
                Ingest material
              </>
            )}
          </button>

          {uploadResult && (
            <MaterialPreview
              material={uploadResult}
              courses={courses}
              onLinked={() => setNotice(null)}
            />
          )}
        </div>
      </div>

      {/* Materials library */}
      <div className="rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <Icons.Database size={18} className="text-[#185FA5]" />
            <h2 className="text-sm font-bold text-slate-900">Source library</h2>
          </div>
          <span className="text-xs text-slate-500">{materials.length} materials</span>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-slate-400">Loading…</div>
          ) : materials.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Icons.Database size={32} className="mx-auto text-slate-200 mb-2" />
              <p className="text-sm text-slate-400">No materials ingested yet.</p>
              <p className="text-xs text-slate-400 mt-1">Upload a PDF, DOCX, CSV, or text file above.</p>
            </div>
          ) : (
            materials.map((m) => <MaterialRow key={m.id} material={m} />)
          )}
        </div>
      </div>
    </div>
  );
}

function MaterialRow({ material }: { material: Material }) {
  const [expanded, setExpanded] = useState(false);
  const job = material.ingestionJobs_on_sourceMaterial?.[0];
  const chars = job?.extractedCharacters ?? 0;

  let meta: Record<string, unknown> = {};
  try { meta = JSON.parse(material.metadataJson ?? "{}"); } catch { /* ignore */ }

  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-800 truncate">{material.title}</p>
            <StatusBadge status={material.status} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{material.fileName}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {job?.parser && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                {job.parser}
              </span>
            )}
            {chars > 0 && (
              <span className="text-[10px] text-slate-400">{chars.toLocaleString()} chars</span>
            )}
            {meta.pages != null && (
              <span className="text-[10px] text-slate-400">{String(meta.pages)} pages</span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Toggle details"
        >
          {expanded ? <Icons.ChevronUp size={16} /> : <Icons.ChevronDown size={16} />}
        </button>
      </div>

      {expanded && job?.errorMessage && (
        <p className="mt-2 text-xs text-red-600 bg-red-50 rounded px-2 py-1.5">{job.errorMessage}</p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    parsed: "bg-emerald-100 text-emerald-700",
    uploaded: "bg-blue-100 text-blue-700",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${map[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}
