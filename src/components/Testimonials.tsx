"use client";

import { motion } from "framer-motion";

import { EASE } from "@/lib/motion";
import { TESTIMONIALS, type Testimonial } from "@/data/testimonials";

/**
 * Two lanes drifting in opposite directions.
 *
 * The list is rendered twice per lane and the track translates by exactly
 * -50%, so the loop closes on itself with no jump and no JavaScript ticking
 * every frame. Hovering either lane parks it, because a quote you cannot
 * finish reading is worse than no quote.
 */
export default function Testimonials() {
  const half = Math.ceil(TESTIMONIALS.length / 2);
  const lanes = [TESTIMONIALS.slice(0, half), TESTIMONIALS.slice(half)];

  return (
    <section id="testimonials" className="overflow-hidden bg-ink py-[clamp(3.5rem,9vh,7.5rem)] text-white">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="font-mono text-[11px] tracking-[0.28em] text-white/40 uppercase">
              Owners
            </p>
            <h2 className="mt-6 max-w-[18ch] text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
              Kitchens that have already been lived in
            </h2>
          </div>

          <p className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
            Hover to pause
          </p>
        </motion.div>
      </div>

      <div className="mt-14 flex flex-col gap-5">
        {lanes.map((lane, i) => (
          <div key={i} className="marquee group relative">
            {/* The lanes bleed off both edges â€” the drift should feel like a
                slice of something longer, not a widget with ends. */}
            <div
              className="marquee-track flex w-max gap-5"
              style={{
                animationDuration: `${58 + i * 14}s`,
                animationDirection: i % 2 ? "reverse" : "normal",
              }}
            >
              {[...lane, ...lane].map((item, j) => (
                <Card key={`${item.id}-${j}`} item={item} duplicate={j >= lane.length} />
              ))}
            </div>

            {/* Feathered ends, so cards enter and leave rather than pop. */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-[12vw] bg-gradient-to-r from-ink to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[12vw] bg-gradient-to-l from-ink to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
}

function Card({ item, duplicate }: { item: Testimonial; duplicate: boolean }) {
  return (
    <figure
      // The second copy exists only to close the loop â€” it must not be read
      // out twice.
      aria-hidden={duplicate || undefined}
      className="flex w-[min(82vw,26rem)] shrink-0 flex-col justify-between gap-6 border border-white/12 bg-white/[0.03] p-6 transition-colors duration-500 hover:border-white/25 sm:gap-8 sm:p-8"
    >
      <blockquote className="text-[15.5px] leading-[1.6] tracking-[-0.01em] text-white/80">
        {item.quote}
      </blockquote>

      <figcaption className="flex items-end justify-between gap-4 border-t border-white/10 pt-5">
        <div>
          <p className="text-[14px] tracking-[-0.01em] text-white">{item.name}</p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-white/40 uppercase">
            {item.detail}
          </p>
        </div>
        <p className="font-mono text-[10px] tracking-[0.16em] whitespace-nowrap text-coral uppercase">
          {item.layout}
        </p>
      </figcaption>
    </figure>
  );
}
