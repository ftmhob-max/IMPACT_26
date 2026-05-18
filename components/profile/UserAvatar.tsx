"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export function getInitials(fullName?: string | null, email?: string | null) {
  if (fullName?.trim()) {
    return fullName
      .trim()
      .split(/\s+/)
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return email?.[0]?.toUpperCase() ?? "?";
}

export function UserAvatar({
  fullName,
  email,
  photoURL,
  size = "md",
  className,
}: {
  fullName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = useMemo(() => getInitials(fullName, email), [fullName, email]);
  const hasImage = Boolean(photoURL) && !failed;

  const sizeClasses = {
    sm: "h-8 w-8 text-[11px]",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-base",
    xl: "h-24 w-24 text-2xl",
  };

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 font-extrabold text-white ring-4 ring-white/90",
        sizeClasses[size],
        className
      )}
      aria-label={`${fullName || email || "User"} avatar`}
    >
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoURL ?? undefined}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        initials
      )}
    </span>
  );
}
