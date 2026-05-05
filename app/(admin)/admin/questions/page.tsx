import Link from "next/link";
import { DomainBadge } from "@/components/ui/DomainBadge";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import type { Domain, Difficulty } from "@/lib/utils";

// Server component — fetches from Data Connect via Admin SDK
async function getQuestions() {
  const data = await adminDcQuery<{ questions: Array<{ id: string; questionText: string; domain: string; difficulty: string; formulaRef?: string }> }>(
    "AdminListQuestions"
  ).catch(() => ({ questions: [] }));
  return data.questions;
}

export default async function QuestionBankPage() {
  const questions = await getQuestions();

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Question Bank</h1>
          <p className="text-slate-500 mt-1 text-sm">{questions.length} questions</p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open builder
        </Link>
      </div>

      {questions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center space-y-3">
          <p className="text-slate-400 text-sm">No questions yet.</p>
          <p className="text-slate-400 text-xs">
            Run the migration script to import the 80 existing questions, or create new ones manually.
          </p>
          <code className="block text-xs bg-slate-100 text-slate-600 rounded px-3 py-2 font-mono max-w-md mx-auto">
            npx tsx scripts/import-questions.ts
          </code>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Question</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Domain</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Difficulty</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Formula</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(questions as Array<{ id: string; questionText: string; domain: string; difficulty: string; formulaRef?: string }>).map((q) => (
                <tr key={q.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 max-w-xs">
                    <p className="truncate text-slate-800">{q.questionText}</p>
                  </td>
                  <td className="px-4 py-3">
                    <DomainBadge domain={q.domain as Domain} />
                  </td>
                  <td className="px-4 py-3">
                    <DifficultyBadge difficulty={q.difficulty as Difficulty} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {q.formulaRef ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href="/admin"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
