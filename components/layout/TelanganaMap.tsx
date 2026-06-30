"use client";

/**
 * Telangana state outline map with interactive location pins.
 * Uses an inline SVG path — no external image required.
 *
 * Pin positions are calibrated to the viewBox (0 0 350 466).
 * Main branch: Kapil Kavuri Hub, Nanakramguda, Hyderabad.
 */

import { useState } from "react";

type Pin = {
  id: string;
  label: string;
  cx: number;
  cy: number;
  isMain: boolean;
};

const PINS: Pin[] = [
  {
    id:     "main",
    label:  "Kapil Kavuri Hub, Nanakramguda",
    cx:     135,
    cy:     295,
    isMain: true,
  },
  {
    id:     "nizamabad",
    label:  "Upcoming — Nizamabad",
    cx:     130,
    cy:     130,
    isMain: false,
  },
  {
    id:     "karimnagar",
    label:  "Upcoming — Karimnagar",
    cx:     195,
    cy:     180,
    isMain: false,
  },
  {
    id:     "warangal",
    label:  "Upcoming — Warangal",
    cx:     210,
    cy:     240,
    isMain: false,
  },
  {
    id:     "khammam",
    label:  "Upcoming — Khammam",
    cx:     260,
    cy:     310,
    isMain: false,
  },
  {
    id:     "mahbubnagar",
    label:  "Upcoming — Mahbubnagar",
    cx:     105,
    cy:     370,
    isMain: false,
  },
];

/* Accurate simplified outline of Telangana state (clockwise from northwest) */
const TELANGANA_PATH = `
  M 112 18
  L 130 12
  L 152 8
  L 172 14
  L 192 10
  L 215 18
  L 238 28
  L 255 22
  L 275 30
  L 290 52
  L 300 78
  L 308 102
  L 318 124
  L 326 148
  L 330 172
  L 328 195
  L 320 215
  L 316 236
  L 322 258
  L 318 280
  L 310 302
  L 298 322
  L 285 342
  L 275 362
  L 262 378
  L 248 392
  L 232 408
  L 215 422
  L 198 434
  L 178 442
  L 158 446
  L 138 440
  L 118 430
  L 100 418
  L 82 404
  L 66 388
  L 52 370
  L 42 350
  L 36 328
  L 34 305
  L 38 282
  L 46 260
  L 52 238
  L 48 215
  L 44 192
  L 48 168
  L 58 146
  L 68 124
  L 72 100
  L 74 76
  L 80 54
  L 90 36
  Z
`;

export function TelanganaMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full select-none" style={{ maxWidth: 380 }}>
      {/* Tooltip */}
      {hovered && (
        <div
          className="absolute z-20 pointer-events-none px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-wide whitespace-nowrap"
          style={{
            background:   "rgba(14,13,13,0.92)",
            border:       "1px solid rgba(201,168,76,0.35)",
            color:        "var(--gold)",
            top:          (PINS.find(p => p.id === hovered)?.cy ?? 0) - 36 + "px",
            left:         (PINS.find(p => p.id === hovered)?.cx ?? 0) + "px",
            transform:    "translateX(-50%)",
          }}
        >
          {PINS.find(p => p.id === hovered)?.label}
        </div>
      )}

      <svg
        viewBox="0 0 350 466"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-label="Telangana state map showing InterioOne branch locations"
      >
        {/* ── State fill + border ── */}
        <path
          d={TELANGANA_PATH}
          fill="rgba(201,168,76,0.06)"
          stroke="rgba(201,168,76,0.45)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* ── Subtle inner glow ── */}
        <path
          d={TELANGANA_PATH}
          fill="none"
          stroke="rgba(201,168,76,0.12)"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* ── Location pins ── */}
        {PINS.map(pin => (
          <g
            key={pin.id}
            onMouseEnter={() => setHovered(pin.id)}
            onMouseLeave={() => setHovered(null)}
            className="cursor-pointer"
            role="button"
            aria-label={pin.label}
          >
            {pin.isMain ? (
              /* Main branch — gold pulsing ring */
              <>
                {/* Outer pulse ring (CSS animation) */}
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r="10"
                  fill="rgba(201,168,76,0.15)"
                  stroke="rgba(201,168,76,0.4)"
                  strokeWidth="1"
                  className="main-pin-pulse"
                />
                {/* Mid ring */}
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r="6"
                  fill="rgba(201,168,76,0.25)"
                  stroke="rgba(201,168,76,0.7)"
                  strokeWidth="1.2"
                />
                {/* Core dot */}
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r="3"
                  fill="var(--gold)"
                />
                {/* Label beneath */}
                <text
                  x={pin.cx}
                  y={pin.cy + 22}
                  textAnchor="middle"
                  fontSize="7"
                  fill="rgba(201,168,76,0.8)"
                  fontFamily="var(--font-geist-sans)"
                  letterSpacing="0.08em"
                >
                  MAIN BRANCH
                </text>
              </>
            ) : (
              /* Upcoming branch — smaller outlined dot */
              <>
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r="5"
                  fill="rgba(201,168,76,0.08)"
                  stroke={hovered === pin.id ? "rgba(201,168,76,0.8)" : "rgba(201,168,76,0.3)"}
                  strokeWidth={hovered === pin.id ? "1.8" : "1.2"}
                  style={{ transition: "all 0.2s ease" }}
                />
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r="1.8"
                  fill={hovered === pin.id ? "var(--gold)" : "rgba(201,168,76,0.4)"}
                  style={{ transition: "fill 0.2s ease" }}
                />
              </>
            )}
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div
        className="flex items-center gap-5 mt-3 px-1"
        style={{ color: "rgba(245,237,216,0.4)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: "var(--gold)" }} />
          <span className="text-[10px] tracking-[0.12em] uppercase">Main Branch</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ border: "1.2px solid rgba(201,168,76,0.45)", background: "rgba(201,168,76,0.08)" }}
          />
          <span className="text-[10px] tracking-[0.12em] uppercase">Upcoming</span>
        </div>
      </div>
    </div>
  );
}
