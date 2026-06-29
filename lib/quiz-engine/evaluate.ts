/**
 * Server-only module. Fetches correct answers from Firebase Admin SDK
 * and builds the EvaluationResult returned to the browser after submission.
 *
 * Import path: @/lib/quiz-engine/evaluate
 * NEVER import this file in a client component.
 */

export interface AnswerChoiceRecord {
  id: string;
  letter: string;
  choiceText: string;
  isCorrect: boolean;
  explanation: string | null;
  position: number;
}

export interface QuestionRecord {
  id: string;
  rationale: string | null;
  calculation: string | null;
  sourceRef: string | null;
  answerChoices: AnswerChoiceRecord[];
}

export interface EvaluationResult {
  isCorrect: boolean;
  pointsEarned: number;
  pointsPossible: number;
  correctLetters: string[];
  choices: Array<{
    letter: string;
    choiceText: string;
    isCorrect: boolean;
    explanation: string | null;
  }>;
  rationale: string | null;
  calculation: string | null;
  sourceRef: string | null;
}

interface ScoreResult {
  pointsEarned: number;
  pointsPossible: number;
  isCorrect: boolean;
}

/**
 * Single-select: full credit if the one selected letter matches the one correct letter.
 * Multi-select: partial credit with a guessing penalty.
 */
function scoreAnswer(
  selectedLetters: string[],
  correctLetters: string[],
  pointValue: number
): ScoreResult {
  if (correctLetters.length === 0) {
    return { pointsEarned: 0, pointsPossible: pointValue, isCorrect: false };
  }

  const correctSet = new Set(correctLetters);
  const selectedSet = new Set(selectedLetters);

  if (correctLetters.length === 1) {
    const isCorrect = selectedSet.size === 1 && selectedSet.has(correctLetters[0]);
    return {
      pointsEarned: isCorrect ? pointValue : 0,
      pointsPossible: pointValue,
      isCorrect,
    };
  }

  let correctHits = 0;
  let incorrectHits = 0;

  for (const letter of selectedSet) {
    if (correctSet.has(letter)) {
      correctHits++;
    } else {
      incorrectHits++;
    }
  }

  const raw = Math.max(0, correctHits - incorrectHits);
  const pointsEarned = pointValue * (raw / correctLetters.length);
  const isCorrect = raw === correctLetters.length && incorrectHits === 0;

  return {
    pointsEarned: Math.round(pointsEarned * 100) / 100,
    pointsPossible: pointValue,
    isCorrect,
  };
}

export function evaluateAnswer(
  question: QuestionRecord,
  selectedLetters: string[],
  pointValue: number
): EvaluationResult {
  const correctLetters = question.answerChoices
    .filter((c) => c.isCorrect)
    .map((c) => c.letter);

  const { pointsEarned, pointsPossible, isCorrect } = scoreAnswer(
    selectedLetters,
    correctLetters,
    pointValue
  );

  return {
    isCorrect,
    pointsEarned,
    pointsPossible,
    correctLetters,
    choices: question.answerChoices
      .sort((a, b) => a.position - b.position)
      .map((c) => ({
        letter: c.letter,
        choiceText: c.choiceText,
        isCorrect: c.isCorrect,
        explanation: c.explanation,
      })),
    rationale: question.rationale,
    calculation: question.calculation,
    sourceRef: question.sourceRef,
  };
}
