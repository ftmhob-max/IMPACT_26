import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IMPACT_26 — Property Assessment E-Learning",
  description: "Professional certification training for municipal property assessment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
