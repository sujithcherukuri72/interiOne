import { HeroSection } from "@/components/sections/HeroSection";
import {
  ClientJourneyTimelineDeferred,
  PerformanceDashboardDeferred,
  PaletteTapestryDeferred,
  ProjectGalleryDeferred,
} from "@/components/sections/DeferredSections";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProjectGalleryDeferred />
      <PaletteTapestryDeferred />
      <PerformanceDashboardDeferred />
      <ClientJourneyTimelineDeferred />
    </>
  );
}
