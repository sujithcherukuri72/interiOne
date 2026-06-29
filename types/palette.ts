export type FinishCategory =
  | "Solid Matte"
  | "Metallic"
  | "Wood"
  | "Gloss"
  | "Concrete";

export type Finish = {
  id: string;
  name: string;
  hex: string;
  finish: FinishCategory;
  edgeBand: {
    name: string;
    hex: string;
    finish: "Satin" | "Metallic" | "Matte";
  };
};

export type FinishRange = {
  id: string;
  label: string;
  description: string;
  finishes: Finish[];
};
