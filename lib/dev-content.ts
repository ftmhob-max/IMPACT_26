import type { StructuredLessonDocument } from "@/lib/lessons/structured-content";

export interface DevFormula {
  id: string;
  code: string;
  name: string;
  expression: string;
  notes?: string | null;
  calcMetaJson?: string | null;
  examplesJson?: string | null;
  symbolsJson?: string | null;
}

export interface DevFormulaSection {
  id: string;
  code: string;
  title: string;
  position: number;
  formulas: DevFormula[];
}

export interface DevCourseLesson {
  id: string;
  title: string;
  position: number;
  lessonType: string;
  durationSeconds?: number | null;
  videoPlaybackId?: string | null;
  videoUrl?: string | null;
  quiz?: { id: string; title: string; timeLimitSeconds?: number | null; shuffleQuestions: boolean; shuffleChoices: boolean } | null;
  contentJson?: string | null;
  module?: {
    course: {
      slug: string;
      title: string;
    };
  };
}

export interface DevCourseModule {
  id: string;
  title: string;
  position: number;
  prerequisiteModuleIds?: string | null;
  lessons_on_module: DevCourseLesson[];
}

export interface DevCourse {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  modules_on_course: DevCourseModule[];
}

export interface DevQuizQuestion {
  id: string;
  questionText: string;
  questionType: string;
  difficulty: "easy" | "proficient" | "expert";
  domain: string;
  formulaRef?: string | null;
  topicTags?: string | null;
  rationale?: string | null;
  calculation?: string | null;
  sourceRef?: string | null;
  choices: Array<{ letter: "A" | "B" | "C" | "D"; choiceText: string; isCorrect: boolean; explanation?: string | null }>;
}

export interface DevQuiz {
  id: string;
  title: string;
  description?: string | null;
  timeLimitSeconds?: number | null;
  passingScore?: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  calculatorSettingsJson?: string | null;
  questions: DevQuizQuestion[];
}

const DEV_COURSE_ID = "8130c8f2-e834-43cc-aa61-092180207376";
const INTRO_MODULE_ID = "6e30b37b-6ad3-4fff-9a81-cfa63d2a41b5";
const DATA_MODULE_ID = "22222222-2222-4222-8222-222222222222";
const VALUATION_MODULE_ID = "33333333-3333-4333-8333-333333333333";
const APPEALS_MODULE_ID = "44444444-4444-4444-8444-444444444444";
const ANALYTICS_MODULE_ID = "55555555-5555-4555-8555-555555555555";
const DIAGNOSTIC_QUIZ_ID = "99999999-9999-4999-8999-999999999999";

function tiptapText(text: string) {
  return JSON.stringify({
    type: "doc",
    content: text.split("\n").filter(Boolean).map((paragraph) => ({
      type: "paragraph",
      content: [{ type: "text", text: paragraph }],
    })),
  });
}

function lessonDocument(input: {
  summary: string;
  objectives: string[];
  estimatedDurationMinutes: number;
  blocks: StructuredLessonDocument["blocks"];
}) {
  return JSON.stringify({
    version: 2,
    kind: "structured-lesson",
    summary: input.summary,
    objectives: input.objectives,
    estimatedDurationMinutes: input.estimatedDurationMinutes,
    completionMode: "manual",
    blocks: input.blocks,
  } satisfies StructuredLessonDocument);
}

function calcMeta(expression: string, outputKey: string, outputLabel: string, outputType: "currency" | "percentage" | "number" | "ratio", variables: Array<{ key: string; label: string; type: "currency" | "percentage" | "number" | "ratio"; helperText?: string }>) {
  return JSON.stringify({
    expression,
    output: { key: outputKey, label: outputLabel, type: outputType },
    variables: variables.map((variable) => ({ ...variable, required: true })),
  });
}

export const DEV_FORMULA_SECTIONS: DevFormulaSection[] = [
  {
    id: "3adf6e6f-4a7d-4f7b-9e79-8f85a1ac0101",
    code: "MV",
    title: "Market Value and Uniformity",
    position: 0,
    formulas: [
      {
        id: "11111111-aaaa-4aaa-8aaa-111111111111",
        code: "MV.F1",
        name: "Assessment-to-Sale Ratio",
        expression: "ASR = Assessed Value / Sale Price",
        notes: "Used to compare an assessment against recent market evidence.",
        calcMetaJson: calcMeta("assessedValue / salePrice", "asr", "Assessment-to-sale ratio", "ratio", [
          { key: "assessedValue", label: "Assessed value", type: "currency" },
          { key: "salePrice", label: "Sale price", type: "currency" },
        ]),
      },
      {
        id: "11111111-bbbb-4bbb-8bbb-111111111111",
        code: "MV.F2",
        name: "Uniformity Difference",
        expression: "Difference = Subject Ratio - Median Ratio",
        notes: "Helps learners see whether a property sits above or below a comparison set.",
        calcMetaJson: calcMeta("subjectRatio - medianRatio", "difference", "Ratio difference", "ratio", [
          { key: "subjectRatio", label: "Subject ratio", type: "ratio" },
          { key: "medianRatio", label: "Median comparison ratio", type: "ratio" },
        ]),
      },
    ],
  },
  {
    id: "3adf6e6f-4a7d-4f7b-9e79-8f85a1ac0102",
    code: "IN",
    title: "Income Approach",
    position: 1,
    formulas: [
      {
        id: "22222222-aaaa-4aaa-8aaa-222222222222",
        code: "IN.F1",
        name: "Direct Capitalization",
        expression: "Value = Net Operating Income / Capitalization Rate",
        notes: "Core income approach formula for stabilized income-producing property.",
        calcMetaJson: calcMeta("noi / capRate", "value", "Indicated value", "currency", [
          { key: "noi", label: "Net operating income", type: "currency" },
          { key: "capRate", label: "Capitalization rate as decimal", type: "ratio", helperText: "Use 0.07 for 7%." },
        ]),
      },
      {
        id: "22222222-bbbb-4bbb-8bbb-222222222222",
        code: "IN.F2",
        name: "Net Operating Income",
        expression: "NOI = Effective Gross Income - Operating Expenses",
        notes: "Separates income evidence from expense reasonableness before valuation.",
        calcMetaJson: calcMeta("effectiveGrossIncome - operatingExpenses", "noi", "Net operating income", "currency", [
          { key: "effectiveGrossIncome", label: "Effective gross income", type: "currency" },
          { key: "operatingExpenses", label: "Operating expenses", type: "currency" },
        ]),
      },
    ],
  },
  {
    id: "3adf6e6f-4a7d-4f7b-9e79-8f85a1ac0103",
    code: "CA",
    title: "Cost Approach",
    position: 2,
    formulas: [
      {
        id: "33333333-aaaa-4aaa-8aaa-333333333333",
        code: "CA.F1",
        name: "Depreciated Improvement Value",
        expression: "Improvement Value = Replacement Cost New - Depreciation",
        notes: "Useful for new construction, unique properties, or limited sales evidence.",
        calcMetaJson: calcMeta("replacementCostNew - depreciation", "improvementValue", "Improvement value", "currency", [
          { key: "replacementCostNew", label: "Replacement cost new", type: "currency" },
          { key: "depreciation", label: "Depreciation", type: "currency" },
        ]),
      },
      {
        id: "33333333-bbbb-4bbb-8bbb-333333333333",
        code: "CA.F2",
        name: "Cost Approach Indication",
        expression: "Value = Land Value + Depreciated Improvement Value",
        notes: "Combines land and improvement indications into a total market value indication.",
        calcMetaJson: calcMeta("landValue + improvementValue", "value", "Cost approach value", "currency", [
          { key: "landValue", label: "Land value", type: "currency" },
          { key: "improvementValue", label: "Depreciated improvement value", type: "currency" },
        ]),
      },
    ],
  },
  {
    id: "3adf6e6f-4a7d-4f7b-9e79-8f85a1ac0104",
    code: "RS",
    title: "Ratio Studies",
    position: 3,
    formulas: [
      {
        id: "44444444-aaaa-4aaa-8aaa-444444444444",
        code: "RS.F1",
        name: "Coefficient of Dispersion",
        expression: "COD = Average Absolute Deviation from Median Ratio / Median Ratio x 100",
        notes: "Measures how tightly assessment ratios cluster around the median.",
        calcMetaJson: calcMeta("(averageAbsoluteDeviation / medianRatio) * 100", "cod", "Coefficient of dispersion", "percentage", [
          { key: "averageAbsoluteDeviation", label: "Average absolute deviation", type: "ratio" },
          { key: "medianRatio", label: "Median ratio", type: "ratio" },
        ]),
      },
      {
        id: "44444444-bbbb-4bbb-8bbb-444444444444",
        code: "RS.F2",
        name: "Price-Related Differential",
        expression: "PRD = Mean Ratio / Weighted Mean Ratio",
        notes: "Used to identify regressivity or progressivity in an assessment sample.",
        calcMetaJson: calcMeta("meanRatio / weightedMeanRatio", "prd", "Price-related differential", "ratio", [
          { key: "meanRatio", label: "Mean ratio", type: "ratio" },
          { key: "weightedMeanRatio", label: "Weighted mean ratio", type: "ratio" },
        ]),
      },
    ],
  },
];

