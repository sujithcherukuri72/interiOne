"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query.
 *
 * Used only where a breakpoint changes *what is rendered* rather than how it
 * is styled — an SVG viewBox, a swapped-out label layout. Anything expressible
 * as a Tailwind variant should be, since that costs no JavaScript and is
 * already correct on the server.
 *
 * Built on `useSyncExternalStore` rather than an effect writing state: the
 * match is external state React is reading, not state React owns, and phrasing
 * it that way avoids the extra render an effect would cost on every mount.
 *
 * The server snapshot is always `false`, so callers must treat the wide layout
 * as the default and let the narrow one arrive on hydration.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** The project's `md` breakpoint, phrased as "this is a phone". */
export const COMPACT_QUERY = "(max-width: 767px)";
