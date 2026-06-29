"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/types/projects";

// ── Variants ─────────────────────────────────────────────────────────────────

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

const maskV = {
  hidden: { clipPath: "inset(0 100% 0 0 round 0px)" },
  show: {
    clipPath: "inset(0 0% 0 0 round 0px)",
    transition: { duration: 0.68, ease: EXPO_OUT },
  },
  exit: {
    clipPath: "inset(0 100% 0 0 round 0px)",
    transition: { duration: 0.5, ease: [0.32, 0, 0.67, 0] },
  },
} as const;

const contentV = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: EXPO_OUT, delay: 0.22 },
  },
  exit: { opacity: 0, x: 24, transition: { duration: 0.25 } },
} as const;

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectOverlay({ project, onClose }: Props) {
  return (
    <AnimatePresence>
      {project !== null && (
        <motion.div
          key={project.id}
          variants={maskV}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-40 flex"
          style={{ willChange: "clip-path" }}
        >
          {/* Colour strip — echoes the project's palette */}
          <div
            className="hidden lg:block w-[38%] flex-shrink-0 transition-colors duration-700"
            style={{ background: project.placeholderColor }}
          />

          {/* Detail panel */}
          <div className="flex-1 bg-background flex flex-col overflow-y-auto">
            {/* Close */}
            <div className="flex justify-end p-6 lg:p-10">
              <button
                onClick={onClose}
                aria-label="Close project"
                className="flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-foreground/50 hover:text-foreground transition-colors duration-200"
              >
                Close
                <span aria-hidden className="text-base leading-none">
                  ×
                </span>
              </button>
            </div>

            {/* Content */}
            <motion.div
              variants={contentV}
              initial="hidden"
              animate="show"
              exit="exit"
              className="flex-1 flex flex-col justify-center px-10 lg:px-16 pb-20 gap-8 max-w-xl"
            >
              {/* Meta */}
              <div className="flex items-center gap-3 text-[10px] font-medium tracking-[0.28em] uppercase text-foreground/35">
                <span>{project.category}</span>
                <span aria-hidden>·</span>
                <span>{project.year}</span>
              </div>

              {/* Title */}
              <div className="overflow-hidden">
                <motion.h2
                  className="text-[clamp(2rem,5vw,4rem)] font-semibold tracking-[-0.02em] leading-[1.08]"
                  initial={{ y: "110%" }}
                  animate={{
                    y: "0%",
                    transition: { duration: 0.7, ease: EXPO_OUT, delay: 0.3 },
                  }}
                  exit={{ y: "110%", transition: { duration: 0.3 } }}
                >
                  {project.title}
                </motion.h2>
              </div>

              {/* Location */}
              <p className="text-sm font-medium tracking-[0.14em] uppercase text-foreground/40">
                {project.location}
              </p>

              {/* Placeholder description */}
              <p className="text-[0.875rem] leading-[1.8] text-foreground/55 max-w-[40ch]">
                A bespoke space crafted to balance form with function —
                materialising the client's vision through considered surfaces,
                precise joinery, and curated lighting.
              </p>

              {/* CTA */}
              <div className="flex items-center gap-5 pt-2">
                <button className="inline-flex items-center px-6 py-[11px] text-[11px] font-medium tracking-[0.18em] uppercase bg-foreground text-background rounded-full hover:opacity-75 transition-opacity duration-300">
                  View Full Project
                </button>
                <button
                  onClick={onClose}
                  className="text-[11px] font-medium tracking-[0.14em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-200"
                >
                  Back to Gallery
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
