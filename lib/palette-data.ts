import type { FinishRange } from "@/types/palette";

export const FINISH_RANGES: FinishRange[] = [
  {
    id: "signature",
    label: "Signature",
    description: "Understated luxury finishes with architectural depth.",
    finishes: [
      {
        id: "prairie-metallic",
        name: "Prairie Metallic",
        hex: "#C4B090",
        finish: "Metallic",
        edgeBand: {
          name: "Oasis Ivory Satin",
          hex: "#FAF6EC",
          finish: "Satin",
        },
      },
      {
        id: "tundra-solid-matte",
        name: "Tundra Solid Matte",
        hex: "#FAFAFA",
        finish: "Solid Matte",
        edgeBand: {
          name: "Bronze Metallic",
          hex: "#8B6820",
          finish: "Metallic",
        },
      },
      {
        id: "cavern-grey-solid-matte",
        name: "Cavern Grey Solid Matte",
        hex: "#7D9182",
        finish: "Solid Matte",
        edgeBand: {
          name: "Cavern Grey",
          hex: "#7D9182",
          finish: "Matte",
        },
      },
    ],
  },
  {
    id: "premier",
    label: "Premier",
    description: "Bold material stories — concrete, teak, and dune.",
    finishes: [
      {
        id: "desert-dune-metallic",
        name: "Desert Dune Metallic",
        hex: "#C49482",
        finish: "Metallic",
        edgeBand: {
          name: "Rose Gold Satin",
          hex: "#D4A2A2",
          finish: "Satin",
        },
      },
      {
        id: "chamber-teak-wood",
        name: "Chamber Teak Wood",
        hex: "#B8956A",
        finish: "Wood",
        edgeBand: {
          name: "Industrial Bay Satin",
          hex: "#5A5C68",
          finish: "Satin",
        },
      },
      {
        id: "pour-line-concrete",
        name: "Pour Line Concrete",
        hex: "#D0CABC",
        finish: "Concrete",
        edgeBand: {
          name: "Oasis Ivory Satin",
          hex: "#FAF6EC",
          finish: "Satin",
        },
      },
    ],
  },
  {
    id: "select",
    label: "Select",
    description: "High-gloss precision for the discerning eye.",
    finishes: [
      {
        id: "glacier-veil-gloss",
        name: "Glacier Veil Gloss",
        hex: "#F0EDE8",
        finish: "Gloss",
        edgeBand: {
          name: "Glacier Veil Satin",
          hex: "#E8E5E0",
          finish: "Satin",
        },
      },
      {
        id: "oasis-ivory-gloss",
        name: "Oasis Ivory Gloss",
        hex: "#FAF6EC",
        finish: "Gloss",
        edgeBand: {
          name: "Oasis Ivory Satin",
          hex: "#F5F0E8",
          finish: "Satin",
        },
      },
    ],
  },
];
