/**
 * One-time migration script.
 * Extracts 80 questions + 53 formulas from IMPACT26V1_Practice_Exam_FINAL.html
 * and imports them into Firebase Data Connect via the Admin SDK.
 *
 * Usage:
 *   SERVICE_ACCOUNT_KEY='...' \
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID='impact26-aa59b' \
 *   node --loader ts-node/esm scripts/import-questions.ts
 *
 * Or with tsx:
 *   npx tsx scripts/import-questions.ts
 */

import { readFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { parse as parseHtml } from "node-html-parser";
import { initializeApp, cert, getApps, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// ─── Config ──────────────────────────────────────────────────────────────────

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "impact26-aa59b";
const SERVICE_ACCOUNT_KEY = process.env.SERVICE_ACCOUNT_KEY;
const HTML_PATH = join(process.cwd(), "public", "index.html");
const DC_BASE_URL = process.env.FIREBASE_DATACONNECT_EMULATOR_HOST
  ? `http://${process.env.FIREBASE_DATACONNECT_EMULATOR_HOST}/v1beta/projects/${PROJECT_ID}/locations/us-central1/services/impact26-dataconnect/connectors/impact26-connector`
  : `https://firebasedataconnect.googleapis.com/v1beta/projects/${PROJECT_ID}/locations/us-central1/services/impact26-dataconnect/connectors/impact26-connector`;

// ─── Firebase Admin init ─────────────────────────────────────────────────────

let app: App | null = null;
const isEmulator = !!process.env.FIREBASE_DATACONNECT_EMULATOR_HOST;

if (!getApps().length) {
  if (SERVICE_ACCOUNT_KEY) {
    app = initializeApp({ credential: cert(JSON.parse(SERVICE_ACCOUNT_KEY)), projectId: PROJECT_ID });
  } else if (!isEmulator) {
    throw new Error("Set SERVICE_ACCOUNT_KEY env var before running");
  }
} else {
  app = getApps()[0];
}
const adminAuth = app ? getAuth(app) : null;

// ─── Types (mirror the Q array in the HTML) ──────────────────────────────────

interface RawQuestion {
  id: number;
  diff: "easy" | "proficient" | "expert";
  dom: "math" | "appraisal" | "law" | "philly" | "admin" | "ethics";
  fml: string;
  txt: string;
  ch: string[]; // ["A. text", "B. text", ...]
  ans: string;  // "A" or "A,B" for multi-select
  ansT: string;
  calc: string;
  rat: string;
  ref: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAdminToken(): Promise<string> {
  if (isEmulator) return "owner";
  // Use the service account's access token to call the Data Connect REST API
  // @ts-ignore
  const accessTokenObj = await app?.options.credential?.getAccessToken();
  return accessTokenObj?.access_token || "";
}

async function dcMutate(operationName: string, variables: Record<string, unknown>) {
  const token = await getAdminToken();
  const res = await fetch(`${DC_BASE_URL}:executeMutation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ operationName, variables }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Data Connect mutation '${operationName}' failed: ${text}`);
  }
  return res.json();
}

function parseAnswerLetters(ans: string): string[] {
  return ans.split(",").map((s) => s.trim().toUpperCase());
}

function stripChoicePrefix(text: string): string {
  // "A. Some text" → "Some text"
  return text.replace(/^[A-G]\.\s*/, "").trim();
}

// ─── Extract Q array from HTML ───────────────────────────────────────────────

function extractQArray(html: string): RawQuestion[] {
  // The Q array is defined as: const Q = [ ... ];
  const match = html.match(/const\s+Q\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) throw new Error("Could not find Q array in HTML file");

  // Safe eval in a controlled scope — this is a migration script, not production code
  // eslint-disable-next-line no-new-func
  const questions: RawQuestion[] = new Function(`return ${match[1]}`)();
  return questions;
}

// ─── Extract formula sections from HTML ──────────────────────────────────────

interface FormulaData {
  sections: Array<{
    code: string;
    title: string;
    position: number;
    formulas: Array<{
      code: string;
      name: string;
      expression: string;
      position: number;
    }>;
  }>;
}

function extractFormulas(html: string): FormulaData {
  const root = parseHtml(html);
  const sections: FormulaData["sections"] = [];

  const sectionEls = root.querySelectorAll(".fi-section");
  sectionEls.forEach((sectionEl, sIdx) => {
    const titleEl = sectionEl.querySelector(".fi-s-title");
    const rawTitle = titleEl?.text?.trim() ?? `Section ${sIdx + 1}`;

    // Extract section code like "S1" from "Section 1 — Sales Comparison"
    const codeMatch = rawTitle.match(/^(S\d+)/i);
    const code = codeMatch ? codeMatch[1].toUpperCase() : `S${sIdx + 1}`;

    const formulas: FormulaData["sections"][0]["formulas"] = [];
    const formulaEls = sectionEl.querySelectorAll(".fi-formula");

    formulaEls.forEach((fEl, fIdx) => {
      const nameEl = fEl.querySelector(".fi-fname");
      const rawName = nameEl?.text?.trim() ?? "";
      // "S1·F1 Trending Forward" → code="S1·F1", name="Trending Forward"
      const nameMatch = rawName.match(/^(S\d+[··]F\d+)\s+(.+)$/);
      const formulaCode = nameMatch ? nameMatch[1] : `${code}·F${fIdx + 1}`;
      const formulaName = nameMatch ? nameMatch[2] : rawName;

      // Expression is the rest of the formula text after the name element
      const fullText = fEl.text ?? "";
      const expression = fullText.replace(rawName, "").trim();

      formulas.push({
        code: formulaCode,
        name: formulaName,
        expression: expression || formulaName,
        position: fIdx,
      });
    });

    sections.push({ code, title: rawTitle, position: sIdx, formulas });
  });

  return { sections };
}

// ─── Main migration ───────────────────────────────────────────────────────────

async function main() {
  console.log("Reading HTML file...");
  const html = readFileSync(HTML_PATH, "utf-8");

  // ── Import questions ──────────────────────────────────────────────────────
  console.log("Extracting questions...");
  const questions = extractQArray(html);
  console.log(`Found ${questions.length} questions`);

  const questionIdMap = new Map<number, string>(); // original id → Data Connect UUID

  for (const q of questions) {
    const correctLetters = parseAnswerLetters(q.ans);
    const isMultiselect = correctLetters.length > 1;

    // Create question
    const questionId = randomUUID();
    await dcMutate("CreateQuestion", {
      id: questionId,
      questionText: q.txt,
      difficulty: q.diff,
      domain: q.dom,
      formulaRef: q.fml || null,
      isMultiselect,
      rationale: q.rat || null,
      calculation: q.calc || null,
      sourceRef: q.ref || null,
      createdById: null,
    });

    questionIdMap.set(q.id, questionId);

    // Create answer choices
    for (let i = 0; i < q.ch.length; i++) {
      const letter = String.fromCharCode(65 + i); // A, B, C, D, E
      const choiceText = stripChoicePrefix(q.ch[i]);
      const isCorrect = correctLetters.includes(letter);

      await dcMutate("CreateAnswerChoice", {
        questionId,
        letter,
        choiceText,
        isCorrect,
        explanation: null, // to be filled in via admin panel
        position: i,
      });
    }

    console.log(`  ✓ Q${q.id} (${q.diff}, ${q.dom})`);
  }

  // ── Create default quiz with all 80 questions ─────────────────────────────
  console.log("\nCreating default quiz...");
  const quizId = randomUUID();
  await dcMutate("CreateQuiz", {
    id: quizId,
    title: "IMPACT_26V.1 Full Practice Exam",
    description:
      "80-question practice exam covering all six domains of the IMPACT_26 property assessment curriculum.",
    timeLimitSeconds: null,
    passingScore: 70.0,
    shuffleQuestions: true,
    shuffleChoices: false,
    createdById: null,
  });
  console.log(`  Quiz ID: ${quizId}`);

  // Add all questions to quiz in original order
  for (const q of questions) {
    const questionId = questionIdMap.get(q.id);
    if (!questionId) continue;
    await dcMutate("AddQuestionToQuiz", {
      quizId,
      questionId,
      position: q.id - 1, // 0-indexed
      pointValue: 1.0,
    });
  }
  console.log(`  Added ${questions.length} questions to quiz`);

  // ── Import formula reference ───────────────────────────────────────────────
  console.log("\nImporting formula reference...");
  const { sections } = extractFormulas(html);

  for (const section of sections) {
    const sectionId = randomUUID();
    await dcMutate("CreateFormulaSection", {
      id: sectionId,
      code: section.code,
      title: section.title,
      position: section.position,
    });

    for (const formula of section.formulas) {
      await dcMutate("CreateFormula", {
        sectionId,
        code: formula.code,
        name: formula.name,
        expression: formula.expression,
        notes: null,
        position: formula.position,
      });
    }
    console.log(`  ✓ ${section.code}: ${section.formulas.length} formulas`);
  }

  console.log("\n✅ Migration complete!");
  console.log(`   ${questions.length} questions imported`);
  console.log(`   ${sections.length} formula sections imported`);
  console.log(`   Default quiz ID: ${quizId}`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
