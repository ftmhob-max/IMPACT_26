import { Sidebar } from "@/components/layout/Sidebar";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0efe9] lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
