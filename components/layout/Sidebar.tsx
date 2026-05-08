"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";
import * as Icons from "@/components/ui/Icons";

const DESKTOP_SIDEBAR_MODE_KEY = "impact26:desktop-sidebar-mode";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
};

type DesktopSidebarMode = "expanded" | "collapsed" | "auto";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Icons.LayoutDashboard },
  { href: "/courses", label: "Courses", icon: Icons.GraduationCap },
  { href: "/formulas", label: "Formula Compass", icon: Icons.Calculator },
  { href: "/glossary", label: "Glossary", icon: Icons.BookOpen },
  { href: "/profile", label: "My Progress", icon: Icons.User },
];

const adminItems: NavItem[] = [
  { href: "/admin", label: "Admin Home", icon: Icons.ShieldCheck },
  { href: "/admin/questions", label: "Question Bank", icon: Icons.FileText },
  { href: "/admin/quizzes", label: "Quizzes", icon: Icons.ClipboardList },
  { href: "/admin/courses", label: "Courses", icon: Icons.GraduationCap },
  { href: "/admin/preview/courses", label: "Student Preview", icon: Icons.Eye },
  { href: "/admin/formulas", label: "Formula Compass", icon: Icons.Calculator },
  { href: "/admin/glossary", label: "Glossary", icon: Icons.BookOpen },
  { href: "/admin/materials", label: "Source Materials", icon: Icons.Database },
  { href: "/admin/cohorts", label: "Cohort Stats", icon: Icons.BarChart3 },
  { href: "/admin/users", label: "Users", icon: Icons.Users },
];

const learnerMilestones = [
  { label: "Learn", value: "Courses", state: "complete" as const },
  { label: "Apply", value: "Formulas", state: "active" as const },
  { label: "Review", value: "Rationale", state: "upcoming" as const },
];

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [desktopMode, setDesktopMode] = useState<DesktopSidebarMode>("expanded");
  const [autoReveal, setAutoReveal] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  useEffect(() => {
    const storedMode = window.localStorage.getItem(DESKTOP_SIDEBAR_MODE_KEY);
    if (storedMode === "expanded" || storedMode === "collapsed" || storedMode === "auto") {
      setDesktopMode(storedMode);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(DESKTOP_SIDEBAR_MODE_KEY, desktopMode);
  }, [desktopMode]);

  const isCollapsed = desktopMode === "collapsed";
  const isAutoMode = desktopMode === "auto";
  const isDesktopExpanded = desktopMode === "expanded" || (desktopMode === "auto" && autoReveal);

  return (
    <aside
      className={cn(
        "isolate border-b border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] shadow-[var(--sidebar-shadow)] lg:sticky lg:top-0 lg:z-40 lg:shrink-0 lg:border-b-0",
        desktopMode === "expanded" && "lg:w-72",
        desktopMode === "collapsed" && "lg:w-[5.5rem]",
        desktopMode === "auto" && "lg:w-[4.5rem]"
      )}
      onMouseEnter={() => {
        if (isAutoMode) setAutoReveal(true);
      }}
      onMouseLeave={() => {
        if (isAutoMode) setAutoReveal(false);
      }}
      onFocusCapture={() => {
        if (isAutoMode) setAutoReveal(true);
      }}
      onBlurCapture={(event) => {
        if (!isAutoMode) return;
        const nextTarget = event.relatedTarget;
        if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
          setAutoReveal(false);
        }
      }}
    >
      <div className="border-b border-[var(--sidebar-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0))] px-4 py-4 sm:px-5 lg:hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href="/dashboard" className="block">
              <p className="text-lg font-extrabold tracking-[-0.03em] text-white">IMPACT_26</p>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-muted)]">
                Property Assessment
              </p>
            </Link>
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

      <div
        className={cn(
          "hidden lg:block lg:relative lg:h-screen",
          desktopMode === "expanded" && "lg:w-72",
          desktopMode === "collapsed" && "lg:w-[5.5rem] lg:overflow-hidden",
          desktopMode === "auto" && "lg:w-[4.5rem] lg:overflow-visible"
        )}
      >
        {isAutoMode ? (
          <>
            <div className="flex h-full w-[4.5rem] flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]">
              <div className="border-b border-[var(--sidebar-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0))] px-3 py-4">
                <div className="flex flex-col items-center gap-3">
                  <Link href="/dashboard" className="flex flex-col items-center text-center" title="IMPACT_26">
                    <p className="text-lg font-extrabold tracking-[-0.03em] text-white">IM</p>
                  </Link>
                  <div className="inline-flex rounded-full border border-[var(--sidebar-border)] bg-white/10 px-2 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#d9eaf9]">
                    {isAdmin ? "A" : "L"}
                  </div>
                  <SidebarModeButton
                    label="Disable auto-hide"
                    active
                    onClick={() => {
                      setAutoReveal(false);
                      setDesktopMode("expanded");
                    }}
                  >
                    <Icons.Eye size={15} />
                  </SidebarModeButton>
                </div>
              </div>

              <nav className="flex flex-1 flex-col items-center gap-2 overflow-y-auto px-2.5 py-5">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    {...item}
                    compact
                    active={matchesPath(pathname, item.href)}
                  />
                ))}

                {isAdmin && (
                  <div className="mt-5 flex w-full flex-col items-center gap-2">
                    {adminItems.map((item) => (
                      <NavLink
                        key={item.href}
                        {...item}
                        compact
                        active={matchesPath(pathname, item.href)}
                      />
                    ))}
                  </div>
                )}
              </nav>

              <div className="border-t border-[var(--sidebar-border)] px-3 py-4">
                <SignOutButton compact />
              </div>
            </div>

            <div
              className={cn(
                "absolute left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] shadow-[var(--sidebar-shadow)] transition-transform duration-300",
                autoReveal ? "translate-x-0" : "-translate-x-full"
              )}
            >
              <SidebarPanelContent
                isAdmin={isAdmin}
                user={user}
                pathname={pathname}
                compact={false}
                onSetDesktopMode={setDesktopMode}
                onDisableAutoHide={() => {
                  setAutoReveal(false);
                  setDesktopMode("expanded");
                }}
              />
            </div>
          </>
        ) : (
          <div
            className={cn(
              "flex h-full flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] transition-[width] duration-300",
              isDesktopExpanded ? "w-72" : "w-[5.5rem]"
            )}
          >
            <SidebarPanelContent
              isAdmin={isAdmin}
              user={user}
              pathname={pathname}
              compact={!isDesktopExpanded}
              onSetDesktopMode={setDesktopMode}
            />
          </div>
        )}
      </div>

      <nav className="flex gap-2 overflow-x-auto px-3 py-3 sm:px-4 lg:hidden">
        <div className="flex gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={matchesPath(pathname, item.href)}
            />
          ))}
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            {adminItems.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                active={matchesPath(pathname, item.href)}
              />
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
}

