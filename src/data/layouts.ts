/**
 * The four plans a designer sketches on a site visit, as drawing geometry.
 *
 * Everything is authored in one 640×420 room so the layouts can cross-fade
 * without the walls moving. Counter depth is a constant 46 units — the plans
 * stay comparable, which is the whole point of showing them together.
 */

export const ROOM = { x: 40, y: 40, w: 560, h: 340 } as const;

export type Run = { x: number; y: number; w: number; h: number };

export type Fixture = {
  kind: "sink" | "hob" | "fridge" | "tall";
  x: number;
  y: number;
  /** Long axis of the fixture, following the run it sits on. */
  axis: "h" | "v";
};

export type Layout = {
  id: string;
  name: string;
  note: string;
  /** Rough counter run, in feet, for the caption. */
  runLength: string;
  runs: Run[];
  fixtures: Fixture[];
};

export const LAYOUTS: Layout[] = [
  {
    id: "straight",
    name: "Straight",
    note: "One wall. The smallest footprint that still works properly.",
    runLength: "10 ft run",
    runs: [{ x: 40, y: 40, w: 440, h: 46 }],
    fixtures: [
      { kind: "sink", x: 150, y: 63, axis: "h" },
      { kind: "hob", x: 330, y: 63, axis: "h" },
      { kind: "fridge", x: 540, y: 63, axis: "h" },
    ],
  },
  {
    id: "l-shape",
    name: "L-Shape",
    note: "The default for a 2BHK corner. Two working walls, a clear exit.",
    runLength: "14 ft run",
    runs: [
      { x: 40, y: 40, w: 380, h: 46 },
      { x: 40, y: 86, w: 46, h: 254 },
    ],
    fixtures: [
      { kind: "sink", x: 250, y: 63, axis: "h" },
      { kind: "hob", x: 63, y: 210, axis: "v" },
      { kind: "fridge", x: 520, y: 63, axis: "h" },
    ],
  },
  {
    id: "parallel",
    name: "Parallel",
    note: "A galley for narrow utility rooms. Everything within one turn.",
    runLength: "18 ft run",
    runs: [
      { x: 40, y: 40, w: 520, h: 46 },
      { x: 40, y: 334, w: 520, h: 46 },
    ],
    fixtures: [
      { kind: "sink", x: 300, y: 63, axis: "h" },
      { kind: "hob", x: 300, y: 357, axis: "h" },
      { kind: "tall", x: 583, y: 63, axis: "h" },
    ],
  },
  {
    id: "island",
    name: "Island",
    note: "For open plans. The island takes the hob and the conversation.",
    runLength: "16 ft + island",
    runs: [
      { x: 40, y: 40, w: 520, h: 46 },
      { x: 40, y: 86, w: 46, h: 214 },
      { x: 250, y: 220, w: 220, h: 88 },
    ],
    fixtures: [
      { kind: "sink", x: 340, y: 63, axis: "h" },
      { kind: "hob", x: 360, y: 264, axis: "h" },
      { kind: "fridge", x: 63, y: 340, axis: "v" },
    ],
  },
  {
    id: "u-shape",
    name: "U-Shape",
    note: "Maximum storage. Three walls, no wasted corner.",
    runLength: "22 ft run",
    runs: [
      { x: 40, y: 40, w: 520, h: 46 },
      { x: 40, y: 86, w: 46, h: 254 },
      { x: 514, y: 86, w: 46, h: 254 },
    ],
    fixtures: [
      { kind: "sink", x: 63, y: 200, axis: "v" },
      { kind: "hob", x: 300, y: 63, axis: "h" },
      { kind: "fridge", x: 537, y: 180, axis: "v" },
    ],
  },
];
