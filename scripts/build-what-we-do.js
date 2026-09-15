/* eslint-disable @typescript-eslint/no-require-imports -- plain CJS build script, run by hand with node. */
/* The three pictures on the "What we do" tag, one kitchen told three times:
   design is a pencil drawing of it on graph paper, build is the Xteel panel it
   is made from, install is the finished photograph. Same crop for design and
   install, so the drawing wipes into the real thing without anything moving. */
const sharp = require("sharp");
const fs = require("fs");

const OUT = "public/assets/what-we-do";
const W = 900;
const H = 675;
const PAPER = { r: 253, g: 249, b: 243 }; // --cream
const KITCHEN = "public/assets/Kitchen-Types/Hero/MinimalKitchen.jpg";
const CROP = { left: 0, top: 560, width: 1080, height: 810 }; // cabinets + hob, 4:3

const grid = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="s" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" fill="none" stroke="#6ab4f5" stroke-opacity=".18"/></pattern>
    <pattern id="l" width="90" height="90" patternUnits="userSpaceOnUse"><rect width="90" height="90" fill="url(#s)"/><path d="M90 0H0V90" fill="none" stroke="#6ab4f5" stroke-opacity=".35"/></pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#l)"/>
  <g stroke="#865b49" stroke-width="1.5" fill="#865b49" font-family="monospace" font-size="16" letter-spacing="2">
    <path d="M40 640H860M40 628V652M860 628V652"/>
    <text x="410" y="628" stroke="none">3000</text>
  </g>
</svg>`;

async function design() {
  const src = await sharp(KITCHEN).extract(CROP).resize(W, H).greyscale().toBuffer();
  // Edges only, inverted: dark pencil lines on transparent paper.
  const lines = await sharp(src)
    .blur(0.8)
    .convolve({ width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] })
    .linear(3.2, 0)
    .negate()
    .toBuffer();
  await sharp({ create: { width: W, height: H, channels: 3, background: PAPER } })
    .composite([
      { input: Buffer.from(grid) },
      { input: lines, blend: "multiply" },
    ])
    .webp({ quality: 82 })
    .toFile(`${OUT}/design.webp`);
}

async function build() {
  const panel = await sharp("public/assets/xteel/white/0100.webp")
    .resize({ height: H - 60, fit: "inside" })
    .toBuffer();
  await sharp({ create: { width: W, height: H, channels: 3, background: { r: 230, g: 221, b: 205 } } }) // --surface
    .composite([{ input: panel, gravity: "center" }])
    .webp({ quality: 82 })
    .toFile(`${OUT}/build.webp`);
}

async function install() {
  await sharp(KITCHEN).extract(CROP).resize(W, H).webp({ quality: 80 }).toFile(`${OUT}/install.webp`);
}

fs.mkdirSync(OUT, { recursive: true });
Promise.all([design(), build(), install()]).then(() => console.log("done"));
