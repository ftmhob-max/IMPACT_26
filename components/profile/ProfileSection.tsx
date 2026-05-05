import { SectionPanel } from "@/components/ui/LearnerPrimitives";
import * as Icons from "@/components/ui/Icons";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { LearnerSession } from "@/lib/firebase/learner-session";

export function ProfileSection({ session }: { session: LearnerSession }) {
  return (
    <SectionPanel className="mb-6">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-sm ring-4 ring-slate-100">
            {session.fullName
              ? session.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : session.email[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {session.fullName || "Learner"}
              </h2>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#185FA5] ring-1 ring-inset ring-blue-700/10">
                {session.role}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{session.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SignOutButton />
        </div>
      </div>
    </SectionPanel>
  );
}
