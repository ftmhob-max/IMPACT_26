import { Sidebar } from "@/components/layout/Sidebar";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { requireAdminPage } from "@/lib/admin/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage("viewer");

  return (
    <div className="min-h-screen bg-[#f0efe9] lg:flex lg:h-screen lg:overflow-hidden">
      <Sidebar isAdmin />
      <main className="min-w-0 flex-1 overflow-x-hidden lg:h-screen lg:overflow-y-auto">
        {children}
        <AdminFeedback />
      </main>
    </div>
  );
}
