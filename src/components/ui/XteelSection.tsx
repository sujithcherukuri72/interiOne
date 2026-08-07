"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

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
    <div ref={ref} className="relative h-[220vh] md:h-[280vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center gap-8 overflow-hidden px-5 sm:px-8 md:h-screen md:gap-0 md:px-0">
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

            <linearGradient id="xteel-skin" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#26262a" />
              <stop offset="55%" stopColor="#3d3d42" />
              <stop offset="100%" stopColor="#1c1c1f" />
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
          <motion.rect
            style={{ y: topSkinY }}
            x={PANEL_X}
            y={coreTop - SKIN_H}
            width={PANEL_W}
            height={SKIN_H}
            fill="url(#xteel-skin)"
          />
          <motion.rect
            style={{ y: bottomSkinY }}
            x={PANEL_X}
            y={coreBottom}
            width={PANEL_W}
            height={SKIN_H}
            fill="url(#xteel-skin)"
          />

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
          <Dimension open={open} />
        </svg>

        {/* The same three callouts, re-laid as a register for narrow screens.
            Driven off the same `open` value, so a label still cannot arrive
            before the layer it names has finished travelling. */}
        {compact && (
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
  const start = 0.45 + index * 0.12;
  const opacity = useTransform(open, [start, start + 0.28], [0, 1], {
    clamp: true,
  });
  const x = useTransform(open, [start, start + 0.28], [-12, 0], { clamp: true });

  const [material, gauge] = row.spec.split("·").map((s) => s.trim());

  return (
    <motion.li
      style={{ opacity, x }}
      className="flex items-baseline gap-4 border-b border-foreground/15 py-3.5"
    >
      <span className="font-mono text-[10px] tracking-[0.18em] text-foreground/35 tabular-nums">
        {row.step}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium tracking-[-0.02em]">
          {row.title}
        </span>
        <span className="mt-1 block font-mono text-[9.5px] tracking-[0.16em] uppercase">
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
function Dimension({ open }: { open: MotionValue<number> }) {
  const opacity = useTransform(open, [0.72, 0.95], [0, 1], { clamp: true });
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
