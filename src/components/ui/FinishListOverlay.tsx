"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { Finish, RangeId } from "@/data/finishes";
import { cn } from "@/lib/cn";
import { EASE, EASE_UI } from "@/lib/motion";
import ArrowButton from "./ArrowButton";
import CloseButton from "./CloseButton";
import ColourStudy from "./ColourStudy";

/**
 * The listing takeover: one finish per screen, stacked.
 *
 * Two things alternate with the index and stay locked together — the ground
 * (cream, ink, cream, ink) and the side the numeral sits on (left, right,
 * left). The swatch cluster always takes the opposite side, so the eye
 * zig-zags down the list instead of tracking a single column.
 */

function Rise({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Band({
  finish,
  index,
  onSelect,
  scroller,
}: {
  finish: Finish;
  index: number;
  onSelect: (finish: Finish) => void;
  scroller: React.RefObject<HTMLDivElement | null>;
}) {
  const flipped = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");

  return (
    <section
      className={cn(
        "relative",
        flipped ? "bg-ink text-white" : "bg-background text-foreground",
      )}
    >
      <div className="section-shell flex min-h-[100dvh] items-center py-24">
        <div className="grid w-full items-center gap-y-14 lg:grid-cols-12 lg:gap-x-10">
          <div
            className={cn(
              "lg:row-start-1",
              flipped ? "lg:col-span-5 lg:col-start-8" : "lg:col-span-5 lg:col-start-1",
            )}
          >
            <Rise>
              <span
                className={cn(
                  "block text-[clamp(3.25rem,8vw,7rem)] leading-[0.78] font-medium tracking-[-0.05em] tabular-nums",
                  flipped ? "text-white/45" : "text-foreground/45",
                )}
              >
                {number}
              </span>
            </Rise>

            <Rise delay={0.07}>
              <hr
                className={cn(
                  "mt-7 w-14 border-0 border-t",
                  flipped ? "border-white/25" : "border-foreground/20",
                )}
              />
            </Rise>

            <Rise delay={0.12}>
              <h3 className="mt-7 text-[clamp(1.9rem,3.5vw,3.25rem)] leading-[1.02] font-medium tracking-[-0.035em]">
                {finish.name}
              </h3>
            </Rise>

            <Rise delay={0.18}>
              <p
                className={cn(
                  "mt-3 text-[11px] font-medium tracking-[0.28em] uppercase",
                  flipped ? "text-white/45" : "text-foreground/45",
                )}
              >
                {finish.rangeLabel} — {finish.type}
              </p>
            </Rise>

            <Rise delay={0.24}>
              <p
                className={cn(
                  "mt-7 max-w-[40ch] text-[clamp(0.95rem,1.15vw,1.1rem)] leading-[1.6] tracking-[-0.01em] text-balance",
                  flipped ? "text-white/65" : "text-foreground/70",
                )}
              >
                {finish.summary}
              </p>
            </Rise>

            <Rise delay={0.32} className="mt-10">
              <ArrowButton
                label={`View ${finish.name}`}
                caption="View finish"
                onClick={() => onSelect(finish)}
              />
            </Rise>
          </div>

          <div
            className={cn(
              "lg:row-start-1",
              flipped ? "lg:col-span-6 lg:col-start-1" : "lg:col-span-6 lg:col-start-7",
            )}
          >
            <ColourStudy finish={finish} flipped={flipped} scroller={scroller} />

            {/* The colour, stated rather than only shown — two chips and
                their hex, the way a spec sheet lists them. */}
            <Rise delay={0.4}>
              <dl
                className={cn(
                  "mt-10 flex flex-wrap items-center gap-x-10 gap-y-5 border-t pt-5",
                  flipped ? "border-white/20" : "border-foreground/15",
                )}
              >
                {[
                  { label: "Body", value: finish.hex },
                  { label: "Grain", value: finish.grain },
                ].map((chip) => (
                  <div key={chip.label} className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      style={{ backgroundColor: chip.value }}
                      className={cn(
                        "h-7 w-7 rounded-full",
                        flipped ? "ring-1 ring-white/25" : "ring-1 ring-foreground/15",
                      )}
                    />
                    <div>
                      <dt
                        className={cn(
                          "font-mono text-[9.5px] tracking-[0.2em] uppercase",
                          flipped ? "text-white/45" : "text-foreground/45",
                        )}
                      >
                        {chip.label}
                      </dt>
                      <dd className="font-mono text-[12px] tracking-[0.08em] uppercase">
                        {chip.value}
                      </dd>
                    </div>
                  </div>
                ))}

                <div>
                  <dt
                    className={cn(
                      "font-mono text-[9.5px] tracking-[0.2em] uppercase",
                      flipped ? "text-white/45" : "text-foreground/45",
                    )}
                  >
                    Sheen
                  </dt>
                  <dd className="font-mono text-[12px] tracking-[0.08em] uppercase">
                    {finish.sheen}
                  </dd>
                </div>

                <div>
                  <dt
                    className={cn(
                      "font-mono text-[9.5px] tracking-[0.2em] uppercase",
                      flipped ? "text-white/45" : "text-foreground/45",
                    )}
                  >
                    Code
                  </dt>
                  <dd className="font-mono text-[12px] tracking-[0.08em] uppercase">
                    {finish.code}
                  </dd>
                </div>
              </dl>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function FinishListOverlay({
  range,
  label,
  items,
  onSelect,
  onClose,
}: {
  range: RangeId | null;
  label: string;
  items: Finish[];
  onSelect: (finish: Finish) => void;
  onClose: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {range && (
        <motion.div
          key={range}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", transition: { duration: 0.55, ease: EASE_UI } }}
          transition={{ duration: 0.75, ease: EASE }}
          className="fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label={`${label} listing`}
        >
          <div
            style={{ mixBlendMode: "difference" }}
            className="pointer-events-none absolute inset-x-0 top-0 z-30"
          >
            <div className="section-shell flex h-[72px] items-center justify-between">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}
                className="text-[11px] font-medium tracking-[0.28em] text-white uppercase"
              >
                {label} — {String(items.length).padStart(2, "0")}
              </motion.span>

              <div className="pointer-events-auto -mr-4">
                <CloseButton onClick={onClose} label={`Close ${label}`} />
              </div>
            </div>
          </div>

          <div
            ref={scroller}
            data-lenis-prevent
            className="relative h-full overflow-y-auto overscroll-contain bg-background [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((finish, i) => (
              <Band
                key={finish.slug}
                finish={finish}
                index={i}
                onSelect={onSelect}
                scroller={scroller}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
