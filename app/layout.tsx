import type { Metadata } from "next";
import { ThemeController } from "@/components/theme/ThemeController";
import "./globals.css";

export const metadata: Metadata = {
  title: "IMPACT_26 — Property Assessment E-Learning",
  description: "Professional certification training for municipal property assessment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("impact26:theme")==="dark"?"dark":"light";document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.dataset.theme=t;}catch(e){}`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeController />
        {children}
      </body>
    </html>
  );
}
