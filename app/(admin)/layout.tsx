import { Sidebar } from "@/components/layout/Sidebar";
import { requireAdminPage } from "@/lib/admin/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage("viewer");

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isAdmin />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
