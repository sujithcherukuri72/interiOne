"use client";

/**
 * Telangana state map — accurate SVG outline derived from geographic coordinates.
 *
 * Coordinate formula (viewBox 0 0 350 466):
 *   x(lon) = (lon - 77.0) × 71.1 + 15
 *   y(lat) = (20.1 - lat) × 101.4 + 10
 *
 * Boundary traced clockwise from NW corner using real lat/lng turning points.
 * Pin positions computed from actual city coordinates.
 */

import { useState } from "react";

type Pin = {
  id:     string;
  label:  string;
  cx:     number;
  cy:     number;
  isMain: boolean;
};

const PINS: Pin[] = [
  {
    id:     "main",
    label:  "Kapil Kavuri Hub, Nanakramguda",
    cx:     109,
    cy:     282,
    isMain: true,
  },
  {
    id:    "nizamabad",
    label: "Upcoming — Nizamabad",
    cx:    93,
    cy:    155,
    isMain: false,
  },
  {
    id:    "karimnagar",
    label: "Upcoming — Karimnagar",
    cx:    166,
    cy:    178,
    isMain: false,
  },
  {
    id:    "warangal",
    label: "Upcoming — Warangal",
    cx:    200,
    cy:    225,
    isMain: false,
  },
  {
    id:    "khammam",
    label: "Upcoming — Khammam",
    cx:    239,
    cy:    299,
    isMain: false,
  },
  {
    id:    "mahbubnagar",
    label: "Upcoming — Mahbubnagar",
    cx:    86,
    cy:    351,
    isMain: false,
  },
];

/**
 * Telangana state outline — geographic boundary traced from actual lat/lng.
 * Clockwise from NW corner (Adilabad / Maharashtra border).
 *
 * Key features preserved:
 *  - Wide flat northern border (Adilabad → Mancherial)
 *  - Eastern Bhadrachalam protrusion (rightmost ~x 307)
 *  - Narrow southern tongue (Nagarkurnool / Devarkonda area)
 *  - Zahirabad waist on the left side
 */
const TELANGANA_PATH = `
  M 54 35
  Q 75 28 100 40
  Q 112 43 125 46
  Q 140 48 154 52
  Q 160 59 165 66
  Q 174 59 183 52
  Q 192 62 200 72
  Q 209 85 218 98
  Q 225 113 232 128
  L 243 169
  L 257 204
  Q 265 219 272 234
  Q 281 247 290 260
  Q 299 267 307 275
  L 303 285
  Q 298 295 292 305
  Q 283 315 274 325
  Q 266 332 257 340
  Q 250 352 243 365
  Q 233 374 222 381
  Q 210 391 197 401
  Q 188 409 179 416
  Q 172 422 165 428
  Q 158 433 151 438
  Q 140 442 130 444
  Q 120 441 109 437
  Q 102 430 95 422
  Q 88 414 81 407
  Q 74 396 67 386
  Q 62 376 56 366
  Q 52 356 49 346
  Q 51 333 53 320
  Q 55 312 56 304
  Q 60 294 64 284
  Q 62 274 60 264
  Q 62 256 64 248
  Q 68 240 71 233
  Q 73 222 75 212
  Q 77 202 79 192
  Q 81 181 83 171
  Q 87 161 90 151
  Q 85 141 79 131
  Q 77 120 75 110
  Q 72 100 68 90
  Q 66 77 64 64
  Q 62 56 61 49
  Q 57 42 54 35
  Z
`;

export function TelanganaMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  const hoveredPin = PINS.find(p => p.id === hovered);

  return (
    <div className="relative w-full select-none" style={{ maxWidth: 360 }}>
      {/* Tooltip */}
      {hoveredPin && (
        <div
          className="absolute z-20 pointer-events-none px-3 py-1.5 rounded-lg text-[10px] font-medium tracking-wide whitespace-nowrap"
          style={{
            background: "rgba(14,13,13,0.92)",
            border:     "1px solid rgba(201,168,76,0.35)",
            color:      "var(--gold)",
            top:        `${hoveredPin.cy - 38}px`,
            left:       `${hoveredPin.cx}px`,
            transform:  "translateX(-50%)",
          }}
        >
          {hoveredPin.label}
          {/* Caret */}
          <span
            className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] block w-0 h-0"
            style={{
              borderLeft:   "5px solid transparent",
              borderRight:  "5px solid transparent",
              borderTop:    "6px solid rgba(201,168,76,0.35)",
            }}
          />
        </div>
      )}

      <svg
        viewBox="0 0 350 466"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-label="Telangana state map showing InterioOne branch locations"
      >
        {/* ── Outer glow (soft halo) ── */}
        <path
          d={TELANGANA_PATH}
          fill="none"
          stroke="rgba(201,168,76,0.08)"
          strokeWidth="14"
          strokeLinejoin="round"
        />

        {/* ── State fill ── */}
        <path
          d={TELANGANA_PATH}
          fill="rgba(201,168,76,0.05)"
          stroke="none"
        />

        {/* ── Border ── */}
        <path
          d={TELANGANA_PATH}
          fill="none"
          stroke="rgba(201,168,76,0.6)"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* ── Pins ── */}
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
                {/* Animated pulse */}
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r="12"
                  fill="rgba(201,168,76,0.1)"
                  stroke="rgba(201,168,76,0.3)"
                  strokeWidth="1"
                  className="main-pin-pulse"
                />
                {/* Mid ring */}
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r="7"
                  fill="rgba(201,168,76,0.2)"
                  stroke="rgba(201,168,76,0.65)"
                  strokeWidth="1.4"
                />
                {/* Core */}
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r="3.2"
                  fill="var(--gold)"
                />
                {/* Label */}
                <text
                  x={pin.cx}
                  y={pin.cy + 22}
                  textAnchor="middle"
                  fontSize="6.5"
                  fill="rgba(201,168,76,0.75)"
                  fontFamily="var(--font-geist-sans)"
                  letterSpacing="0.1em"
                  fontWeight="600"
                >
                  MAIN BRANCH
                </text>
              </>
            ) : (
              <>
                {/* Hover ring */}
                {hovered === pin.id && (
                  <circle
                    cx={pin.cx}
                    cy={pin.cy}
                    r="8"
                    fill="rgba(201,168,76,0.06)"
                    stroke="rgba(201,168,76,0.25)"
                    strokeWidth="1"
                  />
                )}
                {/* Border circle */}
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r="4.5"
                  fill="rgba(201,168,76,0.06)"
                  stroke={hovered === pin.id ? "rgba(201,168,76,0.75)" : "rgba(201,168,76,0.28)"}
                  strokeWidth="1.2"
                  style={{ transition: "stroke 0.2s" }}
                />
                {/* Dot */}
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r="1.6"
                  fill={hovered === pin.id ? "var(--gold)" : "rgba(201,168,76,0.38)"}
                  style={{ transition: "fill 0.2s" }}
                />
              </>
            )}
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div
        className="flex items-center gap-5 mt-2 px-1"
        style={{ color: "rgba(245,237,216,0.38)" }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: "var(--gold)" }}
          />
          <span className="text-[10px] tracking-[0.12em] uppercase">Main Branch</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{
              border:     "1.2px solid rgba(201,168,76,0.4)",
              background: "rgba(201,168,76,0.07)",
            }}
          />
          <span className="text-[10px] tracking-[0.12em] uppercase">Upcoming</span>
        </div>
      </div>
    </div>
  );
}
