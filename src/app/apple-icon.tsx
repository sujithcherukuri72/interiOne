import { ImageResponse } from "next/og";

/**
 * The iOS home-screen icon.
 *
 * Safari will not take an SVG here, so this is rendered to PNG at build time
 * rather than shipped as another file to keep in sync. Apple also composites
 * the icon onto its own rounded mask, so the artwork is drawn square and edge
 * to edge — a rounded rect of our own would show as a double corner.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0c0b",
        }}
      >
        <svg width="118" height="118" viewBox="0 0 100 100">
          <path
            d="M20 94 L20 44 C20 22 40 6 66 6 L66 12 C44 16 32 30 32 50 L32 94 Z"
            fill="#f5f0eb"
          />
          <path
            d="M74 6 L74 94 L62 94 L62 40 C62 22 68 12 74 6 Z"
            fill="#f5f0eb"
          />
          <path d="M40 94 L40 84 C46 84 50 88 50 94 Z" fill="#ff4d6a" />
        </svg>
      </div>
    ),
    size,
  );
}
