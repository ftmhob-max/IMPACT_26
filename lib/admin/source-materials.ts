export type SourceMaterialKind = "document" | "audio" | "video" | "image";

const VIDEO_EXTENSIONS = new Set(["mp4", "mov", "m4v", "webm", "avi", "mkv"]);
const AUDIO_EXTENSIONS = new Set(["mp3", "wav", "m4a", "aac", "ogg", "webm"]);
const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg"]);

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

  if (lowerType.startsWith("image/")) {
    return "image";
  }

  if (VIDEO_EXTENSIONS.has(ext)) {
    return "video";
  }

  if (AUDIO_EXTENSIONS.has(ext)) {
    return "audio";
  }

  if (IMAGE_EXTENSIONS.has(ext)) {
    return "image";
  }

  return "document";
}

export function isPreviewableMediaKind(kind: SourceMaterialKind) {
  return kind === "audio" || kind === "video" || kind === "image";
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
