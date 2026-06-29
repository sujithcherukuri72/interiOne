"use client";

/**
 * Client-component wrapper required by Next.js 16 App Router:
 * `ssr: false` is only valid inside a Client Component.
 * This file owns all heavy dynamic imports and re-exports them as
 * drop-in components for use in the server-rendered page.tsx.
 */

import dynamic from "next/dynamic";

function SectionSkeleton() {
  return (
    <div className="py-24 px-6 lg:px-10 max-w-7xl mx-auto" aria-hidden>
      <div className="h-8 w-48 rounded-lg bg-foreground/6 mb-4 animate-pulse" />
      <div className="h-5 w-72 rounded-lg bg-foreground/4 animate-pulse" />
    </div>
  );
}

function GallerySkeleton() {
  return (
    <div className="h-[70vh] w-full bg-foreground/4 animate-pulse" aria-hidden />
  );
}

export const PaletteTapestryDeferred = dynamic(
  () => import("./PaletteTapestry").then((m) => ({ default: m.PaletteTapestry })),
  { ssr: false, loading: () => <SectionSkeleton /> }
);

export const PerformanceDashboardDeferred = dynamic(
  () => import("./PerformanceDashboard").then((m) => ({ default: m.PerformanceDashboard })),
  { ssr: false, loading: () => <SectionSkeleton /> }
);

export const ClientJourneyTimelineDeferred = dynamic(
  () => import("./ClientJourneyTimeline").then((m) => ({ default: m.ClientJourneyTimeline })),
  { ssr: false, loading: () => <SectionSkeleton /> }
);

export const ProjectGalleryDeferred = dynamic(
  () => import("@/components/canvas/ProjectGallery").then((m) => ({ default: m.ProjectGallery })),
  { ssr: false, loading: () => <GallerySkeleton /> }
);
