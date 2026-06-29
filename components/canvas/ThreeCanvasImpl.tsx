"use client";

import { PerspectiveCamera, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

// Exported so ThreeCanvas.tsx can derive its type signature
export type ThreeCanvasProps = {
  /** Three.js scene content */
  children: React.ReactNode;
  /** Class applied to the outer wrapper div */
  className?: string;
  /** Inline style for the outer wrapper div */
  style?: React.CSSProperties;
  /** Vertical field-of-view in degrees. Default: 45 */
  fov?: number;
  /** Camera world-space position. Default: [0, 0, 6] */
  cameraPosition?: [number, number, number];
  /** Enable shadow casting + soft-shadow GLSL patch. Default: true */
  shadows?: boolean;
  /**
   * R3F render loop mode.
   * "demand" — renders only when invalidate() is called (default, best for static scenes).
   * "always" — renders every RAF tick (use for interactive/animated scenes).
   * "never"  — pauses all rendering.
   */
  frameloop?: "demand" | "always" | "never";
};

/**
 * Actual R3F implementation — loaded lazily via ThreeCanvas.tsx.
 * Never import this file directly from page/section components.
 */
export function ThreeCanvasInner({
  children,
  className,
  style,
  fov = 45,
  cameraPosition = [0, 0, 6],
  shadows = true,
  frameloop = "demand",
}: ThreeCanvasProps) {
  return (
    <div className={className} style={style}>
      <Canvas
        frameloop={frameloop}
        shadows={shadows ? "soft" : false}
        // Clamp DPR: retina looks sharp, 3× devices don't waste fill-rate
        dpr={[1, 2]}
        // Full-bleed inside the wrapper
        style={{ width: "100%", height: "100%", display: "block" }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
      >
        {/* ── Camera ── */}
        <PerspectiveCamera
          makeDefault
          fov={fov}
          position={cameraPosition}
          near={0.1}
          far={100}
        />

        {/* ── Lighting ── */}
        <ambientLight intensity={0.35} />

        {/* Key light — warm, from upper-right, casts soft shadows */}
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.2}
          castShadow={shadows}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
        />

        {/* Subtle back fill to soften the shadow side */}
        <directionalLight position={[-3, 2, -4]} intensity={0.28} />

        {/* PCSS soft-shadow shader patch — only when shadows are enabled */}
        {shadows && <SoftShadows size={25} samples={16} />}

        {/* User scene — wrapped in Suspense for async asset loading */}
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
