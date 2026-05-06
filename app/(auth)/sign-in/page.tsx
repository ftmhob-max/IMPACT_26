"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn, signInWithGoogle, getIdToken } from "@/lib/firebase/auth";
import { ArrowRight, ChevronLeft, GraduationCap, ShieldCheck } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type LoginMode = "student" | "teacher";

export default function SignInPage() {
  return (
    <Suspense fallback={<AuthShell />}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [mode, setMode] = useState<LoginMode>("student");
  const redirect = params.get("redirect") ?? (mode === "student" ? "/dashboard" : "/admin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function syncSession() {
    const token = await getIdToken();
    if (!token) return;
    await fetch("/api/auth/sync-user", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      await syncSession();
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      await syncSession();
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  const title = mode === "student" ? "Welcome back" : "Teacher portal";
  const description =
    mode === "student"
      ? "Continue your assessment training, formulas, and practice progress."
      : "Access course tools, learner progress, and administrative workflows.";

  return (
    <AuthShell>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition-colors hover:text-[#185FA5]"
      >
        <ChevronLeft size={14} />
        Back to home
      </Link>

      <div className="mt-6">
        <div className="flex rounded-lg bg-slate-100 p-1">
          <ModeButton active={mode === "student"} onClick={() => setMode("student")} icon={GraduationCap}>
            Student
          </ModeButton>
          <ModeButton active={mode === "teacher"} onClick={() => setMode("teacher")} icon={ShieldCheck}>
            Teacher
          </ModeButton>
        </div>
      </div>

      <div className="mt-7 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-[#E6F1FB] p-1.5">
          <Image src="/impact-logo.svg" alt="IMPACT_26 logo" width={44} height={44} className="h-11 w-11 rounded-md" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.025em] text-slate-950">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>

      {error && (
        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleEmailSignIn} className="mt-6 space-y-4">
        <Field label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </Field>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-4 py-3 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#0d3d6e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <ArrowRight size={15} />}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        onClick={handleGoogle}
        disabled={loading}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 shadow-sm transition-colors hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Continue with Google
      </button>

      <div className="mt-6 space-y-3 text-center">
        <p className="text-sm text-slate-600">
          No account?{" "}
          <Link href="/sign-up" className="font-extrabold text-[#185FA5] hover:underline">
            Create one
          </Link>
        </p>
        <p className="text-xs text-slate-400">
          <Link href="/reset-password" className="font-semibold hover:text-[#185FA5] hover:underline">
            Forgot password?
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

function AuthShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="grid w-full max-w-xs overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl sm:max-w-5xl lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="hidden bg-[#073866] p-8 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
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
        </div>
        <div className="my-12">
          <p className="text-3xl font-extrabold leading-tight tracking-[-0.03em]">
            Learn the method. Explain the reasoning. Defend the decision.
          </p>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Training built around formulas, rationale, equity, and public trust.
          </p>
        </div>
        <div className="grid gap-3">
          {["Step-by-step rationale", "Formula-based practice", "Progress tracking"].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-lg bg-white/8 px-3 py-2 text-sm font-bold">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#67c58e] text-[#073866]">
                <ShieldCheck size={13} />
              </span>
              {item}
            </div>
          ))}
        </div>
      </aside>

      <section className="min-w-0 p-6 sm:p-8 lg:p-10">
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

function ModeButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-extrabold transition-all",
        active ? "bg-white text-[#185FA5] shadow-sm" : "text-slate-500 hover:text-slate-800"
      )}
    >
      <Icon size={17} />
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClasses =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-[#185FA5] focus:ring-4 focus:ring-[#185FA5]/12";
