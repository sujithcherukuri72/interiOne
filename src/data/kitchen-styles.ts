/**
 * The six kitchen styles, and the photography for each.
 *
 * Paths are written out in full and case-exactly. The folders on disk are not
 * consistently cased — `moodboard_Boho` against `Moodboard_Glam`, and the Boho
 * palettes are spelled `pallete` — and Windows will happily serve any of them
 * while Linux, which is what this deploys to, will not. Fix the filenames if
 * you like, but fix them here in the same commit.
 */

export type KitchenStyle = {
  id: string;
  name: string;
  /** Three or four words, set under the name in the rail. */
  tagline: string;
  /** One sentence — what this style is actually for. */
  blurb: string;
  /** The wide shot behind the hero when this style is selected. */
  hero: string;
  /** Room shots for the style's own gallery. */
  grid: string[];
  /** Material and colour boards — the palette, as shot. */
  moodboard: string[];
};

const grid = (folder: string, prefix: string, count: number) =>
  Array.from(
    { length: count },
    (_, i) => `/assets/Kitchen-Types/${folder}/${prefix}-${i + 1}.jpg`
  );

const board = (folder: string, sub: string, prefix: string, count = 9) =>
  Array.from(
    { length: count },
    (_, i) => `/assets/Kitchen-Types/${folder}/${sub}/${prefix}-${i + 1}.png`
  );

export const KITCHEN_STYLES: KitchenStyle[] = [
  {
    id: "minimalist",
    name: "Minimalist",
    tagline: "Handleless · unbroken",
    blurb:
      "Nothing on the surface. Gola channels instead of handles, one finish carried across the whole run, and every appliance behind a shutter.",
    hero: "/assets/Kitchen-Types/Hero/MinimalKitchen.jpg",
    grid: grid("Minimalist", "minimal-grid", 4),
    moodboard: board("Minimalist", "Moodboard_Minimal", "minimal-palette"),
  },
  {
    id: "scandi",
    name: "Scandinavian",
    tagline: "Pale wood · daylight",
    blurb:
      "Warm oak against off-white, open shelving where a wall cabinet would close the room in, and as much of the window left uncovered as the layout allows.",
    hero: "/assets/Kitchen-Types/Hero/Scandi_Kitchen.jpg",
    grid: grid("Scandi", "scandi-grid", 4),
    moodboard: board("Scandi", "moodboard_Scandi", "scandi-palette"),
  },
  {
    id: "industrial",
    name: "Industrial",
    tagline: "Steel · concrete · black",
    blurb:
      "The material argument made visible — dark metallics, concrete-look surfaces and exposed shelving on a frame that happens to be steel anyway.",
    hero: "/assets/Kitchen-Types/Hero/IndustrialKitchen_1.jpg",
    grid: grid("Industrial", "industrial-grid", 6),
    moodboard: board("Industrial", "Moodboard_Industrial", "industrial-palette"),
  },
  {
    id: "glam",
    name: "Glam",
    tagline: "Gloss · brass · depth",
    blurb:
      "High-gloss shutters, tinted and fluted glass, brass profiles and in-cabinet lighting — the range where the finish is the whole point.",
    hero: "/assets/Kitchen-Types/Hero/GlamKitchen.jpg",
    grid: grid("Glam", "glam-grid", 4),
    moodboard: board("Glam", "Moodboard_Glam", "glam-palette"),
  },
  {
    id: "boho",
    name: "Boho",
    tagline: "Texture · rattan · warmth",
    blurb:
      "Fabric and leather finishes, rattan baskets in the tall units, and a palette built from clay and terracotta rather than from grey.",
    hero: "/assets/Kitchen-Types/Hero/BohoKitchen.jpg",
    grid: grid("Boho", "boho-grid", 4),
    moodboard: board("Boho", "moodboard_Boho", "boho-pallete"),
  },
  {
    id: "vintage",
    name: "Vintage",
    tagline: "Shaker · muted · knobs",
    blurb:
      "Framed shutter profiles and knobs instead of rails, in the muted greens and clays of the Premier range — the traditional look, on a core that is not wood.",
    hero: "/assets/Kitchen-Types/Hero/VintageKitchen.jpg",
    grid: grid("Vintage", "vintage-grid", 4),
    moodboard: board("Vintage", "Moodboard_Vintage", "vintage-palette"),
  },
];

/** The looping wide shot behind the hero before any style is chosen. */
export const HERO_MEDIA = {
  video: "/assets/video/hero-video.webm",
  /**
   * Shown until the video has enough to play, and instead of it on any browser
   * that will not take WebM. Not optional: it is what a slow connection sees.
   */
  poster: "/assets/Kitchen-images/hero_banner.webp",
  /** Drop an H.264 file here and it is used ahead of the WebM. */
  videoMp4: "/assets/video/hero-video.mp4",
  hasMp4: false,
} as const;
