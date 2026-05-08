"use client";

import { useCallback, useRef, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
  "text/csv": [".csv"],
  "text/plain": [".txt"],
  "text/markdown": [".md"],
  "video/mp4": [".mp4"],
  "video/quicktime": [".mov"],
  "video/x-m4v": [".m4v"],
  "video/webm": [".webm"],
  "video/x-msvideo": [".avi"],
  "video/x-matroska": [".mkv"],
  "audio/mpeg": [".mp3"],
  "audio/wav": [".wav"],
  "audio/x-wav": [".wav"],
  "audio/mp4": [".m4a"],
  "audio/aac": [".aac"],
  "audio/ogg": [".ogg"],
};

const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".docx",
  ".doc",
  ".csv",
  ".txt",
  ".md",
  ".mp4",
  ".mov",
  ".m4v",
  ".webm",
  ".avi",
  ".mkv",
  ".mp3",
  ".wav",
  ".m4a",
  ".aac",
  ".ogg",
];

type IconComp = React.FC<{ className?: string; size?: number }>;
const FILE_TYPE_ICONS: Record<string, IconComp> = {
  pdf: Icons.FileText,
  docx: Icons.FileText,
  doc: Icons.FileText,
  csv: Icons.ClipboardList,
  txt: Icons.BookOpen,
  md: Icons.BookOpen,
  mp4: Icons.Video,
  mov: Icons.Video,
  m4v: Icons.Video,
  webm: Icons.Video,
  avi: Icons.Video,
  mkv: Icons.Video,
};

function getExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isAccepted(file: File) {
  const ext = "." + getExtension(file.name);
  return ACCEPTED_EXTENSIONS.includes(ext) || Object.keys(ACCEPTED_TYPES).includes(file.type);
}

interface FileDropZoneProps {
  onFile?: (file: File) => void;
  onFiles?: (files: File[]) => void;
  file?: File | null;
  files?: File[];
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FileDropZone({
  onFile,
  onFiles,
  file,
  files,
  multiple = false,
  disabled,
  className,
}: FileDropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedFiles = multiple ? (files ?? []) : (file ? [file] : []);

  const handleFile = useCallback(
    (incomingFiles: File[]) => {
      if (!incomingFiles.length) return;
      const accepted = incomingFiles.filter(isAccepted);
      const rejectedCount = incomingFiles.length - accepted.length;

      if (!accepted.length) {
        setError("Unsupported file type. Use PDF, DOCX, CSV, TXT, Markdown, audio, or video.");
        return;
      }

      setError(
        rejectedCount > 0
          ? `${rejectedCount} file${rejectedCount === 1 ? "" : "s"} skipped. Use PDF, DOCX, CSV, TXT, Markdown, audio, or video.`
          : null
      );

      if (multiple) {
        onFiles?.(accepted);
        return;
      }

      onFile?.(accepted[0]);
    },
    [multiple, onFile, onFiles]
  );

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled) setDragging(true);
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    handleFile(Array.from(e.dataTransfer.files));
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFile(Array.from(e.target.files ?? []));
    e.target.value = "";
  }

  const leadFile = selectedFiles[0] ?? null;
  const ext = leadFile ? getExtension(leadFile.name) : null;
  const FileIcon: IconComp = (ext != null && FILE_TYPE_ICONS[ext]) || Icons.FileText;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Drop file or click to browse"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && !disabled && inputRef.current?.click()}
        className={cn(
          "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all",
          dragging
            ? "border-[#185FA5] bg-[#E6F1FB]/60 scale-[1.01]"
            : file
            ? "border-emerald-300 bg-emerald-50"
            : "border-slate-300 bg-slate-50 hover:border-[#185FA5]/60 hover:bg-[#E6F1FB]/30",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          multiple={multiple}
          className="sr-only"
          onChange={onInputChange}
          disabled={disabled}
          tabIndex={-1}
        />

        {leadFile ? (
          <>
            <FileIcon size={28} className="text-emerald-600" />
            <div>
              {multiple ? (
                <>
                  <p className="text-sm font-semibold text-emerald-700">
                    {selectedFiles.length.toLocaleString()} files ready to ingest
                  </p>
                  <p className="text-xs text-emerald-600">
                    {selectedFiles.slice(0, 3).map((entry) => entry.name).join(", ")}
                    {selectedFiles.length > 3 ? ` + ${selectedFiles.length - 3} more` : ""}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-emerald-700">{leadFile.name}</p>
                  <p className="text-xs text-emerald-600">{formatBytes(leadFile.size)}</p>
                </>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {multiple ? "Click or drop more files to add to this batch" : "Click to change file"}
            </p>
          </>
        ) : (
          <>
            <Icons.Upload size={28} className={dragging ? "text-[#185FA5]" : "text-slate-400"} />
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {dragging ? `Drop ${multiple ? "files" : "file"} here` : `Drag & drop or click to browse${multiple ? " files" : ""}`}
              </p>
              <p className="text-xs text-slate-500">PDF, DOCX, CSV, TXT, Markdown, audio, video</p>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600">
          <Icons.X size={12} />
          {error}
        </p>
      )}
    </div>
  );
}
