"use client";

import { useState, useEffect } from "react";
import { parseVideoUrl, isEmbeddableVideoUrl, type VideoMeta } from "@/lib/video-url";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
}

const PLACEHOLDER_EXAMPLES = [
  "https://www.youtube.com/watch?v=…",
  "https://vimeo.com/…",
  "https://www.loom.com/share/…",
  "https://drive.google.com/file/d/…/view",
  "https://fast.wistia.net/embed/iframe/…",
  "https://example.com/video.mp4",
];

export function VideoLinkInput({ value, onChange, disabled, className }: Props) {
  const [draft, setDraft] = useState(value);
  const [meta, setMeta] = useState<VideoMeta | null>(() => (value ? parseVideoUrl(value) : null));
  const [showPreview, setShowPreview] = useState(false);

  // Keep draft in sync when the parent resets the value (e.g. version restore)
  useEffect(() => {
    setDraft(value);
    setMeta(value ? parseVideoUrl(value) : null);
  }, [value]);

  function handleInput(raw: string) {
    setDraft(raw);
    setShowPreview(false);
    const parsed = parseVideoUrl(raw);
    setMeta(parsed);
    if (parsed && parsed.provider !== "unknown" && parsed.embedUrl) {
      onChange(raw.trim());
    } else if (!raw.trim()) {
      onChange("");
    }
  }

  const isValid = meta !== null && meta.provider !== "unknown" && meta.embedUrl !== "";
  const isUnknown = draft.trim() !== "" && !isValid;

  return (
    <div className={cn("space-y-2", className)}>
      {/* URL input */}
      <div className="relative">
        <input
          type="url"
          value={draft}
          onChange={(e) => handleInput(e.target.value)}
          disabled={disabled}
          placeholder={PLACEHOLDER_EXAMPLES[0]}
          className={cn(
            "admin-input pr-24 font-mono text-xs",
            isValid && "border-emerald-400 bg-emerald-50/40 focus:border-emerald-500",
            isUnknown && "border-amber-400 bg-amber-50/40"
          )}
        />
        {isValid && (
          <button
            type="button"
            onClick={() => setShowPreview((p) => !p)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#185FA5] px-2 py-0.5 text-xs font-semibold text-white hover:bg-[#145082]"
          >
            {showPreview ? "Hide" : "Preview"}
          </button>
        )}
      </div>

      {/* Platform detection badge */}
      {draft.trim() !== "" && (
        <p className={cn("text-xs", isValid ? "text-emerald-700" : "text-amber-600")}>
          {isValid
            ? `✓ Detected: ${meta!.label}`
            : "Unrecognised URL — paste a YouTube, Vimeo, Loom, Google Drive, or Wistia link, or a direct .mp4 URL."}
        </p>
      )}

      {/* Supported formats hint */}
      {!draft.trim() && (
        <p className="text-xs text-slate-400">
          Supported: YouTube, Vimeo, Loom, Google Drive, Wistia, or a direct video file URL (.mp4, .webm…)
        </p>
      )}

      {/* Embed preview */}
      {showPreview && isValid && meta && (
        <EmbedPreview meta={meta} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

function EmbedPreview({ meta, onClose }: { meta: VideoMeta; onClose: () => void }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-600">{meta.label} preview</p>
        <button type="button" onClick={onClose} className="text-xs text-slate-400 hover:text-slate-700">
          Close ✕
        </button>
      </div>

      <div className="aspect-video overflow-hidden rounded-lg bg-slate-950 shadow-sm">
        {meta.provider === "direct" ? (
          <video
            src={meta.embedUrl}
            controls
            className="h-full w-full"
          />
        ) : (
          <iframe
            src={meta.embedUrl}
            className="h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
            title="Video preview"
          />
        )}
      </div>
    </div>
  );
}
