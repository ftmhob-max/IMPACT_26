"use client";

import { useState } from "react";
import { CsvImportPanel } from "./CsvImportPanel";
import { ManualQuestionPanel } from "./ManualQuestionPanel";

interface QuestionBuilderClientProps {
  mode: "csv" | "manual";
  quizzes: Array<{ id: string; title: string }>;
}

export function QuestionBuilderClient({ mode, quizzes }: QuestionBuilderClientProps) {
  const [notice, setNotice] = useState<string | null>(null);

  if (mode === "csv") {
    return (
      <CsvImportPanel
        quizzes={quizzes}
        onImported={(msg) => setNotice(msg)}
      />
    );
  }

  return (
    <ManualQuestionPanel
      quizzes={quizzes}
      onSaved={(msg) => setNotice(msg)}
    />
  );
}
