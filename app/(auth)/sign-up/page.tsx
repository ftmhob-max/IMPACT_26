"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signUp, getIdToken } from "@/lib/firebase/auth";
import { ArrowRight, ChevronLeft, GraduationCap, ShieldCheck } from "@/components/ui/Icons";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      const token = await getIdToken();
      if (token) {
        await fetch("/api/auth/sync-user", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ fullName }),
        });
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

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
            Start with principles. Build toward defensible assessment judgment.
          </p>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Create an account to access learning paths, formulas, practice, and progress tracking.
          </p>
        </div>
        <div className="grid gap-3">
          {["10 structured sections", "53 formula references", "458 practice questions"].map((item) => (
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
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition-colors hover:text-[#185FA5]"
        >
          <ChevronLeft size={14} />
          Back to home
        </Link>

        <div className="mt-7 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-[#E6F1FB] p-1.5">
            <Image src="/impact-logo.svg" alt="IMPACT_26 logo" width={44} height={44} className="h-11 w-11 rounded-md" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.025em] text-slate-950">
            Create your account
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
            Begin assessment training built around formulas, rationale, and public trust.
          </p>
        </div>

        {error && (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Full name">
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClasses}
              placeholder="Jane Smith"
              autoComplete="name"
            />
          </Field>
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
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-4 py-3 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#0d3d6e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Start Learning"}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-extrabold text-[#185FA5] hover:underline">
            Sign in
          </Link>
        </p>
      </section>
    </div>
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
