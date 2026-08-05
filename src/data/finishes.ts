import { placeholder } from "@/lib/placeholder";

export type RangeId = "signature" | "premier" | "select";

export type Finish = {
  slug: string;
  name: string;
  range: RangeId;
  rangeLabel: string;
  type: string;
  code: string;
  hex: string;
  grain: string;
  sheen: string;
  /** One line — this is what the full-height listing band carries. */
  summary: string;
  tagline: string;
  /** The long version, for the detail takeover. */
  description: string;
  stats: { label: string; value: string }[];
  suited: string[];
  /** Environment shot for the detail hero — placeholder until studio shoots land. */
  image: string;
};

const rangeLabel: Record<RangeId, string> = {
  signature: "Signature",
  premier: "Premier",
  select: "Select",
};

export const finishes: Finish[] = [
  {
    slug: "tuscan-oak",
    name: "Tuscan Oak",
    range: "signature",
    rangeLabel: rangeLabel.signature,
    type: "Wood",
    code: "SG-01",
    hex: "#B08154",
    grain: "#8A5F3B",
    sheen: "Low sheen",
    summary:
      "Warm open-pore oak. Softens a navy island without yellowing.",
    tagline: "Open-pore oak that never yellows under UV",
    description:
      "Warm open-pore oak, digitally grained onto the Xteel core rather than laminated over plywood — no yellowing, no lifting at the seams over the years plywood veneer usually shows. Reads as timber against a navy island or a stone counter without either fighting for attention.",
    stats: [
      { label: "Code", value: "SG-01" },
      { label: "Type", value: "Wood" },
      { label: "Sheen", value: "Low sheen" },
      { label: "Range", value: "Signature" },
    ],
    suited: [
      "Base units",
      "Kitchen island",
      "Breakfast counter",
      "Open shelving",
      "Tall pantry units",
      "Wall-mounted units",
    ],
    image: placeholder("interione-tuscan-oak", 1600, 900),
  },
  {
    slug: "desert-dune",
    name: "Desert Dune",
    range: "signature",
    rangeLabel: rangeLabel.signature,
    type: "Metallic",
    code: "SG-02",
    hex: "#C4A582",
    grain: "#9C8062",
    sheen: "Fine metallic",
    summary: "Sand-toned flake that catches light along the shutter face.",
    tagline: "Sand-toned flake that shifts with the light",
    description:
      "A fine metallic flake suspended in a sand base — it catches raking light along the shutter face and reads flat and quiet under a straight downlight. Works hardest on a run that picks up natural light from one side through the day.",
    stats: [
      { label: "Code", value: "SG-02" },
      { label: "Type", value: "Metallic" },
      { label: "Sheen", value: "Fine metallic" },
      { label: "Range", value: "Signature" },
    ],
    suited: [
      "Base units",
      "Wall units",
      "Handleless profiles",
      "Loft units",
      "Utility cabinets",
      "Crockery units",
    ],
    image: placeholder("interione-desert-dune", 1600, 900),
  },
  {
    slug: "prairie-metallic",
    name: "Prairie Metallic",
    range: "signature",
    rangeLabel: rangeLabel.signature,
    type: "Metallic",
    code: "SG-03",
    hex: "#8E9280",
    grain: "#6E7263",
    sheen: "Brushed",
    summary: "Muted sage-grey. Vertical brush lifts a low ceiling.",
    tagline: "A vertical brush that draws the eye up",
    description:
      "A muted sage-grey with a brushed metal texture running vertically down every shutter. In a room with a lower ceiling the grain direction does real work, pulling the eye up the run rather than along it.",
    stats: [
      { label: "Code", value: "SG-03" },
      { label: "Type", value: "Metallic" },
      { label: "Sheen", value: "Brushed" },
      { label: "Range", value: "Signature" },
    ],
    suited: [
      "Tall units",
      "Wall units",
      "Wardrobe shutters",
      "Loft units",
      "Study cabinetry",
      "Utility cabinets",
    ],
    image: placeholder("interione-prairie-metallic", 1600, 900),
  },
  {
    slug: "tundra-matte",
    name: "Tundra Matte",
    range: "signature",
    rangeLabel: rangeLabel.signature,
    type: "Matte",
    code: "SG-04",
    hex: "#D9D6D0",
    grain: "#B3AFA8",
    sheen: "Dead matte",
    summary:
      "Cool off-white, fingerprint-resistant. The quietest option.",
    tagline: "The quietest finish in the range",
    description:
      "A cool off-white with a dead-matte surface that resists fingerprints better than anything else in the range — the specification most designers reach for when a kitchen needs to disappear into the rest of the home.",
    stats: [
      { label: "Code", value: "SG-04" },
      { label: "Type", value: "Matte" },
      { label: "Sheen", value: "Dead matte" },
      { label: "Range", value: "Signature" },
    ],
    suited: [
      "Base units",
      "Wall units",
      "Handleless profiles",
      "Wardrobe shutters",
      "Study cabinetry",
      "Utility cabinets",
    ],
    image: placeholder("interione-tundra-matte", 1600, 900),
  },
  {
    slug: "pour-line-concrete",
    name: "Pour Line Concrete",
    range: "premier",
    rangeLabel: rangeLabel.premier,
    type: "Concrete",
    code: "PR-01",
    hex: "#8C8C8A",
    grain: "#6B6B69",
    sheen: "Textured matte",
    summary: "Cast texture with faint pour lines. Pairs hard with brass.",
    tagline: "Cast texture, faint pour lines, no cold to the touch",
    description:
      "A cast-concrete texture with faint pour lines pressed into the surface, without the weight, the sealing or the cold of the real material. Pairs hard against brass hardware and a warm timber floor.",
    stats: [
      { label: "Code", value: "PR-01" },
      { label: "Type", value: "Concrete" },
      { label: "Sheen", value: "Textured matte" },
      { label: "Range", value: "Premier" },
    ],
    suited: [
      "Kitchen island",
      "Base units",
      "Breakfast counter",
      "Open shelving",
      "Utility cabinets",
      "Pantry units",
    ],
    image: placeholder("interione-pour-line-concrete", 1600, 900),
  },
  {
    slug: "dew-room-fabric",
    name: "Dew Room Fabric",
    range: "premier",
    rangeLabel: rangeLabel.premier,
    type: "Fabric",
    code: "PR-02",
    hex: "#A9B4B8",
    grain: "#828F94",
    sheen: "Woven matte",
    summary: "Woven grey-blue. Stops tall units reading as a flat wall.",
    tagline: "A woven texture that stops a tall run reading flat",
    description:
      "A woven grey-blue texture, close enough up to read as fabric rather than paint. On a run of tall units it breaks up what would otherwise read as one flat wall of colour floor to ceiling.",
    stats: [
      { label: "Code", value: "PR-02" },
      { label: "Type", value: "Fabric" },
      { label: "Sheen", value: "Woven matte" },
      { label: "Range", value: "Premier" },
    ],
    suited: [
      "Tall units",
      "Wardrobe shutters",
      "Loft units",
      "Wall units",
      "Study cabinetry",
      "Crockery units",
    ],
    image: placeholder("interione-dew-room-fabric", 1600, 900),
  },
  {
    slug: "chamber-teak",
    name: "Chamber Teak",
    range: "premier",
    rangeLabel: rangeLabel.premier,
    type: "Wood",
    code: "PR-03",
    hex: "#6E4327",
    grain: "#4E2E1A",
    sheen: "Satin",
    summary: "The darkest wood here. Best on base units under a light counter.",
    tagline: "The darkest wood in the catalogue",
    description:
      "The darkest wood in the range, a deep teak with a satin finish that holds its colour under kitchen lighting rather than washing out. Best kept to base units, under a lighter counter and a lighter wall unit above.",
    stats: [
      { label: "Code", value: "PR-03" },
      { label: "Type", value: "Wood" },
      { label: "Sheen", value: "Satin" },
      { label: "Range", value: "Premier" },
    ],
    suited: [
      "Base units",
      "Kitchen island",
      "Breakfast counter",
      "Pantry units",
      "Open shelving",
      "Utility cabinets",
    ],
    image: placeholder("interione-chamber-teak", 1600, 900),
  },
  {
    slug: "trench-teal",
    name: "Trench Teal",
    range: "premier",
    rangeLabel: rangeLabel.premier,
    type: "Solid",
    code: "PR-04",
    hex: "#1F5E63",
    grain: "#154447",
    sheen: "Satin",
    summary: "Holds its own against Deep Navy in a two-tone layout.",
    tagline: "A solid deep enough to anchor a two-tone kitchen",
    description:
      "A solid teal with enough depth to anchor a two-tone layout — base units in Trench Teal, wall units in something lighter, without either colour reading as an afterthought against the other.",
    stats: [
      { label: "Code", value: "PR-04" },
      { label: "Type", value: "Solid" },
      { label: "Sheen", value: "Satin" },
      { label: "Range", value: "Premier" },
    ],
    suited: [
      "Base units",
      "Kitchen island",
      "Wall units",
      "Breakfast counter",
      "Handleless profiles",
      "Pantry units",
    ],
    image: placeholder("interione-trench-teal", 1600, 900),
  },
  {
    slug: "glacier-veil-gloss",
    name: "Glacier Veil Gloss",
    range: "select",
    rangeLabel: rangeLabel.select,
    type: "Gloss",
    code: "SL-01",
    hex: "#E8EEF2",
    grain: "#C3CDD4",
    sheen: "High gloss",
    summary: "Near-white gloss. Makes a narrow galley breathe.",
    tagline: "A near-white gloss built for a narrow galley",
    description:
      "A near-white high-gloss finish that bounces available light down a narrow galley kitchen rather than absorbing it — the specification that makes a tight footprint feel like it has more air in it than it does.",
    stats: [
      { label: "Code", value: "SL-01" },
      { label: "Type", value: "Gloss" },
      { label: "Sheen", value: "High gloss" },
      { label: "Range", value: "Select" },
    ],
    suited: [
      "Base units",
      "Wall units",
      "Handleless profiles",
      "Loft units",
      "Utility cabinets",
      "Crockery units",
    ],
    image: placeholder("interione-glacier-veil-gloss", 1600, 900),
  },
  {
    slug: "canyon-ridge",
    name: "Canyon Ridge",
    range: "select",
    rangeLabel: rangeLabel.select,
    type: "Stone",
    code: "SL-02",
    hex: "#A0644C",
    grain: "#7C4A36",
    sheen: "Textured",
    summary: "Terracotta stone relief. Warms a north-facing room.",
    tagline: "A stone relief that warms a north-facing room",
    description:
      "A terracotta stone texture in relief, warm enough to correct a kitchen that only ever gets north light. Reads as quarried stone from across the room and as a considered texture up close.",
    stats: [
      { label: "Code", value: "SL-02" },
      { label: "Type", value: "Stone" },
      { label: "Sheen", value: "Textured" },
      { label: "Range", value: "Select" },
    ],
    suited: [
      "Kitchen island",
      "Base units",
      "Breakfast counter",
      "Open shelving",
      "Pantry units",
      "Utility cabinets",
    ],
    image: placeholder("interione-canyon-ridge", 1600, 900),
  },
  {
    slug: "oasis-ivory",
    name: "Oasis Ivory",
    range: "select",
    rangeLabel: rangeLabel.select,
    type: "Solid",
    code: "SL-03",
    hex: "#EFE3CE",
    grain: "#CDBEA5",
    sheen: "Soft matte",
    summary: "Warm ivory. The safest specification for resale.",
    tagline: "The safest specification for resale",
    description:
      "A warm ivory in a soft matte finish — the specification that reads as considered without reading as a statement, which is exactly what makes it the one buyers' agents ask for when a home is going back on the market.",
    stats: [
      { label: "Code", value: "SL-03" },
      { label: "Type", value: "Solid" },
      { label: "Sheen", value: "Soft matte" },
      { label: "Range", value: "Select" },
    ],
    suited: [
      "Base units",
      "Wall units",
      "Handleless profiles",
      "Wardrobe shutters",
      "Study cabinetry",
      "Utility cabinets",
    ],
    image: placeholder("interione-oasis-ivory", 1600, 900),
  },
];

/** The strip in the hero lays out exactly six frames. */
export const heroFinishes = finishes.slice(0, 6);

export const byRange = (range: RangeId) =>
  finishes.filter((finish) => finish.range === range);

export type Range = {
  range: RangeId;
  id: string;
  label: string;
  blurb: string;
  image: string;
};

export const ranges: Range[] = [
  {
    range: "signature",
    id: "signature",
    label: "Signature",
    blurb:
      "The everyday range — matte, metallic and open-pore wood finishes that hold up to a decade of ordinary use.",
    image: placeholder("interione-range-signature", 1920, 1080),
  },
  {
    range: "premier",
    id: "premier",
    label: "Premier",
    blurb:
      "Textured and solid finishes for two-tone layouts and statement islands, built for a kitchen that leads the home.",
    image: placeholder("interione-range-premier", 1920, 1080),
  },
  {
    range: "select",
    id: "select",
    label: "Select",
    blurb:
      "Gloss, stone and ivory finishes chosen for narrow footprints, north-facing rooms and resale value.",
    image: placeholder("interione-range-select", 1920, 1080),
  },
];
