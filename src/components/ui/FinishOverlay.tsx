"use client";

import { AnimatePresence, motion } from "framer-motion";

import { BRAND } from "@/data/brand";
import type { Finish } from "@/data/finishes";
import { EASE, EASE_UI } from "@/lib/motion";
import CloseButton from "./CloseButton";
import Swatch from "./Swatch";

/**
 * The finish detail page — the last layer of the stack, opened from the
 * arrow on a listing band and sitting above it at z-80.
 *
 * It always lands on cream, whatever the ground of the band underneath was:
 * arriving at a detail page should feel like a reset, not a continuation of
 * the alternating rhythm.
 */
export default function FinishOverlay({
  finish,
  onClose,
}: {
  finish: Finish | null;
  onClose: () => void;
}) {
  const gallery = finish
    ? [
        { hex: finish.grain, grain: finish.hex, label: "Grain macro" },
        { hex: finish.hex, grain: finish.hex, label: "Flat panel" },
        { hex: finish.hex, grain: finish.grain, label: "Edge detail" },
      ]
    : [];

  return (
    <AnimatePresence>
      {finish && (
        <motion.div
          key={finish.slug}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", transition: { duration: 0.5, ease: EASE_UI } }}
          transition={{ duration: 0.7, ease: EASE }}
          className="fixed inset-0 z-[80]"
          role="dialog"
          aria-modal="true"
          aria-label={`${finish.name} details`}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30">
            <div className="section-shell flex h-[72px] items-center justify-end">
              <div className="pointer-events-auto -mr-4">
                <CloseButton onClick={onClose} label={`Close ${finish.name}`} />
              </div>
            </div>
          </div>

          <div
            data-lenis-prevent
            className="h-full overflow-y-auto overscroll-contain bg-background [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Hero — the close button sits over this, so it stays white. */}
            <div className="relative h-[62vh] min-h-[380px] w-full overflow-hidden bg-line">
              <motion.div
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.6, ease: EASE, delay: 0.15 }}
                className="absolute inset-0"
              >
                <Swatch
                  hex={finish.hex}
                  grain={finish.grain}
                  sheen={finish.sheen}
                  code={finish.code}
                  className="h-full w-full"
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
                  {finish.rangeLabel} — {finish.type}
                </p>
                <h2 className="mt-3 text-[clamp(2.25rem,6.5vw,5rem)] leading-[0.95] font-medium tracking-[-0.04em] text-white">
                  {finish.name}
                </h2>
              </motion.div>
            </div>

            <div className="section-shell pt-[clamp(2.5rem,7vh,5rem)] pb-[clamp(3.5rem,9vh,7.5rem)]">
              <div className="grid gap-y-14 md:grid-cols-12 md:gap-x-10">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
                  className="md:col-span-7"
                >
                  <p className="text-[clamp(1.35rem,2.4vw,2.1rem)] leading-[1.25] font-medium tracking-[-0.03em] text-balance">
                    {finish.tagline}
                  </p>
                  <p className="mt-8 max-w-[52ch] text-[clamp(0.95rem,1.15vw,1.1rem)] leading-[1.65] tracking-[-0.01em] text-foreground/70">
                    {finish.description}
                  </p>
                </motion.div>

                <motion.dl
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
                  className="grid grid-cols-2 gap-x-8 gap-y-8 self-start md:col-span-4 md:col-start-9"
                >
                  {finish.stats.map((stat) => (
                    <div key={stat.label} className="border-t border-line pt-4">
                      <dt className="text-[10px] font-medium tracking-[0.28em] text-foreground/45 uppercase">
                        {stat.label}
                      </dt>
                      <dd className="mt-2 text-[clamp(1.05rem,1.5vw,1.4rem)] leading-tight font-medium tracking-[-0.025em]">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </motion.dl>
              </div>

              {/* Suited placements */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.65 }}
                className="mt-[clamp(2.75rem,7vh,6rem)] grid gap-y-8 md:grid-cols-12 md:gap-x-10"
              >
                <p className="text-[10px] font-medium tracking-[0.28em] text-foreground/45 uppercase md:col-span-3">
                  Suited for
                </p>
                <ul className="grid grid-cols-2 gap-x-8 gap-y-4 md:col-span-8 md:col-start-5 lg:grid-cols-3">
                  {finish.suited.map((item) => (
                    <li
                      key={item}
                      className="border-t border-line pt-3 text-[14px] tracking-[-0.01em] text-foreground/75"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Gallery — swatch details rather than photographs, until
                  studio shoots exist. */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.75 }}
                className="mt-[clamp(2.75rem,7vh,6rem)] grid gap-5 sm:grid-cols-2"
              >
                {gallery.map((tile, i) => (
                  <figure
                    key={tile.label}
                    className={`relative w-full overflow-hidden bg-line ${
                      i === 0 ? "aspect-[4/5] sm:row-span-2" : "aspect-[4/3]"
                    }`}
                  >
                    <Swatch
                      hex={tile.hex}
                      grain={tile.grain}
                      sheen={i === 0 ? finish.sheen : undefined}
                      className="h-full w-full"
                    />
                  </figure>
                ))}
              </motion.div>

              {/* Enquiry */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.85 }}
                className="mt-[clamp(2.75rem,7vh,6rem)] border-t border-line pt-10"
              >
                <p className="text-[clamp(1.15rem,2vw,1.75rem)] leading-[1.25] font-medium tracking-[-0.03em]">
                  Enquire about {finish.name}
                </p>
                <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[14px] text-foreground/60">
                  <a
                    href={BRAND.phoneHref}
                    className="focus-ring rounded transition-colors duration-300 hover:text-foreground"
                  >
                    {BRAND.phone}
                  </a>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="focus-ring rounded transition-colors duration-300 hover:text-foreground"
                  >
                    {BRAND.email}
                  </a>
                  <a
                    href={BRAND.instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring rounded transition-colors duration-300 hover:text-foreground"
                  >
                    {BRAND.instagram}
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
