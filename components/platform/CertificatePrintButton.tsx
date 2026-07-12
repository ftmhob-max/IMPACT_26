"use client";

// Front-end certificate print control: components/platform/CertificatePrintButton.tsx

import * as Icons from "@/components/ui/Icons";

export function CertificatePrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#124f8b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-2 print:hidden"
    >
      <Icons.Printer size={17} />
      Print certificate
    </button>
  );
}
