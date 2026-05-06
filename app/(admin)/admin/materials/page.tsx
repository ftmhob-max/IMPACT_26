import { MaterialsPanel } from "@/components/admin/MaterialsPanel";
import { DocxImportClient } from "@/components/admin/DocxImportClient";

export default function AdminMaterialsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Source Materials</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ingest reference documents into the knowledge base. Supported: PDF, DOCX, CSV, TXT, Markdown.
        </p>
      </div>

      {/* ── DOCX Question Import ──────────────────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
            <span className="text-[#185FA5]">📄</span>
            <h2 className="text-sm font-bold text-slate-900">DOCX Question Import</h2>
            <span className="ml-auto text-xs text-slate-400">Auto-generate curriculum + question bank</span>
          </div>
          <div className="p-4">
            <p className="mb-4 text-xs text-slate-500 leading-relaxed">
              Upload a structured DOCX file (e.g. Assessment Calculations Review format) to automatically extract
              questions, answers, and rationales — and optionally generate a complete course curriculum.
            </p>
            <DocxImportClient />
          </div>
        </div>

        {/* ── General Material Upload ─────────────────────────────────────────── */}
        <div className="rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
            <span className="text-[#185FA5]">📚</span>
            <h2 className="text-sm font-bold text-slate-900">Source Material Library</h2>
            <span className="ml-auto text-xs text-slate-400">PDF, DOCX, CSV, TXT, Markdown</span>
          </div>
          <div className="p-4">
            <MaterialsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
