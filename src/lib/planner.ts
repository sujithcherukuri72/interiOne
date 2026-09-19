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

/**
 * The accessories a customer actually chooses, each one a real catalogue unit.
 *
 * The planner no longer asks anyone to lay out cabinets — it lays the run
 * itself from the wall lengths — so this is the only place a choice changes
 * what is in the run. Everything here is a lower or tall unit, because that is
 * where storage accessories live; wall units are doors and nothing else.
 */
export const STORAGE_ACCESSORIES = [
  { id: "bottle", unitId: "lower-bottle", width: 300 },
  { id: "wicker", unitId: "lower-wicker", width: 450 },
  { id: "grain", unitId: "lower-grain", width: 450 },
  { id: "cylinder", unitId: "lower-cylinder", width: 450 },
  { id: "dishwasher", unitId: "lower-dishwasher", width: 600 },
  { id: "corner", unitId: "lower-magic-corner", width: 900 },
  { id: "larder", unitId: "tall-larder", width: 300 },
  { id: "pantry", unitId: "tall-pantry-pullout", width: 600 },
] as const;

export type AccessoryId = (typeof STORAGE_ACCESSORIES)[number]["id"];

/**
 * The run, laid out for them.
 *
 * A kitchen is not a free composition: the sink goes on the longest wall, the
 * hob goes beside it with drawers under, the chosen accessories take their
 * widths out of the same run, and whatever is left is doors and drawer banks
 * from the widest down. That is what a designer draws on the first visit, and
 * it is deterministic — so it belongs here rather than in a step that asked the
 * customer to do it themselves.
 *
 * Greedy, largest-first, and it never overruns: a unit is only placed if it
 * fits in what is left. The tail below the narrowest cabinet becomes a filler,
 * which is exactly what the factory does with it.
 */
const FILL_LOWER = [
  { unitId: "lower-3drawer", widths: [900, 600, 450] },
  { unitId: "lower-2door", widths: [800] },
  { unitId: "lower-2drawer", widths: [900, 800, 600, 450] },
  { unitId: "lower-1door", widths: [600, 450, 400] },
] as const;

const FILL_UPPER = [
  { unitId: "upper-2door", widths: [900, 800] },
  { unitId: "upper-1door", widths: [600, 450, 400] },
] as const;

const FILLER_WIDTHS = [300, 200, 100];

/** The narrowest thing worth placing before the tail becomes a filler. */
const MIN_CABINET = 400;

type AutoOptions = {
  accessories: readonly string[];
  hardware: HardwareId;
  /** Wall units above the run. Off for a wall the customer wants open. */
  uppers?: boolean;
};

function fillRow(
  spaceMm: number,
  table: readonly { unitId: string; widths: readonly number[] }[],
  fillerId: string,
  hardware: HardwareId,
  keyPrefix: string,
  seed: PlacedUnit[] = []
): PlacedUnit[] {
  const out = [...seed];
  let left = spaceMm - runWidth(seed);
  let n = out.length;

  while (left >= MIN_CABINET) {
    const pick = table
      .flatMap((entry) => entry.widths.map((width) => ({ ...entry, width })))
      .find((candidate) => candidate.width <= left);
    if (!pick) break;

    out.push({
      key: `${keyPrefix}-${n++}`,
      unitId: pick.unitId,
      width: pick.width,
      hardware,
    });
    left -= pick.width;
  }

  // The tail. A 240mm gap is a filler panel, not a hole in the run.
  const filler = FILLER_WIDTHS.find((w) => w <= left);
  if (filler) {
    out.push({ key: `${keyPrefix}-${n}`, unitId: fillerId, width: filler, hardware });
  }

  return out;
}

export function autoFillWall(
  wall: PlannerWall,
  { accessories, hardware, uppers = true }: AutoOptions,
  /** Only the first wall gets the sink, the hob and the accessories. */
  primary: boolean
): PlannerWall {
  const spaceMm = toMm(wall.lengthFt);
  if (spaceMm <= 0) return { ...wall, rows: { lower: [], upper: [], loft: [] } };

  const seed: PlacedUnit[] = [];
  /**
   * Tall units are placed in the lower row but rise the full height of the
   * wall, so they are held back and parked at the far end of the run — and the
   * wall cabinets stop short of them. Mixed into the middle they would have
   * wall units drawn straight through them in the elevation.
   */
  const towers: PlacedUnit[] = [];
  let n = 0;

  const place = (unitId: string, width: number, into = seed) => {
    if (runWidth(seed) + runWidth(towers) + width > spaceMm) return;
    into.push({ key: `${wall.id}-l-s${n++}`, unitId, width, hardware });
  };

  if (primary) {
    // The two fixtures every kitchen has, before anything optional.
    place("lower-sink-2door", 800);
    place("lower-hob-3drawer", 600);

    for (const id of accessories) {
      const accessory = STORAGE_ACCESSORIES.find((a) => a.id === id);
      if (!accessory) continue;
      const unit = getUnit(accessory.unitId);
      place(accessory.unitId, accessory.width, unit?.tier === "tall" ? towers : seed);
    }
  }

  const cabinetSpace = spaceMm - runWidth(towers);

  return {
    ...wall,
    rows: {
      lower: [
        ...fillRow(cabinetSpace, FILL_LOWER, "filler-lower", hardware, `${wall.id}-l`, seed),
        ...towers,
      ],
      upper: uppers
        ? fillRow(cabinetSpace, FILL_UPPER, "filler-upper", hardware, `${wall.id}-u`)
        : [],
      loft: [],
    },
  };
}

/** Every wall laid out at once — the plan the last step draws. */
export function autoFillWalls(walls: PlannerWall[], options: AutoOptions) {
  // The sink goes on the longest wall, which is where a designer puts it.
  const primary = walls.reduce(
    (best, w, i) => (w.lengthFt > walls[best].lengthFt ? i : best),
    0
  );
  return walls.map((wall, i) => autoFillWall(wall, options, i === primary));
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
      }
      // A tail under a filler's width is a scribe, not a fault: the run is
      // laid out here rather than by hand, so nobody can act on it anyway.
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
