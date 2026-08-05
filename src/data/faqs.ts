/** The questions a Hyderabad buyer actually asks, in the order they ask them. */
export const FAQS = [
  {
    id: "cost",
    question: "What does a full kitchen cost?",
    answer:
      "Most interiOne kitchens land between ₹3.5 and ₹9 lakh, depending on run length, finish range and appliances. The site visit produces three costed plans across that spread, so you are choosing between real numbers rather than a starting price.",
    tag: "Pricing",
  },
  {
    id: "visit",
    question: "What happens on the site visit?",
    answer:
      "A designer measures the room, checks the plumbing and electrical positions, and talks through how you actually cook. Three costed concepts follow within a day. The visit fee is adjusted in full against your final order.",
    tag: "Process",
  },
  {
    id: "steel",
    question: "Why steel instead of plywood?",
    answer:
      "Plywood and MDF are organic — termites eat them, moisture swells them, and both fail first at the edges. JSW Xteel® has no organic fibre at all, so there is nothing to feed on and nothing to absorb water. It also carries a UL 94 V-0 fire rating and off-gasses no formaldehyde.",
    tag: "Material",
  },
  {
    id: "timeline",
    question: "Is thirty days realistic?",
    answer:
      "It is thirty days from design sign-off, not from first enquiry. Panels are cut to your measurements in the factory and arrive ready to install, so site work is assembly rather than fabrication. Delays almost always come from civil work that is not finished, which we flag at the survey.",
    tag: "Timeline",
  },
  {
    id: "warranty",
    question: "What is covered by the warranty?",
    answer:
      "Ten years on the steel carcass and shutters against warping, swelling and termite damage. Hardware carries its manufacturer's warranty, typically five to ten years. Finishes are covered against delamination for the same ten years.",
    tag: "Warranty",
  },
  {
    id: "existing",
    question: "Can you work with my existing civil work?",
    answer:
      "Usually, yes. Counter height, plumbing chases and window positions are all worked around rather than rebuilt. If something genuinely needs to move, you will hear it at the survey with a cost attached, not halfway through installation.",
    tag: "Site",
  },
  {
    id: "finishes",
    question: "Can I see the finishes before deciding?",
    answer:
      "Every finish in the catalogue is on a full-size panel at the Jubilee Hills studio. Screens flatten sheen and grain, and sheen is what you live with — it is worth the trip.",
    tag: "Finishes",
  },
  {
    id: "service",
    question: "What happens after handover?",
    answer:
      "A service check at ninety days, then annual hardware alignment on request. Replacement shutters are cut from the same coil reference, so a panel replaced in year six matches the ones fitted on day thirty.",
    tag: "Service",
  },
] as const;
