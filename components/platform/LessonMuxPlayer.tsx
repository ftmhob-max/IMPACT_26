"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

interface Props {
  lessonId: string;
  playbackId: string;
  title?: string;
}

const SAVE_INTERVAL_MS = 10_000; // debounce: save position at most every 10 s
const COMPLETE_THRESHOLD = 0.9; // mark complete at 90% watched

export function LessonMuxPlayer({ lessonId, playbackId, title }: Props) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [startTime, setStartTime] = useState<number | undefined>(undefined);
  const [completed, setCompleted] = useState(false);

  // Refs so callbacks always see the latest values without re-registering
  const lastSavedRef = useRef(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedRef = useRef(false);
  const userRef = useRef<FirebaseUser | null>(null);

  // Track auth state
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      userRef.current = u;
    });
  }, []);

  // Load saved position on mount (once user is known)
  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token) =>
      fetch(`/api/progress/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.status === "completed") {
            setCompleted(true);
            completedRef.current = true;
          }
          const pos = data.videoPositionSeconds ?? 0;
          if (pos > 5) setStartTime(pos); // don't seek to the very start
        })
        .catch(() => {})
    );
  }, [user, lessonId]);

  const saveProgress = useCallback(
    async (currentTime: number, forceComplete = false) => {
      const u = userRef.current;
      if (!u) return;
      try {
        const token = await u.getIdToken();
        await fetch(`/api/progress/lesson/${lessonId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            videoPositionSeconds: Math.floor(currentTime),
            status: forceComplete ? "completed" : "in_progress",
          }),
        });
      } catch {
        // silently ignore — progress is best-effort
      }
    },
    [lessonId]
  );

  const handleTimeUpdate = useCallback(
    (event: Event) => {
      const player = event.target as HTMLVideoElement & { duration?: number };
      const currentTime = player.currentTime ?? 0;
      const duration = player.duration ?? 0;

      // Auto-complete at 90%
      if (!completedRef.current && duration > 0 && currentTime / duration >= COMPLETE_THRESHOLD) {
        completedRef.current = true;
        setCompleted(true);
        saveProgress(currentTime, true);
        return;
      }

      // Debounced position save
      const now = Date.now();
      if (now - lastSavedRef.current >= SAVE_INTERVAL_MS) {
        lastSavedRef.current = now;
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => saveProgress(currentTime), 0);
      }
    },
    [saveProgress]
  );

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  return (
    <div className="space-y-2">
      <div className="aspect-video overflow-hidden rounded-lg bg-slate-950 shadow-sm">
        <MuxPlayer
          playbackId={playbackId}
          metadata={{ video_title: title }}
          startTime={startTime}
          onTimeUpdate={handleTimeUpdate as any}
          style={{ width: "100%", height: "100%" }}
          streamType="on-demand"
          accentColor="#185FA5"
        />
      </div>
      {completed && (
        <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          Lesson complete — your progress has been saved.
        </div>
      )}
    </div>
  );
}
