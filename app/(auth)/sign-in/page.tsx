"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, signInWithGoogle, getIdToken } from "@/lib/firebase/auth";
import { GraduationCap, ShieldCheck } from "@/components/ui/Icons";
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

  return (
    <SignInShell>
        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
          <button
            onClick={() => setMode("student")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
              mode === "student" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <GraduationCap size={18} />
            Student
          </button>
          <button
            onClick={() => setMode("teacher")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
              mode === "teacher" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <ShieldCheck size={18} />
            Teacher
          </button>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-4">
            {mode === "student" ? <GraduationCap size={24} /> : <ShieldCheck size={24} />}
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {mode === "student" ? "Sign in to IMPACT_26" : "Teacher Portal"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {mode === "student" ? "Property Assessment Training" : "Administrative Access"}
          </p>
        </div>

        {error && (
          <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg border border-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100" />
          </div>
          <div className="relative flex justify-center text-xs text-slate-400">
            <span className="bg-white px-2">or</span>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-slate-500">
          No account?{" "}
          <Link href="/sign-up" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
        <p className="text-center text-xs text-slate-400">
          <Link href="/reset-password" className="hover:underline">
            Forgot password?
          </Link>
        </p>
    </SignInShell>
  );
}

function SignInShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0efe9] p-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-slate-200 bg-white p-8 shadow-md">
        {children ?? (
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-900">Sign in to IMPACT_26</h1>
            <p className="mt-1 text-sm text-slate-500">Loading sign-in...</p>
          </div>
        )}
      </div>
    </div>
  );
}
