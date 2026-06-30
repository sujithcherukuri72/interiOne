"use client";

/**
 * Telangana state map — Google Maps iframe clipped to the precise state outline.
 *
 * Coordinate formula used to place all boundary points & pins (viewBox 0 0 350 466):
 *   x(lon) = (lon − 77.2) × 65.2 + 25
 *   y(lat) = (19.9 − lat) × 107.3 + 15
 *
 * Boundary traced clockwise from NW corner using real lat/lng turning points.
 * Normalised path (coords ÷ 350 or ÷ 466) is used for clipPathUnits="objectBoundingBox"
 * so the CSS clip-path scales responsively with the container.
 */

import { useState } from "react";

/* ── Pin data (city coordinates → SVG positions) ─────────────────────────── */
type Pin = { id: string; label: string; cx: number; cy: number; isMain: boolean };

const PINS: Pin[] = [
  { id: "main",        label: "Kapil Kavuri Hub, Nanakramguda", cx: 109, cy: 285, isMain: true  },
  { id: "nizamabad",   label: "Upcoming — Nizamabad",           cx:  83, cy: 147, isMain: false },
  { id: "karimnagar",  label: "Upcoming — Karimnagar",          cx: 150, cy: 172, isMain: false },
  { id: "warangal",    label: "Upcoming — Warangal",            cx: 181, cy: 221, isMain: false },
  { id: "khammam",     label: "Upcoming — Khammam",             cx: 217, cy: 300, isMain: false },
  { id: "mahbubnagar", label: "Upcoming — Mahbubnagar",         cx:  77, cy: 354, isMain: false },
];

/**
 * Accurate Telangana border in SVG user-space (viewBox 0 0 350 466).
 * Key landmarks:
 *  - Wide northern border: NW(48,20) … NE(180,60)
 *  - Bhadrachalam eastern protrusion: tip at (279,273)
 *  - Narrow southern tongue: southernmost at (110,444)
 *  - Zahirabad waist on western side (~x 41-48)
 */
const PATH = `
  M 48 20
  Q 66 28 84 37
  Q 95 39 107 42
  L 139 42
  Q 145 47 152 53
  Q 158 49 165 45
  Q 172 52 180 60
  Q 186 75 191 90
  Q 195 106 198 122
  Q 206 143 214 165
  Q 220 181 227 197
  Q 234 213 240 230
  Q 248 243 257 256
  Q 268 264 279 273
  L 273 283
  Q 268 294 263 305
  Q 255 321 247 337
  Q 234 358 221 380
  Q 204 390 188 401
  Q 175 412 162 423
  Q 136 433 110 444
  Q 97 433 84 423
  Q 74 412 64 401
  Q 55 390 45 380
  Q 42 369 38 358
  Q 40 347 41 337
  L 41 315
  L 41 294
  Q 43 283 45 273
  L 45 251
  Q 47 240 48 230
  Q 51 219 55 208
  Q 57 197 58 187
  Q 60 176 62 165
  Q 64 154 65 144
  Q 64 133 62 122
  Q 60 111 58 101
  Q 57 90 55 79
  Q 53 68 51 58
  L 51 42
  Q 50 36 48 31
  L 48 20
  Z
`;

/**
 * Same path with coordinates normalised to [0,1] for
 * clipPathUnits="objectBoundingBox" — each x ÷ 350, each y ÷ 466.
 */
const NORM_PATH = `
  M 0.137 0.043
  Q 0.189 0.060 0.240 0.079
  Q 0.271 0.084 0.306 0.090
  L 0.397 0.090
  Q 0.414 0.101 0.434 0.114
  Q 0.451 0.105 0.471 0.097
  Q 0.491 0.112 0.514 0.129
  Q 0.531 0.161 0.546 0.193
  Q 0.557 0.227 0.566 0.262
  Q 0.589 0.307 0.611 0.354
  Q 0.629 0.388 0.649 0.423
  Q 0.669 0.457 0.686 0.494
  Q 0.709 0.521 0.734 0.549
  Q 0.766 0.566 0.797 0.586
  L 0.780 0.607
  Q 0.766 0.631 0.751 0.654
  Q 0.729 0.689 0.706 0.723
  Q 0.669 0.768 0.631 0.815
  Q 0.583 0.837 0.537 0.860
  Q 0.500 0.884 0.463 0.907
  Q 0.389 0.929 0.314 0.952
  Q 0.277 0.929 0.240 0.907
  Q 0.211 0.884 0.183 0.860
  Q 0.157 0.837 0.129 0.815
  Q 0.120 0.792 0.109 0.768
  Q 0.114 0.744 0.117 0.723
  L 0.117 0.676
  L 0.117 0.631
  Q 0.123 0.607 0.129 0.586
  L 0.129 0.539
  Q 0.134 0.515 0.137 0.494
  Q 0.146 0.470 0.157 0.446
  Q 0.163 0.423 0.166 0.401
  Q 0.171 0.378 0.177 0.354
  Q 0.183 0.330 0.186 0.309
  Q 0.183 0.285 0.177 0.262
  Q 0.171 0.238 0.166 0.217
  Q 0.163 0.193 0.157 0.169
  Q 0.151 0.146 0.146 0.124
  L 0.146 0.090
  Q 0.143 0.077 0.137 0.066
  L 0.137 0.043
  Z
`;

/* ── Google Maps — centred on Telangana, zoom 8 so entire state is visible ── */
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const MAP_SRC = MAPS_KEY
  ? `https://www.google.com/maps/embed/v1/view?key=${MAPS_KEY}&center=17.85,79.1&zoom=8&maptype=roadmap`
  : `https://maps.google.com/maps?q=17.85,79.1&z=8&output=embed`;

