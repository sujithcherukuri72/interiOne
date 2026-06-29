"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

/* ── Compressive strength data ── */
type StrengthBar = { label: string; range: string; mpa: number; color: string };

const STRENGTH_BARS: StrengthBar[] = [
  { label: "PPGF 30 (Modula)", range: "80–120 MPa", mpa: 100, color: "#C9A84C" },
  { label: "Plywood",          range: "35–50 MPa",  mpa: 42,  color: "#9BAAB8" },
  { label: "MDF",              range: "15–25 MPa",  mpa: 20,  color: "#7D9182" },
];
const MAX_MPA = 120;

/* ── Strength bar ── */
function StrengthBar({ bar, animate }: { bar: StrengthBar; animate: boolean }) {
  const pct = (bar.mpa / MAX_MPA) * 100;
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-[11px] font-medium tracking-wide">{bar.label}</span>
        <span className="text-[10px] text-foreground/40 tabular-nums">{bar.range}</span>
      </div>
      <div className="h-2 rounded-full bg-foreground/8 overflow-hidden">
        <motion.div
          className="h-full rounded-full origin-left"
          style={{ backgroundColor: bar.color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: animate ? 1 : 0 }}
          transition={{ duration: 1.1, ease: EXPO_OUT, delay: 0.1 }}
          custom={pct}
        >
          {/* inner fill — actual width drives the visual percentage */}
          <div style={{ width: `${pct}%` }} className="h-full" />
        </motion.div>
      </div>
    </div>
  );
}

/* ── Metric card wrapper ── */
function MetricCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-foreground/8 bg-surface p-6 flex flex-col gap-4 overflow-hidden",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/* ── Fire-safe compliance rows ── */
type ComplianceRow = { material: string; rating: string; pass: boolean };
const COMPLIANCE: ComplianceRow[] = [
  { material: "Modula Panel",   rating: "UL 94 V-0", pass: true },
  { material: "Plywood",        rating: "HB",        pass: false },
  { material: "MDF",            rating: "HB",        pass: false },
];