function SidebarPanelContent({
  isAdmin,
  user,
  pathname,
  compact,
  onSetDesktopMode,
  onDisableAutoHide,
}: {
  isAdmin?: boolean;
  user: FirebaseUser | null;
  pathname: string;
  compact: boolean;
  onSetDesktopMode: (mode: DesktopSidebarMode) => void;
  onDisableAutoHide?: () => void;
}) {
  return (
    <>
      <div
        className={cn(
          "border-b border-[var(--sidebar-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0))]",
          compact ? "px-3 py-4" : "px-6 py-6"
        )}
      >
        <div className={cn("flex gap-3", compact ? "flex-col items-center" : "items-start justify-between")}>
          <div className={cn("min-w-0", compact && "w-full")}>
            <Link
              href="/dashboard"
              className={cn("block", compact && "flex flex-col items-center text-center")}
              title="IMPACT_26"
            >
              <p className="text-lg font-extrabold tracking-[-0.03em] text-white">IMPACT_26</p>
              {!compact && (
                <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-muted)]">
                  Property Assessment
                </p>
              )}
            </Link>
            {!isAdmin && !compact && (
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8ebbe9]">Learning Path</p>
                <p className="mt-1 text-sm font-bold leading-6 text-white/82">Build confidence in each assessment step.</p>
              </div>
            )}
          </div>

          <div className={cn("flex items-center gap-2", compact && "w-full flex-col")}>
            <div
              className={cn(
                "inline-flex rounded-full border border-[var(--sidebar-border)] bg-white/10 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#d9eaf9]",
                compact ? "px-2 py-1" : "px-2.5 py-1"
              )}
            >
              {compact ? (isAdmin ? "A" : "L") : isAdmin ? "Admin" : "Learner"}
            </div>
            {user && (
              <Link
                href="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.12] text-[11px] font-bold text-white ring-1 ring-white/10 transition-transform hover:scale-105 active:scale-95"
                title="Profile"
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

        <div className={cn("mt-4 flex items-center gap-2", compact && "justify-center")}>
          <SidebarModeButton
            label={compact ? "Expand sidebar" : "Collapse sidebar"}
            active={compact}
            onClick={() => onSetDesktopMode(compact ? "expanded" : "collapsed")}
          >
            {compact ? <Icons.ChevronRight size={15} /> : <Icons.ChevronLeft size={15} />}
          </SidebarModeButton>
          <SidebarModeButton
            label={onDisableAutoHide ? "Disable auto-hide" : "Enable auto-hide"}
            active={Boolean(onDisableAutoHide)}
            onClick={() => {
              if (onDisableAutoHide) {
                onDisableAutoHide();
                return;
              }
              onSetDesktopMode("auto");
            }}
          >
            {onDisableAutoHide ? <Icons.Eye size={15} /> : <Icons.EyeOff size={15} />}
          </SidebarModeButton>
        </div>
      </div>

      <nav
        className={cn(
          "flex flex-1 overflow-y-auto py-5",
          compact ? "flex-col items-center gap-2 px-2.5" : "flex-col gap-1.5 px-4"
        )}
      >
        <div className={cn("flex w-full flex-col", compact ? "items-center gap-2" : "gap-1.5")}>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              compact={compact}
              active={matchesPath(pathname, item.href)}
            />
          ))}
        </div>

        {isAdmin && (
          <div className={cn("mt-5 flex w-full flex-col", compact ? "items-center gap-2" : "gap-1.5")}>
            {!compact && (
              <div className="px-3 pb-2 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8ebbe9]">Admin tools</p>
              </div>
            )}
            {adminItems.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                compact={compact}
                active={matchesPath(pathname, item.href)}
              />
            ))}
          </div>
        )}
      </nav>

      <div className={cn("border-t border-[var(--sidebar-border)]", compact ? "px-3 py-4" : "px-4 py-4")}>
        {!isAdmin && !compact && <LearnerProgressCard />}
        <div className={cn(!isAdmin && !compact && "mt-4")}>
          <SignOutButton compact={compact} />
        </div>
      </div>
    </>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  compact,
  active,
}: NavItem & {
  compact?: boolean;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      title={compact ? label : undefined}
      className={cn(
        "group flex min-h-11 shrink-0 items-center gap-3 rounded-2xl border px-3 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar-bg)] lg:min-h-11",
        compact && "justify-center px-0 lg:h-11 lg:min-h-11 lg:w-11",
        active
          ? "border-white/10 bg-[var(--sidebar-active)] text-white shadow-lg shadow-[#031d35]/25"
          : "border-transparent bg-transparent text-[var(--sidebar-muted)] hover:border-white/[0.06] hover:bg-[var(--sidebar-hover)] hover:text-white"
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors",
          active ? "bg-[var(--sidebar-active-soft)] text-white" : "bg-white/[0.06] text-[#d9eaf9] group-hover:bg-white/10"
        )}
      >
        <Icon size={16} />
      </span>
      {!compact && <span className="min-w-0 flex-1 whitespace-nowrap text-sm font-bold">{label}</span>}
      {!compact && (
        <span
          aria-hidden="true"
          className={cn(
            "hidden h-2 w-2 shrink-0 rounded-full transition-all lg:block",
            active ? "bg-[var(--sidebar-accent)]" : "bg-transparent group-hover:bg-white/[0.18]"
          )}
        />
      )}
      <span className="sr-only">
        {active ? "Current page" : ""}
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

function SidebarModeButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl border text-[#d9eaf9] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar-bg)]",
        active ? "border-white/18 bg-white/[0.14]" : "border-white/10 bg-white/[0.06]"
      )}
    >
      {children}
    </button>
  );
}

function SignOutButton({ compact }: { compact?: boolean }) {
  async function handleSignOut() {
    const { signOut } = await import("@/lib/firebase/auth");
    await signOut();
    await fetch("/api/auth/sync-user", { method: "DELETE" });
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleSignOut}
      title={compact ? "Sign out" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] text-sm font-semibold text-[#d9eaf9] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar-bg)]",
        compact ? "w-11 justify-center px-0 py-2.5" : "w-full px-3 py-3"
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.08] text-white">
        <Icons.LogOut size={16} />
      </span>
      {!compact && "Sign out"}
    </button>
  );
}

function matchesPath(pathname: string, href: string) {
  if (href === "/dashboard" || href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
