"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";
import * as Icons from "@/components/ui/Icons";
import { UserAvatar as ProfileAvatar } from "@/components/profile/UserAvatar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { applyTheme, type ThemeMode } from "@/components/theme/ThemeController";

const DESKTOP_SIDEBAR_MODE_KEY = "impact26:desktop-sidebar-mode";
const STUDY_RHYTHM_OPEN_KEY = "impact26:study-rhythm-open";
const STUDENT_SECTION_OPEN_KEY = "impact26:student-section-open";
const ADMIN_TOOLS_OPEN_KEY = "impact26:admin-tools-open";

type StudyRhythmData = {
  lessonsCompleted: number;
  quizAttempts: number;
  bestScore: number | null;
  hasPassed: boolean;
  formulaFavorites: number;
  overallPct: number;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
};

type DesktopSidebarMode = "expanded" | "collapsed" | "auto";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Icons.LayoutDashboard },
  { href: "/courses", label: "Courses", icon: Icons.GraduationCap },
  { href: "/progress", label: "My Progress", icon: Icons.BarChart3 },
  { href: "/formulas", label: "Formula Compass", icon: Icons.Calculator },
  { href: "/glossary", label: "Glossary", icon: Icons.BookOpen },
  { href: "/profile", label: "Profile", icon: Icons.User },
  { href: "/settings", label: "Settings", icon: Icons.Settings },
];

