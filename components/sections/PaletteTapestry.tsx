"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useState } from "react";
import { FINISH_RANGES } from "@/lib/palette-data";
import type { Finish, FinishRange } from "@/types/palette";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

/* ── Finish category badge colours ── */
const FINISH_BADGE: Record<string, string> = {
  "Solid Matte":  "bg-foreground/10 text-foreground/60",
  Metallic:       "bg-gold/15 text-gold-deep",
  Wood:           "bg-tuscan-oak/20 text-abyss-edge",
  Gloss:          "bg-river-raft/15 text-river-raft",
  Concrete:       "bg-pour-line/30 text-foreground/50",
};

/* ── Single finish card ── */
function FinishCard({ finish }: { finish: Finish }) {
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.52, ease: EXPO_OUT }}
      className="relative overflow-hidden rounded-xl aspect-[3/4] cursor-pointer group select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Swatch face */}
      <div
        className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]"
        style={{ backgroundColor: finish.hex }}
      />

      {/* Finish category chip — always visible */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className={`text-[9px] font-medium tracking-[0.18em] uppercase px-2 py-1 rounded-full backdrop-blur-sm ${FINISH_BADGE[finish.finish] ?? "bg-foreground/10 text-foreground/60"}`}
        >
          {finish.finish}
        </span>
      </div>

      {/* Slide-up overlay — edge-band reveal */}
      <AnimatePresence>
        {hovered && !reduce && (
          <motion.div
            key="overlay"
            className="absolute inset-x-0 bottom-0 z-20 p-4"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.38, ease: EXPO_OUT }}
          >
            {/* Frosted backing */}
            <div
              className="rounded-lg p-3 backdrop-blur-md border border-white/20"
              style={{ backgroundColor: `${finish.hex}cc` }}
            >
              <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-foreground/50 mb-1">
                Edge Band Pair
              </p>
              <div className="flex items-center gap-2">
                {/* Edge swatch dot */}
                <span
                  className="h-5 w-5 rounded-full border-2 border-white/30 flex-shrink-0"
                  style={{ backgroundColor: finish.edgeBand.hex }}
                />
                <div>
                  <p className="text-[11px] font-semibold leading-tight">
                    {finish.edgeBand.name}
                  </p>
                  <p className="text-[9px] text-foreground/50 tracking-wide">
                    {finish.edgeBand.finish} edge
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name overlay at bottom — shown when not hovered */}
      <AnimatePresence initial={false}>
        {!hovered && (
          <motion.div
            key="name"
            className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/30 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-[11px] font-medium text-white/90 leading-tight">
              {finish.name}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Range tab button ── */
function RangeTab({
  range,
  active,
  onClick,
}: {
  range: FinishRange;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative px-5 py-2 text-sm font-medium tracking-[0.12em] uppercase transition-colors duration-200",
        active ? "text-foreground" : "text-foreground/40 hover:text-foreground/70",
      ].join(" ")}
    >
      {range.label}
      {active && (
        <motion.span
          layoutId="tab-underline"
          className="absolute bottom-0 inset-x-5 h-px bg-gold"
          transition={{ duration: 0.35, ease: EXPO_OUT }}
        />
      )}
    </button>
  );
}

/* ── Section ── */
export function PaletteTapestry() {
  const [activeId, setActiveId] = useState<string>(FINISH_RANGES[0]?.id ?? "signature");

  const activeRange = FINISH_RANGES.find((r) => r.id === activeId) ?? FINISH_RANGES[0];

  return (
    <section className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-medium tracking-[0.28em] uppercase text-gold mb-3">
          Material Library
        </p>
        <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.08] mb-4">
          Palette Tapestry
        </h2>
        <p className="text-foreground/50 max-w-md text-sm leading-relaxed">
          Every finish is precision-engineered — hover a swatch to reveal its
          factory-matched edge-band pairing.
        </p>
      </div>

      {/* Range tabs */}
      <LayoutGroup>
        <div className="flex items-end gap-1 border-b border-foreground/10 mb-10">
          {FINISH_RANGES.map((range) => (
            <RangeTab
              key={range.id}
              range={range}
              active={activeId === range.id}
              onClick={() => setActiveId(range.id)}
            />
          ))}
        </div>

        {/* Range description crossfade */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeId + "-desc"}
            className="text-sm text-foreground/40 tracking-wide mb-8 h-5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
          >
            {activeRange?.description}
          </motion.p>
        </AnimatePresence>

        {/* Finish grid — layout-animated crossfade between ranges */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4"
          >
            {activeRange?.finishes.map((finish) => (
              <FinishCard key={finish.id} finish={finish} />
            ))}
          </motion.div>
        </AnimatePresence>
      </LayoutGroup>
    </section>
  );
}
