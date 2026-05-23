"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/client-fetch";
import { QuestionBuilderClient } from "@/components/admin/QuestionBuilderClient";
import { QuestionBankClient } from "@/components/admin/QuestionBankClient";
import { DocxImportClient } from "@/components/admin/DocxImportClient";
import * as Icons from "@/components/ui/Icons";

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  difficulty: string;
  domain: string;
  formulaRef?: string | null;
  topicTags?: string | null;
  status: string;
  version: number;
  isMultiselect: boolean;
  rationale?: string | null;
  calculation?: string | null;
  sourceRef?: string | null;
  createdAt: string;
  answerChoices_on_question: Array<{
    id: string;
    letter: string;
    choiceText: string;
    isCorrect: boolean;
    explanation?: string | null;
    position: number;
  }>;
}

interface QuizOption {
  id: string;
  title: string;
}

export function QuestionBankPageClient({
  initialQuestions,
  initialQuizzes,
}: {
  initialQuestions: Question[];
  initialQuizzes: QuizOption[];
}) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [quizzes, setQuizzes] = useState<QuizOption[]>(initialQuizzes);
  const [importOpen, setImportOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);

  const refreshPageData = useCallback(async () => {
    const [questionsRes, overviewRes] = await Promise.all([
      adminFetch("/api/admin/questions", { cache: "no-store" }),
      adminFetch("/api/admin/overview", { cache: "no-store" }),
    ]);

    if (questionsRes.ok) {
      const data = await questionsRes.json();
      setQuestions(data.questions ?? []);
    }

    if (overviewRes.ok) {
      const data = await overviewRes.json();
      setQuizzes(data.quizzes ?? []);
    }
  }, []);

  useEffect(() => {
    if (questions.length > 0 && quizzes.length > 0) return;
    void refreshPageData();
  }, [questions.length, quizzes.length, refreshPageData]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Question Bank</h1>
        <p className="mt-1 text-sm text-slate-500">
          {questions.length} question{questions.length !== 1 ? "s" : ""} · Import via CSV or build manually, then assign to a quiz.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setImportOpen((open) => !open)}
            className="flex w-full items-center gap-2 border-b border-slate-100 px-4 py-3 text-left"
          >
            <span className="text-[#185FA5]">📄</span>
            <h2 className="text-sm font-bold text-slate-900">Question Import</h2>
            <span className="ml-auto text-xs text-slate-400">DOCX or CSV</span>
            {importOpen ? <Icons.ChevronUp size={16} className="text-slate-400" /> : <Icons.ChevronDown size={16} className="text-slate-400" />}
          </button>
          {importOpen && (
            <div className="p-4">
              <DocxImportClient onImported={refreshPageData} />
            </div>
          )}
        </div>

        <div className="rounded-xl border border-black/10 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setManualOpen((open) => !open)}
            className="flex w-full items-center gap-2 border-b border-slate-100 px-4 py-3 text-left"
          >
            <span className="text-[#185FA5]">✏️</span>
            <h2 className="text-sm font-bold text-slate-900">Manual Builder</h2>
            <span className="ml-auto text-xs text-slate-400">Multiple choice, multiselect, scenario</span>
            {manualOpen ? <Icons.ChevronUp size={16} className="text-slate-400" /> : <Icons.ChevronDown size={16} className="text-slate-400" />}
          </button>
          {manualOpen && (
            <div className="p-4">
              <QuestionBuilderClient mode="manual" quizzes={quizzes} onChanged={refreshPageData} />
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">All questions</h2>
        <QuestionBankClient questions={questions} quizzes={quizzes} />
      </div>
    </div>
  );
}
