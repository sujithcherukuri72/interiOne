/**
 * The Modula cabinet matrix, as data.
 *
 * Transcribed from *The Modula Blueprint* (Vol 1 Rev 4, 16.02.2026), the
 * product catalogue in `public/assets/catalogue`. Codes, widths, depths and
 * heights are the catalogue's own — this is the same matrix a dealer quotes
 * from, so a plan built here can be handed to the factory without translation.
 *
 * Not every code is here. The catalogue lists each unit again for every
 * hardware and handle permutation (`MK-0677` Antaro, `MK-0670` Legra, and the
 * same two with handles), which is four codes for one thing a customer is
 * choosing once. What is modelled is the *unit* — its shape, its widths and its
 * base code — with hardware chosen separately and the variant codes resolved on
 * the way out. Anything genuinely missing is a unit nobody plans a kitchen
 * around; add it here and it appears in the planner with no other change.
 *
 * Millimetres throughout, because that is what the catalogue uses and what the
 * factory cuts to. Feet appear only where a customer is asked to measure.
 */

/** Where a unit lives in the run. Drives the elevation's stacking. */
export type CabinetTier = "lower" | "upper" | "loft" | "tall";

/** What to draw. The plan is a shop drawing, so each type has a symbol. */
export type CabinetGlyph =
  | "door"
  | "doors"
  | "drawers"
  | "sink"
  | "hob"
  | "corner"
  | "tall"
  | "open"
  | "appliance"
  | "filler";

export type CabinetUnit = {
  id: string;
  /** The catalogue's own name for the unit. */
  name: string;
  tier: CabinetTier;
  glyph: CabinetGlyph;
  /** Available widths in mm — the customer picks one of these. */
  widths: number[];
  depth: number;
  height: number;
  /** Catalogue code per width. Missing widths fall back to `code`. */
  codes: Record<number, string>;
  /** Whether the unit takes a drawer-hardware choice (Antaro / Legrabox). */
  hardware?: boolean;
  /** Short note for the palette — what it is actually for. */
  note?: string;
  /** A hob or sink cut into the counter above this unit. */
  fixture?: "hob" | "sink";
};

/* ── Lower cabinets ─────────────────────────────────────────────────────────
   Catalogue pages 14–21. Depth 570, height 734 throughout. */

