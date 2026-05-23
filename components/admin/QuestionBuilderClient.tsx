"use client";

import { useState } from "react";
import { CsvImportPanel } from "./CsvImportPanel";
import { ManualQuestionPanel } from "./ManualQuestionPanel";

interface QuestionBuilderClientProps {
  mode: "csv" | "manual";
  quizzes: Array<{ id: string; title: string }>;
  onChanged?: () => void | Promise<void>;
}

export function QuestionBuilderClient({ mode, quizzes, onChanged }: QuestionBuilderClientProps) {
  const [notice, setNotice] = useState<string | null>(null);

  if (mode === "csv") {
    return (
      <CsvImportPanel
        onImported={({ message }) => {
          setNotice(message);
          void onChanged?.();
        }}
      />
    );
  }

  return (
    <ManualQuestionPanel
      quizzes={quizzes}
      onSaved={(msg) => {
        setNotice(msg);
        void onChanged?.();
      }}
    />
  );
}
