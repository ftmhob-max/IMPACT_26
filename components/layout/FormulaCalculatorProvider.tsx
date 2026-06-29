"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  normalizeCode,
  formatValue,
  parseFormulaCalculatorConfig,
  type FormulaCalculatorConfig,
} from "@/lib/formula-calculator";

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface FormulaItem {
  id: string;
  code: string;
  name: string;
  expression: string;
  notes?: string | null;
  calcMetaJson?: string | null;
}

export interface FormulaSection {
  id: string;
  code: string;
  title: string;
  position: number;
  formulas: FormulaItem[];
}

export interface QuizCalculatorSettings {
  enabled: boolean;
  formulaScope: "all" | "section" | "pick";
  allowedSectionCodes?: string[];
  allowedFormulaIds?: string[];
  showSteps: "always" | "never" | "after";
  recordUsage: boolean;
  defaultFormulaCode?: string | null;
}

export interface CalculationHistoryEntry {
  id: string;
  timestamp: number;
  formulaCode: string;
  formulaName: string;
  expressionText: string;
  values: Record<string, string>;
  result: number | null;
  formattedResult: string;
  outputLabel: string;
}

// ─── Context shape ────────────────────────────────────────────────────────────

export interface FormulaCalcContextValue {
  sections: FormulaSection[];
  sectionsLoading: boolean;

  activeFormulaCode: string | null;
  activeFormula: FormulaItem | null;
  activeConfig: FormulaCalculatorConfig | null;

  isOpen: boolean;
  isMinimized: boolean;
  showSelectorPane: boolean;

  /** Per-formula entered values (persisted to sessionStorage) */
  getValues: (code: string) => Record<string, string>;
  setValues: (code: string, vals: Record<string, string>) => void;

  /** Per-formula last result */
  getResult: (code: string) => number | null;
  setResult: (code: string, result: number | null) => void;

  /** Calculation history (last 20 across all formulas) */
  history: CalculationHistoryEntry[];
  addToHistory: (entry: CalculationHistoryEntry) => void;
  clearHistory: () => void;

  /** Recently used formula codes */
  recentFormulaCodes: string[];

  open: (formulaCode?: string) => void;
  close: () => void;
  minimize: () => void;
  restore: () => void;
  switchFormula: (code: string) => void;
  toggleSelectorPane: () => void;

