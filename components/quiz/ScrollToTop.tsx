"use client";

import { useState, useEffect } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="scroll-top fixed bottom-5 right-5 z-[100] w-10 h-10 rounded-full text-white flex items-center justify-center text-base transition-all duration-150 hover:-translate-y-0.5"
      style={{ background: "#185FA5", boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}
