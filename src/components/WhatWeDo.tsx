"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { BRAND } from "@/data/brand";
import { EASE } from "@/lib/motion";
import { BOOK_VISIT_LINK } from "@/lib/whatsapp";
import TypeReveal from "./ui/TypeReveal";

/** The whole business in three verbs — what a stranger needs before any spec. */
/* `image`: one kitchen told three times — drawn, as its panel, finished.
   Regenerate with `node scripts/build-what-we-do.js`. */
const STEPS = [
  {
    verb: "Design",
    line: "A designer visits your home, measures every wall and hands you three layouts — rendered and costed, free.",
    image: "/assets/what-we-do/design.webp",
    caption: "Drawn to your walls",
  },
  {
    verb: "Build",
    line: "Every cabinet is made from JSW Xteel® steel composite by Modula. No plywood, no MDF, anywhere.",
    image: "/assets/what-we-do/build.webp",
    caption: "Cut from steel composite",
  },
  {
    verb: "Install",
    line: "One crew fits the finished kitchen in your home on Day 30. You cook in it that evening.",
    image: "/assets/what-we-do/install.webp",
    caption: "Fitted on Day 30",
  },
];

const CYCLE_MS = 3200;

/** What it is *not* made of — each word gets struck through as the tag lands. */
const NOT_MADE_OF = ["Plywood", "MDF", "Sawdust"];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-80px" },
  transition: { duration: 0.8, ease: EASE, delay },
});

/**
 * The plain-English answer to "what do these people sell?".
 *
 * The hero and the statement above it make the argument; this is the section a
 * visitor who skipped both can read in ten seconds. Left, the job as three
 * verbs. Right, the product as a swing tag — the label you would find hanging
 * off it in a showroom — with the materials it replaces struck out.
 */
