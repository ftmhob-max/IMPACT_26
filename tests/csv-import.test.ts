import test from "node:test";
import assert from "node:assert/strict";

import { CSV_TEMPLATE, previewAssessmentCsv } from "@/lib/admin/csv";
import { normalizeQuestionTextForDedup } from "@/lib/admin/question-dedup";

test("CSV template rows validate across supported question types", () => {
  const preview = previewAssessmentCsv(CSV_TEMPLATE);

  assert.equal(preview.errors.length, 0);
  assert.equal(preview.validRows.length, 5);
  assert.deepEqual(
    preview.validRows.map((row) => row.question_type),
    ["multiple_choice", "multiple_choice", "multiselect", "scenario", "short_answer"]
  );
  assert.deepEqual(preview.validRows.at(-1)?.choices, [
    "A sale price adjusted to remove financing or concession terms that distort market value",
  ]);
});

test("CSV preview normalizes question type aliases and preserves free-text answers", () => {
  const csv = `question_text,question_type,difficulty,domain,choices,correct_answers,explanation,rationale,calculation,source_ref,topic_tags,formula_ref,point_value
"Pick every valid ratio-study review step.",multi,proficient,ethics,"Check sales|Document exclusions|Ignore data",A|B,,,,review,ratio|study,RATIO,2
"Read the appeal scenario and choose the best evidence.",case_study,expert,law,"One sale|Adjusted comparables|Guess",B,,,,appeal,scenario|evidence,APPEAL,1
"Define common level ratio.",short,easy,law,,"The ratio of assessed value to market value",,,,glossary,CLR,CLR,1`;

  const preview = previewAssessmentCsv(csv);

  assert.equal(preview.errors.length, 0);
  assert.equal(preview.validRows[0]?.question_type, "multiselect");
  assert.deepEqual(preview.validRows[0]?.correct_answers, ["A", "B"]);
  assert.equal(preview.validRows[1]?.question_type, "scenario");
  assert.equal(preview.validRows[2]?.question_type, "short_answer");
  assert.deepEqual(preview.validRows[2]?.choices, ["The ratio of assessed value to market value"]);
  assert.deepEqual(preview.validRows[2]?.correct_answers, ["The ratio of assessed value to market value"]);
});

test("CSV preview duplicate detection uses shared normalized question text", () => {
  const text = "What is a cash-equivalent sale price?";
  const existing = new Map([[normalizeQuestionTextForDedup(text), "question-1"]]);
  const csv = `question_text,question_type,difficulty,domain,choices,correct_answers
"  What is a cash-equivalent   sale price? ",single,easy,appraisal,"Market-adjusted price|Tax rate",A`;

  const preview = previewAssessmentCsv(csv, existing);

  assert.equal(preview.validRows.length, 0);
  assert.equal(preview.duplicates.length, 1);
  assert.equal(preview.duplicates[0]?.existingQuestionId, "question-1");
});
