// Front-end: shared hero header for Teacher Portal admin pages.
import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}

export function AdminPageHeader({ icon, eyebrow, title, description }: AdminPageHeaderProps) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#185FA5] text-white shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#185FA5]">{eyebrow}</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
