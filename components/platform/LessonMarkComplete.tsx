"use client";

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

interface Props {
  lessonId: string;
}

export function LessonMarkComplete({ lessonId }: Props) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [status, setStatus] = useState<"loading" | "incomplete" | "saving" | "complete">("loading");
  const userRef = useRef<FirebaseUser | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      userRef.current = u;
    });
  }, []);

  // Check existing progress so we don't show the button on already-completed lessons
  useEffect(() => {
    if (!user) {
      setStatus("incomplete");
      return;
    }
    user.getIdToken().then((token) =>
      fetch(`/api/progress/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          setStatus(data.status === "completed" ? "complete" : "incomplete");
        })
        .catch(() => setStatus("incomplete"))
    );
  }, [user, lessonId]);

  async function markComplete() {
    const u = userRef.current;
    if (!u || status !== "incomplete") return;
    setStatus("saving");
    try {
      const token = await u.getIdToken();
      await fetch(`/api/progress/lesson/${lessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "completed", videoPositionSeconds: 0 }),
      });
      setStatus("complete");
    } catch {
      setStatus("incomplete");
    }
  }

  if (status === "loading" || !user) return null;

  if (status === "complete") {
    return (
      <div className="mt-8 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
        You've completed this lesson.
      </div>
    );
  }

  return (
    <div className="mt-8 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-5 py-4">
      <p className="text-sm text-slate-600">Finished reading? Mark this lesson as complete.</p>
      <button
        type="button"
        onClick={markComplete}
        disabled={status === "saving"}
        className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : "Mark complete ✓"}
      </button>
    </div>
  );
}
