"use client";

import { useCallback, useState } from "react";
import {
  formatValue,
  type FormulaCalculatorConfig,
  type FormulaVariable,
  type WorkStep,
} from "@/lib/formula-calculator";

function parseNum(raw: string, fallback?: number): number {
  const n = parseFloat(raw);
  return isNaN(n) ? (fallback ?? NaN) : n;
}

export interface CalcEngineResult {
  value: number;
  formatted: string;
  workSteps: WorkStep[] | null;
}

export interface CalcEngineState {
  values: Record<string, string>;
  errors: Record<string, string>;
  result: CalcEngineResult | null;
  calcError: string | null;
  hasCalculated: boolean;
  isDirty: boolean;

  handleChange: (key: string, value: string) => void;
  handleBlurValidate: (key: string) => void;
  handleCalculate: () => CalcEngineResult | null;
  handleReset: () => void;
  handleCopy: () => Promise<void>;
  copyState: "idle" | "copied";
}

/**
 * Encapsulates all calculation logic for a single formula config.
 * UI components consume this hook rather than reimplementing the logic.
 */
export function useFormulaCalculationEngine(
  config: FormulaCalculatorConfig | null,
  initialValues?: Record<string, string>
): CalcEngineState {
  const [values, setValues] = useState<Record<string, string>>(initialValues ?? {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CalcEngineResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const validateField = useCallback(
    (variable: FormulaVariable, raw: string): string | null => {
      if (raw.trim() === "") {
        return variable.required ? "This field is required." : null;
      }
      const n = parseNum(raw, variable.defaultValue);
      if (isNaN(n)) return "Enter a valid number.";
      if (variable.min !== undefined && n < variable.min)
        return `Must be at least ${variable.min}.`;
      return null;
    },
    []
  );

  const handleChange = useCallback((key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setIsDirty(true);
  }, []);

  const handleBlurValidate = useCallback(
    (key: string) => {
      if (!config) return;
      const variable = config.variables.find((v) => v.key === key);
      if (!variable) return;
      const raw = values[key] ?? "";
      const err = validateField(variable, raw);
      setErrors((prev) =>
        err ? { ...prev, [key]: err } : (() => { const n = { ...prev }; delete n[key]; return n; })()
      );
    },
    [config, values, validateField]
  );

  const handleCalculate = useCallback((): CalcEngineResult | null => {
    if (!config) return null;

    const nextErrors: Record<string, string> = {};
    const numVars: Record<string, number> = {};

    for (const variable of config.variables) {
      const raw = values[variable.key] ?? "";
      if (raw.trim() === "") {
        if (variable.required) {
          nextErrors[variable.key] = "This field is required.";
        } else {
          numVars[variable.key] = variable.defaultValue ?? 0;
        }
        continue;
      }
      const n = parseNum(raw, variable.defaultValue);
      if (isNaN(n)) { nextErrors[variable.key] = "Enter a valid number."; continue; }
      if (variable.min !== undefined && n < variable.min) {
        nextErrors[variable.key] = `Must be at least ${variable.min}.`; continue;
      }
      numVars[variable.key] = n;
    }

    setErrors(nextErrors);
    setHasCalculated(true);
    setIsDirty(false);

    if (Object.keys(nextErrors).length > 0) {
      setResult(null);
      setCalcError(null);
      return null;
    }

    const computed = config.compute(numVars);
    if (computed === null || !isFinite(computed)) {
      setResult(null);
      setCalcError("Cannot compute — check for division by zero or invalid inputs.");
      return null;
    }

    const workSteps = config.showWork ? config.showWork(numVars, computed) : null;
    const engineResult: CalcEngineResult = {
      value: computed,
      formatted: formatValue(computed, config.output.type),
      workSteps,
    };

    setResult(engineResult);
    setCalcError(null);
    return engineResult;
  }, [config, values]);

  const handleReset = useCallback(() => {
    setValues({});
    setErrors({});
    setResult(null);
    setCalcError(null);
    setHasCalculated(false);
    setIsDirty(false);
    setCopyState("idle");
  }, []);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.formatted);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch { /* clipboard not available */ }
  }, [result]);

  return {
    values,
    errors,
    result,
    calcError,
    hasCalculated,
    isDirty,
    handleChange,
    handleBlurValidate,
    handleCalculate,
    handleReset,
    handleCopy,
    copyState,
  };
}
