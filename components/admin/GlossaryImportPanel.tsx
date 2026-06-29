"use client";

import { useRef, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import type { GlossaryImportRow } from "@/lib/admin/csv-glossary";
import type { PreviewResult, DuplicateEntry, IntraFileDuplicate } from "@/app/api/admin/glossary/import/preview/route";
import {
  ImportCollapsibleSection,
  ImportStepPill,
  ImportSummaryCard,
} from "@/components/admin/import/ImportUiPrimitives";

type Resolution = "skip" | "overwrite" | "keep_both";

interface Props {
  onImported: () => void;
  onClose: () => void;
}

type Step = "upload" | "preview" | "done";

export function GlossaryImportPanel({ onImported, onClose }: Props) {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [resolutions, setResolutions] = useState<Record<number, Resolution>>({});
  const [intraKeep, setIntraKeep] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ imported: number; updated: number; skipped: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Step 1: upload + preview ──────────────────────────────────────────────

  async function handlePreview() {
    if (!file) return;
    setBusy(true);
    setError(null);

    const form = new FormData();
    form.set("file", file);

    const res = await fetch("/api/admin/glossary/import/preview", { method: "POST", body: form });
    setBusy(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Preview failed.");
      return;
    }

    const data: PreviewResult = await res.json();
    setPreview(data);

    // Default resolution for each duplicate: skip
    const defaults: Record<number, Resolution> = {};
    data.duplicates.forEach((d) => { defaults[d.row] = "skip"; });
    setResolutions(defaults);

    // Default intra-file: keep first occurrence
    const iDefaults: Record<string, number> = {};
    data.intraFileDuplicates.forEach((d) => { iDefaults[d.term.toLowerCase()] = d.rows[0]; });
    setIntraKeep(iDefaults);

    setStep("preview");
  }

  // ── Step 2: run import ────────────────────────────────────────────────────

  async function handleImport() {
    if (!preview) return;
    setBusy(true);
    setError(null);

    // Build the effective rows list:
    // - For intra-file duplicates, only send the kept row; treat others as skipped
    const intraSkipped = new Set<number>();
    preview.intraFileDuplicates.forEach((d) => {
      const keepIdx = intraKeep[d.term.toLowerCase()] ?? d.rows[0];
      d.rows.forEach((r) => { if (r !== keepIdx) intraSkipped.add(r); });
    });

    // Build row-level resolution map (including intra-file skips)
    const effectiveResolutions: Record<string, Resolution> = {};
    const existingIds: Record<string, string> = {};

    preview.rows.forEach((_, i) => {
      if (intraSkipped.has(i)) {
        effectiveResolutions[String(i)] = "skip";
        return;
      }
      const dupEntry = preview.duplicates.find((d) => d.row === i);
      if (dupEntry) {
        effectiveResolutions[String(i)] = resolutions[i] ?? "skip";
        if ((resolutions[i] ?? "skip") === "overwrite") {
          existingIds[String(i)] = dupEntry.existingId;
        }
      } else {
        effectiveResolutions[String(i)] = "keep_both"; // brand-new terms always import
      }
    });

    const res = await fetch("/api/admin/glossary/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: preview.rows, resolutions: effectiveResolutions, existingIds }),
    });

    setBusy(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Import failed.");
      return;
    }

    const data = await res.json();
    setResult(data);
    setStep("done");
    onImported();
  }

  // ── Readiness check ───────────────────────────────────────────────────────

  const allDuplicatesResolved = preview
    ? preview.duplicates.every((d) => resolutions[d.row] !== undefined)
    : false;

  const validRowCount = preview
    ? preview.rows.length - preview.errors.length
    : 0;

  const importableCount = preview
    ? validRowCount - (preview.duplicates.filter((d) => (resolutions[d.row] ?? "skip") === "skip").length)
        - Array.from(Object.values(intraKeep)
            .reduce((acc, keep) => {
              // Count skipped intra-file rows
              preview.intraFileDuplicates.forEach((d) => {
                d.rows.forEach((r) => { if (r !== keep) acc.add(r); });
              });
              return acc;
            }, new Set<number>())).length
    : 0;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-xl border border-[#185FA5]/20 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-5 py-3 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <Icons.Upload size={15} className="text-[#185FA5]" />
          <span className="text-sm font-bold text-slate-900">Import glossary terms</span>
          <ImportStepPill
            current={step}
            steps={["upload", "preview", "done"]}
            labels={{ upload: "Upload", preview: "Review", done: "Done" }}
          />
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 rounded p-1">
          <Icons.X size={15} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
            <Icons.X size={13} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* ── Step: upload ── */}
        {step === "upload" && (
          <div className="space-y-4">
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-[#185FA5]/40 hover:bg-[#E6F1FB]/20 transition-colors">
              <label className="flex flex-col items-center gap-3 px-6 py-10 cursor-pointer text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E6F1FB]">
                  <Icons.Upload size={22} className="text-[#185FA5]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {file ? file.name : "Drop a file or click to browse"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Accepts .csv and .docx files</p>
                </div>
                {file && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {(file.size / 1024).toFixed(1)} KB ready
                  </span>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,.docx"
                  className="sr-only"
                  onChange={(e) => { setFile(e.target.files?.[0] ?? null); setError(null); }}
                />
              </label>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handlePreview}
                disabled={!file || busy}
                className="admin-action flex items-center gap-1.5"
              >
                {busy ? <Icons.Loader size={13} className="animate-spin" /> : <Icons.Search size={13} />}
                Preview import
              </button>
              <a
                href="/api/admin/templates?kind=glossary"
                download
                className="flex items-center gap-1.5 text-xs font-semibold text-[#185FA5] hover:underline"
              >
                <Icons.FileText size={12} />
                Download CSV template
              </a>
            </div>

            <FormatGuide />
          </div>
        )}

        {/* ── Step: preview ── */}
        {step === "preview" && preview && (
          <div className="space-y-5">
            {/* Summary bar */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ImportSummaryCard label="Parsed" value={preview.rows.length} />
              <ImportSummaryCard label="Errors" value={preview.errors.length} warn={preview.errors.length > 0} />
              <ImportSummaryCard label="Duplicates" value={preview.duplicates.length} warn={preview.duplicates.length > 0} />
              <ImportSummaryCard label="Will import" value={Math.max(0, importableCount)} />
            </div>

            {/* Parse errors */}
            {preview.errors.length > 0 && (
              <ImportCollapsibleSection title={`${preview.errors.length} parse error${preview.errors.length !== 1 ? "s" : ""}`} defaultOpen variant="error">
                <div className="space-y-1">
                  {preview.errors.map((e, i) => (
                    <p key={i} className="text-xs text-red-700 flex items-start gap-1.5">
                      <Icons.X size={11} className="mt-0.5 shrink-0" />
                      Row {e.row}: {e.message}
                    </p>
                  ))}
                </div>
              </ImportCollapsibleSection>
            )}

            {/* Intra-file duplicates */}
            {preview.intraFileDuplicates.length > 0 && (
              <ImportCollapsibleSection
                title={`${preview.intraFileDuplicates.length} term${preview.intraFileDuplicates.length !== 1 ? "s" : ""} appear multiple times in this file`}
                defaultOpen
                variant="warning"
              >
                <div className="space-y-3">
                  {preview.intraFileDuplicates.map((d) => (
                    <div key={d.term} className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
                      <p className="text-xs font-bold text-amber-800">"{d.term}" found at rows {d.rows.map((r) => r + 2).join(", ")}</p>
                      <div className="space-y-1">
                        {d.rows.map((rowIdx) => (
                          <label key={rowIdx} className="flex items-start gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`intra-${d.term}`}
                              value={rowIdx}
                              checked={(intraKeep[d.term.toLowerCase()] ?? d.rows[0]) === rowIdx}
                              onChange={() => setIntraKeep((prev) => ({ ...prev, [d.term.toLowerCase()]: rowIdx }))}
                              className="mt-0.5"
                            />
                            <span className="text-xs text-amber-900">
                              <span className="font-semibold">Row {rowIdx + 2}:</span>{" "}
                              {preview.rows[rowIdx]?.definition.slice(0, 80)}…
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ImportCollapsibleSection>
            )}

            {/* Cross-file duplicates */}
            {preview.duplicates.length > 0 && (
              <ImportCollapsibleSection
                title={`${preview.duplicates.length} term${preview.duplicates.length !== 1 ? "s" : ""} already exist in the glossary`}
                defaultOpen
                variant="warning"
              >
                <p className="text-[11px] text-slate-500 mb-3">Choose how to handle each conflict:</p>
                <div className="space-y-3">
                  {preview.duplicates.map((dup) => (
                    <DuplicateResolutionCard
                      key={dup.row}
                      dup={dup}
                      incomingDefinition={preview.rows[dup.row]?.definition ?? ""}
                      resolution={resolutions[dup.row] ?? "skip"}
                      onResolution={(r) => setResolutions((prev) => ({ ...prev, [dup.row]: r }))}
                    />
                  ))}
                </div>
              </ImportCollapsibleSection>
            )}

            {/* Valid rows preview */}
            {validRowCount > 0 && (
              <ImportCollapsibleSection title={`${validRowCount} valid row${validRowCount !== 1 ? "s" : ""} ready`} defaultOpen={false} variant="success">
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {preview.rows.map((row, i) => {
                    const isDup = preview.duplicates.some((d) => d.row === i);
                    return (
                      <div key={i} className="flex items-start gap-2 py-1.5 border-b border-slate-100 last:border-0">
                        <span className="text-[10px] text-slate-400 w-8 shrink-0">#{i + 2}</span>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-800">{row.term}</span>
                          {isDup && <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">duplicate</span>}
                          {row.domain && <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">{row.domain}</span>}
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{row.definition}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ImportCollapsibleSection>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={handleImport}
                disabled={busy || !allDuplicatesResolved || importableCount === 0}
                className="admin-action flex items-center gap-1.5"
              >
                {busy ? <Icons.Loader size={13} className="animate-spin" /> : <Icons.Check size={13} />}
                Import {importableCount > 0 ? importableCount : ""} term{importableCount !== 1 ? "s" : ""}
              </button>
              <button
                type="button"
                onClick={() => { setStep("upload"); setPreview(null); setError(null); }}
                className="admin-action secondary text-sm"
              >
                ← Back
              </button>
              {!allDuplicatesResolved && (
                <p className="text-xs text-amber-600">Resolve all conflicts to continue</p>
              )}
            </div>
          </div>
        )}

        {/* ── Step: done ── */}
        {step === "done" && result && (
          <div className="space-y-4 text-center py-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 mx-auto">
              <Icons.Check size={28} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">Import complete</p>
              <p className="text-sm text-slate-500 mt-1">
                {result.imported} new term{result.imported !== 1 ? "s" : ""} added
                {result.updated > 0 && ` · ${result.updated} updated`}
                {result.skipped > 0 && ` · ${result.skipped} skipped`}
              </p>
            </div>
            <button type="button" onClick={onClose} className="admin-action mx-auto">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Duplicate Resolution Card ────────────────────────────────────────────────

function DuplicateResolutionCard({
  dup,
  incomingDefinition,
  resolution,
  onResolution,
}: {
  dup: DuplicateEntry;
  incomingDefinition: string;
  resolution: Resolution;
  onResolution: (r: Resolution) => void;
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-white overflow-hidden">
      <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-100">
        <p className="text-xs font-bold text-amber-900">"{dup.term}"</p>
      </div>
      <div className="px-4 py-3 grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="font-semibold text-slate-500 mb-1">Existing in glossary</p>
          <p className="text-slate-700 leading-relaxed line-clamp-3">{dup.existingDefinition}</p>
        </div>
        <div>
          <p className="font-semibold text-[#185FA5] mb-1">Incoming from file</p>
          <p className="text-slate-700 leading-relaxed line-clamp-3">{incomingDefinition}</p>
        </div>
      </div>
      <div className="flex gap-0 border-t border-slate-100">
        {(["skip", "overwrite", "keep_both"] as Resolution[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onResolution(r)}
            className={cn(
              "flex-1 py-2 text-[11px] font-semibold transition-colors border-r border-slate-100 last:border-0",
              resolution === r
                ? r === "skip" ? "bg-slate-700 text-white"
                  : r === "overwrite" ? "bg-[#185FA5] text-white"
                  : "bg-emerald-600 text-white"
                : "text-slate-500 hover:bg-slate-50"
            )}
          >
            {r === "skip" ? "Skip" : r === "overwrite" ? "Overwrite" : "Keep both"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Format Guide ─────────────────────────────────────────────────────────────

function FormatGuide() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <Icons.Info size={13} className="text-[#185FA5]" />
        Accepted file formats
        {open ? <Icons.ChevronUp size={12} className="ml-auto" /> : <Icons.ChevronDown size={12} className="ml-auto" />}
      </button>
      {open && (
        <div className="border-t border-slate-200 px-4 py-4 space-y-4 text-xs text-slate-600">
          <div>
            <p className="font-bold text-slate-800 mb-1.5">CSV — required columns</p>
            <code className="block rounded bg-slate-100 px-3 py-2 font-mono text-[11px]">
              term, definition
            </code>
            <p className="mt-1.5">Optional: <code className="bg-slate-100 px-1 rounded">full_definition</code>, <code className="bg-slate-100 px-1 rounded">domain</code>, <code className="bg-slate-100 px-1 rounded">category</code>, <code className="bg-slate-100 px-1 rounded">example</code>, <code className="bg-slate-100 px-1 rounded">related_terms</code> (pipe-separated), <code className="bg-slate-100 px-1 rounded">is_published</code>, <code className="bg-slate-100 px-1 rounded">source_document</code></p>
          </div>
          <div>
            <p className="font-bold text-slate-800 mb-1.5">Word (.docx) — two layouts accepted</p>
            <p className="text-slate-500">
              <span className="font-semibold text-slate-700">Layout A:</span> Heading or bold text = term, following paragraph = definition. Add lines starting with "Example:" or "Related:" for extra fields.
            </p>
            <p className="mt-1.5 text-slate-500">
              <span className="font-semibold text-slate-700">Layout B:</span> A table where the first column is the term and the second is the definition.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
