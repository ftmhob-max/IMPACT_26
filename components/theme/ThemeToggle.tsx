// Front-end theme switcher: components/theme/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import * as Icons from "@/components/ui/Icons";
import { applyTheme, getStoredTheme, type ThemeMode } from "./ThemeController";

type ThemeToggleProps = {
  value?: ThemeMode;
  onChange?: (theme: ThemeMode) => void;
  compact?: boolean;
  presentation?: "sidebar" | "surface";
  className?: string;
};

// Ordered options power both the sidebar cycle and the settings segmented control.
const THEME_OPTIONS: { mode: ThemeMode; label: string; Icon: (props: { size?: number }) => React.ReactElement }[] = [
  { mode: "light", label: "Light", Icon: Icons.Sun },
  { mode: "dark", label: "Dark", Icon: Icons.Moon },
  { mode: "system", label: "System", Icon: Icons.Monitor },
];

function getOption(mode: ThemeMode) {
  return THEME_OPTIONS.find((option) => option.mode === mode) ?? THEME_OPTIONS[0];
}

export function ThemeToggle({ value, onChange, compact, presentation = "sidebar", className }: ThemeToggleProps) {
  // Local mirror of the persisted preference so the control stays correct even when
  // the parent does not supply a controlled `value` (e.g. the sidebar usage).
  const [localTheme, setLocalTheme] = useState<ThemeMode>("system");
  const theme = value ?? localTheme;

  useEffect(() => {
    setLocalTheme(getStoredTheme());

    // Stay in sync when any other surface changes the theme (event fired by applyTheme).
    function handleThemeChanged(event: Event) {
      const nextTheme = (event as CustomEvent<ThemeMode>).detail;
      if (nextTheme === "light" || nextTheme === "dark" || nextTheme === "system") {
        setLocalTheme(nextTheme);
      }
    }

    window.addEventListener("impact26:theme-changed", handleThemeChanged);
    return () => window.removeEventListener("impact26:theme-changed", handleThemeChanged);
  }, []);

  useEffect(() => {
    if (value) applyTheme(value);
  }, [value]);

  // Commit a preference either through the controlled callback or directly.
  function selectTheme(nextTheme: ThemeMode) {
    if (onChange) {
      onChange(nextTheme);
    } else {
      setLocalTheme(nextTheme);
      applyTheme(nextTheme);
    }
  }

  // The settings surface renders an explicit 3-way segmented control.
  if (presentation === "surface") {
    return (
      <div
        role="radiogroup"
        aria-label="Theme preference"
        className={cn(
          "inline-flex items-center gap-1 rounded-xl border border-[var(--impact-border)] bg-[var(--impact-surface-muted)] p-1",
          className
        )}
      >
        {THEME_OPTIONS.map(({ mode, label, Icon }) => {
          const isActive = theme === mode;
          return (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => selectTheme(mode)}
              title={`${label} theme`}
              className={cn(
                "learner-interactive flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors",
                isActive
                  ? "bg-[var(--impact-surface)] text-[var(--impact-blue)] shadow-[var(--shadow-sm)]"
                  : "text-[var(--impact-muted)] hover:text-[var(--impact-ink)]"
              )}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // The sidebar renders a single button that cycles Light -> Dark -> System.
  const current = getOption(theme);
  const currentIndex = THEME_OPTIONS.findIndex((option) => option.mode === theme);
  const nextOption = THEME_OPTIONS[(currentIndex + 1) % THEME_OPTIONS.length];
  const CurrentIcon = current.Icon;

  return (
    <button
      type="button"
      onClick={() => selectTheme(nextOption.mode)}
      aria-label={`Theme: ${current.label}. Switch to ${nextOption.label}.`}
      title={`Theme: ${current.label}. Switch to ${nextOption.label}.`}
      className={cn(
        "group flex items-center rounded-xl border text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "border-white/[0.10] bg-white/[0.06] text-[var(--sidebar-muted)] hover:border-white/[0.16] hover:bg-white/[0.11] hover:text-white focus-visible:ring-white focus-visible:ring-offset-[var(--sidebar-bg)]",
        compact ? "h-10 w-10 justify-center" : "w-full gap-3 px-3 py-2.5",
        className
      )}
    >
      <span className="theme-toggle-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] text-[#c8e0f4] transition-colors group-hover:bg-white/[0.13] group-hover:text-white">
        <CurrentIcon size={14} />
      </span>
      {!compact && <span>{current.label} mode</span>}
    </button>
  );
}