/* ── Main section ── */
export function PerformanceDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();
  const shouldAnimate = inView && !reduce;

  const containerV = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };
  const cardV = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EXPO_OUT } },
  };

  return (
    <section className="py-24 px-6 lg:px-10 max-w-7xl mx-auto" ref={ref}>
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-medium tracking-[0.28em] uppercase text-gold mb-3">
          Engineering Excellence
        </p>
        <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.08]">
          Designed to Perform
        </h2>
      </div>

      {/* Metric grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5"
        variants={containerV}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        {/* ── Block 1: Compressive Strength ── */}
        <motion.div variants={cardV}>
          <MetricCard className="md:row-span-1">
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-bold tracking-tight text-gold">4×</span>
                <span className="text-sm font-medium text-foreground/60">Stronger</span>
              </div>
              <p className="text-xs text-foreground/40 tracking-wide uppercase">
                Compressive Strength — PPGF 30 vs. Wood
              </p>
            </div>

            <div className="mt-2">
              {STRENGTH_BARS.map((bar) => (
                <StrengthBar key={bar.label} bar={bar} animate={shouldAnimate} />
              ))}
            </div>

            <p className="text-[10px] text-foreground/30 leading-relaxed mt-1">
              Glass-filled polypropylene composite rated at 80–120 MPa compressive
              strength versus 35–50 MPa for structural plywood.
            </p>
          </MetricCard>
        </motion.div>

        {/* ── Block 2: Fire Safe ── */}
        <motion.div variants={cardV}>
          <MetricCard>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-sienna" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                </svg>
                <span className="text-4xl font-bold tracking-tight">
                  Fire<span className="text-sienna">Safe</span>
                </span>
              </div>
              <p className="text-xs text-foreground/40 tracking-wide uppercase">
                Flammability Rating — UL 94 Standard
              </p>
            </div>

            <div className="divide-y divide-foreground/6">
              {COMPLIANCE.map((row) => (
                <div
                  key={row.material}
                  className="flex items-center justify-between py-2.5"
                >
                  <span className="text-sm font-medium">{row.material}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={[
                        "text-xs font-bold tracking-widest px-2.5 py-1 rounded-full",
                        row.pass
                          ? "bg-cavern-deep/20 text-cavern-deep"
                          : "bg-foreground/8 text-foreground/30",
                      ].join(" ")}
                    >
                      {row.rating}
                    </span>
                    {row.pass ? (
                      <svg className="h-4 w-4 text-cavern-deep" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-foreground/20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-foreground/30 leading-relaxed">
              V-0 is the highest flame-retardant classification — flame extinguishes
              within 10 seconds with no drip ignition.
            </p>
          </MetricCard>
        </motion.div>

        {/* ── Block 3: Moisture Proof ── */}
        <motion.div variants={cardV}>
          <MetricCard>
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 h-14 w-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#9BAAB820" }}
              >
                <svg viewBox="0 0 24 24" className="h-7 w-7 text-river-raft" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight mb-0.5">
                  100% <span className="text-river-raft">Waterproof</span>
                </p>
                <p className="text-xs text-foreground/40 tracking-wide uppercase">
                  Moisture Resistance
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-1">
              {["Zero water absorption at cut edges", "No warping or swelling in humidity", "Ideal for kitchens & wet zones"].map((point) => (
                <div key={point} className="flex items-center gap-2.5 text-sm text-foreground/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-river-raft flex-shrink-0" />
                  {point}
                </div>
              ))}
            </div>

            {/* Moisture animation bar */}
            <div className="mt-3 rounded-lg bg-river-raft/10 overflow-hidden h-2">
              <motion.div
                className="h-full bg-river-raft rounded-lg"
                initial={{ width: "0%" }}
                animate={{ width: shouldAnimate ? "100%" : "0%" }}
                transition={{ duration: 1.4, ease: EXPO_OUT, delay: 0.3 }}
              />
            </div>
            <p className="text-[10px] text-foreground/30">
              Absorption rate: 0% · Swelling coefficient: 0 · IP44 rated
            </p>
          </MetricCard>
        </motion.div>

        {/* ── Block 4: Termite Proof ── */}
        <motion.div variants={cardV}>
          <MetricCard className="relative overflow-hidden">
            {/* Background texture */}
            <div className="absolute inset-0 opacity-[0.03]" aria-hidden>
              {Array.from({ length: 80 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute text-[8px] font-bold text-foreground select-none"
                  style={{
                    left: `${(i % 10) * 10 + 2}%`,
                    top: `${Math.floor(i / 10) * 16 + 4}%`,
                  }}
                >
                  00%
                </div>
              ))}
            </div>

            <div className="relative">
              <p className="text-xs font-medium tracking-[0.28em] uppercase text-foreground/30 mb-3">
                Pest Resistance
              </p>
              <p className="text-5xl lg:text-6xl font-bold tracking-tighter leading-none mb-2">
                Zero
              </p>
              <p className="text-lg font-medium text-foreground/60 leading-snug">
                Wood Content.
                <br />
                Zero Termite Risk.
              </p>
            </div>

            <div className="relative space-y-2 mt-2">
              {["100% wood-free composite substrate", "Glass fibre reinforced polymer", "Pest & rodent resistant by material"].map((pt) => (
                <div key={pt} className="flex items-center gap-2.5 text-[12px] text-foreground/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0" />
                  {pt}
                </div>
              ))}
            </div>

            <div className="relative mt-4 py-3 px-4 rounded-xl bg-gold/8 border border-gold/20">
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold">
                PPGF 30 Composite
              </p>
              <p className="text-[10px] text-foreground/40 mt-0.5">
                Polypropylene + 30% glass fibre — no cellulose, no organic substrate.
              </p>
            </div>
          </MetricCard>
        </motion.div>
      </motion.div>
    </section>
  );
}
