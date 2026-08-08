"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import type { KitchenStyle } from "@/data/kitchen-styles";
import { EASE, EASE_UI } from "@/lib/motion";
import { useOverlayLock } from "@/lib/overlay";
import CloseButton from "./CloseButton";

/**
 * The style detail page — a look before a commitment.
 *
 * The carousel card used to jump straight into the planner on one tap, which
 * meant "Build a glam kitchen" was doing two jobs: showing what glam actually
 * looks like, and starting a six-step form. This is the "show" half, so the
 * carousel's tap can go back to being a browse action — the planner only opens
 * from a deliberate "Build this" here, mirroring FinishOverlay's split between
 * looking at a finish and enquiring about it.
 *
 * Both galleries are driven by the measured dimensions in `kitchen-styles.ts`
 * rather than by a fixed aspect ratio, because this shoot mixes portrait and
 * landscape frames and a uniform grid crops half of them through the middle.
 */
export default function StyleOverlay({
  style,
  onClose,
  onBuild,
}: {
  style: KitchenStyle | null;
  onClose: () => void;
  onBuild: (id: string) => void;
}) {
  useOverlayLock(!!style);

  return (
    <AnimatePresence>
      {style && (
        <motion.div
          key={style.id}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", transition: { duration: 0.5, ease: EASE_UI } }}
          transition={{ duration: 0.7, ease: EASE }}
          className="fixed inset-0 z-[100]"
          role="dialog"
          aria-modal="true"
          aria-label={`${style.name} kitchens`}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30">
            <div className="section-shell flex h-[72px] items-center justify-end">
              <div className="pointer-events-auto -mr-4">
                <CloseButton onClick={onClose} label={`Close ${style.name}`} />
              </div>
            </div>
          </div>

          <div
            data-lenis-prevent
            className="h-full overflow-y-auto overscroll-contain bg-background [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* ── Hero ─────────────────────────────────────────────── */}
            <div className="relative h-[62vh] min-h-[380px] w-full overflow-hidden bg-line">
              <motion.div
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.6, ease: EASE, delay: 0.15 }}
                className="absolute inset-0"
              >
                <Image
                  src={style.hero}
                  alt={`${style.name} kitchen`}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-ink/25" />

              <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
                className="section-shell absolute inset-x-0 bottom-0 pb-10 sm:pb-14"
              >
                <p className="text-[11px] font-medium tracking-[0.28em] text-white/60 uppercase">
                  {style.tagline}
                </p>
                <h2 className="mt-3 text-[clamp(2.25rem,6.5vw,5rem)] leading-[0.95] font-medium tracking-[-0.04em] text-white">
                  {style.name}
                </h2>
              </motion.div>
            </div>

            <div className="section-shell pt-[clamp(2.5rem,7vh,5rem)]">
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
                className="max-w-[62ch] text-[clamp(1.1rem,1.8vw,1.5rem)] leading-[1.5] font-medium tracking-[-0.02em] text-balance"
              >
                {style.blurb}
              </motion.p>
            </div>

            {/* ── Materials ────────────────────────────────────────── */}
            <MaterialReel style={style} />

            {/* ── Room shots ───────────────────────────────────────── */}
            <div className="section-shell mt-[clamp(2.75rem,7vh,5.5rem)]">
              <p className="text-[10px] font-medium tracking-[0.28em] text-foreground/45 uppercase">
                In the room
              </p>
              <p className="mt-3 max-w-[44ch] text-[14px] leading-[1.6] text-muted">
                {style.grid.length} frames from {style.name.toLowerCase()}{" "}
                installations.
              </p>

              {/* Columns rather than a grid: each frame keeps its own aspect
                  ratio, so the portrait and landscape shots interleave instead
                  of being cropped to a common square. */}
              <div className="mt-8 gap-4 [column-fill:balance] columns-1 sm:columns-2 lg:columns-3">
                {style.grid.map((shot, i) => (
                  <motion.figure
                    key={shot.src}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.08 }}
                    style={{ aspectRatio: `${shot.w} / ${shot.h}` }}
                    className="group relative mb-4 block w-full overflow-hidden rounded-xl bg-line break-inside-avoid"
                  >
                    <Image
                      src={shot.src}
                      alt={`${style.name} kitchen detail`}
                      fill
                      sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 92vw"
                      className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
                    />
                  </motion.figure>
                ))}
              </div>
            </div>

            {/* ── Build, once looking is done ─────────────────────── */}
            <div className="section-shell pb-[clamp(3.5rem,9vh,7.5rem)]">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.75 }}
                className="mt-[clamp(2.75rem,7vh,5.5rem)] flex flex-col items-start gap-5 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="max-w-[36ch] text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.3] font-medium tracking-[-0.025em] text-balance">
                  Ready to lay {style.name.toLowerCase()} out against your own
                  walls?
                </p>
                <button
                  type="button"
                  onClick={() => onBuild(style.id)}
                  className="focus-ring inline-flex shrink-0 items-center gap-3 rounded-full bg-brown px-6 py-3 text-[13px] tracking-[-0.005em] text-white transition-opacity duration-300 hover:opacity-90"
                >
                  Build a {style.name.toLowerCase()} kitchen
                  <ArrowRight size={15} strokeWidth={1.75} />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * The material reel.
 *
 * Nine material macros — marble, velvet, brushed brass, oak — shot full-bleed.
 * A thumbnail grid was the wrong home for them: a slab of onyx at 120px square
 * is a beige rectangle, and the whole point of the shot is the grain. So they
 * sit as vertical slices instead, which at rest read as the style's palette in
 * order, and whichever one you point at opens to six times the width of the
 * others and becomes the photograph again.
 *
 * Driven by hover *and* click. Hover is the natural gesture with a pointer, but
 * it does not exist on a phone, and a control that only responds to something
 * half your visitors cannot do is broken for them.
 */
