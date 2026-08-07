"use client";

import { useEffect } from "react";

/**
 * One place that knows whether a full-screen takeover is on screen.
 *
 * Two overlays exist (the menu and the planner) and either can be open, so a
 * boolean would be wrong the moment one closes while the other is still up —
 * hence a counter. It writes `data-overlay="open"` onto the html element rather
 * than into React state because the only consumer is the floating WhatsApp
 * button, which sits in a different subtree: passing this through props would
 * mean threading it up through `page.tsx` and back down, and a CSS attribute
 * selector does the same job without re-rendering anything.
 *
 * It also owns the scroll lock, which each overlay used to set for itself —
 * two components writing `body.style.overflow` independently means whichever
 * one closes last wins, and the other one's cleanup clears a lock that is
 * still needed.
 */
let openCount = 0;

function sync() {
  const root = document.documentElement;
  if (openCount > 0) {
    root.dataset.overlay = "open";
    document.body.style.overflow = "hidden";
  } else {
    delete root.dataset.overlay;
    document.body.style.overflow = "";
  }
}

export function useOverlayLock(open: boolean) {
  useEffect(() => {
    if (!open) return;
    openCount += 1;
    sync();
    return () => {
      openCount = Math.max(0, openCount - 1);
      sync();
    };
  }, [open]);
}
