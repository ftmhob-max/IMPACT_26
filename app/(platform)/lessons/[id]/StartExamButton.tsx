"use client";

import { StartQuizButton } from "@/components/quiz/StartQuizButton";

interface Props {
  quizId: string;
  timeLimitSeconds: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  calculatorSettingsJson?: string | null;
}

export function StartExamButton(props: Props) {
  return <StartQuizButton {...props} />;
}
