/**
 * Loader for the Google Maps JavaScript API.
 *
 * One script tag for the whole page, however many components ask for it, and a
 * single promise everyone waits on. Google's loader has no error callback worth
 * the name — a bad key, a disabled API or a billing problem all surface through
 * the global `gm_authFailure` hook long after `onload` has already fired — so
 * that hook is wired here and turned into a rejection the caller can render a
 * fallback for.
 */

const CALLBACK = "__interiOneMapsReady";

declare global {
  interface Window {
    [CALLBACK]?: () => void;
    gm_authFailure?: () => void;
  }
}

let loader: Promise<typeof google.maps> | null = null;

/** Set by `gm_authFailure`; read by callers that mounted before it fired. */
let authFailed = false;
const authListeners = new Set<() => void>();

export function onGoogleMapsAuthFailure(listener: () => void) {
  if (authFailed) {
    listener();
    return () => {};
  }
  authListeners.add(listener);
  return () => authListeners.delete(listener);
}

export function loadGoogleMaps(apiKey: string) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser"));
  }
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (loader) return loader;

  window.gm_authFailure = () => {
    authFailed = true;
    authListeners.forEach((listener) => listener());
  };

  loader = new Promise<typeof google.maps>((resolve, reject) => {
    window[CALLBACK] = () => resolve(window.google.maps);

    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: apiKey,
      v: "weekly",
      loading: "async",
      callback: CALLBACK,
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    script.onerror = () => {
      // Let a later mount try again — this is usually the network, not the key.
      loader = null;
      reject(new Error("Google Maps script failed to load"));
    };
    document.head.appendChild(script);
  });

  return loader;
}

/**
 * The basemap, in ink — the site's dark panel colour with warm roads.
 *
 * Hand-written rather than cloud-styled on purpose: a `mapId` moves styling
 * into the Google console, which means the map stops matching the page the
 * moment someone edits it there. Labels are thinned aggressively — the point of
 * this map is one address, not a directory of everything around it.
 */
export const GOOGLE_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1a1817" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8c8579" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#141211" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#2e2a27" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "landscape.man_made", elementType: "geometry.fill", stylers: [{ color: "#211e1c" }] },
  { featureType: "poi", elementType: "labels.text", stylers: [{ visibility: "off" }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#232720" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#3a3431" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ visibility: "off" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#4a3f39" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#865b49" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#a79c8e" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1a22" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4d5f6b" }] },
];
