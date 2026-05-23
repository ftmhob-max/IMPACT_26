/**
 * DOCX Question Parser
 *
 * Parses structured DOCX files into section/formula/question data. It supports
 * the original table-oriented format and the IMPACT workbook format where
 * question tables are followed by FORMULA, STEP-BY-STEP, and RATIONALE
 * paragraphs.
 */

export interface ParsedChoice {
  letter: string;
  choiceText: string;
  isCorrect: boolean;
}

export interface ParsedQuestion {
  questionNumber: number;
  questionText: string;
  difficulty: "easy" | "proficient" | "expert";
  domain: string;
  formulaRef: string;
  topicTags: string;
  rationale: string;
  calculation: string;
  choices: ParsedChoice[];
}

export interface ParsedFormula {
  code: string;
  name: string;
  questions: ParsedQuestion[];
}

export interface ParsedSection {
  title: string;
  formulas: ParsedFormula[];
}

export interface DocxParseResult {
  sections: ParsedSection[];
  allQuestions: ParsedQuestion[];
}

interface TableCellText {
  text: string;
  lines: string[];
}

type TableRowText = TableCellText[];

type Segment =
  | { type: "h1" | "h2" | "p"; text: string }
  | { type: "table"; rows: TableRowText[] };

type QMode = "question" | "choices" | "post_answer" | "rationale" | "calculation";

interface QBuilder {
  questionNumber: number;
  questionLines: string[];
  difficulty: "easy" | "proficient" | "expert";
  domain: string;
  formulaRef: string;
  topicTags: string;
  targetFormula: ParsedFormula;
  choices: ParsedChoice[];
  correctLetters: string[];
  rationale: string;
  calculation: string;
  mode: QMode;
}

interface ParseContext {
  domain: string;
  formulaRef: string;
  topicTags: string;
}

interface QuestionParserState {
  qb: QBuilder | null;
  questionCounter: number;
}

function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function parseCellLines(cellHtml: string): string[] {
  const paragraphRe = /<p(\s[^>]*)?>[\s\S]*?<\/p>/gi;
  const lines: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = paragraphRe.exec(cellHtml)) !== null) {
    const text = stripTags(match[0]);
    if (text) lines.push(text);
  }
  if (lines.length > 0) return lines;

  const text = stripTags(cellHtml);
  return text ? [text] : [];
}

function parseTableRows(tableHtml: string): TableRowText[] {
  const rows: TableRowText[] = [];
  const rowRe = /<tr(\s[^>]*)?>[\s\S]*?<\/tr>/gi;
  let rowMatch: RegExpExecArray | null;
  while ((rowMatch = rowRe.exec(tableHtml)) !== null) {
    const cells: TableRowText = [];
    const cellRe = /<t[dh](\s[^>]*)?>[\s\S]*?<\/t[dh]>/gi;
    let cellMatch: RegExpExecArray | null;
    while ((cellMatch = cellRe.exec(rowMatch[0])) !== null) {
      const lines = parseCellLines(cellMatch[0]);
      const text = normalizeText(lines.join(" "));
      cells.push({ text, lines });
    }
    if (cells.some((cell) => cell.text || cell.lines.length > 0)) rows.push(cells);
  }
  return rows;
}

function parseSectionTitle(text: string): string {
  const match = text.match(/^(?:Section\s+\d+\s*[:.\-–—]\s*|\d+\.\s+)(.+)/i);
  return match ? match[1].trim() : text.trim();
}

function isSectionHeader(text: string): boolean {
  return /^Section\s+\d+\s*[:.\-–—]\s*.+/i.test(text);
}

function parseFormulaHeader(text: string): { code: string; name: string } | null {
  const numbered = text.match(/^FORMULA\s+(\d+)\s*[:–—-]\s*(.+)$/i);
  if (numbered) {
    return {
      code: `FORMULA_${numbered[1]}`,
      name: numbered[2].trim(),
    };
  }

  const match = text.match(/(?:Formula\s+)?([A-Z][A-Z0-9-]*)\s*[:–—-]\s*(.+)/i);
  if (match && match[1].length <= 10) {
    return { code: match[1].trim().toUpperCase(), name: match[2].trim() };
  }
  return null;
}

