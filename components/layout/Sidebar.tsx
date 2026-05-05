"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",  label: "Dashboard",      icon: "⊞" },
  { href: "/courses",    label: "Courses",         icon: "📚" },
  { href: "/formulas",   label: "Formula Index",   icon: "∑" },
  { href: "/profile",    label: "My Progress",     icon: "📈" },
];

const adminItems = [
  { href: "/admin",           label: "Admin Home",    icon: "⚙" },
  { href: "/admin/questions", label: "Question Bank", icon: "❓" },
  { href: "/admin/quizzes",   label: "Quizzes",       icon: "📝" },
  { href: "/admin/courses",   label: "Courses",       icon: "🗂" },
  { href: "/admin/cohorts",   label: "Cohort Stats",  icon: "📊" },
  { href: "/admin/users",     label: "Users",         icon: "👥" },
];

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-slate-100 flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          IMPACT_26
        </p>
        <p className="text-sm font-bold text-slate-800 mt-0.5">Property Assessment</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} active={pathname.startsWith(item.href)} />
        ))}

        {isAdmin && (
          <>
            <div className="pt-4 pb-1 px-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Admin
              </p>
            </div>
            {adminItems.map((item) => (
              <NavLink key={item.href} {...item} active={pathname.startsWith(item.href)} />
            ))}
          </>
        )}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-3 border-t border-slate-100">
        <SignOutButton />
      </div>
    </aside>
  );
}

function NavLink({ href, label, icon, active }: {
  href: string; label: string; icon: string; active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-150",
        active
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
      )}
    >
      <span className="text-base leading-none">{icon}</span>
      {label}
    </Link>
  );
}

function SignOutButton() {
  async function handleSignOut() {
    const { signOut } = await import("@/lib/firebase/auth");
    await signOut();
    await fetch("/api/auth/sync-user", { method: "DELETE" });
    window.location.href = "/sign-in";
  }
  return (
    <button
      onClick={handleSignOut}
      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
    >
      <span>↩</span> Sign out
    </button>
  );
}
