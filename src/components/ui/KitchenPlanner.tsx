"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Minus, Plus } from "lucide-react";

import {
  APPLIANCES,
  CABINETS_BY_TIER,
  COUNTER_MATERIALS,
  COUNTER_THICKNESS,
  DRAWER_HARDWARE,
  METAL_FINISHES,
  OPENING_STYLES,
  PLINTH,
  SPLASHBACKS,
  TIER_LABELS,
  getUnit,
  type Appliance,
  type CabinetTier,
  type CabinetUnit,
  type CounterMaterial,
  type HardwareId,
  type MetalId,
  type OpeningId,
  type SplashbackId,
} from "@/data/catalogue";
import { ESTIMATOR_LAYOUTS, LEG_MAX, LEG_MIN, RANGE_RATES } from "@/data/estimator";
import { byRange, finishes, type Finish, type RangeId } from "@/data/finishes";
import { KITCHEN_STYLES } from "@/data/kitchen-styles";
import { LAYOUTS } from "@/data/layouts";
import { lighten, darken } from "@/lib/color";
import { EASE, EASE_UI } from "@/lib/motion";
import { useOverlayLock } from "@/lib/overlay";
import { whatsappLink } from "@/lib/whatsapp";
import {
  WALL_HEIGHT,
  billOfMaterials,
  emptyWall,
  planSummary,
  remaining,
  rowFor,
  runWidth,
  tierBand,
  toMm,
  totals,
  warnings,
  type PlacedUnit,
  type Plan,
  type PlannerWall,
} from "@/lib/planner";
import AnimatedNumber from "./AnimatedNumber";
import CloseButton from "./CloseButton";

/**
 * The kitchen planner.
 *
 * Six questions and then the drawing: which style, what shape the room is, how
 * much wall there is, what goes along it, in what finish — and then the plan,
 * the elevation and the price, all in the finish that was actually chosen.
 *
 * The design principle throughout is that the customer should always be looking
 * at the thing they are choosing. Styles are photographs, not names. Cabinets
 * are drawn at their own proportions, not listed as text with an icon. Finishes
 * are the colour itself. And the plan that comes out at the end is filled with
 * their finish rather than rendered in grey — the point of the last step is
 * recognition, and a grey plan is not recognisable as your kitchen.
 *
 * Units are placed sequentially along a wall rather than dragged onto a canvas.
 * A kitchen is cabinets pushed against each other from a corner outwards, and a
 * list models that better than free positioning: you cannot leave a 40mm hole
 * in the middle of a run, because runs do not have holes.
 *
 * Nothing blocks. An over-long wall or a missing sink is a warning carried to
 * the last step, never a refusal to price — a half-drawn plan is how every plan
 * starts, and the studio would far rather see one than none.
 */

const ROW_TIERS = ["lower", "upper", "loft"] as const;
type RowTier = (typeof ROW_TIERS)[number];

const STEPS = [
  { id: "style", label: "Style", question: "What should it feel like?" },
  { id: "shape", label: "Shape", question: "What shape is the room?" },
  { id: "space", label: "Space", question: "How much wall have you got?" },
  { id: "units", label: "Cabinets", question: "What goes along the wall?" },
  { id: "finish", label: "Finish", question: "How should it be finished?" },
  { id: "result", label: "Your kitchen", question: "Your kitchen, drawn." },
] as const;

const NOMINAL_ROOM_DEPTH = 2600;
const LOWER_DEPTH = 570;
const UPPER_DEPTH = 330;

/** Everything the drawings need to know about colour, in one object. */
export type Palette = {
  base: Finish | null;
  upper: Finish | null;
  counter: CounterMaterial;
  metal: (typeof METAL_FINISHES)[number];
  splash: (typeof SPLASHBACKS)[number];
  opening: OpeningId;
  /** Whether the package includes under-cabinet lighting. */
  lit: boolean;
};

/** Staggered entrances, used by every grid in here. */
const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.06 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

let seq = 0;
const nextKey = () => `u${++seq}`;

/**
 * Each unit paired with how far along the wall it starts.
 *
 * Computed up front rather than with a cursor advanced inside the render loop:
 * a run is a cumulative sum, and mutating a variable mid-render is both a lint
 * error and a real bug the first time React replays that render.
 */
function withOffsets(units: PlacedUnit[]) {
  const out: { placed: PlacedUnit; at: number }[] = [];
  let at = 0;
  for (const placed of units) {
    out.push({ placed, at });
    at += placed.width;
  }
  return out;
}

function startingWalls(layoutId: string): PlannerWall[] {
  const layout =
    ESTIMATOR_LAYOUTS.find((l) => l.id === layoutId) ?? ESTIMATOR_LAYOUTS[0];
  return layout.legs.map((leg, i) =>
    emptyWall(leg.id, `Wall ${String.fromCharCode(65 + i)}`, leg.typical)
  );
}

