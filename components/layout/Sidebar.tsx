"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";
import * as Icons from "@/components/ui/Icons";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Icons.LayoutDashboard },
  { href: "/courses", label: "Courses", icon: Icons.GraduationCap },
  { href: "/formulas", label: "Formula Compass", icon: Icons.Calculator },
  { href: "/glossary", label: "Glossary", icon: Icons.BookOpen },
  { href: "/profile", label: "My Progress", icon: Icons.User },
];

const adminItems = [
  { href: "/admin", label: "Admin Home", icon: Icons.ShieldCheck },
  { href: "/admin/questions", label: "Question Bank", icon: Icons.FileText },
  { href: "/admin/quizzes", label: "Quizzes", icon: Icons.ClipboardList },
  { href: "/admin/courses", label: "Courses", icon: Icons.GraduationCap },
  { href: "/admin/glossary", label: "Glossary", icon: Icons.BookOpen },
  { href: "/admin/materials", label: "Source Materials", icon: Icons.Database },
  { href: "/admin/cohorts", label: "Cohort Stats", icon: Icons.BarChart3 },
  { href: "/admin/users", label: "Users", icon: Icons.Users },
];

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  return (
    <aside className="border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-4 px-4 py-4 lg:block lg:px-5 lg:py-5">
        <Link href="/dashboard" className="block">
          <p className="text-lg font-extrabold tracking-[-0.03em] text-[#0b3970]">IMPACT_26</p>
          <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Property Assessment</p>
        </Link>
        <div className="flex items-center gap-2 lg:mt-4">
          <div className="hidden rounded-full border border-[#b8d7f0] bg-[#E6F1FB] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#185FA5] sm:block lg:inline-flex">
            {isAdmin ? "Admin" : "Learner"}
          </div>
          {user && (
            <Link 
              href="/profile"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white shadow-sm ring-2 ring-white transition-transform hover:scale-110 active:scale-95 lg:flex"
            >
              {user.displayName
                ? user.displayName.split(" ").map(n => n[0]).join("").toUpperCase()
                : user.email?.[0].toUpperCase()}
            </Link>
          )}
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 lg:flex-1 lg:flex-col lg:gap-1 lg:overflow-y-auto lg:border-t lg:py-4">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} active={pathname.startsWith(item.href)} />
        ))}

        {isAdmin && (
          <>
            <div className="hidden px-2 pb-1 pt-4 lg:block">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Admin</p>
            </div>
            {adminItems.map((item) => (
              <NavLink key={item.href} {...item} active={pathname.startsWith(item.href)} />
            ))}
          </>
        )}
      </nav>

      <div className="hidden border-t border-slate-100 px-3 py-3 lg:block">
        <SignOutButton />
      </div>
    </aside>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-10 shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2",
        active
          ? "bg-[#E6F1FB] text-[#185FA5]"
          : "text-slate-600 hover:bg-[#F8F7F4] hover:text-slate-900"
      )}
    >
      <Icon
        size={18}
        className={cn(
          active ? "text-[#185FA5]" : "text-slate-400"
        )}
      />
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  );
}

function SignOutButton() {
  async function handleSignOut() {
    const { signOut } = await import("@/lib/firebase/auth");
    await signOut();
    await fetch("/api/auth/sync-user", { method: "DELETE" });
    window.location.href = "/";
  }
  return (
    <button
      onClick={handleSignOut}
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-[#F8F7F4] hover:text-slate-800"
    >
      <Icons.LogOut size={18} className="text-slate-400" />
      Sign out
    </button>
  );
}
