/**
 * Small colour maths, so a finish can be shown as a material rather than as a
 * single chip.
 *
 * Every finish in the catalogue carries only two values — a body and a grain.
 * Everything else the listing shows (the tonal ladder, the lit and shadowed
 * faces of the drawn shutter, whether a label should be set in white or ink) is
 * derived here from those two, which is why the panels stay correct when a
 * finish's hex is edited and nothing else is touched.
 */

type Rgb = { r: number; g: number; b: number };

function parse(hex: string): Rgb {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean.padEnd(6, "0").slice(0, 6);

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

const toHex = ({ r, g, b }: Rgb) =>
  `#${[r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("")}`;

/** Linear blend, `t` of `b` into `a`. */
export function mixHex(a: string, b: string, t: number) {
  const from = parse(a);
  const to = parse(b);
  return toHex({
    r: from.r + (to.r - from.r) * t,
    g: from.g + (to.g - from.g) * t,
    b: from.b + (to.b - from.b) * t,
  });
}

export const lighten = (hex: string, t: number) => mixHex(hex, "#ffffff", t);
export const darken = (hex: string, t: number) => mixHex(hex, "#0c0c0b", t);

/**
 * Perceived brightness, 0–1. The coefficients are the usual luma weights —
 * the eye reads green as far brighter than blue at the same value, and a
 * straight average gets white-on-yellow wrong every time.
 */
export function luminance(hex: string) {
  const { r, g, b } = parse(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** Ink or white, whichever will actually be legible on the colour. */
export const readableOn = (hex: string) =>
  luminance(hex) > 0.6 ? "#1a1a1a" : "#ffffff";

/**
 * The finish under five lighting conditions — direct light down to the inside
 * of a cabinet. Anchored on the true colour at the middle step, so the ladder
 * reads as one material and not as five colours.
 */
export function tonalRamp(hex: string) {
  return [
    { label: "Lit", value: lighten(hex, 0.34) },
    { label: "Day", value: lighten(hex, 0.15) },
    { label: "True", value: hex },
    { label: "Shade", value: darken(hex, 0.17) },
    { label: "Recess", value: darken(hex, 0.34) },
  ];
}
