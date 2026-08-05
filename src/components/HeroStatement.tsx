"use client";

import { useRef } from "react";
import { MotionValue, motion, useScroll, useTransform } from "framer-motion";

/* ─── scroll-animation text ──────────────────────────────────────────────── */

const FULL_TEXT =
  "We stopped building kitchens out of wood. Steel does not swell, does not burn, and does not feed termites.";

const TEXT_WORDS = FULL_TEXT.split(" ");
const N = TEXT_WORDS.length;

// Five fully-opaque RGB stops — no alpha so Framer Motion interpolates
// cleanly without any transparency dip mid-transition.
// Single-spaced on purpose: Motion's colour parser rejects the padded form
// ("rgb( 17,  17,  16)") and drops the tween, so these must not be aligned.
const C0 = "rgb(201, 196, 184)"; // warm gray
const C1 = "rgb(230, 150, 140)"; // blending toward coral
const C2 = "rgb(255, 100, 110)"; // coral premixed with background
const C3 = "rgb(120, 55, 60)"; // dark ember
const C4 = "rgb(26, 26, 26)"; // foreground

const STAGGER = 0.85 / (N - 1);
const WINDOW  = 2.2 * STAGGER;
const FRAC    = [0, 0.18, 0.42, 0.68, 1.0];

function ScrollWord({
  word,
  index,
  isLast,
  progress,
}: {
  word: string;
  index: number;
  isLast: boolean;
  progress: MotionValue<number>;
}) {
  const s = index * STAGGER;
  const color = useTransform(
    progress,
    FRAC.map((f) => Math.min(1, s + f * WINDOW)),
    [C0, C1, C2, C3, C4]
  );
  return (
    <motion.span style={{ color }}>
      {isLast ? word : word + " "}
    </motion.span>
  );
}

/* ─── component ──────────────────────────────────────────────────────────── */

export default function HeroStatement() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["center end", "center start"],
  });

  const progress = useTransform(scrollYProgress, [0.15, 0.50], [0, 1], {
    clamp: true,
  });

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 sm:px-8"
    >
      <span className="absolute top-8 left-5 text-[11px] tracking-[-0.01em] text-muted uppercase sm:left-8">
        Modula
      </span>
      <span className="absolute top-8 right-5 text-[11px] tracking-[-0.01em] text-muted uppercase sm:right-8">
        A JSW Enterprise
      </span>

      <p className="relative z-20 mx-auto max-w-[64rem] text-center text-[clamp(2.4rem,4.4vw,4.8rem)] leading-[1.15] font-bold tracking-[-0.035em]">
        {TEXT_WORDS.map((word, i) => (
          <ScrollWord
            key={i}
            word={word}
            index={i}
            isLast={i === N - 1}
            progress={progress}
          />
        ))}
      </p>
    </div>
  );
}
