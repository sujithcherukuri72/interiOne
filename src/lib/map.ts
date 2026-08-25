import { STUDIO } from "@/lib/site";

/**
 * Everything the studio map needs, in one place.
 *
 * Two providers are wired, in this order:
 *
 *   1. Mapbox GL — vector tiles, custom marker, drag/zoom.
 *   2. Google Maps JavaScript API — the same treatment on Google's tiles,
 *      recoloured to the palette in `lib/google-maps.ts`. Used when there is no
 *      Mapbox token but a Google key has been supplied.
 *
 * With neither key present the component draws a schematic placeholder rather
 * than an empty grey box, so the section is presentable before any account
 * exists. Adding a key is the whole deployment step — nothing else changes.
 *
 * These must be referenced as literal `process.env.NEXT_PUBLIC_*` expressions:
 * Next inlines them at build time by textual substitution, so a computed lookup
 * would come back undefined in the browser.
 */

export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

/** Placeholder for the key you're supplying — see `.env.example`. */
export const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

/**
 * Override to point at a Mapbox Studio style of our own. The default is
 * Mapbox's own light basemap, which the component then tints in CSS to the
 * page's warm palette — a hosted custom style would let us bake that in.
 */
export const MAPBOX_STYLE =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE || "mapbox://styles/mapbox/light-v11";

/** The studio pin. Coordinates live in `lib/site.ts` with the rest of the NAP. */
export const MAP_VIEW = {
  longitude: STUDIO.longitude,
  latitude: STUDIO.latitude,
  /** Close enough to read the street names, wide enough to place the block. */
  zoom: 15.4,
  /** A slight rake, so the map reads as a view rather than a diagram. */
  pitch: 42,
  bearing: -17,
  /** Where the camera starts before it settles onto the pin. */
  introZoom: 12.6,
} as const;

/** Formatted for a marker label and for anyone reading the source. */
export const MAP_COORDS_LABEL = `${STUDIO.latitude.toFixed(4)}° N, ${STUDIO.longitude.toFixed(4)}° E`;

/** Turn-by-turn in whichever app the phone prefers. Needs no API key. */
export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${STUDIO.latitude},${STUDIO.longitude}`;

export type MapProvider = "mapbox" | "google" | "placeholder";

export const MAP_PROVIDER: MapProvider = MAPBOX_TOKEN
  ? "mapbox"
  : GOOGLE_MAPS_API_KEY
    ? "google"
    : "placeholder";
