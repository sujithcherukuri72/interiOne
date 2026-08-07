"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { PARTNERS } from "@/data/partners";
import { EASE } from "@/lib/motion";

const ACCENTS = ["var(--signal)", "var(--navy)", "var(--coral)", "var(--sky)", "var(--navy)"];

export default function Partners() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="partners" className="bg-background py-[clamp(3.5rem,9vh,7.5rem)]">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="text-[10px] font-medium tracking-[0.28em] text-foreground/45 uppercase">
            Hardware & Appliance Network
          </p>
          <h2 className="mt-8 max-w-[36ch] text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.2] font-medium tracking-[-0.03em] text-balance">
            The parts you touch every day.
          </h2>
          <p className="mt-4 max-w-[46ch] text-[14px] leading-[1.6] tracking-[-0.01em] text-foreground/60">
            A kitchen fails at its moving parts. Ours are specified at design
            stage, not on site.
          </p>
        </motion.div>

        <div className="mt-[clamp(2.25rem,5.5vh,4.5rem)] grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map((partner, i) => {
            const isActive = active === partner.id;
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <motion.article
                key={partner.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-60px" }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.06 }}
                onMouseEnter={() => setActive(partner.id)}
                onMouseLeave={() => setActive(null)}
                // The detail only existed on hover, which meant it existed
                // only on desktop. A tap toggles the same panel, so the copy
                // is reachable on the phones most of this traffic arrives on.
                onClick={() =>
                  setActive((current) =>
                    current === partner.id ? null : partner.id,
                  )
                }
                // Keyboard gets the same reveal on focus that a pointer gets
                // on hover. The card is content rather than a control â€” it
                // navigates nowhere â€” so it is made reachable rather than
                // dressed up as a button.
                tabIndex={0}
                onFocus={() => setActive(partner.id)}
                onBlur={() => setActive(null)}
                className="group focus-ring relative min-h-[220px] cursor-pointer overflow-hidden bg-background p-6 sm:min-h-[240px] sm:p-8"
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  style={{ backgroundColor: accent }}
                />

                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <motion.span
                      className="text-[24px] font-bold tracking-[-0.03em]"
                      animate={{ color: isActive ? "#fff" : "var(--foreground)" }}
                      transition={{ duration: 0.5 }}
                    >
                      {partner.name}
                    </motion.span>
                    <motion.span
                      animate={{
                        color: isActive ? "#fff" : "rgba(26,26,26,0.3)",
                        rotate: isActive ? 0 : -45,
                      }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <ArrowUpRight size={18} strokeWidth={1.75} />
                    </motion.span>
                  </div>

                  <div>
                    <motion.p
                      className="text-[10px] font-medium tracking-[0.28em] uppercase"
                      animate={{ color: isActive ? "rgba(255,255,255,0.7)" : "var(--muted)" }}
                      transition={{ duration: 0.5 }}
                    >
                      {partner.country}
                    </motion.p>
                    <motion.h3
                      className="mt-2 text-[19px] leading-snug font-medium tracking-[-0.02em]"
                      animate={{ color: isActive ? "#fff" : "var(--foreground)" }}
                      transition={{ duration: 0.5 }}
                    >
                      {partner.category}
                    </motion.h3>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                          className="overflow-hidden text-[13px] leading-[1.55] text-white/80"
                        >
                          {partner.detail}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.article>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.8, ease: EASE, delay: PARTNERS.length * 0.06 }}
            className="relative flex min-h-[240px] flex-col justify-between bg-surface p-8"
          >
            <span className="text-[10px] font-medium tracking-[0.28em] text-foreground/45 uppercase">
              Specification
            </span>
            <div>
              <p className="text-[22px] leading-tight font-medium tracking-[-0.025em]">
                Every component, scheduled.
              </p>
              <p className="mt-3 text-[13px] leading-[1.6] text-foreground/60">
                Listed by model number in your docket. What&apos;s quoted is
                what&apos;s installed.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
