"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";

import { SHOWROOM } from "@/data/showrooms";
import { DIRECTIONS_URL } from "@/lib/map";
import { EASE } from "@/lib/motion";
import { HYDERABAD_AREAS } from "@/lib/site";
import StudioMap from "@/components/ui/StudioMap";

export default function Showrooms() {
  return (
    <section id="showrooms" className="bg-surface py-[clamp(3.5rem,9vh,7.5rem)]">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="text-[10px] font-medium tracking-[0.28em] text-foreground/45 uppercase">
            Showroom
          </p>
          {/* One studio, said plainly. The old line claimed seven cities; the
              structured data only ever claimed this one, and the page and the
              markup have to agree. */}
          <h2 className="mt-8 max-w-[36ch] text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.2] font-medium tracking-[-0.03em] text-balance">
            One studio. Jubilee Hills, Hyderabad.
          </h2>
          <p className="mt-4 max-w-[46ch] text-[14px] leading-[1.6] tracking-[-0.01em] text-foreground/60">
            Put your hand on the finish first. Then book a designer to your
            site.
          </p>
        </motion.div>

        {/* The map, with the address card floating over it once there is room
            for one — below it on a phone, where there is not. */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative mt-[clamp(2.25rem,5.5vh,4.5rem)]"
        >
          <StudioMap className="h-[clamp(320px,58vh,600px)] w-full rounded-2xl" />

          <div className="relative mt-4 rounded-2xl border border-foreground/10 bg-background p-6 sm:p-7 lg:absolute lg:bottom-8 lg:left-8 lg:mt-0 lg:w-[23rem] lg:shadow-[0_24px_60px_-32px_rgba(0,0,0,0.45)]">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[19px] font-medium tracking-[-0.02em]">
                {SHOWROOM.name}
              </h3>
              {SHOWROOM.flagship && (
                <span className="text-[10px] font-medium tracking-[0.22em] text-coral uppercase">
                  Flagship
                </span>
              )}
            </div>

            <p className="mt-3 flex items-start gap-2 text-[13.5px] leading-[1.5] text-foreground/65">
              <MapPin size={13} strokeWidth={1.75} className="mt-0.5 shrink-0" />
              {SHOWROOM.address}, {SHOWROOM.city}, {SHOWROOM.state}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12.5px] text-foreground/50">
              <span className="flex items-center gap-1.5">
                <Clock size={12} strokeWidth={1.75} />
                {SHOWROOM.hours}
              </span>
              <a
                href={SHOWROOM.phoneHref}
                className="focus-ring flex items-center gap-1.5 rounded transition-colors duration-300 hover:text-foreground"
              >
                <Phone size={12} strokeWidth={1.75} />
                {SHOWROOM.phone}
              </a>
            </div>

            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-[13px] tracking-[-0.005em] transition-colors duration-300 hover:border-foreground/50 hover:bg-foreground hover:text-background"
            >
              Get directions
              <ArrowUpRight size={14} strokeWidth={1.75} />
            </a>
          </div>
        </motion.div>

        {/* Where a designer will actually drive for a survey.
            This is the same list the LocalBusiness `areaServed` block claims —
            an area asserted in markup but named nowhere a visitor can read it
            is a thin signal, and these are the words people search with. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-[clamp(2.5rem,6.5vh,5.5rem)] border-t border-foreground/15 pt-8"
        >
          <h3 className="font-mono text-[10px] tracking-[0.24em] text-foreground/45 uppercase">
            Hyderabad — where we survey
          </h3>

          <p className="mt-5 max-w-[62ch] text-[14px] leading-[1.65] tracking-[-0.01em] text-foreground/70">
            The Jubilee Hills studio covers the whole city. A designer measures
            on site anywhere inside the Outer Ring Road at no charge, and three
            costed plans follow within a day.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2">
            {HYDERABAD_AREAS.map((area) => (
              <li
                key={area}
                className="rounded-full border border-line px-3 py-1.5 text-[12.5px] tracking-[-0.005em] text-foreground/60"
              >
                {area}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
