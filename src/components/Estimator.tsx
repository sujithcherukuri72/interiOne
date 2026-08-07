"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { EASE, EASE_UI } from "@/lib/motion";
import { LAYOUTS } from "@/data/layouts";
import type { RangeId } from "@/data/finishes";
import {
  AREA_PER_RFT,
  COUNTERTOPS,
  ESTIMATOR_LAYOUTS,
  EXTRAS,
  GST_RATE,
  LEG_MAX,
  LEG_MIN,
  RANGE_RATES,
  cabinetArea,
  runningFeet,
  type CountertopId,
  type EstimatorLayout,
  type ExtraId,
  type LegId,
} from "@/data/estimator";

/** Full Indian grouping, no shorthand — this is a price, not a statistic. */
function money(n: number) {
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}`;
}

/** Trailing zeroes dropped: 12.4 ft, 9 ft, never 9.0 ft. */
function feet(n: number) {
  return `${Math.round(n * 10) / 10}`;
}

const RANGE_IDS: RangeId[] = ["select", "premier", "signature"];

type Lengths = Record<LegId, string>;

function typicalLengths(layout: EstimatorLayout): Lengths {
  const next: Lengths = { a: "", b: "", c: "" };
  layout.legs.forEach((leg) => {
    next[leg.id] = String(leg.typical);
  });
  return next;
}

const STEPS = [
  { id: "layout", label: "Shape", question: "What shape is your kitchen?" },
  { id: "lengths", label: "Size", question: "How long is each wall?" },
  { id: "package", label: "Package", question: "How far should the spec go?" },
  { id: "counter", label: "Counter", question: "What sits on top?" },
  { id: "extras", label: "Fittings", question: "What should we build in?" },
] as const;

/**
 * The estimator, asked one question at a time.
 *
 * The old version put six controls on one screen, which is a form — and a form
 * with a price attached is something people abandon. One question per panel is
 * the same arithmetic asked the way the studio asks it on a call, and it means
 * each answer gets a whole panel to explain itself: the package step can show
 * what the hardware actually is, rather than a word in a pill.
 *
 * The panels are glass over a drifting colour field. That is a deliberate break
 * from the rest of the page, which is flat and printed — this is the one part
 * of the site that computes something, and it should feel like an instrument.
 */
export default function Estimator() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [layoutId, setLayoutId] = useState(ESTIMATOR_LAYOUTS[0].id);
  const layout =
    ESTIMATOR_LAYOUTS.find((l) => l.id === layoutId) ?? ESTIMATOR_LAYOUTS[0];

  const [lengths, setLengths] = useState<Lengths>(() =>
    typicalLengths(ESTIMATOR_LAYOUTS[0])
  );
  const [range, setRange] = useState<RangeId>("premier");
  const [counter, setCounter] = useState<CountertopId>("granite");
  const [extras, setExtras] = useState<ExtraId[]>(["chimney", "hob", "sink"]);

  const go = (to: number) => {
    if (to < 0 || to >= STEPS.length) return;
    setDirection(to > step ? 1 : -1);
    setStep(to);
  };

  // Picking a shape answers the question, so it also moves on — one tap, not
  // a tap and then a reach for Next.
  const pickLayout = (id: string) => {
    const next = ESTIMATOR_LAYOUTS.find((l) => l.id === id);
    if (!next) return;
    setLayoutId(id);
    setLengths(typicalLengths(next));
    go(1);
  };

  const setLeg = (id: LegId, value: string) => {
    if (value !== "" && !/^\d{0,2}(\.\d{0,2})?$/.test(value)) return;
    setLengths((prev) => ({ ...prev, [id]: value }));
  };

  const clampLeg = (id: LegId) => {
    setLengths((prev) => {
      const raw = parseFloat(prev[id]);
      if (Number.isNaN(raw)) return { ...prev, [id]: "" };
      const clamped = Math.min(LEG_MAX, Math.max(LEG_MIN, raw));
      return { ...prev, [id]: String(Math.round(clamped * 10) / 10) };
    });
  };

  const toggleExtra = (id: ExtraId) =>
    setExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const quote = useMemo(() => {
    const numeric: Record<LegId, number> = {
      a: parseFloat(lengths.a) || 0,
      b: parseFloat(lengths.b) || 0,
      c: parseFloat(lengths.c) || 0,
    };

    const run = runningFeet(layout, numeric);
    const area = cabinetArea(run);

    const cabinetry = Math.round(area * RANGE_RATES[range].perSqFt);
    const countertop = Math.round(
      (COUNTERTOPS.find((c) => c.id === counter)?.perFoot ?? 0) * run
    );
    const appliances = EXTRAS.filter((e) => extras.includes(e.id)).reduce(
      (sum, e) => sum + e.price,
      0
    );

    const subtotal = cabinetry + countertop + appliances;
    const gst = Math.round(subtotal * GST_RATE);

    return {
      run,
      area,
      lines: [
        { label: "Cabinetry", value: cabinetry },
        { label: "Countertop", value: countertop },
        { label: "Units & appliances", value: appliances },
      ],
      gst,
      total: subtotal + gst,
    };
  }, [layout, lengths, range, counter, extras]);

  const canAdvance = step !== 1 || quote.run > 0;
  const last = step === STEPS.length - 1;

  return (
    <section
      id="estimate"
      className="relative isolate overflow-hidden bg-surface py-[clamp(3.5rem,9vh,7.5rem)]"
    >
      {/* What the panels blur. Without it there is no glass, only a border. */}
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
          <h2 className="mt-8 max-w-[18ch] text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
            Five questions and you have a number
          </h2>
          <p className="mt-6 max-w-[46ch] text-[15px] leading-[1.65] tracking-[-0.01em] text-muted">
            The same rates and the same arithmetic the Modula rate card uses, so
            it lands close. Indicative, not a quote — the survey replaces it
            with a firm figure.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          {/* ── The wizard ───────────────────────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="glass rounded-2xl p-5 sm:p-8">
              <Rail step={step} onJump={go} />

              <div className="relative mt-8 min-h-[19rem]">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={STEPS[step].id}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -28 }}
                    transition={{ duration: 0.4, ease: EASE_UI }}
                  >
                    <p className="text-[clamp(1.15rem,1.9vw,1.5rem)] leading-[1.25] font-medium tracking-[-0.025em]">
                      {STEPS[step].question}
                    </p>

                    <div className="mt-7">
                      {step === 0 && (
                        <LayoutStep value={layoutId} onChange={pickLayout} />
                      )}

                      {step === 1 && (
                        <LengthStep
                          layout={layout}
                          lengths={lengths}
                          onChange={setLeg}
                          onBlur={clampLeg}
                          onSubmit={() => canAdvance && go(2)}
                          run={quote.run}
                          area={quote.area}
                        />
                      )}

                      {step === 2 && (
                        <PackageStep value={range} onChange={setRange} />
                      )}

                      {step === 3 && (
                        <CounterStep
                          value={counter}
                          onChange={setCounter}
                          run={quote.run}
                        />
                      )}

                      {step === 4 && (
                        <ExtrasStep value={extras} onToggle={toggleExtra} />
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── Navigation ─────────────────────────────────────── */}
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/40 pt-6">
                <button
                  type="button"
                  onClick={() => go(step - 1)}
                  disabled={step === 0}
                  className="focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] tracking-[-0.005em] text-foreground/60 transition-colors duration-300 enabled:hover:text-foreground disabled:pointer-events-none disabled:opacity-0"
                >
                  <ArrowLeft size={15} strokeWidth={1.75} />
                  Back
                </button>

                {last ? (
                  <a
                    href="#contact"
                    className="focus-ring inline-flex items-center gap-2.5 rounded-full bg-brown px-6 py-3 text-[13px] tracking-[-0.005em] text-white transition-opacity duration-300 hover:opacity-90"
                  >
                    Get this costed properly
                    <ArrowRight size={15} strokeWidth={1.75} />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => go(step + 1)}
                    disabled={!canAdvance}
                    className="focus-ring inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 text-[13px] tracking-[-0.005em] text-white transition-opacity duration-300 enabled:hover:opacity-85 disabled:opacity-30"
                  >
                    Next
                    <ArrowRight size={15} strokeWidth={1.75} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Running total ────────────────────────────────────────── */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-[14vh]">
              <div className="glass-ink rounded-2xl p-6 text-white sm:p-7">
                <p className="font-mono text-[10px] tracking-[0.22em] text-white/50 uppercase">
                  Indicative total
                </p>

                {/* The one number that moves. Keyed on its own value so a
                    change reads as a change rather than a silent swap. */}
                <div className="mt-5 h-[1.15em] overflow-hidden text-[clamp(1.8rem,3vw,2.5rem)] leading-[1.05] font-medium tracking-[-0.04em] tabular-nums">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.p
                      key={quote.total}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE_UI }}
                    >
                      {money(quote.total)}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-white/45 uppercase">
                  {feet(quote.run)} ft run · {quote.area} sq ft ·{" "}
                  {RANGE_RATES[range].label}
                </p>

                <ul className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-6">
                  {quote.lines.map((line) => (
                    <li
                      key={line.label}
                      className={`flex items-baseline justify-between gap-4 text-[13.5px] tracking-[-0.01em] transition-opacity duration-300 ${
                        line.value === 0 ? "opacity-35" : ""
                      }`}
                    >
                      <span className="text-white/55">{line.label}</span>
                      <span className="tabular-nums text-white/90">
                        {money(line.value)}
                      </span>
                    </li>
                  ))}

                  <li className="mt-2 flex items-baseline justify-between gap-4 border-t border-white/15 pt-3 text-[13.5px] tracking-[-0.01em]">
                    <span className="text-white/55">GST at 18%</span>
                    <span className="tabular-nums text-white/90">
                      {money(quote.gst)}
                    </span>
                  </li>
                </ul>

                <p className="mt-7 border-t border-white/15 pt-5 text-[12.5px] leading-[1.6] text-white/50">
                  Excludes civil work and electrical points. Site conditions
                  move the final figure — the survey settles it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* On a phone the total is a screen below the question being answered.
          This keeps it in frame, and leaves with the section. */}
      <div
        aria-hidden="true"
        className="glass sticky bottom-0 z-20 mt-10 flex items-center justify-between gap-4 px-5 py-3 lg:hidden"
      >
        <span className="font-mono text-[9.5px] tracking-[0.2em] text-foreground/50 uppercase">
          {STEPS[step].label} · incl. GST
        </span>
        <span className="text-[17px] font-medium tracking-[-0.03em] tabular-nums">
          {money(quote.total)}
        </span>
      </div>
    </section>
  );
}

/* ── Steps ───────────────────────────────────────────────────────────────── */

/** The plan drawings from the layouts section, at thumbnail size. */
function PlanThumb({ id }: { id: string }) {
  const plan = LAYOUTS.find((l) => l.id === id);
  if (!plan) return null;

  return (
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
        <rect
          key={i}
          x={run.x}
          y={run.y}
          width={run.w}
          height={run.h}
          fill="currentColor"
          opacity="0.55"
        />
      ))}
    </svg>
  );
}

function LayoutStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {ESTIMATOR_LAYOUTS.map((option) => {
        const on = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={on}
            data-selected={on}
            className={`card-modula focus-ring flex flex-col items-center gap-3 bg-cream/80 p-4 text-center ${
              on ? "text-brown" : "text-foreground/70"
            }`}
          >
            <span className="block h-14 w-full">
              <PlanThumb id={option.id} />
            </span>
            <span className="text-[13px] tracking-[-0.01em] text-foreground">
              {option.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function LengthStep({
  layout,
  lengths,
  onChange,
  onBlur,
  onSubmit,
  run,
  area,
}: {
  layout: EstimatorLayout;
  lengths: Lengths;
  onChange: (id: LegId, value: string) => void;
  onBlur: (id: LegId) => void;
  onSubmit: () => void;
  run: number;
  area: number;
}) {
  return (
    <div>
      <p className="text-[13.5px] leading-[1.55] text-foreground/60">
        {layout.prompt} Decimals welcome — a wall is 12.4 ft, not 12.
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        {layout.legs.map((leg) => (
          <label
            key={leg.id}
            className="flex min-w-[8.5rem] flex-1 flex-col gap-2"
          >
            <span className="flex items-baseline gap-2">
              <span className="text-[13.5px] tracking-[-0.01em] text-foreground/80">
                {leg.label}
              </span>
              <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                {leg.hint}
              </span>
            </span>
            <span className="flex items-baseline gap-1 rounded-xl border border-white/60 bg-white/45 px-4 py-2.5 transition-colors duration-300 focus-within:border-brown/60">
              <input
                type="text"
                inputMode="decimal"
                value={lengths[leg.id]}
                onChange={(e) => onChange(leg.id, e.target.value)}
                onBlur={() => onBlur(leg.id)}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                placeholder="0"
                aria-label={`${leg.label} in feet — ${leg.hint}`}
                className="w-full min-w-0 bg-transparent text-[26px] tracking-[-0.03em] tabular-nums outline-none placeholder:text-foreground/25"
              />
              <span className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                ft
              </span>
            </span>
          </label>
        ))}
      </div>

      {/* The arithmetic, shown as it happens — this is the step where someone
          wonders why 16 ft of wall became 14 ft of kitchen. */}
      <p className="mt-6 font-mono text-[10px] leading-[1.7] tracking-[0.14em] text-muted uppercase">
        {LEG_MIN}–{LEG_MAX} ft per wall
        {layout.corners > 0 &&
          ` · −${layout.corners * 2} ft at the corner${layout.corners > 1 ? "s" : ""}`}
        {" · "}
        <span className="text-brown">{feet(run)} ft run</span>
        {" × "}
        {AREA_PER_RFT} = <span className="text-brown">{area} sq ft</span>
      </p>
    </div>
  );
}

function PackageStep({
  value,
  onChange,
}: {
  value: RangeId;
  onChange: (id: RangeId) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {RANGE_IDS.map((id) => {
        const pack = RANGE_RATES[id];
        const on = id === value;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={on}
            data-selected={on}
            className="card-modula focus-ring flex flex-col bg-cream/80 p-5 text-left"
          >
            {/* Modula's own Basic / Advanced / Pro tag. */}
            <span
              className={`w-fit rounded-full px-3 py-1 text-[10px] font-medium tracking-[0.14em] uppercase ${
                on ? "bg-brown text-white" : "bg-foreground/10 text-foreground/60"
              }`}
            >
              {pack.tag}
            </span>

            <span className="mt-4 text-[17px] font-medium tracking-[-0.02em]">
              {pack.label}
            </span>
            <span className="mt-1 font-mono text-[10.5px] tracking-[0.12em] text-brown">
              {money(pack.perSqFt)}/SQ FT
            </span>

            <span className="mt-4 flex flex-col gap-2 border-t border-foreground/10 pt-4">
              {pack.spec.map((row) => (
                <span key={row.label} className="block">
                  <span className="block font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
                    {row.label}
                  </span>
                  <span className="block text-[12.5px] leading-[1.45] text-foreground/75">
                    {row.value}
                  </span>
                </span>
              ))}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CounterStep({
  value,
  onChange,
  run,
}: {
  value: CountertopId;
  onChange: (id: CountertopId) => void;
  run: number;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {COUNTERTOPS.map((option) => {
        const on = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={on}
            data-selected={on}
            className="card-modula focus-ring flex flex-col gap-1 bg-cream/80 p-5 text-left"
          >
            <span className="text-[15px] tracking-[-0.015em]">
              {option.label}
            </span>
            <span className="font-mono text-[10.5px] tracking-[0.12em] text-muted">
              {option.perFoot === 0
                ? "NO CHARGE"
                : `${money(option.perFoot)}/FT · ${money(Math.round(option.perFoot * run))}`}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ExtrasStep({
  value,
  onToggle,
}: {
  value: ExtraId[];
  onToggle: (id: ExtraId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {EXTRAS.map((extra) => {
        const on = value.includes(extra.id);
        return (
          <button
            key={extra.id}
            type="button"
            onClick={() => onToggle(extra.id)}
            aria-pressed={on}
            className={`focus-ring inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-[13px] tracking-[-0.005em] transition-colors duration-300 ${
              on
                ? "border-brown bg-brown/10 text-foreground"
                : "border-white/70 bg-white/35 text-foreground/55 hover:border-brown/40 hover:text-foreground"
            }`}
          >
            <span
              aria-hidden="true"
              className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-300 ${
                on ? "bg-brown text-white" : "bg-foreground/10 text-transparent"
              }`}
            >
              <Check size={10} strokeWidth={3} />
            </span>
            {extra.label}
            <span className="font-mono text-[10px] tracking-[0.1em] text-muted">
              {money(extra.price)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Progress ────────────────────────────────────────────────────────────── */

function Rail({
  step,
  onJump,
}: {
  step: number;
  onJump: (to: number) => void;
}) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3">
      {STEPS.map((item, i) => {
        const done = i < step;
        const now = i === step;
        return (
          <li key={item.id} className="flex flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              // Only backwards: skipping ahead would price a kitchen off
              // questions that have not been asked yet.
              onClick={() => done && onJump(i)}
              disabled={!done}
              aria-current={now ? "step" : undefined}
              className={`focus-ring flex w-full flex-col gap-2 rounded text-left ${
                done ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <span
                className={`h-[3px] w-full rounded-full transition-colors duration-500 ${
                  now ? "bg-brown" : done ? "bg-brown/45" : "bg-foreground/12"
                }`}
              />
              <span
                className={`font-mono text-[9px] tracking-[0.16em] uppercase transition-colors duration-500 sm:text-[10px] ${
                  now ? "text-brown" : done ? "text-foreground/50" : "text-foreground/30"
                }`}
              >
                {item.label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
