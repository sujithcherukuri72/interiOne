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

/**
 * The rest of the colour book, from the catalogue.
 *
 * Names and finish types are Modula's own, transcribed from *The Modula
 * Blueprint* pages 43 to 45. Two things about them are worth stating plainly:
 *
 * The **hex pairs are matched by eye**, not measured. The catalogue is a
 * printed document whose swatch images are not colour-managed, so these are
 * close enough to specify a scheme from and not close enough to order from.
 * Replace them with the factory's values before anyone signs off a colour on a
 * screen.
 *
 * The **range each colour sits in is ours, not the catalogue's**. Modula groups
 * by manufacturing process — every metallic and every wood is Signature there,
 * which would leave our Select range empty and unpriceable. These are filed by
 * what they cost us to make and what they are for, which is what the three
 * rates in `data/estimator.ts` are attached to. Reconcile the two only if the
 * factory's grouping ever becomes the commercial one.
 */
function makeFinish(f: {
  slug: string;
  name: string;
  range: RangeId;
  type: string;
  code: string;
  hex: string;
  grain: string;
  sheen: string;
  summary: string;
  tagline: string;
  description: string;
  suited?: string[];
}): Finish {
  return {
    ...f,
    rangeLabel: rangeLabel[f.range],
    // Derived rather than restated: every one of these four already exists as
    // a field above, and typing them twice is how they drift apart.
    stats: [
      { label: "Code", value: f.code },
      { label: "Type", value: f.type },
      { label: "Sheen", value: f.sheen },
      { label: "Range", value: rangeLabel[f.range] },
    ],
    suited: f.suited ?? [
      "Base units",
      "Wall-mounted units",
      "Tall pantry units",
      "Kitchen island",
    ],
    image: placeholder(`interione-${f.slug}`, 1600, 900),
  };
}

