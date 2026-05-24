"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AuthFlowError, completeAppSignIn, signIn, signInWithGoogle } from "@/lib/firebase/auth";
import { ArrowRight, ChevronLeft, GraduationCap, ShieldCheck } from "@/components/ui/Icons";
import { AuthShell } from "@/components/auth/AuthShell";
import { cn } from "@/lib/utils";

type LoginMode = "student" | "teacher";

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInShell />}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const params = useSearchParams();

  const [mode, setMode] = useState<LoginMode>("student");
  const redirect = params.get("redirect") ?? (mode === "student" ? "/dashboard" : "/admin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const unauthorizedDomainError = getUnauthorizedDomainError(error);

  function getErrorMessage(err: unknown): string {
    if (err instanceof AuthFlowError) {
      return err.code ? `${err.message} (${err.code})` : err.message;
    }
    return err instanceof Error ? err.message : "Sign-in failed";
  }

  function completeRedirect(target: string) {
    window.location.assign(target);
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await signIn(email, password);
      await completeAppSignIn(user);
      completeRedirect(redirect);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      completeRedirect(redirect);
    } catch (err) {
      setError(getErrorMessage(err));
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
    <SignInShell>
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
            Learner
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

      {unauthorizedDomainError ? (
        <UnauthorizedDomainNotice host={unauthorizedDomainError.host} />
      ) : error ? (
        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {getErrorMessage(error)}
        </p>
      ) : null}

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
    </SignInShell>
  );
}

function SignInShell({ children }: { children?: React.ReactNode }) {
  return (
    <AuthShell
      heading="Learn the method. Explain the reasoning. Defend the decision."
      description="Training built around formulas, rationale, equity, and public trust."
      highlights={["Step-by-step rationale", "Formula-based practice", "Progress tracking"]}
    >
      {children}
    </AuthShell>
  );
}

function UnauthorizedDomainNotice({ host }: { host?: string }) {
  const localHostUrl = getLocalhostSignInUrl();
  const hostLabel = host ?? "this host";
  const showLocalhostLink = host === "127.0.0.1" && localHostUrl;

  return (
    <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-extrabold">Google sign-in is not authorized for {hostLabel}.</p>
      <p className="mt-2 leading-6">
        Add <code className="rounded bg-white/70 px-1 py-0.5 text-[0.9em]">{hostLabel}</code> in Firebase Console under
        {" "}
        <span className="font-semibold">Authentication -&gt; Settings -&gt; Authorized domains</span>.
      </p>
      <p className="mt-2 leading-6">
        Firebase treats <code className="rounded bg-white/70 px-1 py-0.5 text-[0.9em]">localhost</code> and
        {" "}
        <code className="rounded bg-white/70 px-1 py-0.5 text-[0.9em]">127.0.0.1</code> as different domains.
      </p>
      {showLocalhostLink ? (
        <p className="mt-2 leading-6">
          For a quick local workaround, open
          {" "}
          <a href={localHostUrl} className="font-extrabold text-[#185FA5] underline underline-offset-2">
            the localhost sign-in page
          </a>
          {" "}
          printed by the dev server.
        </p>
      ) : null}
    </div>
  );
}

function getUnauthorizedDomainError(err: unknown): AuthFlowError | null {
  return err instanceof AuthFlowError && err.code === "auth/unauthorized-domain" ? err : null;
}

function getLocalhostSignInUrl(): string | null {
  if (typeof window === "undefined") return null;

  const url = new URL(window.location.href);
  url.hostname = "localhost";
  return url.toString();
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
