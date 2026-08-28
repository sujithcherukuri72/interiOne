    "use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { USE_XTEEL_RENDER, XTEEL_FRAMES } from "@/data/assets";
import { XTEEL_LAYERS } from "@/data/technology";
import { COMPACT_QUERY, useMediaQuery } from "@/lib/use-media-query";

/* The drawing is authored at this size and scaled by the viewBox. The width
   is set by the widest callout, not by the panel — the labels are part of the
   drawing, so they get reserved space rather than hanging off the edge. */
const W = 1120;
const H = 460;

/* Panel geometry, in drawing units. The skins are deliberately drawn thicker
   than 0.5mm-to-scale — at true scale they vanish into a hairline. */
const PANEL_X = 128;
const PANEL_W = 420;
const SKIN_H = 22;
const CORE_H = 96;
const MID_Y = H / 2;

/** The callout column. Nothing else is allowed to travel into it. */
const LEAD_X = 622;
const LEAD_W = 68;
const TEXT_X = LEAD_X + LEAD_W + 18;

/** How far each layer travels away from the closed panel, fully exploded. */
const SKIN_TRAVEL = 118;
/* Short on purpose: the caps must stop well clear of the callout column. */
const CAP_TRAVEL = 38;
const CAP_W = 10;

/* On a phone the callout column cannot come with the drawing — scaled to
   375px, 21px type in a 1120-unit viewBox lands at seven real pixels. So the
   narrow layout crops the viewBox to the panel alone, which then fills the
   width at a readable size, and the callouts are re-laid as HTML underneath. */
const COMPACT_VIEWBOX = "24 0 600 460";

type Row = {
  /** Vertical centre of the label's leader line, exploded. */
  y: number;
  step: string;
  title: string;
  spec: string;
  accent?: boolean;
};

/**
 * The Xteel shutter, drawn edge-on and pulled apart by scroll.
 *
 * This replaces the stock photograph that used to sit here: the panel build-up
 * *is* the argument for the product, so it earns a drawing rather than a
 * picture of something else. Nothing here is an image request — it is all
 * vector, so it stays sharp and costs nothing to load.
 */
