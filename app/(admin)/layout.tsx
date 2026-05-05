import { Sidebar } from "@/components/layout/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isAdmin />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
