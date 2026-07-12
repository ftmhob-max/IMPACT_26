"use client";

import { useEffect, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { toast, confirmDialog } from "@/components/admin/AdminFeedback";
import { EmptyState } from "@/components/admin/EmptyState";

interface User {
  id: string;
  email: string;
  fullName?: string | null;
  role: string;
  createdAt: string;
  disabled: boolean;
  lastSignInTime?: string | null;
}

const ROLES = ["learner", "viewer", "instructor", "admin"] as const;
type Role = (typeof ROLES)[number];

const ROLE_BADGE: Record<Role, string> = {
  learner: "bg-slate-100 text-slate-600",
  viewer: "bg-blue-100 text-blue-700",
  instructor: "bg-purple-100 text-purple-700",
  admin: "bg-red-100 text-red-700",
};

export function UsersManagementPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [setupLink, setSetupLink] = useState<{ email: string; link: string } | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    if (res.ok) setUsers((await res.json()).users ?? []);
    else toast("error", "Unable to load users.");
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateRole(userId: string, role: string) {
    setSaving(userId);
    const res = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    setSaving(null);
    if (res.ok) {
      toast("success", "Role updated.");
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    } else {
      toast("error", "Failed to update role.");
    }
  }

  async function toggleDisabled(user: User) {
    if (!user.disabled) {
      const ok = await confirmDialog(
        `Disable ${user.fullName ?? user.email}? They will not be able to sign in until re-enabled.`,
        { danger: true, title: "Disable account", confirmLabel: "Disable" }
      );
      if (!ok) return;
    }
    setSaving(user.id);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, disabled: !user.disabled }),
    });
    setSaving(null);
    if (res.ok) {
      toast("success", user.disabled ? "Account re-enabled." : "Account disabled.");
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, disabled: !user.disabled } : u)));
    } else {
      const err = await res.json().catch(() => ({}));
      toast("error", err.error ?? "Failed to update account status.");
    }
  }

  const filtered = users.filter(
    (u) =>
      !filter ||
      u.email.toLowerCase().includes(filter.toLowerCase()) ||
      (u.fullName ?? "").toLowerCase().includes(filter.toLowerCase())
  );

  const roleCounts = ROLES.reduce(
    (acc, r) => ({ ...acc, [r]: users.filter((u) => u.role === r).length }),
    {} as Record<string, number>
  );

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-3 min-[420px]:grid-cols-2 sm:grid-cols-4">
        {ROLES.map((r) => (
          <div key={r} className="rounded-xl border border-black/10 bg-white px-3 py-2.5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{r}</p>
            <p className="mt-0.5 text-2xl font-extrabold tabular-nums text-slate-900">{roleCounts[r] ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Setup link banner (after invite) */}
      {setupLink && (
        <div className="rounded-xl border border-[#b8d7f0] bg-[#E6F1FB] px-4 py-3">
          <div className="flex items-start gap-2">
            <Icons.Link2 size={14} className="mt-0.5 shrink-0 text-[#185FA5]" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800">
                Account created for {setupLink.email} — share this password-setup link with them:
              </p>
              <p className="mt-1 truncate rounded bg-white/70 px-2 py-1 font-mono text-[11px] text-slate-600">{setupLink.link}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(setupLink.link).catch(() => null);
                  toast("success", "Setup link copied to clipboard.");
                }}
                className="admin-action text-xs"
              >
                <Icons.Copy size={12} className="mr-1" />
                Copy
              </button>
              <button type="button" onClick={() => setSetupLink(null)} className="admin-action secondary text-xs" aria-label="Dismiss setup link">
                <Icons.X size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite form */}
      {showInvite && (
        <InviteForm
          onCancel={() => setShowInvite(false)}
          onInvited={(email, link) => {
            setShowInvite(false);
            if (link) setSetupLink({ email, link });
            toast("success", `Account created for ${email}.`);
            void load();
          }}
        />
      )}

      {/* User table */}
      <div className="rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
          <Icons.Users size={18} className="text-[#185FA5] shrink-0" />
          <h2 className="text-sm font-bold text-slate-900 shrink-0">All users</h2>
          <div className="relative order-last basis-full sm:order-none sm:max-w-xs sm:flex-1">
            <Icons.Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              className="admin-input !pl-7 py-1.5 text-xs"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by name or email…"
            />
          </div>
          <span className="ml-auto text-xs text-slate-400 shrink-0">{filtered.length} / {users.length}</span>
          <button
            type="button"
            onClick={() => setShowInvite((v) => !v)}
            className="admin-action flex items-center gap-1.5 text-xs shrink-0"
          >
            <Icons.Plus size={13} />
            Invite user
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="space-y-3 px-4 py-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-1.5">
                    <div className="admin-skeleton h-4 w-48" />
                    <div className="admin-skeleton h-3 w-32" />
                  </div>
                  <div className="admin-skeleton h-7 w-28" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Icons.Users size={32} />}
              title={filter ? "No users match that search." : "No users found."}
              hint={filter ? "Try a different name or email." : "Invite your first staff member to get started."}
            />
          ) : (
            filtered.map((user) => (
              <div
                key={user.id}
                className={cn(
                  "flex flex-col items-start gap-3 px-4 py-3 min-[380px]:grid min-[380px]:grid-cols-[1fr_auto] min-[380px]:items-center",
                  user.disabled && "opacity-60"
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {user.fullName ?? user.email}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROLE_BADGE[user.role as Role] ?? "bg-slate-100 text-slate-600"}`}>
                      {user.role}
                    </span>
                    {user.disabled && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                        Disabled
                      </span>
                    )}
                  </div>
                  {user.fullName && (
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                    {" · "}
                    {user.lastSignInTime
                      ? `Last active ${new Date(user.lastSignInTime).toLocaleDateString()}`
                      : "Never signed in"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {saving === user.id && <Icons.Loader size={13} className="animate-spin text-slate-400" />}
                  <select
                    className="admin-input py-1 text-xs w-28"
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    disabled={saving === user.id}
                    aria-label={`Role for ${user.email}`}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => toggleDisabled(user)}
                    disabled={saving === user.id}
                    title={user.disabled ? "Re-enable this account" : "Disable this account"}
                    className={cn(
                      "rounded-md border px-2 py-1.5 text-[10px] font-semibold transition-colors",
                      user.disabled
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "border-slate-200 bg-white text-slate-500 hover:border-red-300 hover:text-red-600"
                    )}
                  >
                    {user.disabled ? "Enable" : "Disable"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Invite form ──────────────────────────────────────────────────────────────

function InviteForm({
  onCancel,
  onInvited,
}: {
  onCancel: () => void;
  onInvited: (email: string, setupLink: string | null) => void;
}) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>("learner");
  const [busy, setBusy] = useState(false);

  async function invite() {
    setBusy(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), fullName: fullName.trim() || undefined, role }),
    });
    setBusy(false);
    if (res.ok) {
      const data = await res.json();
      onInvited(email.trim(), data.setupLink ?? null);
    } else {
      const err = await res.json().catch(() => ({}));
      toast("error", typeof err.error === "string" ? err.error : "Failed to create user.");
    }
  }

  return (
    <div className="rounded-xl border border-[#185FA5]/20 bg-[#E6F1FB]/20 p-4 space-y-3">
      <p className="text-xs font-bold text-slate-700 uppercase tracking-[0.08em]">Invite user</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div>
          <label className="admin-label" htmlFor="invite-email">Email</label>
          <input
            id="invite-email"
            type="email"
            className="admin-input mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="staff@example.com"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="invite-name">Full name (optional)</label>
          <input
            id="invite-name"
            className="admin-input mt-1"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Assessor"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="invite-role">Role</label>
          <select
            id="invite-role"
            className="admin-input mt-1"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-[11px] leading-5 text-slate-500">
        Creates the account immediately and generates a password-setup link you can share. No email is sent automatically.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className="admin-action text-xs"
          onClick={invite}
          disabled={busy || !email.trim().includes("@")}
        >
          {busy ? <Icons.Loader size={13} className="animate-spin" /> : "Create account"}
        </button>
        <button type="button" className="admin-action secondary text-xs" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
