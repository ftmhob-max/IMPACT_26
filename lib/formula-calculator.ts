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

function normalizeCode(code: string): string {
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

const CONFIGS: Record<string, FormulaCalculatorConfig> = {
  // ── S1 · Sales Comparison & Regression ──────────────────────────────────────

  S1F1: {
    variables: [
      { key: "sale", label: "Sale Price", type: "currency", required: true, placeholder: "250000", helperText: "The comparable sale price to trend forward" },
      { key: "rate", label: "Monthly Rate (r)", type: "percentage", required: true, placeholder: "0.5", helperText: "Monthly market change rate, e.g. 0.5 for 0.5%" },
      { key: "periods", label: "Number of Months (n)", type: "integer", required: true, placeholder: "12", helperText: "Months between sale date and valuation date", min: 0 },
    ],
    output: { key: "adjusted", label: "Adjusted Sale Price", type: "currency" },
    compute: ({ sale, rate, periods }) => sale * Math.pow(1 + rate / 100, periods),
    showWork: ({ sale, rate, periods }, result) => {
      const r = rate / 100;
      const factor = Math.pow(1 + r, periods);
      return [
        { label: "Rate as decimal", expression: `${rate}% ÷ 100`, value: r },
        { label: "Growth factor (1 + r)^n", expression: `(1 + ${r})^${periods}`, value: factor },
        { label: "Adjusted Sale Price", expression: `$${sale.toLocaleString()} × ${factor.toFixed(6)}`, value: result },
      ];
    },
    explanation: "Trends a comparable sale price forward to the valuation date using a monthly market change rate. Use when older sales need to be adjusted upward (or downward) to reflect current market conditions.",
  },

  S1F2: {
    variables: [
      { key: "sale", label: "Sale Price", type: "currency", required: true, placeholder: "275000", helperText: "The sale price to trend backward" },
      { key: "rate", label: "Monthly Rate (r)", type: "percentage", required: true, placeholder: "0.5", helperText: "Monthly market change rate, e.g. 0.5 for 0.5%" },
      { key: "periods", label: "Number of Months (n)", type: "integer", required: true, placeholder: "12", helperText: "Months to trend back", min: 0 },
    ],
    output: { key: "backTrended", label: "Back-Trended Sale Price", type: "currency" },
    compute: ({ sale, rate, periods }) => sale / Math.pow(1 + rate / 100, periods),
    showWork: ({ sale, rate, periods }, result) => {
      const r = rate / 100;
      const factor = Math.pow(1 + r, periods);
      return [
        { label: "Rate as decimal", expression: `${rate}% ÷ 100`, value: r },
        { label: "Divisor (1 + r)^n", expression: `(1 + ${r})^${periods}`, value: factor },
        { label: "Back-Trended Price", expression: `$${sale.toLocaleString()} ÷ ${factor.toFixed(6)}`, value: result },
      ];
    },
    explanation: "Removes market appreciation from a sale price to bring it back to an earlier effective date. The inverse of trending forward.",
  },

  S1F3: {
    variables: [
      { key: "annualRate", label: "Annual Rate (r_yr)", type: "percentage", required: true, placeholder: "6", helperText: "Annual market change rate, e.g. 6 for 6% per year" },
    ],
    output: { key: "monthlyRate", label: "Monthly Rate (r_mo)", type: "percentage" },
    compute: ({ annualRate }) => (Math.pow(1 + annualRate / 100, 1 / 12) - 1) * 100,
    showWork: ({ annualRate }, result) => {
      const annual = annualRate / 100;
      const monthlyFactor = Math.pow(1 + annual, 1 / 12);
      return [
        { label: "Annual rate as decimal", expression: `${annualRate}% ÷ 100`, value: annual },
        { label: "Monthly growth factor", expression: `(1 + ${annual})^(1/12)`, value: monthlyFactor },
        { label: "Monthly rate (decimal)", expression: `${monthlyFactor.toFixed(8)} − 1`, value: monthlyFactor - 1 },
        { label: "Monthly rate (percent)", expression: `× 100`, value: result },
      ];
    },
    explanation: "Converts an annual market change rate into its true compounding monthly equivalent. Simply dividing by 12 ignores compounding and will overstate the monthly rate.",
  },

  S1F4: {
    variables: [
      { key: "av", label: "Assessed Value (AV)", type: "currency", required: true, placeholder: "200000" },
      { key: "salePrice", label: "Sale Price", type: "currency", required: true, placeholder: "250000" },
    ],
    output: { key: "ratio", label: "Assessment Ratio", type: "ratio" },
    compute: ({ av, salePrice }) => (salePrice === 0 ? null : av / salePrice),
    showWork: ({ av, salePrice }, result) => [
      { label: "Assessment Ratio", expression: `$${av.toLocaleString()} ÷ $${salePrice.toLocaleString()}`, value: result },
    ],
    explanation: "Measures how closely an assessment tracks market value. A ratio of 1.00 means perfectly assessed; below 1.00 means under-assessed; above means over-assessed.",
  },

  S1F5: {
    variables: [
      { key: "deltaPrice", label: "Price Difference (ΔPrice)", type: "currency", required: true, placeholder: "15000", helperText: "Sale price of property with the feature minus price without it" },
      { key: "deltaFeature", label: "Feature Difference (ΔFeature)", type: "number", required: true, placeholder: "1", helperText: "Quantity difference of the feature, e.g. 1 extra bathroom" },
    ],
    output: { key: "adjPerUnit", label: "Adjustment per Unit", type: "currency" },
    compute: ({ deltaPrice, deltaFeature }) => (deltaFeature === 0 ? null : deltaPrice / deltaFeature),
    showWork: ({ deltaPrice, deltaFeature }, result) => [
      { label: "Adj / Unit", expression: `$${deltaPrice.toLocaleString()} ÷ ${deltaFeature}`, value: result },
    ],
    explanation: "Derives a market-supported dollar adjustment per unit of a specific feature using two comparable sales that differ in only that one feature.",
  },

  S1F6: {
    variables: [
      { key: "b0", label: "Intercept (β₀)", type: "number", required: true, placeholder: "50000", helperText: "The regression constant / y-intercept" },
      { key: "b1", label: "Coefficient 1 (β₁)", type: "number", required: true, placeholder: "100", helperText: "Coefficient for the first independent variable" },
      { key: "x1", label: "Variable 1 (X₁)", type: "number", required: true, placeholder: "2000", helperText: "Value of the first independent variable, e.g. square footage" },
      { key: "b2", label: "Coefficient 2 (β₂)", type: "number", required: false, placeholder: "5000", helperText: "Coefficient for a second variable (optional — leave blank to ignore)", defaultValue: 0 },
      { key: "x2", label: "Variable 2 (X₂)", type: "number", required: false, placeholder: "0", helperText: "Value of the second independent variable (optional)", defaultValue: 0 },
    ],
    output: { key: "predictedValue", label: "Predicted Value (V)", type: "currency" },
    compute: ({ b0, b1, x1, b2 = 0, x2 = 0 }) => b0 + b1 * x1 + b2 * x2,
    showWork: ({ b0, b1, x1, b2 = 0, x2 = 0 }, result) => {
      const steps: WorkStep[] = [
        { label: "β₀ (intercept)", expression: `${b0}`, value: b0 },
        { label: "β₁ × X₁", expression: `${b1} × ${x1}`, value: b1 * x1 },
      ];
      if (b2 !== 0 || x2 !== 0) {
        steps.push({ label: "β₂ × X₂", expression: `${b2} × ${x2}`, value: b2 * x2 });
      }
      steps.push({ label: "Predicted Value (sum)", expression: "β₀ + β₁X₁" + (b2 !== 0 || x2 !== 0 ? " + β₂X₂" : ""), value: result });
      return steps;
    },
    explanation: "Estimates property value using a multiple linear regression equation with up to two independent variables (e.g. GLA, lot size). Add coefficient-variable pairs as needed.",
  },

  S1F7: {
    variables: [
      { key: "betaDummy", label: "Dummy Coefficient (β_dummy)", type: "currency", required: true, placeholder: "15000", helperText: "The regression-derived value adjustment for the feature" },
      { key: "isPresent", label: "Feature Present?", type: "integer", required: true, placeholder: "1", helperText: "Enter 1 if the feature is present, 0 if absent", min: 0 },
    ],
    output: { key: "valueChange", label: "Value Adjustment (ΔV)", type: "currency" },
    compute: ({ betaDummy, isPresent }) => betaDummy * (isPresent > 0.5 ? 1 : 0),
    showWork: ({ betaDummy, isPresent }, result) => {
      const flag = isPresent > 0.5 ? 1 : 0;
      return [
        { label: "Dummy flag (1 or 0)", expression: `Feature ${flag === 1 ? "present → 1" : "absent → 0"}`, value: flag },
        { label: "Value Adjustment", expression: `$${betaDummy.toLocaleString()} × ${flag}`, value: result },
      ];
    },
    explanation: "A dummy variable converts a qualitative attribute (present/absent) into a numeric 1 or 0. The coefficient represents the market-supported value contribution of that feature.",
  },

  S1F8: {
    variables: [
      { key: "beta", label: "Coefficient (β)", type: "number", required: true, placeholder: "120", helperText: "The regression coefficient being tested" },
      { key: "se", label: "Standard Error (SE)", type: "number", required: true, placeholder: "25", helperText: "Standard error of the coefficient" },
      { key: "rSquared", label: "R² (0–1)", type: "number", required: true, placeholder: "0.85", helperText: "Coefficient of determination, entered as a decimal (e.g. 0.85)" },
    ],
    output: { key: "tStat", label: "t-Statistic", type: "number" },
    compute: ({ beta, se, rSquared }) => {
      if (se === 0 || rSquared >= 1) return null;
      return beta / se;
    },
    showWork: ({ beta, se, rSquared }, tStat) => {
      const vif = rSquared < 1 ? 1 / (1 - rSquared) : Infinity;
      return [
        { label: "t-statistic (β ÷ SE)", expression: `${beta} ÷ ${se}`, value: tStat },
        { label: "VIF = 1 ÷ (1 − R²)", expression: `1 ÷ (1 − ${rSquared})`, value: isFinite(vif) ? vif : undefined },
      ];
    },
    explanation: "Key regression diagnostics. A |t-statistic| > 2 indicates statistical significance. VIF measures multicollinearity — values above 10 suggest a problem. R² shows how much variance the model explains.",
  },

  // ── S2 · Income Capitalization ───────────────────────────────────────────────

  S2F1: {
    variables: [
      { key: "noi", label: "Net Operating Income (NOI)", type: "currency", required: true, placeholder: "50000" },
      { key: "capRate", label: "Capitalization Rate", type: "percentage", required: true, placeholder: "7.5", helperText: "Enter as percent, e.g. 7.5 for 7.5%" },
    ],
    output: { key: "value", label: "Property Value", type: "currency" },
    compute: ({ noi, capRate }) => (capRate === 0 ? null : noi / (capRate / 100)),
    showWork: ({ noi, capRate }, result) => [
      { label: "Cap rate as decimal", expression: `${capRate}% ÷ 100`, value: capRate / 100 },
      { label: "Property Value", expression: `$${noi.toLocaleString()} ÷ ${(capRate / 100).toFixed(4)}`, value: result },
    ],
    explanation: "The core direct capitalization formula. Divides stabilized Net Operating Income by the market-derived capitalization rate to produce a value indication.",
  },

  S2F2: {
    variables: [
      { key: "monthlyRent", label: "Monthly Rent", type: "currency", required: true, placeholder: "2500" },
      { key: "grm", label: "Gross Rent Multiplier (GRM)", type: "number", required: true, placeholder: "150", helperText: "Market-derived multiplier extracted from comparable sales" },
    ],
    output: { key: "value", label: "Property Value", type: "currency" },
    compute: ({ monthlyRent, grm }) => monthlyRent * grm,
    showWork: ({ monthlyRent, grm }, result) => [
      { label: "Value", expression: `$${monthlyRent.toLocaleString()} × ${grm}`, value: result },
    ],
    explanation: "A quick income-approach screening tool. Multiplies monthly rent by the market GRM. Most reliable when derived from many comparable sales with similar income profiles.",
  },

  // ── S3 · Cost Approach ───────────────────────────────────────────────────────

  S3F1: {
    variables: [
      { key: "rcn", label: "Replacement Cost New (RCN)", type: "currency", required: true, placeholder: "350000", helperText: "Cost to build a functionally equivalent replacement structure" },
      { key: "depreciation", label: "Total Depreciation", type: "currency", required: true, placeholder: "87500", helperText: "Sum of physical, functional, and external depreciation" },
    ],
    output: { key: "rcnld", label: "Improvement Value (RCNLD)", type: "currency" },
    compute: ({ rcn, depreciation }) => rcn - depreciation,
    showWork: ({ rcn, depreciation }, result) => [
      { label: "RCNLD", expression: `$${rcn.toLocaleString()} − $${depreciation.toLocaleString()}`, value: result },
    ],
    explanation: "Replacement Cost New Less Depreciation — the contribution of improvements to total property value after accounting for all accrued depreciation.",
  },

  S3F2: {
    variables: [
      { key: "landValue", label: "Land Value", type: "currency", required: true, placeholder: "75000" },
      { key: "improvementValue", label: "Improvement Value (RCNLD)", type: "currency", required: true, placeholder: "262500" },
    ],
    output: { key: "totalValue", label: "Total Property Value", type: "currency" },
    compute: ({ landValue, improvementValue }) => landValue + improvementValue,
    showWork: ({ landValue, improvementValue }, result) => [
      { label: "Total Value", expression: `$${landValue.toLocaleString()} + $${improvementValue.toLocaleString()}`, value: result },
    ],
    explanation: "The final cost approach value indication: the sum of separately estimated land value and depreciated improvement value.",
  },

  // ── S4 · Ratio Studies ───────────────────────────────────────────────────────

  S4F1: {
    variables: [
      { key: "assessedValue", label: "Assessed Value", type: "currency", required: true, placeholder: "200000" },
      { key: "salePrice", label: "Sale Price", type: "currency", required: true, placeholder: "250000" },
    ],
    output: { key: "asr", label: "Assessment-to-Sale Ratio (ASR)", type: "ratio" },
    compute: ({ assessedValue, salePrice }) => (salePrice === 0 ? null : assessedValue / salePrice),
    showWork: ({ assessedValue, salePrice }, result) => [
      { label: "ASR", expression: `$${assessedValue.toLocaleString()} ÷ $${salePrice.toLocaleString()}`, value: result },
    ],
    explanation: "Measures vertical equity for a single property. Compare the resulting ratio to the jurisdiction's assessment level. IAAO standards target a median ratio between 0.90 and 1.10.",
  },

  S4F2: {
    variables: [
      { key: "aad", label: "Average Absolute Deviation (AAD)", type: "ratio", required: true, placeholder: "0.05", helperText: "Mean of absolute differences of individual ratios from the median ratio" },
      { key: "medianRatio", label: "Median Ratio", type: "ratio", required: true, placeholder: "0.95", helperText: "The median assessment-to-sale ratio of the study group" },
    ],
    output: { key: "cod", label: "Coefficient of Dispersion (COD)", type: "percentage" },
    compute: ({ aad, medianRatio }) => (medianRatio === 0 ? null : (aad / medianRatio) * 100),
    showWork: ({ aad, medianRatio }, result) => [
      { label: "COD", expression: `(${aad} ÷ ${medianRatio}) × 100`, value: result },
    ],
    explanation: "Measures horizontal equity — how uniformly properties are assessed across the study group. IAAO standards: COD ≤ 15 for residential, ≤ 20 for income-producing properties.",
  },

  S4F3: {
    variables: [
      { key: "meanRatio", label: "Mean Ratio", type: "ratio", required: true, placeholder: "0.94", helperText: "Simple arithmetic average of all individual assessment ratios" },
      { key: "weightedMeanRatio", label: "Weighted Mean Ratio", type: "ratio", required: true, placeholder: "0.92", helperText: "Aggregate assessed value ÷ aggregate sale price for all parcels" },
    ],
    output: { key: "prd", label: "Price-Related Differential (PRD)", type: "ratio" },
    compute: ({ meanRatio, weightedMeanRatio }) => (weightedMeanRatio === 0 ? null : meanRatio / weightedMeanRatio),
    showWork: ({ meanRatio, weightedMeanRatio }, result) => [
      { label: "PRD", expression: `${meanRatio} ÷ ${weightedMeanRatio}`, value: result },
    ],
    explanation: "Detects vertical inequity between low-value and high-value properties. PRD > 1.03 indicates regressivity (high-value properties under-assessed); PRD < 0.98 indicates progressivity. IAAO acceptable range: 0.98–1.03.",
  },

  // ── S4 extended ──────────────────────────────────────────────────────────────

  S4F4: {
    variables: [
      { key: "totalAV", label: "Total Assessed Value (ΣAV)", type: "currency", required: true, placeholder: "4750000", helperText: "Sum of all assessed values in the study group" },
      { key: "totalSP", label: "Total Sale Price (ΣSP)", type: "currency", required: true, placeholder: "5000000", helperText: "Sum of all corresponding sale prices" },
    ],
    output: { key: "weightedMean", label: "Weighted Mean Ratio", type: "ratio" },
    compute: ({ totalAV, totalSP }) => (totalSP === 0 ? null : totalAV / totalSP),
    showWork: ({ totalAV, totalSP }, result) => [
      { label: "Weighted Mean Ratio", expression: `$${totalAV.toLocaleString()} ÷ $${totalSP.toLocaleString()}`, value: result },
    ],
    explanation: "The weighted mean gives more influence to higher-value properties. Used to compute PRD. Compare to the simple mean ratio to detect vertical inequity.",
  },

  S4F5: {
    variables: [
      { key: "sumRatios", label: "Sum of All Ratios (ΣR)", type: "number", required: true, placeholder: "9.45", helperText: "Add all individual assessment-to-sale ratios together" },
      { key: "n", label: "Number of Sales (n)", type: "integer", required: true, placeholder: "10", helperText: "Total count of sales in the study group", min: 1 },
    ],
    output: { key: "meanRatio", label: "Mean Ratio", type: "ratio" },
    compute: ({ sumRatios, n }) => (n === 0 ? null : sumRatios / n),
    showWork: ({ sumRatios, n }, result) => [
      { label: "Mean Ratio", expression: `${sumRatios} ÷ ${n}`, value: result },
    ],
    explanation: "The simple arithmetic average of all individual assessment-to-sale ratios. Used with the weighted mean ratio to compute PRD.",
  },

  S4F6: {
    variables: [
      { key: "sumSquaredDev", label: "Sum of Squared Deviations (Σ(Rᵢ − R̄)²)", type: "number", required: true, placeholder: "0.0325", helperText: "Sum of each (ratio minus mean ratio) squared" },
      { key: "n", label: "Number of Sales (n)", type: "integer", required: true, placeholder: "10", helperText: "Total count of sales (use n−1 for a sample)", min: 1 },
    ],
    output: { key: "stdDev", label: "Standard Deviation", type: "ratio" },
    compute: ({ sumSquaredDev, n }) => (n === 0 ? null : Math.sqrt(sumSquaredDev / n)),
    showWork: ({ sumSquaredDev, n }, result) => [
      { label: "Variance", expression: `${sumSquaredDev} ÷ ${n}`, value: sumSquaredDev / n },
      { label: "Standard Deviation", expression: `√(${(sumSquaredDev / n).toFixed(6)})`, value: result },
    ],
    explanation: "Measures how widely individual ratios are dispersed around the mean. A smaller standard deviation indicates more uniform assessments.",
  },

  // ── S2 extended — Income Capitalization ──────────────────────────────────────

  S2F3: {
    variables: [
      { key: "units", label: "Number of Units", type: "integer", required: true, placeholder: "10", helperText: "Total rentable units in the property", min: 1 },
      { key: "monthlyRent", label: "Monthly Rent per Unit", type: "currency", required: true, placeholder: "1200" },
    ],
    output: { key: "pgi", label: "Potential Gross Income (PGI)", type: "currency" },
    compute: ({ units, monthlyRent }) => units * monthlyRent * 12,
    showWork: ({ units, monthlyRent }, result) => [
      { label: "Annual rent per unit", expression: `$${monthlyRent.toLocaleString()} × 12`, value: monthlyRent * 12 },
      { label: "PGI", expression: `${units} units × $${(monthlyRent * 12).toLocaleString()}`, value: result },
    ],
    explanation: "The maximum income the property could generate if 100% occupied at market rent. Starting point for the income approach.",
  },

  S2F4: {
    variables: [
      { key: "pgi", label: "Potential Gross Income (PGI)", type: "currency", required: true, placeholder: "144000" },
      { key: "vacancyRate", label: "Vacancy & Collection Loss Rate", type: "percentage", required: true, placeholder: "5", helperText: "Enter as percent, e.g. 5 for 5%" },
    ],
    output: { key: "egi", label: "Effective Gross Income (EGI)", type: "currency" },
    compute: ({ pgi, vacancyRate }) => pgi * (1 - vacancyRate / 100),
    showWork: ({ pgi, vacancyRate }, result) => [
      { label: "Vacancy loss", expression: `$${pgi.toLocaleString()} × ${vacancyRate}%`, value: pgi * (vacancyRate / 100) },
      { label: "EGI = PGI − Vacancy", expression: `$${pgi.toLocaleString()} − $${(pgi * vacancyRate / 100).toLocaleString()}`, value: result },
    ],
    explanation: "EGI is PGI adjusted for expected vacancies and uncollectable rent. Reflects realistic income before deducting operating expenses.",
  },

  S2F5: {
    variables: [
      { key: "egi", label: "Effective Gross Income (EGI)", type: "currency", required: true, placeholder: "136800" },
      { key: "opex", label: "Operating Expenses", type: "currency", required: true, placeholder: "54720", helperText: "Total annual operating expenses (excluding debt service)" },
    ],
    output: { key: "noi", label: "Net Operating Income (NOI)", type: "currency" },
    compute: ({ egi, opex }) => egi - opex,
    showWork: ({ egi, opex }, result) => [
      { label: "NOI", expression: `$${egi.toLocaleString()} − $${opex.toLocaleString()}`, value: result },
    ],
    explanation: "NOI is income remaining after all operating expenses but before mortgage payments. The primary income metric used in direct capitalization.",
  },

  S2F6: {
    variables: [
      { key: "noi", label: "Net Operating Income (NOI)", type: "currency", required: true, placeholder: "50000" },
      { key: "salePrice", label: "Sale Price", type: "currency", required: true, placeholder: "666667" },
    ],
    output: { key: "capRate", label: "Overall Capitalization Rate", type: "percentage" },
    compute: ({ noi, salePrice }) => (salePrice === 0 ? null : (noi / salePrice) * 100),
    showWork: ({ noi, salePrice }, result) => [
      { label: "Cap Rate", expression: `$${noi.toLocaleString()} ÷ $${salePrice.toLocaleString()}`, value: result / 100 },
      { label: "As percent", expression: `× 100`, value: result },
    ],
    explanation: "Extracts a market cap rate by dividing a comparable property's NOI by its sale price. Used to build a cap rate range from comparable sales.",
  },

  S2F7: {
    variables: [
      { key: "loanToValue", label: "Loan-to-Value Ratio (M)", type: "ratio", required: true, placeholder: "0.75", helperText: "Mortgage ratio as decimal, e.g. 0.75 for 75%" },
      { key: "mortgageConst", label: "Mortgage Constant (Rm)", type: "percentage", required: true, placeholder: "7.2", helperText: "Annual debt service ÷ original loan amount × 100" },
      { key: "equityCapRate", label: "Equity Capitalization Rate (Re)", type: "percentage", required: true, placeholder: "10", helperText: "Required equity return as percent" },
    ],
    output: { key: "overallCapRate", label: "Overall Cap Rate (Band of Investment)", type: "percentage" },
    compute: ({ loanToValue, mortgageConst, equityCapRate }) => {
      const equityRatio = 1 - loanToValue;
      return (loanToValue * (mortgageConst / 100) + equityRatio * (equityCapRate / 100)) * 100;
    },
    showWork: ({ loanToValue, mortgageConst, equityCapRate }, result) => {
      const eq = 1 - loanToValue;
      return [
        { label: "Equity ratio (1 − M)", expression: `1 − ${loanToValue}`, value: eq },
        { label: "Mortgage component (M × Rm)", expression: `${loanToValue} × ${mortgageConst}%`, value: loanToValue * mortgageConst / 100 * 100 },
        { label: "Equity component (E × Re)", expression: `${eq.toFixed(2)} × ${equityCapRate}%`, value: eq * equityCapRate },
        { label: "Overall Cap Rate", expression: "Sum of components", value: result },
      ];
    },
    explanation: "Synthesizes an overall capitalization rate by weighting the mortgage constant and equity return by their respective fractions of total value. A market-derived method used when reliable comparable sales are unavailable.",
  },

  S2F8: {
    variables: [
      { key: "annualInterestRate", label: "Annual Interest Rate", type: "percentage", required: true, placeholder: "6", helperText: "Loan interest rate per year, e.g. 6 for 6%" },
      { key: "termYears", label: "Amortization Term (years)", type: "integer", required: true, placeholder: "25", helperText: "Total loan repayment period in years", min: 1 },
    ],
    output: { key: "annualConst", label: "Annual Mortgage Constant", type: "ratio" },
    compute: ({ annualInterestRate, termYears }) => {
      const r = annualInterestRate / 100 / 12;
      const n = termYears * 12;
      if (r === 0) return 1 / n * 12;
      const monthlyConst = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return monthlyConst * 12;
    },
    showWork: ({ annualInterestRate, termYears }, result) => {
      const r = annualInterestRate / 100 / 12;
      const n = termYears * 12;
      const monthlyConst = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return [
        { label: "Monthly rate (r)", expression: `${annualInterestRate}% ÷ 12 ÷ 100`, value: r },
        { label: "Periods (n)", expression: `${termYears} × 12`, value: n },
        { label: "Monthly constant", expression: `r(1+r)ⁿ / ((1+r)ⁿ − 1)`, value: monthlyConst },
        { label: "Annual constant (×12)", expression: `${monthlyConst.toFixed(6)} × 12`, value: result },
      ];
    },
    explanation: "The mortgage constant (Rm) is annual debt service divided by original loan amount. Calculated from interest rate and amortization period using the level-payment mortgage formula.",
  },

  S2F9: {
    variables: [
      { key: "beforeTaxCashFlow", label: "Before-Tax Cash Flow (BTCF)", type: "currency", required: true, placeholder: "12000", helperText: "NOI minus annual debt service" },
      { key: "equityInvestment", label: "Equity Investment", type: "currency", required: true, placeholder: "150000", helperText: "Purchase price minus loan amount" },
    ],
    output: { key: "equityCapRate", label: "Equity Capitalization Rate", type: "percentage" },
    compute: ({ beforeTaxCashFlow, equityInvestment }) => (equityInvestment === 0 ? null : (beforeTaxCashFlow / equityInvestment) * 100),
    showWork: ({ beforeTaxCashFlow, equityInvestment }, result) => [
      { label: "Equity Cap Rate", expression: `$${beforeTaxCashFlow.toLocaleString()} ÷ $${equityInvestment.toLocaleString()}`, value: result / 100 },
      { label: "As percent", expression: "× 100", value: result },
    ],
    explanation: "Measures the cash-on-cash return to the equity investor. Equal to before-tax cash flow divided by the equity invested. Used in the band of investment method.",
  },

  S2F10: {
    variables: [
      { key: "salePrice", label: "Sale Price", type: "currency", required: true, placeholder: "600000" },
      { key: "annualGrossIncome", label: "Annual Gross Income", type: "currency", required: true, placeholder: "72000", helperText: "Annual gross rents (potential gross income)" },
    ],
    output: { key: "gim", label: "Gross Income Multiplier (GIM)", type: "ratio" },
    compute: ({ salePrice, annualGrossIncome }) => (annualGrossIncome === 0 ? null : salePrice / annualGrossIncome),
    showWork: ({ salePrice, annualGrossIncome }, result) => [
      { label: "GIM", expression: `$${salePrice.toLocaleString()} ÷ $${annualGrossIncome.toLocaleString()}`, value: result },
    ],
    explanation: "The annual gross income multiplier relates sale price to gross annual income. Extracted from comparable sales and applied to the subject's gross income to estimate value.",
  },

  // ── S3 extended — Cost Approach ───────────────────────────────────────────────

  S3F3: {
    variables: [
      { key: "effectiveAge", label: "Effective Age (years)", type: "integer", required: true, placeholder: "15", helperText: "Apparent age based on condition, not chronological age", min: 0 },
      { key: "economicLife", label: "Economic Life (years)", type: "integer", required: true, placeholder: "60", helperText: "Total expected useful life of the improvement", min: 1 },
    ],
    output: { key: "depreciationPct", label: "Depreciation Rate", type: "percentage" },
    compute: ({ effectiveAge, economicLife }) => (economicLife === 0 ? null : (effectiveAge / economicLife) * 100),
    showWork: ({ effectiveAge, economicLife }, result) => [
      { label: "Depreciation %", expression: `${effectiveAge} ÷ ${economicLife}`, value: effectiveAge / economicLife },
      { label: "As percent", expression: "× 100", value: result },
    ],
    explanation: "The age-life method estimates physical deterioration as a percentage of RCN based on effective age relative to total economic life. Simple, widely-used in mass appraisal.",
  },

  S3F4: {
    variables: [
      { key: "rcn", label: "Replacement Cost New (RCN)", type: "currency", required: true, placeholder: "350000" },
      { key: "depreciationPct", label: "Depreciation Rate", type: "percentage", required: true, placeholder: "25", helperText: "From age-life or another depreciation method" },
    ],
    output: { key: "depreciationAmt", label: "Depreciation Amount", type: "currency" },
    compute: ({ rcn, depreciationPct }) => rcn * (depreciationPct / 100),
    showWork: ({ rcn, depreciationPct }, result) => [
      { label: "Depreciation Amount", expression: `$${rcn.toLocaleString()} × ${depreciationPct}%`, value: result },
    ],
    explanation: "Converts a depreciation rate (from age-life or market extraction) into a dollar amount deducted from replacement cost new.",
  },

  S3F5: {
    variables: [
      { key: "salePrice", label: "Sale Price", type: "currency", required: true, placeholder: "425000" },
      { key: "rcnld", label: "Improvement Value (RCNLD)", type: "currency", required: true, placeholder: "350000", helperText: "Replacement cost new less all depreciation" },
    ],
    output: { key: "landValue", label: "Land Value (Extracted)", type: "currency" },
    compute: ({ salePrice, rcnld }) => salePrice - rcnld,
    showWork: ({ salePrice, rcnld }, result) => [
      { label: "Land Value", expression: `$${salePrice.toLocaleString()} − $${rcnld.toLocaleString()}`, value: result },
    ],
    explanation: "Extracts land value from a sale by deducting the known depreciated improvement value from the total sale price. Requires reliable RCNLD estimate.",
  },

  S3F6: {
    variables: [
      { key: "depreciationPct", label: "Depreciation Rate", type: "percentage", required: true, placeholder: "25", helperText: "Total accrued depreciation as a percent" },
    ],
    output: { key: "percentGood", label: "Percent Good", type: "percentage" },
    compute: ({ depreciationPct }) => 100 - depreciationPct,
    explanation: "Percent good is the complement of the depreciation rate. It represents the remaining value of the improvement as a percentage of its replacement cost new. RCNLD = RCN × Percent Good.",
  },

  // ── S5 — Property Tax Calculations ────────────────────────────────────────────

  S5F1: {
    variables: [
      { key: "assessedValue", label: "Assessed Value", type: "currency", required: true, placeholder: "180000", helperText: "The taxable assessed value of the property" },
      { key: "millage", label: "Millage Rate (mills)", type: "number", required: true, placeholder: "18.5", helperText: "Tax rate expressed in mills (1 mill = $1 per $1,000 AV)" },
    ],
    output: { key: "annualTax", label: "Annual Property Tax", type: "currency" },
    compute: ({ assessedValue, millage }) => assessedValue * (millage / 1000),
    showWork: ({ assessedValue, millage }, result) => [
      { label: "Millage as decimal", expression: `${millage} ÷ 1,000`, value: millage / 1000 },
      { label: "Annual Tax", expression: `$${assessedValue.toLocaleString()} × ${(millage / 1000).toFixed(5)}`, value: result },
    ],
    explanation: "Calculates the annual property tax bill. One mill equals $1 of tax for every $1,000 of assessed value. Total tax = AV × (millage ÷ 1,000).",
  },

  S5F2: {
    variables: [
      { key: "taxLevy", label: "Tax Levy (Budget)", type: "currency", required: true, placeholder: "5000000", helperText: "Total annual taxes the municipality needs to collect" },
      { key: "totalAV", label: "Total Assessed Value", type: "currency", required: true, placeholder: "270270270", helperText: "Sum of all taxable assessed values in the jurisdiction" },
    ],
    output: { key: "millageRate", label: "Millage Rate (mills)", type: "number" },
    compute: ({ taxLevy, totalAV }) => (totalAV === 0 ? null : (taxLevy / totalAV) * 1000),
    showWork: ({ taxLevy, totalAV }, result) => [
      { label: "Rate as decimal", expression: `$${taxLevy.toLocaleString()} ÷ $${totalAV.toLocaleString()}`, value: taxLevy / totalAV },
      { label: "Millage (× 1,000)", expression: `${(taxLevy / totalAV).toFixed(6)} × 1,000`, value: result },
    ],
    explanation: "Derives the millage rate needed to meet a given tax levy. The rate tells property owners how many mills (per $1,000 AV) they owe.",
  },

  S5F3: {
    variables: [
      { key: "assessedValue", label: "Assessed Value", type: "currency", required: true, placeholder: "153540", helperText: "The property's current assessed value" },
      { key: "clr", label: "Common Level Ratio (CLR)", type: "ratio", required: true, placeholder: "0.853", helperText: "Published by the State Tax Equalization Board (STEB) as a decimal, e.g. 0.853" },
    ],
    output: { key: "impliedMarketValue", label: "CLR-Implied Market Value", type: "currency" },
    compute: ({ assessedValue, clr }) => (clr === 0 ? null : assessedValue / clr),
    showWork: ({ assessedValue, clr }, result) => [
      { label: "CLR-Implied Market Value", expression: `$${assessedValue.toLocaleString()} ÷ ${clr}`, value: result },
    ],
    explanation: "Recovers an implied market value from an assessed value using the jurisdiction's published Common Level Ratio. Used extensively in Pennsylvania assessment appeals to test whether an assessment is equitable.",
  },

  S5F4: {
    variables: [
      { key: "marketValue", label: "Market Value", type: "currency", required: true, placeholder: "250000", helperText: "Estimated or agreed-upon fair market value" },
      { key: "clr", label: "Common Level Ratio (CLR)", type: "ratio", required: true, placeholder: "0.853", helperText: "Published CLR for the jurisdiction (decimal)" },
    ],
    output: { key: "targetAssessment", label: "Target Assessment", type: "currency" },
    compute: ({ marketValue, clr }) => marketValue * clr,
    showWork: ({ marketValue, clr }, result) => [
      { label: "Target Assessment", expression: `$${marketValue.toLocaleString()} × ${clr}`, value: result },
    ],
    explanation: "The assessment value at which a property would be equitably taxed given the jurisdiction's CLR. Used in appeals to determine a fair assessment. Target = Market Value × CLR.",
  },

  S5F5: {
    variables: [
      { key: "totalAV", label: "Total Assessed Value (ΣAV)", type: "currency", required: true, placeholder: "4750000", helperText: "Sum of all assessed values in the ratio study" },
      { key: "totalSP", label: "Total Sale Price (ΣSP)", type: "currency", required: true, placeholder: "5000000", helperText: "Sum of all corresponding sale prices" },
    ],
    output: { key: "clr", label: "Common Level Ratio (CLR)", type: "ratio" },
    compute: ({ totalAV, totalSP }) => (totalSP === 0 ? null : totalAV / totalSP),
    showWork: ({ totalAV, totalSP }, result) => [
      { label: "CLR", expression: `$${totalAV.toLocaleString()} ÷ $${totalSP.toLocaleString()}`, value: result },
    ],
    explanation: "The CLR is the aggregate assessed value divided by aggregate sale price for properties sold in a jurisdiction. Published annually by Pennsylvania's STEB. Used to convert assessed values to implied market values in appeals.",
  },

  S5F6: {
    variables: [
      { key: "assessedValue", label: "Assessed Value", type: "currency", required: true, placeholder: "180000" },
      { key: "assessmentRatio", label: "Assessment Level (ratio)", type: "ratio", required: true, placeholder: "0.853", helperText: "The jurisdiction's target or actual assessment ratio (e.g. CLR)" },
    ],
    output: { key: "impliedMV", label: "Implied Market Value", type: "currency" },
    compute: ({ assessedValue, assessmentRatio }) => (assessmentRatio === 0 ? null : assessedValue / assessmentRatio),
    explanation: "Converts any assessed value to an implied market value using the jurisdiction's assessment level. Equivalent to dividing AV by CLR when the CLR is the assessment level.",
  },

  // ── S6 — Assessment Level & Uniformity ────────────────────────────────────────

  S6F1: {
    variables: [
      { key: "currentSale", label: "Current Sale Price", type: "currency", required: true, placeholder: "275000", helperText: "Sale price at the more recent date" },
      { key: "priorSale", label: "Prior Sale Price", type: "currency", required: true, placeholder: "250000", helperText: "Sale price at the earlier date" },
    ],
    output: { key: "indexFactor", label: "Index / Trend Factor", type: "ratio" },
    compute: ({ currentSale, priorSale }) => (priorSale === 0 ? null : currentSale / priorSale),
    showWork: ({ currentSale, priorSale }, result) => [
      { label: "Index Factor", expression: `$${currentSale.toLocaleString()} ÷ $${priorSale.toLocaleString()}`, value: result },
    ],
    explanation: "The index (or trend) factor measures how much prices have changed between two time periods. Multiply a prior-period value by the index factor to estimate the current value.",
  },

  S6F2: {
    variables: [
      { key: "assessedValue", label: "Assessed Value", type: "currency", required: true, placeholder: "200000" },
      { key: "assessmentLevel", label: "Assessment Level", type: "percentage", required: true, placeholder: "100", helperText: "Jurisdiction's target assessment level as percent of market value (e.g. 100 for full value)" },
    ],
    output: { key: "impliedMV", label: "Indicated Market Value", type: "currency" },
    compute: ({ assessedValue, assessmentLevel }) => (assessmentLevel === 0 ? null : assessedValue / (assessmentLevel / 100)),
    showWork: ({ assessedValue, assessmentLevel }, result) => [
      { label: "Level as decimal", expression: `${assessmentLevel}% ÷ 100`, value: assessmentLevel / 100 },
      { label: "Indicated Market Value", expression: `$${assessedValue.toLocaleString()} ÷ ${(assessmentLevel / 100).toFixed(4)}`, value: result },
    ],
    explanation: "If a jurisdiction assesses at a fraction of market value, divide the AV by the assessment level to recover market value. For full-value jurisdictions the level is 100%.",
  },

  S6F3: {
    variables: [
      { key: "assessedValue", label: "Assessed Value", type: "currency", required: true, placeholder: "200000" },
      { key: "marketValue", label: "Market Value", type: "currency", required: true, placeholder: "250000" },
    ],
    output: { key: "assessmentRatio", label: "Assessment-to-Market Ratio", type: "percentage" },
    compute: ({ assessedValue, marketValue }) => (marketValue === 0 ? null : (assessedValue / marketValue) * 100),
    showWork: ({ assessedValue, marketValue }, result) => [
      { label: "Ratio", expression: `$${assessedValue.toLocaleString()} ÷ $${marketValue.toLocaleString()}`, value: result / 100 },
      { label: "As percent", expression: "× 100", value: result },
    ],
    explanation: "Expresses assessed value as a percentage of market value. A ratio equal to the jurisdiction's assessment level indicates the property is equitably assessed.",
  },

  S6F4: {
    variables: [
      { key: "marketValue", label: "Market Value", type: "currency", required: true, placeholder: "250000" },
      { key: "millage", label: "Total Millage Rate", type: "number", required: true, placeholder: "18.5", helperText: "Combined millage from all taxing bodies (mills)" },
      { key: "clr", label: "Common Level Ratio (CLR)", type: "ratio", required: true, placeholder: "0.853", helperText: "Published assessment level for the jurisdiction" },
    ],
    output: { key: "annualTax", label: "Estimated Annual Tax", type: "currency" },
    compute: ({ marketValue, millage, clr }) => marketValue * clr * (millage / 1000),
    showWork: ({ marketValue, millage, clr }, result) => [
      { label: "Target AV (MV × CLR)", expression: `$${marketValue.toLocaleString()} × ${clr}`, value: marketValue * clr },
      { label: "Annual Tax (AV × millage/1000)", expression: `$${(marketValue * clr).toLocaleString()} × ${millage}/1,000`, value: result },
    ],
    explanation: "Estimates the property tax bill from market value by first converting to assessed value via CLR, then applying the millage rate. Useful for buyer counseling or appeal analysis.",
  },

  // ── Aliases — short codes used as formulaRef in questions ────────────────────
  // These allow formulas whose DB code is a short label (CLR, GRM, etc.) to also
  // resolve a calculator config.

  CLR: {
    variables: [
      { key: "assessedValue", label: "Assessed Value", type: "currency", required: true, placeholder: "153540" },
      { key: "clr", label: "Common Level Ratio (CLR)", type: "ratio", required: true, placeholder: "0.853", helperText: "Published STEB ratio as decimal" },
    ],
    output: { key: "impliedMV", label: "CLR-Implied Market Value", type: "currency" },
    compute: ({ assessedValue, clr }) => (clr === 0 ? null : assessedValue / clr),
    explanation: "Recovers implied market value from assessed value using the jurisdiction's CLR. Central to Pennsylvania assessment appeal analysis.",
  },

  GRM: {
    variables: [
      { key: "monthlyRent", label: "Monthly Rent", type: "currency", required: true, placeholder: "2500" },
      { key: "grm", label: "Gross Rent Multiplier (GRM)", type: "number", required: true, placeholder: "150" },
    ],
    output: { key: "value", label: "Property Value", type: "currency" },
    compute: ({ monthlyRent, grm }) => monthlyRent * grm,
    explanation: "Estimates value by multiplying monthly rent by the market-derived GRM.",
  },

  ASR: {
    variables: [
      { key: "assessedValue", label: "Assessed Value", type: "currency", required: true, placeholder: "200000" },
      { key: "salePrice", label: "Sale Price", type: "currency", required: true, placeholder: "250000" },
    ],
    output: { key: "asr", label: "Assessment-to-Sale Ratio", type: "ratio" },
    compute: ({ assessedValue, salePrice }) => (salePrice === 0 ? null : assessedValue / salePrice),
    explanation: "Measures how closely an assessment tracks sale price. Also called the assessment ratio.",
  },

  COD: {
    variables: [
      { key: "aad", label: "Average Absolute Deviation (AAD)", type: "ratio", required: true, placeholder: "0.05" },
      { key: "medianRatio", label: "Median Ratio", type: "ratio", required: true, placeholder: "0.95" },
    ],
    output: { key: "cod", label: "Coefficient of Dispersion (COD)", type: "percentage" },
    compute: ({ aad, medianRatio }) => (medianRatio === 0 ? null : (aad / medianRatio) * 100),
    explanation: "Measures assessment uniformity. IAAO standards: COD ≤ 15 for residential, ≤ 20 for income properties.",
  },

  PRD: {
    variables: [
      { key: "meanRatio", label: "Mean Ratio", type: "ratio", required: true, placeholder: "0.94" },
      { key: "weightedMeanRatio", label: "Weighted Mean Ratio", type: "ratio", required: true, placeholder: "0.92" },
    ],
    output: { key: "prd", label: "Price-Related Differential (PRD)", type: "ratio" },
    compute: ({ meanRatio, weightedMeanRatio }) => (weightedMeanRatio === 0 ? null : meanRatio / weightedMeanRatio),
    explanation: "Detects vertical inequity. IAAO acceptable range: 0.98–1.03.",
  },

  NOI: {
    variables: [
      { key: "egi", label: "Effective Gross Income (EGI)", type: "currency", required: true, placeholder: "136800" },
      { key: "opex", label: "Operating Expenses", type: "currency", required: true, placeholder: "54720" },
    ],
    output: { key: "noi", label: "Net Operating Income (NOI)", type: "currency" },
    compute: ({ egi, opex }) => egi - opex,
    explanation: "Income remaining after operating expenses but before debt service.",
  },

  RCNLD: {
    variables: [
      { key: "rcn", label: "Replacement Cost New (RCN)", type: "currency", required: true, placeholder: "350000" },
      { key: "depreciation", label: "Total Depreciation", type: "currency", required: true, placeholder: "87500" },
    ],
    output: { key: "rcnld", label: "Improvement Value (RCNLD)", type: "currency" },
    compute: ({ rcn, depreciation }) => rcn - depreciation,
    explanation: "Replacement Cost New Less Depreciation — the depreciated improvement value.",
  },
};

export function getFormulaCalculator(code: string): FormulaCalculatorConfig | null {
  return CONFIGS[normalizeCode(code)] ?? null;
}
