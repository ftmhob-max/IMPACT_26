/**
 * Strips isCorrect and explanation from answer choices before sending to the browser.
 * Called when building the initial QuizSession payload in /api/quiz/[quizId]/start.
 *
 * The trust boundary: correct answers NEVER leave the server until AFTER
 * the learner has submitted their answer for a given question.
 */

export interface RawAnswerChoice {
  id: string;
  letter: string;
  choiceText: string;
  isCorrect: boolean;
  explanation: string | null;
  position: number;
}

export interface SafeAnswerChoice {
  id: string;
  letter: string;
  choiceText: string;
  position: number;
}

export function sanitizeChoices(choices: RawAnswerChoice[]): SafeAnswerChoice[] {
  return choices.map(({ id, letter, choiceText, position }) => ({
    id,
    letter,
    choiceText,
    position,
  }));
}

export interface RawQuestion {
  id: string;
  questionText: string;
  difficulty: string;
  domain: string;
  formulaRef: string | null;
  isMultiselect: boolean;
  answerChoices: RawAnswerChoice[];
}

export interface SafeQuestion {
  id: string;
  questionText: string;
  difficulty: string;
  domain: string;
  formulaRef: string | null;
  isMultiselect: boolean;
  choices: SafeAnswerChoice[];
}

export function sanitizeQuestion(q: RawQuestion): SafeQuestion {
  return {
    id: q.id,
    questionText: q.questionText,
    difficulty: q.difficulty,
    domain: q.domain,
    formulaRef: q.formulaRef,
    isMultiselect: q.isMultiselect,
    choices: sanitizeChoices(q.answerChoices),
  };
}
