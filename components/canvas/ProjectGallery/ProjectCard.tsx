"use client";

import { RoundedBox, useCursor } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import type { Project } from "@/types/projects";

// ── Constants ─────────────────────────────────────────────────────────────────

const CARD_W = 1.7;
const CARD_H = 2.2;
const CARD_DEPTH = 0.06;
const TILT_MAX = 0.2; // max rotation in radians (~11.5°)
const SMOOTHING = 9; // frame-rate-independent lerp speed (exp decay)

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  project: Project;
  position: [number, number, number];
  onSelect: (project: Project) => void;
};

export function ProjectCard({ project, position, onSelect }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Lerp targets (updated on pointer events, read inside useFrame)
  const target = useRef({ rotX: 0, rotY: 0, posZ: 0, scale: 1 });

  useCursor(hovered);

  // Frame-rate-independent lerp towards interaction targets
  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;

    // exp-decay factor: same "feel" at 30fps and 144fps
    const k = 1 - Math.exp(-SMOOTHING * delta);

    g.rotation.x += (target.current.rotX - g.rotation.x) * k;
    g.rotation.y += (target.current.rotY - g.rotation.y) * k;

    const baseZ = position[2];
    const currentRelZ = g.position.z - baseZ;
    g.position.z = baseZ + currentRelZ + (target.current.posZ - currentRelZ) * k;

    const sx = g.scale.x;
    const ns = sx + (target.current.scale - sx) * k;
    g.scale.setScalar(ns);
  });

  function handleEnter() {
    setHovered(true);
    target.current.posZ = 0.35;
    target.current.scale = 1.04;
  }

  function handleLeave() {
    setHovered(false);
    target.current.rotX = 0;
    target.current.rotY = 0;
    target.current.posZ = 0;
    target.current.scale = 1;
  }

  function handleMove(e: ThreeEvent<PointerEvent>) {
    if (!hovered || !e.uv) return;
    // UV 0–1 → normalised -0.5–0.5 → apply tilt
    target.current.rotY = (e.uv.x - 0.5) * TILT_MAX * 2;
    target.current.rotX = -(e.uv.y - 0.5) * TILT_MAX * 2;
  }

  const fillColor = new THREE.Color(project.placeholderColor);

  return (
    <group ref={groupRef} position={position}>
      {/* Card body */}
      <RoundedBox
        args={[CARD_W, CARD_H, CARD_DEPTH]}
        radius={0.055}
        smoothness={4}
        castShadow
        receiveShadow
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onPointerMove={handleMove}
        onClick={() => onSelect(project)}
      >
        <meshStandardMaterial
          color={fillColor}
          roughness={0.42}
          metalness={0.06}
        />
      </RoundedBox>

      {/* Hover sheen — thin plane just in front of card face */}
      {hovered && (
        <mesh position={[0, 0, CARD_DEPTH / 2 + 0.002]}>
          <planeGeometry args={[CARD_W - 0.04, CARD_H - 0.04]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.055} />
        </mesh>
      )}
    </group>
  );
}
