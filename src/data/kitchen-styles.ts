/**
 * The six kitchen styles, and the photography for each.
 *
 * Paths are written out in full and case-exactly. The folders on disk are not
 * consistently cased — `moodboard_Boho` against `Moodboard_Glam`, and the Boho
 * palettes are spelled `pallete` — and Windows will happily serve any of them
 * while Linux, which is what this deploys to, will not. Fix the filenames if
 * you like, but fix them here in the same commit.
 *
 * Every shot carries its real pixel dimensions. This shoot is a mix of portrait
 * (1080×1620) and landscape (1620×1080) frames with a handful of odd sizes in
 * the material boards, and without the numbers a layout has to either guess an
 * aspect ratio — which crops half of them badly — or wait for the image to load
 * before it knows what shape the hole should be. Measured with
 * System.Drawing off the files in `public/`; if you replace a file, remeasure.
 */

export type StyleShot = {
  src: string;
  /** Intrinsic pixel width, straight off the file. */
  w: number;
  /** Intrinsic pixel height. */
  h: number;
};

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
  grid: StyleShot[];
  /** Material and colour boards — the palette, as shot. */
  moodboard: StyleShot[];
};

/**
 * `folder` may include a subfolder. Dimensions are positional: the nth pair
 * belongs to `${prefix}-${n}`, so the array length is also the file count.
 */
const shots = (
  folder: string,
  prefix: string,
  ext: "jpg" | "png",
  sizes: readonly (readonly [number, number])[]
): StyleShot[] =>
  sizes.map(([w, h], i) => ({
    src: `/assets/Kitchen-Types/${folder}/${prefix}-${i + 1}.${ext}`,
    w,
    h,
  }));

export const KITCHEN_STYLES: KitchenStyle[] = [
  {
    id: "minimalist",
    name: "Minimalist",
    tagline: "Handleless · unbroken",
    blurb:
      "Nothing on the surface. Gola channels instead of handles, one finish carried across the whole run, and every appliance behind a shutter.",
    hero: "/assets/Kitchen-Types/Hero/MinimalKitchen.jpg",
    grid: shots("Minimalist", "minimal-grid", "jpg", [
      [1080, 1620],
      [1080, 1620],
      [1080, 1620],
      [1620, 1080],
    ]),
    moodboard: shots(
      "Minimalist/Moodboard_Minimal",
      "minimal-palette",
      "png",
      [
        [1391, 1080],
        [1080, 1205],
        [1539, 1080],
        [1080, 1128],
        [1080, 1154],
        [1080, 1528],
        [986, 1920],
        [1920, 1078],
        [1080, 1528],
      ]
    ),
  },
  {
    id: "scandi",
    name: "Scandinavian",
    tagline: "Pale wood · daylight",
    blurb:
      "Warm oak against off-white, open shelving where a wall cabinet would close the room in, and as much of the window left uncovered as the layout allows.",
    hero: "/assets/Kitchen-Types/Hero/Scandi_Kitchen.jpg",
    grid: shots("Scandi", "scandi-grid", "jpg", [
      [1620, 1080],
      [1080, 1620],
      [1080, 1620],
      [1620, 1080],
    ]),
    moodboard: shots("Scandi/moodboard_Scandi", "scandi-palette", "png", [
      [1080, 1528],
      [1080, 1124],
      [900, 900],
      [1080, 1084],
      [1920, 1016],
      [1412, 1080],
      // 225×225 — the one genuinely low-resolution file in the set. Kept
      // because dropping it leaves a gap in the reel, but it is the first one
      // to replace if a better shot turns up.
      [225, 225],
      [1146, 1080],
      [849, 1920],
    ]),
  },
  {
    id: "industrial",
    name: "Industrial",
    tagline: "Steel · concrete · black",
    blurb:
      "The material argument made visible — dark metallics, concrete-look surfaces and exposed shelving on a frame that happens to be steel anyway.",
    hero: "/assets/Kitchen-Types/Hero/IndustrialKitchen_1.jpg",
    grid: shots("Industrial", "industrial-grid", "jpg", [
      [1620, 1080],
      [1080, 1620],
      [1080, 1620],
      [1620, 1080],
      [1620, 1080],
      [1675, 1080],
    ]),
    moodboard: shots(
      "Industrial/Moodboard_Industrial",
      "industrial-palette",
      "png",
      [
        [1249, 1080],
        [1080, 1100],
        [1920, 940],
        [1080, 1528],
        [1080, 1528],
        [1080, 1528],
        [1403, 1080],
        [1214, 1080],
        [1572, 1080],
      ]
    ),
  },
  {
    id: "glam",
    name: "Glam",
    tagline: "Gloss · brass · depth",
    blurb:
      "High-gloss shutters, tinted and fluted glass, brass profiles and in-cabinet lighting — the range where the finish is the whole point.",
    hero: "/assets/Kitchen-Types/Hero/GlamKitchen.jpg",
    grid: shots("Glam", "glam-grid", "jpg", [
      [1080, 1620],
      [1080, 1620],
      [1620, 1080],
      [1620, 1080],
    ]),
    moodboard: shots("Glam/Moodboard_Glam", "glam-palette", "png", [
      [1920, 811],
      [1583, 1080],
      [1080, 1528],
      [1080, 1528],
      [1882, 1080],
      [1080, 1528],
      [1080, 1528],
      [1464, 993],
      [1080, 1528],
    ]),
  },
  {
    id: "boho",
    name: "Boho",
    tagline: "Texture · rattan · warmth",
    blurb:
      "Fabric and leather finishes, rattan baskets in the tall units, and a palette built from clay and terracotta rather than from grey.",
    hero: "/assets/Kitchen-Types/Hero/BohoKitchen.jpg",
    grid: shots("Boho", "boho-grid", "jpg", [
      [1080, 1620],
      [1080, 1620],
      [1080, 1620],
      [1620, 1080],
    ]),
    moodboard: shots("Boho/moodboard_Boho", "boho-pallete", "png", [
      [1080, 1528],
      [812, 1318],
      [1080, 1528],
      [899, 1066],
      [1080, 949],
      [1053, 1441],
      [1080, 1528],
      [1080, 989],
      [986, 1392],
    ]),
  },
  {
    id: "vintage",
    name: "Vintage",
    tagline: "Shaker · muted · knobs",
    blurb:
      "Framed shutter profiles and knobs instead of rails, in the muted greens and clays of the Premier range — the traditional look, on a core that is not wood.",
    hero: "/assets/Kitchen-Types/Hero/VintageKitchen.jpg",
    grid: shots("Vintage", "vintage-grid", "jpg", [
      [1620, 1080],
      [505, 440],
      [1080, 1620],
      [1080, 1625],
    ]),
    moodboard: shots("Vintage/Moodboard_Vintage", "vintage-palette", "png", [
      [1080, 1528],
      [1080, 1528],
      [1080, 1528],
      [1080, 1528],
      [1080, 1528],
      [1080, 1528],
      [1080, 1528],
      [1080, 1528],
      [1080, 1528],
    ]),
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
