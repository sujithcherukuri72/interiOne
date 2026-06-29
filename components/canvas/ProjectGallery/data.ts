import type { Project } from "@/types/projects";

/**
 * Placeholder colours are drawn directly from Modula finish swatches
 * so the gallery cards immediately read as "kitchen material" before
 * any real photography is loaded.
 *
 * Mapping:
 *   Begumpet      → River Raft (blue-grey island + Cavern Grey lowers)
 *   Jubilee Hills → Sienna Husk (warm brass-oak penthouse palette)
 *   Banjara Hills → Cavern Grey (signature sage-green Solid Matte)
 *   Gachibowli    → Industrial Bay (muted slate, tech-home aesthetic)
 *   Kokapet       → Tuscan Oak (warm timber luxury)
 *   Madhapur      → Terrace Vine (deep forest-green lowers)
 */
export const DEMO_PROJECTS: Project[] = [
  {
    id: "p1",
    slug: "begumpet-residency",
    title: "Begumpet Residency",
    location: "Hyderabad",
    year: 2024,
    category: "Modular Kitchen",
    placeholderColor: "#9BAAB8", // River Raft — Solid Matte
    imageSrc: "",
  },
  {
    id: "p2",
    slug: "jubilee-hills-penthouse",
    title: "Jubilee Hills Penthouse",
    location: "Hyderabad",
    year: 2024,
    category: "Open-Plan Living",
    placeholderColor: "#C9A87A", // Sienna Husk — Solid Matte
    imageSrc: "",
  },
  {
    id: "p3",
    slug: "banjara-hills-villa",
    title: "Banjara Hills Villa",
    location: "Hyderabad",
    year: 2023,
    category: "Full Interior",
    placeholderColor: "#7D9182", // Cavern Grey — Solid Matte
    imageSrc: "",
  },
  {
    id: "p4",
    slug: "gachibowli-tech-home",
    title: "Gachibowli Tech Home",
    location: "Hyderabad",
    year: 2023,
    category: "Modular Kitchen",
    placeholderColor: "#5A5C68", // Industrial Bay — Solid Matte
    imageSrc: "",
  },
  {
    id: "p5",
    slug: "kokapet-lake-villa",
    title: "Kokapet Lake Villa",
    location: "Hyderabad",
    year: 2024,
    category: "Luxury Kitchen",
    placeholderColor: "#B8956A", // Tuscan Oak — Wood Finish
    imageSrc: "",
  },
  {
    id: "p6",
    slug: "madhapur-duplex",
    title: "Madhapur Duplex",
    location: "Hyderabad",
    year: 2023,
    category: "Open-Plan Living",
    placeholderColor: "#4B6B54", // Terrace Vine — Solid Matte
    imageSrc: "",
  },
];

// Asymmetric grid positions — slight Z variation creates editorial depth
export const CARD_POSITIONS: ReadonlyArray<[number, number, number]> = [
  [-2.1, 0.85, 0.0],
  [0.0, 1.0, -0.25],
  [2.1, 0.85, 0.1],
  [-2.1, -1.15, -0.1],
  [0.0, -1.0, 0.05],
  [2.1, -1.15, -0.2],
];
