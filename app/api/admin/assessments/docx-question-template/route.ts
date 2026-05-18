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
    "single",
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
    "single",
    "expert",
    "math",
    "5%|10%|15%|20%",
    "B",
    "Cap rate = NOI / Value = $50,000 / $500,000 = 10%",
    "Cap rate is used in direct capitalization to estimate value.",
    "cap rate|direct capitalization",
    "CAP",
  ],
];

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

  const doc = new Document({
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
                "question_type must be: single or multiselect. " +
                "difficulty: easy | proficient | expert. " +
                "Choices are listed in order (A, B, C, D). correct_answers uses the letter(s) matching the correct choice(s)."
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
              new TextRun("single | multiselect"),
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
              new TextRun("Letter(s): A or A|C for multiselect"),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="quiz-question-import-template.docx"',
    },
  });
}
