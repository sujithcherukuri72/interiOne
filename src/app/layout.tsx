import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import ClickSpark from "@/components/ui/ClickSpark";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
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