const adminItems: NavItem[] = [
  { href: "/admin", label: "Teacher Portal", icon: Icons.ShieldCheck },
  { href: "/admin/questions", label: "Question Bank", icon: Icons.FileText },
  { href: "/admin/quizzes", label: "Quizzes Editor", icon: Icons.ClipboardList },
  { href: "/admin/courses", label: "Courses Editor", icon: Icons.GraduationCap },
  { href: "/admin/formulas", label: "Formula Editor", icon: Icons.Calculator },
  { href: "/admin/glossary", label: "Glossary Editor", icon: Icons.BookOpen },
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
  const [profileRefresh, setProfileRefresh] = useState(0);
  const [desktopMode, setDesktopMode] = useState<DesktopSidebarMode>("expanded");
  const [autoReveal, setAutoReveal] = useState(false);
  const [studentOpen, setStudentOpen] = useState(!isAdmin);
  const [adminOpen, setAdminOpen] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  useEffect(() => {
    const refreshProfile = async () => {
      await auth.currentUser?.reload();
      setUser(auth.currentUser);
      setProfileRefresh((value) => value + 1);
    };

    window.addEventListener("impact26:profile-updated", refreshProfile);
    return () => window.removeEventListener("impact26:profile-updated", refreshProfile);
  }, []);

  useEffect(() => {
    const storedMode = window.localStorage.getItem(DESKTOP_SIDEBAR_MODE_KEY);
    if (storedMode === "expanded" || storedMode === "collapsed" || storedMode === "auto") {
      setDesktopMode(storedMode);
    }
    const storedStudent = window.localStorage.getItem(STUDENT_SECTION_OPEN_KEY);
    if (storedStudent !== null) {
      setStudentOpen(storedStudent === "true");
    }
    const storedAdmin = window.localStorage.getItem(ADMIN_TOOLS_OPEN_KEY);
    if (storedAdmin !== null) {
      setAdminOpen(storedAdmin === "true");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(DESKTOP_SIDEBAR_MODE_KEY, desktopMode);
  }, [desktopMode]);

  const toggleStudentOpen = () => {
    setStudentOpen((prev) => {
      const next = !prev;
      window.localStorage.setItem(STUDENT_SECTION_OPEN_KEY, String(next));
      return next;
    });
  };

  const toggleAdminOpen = () => {
    setAdminOpen((prev) => {
      const next = !prev;
      window.localStorage.setItem(ADMIN_TOOLS_OPEN_KEY, String(next));
      return next;
    });
  };

  const isCollapsed = desktopMode === "collapsed";
  const isAutoMode = desktopMode === "auto";
  const isDesktopExpanded = desktopMode === "expanded" || (desktopMode === "auto" && autoReveal);
  const primaryItems = isAdmin ? adminItems : navItems;
  const secondaryItems = isAdmin ? navItems : [];

  return (
    <aside
      className={cn(
        "isolate border-b border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] shadow-[var(--sidebar-shadow)] lg:sticky lg:top-0 lg:z-40 lg:h-screen lg:shrink-0 lg:self-start lg:border-b-0",
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
      {/* Mobile top header */}
      <div className="border-b border-[var(--sidebar-border)] bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0))] px-4 py-4 sm:px-5 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard" className="block min-w-0">
            <p className="text-base font-extrabold tracking-[-0.03em] text-white">IMPACT_26</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sidebar-muted)]">
              Property Assessment
            </p>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <RolePill isAdmin={isAdmin} />
            {user && <UserAvatar key={profileRefresh} user={user} />}
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden lg:block lg:relative lg:h-screen lg:min-h-0",
          desktopMode === "expanded" && "lg:w-72",
          desktopMode === "collapsed" && "lg:w-[5.5rem] lg:overflow-hidden",
          desktopMode === "auto" && "lg:w-[4.5rem] lg:overflow-visible"
        )}
      >
        {isAutoMode ? (
          <>
            <div className="flex h-full min-h-0 w-[4.5rem] flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]">
              <div className="border-b border-[var(--sidebar-border)] bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0))] px-3 py-4">
                <div className="flex flex-col items-center gap-3">
                  <Link href="/dashboard" className="flex flex-col items-center text-center" title="IMPACT_26">
                    <p className="text-base font-extrabold tracking-[-0.03em] text-white">IM</p>
                  </Link>
                  <RolePill isAdmin={isAdmin} compact />
                  <SidebarModeButton
                    label="Disable auto-hide"
                    active
                    onClick={() => {
                      setAutoReveal(false);
                      setDesktopMode("expanded");
                    }}
                  >
                    <Icons.Eye size={14} />
                  </SidebarModeButton>
                </div>
              </div>

              <nav className="flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto px-2.5 py-5">
                {primaryItems.map((item) => (
                  <NavLink
                    key={item.href}
                    {...item}
                    compact
                    active={matchesPath(pathname, item.href)}
                    isAdminItem={isAdmin}
                  />
                ))}

                {!!secondaryItems.length && (
                  <div className="mt-5 flex w-full flex-col items-center gap-2">
                    {secondaryItems.map((item) => (
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
                <ThemeToggle compact className="mb-2" onChange={persistThemePreference} />
                <SignOutButton compact />
              </div>
            </div>

            <div
              className={cn(
                "absolute left-0 top-0 z-50 flex h-full min-h-0 w-72 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] shadow-[var(--sidebar-shadow)] transition-transform duration-300",
                autoReveal ? "translate-x-0" : "-translate-x-full"
              )}
            >
              <SidebarPanelContent
                isAdmin={isAdmin}
                user={user}
                profileRefresh={profileRefresh}
                pathname={pathname}
                compact={false}
                onSetDesktopMode={setDesktopMode}
                onDisableAutoHide={() => {
                  setAutoReveal(false);
                  setDesktopMode("expanded");
                }}
                studentOpen={studentOpen}
                toggleStudentOpen={toggleStudentOpen}
                adminOpen={adminOpen}
                toggleAdminOpen={toggleAdminOpen}
                primaryItems={primaryItems}
                secondaryItems={secondaryItems}
              />
            </div>
          </>
        ) : (
          <div
            className={cn(
              "flex h-full min-h-0 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] transition-[width] duration-300",
              isDesktopExpanded ? "w-72" : "w-[5.5rem]"
            )}
          >
            <SidebarPanelContent
              isAdmin={isAdmin}
              user={user}
              profileRefresh={profileRefresh}
              pathname={pathname}
              compact={!isDesktopExpanded}
              onSetDesktopMode={setDesktopMode}
              studentOpen={studentOpen}
              toggleStudentOpen={toggleStudentOpen}
              adminOpen={adminOpen}
              toggleAdminOpen={toggleAdminOpen}
              primaryItems={primaryItems}
              secondaryItems={secondaryItems}
            />
          </div>
        )}
      </div>

      {/* Mobile bottom nav scroll */}
      <nav className="flex gap-2 overflow-x-auto px-3 py-3 sm:px-4 lg:hidden">
        <div className="flex gap-2">
          {primaryItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={matchesPath(pathname, item.href)}
              isAdminItem={isAdmin}
            />
          ))}
        </div>

        {!!secondaryItems.length && (
          <div className="flex gap-2">
            {secondaryItems.map((item) => (
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
  profileRefresh,
  pathname,
  compact,
  onSetDesktopMode,
  onDisableAutoHide,
  studentOpen,
  toggleStudentOpen,
  adminOpen,
  toggleAdminOpen,
  primaryItems,
  secondaryItems,
}: {
  isAdmin?: boolean;
  user: FirebaseUser | null;
  profileRefresh: number;
  pathname: string;
  compact: boolean;
  onSetDesktopMode: (mode: DesktopSidebarMode) => void;
  onDisableAutoHide?: () => void;
  studentOpen: boolean;
  toggleStudentOpen: () => void;
  adminOpen: boolean;
  toggleAdminOpen: () => void;
  primaryItems: NavItem[];
  secondaryItems: NavItem[];
}) {
  return (
    <>
      {/* Header */}
      <div
        className={cn(
          "border-b border-[var(--sidebar-border)] bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]",
          compact ? "px-3 py-4" : "px-5 py-5"
        )}
      >
        {/* Brand + user row */}
        <div className={cn("flex", compact ? "flex-col items-center gap-3" : "items-start justify-between gap-3")}>
          <div className={cn("min-w-0", compact && "w-full flex flex-col items-center")}>
            <Link
              href="/dashboard"
              className={cn("block", compact && "flex flex-col items-center text-center")}
              title="IMPACT_26"
            >
              <p className="text-base font-extrabold tracking-[-0.03em] text-white">IMPACT_26</p>
              {!compact && (
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sidebar-muted)]">
                  Property Assessment
                </p>
              )}
            </Link>
          </div>

          <div className={cn("flex items-center gap-2 shrink-0", compact && "flex-col")}>
            <RolePill isAdmin={isAdmin} compact={compact} />
            {user && <UserAvatar key={profileRefresh} user={user} />}
          </div>
        </div>



        {/* Mode controls */}
        <div className={cn("flex items-center gap-2", compact ? "mt-4 justify-center" : "mt-3")}>
          <SidebarModeButton
            label={compact ? "Expand sidebar" : "Collapse sidebar"}
            active={compact}
            onClick={() => onSetDesktopMode(compact ? "expanded" : "collapsed")}
          >
            {compact ? <Icons.ChevronRight size={14} /> : <Icons.ChevronLeft size={14} />}
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
            {onDisableAutoHide ? <Icons.Eye size={14} /> : <Icons.EyeOff size={14} />}
          </SidebarModeButton>
        </div>
      </div>

      {/* Nav */}
      <nav
        className={cn(
          "flex min-h-0 flex-1 overflow-y-auto py-4",
          compact ? "flex-col items-center gap-1.5 px-2.5" : "flex-col gap-1 px-3"
        )}
      >
        <div className={cn("flex w-full flex-col", compact ? "items-center gap-1.5" : "gap-1")}>
          {!compact && (
            <button
              type="button"
              onClick={toggleAdminOpen}
              className={cn(
                "flex w-full items-center justify-between px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-md",
                isAdmin ? "text-[#fca5a5]" : "text-[#8ebbe9]"
              )}
            >
              <span>{isAdmin ? "Teacher Portal" : "Student Section"}</span>
              <Icons.ChevronDown
                size={12}
                className={cn(isAdmin ? "text-[#fecdd3]" : "text-[#c8e0f4]", "transition-transform duration-200", adminOpen && "rotate-180")}
              />
            </button>
          )}
          {(compact || adminOpen) &&
            primaryItems.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                compact={compact}
                active={matchesPath(pathname, item.href)}
                isAdminItem={isAdmin}
              />
            ))}
        </div>

        {!!secondaryItems.length && (
          <div className={cn("mt-4 flex w-full flex-col", compact ? "items-center gap-1.5" : "gap-1")}>
            {!compact && (
              <button
                type="button"
                onClick={toggleStudentOpen}
                className="flex w-full items-center justify-between px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8ebbe9] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-md"
              >
                <span>Learner View</span>
                <Icons.ChevronDown
                  size={12}
                  className={cn("text-[#c8e0f4] transition-transform duration-200", studentOpen && "rotate-180")}
                />
              </button>
            )}
            {(compact || studentOpen) &&
              secondaryItems.map((item) => (
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

      {/* Footer */}
      <div className={cn("border-t border-[var(--sidebar-border)]", compact ? "px-3 py-4" : "px-3 py-4")}>
        {!isAdmin && !compact && <LearnerProgressCard />}
        <div className={cn(!isAdmin && !compact && "mt-3")}>
          <ThemeToggle compact={compact} onChange={persistThemePreference} />
        </div>
        <div className="mt-2">
          <SignOutButton compact={compact} />
        </div>
      </div>
    </>
  );
}

/** Small role pill — "Learner" / "Admin" (or initial when compact) */
function RolePill({ isAdmin, compact }: { isAdmin?: boolean; compact?: boolean }) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-[var(--sidebar-border)] bg-white/[0.10] font-extrabold uppercase tracking-[0.12em] text-[#d9eaf9]",
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[10px]"
      )}
    >
      {compact ? (isAdmin ? "A" : "L") : isAdmin ? "Admin" : "Learner"}
    </div>
  );
}

/** Circular avatar linking to /profile */
function UserAvatar({ user }: { user: FirebaseUser }) {
  return (
    <Link
      href="/profile"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/[0.14] text-[11px] font-bold text-white ring-1 ring-white/10 transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
      title="Profile"
    >
      <ProfileAvatar
        fullName={user.displayName}
        email={user.email}
        photoURL={user.photoURL}
        size="sm"
        className="h-full w-full border-0 bg-transparent ring-0"
      />
    </Link>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  compact,
  active,
  isAdminItem,
}: NavItem & {
  compact?: boolean;
  active: boolean;
  isAdminItem?: boolean;
}) {
  return (
    <Link
      href={href}
      title={compact ? label : undefined}
      className={cn(
        "group relative flex min-h-10 shrink-0 items-center gap-3 rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar-bg)]",
        compact && "justify-center px-0 lg:h-10 lg:min-h-10 lg:w-10",
        active
          ? isAdminItem
            ? "border-white/[0.12] bg-[#8a2525] text-white shadow-md shadow-[#350303]/30"
            : "border-white/[0.12] bg-[var(--sidebar-active)] text-white shadow-md shadow-[#031d35]/30"
          : "border-transparent text-[var(--sidebar-muted)] hover:border-white/[0.08] hover:bg-[var(--sidebar-hover)] hover:text-white"
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
          active
            ? "bg-white/[0.18] text-white"
            : isAdminItem
              ? "bg-white/[0.05] text-[#fca5a5] group-hover:bg-white/[0.10] group-hover:text-white"
              : "bg-white/[0.05] text-[#c8e0f4] group-hover:bg-white/[0.10] group-hover:text-white"
        )}
      >
        <Icon size={15} />
      </span>
      {!compact && <span className="min-w-0 flex-1 whitespace-nowrap">{label}</span>}
      {!compact && (
        <span
          aria-hidden="true"
          className={cn(
            "hidden h-1.5 w-1.5 shrink-0 rounded-full transition-all lg:block",
            active
              ? isAdminItem
                ? "bg-[#fca5a5]"
                : "bg-[var(--sidebar-accent)]"
              : "bg-transparent group-hover:bg-white/20"
          )}
        />
      )}
      <span className="sr-only">{active ? "Current page" : ""}</span>
    </Link>
  );
}

function LearnerProgressCard() {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem(STUDY_RHYTHM_OPEN_KEY);
    return stored === null ? true : stored === "true";
  });
  const [data, setData] = useState<StudyRhythmData | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // Get a fresh Firebase ID token to call the API
    import("@/lib/firebase/client").then(({ auth: clientAuth }) => {
      const user = clientAuth.currentUser;
      if (!user) { setLoading(false); return; }
      user.getIdToken().then((token) =>
        fetch("/api/study-rhythm", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).then((res) => res.ok ? res.json() : null)
        .then((json) => { if (json) setData(json); })
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, []);

  function toggle() {
    setOpen((prev) => {
      const next = !prev;
      window.localStorage.setItem(STUDY_RHYTHM_OPEN_KEY, String(next));
      return next;
    });
  }

  const pct = data?.overallPct ?? 0;

  // Derive milestone states from real data
  const learnState: "complete" | "active" | "upcoming" =
    (data?.lessonsCompleted ?? 0) > 0 ? "complete" : "active";
  const applyState: "complete" | "active" | "upcoming" =
    learnState === "complete"
      ? (data?.formulaFavorites ?? 0) > 0 ? "complete" : "active"
      : "upcoming";
  const reviewState: "complete" | "active" | "upcoming" =
    applyState === "complete"
      ? (data?.hasPassed ? "complete" : "active")
      : "upcoming";

  const milestones = [
    { label: "Learn", value: `${data?.lessonsCompleted ?? 0} lesson${(data?.lessonsCompleted ?? 0) !== 1 ? "s" : ""} done`, state: learnState, href: "/courses" },
    { label: "Apply", value: `${data?.formulaFavorites ?? 0} formula${(data?.formulaFavorites ?? 0) !== 1 ? "s" : ""} saved`, state: applyState, href: "/formulas" },
    { label: "Review", value: data?.bestScore != null ? `Best ${data.bestScore.toFixed(0)}%` : "No attempts yet", state: reviewState, href: "/courses" },
  ];

  return (
    <div className="rounded-2xl border border-[var(--sidebar-border)] bg-[var(--sidebar-card)] overflow-hidden">
      {/* Header — always visible, acts as collapse toggle */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8ebbe9]">Study Rhythm</p>
        </div>
        {loading ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
        ) : (
          <span className="shrink-0 rounded-full bg-white/[0.12] px-2 py-0.5 text-[10px] font-extrabold tabular-nums text-white">
            {pct}%
          </span>
        )}
        <Icons.ChevronDown
          size={14}
          className={cn("shrink-0 text-[#c8e0f4] transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {/* Collapsible body */}
      {open && (
        <div className="px-4 pb-4">
          {/* Progress bar */}
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.10]">
            <div
              className="h-full rounded-full bg-[var(--sidebar-accent)] transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Milestones */}
          <div className="mt-3.5 space-y-2.5">
            {milestones.map((m) => (
              <Link key={m.label} href={m.href} className="group flex items-center gap-3">
                <MilestoneIcon state={m.state} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white group-hover:text-[#d9eaf9] transition-colors">{m.label}</p>
                  <p className="text-[11px] font-medium text-[var(--sidebar-muted)]">{m.value}</p>
                </div>
                {m.state === "active" && (
                  <span className="ml-auto shrink-0 rounded-full bg-[#185FA5]/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#d9eaf9] ring-1 ring-white/10">
                    Now
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MilestoneIcon({ state }: { state: "complete" | "active" | "upcoming" }) {
  if (state === "complete") {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#67c58e]/60 bg-[#2f7a4d] text-white shadow-sm">
        <Icons.Check size={11} />
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/30 bg-[var(--sidebar-active)] shadow-sm">
        <span className="h-2 w-2 rounded-full bg-white" />
      </span>
    );
  }
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.05]" />
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
        "flex h-8 w-8 items-center justify-center rounded-lg border text-[#c8e0f4] transition-all duration-150 hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar-bg)]",
        active ? "border-white/20 bg-white/[0.12]" : "border-white/[0.08] bg-white/[0.05]"
      )}
    >
      {children}
    </button>
  );
}

async function persistThemePreference(theme: ThemeMode) {
  applyTheme(theme);

  try {
    const response = await fetch("/api/profile", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json().catch(() => ({}));
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: { ...(payload.settings ?? {}), theme } }),
    });
  } catch {
    // Local storage still preserves the preference when profile persistence is unavailable.
  }
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
        "group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.05] text-sm font-semibold text-[var(--sidebar-muted)] transition-all duration-150 hover:border-white/[0.14] hover:bg-white/[0.10] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar-bg)]",
        compact ? "w-10 justify-center px-0 py-2.5" : "w-full px-3 py-2.5"
      )}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-[#c8e0f4] transition-colors group-hover:bg-white/[0.12] group-hover:text-white">
        <Icons.LogOut size={14} />
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
