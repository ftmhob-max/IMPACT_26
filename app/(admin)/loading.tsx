// Back-end (server component boundary): Teacher Portal route-group loading state.
// app/(admin)/loading.tsx
//
// Rendered by Next.js while an admin server page streams. Brings the admin route
// group to parity with the platform/quiz groups, which already ship loading UI.

import { AdminRouteSkeleton } from "@/components/ui/AdminRouteSkeleton";

export default function AdminLoading() {
  return <AdminRouteSkeleton label="Loading the Teacher Portal" />;
}
