"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/client-fetch";
import { toast } from "@/components/admin/AdminFeedback";
import { cn } from "@/lib/utils";
import * as Icons from "@/components/ui/Icons";
import type { QuizCalculatorSettings } from "@/components/layout/FormulaCalculatorProvider";

interface Props {
  quizId: string;
  initialSettingsJson?: string | null;
  onSaved?: () => void;
}

const DEFAULTS: QuizCalculatorSettings = {
  enabled: true,
  formulaScope: "all",
  showSteps: "always",
  recordUsage: false,
  defaultFormulaCode: null,
};

function parseSettings(json?: string | null): QuizCalculatorSettings {
  if (!json) return DEFAULTS;
  try { return { ...DEFAULTS, ...JSON.parse(json) }; } catch { return DEFAULTS; }
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <div className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={cn(
            "flex h-5 w-9 items-center rounded-full transition-colors",
            checked ? "bg-[#185FA5]" : "bg-slate-200"
          )}
        >
          <span
            className={cn(
              "ml-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
              checked ? "translate-x-4" : "translate-x-0"
            )}
          />
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
    </label>
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ value: T; label: string; description?: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all",
            value === opt.value
              ? "border-[#185FA5] bg-[#f0f7ff]"
              : "border-slate-200 bg-white hover:border-slate-300"
          )}
        >
          <input
            type="radio"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="mt-0.5 accent-[#185FA5]"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
            {opt.description && (
              <p className="mt-0.5 text-xs text-slate-500">{opt.description}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}

export function CalculatorAccessSettings({ quizId, initialSettingsJson, onSaved }: Props) {
  const [settings, setSettings] = useState<QuizCalculatorSettings>(
    () => parseSettings(initialSettingsJson)
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSettings(parseSettings(initialSettingsJson));
  }, [initialSettingsJson]);

  function patch(partial: Partial<QuizCalculatorSettings>) {
    setSettings((prev) => ({ ...prev, ...partial }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/quizzes/${quizId}/calculator-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calculatorSettingsJson: JSON.stringify(settings) }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast("success", "Calculator settings saved.");
      onSaved?.();
    } catch (e) {
      toast("error", `Could not save calculator settings: ${e}`);
    }
    setSaving(false);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <Toggle
          checked={settings.enabled}
          onChange={(v) => patch({ enabled: v })}
          label="Enable Calculator"
          description="Students can open the formula calculator during this quiz."
        />
      </div>

      {settings.enabled && (
        <>
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#185FA5]">
              Formula Scope
            </label>
            <SegmentedControl
              value={settings.formulaScope}
              onChange={(v) => patch({ formulaScope: v })}
              options={[
                { value: "all", label: "All formulas", description: "Students can access every formula in the library." },
                { value: "section", label: "Section-limited", description: "Restrict to specific sections (e.g. S1, S2)." },
                { value: "pick", label: "Hand-picked", description: "Allow only specific formula IDs." },
              ]}
            />
          </div>

          {settings.formulaScope === "section" && (
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#185FA5]">
                Allowed Section Codes
              </label>
              <input
                type="text"
                placeholder="e.g. S1, S2, S4"
                value={(settings.allowedSectionCodes ?? []).join(", ")}
                onChange={(e) =>
                  patch({
                    allowedSectionCodes: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#185FA5] focus:ring-2 focus:ring-[#E6F1FB]"
              />
              <p className="text-[11px] text-slate-400">Comma-separated section codes. Example: S1, S2</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#185FA5]">
              Step-by-Step Visibility
            </label>
            <SegmentedControl
              value={settings.showSteps}
              onChange={(v) => patch({ showSteps: v })}
              options={[
                { value: "always", label: "Always visible", description: "Steps shown automatically after each calculation." },
                { value: "after", label: "After calculation", description: "Steps expand after the student clicks Calculate." },
                { value: "never", label: "Hidden", description: "Students see only the final result — no steps shown." },
              ]}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#185FA5]">
              Default Formula <span className="font-normal text-slate-400 normal-case tracking-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. S1·F1 or S2F1"
              value={settings.defaultFormulaCode ?? ""}
              onChange={(e) => patch({ defaultFormulaCode: e.target.value.trim() || null })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm text-slate-800 outline-none focus:border-[#185FA5] focus:ring-2 focus:ring-[#E6F1FB]"
            />
            <p className="text-[11px] text-slate-400">
              Formula code to pre-select when students open the calculator. Leave blank to use the most recently used formula.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <Toggle
              checked={settings.recordUsage}
              onChange={(v) => patch({ recordUsage: v })}
              label="Record Calculator Usage"
              description="Track which formulas students use during this quiz (for future analytics)."
            />
          </div>
        </>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#134d88] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 disabled:opacity-50"
      >
        {saving ? "Saving…" : <><Icons.Check size={14} /> Save Calculator Settings</>}
      </button>
    </div>
  );
}
