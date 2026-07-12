// Front-end root document layout: app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeController } from "@/components/theme/ThemeController";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-impact-sans",
});

export const metadata: Metadata = {
  title: "IMPACT_26 — Property Assessment E-Learning",
  description: "Professional certification training for municipal property assessment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Pre-hydration theme resolver: reads the stored preference (light/dark/system),
            resolves "system" against the OS setting, and paints the correct palette
            before first paint to avoid a flash of the wrong theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var p=localStorage.getItem("impact26:theme");if(p!=="light"&&p!=="dark"&&p!=="system"){p="system";}var d=p==="dark"||(p==="system"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=d?"dark":"light";var e=document.documentElement;e.classList.toggle("dark",d);e.dataset.theme=r;e.dataset.themePreference=p;var m=document.createElement("meta");m.name="theme-color";m.content=d?"#0e141b":"#f0efe9";document.head.appendChild(m);}catch(e){}`,
          }}
        />
      </head>
      <body className={inter.variable} suppressHydrationWarning>
        <ThemeController />
        {children}
      </body>
    </html>
  );
}
