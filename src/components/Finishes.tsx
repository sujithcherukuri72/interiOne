"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { byRange, ranges, type Finish, type Range, type RangeId } from "@/data/finishes";
import { EASE } from "@/lib/motion";
import { SHUFFLE_HOVER_PRESET, SHUFFLE_PRESET } from "@/lib/shuffle";
import FinishListOverlay from "./ui/FinishListOverlay";
import Shuffle from "./ui/Shuffle";
import FinishOverlay from "./ui/FinishOverlay";

/**
 * The finishes entry point. The section shows nothing but the three ranges —
 * no swatch names, no colour chips. Each is a full-bleed band that opens the
 * listing takeover, and the listing in turn opens a finish detail page, so
 * the catalogue is three layers deep and each one is a whole screen.
 */

function RangeBand({
  range,
  count,
  index,
  onOpen,
}: {
  range: Range;
  count: number;
  index: number;
  onOpen: (range: RangeId) => void;
}) {
  return (
    <motion.button
      type="button"
      id={range.id}
      onClick={() => onOpen(range.range)}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.9, ease: EASE, delay: index * 0.08 }}
      aria-label={`Browse ${range.label}`}
      /* Modula's card, at band scale: 12px corners, a 2px rim that only shows
         on approach, and their offset drop shadow. The `card-modula` scale is
         deliberately not used here — a 92dvh panel growing 3% is a lurch, so
         the movement is given to the photograph instead. */
      className="group focus-ring relative block h-[62vh] w-full overflow-hidden rounded-xl border-2 border-transparent text-left shadow-[var(--shadow-card)] transition-colors duration-500 hover:border-brown md:h-[92dvh]"
    >
      <Image
        src={range.image}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 34vw"
        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
      />
      {/* Modula's deep brown rather than a neutral ink — it warms the
          placeholder photography and keeps the two properties in one family. */}
      <div className="absolute inset-0 bg-brown-deep/65 transition-colors duration-700 group-hover:bg-brown-deep/55" />

      <div className="relative flex h-full flex-col justify-between px-5 py-10 sm:px-8 sm:py-12">
        {/* Their pill tag, carrying the count. */}
        <p className="w-fit rounded-full bg-white/12 px-3 py-1.5 text-[10px] font-medium tracking-[0.22em] text-white/75 uppercase backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")} —{" "}
          {String(count).padStart(2, "0")} finishes
        </p>

        <div>
          <Shuffle
            {...SHUFFLE_PRESET}
            tag="h3"
            text={range.label}
            textAlign="left"
            className="text-[clamp(2rem,4.4vw,4.25rem)] leading-[0.9] font-bold tracking-[-0.045em] text-white uppercase"
          />

          <p className="mt-6 max-w-[38ch] text-[clamp(0.9rem,1.05vw,1rem)] leading-[1.6] tracking-[-0.01em] text-white/65 text-balance">
            {range.blurb}
          </p>

          <span
            aria-hidden="true"
            className="mt-9 inline-flex items-center gap-3 text-[11px] font-medium tracking-[0.28em] text-white/55 uppercase transition-colors duration-300 group-hover:text-white"
          >
            <Shuffle
              {...SHUFFLE_HOVER_PRESET}
              tag="span"
              text="Browse"
              textAlign="left"
            />
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-x-1"
            >
              <path
                d="M4 12h15M12.5 5.5 19 12l-6.5 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export default function Finishes() {
  const [openRange, setOpenRange] = useState<RangeId | null>(null);
  const [openFinish, setOpenFinish] = useState<Finish | null>(null);

  const listItems = useMemo(
    () => (openRange ? byRange(openRange) : []),
    [openRange],
  );
  const listLabel = ranges.find((r) => r.range === openRange)?.label ?? "";

  // Either takeover covers the page; whatever is behind it should not scroll.
  useEffect(() => {
    const locked = openRange !== null || openFinish !== null;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openRange, openFinish]);

  // Escape peels one layer at a time rather than dismissing the whole stack.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openFinish) setOpenFinish(null);
      else if (openRange) setOpenRange(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openRange, openFinish]);

  return (
    <section id="finishes" className="bg-background pt-[clamp(3.5rem,9vh,7.5rem)] pb-[clamp(3.5rem,9vh,7.5rem)]">
      <div className="section-shell">
        <p className="text-[10px] font-medium tracking-[0.28em] text-foreground/45 uppercase">
          Finishes
        </p>
        <h2 className="mt-8 max-w-[34ch] text-[clamp(1rem,1.35vw,1.35rem)] leading-[1.5] font-normal tracking-[-0.015em] text-balance">
          Three ranges, one Xteel core underneath. Choose the one you are
          looking for and the whole catalogue opens.
        </h2>
      </div>

      <div className="section-shell mt-[clamp(2.25rem,5.5vh,4.5rem)] grid gap-4 sm:gap-6 md:grid-cols-3">
        {ranges.map((range, i) => (
          <RangeBand
            key={range.range}
            range={range}
            count={byRange(range.range).length}
            index={i}
            onOpen={setOpenRange}
          />
        ))}
      </div>

      <FinishListOverlay
        range={openRange}
        label={listLabel}
        items={listItems}
        onSelect={setOpenFinish}
        onClose={() => setOpenRange(null)}
      />

      <FinishOverlay finish={openFinish} onClose={() => setOpenFinish(null)} />
    </section>
  );
}