  calculatorSettings: QuizCalculatorSettings | null;
  isFormulaAllowed: (code: string, formulaId?: string) => boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const FormulaCalcContext = createContext<FormulaCalcContextValue | null>(null);

export function useFormulaCalc(): FormulaCalcContextValue {
  const ctx = useContext(FormulaCalcContext);
  if (!ctx) throw new Error("useFormulaCalc must be within FormulaCalculatorProvider");
  return ctx;
}

// ─── sessionStorage helpers ───────────────────────────────────────────────────

const SK = "impact_fcalc";

function ssRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = sessionStorage.getItem(`${SK}_${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function ssWrite(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try { sessionStorage.setItem(`${SK}_${key}`, JSON.stringify(value)); } catch { /* quota */ }
}

// ─── Config resolver ──────────────────────────────────────────────────────────

function resolveConfig(formula: FormulaItem | null): FormulaCalculatorConfig | null {
  if (!formula) return null;
  return parseFormulaCalculatorConfig(formula.calcMetaJson);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface ProviderProps {
  children: React.ReactNode;
  /** If provided (e.g. FormulaCompass page), no network fetch is needed */
  initialSections?: FormulaSection[];
  calculatorSettings?: QuizCalculatorSettings | null;
}

export function FormulaCalculatorProvider({
  children,
  initialSections,
  calculatorSettings = null,
}: ProviderProps) {
  // ── Formula sections ───────────────────────────────────────────────────────
  const [sections, setSections] = useState<FormulaSection[]>(initialSections ?? []);
  const [sectionsLoading, setSectionsLoading] = useState(!initialSections);

  useEffect(() => {
    if (initialSections) { setSections(initialSections); return; }
    setSectionsLoading(true);
    fetch("/api/quiz/formulas")
      .then((r) => r.ok ? r.json() : [])
      .then((data: FormulaSection[]) => setSections(data))
      .catch(() => {})
      .finally(() => setSectionsLoading(false));
  }, [initialSections]);

  // ── Active formula ────────────────────────────────────────────────────────
  const [activeFormulaCode, setActiveFormulaCode] = useState<string | null>(() =>
    ssRead<string | null>("activeCode", null)
  );

  const activeFormula = useMemo<FormulaItem | null>(() => {
    if (!activeFormulaCode) return null;
    const normalizedTarget = normalizeCode(activeFormulaCode);
    for (const s of sections) {
      // Try exact match first, then normalized (handles dots, case, etc.)
      const f =
        s.formulas.find((f) => f.code === activeFormulaCode) ??
        s.formulas.find((f) => normalizeCode(f.code) === normalizedTarget);
      if (f) return f;
    }
    return null;
  }, [activeFormulaCode, sections]);

  const activeConfig = useMemo(() => resolveConfig(activeFormula), [activeFormula]);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => ssRead<boolean>("minimized", false));
  const [showSelectorPane, setShowSelectorPane] = useState(false);

  // ── Per-formula values & results ──────────────────────────────────────────
  const [valuesMap, setValuesMap] = useState<Record<string, Record<string, string>>>(
    () => ssRead("values", {})
  );
  const [resultsMap, setResultsMap] = useState<Record<string, number | null>>(
    () => ssRead("results", {})
  );

  const getValues = useCallback((code: string) => valuesMap[code] ?? {}, [valuesMap]);
  const setValues = useCallback((code: string, vals: Record<string, string>) => {
    setValuesMap((prev) => {
      const next = { ...prev, [code]: vals };
      ssWrite("values", next);
      return next;
    });
  }, []);

  const getResult = useCallback((code: string) => resultsMap[code] ?? null, [resultsMap]);
  const setResult = useCallback((code: string, result: number | null) => {
    setResultsMap((prev) => {
      const next = { ...prev, [code]: result };
      ssWrite("results", next);
      return next;
    });
  }, []);

  // ── History ───────────────────────────────────────────────────────────────
  const [history, setHistory] = useState<CalculationHistoryEntry[]>(
    () => ssRead("history", [])
  );

  const addToHistory = useCallback((entry: CalculationHistoryEntry) => {
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 20);
      ssWrite("history", next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    ssWrite("history", []);
  }, []);

  // ── Recent formulas ───────────────────────────────────────────────────────
  const [recentFormulaCodes, setRecentFormulaCodes] = useState<string[]>(
    () => ssRead("recent", [])
  );

  const pushRecent = useCallback((code: string) => {
    setRecentFormulaCodes((prev) => {
      const filtered = prev.filter((c) => c !== code);
      const next = [code, ...filtered].slice(0, 5);
      ssWrite("recent", next);
      return next;
    });
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  const open = useCallback((formulaCode?: string) => {
    if (formulaCode) {
      setActiveFormulaCode(formulaCode);
      ssWrite("activeCode", formulaCode);
      pushRecent(formulaCode);
    }
    setIsOpen(true);
    setIsMinimized(false);
    ssWrite("minimized", false);
    setShowSelectorPane(false);
  }, [pushRecent]);

  const close = useCallback(() => {
    setIsOpen(false);
    setShowSelectorPane(false);
  }, []);

  const minimize = useCallback(() => {
    setIsMinimized(true);
    ssWrite("minimized", true);
  }, []);

  const restore = useCallback(() => {
    setIsMinimized(false);
    ssWrite("minimized", false);
  }, []);

  const switchFormula = useCallback((code: string) => {
    setActiveFormulaCode((prev) => {
      // Transfer values for matching variable keys
      if (prev) {
        const prevValues = ssRead<Record<string, Record<string, string>>>("values", {})[prev] ?? {};
        const existingNew = ssRead<Record<string, Record<string, string>>>("values", {})[code] ?? {};
        const merged = { ...existingNew, ...Object.fromEntries(
          Object.entries(prevValues).filter(([k]) => k in existingNew || Object.keys(existingNew).length === 0)
        )};
        // Only merge if there are matching keys
        if (Object.keys(merged).length > 0) {
          setValuesMap((vm) => {
            const next = { ...vm, [code]: merged };
            ssWrite("values", next);
            return next;
          });
        }
      }
      ssWrite("activeCode", code);
      return code;
    });
    pushRecent(code);
    setShowSelectorPane(false);
  }, [pushRecent]);

  const toggleSelectorPane = useCallback(() => {
    setShowSelectorPane((v) => !v);
  }, []);

  // ── Formula access control ────────────────────────────────────────────────
  const isFormulaAllowed = useCallback((code: string, formulaId?: string): boolean => {
    if (!calculatorSettings) return true;
    if (!calculatorSettings.enabled) return false;
    if (calculatorSettings.formulaScope === "all") return true;
    if (calculatorSettings.formulaScope === "section") {
      // code format: S1F1 — first two chars are section code
      const sectionCode = code.replace(/F\d+$/, "").replace(/[^A-Z0-9]/gi, "");
      return calculatorSettings.allowedSectionCodes?.some((sc) =>
        sectionCode.toUpperCase().startsWith(sc.toUpperCase())
      ) ?? false;
    }
    if (calculatorSettings.formulaScope === "pick") {
      return formulaId
        ? (calculatorSettings.allowedFormulaIds?.includes(formulaId) ?? false)
        : false;
    }
    return true;
  }, [calculatorSettings]);

  // ── Sync activeCode to sessionStorage when sections change ────────────────
  useEffect(() => {
    if (activeFormulaCode) ssWrite("activeCode", activeFormulaCode);
  }, [activeFormulaCode]);

  const value: FormulaCalcContextValue = {
    sections,
    sectionsLoading,
    activeFormulaCode,
    activeFormula,
    activeConfig,
    isOpen,
    isMinimized,
    showSelectorPane,
    getValues,
    setValues,
    getResult,
    setResult,
    history,
    addToHistory,
    clearHistory,
    recentFormulaCodes,
    open,
    close,
    minimize,
    restore,
    switchFormula,
    toggleSelectorPane,
    calculatorSettings,
    isFormulaAllowed,
  };

  return (
    <FormulaCalcContext.Provider value={value}>
      {children}
    </FormulaCalcContext.Provider>
  );
}
