"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";
import * as Icons from "@/components/ui/Icons";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  detail: string;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Icons.LayoutDashboard, detail: "Overview" },
  { href: "/courses", label: "Courses", icon: Icons.GraduationCap, detail: "Modules" },
  { href: "/formulas", label: "Formula Compass", icon: Icons.Calculator, detail: "Reference" },
  { href: "/glossary", label: "Glossary", icon: Icons.BookOpen, detail: "Definitions" },
  { href: "/profile", label: "My Progress", icon: Icons.User, detail: "Tracking" },
];

const adminItems: NavItem[] = [
  { href: "/admin", label: "Admin Home", icon: Icons.ShieldCheck, detail: "Overview" },
  { href: "/admin/questions", label: "Question Bank", icon: Icons.FileText, detail: "Library" },
  { href: "/admin/quizzes", label: "Quizzes", icon: Icons.ClipboardList, detail: "Assessment" },
  { href: "/admin/courses", label: "Courses", icon: Icons.GraduationCap, detail: "Publishing" },
  { href: "/admin/preview/courses", label: "Student Preview", icon: Icons.Eye, detail: "QA mode" },
  { href: "/admin/glossary", label: "Glossary", icon: Icons.BookOpen, detail: "Terms" },
  { href: "/admin/materials", label: "Source Materials", icon: Icons.Database, detail: "Imports" },
  { href: "/admin/cohorts", label: "Cohort Stats", icon: Icons.BarChart3, detail: "Analytics" },
  { href: "/admin/users", label: "Users", icon: Icons.Users, detail: "Access" },
];

const learnerMilestones = [
  { label: "Learn", value: "Courses", state: "complete" as const },
  { label: "Apply", value: "Formulas", state: "active" as const },
  { label: "Review", value: "Rationale", state: "upcoming" as const },
];

const adminUtilities = [
  { label: "Questions", value: "458" },
  { label: "Formulas", value: "53" },
  { label: "Sections", value: "10" },
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
    <aside className="border-b border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] shadow-[var(--sidebar-shadow)] lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="border-b border-[var(--sidebar-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0))] px-4 py-4 sm:px-5 lg:px-6 lg:py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href="/dashboard" className="block">
              <p className="text-lg font-extrabold tracking-[-0.03em] text-white">IMPACT_26</p>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-muted)]">
                Property Assessment
              </p>
            </Link>
            <div className="mt-4 hidden lg:block">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8ebbe9]">
                {isAdmin ? "Control Center" : "Learning Path"}
              </p>
              <p className="mt-1 text-base font-extrabold leading-tight text-white">
                {isAdmin ? "Content, users, and delivery tools" : "Build confidence in every assessment step"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-full border border-[var(--sidebar-border)] bg-white/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#d9eaf9]">
              {isAdmin ? "Admin" : "Learner"}
            </div>
            {user && (
              <Link
                href="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.12] text-[11px] font-bold text-white ring-1 ring-white/10 transition-transform hover:scale-105 active:scale-95"
              >
                {user.displayName
                  ? user.displayName
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()
                  : user.email?.[0].toUpperCase()}
              </Link>
            )}
          </div>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-3 py-3 sm:px-4 lg:flex-1 lg:flex-col lg:gap-1 lg:overflow-y-auto lg:px-4 lg:py-5">
        <div className="flex gap-2 lg:flex-col lg:gap-1">
          {navItems.map((item, index) => (
            <NavLink
              key={item.href}
              {...item}
              index={index + 1}
              active={matchesPath(pathname, item.href)}
            />
          ))}
        </div>

        {isAdmin && (
          <div className="flex gap-2 lg:mt-5 lg:flex-col lg:gap-1">
            <div className="hidden px-3 pb-2 pt-2 lg:block">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8ebbe9]">Admin tools</p>
            </div>
            {adminItems.map((item, index) => (
              <NavLink
                key={item.href}
                {...item}
                index={index + 1}
                active={matchesPath(pathname, item.href)}
              />
            ))}
          </div>
        )}
      </nav>

      <div className="hidden border-t border-[var(--sidebar-border)] px-4 py-4 lg:block">
        {isAdmin ? <AdminUtilityCard /> : <LearnerProgressCard />}
        <div className="mt-4">
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  label,
  detail,
  icon: Icon,
  index,
  active,
}: NavItem & {
  index: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border px-2.5 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar-bg)] lg:min-h-12 lg:px-3",
        active
          ? "border-white/10 bg-[var(--sidebar-active)] text-white shadow-lg shadow-[#031d35]/25"
          : "border-transparent bg-transparent text-[var(--sidebar-muted)] hover:border-white/[0.06] hover:bg-[var(--sidebar-hover)] hover:text-white"
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-extrabold transition-colors",
          active
            ? "border-white/[0.18] bg-white/[0.14] text-white"
            : "border-white/[0.14] bg-white/[0.06] text-[#d9eaf9] group-hover:border-white/[0.18] group-hover:bg-white/10"
        )}
      >
        {index}
      </span>
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors",
          active ? "bg-[var(--sidebar-active-soft)] text-white" : "bg-white/[0.06] text-[#d9eaf9] group-hover:bg-white/10"
        )}
      >
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block whitespace-nowrap text-sm font-bold">{label}</span>
        <span className={cn("block whitespace-nowrap text-[11px] font-semibold", active ? "text-white/[0.78]" : "text-[var(--sidebar-muted)]")}>
          {detail}
        </span>
      </span>
    </Link>
  );
}

function LearnerProgressCard() {
  return (
    <div className="rounded-3xl border border-[var(--sidebar-border)] bg-[var(--sidebar-card)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8ebbe9]">Study rhythm</p>
          <p className="mt-1 text-sm font-bold text-white">Assessment reasoning loop</p>
        </div>
        <div className="rounded-full bg-white/[0.12] px-2.5 py-1 text-xs font-extrabold text-white">62%</div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-white/10">
        <div className="h-full w-[62%] rounded-full bg-[var(--sidebar-accent)]" />
      </div>
      <div className="mt-4 space-y-3">
        {learnerMilestones.map((milestone) => (
          <div key={milestone.label} className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                milestone.state === "complete" && "border-[#67c58e] bg-[#2f7a4d] text-white",
                milestone.state === "active" && "border-white/[0.24] bg-white/[0.12] text-white",
                milestone.state === "upcoming" && "border-white/[0.16] bg-transparent text-[#d9eaf9]"
              )}
            >
              {milestone.state === "complete" ? <Icons.Check size={12} /> : null}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white">{milestone.label}</p>
              <p className="text-[11px] font-semibold text-[var(--sidebar-muted)]">{milestone.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminUtilityCard() {
  return (
    <div className="rounded-3xl border border-[var(--sidebar-border)] bg-[var(--sidebar-card)] p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8ebbe9]">Admin workflow</p>
      <p className="mt-1 text-sm font-bold text-white">Manage content with the same lesson-first cadence.</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {adminUtilities.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-3 text-center">
            <p className="text-lg font-extrabold tracking-[-0.03em] text-white">{item.value}</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--sidebar-muted)]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
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
      className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-3 text-sm font-semibold text-[#d9eaf9] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar-bg)]"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.08] text-white">
        <Icons.LogOut size={16} />
      </span>
      Sign out
    </button>
  );
}

function matchesPath(pathname: string, href: string) {
  if (href === "/dashboard" || href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
