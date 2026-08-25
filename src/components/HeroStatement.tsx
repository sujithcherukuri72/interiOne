"use client";

import { useRef } from "react";
import Image from "next/image";
import { MotionValue, motion, useScroll, useTransform } from "framer-motion";

import { ASSETS, MODULA_CORNER_SIZE } from "@/data/assets";
import { JswEnterprise, ModulaLogo } from "./ui/ModulaMark";

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
      // svh, not vh: on iOS Safari `100vh` is the *expanded* viewport, so with
      // the URL bar showing the statement is pushed a bar's height out of
      // frame and the last line reads as cut off.
      // The statement wants a screen to itself, but on a phone a full one
      // plus 12vh of padding left a third of it empty above and below the
      // sentence. It keeps the screen on larger viewports only.
      className="relative flex min-h-[72svh] items-center justify-center overflow-hidden px-5 py-[clamp(3rem,8vh,7rem)] sm:min-h-[100svh] sm:px-8"
    >
      {/* The two corner credits, now set as the marks themselves. Both sit on
          the same optical line: the logo's height and the caption's cap-height
          are both driven off `text-[11px]`, so they align without nudging. */}
      <ModulaLogo className="absolute top-8 left-5 text-[17px] sm:left-8 sm:text-[24px]" />
      <JswEnterprise className="absolute top-8 right-5 text-[10px] tracking-[0.06em] text-muted uppercase sm:right-8 sm:text-[11px]" />

      {/* The block is only here to give the corner mark something to hang off:
          it is pinned to the *sentence's* top-right corner, not the section's,
          so it stays with the type instead of drifting out to the margin on a
          wide screen — and stays clear of the JSW credit up in the real one. */}
      <div className="relative z-20 mx-auto w-full max-w-[64rem]">
        <CornerMark progress={progress} />

        {/* The lower bound was 2.4rem, which set this 107-character sentence in
            twelve lines on a 360px phone and overran the screen. */}
        <p className="relative z-10 text-center text-[clamp(1.65rem,4.4vw,4.8rem)] leading-[1.15] font-bold tracking-[-0.035em]">
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
    </div>
  );
}

/**
 * The Modula device, hung off the sentence's top-right corner.
 *
 * It rides the same progress value as the type: while the words are still warm
 * grey the mark is turned and faint, and it swings level and settles as the
 * sentence resolves to ink — so it reads as part of the statement landing
 * rather than as a sticker parked in the corner. Purely decorative, hence
 * `aria-hidden`; the brand is already named in the credit top-left.
 */
function CornerMark({ progress }: { progress: MotionValue<number> }) {
  const rotate = useTransform(progress, [0, 1], [-22, 0]);
  const scale = useTransform(progress, [0, 1], [0.84, 1]);
  const opacity = useTransform(progress, [0, 0.55, 1], [0, 0.7, 1]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ rotate, scale, opacity }}
      /* `bottom-full` parks it wholly above the sentence's first line and
         right-aligned to its right edge, so it can carry the mark's full brown
         without fighting the type — the earlier version overlapped the text and
         had to be faded to a grey smudge to stay legible. */
      className="pointer-events-none absolute right-0 bottom-full mb-[clamp(0.9rem,2.4vw,2.25rem)] w-[clamp(3.25rem,6.5vw,6rem)] origin-bottom-right select-none"
    >
      <Image
        src={ASSETS.brand.modulaCorner}
        alt=""
        width={MODULA_CORNER_SIZE.width}
        height={MODULA_CORNER_SIZE.height}
        sizes="160px"
        className="h-auto w-full"
      />
    </motion.div>
  );
}
