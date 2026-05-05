"use client";

import { StartQuizButton } from "@/components/quiz/StartQuizButton";

interface Props {
  quizId: string;
  timeLimitSeconds: number | null;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
}

export function StartExamButton(props: Props) {
  return <StartQuizButton {...props} />;
}