const courseTitle = "Philadelphia Property Assessment Academy";
const courseSlug = "philadelphia-property-assessment-academy";

function attachCourse(
  lesson: DevCourseLesson,
  course: { slug: string; title: string } = { slug: courseSlug, title: courseTitle }
): DevCourseLesson {
  return {
    ...lesson,
    module: {
      course: {
        slug: course.slug,
        title: course.title,
      },
    },
  };
}

export const DEV_QUIZZES: DevQuiz[] = [
  {
    id: DIAGNOSTIC_QUIZ_ID,
    title: "Philadelphia Evaluator Placement Diagnostic",
    description: "Scenario-based baseline check across market value, property data, appeals, income approach, and uniformity.",
    timeLimitSeconds: 900,
    passingScore: 70,
    shuffleQuestions: false,
    shuffleChoices: false,
    calculatorSettingsJson: JSON.stringify({ enabled: true, formulaScope: "all", showSteps: "always", recordUsage: false }),
    questions: [
      {
        id: "88888888-1111-4111-8111-888888888888",
        questionType: "scenario",
        difficulty: "easy",
        domain: "appeals",
        topicTags: "FLR|BRT|tax bill|market value",
        sourceRef: "Philadelphia OPA/BRT appeal guidance",
        questionText: "A homeowner requests review only because the real estate tax bill increased. Property characteristics appear accurate and no exemption issue is raised. What should an evaluator identify first?",
        rationale: "Philadelphia appeal and review workflows focus on market value, uniformity, property characteristics, and exemption or abatement status. Tax impact alone is not the valuation issue.",
        choices: [
          { letter: "A", choiceText: "Treat the tax bill increase alone as proof that the assessment is wrong.", isCorrect: false, explanation: "Tax impact alone does not establish an assessment error." },
          { letter: "B", choiceText: "Separate value, tax rate, exemption status, and billing impact before deciding the evidence need.", isCorrect: true, explanation: "This frames the correct assessment question." },
          { letter: "C", choiceText: "Ignore the request because taxpayers cannot ask about tax bills.", isCorrect: false, explanation: "The taxpayer can ask, but staff must route the issue correctly." },
          { letter: "D", choiceText: "Reduce the value to offset the higher bill.", isCorrect: false, explanation: "Assessment changes need defensible value or uniformity evidence." },
        ],
      },
      {
        id: "88888888-2222-4222-8222-888888888888",
        questionType: "multiple_choice",
        difficulty: "proficient",
        domain: "income_approach",
        formulaRef: "IN.F1",
        topicTags: "NOI|cap rate|multifamily",
        sourceRef: "Philadelphia commercial/multifamily documentation guidance",
        questionText: "A stabilized 12-unit building has supported NOI of $96,000 and a market cap rate of 8%. What is the direct capitalization indication?",
        calculation: "$96,000 / 0.08 = $1,200,000",
        rationale: "For income-producing property, direct capitalization converts stabilized NOI into an indicated market value.",
        choices: [
          { letter: "A", choiceText: "$768,000", isCorrect: false, explanation: "This multiplies NOI by the cap rate rather than dividing." },
          { letter: "B", choiceText: "$1,200,000", isCorrect: true, explanation: "NOI divided by cap rate equals $1,200,000." },
          { letter: "C", choiceText: "$960,000", isCorrect: false, explanation: "This uses an unsupported 10% rate." },
          { letter: "D", choiceText: "$12,000,000", isCorrect: false, explanation: "The cap rate must be entered as 0.08, not 0.008." },
        ],
      },
      {
        id: "88888888-3333-4333-8333-888888888888",
        questionType: "scenario",
        difficulty: "proficient",
        domain: "property_data",
        topicTags: "parcel record|field characteristics|rear addition",
        sourceRef: "OPA property assessment factors",
        questionText: "A parcel profile lists 1,200 sq. ft., but permits and photos show a rear addition. Which issue type is most direct?",
        rationale: "The immediate assessment concern is incorrect property characteristics that may affect value and should be documented before valuation conclusions.",
        choices: [
          { letter: "A", choiceText: "Ownership error", isCorrect: false, explanation: "The issue is about physical characteristics, not ownership." },
          { letter: "B", choiceText: "Tax rate error", isCorrect: false, explanation: "The tax rate is separate from the property record." },
          { letter: "C", choiceText: "Property characteristic data issue", isCorrect: true, explanation: "Square footage and addition evidence belong in the property data review." },
          { letter: "D", choiceText: "Nonprofit exemption issue", isCorrect: false, explanation: "No exemption status problem is described." },
        ],
      },
    ],
  },
];

