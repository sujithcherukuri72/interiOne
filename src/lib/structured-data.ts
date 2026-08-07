import { BRAND } from "@/data/brand";
import { FAQS } from "@/data/faqs";
import { XTEEL_FEATURES } from "@/data/technology";
import { HYDERABAD_AREAS, SITE, SITE_URL, STUDIO } from "@/lib/site";

/**
 * The JSON-LD graph for the site.
 *
 * One `@graph` rather than several separate script tags: the nodes reference
 * each other by `@id`, and a single graph is how you say "this business, this
 * website and this page are the same operation" instead of leaving a parser to
 * guess. Everything here restates something a visitor can also read on the
 * page — markup describing things the page does not show is the fastest way to
 * lose the rich result entirely.
 *
 * Scope is Hyderabad only, which is now also all the page claims: the Madhapur
 * studio is the one entity with a verified address, a phone number that is
 * answered and a Business Profile to match against, so it is the only thing
 * here claiming to be a `LocalBusiness`.
 */

const ORG_ID = `${SITE_URL}/#organization`;
const STUDIO_ID = `${SITE_URL}/#studio`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PAGE_ID = `${SITE_URL}/#webpage`;

/** The address block, reused by every node that needs one. */
const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: STUDIO.streetAddress,
  addressLocality: STUDIO.locality,
  addressRegion: STUDIO.region,
  postalCode: STUDIO.postalCode,
  addressCountry: STUDIO.country,
};

/** Hyderabad plus the suburbs the studio actually travels to for a survey. */
const areaServed = [
  {
    "@type": "City",
    name: "Hyderabad",
    "@id": "https://www.wikidata.org/wiki/Q1361",
  },
  ...HYDERABAD_AREAS.map((area) => ({
    "@type": "Place",
    name: `${area}, Hyderabad`,
  })),
];

export function buildGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE.name,
        legalName: SITE.legalName,
        url: SITE_URL,
        email: STUDIO.email,
        telephone: STUDIO.phone,
        address: postalAddress,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/icon.svg`,
          caption: `${SITE.name} logo`,
        },
        // The manufacturing partnership is a real trust signal and is stated
        // on the page, so it belongs in the graph too.
        parentOrganization: {
          "@type": "Organization",
          name: `${BRAND.partner} — ${BRAND.partnerParent}`,
        },
        // Add the Google Business Profile and Justdial URLs here as they go
        // live. `sameAs` is the strongest single link between this markup
        // and the Maps listing, and an empty array is worth nothing.
        sameAs: [BRAND.instagramHref],
      },

      {
        "@type": ["HomeAndConstructionBusiness", "FurnitureStore"],
        "@id": STUDIO_ID,
        name: `${SITE.name} — Madhapur Studio`,
        description:
          "Modular kitchen studio in Madhapur, Hyderabad. Steel-composite kitchens built on JSW Xteel®, with free site measurement and three costed designs.",
        url: SITE_URL,
        parentOrganization: { "@id": ORG_ID },
        telephone: STUDIO.phone,
        email: STUDIO.email,
        address: postalAddress,
        geo: {
          "@type": "GeoCoordinates",
          latitude: STUDIO.latitude,
          longitude: STUDIO.longitude,
        },
        // The survey radius the studio will actually drive, in metres — a
        // claim it can keep, which is the only kind worth making.
        areaServed,
        serviceArea: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: STUDIO.latitude,
            longitude: STUDIO.longitude,
          },
          geoRadius: 40000,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: STUDIO.opens,
            closes: STUDIO.closes,
          },
        ],
        currenciesAccepted: "INR",
        priceRange: "₹₹₹",
        image: `${SITE_URL}/opengraph-image`,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Modular kitchen services in Hyderabad",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Modular kitchen design and installation",
                serviceType: "Modular kitchen",
                areaServed,
                provider: { "@id": STUDIO_ID },
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Site measurement and three costed kitchen designs",
                serviceType: "Interior design consultation",
                areaServed,
                provider: { "@id": STUDIO_ID },
              },
            },
          ],
        },
        makesOffer: {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "JSW Xteel® steel-composite kitchen",
            category: "Modular kitchen",
            material: "Steel composite",
            brand: { "@type": "Brand", name: BRAND.partner },
            // Straight off the technology section — every one of these is a
            // claim the page makes in words a visitor can read.
            additionalProperty: XTEEL_FEATURES.map((feature) => ({
              "@type": "PropertyValue",
              name: feature.title,
              value: feature.claim,
            })),
          },
          priceCurrency: "INR",
          priceSpecification: {
            "@type": "PriceSpecification",
            // The spread the FAQ quotes, per kitchen. Stated as a range
            // because a single `price` here would read as a fixed one.
            minPrice: 350000,
            maxPrice: 900000,
            priceCurrency: "INR",
          },
          availableAtOrFrom: { "@id": STUDIO_ID },
        },
      },

      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE.name,
        description: SITE.description,
        publisher: { "@id": ORG_ID },
        inLanguage: "en-IN",
      },

      {
        "@type": "WebPage",
        "@id": PAGE_ID,
        url: `${SITE_URL}/`,
        name: SITE.title,
        description: SITE.description,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": STUDIO_ID },
        inLanguage: "en-IN",
        primaryImageOfPage: `${SITE_URL}/opengraph-image`,
      },

      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}
