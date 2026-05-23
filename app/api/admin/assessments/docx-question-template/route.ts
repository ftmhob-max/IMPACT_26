import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin/auth";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  WidthType,
  ShadingType,
  AlignmentType,
  BorderStyle,
} from "docx";

const HEADERS = [
  "question_text",
  "question_type",
  "difficulty",
  "domain",
  "choices",
  "correct_answers",
  "explanation",
  "rationale",
  "topic_tags",
  "formula_ref",
];

const SAMPLE_ROWS = [
  [
    "What does NOI stand for in real estate?",
    "multiple_choice",
    "easy",
    "math",
    "Net Operating Income|Net Other Income|Nominal Operating Input|None of the above",
    "A",
    "NOI = Effective Gross Income – Operating Expenses",
    "Net Operating Income is a key metric in income approach valuation.",
    "NOI|income approach",
    "",
  ],
  [
    "Which of the following are included in the Sales Comparison Approach?",
    "multiselect",
    "proficient",
    "appraisal",
    "Selection of comparables|Adjustment for differences|Time adjustments|Zoning classification",
    "A|B|C",
    "Zoning classification is not a direct adjustment in SCA.",
    "The SCA relies on market-derived adjustments from comparable sales.",
    "sales comparison|adjustments",
    "SCA",
  ],
  [
    "Calculate the capitalization rate if NOI is $50,000 and property value is $500,000.",
    "multiple_choice",
    "expert",
    "math",
    "5%|10%|15%|20%",
    "B",
    "Cap rate = NOI / Value = $50,000 / $500,000 = 10%",
    "Cap rate is used in direct capitalization to estimate value.",
    "cap rate|direct capitalization",
    "CAP",
  ],
  [
    "A taxpayer appeals an assessment using one comparable sale, while the assessor has a ratio study and three adjusted comparables. Which response best explains the strongest evidence?",
    "scenario",
    "expert",
    "appraisal",
    "The single sale always controls|The assessor should rely only on prior-year assessment|Converging evidence from multiple sources is stronger|The appeal must be denied without review",
    "C",
    "Scenario questions are case-style prompts that still resolve to selectable answers.",
    "Converging evidence usually supports a stronger conclusion than one isolated data point.",
    "appeals|evidence|scenario",
    "APPEAL",
  ],
  [
    "In one sentence, define cash-equivalent sale price.",
    "short_answer",
    "easy",
    "appraisal",
    "",
    "A sale price adjusted to remove financing or concession terms that distort market value",
    "Short-answer rows may leave choices blank; the correct answer is stored as the expected response.",
    "Cash-equivalent validation helps normalize market evidence.",
    "cash equivalent|sale validation",
    "SALE_VALIDATION",
  ],
];

function impactQuestionTable({
  questionNumber,
  skill,
  question,
  choices,
}: {
  questionNumber: number;
  skill: "EASY" | "INTERMEDIATE" | "EXPERT";
  question: string;
  choices: string[];
}) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          dataCell(`Q ${questionNumber}`, "E6F1FB"),
          dataCell("Sample Formula | Value = Income / Rate", "E6F1FB"),
          dataCell(`SKILL: ${skill}`, "E6F1FB"),
        ],
      }),
      new TableRow({
        children: [dataCell(question)],
      }),
      ...choices.map((choice, index) =>
        new TableRow({
          children: [
            dataCell(String.fromCharCode(65 + index)),
            dataCell(choice),
          ],
        })
      ),
    ],
  });
}

function headerCell(text: string): TableCell {
  return new TableCell({
    shading: { type: ShadingType.SOLID, color: "185FA5", fill: "185FA5" },
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 16 })],
        alignment: AlignmentType.CENTER,
      }),
    ],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
    },
  });
}

function dataCell(text: string, shade?: string): TableCell {
  return new TableCell({
    shading: shade ? { type: ShadingType.SOLID, color: shade, fill: shade } : undefined,
    children: [
      new Paragraph({
        children: [new TextRun({ text, size: 16 })],
      }),
    ],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
    },
  });
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminRequest(request, "viewer");
  if (!auth.ok) return auth.response;

  const variant = request.nextUrl.searchParams.get("variant");
  const doc = variant === "impact" ? createImpactTemplate() : createTableTemplate();
  const buffer = await Packer.toBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition":
        variant === "impact"
          ? 'attachment; filename="impact-workbook-question-import-template.docx"'
          : 'attachment; filename="quiz-question-import-template.docx"',
    },
  });
}

