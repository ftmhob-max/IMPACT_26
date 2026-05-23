"use client";

import { useEffect, useMemo, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn, DIFFICULTIES, DOMAINS } from "@/lib/utils";
import { useDomains } from "@/lib/hooks/useDomains";
import {
  type QuestionBankCandidate,
  type QuestionBankContext,
  type QuestionBankFilters,
  type QuestionBankSort,
} from "@/lib/admin/question-bank";

const QUESTION_TYPES = [
  { value: "", label: "All types" },
  { value: "multiple_choice", label: "Multiple choice" },
  { value: "scenario", label: "Scenario" },
];

const STATUSES = ["draft", "review", "published", "archived"] as const;

const DEFAULT_FILTERS: QuestionBankFilters = {
  search: "",
  domains: [],
  difficulty: "",
  status: "",
  questionType: "",
  usageCurrentQuiz: true,
  usageCurrentModule: true,
  usageOtherQuizzes: true,
  onlyModuleRelevant: false,
  onlyMultiselect: false,
  sort: "best-match",
};

const SORT_OPTIONS: Array<{ value: QuestionBankSort; label: string }> = [
  { value: "best-match", label: "Best match" },
  { value: "newest", label: "Newest" },
  { value: "domain", label: "Domain" },
  { value: "difficulty", label: "Difficulty" },
  { value: "most-used", label: "Most used" },
  { value: "least-used", label: "Least used" },
  { value: "unused-first", label: "Unused first" },
];

