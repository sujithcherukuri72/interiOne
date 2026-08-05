import type { Metadata } from "next";
import { Archivo, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import ClickSpark from "@/components/ui/ClickSpark";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/** The identity face — logo lockup and the footer wordmark are set in it. */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

/** Legal line and utility links, the way the identity sheet sets them. */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "interiOne — Modular Kitchens in Hyderabad | Modula by JSW",
  description:
    "Steel-composite modular kitchens by interiOne with Modula, a JSW enterprise. Termite proof, fire safe, zero plywood. Installed in 30 days across 7 cities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${cormorant.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScrollProvider>
          <ClickSpark sparkColor="#ff4d6a" className="flex flex-1 flex-col">
            {children}
          </ClickSpark>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
