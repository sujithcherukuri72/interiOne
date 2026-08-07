import type { Metadata, Viewport } from "next";
import { Archivo, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import ClickSpark from "@/components/ui/ClickSpark";
import { SITE, SITE_URL, STUDIO } from "@/lib/site";
import { buildGraph } from "@/lib/structured-data";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** The identity face — logo lockup and the footer wordmark are set in it. */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Legal line and utility links, the way the identity sheet sets them. */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  // Every relative URL below — canonical, OG image, icons — resolves against
  // this. Without it Next emits paths, and paths are not valid in an OG tag.
  metadataBase: new URL(SITE_URL),

  title: { default: SITE.title, template: SITE.titleTemplate },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName, url: SITE_URL }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: "Home & Garden",

  // Carries no ranking weight at Google, but Bing and several Indian
  // directories still read it, and the list costs nothing to keep accurate.
  keywords: [
    "modular kitchen Hyderabad",
    "modular kitchens in Hyderabad",
    "steel modular kitchen Hyderabad",
    "termite proof kitchen Hyderabad",
    "kitchen interior designers Jubilee Hills",
    "modular kitchen Banjara Hills",
    "modular kitchen Gachibowli",
    "modular kitchen Kondapur",
    "modular kitchen price in Hyderabad",
    "JSW Xteel kitchen",
    "Modula modular kitchen",
    "plywood free kitchen Hyderabad",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE_URL,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.shareDescription,
    // `app/opengraph-image.tsx` renders the card; Next wires it up here.
  },

  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.shareDescription,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Phone numbers are already marked up as `tel:` links; leaving Safari's
  // auto-detection on top of that restyles them into blue system links.
  formatDetection: { telephone: false, address: false },

  other: {
    // The classic geo trio. Not used by Google, but Bing Places and a number
    // of the Indian aggregators that scrape this space still parse them, and
    // this is a local-intent site above all else.
    "geo.region": STUDIO.regionCode,
    "geo.placename": STUDIO.locality,
    "geo.position": `${STUDIO.latitude};${STUDIO.longitude}`,
    ICBM: `${STUDIO.latitude}, ${STUDIO.longitude}`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // The page has no fixed bottom bar, so letting it run under the notch on
  // iOS is free full-bleed.
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#f5f0eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      // en-IN, not en: the copy is priced in rupees and written for Hyderabad,
      // and the region subtag is one of the signals that says so.
      lang="en-IN"
      className={`${archivo.variable} ${cormorant.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* One graph for the whole operation — see lib/structured-data.ts. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildGraph()) }}
        />

        <SmoothScrollProvider>
          <ClickSpark sparkColor="#ff4d6a" className="flex flex-1 flex-col">
            {children}
          </ClickSpark>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
