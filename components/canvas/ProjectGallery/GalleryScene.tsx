"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import type { Project } from "@/types/projects";
import { CARD_POSITIONS, DEMO_PROJECTS } from "./data";
import { ProjectCard } from "./ProjectCard";

type Props = {
  onSelect: (project: Project) => void;
};

export function GalleryScene({ onSelect }: Props) {
  const { scene } = useThree();

  // Warm near-white fog adds subtle depth to the card grid
  useEffect(() => {
    const fog = new THREE.Fog("#f8f6f2", 10, 24);
    scene.fog = fog;
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return (
    <>
      <PerspectiveCamera makeDefault fov={42} position={[0, 0, 7.5]} near={0.1} far={30} />

      {/* Lighting — no shadow overhead for the interactive gallery */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 8, 6]} intensity={1.1} />
      <directionalLight position={[-4, 2, -3]} intensity={0.25} />

      {/* Project cards */}
      {DEMO_PROJECTS.map((project, i) => {
        const pos = CARD_POSITIONS[i];
        if (pos === undefined) return null;
        return (
          <ProjectCard
            key={project.id}
            project={project}
            position={[pos[0], pos[1], pos[2]]}
            onSelect={onSelect}
          />
        );
      })}
    </>
  );
}
