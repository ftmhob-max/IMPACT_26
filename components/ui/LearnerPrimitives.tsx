// Front-end shared learner UI primitives: components/ui/LearnerPrimitives.tsx
import Link from "next/link";
import type { ReactNode, ComponentType } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronLeft, type IconProps } from "./Icons";

type Tone = "blue" | "green" | "amber" | "slate" | "red" | "purple";

// Tone palette driven by semantic theme tokens so tinted labels, tiles, and
// badges adapt to light and dark without depending on the .dark override layer.
const toneStyles: Record<Tone, { text: string; bg: string; border: string; soft: string }> = {
  blue: {
    text: "text-[var(--impact-blue)]",
    bg: "bg-[var(--impact-blue)]",
    border: "border-[var(--impact-brand-border)]",
    soft: "bg-[var(--impact-brand-soft)]",
  },
  green: {
    text: "text-[var(--impact-success-text)]",
    bg: "bg-[var(--impact-success-text)]",
    border: "border-[var(--impact-success-border)]",
    soft: "bg-[var(--impact-success-bg)]",
  },
  amber: {
    text: "text-[var(--impact-warning-text)]",
    bg: "bg-[var(--impact-warning-text)]",
    border: "border-[var(--impact-warning-border)]",
    soft: "bg-[var(--impact-warning-bg)]",
  },
  slate: {
    text: "text-[var(--impact-muted)]",
    bg: "bg-[var(--impact-ink)]",
    border: "border-[var(--impact-border)]",
    soft: "bg-[var(--impact-surface-muted)]",
  },
  red: {
    text: "text-[var(--impact-danger-text)]",
    bg: "bg-[var(--impact-danger-text)]",
    border: "border-[var(--impact-danger-border)]",
    soft: "bg-[var(--impact-danger-bg)]",
  },
  purple: {
    text: "text-[#534AB7]",
    bg: "bg-[#534AB7]",
    border: "border-[var(--impact-brand-border)]",
    soft: "bg-[var(--impact-brand-soft)]",
  },
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
        "learner-page mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:py-10",
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
    <header className="mb-6 overflow-hidden rounded-lg border border-[var(--impact-border)] bg-[var(--impact-surface)] shadow-sm">
      {backHref && backLabel && (
        <Link
          href={backHref}
          className="learner-interactive mx-5 mt-4 inline-flex items-center gap-1.5 rounded-sm text-xs font-bold text-[var(--impact-blue)] hover:underline"
        >
          <ChevronLeft size={14} />
          {backLabel}
        </Link>
      )}
      <div className="relative flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:py-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--impact-blue)]" />
        <div className="max-w-3xl">
          <div className="flex items-start gap-3">
            {Icon && <IconTile icon={Icon} tone="blue" className="mt-0.5" />}
            <div>
              {eyebrow && (
                <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--impact-blue)]">
                  {eyebrow}
                </p>
              )}
              <h1 className="text-2xl font-extrabold leading-tight tracking-[-0.02em] text-[var(--impact-ink)] sm:text-3xl">
                {title}
              </h1>
              {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--impact-muted)]">{description}</p>}
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
    <section className={cn("overflow-hidden rounded-lg border border-[var(--impact-border)] bg-[var(--impact-surface)] shadow-sm", className)}>
      {(title || description) && (
        <div className="border-b border-[var(--impact-border)] px-5 py-4">
          {title && <h2 className="text-sm font-extrabold text-[var(--impact-ink)]">{title}</h2>}
          {description && <p className="mt-1 text-xs leading-5 text-[var(--impact-faint)]">{description}</p>}
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
    <div className="learner-hover-surface rounded-lg border border-[var(--impact-border)] bg-[var(--impact-surface)] p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className={cn("inline-flex rounded-md border px-2 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em]", toneStyle.text, toneStyle.soft, toneStyle.border)}>
          {label}
        </div>
        {Icon && <Icon className={cn("opacity-70", toneStyle.text)} size={20} />}
      </div>
      <p className="text-2xl font-extrabold leading-none tracking-[-0.02em] text-[var(--impact-ink)]">{value}</p>
      {detail && <p className="mt-2 text-xs leading-5 text-[var(--impact-faint)]">{detail}</p>}
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
  // Solid brand button keeps a fixed dark-blue fill in both themes so the white
  // label stays high-contrast (the --impact-blue token is intentionally light in dark mode).
  const classes =
    "learner-interactive inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0d3d6e] disabled:cursor-not-allowed disabled:opacity-55";

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
    <button type="button" onClick={onClick} disabled={disabled} className={classes}>
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
    "learner-interactive inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[var(--impact-blue)] bg-[var(--impact-surface)] px-4 py-2 text-sm font-bold text-[var(--impact-blue)] shadow-sm transition-colors hover:bg-[var(--impact-brand-soft)] disabled:cursor-not-allowed disabled:opacity-55";

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
    <button type="button" onClick={onClick} disabled={disabled} className={classes}>
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
    <div className="rounded-lg border border-dashed border-[var(--impact-border)] bg-[var(--impact-surface)] px-6 py-12 text-center shadow-sm">
      {Icon && (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-[var(--impact-brand-border)] bg-[var(--impact-brand-soft)] text-[var(--impact-blue)]">
          <Icon size={28} strokeWidth={1.8} />
        </div>
      )}
      <p className="text-sm font-extrabold text-[var(--impact-ink)]">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[var(--impact-faint)]">{description}</p>
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
          {label && <span className="font-bold text-[var(--impact-muted)]">{label}</span>}
          {detail && <span className="font-semibold text-[var(--impact-faint)]">{detail}</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--impact-surface-muted)]">
        <div className={cn("h-full rounded-full transition-all", toneStyle.bg)} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
