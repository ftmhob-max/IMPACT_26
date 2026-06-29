import { GlossaryManager } from "@/components/admin/GlossaryManager";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import * as Icons from "@/components/ui/Icons";

export default function AdminGlossaryPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 sm:py-8">
      <AdminPageHeader
        icon={<Icons.BookOpen size={22} />}
        eyebrow="Teacher Portal"
        title="Glossary Editor"
        description="Create and manage terms that students can browse, filter, and annotate with personal notes."
      />
      <GlossaryManager />
    </div>
  );
}
