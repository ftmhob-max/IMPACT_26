// Front-end document preference controller: components/theme/ThemeController.tsx
"use client";

import { useEffect } from "react";

const THEME_STORAGE_KEY = "impact26:theme";

// The persisted preference. "system" follows the operating-system setting live,
// while "light"/"dark" are explicit, sticky choices made by the learner.
export type ThemeMode = "light" | "dark" | "system";

// The concrete palette that is actually painted to the document at any moment.
export type ResolvedTheme = "light" | "dark";

// Browser chrome colors that back the dynamic <meta name="theme-color"> tag so
// the mobile status bar / address bar tracks the active surface color.
const THEME_COLOR_LIGHT = "#f0efe9";
const THEME_COLOR_DARK = "#0e141b";

/**
 * Reports whether the operating system currently prefers a dark color scheme.
 * Guards against server rendering where `window` is unavailable.
 */
export function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Resolves a stored preference down to the concrete palette to paint. "system"
 * is resolved against the live operating-system preference.
 */
export function resolveTheme(preference: ThemeMode): ResolvedTheme {
  if (preference === "system") {
    return getSystemPrefersDark() ? "dark" : "light";
  }
  return preference;
}

export function applyReducedMotion(reducedMotion: boolean) {
  document.documentElement.classList.toggle("reduced-motion", reducedMotion);
  document.documentElement.dataset.reducedMotion = reducedMotion ? "true" : "false";
}

/**
 * Keeps the <meta name="theme-color"> tag in sync with the resolved palette so
 * browser UI chrome matches the page background.
 */
function applyThemeColorMeta(resolved: ResolvedTheme) {
  if (typeof document === "undefined") return;
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = resolved === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
}

/**
 * Persists the learner preference and paints the resolved palette. The raw
 * preference (including "system") is stored, but the `dark` class is toggled
 * from the resolved value so the correct palette shows immediately.
 */
export function applyTheme(preference: ThemeMode) {
  const resolved = resolveTheme(preference);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
  applyThemeColorMeta(resolved);
  window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  window.dispatchEvent(new CustomEvent("impact26:theme-changed", { detail: preference }));
}

/**
 * Reads the persisted preference. Falls back to "system" so a first-time visitor
 * inherits their operating-system setting rather than a forced light theme.
 */
export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

export function ThemeController() {
  useEffect(() => {
    // Re-apply on mount so the document reflects the persisted preference and the
    // dynamic meta theme-color is created for the current palette.
    applyTheme(getStoredTheme());

    // While the learner preference is "system", follow live operating-system
    // changes (e.g. macOS auto dark at sunset) without requiring a reload.
    const mediaQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;

    function handleSystemPreferenceChange() {
      if (getStoredTheme() === "system") {
        applyTheme("system");
      }
    }

    mediaQuery?.addEventListener?.("change", handleSystemPreferenceChange);

    // Profile preferences are applied after hydration because authentication is
    // cookie-backed and cannot be read safely by the pre-hydration theme script.
    async function syncReducedMotionPreference() {
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });
        if (!response.ok) return;

        const payload: unknown = await response.json();
        if (
          typeof payload === "object" &&
          payload !== null &&
          "settings" in payload &&
          typeof payload.settings === "object" &&
          payload.settings !== null &&
          "reducedMotion" in payload.settings &&
          typeof payload.settings.reducedMotion === "boolean"
        ) {
          applyReducedMotion(payload.settings.reducedMotion);
        }
      } catch {
        // Keep the operating-system preference as the CSS fallback when profile
        // settings are unavailable (for example, on signed-out public routes).
      }
    }

    void syncReducedMotionPreference();
    window.addEventListener("impact26:profile-settings-updated", syncReducedMotionPreference);
    return () => {
      mediaQuery?.removeEventListener?.("change", handleSystemPreferenceChange);
      window.removeEventListener("impact26:profile-settings-updated", syncReducedMotionPreference);
    };
  }, []);

  return null;
}

export { THEME_STORAGE_KEY };
