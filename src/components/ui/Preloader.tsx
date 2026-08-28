"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Layers, RefreshCw, Shield, Sparkles, Zap } from "lucide-react";

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

/**
 * The four cards the deck holds. The chrome around them is the supplied
 * loader's, untouched — only the copy on the cards is ours.
 *
 * ponytail: dealt off `progress`, not off an interval. A timed cycle would
 * deal cards nobody sees on a warm cache, and would run out of step with the
 * percentage in the footer on a cold one.
 */
const CHAPTERS = [
  { code: "IO_01", title: "Identity", color: "bg-amber-300", icon: Sparkles },
  { code: "IO_02", title: "The Panel", color: "bg-cyan-300", icon: Shield },
  { code: "IO_03", title: "The Kitchen", color: "bg-rose-300", icon: Zap },
  { code: "IO_04", title: "The Studio", color: "bg-emerald-300", icon: Layers },
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

  // The deck, current chapter on top. Sliced by progress and clamped one
  // short of the end, so the stack never empties before the door opens.
  const stack = CHAPTERS.slice(
    Math.min(CHAPTERS.length - 1, Math.floor(progress / 25))
  ).reverse();

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

          {/* The supplied loader box, kept as drawn — only the copy on the
              cards is ours, and the footer badge carries the real figure. */}
          <div className="relative flex w-[min(20rem,86vw)] flex-col gap-5 border-[3.5px] border-black bg-white p-5 font-mono shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between border-b-[3px] border-black pb-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border border-black bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full border border-black bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full border border-black bg-green-400" />
              </div>
              <span className="bg-black px-2 py-0.5 text-[10px] font-black tracking-widest text-white uppercase">
                LOADING...
              </span>
            </div>

            <div className="relative flex h-44 w-full items-center justify-center overflow-hidden border-[3px] border-black bg-zinc-900 shadow-[inset_0px_3px_8px_rgba(0,0,0,0.4)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                  backgroundSize: "12px 12px",
                }}
              />

              <div className="relative flex h-32 w-36 items-center justify-center">
                <AnimatePresence mode="popLayout">
                  {stack.map((chapter, i) => {
                    const depth = stack.length - 1 - i;
                    const Icon = chapter.icon;

                    return (
                      <motion.div
                        key={chapter.code}
                        layout
                        initial={{ x: -120, y: -10, rotate: -15, opacity: 0, scale: 0.85 }}
                        animate={{
                          x: depth * -4,
                          y: depth * -4,
                          rotate: (i % 2 === 0 ? 1 : -1) * (depth * 2),
                          scale: 1 - depth * 0.04,
                          opacity: 1,
                        }}
                        exit={{ x: 120, y: 10, rotate: 15, opacity: 0, scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 300, damping: 24 }}
                        style={{ zIndex: i }}
                        className={`absolute inset-0 flex flex-col justify-between border-[3px] border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${chapter.color}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="bg-black px-1 py-0.5 text-[9px] font-black text-white">
                            {chapter.code}
                          </span>
                          <Icon size={14} className="stroke-[2.5]" />
                        </div>

                        {/* A <p>, not an <h4>: the page's heading rule would
                            pull this off the mono face the box is set in. */}
                        <p className="my-auto text-sm leading-tight font-black uppercase">
                          {chapter.title}
                        </p>

                        <div className="flex items-center justify-between border-t-2 border-black pt-1 text-[8px] font-black">
                          <span>STATUS</span>
                          <span className="h-2 w-2 animate-pulse rounded-full bg-black" />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center justify-between border-[2.5px] border-black bg-zinc-100 p-2.5 text-xs font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2">
                <RefreshCw size={12} className="animate-spin text-black" />
                <span className="text-[10px] tracking-wider uppercase">
                  LOADING EXPERIENCE
                </span>
              </div>
              <span className="bg-black px-1.5 py-0.5 text-[10px] text-yellow-300 tabular-nums">
                {String(progress).padStart(2, "0")}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
