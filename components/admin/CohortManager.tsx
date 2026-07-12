"use client";

// Front-end: Teacher Portal cohort management — create/rename/archive/delete
// cohorts and open a membership editor for a selected cohort. All writes go
// through the scoped /api/admin/cohorts endpoints.

import { useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { toast, confirmDialog } from "@/components/admin/AdminFeedback";
import { EmptyState } from "@/components/admin/EmptyState";
import { CohortMembershipEditor } from "@/components/admin/CohortMembershipEditor";
import type { CohortSummary } from "@/lib/admin/cohorts";

interface CohortManagerProps {
  initialCohorts: CohortSummary[];
  isAdmin: boolean;
}

export function CohortManager({ initialCohorts, isAdmin }: CohortManagerProps) {
  const [cohorts, setCohorts] = useState<CohortSummary[]>(initialCohorts);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Reload the scoped cohort list after a mutation so counts stay accurate.
  async function reload() {
    const res = await fetch("/api/admin/cohorts", { cache: "no-store" });
    if (res.ok) setCohorts((await res.json()).cohorts ?? []);
  }

  async function archiveToggle(cohort: CohortSummary) {
    setBusyId(cohort.id);
    const res = await fetch(`/api/admin/cohorts/${cohort.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: !cohort.archived }),
    });
    setBusyId(null);
    if (res.ok) {
      toast("success", cohort.archived ? "Cohort restored." : "Cohort archived.");
      void reload();
    } else {
      toast("error", "Unable to update cohort.");
    }
  }

  async function remove(cohort: CohortSummary) {
    const ok = await confirmDialog(
      `Delete "${cohort.name}"? This removes the cohort and its memberships. Learner accounts and their data are not affected.`,
      { danger: true, title: "Delete cohort", confirmLabel: "Delete" },
    );
    if (!ok) return;
    setBusyId(cohort.id);
    const res = await fetch(`/api/admin/cohorts/${cohort.id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) {
      toast("success", "Cohort deleted.");
      if (selectedId === cohort.id) setSelectedId(null);
      void reload();
    } else {
      toast("error", "Unable to delete cohort.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
          <Icons.Users size={18} className="shrink-0 text-[#185FA5]" />
          <h2 className="shrink-0 text-sm font-bold text-slate-900">Cohorts</h2>
          <span className="ml-auto shrink-0 text-xs text-slate-400">{cohorts.length} total</span>
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="admin-action flex shrink-0 items-center gap-1.5 text-xs"
          >
            <Icons.Plus size={13} />
            New cohort
          </button>
        </div>

        {showCreate && (
          <CreateCohortForm
            onCancel={() => setShowCreate(false)}
            onCreated={() => {
              setShowCreate(false);
              toast("success", "Cohort created.");
              void reload();
            }}
          />
        )}

        <div className="divide-y divide-slate-100">
          {cohorts.length === 0 ? (
            <EmptyState
              icon={<Icons.Users size={32} />}
              title="No cohorts yet."
              hint="Create your first cohort to group learners and scope analytics."
            />
          ) : (
            cohorts.map((cohort) => (
              <div
                key={cohort.id}
                className={cn(
                  "flex flex-col items-start gap-3 px-4 py-3 min-[420px]:grid min-[420px]:grid-cols-[1fr_auto] min-[420px]:items-center",
                  cohort.archived && "opacity-60",
                )}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-800">{cohort.name}</p>
                    {cohort.archived && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                        Archived
                      </span>
                    )}
                  </div>
                  {cohort.description && (
                    <p className="truncate text-xs text-slate-400">{cohort.description}</p>
                  )}
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    {cohort.memberCount} {cohort.memberCount === 1 ? "learner" : "learners"}
                    {" · "}
                    {cohort.instructorIds.length} co-instructor
                    {cohort.instructorIds.length === 1 ? "" : "s"}
                    {cohort.owner.fullName || cohort.owner.email
                      ? ` · Owner ${cohort.owner.fullName ?? cohort.owner.email}`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {busyId === cohort.id && (
                    <Icons.Loader size={13} className="animate-spin text-slate-400" />
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedId(selectedId === cohort.id ? null : cohort.id)}
                    className="admin-action secondary text-xs"
                  >
                    {selectedId === cohort.id ? "Close" : "Manage"}
                  </button>
                  <button
                    type="button"
                    onClick={() => archiveToggle(cohort)}
                    disabled={busyId === cohort.id}
                    className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-semibold text-slate-500 transition-colors hover:border-slate-300"
                  >
                    {cohort.archived ? "Restore" : "Archive"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(cohort)}
                    disabled={busyId === cohort.id}
                    className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-semibold text-slate-500 transition-colors hover:border-red-300 hover:text-red-600"
                    aria-label={`Delete ${cohort.name}`}
                  >
                    <Icons.Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedId && (
        <CohortMembershipEditor
          cohortId={selectedId}
          isAdmin={isAdmin}
          onChanged={() => void reload()}
        />
      )}
    </div>
  );
}

// ─── Create form ────────────────────────────────────────────────────────────

function CreateCohortForm({
  onCancel,
  onCreated,
}: {
  onCancel: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const res = await fetch("/api/admin/cohorts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined }),
    });
    setBusy(false);
    if (res.ok) onCreated();
    else {
      const err = await res.json().catch(() => ({}));
      toast("error", typeof err.error === "string" ? err.error : "Failed to create cohort.");
    }
  }

  return (
    <div className="space-y-3 border-b border-slate-100 bg-[#E6F1FB]/20 p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
        <div>
          <label className="admin-label" htmlFor="cohort-name">Cohort name</label>
          <input
            id="cohort-name"
            className="admin-input mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Spring 2026 Evening"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="cohort-desc">Description (optional)</label>
          <input
            id="cohort-desc"
            className="admin-input mt-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Cohort notes"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="admin-action text-xs"
          onClick={submit}
          disabled={busy || name.trim().length < 2}
        >
          {busy ? <Icons.Loader size={13} className="animate-spin" /> : "Create cohort"}
        </button>
        <button type="button" className="admin-action secondary text-xs" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
