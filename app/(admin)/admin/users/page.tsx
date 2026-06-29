import { UsersManagementPanel } from "@/components/admin/UsersManagementPanel";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import * as Icons from "@/components/ui/Icons";

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 sm:py-8">
      <AdminPageHeader
        icon={<Icons.Users size={22} />}
        eyebrow="Teacher Portal"
        title="Users & Roles"
        description="Manage learner accounts and assign instructor or admin roles."
      />
      <UsersManagementPanel />
    </div>
  );
}
