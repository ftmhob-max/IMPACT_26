import { Sidebar } from "@/components/layout/Sidebar";
import { getSessionFromCookie, isElevatedRole } from "@/lib/admin/auth";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionFromCookie();
  const isAdmin = session ? isElevatedRole(session.role) : false;

  return (
    <div className="min-h-screen bg-[#f7f8f6] lg:flex">
      <Sidebar isAdmin={isAdmin} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
