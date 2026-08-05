import type { ShuffleProps } from "@/components/ui/Shuffle";

/**
 * The site's shuffle tuning, shared by every call site so the hero and the
 * portfolio headings move identically.
 *
 * This lives in `lib` rather than next to the component on purpose. `Shuffle`
 * is a `"use client"` module, and on the server *every* export of such a module
 * is replaced by an opaque client reference — so a server component like `Hero`
 * spreading a preset imported from there gets nothing, silently, and the
 * component renders with all its defaults. A plain module has no such barrier.
 *
 * `maxDelay` is the one value not in the brief but required by it: in `random`
 * mode the component ignores `stagger` entirely and scatters the strips across
 * `Math.random() * maxDelay`. Left at its default of 0 every letter would fire
 * on the same frame — no shuffle at all. `stagger` is kept for the `evenodd`
 * path in case the mode is switched back.
 */
export const SHUFFLE_PRESET = {
  shuffleDirection: "down",
  duration: 1.25,
  ease: "power3.out",
  animationMode: "random",
  maxDelay: 0.6,
  stagger: 0.05,
  shuffleTimes: 2,
  loop: true,
  loopDelay: 4,
  triggerOnce: true,
  triggerOnHover: false,
  respectReducedMotion: true,
} as const satisfies Partial<ShuffleProps>;

/**
 * The same motion for small interactive labels: no loop, and nothing happens
 * until the pointer arrives. One run per hover. Headings turned off
 * `triggerOnHover` above, so this re-enables it just for these.
 */
export const SHUFFLE_HOVER_PRESET = {
  ...SHUFFLE_PRESET,
  loop: false,
  loopDelay: 0,
  triggerOnHover: true,
  playOnEnter: false,
} as const satisfies Partial<ShuffleProps>;
