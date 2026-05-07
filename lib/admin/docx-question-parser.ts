/**
 * DOCX Question Parser
 *
 * Parses structured DOCX files (like the IMPACT_26 Assessment Calculations Review)
 * into structured question + curriculum data.
 *
 * Expected document layout:
 *   Section [N]: [Title]              → ParsedSection (becomes a Module)
 *     Formula [CODE]: [Name]          → ParsedFormula (becomes a Lesson)
 *       Q [n] … SKILL: EASY/…        → ParsedQuestion
 *       A. / B. / C. / D.             → answer choices
 *       "Correct Answer: [LETTER]"    → marks correct choice
 *       FORMULA: / STEP-BY-STEP: /   → metadata fields
 *       RATIONALE: …
 */

export interface ParsedChoice {
  letter: string;
  choiceText: string;
  isCorrect: boolean;
}

export interface ParsedQuestion {
  questionNumber: number;
  questionText: string;
  difficulty: "easy" | "intermediate" | "expert";
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

// ─── HTML helpers ─────────────────────────────────────────────────────────────

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

// ─── Heading parsers ─────────────────────────────────────────────────────────

function parseSectionTitle(text: string): string {
  // "Section 1: Income Approach" → "Income Approach"
  // "1. Income Approach" → "Income Approach"
  const m = text.match(/^(?:Section\s+\d+\s*[:.:\-–—]\s*|\d+\.\s+)(.+)/i);
  return m ? m[1].trim() : text.trim();
}

function parseFormulaHeader(text: string): { code: string; name: string } | null {
  // "FORMULA 1 — CLR-Implied Market Value"
  const numbered = text.match(/^FORMULA\s+(\d+)\s*[:–—\-]\s*(.+)$/i);
  if (numbered) {
    return {
      code: `FORMULA_${numbered[1]}`,
      name: numbered[2].trim(),
    };
  }

  // "Formula GRM: Gross Rent Multiplier"
  // "GRM: Gross Rent Multiplier"
  // "GRM – Gross Rent Multiplier"
  const m = text.match(/(?:Formula\s+)?([A-Z][A-Z0-9\-]*)\s*[:–—\-]\s*(.+)/i);
  if (m && m[1].length <= 10) {
    return { code: m[1].trim().toUpperCase(), name: m[2].trim() };
  }
  return null;
}

// ─── Question-table parser ────────────────────────────────────────────────────

type QMode = "question" | "choices" | "post_answer" | "rationale" | "calculation";

interface QBuilder {
  questionNumber: number;
  questionLines: string[];
  difficulty: "easy" | "intermediate" | "expert";
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

function parseDifficulty(text: string): "easy" | "intermediate" | "expert" {
  const u = text.toUpperCase();
  if (u.includes("EXPERT")) return "expert";
  if (u.includes("INTERMEDIATE")) return "intermediate";
  return "easy";
}

function finalizeQuestion(qb: QBuilder): ParsedQuestion {
  for (const c of qb.choices) {
    c.isCorrect = qb.correctLetters.includes(c.letter);
  }
  return {
    questionNumber: qb.questionNumber,
    questionText: qb.questionLines.join(" ").replace(/\s+/g, " ").trim(),
    difficulty: qb.difficulty,
    domain: qb.domain,
    formulaRef: qb.formulaRef,
    topicTags: qb.topicTags,
    rationale: qb.rationale.trim(),
    calculation: qb.calculation.trim(),
    choices: qb.choices,
  };
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

function flushQuestion(state: QuestionParserState) {
  if (state.qb && state.qb.choices.length > 0) {
    state.qb.targetFormula.questions.push(finalizeQuestion(state.qb));
  }
  state.qb = null;
}

function parseQuestionHeaderCells(cells: string[], index: number): {
  consumed: number;
  questionNumber: number | null;
  difficultySource: string;
  questionText: string;
} | null {
  const first = cells[index]?.trim() ?? "";
  const qMatch = first.match(/^Q[\s.]?(\d+)/i);
  if (!qMatch) return null;

  const inlineSkill = /SKILL/i.test(first);
  if (inlineSkill) {
    const cleaned = first
      .replace(/^Q[\s.]?\d+\s*/i, "")
      .replace(/SKILL\s*[:\-]?\s*(EASY|INTERMEDIATE|EXPERT)\s*/i, "")
      .trim();
    return {
      consumed: 1,
      questionNumber: Number.parseInt(qMatch[1], 10),
      difficultySource: first,
      questionText: cleaned,
    };
  }

  const second = cells[index + 1]?.trim() ?? "";
  const third = cells[index + 2]?.trim() ?? "";

  if (/^SKILL/i.test(second)) {
    return {
      consumed: 2,
      questionNumber: Number.parseInt(qMatch[1], 10),
      difficultySource: second,
      questionText: "",
    };
  }

  if (/^SKILL/i.test(third)) {
    return {
      consumed: 3,
      questionNumber: Number.parseInt(qMatch[1], 10),
      difficultySource: third,
      questionText: "",
    };
  }

  return null;
}

function consumeQuestionCells(
  cells: string[],
  ctx: ParseContext,
  getTargetFormula: () => ParsedFormula,
  state: QuestionParserState
) {
  for (let index = 0; index < cells.length; index += 1) {
    const text = cells[index]?.trim();
    if (!text) continue;

    const header = parseQuestionHeaderCells(cells, index);
    if (header) {
      startQuestion(
        state,
        ctx,
        getTargetFormula(),
        header.questionNumber,
        header.difficultySource,
        header.questionText
      );
      index += header.consumed - 1;
      continue;
    }

    const qb = state.qb;
    if (!qb) continue;

    const caMatch = text.match(/Correct\s+Answer\s*[:\-]\s*([A-D](?:[,\s]+[A-D])*)/i);
    if (caMatch) {
      qb.correctLetters = caMatch[1]
        .split(/[,\s]+/)
        .map((l) => l.trim().toUpperCase())
        .filter((l) => /^[A-D]$/.test(l));
      qb.mode = "post_answer";
      continue;
    }

    if (/^RATIONALE(?:\s*[:\-]|$)/i.test(text)) {
      qb.mode = "rationale";
      const rest = text.replace(/^RATIONALE\s*[:\-]?\s*/i, "").trim();
      if (rest) qb.rationale = rest;
      continue;
    }

    if (/^(?:STEP[\s\-]*BY[\s\-]*STEP(?:\s+CALCULATION)?|CALCULATION)(?:\s*[:\-]|$)/i.test(text)) {
      qb.mode = "calculation";
      const rest = text
        .replace(/^STEP[\s\-]*BY[\s\-]*STEP(?:\s+CALCULATION)?\s*[:\-]?\s*/i, "")
        .replace(/^CALCULATION\s*[:\-]?\s*/i, "")
        .trim();
      if (rest) qb.calculation = rest;
      continue;
    }

    if (/^FORMULA(?:\s*[:\-]|$)/i.test(text)) {
      qb.mode = "post_answer";
      continue;
    }

    const splitChoiceMatch =
      cells.length >= 2 && /^[A-D]$/i.test(text) && index + 1 < cells.length
        ? { letter: text.toUpperCase(), choiceText: cells[index + 1]?.trim() ?? "" }
        : null;
    if (splitChoiceMatch?.choiceText) {
      qb.mode = "choices";
      qb.choices.push({
        letter: splitChoiceMatch.letter,
        choiceText: splitChoiceMatch.choiceText,
        isCorrect: false,
      });
      index += 1;
      continue;
    }

    const choiceMatch = text.match(/^([A-D])(?:[.)]\s*|\s*-\s+)(.+)$/);
    if (choiceMatch) {
      qb.mode = "choices";
      qb.choices.push({
        letter: choiceMatch[1].toUpperCase(),
        choiceText: choiceMatch[2].trim(),
        isCorrect: false,
      });
      continue;
    }

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
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function parseDocxHtml(html: string): DocxParseResult {
  // ── Split HTML into top-level segments ──────────────────────────────────────
  // We need to handle <table> as a unit (cells can contain <p>/<em> etc.)
  type Segment =
    | { type: "h1" | "h2" | "p"; text: string }
    | { type: "table"; cells: string[] };

  const segments: Segment[] = [];
  // Track table depths to avoid matching inner tags
  // We use a two-pass approach: find tables first, then paragraphs outside them
  const tableRanges: Array<{ start: number; end: number }> = [];
  const tableRe = /<table(\s[^>]*)?>[\s\S]*?<\/table>/gi;
  let tm: RegExpExecArray | null;
  while ((tm = tableRe.exec(html)) !== null) {
    tableRanges.push({ start: tm.index, end: tm.index + tm[0].length });
  }

  function isInsideTable(idx: number): boolean {
    return tableRanges.some((r) => idx > r.start && idx < r.end);
  }

  // Extract headings and paragraphs that are NOT inside tables
  const paraRe = /<(h1|h2|h3|p)(\s[^>]*)?>[\s\S]*?<\/\1>/gi;
  let pm: RegExpExecArray | null;
  const paraSegments: Array<{ pos: number; seg: Segment }> = [];
  while ((pm = paraRe.exec(html)) !== null) {
    if (!isInsideTable(pm.index)) {
      const tag = pm[1].toLowerCase() as "h1" | "h2" | "h3" | "p";
      const text = stripTags(pm[0]);
      if (!text) continue;
      paraSegments.push({
        pos: pm.index,
        seg: { type: tag === "h3" ? "h2" : tag, text } as Segment,
      });
    }
  }

  // Combine with tables, sorted by position
  const tableSegments: Array<{ pos: number; seg: Segment }> = [];
  for (const r of tableRanges) {
    const tableHtml = html.slice(r.start, r.end);
    const cells: string[] = [];
    const cellRe = /<td(\s[^>]*)?>[\s\S]*?<\/td>/gi;
    let cm: RegExpExecArray | null;
    while ((cm = cellRe.exec(tableHtml)) !== null) {
      const cellText = stripTags(cm[0]);
      if (cellText) cells.push(cellText);
    }
    if (cells.length > 0) {
      tableSegments.push({ pos: r.start, seg: { type: "table", cells } });
    }
  }

  const allSegments = [...paraSegments, ...tableSegments].sort((a, b) => a.pos - b.pos);
  for (const { seg } of allSegments) segments.push(seg);

  // ── State machine over segments ─────────────────────────────────────────────
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
    if (!currentSection) {
      ensureSection("General");
    }
    currentFormula = { code, name, questions: [] };
    currentSection!.formulas.push(currentFormula);
  }

  function getContext() {
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
    if (seg.type === "h1") {
      flushQuestion(questionState);
      ensureSection(parseSectionTitle(seg.text));
    } else if (seg.type === "h2") {
      flushQuestion(questionState);
      const fi = parseFormulaHeader(seg.text);
      if (fi) {
        ensureFormula(fi.code, fi.name);
      } else {
        // Treat as a section if it doesn't look like a formula
        ensureSection(seg.text);
      }
    } else if (seg.type === "table") {
      const ctx = getContext();
      consumeQuestionCells(seg.cells, ctx, ensureQuestionTargetFormula, questionState);
    }
    // Skip standalone paragraphs (p) — they are usually headings or blank space
  }

  flushQuestion(questionState);
  const allQuestions = sections.flatMap((s) => s.formulas.flatMap((f) => f.questions));

  return { sections, allQuestions };
}

export async function parseDocxQuestions(buffer: Buffer): Promise<DocxParseResult> {
  const mammoth = await import("mammoth");

  // Convert to HTML — mammoth maps Heading 1 → <h1>, Heading 2 → <h2>, tables → <table>
  const { value: html } = await mammoth.convertToHtml({ buffer });
  return parseDocxHtml(html);
}
