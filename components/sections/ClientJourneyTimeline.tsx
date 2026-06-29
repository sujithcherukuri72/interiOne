"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { JOURNEY_PHASES } from "@/lib/journey-data";
import type { JourneyPhase } from "@/types/journey";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

/* ── Single phase card ── */
function PhaseCard({
  phase,
  index,
  active,
  onEnter,
}: {
  phase: JourneyPhase;
  index: number;
  active: boolean;
  onEnter: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Trigger parent when this card enters the viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onEnter(index);
      },
      { threshold: 0.5, rootMargin: "-20% 0px -30% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, onEnter]);

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, x: 32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: EXPO_OUT, delay: index * 0.04 }}
      className="relative"
    >
      {/* Connector dot (mobile) */}
      <div className="lg:hidden absolute -left-[30px] top-5 flex flex-col items-center">
        <motion.div
          className={[
            "h-3 w-3 rounded-full border-2 transition-colors duration-300",
            active
              ? "border-gold bg-gold"
              : "border-foreground/20 bg-background",
          ].join(" ")}
        />
      </div>

      {/* Card body */}
      <motion.div
        animate={{
          borderColor: active ? "rgba(201,168,76,0.35)" : "rgba(0,0,0,0.06)",
          backgroundColor: active ? "rgba(201,168,76,0.04)" : "var(--surface)",
        }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border p-6 transition-shadow duration-300 hover:shadow-md"
      >
        <div className="flex items-start gap-4">
          {/* Step number */}
          <div className="flex-shrink-0">
            <motion.span
              animate={{ color: active ? "#C9A84C" : "rgba(0,0,0,0.2)" }}
              className="text-4xl font-bold tabular-nums leading-none"
            >
              {phase.step}
            </motion.span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Day range chip */}
            <span className="inline-block text-[9px] font-medium tracking-[0.22em] uppercase text-foreground/40 bg-foreground/6 px-2 py-0.5 rounded-full mb-2">
              {phase.dayRange}
            </span>

            <h3 className="text-base font-semibold leading-tight mb-0.5">
              {phase.title}
            </h3>
            <p className="text-xs text-foreground/40 tracking-wide mb-3">
              {phase.subtitle}
            </p>
            <p className="text-sm text-foreground/60 leading-relaxed">
              {phase.detail}
            </p>

            {phase.payment && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gold">
                  {phase.payment}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Sticky sidebar (desktop) ── */
function StickyTracker({
  phases,
  activeIndex,
  progressY,
}: {
  phases: JourneyPhase[];
  activeIndex: number;
  progressY: number;
}) {
  return (
    <div className="hidden lg:flex flex-col gap-0 sticky top-28 self-start">
      <p className="text-[9px] font-medium tracking-[0.28em] uppercase text-foreground/30 mb-5 pl-4">
        30-Day Journey
      </p>

      {/* Vertical track */}
      <div className="relative pl-4">
        {/* Background track line */}
        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-foreground/10" />

        {/* Animated fill line */}
        <motion.div
          className="absolute left-[11px] top-0 w-px bg-gold origin-top"
          style={{ height: `${progressY * 100}%` }}
        />

        {phases.map((phase, i) => (
          <div key={phase.step} className="relative flex items-center gap-3 mb-4">
            {/* Dot */}
            <motion.div
              animate={{
                backgroundColor: i <= activeIndex ? "#C9A84C" : "transparent",
                borderColor: i <= activeIndex ? "#C9A84C" : "rgba(0,0,0,0.15)",
                scale: i === activeIndex ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="relative z-10 h-3 w-3 rounded-full border-2 flex-shrink-0"
            />

            {/* Label */}
            <motion.span
              animate={{
                opacity: i === activeIndex ? 1 : 0.35,
                x: i === activeIndex ? 2 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="text-xs font-medium leading-tight truncate max-w-[140px]"
            >
              {phase.title}
            </motion.span>
          </div>
        ))}
      </div>

      {/* Progress readout */}
      <div className="mt-4 ml-4 pl-4 border-l border-foreground/10">
        <p className="text-[9px] text-foreground/30 uppercase tracking-widest">Progress</p>
        <p className="text-2xl font-bold tabular-nums text-gold">
          {Math.round(progressY * 100)}%
        </p>
      </div>
    </div>
  );
}

/* ── Section ── */
export function ClientJourneyTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Convert scroll progress to a plain number for the sidebar tracker
  const progressMotion = useMotionValue(0);
  useEffect(() => {
    return scrollYProgress.on("change", (v) => progressMotion.set(v));
  }, [scrollYProgress, progressMotion]);

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    return progressMotion.on("change", (v) => setProgress(Math.min(1, Math.max(0, v))));
  }, [progressMotion]);

  return (
    <section className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-14">
        <p className="text-xs font-medium tracking-[0.28em] uppercase text-gold mb-3">
          The Process
        </p>
        <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.08] mb-4">
          Your 30-Day
          <br />
          Kitchen Journey
        </h2>
        <p className="text-foreground/50 max-w-md text-sm leading-relaxed">
          From first consultation to white-glove installation — eight milestones,
          one seamless experience.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-12 lg:gap-16">
        {/* Sidebar */}
        <div className="lg:w-52 flex-shrink-0">
          <StickyTracker
            phases={JOURNEY_PHASES}
            activeIndex={activeIndex}
            progressY={progress}
          />
        </div>

        {/* Phase cards */}
        <div ref={containerRef} className="flex-1 relative">
          {/* Mobile vertical line */}
          <div className="lg:hidden absolute left-0 top-0 bottom-0 w-px bg-foreground/10 ml-[-20px]" />

          <div className="flex flex-col gap-5">
            {JOURNEY_PHASES.map((phase, i) => (
              <PhaseCard
                key={phase.step}
                phase={phase}
                index={i}
                active={activeIndex === i}
                onEnter={setActiveIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
