"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Map as MapboxMap } from "mapbox-gl";
import { Crosshair, Minus, Plus } from "lucide-react";

import "mapbox-gl/dist/mapbox-gl.css";

import {
  GOOGLE_MAPS_API_KEY,
  MAPBOX_STYLE,
  MAPBOX_TOKEN,
  MAP_COORDS_LABEL,
  MAP_PROVIDER,
  MAP_VIEW,
} from "@/lib/map";
import {
  GOOGLE_MAP_STYLE,
  loadGoogleMaps,
  onGoogleMapsAuthFailure,
} from "@/lib/google-maps";
import { SHOWROOM } from "@/data/showrooms";

const LNG_LAT: [number, number] = [MAP_VIEW.longitude, MAP_VIEW.latitude];
const LAT_LNG = { lat: MAP_VIEW.latitude, lng: MAP_VIEW.longitude };

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * The pin, built in plain DOM because both map libraries want an element, not
 * a subtree React owns. A stem down to the ground point and a coral head that
 * pulses — the only saturated thing on the block. Styled in globals.css, so
 * the two providers cannot drift apart visually.
 */
function buildPin(label: string) {
  const el = document.createElement("div");
  el.className = "studio-pin";
  el.innerHTML = `
    <span class="studio-pin__ring" aria-hidden="true"></span>
    <span class="studio-pin__dot" aria-hidden="true"></span>
    <span class="studio-pin__stem" aria-hidden="true"></span>
    <span class="studio-pin__label">${label}</span>
  `;
  return el;
}

/**
 * Runs `init` once the element is nearly on screen.
 *
 * Neither map library is small, and this section sits a long way down the
 * page — fetching either one at load would be paying for a map most visitors
 * scroll past.
 */
function useLazyInit(
  ref: React.RefObject<HTMLElement | null>,
  init: () => void | Promise<void>,
  enabled: boolean
) {
  // Kept in a ref, and updated in an effect rather than during render, so the
  // observer below is armed once and never re-armed just because the caller
  // passed a new closure.
  const initRef = useRef(init);
  useEffect(() => {
    initRef.current = init;
  });

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        void initRef.current();
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, enabled]);
}

/**
 * The Jubilee Hills studio, on a live map.
 *
 * Mapbox GL renders it when a Mapbox token is configured, the Google Maps
 * JavaScript API when a Google key is, and a drawn schematic when neither is —
 * so the section is presentable before any account exists and never shows a
 * provider's own error tile. See `lib/map.ts` for the switch.
 */
export default function StudioMap({ className = "" }: { className?: string }) {
  if (MAP_PROVIDER === "mapbox") return <MapboxCanvas className={className} />;
  if (MAP_PROVIDER === "google") return <GoogleCanvas className={className} />;
  return <MapPlaceholder className={className} />;
}

/* ── Mapbox GL ────────────────────────────────────────────────────────────── */

function MapboxCanvas({ className }: { className: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [ready, setReady] = useState(false);

  useLazyInit(
    containerRef,
    async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      const container = containerRef.current;
      if (!container || mapRef.current) return;

      mapboxgl.accessToken = MAPBOX_TOKEN;
      const reduced = prefersReducedMotion();

      const map = new mapboxgl.Map({
        container,
        style: MAPBOX_STYLE,
        center: LNG_LAT,
        // The camera opens wide and settles onto the pin, so the first thing
        // the reader sees is the city and the last is the street.
        zoom: reduced ? MAP_VIEW.zoom : MAP_VIEW.introZoom,
        pitch: MAP_VIEW.pitch,
        bearing: MAP_VIEW.bearing,
        // Two fingers on touch, ctrl/⌘+wheel on a trackpad. Without this the
        // map swallows the page scroll the moment a thumb lands on it, which
        // on a phone reads as the page having frozen.
        cooperativeGestures: true,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
      });

      mapRef.current = map;
      map.addControl(
        new mapboxgl.AttributionControl({ compact: true }),
        "bottom-right"
      );
      map.touchZoomRotate.disableRotation();

      new mapboxgl.Marker({ element: buildPin(SHOWROOM.name), anchor: "bottom" })
        .setLngLat(LNG_LAT)
        .addTo(map);

      map.on("load", () => {
        setReady(true);
        if (!reduced) {
          map.flyTo({ zoom: MAP_VIEW.zoom, duration: 2600, essential: true });
        }
      });
    },
    true
  );

  useEffect(
    () => () => {
      mapRef.current?.remove();
      mapRef.current = null;
    },
    []
  );

  const zoom = useCallback((delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({ zoom: map.getZoom() + delta, duration: 400 });
  }, []);

  const recenter = useCallback(() => {
    mapRef.current?.easeTo({
      center: LNG_LAT,
      zoom: MAP_VIEW.zoom,
      pitch: MAP_VIEW.pitch,
      bearing: MAP_VIEW.bearing,
      duration: 900,
    });
  }, []);

  return (
    <MapFrame
      className={`studio-map ${className}`}
      ready={ready}
      onZoom={zoom}
      onRecenter={recenter}
    >
      <div ref={containerRef} className="absolute inset-0" />
    </MapFrame>
  );
}

