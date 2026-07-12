"use client";

// Front-end: edit a single cohort — rename, manage learner members, and (admins
// only) assign co-instructors. Reuses the /api/admin/users list as the picker.

import { useEffect, useMemo, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { toast } from "@/components/admin/AdminFeedback";
import { EmptyState } from "@/components/admin/EmptyState";
import type { CohortDetail } from "@/lib/admin/cohorts";

interface DirectoryUser {
  id: string;
  email: string;
  fullName?: string | null;
  role: string;
}

interface CohortMembershipEditorProps {
  cohortId: string;
  isAdmin: boolean;
  onChanged: () => void;
}

export function CohortMembershipEditor({ cohortId, isAdmin, onChanged }: CohortMembershipEditorProps) {
  const [detail, setDetail] = useState<CohortDetail | null>(null);
  const [directory, setDirectory] = useState<DirectoryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadDetail() {
    setLoading(true);
    const [detailRes, usersRes] = await Promise.all([
      fetch(`/api/admin/cohorts/${cohortId}`, { cache: "no-store" }),
      fetch("/api/admin/users", { cache: "no-store" }),
    ]);
    if (detailRes.ok) {
      const data = (await detailRes.json()).cohort as CohortDetail;
      setDetail(data);
      setName(data.name);
    } else {
      toast("error", "Unable to load cohort.");
    }
    if (usersRes.ok) setDirectory((await usersRes.json()).users ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cohortId]);

  async function saveName() {
    if (!detail || name.trim().length < 2 || name.trim() === detail.name) return;
    setBusy(true);
    const res = await fetch(`/api/admin/cohorts/${cohortId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    setBusy(false);
    if (res.ok) {
      toast("success", "Cohort renamed.");
      void loadDetail();
      onChanged();
    } else {
      toast("error", "Unable to rename cohort.");
    }
  }

  async function mutateMember(userId: string, method: "POST" | "DELETE") {
    setBusy(true);
    const res = await fetch(`/api/admin/cohorts/${cohortId}/members`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setBusy(false);
    if (res.ok) {
      void loadDetail();
      onChanged();
    } else {
      toast("error", "Unable to update membership.");
    }
  }

  async function mutateInstructor(instructorId: string, method: "POST" | "DELETE") {
    setBusy(true);
    const res = await fetch(`/api/admin/cohorts/${cohortId}/instructors`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instructorId }),
    });
    setBusy(false);
    if (res.ok) {
      void loadDetail();
      onChanged();
    } else {
      const err = await res.json().catch(() => ({}));
      toast("error", typeof err.error === "string" ? err.error : "Unable to update instructor.");
    }
  }

  const memberIds = useMemo(() => new Set(detail?.members.map((m) => m.id) ?? []), [detail]);
  const instructorIds = useMemo(
    () => new Set(detail?.instructors.map((i) => i.id) ?? []),
    [detail],
  );

  if (loading) {
    return (
      <div className="space-y-3 rounded-xl border border-black/10 bg-white p-4 shadow-sm">
        <div className="admin-skeleton h-5 w-40" />
        <div className="admin-skeleton h-9 w-full" />
        <div className="admin-skeleton h-24 w-full" />
      </div>
    );
  }

  if (!detail) return null;

  return (
    <div className="space-y-4 rounded-xl border border-[#185FA5]/25 bg-white p-4 shadow-sm">
      {/* Rename */}
      <div>
        <label className="admin-label" htmlFor="cohort-rename">Cohort name</label>
        <div className="mt-1 flex gap-2">
          <input
            id="cohort-rename"
            className="admin-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="button"
            className="admin-action text-xs"
            onClick={saveName}
            disabled={busy || name.trim().length < 2 || name.trim() === detail.name}
          >
            Save
          </button>
        </div>
      </div>

      {/* Members */}
      <MemberPicker
        label="Learners"
        emptyTitle="No learners in this cohort yet."
        currentIds={memberIds}
        directory={directory}
        assigned={detail.members.map((m) => ({ id: m.id, email: m.email, fullName: m.fullName, role: m.role }))}
        onAdd={(userId) => mutateMember(userId, "POST")}
        onRemove={(userId) => mutateMember(userId, "DELETE")}
        busy={busy}
      />

      {/* Co-instructors (admin only) */}
      {isAdmin ? (
        <MemberPicker
          label="Co-instructors"
          emptyTitle="No co-instructors assigned."
          hint="Only instructor and admin accounts can be assigned."
          currentIds={instructorIds}
          directory={directory.filter((u) => u.role === "instructor" || u.role === "admin")}
          assigned={detail.instructors.map((i) => ({ id: i.id, email: i.email, fullName: i.fullName, role: i.role }))}
          onAdd={(userId) => mutateInstructor(userId, "POST")}
          onRemove={(userId) => mutateInstructor(userId, "DELETE")}
          busy={busy}
        />
      ) : (
        <p className="text-[11px] text-slate-400">
          Co-instructor assignment is managed by administrators.
        </p>
      )}
    </div>
  );
}

// ─── Reusable member/instructor picker ────────────────────────────────────────

interface AssignedRow {
  id: string;
  email: string;
  fullName?: string | null;
  role: string;
}

function MemberPicker({
  label,
  emptyTitle,
  hint,
  currentIds,
  directory,
  assigned,
  onAdd,
  onRemove,
  busy,
}: {
  label: string;
  emptyTitle: string;
  hint?: string;
  currentIds: Set<string>;
  directory: DirectoryUser[];
  assigned: AssignedRow[];
  onAdd: (userId: string) => void;
  onRemove: (userId: string) => void;
  busy: boolean;
}) {
  const [search, setSearch] = useState("");

  const candidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    return directory
      .filter((u) => !currentIds.has(u.id))
      .filter(
        (u) =>
          !query ||
          u.email.toLowerCase().includes(query) ||
          (u.fullName ?? "").toLowerCase().includes(query),
      )
      .slice(0, 8);
  }, [directory, currentIds, search]);

  return (
    <div className="rounded-lg border border-slate-100 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-600">{label}</p>
        <span className="text-[10px] text-slate-400">{assigned.length}</span>
      </div>

      {/* Search + add */}
      <div className="relative">
        <Icons.Search
          size={13}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          className="admin-input !pl-7 py-1.5 text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search to add ${label.toLowerCase()}…`}
        />
      </div>
      {hint && <p className="mt-1 text-[10px] text-slate-400">{hint}</p>}
      {search.trim() && candidates.length > 0 && (
        <div className="mt-2 divide-y divide-slate-50 rounded-md border border-slate-100">
          {candidates.map((u) => (
            <button
              key={u.id}
              type="button"
              disabled={busy}
              onClick={() => {
                onAdd(u.id);
                setSearch("");
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-slate-50"
            >
              <span className="min-w-0 truncate">
                {u.fullName ?? u.email}
                {u.fullName && <span className="ml-1 text-slate-400">{u.email}</span>}
              </span>
              <Icons.Plus size={13} className="shrink-0 text-[#185FA5]" />
            </button>
          ))}
        </div>
      )}

      {/* Assigned list */}
      <div className="mt-3 space-y-1.5">
        {assigned.length === 0 ? (
          <EmptyState title={emptyTitle} />
        ) : (
          assigned.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-1.5"
            >
              <span className="min-w-0 truncate text-xs text-slate-700">
                {row.fullName ?? row.email}
                {row.fullName && <span className="ml-1 text-slate-400">{row.email}</span>}
              </span>
              <button
                type="button"
                disabled={busy}
                onClick={() => onRemove(row.id)}
                className="shrink-0 rounded p-1 text-slate-400 transition-colors hover:text-red-600"
                aria-label={`Remove ${row.email}`}
              >
                <Icons.X size={13} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
