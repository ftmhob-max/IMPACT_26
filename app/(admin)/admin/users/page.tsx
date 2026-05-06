import { UsersManagementPanel } from "@/components/admin/UsersManagementPanel";

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Users & Roles</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage learner accounts and assign instructor or admin roles.
        </p>
      </div>
      <UsersManagementPanel />
    </div>
  );
}
