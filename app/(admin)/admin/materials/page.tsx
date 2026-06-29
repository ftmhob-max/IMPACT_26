import { Suspense } from "react";
import { MaterialsPanel } from "@/components/admin/MaterialsPanel";

export default function AdminMaterialsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
      <Suspense fallback={<div className="text-sm text-slate-500">Loading materials…</div>}>
        <MaterialsPanel />
      </Suspense>
    </div>
  );
}
