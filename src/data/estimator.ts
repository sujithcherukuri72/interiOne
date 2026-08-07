/**
 * Indicative pricing model, taken from Modula's own price calculator.
 *
 * Modula (modula.in) is the manufacturing side of this operation, and its
 * calculator is the rate card customers are already being quoted from, so this
 * follows it rather than inventing a parallel model:
 *
 *   1. Pick a layout — straight, L, parallel, U. No island; the calculator has
 *      none, because an island is not priced off a wall run.
 *   2. Enter the length of each leg in feet, decimals included. A real kitchen
 *      is 12.4 ft, not 12 — which is why a stepped slider was the wrong control
 *      for this and per-leg entry is the right one.
 *   3. Cabinet area = (sum of the legs − 2 ft per corner) × 4.5 sq ft per
 *      running foot. The corner deduction is the overlap where two legs meet;
 *      the 4.5 covers base + wall + loft off one foot of run.
 *   4. Area × the package rate per sq ft, then 18% GST.
 *
 * Countertop and appliances are ours, added on top: Modula's packages cover
 * carcass, shutters, hardware, organisers and lighting, and stop there.
 *
 * INTERNAL NOTE — the three rates below are Modula's published ones as of
 * August 2026. Confirm against the current interiOne rate card before launch;
 * an estimator that under-reads by a lakh does more damage than no estimator.
 */

import type { RangeId } from "./finishes";

/** Square feet of cabinetry per running foot of kitchen — Modula's multiplier. */
export const AREA_PER_RFT = 4.5;

/** Feet absorbed where two legs meet, per corner. */
export const CORNER_ALLOWANCE = 2;

export const GST_RATE = 0.18;

/** Sensible bounds for a single wall run, in feet. */
export const LEG_MIN = 3;
export const LEG_MAX = 30;

export type LegId = "a" | "b" | "c";

export type EstimatorLayout = {
  /** Matches `data/layouts.ts` so the drawn plans and the estimator agree. */
  id: string;
  name: string;
  prompt: string;
  /** Corners between the legs — each one costs `CORNER_ALLOWANCE` feet. */
  corners: number;
  legs: { id: LegId; label: string; hint: string; typical: number }[];
};

export const ESTIMATOR_LAYOUTS: EstimatorLayout[] = [
  {
    id: "straight",
    name: "Straight",
    prompt: "Measure the one wall the kitchen runs along.",
    corners: 0,
    legs: [{ id: "a", label: "Length A", hint: "The run", typical: 10 }],
  },
  {
    id: "l-shape",
    name: "L-Shape",
    prompt: "Measure both walls, corner to end.",
    corners: 1,
    legs: [
      { id: "a", label: "Length A", hint: "Longer wall", typical: 9.5 },
      { id: "b", label: "Length B", hint: "Return wall", typical: 6.5 },
    ],
  },
  {
    id: "parallel",
    name: "Parallel",
    prompt: "Measure the two facing runs.",
    corners: 0,
    legs: [
      { id: "a", label: "Length A", hint: "First run", typical: 9 },
      { id: "b", label: "Length B", hint: "Facing run", typical: 9 },
    ],
  },
  {
    id: "u-shape",
    name: "U-Shape",
    prompt: "Measure all three walls.",
    corners: 2,
    legs: [
      { id: "a", label: "Length A", hint: "Back wall", typical: 9 },
      { id: "b", label: "Length B", hint: "Left return", typical: 7 },
      { id: "c", label: "Length C", hint: "Right return", typical: 7 },
    ],
  },
];

/**
 * The three packages, rate per square foot of cabinetry.
 *
 * Rates and specification lines are Modula's. The tier *names* stay
 * interiOne's — the finishes section already calls them Select, Premier and
 * Signature, and one vocabulary per site matters more than matching the
 * factory's label. Modula's equivalents are noted for whoever reconciles the
 * two rate cards.
 */
export const RANGE_RATES: Record<
  RangeId,
  {
    label: string;
    /** The same tier on modula.in. */
    modulaName: string;
    tag: string;
    perSqFt: number;
    note: string;
    /** Straight off Modula's package comparison. */
    spec: { label: string; value: string }[];
  }
> = {
  select: {
    label: "Select",
    modulaName: "Essentials",
    tag: "Basic",
    perSqFt: 3600,
    note: "Matte laminates, the core hardware set",
    spec: [
      { label: "Colours & finishes", value: "Limited colour options" },
      {
        label: "Convenience",
        value: "Maximum shutters, essential drawers",
      },
      { label: "Hardware", value: "Blum Antaro box" },
      { label: "Accessories & lighting", value: "Basic organisers" },
    ],
  },
  premier: {
    label: "Premier",
    modulaName: "Premium",
    tag: "Advanced",
    perSqFt: 5600,
    note: "Textured and grain finishes, glass shutters",
    spec: [
      {
        label: "Colours & finishes",
        value: "More colour options, glass shutters",
      },
      { label: "Convenience", value: "More drawers and lift-ups" },
      { label: "Hardware", value: "Blum Legrabox" },
      {
        label: "Accessories & lighting",
        value: "Basic organisers, under-cabinet lighting",
      },
    ],
  },
  signature: {
    label: "Signature",
    modulaName: "Signature",
    tag: "Pro",
    perSqFt: 7600,
    note: "Gloss, veneer and metallics, full hardware",
    spec: [
      {
        label: "Colours & finishes",
        value: "Maximum colours, patterned and tinted glass",
      },
      { label: "Convenience", value: "Maximum drawers and lift-ups" },
      { label: "Hardware", value: "Blum Legrabox with Tip-on" },
      {
        label: "Accessories & lighting",
        value: "Premium organisers, under- and in-cabinet lighting",
      },
    ],
  },
};

/** Priced per running foot of counter, not per square foot of cabinetry. */
export const COUNTERTOPS = [
  { id: "granite", label: "Granite", perFoot: 2600 },
  { id: "quartz", label: "Quartz", perFoot: 4800 },
  { id: "none", label: "Reuse existing", perFoot: 0 },
] as const;

export type CountertopId = (typeof COUNTERTOPS)[number]["id"];

/** Fixed-price units and appliances, outside the cabinetry rate. */
export const EXTRAS = [
  { id: "tall", label: "Tall unit", price: 48000 },
  { id: "chimney", label: "Chimney", price: 35000 },
  { id: "hob", label: "Hob", price: 25000 },
  { id: "sink", label: "Sink & tap", price: 18000 },
  { id: "oven", label: "Built-in oven", price: 40000 },
  { id: "dishwasher", label: "Dishwasher", price: 55000 },
] as const;

export type ExtraId = (typeof EXTRAS)[number]["id"];

/** Running feet of cabinetry, corners already deducted. */
export function runningFeet(layout: EstimatorLayout, lengths: Record<LegId, number>) {
  const total = layout.legs.reduce((sum, leg) => sum + (lengths[leg.id] || 0), 0);
  return Math.max(0, total - layout.corners * CORNER_ALLOWANCE);
}

/** Square feet of cabinetry, rounded the way Modula's calculator rounds it. */
export function cabinetArea(feet: number) {
  return Math.round(feet * AREA_PER_RFT * 100) / 100;
}
