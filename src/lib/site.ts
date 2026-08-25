import { BRAND } from "@/data/brand";

/**
 * Canonical facts about the site, in one place.
 *
 * Metadata, structured data, the sitemap and the OG card all read from here,
 * so the studio address exists exactly once and cannot drift between the
 * footer, the JSON-LD and Google Business Profile.
 */

/**
 * The origin this deployment calls itself, in falling order of authority:
 *
 *   1. `NEXT_PUBLIC_SITE_URL` — set this once the real domain is live.
 *   2. Vercel's own domain for the deployment, which it injects for us.
 *   3. The intended production domain.
 *
 * The middle step is not a nicety. Canonical tags, the sitemap, `robots.txt`
 * and every `@id` in the JSON-LD graph are built from this, and a deployment
 * that canonicalises to a domain which does not resolve yet is a deployment
 * Google will not index at all.
 */
const VERCEL_HOST =
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.NEXT_PUBLIC_VERCEL_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (VERCEL_HOST ? `https://${VERCEL_HOST}` : "https://www.interione.in")
).replace(/\/$/, "");

/**
 * Preview builds must never be indexed — a second crawlable copy of the whole
 * site competes with the real one for the same Hyderabad queries.
 *
 * Server-read only: `VERCEL_ENV` is unprefixed, so it is empty in the browser.
 * Only `robots.ts` and the metadata block in `app/layout.tsx` use it, and both
 * run on the server.
 */
export const IS_PREVIEW = process.env.VERCEL_ENV === "preview";

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
 * Every way the brand gets typed.
 *
 * The name is set as "interiOne" but the wordmark reads "interio1", the email
 * is @interio1.com and the Instagram handle is @interio.1 — so a person who
 * has seen the brand anywhere will search at least four different strings for
 * it. These go into `alternateName` on the Organization and the WebSite,
 * which is how you tell Google that all of them are one entity instead of
 * hoping it works that out from a fuzzy match.
 */
export const BRAND_VARIANTS = [
  "interiOne",
  "Interione",
  "Interi One",
  "interio1",
  "Interio 1",
  "interio.1",
  "interiOne Hyderabad",
  "interiOne Modular Kitchens",
] as const;

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
