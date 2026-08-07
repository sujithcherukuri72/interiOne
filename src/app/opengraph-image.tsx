import { ImageResponse } from "next/og";

import { SITE, STUDIO } from "@/lib/site";

/**
 * The share card, drawn from the design system rather than shipped as a JPEG.
 *
 * Generated means it cannot fall out of date with the studio address or the
 * positioning line, and there is no 300 KB image in the repo to forget about.
 * Drop `public/assets/og/og-default.jpg` and point `metadata.openGraph.images`
 * at it if art direction ever wants a photograph here instead.
 *
 * Everything is laid out with explicit flex — Satori, which renders this,
 * supports no CSS grid and no shorthand-free inheritance, so each rule is
 * spelled out.
 */

export const alt = `${SITE.name} — modular kitchens in Hyderabad`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f0eb",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top rule — mark, wordmark, and where this is. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="46" height="46" viewBox="0 0 100 100">
              <path
                d="M20 94 L20 44 C20 22 40 6 66 6 L66 12 C44 16 32 30 32 50 L32 94 Z"
                fill="#1a1a1a"
              />
              <path
                d="M74 6 L74 94 L62 94 L62 40 C62 22 68 12 74 6 Z"
                fill="#1a1a1a"
              />
              <path d="M40 94 L40 84 C46 84 50 88 50 94 Z" fill="#ff4d6a" />
            </svg>
            <span
              style={{
                fontSize: 30,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#1a1a1a",
              }}
            >
              interiOne
            </span>
          </div>

          <span
            style={{
              fontSize: 20,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#8c8579",
            }}
          >
            {STUDIO.streetAddress} · {STUDIO.locality}
          </span>
        </div>

        {/* The line the whole product rests on. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 104,
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#1a1a1a",
            }}
          >
            Forged in steel,
          </span>
          <span
            style={{
              fontSize: 104,
              lineHeight: 1.06,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#b3ada1",
            }}
          >
            not in sawdust.
          </span>
        </div>

        {/* Bottom rule — the three claims, on the accent. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            borderTop: "1px solid #e3dcd0",
            paddingTop: 30,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 10,
              background: "#ff4d6a",
            }}
          />
          <span
            style={{
              fontSize: 26,
              letterSpacing: "-0.01em",
              color: "#4a463f",
            }}
          >
            Termite proof · Fire safe · Zero plywood · Installed in 30 days
          </span>
        </div>
      </div>
    ),
    size,
  );
}
