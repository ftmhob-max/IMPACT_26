import test from "node:test";
import assert from "node:assert/strict";

import { parseDocxHtml } from "@/lib/admin/docx-question-parser";
import { docxParseResultToCsvPreview } from "@/lib/admin/docx-question-table-parser";

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

test("parses IMPACT workbook paragraph sections, merged choices, and post-table explanations", () => {
  const html = `
    <p>IMPACT_26V.1 | Integrated Methods</p>
    <p>SECTION 1 — SALES COMPARISON & REGRESSION</p>
    <p>Formula Mastery Practice Exam | 9 Questions Per Formula</p>
    <h2>FORMULA 1 — Trending Forward</h2>
    <p>Adjusted Price = Sale × (1 + r)^n</p>
    <table>
      <tr><td colspan="2"><p><strong>Q 2</strong></p></td><td><p><strong>Trending Forward | Adjusted Price = Sale × (1+r)^n</strong></p></td><td><p><strong>SKILL: INTERMEDIATE</strong></p></td></tr>
      <tr><td colspan="4"><p>A sale occurred 3 months ago for $150,000. Market appreciation is 0.3% per month. What is the forward-trended price?</p></td></tr>
      <tr><td><p><strong>A</strong></p></td><td colspan="3"><p><strong>$151,354</strong></p></td></tr>
      <tr><td><p>B</p><p>C</p></td><td colspan="3"><p>$150,900</p><p>$152,000</p></td></tr>
      <tr><td><p>D</p></td><td colspan="3"><p>$153,000</p></td></tr>
    </table>
    <p>FORMULA</p>
    <p>Adjusted Price = Sale × (1 + r)^n</p>
    <p>STEP-BY-STEP CALCULATION</p>
    <p>Step 1: Factor = (1 + 0.003)^3. Step 2: Adjusted Price = $151,354.</p>
    <p>RATIONALE</p>
    <p>Three months of compounding yields the correct factor. Answer A is correct.</p>
    <h3>FORMULA 2 — Back-Trend</h3>
    <table>
      <tr><td><p>Q 3</p></td><td><p>Back-Trend | Adjusted Price = Sale ÷ (1+r)^n</p></td><td><p>SKILL: EXPERT</p></td></tr>
      <tr><td><p>Which answer correctly describes back-trending?</p></td></tr>
      <tr><td><p>A</p></td><td><p>Divide by the compound factor</p></td></tr>
      <tr><td><p>B</p></td><td><p>Multiply by the compound factor</p></td></tr>
    </table>
    <p>RATIONALE</p>
    <p>Select A because back-trending removes appreciation.</p>
  `;

  const result = parseDocxHtml(html);
  const firstQuestion = result.allQuestions[0];
  const secondQuestion = result.allQuestions[1];

  assert.equal(result.sections[0]?.title, "SALES COMPARISON & REGRESSION");
  assert.equal(result.sections[0]?.formulas.length, 2);
  assert.equal(firstQuestion?.difficulty, "proficient");
  assert.equal(firstQuestion?.choices.length, 4);
  assert.deepEqual(firstQuestion?.choices.map((choice) => choice.letter), ["A", "B", "C", "D"]);
  assert.equal(firstQuestion?.choices.find((choice) => choice.isCorrect)?.letter, "A");
  assert.match(firstQuestion?.calculation ?? "", /Adjusted Price = \$151,354/);
  assert.match(firstQuestion?.rationale ?? "", /Answer A is correct/);
  assert.equal(secondQuestion?.choices.find((choice) => choice.isCorrect)?.letter, "A");
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

test("adapts IMPACT parsed questions into quiz import preview rows", async () => {
  const result = parseDocxHtml(`
    <p>SECTION 9 — LEGAL FRAMEWORK</p>
    <h2>FORMULA 1 — CLR-Implied Market Value</h2>
    <table>
      <tr><td>Q 1</td><td>CLR Market Value</td><td>SKILL: EASY</td></tr>
      <tr><td>What does CLR convert?</td></tr>
      <tr><td>A</td><td>Assessed value to implied market value</td></tr>
      <tr><td>B</td><td>Tax rate to millage</td></tr>
    </table>
    <p>RATIONALE</p>
    <p>CLR is a ratio-study tool. Answer A is correct.</p>
    <p>SECTION 10 — ETHICS & DATA</p>
    <h2>FORMULA 1 — Data Review</h2>
    <table>
      <tr><td>Q 2</td><td>Data Review</td><td>SKILL: EXPERT</td></tr>
      <tr><td>What should analysts document?</td></tr>
      <tr><td>A</td><td>Data assumptions</td></tr>
      <tr><td>B</td><td>Nothing</td></tr>
    </table>
    <p>RATIONALE</p>
    <p>Transparent assumptions support review. Answer A is correct.</p>
    <p>SECTION 11 — RATIO STUDIES</p>
    <h2>FORMULA 1 — Median Ratio</h2>
    <table>
      <tr><td>Q 3</td><td>Median Ratio</td><td>SKILL: INTERMEDIATE</td></tr>
      <tr><td>Which statistic is commonly used?</td></tr>
      <tr><td>A</td><td>Median</td></tr>
      <tr><td>B</td><td>Mode only</td></tr>
    </table>
    <p>RATIONALE</p>
    <p>Ratio studies often use medians. Answer A is correct.</p>
    <table>
      <tr><td>Q 4</td><td>Median Ratio</td><td>SKILL: INTERMEDIATE</td></tr>
      <tr><td>Which statistic is commonly used?</td></tr>
      <tr><td>A</td><td>Median</td></tr>
      <tr><td>B</td><td>Mode only</td></tr>
    </table>
    <p>RATIONALE</p>
    <p>Ratio studies often use medians. Answer A is correct.</p>
  `);

  const preview = await docxParseResultToCsvPreview(result);

  assert.equal(preview.validRows.length, 3);
  assert.equal(preview.duplicates.length, 1);
  assert.equal(preview.validRows[0]?.domain, "law");
  assert.equal(preview.validRows[1]?.domain, "ethics");
  assert.equal(preview.validRows[2]?.domain, "math");
  assert.equal(preview.validRows[2]?.difficulty, "proficient");
  assert.deepEqual(preview.validRows[0]?.correct_answers, ["A"]);
  assert.deepEqual(preview.validRows[0]?.topic_tags, [
    "LEGAL FRAMEWORK",
    "LEGAL FRAMEWORK > CLR-Implied Market Value",
  ]);
  assert.equal(preview.validRows[0]?.formula_ref, "FORMULA_1");
});
