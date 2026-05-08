import test from "node:test";
import assert from "node:assert/strict";

import {
  createQuestionDedupSet,
  isDuplicateQuestionText,
  normalizeQuestionTextForDedup,
  rememberQuestionText,
} from "@/lib/admin/question-dedup";

test("normalizeQuestionTextForDedup collapses whitespace and casing", () => {
  assert.equal(
    normalizeQuestionTextForDedup("  What is the cap rate?\n\n"),
    "what is the cap rate?"
  );
});

test("normalizeQuestionTextForDedup normalizes smart punctuation", () => {
  assert.equal(
    normalizeQuestionTextForDedup("What’s the value of “fee simple” ownership?"),
    normalizeQuestionTextForDedup("What's the value of \"fee simple\" ownership?")
  );
});

test("dedup helpers treat exact normalized matches as duplicates", () => {
  const seen = createQuestionDedupSet(["What is the cap rate?"]);
  assert.equal(isDuplicateQuestionText(" what is the cap rate? ", seen), true);
  assert.equal(isDuplicateQuestionText("What is the gross rent multiplier?", seen), false);

  rememberQuestionText("What is the gross rent multiplier?", seen);
  assert.equal(isDuplicateQuestionText("What is the gross rent multiplier?", seen), true);
});
