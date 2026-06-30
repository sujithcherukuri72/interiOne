"use client";

/**
 * Telangana state map — Google Maps clipped to the state outline,
 * overlaid with gold teardrop pins matching the reference design.
 *
 * Boundary: accurate lat/lng trace using
 *   x(lon) = (lon − 77.2) × 65.2 + 25
 *   y(lat) = (19.9 − lat) × 107.3 + 15
 *
 * Normalised path (÷350, ÷466) used for CSS clip-path objectBoundingBox.
 */

import { useState } from "react";

/* ── Pin definitions ──────────────────────────────────────────────────────── */
type Pin = {
  id: string;
  city: string;
  info?: string;
  cx: number;
  cy: number;
  isMain: boolean;
};

const PINS: Pin[] = [
  {
    id:     "main",
    city:   "Hyderabad",
    info:   "InterioOne Design Studio",
    cx:     109,
    cy:     280,
    isMain: true,
  },
  { id: "nizamabad",   city: "Nizamabad",   cx:  80, cy: 155, isMain: false },
  { id: "karimnagar",  city: "Karimnagar",  cx: 152, cy: 172, isMain: false },
  { id: "warangal",    city: "Warangal",    cx: 181, cy: 221, isMain: false },
  { id: "khammam",     city: "Khammam",     cx: 245, cy: 288, isMain: false },
  { id: "mahbubnagar", city: "Mahbubnagar", cx:  77, cy: 354, isMain: false },
];

/**
 * Accurate Telangana outline in SVG user-space (viewBox 0 0 350 466).
 * Traced from real lat/lng turning points:
 *  - Wide flat northern border (Adilabad ↔ Mancherial)
 *  - Bhadrachalam eastern protrusion tip at (276, 270)
 *  - Narrow southern tongue (Nagarkurnool) at (120, 450)
 *  - Zahirabad waist on western side (~x 43)
 */
const PATH = `
  M 48 20
  Q 61 17 77 15
  Q 94 20 107 28
  Q 123 26 136 31
  Q 146 39 152 47
  Q 158 40 165 34
  Q 172 40 180 47
  Q 186 61 191 74
  Q 196 90 200 106
  Q 206 122 211 138
  Q 216 155 221 171
  Q 226 187 230 203
  Q 237 219 243 235
  Q 251 246 258 256
  Q 267 263 276 270
  Q 270 278 270 275
  Q 266 285 261 294
  Q 256 308 250 321
  Q 244 335 237 348
  Q 229 362 221 375
  Q 210 386 198 396
  Q 187 407 175 417
  Q 164 428 152 436
  Q 136 443 120 450
  Q 100 436 80 412
  Q 64 391 48 369
  Q 39 353 41 337
  L 43 315
  L 45 294
  Q 46 284 43 256
  Q 45 240 48 219
  Q 54 197 61 176
  Q 64 155 61 138
  Q 59 122 58 101
  Q 56 79 52 58
  Q 50 42 48 31
  Z
`;

/**
 * Same path normalised to [0,1] for clipPathUnits="objectBoundingBox".
 * Each x ÷ 350, each y ÷ 466.
 */
const NORM = `
  M 0.137 0.043
  Q 0.174 0.036 0.220 0.032
  Q 0.269 0.043 0.306 0.060
  Q 0.351 0.056 0.389 0.066
  Q 0.417 0.084 0.434 0.101
  Q 0.451 0.086 0.471 0.073
  Q 0.491 0.086 0.514 0.101
  Q 0.531 0.131 0.546 0.159
  Q 0.560 0.193 0.571 0.227
  Q 0.589 0.262 0.603 0.296
  Q 0.617 0.333 0.631 0.367
  Q 0.646 0.401 0.657 0.435
  Q 0.677 0.470 0.694 0.504
  Q 0.717 0.528 0.737 0.549
  Q 0.763 0.564 0.789 0.580
  Q 0.771 0.596 0.771 0.590
  Q 0.760 0.611 0.746 0.631
  Q 0.731 0.661 0.714 0.689
  Q 0.697 0.719 0.677 0.748
  Q 0.654 0.777 0.631 0.805
  Q 0.600 0.828 0.566 0.850
  Q 0.534 0.873 0.500 0.894
  Q 0.469 0.919 0.434 0.936
  Q 0.389 0.951 0.343 0.966
  Q 0.286 0.936 0.229 0.884
  Q 0.183 0.839 0.137 0.792
  Q 0.111 0.757 0.117 0.723
  L 0.123 0.676
  L 0.129 0.631
  Q 0.131 0.609 0.123 0.549
  Q 0.129 0.515 0.137 0.470
  Q 0.154 0.423 0.174 0.378
  Q 0.183 0.333 0.174 0.296
  Q 0.169 0.262 0.166 0.217
  Q 0.160 0.169 0.149 0.124
  Q 0.143 0.090 0.137 0.066
  Z
`;

/* Google Maps — centred on Telangana, zoom 7 shows the full state */
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const MAP_SRC = MAPS_KEY
  ? `https://www.google.com/maps/embed/v1/view?key=${MAPS_KEY}&center=17.85,79.1&zoom=7&maptype=roadmap`
  : `https://maps.google.com/maps?q=17.85,79.1&z=7&output=embed`;

const CLIP_ID = "ts-clip-v3";

