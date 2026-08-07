"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Check } from "lucide-react";

import { JOURNEY } from "@/data/journey";
import { EASE } from "@/lib/motion";

const ACCENTS = ["var(--coral)", "var(--sky)", "var(--signal)"];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-80px" },
  transition: { duration: 0.8, ease: EASE, delay },
});

/**
 * A dated manifest, not a progress-bar-with-circles carousel. Every step is
 * on the page at once, in one scannable column, with a rail down the left
 * that fills in as you scroll past it.
 */
export default function Journey() {
  const railRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.8", "end 0.6"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <section id="journey" className="bg-ink py-[clamp(3.5rem,9vh,7.5rem)] text-white">
      <div className="section-shell">
        <motion.div {...fadeUp(0)}>
          <p className="text-[10px] font-medium tracking-[0.28em] text-white/45 uppercase">
            The 30-Day Programme
          </p>
          <h2 className="mt-8 max-w-[36ch] text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.2] font-medium tracking-[-0.03em] text-balance">
            Eight steps. Thirty days. No surprises.
          </h2>
          <p className="mt-4 max-w-[42ch] text-[14px] leading-[1.6] tracking-[-0.01em] text-white/55">
            Every stage dated, priced and signed off before the next begins.
          </p>
        </motion.div>

        <div ref={railRef} className="relative mt-[clamp(2.25rem,5.5vh,4.5rem)]">
          <div className="pointer-events-none absolute top-0 bottom-0 left-5 w-px bg-white/10 md:left-[27px]" />
          <motion.div
            className="pointer-events-none absolute top-0 left-5 w-px origin-top md:left-[27px]"
            style={{
              scaleY: fill,
              height: "100%",
              background: `linear-gradient(180deg, ${ACCENTS[0]}, ${ACCENTS[1]}, ${ACCENTS[2]})`,
            }}
          />

          {JOURNEY.map((item, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            const isLast = item.step === JOURNEY.length;
            return (
              <motion.div key={item.step} {...fadeUp((i % 4) * 0.05)}>
                <div className="group relative flex gap-6 border-b border-white/[0.06] py-7 last:border-0 md:gap-10 md:py-8">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center bg-ink text-[13px] tabular-nums text-white/35 transition-colors duration-500 group-hover:text-white md:h-[54px] md:w-[54px] md:text-[15px]">
                    {String(item.step).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1 pt-1 md:pt-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className="text-[10px] font-medium tracking-[0.28em] uppercase"
                        style={{ color: accent }}
                      >
                        {item.day}
                      </span>
                      <span className="rounded-full border border-white/15 px-2.5 py-1 text-[9px] font-medium tracking-[0.2em] text-white/45 uppercase">
                        {item.milestone}
                      </span>
                      {isLast && (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky">
                          <Check size={11} strokeWidth={2.5} className="text-ink" />
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-[clamp(1.3rem,2vw,1.7rem)] leading-[1.2] font-medium tracking-[-0.025em]">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-[13.5px] leading-[1.55] tracking-[-0.01em] text-white/55">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div {...fadeUp(0.1)} className="mt-10 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] font-medium tracking-[0.28em] text-white/35 uppercase">
            Day 0 → Day 30
          </span>
        </motion.div>
      </div>
    </section>
  );
}
