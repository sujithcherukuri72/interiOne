import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Wide open, with one exception.
 *
 * `/_next/` holds hashed build output; it is fetched by the renderer either
 * way, and letting it into the index only produces junk results. Everything
 * else on a one-page marketing site should be crawlable, including the images.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/static/chunks/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
