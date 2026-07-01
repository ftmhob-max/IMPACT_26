import Link from "next/link";
import Image from "next/image";
import * as Icons from "@/components/ui/Icons";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const valueStrip = [
  { label: "Principles first", icon: Icons.ShieldCheck },
  { label: "Guided formulas", icon: Icons.Calculator },
  { label: "Rationale review", icon: Icons.FileCheck },
  { label: "Readiness tracking", icon: Icons.BarChart3 },
];

const benefits: Array<{
  title: string;
  description: string;
  icon: React.ComponentType<Icons.IconProps>;
  tone: "blue" | "green";
}> = [
  {
    title: "Step-by-step rationale",
    description: "Every answer connects the rule, inputs, formula, and conclusion so reasoning is easier to defend.",
    icon: Icons.ClipboardList,
    tone: "blue",
  },
  {
    title: "53 formulas at your fingertips",
    description: "Keep definitions, examples, and applied assessment use cases close while you study.",
    icon: Icons.Calculator,
    tone: "green",
  },
  {
    title: "Practice that feels like the job",
    description: "Move through field-style cases that mirror municipal assessment judgment.",
    icon: Icons.Landmark,
    tone: "blue",
  },
  {
    title: "Equity and compliance focus",
    description: "Build transparent, consistent decisions that can stand up to public review.",
    icon: Icons.Scale,
    tone: "green",
  },
];

const learningPaths = [
  {
    title: "IMPACT_26V.1 Foundations",
    description: "Build the assessment principles, legal framework, and core method in order.",
    meta: "10 sections - 162 questions",
    href: "/courses",
    icon: Icons.Landmark,
    accent: "bg-[#185FA5]",
  },
  {
    title: "Formula Compass",
    description: "Search formulas, review plain-language definitions, and reinforce calculation patterns.",
    meta: "53 formulas - quick reference",
    href: "/formulas",
    icon: Icons.Compass,
    accent: "bg-[#2f7a4d]",
  },
  {
    title: "Practice Exam & Rationales",
    description: "Check readiness with practice questions and review the rationale behind every answer.",
    meta: "458 questions - rationale review",
    href: "/courses",
    icon: Icons.ClipboardList,
    accent: "bg-[#c47c00]",
  },
];

const steps = [
  {
    number: "1",
    title: "Learn",
    description: "Start with the concept, rule, and public-service reason behind the method.",
    icon: Icons.BookOpen,
  },
  {
    number: "2",
    title: "Apply",
    description: "Use guided examples and field-style data before moving into practice.",
    icon: Icons.Calculator,
  },
  {
    number: "3",
    title: "Review",
    description: "Trace each rationale so mistakes become patterns you can correct.",
    icon: Icons.FileCheck,
  },
  {
    number: "4",
    title: "Measure",
    description: "Use progress and score signals to choose the next focused study move.",
    icon: Icons.BarChart3,
  },
];

const capabilities = [
  { title: "Interactive assessments", description: "Scenario-based questions with feedback.", icon: Icons.LayoutDashboard },
  { title: "Formula quick reference", description: "Search, filter, and review formulas fast.", icon: Icons.Calculator },
  { title: "Progress dashboard", description: "Track completion, scores, and readiness.", icon: Icons.BarChart3 },
  { title: "Admin and course tools", description: "Manage learners, content, and reports.", icon: Icons.Users },
  { title: "Real data-informed practice", description: "Apply knowledge to realistic cases.", icon: Icons.Database },
  { title: "Secure and compliant", description: "Role-based access for learners and admins.", icon: Icons.Lock },
];

const proof = [
  { value: "10", label: "Sections", detail: "Structured from foundation to advanced application" },
  { value: "53", label: "Formulas", detail: "Clear explanations with practical use cases" },
  { value: "458", label: "Questions", detail: "Practice, apply, and review with rationale" },
];

