"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { resetPassword } from "@/lib/firebase/auth";
import { ArrowRight, ChevronLeft } from "@/components/ui/Icons";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess("Password reset email sent. Check your inbox for the recovery link.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid w-full max-w-xs overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl sm:max-w-5xl lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="hidden bg-[#073866] p-8 text-white lg:flex lg:flex-col lg:justify-between">
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
          <p className="text-3xl font-extrabold leading-tight tracking-[-0.03em]">
            Reset your password and get back to learning.
          </p>
          <p className="mt-4 text-sm leading-6 text-white/70">
            We&apos;ll email you a secure link so you can restore access to your training account.
          </p>
        </div>

        <div className="rounded-lg bg-white/8 px-4 py-3 text-sm font-bold">
          Need your password reset email?
          <p className="mt-1 text-sm font-medium text-white/70">
            Use the same email address you registered with.
          </p>
        </div>
      </aside>

      <section className="min-w-0 p-6 sm:p-8 lg:p-10">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition-colors hover:text-[#185FA5]"
        >
          <ChevronLeft size={14} />
          Back to sign in
        </Link>

        <div className="mt-7 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-[#E6F1FB] p-1.5">
            <Image src="/impact-logo.svg" alt="IMPACT_26 logo" width={44} height={44} className="h-11 w-11 rounded-md" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.025em] text-slate-950">Reset password</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
            Enter your email and we&apos;ll send a password reset link.
          </p>
        </div>

        {error && (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-slate-700">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-[#185FA5] focus:ring-4 focus:ring-[#185FA5]/12"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-4 py-3 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#0d3d6e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending link..." : "Send reset link"}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>
      </section>
    </div>
  );
}
