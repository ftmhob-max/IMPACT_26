import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FormulasPanel } from "@/components/admin/FormulasPanel";
import * as Icons from "@/components/ui/Icons";

export default function AdminFormulasPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:space-y-6 sm:px-6 sm:py-8">
      <AdminPageHeader
        icon={<Icons.Calculator size={22} />}
        eyebrow="Teacher Portal"
        title="Formula Compass Editor"
        description="Add, edit, and organize formula sections. Define calculator variables and expressions so students can compute answers directly from any formula card."
      />

      <div className="rounded-[24px] border border-black/10 bg-white p-3 shadow-sm sm:p-5">
        <FormulasPanel />
      </div>
    </div>
  );
}
