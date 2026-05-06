/**
 * Utilities for parsing and embedding external video URLs.
 *
 * Supported platforms:
 *   YouTube    — youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/
 *   Vimeo      — vimeo.com/{id}
 *   Loom       — loom.com/share/{id}
 *   Google Drive — drive.google.com/file/d/{id}/view
 *   Wistia     — fast.wistia.net/medias/{id} | wistia.com/medias/{id}
 *   Direct     — any URL ending in a video extension (.mp4, .webm, .ogg, .mov)
 */

export type VideoProvider =
  | "youtube"
  | "vimeo"
  | "loom"
  | "google-drive"
  | "wistia"
  | "direct"
  | "unknown";

export interface VideoMeta {
  provider: VideoProvider;
  /** Canonical embed URL ready for use in an <iframe> or <video> src */
  embedUrl: string;
  /** Platform-native video ID (empty for direct URLs) */
  videoId: string;
  /** Human-readable label for display */
  label: string;
}

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|m4v|mkv)(\?.*)?$/i;

export function parseVideoUrl(raw: string): VideoMeta | null {
  const input = raw.trim();
  if (!input) return null;

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  const path = url.pathname;

  // ── YouTube ───────────────────────────────────────────────────────────────
  if (host === "youtube.com" || host === "youtu.be" || host === "youtube-nocookie.com") {
    let id: string | null = null;

    if (host === "youtu.be") {
      id = path.slice(1).split("/")[0];
    } else if (path.startsWith("/shorts/")) {
      id = path.split("/shorts/")[1]?.split("?")[0] ?? null;
    } else if (path.startsWith("/embed/")) {
      id = path.split("/embed/")[1]?.split("?")[0] ?? null;
    } else {
      id = url.searchParams.get("v");
    }

    if (!id) return null;
    return {
      provider: "youtube",
      videoId: id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0`,
      label: "YouTube",
    };
  }

  // ── Vimeo ─────────────────────────────────────────────────────────────────
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const segments = path.split("/").filter(Boolean);
    // player.vimeo.com/video/{id}  OR  vimeo.com/{id}
    const idSegment = host === "player.vimeo.com" ? segments[1] : segments[0];
    if (!idSegment || !/^\d+$/.test(idSegment)) return null;
    return {
      provider: "vimeo",
      videoId: idSegment,
      embedUrl: `https://player.vimeo.com/video/${idSegment}?dnt=1`,
      label: "Vimeo",
    };
  }

  // ── Loom ──────────────────────────────────────────────────────────────────
  if (host === "loom.com") {
    // https://www.loom.com/share/{id}
    const match = path.match(/\/(?:share|embed)\/([a-f0-9]+)/i);
    if (!match) return null;
    return {
      provider: "loom",
      videoId: match[1],
      embedUrl: `https://www.loom.com/embed/${match[1]}?hide_owner=true&hide_share=true`,
      label: "Loom",
    };
  }

  // ── Google Drive ──────────────────────────────────────────────────────────
  if (host === "drive.google.com") {
    // https://drive.google.com/file/d/{fileId}/view
    const match = path.match(/\/file\/d\/([^/]+)/);
    if (!match) return null;
    return {
      provider: "google-drive",
      videoId: match[1],
      embedUrl: `https://drive.google.com/file/d/${match[1]}/preview`,
      label: "Google Drive",
    };
  }

  // ── Wistia ────────────────────────────────────────────────────────────────
  if (host === "wistia.com" || host === "fast.wistia.net" || host.endsWith(".wistia.com")) {
    // https://fast.wistia.net/embed/iframe/{id}
    // https://[account].wistia.com/medias/{id}
    const iframeMatch = path.match(/\/embed\/iframe\/([a-z0-9]+)/i);
    if (iframeMatch) {
      return {
        provider: "wistia",
        videoId: iframeMatch[1],
        embedUrl: `https://fast.wistia.net/embed/iframe/${iframeMatch[1]}?videoFoam=true`,
        label: "Wistia",
      };
    }
    const mediaMatch = path.match(/\/medias\/([a-z0-9]+)/i);
    if (mediaMatch) {
      return {
        provider: "wistia",
        videoId: mediaMatch[1],
        embedUrl: `https://fast.wistia.net/embed/iframe/${mediaMatch[1]}?videoFoam=true`,
        label: "Wistia",
      };
    }
    return null;
  }

  // ── Direct video file ─────────────────────────────────────────────────────
  if (VIDEO_EXTENSIONS.test(path)) {
    return {
      provider: "direct",
      videoId: "",
      embedUrl: input,
      label: "Direct video",
    };
  }

  return { provider: "unknown", videoId: "", embedUrl: "", label: "Unknown" };
}

/** Returns true if the URL is a recognisable, embeddable video link. */
export function isEmbeddableVideoUrl(raw: string): boolean {
  const meta = parseVideoUrl(raw);
  return meta !== null && meta.provider !== "unknown" && meta.embedUrl !== "";
}

/** Icon name per provider for UI display */
export const PROVIDER_ICONS: Record<VideoProvider, string> = {
  youtube: "▶ YouTube",
  vimeo: "▶ Vimeo",
  loom: "▶ Loom",
  "google-drive": "▶ Google Drive",
  wistia: "▶ Wistia",
  direct: "▶ Direct file",
  unknown: "? Unknown",
};
