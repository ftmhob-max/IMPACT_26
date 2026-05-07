import test from "node:test";
import assert from "node:assert/strict";

import { parseDocxHtml } from "@/lib/admin/docx-question-parser";

test("parses split-cell DOCX question tables across multiple table segments", () => {
  const html = `
    <h1>SECTION 9 — LEGAL FRAMEWORK</h1>
    <p>Formula Mastery Practice Exam</p>
    <h2>FORMULA 1 — CLR-Implied Market Value</h2>
    <p>Market Value ≈ Assessed Value ÷ Common Level Ratio (CLR)</p>
    <table><tr><td>Q 1</td><td>CLR Market Value | MV = Assessment ÷ CLR</td><td>SKILL: EASY</td></tr></table>
    <table><tr><td>A property is assessed at $180,000. The Pennsylvania STEB Common Level Ratio for the jurisdiction is 85.3%. What is the CLR-implied market value?</td></tr></table>
    <table><tr><td>A</td><td>$211,019</td></tr></table>
    <table><tr><td>B</td><td>$153,540</td></tr></table>
    <table><tr><td>C</td><td>$180,000</td></tr></table>
    <table><tr><td>D</td><td>$256,800</td></tr></table>
    <table><tr><td>Correct Answer: A</td></tr></table>
    <table><tr><td>FORMULA</td></tr></table>
    <table><tr><td>Market Value ≈ Assessed Value ÷ CLR</td></tr></table>
    <table><tr><td>STEP-BY-STEP CALCULATION</td></tr></table>
    <table><tr><td>Step 1: CLR = 85.3% = 0.853. Step 2: Market Value = $180,000 ÷ 0.853. Step 3: Market Value = $211,019.</td></tr></table>
    <table><tr><td>RATIONALE</td></tr></table>
    <table><tr><td>The CLR converts an assessed value to its implied market value.</td></tr></table>
    <h2>FORMULA 2 — Target Assessment</h2>
    <table><tr><td>Q 2</td><td>Target Assessment | Assessment = Market Value × Level</td><td>SKILL: INTERMEDIATE</td></tr></table>
    <table><tr><td>What is the target assessment for a $300,000 property at a 32% assessment level?</td></tr></table>
    <table><tr><td>A</td><td>$96,000</td></tr></table>
    <table><tr><td>B</td><td>$32,000</td></tr></table>
    <table><tr><td>C</td><td>$204,000</td></tr></table>
    <table><tr><td>D</td><td>$300,000</td></tr></table>
    <table><tr><td>Correct Answer: A</td></tr></table>
    <h1>SECTION 10 — ETHICS & DATA</h1>
    <h2>FORMULA 1 — Concession-Adjusted Sale Price</h2>
    <table><tr><td>Q 1</td><td>Concession-Adjusted Sale Price</td><td>SKILL: EXPERT</td></tr></table>
    <table><tr><td>Why should seller-paid concessions be removed before ratio studies?</td></tr></table>
    <table><tr><td>A</td><td>To estimate a cash-equivalent sale price.</td></tr></table>
    <table><tr><td>B</td><td>To increase assessed value.</td></tr></table>
    <table><tr><td>C</td><td>To lower the tax rate.</td></tr></table>
    <table><tr><td>D</td><td>To avoid market analysis.</td></tr></table>
    <table><tr><td>Correct Answer: A</td></tr></table>
  `;

  const result = parseDocxHtml(html);

  assert.equal(result.sections.length, 2);
  assert.equal(result.allQuestions.length, 3);

  assert.equal(result.sections[0]?.title, "LEGAL FRAMEWORK");
  assert.equal(result.sections[0]?.formulas.length, 2);
  assert.equal(result.sections[0]?.formulas[0]?.code, "FORMULA_1");
  assert.equal(result.sections[0]?.formulas[1]?.code, "FORMULA_2");

  const firstQuestion = result.sections[0]?.formulas[0]?.questions[0];
  assert.equal(firstQuestion?.difficulty, "easy");
  assert.match(firstQuestion?.questionText ?? "", /CLR-implied market value/i);
  assert.equal(firstQuestion?.choices.length, 4);
  assert.equal(firstQuestion?.choices.find((choice) => choice.isCorrect)?.letter, "A");
  assert.match(firstQuestion?.calculation ?? "", /Step 1: CLR = 85\.3%/);
  assert.match(firstQuestion?.rationale ?? "", /implied market value/i);

  const ethicsQuestion = result.sections[1]?.formulas[0]?.questions[0];
  assert.equal(ethicsQuestion?.difficulty, "expert");
  assert.equal(ethicsQuestion?.domain, "ETHICS & DATA");
});

test("preserves legacy single-cell question headers", () => {
  const html = `
    <h1>Section 1: Income Approach</h1>
    <h2>GRM: Gross Rent Multiplier</h2>
    <table>
      <tr><td>Q 7 A property rents for $2,000 per month. SKILL: EASY</td></tr>
      <tr><td>A. $120,000</td></tr>
      <tr><td>B. $240,000</td></tr>
      <tr><td>C. $360,000</td></tr>
      <tr><td>D. $480,000</td></tr>
      <tr><td>Correct Answer: B</td></tr>
      <tr><td>RATIONALE: Multiply monthly rent into the GRM formula.</td></tr>
    </table>
  `;

  const result = parseDocxHtml(html);
  const question = result.allQuestions[0];

  assert.equal(result.sections.length, 1);
  assert.equal(result.sections[0]?.title, "Income Approach");
  assert.equal(result.sections[0]?.formulas[0]?.code, "GRM");
  assert.equal(result.allQuestions.length, 1);
  assert.equal(question?.questionNumber, 7);
  assert.equal(question?.difficulty, "easy");
  assert.match(question?.questionText ?? "", /A property rents for \$2,000 per month\./);
  assert.equal(question?.choices.find((choice) => choice.isCorrect)?.letter, "B");
});
