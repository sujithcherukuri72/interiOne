"use client";

/**
 * Standalone R3F canvas for the interactive project gallery.
 *
 * Intentionally does NOT use ThreeCanvas — the gallery owns its own
 * camera and lighting to avoid conflicts, and uses frameloop="always"
 * since every pointer move triggers a repaint.
 */

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import type { Project } from "@/types/projects";
import { GalleryScene } from "./GalleryScene";

type Props = {
  onSelect: (project: Project) => void;
};

export function GalleryCanvas({ onSelect }: Props) {
  return (
    <Canvas
      frameloop="always"
      shadows={false}
      // Slightly lower DPR cap vs base canvas — saves fill-rate on the
      // interactive gallery where dozens of meshes move every frame
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%" }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
    >
      <Suspense fallback={null}>
        <GalleryScene onSelect={onSelect} />
      </Suspense>
    </Canvas>
  );
}
