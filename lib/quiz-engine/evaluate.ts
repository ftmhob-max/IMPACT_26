/**
 * Server-only module. Fetches correct answers from Firebase Admin SDK
 * and builds the EvaluationResult returned to the browser after submission.
 *
 * Import path: @/lib/quiz-engine/evaluate
 * NEVER import this file in a client component.
 */

import { scoreAnswer } from "./scoring";

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
    // Full choice data — safe to return because the question has already been answered
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

/** Fisher-Yates shuffle — used for question and choice ordering */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
