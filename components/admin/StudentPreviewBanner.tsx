import Link from "next/link";
import * as Icons from "@/components/ui/Icons";

interface StudentPreviewBannerProps {
  backHref?: string;
  backLabel?: string;
}

export function StudentPreviewBanner({
  backHref = "/admin",
  backLabel = "Back to admin",
}: StudentPreviewBannerProps) {
  return (
    <div className="sticky top-0 z-10 flex flex-col items-start gap-3 border-b border-amber-300 bg-amber-50 px-4 py-2.5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-start gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500 text-white">
          <Icons.Eye size={15} />
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-amber-800">
            Student Preview Mode
          </p>
          <p className="text-[11px] text-amber-700">
            This is how learners see this content. Progress and enrollment actions are disabled.
          </p>
        </div>
      </div>
      <Link
        href={backHref}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1"
      >
        <Icons.ChevronLeft size={13} />
        {backLabel}
      </Link>
    </div>
  );
}
