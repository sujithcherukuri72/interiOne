"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ModulaLockup from "@/components/ui/ModulaMark";
import { EPITOME_FILM, TESTIMONIALS, type Testimonial } from "@/data/testimonials";
import { EASE } from "@/lib/motion";

/**
 * The hairline gold the supplied template is drawn in. Section-local: it is
 * the identity's foil, not a fifth accent, and nothing outside this block
 * should be reaching for it.
 */
const GOLD = "#b78a3c";

/** Only the filmed stories go on the stage; the rest run in the lane below. */
const FILMED = TESTIMONIALS.filter((t) => t.film);

/** The peeled corner from the template — the card is cut, the flap laid over. */
const FOLD = "3.75rem";
const CUT = `polygon(0 0, 100% 0, 100% calc(100% - ${FOLD}), calc(100% - ${FOLD}) 100%, 0 100%)`;

/**
 * The stories, set as a plate rather than a widget: one filmed account at a
 * time on a cut-corner card, the quote pinned beside it on paper, and a gold
 * hairline arcing between the two so they read as one object. Underneath, the
 * written quotes keep drifting past in two lanes.
 */
export default function Testimonials() {
  const [i, setI] = useState(0);
  const active = FILMED[i];
  const go = (d: number) => setI((n) => (n + d + FILMED.length) % FILMED.length);

  const half = Math.ceil(TESTIMONIALS.length / 2);
  const lanes = [TESTIMONIALS.slice(0, half), TESTIMONIALS.slice(half)];

  return (
    <section
      id="testimonials"
      className="relative isolate overflow-hidden bg-background py-[clamp(3.5rem,9vh,7.5rem)]"
    >
      {/* A single warm wash off the top-left, so the cream is lit rather than
          flat behind the plate. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 10% 0%, rgba(183,138,60,0.10), transparent 60%)",
        }}
      />

      <div className="section-shell">
        {/* -------------------------------------------------------------- */}
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <h2 className="text-[clamp(1.5rem,3.4vw,2.6rem)] leading-none font-medium tracking-[0.24em] uppercase">
              Testimonials
            </h2>
            {/* Two rules of unequal length — the template's signature. */}
            <span
              className="mt-4 block h-px w-[min(18rem,60vw)]"
              style={{ background: GOLD, opacity: 0.55 }}
            />
            <span
              className="mt-[3px] block h-px w-[min(9rem,32vw)]"
              style={{ background: GOLD }}
            />
          </div>

          <ModulaLockup className="text-[13px]" />
        </div>

        {/* Dots, centred over the plate. --------------------------------- */}
        <div className="mt-[clamp(2rem,5vh,3.5rem)] flex justify-center gap-3">
          {FILMED.map((t, n) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Story ${n + 1}: ${t.name}`}
              aria-current={n === i}
              className="focus-ring h-2.5 w-2.5 rounded-full border transition-colors duration-500"
              style={{
                borderColor: GOLD,
                background: n === i ? GOLD : "transparent",
              }}
            />
          ))}
        </div>

        {/* The plate. ---------------------------------------------------- */}
        <div className="relative mt-[clamp(1.75rem,4vh,3rem)] grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-4">
          {/* The hairline that ties the card to the note. Non-scaling stroke,
              so stretching the box never thickens the line. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
          >
            <motion.path
              d="M 46 34 C 56 -2, 88 4, 92 44"
              fill="none"
              stroke={GOLD}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.75 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1.8, ease: EASE }}
            />
          </svg>

          {/* Film card ---------------------------------------------------- */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.figure
                key={active.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="relative aspect-[4/5] w-full overflow-hidden bg-ink sm:aspect-[5/4]"
                style={{ clipPath: CUT }}
              >
                <video
                  // Keyed with the figure, so switching stories mounts a fresh
                  // element and it starts from the top on its own.
                  src={active.film}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Enough ink to hold the gold rules and the caption. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(10,20,16,0.72) 0%, rgba(10,20,16,0.25) 45%, rgba(10,20,16,0.82) 100%)",
                  }}
                />

                {/* Crosshair label, top left. */}
                <figcaption className="absolute top-7 left-7 flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-1 block h-5 w-5"
                    style={{
                      background: `linear-gradient(${GOLD},${GOLD}) center/100% 1px no-repeat, linear-gradient(${GOLD},${GOLD}) center/1px 100% no-repeat`,
                    }}
                  />
                  <span
                    className="text-[10px] leading-[1.9] font-medium tracking-[0.3em] uppercase"
                    style={{ color: GOLD }}
                  >
                    Client
                    <br />
                    Stories
                  </span>
                </figcaption>

                {/* Vertical rule, dropping into the dotted tail. */}
                <span
                  aria-hidden="true"
                  className="absolute top-[9.5rem] left-[2.3rem] hidden h-[6rem] w-px sm:block"
                  style={{ background: GOLD, opacity: 0.7 }}
                />

                <div className="absolute right-7 bottom-7 left-7 flex items-end gap-5">
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border"
                    style={{ borderColor: GOLD }}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={GOLD} strokeWidth={1.2}>
                      <circle cx="12" cy="8.5" r="3.4" />
                      <path d="M5 19.5c1.4-3.2 4-4.8 7-4.8s5.6 1.6 7 4.8" />
                    </svg>
                  </span>

                  <span aria-hidden="true" className="h-11 w-px" style={{ background: GOLD, opacity: 0.5 }} />

                  <div className="min-w-0">
                    <p className="truncate text-[14px] tracking-[-0.01em] text-white">
                      {active.name}
                    </p>
                    <p
                      className="mt-1 font-mono text-[10px] tracking-[0.18em] uppercase"
                      style={{ color: GOLD }}
                    >
                      {active.detail} · {active.layout}
                    </p>
                  </div>
                </div>
              </motion.figure>
            </AnimatePresence>

            {/* The flap the cut leaves behind. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-0"
              style={{
                width: FOLD,
                height: FOLD,
                clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                background: "linear-gradient(135deg, var(--tan), var(--cream))",
                boxShadow: "-6px -6px 14px -8px rgba(0,0,0,0.5)",
              }}
            />
          </div>

          {/* Quote note + the studio film -------------------------------- */}
          <div className="flex flex-col items-center gap-6 md:items-end">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active.id}
                initial={{ opacity: 0, y: 18, rotate: -3 }}
                animate={{ opacity: 1, y: 0, rotate: -1.4 }}
                exit={{ opacity: 0, y: -14, rotate: 1 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="w-[min(22rem,86vw)] rounded-[10px] bg-cream px-7 py-8 shadow-[0_18px_40px_-22px_rgba(58,26,26,0.6)]"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke={GOLD} strokeWidth={1.1} aria-hidden="true">
                  <path d="M12 3.5 13.6 10.4 20.5 12 13.6 13.6 12 20.5 10.4 13.6 3.5 12 10.4 10.4Z" />
                </svg>

                <p className="mt-5 text-[15px] leading-[1.65] tracking-[-0.01em] text-foreground/85">
                  {active.quote}
                </p>

                <span className="mt-6 block h-px w-24" style={{ background: GOLD, opacity: 0.7 }} />
                <p
                  className="mt-4 text-[10px] font-medium tracking-[0.28em] uppercase"
                  style={{ color: GOLD }}
                >
                  Spaces designed, trust earned.
                </p>
              </motion.blockquote>
            </AnimatePresence>

            <figure className="w-[min(22rem,86vw)]">
              <div className="relative aspect-video overflow-hidden rounded-[10px] bg-ink">
                <video
                  src={EPITOME_FILM}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption
                className="mt-3 text-center font-mono text-[10px] tracking-[0.2em] uppercase md:text-right"
                style={{ color: GOLD }}
              >
                Epitome · the studio film
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Controls ------------------------------------------------------ */}
        <div className="mt-[clamp(2.5rem,6vh,4rem)] flex items-center gap-5">
          <Circle label="Previous story" onClick={() => go(-1)} d="M14 5 7 12l7 7" />

          <div className="relative h-px flex-1" style={{ background: `${GOLD}55` }}>
            <motion.span
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45"
              style={{ background: GOLD }}
              animate={{ left: `${((i + 0.5) / FILMED.length) * 100}%` }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          </div>

          <Circle label="Next story" onClick={() => go(1)} d="M10 5l7 7-7 7" />
        </div>
      </div>

      {/* The written stories, still drifting. ---------------------------- */}
      <div className="mt-[clamp(3rem,8vh,5rem)] flex flex-col gap-5">
        {lanes.map((lane, n) => (
          <div key={n} className="marquee group relative">
            <div
              className="marquee-track flex w-max gap-5"
              style={{
                animationDuration: `${58 + n * 14}s`,
                animationDirection: n % 2 ? "reverse" : "normal",
              }}
            >
              {[...lane, ...lane].map((item, j) => (
                <Card key={`${item.id}-${j}`} item={item} duplicate={j >= lane.length} />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 w-[12vw] bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[12vw] bg-gradient-to-l from-background to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
}

/** The gold hairline circle the template puts its arrows in. */
function Circle({ label, onClick, d }: { label: string; onClick: () => void; d: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="focus-ring group grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-500"
      style={{ borderColor: `${GOLD}80` }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 transition-transform duration-500 group-hover:scale-110"
        fill="none"
        stroke={GOLD}
        strokeWidth={1.4}
        aria-hidden="true"
      >
        <path d={d} />
      </svg>
    </button>
  );
}

function Card({ item, duplicate }: { item: Testimonial; duplicate: boolean }) {
  return (
    <figure
      // The second copy exists only to close the loop — it must not be read
      // out twice.
      aria-hidden={duplicate || undefined}
      className="flex w-[min(82vw,26rem)] shrink-0 flex-col justify-between gap-6 border border-brown/15 bg-cream/70 p-6 transition-colors duration-500 hover:border-brown/35 sm:gap-8 sm:p-8"
    >
      <blockquote className="text-[15.5px] leading-[1.6] tracking-[-0.01em] text-foreground/80">
        {item.quote}
      </blockquote>

      <figcaption className="flex items-end justify-between gap-4 border-t border-brown/15 pt-5">
        <div>
          <p className="text-[14px] tracking-[-0.01em] text-foreground">{item.name}</p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
            {item.detail}
          </p>
        </div>
        <p
          className="font-mono text-[10px] tracking-[0.16em] whitespace-nowrap uppercase"
          style={{ color: GOLD }}
        >
          {item.layout}
        </p>
      </figcaption>
    </figure>
  );
}