export default function KitchenPlanner({
  open,
  onClose,
  initialStyleId = null,
}: {
  open: boolean;
  onClose: () => void;
  /** Opened from a style card — skip the style step, it is already answered. */
  initialStyleId?: string | null;
}) {
  // Seeded from the prop rather than synced to it in an effect. The caller
  // remounts this with a `key` when the incoming style changes, which is both
  // simpler than a sync and the right behaviour: a different style is a
  // different kitchen, not an edit to the one in progress.
  const [step, setStep] = useState(initialStyleId ? 1 : 0);
  const [direction, setDirection] = useState(1);

  const [styleId, setStyleId] = useState<string | null>(initialStyleId);
  const [layoutId, setLayoutId] = useState(ESTIMATOR_LAYOUTS[1].id);
  const [walls, setWalls] = useState<PlannerWall[]>(() =>
    startingWalls(ESTIMATOR_LAYOUTS[1].id)
  );
  const [activeWall, setActiveWall] = useState(0);
  const [activeTier, setActiveTier] = useState<CabinetTier>("lower");
  const [range, setRange] = useState<RangeId>("premier");
  const [finishSlug, setFinishSlug] = useState<string | null>(null);
  /** null means "the same as the base units" — the common case. */
  const [upperSlug, setUpperSlug] = useState<string | null>(null);
  const [counterId, setCounterId] = useState(COUNTER_MATERIALS[0].id);
  const [metalId, setMetalId] = useState<MetalId>("matt-black");
  const [splashId, setSplashId] = useState<SplashbackId>("white");
  const [hardware, setHardware] = useState<HardwareId>("antaro");
  const [opening, setOpening] = useState<OpeningId>("gola");
  const [appliances, setAppliances] = useState<string[]>(["hob-60-gas", "sink-single"]);
  const [view, setView] = useState<"plan" | "elevation">("elevation");

  const style = KITCHEN_STYLES.find((s) => s.id === styleId) ?? null;
  const rangeFinishes = useMemo(() => byRange(range), [range]);
  const finish =
    rangeFinishes.find((f) => f.slug === finishSlug) ?? rangeFinishes[0] ?? null;

  /**
   * Every colour in the room, resolved in one place.
   *
   * Wall units may be a different finish from the base — two-tone is the norm
   * here, not an exception — and the counter, the metal and the splashback are
   * three more decisions that change what the drawing looks like far more than
   * the cabinet layout does.
   */
  const palette: Palette = useMemo(() => {
    const base = finish;
    const upper = upperSlug
      ? (finishes.find((f) => f.slug === upperSlug) ?? base)
      : base;
    return {
      base,
      upper,
      counter:
        COUNTER_MATERIALS.find((m) => m.id === counterId) ?? COUNTER_MATERIALS[0],
      metal: METAL_FINISHES.find((m) => m.id === metalId) ?? METAL_FINISHES[0],
      splash: SPLASHBACKS.find((s) => s.id === splashId) ?? SPLASHBACKS[0],
      opening,
      lit: range !== "select",
    };
  }, [finish, upperSlug, counterId, metalId, splashId, opening, range]);

  const plan: Plan = useMemo(
    () => ({ layoutId, walls, range, opening, counterId, appliances }),
    [layoutId, walls, range, opening, counterId, appliances]
  );

  const sums = useMemo(() => totals(plan, range), [plan, range]);
  const bom = useMemo(() => billOfMaterials(plan, range), [plan, range]);
  const issues = useMemo(() => warnings(plan), [plan]);

  const wall = walls[Math.min(activeWall, walls.length - 1)];
  const placedCount = walls.reduce(
    (sum, w) => sum + w.rows.lower.length + w.rows.upper.length + w.rows.loft.length,
    0
  );

  // Locks the page scroll and tells the floating WhatsApp button to get out of
  // the way — it is fixed to the same bottom-right corner as "Next", and it was
  // swallowing the tap that advances the step.
  useOverlayLock(open);

  /**
   * Rendered into `body`, not in place.
   *
   * This component is a child of the planning section, so its `z-index` was
   * competing with everything else on the page — and losing to a carousel arrow
   * that had claimed `z-[200]`. A takeover has no business being sorted against
   * page furniture at all: in a portal at the top of the document it is above
   * the page by structure rather than by winning an argument about numbers.
   *
   * Read straight off `document` rather than latched in an effect: `open` can
   * only become true from a click, so by the time there is anything to show,
   * body exists. On the server this is null and on the client's first render the
   * portal's children are empty, so both produce no DOM and hydration matches.
   */
  const portal = typeof document === "undefined" ? null : document.body;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const go = (to: number) => {
    if (to < 0 || to >= STEPS.length) return;
    setDirection(to > step ? 1 : -1);
    setStep(to);
  };

  const pickStyle = (id: string) => {
    setStyleId(id);
    window.setTimeout(() => go(1), 260);
  };

  const pickLayout = (id: string) => {
    setLayoutId(id);
    setWalls(startingWalls(id));
    setActiveWall(0);
    window.setTimeout(() => go(2), 260);
  };

  const setWallLength = (index: number, value: string) => {
    if (value !== "" && !/^\d{0,2}(\.\d{0,2})?$/.test(value)) return;
    setWalls((prev) =>
      prev.map((w, i) =>
        i === index ? { ...w, lengthFt: value === "" ? 0 : Number(value) } : w
      )
    );
  };

  const clampWall = (index: number) =>
    setWalls((prev) =>
      prev.map((w, i) => {
        if (i !== index || !w.lengthFt) return w;
        const clamped = Math.min(LEG_MAX, Math.max(LEG_MIN, w.lengthFt));
        return { ...w, lengthFt: Math.round(clamped * 10) / 10 };
      })
    );

  const addUnit = (unit: CabinetUnit, width: number) => {
    const row = rowFor(unit);
    setWalls((prev) =>
      prev.map((w, i) =>
        i === activeWall
          ? {
              ...w,
              rows: {
                ...w.rows,
                [row]: [
                  ...w.rows[row],
                  { key: nextKey(), unitId: unit.id, width, hardware },
                ],
              },
            }
          : w
      )
    );
  };

  const mutateRow = (row: RowTier, fn: (units: PlacedUnit[]) => PlacedUnit[]) =>
    setWalls((prev) =>
      prev.map((w, i) =>
        i === activeWall ? { ...w, rows: { ...w.rows, [row]: fn(w.rows[row]) } } : w
      )
    );

  const removeUnit = (row: RowTier, key: string) =>
    mutateRow(row, (units) => units.filter((u) => u.key !== key));

  const moveUnit = (row: RowTier, key: string, by: number) =>
    mutateRow(row, (units) => {
      const at = units.findIndex((u) => u.key === key);
      const to = at + by;
      if (at < 0 || to < 0 || to >= units.length) return units;
      const next = [...units];
      const [moved] = next.splice(at, 1);
      next.splice(to, 0, moved);
      return next;
    });

  const editorRow: RowTier = activeTier === "tall" ? "lower" : activeTier;

  const canAdvance =
    (step !== 2 || walls.every((w) => w.lengthFt > 0)) &&
    (step !== 3 || placedCount > 0);

  const ui = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", transition: { duration: 0.5, ease: EASE_UI } }}
          transition={{ duration: 0.7, ease: EASE }}
          className="fixed inset-0 z-[100] flex flex-col bg-background"
          role="dialog"
          aria-modal="true"
          aria-label="Kitchen planner"
        >
          {/* ── Ambience ───────────────────────────────────────────────
              The chosen style, blurred to almost nothing behind the whole
              takeover. Not decoration: it is what keeps the six steps feeling
              like one room rather than six forms. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <AnimatePresence>
              {style && (
                <motion.div
                  key={style.id}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Image
                    src={style.hero}
                    alt=""
                    fill
                    sizes="100vw"
                    className="scale-110 object-cover blur-3xl"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-background/88" />
          </div>

          {/* ── Bar ────────────────────────────────────────────────── */}
          {/* Opaque, not just blurred: the body scrolls underneath these two
              bars, and content sliding through a translucent header reads as a
              rendering fault rather than as depth. */}
          <header className="relative z-10 shrink-0 border-b border-line/70 bg-background/92 px-5 py-3 backdrop-blur-md sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-[0.24em] text-muted uppercase">
                  Build your own kitchen
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={STEPS[step].id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: EASE_UI }}
                    className="truncate text-[14px] tracking-[-0.015em]"
                  >
                    {STEPS[step].question}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="-mr-3 shrink-0">
                <CloseButton onClick={onClose} label="Close the planner" />
              </div>
            </div>

            <ol className="mt-3 flex items-center gap-1.5 sm:gap-3">
              {STEPS.map((item, i) => {
                const done = i < step;
                const now = i === step;
                return (
                  <li key={item.id} className="flex-1">
                    <button
                      type="button"
                      onClick={() => done && go(i)}
                      disabled={!done}
                      aria-current={now ? "step" : undefined}
                      className="focus-ring flex w-full flex-col gap-1.5 rounded text-left"
                    >
                      <span className="relative h-[3px] w-full overflow-hidden rounded-full bg-foreground/12">
                        <motion.span
                          className="absolute inset-y-0 left-0 rounded-full bg-brown"
                          initial={false}
                          animate={{ width: now || done ? "100%" : "0%" }}
                          transition={{ duration: 0.6, ease: EASE }}
                          style={{ opacity: done ? 0.45 : 1 }}
                        />
                      </span>
                      <span
                        className={`font-mono text-[8.5px] tracking-[0.12em] uppercase transition-colors duration-500 sm:text-[9px] ${
                          now
                            ? "text-brown"
                            : done
                              ? "text-foreground/50"
                              : "text-foreground/30"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </header>

          {/* ── Body ───────────────────────────────────────────────────
              `data-lenis-prevent` is not optional. Lenis drives the page's
              scroll and swallows the wheel event before this container ever
              sees it, so without the opt-out the planner simply does not
              scroll — which is exactly how it shipped the first time. */}
          <div
            data-lenis-prevent
            className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={STEPS[step].id}
                initial={{ opacity: 0, x: direction * 34 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -34 }}
                transition={{ duration: 0.38, ease: EASE_UI }}
                className="mx-auto w-full max-w-[88rem] px-5 py-8 sm:px-8"
              >
                {step === 0 && <StyleStep value={styleId} onChange={pickStyle} />}

                {step === 1 && <ShapeStep value={layoutId} onChange={pickLayout} />}

                {step === 2 && (
                  <SpaceStep
                    walls={walls}
                    layoutId={layoutId}
                    palette={palette}
                    onChange={setWallLength}
                    onBlur={clampWall}
                  />
                )}

                {step === 3 && (
                  <UnitsStep
                    walls={walls}
                    wall={wall}
                    palette={palette}
                    activeWall={activeWall}
                    setActiveWall={setActiveWall}
                    activeTier={activeTier}
                    setActiveTier={setActiveTier}
                    editorRow={editorRow}
                    onAdd={addUnit}
                    onRemove={removeUnit}
                    onMove={moveUnit}
                  />
                )}

                {step === 4 && (
                  <FinishStep
                    range={range}
                    setRange={setRange}
                    finishes={rangeFinishes}
                    palette={palette}
                    setFinishSlug={setFinishSlug}
                    upperSlug={upperSlug}
                    setUpperSlug={setUpperSlug}
                    counterId={counterId}
                    setCounterId={setCounterId}
                    metalId={metalId}
                    setMetalId={setMetalId}
                    splashId={splashId}
                    setSplashId={setSplashId}
                    hardware={hardware}
                    setHardware={setHardware}
                    opening={opening}
                    setOpening={setOpening}
                    appliances={appliances}
                    setAppliances={setAppliances}
                    style={style}
                  />
                )}

                {step === 5 && (
                  <ResultStep
                    plan={plan}
                    walls={walls}
                    wall={wall}
                    activeWall={activeWall}
                    setActiveWall={setActiveWall}
                    layoutId={layoutId}
                    view={view}
                    setView={setView}
                    range={range}
                    palette={palette}
                    style={style}
                    bom={bom}
                    sums={sums}
                    issues={issues}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Navigation ─────────────────────────────────────────── */}
          <footer className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-t border-line/70 bg-background/92 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-8">
            {/* On the first step there is no step behind this one, so the slot
                becomes the way out instead of an invisible dead control — the
                old version rendered "Back" at opacity 0 there, which looks
                exactly like a button that has stopped working. */}
            <button
              type="button"
              onClick={() => (step === 0 ? onClose() : go(step - 1))}
              className="focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] text-foreground/60 transition-colors duration-300 hover:text-foreground"
            >
              <ArrowLeft size={15} strokeWidth={1.75} />
              {step === 0 ? "Close" : "Back"}
            </button>

            <span className="hidden font-mono text-[10px] tracking-[0.16em] text-muted uppercase sm:block">
              {placedCount} units · {sums.counterFeet} ft ·{" "}
              <span className="text-foreground">
                ₹<AnimatedNumber value={sums.total} />
              </span>
            </span>

            {step === STEPS.length - 1 ? (
              <a
                href={whatsappLink(planSummary(plan, range))}
                target="_blank"
                rel="noreferrer noopener"
                className="focus-ring inline-flex items-center gap-2.5 rounded-full bg-brown px-6 py-3 text-[13px] text-white transition-opacity duration-300 hover:opacity-90"
              >
                Send to the studio
                <ArrowRight size={15} strokeWidth={1.75} />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => go(step + 1)}
                disabled={!canAdvance}
                className="focus-ring inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 text-[13px] text-white transition-opacity duration-300 enabled:hover:opacity-85 disabled:opacity-30"
              >
                {step === 4 ? "Draw my kitchen" : "Next"}
                <ArrowRight size={15} strokeWidth={1.75} />
              </button>
            )}
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return portal ? createPortal(ui, portal) : null;
}

/* ── Step 1 · style ──────────────────────────────────────────────────────── */

function StyleStep({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <p className="max-w-[54ch] text-[14px] leading-[1.6] text-muted">
        Same steel underneath, six ways of dressing it. This sets the finishes
        we suggest later — you can change any of it.
      </p>

      <motion.ul
        variants={grid}
        initial="hidden"
        animate="show"
        className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {KITCHEN_STYLES.map((item) => {
          const on = item.id === value;
          return (
            <motion.li key={item.id} variants={card}>
              <button
                type="button"
                onClick={() => onChange(item.id)}
                aria-pressed={on}
                className={`focus-ring group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 text-left transition-colors duration-500 ${
                  on ? "border-brown" : "border-transparent hover:border-brown/40"
                }`}
              >
                <Image
                  src={item.hero}
                  alt={`${item.name} kitchen`}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-brown-deep/85 via-brown-deep/25 to-transparent" />

                <AnimatePresence>
                  {on && (
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE_UI }}
                      className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-brown text-white"
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </motion.span>
                  )}
                </AnimatePresence>

                <span className="absolute inset-x-5 bottom-4">
                  <span className="block text-[19px] font-medium tracking-[-0.02em] text-white">
                    {item.name}
                  </span>
                  <span className="mt-0.5 block font-mono text-[9.5px] tracking-[0.18em] text-white/65 uppercase">
                    {item.tagline}
                  </span>
                  {/* Held back until hover — six paragraphs at once is a wall
                      of text over six photographs. */}
                  <span className="mt-0 block max-h-0 overflow-hidden text-[12.5px] leading-[1.5] text-white/80 opacity-0 transition-all duration-500 group-hover:mt-2 group-hover:max-h-24 group-hover:opacity-100">
                    {item.blurb}
                  </span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}

/* ── Step 2 · shape ──────────────────────────────────────────────────────── */

function ShapeStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <p className="max-w-[52ch] text-[14px] leading-[1.6] text-muted">
        Pick the shape your walls already make. An island is quoted on the
        survey — it is not priced off a wall run.
      </p>

      <motion.div
        variants={grid}
        initial="hidden"
        animate="show"
        className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        {ESTIMATOR_LAYOUTS.map((option) => {
          const plan = LAYOUTS.find((l) => l.id === option.id);
          const on = option.id === value;
          return (
            <motion.button
              key={option.id}
              variants={card}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: EASE_UI }}
              type="button"
              onClick={() => onChange(option.id)}
              data-selected={on}
              className="card-modula focus-ring flex flex-col gap-4 bg-cream/80 p-5 text-left"
            >
              <span className="block h-24 w-full text-foreground/70">
                {plan && (
                  <svg viewBox="0 0 640 420" className="h-full w-full" aria-hidden="true">
                    <rect
                      x="8"
                      y="8"
                      width="624"
                      height="404"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      opacity="0.18"
                    />
                    {plan.runs.map((run, i) => (
                      <motion.rect
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 0.5, scale: 1 }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.08 }}
                        x={run.x}
                        y={run.y}
                        width={run.w}
                        height={run.h}
                        fill="currentColor"
                      />
                    ))}
                  </svg>
                )}
              </span>
              <span>
                <span className="block text-[15px] tracking-[-0.015em]">
                  {option.name}
                </span>
                <span className="mt-1 block text-[12.5px] leading-[1.45] text-muted">
                  {option.prompt}
                </span>
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ── Step 3 · space ──────────────────────────────────────────────────────── */

function SpaceStep({
  walls,
  layoutId,
  palette,
  onChange,
  onBlur,
}: {
  walls: PlannerWall[];
  layoutId: string;
  palette: Palette;
  onChange: (index: number, value: string) => void;
  onBlur: (index: number) => void;
}) {
  const legs = ESTIMATOR_LAYOUTS.find((l) => l.id === layoutId)?.legs ?? [];

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <p className="max-w-[46ch] text-[14px] leading-[1.6] text-muted">
          Wall by wall, corner to end. Decimals welcome — a wall is 12.4 ft, not
          12, and at cabinet widths that difference is a whole unit.
        </p>

        <motion.div
          variants={grid}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-col gap-4"
        >
          {walls.map((w, i) => (
            <motion.label
              key={w.id}
              variants={card}
              className="flex items-center justify-between gap-6 rounded-2xl border border-line bg-background/60 px-5 py-4 transition-colors duration-300 focus-within:border-brown"
            >
              <span>
                <span className="block text-[14px] tracking-[-0.01em]">{w.label}</span>
                <span className="block font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                  {legs[i]?.hint ?? "Run"}
                </span>
              </span>
              <span className="flex items-baseline gap-1.5">
                <input
                  type="text"
                  inputMode="decimal"
                  value={w.lengthFt || ""}
                  onChange={(e) => onChange(i, e.target.value)}
                  onBlur={() => onBlur(i)}
                  placeholder="0"
                  aria-label={`${w.label} in feet`}
                  className="w-20 bg-transparent text-right text-[26px] tracking-[-0.03em] tabular-nums outline-none placeholder:text-foreground/25"
                />
                <span className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                  ft
                </span>
              </span>
            </motion.label>
          ))}
        </motion.div>

        <p className="mt-5 font-mono text-[10px] leading-[1.7] tracking-[0.14em] text-muted uppercase">
          {LEG_MIN}–{LEG_MAX} ft per wall ·{" "}
          {walls.reduce((s, w) => s + Math.round(toMm(w.lengthFt)), 0)} mm in total
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="rounded-2xl border border-line bg-surface/50 p-5"
      >
        <PlanView walls={walls} layoutId={layoutId} palette={palette} />
        <p className="mt-3 text-center font-mono text-[9.5px] tracking-[0.18em] text-muted uppercase">
          Empty room · to scale
        </p>
      </motion.div>
    </div>
  );
}

/* ── Step 4 · cabinets ───────────────────────────────────────────────────── */

function UnitsStep({
  walls,
  wall,
  palette,
  activeWall,
  setActiveWall,
  activeTier,
  setActiveTier,
  editorRow,
  onAdd,
  onRemove,
  onMove,
}: {
  walls: PlannerWall[];
  wall: PlannerWall;
  palette: Palette;
  activeWall: number;
  setActiveWall: (i: number) => void;
  activeTier: CabinetTier;
  setActiveTier: (t: CabinetTier) => void;
  editorRow: RowTier;
  onAdd: (unit: CabinetUnit, width: number) => void;
  onRemove: (row: RowTier, key: string) => void;
  onMove: (row: RowTier, key: string, by: number) => void;
}) {
  const wallMm = toMm(wall.lengthFt);
  const usedMm = runWidth(wall.rows[editorRow]);
  const pct = wallMm > 0 ? Math.min(100, (usedMm / wallMm) * 100) : 0;
  const over = usedMm > wallMm;

  return (
    <div className="flex flex-col gap-7">
      {/* Which wall, and how full it is. The meter is the whole feedback
          loop of this step — it is how you know when to stop adding. */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {walls.map((w, i) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setActiveWall(i)}
              aria-pressed={i === activeWall}
              className={`focus-ring rounded-xl border px-3.5 py-2 text-left transition-colors duration-300 ${
                i === activeWall
                  ? "border-brown bg-brown/10"
                  : "border-line hover:border-foreground/30"
              }`}
            >
              <span className="block font-mono text-[9px] tracking-[0.18em] text-muted uppercase">
                {w.label} · {w.lengthFt} ft
              </span>
              <span className="mt-0.5 block text-[12.5px] tabular-nums">
                {w.rows.lower.length + w.rows.upper.length + w.rows.loft.length} units
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-foreground/10">
            <motion.span
              className={`absolute inset-y-0 left-0 rounded-full ${over ? "bg-coral" : "bg-brown"}`}
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 180, damping: 26 }}
            />
          </span>
          <span className="shrink-0 font-mono text-[10px] tracking-[0.14em] text-muted uppercase tabular-nums">
            <RemainingLabel wall={wall} tier={editorRow} />
          </span>
        </div>

        <div className="mt-4">
          <Chips
            options={(["lower", "upper", "loft", "tall"] as CabinetTier[]).map((t) => ({
              id: t,
              label: TIER_LABELS[t],
            }))}
            value={activeTier}
            onChange={(v) => setActiveTier(v as CabinetTier)}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* The catalogue, drawn. Each unit is shown at its own proportions
            with its own front — a 3-drawer bank looks like one, which is
            faster to scan than any amount of naming. */}
        <div className="lg:col-span-7 xl:col-span-8">
          <motion.ul
            key={activeTier}
            variants={grid}
            initial="hidden"
            animate="show"
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
          >
            {CABINETS_BY_TIER[activeTier].map((unit) => (
              <motion.li
                key={unit.id}
                variants={card}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: EASE_UI }}
                className="flex flex-col overflow-hidden rounded-2xl border border-line bg-background/70"
              >
                <span className="flex h-28 items-end justify-center bg-surface/60 px-4 pt-4">
                  <UnitPortrait unit={unit} palette={palette} />
                </span>

                <span className="flex flex-1 flex-col p-4">
                  <span className="text-[13.5px] leading-[1.35] tracking-[-0.01em]">
                    {unit.name}
                  </span>
                  <span className="mt-1 font-mono text-[9.5px] tracking-[0.14em] text-muted uppercase">
                    D{unit.depth} · H{unit.height}
                  </span>
                  {unit.note && (
                    <span className="mt-1.5 text-[12px] leading-[1.45] text-muted">
                      {unit.note}
                    </span>
                  )}

                  <span className="mt-3 flex flex-wrap gap-1.5">
                    {unit.widths.map((width) => (
                      <button
                        key={width}
                        type="button"
                        onClick={() => onAdd(unit, width)}
                        title={`Add ${unit.name} ${width}mm · ${unit.codes[width] ?? ""}`}
                        className="focus-ring inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-foreground/65 transition-colors duration-300 hover:border-brown hover:bg-brown hover:text-white active:scale-95"
                      >
                        <Plus size={10} strokeWidth={2.5} />
                        {width}
                      </button>
                    ))}
                  </span>
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* The run so far, live. */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="lg:sticky lg:top-2">
            <p className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
              {wall.label} · {TIER_LABELS[activeTier]} run
            </p>

            <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface/40 p-3">
              <RunStrip wall={wall} tier={editorRow} palette={palette} />
            </div>

            {wall.rows[editorRow].length === 0 ? (
              <p className="mt-4 text-[13px] leading-[1.6] text-muted">
                Nothing here yet. Add a unit and it lands at the end of the run,
                left to right from the corner.
              </p>
            ) : (
              <ol className="mt-3 flex flex-col gap-1.5">
                <AnimatePresence initial={false}>
                  {wall.rows[editorRow].map((placed, i) => {
                    const unit = getUnit(placed.unitId);
                    if (!unit) return null;
                    return (
                      <motion.li
                        key={placed.key}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: EASE_UI }}
                        className="flex items-center gap-2 rounded-xl border border-line bg-background/70 px-3 py-2"
                      >
                        <span className="w-4 shrink-0 font-mono text-[10px] text-muted tabular-nums">
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px]">{unit.name}</span>
                          <span className="block font-mono text-[9.5px] tracking-[0.12em] text-muted uppercase">
                            {unit.codes[placed.width] ?? "—"} · {placed.width}mm
                          </span>
                        </span>
                        <IconButton
                          label="Move left"
                          onClick={() => onMove(editorRow, placed.key, -1)}
                        >
                          <ArrowLeft size={13} strokeWidth={1.75} />
                        </IconButton>
                        <IconButton
                          label="Move right"
                          onClick={() => onMove(editorRow, placed.key, 1)}
                        >
                          <ArrowRight size={13} strokeWidth={1.75} />
                        </IconButton>
                        <IconButton
                          label="Remove"
                          onClick={() => onRemove(editorRow, placed.key)}
                        >
                          <Minus size={13} strokeWidth={1.75} />
                        </IconButton>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** The active run, drawn to scale as a strip — the elevation in miniature. */
function RunStrip({
  wall,
  tier,
  palette,
}: {
  wall: PlannerWall;
  tier: RowTier;
  palette: Palette;
}) {
  const wallMm = Math.max(toMm(wall.lengthFt), 1000);
  const h = 220;

  return (
    <svg viewBox={`0 0 ${wallMm} ${h}`} className="w-full" aria-hidden="true">
      <FinishDefs palette={palette} />
      <rect
        x="0"
        y="0"
        width={wallMm}
        height={h}
        fill="none"
        stroke="var(--foreground)"
        strokeWidth="6"
        strokeDasharray="22 18"
        opacity="0.2"
      />
      <AnimatePresence initial={false}>
        {withOffsets(wall.rows[tier]).map(({ placed, at }) => (
          <motion.rect
            key={placed.key}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_UI }}
            x={at + 6}
            y={6}
            width={Math.max(placed.width - 12, 8)}
            height={h - 12}
            rx="8"
            fill="url(#finish-face)"
            stroke="var(--foreground)"
            strokeWidth="5"
            strokeOpacity="0.5"
          />
        ))}
      </AnimatePresence>
    </svg>
  );
}

/* ── Step 5 · finish ─────────────────────────────────────────────────────── */

function FinishStep({
  range,
  setRange,
  finishes,
  palette,
  setFinishSlug,
  upperSlug,
  setUpperSlug,
  counterId,
  setCounterId,
  metalId,
  setMetalId,
  splashId,
  setSplashId,
  hardware,
  setHardware,
  opening,
  setOpening,
  appliances,
  setAppliances,
  style,
}: {
  range: RangeId;
  setRange: (r: RangeId) => void;
  finishes: Finish[];
  palette: Palette;
  setFinishSlug: (s: string) => void;
  upperSlug: string | null;
  setUpperSlug: (s: string | null) => void;
  counterId: string;
  setCounterId: (s: string) => void;
  metalId: MetalId;
  setMetalId: (s: MetalId) => void;
  splashId: SplashbackId;
  setSplashId: (s: SplashbackId) => void;
  hardware: HardwareId;
  setHardware: (h: HardwareId) => void;
  opening: OpeningId;
  setOpening: (o: OpeningId) => void;
  appliances: string[];
  setAppliances: (fn: (prev: string[]) => string[]) => void;
  style: (typeof KITCHEN_STYLES)[number] | null;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="flex flex-col gap-8 lg:col-span-7">
        <section>
          <h3 className="mb-4 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            Range
          </h3>
          <Chips
            options={(["select", "premier", "signature"] as RangeId[]).map((id) => ({
              id,
              label: RANGE_RATES[id].label,
            }))}
            value={range}
            onChange={(v) => setRange(v as RangeId)}
          />
          <p className="mt-3 font-mono text-[10px] tracking-[0.12em] text-brown">
            {money(RANGE_RATES[range].perSqFt)}/SQ FT · {RANGE_RATES[range].note}
          </p>
        </section>

        {/* The colour itself, at a size you can judge. */}
        <section>
          <h3 className="mb-4 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            Finish · {finishes.length} in this range
          </h3>
          <motion.ul
            key={range}
            variants={grid}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          >
            {finishes.map((item) => {
              const on = item.slug === palette.base?.slug;
              return (
                <motion.li key={item.slug} variants={card}>
                  <button
                    type="button"
                    onClick={() => setFinishSlug(item.slug)}
                    aria-pressed={on}
                    className={`focus-ring group block w-full overflow-hidden rounded-xl border-2 text-left transition-all duration-300 ${
                      on
                        ? "border-brown shadow-[var(--shadow-card)]"
                        : "border-transparent hover:border-brown/40"
                    }`}
                  >
                    <span
                      className="relative block h-20 w-full transition-transform duration-500 group-hover:scale-[1.03]"
                      style={{
                        background: `linear-gradient(150deg, ${lighten(item.hex, 0.1)} 0%, ${item.hex} 55%, ${darken(item.grain, 0.05)} 100%)`,
                      }}
                    >
                      <AnimatePresence>
                        {on && (
                          <motion.span
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-brown text-white"
                          >
                            <Check size={12} strokeWidth={2.5} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span className="block bg-background/80 px-2.5 py-2">
                      <span className="block truncate text-[12px] tracking-[-0.01em]">
                        {item.name}
                      </span>
                      <span className="block font-mono text-[9px] tracking-[0.12em] text-muted uppercase">
                        {item.code} · {item.type}
                      </span>
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        </section>

        {/* Two-tone is the norm here, not an exception — dark bases with pale
            wall units is the single most-asked-for kitchen in Hyderabad. */}
        <section>
          <h3 className="mb-4 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            Wall units
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setUpperSlug(null)}
              aria-pressed={upperSlug === null}
              className={`focus-ring rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors duration-300 ${
                upperSlug === null
                  ? "border-brown bg-brown/10"
                  : "border-line text-foreground/55 hover:border-foreground/30"
              }`}
            >
              Same as base
            </button>

            {finishes.map((item) => {
              const on = item.slug === upperSlug;
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => setUpperSlug(item.slug)}
                  aria-pressed={on}
                  title={`${item.name} · ${item.code}`}
                  aria-label={`Wall units in ${item.name}`}
                  className={`focus-ring h-9 w-9 rounded-full border-2 transition-transform duration-300 hover:scale-110 ${
                    on ? "border-brown" : "border-transparent"
                  }`}
                  style={{
                    background: `linear-gradient(145deg, ${lighten(item.hex, 0.12)}, ${item.hex} 60%, ${darken(item.grain, 0.05)})`,
                  }}
                />
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="mb-4 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            Countertop
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {COUNTER_MATERIALS.map((item) => {
              const on = item.id === counterId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCounterId(item.id)}
                  aria-pressed={on}
                  className={`focus-ring overflow-hidden rounded-xl border-2 text-left transition-colors duration-300 ${
                    on ? "border-brown" : "border-transparent hover:border-brown/40"
                  }`}
                >
                  <span
                    className="block h-12 w-full"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${lighten(item.hex, 0.14)}, ${item.hex} 60%), ${item.hex}`,
                      boxShadow: `inset 0 -6px 10px -6px ${darken(item.hex, 0.4)}`,
                    }}
                  />
                  <span className="block bg-background/80 px-2.5 py-1.5">
                    <span className="block truncate text-[12px]">{item.name}</span>
                    <span className="block font-mono text-[9px] tracking-[0.12em] text-muted uppercase">
                      {item.perFoot === 0 ? "No charge" : `${money(item.perFoot)}/ft`}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="mb-4 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            Handles and profiles
          </h3>
          <div className="flex flex-wrap gap-2">
            {METAL_FINISHES.map((item) => {
              const on = item.id === metalId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMetalId(item.id)}
                  aria-pressed={on}
                  className={`focus-ring flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-1.5 text-[12.5px] transition-colors duration-300 ${
                    on ? "border-brown bg-brown/10" : "border-line hover:border-foreground/30"
                  }`}
                >
                  <span
                    className="h-5 w-5 rounded-full"
                    style={{
                      background: `linear-gradient(140deg, ${item.sheen}, ${item.hex} 55%, ${darken(item.hex, 0.3)})`,
                    }}
                  />
                  {item.name}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="mb-4 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            Splashback
          </h3>
          <div className="flex flex-wrap gap-2">
            {SPLASHBACKS.map((item) => {
              const on = item.id === splashId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSplashId(item.id)}
                  aria-pressed={on}
                  className={`focus-ring flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-1.5 text-[12.5px] transition-colors duration-300 ${
                    on ? "border-brown bg-brown/10" : "border-line hover:border-foreground/30"
                  }`}
                >
                  <span
                    className="h-5 w-5 rounded-full border"
                    style={{ background: item.hex, borderColor: item.grout }}
                  />
                  {item.name}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="mb-4 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            Drawer hardware
          </h3>
          <Chips
            options={DRAWER_HARDWARE.map((h) => ({ id: h.id, label: h.name }))}
            value={hardware}
            onChange={(v) => setHardware(v as HardwareId)}
          />
          <p className="mt-2 text-[12.5px] text-muted">
            {DRAWER_HARDWARE.find((h) => h.id === hardware)?.note} · applies to
            units added from here on.
          </p>

          <h3 className="mt-6 mb-4 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            How it opens
          </h3>
          <Chips
            options={OPENING_STYLES.map((o) => ({ id: o.id, label: o.name }))}
            value={opening}
            onChange={(v) => setOpening(v as OpeningId)}
          />
          <p className="mt-2 text-[12.5px] text-muted">
            {OPENING_STYLES.find((o) => o.id === opening)?.note}
          </p>
        </section>
      </div>

      <div className="flex flex-col gap-6 lg:col-span-5">
        {/* The style's own material board, as shot. */}
        {style && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h3 className="mb-3 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
              {style.name} board
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {style.moodboard.slice(0, 6).map((src, i) => (
                <motion.span
                  key={src}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
                  className="relative block aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="12vw"
                    className="object-cover transition-transform duration-700 hover:scale-110"
                  />
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        <section>
          <h3 className="mb-3 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            Appliances
          </h3>
          <div className="flex flex-col gap-2">
            {APPLIANCES.map((appliance) => {
              const on = appliances.includes(appliance.id);
              return (
                <button
                  key={appliance.id}
                  type="button"
                  onClick={() =>
                    setAppliances((prev) =>
                      prev.includes(appliance.id)
                        ? prev.filter((x) => x !== appliance.id)
                        : [...prev, appliance.id]
                    )
                  }
                  aria-pressed={on}
                  className={`focus-ring flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors duration-300 ${
                    on
                      ? "border-brown bg-brown/[0.07]"
                      : "border-line hover:border-foreground/25"
                  }`}
                >
                  {/* A photograph when there is one, the drawing until then —
                      a list of appliance names with no pictures is the hardest
                      kind of list to choose from. */}
                  {appliance.image ? (
                    <span className="relative block h-11 w-16 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={appliance.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <ApplianceGlyph appliance={appliance} palette={palette} />
                  )}

                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] tracking-[-0.01em]">
                      {appliance.name}
                    </span>
                    <span className="block font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
                      {appliance.brand} · {appliance.spec}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-foreground/70">
                    {money(appliance.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Step 6 · the drawing ────────────────────────────────────────────────── */

function ResultStep({
  plan,
  walls,
  wall,
  activeWall,
  setActiveWall,
  layoutId,
  view,
  setView,
  range,
  palette,
  style,
  bom,
  sums,
  issues,
}: {
  plan: Plan;
  walls: PlannerWall[];
  wall: PlannerWall;
  activeWall: number;
  setActiveWall: (i: number) => void;
  layoutId: string;
  view: "plan" | "elevation";
  setView: (v: "plan" | "elevation") => void;
  range: RangeId;
  palette: Palette;
  style: (typeof KITCHEN_STYLES)[number] | null;
  bom: ReturnType<typeof billOfMaterials>;
  sums: ReturnType<typeof totals>;
  issues: string[];
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7 xl:col-span-8">
        {/* The board: what it looks like, in what colour. */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="grid gap-3 sm:grid-cols-3"
        >
          {style && (
            <span className="relative col-span-2 block aspect-[16/9] overflow-hidden rounded-2xl sm:aspect-auto sm:h-40">
              <Image
                src={style.hero}
                alt={`${style.name} kitchen`}
                fill
                sizes="50vw"
                className="object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-brown-deep/80 to-transparent" />
              <span className="absolute inset-x-4 bottom-3">
                <span className="block text-[15px] font-medium text-white">
                  {style.name}
                </span>
                <span className="block font-mono text-[9px] tracking-[0.16em] text-white/65 uppercase">
                  {style.tagline}
                </span>
              </span>
            </span>
          )}

          {palette.base && (
            <span
              className="relative block h-40 overflow-hidden rounded-2xl"
              style={{
                background: `linear-gradient(150deg, ${lighten(palette.base.hex, 0.12)} 0%, ${palette.base.hex} 55%, ${darken(palette.base.grain, 0.05)} 100%)`,
              }}
            >
              <span className="absolute inset-x-4 bottom-3">
                <span className="block text-[14px] font-medium text-white drop-shadow">
                  {palette.base.name}
                </span>
                <span className="block font-mono text-[9px] tracking-[0.16em] text-white/80 uppercase drop-shadow">
                  {palette.base.code} · {palette.base.sheen}
                </span>
              </span>
            </span>
          )}
        </motion.div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Chips
            options={[
              { id: "plan", label: "Plan" },
              { id: "elevation", label: "Elevation" },
            ]}
            value={view}
            onChange={(v) => setView(v as "plan" | "elevation")}
          />

          {view === "elevation" && walls.length > 1 && (
            <Chips
              options={walls.map((w, i) => ({ id: String(i), label: w.label }))}
              value={String(activeWall)}
              onChange={(v) => setActiveWall(Number(v))}
            />
          )}

          <span className="font-mono text-[9.5px] tracking-[0.18em] text-muted uppercase">
            Millimetres
          </span>
        </div>

        <motion.div
          key={`${view}-${activeWall}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-4 rounded-2xl border border-line bg-surface/50 p-4 sm:p-6"
        >
          {view === "plan" ? (
            <PlanView walls={walls} layoutId={layoutId} palette={palette} animate />
          ) : (
            <Elevation wall={wall} palette={palette} animate />
          )}
        </motion.div>

        {issues.length > 0 && (
          <ul className="mt-4 flex flex-col gap-1.5 rounded-2xl border border-coral/30 bg-coral/[0.06] p-4">
            {issues.map((issue) => (
              <li
                key={issue}
                className="flex gap-2 text-[12.5px] leading-[1.5] text-foreground/75"
              >
                <span aria-hidden="true" className="text-coral">
                  ·
                </span>
                {issue}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8">
          <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">
            Bill of materials
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line font-mono text-[9.5px] tracking-[0.16em] text-muted uppercase">
                  <th className="py-2 pr-3 font-normal">Code</th>
                  <th className="py-2 pr-3 font-normal">Unit</th>
                  <th className="py-2 pr-3 font-normal">Width</th>
                  <th className="py-2 pr-3 text-right font-normal">Qty</th>
                  <th className="py-2 text-right font-normal">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bom.map((row, i) => (
                  <motion.tr
                    key={`${row.code}-${row.width}-${row.hardware ?? ""}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: EASE, delay: 0.3 + i * 0.03 }}
                    className="border-b border-line/60 text-[12.5px]"
                  >
                    <td className="py-2 pr-3 font-mono text-[11px] text-brown">
                      {row.code}
                    </td>
                    <td className="py-2 pr-3">
                      {row.name}
                      {row.hardware && (
                        <span className="block font-mono text-[9.5px] tracking-[0.12em] text-muted uppercase">
                          {row.hardware}
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-3 tabular-nums">{row.width}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{row.qty}</td>
                    <td className="py-2 text-right tabular-nums">{money(row.total)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 xl:col-span-4">
        <div className="lg:sticky lg:top-2">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
            className="glass-ink rounded-2xl p-6 text-white"
          >
            <p className="font-mono text-[10px] tracking-[0.22em] text-white/50 uppercase">
              Indicative total
            </p>
            <p className="mt-4 text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.05] font-medium tracking-[-0.04em] tabular-nums">
              ₹<AnimatedNumber value={sums.total} />
            </p>
            <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-white/45 uppercase">
              {sums.unitCount} units · {sums.counterFeet} ft counter ·{" "}
              {RANGE_RATES[range].label}
            </p>

            <ul className="mt-6 flex flex-col gap-2.5 border-t border-white/15 pt-5 text-[13px]">
              <Line label="Cabinetry" value={sums.cabinetry} />
              <Line label="Countertop" value={sums.counter} />
              <Line label="Opening detail" value={sums.opening} />
              <Line label="Appliances" value={sums.appliances} />
              <Line label="GST at 18%" value={sums.gst} />
            </ul>

            <a
              href={whatsappLink(planSummary(plan, range))}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-ring mt-6 inline-flex w-full items-center justify-between gap-3 rounded-full bg-white px-5 py-3 text-[13px] text-ink transition-opacity duration-300 hover:opacity-90"
            >
              Send this plan to the studio
              <ArrowRight size={15} strokeWidth={1.75} />
            </a>

            <p className="mt-4 text-[12px] leading-[1.55] text-white/45">
              Indicative. Civil work, electrical points and site conditions are
              not in this figure — the survey settles it.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ── Drawings ────────────────────────────────────────────────────────────── */

/**
 * The whole palette as SVG paint.
 *
 * Declared once per drawing and referenced by everything in it, so the plan and
 * the elevation come out in the customer's actual colours. A grey plan is not
 * recognisable as your kitchen, and recognition is the entire job of the last
 * step — this is the difference between a diagram and a picture of a room.
 *
 * Gradient ids are shared across every SVG on the page. That is safe here
 * because they all resolve from the same palette: two definitions of
 * `face-base` are always identical, so whichever the browser keeps is right.
 */
function FinishDefs({ palette }: { palette: Palette }) {
  const base = palette.base?.hex ?? "#d9d2c6";
  const baseGrain = palette.base?.grain ?? "#bdb5a6";
  const upper = palette.upper?.hex ?? base;
  const upperGrain = palette.upper?.grain ?? baseGrain;
  const stone = palette.counter;
  const metal = palette.metal;

  return (
    <defs>
      {/* Shutter faces. The band across the middle is the sheen a flat panel
          catches from a window — without it the faces read as paper. */}
      <linearGradient id="face-base" x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0%" stopColor={lighten(base, 0.16)} />
        <stop offset="46%" stopColor={base} />
        <stop offset="100%" stopColor={darken(baseGrain, 0.1)} />
      </linearGradient>
      <linearGradient id="face-upper" x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0%" stopColor={lighten(upper, 0.18)} />
        <stop offset="46%" stopColor={upper} />
        <stop offset="100%" stopColor={darken(upperGrain, 0.1)} />
      </linearGradient>

      {/* Stone, seen edge-on and from above. */}
      <linearGradient id="stone-edge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={lighten(stone.hex, 0.22)} />
        <stop offset="35%" stopColor={stone.hex} />
        <stop offset="100%" stopColor={darken(stone.hex, 0.18)} />
      </linearGradient>
      <linearGradient id="stone-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={lighten(stone.hex, 0.1)} />
        <stop offset="60%" stopColor={stone.hex} />
        <stop offset="100%" stopColor={darken(stone.fleck, 0.05)} />
      </linearGradient>

      <linearGradient id="metal-bar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={metal.sheen} />
        <stop offset="55%" stopColor={metal.hex} />
        <stop offset="100%" stopColor={darken(metal.hex, 0.25)} />
      </linearGradient>

      {/* Under-cabinet light falling onto the splashback. */}
      <linearGradient id="under-light" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff3d6" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#fff3d6" stopOpacity="0" />
      </linearGradient>

      {/* Tile joints, drawn rather than faked with opacity. */}
      <pattern id="splash-tile" width="150" height="150" patternUnits="userSpaceOnUse">
        <rect width="150" height="150" fill={palette.splash.hex} />
        <path
          d="M0 150H150M150 0V150"
          stroke={palette.splash.grout}
          strokeWidth="5"
          fill="none"
        />
      </pattern>

      {/* Stone speckle, for the plan's worktops. */}
      <pattern id="stone-speck" width="90" height="90" patternUnits="userSpaceOnUse">
        <rect width="90" height="90" fill={stone.hex} />
        <circle cx="18" cy="26" r="4" fill={stone.fleck} opacity="0.55" />
        <circle cx="62" cy="12" r="3" fill={stone.fleck} opacity="0.4" />
        <circle cx="44" cy="58" r="5" fill={stone.fleck} opacity="0.45" />
        <circle cx="78" cy="72" r="3.5" fill={stone.fleck} opacity="0.5" />
      </pattern>
    </defs>
  );
}

/**
 * The wall, seen straight on — the view that makes the kitchen look like one.
 *
 * Everything is drawn in the order a room is built: wall, splashback, plinth,
 * carcasses, shutters, counter, then the metal and the appliances on top. The
 * 4mm reveals between units are the dark ground showing through rather than
 * drawn lines, which is what makes a run read as separate doors instead of one
 * painted board.
 */
function Elevation({
  wall,
  palette,
  animate = false,
}: {
  wall: PlannerWall;
  palette: Palette;
  animate?: boolean;
}) {
  const wallMm = Math.max(toMm(wall.lengthFt), 1000);
  const pad = 260;
  const flip = (mmFromFloor: number) => WALL_HEIGHT - mmFromFloor;

  const counterTop = PLINTH + 734 + COUNTER_THICKNESS;
  const upperBottom = tierBand("upper").bottom;
  const lowerRun = Math.min(runWidth(wall.rows.lower), wallMm);
  const upperRun = Math.min(runWidth(wall.rows.upper), wallMm);

  let order = 0;
  const next = () => (animate ? order++ * 0.05 : undefined);

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${wallMm + pad * 2} ${WALL_HEIGHT + pad * 2}`}
      className="w-full"
      role="img"
      aria-label={`${wall.label} elevation`}
    >
      <FinishDefs palette={palette} />

      {/* Wall and floor. */}
      <rect
        x={-pad}
        y={-pad}
        width={wallMm + pad * 2}
        height={WALL_HEIGHT + pad}
        fill="var(--surface)"
      />
      <rect
        x={-pad}
        y={flip(0)}
        width={wallMm + pad * 2}
        height={pad}
        fill="var(--foreground)"
        opacity="0.08"
      />

      {/* Splashback: only behind the run, and only up to the wall cabinets. */}
      {lowerRun > 0 && (
        <rect
          x="0"
          y={flip(upperBottom)}
          width={lowerRun}
          height={upperBottom - counterTop}
          fill="url(#splash-tile)"
        />
      )}

      {/* Plinth, set back into shadow. */}
      {lowerRun > 0 && (
        <rect x="0" y={flip(PLINTH)} width={lowerRun} height={PLINTH} fill="#2a2724" opacity="0.85" />
      )}

      {ROW_TIERS.map((tier) => {
        const band = tierBand(tier);
        return (
          <g key={tier}>
            {withOffsets(wall.rows[tier]).map(({ placed, at }) => {
              const unit = getUnit(placed.unitId);
              if (!unit) return null;
              const isTall = unit.tier === "tall";
              const height = isTall ? WALL_HEIGHT - PLINTH : band.height;
              const y = isTall
                ? flip(PLINTH + height)
                : flip(band.bottom + band.height);

              return (
                <ElevationUnit
                  key={placed.key}
                  unit={unit}
                  tier={tier}
                  palette={palette}
                  x={at}
                  y={y}
                  width={placed.width}
                  height={height}
                  delay={next()}
                />
              );
            })}
          </g>
        );
      })}

      {/* Under-cabinet light washing down the tiles. */}
      {palette.lit && upperRun > 0 && (
        <rect
          x="0"
          y={flip(upperBottom)}
          width={upperRun}
          height="320"
          fill="url(#under-light)"
        />
      )}

      {/* The counter: slab, front edge, and the shadow it throws on the doors. */}
      {lowerRun > 0 && (
        <g>
          <rect
            x="-18"
            y={flip(counterTop)}
            width={lowerRun + 24}
            height={COUNTER_THICKNESS + 22}
            fill="url(#stone-edge)"
          />
          <rect
            x="-18"
            y={flip(counterTop)}
            width={lowerRun + 24}
            height="6"
            fill={lighten(palette.counter.hex, 0.35)}
            opacity="0.8"
          />
          <rect
            x="0"
            y={flip(counterTop - COUNTER_THICKNESS - 22)}
            width={lowerRun}
            height="26"
            fill="#000"
            opacity="0.16"
          />
        </g>
      )}

      {/* Fixtures sit on the counter, so they are drawn after it. */}
      {withOffsets(wall.rows.lower).map(({ placed, at }) => {
        const unit = getUnit(placed.unitId);
        if (!unit?.fixture) return null;
        return (
          <CounterFixture
            key={`fx-${placed.key}`}
            kind={unit.fixture}
            palette={palette}
            x={at}
            width={placed.width}
            counterY={flip(counterTop)}
            hoodY={flip(upperBottom)}
          />
        );
      })}

      {/* Dimension line. */}
      <line
        x1="0"
        y1={flip(0) + 130}
        x2={wallMm}
        y2={flip(0) + 130}
        stroke="var(--muted)"
        strokeWidth="3"
      />
      <text
        x={wallMm / 2}
        y={flip(0) + 196}
        textAnchor="middle"
        className="fill-muted font-mono"
        fontSize="64"
        letterSpacing="6"
      >
        {Math.round(wallMm)} MM · {wall.lengthFt} FT
      </text>
    </svg>
  );
}

/**
 * One cabinet front.
 *
 * Reveals are cut by insetting the face rather than by drawing a line, so the
 * gap is the dark carcass behind — the same way the gap is made in a real run.
 * Handles come from the opening choice: a bar in the chosen metal, or the
 * shadow line of a gola channel along the leading edge.
 */
function ElevationUnit({
  unit,
  tier,
  palette,
  x,
  y,
  width,
  height,
  delay,
}: {
  unit: CabinetUnit;
  tier: RowTier;
  palette: Palette;
  x: number;
  y: number;
  width: number;
  height: number;
  delay?: number;
}) {
  const reveal = 4;
  const fx = x + reveal;
  const fy = y + reveal;
  const fw = Math.max(width - reveal * 2, 6);
  const fh = Math.max(height - reveal * 2, 6);

  const open = unit.glyph === "open";
  const filler = unit.glyph === "filler";
  const paint = tier === "lower" ? "url(#face-base)" : "url(#face-upper)";
  const gola = palette.opening === "gola";

  /** Drawer fronts, or a single door face, as fractions of the height. */
  const bands =
    unit.glyph === "drawers"
      ? unit.id.includes("3drawer")
        ? [0.3, 0.35, 0.35]
        : [0.4, 0.6]
      : [1];

  const rows: { top: number; height: number }[] = [];
  let cursor = fy;
  for (const share of bands) {
    const h = fh * share;
    rows.push({ top: cursor, height: h - (bands.length > 1 ? reveal : 0) });
    cursor += h;
  }

  const body = (
    <>
      {/* Carcass shadow behind the fronts. */}
      <rect x={x} y={y} width={width} height={height} fill="#2a2724" opacity="0.55" />

      {rows.map((row, i) => (
        <g key={i}>
          <rect
            x={fx}
            y={row.top}
            width={fw}
            height={row.height}
            rx="4"
            fill={open ? "var(--surface)" : paint}
            opacity={filler ? 0.55 : 1}
          />
          {/* Top-edge catch light — the one thing that makes a flat fill read
              as a panel with a thickness. */}
          {!open && (
            <rect
              x={fx}
              y={row.top}
              width={fw}
              height="5"
              fill="#fff"
              opacity="0.22"
            />
          )}

          {/* Handles. */}
          {!open && !filler && (
            gola ? (
              <rect
                x={fx}
                y={row.top}
                width={fw}
                height="14"
                fill="#000"
                opacity="0.38"
              />
            ) : unit.glyph === "drawers" || tier === "loft" ? (
              <rect
                x={fx + fw * 0.25}
                y={row.top + row.height / 2 - 7}
                width={fw * 0.5}
                height="14"
                rx="7"
                fill="url(#metal-bar)"
              />
            ) : (
              <rect
                x={fx + fw - 46}
                y={row.top + row.height * 0.3}
                width="14"
                height={Math.min(row.height * 0.4, 220)}
                rx="7"
                fill="url(#metal-bar)"
              />
            )
          )}
        </g>
      ))}

      {/* Two doors meeting: a second reveal down the centre. */}
      {(unit.glyph === "doors" || unit.glyph === "corner") && !open && (
        <rect x={fx + fw / 2 - 2} y={fy} width="4" height={fh} fill="#2a2724" opacity="0.7" />
      )}

      {/* Open shelving: real shelves, with the wall behind them. */}
      {open &&
        [0.34, 0.67].map((f) => (
          <rect
            key={f}
            x={fx}
            y={fy + fh * f}
            width={fw}
            height="16"
            fill={paint}
          />
        ))}

      {/* A tall tower's oven and microwave openings. */}
      {unit.glyph === "appliance" && tier === "lower" && (
        <g>
          <rect
            x={fx + 24}
            y={fy + fh * 0.3}
            width={fw - 48}
            height={fh * 0.16}
            rx="6"
            fill="#1c1c1f"
          />
          <rect
            x={fx + 24}
            y={fy + fh * 0.49}
            width={fw - 48}
            height={fh * 0.2}
            rx="6"
            fill="#1c1c1f"
          />
          <rect
            x={fx + 24}
            y={fy + fh * 0.52}
            width={fw - 48}
            height={fh * 0.1}
            rx="4"
            fill={palette.metal.hex}
            opacity="0.35"
          />
        </g>
      )}

      {filler && (
        <rect x={fx} y={fy} width={fw} height={fh} fill="#000" opacity="0.12" />
      )}

      {width >= 300 && (
        <text
          x={x + width / 2}
          y={y + height + 84}
          textAnchor="middle"
          className="fill-muted font-mono"
          fontSize="50"
          letterSpacing="3"
        >
          {width}
        </text>
      )}
    </>
  );

  if (delay === undefined) return <g>{body}</g>;

  return (
    <motion.g
      initial={{ opacity: 0, y: 46 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {body}
    </motion.g>
  );
}

/** A hob with its hood, or a sink with its tap — drawn on top of the slab. */
function CounterFixture({
  kind,
  palette,
  x,
  width,
  counterY,
  hoodY,
}: {
  kind: "hob" | "sink";
  palette: Palette;
  x: number;
  width: number;
  counterY: number;
  hoodY: number;
}) {
  const cx = x + width / 2;

  if (kind === "hob") {
    const hobW = Math.min(width - 120, 860);
    return (
      <g>
        {/* The hob plate, sunk into the stone. */}
        <rect
          x={cx - hobW / 2}
          y={counterY - 14}
          width={hobW}
          height="18"
          rx="6"
          fill="#1a1a1c"
        />
        {[-1.5, -0.5, 0.5, 1.5].map((s) => (
          <ellipse
            key={s}
            cx={cx + s * (hobW / 4.6)}
            cy={counterY - 6}
            rx={hobW / 13}
            ry="9"
            fill="none"
            stroke={palette.metal.hex}
            strokeWidth="6"
          />
        ))}

        {/* Chimney, hung under the wall cabinets. */}
        <g>
          <path
            d={`M${cx - hobW / 2 - 30} ${hoodY + 240} L${cx + hobW / 2 + 30} ${hoodY + 240} L${cx + hobW / 2 - 60} ${hoodY + 90} L${cx - hobW / 2 + 60} ${hoodY + 90} Z`}
            fill="url(#metal-bar)"
          />
          <rect
            x={cx - 90}
            y={hoodY}
            width="180"
            height="100"
            fill={palette.metal.hex}
            opacity="0.9"
          />
          <rect
            x={cx - hobW / 2 - 30}
            y={hoodY + 228}
            width={hobW + 60}
            height="12"
            fill="#1a1a1c"
            opacity="0.6"
          />
        </g>
      </g>
    );
  }

  const bowlW = Math.min(width - 160, 620);
  return (
    <g>
      <rect
        x={cx - bowlW / 2}
        y={counterY - 12}
        width={bowlW}
        height="16"
        rx="5"
        fill={darken(palette.counter.hex, 0.35)}
      />
      {/* Tap: a swan neck, in the same metal as the handles. */}
      <path
        d={`M${cx + bowlW / 2 - 60} ${counterY} L${cx + bowlW / 2 - 60} ${counterY - 210} Q${cx + bowlW / 2 - 60} ${counterY - 280} ${cx + bowlW / 2 - 190} ${counterY - 280} L${cx + bowlW / 2 - 190} ${counterY - 230}`}
        fill="none"
        stroke="url(#metal-bar)"
        strokeWidth="20"
        strokeLinecap="round"
      />
    </g>
  );
}

/**
 * The kitchen from above.
 *
 * Runs sit against the walls the layout implies — top for A, left or bottom for
 * B, right for C — which is the arrangement a designer sketches before anything
 * else. Worktops are the stone; the dashed outline is the wall cabinets
 * overhead, exactly as a plan carries them.
 */
function PlanView({
  walls,
  layoutId,
  palette,
  animate = false,
}: {
  walls: PlannerWall[];
  layoutId: string;
  palette: Palette;
  animate?: boolean;
}) {
  const len = (i: number) => (walls[i] ? Math.max(toMm(walls[i].lengthFt), 600) : 0);

  const roomW = Math.max(len(0), layoutId === "parallel" ? len(1) : 0, 2000);
  const roomH =
    layoutId === "l-shape" || layoutId === "u-shape"
      ? Math.max(len(1), len(2), 1800)
      : NOMINAL_ROOM_DEPTH;

  const pad = 500;

  const placements: { wall: PlannerWall; edge: "top" | "left" | "right" | "bottom" }[] =
    [];
  if (walls[0]) placements.push({ wall: walls[0], edge: "top" });
  if (walls[1]) {
    placements.push({
      wall: walls[1],
      edge: layoutId === "parallel" ? "bottom" : "left",
    });
  }
  if (walls[2]) placements.push({ wall: walls[2], edge: "right" });

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${roomW + pad * 2} ${roomH + pad * 2}`}
      className="w-full"
      role="img"
      aria-label="Kitchen plan"
    >
      <FinishDefs palette={palette} />
      <defs>
        <pattern id="plan-floor" width="700" height="700" patternUnits="userSpaceOnUse">
          <rect width="700" height="700" fill="var(--surface)" />
          <path d="M0 700H700M700 0V700" stroke="var(--foreground)" strokeWidth="4" opacity="0.07" />
        </pattern>
      </defs>

      {/* The floor, then the walls as a heavy outline. */}
      <rect x="0" y="0" width={roomW} height={roomH} fill="url(#plan-floor)" />
      <rect
        x="0"
        y="0"
        width={roomW}
        height={roomH}
        fill="none"
        stroke="var(--foreground)"
        strokeWidth="26"
        opacity="0.4"
      />

      {placements.map(({ wall, edge }) => (
        <PlanRun
          key={wall.id}
          wall={wall}
          edge={edge}
          roomW={roomW}
          roomH={roomH}
          palette={palette}
          animate={animate}
        />
      ))}

      <text
        x={roomW / 2}
        y={roomH + 320}
        textAnchor="middle"
        className="fill-muted font-mono"
        fontSize="150"
        letterSpacing="14"
      >
        {Math.round(roomW)} MM
      </text>
    </svg>
  );
}

function PlanRun({
  wall,
  edge,
  roomW,
  roomH,
  palette,
  animate,
}: {
  wall: PlannerWall;
  edge: "top" | "left" | "right" | "bottom";
  roomW: number;
  roomH: number;
  palette: Palette;
  animate: boolean;
}) {
  const horizontal = edge === "top" || edge === "bottom";

  return (
    <g>
      {withOffsets(wall.rows.lower).map(({ placed, at: along }, i) => {
        const unit = getUnit(placed.unitId);
        if (!unit) return null;

        const depth = LOWER_DEPTH;
        const box = horizontal
          ? { x: along, y: edge === "top" ? 0 : roomH - depth, w: placed.width, h: depth }
          : { x: edge === "left" ? 0 : roomW - depth, y: along, w: depth, h: placed.width };

        const content = (
          <>
            {/* Worktop in the chosen stone, with the joint to its neighbour. */}
            <rect
              x={box.x}
              y={box.y}
              width={box.w}
              height={box.h}
              fill="url(#stone-speck)"
              opacity={unit.glyph === "filler" ? 0.5 : 1}
            />
            <rect
              x={box.x}
              y={box.y}
              width={box.w}
              height={box.h}
              fill="none"
              stroke={darken(palette.counter.hex, 0.3)}
              strokeWidth="5"
              opacity="0.7"
            />

            {unit.fixture === "sink" && (
              <g>
                <rect
                  x={box.x + box.w / 2 - Math.min(190, box.w / 3)}
                  y={box.y + box.h / 2 - 150}
                  width={Math.min(380, box.w / 1.5)}
                  height="290"
                  rx="26"
                  fill={darken(palette.counter.hex, 0.4)}
                  stroke={palette.metal.hex}
                  strokeWidth="8"
                />
                <circle
                  cx={box.x + box.w / 2}
                  cy={box.y + 90}
                  r="26"
                  fill={palette.metal.hex}
                />
              </g>
            )}

            {unit.fixture === "hob" &&
              [
                [-1, -1],
                [1, -1],
                [-1, 1],
                [1, 1],
              ].map(([sx, sy], k) => (
                <circle
                  key={k}
                  cx={box.x + box.w / 2 + sx * Math.min(115, box.w / 5)}
                  cy={box.y + box.h / 2 + sy * 110}
                  r="58"
                  fill="none"
                  stroke={palette.metal.hex}
                  strokeWidth="12"
                />
              ))}

            {unit.tier === "tall" && (
              <>
                <rect
                  x={box.x}
                  y={box.y}
                  width={box.w}
                  height={box.h}
                  fill="url(#face-base)"
                  opacity="0.9"
                />
                <line
                  x1={box.x}
                  y1={box.y}
                  x2={box.x + box.w}
                  y2={box.y + box.h}
                  stroke="var(--foreground)"
                  strokeWidth="6"
                  opacity="0.4"
                />
              </>
            )}
          </>
        );

        return animate ? (
          <motion.g
            key={placed.key}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE, delay: i * 0.055 }}
            style={{ transformOrigin: `${box.x + box.w / 2}px ${box.y + box.h / 2}px` }}
          >
            {content}
          </motion.g>
        ) : (
          <g key={placed.key}>{content}</g>
        );
      })}

      {runWidth(wall.rows.upper) > 0 &&
        (() => {
          const w = runWidth(wall.rows.upper);
          const box = horizontal
            ? { x: 0, y: edge === "top" ? 0 : roomH - UPPER_DEPTH, w, h: UPPER_DEPTH }
            : { x: edge === "left" ? 0 : roomW - UPPER_DEPTH, y: 0, w: UPPER_DEPTH, h: w };
          return (
            <rect
              x={box.x}
              y={box.y}
              width={box.w}
              height={box.h}
              fill="none"
              stroke="var(--foreground)"
              strokeWidth="6"
              strokeDasharray="34 26"
              opacity="0.45"
            />
          );
        })()}
    </g>
  );
}

/**
 * One unit, drawn at its own proportions for the catalogue card.
 *
 * A 3-drawer bank looks like a 3-drawer bank and a tall tower looks tall, which
 * is faster to scan than any amount of naming — and it is the same drawing
 * language the elevation uses, in the same finish, so the card and the result
 * agree.
 */
function UnitPortrait({ unit, palette }: { unit: CabinetUnit; palette: Palette }) {
  const width = unit.widths[Math.floor(unit.widths.length / 2)] ?? 600;
  // Tall towers would dwarf everything at true scale, so the box is normalised
  // and the proportion within it kept.
  const ratio = Math.min(unit.height / width, 3.2);
  const boxW = 100;
  const boxH = Math.min(100, boxW * ratio);
  const open = unit.glyph === "open";
  const paint = unit.tier === "upper" ? "url(#face-upper)" : "url(#face-base)";

  const bands =
    unit.glyph === "drawers"
      ? unit.id.includes("3drawer")
        ? [0.3, 0.35, 0.35]
        : [0.4, 0.6]
      : [1];

  const rows: { top: number; height: number }[] = [];
  let cursor = 1;
  for (const share of bands) {
    const h = (boxH - 2) * share;
    rows.push({ top: cursor, height: h - (bands.length > 1 ? 1.5 : 0) });
    cursor += h;
  }

  return (
    <svg
      viewBox={`0 0 ${boxW} ${boxH}`}
      className="h-full w-auto"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <FinishDefs palette={palette} />
      <rect x="0" y="0" width={boxW} height={boxH} fill="#2a2724" opacity="0.5" />

      {rows.map((row, i) => (
        <g key={i}>
          <rect
            x="1"
            y={row.top}
            width={boxW - 2}
            height={row.height}
            rx="1.5"
            fill={open ? "var(--surface)" : paint}
            opacity={unit.glyph === "filler" ? 0.55 : 1}
          />
          {!open && unit.glyph !== "filler" && (
            palette.opening === "gola" ? (
              <rect x="1" y={row.top} width={boxW - 2} height="2" fill="#000" opacity="0.35" />
            ) : unit.glyph === "drawers" ? (
              <rect
                x={boxW * 0.3}
                y={row.top + row.height / 2 - 1.2}
                width={boxW * 0.4}
                height="2.4"
                rx="1.2"
                fill={palette.metal.hex}
              />
            ) : (
              <rect
                x={boxW - 14}
                y={row.top + row.height * 0.32}
                width="2.4"
                height={Math.max(row.height * 0.36, 6)}
                rx="1.2"
                fill={palette.metal.hex}
              />
            )
          )}
        </g>
      ))}

      {(unit.glyph === "doors" || unit.glyph === "corner") && !open && (
        <rect x={boxW / 2 - 0.7} y="1" width="1.4" height={boxH - 2} fill="#2a2724" opacity="0.7" />
      )}

      {open &&
        [0.34, 0.67].map((f) => (
          <rect key={f} x="1" y={boxH * f} width={boxW - 2} height="3" fill={paint} />
        ))}

      {unit.glyph === "tall" &&
        [0.32, 0.62].map((f) => (
          <rect key={f} x="1" y={boxH * f} width={boxW - 2} height="1.4" fill="#2a2724" opacity="0.55" />
        ))}

      {unit.glyph === "appliance" && (
        <>
          <rect x="10" y={boxH * 0.3} width={boxW - 20} height={boxH * 0.15} rx="1.5" fill="#1c1c1f" />
          <rect x="10" y={boxH * 0.5} width={boxW - 20} height={boxH * 0.2} rx="1.5" fill="#1c1c1f" />
        </>
      )}

      {unit.fixture === "hob" &&
        [-1, 1].map((s) => (
          <circle
            key={s}
            cx={boxW / 2 + s * 16}
            cy={4}
            r="3.5"
            fill="none"
            stroke={palette.metal.hex}
            strokeWidth="1.6"
          />
        ))}
      {unit.fixture === "sink" && (
        <rect
          x={boxW / 2 - 20}
          y="1.5"
          width="40"
          height="7"
          rx="2"
          fill="none"
          stroke={palette.metal.hex}
          strokeWidth="1.6"
        />
      )}
    </svg>
  );
}

/**
 * An appliance, drawn.
 *
 * There is no product photography in the assets yet, and a list of names with
 * no pictures is the hardest kind of list to choose from. These are drawn in
 * the kitchen's own metal so the row already looks like part of the scheme —
 * and each one swaps for a real photograph the moment `image` is set on it in
 * the catalogue.
 */
function ApplianceGlyph({
  appliance,
  palette,
}: {
  appliance: Appliance;
  palette: Palette;
}) {
  const metal = palette.metal.hex;
  const sheen = palette.metal.sheen;

  return (
    <svg viewBox="0 0 64 44" className="h-11 w-16 shrink-0" aria-hidden="true">
      <rect x="0" y="0" width="64" height="44" rx="5" fill="var(--surface)" />

      {(appliance.kind === "hob-gas" || appliance.kind === "hob-induction") && (
        <g>
          <rect x="7" y="10" width="50" height="24" rx="3" fill="#1e1e21" />
          {appliance.kind === "hob-gas"
            ? [
                [19, 18],
                [45, 18],
                [19, 27],
                [45, 27],
              ].map(([cx, cy], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="4.2" fill="none" stroke={metal} strokeWidth="1.4" />
                  <circle cx={cx} cy={cy} r="1.3" fill={metal} />
                </g>
              ))
            : [
                [19, 18],
                [45, 18],
                [19, 27],
                [45, 27],
              ].map(([cx, cy], i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="5"
                  fill="none"
                  stroke={metal}
                  strokeWidth="1"
                  opacity="0.7"
                />
              ))}
        </g>
      )}

      {appliance.kind === "hood-slope" && (
        <g>
          <path d="M8 30 L56 30 L52 12 L18 12 Z" fill={metal} />
          <path d="M8 30 L56 30 L56 33 L8 33 Z" fill="#1e1e21" opacity="0.7" />
          <rect x="28" y="6" width="8" height="7" fill={metal} opacity="0.8" />
          <path d="M18 12 L52 12" stroke={sheen} strokeWidth="1.2" opacity="0.8" />
        </g>
      )}

      {appliance.kind === "hood-box" && (
        <g>
          <rect x="8" y="18" width="48" height="14" rx="2" fill={metal} />
          <rect x="8" y="30" width="48" height="3" fill="#1e1e21" opacity="0.7" />
          <rect x="28" y="7" width="8" height="12" fill={metal} opacity="0.85" />
          <rect x="8" y="18" width="48" height="2" fill={sheen} opacity="0.7" />
        </g>
      )}

      {(appliance.kind === "oven" || appliance.kind === "microwave") && (
        <g>
          <rect x="9" y="7" width="46" height="30" rx="3" fill="#26262a" />
          <rect x="13" y="15" width="38" height="18" rx="2" fill="#0f0f11" />
          <rect x="13" y="15" width="38" height="18" rx="2" fill={sheen} opacity="0.08" />
          <rect x="13" y="10" width="38" height="3" rx="1.5" fill={metal} />
          {appliance.kind === "microwave" && (
            <circle cx="47" cy="24" r="3.4" fill={metal} opacity="0.75" />
          )}
        </g>
      )}

      {(appliance.kind === "sink-single" || appliance.kind === "sink-double") && (
        <g>
          <rect x="6" y="14" width="52" height="20" rx="3" fill={metal} opacity="0.35" />
          <rect x="10" y="18" width={appliance.kind === "sink-double" ? 20 : 44} height="12" rx="2" fill="#1e1e21" opacity="0.55" />
          {appliance.kind === "sink-double" && (
            <rect x="34" y="18" width="20" height="12" rx="2" fill="#1e1e21" opacity="0.55" />
          )}
          <path
            d="M50 14 L50 8 Q50 5 44 5"
            fill="none"
            stroke={metal}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
      )}

      {appliance.kind === "dishwasher" && (
        <g>
          <rect x="11" y="6" width="42" height="32" rx="3" fill="var(--line)" />
          <rect x="11" y="6" width="42" height="6" rx="3" fill={metal} opacity="0.7" />
          <rect x="15" y="16" width="34" height="18" rx="2" fill="#1e1e21" opacity="0.18" />
          <circle cx="45" cy="9" r="1.4" fill="#1e1e21" opacity="0.6" />
        </g>
      )}
    </svg>
  );
}

/* ── Small parts ─────────────────────────────────────────────────────────── */

function money(n: number) {
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}`;
}

function Chips({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const on = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={on}
            className="focus-ring relative rounded-full px-3.5 py-1.5 text-[12.5px] tracking-[-0.005em] transition-colors duration-300"
          >
            {/* The pill slides between options rather than blinking on and
                off — one shared layout id is the whole trick. */}
            {on && (
              <motion.span
                layoutId={`chip-${options.map((o) => o.id).join("-")}`}
                transition={{ type: "spring", stiffness: 340, damping: 30 }}
                className="absolute inset-0 rounded-full bg-ink"
              />
            )}
            <span
              className={`relative ${on ? "text-white" : "text-foreground/55 hover:text-foreground"}`}
            >
              {option.label}
            </span>
            {!on && (
              <span className="absolute inset-0 rounded-full border border-line" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="focus-ring flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-foreground/45 transition-colors duration-300 hover:bg-foreground hover:text-background active:scale-90"
    >
      {children}
    </button>
  );
}

function RemainingLabel({ wall, tier }: { wall: PlannerWall; tier: RowTier }) {
  const left = remaining(wall, tier);
  if (left < 0) return <span className="text-coral">{Math.abs(left)}mm over</span>;
  return <span className="text-brown">{left}mm left</span>;
}

function Line({ label, value }: { label: string; value: number }) {
  return (
    <li
      className={`flex items-baseline justify-between gap-4 ${value === 0 ? "opacity-35" : ""}`}
    >
      <span className="text-white/55">{label}</span>
      <span className="tabular-nums text-white/90">{money(value)}</span>
    </li>
  );
}
