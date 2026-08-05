"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// A stable ref is passed through context so consumers never re-render
// just because Lenis initialised. They read .current when they need it.
type LenisRef = React.RefObject<Lenis | null>;
const LenisContext = createContext<LenisRef>({ current: null });

export function useLenis(): LenisRef {
  return useContext(LenisContext);
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion — no smooth scroll for these users.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    // Lenis translates the page itself, so the native scroll events ScrollTrigger
    // listens for never tell the whole story. Without this, GSAP triggers below
    // the fold fire against a stale scroll position.
    lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.refresh();

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}