const LOWER: CabinetUnit[] = [
  {
    id: "lower-1door",
    name: "1 Door 1 Shelf Unit",
    tier: "lower",
    glyph: "door",
    widths: [400, 450, 600],
    depth: 570,
    height: 734,
    codes: { 400: "MK-0276", 450: "MK-0275", 600: "MK-0260" },
    note: "The default base unit",
  },
  {
    id: "lower-2door",
    name: "2 Door 1 Shelf Unit",
    tier: "lower",
    glyph: "doors",
    widths: [800],
    depth: 570,
    height: 734,
    codes: { 800: "MK-0278" },
  },
  {
    id: "lower-2drawer",
    name: "2 Drawer Unit",
    tier: "lower",
    glyph: "drawers",
    widths: [450, 600, 800, 900],
    depth: 570,
    height: 734,
    codes: { 450: "MK-0677", 600: "MK-0546", 800: "MK-0679", 900: "MK-0670" },
    hardware: true,
  },
  {
    id: "lower-3drawer",
    name: "3 Drawer Unit",
    tier: "lower",
    glyph: "drawers",
    widths: [450, 600, 900],
    depth: 570,
    height: 734,
    codes: { 450: "MK-0670", 600: "MK-0549", 900: "MK-0517" },
    hardware: true,
    note: "Pots and pans, not plates",
  },
  {
    id: "lower-hob-3drawer",
    name: "3 Drawer Hob Unit",
    tier: "lower",
    glyph: "hob",
    widths: [600, 900],
    depth: 570,
    height: 734,
    codes: { 600: "MK-0551", 900: "MK-0515" },
    hardware: true,
    fixture: "hob",
    note: "Takes the hob above",
  },
  {
    id: "lower-hob-2drawer",
    name: "2 Drawer (Internal) Hob Unit",
    tier: "lower",
    glyph: "hob",
    widths: [600, 800, 900],
    depth: 570,
    height: 734,
    codes: { 600: "MK-0812", 800: "MK-0753", 900: "MK-0811" },
    hardware: true,
    fixture: "hob",
  },
  {
    id: "lower-sink-1door",
    name: "1 Door Sink Unit",
    tier: "lower",
    glyph: "sink",
    widths: [450, 600],
    depth: 570,
    height: 734,
    codes: { 450: "MK-0541", 600: "MK-0631" },
    fixture: "sink",
  },
  {
    id: "lower-sink-2door",
    name: "2 Door Sink Unit",
    tier: "lower",
    glyph: "sink",
    widths: [800],
    depth: 570,
    height: 734,
    codes: { 800: "MK-0314" },
    fixture: "sink",
  },
  {
    id: "lower-sink-2drawer",
    name: "2 Drawer Sink Unit",
    tier: "lower",
    glyph: "sink",
    widths: [800, 900],
    depth: 570,
    height: 734,
    codes: { 800: "MK-0319", 900: "MK-0320" },
    hardware: true,
    fixture: "sink",
  },
  {
    id: "lower-bottle",
    name: "Bottle Pull Out",
    tier: "lower",
    glyph: "drawers",
    widths: [200, 300],
    depth: 570,
    height: 734,
    codes: { 200: "MK-0199", 300: "MK-0206" },
    hardware: true,
    note: "Oils and bottles, beside the hob",
  },
  {
    id: "lower-wicker",
    name: "2 Wicker Basket Unit",
    tier: "lower",
    glyph: "drawers",
    widths: [450],
    depth: 570,
    height: 734,
    codes: { 450: "MK-0682" },
    note: "Onions and potatoes — ventilated",
  },
  {
    id: "lower-grain",
    name: "Grain Trolley + Internal Drawer",
    tier: "lower",
    glyph: "drawers",
    widths: [450],
    depth: 570,
    height: 734,
    codes: { 450: "MK-0628" },
    hardware: true,
    note: "The rice and dal drawer",
  },
  {
    id: "lower-cylinder",
    name: "1 Door Cylinder Unit",
    tier: "lower",
    glyph: "door",
    widths: [400, 450, 600],
    depth: 570,
    height: 734,
    codes: { 400: "MK-0633", 450: "MK-0428", 600: "MK-0631" },
    note: "Ventilated, for the LPG cylinder",
  },
  {
    id: "lower-dishwasher",
    name: "Dishwasher Unit",
    tier: "lower",
    glyph: "appliance",
    widths: [600],
    depth: 570,
    height: 734,
    codes: { 600: "MK-0997" },
    note: "Housing only — the machine is separate",
  },
  {
    id: "lower-magic-corner",
    name: "Magic Corner",
    tier: "lower",
    glyph: "corner",
    widths: [900, 1000],
    depth: 570,
    height: 734,
    codes: { 900: "MK-0937", 1000: "MK-0938" },
    note: "Pulls the dead corner out to you",
  },
  {
    id: "lower-cargoman",
    name: "Cargoman Corner Unit",
    tier: "lower",
    glyph: "corner",
    widths: [900, 1000],
    depth: 570,
    height: 734,
    codes: { 900: "MK-0666", 1000: "MK-0667" },
  },
  {
    id: "lower-corner-shelf",
    name: "1 Shelf Corner Unit",
    tier: "lower",
    glyph: "corner",
    widths: [1000, 1050],
    depth: 570,
    height: 734,
    codes: { 1000: "MK-0559", 1050: "MK-0560" },
    note: "The cheap way to turn a corner",
  },
];

/* ── Upper cabinets ─────────────────────────────────────────────────────────
   Pages 22–27. Depth 330 (348 for open shelving), height 668. */