export default function XteelSection() {
  const ref = useRef<HTMLDivElement>(null);
  const compact = useMediaQuery(COMPACT_QUERY);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // The panel opens over the first half of the scroll, then holds open while
  // the labels resolve — so the reader gets a still frame to actually read.
  const open = useTransform(scrollYProgress, [0.08, 0.62], [0, 1], {
    clamp: true,
  });

  /* The render's own choreography: the panel pulls apart over the first half
     of the scroll, holds open while the callouts resolve, then closes again on
     the way out. Frame 0100 — index 5 — is the fully exploded one, so the hold
     sits on it. Unused in the drawn fallback, but the hooks run either way — a
     branch that skips a hook is a different component as far as React is
     concerned.

     The spring is the difference between this reading as an animation and as a
     slideshow. A wheel notch on a desktop and a flick on a phone both deliver
     scroll in coarse jumps, which lands the raw progress two frames further on
     with nothing in between; the spring turns each jump into a short glide, so
     the dissolve below always has intermediate values to work with. */
  const scrub = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.35,
    restDelta: 0.0005,
  });
  const frame = useTransform(
    scrub,
    [0.05, 0.52, 0.78, 1],
    [0, 5, 5, XTEEL_FRAMES.length - 1],
    { clamp: true }
  );
  /* ponytail: the between-frames motion blur was removed — it read as the
     panel going soft on every scroll rather than as shutter time. The spring
     on `scrub` above is what keeps the dissolve smooth; that is enough. */

  const topSkinY = useTransform(open, [0, 1], [0, -SKIN_TRAVEL]);
  const bottomSkinY = useTransform(open, [0, 1], [0, SKIN_TRAVEL]);
  const capX = useTransform(open, [0, 1], [0, CAP_TRAVEL]);
  const capXNeg = useTransform(open, [0, 1], [0, -CAP_TRAVEL]);

  const coreTop = MID_Y - CORE_H / 2;
  const coreBottom = MID_Y + CORE_H / 2;

  const rows: Row[] = [
    {
      y: coreTop - SKIN_H / 2 - SKIN_TRAVEL,
      step: XTEEL_LAYERS[0].step,
      title: XTEEL_LAYERS[0].title,
      spec: XTEEL_LAYERS[0].spec,
    },
    {
      y: MID_Y,
      step: XTEEL_LAYERS[1].step,
      title: XTEEL_LAYERS[1].title,
      spec: XTEEL_LAYERS[1].spec,
    },
    {
      y: coreBottom + SKIN_H / 2 + SKIN_TRAVEL,
      step: XTEEL_LAYERS[2].step,
      title: XTEEL_LAYERS[2].title,
      spec: XTEEL_LAYERS[2].spec,
      accent: true,
    },
  ];

  return (
    <div ref={ref} className="relative h-[122vh] md:h-[138vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center gap-[clamp(1rem,3vh,2rem)] overflow-hidden px-5 sm:px-8 md:h-screen md:gap-0 md:px-0">
        {USE_XTEEL_RENDER ? (
          /* The real thing. The drawing below was always a stand-in for this:
             a render shows the honeycomb core and the actual metal, which no
             amount of vector hatching does. It arrives, settles, and holds
             while the callouts resolve beside it. */
          <div className="grid w-full max-w-[72rem] items-center gap-[clamp(1.25rem,3vh,2rem)] md:grid-cols-12 md:gap-10">
            {/* Solid from the first paint. It used to fade up out of the
                section, which meant the panel — the whole point of the band —
                was a blank space until the scroll had already started. */}
            <div
              className="relative mx-auto h-[40svh] w-full md:col-span-7 md:h-[70svh]"
              role="img"
              aria-label="Exploded view of an Xteel shutter: white pre-painted steel skins over a steel-composite honeycomb core, sealed on every edge."
            >
              {XTEEL_FRAMES.map((src, i) => (
                <Frame key={src} src={src} index={i} frame={frame} />
              ))}
            </div>

            <div className="w-full md:col-span-5">
              <PanelWordmark />

              <ul className="mt-[clamp(1rem,2.5vh,1.75rem)] w-full border-t border-foreground/15">
                {rows.map((row, i) => (
                  <CompactCallout key={row.step} row={row} open={open} index={i} />
                ))}
              </ul>
            </div>
          </div>
        ) : (
        <svg
          viewBox={compact ? COMPACT_VIEWBOX : `0 0 ${W} ${H}`}
          className="w-full max-w-[68rem] shrink-0"
          role="img"
          aria-label="Exploded cross-section of an Xteel shutter: pre-painted steel skins over a steel-composite core, sealed on every edge."
        >
          <defs>
            {/* Rolled-steel striation for the core. */}
            <pattern
              id="xteel-grain"
              width="7"
              height="7"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(90)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="7"
                stroke="var(--muted)"
                strokeWidth="1"
                opacity="0.5"
              />
            </pattern>

            <linearGradient id="xteel-core" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#b9b3a6" />
              <stop offset="42%" stopColor="#dcd6ca" />
              <stop offset="100%" stopColor="#a8a293" />
            </linearGradient>

            {/* Cream, the colour the panels actually ship in. Sitting on the
                cream section they need the shading and the hairline below to
                read as solid metal rather than as a hole in the page. */}
            <linearGradient id="xteel-skin" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#efe7da" />
              <stop offset="45%" stopColor="var(--cream)" />
              <stop offset="100%" stopColor="#e5dccc" />
            </linearGradient>
          </defs>

          {/* Datum line — the drawing's horizon, always visible. */}
          <line
            x1="40"
            y1={MID_Y}
            x2={W - 40}
            y2={MID_Y}
            stroke="var(--line)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />

          {/* ── Core ─────────────────────────────────────────────────────── */}
          <g>
            <rect
              x={PANEL_X}
              y={coreTop}
              width={PANEL_W}
              height={CORE_H}
              fill="url(#xteel-core)"
            />
            <rect
              x={PANEL_X}
              y={coreTop}
              width={PANEL_W}
              height={CORE_H}
              fill="url(#xteel-grain)"
            />
            <rect
              x={PANEL_X}
              y={coreTop}
              width={PANEL_W}
              height={CORE_H}
              fill="none"
              stroke="var(--foreground)"
              strokeWidth="1"
              opacity="0.35"
            />
          </g>

          {/* ── Skins ────────────────────────────────────────────────────── */}
          <motion.g style={{ y: topSkinY }}>
            <rect
              x={PANEL_X}
              y={coreTop - SKIN_H}
              width={PANEL_W}
              height={SKIN_H}
              fill="url(#xteel-skin)"
            />
            <rect
              x={PANEL_X}
              y={coreTop - SKIN_H}
              width={PANEL_W}
              height={SKIN_H}
              fill="none"
              stroke="var(--foreground)"
              strokeWidth="1"
              opacity="0.35"
            />
          </motion.g>
          <motion.g style={{ y: bottomSkinY }}>
            <rect
              x={PANEL_X}
              y={coreBottom}
              width={PANEL_W}
              height={SKIN_H}
              fill="url(#xteel-skin)"
            />
            <rect
              x={PANEL_X}
              y={coreBottom}
              width={PANEL_W}
              height={SKIN_H}
              fill="none"
              stroke="var(--foreground)"
              strokeWidth="1"
              opacity="0.35"
            />
          </motion.g>

          {/* ── Sealed edges — the accent, because it is the closed system ── */}
          <motion.rect
            style={{ x: capXNeg }}
            x={PANEL_X - CAP_W}
            y={coreTop - SKIN_H}
            width={CAP_W}
            height={CORE_H + SKIN_H * 2}
            fill="var(--coral)"
          />
          <motion.rect
            style={{ x: capX }}
            x={PANEL_X + PANEL_W}
            y={coreTop - SKIN_H}
            width={CAP_W}
            height={CORE_H + SKIN_H * 2}
            fill="var(--coral)"
          />

          {/* ── Callouts ─────────────────────────────────────────────────── */}
          {!compact &&
            rows.map((row, i) => (
              <Callout key={row.step} row={row} open={open} index={i} />
            ))}

          {/* Overall thickness dimension, drawn on the left. */}
          <Dimension progress={scrollYProgress} />
        </svg>
        )}

        {/* The same three callouts, re-laid as a register for narrow screens.
            Driven off the same `open` value, so a label still cannot arrive
            before the layer it names has finished travelling. */}
        {compact && !USE_XTEEL_RENDER && (
          <ul className="w-full max-w-[34rem] border-t border-foreground/15 md:hidden">
            {rows.map((row, i) => (
              <CompactCallout key={row.step} row={row} open={open} index={i} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/**
 * One frame of the render, cross-dissolved with its neighbour.
 *
 * Eleven frames over a screen and a half of scroll is not enough to cut
 * between — hard switching reads as a slideshow — so consecutive frames are
 * blended. The blend is a *stack*, not a pair of triangles: every frame at or
 * behind the playhead sits at full opacity, and only the next one fades in
 * over the top of it.
 *
 * The triangle version this replaces put two frames at half opacity at the
 * midpoint, and since the renders carry alpha, half of each is exactly what
 * you saw — two translucent panels in different positions, the section
 * showing through both. That is the tearing: it is not dropped frames, it is
 * the dissolve itself. Fading one opaque frame over another never dips below
 * a solid panel.
 *
 * Every frame is in the DOM at once and eagerly fetched, at the same URLs the
 * preloader warms, so no frame is still arriving when the scroll reaches it.
 */
function Frame({
  src,
  index,
  frame,
}: {
  src: string;
  index: number;
  frame: MotionValue<number>;
}) {
  // Two frames on screen, never more: the one the playhead is on, at full
  // opacity, and the next one fading in over it. Leaving the earlier frames
  // switched on underneath is what fanned every past position of the panel
  // out behind the current one.
  const opacity = useTransform(frame, (v) => {
    const base = Math.floor(v);
    if (index === base) return 1;
    if (index === base + 1) return v - base;
    return 0;
  });

  return (
    <motion.div
      style={{ opacity }}
      // Promoted up front: compositing eleven stacked layers per frame is the
      // one thing here that will drop frames on a mid-range phone.
      className="absolute inset-0 will-change-[opacity]"
    >
      {/* Deliberately not `next/image`: these are 10–75KB webp files already,
          and the optimiser would serve them from `/_next/image?url=…` — a
          different URL from the one the preloader fetched, so every frame
          would be downloaded twice and arrive late. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="eager"
        decoding="async"
        fetchPriority={index === 0 || index === 5 ? "high" : "low"}
        className="absolute inset-0 h-full w-full object-contain"
      />
    </motion.div>
  );
}

/**
 * The panel's name, set the way Modula sets it on their own sheet: a small
 * serif italic article, the name in heavy uppercase with its middle pair
 * dropped to the brown, and "panel" trailing off the end in italic again.
 */
function PanelWordmark() {
  return (
    <p className="leading-none">
      <span className="block pl-1 font-serif text-[clamp(1.1rem,1.6vw,1.5rem)] text-muted italic">
        the
      </span>

      <span className="mt-1 block text-[clamp(2.4rem,4.6vw,4rem)] font-bold tracking-[-0.02em] text-foreground uppercase">
        XT<span className="text-brown">EE</span>L
      </span>

      <span className="-mt-2 block text-right font-serif text-[clamp(1.3rem,2vw,1.9rem)] text-brown italic">
        panel
      </span>
    </p>
  );
}

/** One callout as a table row, for the layout that has no room for leaders. */
function CompactCallout({
  row,
  open,
  index,
}: {
  row: Row;
  open: MotionValue<number>;
  index: number;
}) {
  // Readable from the outset — the layer names are the content of this band,
  // not a reward for scrolling. Only the small slide is left.
  const start = 0.45 + index * 0.12;
  const x = useTransform(open, [start, start + 0.28], [-12, 0], { clamp: true });

  const [material, gauge] = row.spec.split("·").map((s) => s.trim());

  return (
    <motion.li
      style={{ x }}
      className="flex items-baseline gap-[clamp(0.75rem,1.5vw,1rem)] border-b border-foreground/15 py-[clamp(0.6rem,1.3vh,0.875rem)]"
    >
      <span className="font-mono text-[clamp(9px,0.7vw,10px)] tracking-[0.18em] text-foreground/35 tabular-nums">
        {row.step}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[clamp(0.875rem,1.05vw,1rem)] font-medium tracking-[-0.02em]">
          {row.title}
        </span>
        <span className="mt-1 block font-mono text-[clamp(8.5px,0.68vw,9.5px)] tracking-[0.16em] uppercase">
          <span className="text-foreground/45">{material}</span>
          <span className="text-muted"> · </span>
          {/* The gauge is the number people repeat back — it takes the accent. */}
          <span className="text-coral">{gauge}</span>
        </span>
      </span>
    </motion.li>
  );
}

/**
 * One label: a leader line that grows out of the layer, then the text. Both
 * are driven off the same `open` value, so nothing can arrive early.
 */
function Callout({
  row,
  open,
  index,
}: {
  row: Row;
  open: MotionValue<number>;
  index: number;
}) {
  const start = 0.45 + index * 0.12;
  const scaleX = useTransform(open, [start, start + 0.3], [0, 1], {
    clamp: true,
  });
  const opacity = useTransform(open, [start + 0.12, start + 0.36], [0, 1], {
    clamp: true,
  });

  // "PPGI · 0.5mm" → the material, then the number that carries the claim.
  const [material, gauge] = row.spec.split("·").map((s) => s.trim());

  return (
    <g>
      <motion.line
        style={{ scaleX, transformOrigin: `${LEAD_X}px ${row.y}px` }}
        x1={LEAD_X}
        y1={row.y}
        x2={LEAD_X + LEAD_W}
        y2={row.y}
        stroke={row.accent ? "var(--coral)" : "var(--foreground)"}
        strokeWidth="1"
        opacity="0.55"
      />
      <motion.g style={{ opacity }}>
        <text
          x={TEXT_X}
          y={row.y - 20}
          className="fill-foreground/35 font-mono"
          fontSize="11"
          letterSpacing="2.4"
        >
          {row.step}
        </text>

        {/* The layer name is the headline of its own callout. */}
        <text
          x={TEXT_X}
          y={row.y + 3}
          className="fill-foreground"
          fontSize="21"
          fontWeight="500"
          letterSpacing="-0.5"
        >
          {row.title}
        </text>

        <text x={TEXT_X} y={row.y + 26} fontSize="11" letterSpacing="1.8">
          <tspan className="fill-foreground/45 font-mono">
            {material.toUpperCase()}
          </tspan>
          <tspan className="fill-muted font-mono"> · </tspan>
          {/* The gauge is the number people repeat back — it gets the accent. */}
          <tspan className="fill-coral font-mono" fontWeight="500">
            {gauge?.toUpperCase()}
          </tspan>
        </text>
      </motion.g>
    </g>
  );
}

/** The 20mm overall dimension, drawn the way a shop drawing would. */
function Dimension({ progress }: { progress: MotionValue<number> }) {
  // In once the panel is open, out again when the burner needs the space.
  const opacity = useTransform(
    progress,
    [0.46, 0.56, 0.64, 0.7],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const x = 84;
  const top = MID_Y - CORE_H / 2 - SKIN_H - SKIN_TRAVEL;
  const bottom = MID_Y + CORE_H / 2 + SKIN_H + SKIN_TRAVEL;

  return (
    <motion.g style={{ opacity }}>
      <line x1={x} y1={top} x2={x} y2={bottom} stroke="var(--muted)" strokeWidth="1" />
      <line x1={x - 6} y1={top} x2={x + 6} y2={top} stroke="var(--muted)" strokeWidth="1" />
      <line
        x1={x - 6}
        y1={bottom}
        x2={x + 6}
        y2={bottom}
        stroke="var(--muted)"
        strokeWidth="1"
      />
      <text
        x={x - 14}
        y={MID_Y + 4}
        textAnchor="end"
        className="fill-muted font-mono"
        fontSize="11"
        letterSpacing="1.6"
      >
        20MM
      </text>
    </motion.g>
  );
}
