"use client";

import { motion } from "framer-motion";
import { Droplets, Flame, Leaf, ShieldCheck } from "lucide-react";

import { EASE } from "@/lib/motion";
import { XTEEL_FEATURES } from "@/data/technology";
import TypeReveal from "./ui/TypeReveal";
import XteelSection from "./ui/XteelSection";

/* The two typed statements. Held as plain strings rather than JSX because
   TypeReveal splits them character by character — markup in the middle would
   have nowhere to go. */
const TECH_LEAD =
  "Every shutter is built from JSW Xteel® — a steel-composite core that replaces plywood and MDF entirely. No organic fibre means nothing for termites to feed on and nothing for moisture to swell, so the panel stays flat on the hundredth wipe-down as it did on the first.";

const TECH_SAFETY =
  "Zero plywood also means zero formaldehyde off-gassing, and a fire rating that self-extinguishes rather than feeding a flame. A kitchen built this way asks less of you, not more — the same panel under the sink as above the hob.";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-100px" },
  transition: { duration: 0.9, ease: EASE, delay },
});

const ICONS = { ShieldCheck, Flame, Leaf, Droplets } as const;

/** Which idle animation each icon carries — see `.prop-icon` in globals.css. */
const ICON_MOTION: Record<keyof typeof ICONS, string> = {
  ShieldCheck: "seal",
  Flame: "flicker",
  Leaf: "breathe",
  Droplets: "bead",
};

export default function Technology() {
  return (
    <section id="technology" className="bg-surface pt-[clamp(3.5rem,9vh,7.5rem)] pb-[clamp(3.5rem,9vh,7.5rem)]">
      <div className="section-shell">
        {/* The section's real heading. The design leads on the statement
            itself rather than a title, so the heading carries the structure
            for crawlers and screen readers without appearing on the page. */}
        <h2 className="sr-only">
          JSW Xteel® steel-composite kitchen shutters
        </h2>

        <div className="grid gap-y-6 md:grid-cols-12 md:gap-x-8">
          <motion.p
            {...fadeUp(0)}
            className="font-mono text-[10px] tracking-[0.24em] text-foreground/45 uppercase sm:text-[11px] sm:tracking-[0.28em] md:col-span-3"
          >
            Technology
          </motion.p>

          {/* Typed rather than faded: this is the material argument, and it
              should be read a word at a time. */}
          <TypeReveal
            text={TECH_LEAD}
            className="max-w-[46ch] text-[clamp(1.15rem,2.2vw,1.9rem)] leading-[1.5] tracking-[-0.015em] text-pretty sm:leading-[1.55] md:col-span-9"
          />
        </div>
      </div>

      {/* The panel itself, pulled apart by scroll. Full-bleed — the drawing
          wants the whole viewport, not a column. */}
      <XteelSection />

      <div className="section-shell">
        {/* A shop-drawing note rather than a photograph: the claim is a
            certification, so it is set as one. */}
        <div className="mt-[clamp(2rem,4.5vh,4rem)] grid gap-y-6 border-t border-foreground/15 pt-10 md:grid-cols-12 md:gap-x-8 md:pt-12">
          <motion.div {...fadeUp(0)} className="md:col-span-3">
            <p className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase sm:text-[11px] sm:tracking-[0.22em]">
              UL 94 V-0
            </p>
            <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-foreground/40 uppercase sm:text-[11px] sm:tracking-[0.22em]">
              Self-extinguishing
            </p>
          </motion.div>

          <TypeReveal
            text={TECH_SAFETY}
            className="max-w-[42ch] text-[clamp(1.05rem,1.8vw,1.65rem)] leading-[1.5] tracking-[-0.015em] text-pretty md:col-span-9"
          />
        </div>

        {/* The four properties, as cards rather than as a row of paragraphs.
            Each icon animates the thing the panel is immune to — the flame
            gutters, the droplet beads — which is the whole argument in one
            gesture, and it is what the flat version was missing. */}
        <div className="mt-[clamp(2.5rem,6.5vh,5.5rem)] grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {XTEEL_FEATURES.map((feature, i) => {
            const Icon = ICONS[feature.icon as keyof typeof ICONS];
            return (
              <motion.div
                key={feature.id}
                {...fadeUp(i * 0.08)}
                className="prop-card group bg-cream/70 p-6"
              >
                <span
                  aria-hidden="true"
                  className="prop-rule block h-px w-10 bg-brown"
                  style={{ animationDelay: `${i * 0.08 + 0.3}s` }}
                />

                <Icon
                  size={24}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="prop-icon mt-6 text-foreground/70"
                  data-motion={ICON_MOTION[feature.icon as keyof typeof ICONS]}
                  // Staggered so the four are never in step — in step they read
                  // as one widget blinking, not as four separate claims.
                  style={{ animationDelay: `${i * 0.9}s` }}
                />

                <h3 className="mt-5 text-[17px] font-medium tracking-[-0.02em]">
                  {feature.title}
                </h3>
                <p className="mt-1.5 font-mono text-[10.5px] tracking-[0.18em] text-brown uppercase">
                  {feature.claim}
                </p>
                <p className="mt-3 text-[13.5px] leading-[1.55] tracking-[-0.01em] text-foreground/70">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