/* ── Teardrop pin path (centred at origin, tip at y=+16) ── */
const DROP = "M 0,16 C -7,8 -11,2 -11,-4 C -11,-12 -6,-17 0,-17 C 6,-17 11,-12 11,-4 C 11,2 7,8 0,16 Z";
const DROP_LG = "M 0,22 C -9,11 -14,3 -14,-5 C -14,-15 -8,-22 0,-22 C 8,-22 14,-15 14,-5 C 14,3 9,11 0,22 Z";

export function TelanganaMap() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      className="relative w-full select-none"
      style={{ aspectRatio: "350 / 466" }}
    >
      {/* 1. Hidden clip-path definition */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <defs>
          <clipPath id={CLIP_ID} clipPathUnits="objectBoundingBox">
            <path d={NORM} />
          </clipPath>
        </defs>
      </svg>

      {/* 2. Google Maps iframe clipped to Telangana shape */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `url(#${CLIP_ID})`,
        }}
      >
        <iframe
          src={MAP_SRC}
          title="Telangana — Google Maps"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
            filter: "invert(93%) hue-rotate(180deg) saturate(0.65) brightness(0.82)",
          }}
        />
      </div>

      {/* 3. SVG overlay: glow + dark veil + border + pins */}
      <svg
        viewBox="0 0 350 466"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        aria-label="Telangana branch locations"
      >
        {/* Outer golden glow */}
        <path d={PATH} stroke="rgba(201,168,76,0.18)" strokeWidth="22" strokeLinejoin="round" />
        <path d={PATH} stroke="rgba(201,168,76,0.30)" strokeWidth="10" strokeLinejoin="round" />

        {/* Dark veil inside shape */}
        <path d={PATH} fill="rgba(8,8,10,0.28)" />

        {/* Gold border */}
        <path
          d={PATH}
          stroke="rgba(201,168,76,0.85)"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* ── Pins ── */}
        {PINS.map(pin => (
          <g
            key={pin.id}
            transform={`translate(${pin.cx},${pin.cy})`}
            onMouseEnter={() => setActive(pin.id)}
            onMouseLeave={() => setActive(null)}
            style={{ cursor: "pointer" }}
            role="button"
            aria-label={pin.city}
          >
            {pin.isMain ? (
              /* ── Main branch ── */
              <>
                {/* Pulsing outer rings */}
                <circle r="28" fill="rgba(201,168,76,0.06)" className="main-pin-pulse" />
                <circle r="18" fill="rgba(201,168,76,0.12)" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />

                {/* Large teardrop pin */}
                <path
                  d={DROP_LG}
                  fill="url(#pinGradMain)"
                  stroke="rgba(201,168,76,0.6)"
                  strokeWidth="1"
                  filter="drop-shadow(0 2px 8px rgba(201,168,76,0.5))"
                />
                {/* Inner circle */}
                <circle cy="-5" r="6.5" fill="rgba(14,13,13,0.8)" />
                <circle cy="-5" r="3" fill="var(--gold)" />

                {/* Callout box */}
                <g transform="translate(18,-28)">
                  <rect
                    x="0" y="0" width="148" height="44" rx="6"
                    fill="rgba(10,9,9,0.88)"
                    stroke="rgba(201,168,76,0.35)"
                    strokeWidth="1"
                  />
                  <text x="10" y="13" fontSize="7.5" fontWeight="700" fill="var(--gold)" letterSpacing="0.12em" fontFamily="var(--font-geist-sans)">MAIN BRANCH</text>
                  <text x="10" y="25" fontSize="9" fill="rgba(245,237,216,0.88)" fontFamily="var(--font-geist-sans)">{pin.info}</text>
                  <text x="10" y="37" fontSize="9" fill="rgba(245,237,216,0.5)" fontFamily="var(--font-geist-sans)">{pin.city}</text>
                </g>

                {/* Gradient def */}
                <defs>
                  <radialGradient id="pinGradMain" cx="40%" cy="30%">
                    <stop offset="0%" stopColor="#E8D080" />
                    <stop offset="100%" stopColor="#A07828" />
                  </radialGradient>
                </defs>
              </>
            ) : (
              /* ── Upcoming branch ── */
              <>
                {/* Hover ring */}
                {active === pin.id && (
                  <circle r="14" fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.2)" strokeWidth="1" />
                )}

                {/* Teardrop pin */}
                <path
                  d={DROP}
                  fill="url(#pinGradSm)"
                  stroke="rgba(201,168,76,0.5)"
                  strokeWidth="0.8"
                  filter="drop-shadow(0 1px 4px rgba(201,168,76,0.35))"
                  style={{ transition: "filter 0.2s" }}
                />
                {/* Inner dot */}
                <circle cy="-4" r="3" fill="rgba(14,13,13,0.75)" />
                <circle cy="-4" r="1.3" fill="var(--gold)" />

                {/* City label */}
                <text
                  y="28"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill="rgba(245,237,216,0.85)"
                  fontFamily="var(--font-geist-sans)"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
                >
                  {pin.city}
                </text>

                {/* Gradient def (shared) */}
                <defs>
                  <radialGradient id="pinGradSm" cx="40%" cy="30%">
                    <stop offset="0%" stopColor="#D4B060" />
                    <stop offset="100%" stopColor="#8B6020" />
                  </radialGradient>
                </defs>
              </>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
