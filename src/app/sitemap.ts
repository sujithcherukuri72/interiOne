import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * One page, one entry.
 *
 * The sections are fragments of the same document, not separate URLs, so
 * listing them here would be listing the same page twenty times. When the
 * locality landing pages ship (`/modular-kitchens-gachibowli` and friends),
 * they get their own entries — and their own copy, since a sitemap entry for a
 * page that only differs by a place name is worth nothing.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