const UPPER: CabinetUnit[] = [
  {
    id: "upper-1door",
    name: "1 Door 1 Shelf",
    tier: "upper",
    glyph: "door",
    widths: [400, 450, 600],
    depth: 330,
    height: 668,
    codes: { 400: "MK-0662", 450: "MK-0663", 600: "MK-0665" },
  },
  {
    id: "upper-2door",
    name: "2 Door 1 Shelf",
    tier: "upper",
    glyph: "doors",
    widths: [800, 900],
    depth: 330,
    height: 668,
    codes: { 800: "MK-0742", 900: "MK-0743" },
  },
  {
    id: "upper-open",
    name: "Open Shelving",
    tier: "upper",
    glyph: "open",
    widths: [175, 200, 250, 300],
    depth: 348,
    height: 668,
    codes: { 175: "MK-0777", 200: "MK-0766", 250: "MK-0775", 300: "MK-0725" },
    note: "Breaks up a wall of shutters",
  },
  {
    id: "upper-bifold",
    name: "Bi-fold Unit",
    tier: "upper",
    glyph: "doors",
    widths: [600, 800, 900],
    depth: 330,
    height: 668,
    codes: { 600: "MK-1045", 800: "MK-1046", 900: "MK-1047" },
    note: "Folds up and out of the way",
  },
  {
    id: "upper-rolling",
    name: "Rolling Shutter Unit",
    tier: "upper",
    glyph: "open",
    widths: [450, 600],
    depth: 570,
    height: 668,
    codes: { 450: "MK-0717", 600: "MK-0718" },
    note: "Hides the appliance garage",
  },
  {
    id: "upper-blind-corner",
    name: "Blind Corner Unit",
    tier: "upper",
    glyph: "corner",
    widths: [800],
    depth: 330,
    height: 668,
    codes: { 800: "MK-1080" },
  },
  {
    id: "upper-gtpt",
    name: "2 Door GTPT Unit (Ebco)",
    tier: "upper",
    glyph: "doors",
    widths: [800, 900],
    depth: 330,
    height: 668,
    codes: { 800: "MK-1041", 900: "MK-1142" },
    note: "Glass and tumbler pull-out",
  },
];

/* ── Loft units ─────────────────────────────────────────────────────────────
   Pages 28–31. The band above the wall cabinets, up to the slab. */

const LOFT: CabinetUnit[] = [
  {
    id: "loft-1door",
    name: "1 Door Loft (Box)",
    tier: "loft",
    glyph: "door",
    widths: [400, 450, 600],
    depth: 570,
    height: 400,
    codes: { 400: "MK-1082", 450: "MK-1083", 600: "MK-1084" },
  },
  {
    id: "loft-2door",
    name: "2 Door Loft (Box)",
    tier: "loft",
    glyph: "doors",
    widths: [800, 900],
    depth: 570,
    height: 400,
    codes: { 800: "MK-0567", 900: "MK-0568" },
  },
  {
    id: "loft-liftup",
    name: "Lift Up Loft (Box)",
    tier: "loft",
    glyph: "door",
    widths: [400, 800, 900],
    depth: 570,
    height: 400,
    codes: { 400: "MK-0883", 800: "MK-0886", 900: "MK-0891" },
    note: "Opens upward — nothing in your way",
  },
];

/* ── Tall towers ────────────────────────────────────────────────────────────
   Pages 32–35. Height 2022, floor to loft in one unit. */

const TALL: CabinetUnit[] = [
  {
    id: "tall-larder",
    name: "Larder Pullout",
    tier: "tall",
    glyph: "tall",
    widths: [300],
    depth: 570,
    height: 2022,
    codes: { 300: "MK-0484" },
    note: "A whole pantry in 300mm",
  },
  {
    id: "tall-pantry-pullout",
    name: "Pantry Pullout 1 Door",
    tier: "tall",
    glyph: "tall",
    widths: [450, 600],
    depth: 570,
    height: 2022,
    codes: { 450: "MK-0307", 600: "MK-0524" },
  },
  {
    id: "tall-pantry-shelf",
    name: "1 Door Pantry Shelf",
    tier: "tall",
    glyph: "tall",
    widths: [450, 600],
    depth: 570,
    height: 2022,
    codes: { 450: "MK-0760", 600: "MK-0758" },
    note: "Five shelves",
  },
  {
    id: "tall-space-1door",
    name: "1 Door Space Tower",
    tier: "tall",
    glyph: "tall",
    widths: [600, 800],
    depth: 570,
    height: 2022,
    codes: { 600: "MK-1026", 800: "MK-1187" },
    hardware: true,
  },
  {
    id: "tall-space-2door",
    name: "2 Door Space Tower",
    tier: "tall",
    glyph: "tall",
    widths: [600, 800],
    depth: 570,
    height: 2022,
    codes: { 600: "MK-1025", 800: "MK-1189" },
    hardware: true,
  },
  {
    id: "tall-appliance",
    name: "Appliance Tower",
    tier: "tall",
    glyph: "appliance",
    widths: [600],
    depth: 570,
    height: 2022,
    codes: { 600: "MK-1088" },
    hardware: true,
    note: "Oven and microwave, at eye level",
  },
];

