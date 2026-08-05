import { cn } from "@/lib/cn";

/**
 * The brand mark, drawn once here so every placement (bar, menu, footer)
 * stays identical. Both halves take their colour from `currentColor`, so a
 * dark panel and the cream page use the same markup.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={cn("h-full w-auto", className)}
    >
      {/* The sail — a tall blade whose inner edge falls away in one curve. */}
      <path
        d="M20 94 L20 44 C20 22 40 6 66 6 L66 12 C44 16 32 30 32 50 L32 94 Z"
        fill="currentColor"
      />
      {/* The upright, cut back at the foot so the two forms read as one. */}
      <path
        d="M74 6 L74 94 L62 94 L62 40 C62 22 68 12 74 6 Z"
        fill="currentColor"
      />
      {/* The counterweight at the base. */}
      <path d="M40 94 L40 84 C46 84 50 88 50 94 Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Wordmark set the way the identity sheet sets it: a wide-tracked serif in
 * caps, with the two O's interlocked into the logo's knot.
 *
 * The knot is two O glyphs pulled into each other, so it stays live text in
 * the brand face rather than becoming an image. Only the first O is part of
 * the accessible name — the second is decoration, so the word still reads
 * "interiOne" to a screen reader, not "interioone".
 */
export function LogoWord({
  className,
  tracking = "0.2em",
}: {
  className?: string;
  /** Set inline so callers can tighten it at display sizes and still win. */
  tracking?: string;
}) {
  return (
    <span
      className={cn("font-serif leading-none uppercase", className)}
      style={{ letterSpacing: tracking }}
    >
      <span aria-hidden="true">Interi</span>
      <span aria-hidden="true" className="inline-flex">
        <span>O</span>
        {/* Half a counter of overlap, held constant as tracking changes. */}
        <span style={{ marginLeft: `calc(-0.5em - ${tracking})` }}>O</span>
      </span>
      <span aria-hidden="true">Ne</span>
      <span className="sr-only">interiOne</span>
    </span>
  );
}

/**
 * Mark + wordmark lockup. `tagline` adds the "Design · Craft · Elevate" rule
 * from the identity sheet — used where the logo has room to breathe.
 */
export default function Logo({
  className,
  tagline = false,
}: {
  className?: string;
  tagline?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-[1.4em]" />
      <span className="inline-flex flex-col items-start gap-[0.35em]">
        <LogoWord className="text-[1em]" />
        {tagline && (
          <span className="text-[0.32em] tracking-[0.42em] uppercase opacity-55">
            Design · Craft · Elevate
          </span>
        )}
      </span>
    </span>
  );
}
