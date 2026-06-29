import { AdminPortal } from "@/components/admin/AdminPortal";
import { loadAdminOverview } from "@/lib/admin/overview";

export default async function AdminDashboard() {
  const initialOverview = await loadAdminOverview().catch(() => undefined);

  return <AdminPortal initialOverview={initialOverview} />;
}
