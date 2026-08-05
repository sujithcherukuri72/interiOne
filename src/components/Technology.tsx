"use client";

import { motion } from "framer-motion";
import { Droplets, Flame, Leaf, ShieldCheck } from "lucide-react";

import { EASE } from "@/lib/motion";
import { XTEEL_FEATURES } from "@/data/technology";
import XteelSection from "./ui/XteelSection";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-100px" },
  transition: { duration: 0.9, ease: EASE, delay },
});

const ICONS = { ShieldCheck, Flame, Leaf, Droplets } as const;

export default function Technology() {
  return (
    <section id="technology" className="bg-surface pt-[14vh] pb-[14vh]">
      <div className="section-shell">
        <motion.div {...fadeUp(0)} className="grid gap-y-8 md:grid-cols-12 md:gap-x-8">
          <p className="font-mono text-[11px] tracking-[0.28em] text-foreground/45 uppercase md:col-span-3">
            Technology
          </p>

          <p className="max-w-[46ch] text-[clamp(1.3rem,2.2vw,1.9rem)] leading-[1.55] tracking-[-0.015em] text-balance md:col-span-9">
            Every shutter is built from JSW Xteel® — a steel-composite core
            that replaces plywood and MDF entirely. No organic fibre means
            nothing for termites to feed on and nothing for moisture to
            swell, so the panel stays flat on the hundredth wipe-down as it
            did on the first.
          </p>
        </motion.div>
      </div>

      {/* The panel itself, pulled apart by scroll. Full-bleed — the drawing
          wants the whole viewport, not a column. */}
      <XteelSection />

      <div className="section-shell">
        {/* A shop-drawing note rather than a photograph: the claim is a
            certification, so it is set as one. */}
        <motion.div
          {...fadeUp(0)}
          className="mt-[6vh] grid gap-y-8 border-t border-foreground/15 pt-12 md:grid-cols-12 md:gap-x-8"
        >
          <div className="md:col-span-3">
            <p className="font-mono text-[11px] tracking-[0.22em] text-coral uppercase">
              UL 94 V-0
            </p>
            <p className="mt-2 font-mono text-[11px] tracking-[0.22em] text-foreground/40 uppercase">
              Self-extinguishing
            </p>
          </div>

          <p className="max-w-[42ch] text-[clamp(1.15rem,1.8vw,1.65rem)] leading-[1.5] tracking-[-0.015em] text-balance md:col-span-9">
            Zero plywood also means zero formaldehyde off-gassing, and a fire
            rating that self-extinguishes rather than feeding a flame. A kitchen
            built this way asks less of you, not more — the same panel under the
            sink as above the hob.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="mt-[10vh] grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {XTEEL_FEATURES.map((feature, i) => {
            const Icon = ICONS[feature.icon as keyof typeof ICONS];
            return (
              <motion.div
                key={feature.id}
                className="border-t border-line pt-6"
                {...fadeUp(i * 0.06)}
              >
                <Icon size={22} strokeWidth={1.5} className="text-foreground/70" />
                <h3 className="mt-5 text-[17px] font-medium tracking-[-0.02em]">
                  {feature.title}
                </h3>
                <p className="mt-1.5 font-mono text-[10.5px] tracking-[0.18em] text-foreground/45 uppercase">
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
