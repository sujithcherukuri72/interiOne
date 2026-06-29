"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

// ── Shared ease curve ────────────────────────────────────────────────────────
const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

// ── Variants ─────────────────────────────────────────────────────────────────

const containerV = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const;

/** Clip-path curtain lift — the primary headline effect */
const slideUpV = {
  hidden: { y: "108%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.9, ease: EXPO_OUT },
  },
} as const;

/** Soft fade + lift for supporting copy */
const fadeV = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" },
  },
} as const;

// ── Static copy ───────────────────────────────────────────────────────────────

const HEADLINE = ["Bespoke", "Spaces,", "Crafted."] satisfies string[];

// ── Image block config ────────────────────────────────────────────────────────

type ImageBlock = {
  key: string;
  label: string;
  gradient: string;
  radius: string;
  gridClass: string;
  delay: number;
  initialY: number;
  initialScale: number;
};

const IMAGE_BLOCKS: ImageBlock[] = [
  {
    key: "sage",
    label: "Sage · Cavern",
    gradient: "from-[#c9d5c9] to-[#879d8a]",
    radius: "rounded-xl",
    gridClass: "",
    delay: 0.55,
    initialY: 48,
    initialScale: 0.94,
  },
  {
    key: "marble",
    label: "Stone · Marble",
    gradient: "from-[#e9e3dd] via-[#d6cec6] to-[#b8b0a8]",
    radius: "rounded-2xl",
    gridClass: "row-span-2",
    delay: 0.32,
    initialY: 72,
    initialScale: 0.91,
  },
  {
    key: "clay",
    label: "Clay · Warm",
    gradient: "from-[#d5bfa5] to-[#b89a7e]",
    radius: "rounded-xl",
    gridClass: "",
    delay: 0.7,
    initialY: 40,
    initialScale: 0.95,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function HeroSection() {
  const reduce = useReducedMotion();
  // Respect prefers-reduced-motion: fall back to a simple fade
  const lineVariant = reduce === true ? fadeV : slideUpV;

  return (
    <section
      aria-label="Hero"
      className="relative min-h-[calc(100svh-4rem)] flex items-center overflow-hidden"
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10 py-20 lg:py-0 grid grid-cols-1 lg:grid-cols-[1fr_1.12fr] gap-14 lg:gap-20 items-center">

        {/* ── LEFT: Typography column ── */}
        <motion.div
          variants={containerV}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-7 lg:max-w-[540px]"
        >
          {/* Eyebrow tag */}
          <motion.p
            variants={fadeV}
            className="text-[10px] font-medium tracking-[0.32em] uppercase text-foreground/40"
          >
            ◆&nbsp;&nbsp;Luxury Modular Kitchens
          </motion.p>

          {/* Headline — line-by-line curtain reveal */}
          <h1 aria-label={HEADLINE.join(" ")} className="flex flex-col gap-0">
            {HEADLINE.map((line) => (
              // overflow-hidden acts as the clip mask
              <span key={line} className="block overflow-hidden leading-[1.04]">
                <motion.span
                  variants={lineVariant}
                  className="block text-[clamp(3.2rem,6.5vw,6rem)] font-semibold tracking-[-0.02em]"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Sub-copy */}
          <motion.p
            variants={fadeV}
            className="text-[0.875rem] leading-[1.75] text-foreground/50 max-w-[38ch]"
          >
            From concept to craftsmanship — every surface, proportion, and
            material designed around how you actually live.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeV}
            className="flex flex-wrap items-center gap-4 pt-1"
          >
            <Link
              href="/collections"
              className="inline-flex items-center px-6 py-[11px] text-[11px] font-medium tracking-[0.18em] uppercase bg-foreground text-background rounded-full hover:opacity-75 transition-opacity duration-300"
            >
              Explore Work
            </Link>
            <Link
              href="/process"
              className="group inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] uppercase text-foreground/50 hover:text-foreground transition-colors duration-200"
            >
              Our Process
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={fadeV}
            className="hidden lg:flex items-center gap-3 pt-8 text-foreground/25"
          >
            <motion.span
              aria-hidden
              className="block h-10 w-px bg-foreground/25 origin-top"
              animate={{ scaleY: [0.25, 1, 0.25] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-[9px] tracking-[0.3em] uppercase">Scroll</span>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Staggered image grid ── */}
        <div className="relative h-[420px] sm:h-[520px] lg:h-[660px]">
          {/*
           * Asymmetric 3-block layout
           * col 1 (narrow): sage top, clay bottom
           * col 2 (wide):   marble spans full height
           */}
          <div className="absolute inset-0 grid grid-cols-[1fr_1.52fr] grid-rows-2 gap-3">
            {IMAGE_BLOCKS.map((block) => (
              <AnimatedImageBlock key={block.key} block={block} />
            ))}
          </div>

          {/* Floating stat card */}
          <motion.div
            aria-hidden
            className="absolute -bottom-3 left-4 lg:-left-5 z-10 flex flex-col gap-0.5 bg-background/90 backdrop-blur-lg border border-foreground/[0.06] rounded-2xl px-5 py-3.5 shadow-md"
            initial={{ opacity: 0, y: 24, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: EXPO_OUT, delay: 0.95 }}
          >
            <span className="text-[1.6rem] font-semibold tracking-tight leading-none">
              500+
            </span>
            <span className="text-[9px] font-medium tracking-[0.22em] uppercase text-foreground/35">
              Projects Delivered
            </span>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

// ── Image block sub-component ─────────────────────────────────────────────────

function AnimatedImageBlock({ block }: { block: ImageBlock }) {
  return (
    <motion.div
      className={[
        "relative w-full h-full overflow-hidden",
        `bg-gradient-to-br ${block.gradient}`,
        block.radius,
        block.gridClass,
      ]
        .filter(Boolean)
        .join(" ")}
      initial={{ y: block.initialY, opacity: 0, scale: block.initialScale }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 1.15, ease: EXPO_OUT, delay: block.delay }}
    >
      {/* Subtle grid-line texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: [
            "repeating-linear-gradient(0deg, transparent, transparent 23px, black 23px, black 24px)",
            "repeating-linear-gradient(90deg, transparent, transparent 23px, black 23px, black 24px)",
          ].join(", "),
        }}
      />

      {/* Gradient vignette — bottom fade */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/15 to-transparent"
      />

      {/* Label chip */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end p-3.5 select-none">
        <span className="text-[9px] font-medium tracking-[0.22em] uppercase bg-black/12 backdrop-blur-sm text-black/55 px-2.5 py-1 rounded-full">
          {block.label}
        </span>
      </div>
    </motion.div>
  );
}