/* ── Fillers ────────────────────────────────────────────────────────────────
   Pages 38–41. What closes the gap when the units do not sum to the wall. */

const FILLERS: CabinetUnit[] = [
  {
    id: "filler-lower",
    name: "Lower Filler",
    tier: "lower",
    glyph: "filler",
    widths: [100, 200, 300],
    depth: 570,
    height: 734,
    codes: { 100: "FIL-0001", 200: "FIL-0002", 300: "FIL-0003" },
  },
  {
    id: "filler-upper",
    name: "Upper Filler",
    tier: "upper",
    glyph: "filler",
    widths: [100, 200, 300],
    depth: 330,
    height: 668,
    codes: { 100: "FIL-0004", 200: "FIL-0005", 300: "FIL-0006" },
  },
  {
    id: "filler-loft",
    name: "Loft Filler",
    tier: "loft",
    glyph: "filler",
    widths: [100, 200, 300],
    depth: 330,
    height: 400,
    codes: { 100: "FIL-0010", 200: "FIL-0011", 300: "FIL-0012" },
  },
  {
    id: "filler-tall",
    name: "Tall Tower Filler",
    tier: "tall",
    glyph: "filler",
    widths: [100, 200, 300],
    depth: 570,
    height: 2022,
    codes: { 100: "FIL-0031", 200: "FIL-0032", 300: "FIL-0033" },
  },
];

export const CABINETS: CabinetUnit[] = [...LOWER, ...UPPER, ...LOFT, ...TALL, ...FILLERS];

export const CABINETS_BY_TIER: Record<CabinetTier, CabinetUnit[]> = {
  lower: [...LOWER, FILLERS[0]],
  upper: [...UPPER, FILLERS[1]],
  loft: [...LOFT, FILLERS[2]],
  tall: [...TALL, FILLERS[3]],
};

export const TIER_LABELS: Record<CabinetTier, string> = {
  lower: "Lower",
  upper: "Upper",
  loft: "Loft",
  tall: "Tall tower",
};

export const getUnit = (id: string) => CABINETS.find((unit) => unit.id === id);

/* ── Hardware ───────────────────────────────────────────────────────────────
   Page 71: Blum on the drawers, Hettich on the baskets, Modula's own on the
   doors. The customer chooses the drawer system, which is the one that shows
   and the one that carries the price difference. */

export const DRAWER_HARDWARE = [
  {
    id: "antaro",
    name: "Blum TANDEMBOX Antaro",
    note: "Steel sided, BLUMOTION soft close",
    /** Multiplier on a unit that takes drawers. */
    factor: 1,
  },
  {
    id: "legrabox",
    name: "Blum LEGRABOX Pure",
    note: "Slim straight sides, the quieter close",
    factor: 1.12,
  },
] as const;

export type HardwareId = (typeof DRAWER_HARDWARE)[number]["id"];

/* ── Countertop profiles ────────────────────────────────────────────────────
   Page 50. How the shutter is opened: a routed channel, or a handle. */

export const OPENING_STYLES = [
  {
    id: "gola",
    name: "Gola profile",
    note: "A channel behind the counter edge — no handle at all",
    /** Per running metre of run, added to the total. */
    perMetre: 1400,
  },
  {
    id: "handle",
    name: "Handle",
    note: "Aluminium or zinc, from the profile range",
    perMetre: 700,
  },
] as const;

export type OpeningId = (typeof OPENING_STYLES)[number]["id"];

