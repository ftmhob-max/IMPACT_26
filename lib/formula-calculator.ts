// Back-end / front-end: formula calculator types and calcMetaJson parsing.
import { evalExpression } from "@/lib/admin/formula-eval";

export type InputType = "currency" | "percentage" | "number" | "ratio" | "integer";

export interface FormulaVariable {
  key: string;
  label: string;
  type: InputType;
  required: boolean;
  placeholder?: string;
  helperText?: string;
  unit?: string;
  min?: number;
  defaultValue?: number;
}

export interface FormulaOutput {
  key: string;
  label: string;
  type: InputType;
  unit?: string;
}

export interface WorkStep {
  label: string;
  expression: string;
  value?: number;
}

export interface FormulaCalculatorConfig {
  variables: FormulaVariable[];
  output: FormulaOutput;
  compute(vars: Record<string, number>): number | null;
  showWork?(vars: Record<string, number>, result: number): WorkStep[];
  explanation?: string;
}

export function normalizeCode(code: string): string {
  return code.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export function formatValue(value: number, type: InputType): string {
  if (!isFinite(value)) return "—";
  switch (type) {
    case "currency":
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
    case "percentage":
      return `${value.toFixed(4).replace(/\.?0+$/, "")}%`;
    case "ratio":
      return value.toFixed(4).replace(/\.?0+$/, "");
    case "integer":
      return Math.round(value).toString();
    default:
      return value.toFixed(4).replace(/\.?0+$/, "");
  }
}

export function parseFormulaCalculatorConfig(
  calcMetaJson: string | null | undefined,
): FormulaCalculatorConfig | null {
  if (!calcMetaJson) return null;
  try {
    const meta = JSON.parse(calcMetaJson) as {
      variables: FormulaCalculatorConfig["variables"];
      expression: string;
      output: FormulaCalculatorConfig["output"];
      explanation?: string;
    };
    return {
      variables: meta.variables,
      output: meta.output,
      explanation: meta.explanation,
      compute: (vars) => {
        try {
          return evalExpression(meta.expression, vars);
        } catch {
          return null;
        }
      },
    };
  } catch {
    return null;
  }
}

export function hasFormulaCalculatorConfig(formula: {
  calcMetaJson?: string | null;
}): boolean {
  return Boolean(parseFormulaCalculatorConfig(formula.calcMetaJson));
}
