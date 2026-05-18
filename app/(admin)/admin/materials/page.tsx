import { MaterialsPanel } from "@/components/admin/MaterialsPanel";


export default function AdminMaterialsPage() {
  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-none">
        <h1 className="text-2xl font-bold text-slate-900">Source Materials</h1>
        <p className="mt-1 text-sm text-slate-500">
          Build and manage a searchable archive of reference documents, media, and instructional source material.
        </p>
      </div>

      <MaterialsPanel />
    </div>
  );
}
