"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import type { Finish } from "@/data/finishes";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { darken, lighten, readableOn, tonalRamp } from "@/lib/color";
import Swatch from "./Swatch";

/**
 * A finish, shown as a material rather than as a colour chip.
 *
 * Three readings of the same two hex values, which is all a finish carries:
 * the plate is the colour at full size, the drawn shutter is the colour as a
 * cabinet face with a handle and a lit edge, and the ladder is the colour under
 * five lighting conditions — because the question people actually ask is not
 * "what colour is it" but "what will it look like in the corner by the window".
 *
 * Entrances are driven by `animate`, not `whileInView`. This panel lives inside
 * a fixed, nested scroller, and a reveal that fails to fire there leaves the
 * colour invisible — which is exactly the failure this replaced.
 */
export default function ColourStudy({
  finish,
  flipped,
  scroller,
}: {
  finish: Finish;
  flipped: boolean;
  scroller: React.RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ramp = tonalRamp(finish.hex);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: scroller,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [38, -38]);
  const drift = useSpring(raw, { stiffness: 80, damping: 24, restDelta: 0.5 });

  const ink = readableOn(finish.hex);

  return (
    <div ref={ref} className="relative">
      {/* ── The plate ────────────────────────────────────────────────── */}
      <motion.figure
        initial={{ opacity: 0, clipPath: "inset(14% 0% 0% 0%)" }}
        animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1.1, ease: EASE }}
        style={{ backgroundColor: finish.hex }}
        className="relative h-[min(52vh,27rem)] overflow-hidden rounded-xl shadow-[var(--shadow-card)]"
      >
        {/* Oversized and drifting, so the plate reads as a surface passing
            behind a window rather than as a rectangle of paint. */}
        <motion.div style={{ y: drift }} className="absolute inset-x-0 -top-[18%] -bottom-[18%]">
          <Swatch hex={finish.hex} grain={finish.grain} className="h-full w-full" />
        </motion.div>

        {/* A raking highlight — the single thing that stops a flat fill from
            looking like a swatch in a PDF. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(118deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 38%, rgba(0,0,0,0.16) 100%)`,
          }}
        />

        <span
          style={{ color: ink }}
          className="absolute top-5 right-5 font-mono text-[11px] tracking-[0.28em] uppercase opacity-70 [writing-mode:vertical-rl]"
        >
          {finish.hex}
        </span>

        <span
          style={{ color: ink }}
          className="absolute bottom-5 left-6 font-mono text-[10px] tracking-[0.24em] uppercase opacity-70"
        >
          {finish.code} · {finish.sheen}
        </span>

        {/* ── The shutter ────────────────────────────────────────────── */}
        {/* Inside the plate, not overlapping it from outside: hung off the
            study's own box it landed on the ladder below. On its own card so
            the drawn door reads against the colour field it is cut from. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          className={cn(
            "absolute right-5 bottom-5 w-[46%] max-w-[13rem] rounded-xl p-3 shadow-[var(--shadow-card)] backdrop-blur-sm",
            flipped ? "bg-ink/85" : "bg-background/85"
          )}
        >
          <ShutterFace hex={finish.hex} grain={finish.grain} />
          <p
            className={cn(
              "mt-2.5 px-1 font-mono text-[9px] tracking-[0.2em] uppercase",
              flipped ? "text-white/45" : "text-foreground/45"
            )}
          >
            As a shutter face
          </p>
        </motion.div>
      </motion.figure>

      {/* ── The ladder ───────────────────────────────────────────────── */}
      <motion.dl
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
        className="mt-5 grid grid-cols-5 gap-1.5"
      >
        {ramp.map((tone) => (
          <div key={tone.label} className="flex flex-col gap-2">
            <dd
              style={{ backgroundColor: tone.value }}
              className={cn(
                "h-11 rounded-md",
                // The true colour is the one being specified; the other four
                // are context, and they are set back a step to say so.
                tone.label === "True"
                  ? flipped
                    ? "ring-1 ring-white/50"
                    : "ring-1 ring-foreground/25"
                  : "opacity-80"
              )}
            />
            <dt
              className={cn(
                "font-mono text-[8.5px] tracking-[0.16em] uppercase",
                flipped ? "text-white/40" : "text-foreground/40"
              )}
            >
              {tone.label}
            </dt>
          </div>
        ))}
      </motion.dl>
    </div>
  );
}

/**
 * A cabinet door, drawn. Two faces of the same colour meeting at a shadow
 * line, a routed edge and a rail handle — enough for the eye to read depth,
 * which a flat rectangle never gives it.
 */
function ShutterFace({ hex, grain }: { hex: string; grain: string }) {
  return (
    <svg viewBox="0 0 240 150" className="w-full rounded-lg" aria-hidden="true">
      <defs>
        <linearGradient id={`face-${hex.slice(1)}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={lighten(hex, 0.12)} />
          <stop offset="55%" stopColor={hex} />
          <stop offset="100%" stopColor={darken(hex, 0.12)} />
        </linearGradient>
        <pattern
          id={`grain-${grain.slice(1)}`}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(90)"
        >
          <line x1="0" y1="0" x2="0" y2="6" stroke={grain} strokeWidth="1" opacity="0.18" />
        </pattern>
      </defs>

      {/* Drawer above, door below — the two things every run is made of. */}
      <g>
        <rect x="0" y="0" width="240" height="46" rx="3" fill={`url(#face-${hex.slice(1)})`} />
        <rect x="0" y="0" width="240" height="46" rx="3" fill={`url(#grain-${grain.slice(1)})`} />
        <rect x="88" y="20" width="64" height="4" rx="2" fill={darken(hex, 0.42)} opacity="0.75" />
      </g>

      <rect x="0" y="46" width="240" height="4" fill={darken(hex, 0.5)} opacity="0.35" />

      <g>
        <rect x="0" y="50" width="240" height="100" rx="3" fill={`url(#face-${hex.slice(1)})`} />
        <rect x="0" y="50" width="240" height="100" rx="3" fill={`url(#grain-${grain.slice(1)})`} />
        <rect x="88" y="70" width="64" height="4" rx="2" fill={darken(hex, 0.42)} opacity="0.75" />
      </g>

      {/* The lit top edge. */}
      <rect x="0" y="0" width="240" height="1.5" fill={lighten(hex, 0.45)} opacity="0.8" />
    </svg>
  );
}
