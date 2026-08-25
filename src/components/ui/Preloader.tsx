"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ASSETS, XTEEL_FRAMES } from "@/data/assets";
import { HERO_MEDIA, KITCHEN_STYLES } from "@/data/kitchen-styles";
import { EASE } from "@/lib/motion";

/**
 * What has to be in the browser before the page is worth showing: the hero
 * still, every logo, the whole Xteel frame run (it scrubs on scroll, so a
 * missing frame reads as a flicker) and each style's wide shot.
 *
 * ponytail: the style galleries and moodboards — several dozen files — are
 * left to lazy-load. Add them here if the grids ever pop in visibly.
 */
const CRITICAL = [
  HERO_MEDIA.poster,
  ASSETS.logo.mark,
  ASSETS.logo.word,
  ASSETS.brand.modulaBrown,
  ASSETS.brand.modulaWhite,
  ASSETS.brand.jsw,
  ASSETS.brand.jswMark,
  ASSETS.brand.modulaCorner,
  ...XTEEL_FRAMES,
  ...KITCHEN_STYLES.map((s) => s.hero),
];

/** Never hold the visitor longer than this, however slow the connection. */
const MAX_WAIT = 12_000;
/** ...and never flash the loader on a warm cache. */
const MIN_SHOW = 900;

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const started = Date.now();
    let loaded = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(100);
      setTimeout(() => setDone(true), Math.max(0, MIN_SHOW - (Date.now() - started)) + 250);
    };

    const tick = () => {
      loaded += 1;
      setProgress(Math.round((loaded / CRITICAL.length) * 100));
      if (loaded === CRITICAL.length) finish();
    };

    for (const src of CRITICAL) {
      const img = new Image();
      // A 404 must not hold the door shut — a broken file is a broken image,
      // not a broken site.
      img.onload = img.onerror = tick;
      img.src = src;
    }

    const bail = setTimeout(finish, MAX_WAIT);

    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";

    return () => {
      clearTimeout(bail);
      html.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    document.documentElement.style.overflow = "";
    window.scrollTo(0, 0);
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-cream"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE }}
          aria-live="polite"
          aria-busy="true"
        >
          {/* Same cork-light grain the page uses, so the reveal is a lift
              rather than a cut to a different material. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(rgba(134,91,73,0.14) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative flex w-[min(28rem,78vw)] flex-col items-center">
            <motion.img
              src={ASSETS.logo.mark}
              alt=""
              aria-hidden="true"
              className="h-16 w-auto"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />

            <p className="mt-7 text-[10px] font-medium tracking-[0.32em] text-brown uppercase">
              Loading your experience
            </p>

            <div className="mt-6 flex w-full items-end justify-between">
              <span className="font-serif text-[clamp(2.5rem,9vw,4rem)] leading-none tabular-nums text-foreground">
                {String(progress).padStart(2, "0")}
              </span>
              <span className="pb-2 font-mono text-[10px] tracking-[0.2em] text-muted">
                %
              </span>
            </div>

            <div className="mt-4 h-px w-full bg-brown/20">
              <div
                className="h-px transition-[width] duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, var(--coral), var(--sky), var(--signal))",
                }}
              />
            </div>

            <p className="mt-4 self-start font-mono text-[10px] tracking-[0.18em] text-muted/70 uppercase">
              Kitchens, finishes &amp; frames
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
