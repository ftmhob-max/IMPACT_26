// Front-end published learner exam catalog: app/(platform)/exams/page.tsx

import Link from "next/link";

import { StartQuizButton } from "@/components/quiz/StartQuizButton";
import {
  EmptyState,
  LearnerPage,
  PageHeader,
  SectionPanel,
  StatusBadge,
} from "@/components/ui/LearnerPrimitives";
import * as Icons from "@/components/ui/Icons";
import { getExamCatalog, type ExamCatalogItem } from "@/lib/firebase/learner-portal";
import { getLearnerSession } from "@/lib/firebase/learner-session";

async function loadExamCatalog(): Promise<ExamCatalogItem[]> {
  const session = await getLearnerSession();
  if (!session) return [];

  try {
    return await getExamCatalog(session.uid);
  } catch (error) {
    console.error("[exams/page] Failed to load exam catalog", error);
    return [];
  }
}

export default async function ExamsPage() {
  const exams = await loadExamCatalog();

  return (
    <LearnerPage>
      <PageHeader
        eyebrow="Assessment center"
        title="Published exams"
        description="Measure your evaluator readiness with published assessments and review your own attempt history."
        icon={Icons.ClipboardList}
      />

      {exams.length === 0 ? (
        <EmptyState
          title="No published exams available"
          description="There are no published assessments to display, or the catalog could not be loaded. No placeholder exams have been added."
          action={<Link className="text-sm font-bold text-[#185FA5] hover:underline" href="/courses">Return to courses</Link>}
          icon={Icons.ClipboardList}
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {exams.map((exam) => <ExamCard key={exam.id} exam={exam} />)}
        </div>
      )}
    </LearnerPage>
  );
}

function ExamCard({ exam }: { exam: ExamCatalogItem }) {
  const latestAttempt = exam.latestAttempt;
  const durationMinutes = exam.timeLimitSeconds
    ? Math.ceil(exam.timeLimitSeconds / 60)
    : null;

  return (
    <SectionPanel className="flex h-full flex-col">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="green">Published</StatusBadge>
          <StatusBadge tone="slate">
            {exam.questionCount} question{exam.questionCount === 1 ? "" : "s"}
          </StatusBadge>
          <StatusBadge tone="purple">
            {exam.domainCount} domain{exam.domainCount === 1 ? "" : "s"}
          </StatusBadge>
        </div>

        <h2 className="mt-4 text-xl font-extrabold tracking-[-0.02em] text-slate-950">
          {exam.title}
        </h2>
        {exam.description && (
          <p className="mt-2 text-sm leading-6 text-slate-600">{exam.description}</p>
        )}

        <div className="mt-5 grid grid-cols-3 gap-2">
          <ExamMetric label="Time" value={durationMinutes ? `${durationMinutes} min` : "Untimed"} />
          <ExamMetric label="Pass mark" value={exam.passingScore === null ? "—" : `${exam.passingScore}%`} />
          <ExamMetric label="Best score" value={exam.bestScorePct === null ? "—" : `${exam.bestScorePct}%`} />
        </div>

        {exam.domains.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Exam domains">
            {exam.domains.map((domain) => (
              <span key={domain} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {domain}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
            {exam.attemptCount} completed attempt{exam.attemptCount === 1 ? "" : "s"}
          </p>
          {latestAttempt && (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
              <p className="text-sm font-semibold text-slate-700">
                Latest: {latestAttempt.scorePct === null ? "Not scored" : `${latestAttempt.scorePct}%`}
              </p>
              <Link
                href={`/quiz/${latestAttempt.id}/review`}
                className="text-sm font-bold text-[#185FA5] hover:underline"
              >
                Review attempt
              </Link>
            </div>
          )}
        </div>

        <div className="mt-5">
          <StartQuizButton
            quizId={exam.id}
            timeLimitSeconds={exam.timeLimitSeconds}
            shuffleQuestions={exam.shuffleQuestions}
            shuffleChoices={exam.shuffleChoices}
            calculatorSettingsJson={exam.calculatorSettingsJson}
            label={exam.attemptCount > 0 ? "Start another attempt" : "Start exam"}
          />
        </div>
      </div>
    </SectionPanel>
  );
}

function ExamMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-[#fbfcfe] px-3 py-2.5">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