const CATALOGUE_FINISHES: Finish[] = [
  /* ── Signature ─────────────────────────────────────────────────────────── */
  makeFinish({
    slug: "lumen-sand",
    name: "Lumen Sand",
    range: "signature",
    type: "Metallic",
    code: "SG-05",
    hex: "#C9B694",
    grain: "#A2906F",
    sheen: "Fine metallic",
    summary: "Pale sand with a metallic lift — bright without going white.",
    tagline: "The warm answer to a white kitchen",
    description:
      "A pale sand carrying just enough flake to catch daylight, for rooms that want the brightness of a white kitchen without the coldness of one. Holds its warmth under the yellow-tinted LEDs most Indian kitchens are lit with, which is where true whites tend to turn grey.",
  }),
  makeFinish({
    slug: "metal-moon",
    name: "Metal Moon",
    range: "signature",
    type: "Metallic",
    code: "SG-06",
    hex: "#9AA0A6",
    grain: "#767C82",
    sheen: "Fine metallic",
    summary: "Cool grey flake. Reads as brushed steel at arm's length.",
    tagline: "Brushed steel, without the fingerprints",
    description:
      "Cool grey with a fine flake that reads as brushed stainless from a step away — and unlike stainless, does not hold a fingerprint. The obvious partner for an appliance wall where the oven and the hood are already steel.",
  }),
  makeFinish({
    slug: "crater-dust",
    name: "Crater Dust",
    range: "signature",
    type: "Metallic",
    code: "SG-07",
    hex: "#8C8580",
    grain: "#6B6560",
    sheen: "Fine metallic",
    summary: "Warm mid-grey flake that sits between stone and steel.",
    tagline: "The grey that does not go blue",
    description:
      "A warm mid-grey — the one that stops a grey kitchen drifting blue under daylight. Sits comfortably against both a black granite counter and a pale quartz one, which is not true of most greys at this value.",
  }),
  makeFinish({
    slug: "mine-grade",
    name: "Mine Grade",
    range: "signature",
    type: "Metallic",
    code: "SG-08",
    hex: "#5E6266",
    grain: "#45484B",
    sheen: "Fine metallic",
    summary: "Deep graphite flake for a full-height run that anchors a room.",
    tagline: "Graphite with a flake in it",
    description:
      "Deep graphite with a metallic flake that keeps it from going flat and dead the way solid dark greys do at full height. Built for the tall wall — a bank of towers in this reads as one object rather than as four doors.",
    suited: ["Tall pantry units", "Appliance towers", "Base units", "Kitchen island"],
  }),
  makeFinish({
    slug: "celestial-sky",
    name: "Celestial Sky",
    range: "signature",
    type: "Leather",
    code: "SG-09",
    hex: "#6E7C8C",
    grain: "#55606D",
    sheen: "Leather texture",
    summary: "Slate blue with a leather grain you can feel.",
    tagline: "A texture, not just a colour",
    description:
      "Slate blue in a leather-grained texture — one of the two finishes in the range with something to feel as well as see. The grain scatters light, so it stays matte at every angle and hides the daily marks a flat blue shows immediately.",
  }),
  makeFinish({
    slug: "abyss-edge",
    name: "Abyss Edge",
    range: "signature",
    type: "Fabric",
    code: "SG-10",
    hex: "#3A3E44",
    grain: "#2B2E33",
    sheen: "Fabric texture",
    summary: "Near-black with a woven texture. Absorbs light rather than bouncing it.",
    tagline: "Near-black, woven",
    description:
      "A near-black carrying a woven fabric texture, which is what keeps it from behaving like a mirror the way gloss blacks do. Absorbs light instead of throwing it back, so a dark island in this does not double every downlight above it.",
    suited: ["Kitchen island", "Base units", "Tall pantry units", "Breakfast counter"],
  }),
  makeFinish({
    slug: "peruvian-walnut",
    name: "Peruvian Walnut",
    range: "signature",
    type: "Wood",
    code: "SG-11",
    hex: "#6B4A33",
    grain: "#4E3624",
    sheen: "Low sheen",
    summary: "Dark open-pore walnut. The warm counterweight to a pale run.",
    tagline: "Walnut that stays walnut",
    description:
      "Dark open-pore walnut, grained onto the Xteel core rather than veneered over ply — so no lifting at the seams and no reddening under years of afternoon light. Usually specified as the tall bank against a pale base run rather than the whole kitchen.",
  }),

  /* ── Premier ───────────────────────────────────────────────────────────── */
  makeFinish({
    slug: "sienna-husk",
    name: "Sienna Husk",
    range: "premier",
    type: "Solid matte",
    code: "PR-05",
    hex: "#A9613F",
    grain: "#85492E",
    sheen: "Solid matte",
    summary: "Burnt sienna. Carries a terracotta splashback without competing.",
    tagline: "Terracotta, at cabinet scale",
    description:
      "A burnt sienna that holds its own beside a terracotta splashback instead of arguing with it — the pairing most people reach for and most palettes get wrong. Best on a base run with something pale above it.",
    suited: ["Base units", "Kitchen island", "Breakfast counter", "Open shelving"],
  }),
  makeFinish({
    slug: "cavern-grey",
    name: "Cavern Grey",
    range: "premier",
    type: "Solid matte",
    code: "PR-06",
    hex: "#8E8C88",
    grain: "#6E6C69",
    sheen: "Solid matte",
    summary: "A neutral warm grey that gets out of the way.",
    tagline: "The grey with no opinion",
    description:
      "A properly neutral warm grey — no blue, no green — which is what makes it the safe half of a two-tone scheme. Pairs with almost anything in the book, and is the finish to choose when the counter or the splashback is doing the talking.",
  }),
  makeFinish({
    slug: "petal-dust",
    name: "Petal Dust",
    range: "premier",
    type: "Solid matte",
    code: "PR-07",
    hex: "#D9C3C0",
    grain: "#B99F9C",
    sheen: "Solid matte",
    summary: "Dusty rose, held back far enough to read as a neutral.",
    tagline: "Pink that behaves like a neutral",
    description:
      "A dusty rose greyed off far enough that it reads as a warm neutral rather than as a pink kitchen. Works best on wall units above a darker base, where it lightens the room without becoming the subject of it.",
    suited: ["Wall-mounted units", "Open shelving", "Base units", "Loft units"],
  }),
  makeFinish({
    slug: "river-raft",
    name: "River Raft",
    range: "premier",
    type: "Solid matte",
    code: "PR-08",
    hex: "#7E8B8A",
    grain: "#616D6C",
    sheen: "Solid matte",
    summary: "Grey with a green cast — quieter than sage, cooler than stone.",
    tagline: "Between sage and stone",
    description:
      "A grey carrying just enough green to warm under lamplight without ever announcing itself as a colour. The finish for a north-facing kitchen, where true greys go cold and true greens go grey.",
  }),
  makeFinish({
    slug: "terrace-vine",
    name: "Terrace Vine",
    range: "premier",
    type: "Solid matte",
    code: "PR-09",
    hex: "#6E7A52",
    grain: "#55603E",
    sheen: "Solid matte",
    summary: "Olive green. The one dark colour that still feels like daylight.",
    tagline: "Olive, not forest",
    description:
      "An olive rather than a forest green — enough yellow in it to stay alive under warm light, where a bluer green would go black after sunset. Handles a full base run in a room with one window.",
  }),
  makeFinish({
    slug: "marsh-bank",
    name: "Marsh Bank",
    range: "premier",
    type: "Gloss",
    code: "PR-10",
    hex: "#5C6B57",
    grain: "#45513F",
    sheen: "Gloss",
    summary: "Deep green in gloss. Doubles whatever light the room has.",
    tagline: "Deep green, mirror finish",
    description:
      "A deep green in full gloss, which is how you put a dark colour into a small kitchen without closing it in — the reflection gives back the light the colour takes. Wants a clean run to reflect; the effect is spoiled by clutter on the counter.",
  }),
  makeFinish({
    slug: "courtyard-clay",
    name: "Courtyard Clay",
    range: "premier",
    type: "Solid matte",
    code: "PR-11",
    hex: "#C08A67",
    grain: "#9B6B4D",
    sheen: "Solid matte",
    summary: "Warm clay. Reads as unglazed terracotta rather than as orange.",
    tagline: "Unglazed terracotta",
    description:
      "A warm clay with the chalkiness of unglazed terracotta, which is what keeps it from reading as orange. Sits naturally with brass handles and a pale stone counter; fights anything chrome.",
  }),

  /* ── Select ────────────────────────────────────────────────────────────── */
  makeFinish({
    slug: "mistfield",
    name: "Mistfield",
    range: "select",
    type: "Gloss",
    code: "SL-04",
    hex: "#C6CBCB",
    grain: "#A5ABAB",
    sheen: "Gloss",
    summary: "Pale grey gloss. The default for a narrow galley.",
    tagline: "Light, given back",
    description:
      "A pale grey in gloss — the standard answer to a narrow kitchen, because the reflection makes the run read further away than it is. Shows dust sooner than a matte, and wipes clean faster.",
  }),
  makeFinish({
    slug: "salt-flat",
    name: "Salt Flat",
    range: "select",
    type: "Solid matte",
    code: "SL-05",
    hex: "#E8E4DB",
    grain: "#C9C4B8",
    sheen: "Solid matte",
    summary: "Warm off-white. The white that does not go blue at night.",
    tagline: "Off-white, deliberately",
    description:
      "A warm off-white rather than a true one, which is the whole point: pure whites turn blue under LED and grey against daylight. This holds its warmth in both, and is the most-ordered finish in the range for exactly that reason.",
  }),
  makeFinish({
    slug: "silt-root",
    name: "Silt Root",
    range: "select",
    type: "Solid matte",
    code: "SL-06",
    hex: "#A08E77",
    grain: "#7E6F5C",
    sheen: "Solid matte",
    summary: "Mushroom taupe — hides everything a working kitchen does to it.",
    tagline: "The hardest-wearing colour here",
    description:
      "A mushroom taupe, and the most forgiving finish in the book: dust, splashes and the marks around a handle all disappear into it. The finish to choose for a kitchen that is genuinely cooked in three times a day.",
  }),
  makeFinish({
    slug: "industrial-bay",
    name: "Industrial Bay",
    range: "select",
    type: "Solid matte",
    code: "SL-07",
    hex: "#4A5560",
    grain: "#364049",
    sheen: "Solid matte",
    summary: "Deep slate blue. Dark base units at the entry price.",
    tagline: "Dark, at the entry rate",
    description:
      "A deep slate blue — the way to get dark base units without moving up a range. Best kept below the counter with something pale above; a full kitchen in this needs more light than most flats have.",
    suited: ["Base units", "Kitchen island", "Tall pantry units", "Breakfast counter"],
  }),
];

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

  ...CATALOGUE_FINISHES,
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
    image: "/assets/Kitchen-Types/Hero/GlamKitchen.jpg",
  },
  {
    range: "premier",
    id: "premier",
    label: "Premier",
    blurb:
      "Textured and solid finishes for two-tone layouts and statement islands, built for a kitchen that leads the home.",
    image: "/assets/Kitchen-Types/Hero/IndustrialKitchen_1.jpg",
  },
  {
    range: "select",
    id: "select",
    label: "Select",
    blurb:
      "Gloss, stone and ivory finishes chosen for narrow footprints, north-facing rooms and resale value.",
    image: "/assets/Kitchen-Types/Hero/MinimalKitchen.jpg",
  },
];