/* ── Appliances ─────────────────────────────────────────────────────────────
   Pages 53–57. Electrolux for the cooking line, Nirali for the sinks.
   Dimensions are the catalogue's; prices are interiOne's supply rates. */

/** Which drawing stands in for the appliance until a photograph exists. */
export type ApplianceKind =
  | "hob-gas"
  | "hob-induction"
  | "hood-slope"
  | "hood-box"
  | "oven"
  | "microwave"
  | "sink-single"
  | "sink-double"
  | "dishwasher";

export type Appliance = {
  id: string;
  name: string;
  brand: string;
  group: "Hob" | "Hood" | "Oven" | "Sink" | "Dishwasher";
  spec: string;
  price: number;
  kind: ApplianceKind;
  /**
   * A product photograph, once there is one. Drop files in
   * `public/assets/appliances` and set the path here; the drawn glyph is used
   * until then, so the list is never waiting on a photo shoot.
   */
  image?: string;
  /** The unit this needs under or around it, if any. */
  requires?: string;
};

export const APPLIANCES: Appliance[] = [
  {
    id: "hob-60-gas",
    kind: "hob-gas",
    name: "60 cm UltimateTaste 300 Hob",
    brand: "Electrolux",
    group: "Hob",
    spec: "4 burner gas",
    price: 25000,
    requires: "a hob unit",
  },
  {
    id: "hob-90-gas",
    kind: "hob-gas",
    name: "90 cm UltimateTaste 300 Hob",
    brand: "Electrolux",
    group: "Hob",
    spec: "5 burner gas",
    price: 38000,
    requires: "a 900mm hob unit",
  },
  {
    id: "hob-60-induction",
    kind: "hob-induction",
    name: "60 cm UltimateTaste 700 Induction Hob",
    brand: "Electrolux",
    group: "Hob",
    spec: "4 zone induction",
    price: 62000,
    requires: "a hob unit",
  },
  {
    id: "hood-60-slope",
    kind: "hood-slope",
    name: "60 cm Slope Extractor Hood",
    brand: "Electrolux",
    group: "Hood",
    spec: "845 × 600 × 325 mm",
    price: 32000,
  },
  {
    id: "hood-90-semi",
    kind: "hood-slope",
    name: "90 cm Semi Slope Extractor Hood",
    brand: "Electrolux",
    group: "Hood",
    spec: "675 × 900 × 420 mm",
    price: 45000,
  },
  {
    id: "hood-90-tbox",
    kind: "hood-box",
    name: "90 cm T-Box Extractor Hood",
    brand: "Electrolux",
    group: "Hood",
    spec: "490 × 900 × 432 mm",
    price: 52000,
  },
  {
    id: "oven-60-600",
    kind: "oven",
    name: "60 cm UltimateTaste 600 Built-In Oven",
    brand: "Electrolux",
    group: "Oven",
    spec: "72 litre",
    price: 58000,
    requires: "an appliance tower",
  },
  {
    id: "oven-60-900",
    kind: "oven",
    name: "60 cm UltimateTaste 900 Built-In Oven",
    brand: "Electrolux",
    group: "Oven",
    spec: "70 litre, pyrolytic",
    price: 94000,
    requires: "an appliance tower",
  },
  {
    id: "microwave-convection",
    kind: "microwave",
    name: "60 cm Built-In Convection Microwave",
    brand: "Electrolux",
    group: "Oven",
    spec: "30 litre",
    price: 42000,
    requires: "an appliance tower",
  },
  {
    id: "sink-single",
    kind: "sink-single",
    name: "Nirali single bowl",
    brand: "Nirali",
    group: "Sink",
    spec: "450 × 375 × 200 mm bowl · AJM S3",
    price: 18000,
    requires: "a sink unit",
  },
  {
    id: "sink-double",
    kind: "sink-double",
    name: "Nirali double bowl",
    brand: "Nirali",
    group: "Sink",
    spec: "610 × 460 × 254 mm bowl · AJM S7",
    price: 32000,
    requires: "a sink unit",
  },
  {
    id: "dishwasher-60",
    kind: "dishwasher",
    name: "60 cm UltimateCare 700 Dishwasher",
    brand: "Electrolux",
    group: "Dishwasher",
    spec: "13 place settings",
    price: 68000,
    requires: "a dishwasher unit",
  },
];

