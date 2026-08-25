"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { EASE } from "@/lib/motion";
import { LAYOUTS, ROOM, type Fixture, type Run } from "@/data/layouts";
import { KITCHEN_STYLES } from "@/data/kitchen-styles";
import KitchenPlanner from "./ui/KitchenPlanner";
import StyleOverlay from "./ui/StyleOverlay";
import {
  CoverflowCarousel,
  type CoverflowSlide,
} from "./ui/coverflow-carousel";

/** Rects as paths, so `pathLength` draws them stroke-by-stroke. */
const rectPath = ({ x, y, w, h }: Run) =>
  `M${x} ${y} H${x + w} V${y + h} H${x} Z`;

const CYCLE_MS = 6000;

export default function DrawKitchen() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [styleFromCarousel, setStyleFromCarousel] = useState<string | null>(null);
  const [exploreStyleId, setExploreStyleId] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const layout = LAYOUTS[index];

  // Auto-advance, but never while the visitor is interacting with the tabs.
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % LAYOUTS.length),
      CYCLE_MS,
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  const select = useCallback((i: number) => {
    setIndex(i);
    setPaused(true);
  }, []);

  return (
    <>
      {/* ── Styles ───────────────────────────────────────────────────
          "What will it look like" is the question most people arrive with,
          so it is asked before "where does everything go". Its own section
          now, and its own anchor, rather than a tail on the planning band. */}
      <section id="styles" className="bg-background pt-[clamp(3.5rem,9vh,7.5rem)]">
        <StyleCarousel onExplore={setExploreStyleId} />
      </section>

    <section id="planning" className="border-t border-line bg-background py-[clamp(3.5rem,9vh,7.5rem)]">
      <div className="section-shell">
        <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-8">
          {/* ── Copy column ──────────────────────────────────────────── */}
          <div className="flex flex-col justify-between md:col-span-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.28em] text-foreground/45 uppercase">
                Planning
              </p>

              <h2 className="mt-10 max-w-[16ch] text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
                Your kitchen, drawn before you commit
              </h2>

              <p className="mt-6 max-w-[38ch] text-[15px] leading-[1.65] tracking-[-0.01em] text-muted">
                A designer measures your site, then three costed plans come back
                within a day. These are the four we start from — the walls
                decide which.
              </p>

              {/* Or draw it yourself. The planner is the real catalogue —
                  every unit, at the widths Modula makes — so what comes out of
                  it is an order, not a wish list. */}
              <button
                type="button"
                onClick={() => {
                  // The generic entry point starts at the style question.
                  setStyleFromCarousel(null);
                  setPlannerOpen(true);
                }}
                className="focus-ring mt-8 inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-[13.5px] tracking-[-0.005em] text-white transition-opacity duration-300 hover:opacity-85"
              >
                Build your own kitchen
                <ArrowRight size={16} strokeWidth={1.75} />
              </button>

              <p className="mt-3 max-w-[34ch] font-mono text-[10px] leading-[1.6] tracking-[0.14em] text-muted uppercase">
                Cabinet by cabinet · real catalogue codes · priced as you place
              </p>
            </div>

            {/* Layout picker doubles as the caption. */}
            <div className="mt-12 flex flex-col">
              {LAYOUTS.map((item, i) => {
                const active = i === index;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => select(i)}
                    aria-current={active}
                    className="focus-ring group relative border-t border-line py-4 text-left last:border-b"
                  >
                    <span className="flex items-baseline justify-between gap-4">
                      <span
                        className={`text-[17px] tracking-[-0.02em] transition-colors duration-300 ${
                          active ? "text-foreground" : "text-foreground/45"
                        } group-hover:text-foreground`}
                      >
                        {item.name}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
                        {item.runLength}
                      </span>
                    </span>

                    {/* The bar is the timer — it fills over one cycle. */}
                    <span className="absolute inset-x-0 top-[-1px] h-px overflow-hidden">
                      {active && (
                        <motion.span
                          key={`${item.id}-${paused}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: paused || reduced ? 0.4 : CYCLE_MS / 1000,
                            ease: paused || reduced ? EASE : "linear",
                          }}
                          className="block h-full origin-left bg-coral"
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── The drawing ──────────────────────────────────────────── */}
          <div
            className="md:col-span-7 md:col-start-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative w-full border border-line bg-surface/40">
              <svg
                viewBox="0 0 640 420"
                className="w-full"
                role="img"
                aria-label={`${layout.name} kitchen plan — ${layout.note}`}
              >
                <defs>
                  <pattern
                    id="plan-grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="1" cy="1" r="1" fill="var(--muted)" opacity="0.28" />
                  </pattern>
                </defs>

                <rect width="640" height="420" fill="url(#plan-grid)" />

                {/* Room shell — the one constant across all four plans. */}
                <rect
                  x={ROOM.x}
                  y={ROOM.y}
                  width={ROOM.w}
                  height={ROOM.h}
                  fill="none"
                  stroke="var(--foreground)"
                  strokeWidth="1.5"
                  opacity="0.28"
                />

                <AnimatePresence mode="wait">
                  <motion.g
                    key={layout.id}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  >
                    {layout.runs.map((run, i) => (
                      <g key={i}>
                        {/* Fill arrives behind the line, once it is drawn. */}
                        <motion.rect
                          x={run.x}
                          y={run.y}
                          width={run.w}
                          height={run.h}
                          fill="var(--foreground)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.07 }}
                          transition={{
                            duration: 0.6,
                            ease: EASE,
                            delay: reduced ? 0 : 0.5 + i * 0.28,
                          }}
                        />
                        <motion.path
                          d={rectPath(run)}
                          fill="none"
                          stroke="var(--foreground)"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          initial={{ pathLength: reduced ? 1 : 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{
                            duration: reduced ? 0 : 0.9,
                            ease: EASE,
                            delay: reduced ? 0 : i * 0.28,
                          }}
                        />
                      </g>
                    ))}

                    {layout.fixtures.map((fixture, i) => (
                      <motion.g
                        key={`${fixture.kind}-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          ease: EASE,
                          delay: reduced
                            ? 0
                            : 0.5 + layout.runs.length * 0.28 + i * 0.12,
                        }}
                      >
                        <FixtureMark fixture={fixture} />
                      </motion.g>
                    ))}
                  </motion.g>
                </AnimatePresence>
              </svg>

              {/* Plan note, set as a drawing title block. */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={layout.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="text-[13.5px] tracking-[-0.01em] text-foreground/70"
                  >
                    {layout.note}
                  </motion.p>
                </AnimatePresence>

                <span className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
                  Plan · Not to scale
                </span>
              </div>
            </div>

            <a
              href="#contact"
              className="focus-ring mt-8 inline-flex items-center gap-3 rounded-full border border-line px-5 py-2.5 text-[13px] tracking-[-0.005em] text-foreground/75 transition-colors duration-300 hover:border-foreground/40 hover:text-foreground"
            >
              Book a site visit
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      <StyleOverlay
        style={KITCHEN_STYLES.find((s) => s.id === exploreStyleId) ?? null}
        onClose={() => setExploreStyleId(null)}
        onBuild={(id) => {
          setExploreStyleId(null);
          setStyleFromCarousel(id);
          setPlannerOpen(true);
        }}
      />

      {/* Keyed on the style so a different one starts a fresh plan — the
          planner seeds its own state from the prop and never syncs to it. */}
      <KitchenPlanner
        key={styleFromCarousel ?? "no-style"}
        open={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        initialStyleId={styleFromCarousel}
      />
    </section>
    </>
  );
}

/**
 * The six styles, on the coverflow rake.
 *
 * The same carousel the hero used to carry, given the content it suits better:
 * these are photographs of rooms, and a raked stack is a good way to look
 * through a set of pictures without committing to any of them. Copy and the
 * call to action hang off whichever card is centred, so the whole block reads
 * as one thing rather than a gallery with a button under it.
 *
 * The button opens the style's own detail page rather than the planner
 * directly — browsing six moodboards and starting a six-step form used to be
 * the same tap, and "Build a glam kitchen" is a heavier commitment than
 * whatever you were doing a second ago flipping through the rake.
 */
function StyleCarousel({ onExplore }: { onExplore: (id: string) => void }) {
  const [index, setIndex] = useState(0);
  const style = KITCHEN_STYLES[index] ?? KITCHEN_STYLES[0];

  const slides: CoverflowSlide[] = KITCHEN_STYLES.map((item) => ({
    src: item.hero,
    alt: `${item.name} kitchen`,
    title: item.name,
    subtitle: item.tagline,
  }));

  return (
    <div>
      <div className="section-shell">
        <p className="font-mono text-[11px] tracking-[0.28em] text-foreground/45 uppercase">
          Styles
        </p>
        <h3 className="mt-6 max-w-[20ch] text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.1] font-medium tracking-[-0.03em] text-balance">
          Six ways to dress the same steel
        </h3>
      </div>

      <div className="mt-10">
        <CoverflowCarousel
          slides={slides}
          onSelectedChange={setIndex}
          showCaption
          showNavigation
          showPagination
          cardWidth="clamp(200px, 46vw, 380px)"
          label="interiOne kitchen styles"
          cardClassName="rounded-2xl"
        />
      </div>

      {/* Whatever is centred, described — and buildable in one tap. */}
      <div className="section-shell mt-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={style.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="max-w-[52ch] text-[14px] leading-[1.65] tracking-[-0.01em] text-muted"
            >
              {style.blurb}
            </motion.p>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => onExplore(style.id)}
            className="focus-ring inline-flex items-center gap-3 rounded-full bg-brown px-6 py-3 text-[13px] tracking-[-0.005em] text-white transition-opacity duration-300 hover:opacity-90"
          >
            Explore {style.name.toLowerCase()} kitchens
            <ArrowRight size={15} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Plan symbols, drawn the way a floor plan draws them. */
function FixtureMark({ fixture }: { fixture: Fixture }) {
  const { kind, x, y, axis } = fixture;
  const stroke = "var(--foreground)";

  if (kind === "sink") {
    const w = axis === "h" ? 46 : 30;
    const h = axis === "h" ? 30 : 46;
    return (
      <g stroke={stroke} strokeWidth="1.4" fill="none" opacity="0.75">
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="3" />
        <circle cx={x} cy={y} r="4" />
      </g>
    );
  }

  if (kind === "hob") {
    const positions =
      axis === "h"
        ? [
            [-13, -8],
            [13, -8],
            [-13, 8],
            [13, 8],
          ]
        : [
            [-8, -13],
            [-8, 13],
            [8, -13],
            [8, 13],
          ];
    return (
      <g stroke="var(--coral)" strokeWidth="1.4" fill="none">
        {positions.map(([dx, dy], i) => (
          <circle key={i} cx={x + dx} cy={y + dy} r="6.5" />
        ))}
      </g>
    );
  }

  // Fridge and tall unit — a block with the diagonal that means "appliance".
  const w = axis === "h" ? 44 : 30;
  const h = axis === "h" ? 30 : 44;
  return (
    <g stroke={stroke} strokeWidth="1.4" fill="none" opacity="0.75">
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} />
      <line x1={x - w / 2} y1={y - h / 2} x2={x + w / 2} y2={y + h / 2} />
      {kind === "tall" && (
        <line x1={x + w / 2} y1={y - h / 2} x2={x - w / 2} y2={y + h / 2} />
      )}
    </g>
  );
}
