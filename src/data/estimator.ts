/**
 * Indicative pricing model.
 *
 * Structured the way the Indian trade quotes — and the way the reference
 * calculators ask — per running foot (rft) of cabinet line, layout first,
 * then size, then finish. Modula's own calculator opens on the same four
 * layouts (straight, L, parallel, U), which is why "Straight" exists here.
 *
 * Rates are anchored to the Q3 2026 market bands: laminate ₹9,500–14,000/rft,
 * membrane ₹11,000–15,500, acrylic ₹15,000–22,000, PU ₹18,000–28,000 — all
 * inclusive of carcass, shutters and standard hardware. Branded showrooms sit
 * 30–60% above an equivalent local fit-out, and a steel-composite carcass
 * carries a further premium over ply, so interiOne is placed near the top of
 * each band rather than the middle.
 *
 * INTERNAL NOTE — confirm against the current interiOne rate card before
 * launch. An estimator that under-reads by a lakh does more damage than no
 * estimator at all.
 */

import type { RangeId } from "./finishes";

/** Base cabinetry: carcass, shutters, standard soft-close hardware. */
export const RANGE_RATES: Record<
  RangeId,
  { label: string; perFoot: number; note: string }
> = {
  select: {
    label: "Select",
    perFoot: 15000,
    note: "Matte laminates, the core hardware set",
  },
  premier: {
    label: "Premier",
    perFoot: 21000,
    note: "Textured and grain finishes, wider hardware",
  },
  signature: {
    label: "Signature",
    perFoot: 29000,
    note: "Gloss, veneer and metallics, full hardware",
  },
};

/**
 * Typical counter run per layout — the slider's starting point. An L-shape in
 * an Indian 2–3BHK runs 12–16 ft, which is the market's most common kitchen.
 */
export const LAYOUT_DEFAULTS: Record<string, number> = {
  straight: 10,
  "l-shape": 14,
  parallel: 18,
  island: 16,
  "u-shape": 22,
};

export const RUN_MIN = 8;
export const RUN_MAX = 32;

export const COUNTERTOPS = [
  { id: "granite", label: "Granite", perFoot: 2600 },
  { id: "quartz", label: "Quartz", perFoot: 4800 },
  { id: "none", label: "Reuse existing", perFoot: 0 },
] as const;

export type CountertopId = (typeof COUNTERTOPS)[number]["id"];

/** Storage that is priced off the run rather than as a unit. */
export const STORAGE = [
  {
    id: "loft",
    label: "Loft units above",
    detail: "Full-width storage over the wall cabinets",
    perFoot: 6500,
  },
  {
    id: "drawers",
    label: "Drawer package",
    detail: "Base units on drawers instead of shutters",
    perFoot: 2900,
  },
] as const;

export type StorageId = (typeof STORAGE)[number]["id"];

/** Fixed-price units and appliances. */
export const EXTRAS = [
  { id: "tall", label: "Tall unit", price: 48000 },
  { id: "chimney", label: "Chimney", price: 35000 },
  { id: "hob", label: "Hob", price: 25000 },
  { id: "sink", label: "Sink & tap", price: 18000 },
  { id: "oven", label: "Built-in oven", price: 40000 },
  { id: "dishwasher", label: "Dishwasher", price: 55000 },
] as const;

export type ExtraId = (typeof EXTRAS)[number]["id"];

/** The band either side of the midpoint, before the site survey narrows it. */
export const SPREAD = 0.07;