/* ── Colour ─────────────────────────────────────────────────────────────────
   Everything in a kitchen that is chosen for its colour rather than its size.
   Shutter colour comes from `data/finishes.ts` — these are the four surfaces
   around it, and between them they decide whether the drawing looks like the
   room someone is imagining. */

export type CounterMaterial = {
  id: string;
  name: string;
  /** Body colour of the slab. */
  hex: string;
  /** Fleck and vein colour, for the drawn stone. */
  fleck: string;
  /** Per running foot of counter. */
  perFoot: number;
};

export const COUNTER_MATERIALS: CounterMaterial[] = [
  { id: "granite-black", name: "Black granite", hex: "#2b2b30", fleck: "#5a5a63", perFoot: 2600 },
  { id: "granite-pearl", name: "Pearl granite", hex: "#b5afa3", fleck: "#8b8478", perFoot: 2600 },
  { id: "quartz-white", name: "White quartz", hex: "#ecebe6", fleck: "#c9c5bb", perFoot: 4800 },
  { id: "quartz-grey", name: "Storm quartz", hex: "#8e8f8c", fleck: "#6f706d", perFoot: 4800 },
  { id: "quartz-sand", name: "Sand quartz", hex: "#d6cbb6", fleck: "#b4a68c", perFoot: 4800 },
  { id: "none", name: "Reuse existing", hex: "#c6c1b5", fleck: "#aca698", perFoot: 0 },
];

/**
 * Handles, gola channels and skirting, which are all specified in the same
 * metal — catalogue pages 73 to 80. Choosing them separately is how you get a
 * kitchen with brass handles and a chrome sink profile, which nobody wants.
 */
export const METAL_FINISHES = [
  { id: "matt-black", name: "Matt black", hex: "#2a2a2c", sheen: "#4d4d50" },
  { id: "stainless", name: "Stainless", hex: "#b4b8bc", sheen: "#e2e5e8" },
  { id: "chrome", name: "Chrome", hex: "#cdd2d6", sheen: "#ffffff" },
  { id: "champagne", name: "Champagne gold", hex: "#c6a877", sheen: "#eddcb8" },
  { id: "rose", name: "Rose gold", hex: "#bd8d7c", sheen: "#e3bcae" },
  { id: "copper", name: "Copper", hex: "#a4673f", sheen: "#d29466" },
] as const;

export type MetalId = (typeof METAL_FINISHES)[number]["id"];

/** The wall between counter and wall cabinets — the one surface with pattern. */
export const SPLASHBACKS = [
  { id: "white", name: "White tile", hex: "#eeece7", grout: "#d5d1c8" },
  { id: "sand", name: "Sand tile", hex: "#ded3bf", grout: "#c2b59c" },
  { id: "sage", name: "Sage tile", hex: "#c2c9ba", grout: "#a4ac9a" },
  { id: "terracotta", name: "Terracotta", hex: "#c98a6b", grout: "#a96f52" },
  { id: "graphite", name: "Graphite", hex: "#4a4a4d", grout: "#3a3a3d" },
  { id: "mirror", name: "Back-painted glass", hex: "#dfe3e2", grout: "#dfe3e2" },
] as const;

export type SplashbackId = (typeof SPLASHBACKS)[number]["id"];

/* ── Standard heights ───────────────────────────────────────────────────────
   How the tiers stack up a wall, in mm from finished floor. Straight off the
   catalogue's own unit heights, plus the plinth and the counter. */

export const PLINTH = 100;
export const COUNTER_THICKNESS = 20;
/** Top of the counter — 854mm, the standard Indian working height. */
export const COUNTER_TOP = PLINTH + 734 + COUNTER_THICKNESS;
/** The gap between counter and wall cabinets. */
export const BACKSPLASH = 600;
export const UPPER_BOTTOM = COUNTER_TOP + BACKSPLASH;
export const UPPER_TOP = UPPER_BOTTOM + 668;
export const LOFT_TOP = UPPER_TOP + 400;
