import Link from "next/link";
import type { ReactNode, ComponentType } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronLeft, type IconProps } from "./Icons";

export function LearnerPage({
  children,
  width = "wide",
}: {
  children: ReactNode;
  width?: "narrow" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-6 sm:px-6 sm:py-8",
        width === "narrow" ? "max-w-3xl" : "max-w-5xl"
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  eyebrow,
  action,
  backHref,
  backLabel,
  icon: Icon,
}: {
  title: string;
  description?: string | null;
  eyebrow?: string;
  action?: ReactNode;
  backHref?: string;
  backLabel?: string;
  icon?: ComponentType<IconProps>;
}) {
  return (
    <header className="mb-6">
      {backHref && backLabel && (
        <Link href={backHref} className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#185FA5] hover:underline">
          <ChevronLeft size={14} />
          {backLabel}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
              {eyebrow}
            </p>
          )}
          <div className="flex items-center gap-3">
            {Icon && <Icon className="text-[#185FA5]" size={28} />}
            <h1 className="text-2xl font-bold leading-tight tracking-[-0.01em] text-slate-950">
              {title}
            </h1>
          </div>
          {description && <p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}

export function SectionPanel({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-slate-200 bg-white shadow-sm", className)}>
      {(title || description) && (
        <div className="border-b border-slate-100 px-5 py-4">
          {title && <h2 className="text-sm font-semibold text-slate-800">{title}</h2>}
          {description && <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  tone = "blue",
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail?: string;
  tone?: "blue" | "green" | "amber" | "slate";
  icon?: ComponentType<IconProps>;
}) {
  const tones = {
    blue: "text-[#185FA5] bg-[#E6F1FB]",
    green: "text-[#3B6D11] bg-[#EAF3DE]",
    amber: "text-[#854F0B] bg-[#FAEEDA]",
    slate: "text-slate-700 bg-slate-100",
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className={cn("inline-flex rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em]", tones[tone])}>
          {label}
        </div>
        {Icon && <Icon className={cn("opacity-40", tones[tone].split(" ")[0])} size={20} />}
      </div>
      <p className="text-2xl font-extrabold leading-none tracking-[-0.02em] text-slate-950">{value}</p>
      {detail && <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>}
    </div>
  );
}

export function PrimaryAction({
  href,
  children,
  onClick,
  disabled,
  icon: showIcon = true,
}: {
  href?: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: boolean;
}) {
  const classes =
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0d3d6e] disabled:cursor-not-allowed disabled:opacity-55";

  const content = (
    <>
      {children}
      {showIcon && <ArrowRight size={16} />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ComponentType<IconProps>;
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
      {Icon && (
        <div className="mb-4 flex justify-center text-slate-300">
          <Icon size={48} strokeWidth={1.5} />
        </div>
      )}
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

