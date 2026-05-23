"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import * as Icons from "@/components/ui/Icons";
import { applyTheme, getStoredTheme, type ThemeMode } from "./ThemeController";

type ThemeToggleProps = {
  value?: ThemeMode;
  onChange?: (theme: ThemeMode) => void;
  compact?: boolean;
  className?: string;
};

export function ThemeToggle({ value, onChange, compact, className }: ThemeToggleProps) {
  const [localTheme, setLocalTheme] = useState<ThemeMode>("light");
  const theme = value ?? localTheme;
  const isDark = theme === "dark";

  useEffect(() => {
    setLocalTheme(getStoredTheme());

    function handleThemeChanged(event: Event) {
      const nextTheme = (event as CustomEvent<ThemeMode>).detail;
      if (nextTheme === "light" || nextTheme === "dark") {
        setLocalTheme(nextTheme);
      }
    }

    window.addEventListener("impact26:theme-changed", handleThemeChanged);
    return () => window.removeEventListener("impact26:theme-changed", handleThemeChanged);
  }, []);

  useEffect(() => {
    if (value) applyTheme(value);
  }, [value]);

  function toggleTheme() {
    const nextTheme: ThemeMode = isDark ? "light" : "dark";
    if (onChange) {
      onChange(nextTheme);
    } else {
      setLocalTheme(nextTheme);
      applyTheme(nextTheme);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group flex items-center rounded-xl border border-white/[0.10] bg-white/[0.06] text-sm font-semibold text-[var(--sidebar-muted)] transition-all duration-150 hover:border-white/[0.16] hover:bg-white/[0.11] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar-bg)]",
        compact ? "h-10 w-10 justify-center" : "w-full gap-3 px-3 py-2.5",
        className
      )}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] text-[#c8e0f4] transition-colors group-hover:bg-white/[0.13] group-hover:text-white">
        {isDark ? <Icons.Sun size={14} /> : <Icons.Moon size={14} />}
      </span>
      {!compact && <span>{isDark ? "Light mode" : "Dark mode"}</span>}
    </button>
  );
}