function MaterialReel({ style }: { style: KitchenStyle }) {
  const [active, setActive] = useState(0);
  const shots = style.moodboard;

  return (
    <div className="mt-[clamp(2.75rem,7vh,5.5rem)]">
      <div className="section-shell">
        <p className="text-[10px] font-medium tracking-[0.28em] text-foreground/45 uppercase">
          Materials and palette
        </p>
        <div className="mt-3 flex items-baseline justify-between gap-6">
          <p className="max-w-[44ch] text-[14px] leading-[1.6] text-muted">
            The {shots.length} materials this style is built from. Point at one
            to open it.
          </p>
          <p className="hidden shrink-0 font-mono text-[11px] tracking-[0.18em] text-foreground/45 tabular-nums sm:block">
            {String(active + 1).padStart(2, "0")} / {shots.length}
          </p>
        </div>
      </div>

      {/* Full-bleed: the reel is the widest thing on the page, so it is not
          held inside the text measure. */}
      <div className="mt-7 px-5 sm:px-8">
        {/* ── Pointer layout: the expanding reel ─────────────────── */}
        <div className="hidden h-[clamp(300px,46vh,520px)] gap-2 sm:flex">
          {shots.map((shot, i) => {
            const on = active === i;
            return (
              <button
                key={shot.src}
                type="button"
                aria-label={`${style.name} material ${i + 1}`}
                aria-pressed={on}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                style={{ flexGrow: on ? 6 : 1, flexBasis: 0 }}
                className="focus-ring group relative min-w-0 overflow-hidden rounded-xl bg-line transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              >
                <Image
                  src={shot.src}
                  alt=""
                  fill
                  // The open slice is the one worth resolution: sized for it,
                  // so opening does not fetch a second, larger file.
                  sizes="(min-width: 1024px) 55vw, 70vw"
                  className={`object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                    on ? "scale-100 saturate-100" : "scale-[1.15] saturate-[0.85]"
                  }`}
                />

                {/* The closed slices sit back so the open one carries the eye. */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 bg-ink transition-opacity duration-700 ${
                    on ? "opacity-0" : "opacity-25"
                  }`}
                />

                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent pb-4 pl-4 pt-10 text-left transition-opacity duration-500 ${
                    on ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="font-mono text-[10px] tracking-[0.22em] text-white/70 uppercase">
                    {style.name} · {String(i + 1).padStart(2, "0")}
                  </span>
                </span>

                {/* A number on the closed slices, rotated into the band —
                    the only thing that fits in 40px of width. */}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.2em] text-white/75 tabular-nums transition-opacity duration-500 [writing-mode:vertical-rl] ${
                    on ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Small screens: a snap rail ─────────────────────────────
            Nine slices across a phone is 40px each — narrower than a finger.
            The same photographs, swiped instead. */}
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
          {shots.map((shot, i) => (
            <figure
              key={shot.src}
              className="relative aspect-[3/4] w-[68vw] shrink-0 snap-center overflow-hidden rounded-xl bg-line"
            >
              <Image
                src={shot.src}
                alt=""
                fill
                sizes="70vw"
                className="object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-3 pt-8 pb-3 font-mono text-[10px] tracking-[0.22em] text-white/75 uppercase">
                {style.name} · {String(i + 1).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
