# `public/assets`

Everything served straight off the origin at `/assets/...`. Nothing in here is
processed by the build, so what you drop is exactly what ships — size and
compress before committing.

Paths are declared once in [`src/data/assets.ts`](../../src/data/assets.ts) and
imported from there. Never hard-code an `/assets/...` string in a component: if
a filename changes, one edit in that file should be the whole change.

---

## What to drop where

### `logo/` — the identity

The mark is currently drawn as inline SVG in `src/components/ui/Logo.tsx`, so
the site works with this folder empty. To switch to the supplied artwork, drop
the files below and set `USE_IMAGE_LOGO = true` in `src/data/assets.ts`.

| File                            | What it is                          | Notes                                                       |
| ------------------------------- | ----------------------------------- | ----------------------------------------------------------- |
| `interione-lockup-dark.svg`     | Mark + wordmark, for light backgrounds | Ink artwork. Used on the cream page and in the footer.       |
| `interione-lockup-light.svg`    | Mark + wordmark, for dark backgrounds  | White artwork. Used in the nav bar and the menu takeover.    |
| `interione-mark-dark.svg`       | Mark only, for light backgrounds       | Square-ish artboard.                                        |
| `interione-mark-light.svg`      | Mark only, for dark backgrounds        | Square-ish artboard.                                        |

SVG please, not PNG — the mark is set at everything from 17px in the bar to
13rem in the footer, and it must stay crisp at both. Convert type to outlines so
it does not depend on a font being installed, and strip the artboard background
so `currentColor`-adjacent placements stay transparent.

### `brand/` — partner and certification marks

`modula.svg`, `jsw.svg`, and any hardware-partner logos (`hettich.svg`,
`blum.svg`, …). Monochrome versions if you have them; the Partners grid inverts
on hover and two-colour logos break there.

### `og/` — social share images

`og-default.jpg` at **1200×630**, under 300 KB. Only needed if you want to
replace the generated card — `src/app/opengraph-image.tsx` renders one from the
brand system at build time, so this is optional.

### `photography/` — real studio and project shots

The finish bands and the carousel currently run on `picsum.photos` placeholders
(see `src/lib/placeholder.ts`). When the shoots land:

- Name by subject and range: `signature-onyx-kitchen-01.jpg`.
- Export at 2400px on the long edge, JPEG quality 78–82.
- Then delete `src/lib/placeholder.ts` and the `remotePatterns` entry in
  `next.config.ts` — that is the last step of the swap.

### `icons/` — favicons and app icons

The tab icon and Apple touch icon are generated from the brand mark by
`src/app/icon.svg` and `src/app/apple-icon.svg`. Drop replacements here only if
the supplied artwork differs from the drawn mark, then point those two files at
them.

---

## Naming

Lower-case, hyphen-separated, no spaces, no version numbers in the filename
(`interione-lockup-dark.svg`, never `interiOne Lockup Dark v3 FINAL.svg`).
Git carries the versions.
