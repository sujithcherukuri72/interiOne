"use client";

import Image from "next/image";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const BRAND_LOGOS = [
  { src: "/logos/blum.png",       alt: "Blum",       width: 90,  height: 40 },
  { src: "/logos/hettich.jpg",    alt: "Hettich",    width: 110, height: 40 },
  { src: "/logos/smeg.png",       alt: "Smeg",        width: 80,  height: 40 },
  { src: "/logos/electrolux.jpg", alt: "Electrolux", width: 120, height: 40 },
  { src: "/logos/nirali.png",     alt: "Nirali",     width: 100, height: 40 },
  { src: "/logos/jsw.png",        alt: "JSW",        width: 80,  height: 40 },
];

export function SponsorsCarousel() {
  return (
    <section
      className="relative py-12 border-t border-b overflow-hidden"
      style={{
        backgroundColor: "var(--obsidian)",
        borderColor: "rgba(200,165,90,0.12)",
      }}
    >
      {/* Label */}
      <p
        className="text-center text-[10px] font-semibold tracking-[0.28em] uppercase mb-8"
        style={{ color: "rgba(200,165,90,0.5)" }}
      >
        Our Brand Partners
      </p>

      {/* Slider */}
      <div className="relative">
        <InfiniteSlider gap={64} duration={30} durationOnHover={60}>
          {BRAND_LOGOS.map((logo) => (
            <div
              key={logo.alt}
              className="relative flex items-center justify-center"
              style={{ width: logo.width, height: logo.height }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                sizes={`${logo.width}px`}
                className="object-contain select-none"
                style={{ filter: "brightness(0) invert(1)", opacity: 0.45 }}
              />
            </div>
          ))}
        </InfiniteSlider>

        {/* Edge fades */}
        <ProgressiveBlur
          blurIntensity={0.8}
          className="pointer-events-none absolute top-0 left-0 h-full w-40"
          direction="left"
          style={{ background: "linear-gradient(to right, var(--obsidian), transparent)" }}
        />
        <ProgressiveBlur
          blurIntensity={0.8}
          className="pointer-events-none absolute top-0 right-0 h-full w-40"
          direction="right"
          style={{ background: "linear-gradient(to left, var(--obsidian), transparent)" }}
        />
      </div>
    </section>
  );
}
