"use client";

import { useRef } from "react";

import { cn } from "@/lib/cn";
import { LogoWord } from "./Logo";

/**
 * The footer wordmark, gilded under the cursor.
 *
 * Two copies of the same letterforms stacked exactly: a pale one that is always
 * there, and a gold one masked to a disc that follows the pointer. Only the
 * letters near the cursor light up, so the mark reads as brushed metal catching
 * a light being moved across it rather than as a hover state.
 *
 * The pointer position is written to CSS custom properties on the wrapper
 * rather than held in React state. This fires on every pointer move across a
 * very large element, and re-rendering a component tree at that rate to move a
 * gradient is how a page starts dropping frames — the browser can move a
 * masked gradient on the compositor for free.
 *
 * `--on` fades the whole gold layer, so the light arrives and leaves rather
 * than snapping, and a touch that lands and lifts does not leave it stuck lit.
 */
export default function GildedWordmark({
  className,
  tracking = "0.02em",
}: {
  className?: string;
  tracking?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - box.left}px`);
    el.style.setProperty("--my", `${event.clientY - box.top}px`);
    el.style.setProperty("--on", "1");
  };

  const release = () => ref.current?.style.setProperty("--on", "0");

  return (
    <div
      ref={ref}
      onPointerMove={track}
      onPointerEnter={track}
      onPointerLeave={release}
      onPointerCancel={release}
      className="gilded relative isolate"
    >
      {/* The mark at rest. */}
      <LogoWord tracking={tracking} className={cn("block text-foreground/15", className)} />

      {/* The lit copy, masked to the cursor. `inset-0` and identical type
          settings are what keep the two in register — any difference in
          tracking or weight shows immediately as a ghosted edge. */}
      <span
        aria-hidden="true"
        className="gilded-layer pointer-events-none absolute inset-0"
      >
        <LogoWord
          tracking={tracking}
          className={cn("gilded-text block", className)}
        />
      </span>

      {/* A soft bloom over the letters, for the glassy part of "golden and
          glassy" — screen-blended so it lifts the gold without washing the
          cream page behind it. */}
      <span
        aria-hidden="true"
        className="gilded-bloom pointer-events-none absolute inset-0"
      />
    </div>
  );
}
