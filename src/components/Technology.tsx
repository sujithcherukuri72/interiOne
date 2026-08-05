"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Droplets, Flame, Leaf, ShieldCheck } from "lucide-react";

import { placeholder } from "@/lib/placeholder";
import { EASE } from "@/lib/motion";
import { XTEEL_FEATURES, XTEEL_LAYERS } from "@/data/technology";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-100px" },
  transition: { duration: 0.9, ease: EASE, delay },
});

const ICONS = { ShieldCheck, Flame, Leaf, Droplets } as const;

export default function Technology() {
  return (
    <section id="technology" className="bg-surface py-[14vh]">
      <div className="section-shell">
        <div className="grid gap-y-14 md:grid-cols-12 md:gap-x-8">
          <motion.div className="md:col-span-5 flex flex-col justify-center" {...fadeUp(0)}>
            <p className="text-[16px] font-medium tracking-[0.28em] text-foreground/45 uppercase">
              Technology
            </p>

            <p className="mt-10 max-w-[40ch] text-[clamp(1.3rem,2.2vw,1.9rem)] leading-[1.6] tracking-[-0.015em] text-balance">
              Every shutter is built from JSW Xteel® — a steel-composite core
              that replaces plywood and MDF entirely. No organic fibre means
              nothing for termites to feed on and nothing for moisture to
              swell, so the panel stays flat on the hundredth wipe-down as it
              did on the first.
            </p>
          </motion.div>

          <motion.figure
            className="group relative md:col-span-6 md:col-start-7"
            {...fadeUp(0.18)}
          >
            <div className="relative h-[72vh] w-full overflow-hidden bg-line">
              <Image
                src={placeholder("interione-xteel-core", 900, 1200)}
                alt="Cross-section of an Xteel steel-composite panel"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
            </div>
          </motion.figure>
        </div>

        {/* Layer build-up — front to back, in the numeral grammar the
            portfolio uses for its listing bands. */}
        <div className="mt-[10vh] grid gap-10 sm:grid-cols-3">
          {XTEEL_LAYERS.map((layer, i) => (
            <motion.div key={layer.step} {...fadeUp(i * 0.08)}>
              <span className="block text-[clamp(2.5rem,5vw,4rem)] leading-[0.78] font-medium tracking-[-0.05em] tabular-nums text-foreground/30">
                {layer.step}
              </span>
              <hr className="mt-5 w-10 border-0 border-t border-foreground/20" />
              <h3 className="mt-5 text-[clamp(1.15rem,1.6vw,1.4rem)] leading-[1.15] font-medium tracking-[-0.025em]">
                {layer.title}
              </h3>
              <p className="mt-2 text-[11px] font-medium tracking-[0.2em] text-foreground/45 uppercase">
                {layer.spec}
              </p>
              <p className="mt-4 max-w-[32ch] text-[14px] leading-[1.6] tracking-[-0.01em] text-foreground/70">
                {layer.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Offset below, deliberately not aligned to the frame above. */}
        <div className="mt-[10vh] grid md:grid-cols-12 md:gap-x-8">
          <motion.figure
            className="group relative md:col-span-4"
            {...fadeUp(0)}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-line">
              <Image
                src={placeholder("interione-panel-detail", 800, 600)}
                alt="Sealed edge banding on an interiOne shutter"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
            </div>
          </motion.figure>

          <motion.div
            className="md:col-span-6 md:col-start-7 flex flex-col justify-center"
            {...fadeUp(0.2)}
          >
            <p className="max-w-[38ch] text-[clamp(1.15rem,1.8vw,1.65rem)] leading-[1.55] tracking-[-0.015em] text-balance">
              Zero plywood also means zero formaldehyde off-gassing, and a
              UL 94 V-0 fire rating that self-extinguishes rather than feeding
              a flame. A kitchen built this way asks less of you, not more —
              the same panel under the sink as above the hob.
            </p>
          </motion.div>
        </div>

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
                <p className="mt-1.5 text-[11px] font-medium tracking-[0.18em] text-foreground/45 uppercase">
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
