// Front-end learner certificate page: app/(platform)/certificates/[slug]/page.tsx

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CertificatePrintButton } from "@/components/platform/CertificatePrintButton";
import * as Icons from "@/components/ui/Icons";
import {
  EmptyState,
  LearnerPage,
  PageHeader,
  PrimaryAction,
} from "@/components/ui/LearnerPrimitives";
import { adminDcQuery } from "@/lib/firebase/admin-dc";
import { getCourseCertificateEligibility } from "@/lib/firebase/certificates";
import { getLearnerSession } from "@/lib/firebase/learner-session";

interface LearnerProfile {
  fullName: string | null;
  email: string;
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const learnerSession = await getLearnerSession();
  if (!learnerSession) redirect("/sign-in");

  const { slug } = await params;
  const [{ course, eligibility }, profileData] = await Promise.all([
    getCourseCertificateEligibility(learnerSession.uid, slug),
    adminDcQuery<{ users: LearnerProfile[] }>("GetLearnerProfile", {
      userId: learnerSession.uid,
    }).catch(() => ({ users: [] })),
  ]);
  if (!course || !eligibility) notFound();

  if (!eligibility.eligible) {
    return (
      <LearnerPage width="narrow">
        <PageHeader
          backHref={`/courses/${slug}`}
          backLabel="Back to course"
          eyebrow="Certificate locked"
          title="Complete every published lesson"
          description={`${eligibility.completedLessonCount} of ${eligibility.publishedLessonCount} lessons complete in ${course.title}.`}
          icon={Icons.Lock}
        />
        <EmptyState
          title="Your certificate is not available yet"
          description="Finish all published lessons in this course. Your certificate will unlock automatically when the final lesson is complete."
          icon={Icons.Lock}
          action={<PrimaryAction href={`/courses/${slug}`}>Continue course</PrimaryAction>}
        />
      </LearnerPage>
    );
  }

  const learnerProfile = profileData.users[0];
  const learnerName =
    learnerProfile?.fullName?.trim() ||
    learnerSession.fullName?.trim() ||
    learnerProfile?.email?.split("@")[0] ||
    learnerSession.email.split("@")[0] ||
    "IMPACT Learner";
  const issueDate = new Date(eligibility.issueDate ?? Date.now()).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" },
  );

  return (
    <main className="certificate-page min-h-screen bg-slate-100 px-4 py-8 print:bg-white print:p-0">
      <div className="certificate-actions mx-auto mb-4 flex max-w-5xl items-center justify-between gap-3 print:hidden">
        <Link href={`/courses/${slug}`} className="text-sm font-bold text-[#185FA5] hover:underline">
          ← Back to course
        </Link>
        <CertificatePrintButton />
      </div>
      <section className="certificate-sheet mx-auto flex aspect-[1.294/1] max-w-5xl flex-col justify-between border-[12px] border-double border-[#185FA5] bg-white px-12 py-10 text-center shadow-xl print:shadow-none">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#185FA5]">
            IMPACT_26 Academy
          </p>
          <h1 className="mt-5 font-serif text-5xl font-bold tracking-tight text-slate-950">
            Certificate of Completion
          </h1>
          <p className="mt-5 text-base text-slate-600">This certificate is proudly presented to</p>
        </div>
        <div>
          <p className="border-b-2 border-slate-300 pb-3 font-serif text-4xl font-bold text-[#185FA5]">
            {learnerName}
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            for successfully completing every published lesson in
          </p>
          <h2 className="mt-3 text-2xl font-extrabold text-slate-950">{course.title}</h2>
        </div>
        <div className="flex items-end justify-between gap-8 text-left">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Issued</p>
            <p className="mt-1 font-semibold text-slate-800">{issueDate}</p>
          </div>
          <Icons.Award size={56} className="text-[#185FA5]" />
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
              Credential
            </p>
            <p className="mt-1 font-semibold text-slate-800">IMPACT_26 Academy</p>
          </div>
        </div>
      </section>
    </main>
  );
}
