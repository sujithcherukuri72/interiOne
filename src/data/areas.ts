import { HYDERABAD_AREAS } from "@/lib/site";

/**
 * One landing page per locality — `/modular-kitchens/<slug>`.
 *
 * Each carries its own note on the housing there, because a page that only
 * swaps the place name is a doorway page and Google treats it as one. Keep the
 * notes about the homes, not about projects we have not done.
 */
const NOTES: Record<(typeof HYDERABAD_AREAS)[number], string> = {
  "Jubilee Hills":
    "Independent houses and large villas, where the kitchen is often a full renovation — old wooden cabinets out, a steel-composite kitchen in, with no termite treatment to repeat every year.",
  "Banjara Hills":
    "A mix of older bungalows and premium apartments. Kitchens here tend to be larger and more open, which suits island and peninsula layouts with a clean, handle-less finish.",
  Madhapur:
    "Our studio is here, so Madhapur homes get the shortest turnaround — see the finishes in person in Kavuri Hills, then have a designer at your apartment the same week.",
  Gachibowli:
    "Mostly gated-community apartments close to the IT corridor. Compact L-shaped and parallel kitchens are common, and a water-proof, swell-free panel matters most around the sink run.",
  Kondapur:
    "Busy apartment blocks and newly handed-over flats. Buyers here usually want the kitchen installed before move-in, which is what the 30-day programme is built around.",
  Kokapet:
    "High-rise gated communities along the Outer Ring Road and the Neopolis layout, many of them new handovers. A bare-shell kitchen is the ideal starting point for a fully planned modular kitchen.",
  Narsingi:
    "Fast-growing apartment and villa communities near the ORR. New homes here get the full layout visit, three costed designs and installation timed to your handover.",
  Manikonda:
    "Dense apartment neighbourhoods with smaller kitchens, where every centimetre of storage counts — tall units, corner solutions and pull-outs make the most of a tight footprint.",
  "Financial District":
    "Premium high-rise apartments for working households. A kitchen that needs no polishing, no termite care and wipes clean in seconds fits the pace of life here.",
  Nanakramguda:
    "Large gated apartment towers next to the Financial District. Straight and L-shaped kitchens with a utility area are the common plan, and both are built in steel composite.",
  Tellapur:
    "Villa communities and new apartment projects on the western edge of the city. Many homes are new, so the kitchen can be designed from the plumbing points up.",
  Miyapur:
    "Established apartments and independent houses. Replacing a swollen, termite-damaged plywood kitchen with a steel-composite one is the most common brief here.",
  Kukatpally:
    "One of Hyderabad's densest residential areas, with older apartments that often need a kitchen replacement rather than a new build — done in 30 days, installed.",
  Secunderabad:
    "Older independent houses and apartments, where humidity and termites have usually already damaged a wooden kitchen. Steel composite has no wood fibre for either to attack.",
  Begumpet:
    "Central apartments and bungalows, close enough to the studio for an easy visit to see the full finish range before choosing.",
  Somajiguda:
    "Compact central apartments where a kitchen has to work hard. Smart storage and a finish that survives daily Indian cooking come first.",
  Attapur:
    "Growing apartment communities along the PVNR Expressway. Families here want durable, easy-clean kitchens at a transparent, costed price.",
  "LB Nagar":
    "Large residential neighbourhoods in east Hyderabad. The designer still visits and measures on site before any design is drawn.",
  Uppal:
    "New apartment projects and independent houses in east Hyderabad, where a water-proof, termite-proof kitchen stays sound for years.",
  Kompally:
    "Villa communities and new apartments in north Hyderabad. Larger kitchens here suit U-shaped and island layouts.",
};

export const slugify = (area: string) =>
  area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const AREAS = HYDERABAD_AREAS.map((name) => ({
  name,
  slug: slugify(name),
  note: NOTES[name],
}));

export const areaPath = (area: string) => `/modular-kitchens/${slugify(area)}`;
