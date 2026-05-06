import Link from "next/link";
import type { ReactNode, ComponentType } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronLeft, type IconProps } from "./Icons";

type Tone = "blue" | "green" | "amber" | "slate" | "red" | "purple";

const toneStyles: Record<Tone, { text: string; bg: string; border: string; soft: string }> = {
  blue: { text: "text-[#185FA5]", bg: "bg-[#185FA5]", border: "border-[#b8d7f0]", soft: "bg-[#E6F1FB]" },
  green: { text: "text-[#2f7a4d]", bg: "bg-[#2f7a4d]", border: "border-[#b9d8c5]", soft: "bg-[#f5fbf7]" },
  amber: { text: "text-[#854F0B]", bg: "bg-[#c47c00]", border: "border-[#ecd39b]", soft: "bg-[#FAEEDA]" },
  slate: { text: "text-slate-700", bg: "bg-slate-800", border: "border-slate-200", soft: "bg-slate-100" },
  red: { text: "text-red-700", bg: "bg-red-700", border: "border-red-200", soft: "bg-red-50" },
  purple: { text: "text-[#534AB7]", bg: "bg-[#534AB7]", border: "border-[#d8d5fb]", soft: "bg-[#EEEDFE]" },
};

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
        "mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:py-10",
        width === "narrow" ? "max-w-3xl" : "max-w-6xl"
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
    <header className="mb-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {backHref && backLabel && (
        <Link
          href={backHref}
          className="mx-5 mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#185FA5] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
        >
          <ChevronLeft size={14} />
          {backLabel}
        </Link>
      )}
      <div className="relative flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:py-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#185FA5]" />
        <div className="max-w-3xl">
          <div className="flex items-start gap-3">
            {Icon && <IconTile icon={Icon} tone="blue" className="mt-0.5" />}
            <div>
              {eyebrow && (
                <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">
                  {eyebrow}
                </p>
              )}
              <h1 className="text-2xl font-extrabold leading-tight tracking-[-0.02em] text-slate-950 sm:text-3xl">
                {title}
              </h1>
              {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>}
            </div>
          </div>
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
    <section className={cn("overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm", className)}>
      {(title || description) && (
        <div className="border-b border-slate-100 px-5 py-4">
          {title && <h2 className="text-sm font-extrabold text-slate-900">{title}</h2>}
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
  tone?: Tone;
  icon?: ComponentType<IconProps>;
}) {
  const toneStyle = toneStyles[tone];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <div className={cn("inline-flex rounded-md border px-2 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em]", toneStyle.text, toneStyle.soft, toneStyle.border)}>
          {label}
        </div>
        {Icon && <Icon className={cn("opacity-70", toneStyle.text)} size={20} />}
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
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0d3d6e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55";

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

export function SecondaryAction({
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
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#185FA5] bg-white px-4 py-2 text-sm font-bold text-[#185FA5] shadow-sm transition-colors hover:bg-[#E6F1FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55";

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
    <div className="rounded-lg border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      {Icon && (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-[#b8d7f0] bg-[#E6F1FB] text-[#185FA5]">
          <Icon size={28} strokeWidth={1.8} />
        </div>
      )}
      <p className="text-sm font-extrabold text-slate-800">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function IconTile({
  icon: Icon,
  tone = "blue",
  size = 20,
  className,
}: {
  icon: ComponentType<IconProps>;
  tone?: Tone;
  size?: number;
  className?: string;
}) {
  const toneStyle = toneStyles[tone];
  return (
    <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border", toneStyle.border, toneStyle.soft, toneStyle.text, className)}>
      <Icon size={size} />
    </div>
  );
}

export function StatusBadge({
  children,
  tone = "slate",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const toneStyle = toneStyles[tone];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em]", toneStyle.text, toneStyle.soft, toneStyle.border, className)}>
      {children}
    </span>
  );
}

export function ProgressMeter({
  value,
  label,
  detail,
  tone = "blue",
}: {
  value: number;
  label?: string;
  detail?: string;
  tone?: Tone;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const toneStyle = toneStyles[tone];
  return (
    <div>
      {(label || detail) && (
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          {label && <span className="font-bold text-slate-700">{label}</span>}
          {detail && <span className="font-semibold text-slate-500">{detail}</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={cn("h-full rounded-full transition-all", toneStyle.bg)} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
