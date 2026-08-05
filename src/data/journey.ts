/** The 8-step delivery programme, Day 0 to Day 30. */
export const JOURNEY = [
  {
    step: 1,
    day: "Day 0",
    title: "Briefing & Layout Visit",
    description:
      "A designer captures your site. The visit fee is adjusted against your order.",
    milestone: "Brief",
  },
  {
    step: 2,
    day: "Day 1",
    title: "3 Free Design Concepts",
    description:
      "Three distinct layouts — rendered and costed, not three colourways of one.",
    milestone: "Concepts",
  },
  {
    step: 3,
    day: "Day 3",
    title: "Site Measurement & 10% Booking",
    description:
      "Every wall and service point measured. 10% locks your production slot.",
    milestone: "Booking",
  },
  {
    step: 4,
    day: "Day 5",
    title: "Final Design Docket Approval",
    description: "One signed docket. Nothing enters production unapproved.",
    milestone: "Sign-off",
  },
  {
    step: 5,
    day: "Days 0–15",
    title: "Production & 50% Advance",
    description:
      "Xteel panels cut, formed, banded and finished to your docket.",
    milestone: "Production",
  },
  {
    step: 6,
    day: "Days 16–19",
    title: "Site MEP Validation",
    description: "Electrical, plumbing and gas checked before anything ships.",
    milestone: "MEP",
  },
  {
    step: 7,
    day: "Days 20–30",
    title: "Warehouse Setup & Quality Check",
    description:
      "Dry-assembled and inspected here, so defects never reach your home.",
    milestone: "QC",
  },
  {
    step: 8,
    day: "Day 30",
    title: "Delivery & Installation",
    description: "One crew, one mobilisation, a working kitchen the same day.",
    milestone: "Handover",
  },
] as const;
