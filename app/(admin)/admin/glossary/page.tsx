import { GlossaryManager } from "@/components/admin/GlossaryManager";

export default function AdminGlossaryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Glossary</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create and manage terms that students can browse, filter, and annotate with personal notes.
        </p>
      </div>
      <GlossaryManager />
    </div>
  );
}
