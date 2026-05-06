"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type UploadState =
  | { phase: "idle" }
  | { phase: "requesting" }
  | { phase: "uploading"; pct: number }
  | { phase: "processing" }
  | { phase: "ready"; playbackId: string }
  | { phase: "error"; message: string };

interface Props {
  onPlaybackId: (id: string) => void;
  currentPlaybackId?: string | null;
  disabled?: boolean;
  className?: string;
}

const ACCEPTED = ".mp4,.mov,.mkv,.webm,.avi,.m4v";
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 60; // 3 min max

export function VideoUpload({ onPlaybackId, currentPlaybackId, disabled, className }: Props) {
  const [state, setState] = useState<UploadState>({ phase: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const abortedRef = useRef(false);

  async function handleFile(file: File) {
    if (disabled) return;
    abortedRef.current = false;

    // 1. Request a Mux direct upload URL from our API
    setState({ phase: "requesting" });
    let uploadUrl: string;
    let uploadId: string;
    try {
      const res = await fetch("/api/admin/video/upload-url", { method: "POST" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setState({ phase: "error", message: err.error ?? "Failed to get upload URL" });
        return;
      }
      ({ uploadUrl, uploadId } = await res.json());
    } catch {
      setState({ phase: "error", message: "Network error while requesting upload URL" });
      return;
    }

    // 2. Upload directly to Mux via XHR so we can track progress
    setState({ phase: "uploading", pct: 0 });
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setState({ phase: "uploading", pct: Math.round((e.loaded / e.total) * 100) });
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`Upload failed with status ${xhr.status}`));
      };
      xhr.onerror = () => reject(new Error("Upload network error"));
      xhr.onabort = () => { abortedRef.current = true; reject(new Error("Upload cancelled")); };

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
      xhr.send(file);
    }).catch((err) => {
      setState({ phase: "error", message: err.message });
      return;
    });

    if (abortedRef.current) return;

    // 3. Poll for Mux asset processing
    setState({ phase: "processing" });
    let attempts = 0;
    while (attempts < MAX_POLL_ATTEMPTS) {
      await delay(POLL_INTERVAL_MS);
      attempts++;
      try {
        const res = await fetch(`/api/admin/video/upload-url?uploadId=${encodeURIComponent(uploadId)}`);
        if (!res.ok) continue;
        const data = await res.json();
        if (data.status === "errored") {
          setState({ phase: "error", message: "Mux processing failed" });
          return;
        }
        if (data.status === "ready" && data.playbackId) {
          setState({ phase: "ready", playbackId: data.playbackId });
          onPlaybackId(data.playbackId);
          return;
        }
      } catch {
        // keep polling on transient errors
      }
    }
    setState({ phase: "error", message: "Timed out waiting for Mux to process the video" });
  }

  function handleCancel() {
    abortedRef.current = true;
    xhrRef.current?.abort();
    setState({ phase: "idle" });
  }

  const isWorking = state.phase === "requesting" || state.phase === "uploading" || state.phase === "processing";

  return (
    <div className={cn("space-y-2", className)}>
      {/* Drop target / trigger */}
      <label
        className={cn(
          "flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors",
          isWorking || disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-50"
            : "border-slate-300 bg-white hover:border-[#185FA5] hover:bg-[#E6F1FB]/30"
        )}
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="sr-only"
          disabled={isWorking || disabled}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <VideoIcon />
        <div>
          <p className="text-sm font-semibold text-slate-700">
            {isWorking ? "Upload in progress…" : "Drop a video file or click to browse"}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">MP4, MOV, MKV, WebM · any size</p>
        </div>
      </label>

      {/* State-specific feedback */}
      {state.phase === "requesting" && (
        <StatusBar label="Requesting upload slot…" pct={null} />
      )}

      {state.phase === "uploading" && (
        <div className="space-y-1.5">
          <StatusBar label={`Uploading… ${state.pct}%`} pct={state.pct} />
          <button
            type="button"
            onClick={handleCancel}
            className="text-xs text-slate-500 underline hover:text-red-600"
          >
            Cancel upload
          </button>
        </div>
      )}

      {state.phase === "processing" && (
        <StatusBar label="Processing video in Mux… this may take a minute" pct={null} indeterminate />
      )}

      {state.phase === "ready" && (
        <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <CheckIcon />
          <span>
            Video ready. Playback ID: <code className="font-mono text-xs">{state.playbackId}</code>
          </span>
        </div>
      )}

      {state.phase === "error" && (
        <div className="space-y-1.5 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          <p className="font-semibold">Upload failed</p>
          <p className="text-xs">{state.message}</p>
          <button
            type="button"
            onClick={() => setState({ phase: "idle" })}
            className="text-xs font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Show current playback ID if one already exists */}
      {currentPlaybackId && state.phase === "idle" && (
        <p className="text-xs text-slate-500">
          Current:{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">{currentPlaybackId}</code>
          {" — uploading a new file will replace it."}
        </p>
      )}
    </div>
  );
}

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function StatusBar({ label, pct, indeterminate }: { label: string; pct: number | null; indeterminate?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-slate-600">{label}</p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        {indeterminate ? (
          <div className="h-1.5 w-1/3 animate-pulse rounded-full bg-[#185FA5]" />
        ) : (
          <div
            className="h-1.5 rounded-full bg-[#185FA5] transition-all duration-300"
            style={{ width: `${pct ?? 0}%` }}
          />
        )}
      </div>
    </div>
  );
}

function VideoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
      <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.91L15 14" />
      <rect width="15" height="14" x="1" y="5" rx="2" ry="2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
