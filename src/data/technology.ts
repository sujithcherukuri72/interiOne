/** The Xteel shutter build-up, front to back. */
export const XTEEL_LAYERS = [
  {
    step: "01",
    title: "Pre-Painted Sheet Metal",
    spec: "PPGI · 0.5mm",
    description:
      "Colour baked into the coil before forming. It cannot chip off an edge.",
  },
  {
    step: "02",
    title: "Steel Composite Core",
    spec: "JSW Xteel® · 18mm",
    description:
      "Replaces plywood and MDF entirely. No organic fibre to swell or rot.",
  },
  {
    step: "03",
    title: "Precision Edge Banding",
    spec: "Sealed · 1.2mm",
    description: "All four edges sealed under pressure — a closed system.",
  },
] as const;

/** `icon` maps to a lucide-react component in the view. */
export const XTEEL_FEATURES = [
  {
    id: "termite",
    icon: "ShieldCheck",
    title: "Termite Proof",
    claim: "100% pest-resistant",
    description: "No cellulose. Nothing for a colony to feed on.",
  },
  {
    id: "fire",
    icon: "Flame",
    title: "Fire Safe",
    claim: "UL 94 V-0 rated",
    description: "Self-extinguishing, with no flaming drips.",
  },
  {
    id: "formaldehyde",
    icon: "Leaf",
    title: "Formaldehyde Free",
    claim: "E0-equivalent air",
    description: "Zero plywood, zero MDF, nothing off-gassing.",
  },
  {
    id: "moisture",
    icon: "Droplets",
    title: "Moisture Proof",
    claim: "Zero swell or warp",
    description: "Built for coastal air and the space under the sink.",
  },
] as const;
