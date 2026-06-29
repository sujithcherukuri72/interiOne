/**
 * InterioOne brand colour constants.
 *
 * Sourced from:
 *   - InterioOne logo (obsidian + gold)
 *   - Modula brochure finish swatches (Signature, Premier, Select ranges)
 *
 * These hex values mirror the CSS custom properties in globals.css.
 * Use BRAND.colors.* in Three.js material colour props and JS logic
 * where Tailwind class names are not applicable.
 */

export const BRAND = {
  name: "INTERIOONE",
  tagline: "DESIGN · CREATE · INSPIRE",

  colors: {
    /* ── Logo / identity ── */
    obsidian:       "#0E0D0D",
    gold:           "#C9A84C",
    goldLight:      "#E8D5A3",
    goldDeep:       "#8B6820",
    espresso:       "#2C1409",

    /* ── Semantic surfaces ── */
    backgroundLight: "#FAF6F0",
    backgroundDark:  "#0E0D0D",
    foregroundLight: "#1A1208",
    foregroundDark:  "#F5EDD8",

    /* ── Modula Signature Range (Solid Matte) ── */
    cavernGrey:    "#7D9182",
    terraceVine:   "#4B6B54",
    siennaHusk:    "#C9A87A",
    riverRaft:     "#9BAAB8",
    tundra:        "#FAFAFA",
    petalDust:     "#A0827A",

    /* ── Modula Signature Range (Metallic) ── */
    metalMoon:     "#6B6B6E",
    lumenSand:     "#C4B090",
    abyssEdge:     "#4A3C30",

    /* ── Modula Signature Range (Wood) ── */
    tuscanOak:     "#B8956A",

    /* ── Modula Premier Range ── */
    desertDune:    "#C49482",
    craterDust:    "#A89070",
    courtyardClay: "#F0E8D0",
    pourLine:      "#D0CABC",
    siltRoot:      "#6A4840",
    trenchTeal:    "#4A6858",
    industrialBay: "#5A5C68",

    /* ── Modula Select Range ── */
    glacierVeil:   "#F0EDE8",
    oasisIvory:    "#FAF6EC",
    canyonRidge:   "#E2D4C0",

    /* ── Atmosphere ── */
    sienna:        "#7B3722",
  },
} as const;

export type BrandColor = keyof typeof BRAND.colors;
