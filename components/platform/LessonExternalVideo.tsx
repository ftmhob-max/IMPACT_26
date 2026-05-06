"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import type { VideoMeta } from "@/lib/video-url";

interface Props {
  lessonId: string;
  meta: VideoMeta;
  title?: string;
}

const SAVE_INTERVAL_MS = 10_000;
const COMPLETE_THRESHOLD = 0.9;

export function LessonExternalVideo({ lessonId, meta, title }: Props) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const userRef = useRef<FirebaseUser | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      userRef.current = u;
    });
  }, []);

  // Mark lesson as in_progress when the component mounts (user viewed it)
  useEffect(() => {
    if (!user || meta.provider === "direct") return; // direct handles its own lifecycle
    user.getIdToken().then((token) =>
      fetch(`/api/progress/lesson/${lessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "in_progress", videoPositionSeconds: 0 }),
      }).catch(() => {})
    );
  }, [user, lessonId, meta.provider]);

  if (meta.provider === "direct") {
    return (
      <DirectVideoPlayer lessonId={lessonId} src={meta.embedUrl} title={title} userRef={userRef} />
    );
  }

  // Iframe-based platforms: show embed + manual mark-complete button
  return (
    <div className="space-y-3">
      <div className="aspect-video overflow-hidden rounded-lg bg-slate-950 shadow-sm">
        <iframe
          src={meta.embedUrl}
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          title={title}
          loading="lazy"
        />
      </div>
      <MarkCompleteButton lessonId={lessonId} userRef={userRef} />
    </div>
  );
}

// ─── Direct video player (native <video> with position tracking) ──────────────

function DirectVideoPlayer({
  lessonId,
  src,
  title,
  userRef,
}: {
  lessonId: string;
  src: string;
  title?: string;
  userRef: React.RefObject<FirebaseUser | null>;
}) {
  const [startTime, setStartTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const completedRef = useRef(false);
  const lastSavedRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const saveProgress = useCallback(
    async (currentTime: number, forceComplete = false) => {
      const u = userRef.current;
      if (!u) return;
      try {
        const token = await u.getIdToken();
        await fetch(`/api/progress/lesson/${lessonId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            videoPositionSeconds: Math.floor(currentTime),
            status: forceComplete ? "completed" : "in_progress",
          }),
        });
      } catch {}
    },
    [lessonId, userRef]
  );

  // Load saved position
  useEffect(() => {
    const u = userRef.current;
    if (!u) return;
    u.getIdToken().then((token) =>
      fetch(`/api/progress/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.status === "completed") {
            completedRef.current = true;
            setCompleted(true);
          }
          const pos = data.videoPositionSeconds ?? 0;
          if (pos > 5) setStartTime(pos);
        })
        .catch(() => {})
    );
  }, [lessonId, userRef]);

  // Seek to saved position once metadata loaded
  function handleMetadata() {
    if (startTime > 5 && videoRef.current) {
      videoRef.current.currentTime = startTime;
    }
  }

  function handleTimeUpdate() {
    const v = videoRef.current;
    if (!v) return;
    if (!completedRef.current && v.duration > 0 && v.currentTime / v.duration >= COMPLETE_THRESHOLD) {
      completedRef.current = true;
      setCompleted(true);
      saveProgress(v.currentTime, true);
      return;
    }
    const now = Date.now();
    if (now - lastSavedRef.current >= SAVE_INTERVAL_MS) {
      lastSavedRef.current = now;
      saveProgress(v.currentTime);
    }
  }

  return (
    <div className="space-y-2">
      <div className="aspect-video overflow-hidden rounded-lg bg-slate-950 shadow-sm">
        <video
          ref={videoRef}
          src={src}
          controls
          className="h-full w-full"
          title={title}
          onLoadedMetadata={handleMetadata}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>
      {completed && <CompleteBanner />}
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

export function MarkCompleteButton({
  lessonId,
  userRef,
}: {
  lessonId: string;
  userRef: React.RefObject<FirebaseUser | null>;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");

  async function markComplete() {
    const u = userRef.current;
    if (!u || status !== "idle") return;
    setStatus("saving");
    try {
      const token = await u.getIdToken();
      await fetch(`/api/progress/lesson/${lessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "completed", videoPositionSeconds: 0 }),
      });
      setStatus("done");
    } catch {
      setStatus("idle");
    }
  }

  if (status === "done") return <CompleteBanner />;

  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={markComplete}
        disabled={status === "saving"}
        className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : "Mark as complete ✓"}
      </button>
    </div>
  );
}

function CompleteBanner() {
  return (
    <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5"/>
      </svg>
      Lesson complete — your progress has been saved.
    </div>
  );
}
