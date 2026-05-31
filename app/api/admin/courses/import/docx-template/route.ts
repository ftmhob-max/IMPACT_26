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
  "module_title",
  "lesson_title",
  "lesson_type",
  "content_summary",
  "learning_objectives",
  "difficulty",
  "domain",
  "topic_tags",
  "asc_reference",
  "est_duration_min",
];

const SAMPLE_ROWS = [
  ["Introduction to USPAP", "What is USPAP?", "text", "Overview of the Uniform Standards of Professional Appraisal Practice", "Understand purpose and scope of USPAP", "easy", "law", "USPAP|standards", "", "12"],
  ["Introduction to USPAP", "Ethics Rule", "text", "Conduct, Management, Confidentiality, and Record Keeping rules", "Apply the four sections of the Ethics Rule", "proficient", "ethics", "ethics|conduct", "", "10"],
  ["Valuation Methods", "Sales Comparison Approach", "text", "Adjusting comparable sales for market conditions", "Select and adjust comparables appropriately", "proficient", "appraisal", "comparable sales|adjustments", "", "15"],
  ["Valuation Methods", "Income Capitalization", "text", "Direct and yield capitalization techniques", "Calculate value via direct capitalization", "expert", "math", "cap rate|NOI|GRM", "", "20"],
];

function headerCell(text: string): TableCell {
  return new TableCell({
    shading: { type: ShadingType.SOLID, color: "185FA5", fill: "185FA5" },
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 18 })],
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
        children: [new TextRun({ text, size: 18 })],
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
            text: "Course Import Template",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Instructions: ",
                bold: true,
              }),
              new TextRun(
                "Fill in the table below — one row per lesson. Each lesson must have a module_title and lesson_title. " +
                "Lessons sharing the same module_title will be grouped into the same module. " +
                "lesson_type must be one of: text, video, quiz, source. " +
                "Use | to separate multiple topic_tags. " +
                "Delete these instruction rows before uploading, or just leave the table as-is and add your rows."
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
              new TextRun({ text: "lesson_type options: ", bold: true }),
              new TextRun("text | video | quiz | source"),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "difficulty options: ", bold: true }),
              new TextRun("easy | proficient | expert"),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "domain: ", bold: true }),
              new TextRun("Free-form text (e.g. finance, compliance, law, ethics, operations, …)"),
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
      "Content-Disposition": 'attachment; filename="course-import-template.docx"',
    },
  });
}