const heroStats = [
  { value: "10", label: "guided sections" },
  { value: "53", label: "formula references" },
  { value: "458", label: "practice questions" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f8f6] text-slate-950">
      <Header />
      <HeroSection />
      <ValueStrip />
      <HowItWorks />
      <LearningPaths />
      <BenefitsSection />
      <Capabilities />
      <MissionProof />
      <FinalCta />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/92 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <div className="flex items-center gap-2.5">
            <Image
              src="/impact-logo.svg"
              alt="IMPACT_26 logo"
              width={38}
              height={38}
              priority
              className="h-9 w-9 rounded-lg"
            />
            <div>
              <p className="text-lg font-extrabold tracking-[-0.03em] text-[#0b3970] sm:text-xl">
                IMPACT_26
              </p>
              <p className="hidden text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:block">
                Property Assessment
              </p>
            </div>
          </div>
        </Link>

        <nav className="ml-4 hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          <Link href="/courses" className="text-sm font-semibold text-slate-600 hover:text-[#185FA5]">
            Courses
          </Link>
          <Link href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-[#185FA5]">
            How it Works
          </Link>
          <Link href="/formulas" className="text-sm font-semibold text-slate-600 hover:text-[#185FA5]">
            Formula Compass
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle compact presentation="surface" />
          <Link
            href="/sign-in"
            className="hidden min-h-10 items-center justify-center rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="hidden min-h-10 items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0d3d6e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 sm:inline-flex"
          >
            Start Learning
            <Icons.ArrowRight size={15} className="hidden sm:block" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div className="landing-hero-bg absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f7f8f6] to-transparent" />
      <div className="mx-auto grid w-full max-w-7xl min-w-0 items-center gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-16 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:py-20">
        <div className="relative z-10 max-w-2xl">
          <p className="inline-flex rounded-full border border-[#b8d7f0] bg-[#E6F1FB] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">
            Professional assessment e-learning
          </p>
          <h1
            aria-label="Build assessment judgment you can explain and defend."
            className="text-[2.15rem] font-extrabold leading-[1.06] tracking-[-0.035em] text-slate-950 sm:max-w-2xl sm:text-5xl lg:text-6xl"
          >
            <span className="mt-4 block">Build assessment judgment</span>
            <span className="block">you can <span className="text-[#185FA5]">explain</span></span>
            <span className="block">and defend.</span>
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:max-w-xl sm:text-lg">
            IMPACT_26V.1 gives municipal assessors a self-paced path for learning principles, applying formulas, reviewing rationales, and measuring readiness.
          </p>

          <div className="mt-5 grid gap-2 sm:max-w-xl sm:grid-cols-4">
            {steps.map((step) => (
              <div key={step.title} className="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 shadow-sm">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">{step.number}</p>
                <p className="mt-0.5 text-sm font-extrabold text-slate-900">{step.title}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#185FA5]/20 transition-colors hover:bg-[#0d3d6e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
            >
              Start Learning
              <Icons.ArrowRight size={16} />
            </Link>
            <Link
              href="/courses"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#185FA5] bg-white px-5 py-3 text-sm font-bold text-[#185FA5] shadow-sm transition-colors hover:bg-[#E6F1FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
            >
              Explore Courses
            </Link>
          </div>

          <div className="mt-7 grid max-w-xl grid-cols-3 overflow-hidden rounded-lg border border-slate-200 bg-white/95 shadow-sm">
            {heroStats.map((stat) => (
              <div key={stat.label} className="border-r border-slate-200 px-3 py-3 last:border-r-0 sm:px-4">
                <p className="text-2xl font-extrabold tracking-[-0.03em] text-[#185FA5]">{stat.value}</p>
                <p className="mt-1 text-[11px] font-bold uppercase leading-4 tracking-[0.08em] text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  const lessonSteps = ["Concept", "Rule", "Formula", "Practice", "Rationale"];
  const checkpointRows = [
    { label: "Principle check", value: "Complete", tone: "text-[#2f7a4d]" },
    { label: "Formula confidence", value: "62%", tone: "text-[#185FA5]" },
    { label: "Next focus", value: "Rationale", tone: "text-[#854F0B]" },
  ];

  return (
    <div className="relative z-10 w-full min-w-0 sm:mx-auto sm:max-w-2xl" aria-hidden="true">
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:hidden">
        <div className="bg-[#073866] p-4 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/65">Lesson 3.2</p>
              <p className="mt-0.5 text-sm font-extrabold">Market Approach</p>
            </div>
            <div className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-bold text-white/75">62% ready</div>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-1.5">
            {lessonSteps.map((item, index) => (
              <div key={item} className={`h-1.5 rounded-full ${index < 3 ? "bg-[#67c58e]" : "bg-white/20"}`} />
            ))}
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-[62%] rounded-full bg-[#67c58e]" />
          </div>
        </div>
        <div className="p-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">Assessment reasoning</p>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-[#9dc6eb] bg-[#f8fbff] px-4 py-3">
            <p className="font-calc text-xl font-bold tracking-[-0.02em] text-slate-900">V = I / R</p>
            <div className="text-right text-[11px] leading-4 text-slate-500">
              <p className="font-bold text-slate-800">Value</p>
              <p>$5,625,000</p>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-[11px] font-bold text-slate-800">Why this answer works</p>
            <p className="mt-1 text-[11px] leading-4 text-slate-500">
              Verified income divided by the supported rate gives a defensible value indication.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute -left-8 top-10 hidden h-36 w-36 rounded-full bg-[#185FA5]/10 blur-3xl sm:block" />
      <div className="absolute -right-8 bottom-6 hidden h-40 w-40 rounded-full bg-[#2f7a4d]/12 blur-3xl sm:block" />
      <div className="relative hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 sm:block">
        <div className="border-b border-slate-200 bg-[#fbfcfe] px-5 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">Live course preview</p>
              <p className="mt-0.5 text-sm font-extrabold text-slate-950">Assessment reasoning workspace</p>
            </div>
            <div className="rounded-full border border-[#b9d8c5] bg-[#f5fbf7] px-3 py-1 text-xs font-extrabold text-[#2f7a4d]">
              62% ready
            </div>
          </div>
        </div>

        <div className="grid min-h-[420px] lg:grid-cols-[190px_1fr]">
          <div className="min-w-0 bg-[#073866] p-5 text-white">
            <p className="text-xs font-bold text-white/70">IMPACT_26V.1</p>
            <p className="mt-1 text-sm font-extrabold leading-tight">Market Approach</p>
            <div className="mt-6 space-y-2.5">
              {lessonSteps.map((item, index) => (
                <div
                  key={item}
                  className={`flex items-center gap-2 rounded-md px-2 py-2 text-xs font-bold ${
                    index === 2 ? "bg-[#185FA5] text-white shadow-sm" : "text-white/75"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border text-[9px] ${
                      index < 2
                        ? "border-[#67c58e] bg-[#2f7a4d] text-white"
                        : index === 2
                          ? "border-white/60 bg-white/15"
                          : "border-white/35"
                    }`}
                  >
                    {index < 2 ? <Icons.Check size={10} /> : index + 1}
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-white/70">
                <span>Course readiness</span>
                <span>62%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-[62%] rounded-full bg-[#67c58e]" />
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-white/10 bg-white/10 p-3">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-white/55">Next action</p>
              <p className="mt-1 text-xs font-bold leading-5 text-white">Review the rationale before attempting the next case.</p>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#185FA5]">Formula support</p>
                <h2 className="mt-1 text-lg font-extrabold text-slate-950">Capitalization method</h2>
              </div>
              <p className="hidden rounded-md bg-[#E6F1FB] px-2.5 py-1 text-xs font-bold text-[#185FA5] sm:block">3.2.1</p>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_0.72fr]">
              <div className="rounded-lg border border-[#9dc6eb] bg-[#f8fbff] px-4 py-5 text-center shadow-sm">
                <p className="font-calc text-xl font-bold tracking-[-0.02em] text-slate-900 sm:text-2xl">
                  V = I / R
                </p>
                <p className="mt-2 text-xs font-semibold text-slate-500">Value equals income divided by rate.</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">Checkpoint</p>
                <div className="mt-3 space-y-2">
                  {checkpointRows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-slate-500">{row.label}</span>
                      <span className={`font-extrabold ${row.tone}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniPanel
                title="Definitions"
                rows={["V - Indicated value", "I - Net operating income", "R - Capitalization rate"]}
              />
              <MiniPanel title="Example" rows={["Income: $450,000", "Rate: 8.0%", "Value: $5,625,000"]} />
            </div>

            <div className="mt-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                Rationale timeline
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {["Data verified", "Formula applied", "Value indicated", "Conclusion"].map((item, index) => (
                  <div key={item} className="relative min-w-0 rounded-lg border border-slate-100 bg-[#fbfcfe] p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6F1FB] text-[#185FA5]">
                      {index === 0 ? <Icons.Check size={15} /> : index + 1}
                    </div>
                    <p className="mt-2 text-xs font-bold leading-4 text-slate-800">{item}</p>
                    <p className="mt-1 hidden text-[11px] leading-4 text-slate-500 sm:block">
                      {index === 0 ? "Inputs documented." : index === 1 ? "Method matched." : index === 2 ? "Result checked." : "Rationale ready."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniPanel({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-extrabold text-slate-800">{title}</p>
      <div className="mt-2 space-y-1">
        {rows.map((row) => (
          <p key={row} className="text-[11px] leading-4 text-slate-500">
            {row}
          </p>
        ))}
      </div>
    </div>
  );
}

function ValueStrip() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:grid-cols-4 lg:px-8">
        {valueStrip.map((item) => (
          <div key={item.label} className="flex items-center gap-2 py-2 sm:gap-3 sm:py-3 lg:justify-center">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#b8d7f0] bg-[#E6F1FB] text-[#185FA5] sm:h-10 sm:w-10">
              <item.icon size={19} />
            </div>
            <p className="text-xs font-extrabold leading-4 text-slate-800 sm:text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <SectionShell id="benefits" title="Built for applied assessment judgment" description="Short, practical training tools for formulas, fairness, and defensible conclusions.">
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        {benefits.map((item) => (
          <InfoCard key={item.title} {...item} />
        ))}
      </div>
    </SectionShell>
  );
}

function LearningPaths() {
  return (
    <SectionShell
      id="courses"
      title="Featured courses and learning paths"
      description="Start with a foundation, keep formulas close, then build readiness through practice."
      action={
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-[#185FA5] hover:underline">
          View all
          <Icons.ArrowRight size={15} />
        </Link>
      }
    >
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
        {learningPaths.map((path) => (
          <Link
            key={path.title}
            href={path.href}
            className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#185FA5] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2"
          >
            <div className="grid grid-cols-[58px_1fr] sm:grid-cols-[76px_1fr]">
              <div className={`${path.accent} flex min-h-40 items-start justify-center p-4 text-white sm:p-5`}>
                <path.icon size={27} />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-base font-extrabold leading-tight text-slate-950 group-hover:text-[#185FA5] sm:text-lg">
                  {path.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{path.description}</p>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold text-slate-500">{path.meta}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#185FA5]">
                    Start Course
                    <Icons.ArrowRight size={13} />
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}

function HowItWorks() {
  return (
    <SectionShell id="how-it-works" title="How IMPACT_26 works" description="A clear learning loop from concept to confident application.">
      <div className="grid gap-3 sm:gap-5 md:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.title} className="relative rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            {index < steps.length - 1 && (
              <div className="absolute left-[calc(100%-0.5rem)] top-12 hidden h-px w-5 border-t border-dashed border-slate-300 md:block" />
            )}
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E6F1FB] text-[#185FA5]">
                <step.icon size={21} />
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#185FA5] text-xs font-extrabold text-white">
                {step.number}
              </span>
            </div>
            <h3 className="mt-4 text-base font-extrabold text-slate-950 sm:mt-5">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Capabilities() {
  return (
    <SectionShell title="Platform capabilities" description="Everything learners and administrators need to support consistent progress.">
      <div className="grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((item) => (
          <div key={item.title} className="bg-white p-4 sm:p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#b8d7f0] bg-[#E6F1FB] text-[#185FA5]">
              <item.icon size={20} />
            </div>
            <h3 className="mt-4 text-sm font-extrabold text-slate-950">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function MissionProof() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-0 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
        <div className="rounded-t-lg bg-[#073866] p-5 text-white sm:p-7 lg:rounded-l-lg lg:rounded-tr-none">
          <p className="text-4xl font-extrabold leading-none text-white/25">"</p>
          <p className="mt-2 max-w-md text-xl font-extrabold leading-8 tracking-[-0.02em]">
            Wisdom is applied knowledge - using logic before formula to serve the public with equity, transparency, and defensible reasoning.
          </p>
          <p className="mt-5 text-sm font-semibold text-white/70">The IMPACT_26V.1 mission</p>
        </div>
        <div className="rounded-b-lg border border-slate-200 bg-[#f8fafc] p-5 sm:p-7 lg:rounded-r-lg lg:rounded-bl-none lg:border-l-0">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-950">
            Rooted in public service.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            IMPACT_26V.1 helps assessors build the confidence to explain, defend, and improve decisions that affect real communities.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {proof.map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-3xl font-extrabold tracking-[-0.03em] text-[#185FA5]">{item.value}</p>
                <p className="mt-1 text-sm font-extrabold text-slate-900">{item.label}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="brand-inverse bg-[#073866]">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 text-white sm:gap-6 sm:px-6 sm:py-9 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-white/60">Ready to strengthen your assessments?</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.02em]">Build knowledge you can explain and defend.</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-extrabold text-[#073866] transition-colors hover:bg-[#E6F1FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#073866]"
          >
            Start Learning
            <Icons.ArrowRight size={15} />
          </Link>
          <Link
            href="/courses"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#073866]"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const groups = [
    { title: "Learn", links: [{ label: "Courses", href: "/courses" }, { label: "Formula Compass", href: "/formulas" }, { label: "Practice Exam", href: "/courses" }] },
    { title: "Account", links: [{ label: "Sign in", href: "/sign-in" }, { label: "Create Account", href: "/sign-up" }] },
    { title: "Platform", links: [{ label: "Dashboard", href: "/dashboard" }, { label: "My Progress", href: "/progress" }, { label: "Profile", href: "/profile" }] },
  ];

  return (
    <footer className="bg-[#052a4f] text-white">
      <div className="mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-6 sm:py-10 md:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/impact-logo.svg"
              alt="IMPACT_26 logo"
              width={44}
              height={44}
              className="h-11 w-11 rounded-lg"
            />
            <div>
              <p className="text-2xl font-extrabold tracking-[-0.03em]">IMPACT_26</p>
              <p className="mt-1 max-w-xs text-sm leading-6 text-white/65">
                Integrated Methods for Property Assessment, Compliance, and Transparency.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-extrabold text-white">{group.title}</p>
              <div className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <Link key={link.label} href={link.href} className="block text-sm text-white/65 hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-1.5 px-4 py-4 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 lg:px-8">
          <p>IMPACT_26V.1 - 2026 Version 1</p>
          <p>Built for assessment learning and public trust.</p>
        </div>
      </div>
    </footer>
  );
}

function SectionShell({
  id,
  title,
  description,
  action,
  children,
}: {
  id?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-7xl overflow-hidden px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-[-0.025em] text-slate-950 sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="w-full min-w-0">{children}</div>
    </section>
  );
}

function InfoCard({
  title,
  description,
  icon: Icon,
  tone,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<Icons.IconProps>;
  tone: "blue" | "green";
}) {
  const styles =
    tone === "green"
      ? "border-[#b9d8c5] bg-[#f5fbf7] text-[#2f7a4d]"
      : "border-[#b8d7f0] bg-[#f4f9ff] text-[#185FA5]";

  return (
    <div className="w-full min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className={`flex h-11 w-11 items-center justify-center rounded-lg border ${styles}`}>
        <Icon size={21} />
      </div>
      <h3 className="mt-5 text-base font-extrabold leading-tight text-slate-950">{title}</h3>
      <p className="mt-2 break-words text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