/* ── Google Maps JavaScript API ───────────────────────────────────────────── */

function GoogleCanvas({ className }: { className: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // A bad key, a disabled API or an unpaid bill all arrive here rather than as
  // a load error — and Google's own response is to grey the tiles out and
  // stamp them, which is not something to show a visitor.
  useEffect(() => onGoogleMapsAuthFailure(() => setFailed(true)), []);

  useLazyInit(
    containerRef,
    async () => {
      const container = containerRef.current;
      if (!container || mapRef.current) return;

      let maps: typeof google.maps;
      try {
        maps = await loadGoogleMaps(GOOGLE_MAPS_API_KEY);
      } catch {
        setFailed(true);
        return;
      }
      if (!containerRef.current) return;

      const reduced = prefersReducedMotion();

      const map = new maps.Map(container, {
        center: LAT_LNG,
        zoom: reduced ? Math.round(MAP_VIEW.zoom) : Math.round(MAP_VIEW.introZoom),
        styles: GOOGLE_MAP_STYLE,
        disableDefaultUI: true,
        // The page keeps the scroll gesture; the map takes two fingers or
        // ctrl+wheel, same bargain as the Mapbox path.
        gestureHandling: "cooperative",
        clickableIcons: false,
        // Our own controls are drawn over the frame in the site's own style.
        zoomControl: false,
      });

      mapRef.current = map;

      /* The same pin element the Mapbox path uses, positioned by hand. An
         overlay rather than a `Marker` because a marker takes an image, and
         this pin is DOM: it carries the label and the pulse with it. */
      class StudioPin extends maps.OverlayView {
        private el: HTMLElement | null = null;

        onAdd() {
          this.el = buildPin(SHOWROOM.name);
          this.el.style.position = "absolute";
          this.getPanes()?.floatPane.appendChild(this.el);
        }

        draw() {
          const point = this.getProjection()?.fromLatLngToDivPixel(
            new maps.LatLng(LAT_LNG)
          );
          if (!point || !this.el) return;
          // The pin's ground point is the foot of its stem, hence the offset
          // by the element's own height rather than half of it.
          this.el.style.left = `${point.x}px`;
          this.el.style.top = `${point.y - this.el.offsetHeight}px`;
        }

        onRemove() {
          this.el?.remove();
          this.el = null;
        }
      }

      const pin = new StudioPin();
      pin.setMap(map);

      maps.event.addListenerOnce(map, "idle", () => {
        setReady(true);
        if (!reduced) {
          // Google has no `flyTo`; stepping the zoom in gives the same "settle
          // onto the address" reading without a jump cut.
          window.setTimeout(() => map.setZoom(Math.round(MAP_VIEW.zoom)), 400);
        }
      });
    },
    true
  );

  const zoom = useCallback((delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    map.setZoom((map.getZoom() ?? MAP_VIEW.zoom) + delta);
  }, []);

  const recenter = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    map.panTo(LAT_LNG);
    map.setZoom(Math.round(MAP_VIEW.zoom));
  }, []);

  if (failed) {
    return (
      <MapPlaceholder
        className={className}
        note="Google Maps rejected the key — check the referrer restriction and that the Maps JavaScript API is enabled"
      />
    );
  }

  return (
    <MapFrame
      className={`studio-map studio-map--google ${className}`}
      ready={ready}
      onZoom={zoom}
      onRecenter={recenter}
    >
      <div ref={containerRef} className="absolute inset-0" />
    </MapFrame>
  );
}

