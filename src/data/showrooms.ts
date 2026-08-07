import { BRAND } from "@/data/brand";

/**
 * The showroom network — one studio, deliberately.
 *
 * This used to list seven cities. Only Jubilee Hills exists as a place a
 * visitor can walk into, and the JSON-LD graph has always said so, so the page
 * now says the same thing. Phone and address come from `BRAND` rather than
 * being restated here: a number that differs between the footer, this card and
 * the structured data is the classic reason a Business Profile and a site fail
 * to be matched to each other.
 */
export const SHOWROOM = {
  id: "hyderabad",
  city: "Hyderabad",
  name: "Jubilee Hills Studio",
  state: "Telangana",
  address: "Road No. 36, Jubilee Hills",
  phone: BRAND.phone,
  phoneHref: BRAND.phoneHref,
  hours: "Mon–Sun · 10:00–20:00",
  flagship: true,
} as const;
