import {
  APPLIANCES,
  COUNTER_MATERIALS,
  COUNTER_THICKNESS,
  DRAWER_HARDWARE,
  OPENING_STYLES,
  PLINTH,
  getUnit,
  type CabinetTier,
  type CabinetUnit,
  type HardwareId,
  type OpeningId,
} from "@/data/catalogue";
import { GST_RATE, RANGE_RATES } from "@/data/estimator";
import type { RangeId } from "@/data/finishes";

/**
 * The planner's arithmetic: what fits, what it is called, and what it costs.
 *
 * Kept out of the component on purpose. A kitchen plan is a document — it has
 * to survive being priced, drawn, listed as a bill of materials and sent to the
 * studio, and every one of those needs the same numbers. Doing the maths in the
 * view means four subtly different answers to "how wide is this run".
 *
 * Millimetres everywhere. Feet exist only at the boundary, where a customer
 * types a wall length.
 */

export const MM_PER_FOOT = 304.8;

export const toMm = (feet: number) => feet * MM_PER_FOOT;
export const toFeet = (mm: number) => mm / MM_PER_FOOT;

/** mm² in a square foot — the divisor for every area in here. */
const SQ_FT = 92903.04;

export type PlacedUnit = {
  /** Stable across reorders, so React keys and drag both behave. */
  key: string;
  unitId: string;
  width: number;
  hardware: HardwareId;
};

export type WallId = "a" | "b" | "c";

export type PlannerWall = {
  id: WallId;
  label: string;
  /** What the customer measured, in feet. */
  lengthFt: number;
  /** One row per tier. Tall units live in `lower` and rise through the rest. */
  rows: Record<Exclude<CabinetTier, "tall">, PlacedUnit[]>;
};

export type Plan = {
  layoutId: string;
  walls: PlannerWall[];
  range: RangeId;
  opening: OpeningId;
  /** Which slab, from `COUNTER_MATERIALS`. Priced by the running foot. */
  counterId: string;
  appliances: string[];
};

export function emptyWall(id: WallId, label: string, lengthFt: number): PlannerWall {
  return { id, label, lengthFt, rows: { lower: [], upper: [], loft: [] } };
}

/** A tall unit is placed in the lower row but is not a lower cabinet. */
export const rowFor = (unit: CabinetUnit): Exclude<CabinetTier, "tall"> =>
  unit.tier === "tall" ? "lower" : unit.tier;

export const runWidth = (units: PlacedUnit[]) =>
  units.reduce((sum, unit) => sum + unit.width, 0);

/** What is left of the wall on that row, in mm. Negative means over-run. */
export function remaining(wall: PlannerWall, tier: Exclude<CabinetTier, "tall">) {
  return Math.round(toMm(wall.lengthFt) - runWidth(wall.rows[tier]));
}

/** The face the customer sees, in square feet — what the rate is charged on. */
export function faceArea(unit: CabinetUnit, width: number) {
  return (width * unit.height) / SQ_FT;
}

/**
 * One unit's price.
 *
 * Face area × the range's rate per square foot, which is exactly how Modula's
 * own calculator arrives at a number — the difference here is that the area is
 * the real sum of what has been placed rather than an assumed 4.5 sq ft for
 * every running foot. A kitchen with no loft costs less here, and should.
 */
export function unitPrice(placed: PlacedUnit, range: RangeId) {
  const unit = getUnit(placed.unitId);
  if (!unit) return 0;

  const hardware = DRAWER_HARDWARE.find((h) => h.id === placed.hardware);
  const factor = unit.hardware ? (hardware?.factor ?? 1) : 1;

  return Math.round(faceArea(unit, placed.width) * RANGE_RATES[range].perSqFt * factor);
}

export type BomRow = {
  code: string;
  name: string;
  width: number;
  tier: CabinetTier;
  hardware?: string;
  qty: number;
  each: number;
  total: number;
};

/**
 * The bill of materials — the plan as the factory reads it.
 *
 * Identical units collapse into one row with a quantity, keyed on everything
 * that would make two lines genuinely different: the code, the width and the
 * hardware. Two 600mm drawer units with different runners are two line items,
 * because they are two different parts.
 */
export function billOfMaterials(plan: Plan, range: RangeId): BomRow[] {
  const rows = new Map<string, BomRow>();

  for (const wall of plan.walls) {
    for (const tier of ["lower", "upper", "loft"] as const) {
      for (const placed of wall.rows[tier]) {
        const unit = getUnit(placed.unitId);
        if (!unit) continue;

        const hardware = unit.hardware
          ? DRAWER_HARDWARE.find((h) => h.id === placed.hardware)?.name
          : undefined;
        const code = unit.codes[placed.width] ?? Object.values(unit.codes)[0] ?? "—";
        const key = `${code}|${placed.width}|${hardware ?? ""}`;
        const each = unitPrice(placed, range);

        const existing = rows.get(key);
        if (existing) {
          existing.qty += 1;
          existing.total += each;
        } else {
          rows.set(key, {
            code,
            name: unit.name,
            width: placed.width,
            tier: unit.tier,
            hardware,
            qty: 1,
            each,
            total: each,
          });
        }
      }
    }
  }

  const order: CabinetTier[] = ["lower", "tall", "upper", "loft"];
  return [...rows.values()].sort(
    (a, b) => order.indexOf(a.tier) - order.indexOf(b.tier) || a.code.localeCompare(b.code)
  );
}