function parseDifficulty(text: string): "easy" | "proficient" | "expert" {
  const upper = text.toUpperCase();
  if (upper.includes("EXPERT")) return "expert";
  if (upper.includes("INTERMEDIATE") || upper.includes("PROFICIENT")) return "proficient";
  return "easy";
}

function finalizeQuestion(qb: QBuilder): ParsedQuestion {
  for (const choice of qb.choices) {
    choice.isCorrect = qb.correctLetters.includes(choice.letter);
  }
  return {
    questionNumber: qb.questionNumber,
    questionText: normalizeText(qb.questionLines.join(" ")),
    difficulty: qb.difficulty,
    domain: qb.domain,
    formulaRef: qb.formulaRef,
    topicTags: qb.topicTags,
    rationale: qb.rationale.trim(),
    calculation: qb.calculation.trim(),
    choices: qb.choices,
  };
}

function flushQuestion(state: QuestionParserState) {
  if (state.qb && state.qb.choices.length > 0) {
    state.qb.targetFormula.questions.push(finalizeQuestion(state.qb));
  }
  state.qb = null;
}

function startQuestion(
  state: QuestionParserState,
  ctx: ParseContext,
  targetFormula: ParsedFormula,
  questionNumber: number | null,
  difficultySource: string,
  questionText = ""
) {
  flushQuestion(state);
  state.questionCounter += 1;
  state.qb = {
    questionNumber: questionNumber ?? state.questionCounter,
    questionLines: questionText ? [questionText] : [],
    difficulty: parseDifficulty(difficultySource),
    domain: ctx.domain,
    formulaRef: ctx.formulaRef,
    topicTags: ctx.topicTags,
    targetFormula,
    choices: [],
    correctLetters: [],
    rationale: "",
    calculation: "",
    mode: "question",
  };
}

function parseQuestionHeaderCells(cells: string[]): {
  questionNumber: number | null;
  difficultySource: string;
  questionText: string;
} | null {
  const first = cells[0]?.trim() ?? "";
  const questionMatch = first.match(/^Q[\s.]?(\d+)(?:\s+(.+))?$/i);
  if (!questionMatch) return null;

  if (/SKILL/i.test(first)) {
    const cleaned = first
      .replace(/^Q[\s.]?\d+\s*/i, "")
      .replace(/SKILL\s*[:\-]?\s*(EASY|INTERMEDIATE|PROFICIENT|EXPERT)\s*/i, "")
      .trim();
    return {
      questionNumber: Number.parseInt(questionMatch[1], 10),
      difficultySource: first,
      questionText: cleaned,
    };
  }

  const skillCell = cells.find((cell) => /^SKILL/i.test(cell.trim()));
  if (skillCell) {
    const inlineText = questionMatch[2]?.trim() ?? "";
    return {
      questionNumber: Number.parseInt(questionMatch[1], 10),
      difficultySource: skillCell,
      questionText: inlineText,
    };
  }

  return null;
}

function setCorrectLetters(qb: QBuilder, letters: string[]) {
  if (letters.length > 0) qb.correctLetters = letters;
}

function inferCorrectLetters(qb: QBuilder, text: string) {
  if (qb.correctLetters.length > 0) return;
  const answerMatch = text.match(/\bAnswer\s+([A-D])\s+is\s+correct\b/i);
  if (answerMatch) {
    setCorrectLetters(qb, [answerMatch[1].toUpperCase()]);
    return;
  }
  const selectMatch = text.match(/\bSelect\s+([A-D])\b/i);
  if (selectMatch) setCorrectLetters(qb, [selectMatch[1].toUpperCase()]);
}

function appendToMode(qb: QBuilder, text: string) {
  switch (qb.mode) {
    case "question":
      qb.questionLines.push(text);
      break;
    case "rationale":
      qb.rationale += (qb.rationale ? " " : "") + text;
      break;
    case "calculation":
      qb.calculation += (qb.calculation ? " " : "") + text;
      break;
    default:
      break;
  }
}

