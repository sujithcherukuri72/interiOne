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

### `xteel/` — the product render

| File                  | What it is                                    |
| --------------------- | --------------------------------------------- |
| `xteel-exploded.png`  | The exploded panel: skin, honeycomb core, skin |

**Transparent background** — it sits on the cream page and on nothing else, so
any white box around it will show as a white box. PNG with alpha, or WebP with
alpha if you can export it; 1600–2000px on the long edge is plenty at the size
it is shown, and this file should come in under about 400 KB.

Once it is committed, set `USE_XTEEL_RENDER = true` in `src/data/assets.ts`. The
technology section then shows the render in place of the drawn cross-section,
with the three callouts laid out beside it. Leave the flag off until the file is
actually there — the drawn version is the fallback and it is not a placeholder,
it is a complete answer on its own.

Send more angles or a turntable sequence and this becomes a scroll-scrubbed
rotation rather than a still. That is the version worth having; it needs frames
exported at a consistent camera distance, ideally 24–36 of them.

### `catalogue/` — brochures and price lists

PDFs, named by what they are and nothing else: `interione-kitchens.pdf`,
`interione-finishes.pdf`. Keep each **under 5 MB** — these go out over WhatsApp
to phones on mobile data, and a 40 MB brochure simply does not get opened. The
WhatsApp auto-reply reads its copy from `src/data/whatsapp-reply.ts`; see
[`docs/whatsapp.md`](../../docs/whatsapp.md).

### `video/` — motion

MP4 (H.264) plus a WebM if you have it, and a **poster frame** as a JPEG at the
same dimensions — the poster is what everyone on a slow connection actually
sees, so it is not optional. Keep clips short and silent by default; anything
that autoplays must be muted or the browser will refuse to start it.

Name by subject: `xteel-panel-turntable.mp4`, `studio-jubilee-hills.mp4`.

If a file is over ~10 MB it does not belong in the repo — put it on a CDN or
Vercel Blob and reference the URL. Git is not a video host, and every clone
pays for what is committed here forever.

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
