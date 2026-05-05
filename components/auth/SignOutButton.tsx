"use client";

import { signOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import * as Icons from "@/components/ui/Icons";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      await fetch("/api/auth/sync-user", { method: "DELETE" });
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-red-600 active:bg-slate-100"
    >
      <Icons.LogOut size={14} />
      Sign out
    </button>
  );
}