export const DEV_COURSES: DevCourse[] = [
  {
    id: DEV_COURSE_ID,
    slug: courseSlug,
    title: courseTitle,
    description:
      "Scenario-based training for property evaluators covering Philadelphia OPA workflows, market value, uniformity, property data, valuation methods, appeals, ratio studies, and defensible taxpayer communication.",
    thumbnailUrl: null,
    modules_on_course: [
      {
        id: INTRO_MODULE_ID,
        title: "100 - Assessment Foundations",
        position: 1,
        prerequisiteModuleIds: null,
        lessons_on_module: [
          attachCourse({
            id: "11111111-1111-4111-8111-111111111111",
            title: "Introduction to Philadelphia Property Assessment",
            position: 1,
            lessonType: "text",
            durationSeconds: 900,
            quiz: { id: DIAGNOSTIC_QUIZ_ID, title: "Philadelphia Evaluator Placement Diagnostic", timeLimitSeconds: 900, shuffleQuestions: false, shuffleChoices: false },
            contentJson: lessonDocument({
              summary: "Understand what assessment is, how Philadelphia values property, and how value questions differ from tax bill questions.",
              objectives: ["Separate market value, assessed value, tax rate, exemptions, and billing impact.", "Identify OPA, BRT, taxpayer, and evaluator roles.", "Use a scenario to triage whether a taxpayer concern is an assessment issue."],
              estimatedDurationMinutes: 15,
              blocks: [
                {
                  id: "intro-reading",
                  type: "richText",
                  title: "Assessment is a value system, not just a tax bill",
                  isStudentVisible: true,
                  required: true,
                  contentKind: "tiptap",
                  content: tiptapText("Philadelphia property assessment work starts with market value and uniform treatment of similar properties. Tax bills matter to taxpayers, but evaluators need to distinguish value evidence from tax rate, exemption, abatement, and billing questions.\nOPA determines real property values for the city. BRT handles formal assessment appeals. Learners should be able to explain this split clearly before reviewing evidence."),
                },
                {
                  id: "intro-source",
                  type: "sourceReference",
                  title: "Official workflow anchor",
                  isStudentVisible: true,
                  required: false,
                  referenceLabel: "Philadelphia OPA and BRT",
                  excerpt: "Use local OPA/BRT guidance as the primary workflow reference for Philadelphia assessment review, First Level Review, evidence expectations, and appeal timing.",
                  sourceUrl: "https://www.phila.gov/departments/office-of-property-assessment/",
                },
                {
                  id: "intro-case",
                  type: "caseFile",
                  title: "Tax bill increase triage",
                  isStudentVisible: true,
                  required: true,
                  scenario: "A rowhome owner says the assessment must be wrong because the latest tax bill went up. The parcel record matches the property and no missing exemption is mentioned.",
                  parcelFacts: [
                    { label: "Property type", detail: "Two-story rowhome in South Philadelphia." },
                    { label: "Record status", detail: "Living area, use, and exterior characteristics appear consistent with available public records." },
                  ],
                  evidenceItems: [
                    { label: "Taxpayer concern", detail: "Financial impact and year-over-year bill increase.", sourceRef: "Call note" },
                    { label: "Assessment issue check", detail: "No comparable sales, uniformity evidence, characteristic error, or exemption issue submitted yet.", sourceRef: "FLR intake" },
                  ],
                  learnerTask: "Classify the concern as value, uniformity, property data, exemption/abatement, or tax bill impact. Identify what evidence would be needed before changing value.",
                  rubric: "Correct responses separate tax impact from assessment evidence, avoid promising a value reduction, and identify valid next evidence steps.",
                },
                {
                  id: "intro-checkpoint",
                  type: "quizCheckpoint",
                  title: "Placement diagnostic",
                  isStudentVisible: true,
                  required: false,
                  quizId: DIAGNOSTIC_QUIZ_ID,
                  titleText: "Placement diagnostic",
                  description: "Take this short diagnostic to route review toward foundations, valuation, data quality, appeals, or analytics.",
                  timeLimitSeconds: 900,
                  shuffleQuestions: false,
                  shuffleChoices: false,
                  glossaryEnabled: true,
                },
              ],
            }),
          }),
          attachCourse({
            id: "11111111-2222-4222-8222-111111111111",
            title: "Assessment Vocabulary and Core Concepts",
            position: 2,
            lessonType: "text",
            durationSeconds: 720,
            contentJson: lessonDocument({
              summary: "Build fluency in the terms learners need for market value, equity, comparables, CAMA, and ratio studies.",
              objectives: ["Define arm's-length sale, assessment ratio, comparable sale, CAMA, cost approach, and depreciation.", "Translate technical terms into taxpayer-ready language."],
              estimatedDurationMinutes: 12,
              blocks: [
                {
                  id: "vocab-glossary",
                  type: "glossaryTermSet",
                  title: "Core vocabulary",
                  isStudentVisible: true,
                  required: true,
                  displayMode: "cards",
                  terms: [
                    { term: "Market value", definition: "The value a property would likely sell for in an open and competitive market." },
                    { term: "Assessment ratio", definition: "The relationship between assessed value and market value or sale price." },
                    { term: "Comparable sale", definition: "A sale used as market evidence because it is similar to the subject property in relevant ways." },
                    { term: "Uniformity", definition: "The principle that similar properties should receive similar assessment treatment." },
                  ],
                },
                {
                  id: "vocab-reflection",
                  type: "reflectionPrompt",
                  title: "Explain it to a taxpayer",
                  isStudentVisible: true,
                  required: true,
                  prompt: "Write a two-sentence explanation of why a neighbor's lower tax bill does not automatically prove the subject property's market value is wrong.",
                  guidance: "Strong answers separate value, tax rate, relief programs, and physical/property differences.",
                },
              ],
            }),
          }),
        ],
      },
      {
        id: DATA_MODULE_ID,
        title: "100 - Property Records and Data Quality",
        position: 2,
        prerequisiteModuleIds: null,
        lessons_on_module: [
          attachCourse({
            id: "22222222-1111-4111-8111-222222222222",
            title: "Parcel Records and Field Characteristics",
            position: 1,
            lessonType: "text",
            durationSeconds: 840,
            contentJson: lessonDocument({
              summary: "Learn how parcel data, building characteristics, land data, permits, and public records become valuation inputs.",
              objectives: ["Identify record errors that affect value.", "Separate ownership, billing, exemption, and valuation data problems.", "Document correction evidence defensibly."],
              estimatedDurationMinutes: 14,
              blocks: [
                {
                  id: "records-reading",
                  type: "richText",
                  title: "Records become valuation inputs",
                  isStudentVisible: true,
                  required: true,
                  contentKind: "tiptap",
                  content: tiptapText("Mass appraisal depends on consistent property data. Size, age, location, condition, use, construction quality, land characteristics, and permit history can all affect value analysis.\nA good evaluator does not jump from one data mismatch to a value conclusion. First identify the data issue, find evidence, decide whether it affects value, and document the correction path."),
                },
                {
                  id: "records-case",
                  type: "caseFile",
                  title: "Rear addition data issue",
                  isStudentVisible: true,
                  required: true,
                  scenario: "A parcel record lists 1,200 sq. ft. Photos and permit history suggest a rear addition that may not be reflected in the field card.",
                  parcelFacts: [
                    { label: "Current record", detail: "1,200 sq. ft.; two bedrooms; one bath; average condition." },
                    { label: "Permit clue", detail: "Permit references a rear kitchen addition completed after the last listed inspection." },
                  ],
                  evidenceItems: [
                    { label: "Photo evidence", detail: "Street and aerial photos show a visible rear extension.", sourceRef: "Field photo packet" },
                    { label: "Permit history", detail: "Permit scope suggests additional finished area, but final measurement is missing.", sourceRef: "Permit record" },
                  ],
                  learnerTask: "Flag the data issue, state whether it affects ownership, value, billing, or appeal evidence, and list what verification is needed.",
                  rubric: "Learner should classify this as a property characteristic issue, avoid unsupported square-footage changes, and request/document verification.",
                },
              ],
            }),
          }),
        ],
      },
      {
        id: VALUATION_MODULE_ID,
        title: "200 - Valuation Methods",
        position: 3,
        prerequisiteModuleIds: null,
        lessons_on_module: [
          attachCourse({
            id: "33333333-1111-4111-8111-333333333333",
            title: "Residential Comparable Sales",
            position: 1,
            lessonType: "text",
            durationSeconds: 1020,
            contentJson: lessonDocument({
              summary: "Practice selecting comparable sales and explaining why proximity alone is not enough.",
              objectives: ["Select stronger residential comparables.", "Identify arm's-length and non-arm's-length sale concerns.", "Explain condition, size, location, and time adjustments."],
              estimatedDurationMinutes: 17,
              blocks: [
                {
                  id: "comps-reading",
                  type: "richText",
                  title: "Comparable sales need similarity and reliability",
                  isStudentVisible: true,
                  required: true,
                  contentKind: "tiptap",
                  content: tiptapText("A good comparable sale is not simply the nearest sale. Evaluators consider property type, location, size, age, condition, sale date, and whether the transaction appears arm's length.\nPhiladelphia rowhomes, twins, condos, renovated properties, and mixed-use buildings can require different comparable logic even when they are close on a map."),
                },
                {
                  id: "comps-case",
                  type: "caseFile",
                  title: "South Philadelphia rowhome comp screen",
                  isStudentVisible: true,
                  required: true,
                  scenario: "A taxpayer cites a nearby renovated neighbor that sold for less. The sale is close geographically but differs in condition, sale timing, and interior updates.",
                  parcelFacts: [
                    { label: "Subject", detail: "Unrenovated rowhome, 1,350 sq. ft., average condition." },
                    { label: "Cited sale", detail: "Nearby rowhome, smaller living area, sale date eight months prior, family transfer flag requires verification." },
                  ],
                  evidenceItems: [
                    { label: "Sale list", detail: "Eight candidate sales include three recent arm's-length rowhome sales in similar condition.", sourceRef: "Sales extract" },
                    { label: "Condition notes", detail: "Interior listing photos show different renovation levels across candidates.", sourceRef: "Listing review" },
                  ],
                  learnerTask: "Choose the best three comparables and explain why the taxpayer's cited sale should be accepted, adjusted, or excluded.",
                  rubric: "Strong answers prioritize arm's-length reliability, physical similarity, condition, timing, and clear adjustment rationale.",
                },
              ],
            }),
          }),
          attachCourse({
            id: "33333333-2222-4222-8222-333333333333",
            title: "Income Approach for Commercial and Multifamily Properties",
            position: 2,
            lessonType: "text",
            durationSeconds: 900,
            contentJson: lessonDocument({
              summary: "Use income, expense, rent roll, vacancy, and cap rate evidence to support value for income-producing properties.",
              objectives: ["Calculate a direct capitalization indication.", "Identify missing income and expense evidence.", "Explain stabilized income versus actual income."],
              estimatedDurationMinutes: 15,
              blocks: [
                {
                  id: "income-formula",
                  type: "formula",
                  title: "Direct capitalization",
                  isStudentVisible: true,
                  required: true,
                  formula: {
                    id: "22222222-aaaa-4aaa-8aaa-222222222222",
                    code: "IN.F1",
                    name: "Direct Capitalization",
                    expression: "Value = Net Operating Income / Capitalization Rate",
                    notes: "Use supported stabilized NOI and a market-supported cap rate.",
                    workedExample: "$96,000 NOI / 0.08 cap rate = $1,200,000 indicated value.",
                    relatedTerms: ["NOI", "Cap rate", "Stabilized income"],
                  },
                },
                {
                  id: "income-case",
                  type: "caseFile",
                  title: "Incomplete 12-unit rent roll",
                  isStudentVisible: true,
                  required: true,
                  scenario: "A 12-unit apartment appeal includes partial rent roll data and summary expenses, but two leases and several expense categories are missing.",
                  parcelFacts: [
                    { label: "Property type", detail: "12-unit apartment building with stabilized occupancy history." },
                    { label: "Submitted value claim", detail: "Owner requests a lower value based on actual income." },
                  ],
                  evidenceItems: [
                    { label: "Rent roll", detail: "Ten occupied units documented; two units missing lease support.", sourceRef: "Rent roll" },
                    { label: "Expense statement", detail: "Insurance and repairs included; management and reserves omitted.", sourceRef: "Income/expense statement" },
                  ],
                  learnerTask: "Identify missing documentation, calculate the supported value if NOI is $96,000 and cap rate is 8%, and state whether the file is ready for a defensible decision.",
                  rubric: "Learner should request missing lease/expense support, calculate $1,200,000, and distinguish incomplete evidence from a supported reduction.",
                },
              ],
            }),
          }),
        ],
      },
      {
        id: APPEALS_MODULE_ID,
        title: "300 - FLR, BRT Appeals, and Tax Relief",
        position: 4,
        prerequisiteModuleIds: null,
        lessons_on_module: [
          attachCourse({
            id: "44444444-1111-4111-8111-444444444444",
            title: "First Level Review and BRT Appeals",
            position: 1,
            lessonType: "text",
            durationSeconds: 960,
            contentJson: lessonDocument({
              summary: "Triage valid appeal grounds and build evidence packets for Philadelphia assessment challenges.",
              objectives: ["Differentiate FLR from formal BRT appeals.", "Identify valid and invalid grounds.", "Build an evidence checklist for residential and income-producing property."],
              estimatedDurationMinutes: 16,
              blocks: [
                {
                  id: "appeals-reading",
                  type: "richText",
                  title: "Appeals need evidence, not just frustration",
                  isStudentVisible: true,
                  required: true,
                  contentKind: "tiptap",
                  content: tiptapText("Valid assessment review questions usually involve incorrect market value, non-uniformity, incorrect property characteristics, or incorrect exemption or abatement status. The evaluator's job is to keep the process understandable while documenting the evidence behind each decision."),
                },
                {
                  id: "appeals-case",
                  type: "caseFile",
                  title: "Appeal packet completeness review",
                  isStudentVisible: true,
                  required: true,
                  scenario: "A mixed-use building appeal includes photos, a short owner memo, and two sales, but no rent roll or income and expense support.",
                  parcelFacts: [
                    { label: "Property type", detail: "Ground-floor retail with apartments above." },
                    { label: "Claim", detail: "Owner says assessment is too high and not uniform with nearby properties." },
                  ],
                  evidenceItems: [
                    { label: "Photos", detail: "Exterior and several interior condition photos.", sourceRef: "Photo packet" },
                    { label: "Sales", detail: "Two sales with different use mix and unknown financing terms.", sourceRef: "Sales sheet" },
                    { label: "Missing", detail: "No rent roll, leases, or income and expense statement.", sourceRef: "Appeal checklist" },
                  ],
                  learnerTask: "Classify the packet as complete, incomplete, or unsupported and list the next evidence requests.",
                  rubric: "Strong answers cite missing income support for mixed-use review and avoid deciding value on incomplete evidence.",
                },
              ],
            }),
          }),
        ],
      },
      {
        id: ANALYTICS_MODULE_ID,
        title: "300 - Ratio Studies and Assessment Equity",
        position: 5,
        prerequisiteModuleIds: null,
        lessons_on_module: [
          attachCourse({
            id: "55555555-1111-4111-8111-555555555555",
            title: "Ratio Studies and Uniformity",
            position: 1,
            lessonType: "text",
            durationSeconds: 900,
            contentJson: lessonDocument({
              summary: "Use assessment-to-sale ratios, COD, PRD, and equity language to review assessment quality.",
              objectives: ["Calculate basic assessment ratios.", "Explain median ratio, COD, and PRD.", "Identify uniformity concerns in a small sample."],
              estimatedDurationMinutes: 15,
              blocks: [
                {
                  id: "ratio-formula",
                  type: "formula",
                  title: "Assessment-to-sale ratio",
                  isStudentVisible: true,
                  required: true,
                  formula: {
                    id: "11111111-aaaa-4aaa-8aaa-111111111111",
                    code: "MV.F1",
                    name: "Assessment-to-Sale Ratio",
                    expression: "ASR = Assessed Value / Sale Price",
                    notes: "A ratio above the local comparison median may suggest over-assessment; below may suggest under-assessment.",
                    workedExample: "$240,000 assessed value / $300,000 sale price = 0.80.",
                    relatedTerms: ["Median ratio", "COD", "Uniformity"],
                  },
                },
                {
                  id: "ratio-case",
                  type: "caseFile",
                  title: "Mini ratio study memo",
                  isStudentVisible: true,
                  required: true,
                  scenario: "A supervisor asks whether a sample of recent residential sales suggests a uniformity issue in one market area.",
                  parcelFacts: [
                    { label: "Sample", detail: "Ten recent arm's-length residential sales in a defined market area." },
                    { label: "Concern", detail: "Lower-priced properties appear to have higher assessment ratios than higher-priced properties." },
                  ],
                  evidenceItems: [
                    { label: "Ratios", detail: "Median ratio: 0.81. Mean ratio: 0.86. Weighted mean ratio: 0.78.", sourceRef: "Sales ratio worksheet" },
                    { label: "PRD", detail: "PRD = 0.86 / 0.78 = 1.1026.", sourceRef: "Formula Compass" },
                  ],
                  learnerTask: "Prepare a short quality memo describing whether the sample suggests possible regressivity and what review should happen next.",
                  rubric: "Strong answers explain the signal cautiously, mention sample limits, and recommend further review rather than overclaiming.",
                },
              ],
            }),
          }),
        ],
      },
    ],
  },
  {
    id: "aaaaaaaa-1000-4000-8000-000000000001",
    slug: "core-evaluator-valuation-methods",
    title: "Core Evaluator Track: Valuation Methods",
    description:
      "Intermediate evaluator training for residential comparable sales, cost approach, income approach, and defensible valuation notes.",
    thumbnailUrl: null,
    modules_on_course: [
      {
        id: "aaaaaaaa-1100-4000-8000-000000000001",
        title: "200 - Residential Market Evidence",
        position: 1,
        prerequisiteModuleIds: null,
        lessons_on_module: [
          attachCourse(
            {
              id: "aaaaaaaa-1110-4000-8000-000000000001",
              title: "Residential Comp Selection Lab",
              position: 1,
              lessonType: "text",
              durationSeconds: 960,
              contentJson: lessonDocument({
                summary: "Choose defensible residential comparables by weighing sale reliability, location, condition, time, and property characteristics.",
                objectives: ["Screen arm's-length reliability.", "Rank comparable strength.", "Write a defensible comp selection note."],
                estimatedDurationMinutes: 16,
                blocks: [
                  {
                    id: "res-comp-source",
                    type: "sourceReference",
                    title: "OPA residential factors",
                    isStudentVisible: true,
                    required: false,
                    referenceLabel: "Philadelphia OPA property assessments",
                    excerpt: "OPA describes residential assessment factors including size, age, location, condition, recent comparable sales, and differences between sold properties and the subject.",
                    sourceUrl: "https://www.phila.gov/departments/office-of-property-assessment/property-assessments/",
                  },
                  {
                    id: "res-comp-case",
                    type: "caseFile",
                    title: "Eight-sale comp screen",
                    isStudentVisible: true,
                    required: true,
                    scenario: "A Northeast twin has eight nearby sales. The closest sale is a family transfer, two sales are renovated flips, and three sales are older but physically similar.",
                    parcelFacts: [
                      { label: "Subject", detail: "Twin, 1,620 sq. ft., built 1955, average condition, one-car garage." },
                      { label: "Market context", detail: "Stable residential block with mixed renovation levels." },
                    ],
                    evidenceItems: [
                      { label: "Candidate sales", detail: "Eight sales within a half-mile; sale dates range from 2 to 14 months before valuation date.", sourceRef: "Sales extract" },
                      { label: "Reliability flags", detail: "One family transfer, one sheriff sale, two flips with major renovation indicators.", sourceRef: "Sales verification" },
                      { label: "Physical comparison", detail: "Three arm's-length twins are similar in size, age, garage utility, and condition.", sourceRef: "Comp grid" },
                    ],
                    learnerTask: "Select the strongest three comparables, reject or flag weak sales, and write a concise comp selection rationale.",
                    rubric: "Strong answers prioritize verified arm's-length sales, explain rejected transactions, and avoid relying only on distance.",
                  },
                ],
              }),
            },
            { slug: "core-evaluator-valuation-methods", title: "Core Evaluator Track: Valuation Methods" }
          ),
          attachCourse(
            {
              id: "aaaaaaaa-1120-4000-8000-000000000001",
              title: "Comparable Adjustment Grid",
              position: 2,
              lessonType: "text",
              durationSeconds: 840,
              contentJson: lessonDocument({
                summary: "Practice translating differences in time, condition, size, and amenities into an adjustment grid.",
                objectives: ["Identify adjustment categories.", "Explain direction of adjustment.", "Avoid unsupported precision."],
                estimatedDurationMinutes: 14,
                blocks: [
                  {
                    id: "adjustment-reading",
                    type: "richText",
                    title: "Adjustment logic",
                    isStudentVisible: true,
                    required: true,
                    contentKind: "tiptap",
                    content: tiptapText("Comparable adjustments should explain how the sale differs from the subject property. In training scenarios, the goal is not false precision; it is a defensible chain from observed differences to a value indication.\nEvaluators should document whether the adjustment is supported by market evidence, model output, paired sales, or professional judgment."),
                  },
                  {
                    id: "adjustment-reflection",
                    type: "reflectionPrompt",
                    title: "Defend the grid",
                    isStudentVisible: true,
                    required: true,
                    prompt: "Write the note you would attach to a comp grid where the closest sale is rejected and a slightly farther sale is retained.",
                    guidance: "Mention transaction reliability, physical similarity, and market behavior before distance.",
                  },
                ],
              }),
            },
            { slug: "core-evaluator-valuation-methods", title: "Core Evaluator Track: Valuation Methods" }
          ),
        ],
      },
      {
        id: "aaaaaaaa-1200-4000-8000-000000000001",
        title: "200 - Cost and Income Methods",
        position: 2,
        prerequisiteModuleIds: null,
        lessons_on_module: [
          attachCourse(
            {
              id: "aaaaaaaa-1210-4000-8000-000000000001",
              title: "Cost Approach for New Construction",
              position: 1,
              lessonType: "text",
              durationSeconds: 900,
              contentJson: lessonDocument({
                summary: "Use land value, replacement cost new, depreciation, and completion status to review cost approach scenarios.",
                objectives: ["Calculate depreciated improvement value.", "Separate physical depreciation from functional and external obsolescence.", "Document partial completion issues."],
                estimatedDurationMinutes: 15,
                blocks: [
                  {
                    id: "cost-formula",
                    type: "formula",
                    title: "Cost approach indication",
                    isStudentVisible: true,
                    required: true,
                    formula: {
                      id: "33333333-bbbb-4bbb-8bbb-333333333333",
                      code: "CA.F2",
                      name: "Cost Approach Indication",
                      expression: "Value = Land Value + Depreciated Improvement Value",
                      notes: "Use when sales evidence is limited or the property is new, special-purpose, or partially complete.",
                      workedExample: "$140,000 land value + $310,000 depreciated improvement value = $450,000 indicated value.",
                      relatedTerms: ["Land value", "Replacement cost new", "Depreciation"],
                    },
                  },
                  {
                    id: "cost-case",
                    type: "caseFile",
                    title: "Partial completion abatement review",
                    isStudentVisible: true,
                    required: true,
                    scenario: "A new construction property is under review with an abatement application. The shell is complete, interior finishes are incomplete, and permit records conflict with field photos.",
                    parcelFacts: [
                      { label: "Subject", detail: "New residential construction with active permits and partial interior completion." },
                      { label: "Assessment concern", detail: "Improvement value may not reflect completion status as of the relevant date." },
                    ],
                    evidenceItems: [
                      { label: "Permit history", detail: "Final inspection not recorded; mechanical and finish permits remain open.", sourceRef: "Permit record" },
                      { label: "Field photos", detail: "Exterior complete; interior finishes and fixtures incomplete.", sourceRef: "Field review" },
                      { label: "Cost worksheet", detail: "Replacement cost new estimated, but depreciation/completion allowance is undocumented.", sourceRef: "Cost file" },
                    ],
                    learnerTask: "Identify the cost approach inputs, flag missing completion support, and write what documentation is needed before finalizing value.",
                    rubric: "Strong answers separate land value, improvement value, depreciation/completion status, and abatement/tax relief treatment.",
                  },
                ],
              }),
            },
            { slug: "core-evaluator-valuation-methods", title: "Core Evaluator Track: Valuation Methods" }
          ),
          attachCourse(
            {
              id: "aaaaaaaa-1220-4000-8000-000000000001",
              title: "Income Approach Rent Roll Review",
              position: 2,
              lessonType: "text",
              durationSeconds: 960,
              contentJson: lessonDocument({
                summary: "Review rent rolls, leases, vacancy, expenses, and stabilized income before applying a cap rate.",
                objectives: ["Identify missing income documentation.", "Normalize obvious income/expense issues.", "Use cap rate sensitivity responsibly."],
                estimatedDurationMinutes: 16,
                blocks: [
                  {
                    id: "income-source",
                    type: "sourceReference",
                    title: "Commercial and multifamily evidence",
                    isStudentVisible: true,
                    required: false,
                    referenceLabel: "Philadelphia OPA FLR guidance",
                    excerpt: "Philadelphia's OPA guidance describes income and expense information as part of commercial and multifamily review.",
                    sourceUrl: "https://www.phila.gov/departments/office-of-property-assessment/property-assessments/",
                  },
                  {
                    id: "income-noi-formula",
                    type: "formula",
                    title: "Net operating income",
                    isStudentVisible: true,
                    required: true,
                    formula: {
                      id: "22222222-bbbb-4bbb-8bbb-222222222222",
                      code: "IN.F2",
                      name: "Net Operating Income",
                      expression: "NOI = Effective Gross Income - Operating Expenses",
                      notes: "Use supported market or stabilized evidence before capitalizing.",
                      workedExample: "$180,000 EGI - $68,000 expenses = $112,000 NOI.",
                      relatedTerms: ["Rent roll", "Vacancy", "Operating expenses"],
                    },
                  },
                  {
                    id: "income-rent-roll-case",
                    type: "caseFile",
                    title: "Rent roll consistency check",
                    isStudentVisible: true,
                    required: true,
                    scenario: "A small apartment building submits a rent roll with three month-to-month tenants, one vacant unit, and expenses that include debt service.",
                    parcelFacts: [
                      { label: "Property", detail: "Eight-unit apartment building, mixed lease terms, one reported vacancy." },
                      { label: "Owner request", detail: "Owner asks for a value reduction based on actual income." },
                    ],
                    evidenceItems: [
                      { label: "Rent roll", detail: "Five annual leases, three month-to-month records, one vacant unit with no market rent support.", sourceRef: "Rent roll" },
                      { label: "Expense statement", detail: "Includes repairs, insurance, utilities, debt service, and owner travel.", sourceRef: "I/E statement" },
                    ],
                    learnerTask: "Identify non-operating expenses, missing market rent support, and whether the file is ready for direct capitalization.",
                    rubric: "Strong answers remove debt service from operating expenses, request vacancy/market rent support, and avoid capitalizing unsupported NOI.",
                  },
                ],
              }),
            },
            { slug: "core-evaluator-valuation-methods", title: "Core Evaluator Track: Valuation Methods" }
          ),
        ],
      },
    ],
  },
  {
    id: "bbbbbbbb-1000-4000-8000-000000000001",
    slug: "philadelphia-applied-practice",
    title: "Philadelphia Applied Practice Track",
    description:
      "Hands-on Philadelphia workflow training for OPA methodology, Geographic Market Areas, First Level Review, BRT appeals, exemptions, and abatements.",
    thumbnailUrl: null,
    modules_on_course: [
      {
        id: "bbbbbbbb-1100-4000-8000-000000000001",
        title: "200 - OPA Methodology and GMAs",
        position: 1,
        prerequisiteModuleIds: null,
        lessons_on_module: [
          attachCourse(
            {
              id: "bbbbbbbb-1110-4000-8000-000000000001",
              title: "OPA Methodology and Geographic Market Areas",
              position: 1,
              lessonType: "text",
              durationSeconds: 900,
              contentJson: lessonDocument({
                summary: "Explain how OPA uses sales data and Geographic Market Areas to understand similar market behavior.",
                objectives: ["Describe GMA purpose.", "Explain why nearby properties can belong to different market contexts.", "Use methodology references in taxpayer explanations."],
                estimatedDurationMinutes: 15,
                blocks: [
                  {
                    id: "gma-source",
                    type: "sourceReference",
                    title: "Geographic Market Areas",
                    isStudentVisible: true,
                    required: false,
                    referenceLabel: "Philadelphia OPA property assessments",
                    excerpt: "OPA says it reviews sales data to identify where similar properties sell for similar prices and that GMAs are more specific than broad neighborhood breakdowns.",
                    sourceUrl: "https://www.phila.gov/departments/office-of-property-assessment/property-assessments/",
                  },
                  {
                    id: "gma-case",
                    type: "caseFile",
                    title: "Adjacent blocks, different market behavior",
                    isStudentVisible: true,
                    required: true,
                    scenario: "Two nearby rowhomes sit four blocks apart. One is in a high-renovation corridor and one is in a slower-sale pocket. A taxpayer argues they must be treated the same because they share a neighborhood name.",
                    parcelFacts: [
                      { label: "Subject", detail: "Average-condition rowhome outside the renovation corridor." },
                      { label: "Comparison property", detail: "Recently renovated rowhome near transit and higher sale velocity." },
                    ],
                    evidenceItems: [
                      { label: "Sales pattern", detail: "Recent sales cluster at different price levels despite similar broad neighborhood label.", sourceRef: "GMA sales review" },
                      { label: "Map note", detail: "OPA GMA boundary follows observed market behavior rather than informal neighborhood name alone.", sourceRef: "Methodology map" },
                    ],
                    learnerTask: "Write a taxpayer-facing explanation for why similar-looking nearby properties can have different market context.",
                    rubric: "Strong answers use market behavior, comparable sales, and GMA purpose without implying arbitrary boundary decisions.",
                  },
                ],
              }),
            },
            { slug: "philadelphia-applied-practice", title: "Philadelphia Applied Practice Track" }
          ),
          attachCourse(
            {
              id: "bbbbbbbb-1120-4000-8000-000000000001",
              title: "Methodology Summary Review",
              position: 2,
              lessonType: "text",
              durationSeconds: 780,
              contentJson: lessonDocument({
                summary: "Practice turning methodology documents and reassessment maps into plain-language explanations.",
                objectives: ["Read methodology summaries for model inputs.", "Identify where field inspections, permits, deeds, listings, and sales data support values.", "Communicate methodology without overpromising precision."],
                estimatedDurationMinutes: 13,
                blocks: [
                  {
                    id: "method-source",
                    type: "sourceReference",
                    title: "Assessment methodologies",
                    isStudentVisible: true,
                    required: false,
                    referenceLabel: "Philadelphia OPA methodology documents",
                    excerpt: "OPA publishes assessment methodology documents and reassessment maps for tax years.",
                    sourceUrl: "https://www.phila.gov/documents/assessment-methodologies/",
                  },
                  {
                    id: "method-reflection",
                    type: "reflectionPrompt",
                    title: "Translate methodology",
                    isStudentVisible: true,
                    required: true,
                    prompt: "Rewrite this idea for a taxpayer: model outputs are reviewed against sales, property characteristics, and market area behavior.",
                    guidance: "Good answers are clear about evidence and review without using jargon like CAMA unless defined.",
                  },
                ],
              }),
            },
            { slug: "philadelphia-applied-practice", title: "Philadelphia Applied Practice Track" }
          ),
        ],
      },
      {
        id: "bbbbbbbb-1200-4000-8000-000000000001",
        title: "300 - Review, Appeals, and Relief",
        position: 2,
        prerequisiteModuleIds: null,
        lessons_on_module: [
          attachCourse(
            {
              id: "bbbbbbbb-1210-4000-8000-000000000001",
              title: "First Level Review Evidence Triage",
              position: 1,
              lessonType: "text",
              durationSeconds: 960,
              contentJson: lessonDocument({
                summary: "Classify FLR requests by valid grounds and determine the evidence needed for review.",
                objectives: ["Identify valid FLR grounds.", "Reject financial-impact-only reasoning.", "Build evidence requests by property type."],
                estimatedDurationMinutes: 16,
                blocks: [
                  {
                    id: "flr-source",
                    type: "sourceReference",
                    title: "FLR grounds",
                    isStudentVisible: true,
                    required: false,
                    referenceLabel: "Philadelphia OPA FLR guidance",
                    excerpt: "OPA identifies market value/property characteristic issues, non-uniformity, and incorrect exemption or abatement as review grounds; financial impact alone is not sufficient.",
                    sourceUrl: "https://www.phila.gov/departments/office-of-property-assessment/property-assessments/",
                  },
                  {
                    id: "flr-case",
                    type: "caseFile",
                    title: "Four FLR intake packets",
                    isStudentVisible: true,
                    required: true,
                    scenario: "A review queue contains four FLR packets: one with photos of incorrect condition, one tax-bill complaint, one non-uniformity comp set, and one missing abatement claim.",
                    parcelFacts: [
                      { label: "Queue", detail: "Residential parcels with mixed intake reasons." },
                      { label: "Evaluator task", detail: "Route each packet to the correct evidence pathway." },
                    ],
                    evidenceItems: [
                      { label: "Packet A", detail: "Interior photos show severe fire damage not reflected in condition coding.", sourceRef: "Photos" },
                      { label: "Packet B", detail: "Owner states the tax bill is unaffordable; no value evidence attached.", sourceRef: "Owner statement" },
                      { label: "Packet C", detail: "Five nearby comparable properties with lower assessment ratios.", sourceRef: "Uniformity worksheet" },
                      { label: "Packet D", detail: "New construction abatement approval claimed but not visible in taxable value.", sourceRef: "Abatement notice" },
                    ],
                    learnerTask: "Classify each packet as market/characteristics, financial impact only, non-uniformity, or exemption/abatement issue.",
                    rubric: "Strong answers triage all four packets and clearly identify why Packet B is not sufficient by itself.",
                  },
                ],
              }),
            },
            { slug: "philadelphia-applied-practice", title: "Philadelphia Applied Practice Track" }
          ),
          attachCourse(
            {
              id: "bbbbbbbb-1220-4000-8000-000000000001",
              title: "BRT Hearing Preparation",
              position: 2,
              lessonType: "text",
              durationSeconds: 900,
              contentJson: lessonDocument({
                summary: "Prepare an appeal file for formal BRT review with the right documentation, narrative, and evidence gaps.",
                objectives: ["Differentiate FLR from formal appeal prep.", "Assemble property-type evidence.", "Write a hearing prep memo."],
                estimatedDurationMinutes: 15,
                blocks: [
                  {
                    id: "brt-source",
                    type: "sourceReference",
                    title: "BRT property assessment appeals",
                    isStudentVisible: true,
                    required: false,
                    referenceLabel: "Philadelphia Board of Revision of Taxes",
                    excerpt: "BRT appeal guidance describes formal property assessment appeal requirements and documentation expectations.",
                    sourceUrl: "https://www.phila.gov/departments/board-of-revision-of-taxes/property-assessment-appeals/",
                  },
                  {
                    id: "brt-case",
                    type: "caseFile",
                    title: "Commercial hearing file",
                    isStudentVisible: true,
                    required: true,
                    scenario: "A retail property appeal is scheduled for hearing. The file contains an appraisal, two leases, a rent roll, exterior photos, and a taxpayer memo challenging uniformity.",
                    parcelFacts: [
                      { label: "Property", detail: "Single-tenant retail building with surface parking." },
                      { label: "Appeal claim", detail: "Market value too high and not uniform with nearby retail parcels." },
                    ],
                    evidenceItems: [
                      { label: "Appraisal", detail: "Uses three sales and an income approach; report date is current.", sourceRef: "Appraisal" },
                      { label: "Rent roll", detail: "Current rent roll aligns with submitted lease schedule.", sourceRef: "Rent roll" },
                      { label: "Uniformity memo", detail: "References three nearby properties without sales or ratio support.", sourceRef: "Taxpayer memo" },
                    ],
                    learnerTask: "Prepare a hearing prep memo that identifies strong evidence, weak evidence, and questions for the evaluator or representative.",
                    rubric: "Strong answers separate market value support from uniformity support and flag unsupported neighbor comparisons.",
                  },
                ],
              }),
            },
            { slug: "philadelphia-applied-practice", title: "Philadelphia Applied Practice Track" }
          ),
          attachCourse(
            {
              id: "bbbbbbbb-1230-4000-8000-000000000001",
              title: "Exemptions, Abatements, and Taxable Value",
              position: 3,
              lessonType: "text",
              durationSeconds: 840,
              contentJson: lessonDocument({
                summary: "Separate market value from taxable value and route exemption or abatement problems correctly.",
                objectives: ["Differentiate value reduction from tax relief.", "Identify missing or incorrect relief status.", "Explain relief issues without changing market value unsupportedly."],
                estimatedDurationMinutes: 14,
                blocks: [
                  {
                    id: "relief-glossary",
                    type: "glossaryTermSet",
                    title: "Relief vocabulary",
                    isStudentVisible: true,
                    required: true,
                    displayMode: "cards",
                    terms: [
                      { term: "Assessment value", definition: "The value assigned to the property for assessment purposes." },
                      { term: "Taxable value", definition: "The value after applicable exemptions or abatements are applied for tax calculation." },
                      { term: "Abatement", definition: "A program that can reduce taxable improvement value for eligible property improvements." },
                      { term: "Exemption", definition: "A program that can reduce the amount of value subject to tax for eligible owners or properties." },
                    ],
                  },
                  {
                    id: "relief-case",
                    type: "caseFile",
                    title: "Correct value, missing relief",
                    isStudentVisible: true,
                    required: true,
                    scenario: "A property's market value appears well supported, but the taxpayer says the Homestead exemption is missing and a new construction abatement was expected.",
                    parcelFacts: [
                      { label: "Market value", detail: "Comparable sales support the current assessment." },
                      { label: "Taxpayer concern", detail: "Taxable value appears higher than expected due to missing relief." },
                    ],
                    evidenceItems: [
                      { label: "Exemption claim", detail: "Owner occupied the property and submitted an application confirmation.", sourceRef: "Homestead record" },
                      { label: "Abatement claim", detail: "Improvement permit and approval letter submitted; taxable improvement value needs review.", sourceRef: "Abatement packet" },
                    ],
                    learnerTask: "Explain why this is not automatically a market value reduction and list the relief-status checks needed.",
                    rubric: "Strong answers keep market value separate from relief administration and route missing exemption/abatement evidence correctly.",
                  },
                ],
              }),
            },
            { slug: "philadelphia-applied-practice", title: "Philadelphia Applied Practice Track" }
          ),
        ],
      },
    ],
  },
  {
    id: "cccccccc-1000-4000-8000-000000000001",
    slug: "data-quality-analytics-track",
    title: "Data, Quality, and Analytics Track",
    description:
      "Advanced training for assessment data quality, sales verification, ratio studies, mass appraisal, CAMA review, and AVM reasonableness.",
    thumbnailUrl: null,
    modules_on_course: [
      {
        id: "cccccccc-1100-4000-8000-000000000001",
        title: "300 - Data Quality and Sales Verification",
        position: 1,
        prerequisiteModuleIds: null,
        lessons_on_module: [
          attachCourse(
            {
              id: "cccccccc-1110-4000-8000-000000000001",
              title: "Assessment Data Quality Review",
              position: 1,
              lessonType: "text",
              durationSeconds: 900,
              contentJson: lessonDocument({
                summary: "Audit parcel data for missing values, inconsistent characteristics, duplicate records, stale condition, and cross-source conflicts.",
                objectives: ["Build a QA checklist.", "Distinguish field verification from desk review.", "Document transparent data changes."],
                estimatedDurationMinutes: 15,
                blocks: [
                  {
                    id: "dq-source",
                    type: "sourceReference",
                    title: "IAAO data quality standard",
                    isStudentVisible: true,
                    required: false,
                    referenceLabel: "IAAO Technical Standards",
                    excerpt: "IAAO technical standards include data quality, sales verification, mass appraisal, and ratio studies as assessment administration topics.",
                    sourceUrl: "https://www.iaao.org/wcm/Resources/Technical_Standards/wcm/Resources_Content/Pubs/Technical_Standards.aspx?hkey=cbdaa52a-c99f-4ded-aaf0-d33d364d8912",
                  },
                  {
                    id: "dq-case",
                    type: "caseFile",
                    title: "Twenty-five parcel QA queue",
                    isStudentVisible: true,
                    required: true,
                    scenario: "A QA queue flags 25 records with missing square footage, duplicate parcel references, permit conflicts, and condition codes unchanged for 20 years.",
                    parcelFacts: [
                      { label: "Queue type", detail: "Mixed residential and small multifamily parcels." },
                      { label: "Review goal", detail: "Prioritize fixes that could materially affect valuation or appeal readiness." },
                    ],
                    evidenceItems: [
                      { label: "Permit conflict", detail: "Five parcels have permits for additions not reflected in building area.", sourceRef: "Permit/deed join" },
                      { label: "Duplicate signal", detail: "Two records share ownership, situs, and land area but have different parcel IDs.", sourceRef: "Parcel QA" },
                      { label: "Condition mismatch", detail: "Exterior photos conflict with average/good condition codes.", sourceRef: "Photo review" },
                    ],
                    learnerTask: "Rank the QA issues by valuation risk and write the first three review actions.",
                    rubric: "Strong answers prioritize characteristic errors and duplicate records, separate field review needs, and document audit trail expectations.",
                  },
                ],
              }),
            },
            { slug: "data-quality-analytics-track", title: "Data, Quality, and Analytics Track" }
          ),
          attachCourse(
            {
              id: "cccccccc-1120-4000-8000-000000000001",
              title: "Sales Verification and Exclusion Logic",
              position: 2,
              lessonType: "text",
              durationSeconds: 840,
              contentJson: lessonDocument({
                summary: "Decide when a sale can support assessment analysis and when it needs verification, adjustment, or exclusion.",
                objectives: ["Identify non-arm's-length indicators.", "Document exclusion reasons.", "Protect ratio study reliability."],
                estimatedDurationMinutes: 14,
                blocks: [
                  {
                    id: "sales-verification-case",
                    type: "caseFile",
                    title: "Questionable sale sample",
                    isStudentVisible: true,
                    required: true,
                    scenario: "A ratio study candidate sample includes sheriff sales, family transfers, portfolio sales, and one sale with seller concessions.",
                    parcelFacts: [
                      { label: "Sample", detail: "Thirty residential sales in the same market area." },
                      { label: "Analyst concern", detail: "Several sales may distort the median ratio and COD." },
                    ],
                    evidenceItems: [
                      { label: "Sheriff sale", detail: "Recorded below market with distress indicator.", sourceRef: "Deed/sale notes" },
                      { label: "Family transfer", detail: "Buyer and seller share surname and mailing address.", sourceRef: "Transfer review" },
                      { label: "Concession sale", detail: "MLS notes seller paid repair credit.", sourceRef: "Listing notes" },
                    ],
                    learnerTask: "Mark each sale as usable, verify, adjust, or exclude and write the documentation reason.",
                    rubric: "Strong answers do not over-exclude automatically, but they document verification and protect study reliability.",
                  },
                ],
              }),
            },
            { slug: "data-quality-analytics-track", title: "Data, Quality, and Analytics Track" }
          ),
        ],
      },
      {
        id: "cccccccc-1200-4000-8000-000000000001",
        title: "400 - Ratio Studies, CAMA, and AVMs",
        position: 2,
        prerequisiteModuleIds: null,
        lessons_on_module: [
          attachCourse(
            {
              id: "cccccccc-1210-4000-8000-000000000001",
              title: "Ratio Study Interpretation Lab",
              position: 1,
              lessonType: "text",
              durationSeconds: 960,
              contentJson: lessonDocument({
                summary: "Interpret median ratio, COD, and PRD as quality signals, then communicate what they do and do not prove.",
                objectives: ["Calculate COD and PRD.", "Identify possible regressivity/progressivity.", "Write a quality memo with limitations."],
                estimatedDurationMinutes: 16,
                blocks: [
                  {
                    id: "cod-formula",
                    type: "formula",
                    title: "Coefficient of dispersion",
                    isStudentVisible: true,
                    required: true,
                    formula: {
                      id: "44444444-aaaa-4aaa-8aaa-444444444444",
                      code: "RS.F1",
                      name: "Coefficient of Dispersion",
                      expression: "COD = Average Absolute Deviation from Median Ratio / Median Ratio x 100",
                      notes: "Measures assessment uniformity around the median ratio.",
                      workedExample: "0.08 average absolute deviation / 0.80 median ratio x 100 = COD of 10.",
                      relatedTerms: ["Median ratio", "Uniformity", "Ratio study"],
                    },
                  },
                  {
                    id: "ratio-study-source",
                    type: "sourceReference",
                    title: "Annual ratio studies",
                    isStudentVisible: true,
                    required: false,
                    referenceLabel: "Philadelphia OPA ratio studies",
                    excerpt: "OPA publishes annual ratio studies comparing assessments to recent sales.",
                    sourceUrl: "https://www.phila.gov/documents/annual-ratio-studies/",
                  },
                  {
                    id: "ratio-lab-case",
                    type: "caseFile",
                    title: "Supervisor ratio memo",
                    isStudentVisible: true,
                    required: true,
                    scenario: "A supervisor asks whether a small sample suggests uniformity concerns before a reassessment review meeting.",
                    parcelFacts: [
                      { label: "Sample", detail: "Twenty verified arm's-length sales from a single GMA." },
                      { label: "Pattern", detail: "Lower-price sales show higher ratios than higher-price sales." },
                    ],
                    evidenceItems: [
                      { label: "Median ratio", detail: "0.82", sourceRef: "Ratio worksheet" },
                      { label: "COD", detail: "14.8", sourceRef: "Formula Compass" },
                      { label: "PRD", detail: "1.09", sourceRef: "Formula Compass" },
                    ],
                    learnerTask: "Write a short memo identifying the quality signal, limits of the sample, and next analytic review.",
                    rubric: "Strong answers mention possible regressivity, sample limitations, and need for broader review before policy conclusions.",
                  },
                ],
              }),
            },
            { slug: "data-quality-analytics-track", title: "Data, Quality, and Analytics Track" }
          ),
          attachCourse(
            {
              id: "cccccccc-1220-4000-8000-000000000001",
              title: "Mass Appraisal and AVM Reasonableness",
              position: 2,
              lessonType: "text",
              durationSeconds: 900,
              contentJson: lessonDocument({
                summary: "Review model variables, outlier flags, explainability, and human review checkpoints in mass appraisal.",
                objectives: ["Identify model inputs.", "Review outlier reasonableness.", "Explain why human review remains essential."],
                estimatedDurationMinutes: 15,
                blocks: [
                  {
                    id: "mass-glossary",
                    type: "glossaryTermSet",
                    title: "Model vocabulary",
                    isStudentVisible: true,
                    required: true,
                    displayMode: "cards",
                    terms: [
                      { term: "Mass appraisal", definition: "Valuing a group of properties as of a given date using standardized methods and common data." },
                      { term: "CAMA", definition: "Computer-assisted mass appraisal systems used to manage property data and valuation models." },
                      { term: "AVM", definition: "Automated valuation model that estimates value using data and statistical or machine learning methods." },
                      { term: "Outlier", definition: "A result or observation that differs materially from expected patterns and needs review." },
                    ],
                  },
                  {
                    id: "avm-case",
                    type: "caseFile",
                    title: "Large model increase review",
                    isStudentVisible: true,
                    required: true,
                    scenario: "A model produces a 42% value increase for a rowhome after recent sales and permit data are loaded. The owner says nothing changed.",
                    parcelFacts: [
                      { label: "Subject", detail: "Rowhome in a GMA with recent renovation-driven sales." },
                      { label: "Model signal", detail: "Large increase triggered by market trend, size correction, and permit indicator." },
                    ],
                    evidenceItems: [
                      { label: "Sales trend", detail: "Recent verified sales show rising prices for renovated rowhomes.", sourceRef: "Model sales file" },
                      { label: "Data correction", detail: "Prior record underreported living area by 240 sq. ft.", sourceRef: "Data edit" },
                      { label: "Permit indicator", detail: "Permit was for roof repair, not interior renovation.", sourceRef: "Permit review" },
                    ],
                    learnerTask: "Determine which model signals are supported, which require correction, and how to explain the review decision.",
                    rubric: "Strong answers accept supported market/data signals, reject unsupported renovation inference, and document the human review path.",
                  },
                ],
              }),
            },
            { slug: "data-quality-analytics-track", title: "Data, Quality, and Analytics Track" }
          ),
        ],
      },
    ],
  },
  {
    id: "dddddddd-1000-4000-8000-000000000001",
    slug: "professional-practice-communication",
    title: "Professional Practice and Communication Track",
    description:
      "Evaluator professionalism training for ethical, bias-aware, defensible documentation and clear taxpayer communication.",
    thumbnailUrl: null,
    modules_on_course: [
      {
        id: "dddddddd-1100-4000-8000-000000000001",
        title: "400 - Defensible Review",
        position: 1,
        prerequisiteModuleIds: null,
        lessons_on_module: [
          attachCourse(
            {
              id: "dddddddd-1110-4000-8000-000000000001",
              title: "Ethical, Bias-Aware Valuation Review",
              position: 1,
              lessonType: "text",
              durationSeconds: 900,
              contentJson: lessonDocument({
                summary: "Build defensible review habits that avoid unsupported conclusions, inconsistent treatment, and bias risks.",
                objectives: ["Identify unsupported valuation notes.", "Escalate complex or bias-sensitive issues.", "Write audit-ready rationale."],
                estimatedDurationMinutes: 15,
                blocks: [
                  {
                    id: "ethics-case",
                    type: "caseFile",
                    title: "Weak note rewrite",
                    isStudentVisible: true,
                    required: true,
                    scenario: "A review note says: 'Owner seems credible, reduce value to match neighbor.' The file lacks comparable analysis, uniformity support, or property characteristic evidence.",
                    parcelFacts: [
                      { label: "Subject", detail: "Owner-occupied rowhome with no verified characteristic error." },
                      { label: "Requested action", detail: "Value reduction based on neighbor comparison." },
                    ],
                    evidenceItems: [
                      { label: "Neighbor reference", detail: "One neighboring assessment cited without sale, size, condition, or exemption comparison.", sourceRef: "Owner statement" },
                      { label: "File note", detail: "No market value or uniformity analysis documented.", sourceRef: "Review note" },
                    ],
                    learnerTask: "Rewrite the note into a defensible review memo and identify what evidence is still missing.",
                    rubric: "Strong answers remove credibility-based reasoning, request comparable/uniformity evidence, and document the current basis for no value change or further review.",
                  },
                ],
              }),
            },
            { slug: "professional-practice-communication", title: "Professional Practice and Communication Track" }
          ),
          attachCourse(
            {
              id: "dddddddd-1120-4000-8000-000000000001",
              title: "Documentation and Audit Trails",
              position: 2,
              lessonType: "text",
              durationSeconds: 780,
              contentJson: lessonDocument({
                summary: "Practice writing review notes that show evidence, decision logic, limitations, and escalation points.",
                objectives: ["Use evidence-first documentation.", "State uncertainty clearly.", "Preserve an audit trail for changes."],
                estimatedDurationMinutes: 13,
                blocks: [
                  {
                    id: "audit-reading",
                    type: "richText",
                    title: "A good note shows the chain of reasoning",
                    isStudentVisible: true,
                    required: true,
                    contentKind: "tiptap",
                    content: tiptapText("Defensible documentation connects the question, evidence, analysis, decision, and limitations. A future reviewer should understand what was checked, what was not available, and why the decision was made.\nAssessment documentation should avoid unsupported certainty. If a record correction, value review, or appeal position depends on missing evidence, the note should say so clearly."),
                  },
                  {
                    id: "audit-reflection",
                    type: "reflectionPrompt",
                    title: "Audit-ready note",
                    isStudentVisible: true,
                    required: true,
                    prompt: "Draft a note for a file where the property record error is confirmed but the value impact is not yet measured.",
                    guidance: "A strong note separates confirmed facts from pending valuation analysis.",
                  },
                ],
              }),
            },
            { slug: "professional-practice-communication", title: "Professional Practice and Communication Track" }
          ),
        ],
      },
      {
        id: "dddddddd-1200-4000-8000-000000000001",
        title: "CE - Taxpayer Communication",
        position: 2,
        prerequisiteModuleIds: null,
        lessons_on_module: [
          attachCourse(
            {
              id: "dddddddd-1210-4000-8000-000000000001",
              title: "Explaining Assessments Without Jargon",
              position: 1,
              lessonType: "text",
              durationSeconds: 840,
              contentJson: lessonDocument({
                summary: "Translate assessment concepts into clear, respectful explanations for frustrated taxpayers.",
                objectives: ["Separate value from tax impact in plain language.", "Explain evidence requirements.", "Avoid legal advice while describing review options."],
                estimatedDurationMinutes: 14,
                blocks: [
                  {
                    id: "communication-case",
                    type: "caseFile",
                    title: "Frustrated taxpayer call",
                    isStudentVisible: true,
                    required: true,
                    scenario: "A taxpayer says: 'My neighbor pays less and my bill went up. This is unfair.' They are upset and want an immediate reduction.",
                    parcelFacts: [
                      { label: "Subject", detail: "Assessment increased after reassessment notice." },
                      { label: "Neighbor", detail: "Neighbor may have a different exemption status and smaller living area." },
                    ],
                    evidenceItems: [
                      { label: "Tax bill concern", detail: "Taxpayer focuses on affordability and bill increase.", sourceRef: "Call transcript" },
                      { label: "Potential evidence", detail: "Comparable sales, property characteristic differences, relief status, and uniformity data have not yet been reviewed.", sourceRef: "Evaluator checklist" },
                    ],
                    learnerTask: "Write a response that validates concern, explains the assessment question, and gives the next evidence steps without promising an outcome.",
                    rubric: "Strong answers are respectful, plain-language, and clear about value, tax rate, relief programs, and appeal/review options.",
                  },
                ],
              }),
            },
            { slug: "professional-practice-communication", title: "Professional Practice and Communication Track" }
          ),
          attachCourse(
            {
              id: "dddddddd-1220-4000-8000-000000000001",
              title: "Annual Philadelphia Update Briefing",
              position: 2,
              lessonType: "text",
              durationSeconds: 720,
              contentJson: lessonDocument({
                summary: "Use annual methodology, ratio study, and policy updates to keep evaluator practice current.",
                objectives: ["Identify annual update sources.", "Summarize what changed.", "Translate updates into evaluator action items."],
                estimatedDurationMinutes: 12,
                blocks: [
                  {
                    id: "annual-update-source",
                    type: "sourceReference",
                    title: "Annual update source set",
                    isStudentVisible: true,
                    required: false,
                    referenceLabel: "OPA methodology and ratio studies",
                    excerpt: "Annual methodology documents and ratio studies should be reviewed as part of continuing education and annual refresher training.",
                    sourceUrl: "https://www.phila.gov/documents/assessment-methodologies/",
                  },
                  {
                    id: "annual-update-task",
                    type: "reflectionPrompt",
                    title: "Update memo",
                    isStudentVisible: true,
                    required: true,
                    prompt: "Draft a five-bullet update memo for evaluators after a new methodology document or ratio study is published.",
                    guidance: "Include source, affected property types, changed review steps, communication risks, and follow-up training needs.",
                  },
                ],
              }),
            },
            { slug: "professional-practice-communication", title: "Professional Practice and Communication Track" }
          ),
        ],
      },
    ],
  },
];

export function getDevPublishedCourses() {
  return DEV_COURSES.map(({ modules_on_course, ...course }) => course);
}

export function getDevCourseBySlug(slug: string) {
  return DEV_COURSES.find((course) => course.slug === slug) ?? null;
}

export function getDevLessonById(id: string) {
  for (const course of DEV_COURSES) {
    for (const module of course.modules_on_course) {
      for (const lesson of module.lessons_on_module) {
        if (lesson.id === id) return lesson;
      }
    }
  }
  return null;
}
