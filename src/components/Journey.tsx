"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { XTEEL_FRAMES } from "@/data/assets";
import { JOURNEY } from "@/data/journey";
import { HERO_MEDIA, KITCHEN_STYLES } from "@/data/kitchen-styles";
import { EASE } from "@/lib/motion";

/** Paper tint + pin colour per note, cycling down the board. */
const NOTES = [
  { paper: "#fffdf8", pin: "var(--coral)" },
  { paper: "#f5faff", pin: "var(--sky)" },
  { paper: "#fdf7ec", pin: "var(--signal)" },
  { paper: "#f6fbf7", pin: "var(--navy)" },
];

/** A photograph per stage — the board is pictures, not just paper. */
const PHOTOS = [
  KITCHEN_STYLES[0].hero,
  KITCHEN_STYLES[1].hero,
  KITCHEN_STYLES[2].hero,
  KITCHEN_STYLES[3].hero,
  // The panel itself, for the production step.
  XTEEL_FRAMES[5],
  KITCHEN_STYLES[4].hero,
  KITCHEN_STYLES[5].hero,
  HERO_MEDIA.poster,
];

/** Deterministic tilts — a pinned note is never square to the board. */
const TILT = [-1.7, 1.3, -1, 1.9, -1.4, 0.9, -2, 1.2];

/**
 * The loose part of the arrangement. Layout only puts the notes in two
 * columns; these nudge each one off its cell so the board reads as pinned by
 * hand rather than set on a grid. Transforms, so nothing reflows and the pins
 * the thread hangs from stay measurable.
 */
const DRIFT = [
  "md:translate-y-[0.5rem]",
  "md:translate-x-[4%] md:translate-y-[3.5rem]",
  "md:-translate-x-[3%] md:translate-y-[1.5rem]",
  "md:translate-x-[2%] md:translate-y-[5rem]",
  "md:translate-x-[5%] md:translate-y-[2.5rem]",
  "md:-translate-x-[4%] md:translate-y-[6rem]",
  "md:-translate-x-[2%] md:translate-y-[3.5rem]",
  "md:translate-x-[3%] md:translate-y-[7rem]",
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-80px" },
  transition: { duration: 0.8, ease: EASE, delay },
});

/**
 * The programme as an evidence board: eight photographs pinned to a light
 * corkboard, threaded together in order.
 *
 * The notes are never hidden — they are on the board from the first paint, and
 * the only thing that animates is the thread drawing itself between the pins
 * once, when the board first comes into view. The thread is a real SVG path
 * measured off the pin heads, so it stays attached at any width.
 */
