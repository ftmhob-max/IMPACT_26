import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon?: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      {icon && <div className="text-slate-200">{icon}</div>}
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {hint && <p className="max-w-sm text-xs leading-5 text-slate-400">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
