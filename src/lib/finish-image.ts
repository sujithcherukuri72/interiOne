/**
 * A finish "photograph" until studio shoots exist — an inline SVG built
 * straight from the finish's own `hex`/`grain` pair, the same principle the
 * `Swatch` component uses for the catalogue. The coverflow needs an actual
 * `<img src>`, so this renders that same idea as a data URI instead of a
 * styled div: the tile *is* the specification, not a stand-in stock photo of
 * something else entirely.
 */
export function finishImage(hex: string, grain: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${hex}" />
        <stop offset="58%" stop-color="${hex}" />
        <stop offset="100%" stop-color="${grain}" />
      </linearGradient>
      <pattern id="p" width="10" height="10" patternTransform="rotate(112)" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="transparent" />
        <line x1="0" y1="0" x2="0" y2="10" stroke="${grain}" stroke-width="1" opacity="0.16" />
      </pattern>
    </defs>
    <rect width="640" height="640" fill="url(#g)" />
    <rect width="640" height="640" fill="url(#p)" />
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