export default function Journey() {
  const boardRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const measure = () => {
      const box = board.getBoundingClientRect();
      setPts(
        pinRefs.current.filter(Boolean).map((pin) => {
          const r = pin!.getBoundingClientRect();
          return {
            x: r.left - box.left + r.width / 2,
            y: r.top - box.top + r.height / 2,
          };
        }),
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(board);
    return () => ro.disconnect();
  }, []);

  // Each hop sags like slack thread rather than snapping taut.
  const thread =
    pts.length < 2
      ? ""
      : pts.slice(1).reduce((d, p, i) => {
          const a = pts[i];
          const sag = Math.max(20, Math.hypot(p.x - a.x, p.y - a.y) * 0.16);
          return `${d} Q ${(a.x + p.x) / 2} ${(a.y + p.y) / 2 + sag} ${p.x} ${p.y}`;
        }, `M ${pts[0].x} ${pts[0].y}`);

  return (
    <section
      id="journey"
      className="relative isolate overflow-hidden bg-cream py-[clamp(3.5rem,9vh,7.5rem)]"
    >
      {/* Cork grain — two offset dot fields, cheap and light. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(rgba(134,91,73,0.16) 1px, transparent 1px), radial-gradient(rgba(134,91,73,0.1) 1px, transparent 1px)",
          backgroundSize: "22px 22px, 22px 22px",
          backgroundPosition: "0 0, 11px 11px",
        }}
      />

      <div className="section-shell relative z-10">
        <motion.div {...fadeUp(0)}>
          <p className="text-[10px] font-medium tracking-[0.28em] text-brown uppercase">
            The 30-Day Programme
          </p>
          <h2 className="mt-8 max-w-[36ch] text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.2] font-medium tracking-[-0.03em] text-balance">
            Eight steps. Thirty days. No surprises.
          </h2>
          <p className="mt-4 max-w-[42ch] text-[14px] leading-[1.6] tracking-[-0.01em] text-muted">
            Every stage dated, priced and signed off before the next begins.
          </p>
        </motion.div>

        <div
          ref={boardRef}
          className="relative mt-[clamp(3rem,7vh,5.5rem)] pb-[clamp(2rem,8vh,7rem)]"
        >
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="journey-thread" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--coral)" />
                <stop offset="50%" stopColor="var(--sky)" />
                <stop offset="100%" stopColor="var(--signal)" />
              </linearGradient>
            </defs>
            {/* The slack thread is always there; the coloured one runs along it
                once, slowly, the first time the board is seen. */}
            <path
              d={thread}
              fill="none"
              stroke="rgba(134,91,73,0.22)"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <motion.path
              d={thread}
              fill="none"
              stroke="url(#journey-thread)"
              strokeWidth={1.75}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 2.6, ease: EASE }}
            />
          </svg>

          <ol className="relative z-10 grid gap-y-[clamp(2.75rem,6vh,4.5rem)] md:grid-cols-2 md:gap-x-[clamp(2rem,5vw,5rem)]">
            {JOURNEY.map((item, i) => {
              const note = NOTES[i % NOTES.length];
              const isLast = item.step === JOURNEY.length;
              return (
                <li
                  key={item.step}
                  className={`${DRIFT[i % DRIFT.length]} ${i % 2 ? "md:justify-self-end" : ""}`}
                >
                  <div
                    className="group relative max-w-[26rem] p-3 pt-8 shadow-[0_14px_34px_-18px_rgba(58,26,26,0.55)] transition-[rotate,translate] duration-700 ease-out hover:-translate-y-1.5 hover:rotate-0!"
                    style={{
                      background: note.paper,
                      // The `rotate` property, not `transform` — so the hover
                      // utility can straighten it and translate stays free.
                      rotate: `${TILT[i % TILT.length]}deg`,
                    }}
                  >
                    {/* Pin head. The thread ends underneath it. */}
                    <span
                      ref={(el) => {
                        pinRefs.current[i] = el;
                      }}
                      className="absolute -top-[9px] left-1/2 z-20 h-[18px] w-[18px] -translate-x-1/2 rounded-full shadow-[0_3px_5px_-1px_rgba(58,26,26,0.45)]"
                      style={{
                        background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9), ${note.pin} 62%)`,
                      }}
                    />

                    <div className="relative overflow-hidden bg-brown/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={PHOTOS[i % PHOTOS.length]}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        className="h-[clamp(9rem,22vw,12rem)] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                      />
                      <span
                        className="absolute top-3 left-3 px-2 py-1 text-[9px] font-medium tracking-[0.22em] text-white uppercase backdrop-blur-[2px]"
                        style={{ background: "rgba(12,12,11,0.42)" }}
                      >
                        {item.day}
                      </span>
                    </div>

                    <div className="px-3 pt-5 pb-4">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span
                          className="font-serif text-[22px] leading-none"
                          style={{ color: note.pin }}
                        >
                          {String(item.step).padStart(2, "0")}
                        </span>
                        <span className="rounded-full border border-brown/20 px-2.5 py-1 text-[9px] font-medium tracking-[0.2em] text-brown/70 uppercase">
                          {item.milestone}
                        </span>
                        {isLast && (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky">
                            <Check size={11} strokeWidth={2.5} className="text-ink" />
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.2] font-medium tracking-[-0.025em]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[13px] leading-[1.55] tracking-[-0.01em] text-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <motion.div {...fadeUp(0.1)} className="mt-14 flex items-center gap-3">
          <span className="h-px flex-1 bg-brown/20" />
          <span className="text-[10px] font-medium tracking-[0.28em] text-brown/60 uppercase">
            Day 0 → Day 30
          </span>
          <span className="h-px flex-1 bg-brown/20" />
        </motion.div>
      </div>
    </section>
  );
}
