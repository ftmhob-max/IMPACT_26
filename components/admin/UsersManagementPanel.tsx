"use client";

import { useEffect, useState } from "react";
import * as Icons from "@/components/ui/Icons";

interface User {
  id: string;
  email: string;
  fullName?: string | null;
  role: string;
  createdAt: string;
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
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    if (res.ok) setUsers((await res.json()).users ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateRole(userId: string, role: string) {
    setSaving(userId);
    setNotice(null);
    const res = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    setSaving(null);
    if (res.ok) {
      setNotice("Role updated.");
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
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
      <div className="grid gap-3 sm:grid-cols-4">
        {ROLES.map((r) => (
          <div key={r} className="rounded-lg border border-black/10 bg-white px-3 py-2.5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{r}</p>
            <p className="mt-0.5 text-2xl font-extrabold tabular-nums text-slate-900">{roleCounts[r] ?? 0}</p>
          </div>
        ))}
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
          <Icons.Check size={13} />
          {notice}
        </div>
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
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">
              {filter ? "No users match that search." : "No users found."}
            </p>
          ) : (
            filtered.map((user) => (
              <div key={user.id} className="flex flex-col items-start gap-3 px-4 py-3 min-[380px]:grid min-[380px]:grid-cols-[1fr_auto] min-[380px]:items-center">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {user.fullName ?? user.email}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROLE_BADGE[user.role as Role] ?? "bg-slate-100 text-slate-600"}`}>
                      {user.role}
                    </span>
                  </div>
                  {user.fullName && (
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {saving === user.id && <Icons.Loader size={13} className="animate-spin text-slate-400" />}
                  <select
                    className="admin-input py-1 text-xs w-28"
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    disabled={saving === user.id}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
