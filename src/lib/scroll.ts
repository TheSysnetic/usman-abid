"use client";
import { useLenis } from "lenis/react";

/** Smoothly scroll to a section id (falls back to native scrolling). */
export function useScrollTo() {
  const lenis = useLenis();
  return (id: string) => {
    const target = id === "top" ? 0 : document.getElementById(id);
    if (target === null) return;
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else if (target === 0) window.scrollTo({ top: 0, behavior: "smooth" });
    else target.scrollIntoView({ behavior: "smooth" });
  };
}
