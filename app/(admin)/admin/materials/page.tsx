import { Suspense } from "react";
import { MaterialsPanel } from "@/components/admin/MaterialsPanel";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import * as Icons from "@/components/ui/Icons";

export default function AdminMaterialsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:space-y-6 sm:px-6 sm:py-8">
      <AdminPageHeader
        icon={<Icons.FileText size={20} />}
        eyebrow="Teacher Portal"
        title="Source Materials"
        description="Upload, organize, and parse reference documents, then link them to lessons and courses."
      />
      <Suspense
        fallback={
          <div className="space-y-3">
            <div className="admin-skeleton h-10 w-full" />
            <div className="admin-skeleton h-64 w-full" />
          </div>
        }
      >
        <MaterialsPanel />
      </Suspense>
    </div>
  );
}
