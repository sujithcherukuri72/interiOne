import { BRAND } from "@/data/brand";

/**
 * Canonical facts about the site, in one place.
 *
 * Metadata, structured data, the sitemap and the OG card all read from here,
 * so the studio address exists exactly once and cannot drift between the
 * footer, the JSON-LD and Google Business Profile.
 */

/** Set `NEXT_PUBLIC_SITE_URL` per environment; previews must not claim prod URLs. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.interione.in"
).replace(/\/$/, "");

/**
 * The flagship studio — the entity every local signal points at.
 *
 * `latitude`/`longitude` are the Kavuri Hills, Madhapur block. Replace them
 * with the exact pin from the Google Business Profile before launch: Maps
 * matches a listing to a site partly on how well these agree, and "close
 * enough" is measurably worse than exact.
 */
export const STUDIO = {
  streetAddress: "1st Floor, Plot No. 33, Kavuri Hills, Madhapur",
  locality: "Hyderabad",
  region: "Telangana",
  regionCode: "IN-TG",
  postalCode: "500033",
  country: "IN",
  latitude: 17.4326,
  longitude: 78.3921,
  phone: BRAND.phone,
  email: BRAND.email,
  /** Schema.org day tokens for Mon–Sun 10:00–20:00, as the showroom data says. */
  opens: "10:00",
  closes: "20:00",
} as const;

export const SITE = {
  name: BRAND.name,
  legalName: "interiOne Modular Interiors",
  url: SITE_URL,
  locale: "en_IN",
  /** Kept under ~60 characters so it survives the SERP without a tail cut. */
  title: "Modular Kitchens in Hyderabad | interiOne",
  titleTemplate: "%s | interiOne Hyderabad",
  description:
    "Steel-composite modular kitchens in Hyderabad, built on JSW Xteel® — termite proof, fire safe and completely plywood free. Free site visit and three costed designs from the Madhapur studio. Installed in 30 days.",
  /**
   * Short share blurb. The meta description above is written for the SERP;
   * this one is written for a WhatsApp preview, which is where most of this
   * traffic actually shares links.
   */
  shareDescription:
    "Termite-proof steel kitchens, designed in Madhapur and installed in 30 days.",
} as const;

/**
 * The service area, as Hyderabad actually names itself.
 *
 * These are the phrases people type — "modular kitchen Kondapur", not
 * "modular kitchen Rangareddy district". They feed the `areaServed` block in
 * the LocalBusiness graph and the visible list in the showrooms section; the
 * two agreeing is the point, since an area claimed in markup but nowhere on
 * the page is a thin signal.
 */
export const HYDERABAD_AREAS = [
  "Jubilee Hills",
  "Banjara Hills",
  "Madhapur",
  "Gachibowli",
  "Kondapur",
  "Kokapet",
  "Narsingi",
  "Manikonda",
  "Financial District",
  "Nanakramguda",
  "Tellapur",
  "Miyapur",
  "Kukatpally",
  "Secunderabad",
  "Begumpet",
  "Somajiguda",
  "Attapur",
  "LB Nagar",
  "Uppal",
  "Kompally",
] as const;
