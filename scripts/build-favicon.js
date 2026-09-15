/* eslint-disable @typescript-eslint/no-require-imports -- plain CJS build script, run by hand with node. */
/* Rebuild src/app/favicon.ico.

   The icon that shipped was 32x28. Google requires a *square* favicon and
   rejects anything else outright, falling back to a generic host icon — which
   is why the search result carried Vercel's mark rather than ours. This writes
   a three-entry ICO (16/32/48, PNG-compressed) from the same mark
   app/apple-icon.tsx draws, so every surface shows one icon.

   Run by hand after changing the mark:  node scripts/build-favicon.js  */
const fs = require("fs");
const sharp = require("sharp");

// The same mark app/apple-icon.tsx draws, so the tab, the home screen and the
// search result are one icon rather than three.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#0c0c0b"/>
  <g transform="translate(50 50) scale(0.78) translate(-50 -50)">
    <path d="M20 94 L20 44 C20 22 40 6 66 6 L66 12 C44 16 32 30 32 50 L32 94 Z" fill="#f5f0eb"/>
    <path d="M74 6 L74 94 L62 94 L62 40 C62 22 68 12 74 6 Z" fill="#f5f0eb"/>
    <path d="M40 94 L40 84 C46 84 50 88 50 94 Z" fill="#ff4d6a"/>
  </g>
</svg>`;

const SIZES = [16, 32, 48];

(async () => {
  const pngs = [];
  for (const s of SIZES) {
    pngs.push(await sharp(Buffer.from(svg)).resize(s, s).png().toBuffer());
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(SIZES.length, 4);

  const dir = Buffer.alloc(16 * SIZES.length);
  let offset = header.length + dir.length;
  SIZES.forEach((s, i) => {
    const e = i * 16;
    dir[e] = s === 256 ? 0 : s;
    dir[e + 1] = s === 256 ? 0 : s;
    dir[e + 2] = 0;
    dir[e + 3] = 0;
    dir.writeUInt16LE(1, e + 4);
    dir.writeUInt16LE(32, e + 6);
    dir.writeUInt32LE(pngs[i].length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += pngs[i].length;
  });

  fs.writeFileSync("src/app/favicon.ico", Buffer.concat([header, dir, ...pngs]));
  console.log("favicon.ico written:", SIZES.join("/"), "square");
})();
