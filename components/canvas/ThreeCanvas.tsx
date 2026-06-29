"use client";

/**
 * SSR-safe ThreeCanvas wrapper.
 *
 * Why two files?
 * Next.js App Router runs "use client" components on the server during SSR.
 * Three.js and WebGL APIs are browser-only, so we must prevent the
 * ThreeCanvasInner module from executing server-side.
 * dynamic({ ssr: false }) achieves that — but can only be called from
 * a client component (this file).
 */

import dynamic from "next/dynamic";
import type { ThreeCanvasProps } from "./ThreeCanvasImpl";

const ThreeCanvasInner = dynamic<ThreeCanvasProps>(
  () =>
    import("./ThreeCanvasImpl").then((mod) => ({
      default: mod.ThreeCanvasInner,
    })),
  {
    ssr: false,
    // Render nothing while the JS bundle loads — callers control the
    // placeholder via the wrapping container's size/background.
    loading: () => null,
  }
);

export type { ThreeCanvasProps };

export function ThreeCanvas(props: ThreeCanvasProps) {
  return <ThreeCanvasInner {...props} />;
}
