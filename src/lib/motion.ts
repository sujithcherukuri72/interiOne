/** Shared easing curve — the slow-out expo everything on the site decelerates on. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The shorter ease-out used for interface chrome — toggles, outlines, the menu
 * takeover. Gentler than EASE, so small movements do not feel elastic.
 */
export const EASE_UI = [0.25, 0.46, 0.45, 0.94] as const;