function consumeQuestionText(text: string, state: QuestionParserState) {
  const qb = state.qb;
  if (!qb || !text) return;

  const correctAnswerMatch = text.match(/Correct\s+Answer\s*[:\-]\s*([A-D](?:[,\s]+[A-D])*)/i);
  if (correctAnswerMatch) {
    setCorrectLetters(
      qb,
      correctAnswerMatch[1]
        .split(/[,\s]+/)
        .map((letter) => letter.trim().toUpperCase())
        .filter((letter) => /^[A-D]$/.test(letter))
    );
    qb.mode = "post_answer";
    return;
  }

  if (/^RATIONALE(?:\s*[:\-]|$)/i.test(text)) {
    qb.mode = "rationale";
    const rest = text.replace(/^RATIONALE\s*[:\-]?\s*/i, "").trim();
    if (rest) {
      inferCorrectLetters(qb, rest);
      qb.rationale = rest;
    }
    return;
  }

  if (/^(?:STEP[\s-]*BY[\s-]*STEP(?:\s+CALCULATION)?|CALCULATION)(?:\s*[:\-]|$)/i.test(text)) {
    qb.mode = "calculation";
    const rest = text
      .replace(/^STEP[\s-]*BY[\s-]*STEP(?:\s+CALCULATION)?\s*[:\-]?\s*/i, "")
      .replace(/^CALCULATION\s*[:\-]?\s*/i, "")
      .trim();
    if (rest) qb.calculation = rest;
    return;
  }

  if (/^FORMULA(?:\s*[:\-]|$)/i.test(text)) {
    qb.mode = "calculation";
    return;
  }

  const choiceMatch = text.match(/^([A-D])(?:[.)]\s*|\s*-\s+)(.+)$/);
  if (choiceMatch) {
    qb.mode = "choices";
    qb.choices.push({
      letter: choiceMatch[1].toUpperCase(),
      choiceText: choiceMatch[2].trim(),
      isCorrect: false,
    });
    return;
  }

  inferCorrectLetters(qb, text);
  appendToMode(qb, text);
}