export function QuestionBankPicker({
  quizId,
  onAdd,
  onClose,
}: {
  quizId: string;
  onAdd: (ids: string[]) => Promise<void>;
  onClose: () => void;
}) {
  const [filters, setFilters] = useState<QuestionBankFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [context, setContext] = useState<QuestionBankContext | null>(null);
  const [candidates, setCandidates] = useState<QuestionBankCandidate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { domains: allDomains, addDomain } = useDomains();
  const [addingDomain, setAddingDomain] = useState(false);
  const [newDomainName, setNewDomainName] = useState("");
  const [addDomainBusy, setAddDomainBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        quizId,
        search: filters.search,
        domains: filters.domains.join(","),
        difficulty: filters.difficulty,
        status: filters.status,
        questionType: filters.questionType,
        usageCurrentQuiz: String(filters.usageCurrentQuiz),
        usageCurrentModule: String(filters.usageCurrentModule),
        usageOtherQuizzes: String(filters.usageOtherQuizzes),
        onlyModuleRelevant: String(filters.onlyModuleRelevant),
        onlyMultiselect: String(filters.onlyMultiselect),
        sort: filters.sort,
      });
      const res = await fetch(`/api/admin/quizzes/question-bank?${params.toString()}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (cancelled) return;
      if (res.ok) {
        setContext(data.context ?? null);
        setCandidates(data.candidates ?? []);
      } else {
        setError(data.error ?? "Could not load question bank.");
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [quizId, filters]);

  const availableCandidates = useMemo(
    () => candidates.filter((candidate) => !candidate.inCurrentQuiz),
    [candidates]
  );

  const allSelected =
    availableCandidates.length > 0 &&
    availableCandidates.every((candidate) => selected.has(candidate.id));

  function toggleSelection(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleDomain(domain: string) {
    setSelected(new Set());
    setFilters((prev) => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter((value) => value !== domain)
        : [...prev.domains, domain],
    }));
  }

  function toggleAll() {
    setSelected((prev) => {
      if (allSelected) return new Set();
      return new Set(availableCandidates.map((candidate) => candidate.id));
    });
  }

  function resetFilters() {
    setSelected(new Set());
    setFilters(DEFAULT_FILTERS);
  }

  async function handleAddNewDomain() {
    const name = newDomainName.trim();
    if (!name) return;
    setAddDomainBusy(true);
    const ok = await addDomain(name);
    setAddDomainBusy(false);
    if (ok) {
      toggleDomain(name);
      setNewDomainName("");
      setAddingDomain(false);
    }
  }

  async function handleAdd() {
    if (selected.size === 0) return;
    setBusy(true);
    await onAdd([...selected]);
    setBusy(false);
    setSelected(new Set());
  }

  const hiddenByUsage =
    (!filters.usageCurrentQuiz || !filters.usageCurrentModule || !filters.usageOtherQuizzes) &&
    candidates.length === 0;

  return (
    <div className="rounded-xl border border-[#185FA5]/20 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icons.Search size={14} className="text-[#185FA5]" />
            <span className="text-sm font-bold text-slate-900">Add from question bank</span>
            <span className="text-xs text-slate-400">{candidates.length} results</span>
          </div>
          {context?.moduleTitle && (
            <p className="mt-1 text-[11px] text-slate-500">
              Matching against module <span className="font-semibold text-slate-700">{context.moduleTitle}</span>
            </p>
          )}
        </div>
        <button type="button" onClick={onClose} className="rounded p-1 text-slate-400 hover:text-slate-700">
          <Icons.X size={15} />
        </button>
      </div>

      <div className="space-y-3 border-b border-slate-100 bg-white px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            placeholder="Search questions, tags, or formula refs…"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="admin-input min-w-56 flex-1 text-xs"
            autoFocus
          />
          <select
            className="admin-input w-36 text-xs"
            value={filters.sort}
            onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value as QuestionBankSort }))}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button type="button" onClick={resetFilters} className="admin-action secondary text-xs">
            Reset filters
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {allDomains.map((key) => {
            const active = filters.domains.includes(key);
            const label = DOMAINS[key as keyof typeof DOMAINS]?.label ?? key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleDomain(key)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                  active
                    ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {label}
              </button>
            );
          })}
          {addingDomain ? (
            <form
              className="flex items-center gap-1"
              onSubmit={(e) => { e.preventDefault(); handleAddNewDomain(); }}
            >
              <input
                autoFocus
                value={newDomainName}
                onChange={(e) => setNewDomainName(e.target.value)}
                className="h-[26px] w-28 rounded-full border border-[#185FA5] px-2.5 text-[11px] font-semibold outline-none"
                placeholder="new-domain"
              />
              <button
                type="submit"
                disabled={addDomainBusy}
                className="rounded-full bg-[#185FA5] px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-60"
              >
                {addDomainBusy ? "…" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => { setAddingDomain(false); setNewDomainName(""); }}
                className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setAddingDomain(true)}
              className="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:border-[#185FA5] hover:text-[#185FA5] transition-colors"
            >
              + Add domain
            </button>
          )}
        </div>

        <div className="grid gap-2 md:grid-cols-4">
          <select
            className="admin-input text-xs"
            value={filters.difficulty}
            onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value }))}
          >
            <option value="">All difficulties</option>
            {Object.entries(DIFFICULTIES).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
          <select
            className="admin-input text-xs"
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            className="admin-input text-xs"
            value={filters.questionType}
            onChange={(e) => setFilters((prev) => ({ ...prev, questionType: e.target.value }))}
          >
            {QUESTION_TYPES.map((option) => (
              <option key={option.label} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select
            className="admin-input text-xs"
            value={
              filters.onlyModuleRelevant
                ? "only-relevant"
                : context?.moduleTitle && filters.domains.length === 0 && filters.search === "" && filters.sort === "best-match"
                  ? "best-match"
                  : "all"
            }
            onChange={(e) => {
              const value = e.target.value;
              setFilters((prev) => ({
                ...prev,
                onlyModuleRelevant: value === "only-relevant",
                sort: value === "best-match" ? "best-match" : prev.sort,
              }));
            }}
          >
            <option value="all">All relevance</option>
            <option value="best-match">Best match first</option>
            <option value="only-relevant">Only module-relevant</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <UsageToggle
            checked={filters.usageCurrentQuiz}
            label="Show current quiz"
            onChange={(checked) => setFilters((prev) => ({ ...prev, usageCurrentQuiz: checked }))}
          />
          <UsageToggle
            checked={filters.usageCurrentModule}
            label="Show current module"
            onChange={(checked) => setFilters((prev) => ({ ...prev, usageCurrentModule: checked }))}
          />
          <UsageToggle
            checked={filters.usageOtherQuizzes}
            label="Show other tests"
            onChange={(checked) => setFilters((prev) => ({ ...prev, usageOtherQuizzes: checked }))}
          />
          <UsageToggle
            checked={filters.onlyMultiselect}
            label="Only multiselect"
            onChange={(checked) => setFilters((prev) => ({ ...prev, onlyMultiselect: checked }))}
          />
        </div>
      </div>

      <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-500">
        <span className="font-semibold text-slate-700">{selected.size}</span> selected
        <span className="mx-2">·</span>
        <span>{availableCandidates.length} addable</span>
        {context?.moduleTitle && (
          <>
            <span className="mx-2">·</span>
            <span>{context.siblingQuizIds.length} quiz{context.siblingQuizIds.length !== 1 ? "zes" : ""} in module context</span>
          </>
        )}
      </div>

      <div className="max-h-[30rem] overflow-y-auto bg-white">
        {loading ? (
          <div className="flex items-center gap-2 px-4 py-8 text-sm text-slate-400">
            <Icons.Loader size={14} className="animate-spin" />
            Loading question bank…
          </div>
        ) : error ? (
          <div className="px-4 py-8 text-center text-sm text-red-600">{error}</div>
        ) : candidates.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-400">
            {hiddenByUsage ? "No questions remain after the current usage filters." : "No questions match the current filters."}
          </div>
        ) : (
          <>
            <label className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="h-4 w-4 rounded border-slate-300 text-[#185FA5]"
              />
              Select all addable questions
            </label>
            <div className="divide-y divide-slate-100">
              {candidates.map((candidate) => {
                const disabled = candidate.inCurrentQuiz;
                return (
                  <label
                    key={candidate.id}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 transition-colors",
                      disabled ? "bg-slate-50/80" : "cursor-pointer hover:bg-slate-50"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(candidate.id)}
                      disabled={disabled}
                      onChange={(e) => toggleSelection(candidate.id, e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-[#185FA5] disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="min-w-0 flex-1 text-sm leading-relaxed text-slate-800">{candidate.questionText}</p>
                        <div className="flex flex-wrap items-center gap-1">
                          <DomainBadge domain={candidate.domain} />
                          <DifficultyBadge difficulty={candidate.difficulty} />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {candidate.inCurrentQuiz && <UsageChip tone="slate" label="Already in this quiz" />}
                        {candidate.usedInCurrentModule && <UsageChip tone="amber" label="Already in this module" />}
                        {candidate.usedInOtherQuizzes && (
                          <UsageChip
                            tone="blue"
                            label={`Used in ${candidate.usageCount} test${candidate.usageCount !== 1 ? "s" : ""}`}
                          />
                        )}
                        {candidate.matchesModuleDomain && <UsageChip tone="emerald" label="Matches module domain" />}
                        {candidate.matchesModuleTags && <UsageChip tone="purple" label="Matches module tags" />}
                        {candidate.isMultiselect && <UsageChip tone="rose" label="Multiselect" />}
                      </div>

                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                        {candidate.formulaRef && <span>Formula: <span className="font-mono text-slate-700">{candidate.formulaRef}</span></span>}
                        {candidate.topicTags && <span>Tags: {formatTopicTags(candidate.topicTags)}</span>}
                        <span>Status: <span className="capitalize text-slate-700">{candidate.status}</span></span>
                        <span>Used {candidate.usageCount} time{candidate.usageCount !== 1 ? "s" : ""}</span>
                      </div>

                      {(candidate.quizTitles.length > 0 || candidate.moduleTitles.length > 0) && (
                        <div className="text-[11px] text-slate-400">
                          {candidate.moduleTitles.length > 0 && (
                            <span>Modules: {candidate.moduleTitles.slice(0, 2).join(", ")}{candidate.moduleTitles.length > 2 ? "…" : ""}</span>
                          )}
                          {candidate.quizTitles.length > 0 && (
                            <span className={candidate.moduleTitles.length > 0 ? "ml-3" : ""}>
                              Quizzes: {candidate.quizTitles.slice(0, 2).join(", ")}{candidate.quizTitles.length > 2 ? "…" : ""}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-white px-4 py-3">
        <p className="text-xs text-slate-500">
          Questions already in this quiz stay visible for reference but cannot be added again.
        </p>
        <button
          type="button"
          onClick={handleAdd}
          disabled={busy || selected.size === 0}
          className="admin-action text-xs flex items-center gap-1.5"
        >
          {busy ? <Icons.Loader size={12} className="animate-spin" /> : <Icons.Plus size={12} />}
          Add {selected.size || ""} question{selected.size !== 1 ? "s" : ""}
        </button>
      </div>
    </div>
  );
}

function formatTopicTags(topicTags: string) {
  try {
    const parsed = JSON.parse(topicTags) as string[];
    return parsed.slice(0, 3).join(", ");
  } catch {
    return topicTags;
  }
}

function UsageToggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-slate-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-[#185FA5]"
      />
      {label}
    </label>
  );
}

function UsageChip({ label, tone }: { label: string; tone: "slate" | "amber" | "blue" | "emerald" | "purple" | "rose" }) {
  const toneClasses: Record<string, string> = {
    slate: "bg-slate-100 text-slate-600",
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
    emerald: "bg-emerald-100 text-emerald-700",
    purple: "bg-purple-100 text-purple-700",
    rose: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", toneClasses[tone])}>
      {label}
    </span>
  );
}

function DomainBadge({ domain }: { domain: string }) {
  const domainConfig = DOMAINS[domain as keyof typeof DOMAINS];
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
      {domainConfig?.label ?? domain}
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const map: Record<string, string> = {
    easy: "bg-green-50 text-green-700",
    proficient: "bg-yellow-50 text-yellow-700",
    expert: "bg-red-50 text-red-700",
  };
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", map[difficulty] ?? "bg-slate-100 text-slate-500")}>{difficulty}</span>;
}

