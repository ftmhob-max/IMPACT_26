import {
  IconTile,
  PrimaryAction,
  SectionPanel,
  StatusBadge,
} from "@/components/ui/LearnerPrimitives";
import * as Icons from "@/components/ui/Icons";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { LearnerSession } from "@/lib/firebase/learner-session";

export function ProfileSection({
  session,
  totalAttempts,
  passRate,
  savedFormulas,
  savedGlossaryTerms,
  strongestDomainLabel,
  nextAction,
}: {
  session: LearnerSession;
  totalAttempts: number;
  passRate: number;
  savedFormulas: number;
  savedGlossaryTerms: number;
  strongestDomainLabel: string | null;
  nextAction: { href: string; label: string; detail: string };
}) {
  const fallbackInitial = session.email?.[0]?.toUpperCase() ?? "?";
  const displayInitials = session.fullName
    ? session.fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : fallbackInitial;

  return (
    <SectionPanel className="mb-6 overflow-hidden">
      <div className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(24,95,165,0.12),_transparent_32%),linear-gradient(135deg,#ffffff_0%,#f8fbff_48%,#f8f6f0_100%)] p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-base font-bold text-white shadow-sm ring-4 ring-white/90">
              {displayInitials}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-[-0.02em] text-slate-950">
                  {session.fullName || "Learner"}
                </h2>
                <StatusBadge tone="blue" className="px-2 py-0.5 text-[10px]">
                  {session.role}
                </StatusBadge>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-500">{session.email || "No email available"}</p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                {totalAttempts > 0
                  ? `You have completed ${totalAttempts} attempt${totalAttempts === 1 ? "" : "s"} so far. Use this page to keep your strongest work visible and your weakest domain in focus.`
                  : "This page becomes your study command center once you begin submitting practice work. Start an exam, then return here for tailored guidance."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#185FA5] ring-1 ring-[#b8d7f0]">
                  {totalAttempts > 0 ? `${passRate}% pass rate` : "No baseline yet"}
                </span>
                <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-600 ring-1 ring-slate-200">
                  {savedFormulas} saved formulas
                </span>
                <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-600 ring-1 ring-slate-200">
                  {savedGlossaryTerms} saved terms
                </span>
                {strongestDomainLabel && (
                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-700 ring-1 ring-emerald-200">
                    Strongest: {strongestDomainLabel}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
            <div className="flex items-start gap-3">
              <IconTile icon={Icons.Compass} tone="blue" size={18} className="h-10 w-10" />
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#185FA5]">Next best action</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{nextAction.label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{nextAction.detail}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <PrimaryAction href={nextAction.href}>{nextAction.label}</PrimaryAction>
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </SectionPanel>
  );
}