function consumeChoiceRow(row: TableRowText, state: QuestionParserState): boolean {
  const qb = state.qb;
  if (!qb || row.length < 2) return false;

  const explicitLetterLines = row[0]?.lines.filter((line) => /^[A-D]$/i.test(line.trim())) ?? [];
  const letterLines =
    explicitLetterLines.length > 0
      ? explicitLetterLines
      : row[0]?.text.match(/\b[A-D]\b/g) ?? [];
  if (letterLines.length === 0) return false;

  let answerLines = row
    .slice(1)
    .flatMap((cell) => cell.lines)
    .filter(Boolean);
  if (answerLines.length <= letterLines.length && answerLines.length > 0) {
    const split = answerLines
      .join(" ")
      .split(/\s+(?=(?:Yes|No|Partially|Always|Never|Only|All|None)\s+[—-]\s+)/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (split.length >= letterLines.length) answerLines = split;
  }
  if (answerLines.length === 0) return false;

  qb.mode = "choices";
  for (let index = 0; index < letterLines.length; index += 1) {
    const choiceText = answerLines[index] ?? answerLines[0];
    if (!choiceText) continue;
    qb.choices.push({
      letter: letterLines[index].toUpperCase(),
      choiceText,
      isCorrect: false,
    });
  }
  return true;
}

function consumeQuestionRow(
  row: TableRowText,
  ctx: ParseContext,
  getTargetFormula: () => ParsedFormula,
  state: QuestionParserState
) {
  const cellTexts = row.map((cell) => cell.text).filter(Boolean);
  const header = parseQuestionHeaderCells(cellTexts);
  if (header) {
    startQuestion(state, ctx, getTargetFormula(), header.questionNumber, header.difficultySource, header.questionText);
    return;
  }

  if (consumeChoiceRow(row, state)) return;

  for (const cell of row) {
    for (const line of cell.lines) consumeQuestionText(line, state);
  }
}

function consumeQuestionTable(
  rows: TableRowText[],
  ctx: ParseContext,
  getTargetFormula: () => ParsedFormula,
  state: QuestionParserState
) {
  for (const row of rows) consumeQuestionRow(row, ctx, getTargetFormula, state);
}

function extractSegments(html: string): Segment[] {
  const tableRanges: Array<{ start: number; end: number; html: string }> = [];
  const tableRe = /<table(\s[^>]*)?>[\s\S]*?<\/table>/gi;
  let tableMatch: RegExpExecArray | null;
  while ((tableMatch = tableRe.exec(html)) !== null) {
    tableRanges.push({
      start: tableMatch.index,
      end: tableMatch.index + tableMatch[0].length,
      html: tableMatch[0],
    });
  }

  function isInsideTable(index: number): boolean {
    return tableRanges.some((range) => index > range.start && index < range.end);
  }

  const positioned: Array<{ pos: number; seg: Segment }> = [];
  const paraRe = /<(h1|h2|h3|p)(\s[^>]*)?>[\s\S]*?<\/\1>/gi;
  let paraMatch: RegExpExecArray | null;
  while ((paraMatch = paraRe.exec(html)) !== null) {
    if (isInsideTable(paraMatch.index)) continue;
    const tag = paraMatch[1].toLowerCase() as "h1" | "h2" | "h3" | "p";
    const text = stripTags(paraMatch[0]);
    if (!text) continue;
    positioned.push({
      pos: paraMatch.index,
      seg: { type: tag === "h3" ? "h2" : tag, text },
    });
  }

  for (const range of tableRanges) {
    const rows = parseTableRows(range.html);
    if (rows.length > 0) positioned.push({ pos: range.start, seg: { type: "table", rows } });
  }

  return positioned.sort((a, b) => a.pos - b.pos).map(({ seg }) => seg);
}

export function parseDocxHtml(html: string): DocxParseResult {
  const segments = extractSegments(html);
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;
  let currentFormula: ParsedFormula | null = null;
  const questionState: QuestionParserState = { qb: null, questionCounter: 0 };

  function ensureSection(title: string) {
    currentSection = { title, formulas: [] };
    sections.push(currentSection);
    currentFormula = null;
  }

  function ensureFormula(code: string, name: string) {
    if (!currentSection) ensureSection("General");
    currentFormula = { code, name, questions: [] };
    currentSection!.formulas.push(currentFormula);
  }

  function getContext(): ParseContext {
    return {
      domain: currentSection?.title ?? "General",
      formulaRef: currentFormula?.code ?? "",
      topicTags: currentFormula
        ? `${currentSection?.title ?? ""} > ${currentFormula.name}`
        : currentSection?.title ?? "",
    };
  }

  function ensureQuestionTargetFormula() {
    if (!currentFormula) {
      if (!currentSection) ensureSection("General");
      currentFormula = { code: "MISC", name: currentSection!.title, questions: [] };
      currentSection!.formulas.push(currentFormula);
    }
    return currentFormula;
  }

  for (const seg of segments) {
    if (seg.type === "h1" || (seg.type === "p" && isSectionHeader(seg.text))) {
      flushQuestion(questionState);
      ensureSection(parseSectionTitle(seg.text));
    } else if (seg.type === "h2") {
      flushQuestion(questionState);
      const formula = parseFormulaHeader(seg.text);
      if (formula) ensureFormula(formula.code, formula.name);
      else ensureSection(parseSectionTitle(seg.text));
    } else if (seg.type === "table") {
      consumeQuestionTable(seg.rows, getContext(), ensureQuestionTargetFormula, questionState);
    } else if (seg.type === "p") {
      consumeQuestionText(seg.text, questionState);
    }
  }

  flushQuestion(questionState);
  const parsedSections = sections.filter((section) =>
    section.formulas.some((formula) => formula.questions.length > 0)
  );
  const allQuestions = parsedSections.flatMap((section) => section.formulas.flatMap((formula) => formula.questions));

  return { sections: parsedSections, allQuestions };
}

export async function parseDocxQuestions(buffer: Buffer): Promise<DocxParseResult> {
  const mammoth = await import("mammoth");
  const { value: html } = await mammoth.convertToHtml({ buffer });
  return parseDocxHtml(html);
}
