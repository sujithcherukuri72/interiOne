/**
 * Stand-in photography until the property shoots are delivered.
 *
 * picsum.photos with a stable `seed` returns the same image every request, so
 * layout stays deterministic between dev reloads and builds. Deleting this file
 * and the `remotePatterns` entry in next.config.ts is the last step of the
 * swap to real images.
 */
export const placeholder = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;