/* Unique ID avoids collisions if component is rendered more than once */
const CLIP_ID = "ts-map-clip-v2";

export function TelanganaMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredPin = PINS.find(p => p.id === hovered);

  return (
    <div
      className="relative w-full select-none"
      style={{ maxWidth: 360, aspectRatio: "350 / 466" }}
    >
      {/* ── 1. Hidden SVG: defines objectBoundingBox clip path ── */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <defs>
          <clipPath id={CLIP_ID} clipPathUnits="objectBoundingBox">
            <path d={NORM_PATH} />
          </clipPath>
        </defs>
      </svg>

      {/* ── 2. Google Maps iframe, clipped to Telangana shape ── */}
      <div
        style={{
          position: "absolute",
          inset:    0,
          clipPath: `url(#${CLIP_ID})`,
        }}
      >
        <iframe
          src={MAP_SRC}
          title="Telangana region — Google Maps"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            width:   "100%",
            height:  "100%",
            border:  "none",
            display: "block",
            /* Dark-mode: invert → hue-correct → tone down */
            filter:  "invert(92%) hue-rotate(180deg) saturate(0.72) brightness(0.85)",
          }}
        />
      </div>

      {/* ── 3. SVG layer: glow + dark overlay + border + pins ── */}
      <svg
        viewBox="0 0 350 466"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position:      "absolute",
          inset:         0,
          width:         "100%",
          height:        "100%",
          pointerEvents: "none",
          overflow:      "visible",
        }}
        aria-label="Telangana location pins"
      >
        {/* Soft outer glow */}
        <path d={PATH} stroke="rgba(201,168,76,0.14)" strokeWidth="18" strokeLinejoin="round" />

        {/* Dark overlay — blends map with dark theme */}
        <path d={PATH} fill="rgba(14,13,13,0.22)" />

        {/* Gold border */}
        <path
          d={PATH}
          stroke="rgba(201,168,76,0.72)"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Inner border shimmer */}
        <path d={PATH} stroke="rgba(201,168,76,0.18)" strokeWidth="5" strokeLinejoin="round" />

        {/* Pins — pointer-events re-enabled */}
        <g style={{ pointerEvents: "all" }}>
          {PINS.map(pin => (
            <g
              key={pin.id}
              onMouseEnter={() => setHovered(pin.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label={pin.label}
            >
              {pin.isMain ? (
                <>
                  <circle
                    cx={pin.cx} cy={pin.cy} r="14"
                    fill="rgba(201,168,76,0.12)"
                    stroke="rgba(201,168,76,0.28)"
                    strokeWidth="1"
                    className="main-pin-pulse"
                  />
                  <circle
                    cx={pin.cx} cy={pin.cy} r="7.5"
                    fill="rgba(201,168,76,0.25)"
                    stroke="rgba(201,168,76,0.75)"
                    strokeWidth="1.5"
                  />
                  <circle cx={pin.cx} cy={pin.cy} r="3.5" fill="var(--gold)" />
                  <text
                    x={pin.cx} y={pin.cy + 24}
                    textAnchor="middle"
                    fontSize="6.5"
                    fill="rgba(245,237,216,0.92)"
                    fontFamily="var(--font-geist-sans)"
                    letterSpacing="0.1em"
                    fontWeight="600"
                  >
                    MAIN BRANCH
                  </text>
                </>
              ) : (
                <>
                  {hovered === pin.id && (
                    <circle
                      cx={pin.cx} cy={pin.cy} r="9"
                      fill="rgba(201,168,76,0.08)"
                      stroke="rgba(201,168,76,0.2)"
                      strokeWidth="1"
                    />
                  )}
                  <circle
                    cx={pin.cx} cy={pin.cy} r="4.5"
                    fill="rgba(14,13,13,0.65)"
                    stroke={hovered === pin.id ? "rgba(201,168,76,0.85)" : "rgba(201,168,76,0.35)"}
                    strokeWidth="1.3"
                    style={{ transition: "stroke 0.2s" }}
                  />
                  <circle
                    cx={pin.cx} cy={pin.cy} r="1.6"
                    fill={hovered === pin.id ? "var(--gold)" : "rgba(201,168,76,0.5)"}
                    style={{ transition: "fill 0.2s" }}
                  />
                </>
              )}
            </g>
          ))}
        </g>
      </svg>

      {/* ── 4. Tooltip — HTML layer (above SVG) ── */}
      {hoveredPin && (
        <div
          className="absolute z-20 pointer-events-none px-3 py-1.5 rounded-lg text-[10px] font-medium tracking-wide whitespace-nowrap"
          style={{
            background: "rgba(14,13,13,0.95)",
            border:     "1px solid rgba(201,168,76,0.4)",
            color:      "var(--gold)",
            top:        `calc(${(hoveredPin.cy / 466) * 100}% - 42px)`,
            left:       `calc(${(hoveredPin.cx / 350) * 100}%)`,
            transform:  "translateX(-50%)",
          }}
        >
          {hoveredPin.label}
          <span
            className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] block w-0 h-0"
            style={{
              borderLeft:  "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop:   "6px solid rgba(201,168,76,0.4)",
            }}
          />
        </div>
      )}

      {/* ── 5. Legend ── */}
      <div
        className="absolute bottom-0 translate-y-8 left-0 flex items-center gap-5"
        style={{ color: "rgba(245,237,216,0.38)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: "var(--gold)" }} />
          <span className="text-[10px] tracking-[0.12em] uppercase">Main Branch</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ border: "1.2px solid rgba(201,168,76,0.4)", background: "rgba(201,168,76,0.07)" }}
          />
          <span className="text-[10px] tracking-[0.12em] uppercase">Upcoming</span>
        </div>
      </div>
    </div>
  );
}
