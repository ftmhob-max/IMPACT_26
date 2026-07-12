// Front-end quiz attempt loading boundary: app/(quiz)/quiz/[attemptId]/loading.tsx
import { LearnerRouteSkeleton } from "@/components/ui/LearnerRouteSkeleton";

export default function QuizAttemptLoading() {
  return <LearnerRouteSkeleton label="Preparing your quiz attempt" variant="quiz" />;
}
