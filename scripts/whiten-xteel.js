/* Repaint the Xteel render frames: the steel skins go white, the composite
   core is left exactly as shot. A pixel counts as skin if it is warm — the
   render's greige ramps r > g > b, while every core tone is neutral or
   purple. Shading is kept, just re-anchored so the lit face lands at white. */
const sharp = require("sharp");
const path = require("path");

const SKIN_LIT = 184; // the dominant lit-face red channel in the source
const CONTRAST = 0.55; // how much of the original shading survives

/* The renders are 1080x1920 with the panel floating in the middle third, so
   `object-contain` was fitting mostly empty space and the product came out
   small. This is the union of every frame's opaque bounds plus a little air —
   one box for all eleven, so the panel does not jitter between frames. */
const CROP = { left: 54, top: 480, width: 1005, height: 1190 };

async function whiten(src, dst) {
  const { data, info } = await sharp(src)
    .extract(CROP)
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 8) continue;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    if (r - g < 2 || g - b < 2) continue; // neutral or purple → core, leave it
    const v = Math.max(0, Math.min(255, Math.round(252 - (SKIN_LIT - r) * CONTRAST)));
    data[i] = data[i + 1] = data[i + 2] = v;
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 88 })
    .toFile(dst);
}

const [, , out, ...files] = process.argv;
Promise.all(files.map((f) => whiten(f, path.join(out, path.basename(f))))).then(
  () => console.log("done", files.length)
);