/* ── Shared chrome ────────────────────────────────────────────────────────── */

/**
 * Everything that sits over the tiles, whoever drew them: the hold-over cover
 * until the first frame paints, the zoom controls and the coordinate line.
 */
function MapFrame({
  className,
  ready,
  onZoom,
  onRecenter,
  children,
}: {
  className: string;
  ready: boolean;
  onZoom: (delta: number) => void;
  onRecenter: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden bg-line ${className}`}>
      {children}

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-line transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />

      <div className="absolute top-4 right-4 flex flex-col gap-px overflow-hidden rounded-full border border-foreground/15 bg-background/80 backdrop-blur-sm">
        <MapButton label="Zoom in" onClick={() => onZoom(1)}>
          <Plus size={15} strokeWidth={1.75} />
        </MapButton>
        <MapButton label="Zoom out" onClick={() => onZoom(-1)}>
          <Minus size={15} strokeWidth={1.75} />
        </MapButton>
        <MapButton label="Recentre on the studio" onClick={onRecenter}>
          <Crosshair size={15} strokeWidth={1.75} />
        </MapButton>
      </div>

      <span className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.16em] text-foreground/45 uppercase">
        {MAP_COORDS_LABEL}
      </span>
    </div>
  );
}

function MapButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="focus-ring flex h-9 w-9 items-center justify-center text-foreground/70 transition-colors duration-300 hover:bg-foreground hover:text-background"
    >
      {children}
    </button>
  );
}

/**
 * No usable key, so the block is drawn rather than fetched — the same
 * shop-drawing language as the exploded panel, holding the exact space the live
 * map will take. Supplying a key replaces this with tiles and nothing moves.
 */
function MapPlaceholder({
  className = "",
  note = "Map key pending — see .env.example",
}: {
  className?: string;
  note?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-line ${className}`}>
      <svg
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={`Map placeholder for ${SHOWROOM.name}, ${SHOWROOM.address}, ${SHOWROOM.city}`}
      >
        <defs>
          <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M40 0H0v40"
              fill="none"
              stroke="var(--foreground)"
              strokeWidth="1"
              opacity="0.07"
            />
          </pattern>
        </defs>

        <rect width="800" height="500" fill="var(--surface)" />
        <rect width="800" height="500" fill="url(#map-grid)" />

        {/* Two arterials and the road the studio sits on. */}
        <path
          d="M-20 380 L300 300 L560 330 L820 250"
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="14"
          opacity="0.08"
        />
        <path
          d="M180 -20 L260 220 L300 300 L340 520"
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="10"
          opacity="0.08"
        />
        <path
          d="M300 300 L470 214"
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="6"
          opacity="0.14"
          strokeDasharray="3 7"
        />

        {/* Crosshair on the studio. */}
        <g transform="translate(470 214)">
          <circle r="46" fill="none" stroke="var(--coral)" strokeWidth="1" opacity="0.35" />
          <line x1="-62" y1="0" x2="-54" y2="0" stroke="var(--coral)" strokeWidth="1" />
          <line x1="54" y1="0" x2="62" y2="0" stroke="var(--coral)" strokeWidth="1" />
          <line x1="0" y1="-62" x2="0" y2="-54" stroke="var(--coral)" strokeWidth="1" />
          <line x1="0" y1="54" x2="0" y2="62" stroke="var(--coral)" strokeWidth="1" />
          <circle r="6" fill="var(--coral)" />
        </g>
      </svg>

      <span className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.16em] text-foreground/45 uppercase">
        {MAP_COORDS_LABEL}
      </span>

      {/* A note for whoever is running the site, never for a visitor. */}
      {process.env.NODE_ENV !== "production" && (
        <span className="absolute top-4 left-4 max-w-[22rem] rounded-2xl border border-foreground/15 bg-background/80 px-3 py-1.5 font-mono text-[10px] leading-[1.5] tracking-[0.14em] text-foreground/50 uppercase backdrop-blur-sm">
          {note}
        </span>
      )}
    </div>
  );
}