function createTableTemplate() {
  return new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "Quiz Question Import Template",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Instructions: ", bold: true }),
              new TextRun(
                "Fill in the table — one row per question. " +
                "Use | to separate multiple choices and correct_answers (e.g. 'A|C' for multiselect). " +
                "question_type may be: multiple_choice, multiselect, scenario, or short_answer. " +
                "Aliases like single, multi, and case_study are also accepted. " +
                "difficulty: easy | proficient | expert. " +
                "For choice-based questions, list choices in order (A, B, C, D) and use correct_answers letter(s). " +
                "For short_answer, choices may be blank and correct_answers should contain the expected response."
              ),
            ],
          }),
          new Paragraph({ text: "" }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: HEADERS.map(headerCell),
              }),
              ...SAMPLE_ROWS.map((row, idx) =>
                new TableRow({
                  children: row.map((cell) =>
                    dataCell(cell, idx % 2 === 0 ? "F8FAFF" : "FFFFFF")
                  ),
                })
              ),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "question_type: ", bold: true }),
              new TextRun("multiple_choice | multiselect | scenario | short_answer"),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "difficulty: ", bold: true }),
              new TextRun("easy | proficient | expert"),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "domain: ", bold: true }),
              new TextRun("math | appraisal | law | philly | admin | ethics"),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "choices: ", bold: true }),
              new TextRun("Pipe-separated: Choice A text|Choice B text|Choice C text|Choice D text"),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "correct_answers: ", bold: true }),
              new TextRun("Letter(s): A or A|C for choice-based rows; expected response text for short_answer"),
            ],
          }),
        ],
      },
    ],
  });
}

function createImpactTemplate() {
  return new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "IMPACT Workbook Question Import Template",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Instructions: ", bold: true }),
              new TextRun(
                "Use SECTION headings, FORMULA headings, and one question table per question. " +
                "After the table, include FORMULA, STEP-BY-STEP CALCULATION, and RATIONALE paragraphs. " +
                "End the rationale with wording like 'Answer A is correct.'"
              ),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "SECTION 1 - SALES COMPARISON & REGRESSION",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: "Formula Mastery Practice Exam | 3 Questions Per Formula",
          }),
          new Paragraph({
            text: "FORMULA 1 - Sample Formula",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ text: "Value = Income / Rate" }),
          impactQuestionTable({
            questionNumber: 1,
            skill: "EASY",
            question: "A property has income of $50,000 and a capitalization rate of 10%. What is the indicated value?",
            choices: ["$500,000", "$50,000", "$5,000", "$550,000"],
          }),
          new Paragraph({ text: "FORMULA", heading: HeadingLevel.HEADING_3 }),
          new Paragraph({ text: "Value = Income / Rate" }),
          new Paragraph({ text: "STEP-BY-STEP CALCULATION", heading: HeadingLevel.HEADING_3 }),
          new Paragraph({ text: "Step 1: Convert 10% to 0.10. Step 2: Divide $50,000 by 0.10. Step 3: Value = $500,000." }),
          new Paragraph({ text: "RATIONALE", heading: HeadingLevel.HEADING_3 }),
          new Paragraph({ text: "Direct capitalization divides stabilized income by the market rate. Answer A is correct." }),
          new Paragraph({ text: "" }),
          impactQuestionTable({
            questionNumber: 2,
            skill: "INTERMEDIATE",
            question: "Which expression correctly solves for value when income and rate are known?",
            choices: ["Income / Rate", "Income x Rate", "Rate / Income", "Income + Rate"],
          }),
          new Paragraph({ text: "FORMULA", heading: HeadingLevel.HEADING_3 }),
          new Paragraph({ text: "Value = Income / Rate" }),
          new Paragraph({ text: "STEP-BY-STEP CALCULATION", heading: HeadingLevel.HEADING_3 }),
          new Paragraph({ text: "Step 1: Identify the income variable. Step 2: Identify the capitalization rate. Step 3: Divide income by rate." }),
          new Paragraph({ text: "RATIONALE", heading: HeadingLevel.HEADING_3 }),
          new Paragraph({ text: "The rate is the denominator in direct capitalization. Answer A is correct." }),
        ],
      },
    ],
  });
}
