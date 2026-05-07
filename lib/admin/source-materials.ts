export type SourceMaterialKind = "document" | "audio" | "video";

const VIDEO_EXTENSIONS = new Set(["mp4", "mov", "m4v", "webm", "avi", "mkv"]);
const AUDIO_EXTENSIONS = new Set(["mp3", "wav", "m4a", "aac", "ogg", "webm"]);

export function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function getSourceMaterialKind(fileName: string, fileType?: string | null): SourceMaterialKind {
  const lowerType = (fileType ?? "").toLowerCase();
  const ext = getFileExtension(fileName);

  if (lowerType.startsWith("video/")) {
    return "video";
  }

  if (lowerType.startsWith("audio/")) {
    return "audio";
  }

  if (VIDEO_EXTENSIONS.has(ext)) {
    return "video";
  }

  if (AUDIO_EXTENSIONS.has(ext)) {
    return "audio";
  }

  return "document";
}

export function isPreviewableMediaKind(kind: SourceMaterialKind) {
  return kind === "audio" || kind === "video";
}

export function parseGsPath(storagePath?: string | null) {
  if (!storagePath || !storagePath.startsWith("gs://")) return null;
  const withoutScheme = storagePath.slice(5);
  const slash = withoutScheme.indexOf("/");
  if (slash === -1) return null;
  return {
    bucket: withoutScheme.slice(0, slash),
    filePath: withoutScheme.slice(slash + 1),
  };
}
