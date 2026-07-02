import test from "node:test";
import assert from "node:assert/strict";

import { DEV_COURSES, DEV_FORMULA_SECTIONS, DEV_QUIZZES } from "@/lib/dev-content";
import {
  blockCategoryForType,
  createDefaultLessonBlock,
  emptyTipTapDocument,
  getLessonReadinessReport,
  parseStructuredLessonContent,
  stringifyStructuredLessonContent,
} from "@/lib/lessons/structured-content";
import { DOMAINS } from "@/lib/utils";

test("case-file lesson blocks normalize and report readiness gaps", () => {
  const block = createDefaultLessonBlock("caseFile");

  assert.equal(block.type, "caseFile");
  assert.equal(blockCategoryForType("caseFile"), "practice");
  assert.ok(block.parcelFacts.length >= 2);
  assert.ok(block.evidenceItems.length >= 2);

  const doc = {
    version: 2,
    kind: "structured-lesson",
    summary: "Case lesson",
    objectives: ["Review parcel evidence"],
    estimatedDurationMinutes: 10,
    completionMode: "manual",
    blocks: [block],
  } as const;

  const parsed = parseStructuredLessonContent(JSON.stringify(doc));
  const issues = getLessonReadinessReport(parsed);

  assert.ok(issues.some((issue) => issue.message.includes("add the case scenario")));
  assert.ok(issues.some((issue) => issue.message.includes("add the learner task")));
});

test("case-file lesson blocks preserve scenario evidence through stringify/parse", () => {
  const content = {
    version: 2,
    kind: "structured-lesson",
    summary: "Appeal evidence review",
    objectives: ["Classify evidence completeness"],
    estimatedDurationMinutes: 12,
    completionMode: "manual",
    blocks: [
      {
        id: "case-1",
        type: "caseFile",
        title: "Mixed-use appeal packet",
        isStudentVisible: true,
        required: true,
        scenario: "A mixed-use appeal packet is missing income support.",
        parcelFacts: [{ label: "Use", detail: "Retail plus apartments" }],
        evidenceItems: [{ label: "Rent roll", detail: "Missing two leases", sourceRef: "Appeal packet" }],
        learnerTask: "Decide whether the packet is complete.",
        rubric: "Require income support before deciding value.",
      },
    ],
  };

  const parsed = parseStructuredLessonContent(JSON.stringify(content));
  const serialized = stringifyStructuredLessonContent(parsed);
  const reparsed = parseStructuredLessonContent(serialized);
  const block = reparsed.blocks[0];

  assert.equal(block?.type, "caseFile");
  if (block?.type !== "caseFile") assert.fail("Expected caseFile block");
  assert.equal(block.scenario, "A mixed-use appeal packet is missing income support.");
  assert.equal(block.evidenceItems[0]?.sourceRef, "Appeal packet");
  assert.equal(block.rubric, "Require income support before deciding value.");
});

test("academy seed covers foundational evaluator curriculum primitives", () => {
  const lessons = DEV_COURSES.flatMap((course) => course.modules_on_course.flatMap((module) => module.lessons_on_module));
  const parsedLessons = lessons.map((lesson) => parseStructuredLessonContent(lesson.contentJson, lesson.id));
  const blocks = parsedLessons.flatMap((lesson) => lesson.blocks);
  const formulas = DEV_FORMULA_SECTIONS.flatMap((section) => section.formulas);
  const quizQuestions = DEV_QUIZZES.flatMap((quiz) => quiz.questions);

  assert.equal(DEV_COURSES[0]?.slug, "philadelphia-property-assessment-academy");
  assert.ok(DEV_COURSES[0]?.modules_on_course.length >= 5);
  assert.ok(blocks.some((block) => block.type === "caseFile"));
  assert.ok(blocks.some((block) => block.type === "glossaryTermSet"));
  assert.ok(blocks.some((block) => block.type === "formula"));
  assert.ok(blocks.some((block) => block.type === "quizCheckpoint"));
  assert.ok(formulas.every((formula) => formula.calcMetaJson));
  assert.ok(quizQuestions.some((question) => question.questionType === "scenario"));
  assert.ok(quizQuestions.every((question) => question.domain in DOMAINS));
});

test("unrecognized or malformed lesson blocks are filtered out during parsing", () => {
  const malformedDoc = {
    version: 2,
    kind: "structured-lesson",
    summary: "Test lesson",
    objectives: ["Test objectives"],
    estimatedDurationMinutes: 5,
    completionMode: "manual",
    blocks: [
      {
        id: "block-1",
        type: "richText",
        title: "Good block",
        isStudentVisible: true,
        required: true,
        contentKind: "tiptap",
        content: emptyTipTapDocument(),
      },
      {
        id: "block-2",
        type: "unknownTypeForTesting",
        title: "Bad block",
        isStudentVisible: true,
        required: true,
      },
      null,
      undefined,
    ],
  };

  const parsed = parseStructuredLessonContent(JSON.stringify(malformedDoc));
  assert.equal(parsed.blocks.length, 1);
  assert.equal(parsed.blocks[0]?.type, "richText");
});

test("lesson readiness tolerates malformed block arrays", () => {
  const validBlock = createDefaultLessonBlock("richText");
  const issues = getLessonReadinessReport({
    version: 2,
    kind: "structured-lesson",
    summary: "Legacy imported lesson",
    objectives: ["Review malformed imports"],
    estimatedDurationMinutes: 5,
    completionMode: "manual",
    blocks: [null, undefined, {}, validBlock] as any,
  });

  assert.ok(Array.isArray(issues));
  assert.ok(!issues.some((issue) => issue.id === "visible-block-required"));
});
