"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { RANGE_RATES } from "@/data/estimator";
import type { RangeId } from "@/data/finishes";
import { EASE } from "@/lib/motion";
import KitchenPlanner from "./ui/KitchenPlanner";

/**
 * The estimate section — now a way into the planner rather than a second,
 * simpler estimator of its own.
 *
 * There used to be a five-question wizard here that priced a kitchen off an
 * assumed 4.5 sq ft of cabinetry per running foot. The planner does the same
 * job from the real catalogue and arrives at a better number, so keeping both
 * meant the site quoted two different figures for the same kitchen — and the
 * worse one came first.
 *
 * The section stays, and keeps its `#estimate` id: the menu points at it, and
 * so does the WhatsApp reply.
 */

const RANGE_IDS: RangeId[] = ["select", "premier", "signature"];

const STEPS = [
  { n: "01", label: "Pick a style and a shape" },
  { n: "02", label: "Enter your wall lengths" },
  { n: "03", label: "Add cabinets from the catalogue" },
  { n: "04", label: "Choose finishes, stone and metal" },
  { n: "05", label: "See it drawn, and priced" },
];

export default function Estimator() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="estimate"
      className="relative isolate overflow-hidden bg-surface py-[clamp(3.5rem,9vh,7.5rem)]"
    >
      <div aria-hidden="true" className="aurora">
        <span />
        <span />
        <span />
      </div>

      <div className="section-shell relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="font-mono text-[11px] tracking-[0.28em] text-foreground/45 uppercase">
            Estimate
          </p>
          <h2 className="mt-8 max-w-[20ch] text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
            Price your kitchen cabinet by cabinet
          </h2>
          <p className="mt-6 max-w-[48ch] text-[15px] leading-[1.65] tracking-[-0.01em] text-muted">
            Not a slider and a guess — the actual Modula catalogue, at the
            widths it is manufactured in. Place the units along your walls and
            the drawing and the figure move with them.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* What the planner asks, in order. */}
          <motion.ol
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
            className="glass flex flex-col gap-4 rounded-2xl p-6 sm:p-8 lg:col-span-7"
          >
            {STEPS.map((step) => (
              <li key={step.n} className="flex items-baseline gap-5">
                <span className="font-mono text-[10px] tracking-[0.18em] text-brown tabular-nums">
                  {step.n}
                </span>
                <span className="text-[15px] tracking-[-0.015em]">{step.label}</span>
              </li>
            ))}

            <li className="mt-3 flex flex-col gap-4 border-t border-white/40 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="focus-ring inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-[13.5px] tracking-[-0.005em] text-white transition-opacity duration-300 hover:opacity-85"
              >
                Build your own kitchen
                <ArrowRight size={16} strokeWidth={1.75} />
              </button>

              <span className="font-mono text-[10px] leading-[1.6] tracking-[0.14em] text-muted uppercase">
                Real catalogue codes
                <br />
                Priced as you place
              </span>
            </li>
          </motion.ol>

          {/* The three rates, which are the whole basis of the number. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.16 }}
            className="glass-ink flex flex-col gap-5 rounded-2xl p-6 text-white sm:p-7 lg:col-span-5"
          >
            <p className="font-mono text-[10px] tracking-[0.22em] text-white/50 uppercase">
              The rate card
            </p>

            {RANGE_IDS.map((id) => (
              <div
                key={id}
                className="flex items-baseline justify-between gap-4 border-t border-white/15 pt-4"
              >
                <span>
                  <span className="block text-[15px] tracking-[-0.015em]">
                    {RANGE_RATES[id].label}
                  </span>
                  <span className="block text-[12px] leading-[1.5] text-white/50">
                    {RANGE_RATES[id].note}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-[12px] tabular-nums text-white/85">
                  ₹{RANGE_RATES[id].perSqFt.toLocaleString("en-IN")}
                  <span className="text-white/40">/sq ft</span>
                </span>
              </div>
            ))}

            <p className="border-t border-white/15 pt-4 text-[12px] leading-[1.6] text-white/45">
              Plus stone by the running foot, the opening detail, appliances and
              18% GST. Civil work and electrical points are not in it — the
              survey settles those.
            </p>
          </motion.div>
        </div>
      </div>

      <KitchenPlanner open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
