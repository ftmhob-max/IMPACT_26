import Image from "next/image";
import { ShieldCheck } from "@/components/ui/Icons";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type AuthShellProps = {
  children?: React.ReactNode;
  heading: string;
  description: string;
  highlights?: string[];
  asideFooter?: React.ReactNode;
};

export function AuthShell({
  children,
  heading,
  description,
  highlights,
  asideFooter,
}: AuthShellProps) {
  return (
    <div className="grid w-full bg-white sm:max-w-md sm:overflow-hidden sm:rounded-xl sm:border sm:border-slate-200 sm:shadow-xl lg:max-w-5xl lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="brand-inverse hidden bg-[#073866] p-8 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/impact-logo.svg"
            alt="IMPACT_26 logo"
            width={46}
            height={46}
            priority
            className="h-11 w-11 rounded-lg"
          />
          <div>
            <p className="text-2xl font-extrabold tracking-[-0.03em]">IMPACT_26</p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-white/55">
              Property Assessment
            </p>
          </div>
        </div>

        <div className="my-12">
          <p className="text-3xl font-extrabold leading-tight tracking-[-0.03em]">{heading}</p>
          <p className="mt-4 text-sm leading-6 text-white/70">{description}</p>
        </div>

        {highlights ? (
          <div className="grid gap-3">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg bg-white/8 px-3 py-2 text-sm font-bold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#67c58e] text-[#073866]">
                  <ShieldCheck size={13} />
                </span>
                {item}
              </div>
            ))}
          </div>
        ) : (
          asideFooter
        )}
      </aside>

      <section className="relative min-w-0 px-5 pb-7 pt-5 sm:p-8 lg:p-10">
        <div className="absolute right-5 top-5 sm:right-8 sm:top-8 lg:right-10 lg:top-10">
          <ThemeToggle compact presentation="surface" />
        </div>
        {children ?? (
          <div className="py-24 text-center">
            <h1 className="text-2xl font-extrabold text-slate-950">Sign in to IMPACT_26</h1>
            <p className="mt-2 text-sm text-slate-500">Loading sign-in...</p>
          </div>
        )}
      </section>
    </div>
  );
}
