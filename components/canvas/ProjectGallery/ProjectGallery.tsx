"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { Project } from "@/types/projects";
import { ProjectOverlay } from "./ProjectOverlay";

// ── Lazy-load the heavy R3F canvas — keeps initial bundle slim ─────────────────

const GalleryCanvas = dynamic(
  () => import("./GalleryCanvas").then((m) => ({ default: m.GalleryCanvas })),
  { ssr: false, loading: () => <GalleryPlaceholder /> }
);

// ── Component ─────────────────────────────────────────────────────────────────

export function ProjectGallery() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section
      aria-label="Project gallery"
      className="relative w-full h-[640px] lg:h-[720px]"
    >
      {/* 3D canvas fills the section */}
      <GalleryCanvas onSelect={setSelected} />

      {/* Framer Motion overlay — mounts/unmounts via AnimatePresence inside */}
      <ProjectOverlay project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

// ── Placeholder shown while GalleryCanvas bundle loads ────────────────────────

function GalleryPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-[10px] font-medium tracking-[0.28em] uppercase text-foreground/20 animate-pulse">
        Loading gallery…
      </span>
    </div>
  );
}