export type Totals = {
  cabinetry: number;
  counter: number;
  opening: number;
  appliances: number;
  subtotal: number;
  gst: number;
  total: number;
  /** Running feet of counter — the number the studio quotes stone against. */
  counterFeet: number;
  unitCount: number;
};

export function totals(plan: Plan, range: RangeId): Totals {
  const bom = billOfMaterials(plan, range);
  const cabinetry = bom.reduce((sum, row) => sum + row.total, 0);
  const unitCount = bom.reduce((sum, row) => sum + row.qty, 0);

  // The opening detail is bought by the metre of counter, not per cabinet.
  const counterMm = plan.walls.reduce(
    (sum, wall) => sum + runWidth(wall.rows.lower),
    0
  );
  const profile = OPENING_STYLES.find((o) => o.id === plan.opening);
  const opening = Math.round((counterMm / 1000) * (profile?.perMetre ?? 0));

  // Stone is sold by the running foot of counter, which is the lower run and
  // nothing else — wall cabinets do not have a slab on them.
  const counterFeet = toFeet(counterMm);
  const material = COUNTER_MATERIALS.find((m) => m.id === plan.counterId);
  const counter = Math.round(counterFeet * (material?.perFoot ?? 0));

  const appliances = APPLIANCES.filter((a) => plan.appliances.includes(a.id)).reduce(
    (sum, a) => sum + a.price,
    0
  );

  const subtotal = cabinetry + counter + opening + appliances;
  const gst = Math.round(subtotal * GST_RATE);

  return {
    cabinetry,
    counter,
    opening,
    appliances,
    subtotal,
    gst,
    total: subtotal + gst,
    counterFeet: Math.round(counterFeet * 10) / 10,
    unitCount,
  };
}

/**
 * Everything wrong with the plan, in the order a designer would raise it.
 *
 * Warnings rather than blocks. A half-drawn plan is a normal state to be in on
 * the way to a finished one, and a planner that refuses to price until every
 * wall is exactly full is a planner people close.
 */
export function warnings(plan: Plan): string[] {
  const out: string[] = [];

  for (const wall of plan.walls) {
    for (const tier of ["lower", "upper", "loft"] as const) {
      const left = remaining(wall, tier);
      if (left < 0) {
        out.push(
          `${wall.label}: the ${tier} run is ${Math.abs(left)}mm longer than the wall.`
        );
      } else if (left > 0 && left < 100 && wall.rows[tier].length) {
        out.push(
          `${wall.label}: ${left}mm left on the ${tier} run — too narrow for a filler.`
        );
      }
    }
  }

  const placed = plan.walls.flatMap((w) => [...w.rows.lower, ...w.rows.upper]);
  const units = placed.map((p) => getUnit(p.unitId));

  if (!units.some((u) => u?.fixture === "sink")) {
    out.push("No sink unit yet — every kitchen needs one.");
  }
  if (!units.some((u) => u?.fixture === "hob")) {
    out.push("No hob unit yet.");
  }

  for (const id of plan.appliances) {
    const appliance = APPLIANCES.find((a) => a.id === id);
    if (!appliance?.requires) continue;

    const needsTower = appliance.requires.includes("tower");
    const needsSink = appliance.requires.includes("sink");
    const needsHob = appliance.requires.includes("hob");
    const needsDishwasher = appliance.requires.includes("dishwasher");

    const satisfied = units.some((u) => {
      if (!u) return false;
      if (needsTower) return u.id === "tall-appliance";
      if (needsDishwasher) return u.id === "lower-dishwasher";
      if (needsSink) return u.fixture === "sink";
      if (needsHob) return u.fixture === "hob";
      return true;
    });

    if (!satisfied) {
      out.push(`${appliance.name} needs ${appliance.requires} in the plan.`);
    }
  }

  return out;
}

/** Where each tier sits vertically, in mm from the floor. Drives the elevation. */
export function tierBand(tier: Exclude<CabinetTier, "tall">) {
  switch (tier) {
    case "lower":
      return { bottom: PLINTH, height: 734 };
    case "upper":
      return { bottom: PLINTH + 734 + COUNTER_THICKNESS + 600, height: 668 };
    case "loft":
      return { bottom: PLINTH + 734 + COUNTER_THICKNESS + 600 + 668, height: 400 };
  }
}

/** Total wall height the elevation has to fit, including the loft. */
export const WALL_HEIGHT = PLINTH + 734 + COUNTER_THICKNESS + 600 + 668 + 400;

/**
 * The plan as a sentence, for the WhatsApp handoff.
 *
 * Deliberately plain text: it has to survive being pasted into a chat, an email
 * and a CRM note, and the studio has to be able to read it without opening
 * anything.
 */
export function planSummary(plan: Plan, range: RangeId) {
  const bom = billOfMaterials(plan, range);
  const sums = totals(plan, range);
  const lines = [
    `interiOne kitchen plan`,
    `Layout: ${plan.layoutId} · Finish: ${RANGE_RATES[range].label}`,
    `Walls: ${plan.walls.map((w) => `${w.label} ${w.lengthFt}ft`).join(", ")}`,
    "",
    ...bom.map(
      (row) =>
        `${row.qty}× ${row.code} · ${row.name} ${row.width}mm${row.hardware ? ` · ${row.hardware}` : ""}`
    ),
    "",
    `${sums.unitCount} units · ${sums.counterFeet} ft of counter`,
    `Indicative total incl. GST: ₹${sums.total.toLocaleString("en-IN")}`,
  ];
  return lines.join("\n");
}
