import { FormulasPanel } from "@/components/admin/FormulasPanel";
import * as Icons from "@/components/ui/Icons";

export default function AdminFormulasPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#185FA5] text-white shadow-sm">
          <Icons.Calculator size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Formula Compass Editor</h1>
          <p className="mt-1 text-sm text-slate-500">
            Add, edit, and organize formula sections. Define calculator variables and expressions so students can compute answers directly from any formula card.
          </p>
        </div>
      </div>

      <div className="rounded-[24px] border border-black/10 bg-white p-5 shadow-sm">
        <FormulasPanel />
      </div>
    </div>
  );
}
