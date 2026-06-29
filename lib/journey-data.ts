import type { JourneyPhase } from "@/types/journey";

export const JOURNEY_PHASES: JourneyPhase[] = [
  {
    step: "01",
    title: "Initial Briefing",
    subtitle: "Experience Centre Visit",
    dayRange: "Pre-booking",
    detail:
      "Visit our Experience Centre for a full walk-through of finish ranges and layout concepts — or book a ₹2,000 site layout consultation at your home.",
  },
  {
    step: "02",
    title: "Design & Quote",
    subtitle: "3 Custom Concepts",
    dayRange: "Pre-booking",
    detail:
      "Our design team delivers three fully-tailored 3D kitchen concepts at zero cost, matched to your floor plan and lifestyle preferences.",
  },
  {
    step: "03",
    title: "Booking & Measurement",
    subtitle: "Precision Site Alignment",
    dayRange: "Pre-booking",
    detail:
      "A 10% design fee booking initiates your project — followed by a detailed on-site measurement and alignment check by our technical team.",
    payment: "10% booking",
  },
  {
    step: "04",
    title: "Final Design Approval",
    subtitle: "Accessory & Appliance Sign-off",
    dayRange: "Day 0–15",
    detail:
      "Full accessory and appliance docket sign-off with two included design iterations. Every dimension and finish is locked before production begins.",
  },
  {
    step: "05",
    title: "Production",
    subtitle: "Factory Manufacturing",
    dayRange: "Day 0–15",
    detail:
      "A 50% advance collection triggers automated CNC factory production of your bespoke Modula panels — precision-cut to specification.",
    payment: "50% advance",
  },
  {
    step: "06",
    title: "Site Check",
    subtitle: "MEP Readiness Verification",
    dayRange: "Day 16–19",
    detail:
      "Our field engineer visits your site to verify Mechanical, Electrical, and Plumbing (MEP) infrastructure is installation-ready.",
  },
  {
    step: "07",
    title: "Payment & Dispatch",
    subtitle: "Warehouse Dry-Run Assembly",
    dayRange: "Day 20–30",
    detail:
      "Full quality inspection during a complete dry-run assembly at our warehouse — every unit verified before dispatch to your site.",
  },
  {
    step: "08",
    title: "Complete Installation",
    subtitle: "White-Glove Delivery",
    dayRange: "Day 30",
    detail:
      "Remaining 50% collection, dispatch, delivery, and a complete dry-clean installation finish — handed over spotless.",
    payment: "50% final",
  },
];