export default function WhatWeDo() {
  // [current, previous] — the previous picture stays underneath while the
  // current one wipes in over it, so the tag never flashes empty.
  const [[active, prev], setShown] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  const show = (i: number) => setShown(([cur]) => (i === cur ? [cur, cur] : [i, cur]));

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => show((active + 1) % STEPS.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [active, paused]);

  return (
    <section
      id="what-we-do"
      className="relative overflow-hidden bg-background py-[clamp(3.5rem,9vh,7.5rem)]"
    >
      <div className="section-shell">
        <motion.p
          {...fadeUp(0)}
          className="eyebrow"
        >
          What we do, plainly
        </motion.p>

        <TypeReveal
          as="h2"
          text="We design, build and install modular kitchens — made of steel, not wood."
          className="mt-8 max-w-[22ch] text-[clamp(1.9rem,4.6vw,4.2rem)] leading-[1.05] font-medium tracking-[-0.04em]"
        />

        <div className="mt-[clamp(3rem,8vh,6rem)] grid items-start gap-[clamp(3rem,6vw,6rem)] lg:grid-cols-[1.25fr_1fr]">
          {/* ── The job, in three verbs ─────────────────────────────── */}
          <ol
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* The spine the three numbers hang off, drawn down once in view. */}
            <motion.span
              aria-hidden="true"
              className="absolute top-3 bottom-3 left-[15px] w-px origin-top bg-brown/30"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 1.8, ease: EASE }}
            />

            {STEPS.map((step, i) => (
              <motion.li
                key={step.verb}
                {...fadeUp(0.12 * i)}
                onMouseEnter={() => show(i)}
                onClick={() => show(i)}
                onFocus={() => show(i)}
                tabIndex={0}
                data-active={i === active}
                className="group focus-ring relative grid cursor-default grid-cols-[32px_1fr] gap-5 pb-[clamp(2rem,5vh,3.5rem)] last:pb-0 sm:gap-8"
              >
                <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full border border-brown/30 bg-background font-mono text-[10px] text-brown transition-colors duration-500 group-data-[active=true]:bg-brown group-data-[active=true]:text-cream">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3 className="text-[clamp(2.4rem,6vw,5rem)] leading-[0.9] font-medium tracking-[-0.05em] text-foreground/15 transition-colors duration-500 group-data-[active=true]:text-foreground">
                    {step.verb}.
                  </h3>
                  <p className="mt-3 max-w-[44ch] text-[14.5px] leading-[1.6] tracking-[-0.01em] text-muted">
                    {step.line}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>

          {/* ── The product, as a swing tag ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, rotate: -9, y: -40 }}
            whileInView={{ opacity: 1, rotate: 2, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 60, damping: 9, mass: 1.1 }}
            className="relative mx-auto w-full max-w-[25rem] origin-top pt-10 lg:mt-6"
          >
            {/* The string it hangs from. */}
            <span
              aria-hidden="true"
              className="absolute top-0 left-1/2 h-12 w-px -translate-x-1/2 bg-brown/40"
            />

            <div className="card-modula relative bg-cream px-6 pt-10 pb-7 sm:px-8">
              {/* Punched eyelet. */}
              <span
                aria-hidden="true"
                className="absolute top-3 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-brown/40 bg-background"
              />

              <div className="flex items-baseline justify-between border-b border-dashed border-brown/30 pb-4">
                <span className="font-serif text-[26px] leading-none text-brown">
                  {BRAND.wordmark}
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] text-muted uppercase">
                  Product tag
                </span>
              </div>

              {/* The picture window: sketch → steel → kitchen, each one wiping
                  in over the last, in step with the verb lit on the left. */}
              <figure className="relative mt-5 aspect-[4/3] overflow-hidden rounded-[3px] bg-surface">
                <Image
                  key={`prev-${prev}`}
                  src={STEPS[prev].image}
                  alt=""
                  fill
                  sizes="400px"
                  className="object-cover"
                />
                <motion.div
                  key={`cur-${active}`}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <Image
                    src={STEPS[active].image}
                    alt={`${STEPS[active].verb}: ${STEPS[active].caption}`}
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                  {/* The wipe's leading edge, a coral hairline. */}
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-y-0 right-0 w-[2px] bg-coral"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  />
                </motion.div>

                <figcaption className="absolute bottom-2 left-2 flex items-center gap-2 rounded-[2px] bg-ink/70 px-2 py-1 font-mono text-[9px] tracking-[0.18em] text-cream uppercase backdrop-blur-[2px]">
                  <span className="text-coral">{String(active + 1).padStart(2, "0")}</span>
                  {STEPS[active].caption}
                </figcaption>

                {/* Progress ticks — which of the three you are looking at. */}
                <span aria-hidden="true" className="absolute top-2 right-2 flex gap-1">
                  {STEPS.map((s, i) => (
                    <span
                      key={s.verb}
                      className={`h-[3px] rounded-full transition-all duration-500 ${i === active ? "w-5 bg-coral" : "w-2 bg-cream/80"}`}
                    />
                  ))}
                </span>
              </figure>

              <dl className="divide-y divide-brown/10 text-[13px]">
                <Row label="What it is">Modular kitchen</Row>
                <Row label="Made of">Steel composite · JSW Xteel®</Row>
                <Row label="Not made of">
                  <span className="flex flex-wrap justify-end gap-x-3">
                    {NOT_MADE_OF.map((word, i) => (
                      <span key={word} className="relative text-muted">
                        {word}
                        <motion.span
                          aria-hidden="true"
                          className="absolute top-1/2 -right-0.5 -left-0.5 h-[1.5px] origin-left bg-coral"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: false }}
                          transition={{ duration: 0.45, ease: EASE, delay: 0.9 + i * 0.25 }}
                        />
                      </span>
                    ))}
                  </span>
                </Row>
                <Row label="Built by">
                  {BRAND.partner} · {BRAND.partnerParent}
                </Row>
                <Row label="Shrugs off">Termites · Fire · Water</Row>
                <Row label="Design">3 concepts, free</Row>
                <Row label="Ready in">30 days, installed</Row>
                <Row label="Where">Hyderabad</Row>
              </dl>

              {/* Barcode-ish rule — the tag has to look like a tag. */}
              <div
                aria-hidden="true"
                className="mt-5 h-7 opacity-60"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, var(--brown-deep) 0 1px, transparent 1px 4px, var(--brown-deep) 4px 6px, transparent 6px 9px)",
                }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          {...fadeUp(0.1)}
          className="mt-[clamp(3rem,8vh,5.5rem)] flex flex-wrap items-center gap-3"
        >
          <a
            href="#estimate"
            className="focus-ring rounded-full bg-foreground px-6 py-3 text-[12px] font-medium tracking-[0.12em] text-cream uppercase transition-colors hover:bg-brown"
          >
            See what yours costs
          </a>
          <a
            href={BOOK_VISIT_LINK}
            target="_blank"
            rel="noreferrer noopener"
            className="focus-ring rounded-full border border-foreground/25 px-6 py-3 text-[12px] font-medium tracking-[0.12em] uppercase transition-colors hover:border-foreground"
          >
            Book a site visit
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="shrink-0 font-mono text-[9.5px] tracking-[0.18em] text-muted uppercase">
        {label}
      </dt>
      <dd className="text-right font-medium tracking-[-0.01em]">{children}</dd>
    </div>
  );
}
