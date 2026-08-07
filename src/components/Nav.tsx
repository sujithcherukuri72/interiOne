"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";

import { EASE, EASE_UI } from "@/lib/motion";
import { useLenis } from "./SmoothScrollProvider";
import MenuOverlay from "./ui/MenuOverlay";
import MenuToggle from "./ui/MenuToggle";
import Logo from "./ui/Logo";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const lenisRef = useLenis();
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [navHidden, setNavHidden] = useState(false);
  /**
   * Over the hero the bar is clear glass with white type; past it the page is
   * cream and white type would vanish, so the pane frosts up and the type goes
   * to ink. One boolean, because there are only ever two grounds.
   */
  const [onHero, setOnHero] = useState(true);
  const lastY = useRef(0);
  const heroHeight = useRef(0);

  // After the page-load entrance animation completes, switch to the fast
  // scroll-responsive transition so hide/show feels instant, not sluggish.
  // State rather than a ref: this is read while rendering to choose the
  // transition, which is exactly what a ref must not be used for.
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const measure = () => {
      heroHeight.current = window.innerHeight;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastY.current;
    const scrollingDown = latest > previous;
    lastY.current = latest;

    const halfHero = heroHeight.current / 2;

    // Swapped a little before the hero actually ends, so the pane has frosted
    // by the time the cream section arrives under it rather than after.
    setOnHero(latest < heroHeight.current - 120);

    if (latest < halfHero) {
      setNavHidden(false);
    } else if (scrollingDown) {
      setNavHidden(true);
    } else {
      setNavHidden(false);
    }
  });

  // Pause Lenis so the page can't scroll behind the open menu overlay.
  useEffect(() => {
    if (open) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
    return () => {
      lenisRef.current?.start();
    };
  }, [open, lenisRef]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Progress bar lives outside the blended header — difference mode
          would turn coral into a teal that belongs to no palette. */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[45] h-[2px] origin-left bg-coral"
        style={{ scaleX: progress }}
      />

      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={navHidden ? { y: -72, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={
          hasEntered
            ? { duration: 0.38, ease: EASE_UI }
            : { duration: 0.9, ease: EASE, delay: 0.2 }
        }
        onAnimationComplete={() => setHasEntered(true)}
        style={{ pointerEvents: navHidden ? "none" : "auto" }}
        /* Glass, not a slab. `difference` blending used to invert the bar
           against whatever was behind it, which meant it could never simply be
           translucent — and over a video that is the one thing it should be. */
        className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-[background-color,border-color,color] duration-500 ${
          onHero
            ? "border-white/12 bg-white/[0.07] text-white"
            : "border-line bg-background/70 text-foreground"
        }`}
      >
        <div className="section-shell flex h-[72px] items-center justify-between">
          <Link href="/" aria-label="interiOne — home" className="focus-ring rounded">
            <Logo
              className="text-[17px] sm:text-[19px]"
              variant={onHero ? "light" : "dark"}
            />
          </Link>

          <MenuToggle onClick={() => setOpen(true)} expanded={open} />
        </div>
      </motion.header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
