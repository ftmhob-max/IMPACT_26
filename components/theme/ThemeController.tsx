"use client";

import { useEffect } from "react";

const THEME_STORAGE_KEY = "impact26:theme";

export type ThemeMode = "light" | "dark";

export function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent("impact26:theme-changed", { detail: theme }));
}

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

export function ThemeController() {
  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  return null;
}

export { THEME_STORAGE_KEY };
